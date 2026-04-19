import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticle, getArticles } from "@/lib/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alreadyahead.net";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/articles/${article.slug}`,
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: article.author },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-rule">
        <div className="max-w-page mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-12 md:pb-16">
          <Link
            href="/articles"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            ← All articles
          </Link>
          <h1 className="mt-6 font-display text-display-xl font-medium tracking-tight max-w-3xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-ink/80 max-w-2xl leading-relaxed">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <span>{article.author}</span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{article.readingTime} min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-page mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="prose-editorial mx-auto">
          <MDXRemote source={article.body} />
        </div>
      </div>

      <section className="border-t border-rule bg-card/40">
        <div className="max-w-page mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
              Want more like this?
            </p>
            <h2 className="font-display text-display-lg font-medium tracking-tight mb-4">
              Go deeper with the full system.
            </h2>
            <p className="text-ink/80 leading-relaxed mb-6">
              Prompt systems, workflows, and case studies — built to turn reading into doing.
            </p>
            <Link href="/pricing" className="btn-primary">
              See pricing →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
