-- ============================================================
-- Migration: community_post_replies
-- App:       PawConnect
-- Date:      2026-04-10
-- ============================================================

create table if not exists public.community_post_replies (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.community_posts(id) on delete cascade,
  author_id  uuid        not null references auth.users(id) on delete cascade,
  content    text        not null check (char_length(content) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_post_replies_post_id_idx
  on public.community_post_replies (post_id, created_at);

alter table public.community_post_replies enable row level security;

create policy "Anyone can view replies"
  on public.community_post_replies for select
  using (true);

create policy "Authenticated users can reply"
  on public.community_post_replies for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can edit own replies"
  on public.community_post_replies for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Authors can delete own replies"
  on public.community_post_replies for delete
  to authenticated
  using (auth.uid() = author_id);

-- Auto-update updated_at
drop trigger if exists community_post_replies_set_updated_at on public.community_post_replies;
create trigger community_post_replies_set_updated_at
  before update on public.community_post_replies
  for each row execute function public.set_updated_at();
