import Link from "next/link";

export function UpgradePrompt({
  title = "This is a System+ feature",
  body = "Full case studies and advanced prompt systems are part of Already Ahead System+. You can upgrade at any time — your existing plan is credited.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="border border-ink bg-accent-soft p-6 md:p-8 max-w-prose">
      <p className="text-[10px] uppercase tracking-[0.15em] text-accent font-medium mb-2">
        System+ only
      </p>
      <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-ink/90 leading-relaxed mb-5">{body}</p>
      <Link href="/pricing" className="btn-primary">
        Upgrade to System+
      </Link>
    </div>
  );
}
