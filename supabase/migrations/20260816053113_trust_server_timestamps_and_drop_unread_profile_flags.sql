-- Two pieces of tidying that a security and consistency pass turned up.
--
-- 1. Three profile columns were written but never read back. `theme` always
--    said 'dark', `prayer_notifications` always said false and `cloud_sync`
--    always said true, no matter what the user had chosen, because the app
--    keeps those settings in local storage and ships them inside the
--    nur_islam_user_state payload. A column that contradicts the app is worse
--    than no column, so they go. display_name and language stay: those are
--    read.
--
-- 2. `updated_at` was supplied by the client on every write, which meant the
--    now() defaults never ran and the column carried device time. That makes
--    "last backed up" a claim the device gets to invent, and it left
--    client_updated_at — the column that exists precisely to hold device time —
--    holding the same value twice. A trigger now owns updated_at on all three
--    tables, so the two columns finally mean what their names say.

alter table public.nur_islam_profiles
  drop column if exists theme,
  drop column if exists prayer_notifications,
  drop column if exists cloud_sync;

create or replace function public.nur_islam_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists nur_islam_profiles_touch_updated_at on public.nur_islam_profiles;
create trigger nur_islam_profiles_touch_updated_at
  before insert or update on public.nur_islam_profiles
  for each row execute function public.nur_islam_touch_updated_at();

drop trigger if exists nur_islam_user_state_touch_updated_at on public.nur_islam_user_state;
create trigger nur_islam_user_state_touch_updated_at
  before insert or update on public.nur_islam_user_state
  for each row execute function public.nur_islam_touch_updated_at();

drop trigger if exists nur_islam_notes_touch_updated_at on public.nur_islam_notes;
create trigger nur_islam_notes_touch_updated_at
  before insert or update on public.nur_islam_notes
  for each row execute function public.nur_islam_touch_updated_at();

-- The trigger fires as the table owner, so no client role needs to be able to
-- call the function directly.
revoke all privileges on function public.nur_islam_touch_updated_at() from public, anon, authenticated;
