import type { Metadata } from "next";
import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";
import { getCurrentUser } from "@/lib/auth";
import { PricingViewTracker } from "./tracker";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Stop guessing. Start building systems. The Already Ahead System — $19.99/month. System+ — $29.99/month.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const ctx = await getCurrentUser();
  const currentTier = ctx?.activeTier ?? null;
  const hasActiveSub = !!currentTier;

  return (
    <>
      <PricingViewTracker />

      <section className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-8 md:pb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Pricing
          </p>
          <h1 className="font-display text-display-xl font-medium tracking-tight max-w-3xl">
            Stop guessing.
            <br />
            <span className="italic font-light text-accent">Start building systems.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink/80 max-w-2xl leading-relaxed">
            Most people use AI casually. The result is inconsistent output and wasted time. The
            Already Ahead System is designed to fix that.
          </p>
          <p className="mt-5 text-sm text-muted italic">
            Less than the cost of one hour of consulting. Updated monthly.
          </p>
        </div>
      </section>

      {/* TIER CARDS */}
      <section>
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl">
            <PricingCard
              tier="tier_1"
              name="Already Ahead System"
              price={19.99}
              currentTier={currentTier}
              hasActiveSub={hasActiveSub}
              showUpgradeToggle={!hasActiveSub}
              features={[
                "Both books (PDF download) — full text, not excerpts",
                "Core prompt systems (10+ structured frameworks)",
                "Foundational workflows you can reuse immediately",
                "Member dashboard",
              ]}
            />
            <PricingCard
              tier="tier_2"
              name="Already Ahead System+"
              price={29.99}
              recommended
              currentTier={currentTier}
              hasActiveSub={hasActiveSub}
              features={[
                "Everything in the System",
                "Full case studies with exact inputs and outputs",
                "Advanced prompt systems used in real scenarios",
                "Monthly additions with new workflows",
              ]}
            />
          </div>

          <p className="mt-8 text-sm text-muted">
            Cancel anytime. No long-term commitment.
          </p>

          {!ctx && (
            <p className="mt-3 text-sm text-muted">
              Already subscribed?{" "}
              <Link href="/login" className="link-underline">
                Sign in →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF repeat */}
      <section className="border-t border-rule bg-card/40">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-10">
            What this system produces
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                stat: "3h → 40m",
                p: "Turn three hours of work into forty minutes with structured prompts.",
              },
              {
                stat: "First drafts",
                p: "Generate high-quality first drafts that require minimal editing.",
              },
              {
                stat: "Repeatable",
                p: "Build workflows you reuse instead of starting from scratch each time.",
              },
            ].map((it) => (
              <div key={it.stat} className="border-t border-ink pt-5">
                <p className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-3">
                  {it.stat}
                </p>
                <p className="text-ink/80 leading-relaxed">{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}