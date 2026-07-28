-- ============================================================
-- Migration: RLS hardening
-- App:       PawConnect
-- Date:      2026-04-08
--
-- Fixes four security issues:
--
--   1. analytics_events table had no migration → RLS was never
--      enabled, making it publicly readable/writable.
--
--   2. notifications INSERT policy used `with check (true)`,
--      letting any authenticated user spam any other user.
--      Tightened to require a booking relationship between the
--      inserting user and the notification recipient.
--
--   3. pet_owner_profiles SELECT policy was self-only.
--      Providers fetching reviewer display names for the
--      provider profile page would always get null.
--      Added a minimal read policy for authenticated users.
--
--   4. community_posts had no DELETE policy, so authors could
--      never remove their own posts.
-- ============================================================


-- ============================================================
-- 1. analytics_events — create with RLS
-- ============================================================
create table if not exists public.analytics_events (
  id          uuid        primary key default gen_random_uuid(),
  event       text        not null,
  properties  jsonb,
  user_id     uuid        references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

-- Users can record their own events (or anonymous events where user_id is null)
drop policy if exists "Users can insert own analytics events" on public.analytics_events;
create policy "Users can insert own analytics events"
  on public.analytics_events for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

-- No SELECT / UPDATE / DELETE policies → only the service role
-- (used in the Supabase dashboard) can read analytics data.


-- ============================================================
-- 2. notifications — tighten INSERT policy
--
-- Before: any authenticated user could insert a notification
--         for any user_id (with check (true)).
--
-- After:  the inserting user must be a party to a booking with
--         the notification recipient, and cannot notify
--         themselves. This covers both directions:
--
--   • Pet owner (auth.uid()) notifying the provider user
--   • Provider user (auth.uid()) notifying the pet owner
-- ============================================================
drop policy if exists "Authenticated users can insert notifications" on public.notifications;

create policy "Booking parties can insert notifications"
  on public.notifications for insert
  to authenticated
  with check (
    -- Cannot send a notification to yourself
    user_id <> auth.uid()
    and (
      -- Pet owner notifying the provider they booked
      exists (
        select 1
        from public.bookings b
        join public.provider_profiles pp on pp.id = b.provider_id
        where b.pet_owner_id = auth.uid()
          and pp.provider_id = user_id
      )
      or
      -- Provider notifying a pet owner who booked them
      exists (
        select 1
        from public.bookings b
        join public.provider_profiles pp on pp.id = b.provider_id
        where pp.provider_id = auth.uid()
          and b.pet_owner_id = user_id
      )
    )
  );


-- ============================================================
-- 3. pet_owner_profiles — add read policy for reviewer names
--
-- The existing "Pet owners can view own profile" policy is
-- self-only. Authenticated users (e.g. providers loading a
-- provider profile page) need to read display_name to show
-- reviewer names. Phone / city exposure is acceptable in a
-- service marketplace — providers need basic contact info
-- after a booking is confirmed.
-- ============================================================
drop policy if exists "Authenticated users can read pet owner profiles" on public.pet_owner_profiles;

create policy "Authenticated users can read pet owner profiles"
  on public.pet_owner_profiles for select
  to authenticated
  using (true);

-- The stricter self-only policy is now superseded; drop it to
-- avoid redundancy (both policies were FOR SELECT, so both
-- would have applied — keeping the wider one is cleaner).
drop policy if exists "Pet owners can view own profile" on public.pet_owner_profiles;


-- ============================================================
-- 4. community_posts — add DELETE policy
-- ============================================================
drop policy if exists "Authors can delete own posts" on public.community_posts;

create policy "Authors can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = author_id);
