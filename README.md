# alreadyahead.net

A production Next.js 14 application: newsletter capture → paid subscription → member dashboard, with two tiers ($19.99 / $29.99 monthly).

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres + Auth) · Stripe · Resend · PostHog · Vercel**.

---

## Quick start (local development)

```bash
# 1. Install deps
npm install

# 2. Copy env template and fill it in (see "Service setup" below for each value)
cp .env.example .env.local

# 3. Run the database migration against your Supabase project
#    (paste supabase/migrations/0001_initial.sql into the Supabase SQL editor
#     OR run via the Supabase CLI: `supabase db push`)

# 4. Start the dev server
npm run dev
```

Open `http://localhost:3000`. Sign up via email capture → thank-you → pricing → Stripe test checkout to verify the full loop.

---

## Service setup

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. **Settings → API** — copy `URL`, `anon` public key, and `service_role` secret key into `.env.local`.
3. **SQL Editor** — paste `supabase/migrations/0001_initial.sql` and run it. This creates the four tables, the `auth.users → public.users` sync trigger, and the RLS policies.
4. **Authentication → Providers → Email** — enable "Email OTP" (for magic links). Disable "Confirm email" if you want first-time sign-ins via magic link to not require a second confirmation step.
5. **Authentication → URL Configuration** — set Site URL to `https://alreadyahead.net` (and add `http://localhost:3000` to Redirect URLs for local development). Add `https://alreadyahead.net/auth/callback` and `http://localhost:3000/auth/callback` to allowed redirect URLs.
6. **Authentication → Email Templates → Magic Link** — the default is fine, but you can rebrand it to match the site.
7. **Storage → New bucket** — create a bucket named `protected`, **private** (not public). Upload the two book PDFs at:
   - `protected/books/already-ahead.pdf`
   - `protected/books/the-prompt-is-the-product.pdf`

   The `/api/download-book/[slug]` route generates 60-second signed URLs; Tier 1+ users only.

### 2. Stripe

