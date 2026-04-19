import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { CASE_STUDIES } from "../../../../content/seed/case-studies";
import { hasAccess } from "@/lib/types";

export const metadata: Metadata = {
  title: "Case studies — Dashboard",
  robots: { index: false, follow: false },
};

export default async function CaseStudiesPage() {
  const ctx = (await getCurrentUser())!;

  // Gating: Tier 1 users see the upgrade prompt, not a blank page or an error.
  const canAccess = ctx.activeTier === "tier_2";

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Case studies
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          The system, running on real problems.
        </h1>
        <p className="mt-4 text-ink/80 max-w-prose leading-relaxed">
          Exact inputs. Exact outputs. The critique passes. The revision decisions. This is what
          the system looks like when a real person uses it.
        </p>
      </header>

      {!canAccess && (
        <UpgradePrompt
          title="Case studies are in System+"
          body="Case studies include the exact prompts, outputs, and the critique passes that produced them. They're the most direct way to see the system working on real problems. System+ adds full access — upgrade any time, your current plan is credited."
        />
      )}

      {canAccess && (
        <div className="space-y-10">
          {CASE_STUDIES.filter((c) => hasAccess(ctx.activeTier, c.tier)).map((c) => (
            <article key={c.slug} className="border border-rule bg-paper p-6 md:p-8">
              <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-5">
                {c.title}
              </h2>

              <div className="space-y-8">
                <Section label="Context" body={c.context} />
                <Section label="Input" body={c.input} mono />
                <Section label="Output" body={c.output} />
                <div className="border-l-2 border-accent pl-5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium mb-2">
                    Takeaway
                  </p>
                  <p className="font-display italic text-lg text-ink/90 leading-relaxed">
                    {c.takeaway}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ label, body, mono }: { label: string; body: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-3">
        {label}
      </p>
      <div
        className={
          mono
            ? "font-mono text-[13px] bg-card p-4 rounded-sm whitespace-pre-wrap leading-relaxed"
            : "text-ink/90 leading-relaxed whitespace-pre-line"
        }
      >
        {body}
      </div>
    </div>
  );
}
