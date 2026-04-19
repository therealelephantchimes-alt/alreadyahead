import Link from "next/link";
import type { Metadata } from "next";
import { ThankYouTracker } from "./tracker";

export const metadata: Metadata = {
  title: "You're in.",
  description: "You've joined the Stay Ahead newsletter. Here's where to start.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      <ThankYouTracker />
      <section>
        <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16">
          <div className="max-w-prose">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
              Welcome
            </p>
            <h1 className="font-display text-display-xl font-medium tracking-tight">
              You're in. Start here.
            </h1>

            <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/85">
              <p className="dropcap">
                Most people use AI like a search engine. They ask a question, get an answer, and
                move on.
              </p>
              <p>That works, but it limits what you get back.</p>
              <p>
                The real advantage comes from structuring your thinking clearly and using AI as a
                system.
              </p>
              <p>Here's one simple shift you can use immediately:</p>

              <div className="border-l-2 border-accent pl-5 py-1 space-y-3 my-8">
                <p>
                  <span className="text-muted">Instead of asking:</span>
                  <br />
                  <span className="font-display italic text-lg">"Write me a marketing plan"</span>
                </p>
                <p>
                  <span className="text-muted">Ask:</span>
                  <br />
                  <span className="font-display italic text-lg">
                    "You are a senior marketing strategist. Build a 3-part plan for [specific
                    audience] with constraints [X, Y, Z]."
                  </span>
                </p>
              </div>

              <p>That one change improves output quality immediately.</p>
            </div>

            <div className="mt-16 pt-10 border-t border-rule">
              <p className="text-lg leading-relaxed text-ink/90 mb-6 font-display italic">
                If you want to go beyond surface-level use and build systems that consistently
                produce high-quality results, this is the next step.
              </p>
              <Link href="/pricing" className="btn-primary">
                Get full access to the Already Ahead System →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
