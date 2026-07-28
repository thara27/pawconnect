-- ============================================================
-- Migration: analytics_events
-- App:       PawConnect
-- Date:      2026-04-10
--
-- Lightweight custom event tracking table.
-- All writes are fire-and-forget from the client via
-- lib/analytics.ts. No user-facing reads.
-- ============================================================

create table if not exists public.analytics_events (
  id         uuid        primary key default gen_random_uuid(),
  event      text        not null,
  properties jsonb,
  user_id    uuid        references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Index for per-user event queries (admin reporting)
create index if not exists analytics_events_user_id_idx
  on public.analytics_events (user_id);

-- Index for event-type aggregation
create index if not exists analytics_events_event_idx
  on public.analytics_events (event);

alter table public.analytics_events enable row level security;

-- Authenticated users may insert their own events (or anonymous events with null user_id)
drop policy if exists "Users can insert own analytics events" on public.analytics_events;
create policy "Users can insert own analytics events"
  on public.analytics_events for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

-- No select policy — analytics data is read only via service role / admin
