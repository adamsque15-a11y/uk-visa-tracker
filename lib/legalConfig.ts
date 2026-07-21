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

// Same placeholder domain used in public/robots.txt and public/sitemap.xml —
// swap all three together once a real production domain is chosen. Used to
// build absolute URLs in structured data (JSON-LD), which schema.org/Google
// require over relative paths.
export const SITE_URL = 'https://example.com';
