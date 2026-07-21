// Registers the app-shell service worker (public/sw.js) on web only — native
// has no concept of a service worker, and Node (static export/SSG) has no
// `navigator` at all, so this must stay a no-op everywhere except a real
// browser.
//
// __DEV__-gated: sw.js's fetch handler is cache-first for anything that
// isn't a navigation, on the assumption that non-navigation URLs are
// content-hashed build output (true for the production static export's
// /_expo/static/... bundles). In the Metro dev server those same URLs
// (/node_modules/expo-router/entry.bundle?...) are stable — same URL,
// different content on every edit — so a SW registered during development
// caches the first bundle it sees and serves it forever, desyncing the
// client from whatever Metro actually has and forcing repeated full
// reloads/remounts. Registering only in production builds avoids this
// entirely; the offline app-shell behavior only matters there anyway.
export function registerServiceWorker() {
  if (__DEV__) return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if (typeof window === 'undefined') return;

  function register() {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Installability/offline caching is a progressive enhancement — a
      // failed registration (e.g. served over plain HTTP in local dev)
      // shouldn't be treated as an app error.
    });
  }

  // This runs from a React effect after hydration, by which point the
  // window's 'load' event has almost always already fired — waiting on it
  // unconditionally would mean the listener never runs.
  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
}
