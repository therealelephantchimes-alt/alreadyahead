import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link expired",
  robots: { index: false, follow: false },
};

export default function ExpiredPage() {
  return (
    <section>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16">
        <div className="max-w-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-danger font-medium mb-3">
            Link expired
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mb-4">
            That magic link is no longer valid.
          </h1>
          <p className="text-ink/80 leading-relaxed mb-8">
            For security, magic links expire after one hour or after one use. Request a new one
            below and you'll be signed in.
          </p>
          <Link href="/login?message=expired" className="btn-primary">
            Send a new link →
          </Link>
        </div>
      </div>
    </section>
  );
}
