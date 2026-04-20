import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { status?: string; email?: string };
}) {
  const status = searchParams.status || "ok";
  const email = searchParams.email;

  if (status === "invalid") {
    return (
      <section>
        <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16">
          <div className="max-w-prose">
            <p className="text-[11px] uppercase tracking-[0.2em] text-danger font-medium mb-3">
              Invalid link
            </p>
            <h1 className="font-display text-display-lg font-medium tracking-tight mb-4">
              That unsubscribe link isn&apos;t valid.
            </h1>
            <p className="text-ink/80 leading-relaxed mb-6">
              The link may have been copied incorrectly or modified. If you&apos;d like to
              unsubscribe, reply to any email from{" "}
              <a href="mailto:hello@alreadyahead.net" className="link-underline">
                hello@alreadyahead.net
              </a>{" "}
              with the word &ldquo;unsubscribe&rdquo; and we&apos;ll remove you by hand.
            </p>
            <Link href="/" className="btn-secondary">
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section>
        <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16">
          <div className="max-w-prose">
            <p className="text-[11px] uppercase tracking-[0.2em] text-danger font-medium mb-3">
              Something went wrong
            </p>
            <h1 className="font-display text-display-lg font-medium tracking-tight mb-4">
              We couldn&apos;t process that request.
            </h1>
            <p className="text-ink/80 leading-relaxed mb-6">
              Please try the link again in a minute. If it keeps failing, email{" "}
              <a href="mailto:hello@alreadyahead.net" className="link-underline">
                hello@alreadyahead.net
              </a>{" "}
              and we&apos;ll remove you manually.
            </p>
            <Link href="/" className="btn-secondary">
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16">
        <div className="max-w-prose">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Unsubscribed
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mb-4">
            You&apos;re out.
          </h1>
          <p className="text-ink/85 text-lg leading-relaxed mb-6">
            {email ? (
              <>
                <span className="font-mono text-[15px]">{email}</span> has been removed from the
                Stay Ahead newsletter. You won&apos;t receive any more emails from us.
              </>
            ) : (
              <>
                You&apos;ve been removed from the Stay Ahead newsletter. You won&apos;t receive any
                more emails from us.
              </>
            )}
          </p>
          <p className="text-ink/80 leading-relaxed mb-8">
            If this was an accident or you change your mind, you can resubscribe at any time
            from the homepage.
          </p>
          <Link href="/" className="btn-secondary">
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}