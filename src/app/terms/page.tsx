import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms under which Already Ahead provides its services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article>
      <div className="max-w-page mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-16">
        <div className="max-w-prose prose-editorial">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
            Legal
          </p>
          <h1 className="font-display text-display-lg font-medium tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted mb-10">Last updated: April 2026</p>

          <p>
            These terms govern your use of alreadyahead.net. By creating an account or
            subscribing, you agree to them.
          </p>

          <h2>The service</h2>
          <p>
            Already Ahead provides written content, prompt systems, workflows, and case studies
            designed to help you use AI tools more effectively. The service is provided as-is.
            We do our best to keep it working and accurate, but we make no warranty about
            specific outcomes you&apos;ll achieve by using it.
          </p>

          <h2>Subscriptions and billing</h2>
          <p>
            Paid subscriptions renew monthly until canceled. You can cancel at any time from
            the customer portal linked inside your dashboard — cancellation takes effect at the
            end of the current billing period. We do not offer prorated refunds for partial
            months, but if you believe you were charged in error, email{" "}
            <a href="mailto:hello@alreadyahead.net">hello@alreadyahead.net</a> and we will
            review it.
          </p>

          <h2>Use of content</h2>
          <p>
            Your subscription grants you a personal, non-transferable license to access and use
            the content for your own work. You may use the prompts, workflows, and ideas in
            your day-to-day work freely. You may not republish, resell, or redistribute the
            written content (including the books) as your own.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Don&apos;t share your account. Don&apos;t scrape the site. Don&apos;t use the service to generate
            or distribute content that is illegal, defamatory, or harmful. We reserve the right
            to suspend accounts that violate these terms.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. If we make a material change, we will
            email subscribers before the change takes effect. Continued use of the service
            after the effective date constitutes acceptance of the updated terms.
          </p>

          <h2>Liability</h2>
          <p>
            Our total liability for any claim related to the service is limited to the amount
            you paid in the twelve months preceding the claim. We are not liable for indirect,
            incidental, or consequential damages.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which Already Ahead
            operates. Disputes will be resolved there.
          </p>

          <h2>Contact</h2>
          <p>
            Questions go to{" "}
            <a href="mailto:hello@alreadyahead.net">hello@alreadyahead.net</a>.
          </p>
        </div>
      </div>
    </article>
  );
}