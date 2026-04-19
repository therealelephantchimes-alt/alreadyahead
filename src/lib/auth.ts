import { createClient } from "./supabase/server";
import type { Subscription, Tier } from "./types";
import { isActive } from "./types";

export interface CurrentUserContext {
  userId: string;
  email: string;
  subscription: Subscription | null;
  activeTier: Tier | null;
}

/**
 * Returns the signed-in user and their active subscription tier (if any).
 * Returns null when not signed in.
 */
export async function getCurrentUser(): Promise<CurrentUserContext | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const subscription = (subs?.[0] as Subscription | undefined) ?? null;
  const activeTier = subscription && isActive(subscription.status) ? subscription.tier : null;

  return {
    userId: user.id,
    email: user.email,
    subscription,
    activeTier,
  };
}
