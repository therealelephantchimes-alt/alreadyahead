import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Already Ahead collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16">
        <div className="max-w-prose prose-editorial">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Legal
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted mb-10">Last updated: January 2025</p>

          <p>
            This policy describes what information Already Ahead (“we,” “us”) collects, how we
            use it, and the choices you have. If something here is unclear, email{" "}
            <a href="mailto:hello@alreadyahead.net">hello@alreadyahead.net</a> and we will answer.
          </p>

          <h2>What we collect</h2>
          <p>
            <strong>Email address.</strong> When you subscribe to the Stay Ahead newsletter or
            create an account, we store your email. This is required to deliver the service.
          </p>
          <p>
            <strong>Account and subscription data.</strong> If you pay for a subscription, we
            store your subscription status, plan tier, and a Stripe customer ID. We do not store
            your card details — Stripe handles that.
          </p>
          <p>
            <strong>Usage analytics.</strong> We use PostHog to understand how the site is used
            in aggregate (pages viewed, conversion events). We use <em>identified</em> profiles
            only for users who have signed in; anonymous visitors are tracked without personal
            identifiers.
          </p>

          <h2>How we use it</h2>
          <p>
            We use your email to send you the newsletter, transactional messages (sign-in links,
            receipts), and occasional updates about new content. We use analytics data to
            improve the product. We do not sell your data. We do not share it with third
            parties except the service providers listed below, and only as required to operate
            the service.
          </p>

          <h2>Service providers</h2>
          <p>
            We rely on Supabase (database and authentication), Stripe (payments), Resend
            (transactional email), PostHog (analytics), and Vercel (hosting). Each of these
            handles your data under their own privacy policies and applicable law.
          </p>

          <h2>Your rights</h2>
          <p>
            You can unsubscribe from the newsletter at any time using the link at the bottom of
            any email. You can request deletion of your account and associated data by emailing{" "}
            <a href="mailto:hello@alreadyahead.net">hello@alreadyahead.net</a>. We will confirm
            within seven days.
          </p>

          <h2>Cookies</h2>
          <p>
            We set cookies required for sign-in and session management. We use PostHog cookies
            for anonymous usage analytics. We do not use advertising cookies.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy go to{" "}
            <a href="mailto:hello@alreadyahead.net">hello@alreadyahead.net</a>.
          </p>

          <hr className="my-10 border-rule" />
          <p className="text-sm text-muted italic">
            This is a baseline policy. Before launch, have counsel review it against your
            jurisdiction's requirements (GDPR, CCPA, etc.) and update as needed.
          </p>
        </div>
      </div>
    </article>
  );
}
