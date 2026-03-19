create table if not exists public.community_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  tags text[],
  post_type text check (post_type in (
    'question','tip','story','blood_request','lost_found'
  )) default 'question',
  is_resolved boolean default false,
  view_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.community_posts enable row level security;

create policy "anyone can view posts"
  on public.community_posts for select using (true);

create policy "authenticated users can post"
  on public.community_posts for insert
  with check (auth.uid() = author_id);

create policy "authors can edit own posts"
  on public.community_posts for update
  using (auth.uid() = author_id);
