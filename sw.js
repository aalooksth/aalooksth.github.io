const CACHE_NAME = 'alok-utils-cache-v1';

// We only want to cache the utils page and necessary assets for it
const URLS_TO_CACHE = [
  '/utils/',
  '/utils/index.html',
  '/css/styles.css',
  '/js/script.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only serve from cache for requests pointing to /utils/ and cached assets
  const isUtilsRequest = event.request.url.includes('/utils/');
  const isCachedAsset = URLS_TO_CACHE.some(url => event.request.url.endsWith(url));
  
  if (isUtilsRequest || isCachedAsset) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Fetch from network if not in cache
          return fetch(event.request).then(
            function(networkResponse) {
              // Check if we received a valid response
              if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }

              // Clone the response
              var responseToCache = networkResponse.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

              return networkResponse;
            }
          );
        })
    );
  }
});
