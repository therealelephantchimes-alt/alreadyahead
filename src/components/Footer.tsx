import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule mt-24 bg-paper">
      <div className="max-w-page mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <p className="font-display text-lg tracking-tight mb-2">Already Ahead</p>
            <p className="text-sm text-muted leading-relaxed">
              The quality of your thinking determines the quality of your results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/articles" className="hover:text-accent">Articles</Link>
            <Link href="/pricing" className="hover:text-accent">Pricing</Link>
            <Link href="/login" className="hover:text-accent">Sign in</Link>
            <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
            <Link href="/privacy" className="hover:text-accent">Privacy</Link>
            <Link href="/terms" className="hover:text-accent">Terms</Link>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-rule flex flex-col md:flex-row justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} Cole Ashford. All rights reserved.</p>
          <p>
            Questions?{" "}
            <a href="mailto:hello@alreadyahead.net" className="link-underline">
              hello@alreadyahead.net
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
