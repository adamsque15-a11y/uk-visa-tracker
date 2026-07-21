// No analytics provider (PostHog, GA, Amplitude, etc.) is wired up yet —
// this is a minimal placeholder so event-tracking call sites don't have to
// change again once one is. For now every event is just logged to the
// console (visible in dev tools / Metro), which is enough to eyeball click
// interest during the referral trial. Swap the body of trackEvent() for a
// real provider call when one is chosen.
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function trackEvent(name: string, properties?: AnalyticsEvent['properties']) {
  if (__DEV__) {
    console.log('[analytics]', name, properties ?? {});
  }
}
