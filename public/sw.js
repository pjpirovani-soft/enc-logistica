// ============================================================
// ENC Logística - Service Worker
// Estrategia: Network-first para páginas y assets dinámicos.
// Cache-first para assets estáticos.
// NO cachea /dashboard ni datos dinámicos (network-only).
// ============================================================

const CACHE_VERSION = 'v1';
const CACHE_STATIC = `enc-static-${CACHE_VERSION}`;
const CACHE_PAGES = `enc-pages-${CACHE_VERSION}`;

// Assets estáticos (cache-first)
const STATIC_ASSETS = [
  '/',
  '/login',
  '/register',
  '/offline',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/site.webmanifest',
];

// Rutas que NUNCA se cachean (datos sensibles/dinámicos)
const NEVER_CACHE = [
  '/dashboard',
  '/dashboard/',
  '/api/',
];

// Instalación: precachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW: error precacheando assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_STATIC && key !== CACHE_PAGES)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: estrategia según el tipo de request
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo GET (POST/PUT/DELETE van directo a red)
  if (request.method !== 'GET') return;

  // Solo mismo origen
  if (url.origin !== self.location.origin) return;

  // NUNCA cachear rutas del dashboard ni API
  if (NEVER_CACHE.some((p) => url.pathname.startsWith(p))) {
    // Network-only para dashboard
    event.respondWith(fetch(request));
    return;
  }

  // Assets estáticos (Next.js /_next/static, /icons, /images, etc): cache-first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|otf)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Páginas públicas (/, /login, /register): network-first con fallback a cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_PAGES).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Si no hay cache y es navegación, mostrar offline
          if (request.mode === 'navigate') {
            return caches.match('/offline');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});