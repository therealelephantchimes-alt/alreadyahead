import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { PromptCard } from "@/components/PromptCard";
import { PROMPTS } from "../../../../content/seed/prompts";
import { hasAccess } from "@/lib/types";

export const metadata: Metadata = {
  title: "Prompts — Dashboard",
  robots: { index: false, follow: false },
};

export default async function PromptsPage() {
  const ctx = (await getCurrentUser())!;

  const accessible = PROMPTS.filter((p) => hasAccess(ctx.activeTier, p.tier));
  const locked = PROMPTS.filter((p) => !hasAccess(ctx.activeTier, p.tier));

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Prompt systems
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          Structured prompts you can copy and adapt.
        </h1>
        <p className="mt-4 text-ink/80 max-w-prose leading-relaxed">
          Each one is a tested template. Copy it, fill in the bracketed fields with your context,
          and send. All of them assume you're the one in charge — they do not replace your
          judgment, they structure it.
        </p>
      </header>

      {!ctx.activeTier && (
        <div className="mb-8 border border-ink bg-accent-soft p-5 max-w-prose">
          <p className="font-medium mb-1">You need an active subscription to use prompts.</p>
          <Link href="/pricing" className="btn-primary text-sm !py-2 mt-3">
            See pricing →
          </Link>
        </div>
      )}

      {ctx.activeTier && accessible.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessible.map((p) => (
            <PromptCard key={p.slug} prompt={p} />
          ))}
        </div>
      )}

      {ctx.activeTier === "tier_1" && locked.length > 0 && (
        <section className="mt-14 pt-10 border-t border-rule">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Advanced prompts
          </p>
          <div className="border border-ink bg-accent-soft p-6 max-w-prose">
            <p className="font-medium mb-2">{locked.length} advanced prompt systems are in System+.</p>
            <p className="text-sm text-ink/80 mb-4">
              These are the prompts that combine critique, revision, and multi-role chaining in
              a single spec.
            </p>
            <Link href="/pricing" className="btn-primary text-sm !py-2">
              Upgrade to System+ →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
