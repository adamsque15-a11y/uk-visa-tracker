import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import Head from 'expo-router/head';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { consumePendingIntent } from '../lib/navigationIntent';
import AppShell from '../components/AppShell';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { registerServiceWorker } from '../lib/pwa';
import { initSentry, Sentry } from '../lib/sentry';

initSentry();

// Both components inject a <script> tag into `document` on mount — only
// meaningful (and only safe) in a real browser. Skip on native, and skip
// during the static-export prerender pass, which runs the web bundle in a
// Node process with no `document` at all.
const isBrowser = typeof document !== 'undefined';
const showVercelInstrumentation = Platform.OS === 'web' && isBrowser;

function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
      {showVercelInstrumentation && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </AuthProvider>
  );
}

export default Sentry.wrap(RootLayout);

function RootLayoutNav() {
  const { loading, authenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === 'auth';
    const inHomeGroup = segments[0] === 'home';
    // Privacy/Terms are legal disclosures — they need to stay reachable
    // (e.g. from a shared link) whether or not the visitor is signed in.
    const inLegalGroup = segments[0] === 'privacy' || segments[0] === 'terms';
    // Visa Info, Guides, and Insights are public, search-indexable content
    // — the app's main organic-traffic surfaces — so all three must be
    // reachable and fully renderable without an account. Insights also
    // carries share buttons (see ShareButtons in community.tsx): a shared
    // link is pointless if the recipient just gets bounced to Home.
    const inPublicContentGroup =
      segments[0] === '(tabs)' &&
      (segments[1] === 'visa-info' || segments[1] === 'guides' || segments[1] === 'community');
    // Shared, read-only summary links (Checklist/Cost Calculator) — meant to
    // be opened by someone the link was sent to, who has no account at all.
    const inSharedGroup = segments[0] === 'shared';
    // A broken/unknown URL should show the styled 404 page, not get bounced
    // to Home first — that would defeat the point of having one.
    const inNotFoundGroup = segments[0] === '+not-found';
    // Clicking a password-recovery email link establishes a real (if
    // temporary) session the moment the screen calls setSession — without
    // this check, the justAuthenticated branch below would immediately
    // redirect into the dashboard before the user ever sets a new password.
    const onResetPasswordScreen = segments[0] === 'auth' && segments[1] === 'reset-password';
    // Only auto-redirect away from auth/home right when sign-in completes —
    // not on every render — so an already-authenticated user can navigate
    // back to Home (e.g. via the nav menu) without being bounced straight
    // back to the Dashboard.
    const justAuthenticated = authenticated && !wasAuthenticated.current;
    wasAuthenticated.current = authenticated;

    if (
      !authenticated &&
      !inAuthGroup &&
      !inHomeGroup &&
      !inLegalGroup &&
      !inPublicContentGroup &&
      !inSharedGroup &&
      !inNotFoundGroup
    ) {
      router.replace('/home');
    } else if (justAuthenticated && (inAuthGroup || inHomeGroup) && !onResetPasswordScreen) {
      const { intent, level } = consumePendingIntent();
      if (intent === 'apply') {
        router.replace('/(tabs)/questionnaire');
      } else if (intent === 'track') {
        router.replace('/quick-track');
      } else if (intent === 'ielts_a1_test') {
        router.replace(
          level ? { pathname: '/(tabs)/ielts-life-skills/[level]', params: { level } } : '/(tabs)/ielts-life-skills'
        );
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [authenticated, loading, segments]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Deliberately doesn't block on `loading` with a full-page spinner: that
  // would mean the app never renders anything else — including in a static
  // export, where the effect above that resolves `loading` never runs (no
  // `window` in that Node render pass), so every exported page would be
  // nothing but a spinner. Public routes don't need to wait on auth at all;
  // private routes render their own default state for the brief loading
  // window and get redirected by the effect above once auth resolves.
  const inAuthGroup = segments[0] === 'auth';
  const showChrome = !loading && authenticated && !inAuthGroup;

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a3c6e" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VisaTracker" />
      </Head>
      <AppShell showChrome={showChrome}>
        <Stack screenOptions={{ headerShown: false }} />
      </AppShell>
    </>
  );
}
