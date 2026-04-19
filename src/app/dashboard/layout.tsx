import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TIER_LABELS } from "@/lib/types";
import { SignOutButton } from "./SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getCurrentUser();
  if (!ctx) redirect("/login?redirect=/dashboard");

  const tierLabel = ctx.activeTier ? TIER_LABELS[ctx.activeTier] : "No active plan";

  return (
    <div className="border-t border-rule">
      <div className="max-w-page mx-auto px-5 md:px-8 py-6 md:py-10 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12">
        <aside className="md:sticky md:top-6 md:self-start">
          <div className="pb-5 mb-5 border-b border-rule">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted mb-1">
              Signed in as
            </p>
            <p className="text-sm break-all">{ctx.email}</p>
            <p className="text-xs text-muted mt-2">{tierLabel}</p>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <DashLink href="/dashboard" label="Overview" />
            <DashLink href="/dashboard/books" label="Books" />
            <DashLink href="/dashboard/prompts" label="Prompts" />
            <DashLink href="/dashboard/workflows" label="Workflows" />
            <DashLink href="/dashboard/case-studies" label="Case studies" />
          </nav>

          <div className="mt-8 pt-5 border-t border-rule space-y-3">
            {ctx.subscription && (
              <form action="/api/portal" method="post">
                {/* Uses client-side handler via regular link — portal button for JSON */}
              </form>
            )}
            <SignOutButton />
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}

function DashLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm px-3 py-2 -mx-3 whitespace-nowrap hover:bg-card hover:text-accent transition-colors"
    >
      {label}
    </Link>
  );
}
