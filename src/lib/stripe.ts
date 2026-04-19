import Stripe from "stripe";
import type { Tier } from "./types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
  typescript: true,
});

export function priceIdForTier(tier: Tier): string {
  const id = tier === "tier_1" ? process.env.STRIPE_PRICE_TIER_1 : process.env.STRIPE_PRICE_TIER_2;
  if (!id) throw new Error(`Missing Stripe price env var for ${tier}`);
  return id;
}

export function tierForPriceId(priceId: string): Tier | null {
  if (priceId === process.env.STRIPE_PRICE_TIER_1) return "tier_1";
  if (priceId === process.env.STRIPE_PRICE_TIER_2) return "tier_2";
  return null;
}
