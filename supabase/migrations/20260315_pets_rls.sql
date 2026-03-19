create extension if not exists pgcrypto;

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  age_years numeric,
  weight_kg numeric,
  gender text,
  blood_type text,
  color text,
  microchip_id text,
  is_vaccinated boolean not null default false,
  medical_notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

drop policy if exists "Pet owners can view own pets" on public.pets;
drop policy if exists "Pet owners can insert own pets" on public.pets;
drop policy if exists "Pet owners can update own pets" on public.pets;
drop policy if exists "Pet owners can delete own pets" on public.pets;

create policy "Pet owners can view own pets"
on public.pets
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Pet owners can insert own pets"
on public.pets
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Pet owners can update own pets"
on public.pets
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Pet owners can delete own pets"
on public.pets
for delete
to authenticated
using (auth.uid() = owner_id);

insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view pet photos" on storage.objects;
drop policy if exists "Authenticated users can upload own pet photos" on storage.objects;
drop policy if exists "Authenticated users can update own pet photos" on storage.objects;
drop policy if exists "Authenticated users can delete own pet photos" on storage.objects;

create policy "Public can view pet photos"
on storage.objects
for select
to public
using (bucket_id = 'pet-photos');

create policy "Authenticated users can upload own pet photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users can update own pet photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authenticated users can delete own pet photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);