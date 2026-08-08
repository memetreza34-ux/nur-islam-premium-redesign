-- In-app erasure for Nur Islam.
--
-- This Supabase project hosts several apps that share one auth.users row, and
-- other apps' tables cascade from it. Deleting the auth user from inside Nur
-- Islam would therefore destroy unrelated data, so erasure is scoped to the
-- Nur Islam tables and the login itself is left alone.
--
-- The function runs as the caller rather than as definer: row level security
-- then applies on top of the explicit user_id filter, so it cannot reach
-- another account's rows even if auth.uid() were ever wrong.
drop function if exists public.delete_nur_islam_account();

create or replace function public.delete_nur_islam_data()
returns void
language plpgsql
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  delete from public.nur_islam_notes where user_id = current_user_id;
  delete from public.nur_islam_user_state where user_id = current_user_id;
  delete from public.nur_islam_profiles where user_id = current_user_id;
end;
$$;

revoke all privileges on function public.delete_nur_islam_data() from public, anon;
grant execute on function public.delete_nur_islam_data() to authenticated;

-- A single cloud backup row is one unbounded JSON blob per user. Cap it so a
-- runaway local state cannot grow the table without limit.
alter table public.nur_islam_user_state
  drop constraint if exists nur_islam_user_state_payload_size;
alter table public.nur_islam_user_state
  add constraint nur_islam_user_state_payload_size
  check (pg_column_size(payload) <= 1048576);
