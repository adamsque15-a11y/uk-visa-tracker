// Basic app-shell service worker. Goal: never show a blank white screen on
// a poor connection — NOT full offline support for dynamic data (dashboard,
// checklist, etc. still need a real network round-trip to Supabase).
//
// Bumping CACHE_VERSION invalidates all previously cached entries on the
// next activate — do this whenever the caching strategy below changes.
const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Only paths guaranteed stable across builds — the JS/CSS bundles under
// /_expo/static/ are content-hashed per build, so their filenames aren't
// known ahead of time here. Those get cached opportunistically at runtime
// instead (see the fetch handler below).
const APP_SHELL_URLS = ['/home', '/manifest.json', '/favicon.ico'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) =>
      // Best-effort: don't fail install if one URL 404s (e.g. no favicon in dev).
      Promise.allSettled(APP_SHELL_URLS.map((url) => cache.add(url)))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only ever handle same-origin GET requests — leave the Supabase API,
  // analytics, etc. completely untouched so dynamic data always hits the
  // real network.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // HTML navigations: network-first for fresh content, falling back to
  // whatever's cached for that URL, and finally to the cached app shell
  // (/home) so there's always *something* to show instead of a blank page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/home')))
    );
    return;
  }

  // Static assets (JS/CSS/font/image bundles, content-hashed filenames are
  // immutable — safe to serve straight from cache without revalidating):
  // cache-first, populating the cache the first time each one is fetched.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
