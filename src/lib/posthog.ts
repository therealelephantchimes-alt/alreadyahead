import { PostHog } from "posthog-node";

let _server: PostHog | null = null;

export function posthogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  if (!key) return null;
  if (!_server) {
    _server = new PostHog(key, { host, flushAt: 1, flushInterval: 0 });
  }
  return _server;
}

export const ANALYTICS_EVENTS = {
  EMAIL_CAPTURED: "email_captured",
  THANK_YOU_VIEWED: "thank_you_viewed",
  PRICING_VIEWED: "pricing_viewed",
  CHECKOUT_STARTED: "checkout_started",
  CHECKOUT_COMPLETED: "checkout_completed",
  TIER_SELECTED: "tier_selected",
} as const;
