import Link from "next/link";
import type { Metadata } from "next";
import { EmailForm } from "@/components/EmailForm";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Already Ahead — The skill is thinking with AI",
  description:
    "Learn how to use AI systems to produce better work, faster, and more consistently.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const articles = (await getArticles()).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-28 pb-16 md:pb-24">
          <div className="max-w-3xl stagger">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted mb-6 font-medium">
              Stay Ahead — a newsletter by Cole Ashford
            </p>
            <h1 className="font-display text-display-xl font-medium text-ink">
              The skill is not using AI.
              <br />
              <span className="italic font-light text-accent">The skill is thinking with it.</span>
            </h1>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-ink/80 max-w-2xl leading-relaxed">
              Learn how to use AI systems to produce better work, faster, and more consistently.
            </p>
            <div className="mt-8 md:mt-10">
              <EmailForm source="homepage_hero" />
            </div>
            <p className="mt-5 text-sm text-muted">
              Or start with the books{" "}
              <a href="#books" className="link-underline">
                ↓
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            What you'll learn
          </p>
          <h2 className="font-display text-display-lg font-medium tracking-tight max-w-3xl mb-12 md:mb-16">
            A clear way to think, prompt, and build with AI.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-14">
            {[
              {
                n: "01",
                h: "Think clearly",
                p: "Understand what AI can and cannot do. Get past the hype and the fear and use it for what it actually is.",
              },
              {
                n: "02",
                h: "Write better prompts",
                p: "Get specific, useful output instead of generic responses. One change in structure can change the entire result.",
              },
              {
                n: "03",
                h: "Build systems",
                p: "Move from one-off use to repeatable workflows. Stop starting from scratch every time you open a chat.",
              },
              {
                n: "04",
                h: "Make better decisions",
                p: "Use AI as a tool for thinking, not just answering. The highest leverage is in the questions, not the replies.",
              },
            ].map((it) => (
              <div key={it.n} className="flex gap-6">
                <span className="font-display text-accent font-medium text-lg shrink-0 mt-1">
                  {it.n}
                </span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight mb-2">
                    {it.h}
                  </h3>
                  <p className="text-ink/80 leading-relaxed">{it.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-b border-rule bg-card/40">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            What this system produces
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-10">
            {[
              {
                stat: "3h → 40m",
                p: "Turn three hours of work into forty minutes with structured prompts.",
              },
              {
                stat: "First drafts",
                p: "Generate high-quality first drafts that require minimal editing.",
              },
              {
                stat: "Repeatable",
                p: "Build workflows you reuse instead of starting from scratch each time.",
              },
            ].map((it) => (
              <div key={it.stat} className="border-t border-ink pt-5">
                <p className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-3">
                  {it.stat}
                </p>
                <p className="text-ink/80 leading-relaxed">{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE ARTICLES */}
      <section className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
                Start here — free
              </p>
              <h2 className="font-display text-display-lg font-medium tracking-tight">
                Three short pieces to get your bearings.
              </h2>
            </div>
            <Link href="/articles" className="link-underline text-sm shrink-0">
              All articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group border-t border-ink pt-5 hover:bg-card/40 transition-colors -mx-3 px-3 pb-4"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted mb-3">
                  {a.readingTime} min read
                </p>
                <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight group-hover:text-accent transition-colors mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">{a.excerpt}</p>
                <p className="text-sm text-accent mt-4">Read →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKS (below fold, non-primary) */}
      <section id="books" className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            The books
          </p>
          <h2 className="font-display text-display-lg font-medium tracking-tight max-w-3xl mb-12">
            Two books. One throughline: structure changes output.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="font-display italic text-accent mb-1">Book I</p>
              <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-3">
                Already Ahead
              </h3>
              <p className="text-ink/80 leading-relaxed mb-5">
                A clear introduction to what AI is, what it is not, and how to start using it
                immediately.
              </p>
              <a
                href="https://www.amazon.com/dp/PLACEHOLDER_ASIN_1"
                className="link-underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Available on Amazon →
              </a>
            </div>
            <div>
              <p className="font-display italic text-accent mb-1">Book II</p>
              <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-3">
                The Prompt Is the Product
              </h3>
              <p className="text-ink/80 leading-relaxed mb-5">
                How to structure prompts, use multiple models together, and build systems that
                produce consistent results.
              </p>
              <a
                href="https://www.amazon.com/dp/PLACEHOLDER_ASIN_2"
                className="link-underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Available on Amazon →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM */}
      <section className="border-b border-rule bg-ink text-paper">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-28">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper/60 font-medium mb-3">
            The Already Ahead System
          </p>
          <h2 className="font-display text-display-lg md:text-display-xl font-medium tracking-tight max-w-3xl mb-6">
            This is where everything comes together.
          </h2>
          <p className="text-paper/80 text-lg leading-relaxed max-w-2xl mb-12">
            Both books. Prompt systems. Workflows. Case studies. Ongoing updates.
          </p>

          <ul className="grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-6 mb-12 max-w-4xl">
            {[
              "Both books",
              "Prompt systems",
              "Workflows",
              "Case studies",
              "Ongoing updates",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-paper/90">
                <span className="text-accent" aria-hidden>
                  —
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-paper text-ink font-medium px-6 py-3 hover:bg-accent hover:text-paper transition-colors"
          >
            Learn more <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="max-w-prose">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
              The author
            </p>
            <h2 className="font-display text-display-lg font-medium tracking-tight mb-6">
              Cole Ashford
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-ink/85">
              <p>
                Cole Ashford writes about leverage, systems, and the practical use of artificial
                intelligence.
              </p>
              <p>
                His work is built around a simple idea.{" "}
                <em className="font-display italic text-accent">
                  The quality of your thinking determines the quality of your results.
                </em>
              </p>
              <p>
                The Already Ahead series is designed to help readers move from basic use to
                structured systems that produce real outcomes.
              </p>
              <p className="text-muted text-base">
                He is also the author of <em>War of the Veil</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL EMAIL CAPTURE */}
      <section>
        <div className="max-w-page mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-display-lg font-medium tracking-tight mb-4">
              Get better at using AI in 5 minutes a day.
            </h2>
            <p className="text-lg text-ink/80 mb-8 leading-relaxed">
              Join the Stay Ahead newsletter — short, practical, free.
            </p>
            <EmailForm source="homepage_footer" />
          </div>
        </div>
      </section>
    </>
  );
}
