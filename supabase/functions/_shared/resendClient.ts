// Thin wrapper around Resend's REST API — see
// https://resend.com/docs/api-reference/emails/send-email for the current
// request shape if this needs adjusting.

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// ukvisatracker.com is now DNS-verified in Resend (DKIM/SPF confirmed) —
// switched off Resend's shared onboarding@resend.dev test sender, which
// only accepts sends to the Resend account's own address and silently
// 403s on anyone else (see resendClient's soft-fail below — that's how
// this went unnoticed until checked against the Edge Function logs
// directly). notifications@ up here, support@ as the reply-to below,
// matching the support@ convention already used for contact links
// elsewhere (see lib/legalConfig.ts) — replies land in the inbox someone
// actually reads, not a no-reply address.
const FROM_ADDRESS = 'UK Visa Tracker <notifications@ukvisatracker.com>';
const REPLY_TO_ADDRESS = 'support@ukvisatracker.com';

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping send to', to);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html, reply_to: REPLY_TO_ADDRESS }),
  });

  if (!response.ok) {
    // Soft-fail: log and move on rather than throwing, so one bad address
    // doesn't take down the rest of a batch send in the reminder sweep.
    console.error('Resend send failed', response.status, await response.text());
  }
}
