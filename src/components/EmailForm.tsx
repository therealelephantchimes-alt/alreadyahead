"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { posthog } from "./PostHogProvider";

interface EmailFormProps {
  source?: string;
  placeholder?: string;
  buttonLabel?: string;
  microText?: string;
  redirectTo?: string;
}

export function EmailForm({
  source = "homepage",
  placeholder = "Enter your email",
  buttonLabel = "Subscribe",
  microText = "No spam. Leave anytime.",
  redirectTo = "/thank-you",
}: EmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }

    setState("loading");
    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }
      try {
        posthog?.capture?.("email_captured", { source });
      } catch {}
      router.push(redirectTo);
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  const loading = state === "loading";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
        <label htmlFor={`email-${source}`} className="sr-only">Email</label>
        <input
          id={`email-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          required
          className="input-editorial flex-1"
          aria-invalid={!!error}
          aria-describedby={error ? `email-error-${source}` : undefined}
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 border border-paper/70 border-t-transparent rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            buttonLabel
          )}
        </button>
      </div>
      {error && (
        <p id={`email-error-${source}`} role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
      {microText && !error && (
        <p className="mt-3 text-xs text-muted">{microText}</p>
      )}
    </form>
  );
}
