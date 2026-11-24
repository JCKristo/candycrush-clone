// Sugar Rush service worker: makes the game load instantly and play offline.
// Bump VERSION whenever you change any file listed in PRECACHE.
const VERSION = 'sugar-rush-v2';
const PRECACHE = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/icons/favicon-16.png'
];
const FONT_CACHE = 'sugar-rush-fonts';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: cache-first, so the game keeps its lettering offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(req).then(hit => hit || fetch(req).then(res => {
          if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Pages: network-first so updates arrive, cached copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok && !res.redirected && url.pathname === '/') {
            const copy = res.clone();
            caches.open(VERSION).then(cache => cache.put('/', copy));
          }
          return res;
        })
        .catch(() => caches.match('/', { ignoreSearch: true }))
    );
    return;
  }

  // Everything else on this site: serve from cache, refresh in the background.
  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req).then(hit => {
        const fresh = fetch(req).then(res => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);
        return hit || fresh;
      })
    )
  );
});
