-- UK Visa Tracker: Phase 1 schema
-- Run this in the Supabase SQL editor

create extension if not exists "uuid-ossp";

-- One row per user profile (Supabase auth.users already handles login)
create table public.profiles (
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

create unique index profiles_unsubscribe_token_idx on public.profiles (unsubscribe_token);

-- A user can track multiple applications (self, family members)
create table public.applications (
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
create table public.timeline_events (
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
create table public.checklist_items (
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

-- Row Level Security: users can only see their own data
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.timeline_events enable row level security;
alter table public.checklist_items enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can manage own applications" on public.applications
  for all using (auth.uid() = owner_id);

create policy "Users can manage own timeline events" on public.timeline_events
  for all using (
    application_id in (select id from public.applications where owner_id = auth.uid())
  );

create policy "Users can manage own checklist items" on public.checklist_items
  for all using (
    application_id in (select id from public.applications where owner_id = auth.uid())
  );

-- Auto-create a profile row when someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Checklist sharing: a read-only, no-login-required summary of an
-- application's checklist/timeline progress, reachable via a random token
-- (app/shared/checklist/[token].tsx). Generated on-demand (nullable, not
-- defaulted) since most applications are never shared.
alter table public.applications
  add column share_token uuid;

create unique index applications_share_token_idx
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
-- has already gone out for a given application.
alter table public.applications
  add column biometrics_reminder_sent_at timestamptz,
  add column decision_reminder_sent_at timestamptz;

-- Extensions needed for calling Edge Functions from Postgres (welcome-email
-- trigger, daily reminder cron below).
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

create trigger on_profile_created_send_welcome
  after insert on public.profiles
  for each row execute procedure public.trigger_welcome_email();

-- Daily reminder sweep — biometrics-approaching + decision-approaching,
-- both computed inside the Edge Function. 09:00 UTC; adjust to taste.
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
