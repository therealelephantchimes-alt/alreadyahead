"use client";

import { useState } from "react";
import type { Workflow } from "@/lib/types";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <article className="border border-rule bg-paper p-6 md:p-8">
      <header className="mb-6">
        <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          {workflow.title}
        </h3>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-prose">
          {workflow.description}
        </p>
      </header>

      <ol className="divide-y divide-rule border-t border-rule">
        {workflow.steps.map((step, i) => {
          const isOpen = openIdx === i;
          return (
            <li key={i}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-start gap-4 py-4 text-left hover:bg-card/50 transition-colors px-2 -mx-2"
                aria-expanded={isOpen}
              >
                <span className="font-display text-accent font-medium shrink-0 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-medium">{step.heading}</span>
                <span className="text-muted shrink-0 mt-1" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="pb-5 pl-10 pr-2 text-[15px] leading-relaxed text-ink/90 whitespace-pre-line">
                  {step.detail}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </article>
  );
}
