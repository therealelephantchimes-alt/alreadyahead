import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UpgradeConfirm } from "./UpgradeConfirm";

export const metadata: Metadata = {
  title: "Upgrade to System+",
  robots: { index: false, follow: false },
};

export default async function UpgradePage() {
  const ctx = await getCurrentUser();
  if (!ctx) redirect("/login?redirect=/dashboard/upgrade");

  // Only Tier 1 active subscribers can land here
  if (!ctx.activeTier) {
    redirect("/pricing");
  }
  if (ctx.activeTier === "tier_2") {
    redirect("/dashboard");
  }

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Upgrade
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          Move to Already Ahead System+
        </h1>
        <p className="mt-4 text-ink/80 max-w-prose leading-relaxed">
          System+ adds full case studies with exact inputs and outputs, advanced prompt systems
          used in real scenarios, and new workflows added every month. Your plan switches
          immediately.
        </p>
      </header>

      <UpgradeConfirm />

      <p className="mt-10 text-sm text-muted">
        Changed your mind?{" "}
        <Link href="/dashboard" className="link-underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}