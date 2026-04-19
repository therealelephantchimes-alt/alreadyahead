"use client";

import { useState } from "react";
import type { Prompt } from "@/lib/types";

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setError(true);
    }
  }

  return (
    <article className="border border-rule bg-paper p-6 md:p-7 flex flex-col">
      <header className="mb-3">
        <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight">
          {prompt.title}
        </h3>
        <p className="text-sm text-muted mt-1 leading-relaxed">{prompt.description}</p>
      </header>

      <pre className="font-mono text-[13px] bg-card text-ink p-4 rounded-sm whitespace-pre-wrap my-4 leading-relaxed">
        {prompt.body}
      </pre>

      <div className="mt-auto flex items-center justify-between">
        <button onClick={onCopy} className="btn-secondary text-sm !py-2 !px-4">
          {copied ? "Copied ✓" : "Copy prompt"}
        </button>
        {error && <span className="text-xs text-danger">Copy failed</span>}
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
          {prompt.tier === "tier_2" ? "System+" : "System"}
        </span>
      </div>
    </article>
  );
}
