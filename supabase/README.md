# Email infrastructure — deploy guide

This directory (`migrations/`, `functions/`) implements the welcome email
and biometrics/decision-date reminder emails described in the app. None of
it is live yet — it needs to be deployed to your actual Supabase project via
the steps below. It was written and typechecked (`deno check`, if you have
the Deno CLI locally) but **not deployed or sent from a real inbox** —
that's the one part of this that only you can do, since it needs your
Supabase project's access token and a Resend API key.

## What's here

- `migrations/20260718120000_email_infrastructure.sql` — adds the new
  columns (`profiles.email`, `email_reminders_opt_in`, `unsubscribe_token`;
  `applications.biometrics_reminder_sent_at`, `decision_reminder_sent_at`),
  extends the signup trigger to capture email, enables `pg_net`/`pg_cron`,
  and schedules the daily reminder sweep.
- `functions/send-welcome-email/` — fires once, right after signup.
- `functions/send-reminder-emails/` — runs daily via cron; checks both
  biometrics-approaching (3-day window) and decision-approaching (7-day
  window, computed with the same working-day math as the app itself).
- `functions/unsubscribe/` — the link in every email's footer; flips one
  flag, no login required.
- `functions/delete-account/` — "Delete my account" on the Privacy & Data
  page. Verifies the caller's JWT, then uses the service-role key to call
  the Admin API and delete their `auth.users` row — every other table
  (`profiles`, `applications`, `checklist_items`, `timeline_events`)
  cascades from there (see `lib/schema.sql`), so nothing else needs to run.
- `functions/_shared/` — email template/layout, Resend API wrapper, and a
  Deno port of the working-days calculation (duplicated from `lib/`, not
  imported — Edge Functions bundle independently of the Expo app).

## Deploy steps

```bash
# 1. One-time setup
npm install -g supabase   # or your preferred install method
supabase login
supabase link --project-ref <your-project-ref>

# 2. Apply the migration
supabase db push

# 3. Deploy the functions
supabase functions deploy send-welcome-email
supabase functions deploy send-reminder-emails
supabase functions deploy unsubscribe
supabase functions deploy delete-account

# 4. Set the Resend API key as a function secret
supabase secrets set RESEND_API_KEY=<your-resend-api-key>
# SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY are injected
# automatically into every Edge Function — nothing to set for those.
```

## 5. Post-deploy SQL (run once, in the Supabase SQL editor)

The migration references three Vault secrets that don't exist until *after*
steps 1–3 above (the function URLs aren't known before deploy). Run this
once, filling in your real project ref and service role key (Project
Settings → API):

```sql
select vault.create_secret(
  '<service-role-key-from-project-settings>',
  'edge_function_service_role_key',
  'Used by pg_net to call Edge Functions'
);
select vault.create_secret(
  'https://<project-ref>.functions.supabase.co/send-welcome-email',
  'welcome_email_url',
  'Welcome email Edge Function URL'
);
select vault.create_secret(
  'https://<project-ref>.functions.supabase.co/send-reminder-emails',
  'reminder_email_url',
  'Reminder sweep Edge Function URL'
);
```

Until these three secrets exist, `trigger_welcome_email()` silently no-ops
(checked explicitly in the function body) rather than erroring — so
deploying the migration before this step won't break signups, welcome
emails just won't send yet.

## 6. Verified sending domain

Resend's shared `onboarding@resend.dev` sender (already set in
`functions/_shared/resendClient.ts`) works for testing without any extra
setup, but has stricter sending limits and doesn't look like it's really
from you. Before relying on this for real users, verify your own domain in
the [Resend dashboard](https://resend.com/domains) and update
`FROM_ADDRESS` in `_shared/resendClient.ts`.

## Testing without waiting for cron

- **Welcome email**: sign up a new test account — the trigger fires
  immediately.
- **Reminder sweep**: it's just an HTTP endpoint, so you can invoke it
  directly instead of waiting for the 09:00 UTC cron:
  ```bash
  curl -X POST https://<project-ref>.functions.supabase.co/send-reminder-emails \
    -H "Authorization: Bearer <service-role-key>"
  ```
  Set an application's `biometrics_date` to within the next 3 days (and
  clear `biometrics_reminder_sent_at` if you've already triggered it once)
  to see it pick that row up.

## Testing account deletion end-to-end

This can't be verified from the sandbox this was built in (no live Supabase
project access there) — run this yourself once `delete-account` is deployed:

1. Create a throwaway test account (sign up with a real or disposable
   email you can access).
2. Add an application, generate a checklist, and check off a few items —
   give it real data to delete.
3. In the app, go to **Privacy & Data → Delete my account**, type `delete`
   to confirm, and submit.
4. In the Supabase dashboard's **Table Editor** (or **Authentication →
   Users**), confirm:
   - The user no longer appears under Authentication → Users.
   - No matching row remains in `profiles`, `applications`,
     `checklist_items`, or `timeline_events` for that user — the cascade
     from `auth.users` should have removed all of them automatically.
5. Confirm you're signed out and landed back on the public Home page, and
   that signing in again with the deleted account's credentials fails.

If step 4 finds any leftover rows, the cascade chain in `lib/schema.sql`
needs checking — it shouldn't be possible given the `on delete cascade`
foreign keys already in place, but this is the way to catch it if a future
schema change breaks that.

## Testing password reset end-to-end

Password reset uses Supabase Auth's built-in email sending directly (not
the Resend setup above), so it works as soon as a project exists — no
function deploy needed. To verify:

1. From **Sign In**, tap **Forgot password?**, enter a real test account's
   email, and submit.
2. Check that inbox (and spam folder) for the reset email.
3. Click the link — it should land on `/auth/reset-password` and show the
   new-password form (not bounce to the dashboard or show "invalid link").
4. Set a new password, confirm the success screen appears, then sign in
   again with the new password to confirm it actually took effect.
5. Try reusing the same link a second time — it should show "invalid or
   expired" (Supabase recovery tokens are single-use).

If step 2 never arrives, check **Authentication → Email Templates** in the
Supabase dashboard — by default Supabase sends from its own shared sender
with fairly low rate limits, fine for testing but worth swapping for a
custom SMTP provider before relying on this for real users.

## Known limitations

- The Deno port of the working-days calculation in `_shared/workingDays.ts`
  has no cache (unlike the app's `lib/bankHolidays.ts`, which uses
  AsyncStorage) — it fetches the gov.uk bank holidays feed fresh on every
  invocation. Fine at once-daily cron frequency; would need a cache (e.g. a
  small Postgres table) if the sweep ever ran more often.
- `PROCESSING_TIME_WORKING_DAYS` in `_shared/visaLogic.ts` is a manual copy
  of the same table in `lib/visaLogic.ts` — if the processing-time targets
  ever change in the app, update both.
- Reminder windows (3 days for biometrics, 7 days for decision) are
  hardcoded constants in `send-reminder-emails/index.ts` — adjust there if
  you want different lead times.
