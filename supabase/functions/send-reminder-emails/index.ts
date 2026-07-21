// Invoked daily by the send-reminder-emails-daily pg_cron job (see
// supabase/migrations/20260718120000_email_infrastructure.sql). Two passes
// in one run: biometrics-approaching, then decision-approaching (using the
// same working-day math as the app itself — see ../_shared/workingDays.ts).
//
// NOTE: written against the Deno.serve API and @supabase/supabase-js@2 via
// esm.sh — re-check against https://supabase.com/docs/guides/functions if
// the runtime/embedding-query syntax has moved on since this was written.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { emailLayout } from '../_shared/emailLayout.ts';
import { sendEmail } from '../_shared/resendClient.ts';
import { addWorkingDays, parseISODate, loadBankHolidayDates, formatISODate } from '../_shared/workingDays.ts';
import { getTargetProcessingDays, VisaType, ApplicationLocation, ServiceSpeed } from '../_shared/visaLogic.ts';

// How many days out each reminder fires — biometrics is a hard appointment
// (short lead time is enough), decision is a rough estimate (worth a wider
// heads-up window since the date itself can shift).
const BIOMETRICS_REMINDER_WINDOW_DAYS = 3;
const DECISION_REMINDER_WINDOW_DAYS = 7;

interface ReminderProfile {
  email: string | null;
  unsubscribe_token: string;
  email_reminders_opt_in: boolean;
}

function daysUntil(target: Date, today: Date): number {
  return Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const siteUrl = Deno.env.get('SITE_URL') ?? '';
  const holidays = await loadBankHolidayDates();
  const today = new Date();

  let sent = 0;

  // ─────────────────────────── Biometrics approaching ───────────────────────────
  const { data: biometricsRows } = await supabase
    .from('applications')
    .select('id, biometrics_date, profiles(email, unsubscribe_token, email_reminders_opt_in)')
    .is('biometrics_reminder_sent_at', null)
    .not('biometrics_date', 'is', null);

  for (const row of biometricsRows ?? []) {
    const profile = row.profiles as unknown as ReminderProfile | null;
    if (!profile?.email || !profile.email_reminders_opt_in) continue;

    const biometricsDate = parseISODate(row.biometrics_date as string);
    if (!biometricsDate) continue;

    const daysAway = daysUntil(biometricsDate, today);
    if (daysAway < 0 || daysAway > BIOMETRICS_REMINDER_WINDOW_DAYS) continue;

    const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${profile.unsubscribe_token}`;
    await sendEmail({
      to: profile.email,
      subject: 'Your biometrics appointment is coming up',
      html: emailLayout({
        bodyHtml: `
          <h1 style="font-size:20px;color:#101828;margin:0 0 12px;">Your biometrics appointment is coming up</h1>
          <p style="margin:0 0 16px;">Your UK Visa Tracker record shows a biometrics date of <strong>${row.biometrics_date}</strong>. Make sure you have your appointment confirmation, current passport, and any documents your checklist asks for ready.</p>
          <a href="${siteUrl}" style="display:inline-block;background:#1a3c6e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View your checklist</a>
        `,
        unsubscribeUrl,
      }),
    });

    await supabase.from('applications').update({ biometrics_reminder_sent_at: new Date().toISOString() }).eq('id', row.id);
    sent++;
  }

  // ─────────────────────────── Decision approaching ───────────────────────────
  const { data: decisionRows } = await supabase
    .from('applications')
    .select('id, visa_type, biometrics_date, application_location, service_speed, profiles(email, unsubscribe_token, email_reminders_opt_in)')
    .is('decision_reminder_sent_at', null)
    .not('biometrics_date', 'is', null)
    .not('application_location', 'is', null)
    .not('service_speed', 'is', null);

  for (const row of decisionRows ?? []) {
    const profile = row.profiles as unknown as ReminderProfile | null;
    if (!profile?.email || !profile.email_reminders_opt_in) continue;

    const biometricsDate = parseISODate(row.biometrics_date as string);
    if (!biometricsDate) continue;

    const targetWorkingDays = getTargetProcessingDays(
      row.visa_type as VisaType,
      row.application_location as ApplicationLocation,
      row.service_speed as ServiceSpeed
    );
    const estimatedDecisionDate = addWorkingDays(biometricsDate, targetWorkingDays, holidays);
    const daysAway = daysUntil(estimatedDecisionDate, today);
    if (daysAway < 0 || daysAway > DECISION_REMINDER_WINDOW_DAYS) continue;

    const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${profile.unsubscribe_token}`;
    await sendEmail({
      to: profile.email,
      subject: 'Your decision may be coming soon',
      html: emailLayout({
        bodyHtml: `
          <h1 style="font-size:20px;color:#101828;margin:0 0 12px;">Your decision may be coming soon</h1>
          <p style="margin:0 0 16px;">Based on your biometrics date and the Home Office's published target processing time, your decision is estimated around <strong>${formatISODate(estimatedDecisionDate)}</strong>. This is an estimate based on published targets, not a guarantee.</p>
          <a href="${siteUrl}" style="display:inline-block;background:#1a3c6e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">View your progress</a>
        `,
        unsubscribeUrl,
      }),
    });

    await supabase.from('applications').update({ decision_reminder_sent_at: new Date().toISOString() }).eq('id', row.id);
    sent++;
  }

  return new Response(JSON.stringify({ sent }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
