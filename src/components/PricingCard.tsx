"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Tier } from "@/lib/types";
import { posthog } from "./PostHogProvider";

interface PricingCardProps {
  tier: Tier;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  currentTier?: Tier | null;
  hasActiveSub?: boolean;
  showUpgradeToggle?: boolean;
}

export function PricingCard({
  tier,
  name,
  price,
  features,
  recommended,
  currentTier,
  hasActiveSub,
  showUpgradeToggle = false,
}: PricingCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [upgradeSelected, setUpgradeSelected] = useState(false);

  const isCurrent = hasActiveSub && currentTier === tier;
  const canUpgradeHere = hasActiveSub && currentTier === "tier_1" && tier === "tier_2";

  const effectiveTier: Tier = showUpgradeToggle && upgradeSelected ? "tier_2" : tier;

  async function onCheckout() {
    setError(null);
    try {
      posthog?.capture?.("tier_selected", { tier: effectiveTier });
      posthog?.capture?.("checkout_started", { tier: effectiveTier });
    } catch {}

    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: effectiveTier }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || "Could not start checkout. Please try again.");
          return;
        }
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("Could not start checkout. Please try again.");
        }
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  async function onManage() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/portal", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || "Could not open the customer portal.");
          return;
        }
        if (data.url) window.location.href = data.url;
      } catch {
        setError("Network error.");
      }
    });
  }

  return (
    <div
      className={`relative border ${
        recommended ? "border-ink" : "border-rule"
      } bg-paper p-7 md:p-8 flex flex-col`}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 bg-ink text-paper text-[10px] tracking-[0.15em] uppercase px-2 py-1">
          Recommended
        </span>
      )}

      <h3 className="font-display text-2xl md:text-[1.75rem] font-medium tracking-tight">{name}</h3>

      <div className="mt-4 mb-6 flex items-baseline gap-1">
        <span className="font-display text-5xl font-medium">
          ${upgradeSelected && showUpgradeToggle ? "29.99" : price.toFixed(2)}
        </span>
        <span className="text-muted text-sm">/ month</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-sm leading-relaxed">
            <span className="text-accent shrink-0 mt-0.5" aria-hidden>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Inline Tier 1 -> Tier 2 upgrade toggle (signed-out flow only) */}
      {showUpgradeToggle && tier === "tier_1" && !hasActiveSub && (
        <label className="flex items-start gap-3 border-t border-rule pt-4 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={upgradeSelected}
            onChange={(e) => setUpgradeSelected(e.target.checked)}
            className="mt-1 accent-accent"
          />
          <span className="text-sm leading-relaxed">
            <span className="font-medium">Upgrade to System+ for $10 more.</span>
            <span className="text-muted block">
              Adds full case studies, advanced prompt systems, and monthly additions.
            </span>
          </span>
        </label>
      )}

      {/* CTAs */}
      <div className="mt-auto">
        {isCurrent ? (
          <>
            <button disabled className="btn-primary w-full opacity-60 cursor-not-allowed">
              Current plan
            </button>
            <button
              onClick={onManage}
              disabled={isPending}
              className="btn-ghost w-full mt-2 text-sm"
            >
              {isPending ? "Opening…" : "Manage subscription →"}
            </button>
          </>
        ) : canUpgradeHere ? (
          <Link href="/dashboard/upgrade" className="btn-primary w-full text-center">
            Upgrade to System+
          </Link>
        ) : hasActiveSub && currentTier === "tier_2" && tier === "tier_1" ? (
          <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
            Included in your plan
          </button>
        ) : (
          <button
            onClick={onCheckout}
            disabled={isPending}
            className={recommended ? "btn-primary w-full" : "btn-secondary w-full"}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Redirecting…
              </span>
            ) : upgradeSelected && showUpgradeToggle ? (
              "Get System+"
            ) : (
              "Get access"
            )}
          </button>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}