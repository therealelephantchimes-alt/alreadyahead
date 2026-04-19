import type { Metadata } from "next";
import { LoginForm } from "./form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Already Ahead account with a magic link.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; message?: string };
}) {
  return (
    <section>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-16">
        <div className="max-w-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Sign in
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mb-4">
            Welcome back.
          </h1>
          <p className="text-ink/80 leading-relaxed mb-10">
            Enter your email and we'll send you a magic link. No password required.
          </p>

          {searchParams.message === "expired" && (
            <div className="mb-6 border border-danger/40 bg-danger/5 p-4 text-sm">
              That link expired. Enter your email to get a new one.
            </div>
          )}

          <LoginForm redirectTo={searchParams.redirect} />
        </div>
      </div>
    </section>
  );
}
