import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { TIER_LABELS } from "@/lib/types";
import { PROMPTS } from "../../../content/seed/prompts";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  const ctx = (await getCurrentUser())!;
  const firstPrompt = PROMPTS[0];

  return (
    <div>
      {searchParams.welcome === "1" && (
        <div className="mb-8 border border-ink bg-accent-soft p-5">
          <p className="font-display text-xl font-medium mb-1">Welcome to the system.</p>
          <p className="text-ink/80 text-sm">
            Your subscription is active. Start with the Critical First Draft prompt below —
            it's the most-used entry point.
          </p>
        </div>
      )}

      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Dashboard
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          Welcome back. Here's what's available.
        </h1>
        {!ctx.activeTier && (
          <div className="mt-6 border border-ink bg-accent-soft p-5 max-w-prose">
            <p className="font-medium mb-2">You don't have an active subscription.</p>
            <p className="text-sm text-ink/80 mb-4">
              Subscribe to unlock the full library of prompts, workflows, and case studies.
            </p>
            <Link href="/pricing" className="btn-primary text-sm !py-2">
              See pricing →
            </Link>
          </div>
        )}
      </header>

      {ctx.activeTier && (
        <section className="border border-ink p-6 md:p-8 mb-10 bg-accent-soft">
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Quick start
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-3">
            Start here → {firstPrompt.title}
          </h2>
          <p className="text-ink/80 leading-relaxed mb-5 max-w-prose">
            {firstPrompt.description}
          </p>
          <Link href="/dashboard/prompts" className="btn-primary">
            Open the prompt →
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard
          href="/dashboard/books"
          title="Books"
          body="Both books as PDF downloads. Already Ahead and The Prompt Is the Product."
          tag="Included in every plan"
        />
        <SectionCard
          href="/dashboard/prompts"
          title="Prompts"
          body={`${PROMPTS.length} structured prompt systems you can copy and adapt. More added monthly.`}
          tag="Included in every plan"
        />
        <SectionCard
          href="/dashboard/workflows"
          title="Workflows"
          body="Multi-step systems for writing, reviewing, and deciding. Each one is a process, not a one-shot."
          tag="Included in every plan"
        />
        <SectionCard
          href="/dashboard/case-studies"
          title="Case studies"
          body="Real scenarios with the exact inputs and outputs. See the system running on real problems."
          tag={ctx.activeTier === "tier_2" ? "System+ only — you have access" : "System+ only"}
          locked={ctx.activeTier !== "tier_2"}
        />
      </section>

      <section className="mt-16 pt-10 border-t border-rule">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
          What's new
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <span className="text-muted mr-3">Feb 2025</span>
            Added the Weekly Review workflow and the Founder Investor Update case study.
          </li>
          <li>
            <span className="text-muted mr-3">Jan 2025</span>
            Launched with three prompt systems, two workflows, and the first case study.
          </li>
        </ul>
      </section>
    </div>
  );
}

function SectionCard({
  href,
  title,
  body,
  tag,
  locked,
}: {
  href: string;
  title: string;
  body: string;
  tag: string;
  locked?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group border border-rule bg-paper p-6 md:p-7 hover:border-ink transition-colors flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h3>
        {locked && (
          <span className="text-[10px] uppercase tracking-[0.12em] bg-ink text-paper px-2 py-0.5">
            Locked
          </span>
        )}
      </div>
      <p className="text-sm text-ink/75 leading-relaxed flex-1">{body}</p>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted mt-4">{tag}</p>
    </Link>
  );
}
