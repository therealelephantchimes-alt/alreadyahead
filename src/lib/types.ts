export type Tier = "tier_1" | "tier_2";
export type TierRequired = "free" | Tier;

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  email_verified: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: Tier;
  status: string;
  current_period_end: string | null;
}

export interface Prompt {
  slug: string;
  title: string;
  description: string;
  tier: TierRequired;
  body: string;
}

export interface WorkflowStep {
  heading: string;
  detail: string;
}

export interface Workflow {
  slug: string;
  title: string;
  description: string;
  tier: TierRequired;
  steps: WorkflowStep[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  context: string;
  input: string;
  output: string;
  takeaway: string;
  tier: TierRequired;
}

export const TIER_LABELS: Record<Tier, string> = {
  tier_1: "Already Ahead System",
  tier_2: "Already Ahead System+",
};

export const TIER_PRICES: Record<Tier, number> = {
  tier_1: 19.99,
  tier_2: 29.99,
};

export function hasAccess(userTier: Tier | null, required: TierRequired): boolean {
  if (required === "free") return true;
  if (!userTier) return false;
  if (required === "tier_1") return userTier === "tier_1" || userTier === "tier_2";
  if (required === "tier_2") return userTier === "tier_2";
  return false;
}

export function isActive(status: string | undefined | null): boolean {
  if (!status) return false;
  return status === "active" || status === "trialing";
}
