// Thin wrapper around Resend's REST API — see
// https://resend.com/docs/api-reference/emails/send-email for the current
// request shape if this needs adjusting.

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Resend's own shared test sender — swap for a verified sending domain
// (e.g. "UK Visa Tracker <notifications@ukvisatracker.com>") before going
// live; Resend requires the domain to be DNS-verified first, so this can't
// just be typed in. The display name and reply-to are already real.
const FROM_ADDRESS = 'UK Visa Tracker <onboarding@resend.dev>';
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
