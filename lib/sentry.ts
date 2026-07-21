import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';

// This is the DSN, not a secret — it's meant to be embedded in client code
// (it only lets a client send events *to* this project, nothing else).
const SENTRY_DSN =
  'https://022b0c9c0edebc8147b4e7e1d15d3280@o4511774728388608.ingest.de.sentry.io/4511774739595344';

// __DEV__ alone isn't enough: `expo export --platform web` runs the web
// bundle in a Node process with no `window` to pre-render every route, and
// that pass also has __DEV__ === false (it's a production build) — Sentry's
// init would otherwise run there and crash on missing browser APIs, the
// same class of bug fixed for the Supabase client in lib/supabase.ts. Native
// (iOS/Android) never has `window` either, so the check only applies to web.
const canInit = !__DEV__ && (Platform.OS !== 'web' || typeof window !== 'undefined');

export function initSentry() {
  if (!canInit) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: 'production',
    // Sentry's own default — stated explicitly so this stays true on
    // purpose: no IP addresses, cookies, or request bodies get attached to
    // events. See the privacy note on trackEvent() in lib/analytics.ts for
    // the same rule applied to custom events.
    sendDefaultPii: false,
  });
}

export { Sentry };
