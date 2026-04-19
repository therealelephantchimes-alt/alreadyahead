import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { WorkflowCard } from "@/components/WorkflowCard";
import { WORKFLOWS } from "../../../../content/seed/workflows";
import { hasAccess } from "@/lib/types";

export const metadata: Metadata = {
  title: "Workflows — Dashboard",
  robots: { index: false, follow: false },
};

export default async function WorkflowsPage() {
  const ctx = (await getCurrentUser())!;
  const accessible = WORKFLOWS.filter((w) => hasAccess(ctx.activeTier, w.tier));

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Workflows
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          Systems, not one-shots.
        </h1>
        <p className="mt-4 text-ink/80 max-w-prose leading-relaxed">
          Each workflow is a sequence of steps you run in order. They're designed to be repeatable
          — same inputs, same quality, every time.
        </p>
      </header>

      {!ctx.activeTier ? (
        <div className="border border-ink bg-accent-soft p-5 max-w-prose">
          <p className="font-medium mb-1">You need an active subscription to use workflows.</p>
          <Link href="/pricing" className="btn-primary text-sm !py-2 mt-3">
            See pricing →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {accessible.map((w) => (
            <WorkflowCard key={w.slug} workflow={w} />
          ))}
        </div>
      )}
    </div>
  );
}
