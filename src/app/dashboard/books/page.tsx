import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Books — Dashboard",
  robots: { index: false, follow: false },
};

const BOOKS = [
  {
    slug: "already-ahead",
    title: "Already Ahead",
    subtitle: "Book I",
    cover: "/books/already-ahead.jpg",
    description:
      "A clear introduction to what AI is, what it is not, and how to start using it immediately.",
  },
  {
    slug: "the-prompt-is-the-product",
    title: "The Prompt Is the Product",
    subtitle: "Book II",
    cover: "/books/the-prompt-is-the-product.jpg",
    description:
      "How to structure prompts, use multiple models together, and build systems that produce consistent results.",
  },
];

export default async function BooksPage() {
  const ctx = (await getCurrentUser())!;
  const canDownload = !!ctx.activeTier;

  return (
    <div>
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
          Books
        </p>
        <h1 className="font-display text-display-lg font-medium tracking-tight">
          Both books. Downloadable.
        </h1>
        <p className="mt-4 text-ink/80 max-w-prose leading-relaxed">
          Your subscription includes the full text of both books as PDF. For personal use only.
        </p>
      </header>

      {!canDownload && (
        <div className="mb-8 border border-ink bg-accent-soft p-5 max-w-prose">
          <p className="font-medium mb-1">Subscribe to download the books.</p>
          <p className="text-sm text-ink/80 mb-4">
            Downloads require an active subscription.
          </p>
          <Link href="/pricing" className="btn-primary text-sm !py-2">
            See pricing →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BOOKS.map((book) => (
          <article key={book.slug} className="border border-rule bg-paper p-6 md:p-7 flex flex-col">
            <div className="aspect-[3/4] mb-5 overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-display italic text-accent text-sm mb-1">{book.subtitle}</p>
            <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight mb-2">
              {book.title}
            </h2>
            <p className="text-sm text-ink/75 leading-relaxed mb-5 flex-1">{book.description}</p>
            {canDownload ? (
              <a href={`/api/download-book/${book.slug}`} className="btn-primary">
                Download PDF →
              </a>
            ) : (
              <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                Subscribe to download
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}