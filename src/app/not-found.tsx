import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-32 pb-24">
        <div className="max-w-prose">
          <p className="font-display text-[8rem] md:text-[12rem] leading-none font-medium text-accent">
            404
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mt-4 mb-4">
            That page isn't here.
          </h1>
          <p className="text-lg text-ink/80 mb-8 leading-relaxed">
            The link may have changed or the page may have been removed. Head back to the
            homepage or read an article.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Homepage →
            </Link>
            <Link href="/articles" className="btn-secondary">
              Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
