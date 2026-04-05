-- ============================================================
-- Migration: pet_owner_profiles
-- App:       PawConnect
-- Date:      2026-04-04
-- ============================================================

-- ============================================================
-- TABLE
-- ============================================================
create table if not exists public.pet_owner_profiles (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  display_name text,
  phone        text,
  city         text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index if not exists pet_owner_profiles_user_id_key
  on public.pet_owner_profiles (user_id);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.pet_owner_profiles enable row level security;

drop policy if exists "Pet owners can view own profile"   on public.pet_owner_profiles;
drop policy if exists "Pet owners can insert own profile" on public.pet_owner_profiles;
drop policy if exists "Pet owners can update own profile" on public.pet_owner_profiles;

create policy "Pet owners can view own profile"
  on public.pet_owner_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Pet owners can insert own profile"
  on public.pet_owner_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Pet owners can update own profile"
  on public.pet_owner_profiles for update
  to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── TRIGGER: auto-update updated_at ──────────────────────────
-- Reuses set_updated_at() created in the bookings migration.
-- If that migration hasn't run, create it here as a fallback.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pet_owner_profiles_set_updated_at on public.pet_owner_profiles;
create trigger pet_owner_profiles_set_updated_at
  before update on public.pet_owner_profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- STORAGE: avatar bucket
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('pet-owner-avatars', 'pet-owner-avatars', true)
  on conflict (id) do nothing;

-- Allow authenticated users to upload their own avatar
drop policy if exists "Pet owners can upload avatar" on storage.objects;
create policy "Pet owners can upload avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pet-owner-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update/replace their own avatar
drop policy if exists "Pet owners can update avatar" on storage.objects;
create policy "Pet owners can update avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'pet-owner-avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read for avatars (bucket is public, but explicit policy for clarity)
drop policy if exists "Anyone can view pet owner avatars" on storage.objects;
create policy "Anyone can view pet owner avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'pet-owner-avatars');
