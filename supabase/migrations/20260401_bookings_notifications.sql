-- ============================================================
-- Migration: bookings + notifications
-- App:       PawConnect
-- Date:      2026-04-01
--
-- NOTE ON INTENTIONAL DEVIATIONS FROM GENERIC SPEC:
--
-- 1. bookings.provider_id references provider_profiles(id), NOT
--    auth.users(id), because the app stores the profile UUID
--    (not the user UUID) when creating a booking. Provider RLS
--    therefore uses a subquery join rather than a direct uid() check.
--
-- 2. start_time / end_time are stored as TEXT (e.g. "09:00") to
--    match the format produced by the booking wizard and slot
--    generation logic. No casting overhead on read.
-- ============================================================

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id                  uuid        primary key default gen_random_uuid(),

  -- Parties
  pet_owner_id        uuid        not null references auth.users(id) on delete cascade,
  provider_id         uuid        not null references public.provider_profiles(id) on delete cascade,
  pet_id              uuid        not null references public.pets(id) on delete cascade,

  -- Slot
  booking_date        date        not null,
  start_time          text        not null,   -- "HH:MM" format
  end_time            text        not null,   -- "HH:MM" format

  -- Service
  service_type        text        not null,
  status              text        not null default 'pending'
                                  check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes               text,
  total_price         numeric,
  cancellation_reason text,

  -- Timestamps
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
-- Composite: provider dashboard queries filter by provider + date
create index if not exists bookings_provider_date_idx
  on public.bookings (provider_id, booking_date);

-- Single: pet owner bookings list
create index if not exists bookings_pet_owner_id_idx
  on public.bookings (pet_owner_id);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.bookings enable row level security;

drop policy if exists "Pet owners can view own bookings"    on public.bookings;
drop policy if exists "Pet owners can create bookings"      on public.bookings;
drop policy if exists "Pet owners can cancel own bookings"  on public.bookings;
drop policy if exists "Providers can view their bookings"   on public.bookings;
drop policy if exists "Providers can update booking status" on public.bookings;

-- Pet owners: read their own bookings
create policy "Pet owners can view own bookings"
  on public.bookings for select
  to authenticated
  using (auth.uid() = pet_owner_id);

-- Pet owners: create bookings (must own the pet_owner_id)
create policy "Pet owners can create bookings"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = pet_owner_id);

-- Pet owners: cancel their own booking (update status / cancellation_reason)
create policy "Pet owners can cancel own bookings"
  on public.bookings for update
  to authenticated
  using  (auth.uid() = pet_owner_id)
  with check (auth.uid() = pet_owner_id);

-- Providers: read bookings assigned to their profile
create policy "Providers can view their bookings"
  on public.bookings for select
  to authenticated
  using (
    provider_id in (
      select id from public.provider_profiles
      where provider_id = auth.uid()
    )
  );

-- Providers: confirm / complete / cancel bookings
create policy "Providers can update booking status"
  on public.bookings for update
  to authenticated
  using (
    provider_id in (
      select id from public.provider_profiles
      where provider_id = auth.uid()
    )
  )
  with check (
    provider_id in (
      select id from public.provider_profiles
      where provider_id = auth.uid()
    )
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  message     text        not null,
  type        text        not null default 'system',
  is_read     boolean     not null default false,
  booking_id  uuid        references public.bookings(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
-- Composite: unread badge count + notification list queries
create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, is_read);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications"            on public.notifications;
drop policy if exists "Users can mark notifications read"           on public.notifications;
drop policy if exists "Service role can insert notifications"       on public.notifications;
drop policy if exists "Authenticated users can insert notifications" on public.notifications;

-- Users: read their own
create policy "Users can view own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

-- Users: mark as read (update is_read only)
create policy "Users can mark notifications read"
  on public.notifications for update
  to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Any authenticated user can insert notifications.
-- This is required because server actions run as the booking user
-- (not service_role), yet need to notify the opposing party.
create policy "Authenticated users can insert notifications"
  on public.notifications for insert
  to authenticated
  with check (true);

-- ============================================================
-- TRIGGER: auto-update updated_at on bookings
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ============================================================
-- REALTIME: enable live subscriptions
--   • provider-bookings dashboard (new booking toast)
--   • notifications bell (unread count badge)
-- ============================================================
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.notifications;
