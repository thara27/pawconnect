-- ============================================================
-- Migration: breed_profiles
-- App:       PawConnect
-- Date:      2026-04-05
--
-- Purpose:
--   Caches AI-generated breed data so each breed is only
--   fetched from Claude once and served from DB thereafter.
--   The breed_slug is the primary lookup key (URL-safe slug).
-- ============================================================

create table if not exists public.breed_profiles (
  id                        uuid        primary key default gen_random_uuid(),

  -- Identity
  breed_slug                text        not null unique,   -- e.g. "golden-retriever"
  breed_name                text        not null unique,   -- e.g. "Golden Retriever"

  -- Basic info
  origin                    text,
  size                      text        check (size in ('small','medium','large','giant')),
  temperament               text[],

  -- Scores  (1 = low · 5 = high)
  energy_level              smallint    check (energy_level between 1 and 5),
  grooming_needs            smallint    check (grooming_needs between 1 and 5),
  training_difficulty       smallint    check (training_difficulty between 1 and 5),

  -- India-specific
  india_climate_suitability text        check (india_climate_suitability in ('low','medium','high')),
  popularity_in_india       text,
  india_care_tips           text[],     -- formerly care_tips[]

  -- Health & care
  common_health_issues      text[],
  exercise_needs            text,
  feeding_guide             text,

  -- Narrative
  fun_fact                  text,
  summary                   text,

  -- Provenance
  generated_by_ai           boolean     not null default false,

  -- Timestamps
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────
-- Breed profiles are public read. Writes happen only via the
-- service role (API route server action). No user-facing writes.
alter table public.breed_profiles enable row level security;

drop policy if exists "Anyone can read breed profiles" on public.breed_profiles;
create policy "Anyone can read breed profiles"
  on public.breed_profiles for select
  to public
  using (true);

-- Authenticated users (server actions) may insert/upsert
drop policy if exists "Authenticated can upsert breed profiles" on public.breed_profiles;
create policy "Authenticated can upsert breed profiles"
  on public.breed_profiles for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update breed profiles" on public.breed_profiles;
create policy "Authenticated can update breed profiles"
  on public.breed_profiles for update
  to authenticated
  using (true);

-- ── TRIGGER: updated_at ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists breed_profiles_set_updated_at on public.breed_profiles;
create trigger breed_profiles_set_updated_at
  before update on public.breed_profiles
  for each row execute function public.set_updated_at();
