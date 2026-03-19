-- ============================================================
-- 1. Allow public read access for provider discovery pages
-- ============================================================
create policy "Anyone can view provider profiles"
  on public.provider_profiles
  for select
  using (true);

-- ============================================================
-- 2. Allow public read access for provider availability
-- ============================================================
create policy "Anyone can view provider availability"
  on public.provider_availability
  for select
  using (true);

-- ============================================================
-- 3. Provider reviews table
-- ============================================================
create table if not exists public.provider_reviews (
  id          uuid    default gen_random_uuid() primary key,
  provider_id uuid    references public.provider_profiles(id) on delete cascade not null,
  reviewer_id uuid    references auth.users(id)               on delete cascade not null,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamp with time zone default now(),
  unique (provider_id, reviewer_id)   -- one review per user per provider
);

alter table public.provider_reviews enable row level security;

create policy "anyone can view reviews"
  on public.provider_reviews
  for select
  using (true);

create policy "pet owners can write reviews"
  on public.provider_reviews
  for insert
  with check (auth.uid() = reviewer_id);

create policy "reviewers can delete own review"
  on public.provider_reviews
  for delete
  using (auth.uid() = reviewer_id);

-- ============================================================
-- 4. Provider search view (avg rating + review count)
-- ============================================================
create or replace view public.provider_search_view as
  select
    p.*,
    coalesce(avg(r.rating), 0)::numeric(3,1) as avg_rating,
    count(r.id)::integer                      as review_count
  from public.provider_profiles p
  left join public.provider_reviews r on r.provider_id = p.id
  group by p.id;

-- Grant read access to authenticated users
grant select on public.provider_search_view to authenticated;
grant select on public.provider_search_view to anon;
