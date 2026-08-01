-- UK Visa Tracker: idempotent, safe-to-rerun version of lib/schema.sql
--
-- Purpose: lib/schema.sql errored partway through on a production database
-- where `public.profiles` already existed (42P07: relation "profiles"
-- already exists), which meant everything after that statement — the
-- applications/timeline_events/checklist_items tables, RLS policies,
-- triggers, and functions — never ran. This file has the exact same end
-- state as lib/schema.sql, but every statement is written so it can be run
-- against a database where some objects already exist without erroring,
-- and re-run safely if it's interrupted again.
--
-- Safety guarantee: nothing in this file drops or alters an existing
-- table, column, or row of data. Every table creation uses
-- `create table if not exists` (skipped entirely if the table is already
-- there — its existing column structure is never inspected or touched).
-- Policies and triggers are dropped and recreated (that's just
-- rule/logic, not data), which is the standard safe way to make those
-- idempotent since Postgres has no `create policy if not exists`.
--
-- This is NOT a replacement for lib/schema.sql — that file remains the
-- canonical source of the schema. This is a one-time recovery script for
-- finishing an interrupted first run. Once your database is fully caught
-- up, you shouldn't need this file again.
--
-- ---------------------------------------------------------------------------
-- STEP 0 (optional, read-only, run by itself first if you want to check
-- before proceeding): confirms exactly which columns your existing
-- `profiles` table has. This script does NOT alter `profiles` at all, per
-- your instruction — but two later statements (the unsubscribe_token
-- index, and the handle_new_user() trigger function) reference columns
-- that are only safe to assume exist if profiles was created from a
-- reasonably current version of lib/schema.sql. Run this now if you want
-- to confirm that before proceeding; the rest of the script also flags
-- this at the relevant points instead of guessing.
--
--   select column_name from information_schema.columns
--   where table_schema = 'public' and table_name = 'profiles'
--   order by ordinal_position;
--
-- Expected columns if profiles is fully up to date: id, full_name,
-- premium, email, email_reminders_opt_in, unsubscribe_token, created_at.
-- ---------------------------------------------------------------------------

create extension if not exists "uuid-ossp";

-- One row per user profile (Supabase auth.users already handles login).
-- Uses IF NOT EXISTS so this is a pure no-op if `profiles` already exists —
-- its existing columns are never inspected or altered by this script.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  -- Free vs. premium IELTS A1 tier. No payment processor is wired up yet —
  -- this only exists so the gating logic and UI have a real field to read.
  premium boolean default false not null,
  -- Denormalized copy of auth.users.email, set by handle_new_user() below —
  -- lets the reminder-email Edge Function query profiles alone rather than
  -- needing service-role access into the auth schema on every send.
  email text,
  email_reminders_opt_in boolean default true not null,
  unsubscribe_token uuid default uuid_generate_v4() not null,
  created_at timestamptz default now()
);

-- Guarded rather than a plain `create unique index if not exists`: if
-- `profiles` already existed before this script ran, it might predate the
-- unsubscribe_token column (that column was added to profiles at a later
-- point in this project's history — see supabase/migrations/). Creating
-- an index on a column that doesn't exist would error and stop the whole
-- script, so this checks first and just reports what it did instead.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'unsubscribe_token'
  ) then
    execute 'create unique index if not exists profiles_unsubscribe_token_idx on public.profiles (unsubscribe_token)';
  else
    raise notice 'Skipped profiles_unsubscribe_token_idx: public.profiles has no unsubscribe_token column. If email unsubscribe links need to work, that column needs adding to profiles manually first — this script deliberately does not alter profiles (see STEP 0 above to check its current columns).';
  end if;
end
$$;

