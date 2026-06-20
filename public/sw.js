// Service Worker voor Bonnetje PWA
const CACHE_NAME = 'bonnetje-v2';
const RUNTIME_CACHE = 'bonnetje-runtime-v2';

// Assets om te cachen bij installatie
const PRECACHE_ASSETS = [
  '/',
  '/login',
  '/dashboard',
  '/manifest.json',
  '/offline.html',
];

// Installatie - cache essentiële assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.error('[SW] Pre-cache failed:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activatie - cleanup oude caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch - Network First, fallback naar cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API requests van caching (we willen altijd verse data)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline - geen internetverbinding' }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Voor navigatie requests: Network first, fallback naar cache, dan offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response en cache het
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Probeer uit cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback naar offline pagina
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Voor andere requests: Cache first, fallback naar network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, maar update cache in background
        fetch(request).then((response) => {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, response);
          });
        }).catch(() => {});
        return cachedResponse;
      }

      // Niet in cache, fetch van network
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Handle background sync (voor toekomstige features)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-prices') {
    event.waitUntil(syncPrices());
  }
});

async function syncPrices() {
  // TODO: Implementeer background sync voor price updates
  console.log('[SW] Syncing prices in background');
}

// Handle push notifications (voor toekomstige features)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'Nieuwe prijsupdate beschikbaar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Bonnetje', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
