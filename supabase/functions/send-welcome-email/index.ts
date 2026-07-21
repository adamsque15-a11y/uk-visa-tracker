// Triggered by the on_profile_created_send_welcome trigger (see
// supabase/migrations/20260718120000_email_infrastructure.sql) right after
// a new profile row is created. Body: { profile_id: string }.
//
// NOTE: written against the Deno.serve API and @supabase/supabase-js@2 via
// esm.sh, the current standard pattern for Supabase Edge Functions as of
// this file's last review — re-check against
// https://supabase.com/docs/guides/functions if the runtime has changed.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { emailLayout } from '../_shared/emailLayout.ts';
import { sendEmail } from '../_shared/resendClient.ts';

Deno.serve(async (req) => {
  try {
    const { profile_id } = await req.json();
    if (!profile_id) return new Response('Missing profile_id', { status: 400 });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, unsubscribe_token')
      .eq('id', profile_id)
      .single();

    // No email on the profile yet, or it's already been removed — nothing
    // to send, not an error.
    if (!profile?.email) return new Response('OK — no email on profile', { status: 200 });

    const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${profile.unsubscribe_token}`;
    const siteUrl = Deno.env.get('SITE_URL') ?? '';
    const greeting = profile.full_name ? `, ${profile.full_name}` : '';

    const bodyHtml = `
      <h1 style="font-size:20px;color:#101828;margin:0 0 12px;">Welcome to UK Visa Tracker${greeting}</h1>
      <p style="margin:0 0 16px;">Thanks for signing up. UK Visa Tracker helps you:</p>
      <ul style="margin:0 0 16px;padding-left:20px;">
        <li style="margin-bottom:6px;">Get a personalised document checklist for your visa route</li>
        <li style="margin-bottom:6px;">Track your progress from biometrics through to decision</li>
        <li>See target processing times and reminders along the way</li>
      </ul>
      <p style="margin:0 0 20px;">We're independent and unaffiliated with UKVI or the Home Office — just a tool to help you stay on top of your own application.</p>
      <a href="${siteUrl}" style="display:inline-block;background:#1a3c6e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Go to your Dashboard</a>
    `;

    await sendEmail({
      to: profile.email,
      subject: 'Welcome to UK Visa Tracker',
      html: emailLayout({ bodyHtml, unsubscribeUrl }),
    });

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error', { status: 500 });
  }
});