1. [Dashboard → Products](https://dashboard.stripe.com/products) — create two recurring products:
   - **Already Ahead System** — recurring price **$19.99 USD / month**
   - **Already Ahead System+** — recurring price **$29.99 USD / month**

   Copy each **price ID** (starts with `price_`) into `STRIPE_PRICE_TIER_1` and `STRIPE_PRICE_TIER_2`.

2. **Developers → API keys** — copy the secret key (`sk_test_...` for dev, `sk_live_...` for prod) into `STRIPE_SECRET_KEY`.

3. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://alreadyahead.net/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.

4. **Customer Portal** — enable at [billing portal settings](https://dashboard.stripe.com/settings/billing/portal). Turn on "Customers can switch plans" so users can upgrade/downgrade between the two tiers, and "Customers can cancel subscriptions".

5. **Local webhook testing** — run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` during development. The CLI prints a temporary `whsec_...` you use in `.env.local` for local testing.

### 3. Resend

1. Create an account at [resend.com](https://resend.com).
2. **Domains → Add domain** — add `alreadyahead.net`. Add the DNS records Resend gives you (SPF, DKIM, DMARC). Wait for verification — usually under an hour.
3. **API Keys → Create API Key** — name it `alreadyahead-production`, give it "Sending access", copy into `RESEND_API_KEY`.
4. Verify that `RESEND_FROM_EMAIL` in your env is formatted exactly: `Cole Ashford <hello@alreadyahead.net>`.

The welcome email template is in `src/lib/resend.ts` — edit there if you change the copy.

### 4. PostHog

1. Create a project at [posthog.com](https://posthog.com) (US cloud: `https://us.i.posthog.com`).
2. **Project settings → Project ID/API key** — copy into `NEXT_PUBLIC_POSTHOG_KEY`.
3. Leave `NEXT_PUBLIC_POSTHOG_HOST` as `https://us.i.posthog.com` unless you're on EU cloud.

Events tracked automatically: `$pageview`, `email_captured`, `thank_you_viewed`, `pricing_viewed`, `checkout_started`, `checkout_completed`, `tier_selected`.

### 5. Vercel deployment

1. Push the repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. **Environment Variables** — paste every variable from `.env.local` into the Vercel project settings (Production, Preview, and Development scopes). Set `NEXT_PUBLIC_SITE_URL` to `https://alreadyahead.net` for production.
4. **Domains** — add `alreadyahead.net` (and `www.alreadyahead.net` if desired). Configure DNS as Vercel instructs.
5. Deploy. First build takes ~2 minutes.
6. After first deploy, go back to Stripe and update the webhook endpoint URL to your production URL if you changed domains.

---

## Project structure

```
alreadyahead/
├── content/
│   ├── articles/              # MDX articles rendered at /articles/[slug]
│   └── seed/                  # TS files — prompts, workflows, case studies
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── thank-you/         # Post-capture page
│   │   ├── pricing/           # Tier selection + checkout entry
│   │   ├── articles/          # /articles and /articles/[slug]
│   │   ├── login/             # Magic-link sign-in
│   │   ├── auth/callback/     # Supabase OTP exchange
│   │   ├── auth/expired/      # Expired magic-link page
│   │   ├── dashboard/         # Member area — layout + 5 pages
│   │   ├── privacy/           # Privacy Policy
│   │   ├── terms/             # Terms of Service
│   │   ├── not-found.tsx      # Branded 404
│   │   └── api/
│   │       ├── email-capture/       # POST — save + send welcome
│   │       ├── checkout/            # POST — start Stripe Checkout
│   │       ├── portal/              # POST — open Customer Portal
│   │       ├── webhooks/stripe/     # POST — Stripe events
│   │       └── download-book/[slug] # GET — signed PDF URL
│   ├── components/            # Shared UI components
│   ├── lib/
│   │   ├── supabase/          # Browser, server, admin, middleware clients
│   │   ├── stripe.ts          # Stripe client + tier mapping
│   │   ├── resend.ts          # Email template
│   │   ├── posthog.ts         # Server analytics
│   │   ├── articles.ts        # MDX article loader
│   │   ├── auth.ts            # getCurrentUser() helper
│   │   └── types.ts           # Shared types + hasAccess() gating
│   └── middleware.ts          # Session refresh + /dashboard protection
└── supabase/
    └── migrations/0001_initial.sql
```

---

## Access control model

There's one function that decides everything: `hasAccess(userTier, requiredTier)` in `src/lib/types.ts`. Every tier-gated page and component uses it.

- **Free** — anyone can view
- **Tier 1 ($19.99/mo — Already Ahead System)** — both books, core prompts, foundational workflows, dashboard
- **Tier 2 ($29.99/mo — Already Ahead System+)** — everything above, plus case studies and advanced prompts

Tier 1 users hitting a Tier 2 page see an `<UpgradePrompt />` — never a blank page or an error. This is enforced in the dashboard pages, not via middleware.

---

## Content model

- **Articles** — MDX files in `content/articles/`. Frontmatter: `title`, `excerpt`, `date`, `author`. Reading time is auto-computed. Adding a new article = dropping in a new `.mdx` file. No DB write.
- **Prompts / Workflows / Case studies** — TypeScript files in `content/seed/`. Strongly typed via `Prompt`, `Workflow`, `CaseStudy` interfaces in `src/lib/types.ts`. Add entries to those arrays.

Reason: these rarely change, and keeping them in Git gives you versioning, PR review, and zero runtime cost. The `content` table in Postgres exists for future use (e.g. when you want to edit content without redeploying), but isn't wired to the dashboard pages yet.

---

## Before you launch — checklist

- [ ] Swap `PLACEHOLDER_ASIN_1` and `PLACEHOLDER_ASIN_2` on the homepage (`src/app/page.tsx`) with real Amazon ASINs
- [ ] Upload both book PDFs to Supabase Storage `protected/books/`
- [ ] Verify `alreadyahead.net` in Resend and send a test email
- [ ] Run a full test purchase in Stripe test mode with card `4242 4242 4242 4242` — end-to-end: capture → thank-you → pricing → checkout → dashboard
- [ ] Run a second test purchase selecting the inline upgrade toggle — confirm Tier 2 is what lands in Stripe
- [ ] Manually trigger `invoice.payment_failed` from the Stripe Dashboard (Webhooks → Send test event) and confirm the red banner appears at the top of every page
- [ ] Use the Customer Portal to cancel a test subscription and confirm `customer.subscription.deleted` flips `status` to `canceled` in the DB
- [ ] Walk through the magic-link flow: sign up, let the link expire (or truncate it), confirm the `/auth/expired` page appears with a working resend button
- [ ] Have counsel review `/privacy` and `/terms` for your jurisdiction
- [ ] Confirm PostHog events appear in the dashboard for each of: email_captured, pricing_viewed, checkout_started, checkout_completed, tier_selected, thank_you_viewed
- [ ] Lighthouse audit — target 95+ on mobile for Performance, Accessibility, Best Practices, SEO

---

## Scripts

```bash
npm run dev         # Next.js dev server
npm run build       # Production build
npm run start       # Serve production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

---

## License

© Cole Ashford. All rights reserved.
