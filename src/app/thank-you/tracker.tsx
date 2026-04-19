"use client";

import { useEffect } from "react";
import { posthog } from "@/components/PostHogProvider";

export function ThankYouTracker() {
  useEffect(() => {
    try {
      posthog?.capture?.("thank_you_viewed");
    } catch {}
  }, []);
  return null;
}
