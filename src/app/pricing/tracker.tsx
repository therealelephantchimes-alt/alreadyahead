"use client";

import { useEffect } from "react";
import { posthog } from "@/components/PostHogProvider";

export function PricingViewTracker() {
  useEffect(() => {
    try {
      posthog?.capture?.("pricing_viewed");
    } catch {}
  }, []);
  return null;
}
