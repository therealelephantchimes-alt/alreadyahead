"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PreviewData {
  amountDueToday: number;
  currency: string;
  nextBillingDate: number;
}

export function UpgradeConfirm() {
  const router = useRouter();
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/upgrade");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(data?.error || "Could not load upgrade details.");
        } else {
          setPreview(data);
        }
      } catch {
        if (!cancelled) setLoadError("Network error. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onConfirm() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/upgrade", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error || "Could not complete upgrade.");
        setSubmitting(false);
        return;
      }
      // Give the webhook a couple seconds to update the subscription tier in our DB
      setTimeout(() => {
        router.push("/dashboard?upgraded=1");
        router.refresh();
      }, 2000);
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="border border-rule bg-paper p-6 md:p-7 max-w-prose">
        <p className="text-muted text-sm">Loading upgrade details…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border border-danger/40 bg-danger/5 p-5 max-w-prose">
        <p className="text-sm text-ink/90">{loadError}</p>
      </div>
    );
  }

  if (!preview) return null;

  const amountFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: preview.currency.toUpperCase(),
  }).format(preview.amountDueToday / 100);

  const nextBillingFormatted = new Date(preview.nextBillingDate * 1000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="border border-ink bg-accent-soft p-6 md:p-8 max-w-prose">
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-5">
        Review the change
      </h2>

      <dl className="space-y-4 border-y border-rule py-5 mb-6">
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-sm text-muted">New plan</dt>
          <dd className="text-sm font-medium">Already Ahead System+ ($29.99/month)</dd>
        </div>
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-sm text-muted">Charged today (prorated)</dt>
          <dd className="text-lg font-display font-medium">{amountFormatted}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-4">
          <dt className="text-sm text-muted">Next billing date</dt>
          <dd className="text-sm">{nextBillingFormatted}</dd>
        </div>
      </dl>

      <p className="text-sm text-ink/80 leading-relaxed mb-6">
        Your plan switches immediately. You'll have access to everything in System+ as soon as
        you confirm. Cancel anytime from your dashboard.
      </p>

      <button
        onClick={onConfirm}
        disabled={submitting}
        className="btn-primary w-full sm:w-auto"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 border border-paper/70 border-t-transparent rounded-full animate-spin" />
            Upgrading…
          </span>
        ) : (
          `Confirm upgrade — charge ${amountFormatted} now`
        )}
      </button>

      {submitError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {submitError}
        </p>
      )}
    </div>
  );
}