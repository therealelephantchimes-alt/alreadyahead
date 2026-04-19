import Link from "next/link";
import type { Metadata } from "next";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Essays on thinking clearly, writing better prompts, and building systems with AI.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesIndex() {
  const articles = await getArticles();

  return (
    <section>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
          Free articles
        </p>
        <h1 className="font-display text-display-xl font-medium tracking-tight max-w-3xl">
          Essays on thinking with AI.
        </h1>
        <p className="mt-5 text-lg text-ink/80 max-w-2xl leading-relaxed">
          Short pieces on prompt structure, multi-model workflows, and the mindset that turns AI
          from a novelty into a tool.
        </p>
      </div>

      <div className="max-w-page mx-auto px-5 md:px-8 py-10 md:py-16 border-t border-rule">
        <ul className="divide-y divide-rule">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-2 md:gap-8 py-8 md:py-10 hover:bg-card/40 transition-colors -mx-3 px-3"
              >
                <div className="text-sm text-muted">
                  <time dateTime={a.date}>
                    {new Date(a.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight group-hover:text-accent transition-colors">
                    {a.title}
                  </h2>
                  <p className="mt-3 text-ink/75 leading-relaxed max-w-prose">{a.excerpt}</p>
                </div>
                <div className="text-sm text-muted md:text-right md:pt-2">
                  {a.readingTime} min read
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {articles.length === 0 && (
          <p className="text-muted">No articles yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}
