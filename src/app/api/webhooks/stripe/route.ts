import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, tierForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { posthogServer } from "@/lib/posthog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, admin);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub, admin);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (subId) {
          await admin
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }
      default:
        // Ignore events we don't handle
        break;
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err?.message || "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  admin: ReturnType<typeof createAdminClient>,
) {
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const email = session.customer_details?.email || session.customer_email;
  const supabaseUserId = session.client_reference_id || session.metadata?.supabase_user_id;

  if (!customerId || !subscriptionId || !email) {
    console.error("checkout.completed missing fields", { customerId, subscriptionId, email });
    return;
  }

  // Find or create a user for this email
  let userId = supabaseUserId || null;
  if (!userId) {
    // Look up in public.users by email
    const { data: existingUser } = await admin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);
    if (existingUser?.[0]) {
      userId = existingUser[0].id;
    } else {
      // Create an auth user so they can sign in via magic link with the same email
      const { data: newAuthUser, error: authCreateError } = await admin.auth.admin.createUser({
        email: email.toLowerCase(),
        email_confirm: true,
      });
      if (authCreateError || !newAuthUser?.user) {
        console.error("Could not create auth user", authCreateError);
        return;
      }
      userId = newAuthUser.user.id;
    }
  }

  // Fetch the full subscription to get the price -> tier mapping
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = sub.items.data[0]?.price?.id;
  const tier = priceId ? tierForPriceId(priceId) : null;
  if (!tier) {
    console.error("Unknown price id on subscription", priceId);
    return;
  }

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      tier,
      status: sub.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // Mark any matching email_capture as converted
  await admin
    .from("email_captures")
    .update({ converted_to_user: true })
    .eq("email", email.toLowerCase());

  // Server-side analytics
  try {
    const ph = posthogServer();
    if (ph) {
      ph.capture({
        distinctId: userId!,
        event: "checkout_completed",
        properties: { tier },
      });
      await ph.shutdown();
    }
  } catch {}
}

async function upsertSubscriptionFromStripe(
  sub: Stripe.Subscription,
  admin: ReturnType<typeof createAdminClient>,
) {
  const priceId = sub.items.data[0]?.price?.id;
  const tier = priceId ? tierForPriceId(priceId) : null;
  if (!tier) return;

  // Find the user_id via existing row (if we've seen this subscription before)
  const { data: existing } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", sub.id)
    .limit(1);

  if (!existing?.[0]) {
    // First time we see this sub — webhook ordering may have put us ahead
    // of checkout.session.completed. Skip for now; the other handler will fill it in.
    return;
  }

  await admin
    .from("subscriptions")
    .update({
      tier,
      status: sub.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}
