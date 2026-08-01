-- UK Visa Tracker: one-time backfill for auth.users rows with no matching
-- public.profiles row.
--
-- Cause: handle_new_user() (the trigger that inserts a profiles row on
-- signup) didn't exist yet at the time these users originally signed up —
-- lib/schema.sql hadn't been run against production yet. Their auth.users
-- row is real, but they have no profiles row, which is what
-- applications_owner_id_fkey requires (applications.owner_id references
-- public.profiles(id), not auth.users(id) directly) — so any of these
-- users trying to create an application hits a foreign key violation.
--
-- Safety guarantee: this only INSERTs. It never updates, deletes, or
-- otherwise touches a profiles row that already exists — both by the
-- `where not exists (...)` filter (only auth.users rows with no matching
-- profiles.id are selected at all) and, as a second, independent safety
-- net, `on conflict (id) do nothing` (if a row somehow already existed for
-- an id this selected, the insert for that row is silently skipped rather
-- than erroring or overwriting). Between the two, this cannot overwrite
-- existing data even if run more than once.
--
-- Mirrors handle_new_user()'s own logic exactly, so a backfilled row looks
-- like the trigger would have produced it at signup time: `full_name`
-- comes from the same `raw_user_meta_data->>'full_name'` the trigger
-- reads (naturally null if that key was never set, matching "leave it
-- blank if not available"), and `email` is copied from auth.users.email.
-- Every other column (`premium`, `email_reminders_opt_in`,
-- `unsubscribe_token`, `created_at`) is left to its table default, exactly
-- as handle_new_user() itself does by not naming them in its own insert.
--
-- ---------------------------------------------------------------------------
-- STEP 0 (optional, read-only): run this by itself first to see how many
-- users this will actually affect, before inserting anything.
--
--   select count(*) from auth.users u
--   where not exists (select 1 from public.profiles p where p.id = u.id);
-- ---------------------------------------------------------------------------

insert into public.profiles (id, full_name, email)
select
  u.id,
  u.raw_user_meta_data->>'full_name',
  u.email
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- STEP 2 (optional, read-only): run after the insert above to confirm
-- every auth.users row now has a matching profiles row. This should
-- return 0.
--
--   select count(*) from auth.users u
--   where not exists (select 1 from public.profiles p where p.id = u.id);
-- ---------------------------------------------------------------------------
