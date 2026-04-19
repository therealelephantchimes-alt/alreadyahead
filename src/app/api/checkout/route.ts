import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, priceIdForTier } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  tier: z.enum(["tier_1", "tier_2"]),
});

export async function POST(request: NextRequest) {
  let payload;
  try {
    payload = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { tier } = payload;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If the user is signed in and already has an active subscription, prefer the portal flow
    // (upgrades/downgrades go through the portal, not checkout).
    if (user) {
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id, tier, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const active = existing?.[0];
      if (active && ["active", "trialing", "past_due"].includes(active.status)) {
        // Route to portal for plan changes
        const portal = await stripe.billingPortal.sessions.create({
          customer: active.stripe_customer_id,
          return_url: `${siteUrl}/dashboard`,
        });
        return NextResponse.json({ url: portal.url });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceIdForTier(tier), quantity: 1 }],
      customer_email: user?.email,
      client_reference_id: user?.id,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        metadata: {
          tier,
          supabase_user_id: user?.id || "",
        },
      },
      metadata: {
        tier,
        supabase_user_id: user?.id || "",
      },
      success_url: `${siteUrl}/dashboard?welcome=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("checkout error", err);
    return NextResponse.json(
      { error: err?.message || "Could not start checkout." },
      { status: 500 },
    );
  }
}
