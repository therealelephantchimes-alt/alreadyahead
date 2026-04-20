import { NextResponse } from "next/server";
import { stripe, priceIdForTier } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/upgrade — returns proration preview info for Tier 1 -> Tier 2 upgrade
 */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const sub = subs?.[0];
  if (!sub || sub.tier !== "tier_1" || !["active", "trialing"].includes(sub.status)) {
    return NextResponse.json(
      { error: "No eligible Tier 1 subscription to upgrade." },
      { status: 400 },
    );
  }

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const itemId = stripeSub.items.data[0].id;

    // Get proration preview
    const invoice = await stripe.invoices.createPreview({
      customer: sub.stripe_customer_id,
      subscription: sub.stripe_subscription_id,
      subscription_details: {
        items: [{ id: itemId, price: priceIdForTier("tier_2") }],
        proration_behavior: "always_invoice",
      },
    });

    return NextResponse.json({
      amountDueToday: invoice.amount_due, // in cents
      currency: invoice.currency,
      nextBillingDate: stripeSub.current_period_end,
    });
  } catch (err: any) {
    console.error("upgrade preview error", err);
    return NextResponse.json(
      { error: err?.message || "Could not preview upgrade." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/upgrade — performs the Tier 1 -> Tier 2 upgrade
 */
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const sub = subs?.[0];
  if (!sub || sub.tier !== "tier_1" || !["active", "trialing"].includes(sub.status)) {
    return NextResponse.json(
      { error: "No eligible Tier 1 subscription to upgrade." },
      { status: 400 },
    );
  }

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const itemId = stripeSub.items.data[0].id;

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: itemId, price: priceIdForTier("tier_2") }],
      proration_behavior: "always_invoice",
    });

    // The webhook will update our DB with the new tier.
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("upgrade error", err);
    return NextResponse.json(
      { error: err?.message || "Could not upgrade subscription." },
      { status: 500 },
    );
  }
}