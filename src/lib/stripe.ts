import Stripe from "stripe";
import { Tier } from "@/lib/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

const PRICE_IDS: Record<Tier, string> = {
  tier_1: process.env.STRIPE_PRICE_TIER_1!,
  tier_2: process.env.STRIPE_PRICE_TIER_2!,
};

export function priceIdForTier(tier: Tier): string {
  const priceId = PRICE_IDS[tier];

  if (!priceId) {
    throw new Error(`Missing Stripe price ID for tier: ${tier}`);
  }

  return priceId;
}

export function tierForPriceId(priceId: string): Tier | null {
  const entry = Object.entries(PRICE_IDS).find(([, id]) => id === priceId);

  if (!entry) return null;

  return entry[0] as Tier;
}