-- A user can track multiple applications (self, family members).
-- Created here with its original base columns only (matching the point in
-- lib/schema.sql's history before share_token / the reminder-sent columns
-- existed) — those are added just below via ADD COLUMN IF NOT EXISTS, so
-- this table ends up complete however much of it already exists: fully
-- missing, base-only, or already complete are all handled correctly.
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  applicant_name text not null,
  nationality text,
  country_applying_from text,
  visa_type text not null check (visa_type in ('spouse', 'skilled_worker', 'student', 'visitor')),
  relationship_status text,
  children_count integer default 0 not null,
  income numeric,
  income_country text, -- 'uk' or 'overseas', affects financial evidence checklist
  sponsor_name text,
  current_visa_status text,
  biometrics_date date,
  application_location text check (application_location in ('outside_uk', 'inside_uk')),
  service_speed text check (service_speed in ('standard', 'priority')),
  application_submitted_date date,
  skip_checklist boolean default false not null, -- true for "Track My Visa" quick setups, which never show the personal documents checklist
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Timeline stages per application
create table if not exists public.timeline_events (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  stage text not null check (stage in (
    'submitted', 'biometrics', 'received', 'processing', 'decision_made'
  )),
  completed boolean default false,
  completed_date date,
  created_at timestamptz default now()
);

