-- In-app account deletion. Removing a row from auth.users needs privileges the
-- browser must never hold, so the work runs in a security-definer function that
-- can only ever delete the caller's own account. The service-role key stays out
-- of the client.
create or replace function public.delete_nur_islam_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- The tables cascade from auth.users, but deleting them explicitly keeps the
  -- intent readable and survives a future change to the foreign keys.
  delete from public.nur_islam_notes where user_id = current_user_id;
  delete from public.nur_islam_user_state where user_id = current_user_id;
  delete from public.nur_islam_profiles where user_id = current_user_id;
  delete from auth.users where id = current_user_id;
end;
$$;

revoke all privileges on function public.delete_nur_islam_account() from public, anon;
grant execute on function public.delete_nur_islam_account() to authenticated;

-- A single cloud backup row is one unbounded JSON blob per user. Cap it so a
-- runaway local state cannot grow the table without limit.
alter table public.nur_islam_user_state
  drop constraint if exists nur_islam_user_state_payload_size;
alter table public.nur_islam_user_state
  add constraint nur_islam_user_state_payload_size
  check (pg_column_size(payload) <= 1048576);
