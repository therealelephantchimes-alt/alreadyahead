-- =============================================================================
-- alreadyahead.net — Initial schema
-- Run this in Supabase → SQL Editor, or via `supabase db push`.
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- users
-- Mirrors auth.users 1:1. Populated by the trigger below on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  created_at timestamptz not null default now(),
  email_verified boolean not null default false
);

-- Keep public.users in sync with auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, email_verified)
  values (new.id, new.email, new.email_confirmed_at is not null)
  on conflict (id) do update
    set email = excluded.email,
        email_verified = excluded.email_verified;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- subscriptions
-- One active row per user. Written exclusively by the Stripe webhook.
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  tier text not null check (tier in ('tier_1', 'tier_2')),
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_stripe_customer_idx on public.subscriptions(stripe_customer_id);

-- ---------------------------------------------------------------------------
-- email_captures
-- Records every newsletter signup. `converted_to_user` flips true if the
-- capture later becomes a paying user with the same email.
-- ---------------------------------------------------------------------------
create table if not exists public.email_captures (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  source text not null default 'homepage',
  captured_at timestamptz not null default now(),
  converted_to_user boolean not null default false
);

create index if not exists email_captures_email_idx on public.email_captures(email);

-- ---------------------------------------------------------------------------
-- content (optional — seed content ships in repo as TS/MDX; this table is
-- here for future CMS-style additions without redeploy).
-- ---------------------------------------------------------------------------
create table if not exists public.content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  body text not null,
  tier_required text not null default 'tier_1' check (tier_required in ('free', 'tier_1', 'tier_2')),
  category text not null check (category in ('prompt', 'workflow', 'case_study', 'book', 'article')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_category_idx on public.content(category);
create index if not exists content_tier_idx on public.content(tier_required);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.email_captures enable row level security;
alter table public.content enable row level security;

-- Users can read their own row only.
drop policy if exists "users_self_read" on public.users;
create policy "users_self_read" on public.users
  for select using (auth.uid() = id);

-- Users can read their own subscription only.
drop policy if exists "subs_self_read" on public.subscriptions;
create policy "subs_self_read" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Content: signed-in users can read everything they're entitled to.
-- We enforce tier gating in application code, not at the DB level, so the
-- dashboard can fetch Tier-2 items to show upgrade prompts without 403ing.
drop policy if exists "content_auth_read" on public.content;
create policy "content_auth_read" on public.content
  for select using (auth.role() = 'authenticated');

-- email_captures: no public read/write. All writes go through the server
-- (service role key) from /api/email-capture.
