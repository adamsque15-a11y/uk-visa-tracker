-- UK Visa Tracker: transactional/reminder email infrastructure
-- Run via `supabase db push` (see supabase/README.md for the full deploy
-- sequence — this migration alone isn't enough to send real emails; it also
-- needs Vault secrets and Edge Function deploys, which can't be scripted
-- here since they depend on values that only exist after deployment).

-- 1. profiles: email mirror + reminder opt-in + unsubscribe token ----------
-- `email` is a denormalized copy of auth.users.email — Edge Functions query
-- `profiles` directly rather than needing service-role access into the
-- `auth` schema for every reminder send.
alter table public.profiles
  add column email text,
  add column email_reminders_opt_in boolean default true not null,
  add column unsubscribe_token uuid default uuid_generate_v4() not null;

create unique index profiles_unsubscribe_token_idx on public.profiles (unsubscribe_token);

-- 2. applications: de-dup flags so the daily cron sweep doesn't re-send --
alter table public.applications
  add column biometrics_reminder_sent_at timestamptz,
  add column decision_reminder_sent_at timestamptz;

-- 3. Capture email at signup time -----------------------------------------
-- Replaces the existing handle_new_user() (see the base schema) so it also
-- copies auth.users.email onto the new profiles row. The trigger that
-- calls this function already exists and doesn't need to change.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 4. Extensions needed for calling Edge Functions from Postgres -----------
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- 5. Welcome email — fired by a trigger on profiles insert ----------------
-- Kept separate from handle_new_user() itself: a transient network hiccup
-- calling the Edge Function must never roll back profile creation, and
-- `after insert` triggers on the same table run independently in sequence.
--
-- Reads the Edge Function URL and service-role key from Supabase Vault
-- (never hardcoded in SQL/logs) — see the one-off `vault.create_secret`
-- calls documented at the bottom of this file, which you run manually
-- AFTER deploying the Edge Functions (the URLs don't exist before that).
create or replace function public.trigger_welcome_email()
returns trigger as $$
declare
  fn_url text;
  service_key text;
begin
  select decrypted_secret into fn_url from vault.decrypted_secrets where name = 'welcome_email_url';
  select decrypted_secret into service_key from vault.decrypted_secrets where name = 'edge_function_service_role_key';

  if fn_url is null or service_key is null then
    -- Secrets not configured yet (e.g. fresh install before the post-deploy
    -- step) — skip rather than error, so signup itself is never blocked.
    return new;
  end if;

  perform net.http_post(
    url := fn_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key),
    body := jsonb_build_object('profile_id', new.id)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created_send_welcome
  after insert on public.profiles
  for each row execute procedure public.trigger_welcome_email();

-- 6. Daily reminder sweep — biometrics-approaching + decision-approaching -
-- 09:00 UTC; adjust to taste. Both reminder windows are day-granularity, so
-- once/day is enough — no need for a tighter schedule.
select cron.schedule(
  'send-reminder-emails-daily',
  '0 9 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'reminder_email_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'edge_function_service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 7. Unsubscribe — public, token-gated, no login required -----------------
-- Same narrow security-definer pattern as get_shared_checklist() in the
-- Checklist-sharing migration: the only thing this can ever do is flip one
-- boolean on the row matching the token.
create or replace function public.unsubscribe_by_token(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email_reminders_opt_in = false where unsubscribe_token = p_token;
  return found;
end;
$$;

grant execute on function public.unsubscribe_by_token(uuid) to anon;

-- ---------------------------------------------------------------------------
-- POST-DEPLOY STEP (run once, manually, in the SQL editor — not part of this
-- migration, since the values below don't exist until after
-- `supabase functions deploy` and you have your project's service role key):
--
--   select vault.create_secret('<service-role-key-from-project-settings>', 'edge_function_service_role_key', 'Used by pg_net to call Edge Functions');
--   select vault.create_secret('https://<project-ref>.functions.supabase.co/send-welcome-email', 'welcome_email_url', 'Welcome email Edge Function URL');
--   select vault.create_secret('https://<project-ref>.functions.supabase.co/send-reminder-emails', 'reminder_email_url', 'Reminder sweep Edge Function URL');
-- ---------------------------------------------------------------------------
