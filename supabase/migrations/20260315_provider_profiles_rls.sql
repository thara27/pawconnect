create extension if not exists pgcrypto;

create table if not exists public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  service_type text not null,
  description text,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  lat numeric,
  lng numeric,
  phone text not null,
  website text,
  price_from numeric,
  price_to numeric,
  price_unit text not null,
  is_available boolean not null default true,
  avatar_url text,
  years_experience numeric,
  license_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists provider_profiles_provider_id_key
on public.provider_profiles (provider_id);

create table if not exists public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  open_time text not null,
  close_time text not null,
  created_at timestamptz not null default now()
);

alter table public.provider_profiles enable row level security;
alter table public.provider_availability enable row level security;

drop policy if exists "Providers can view own profile" on public.provider_profiles;
drop policy if exists "Providers can insert own profile" on public.provider_profiles;
drop policy if exists "Providers can update own profile" on public.provider_profiles;
drop policy if exists "Providers can delete own profile" on public.provider_profiles;

create policy "Providers can view own profile"
on public.provider_profiles
for select
to authenticated
using (auth.uid() = provider_id);

create policy "Providers can insert own profile"
on public.provider_profiles
for insert
to authenticated
with check (auth.uid() = provider_id);

create policy "Providers can update own profile"
on public.provider_profiles
for update
to authenticated
using (auth.uid() = provider_id)
with check (auth.uid() = provider_id);

create policy "Providers can delete own profile"
on public.provider_profiles
for delete
to authenticated
using (auth.uid() = provider_id);

drop policy if exists "Providers can view own availability" on public.provider_availability;
drop policy if exists "Providers can insert own availability" on public.provider_availability;
drop policy if exists "Providers can update own availability" on public.provider_availability;
drop policy if exists "Providers can delete own availability" on public.provider_availability;

create policy "Providers can view own availability"
on public.provider_availability
for select
to authenticated
using (auth.uid() = provider_id);

create policy "Providers can insert own availability"
on public.provider_availability
for insert
to authenticated
with check (auth.uid() = provider_id);

create policy "Providers can update own availability"
on public.provider_availability
for update
to authenticated
using (auth.uid() = provider_id)
with check (auth.uid() = provider_id);

create policy "Providers can delete own availability"
on public.provider_availability
for delete
to authenticated
using (auth.uid() = provider_id);

insert into storage.buckets (id, name, public)
values ('provider-avatars', 'provider-avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view provider avatars" on storage.objects;
drop policy if exists "Providers can upload own avatars" on storage.objects;
drop policy if exists "Providers can update own avatars" on storage.objects;
drop policy if exists "Providers can delete own avatars" on storage.objects;

create policy "Public can view provider avatars"
on storage.objects
for select
to public
using (bucket_id = 'provider-avatars');

create policy "Providers can upload own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'provider-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Providers can update own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'provider-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'provider-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Providers can delete own avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'provider-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
