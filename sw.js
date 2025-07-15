const CACHE_NAME = 'veryhardalgebra-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/fallback.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/sw.js',
  '/Curtains.html'
];

// On install: cache essential files
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// On activate: remove old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// On fetch: try cache first, then fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Only fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/fallback.html');
        }
      })
  );
});
