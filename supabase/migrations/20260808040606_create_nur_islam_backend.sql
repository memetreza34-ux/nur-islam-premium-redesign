create table if not exists public.nur_islam_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Nur Nutzer' check (char_length(display_name) between 1 and 80),
  theme text not null default 'dark' check (theme in ('dark','light','system')),
  language text not null default 'de' check (language = 'de'),
  prayer_notifications boolean not null default false,
  cloud_sync boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nur_islam_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 1 check (schema_version > 0),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  client_updated_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nur_islam_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '' check (char_length(title) <= 160),
  body text not null default '' check (char_length(body) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nur_islam_notes_user_updated_idx on public.nur_islam_notes(user_id, updated_at desc);

alter table public.nur_islam_profiles enable row level security;
alter table public.nur_islam_user_state enable row level security;
alter table public.nur_islam_notes enable row level security;

-- Supabase projects can inherit broad default table privileges. Reset frontend
-- roles explicitly so authenticated clients get CRUD only; RLS then scopes rows.
revoke all privileges on table public.nur_islam_profiles from anon, authenticated;
revoke all privileges on table public.nur_islam_user_state from anon, authenticated;
revoke all privileges on table public.nur_islam_notes from anon, authenticated;
grant select, insert, update, delete on table public.nur_islam_profiles to authenticated;
grant select, insert, update, delete on table public.nur_islam_user_state to authenticated;
grant select, insert, update, delete on table public.nur_islam_notes to authenticated;

-- Each policy is dropped first so this file can be replayed against a database
-- that already carries part of it, the same way the tables above are guarded.
-- `create policy` has no `if not exists` form.
drop policy if exists "nur_islam_profiles_select_own" on public.nur_islam_profiles;
create policy "nur_islam_profiles_select_own" on public.nur_islam_profiles for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_profiles_insert_own" on public.nur_islam_profiles;
create policy "nur_islam_profiles_insert_own" on public.nur_islam_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_profiles_update_own" on public.nur_islam_profiles;
create policy "nur_islam_profiles_update_own" on public.nur_islam_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_profiles_delete_own" on public.nur_islam_profiles;
create policy "nur_islam_profiles_delete_own" on public.nur_islam_profiles for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "nur_islam_state_select_own" on public.nur_islam_user_state;
create policy "nur_islam_state_select_own" on public.nur_islam_user_state for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_state_insert_own" on public.nur_islam_user_state;
create policy "nur_islam_state_insert_own" on public.nur_islam_user_state for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_state_update_own" on public.nur_islam_user_state;
create policy "nur_islam_state_update_own" on public.nur_islam_user_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_state_delete_own" on public.nur_islam_user_state;
create policy "nur_islam_state_delete_own" on public.nur_islam_user_state for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "nur_islam_notes_select_own" on public.nur_islam_notes;
create policy "nur_islam_notes_select_own" on public.nur_islam_notes for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_notes_insert_own" on public.nur_islam_notes;
create policy "nur_islam_notes_insert_own" on public.nur_islam_notes for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_notes_update_own" on public.nur_islam_notes;
create policy "nur_islam_notes_update_own" on public.nur_islam_notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "nur_islam_notes_delete_own" on public.nur_islam_notes;
create policy "nur_islam_notes_delete_own" on public.nur_islam_notes for delete to authenticated using ((select auth.uid()) = user_id);