-- Checklist items generated per application
create table if not exists public.checklist_items (
  id uuid default uuid_generate_v4() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  item_key text not null, -- e.g. 'passport', 'marriage_certificate'
  label text not null,
  explanation text,
  requirements text[],
  examples text[],
  common_mistakes text[],
  is_complete boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security: users can only see their own data. Enabling RLS that's
-- already enabled is a no-op in Postgres, not an error — safe to rerun as-is.
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.timeline_events enable row level security;
alter table public.checklist_items enable row level security;

-- Postgres has no `create policy if not exists`, so each policy is dropped
-- (if it exists) and recreated. This only affects the policy's rule
-- definition, never any table, column, or row of data.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can manage own applications" on public.applications;
create policy "Users can manage own applications" on public.applications
  for all using (auth.uid() = owner_id);

drop policy if exists "Users can manage own timeline events" on public.timeline_events;
create policy "Users can manage own timeline events" on public.timeline_events
  for all using (
    application_id in (select id from public.applications where owner_id = auth.uid())
  );

drop policy if exists "Users can manage own checklist items" on public.checklist_items;
create policy "Users can manage own checklist items" on public.checklist_items
  for all using (
    application_id in (select id from public.applications where owner_id = auth.uid())
  );

-- Auto-create a profile row when someone signs up.
--
-- FLAGGED RISK: this INSERT references profiles.full_name and
-- profiles.email. If your existing `profiles` table predates those columns
-- (see STEP 0 at the top of this file), Postgres will likely reject this
-- CREATE OR REPLACE FUNCTION statement at parse time with a "column ...
-- does not exist" error, since Postgres checks a plpgsql function body's
-- embedded SQL against the referenced tables when the function is created.
-- If that happens here: stop, don't rerun blindly, and get the exact
-- column list from STEP 0's query so the insert list below can be
-- adjusted to match what profiles actually has — this script deliberately
-- does not alter profiles itself to add any missing columns.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Postgres before v14 has no `create or replace trigger`, so this is
-- dropped (if it exists) and recreated for broad compatibility. Only
-- affects the trigger definition, not auth.users itself or its rows.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Checklist sharing: a read-only, no-login-required summary of an
-- application's checklist/timeline progress, reachable via a random token
-- (app/shared/checklist/[token].tsx). Generated on-demand (nullable, not
-- defaulted) since most applications are never shared.
--
-- ADD COLUMN IF NOT EXISTS is purely additive (it does nothing if the
-- column is already there, and never touches existing rows/columns) —
-- this is what correctly backfills share_token onto `applications`
-- whichever state that table was already in.
alter table public.applications
  add column if not exists share_token uuid;

create unique index if not exists applications_share_token_idx
  on public.applications (share_token)
  where share_token is not null;

-- Owner-only: mints (or returns the existing) share token for one of the
-- caller's own applications. security definer so it can write despite the
-- applications RLS policy; ownership is still checked explicitly below, so
-- this can't be used to touch someone else's row.
create or replace function public.set_application_share_token(p_application_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  result uuid;
begin
  update public.applications
  set share_token = coalesce(share_token, uuid_generate_v4())
  where id = p_application_id and owner_id = auth.uid()
  returning share_token into result;

  if result is null then
    raise exception 'application not found or not owned by caller';
  end if;

  return result;
end;
$$;

-- GRANT is idempotent — granting a privilege that's already granted is a
-- no-op, not an error.
grant execute on function public.set_application_share_token(uuid) to authenticated;

-- Anonymous, token-gated: returns ONLY the fields needed for a read-only
-- progress summary — never applicant_name, nationality, income, or any
-- other personal/financial detail. This is the one deliberate crack in RLS
-- opened for public sharing; every other table/column stays fully private.
create or replace function public.get_shared_checklist(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  app record;
  result json;
begin
  select id, visa_type, application_location, service_speed, biometrics_date
  into app
  from public.applications
  where share_token = p_token;

  if not found then
    return null;
  end if;

  select json_build_object(
    'visa_type', app.visa_type,
    'application_location', app.application_location,
    'service_speed', app.service_speed,
    'biometrics_date', app.biometrics_date,
    'checklist_items', (
      select coalesce(json_agg(json_build_object('label', label, 'is_complete', is_complete) order by created_at), '[]'::json)
      from public.checklist_items
      where application_id = app.id
    ),
    'timeline_events', (
      select coalesce(json_agg(json_build_object('stage', stage, 'completed', completed, 'completed_date', completed_date) order by created_at), '[]'::json)
      from public.timeline_events
      where application_id = app.id
    )
  ) into result;

  return result;
end;
$$;

grant execute on function public.get_shared_checklist(uuid) to anon;

-- Email reminders: de-dup flags so the daily cron sweep (see
-- supabase/functions/send-reminder-emails) doesn't re-send once a reminder
-- has already gone out for a given application. Additive/backfill only,
-- same reasoning as share_token above.
alter table public.applications
  add column if not exists biometrics_reminder_sent_at timestamptz,
  add column if not exists decision_reminder_sent_at timestamptz;

-- Extensions needed for calling Edge Functions from Postgres (welcome-email
-- trigger, daily reminder cron below). Already idempotent as written.
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Welcome email — fired by a trigger on profiles insert, kept separate from
-- handle_new_user() itself so a transient network hiccup calling the Edge
-- Function can never roll back profile creation. Reads the Edge Function
-- URL and service-role key from Supabase Vault (see the POST-DEPLOY STEP at
-- the bottom of this file) rather than hardcoding them in SQL.
create or replace function public.trigger_welcome_email()
returns trigger as $$
declare
  fn_url text;
  service_key text;
begin
  select decrypted_secret into fn_url from vault.decrypted_secrets where name = 'welcome_email_url';
  select decrypted_secret into service_key from vault.decrypted_secrets where name = 'edge_function_service_role_key';

  if fn_url is null or service_key is null then
    return new; -- secrets not configured yet — never block signup on this
  end if;

  perform net.http_post(
    url := fn_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || service_key),
    body := jsonb_build_object('profile_id', new.id)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_created_send_welcome on public.profiles;
create trigger on_profile_created_send_welcome
  after insert on public.profiles
  for each row execute procedure public.trigger_welcome_email();

-- Daily reminder sweep — biometrics-approaching + decision-approaching,
-- both computed inside the Edge Function. 09:00 UTC; adjust to taste.
-- The named 3-argument form of cron.schedule() is upsert-safe by job name
-- (rerunning it with the same 'send-reminder-emails-daily' name updates
-- the existing job rather than creating a duplicate), so this is already
-- safe to rerun as-is.
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

-- Unsubscribe — public, token-gated, no login required. Same narrow
-- security-definer pattern as get_shared_checklist() above: the only thing
-- this can ever do is flip one boolean on the row matching the token.
--
-- Same flagged risk as handle_new_user() above: this UPDATE references
-- profiles.email_reminders_opt_in and profiles.unsubscribe_token. If
-- profiles predates those columns, this CREATE OR REPLACE FUNCTION
-- statement will likely fail the same way — check STEP 0 first if unsure.
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
-- POST-DEPLOY STEP (run once, manually, in the SQL editor — not part of the
-- script above, since these values don't exist until after
-- `supabase functions deploy` and you have your project's service role key):
--
--   select vault.create_secret('<service-role-key-from-project-settings>', 'edge_function_service_role_key', 'Used by pg_net to call Edge Functions');
--   select vault.create_secret('https://<project-ref>.functions.supabase.co/send-welcome-email', 'welcome_email_url', 'Welcome email Edge Function URL');
--   select vault.create_secret('https://<project-ref>.functions.supabase.co/send-reminder-emails', 'reminder_email_url', 'Reminder sweep Edge Function URL');
-- ---------------------------------------------------------------------------
