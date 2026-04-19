"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }

    setState("loading");
    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const next = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard";

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (authError) {
      setState("error");
      setError(authError.message || "Could not send magic link.");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="border border-ink bg-accent-soft p-6">
        <p className="font-display text-xl font-medium mb-2">Check your email.</p>
        <p className="text-ink/80 leading-relaxed">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in. The link expires
          in one hour.
        </p>
        <button
          onClick={() => {
            setState("idle");
            setEmail("");
          }}
          className="btn-ghost mt-4 text-sm !px-0"
        >
          Use a different email →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={state === "loading"}
          required
          className="input-editorial"
          aria-invalid={!!error}
        />
      </div>
      <button type="submit" disabled={state === "loading"} className="btn-primary w-full sm:w-auto">
        {state === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 border border-paper/70 border-t-transparent rounded-full animate-spin" />
            Sending…
          </span>
        ) : (
          "Send magic link"
        )}
      </button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
