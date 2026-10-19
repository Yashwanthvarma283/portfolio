-- Run once in the Supabase SQL editor.
-- Model: everyone can READ the portfolio; only the single owner account can WRITE.

-- 1) Who is the owner? Holds one row, unreadable from the browser.
create table if not exists public.site_owner (
  id uuid primary key references auth.users (id) on delete cascade
);
alter table public.site_owner enable row level security;   -- no policies = no direct access

-- 2) is_owner(): lets the site ask "is the signed-in user the owner?" without reading the table.
create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.site_owner where id = auth.uid());
$$;
revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to anon, authenticated;

-- 3) Portfolio content: one JSON document per section (profile, skills, experience,
--    projects, capstones, credentials). The site falls back to its built-in data if a key is missing.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "content is public to read" on public.site_content;
create policy "content is public to read"
  on public.site_content for select using (true);

drop policy if exists "owner can insert content" on public.site_content;
create policy "owner can insert content"
  on public.site_content for insert with check (public.is_owner());

drop policy if exists "owner can update content" on public.site_content;
create policy "owner can update content"
  on public.site_content for update using (public.is_owner()) with check (public.is_owner());

drop policy if exists "owner can delete content" on public.site_content;
create policy "owner can delete content"
  on public.site_content for delete using (public.is_owner());

-- 4) Storage for certificates, project screenshots and the resume (public read, owner write).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "portfolio files public read" on storage.objects;
create policy "portfolio files public read"
  on storage.objects for select using (bucket_id = 'portfolio');

drop policy if exists "owner uploads" on storage.objects;
create policy "owner uploads"
  on storage.objects for insert with check (bucket_id = 'portfolio' and public.is_owner());

drop policy if exists "owner updates files" on storage.objects;
create policy "owner updates files"
  on storage.objects for update using (bucket_id = 'portfolio' and public.is_owner());

drop policy if exists "owner deletes files" on storage.objects;
create policy "owner deletes files"
  on storage.objects for delete using (bucket_id = 'portfolio' and public.is_owner());

-- 5) AFTER creating your user in Authentication > Users, register it as the owner:
--    insert into public.site_owner (id) select id from auth.users where email = 'YOUR_EMAIL_HERE';
