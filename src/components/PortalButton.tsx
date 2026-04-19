"use client";

import { useState } from "react";

export function PortalButton({
  className = "btn-secondary",
  label = "Manage subscription",
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data?.error || "Could not open portal.");
        setLoading(false);
      }
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={onClick} disabled={loading} className={className}>
        {loading ? "Opening…" : label}
      </button>
      {error && <span className="ml-2 text-xs opacity-80">{error}</span>}
    </>
  );
}
