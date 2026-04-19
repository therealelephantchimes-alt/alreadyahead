import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alreadyahead.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Already Ahead — The skill is thinking with AI",
    template: "%s — Already Ahead",
  },
  description:
    "Learn how to use AI systems to produce better work, faster, and more consistently. Prompt systems, workflows, and case studies by Cole Ashford.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Already Ahead",
    title: "Already Ahead — The skill is thinking with AI",
    description:
      "Learn how to use AI systems to produce better work, faster, and more consistently.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Already Ahead — The skill is thinking with AI",
    description:
      "Learn how to use AI systems to produce better work, faster, and more consistently.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <SubscriptionBanner />
          <Nav />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
