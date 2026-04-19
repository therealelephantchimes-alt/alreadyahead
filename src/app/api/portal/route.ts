import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const customerId = subs?.[0]?.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json(
      { error: "No subscription found for your account." },
      { status: 404 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err: any) {
    console.error("portal error", err);
    return NextResponse.json(
      { error: err?.message || "Could not open portal." },
      { status: 500 },
    );
  }
}
