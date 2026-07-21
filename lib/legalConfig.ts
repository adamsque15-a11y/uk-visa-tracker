import { Linking, Platform } from 'react-native';

// Identity used across the Privacy Policy and Terms of Service — everything
// else on those pages derives from these.
export const APP_NAME = 'UK Visa Tracker';
export const COMPANY_NAME = 'UK Visa Tracker';
// No separate privacy-specific inbox has been set up — both contact points
// route to the same support address until/unless a dedicated one exists.
export const PRIVACY_CONTACT_EMAIL = 'support@ukvisatracker.com';
export const SUPPORT_CONTACT_EMAIL = 'support@ukvisatracker.com';
export const GOVERNING_LAW = 'England and Wales';
export const LEGAL_LAST_UPDATED = '14 July 2026';

// Linking.openURL() opens mailto: links via window.open(url, '_blank',
// 'noopener') on web, which browsers routinely no-op for protocol handlers —
// there's no page to open, so noopener/_blank popups get silently dropped.
// window.location.href is the reliable way to trigger a mailto: on web.
export function openSupportEmail() {
  if (Platform.OS === 'web') {
    window.location.href = `mailto:${SUPPORT_CONTACT_EMAIL}`;
  } else {
    Linking.openURL(`mailto:${SUPPORT_CONTACT_EMAIL}`);
  }
}

// Used to build absolute URLs in structured data (JSON-LD, which
// schema.org/Google require over relative paths — see
// lib/structuredData.ts) and in share links for Visa Info, Guides,
// Insights, the Cost Calculator, and shared checklists (see the SITE_URL
// callers across app/(tabs)/*).
//
// Reads EXPO_PUBLIC_SITE_URL if set — e.g. a Vercel preview deploy could
// point this at its own preview URL without a code change — falling back to
// the real production domain so a build with the env var left unset still
// gets a correct, real URL rather than a broken placeholder.
//
// public/robots.txt and public/sitemap.xml reference the same domain but
// are static files, not generated from this constant — update those two by
// hand if the production domain ever changes.
export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://ukvisatracker.com';
