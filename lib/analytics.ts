import { Platform } from 'react-native';
import { track } from '@vercel/analytics';

// Vercel Analytics is web-only (it works by injecting a <script> tag into
// the page — see components/AppShell or app/_layout.tsx for where
// <Analytics /> is mounted). Page views there are automatic; this covers
// the specific in-app actions call sites choose to name, e.g. checklist
// completion or a share click; see the call sites for the current list.
//
// Privacy: every property passed here ends up in Vercel's dashboard and
// (per the "PII" privacy audit for this app) must never carry visa
// details, names, emails, or any other personal data — only structural
// context like which screen/section triggered the event. Vercel also
// enforces this at the type level: values may only be string | number |
// boolean | null, so nothing nested (and therefore no accidental object
// dumps) can be sent even by mistake.
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function trackEvent(name: string, properties?: AnalyticsEvent['properties']) {
  if (__DEV__) {
    console.log('[analytics]', name, properties ?? {});
    return;
  }
  if (Platform.OS !== 'web') return;

  if (!properties) {
    track(name);
    return;
  }
  // track()'s custom-data type doesn't accept `undefined` — narrow it out
  // rather than changing every call site's type to omit it.
  const cleaned: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value !== undefined) cleaned[key] = value;
  }
  track(name, cleaned);
}
