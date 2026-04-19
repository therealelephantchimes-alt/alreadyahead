"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-rule bg-paper">
      <div className="max-w-page mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-xl tracking-tight font-medium">
            Already <span className="text-accent">Ahead</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/articles" className="hover:text-accent transition-colors">Articles</Link>
            <Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-accent transition-colors">Sign in</Link>
            <Link href="/pricing" className="btn-primary text-sm !py-2 !px-4">Get access</Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" strokeLinecap="round" />
                  <path d="M4 17h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-5 flex flex-col gap-4 text-base">
            <Link href="/articles" onClick={() => setOpen(false)}>Articles</Link>
            <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
            <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="btn-primary self-start">Get access</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
