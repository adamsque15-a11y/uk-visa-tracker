// Public, no-login GET endpoint — the link every reminder/welcome email's
// footer points to. Returns a small branded HTML confirmation page directly
// (not a redirect into the app), since it needs to work straight from an
// email client without the SPA loading first.
//
// Uses the anon key, not the service role key: unsubscribe_by_token() is a
// security definer RPC granted to `anon` specifically for this (see the
// migration) — the only thing it can do is flip one boolean on the row
// matching the token, so no elevated access is needed here.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { standalonePage } from '../_shared/emailLayout.ts';

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const siteUrl = Deno.env.get('SITE_URL') ?? '';

  if (!token) {
    return new Response(standalonePage('<p>This unsubscribe link is missing a token.</p>', siteUrl), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
  const { data, error } = await supabase.rpc('unsubscribe_by_token', { p_token: token });

  if (error || !data) {
    return new Response(
      standalonePage("<p>This link isn't valid, or you've already unsubscribed.</p>", siteUrl),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  return new Response(
    standalonePage(
      "<p>You've been unsubscribed from reminder emails.</p><p>You'll still receive important account emails. You can turn reminders back on anytime from your Profile settings.</p>",
      siteUrl
    ),
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
});
