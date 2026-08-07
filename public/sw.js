const VISUAL_VERSION = '20260807-reminder-routing';
const CACHE_NAME = `nur-islam-premium-v9-${VISUAL_VERSION}`;
const premiumAsset = (name) => `/premium-assets/high-res-objects/${name}?v=${VISUAL_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/nur-app-icon.svg',
  premiumAsset('nur-logo-emblem-v2.webp'),
  premiumAsset('mosque-gold-v2.webp'),
  premiumAsset('mosque-v2.webp'),
  premiumAsset('quran-closed-v2.webp'),
  premiumAsset('quran-open-v2.webp'),
  premiumAsset('tasbih-v2.webp'),
  premiumAsset('qibla-compass-v2.webp'),
  premiumAsset('qibla-v2.webp'),
  premiumAsset('mihrab-v2.webp'),
  premiumAsset('mihrab-arch-v2.webp'),
  premiumAsset('lantern-v2.webp'),
  premiumAsset('kaaba-v2.webp'),
  premiumAsset('bookmark-v2.webp'),
  premiumAsset('calendar-chip-v2.webp'),
  premiumAsset('dome-v2.webp'),
  premiumAsset('sun-emblem-v2.webp'),
  premiumAsset('dua-hands-v2.webp'),
  '/data/quran/surahs.json',
  '/data/quran/ar/1.json',
  '/data/quran/de/1.json',
  '/data/quran/ar/112.json',
  '/data/quran/de/112.json',
  '/data/quran/ar/113.json',
  '/data/quran/de/113.json',
  '/data/quran/ar/114.json',
  '/data/quran/de/114.json'
];

function offlineDocument() {
  return new Response(
    '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071b15"><title>Nur Islam · Offline</title><style>html,body{margin:0;min-height:100%;background:#020b08;color:#fff7e8;font-family:system-ui,sans-serif}body{display:grid;min-height:100vh;place-items:center;padding:24px;box-sizing:border-box}.card{max-width:360px;padding:28px;border:1px solid rgba(232,199,122,.3);border-radius:24px;background:linear-gradient(145deg,#103b2e,#051813);text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.45)}h1{font-family:Georgia,serif;font-size:2rem;margin:0 0 10px}p{color:#9aae9f;font-size:.9rem;line-height:1.6;margin:0 0 18px}button{min-height:44px;padding:0 18px;border:0;border-radius:13px;background:linear-gradient(135deg,#efd394,#c9953a);color:#10251e;font-weight:700}</style></head><body><main class="card"><h1>Nur Islam ist offline</h1><p>Gespeicherte Inhalte stehen nach dem ersten vollständigen Laden weiterhin zur Verfügung. Prüfe deine Verbindung und versuche es erneut.</p><button onclick="location.reload()">Erneut versuchen</button></main></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || `${self.registration.scope}?open=prayer`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientList) => {
      const existingClient = clientList.find((client) => client.url.startsWith(self.registration.scope)) || clientList[0];
      if (existingClient) {
        await existingClient.focus();
        existingClient.postMessage({ type: 'OPEN_PRAYER' });
        return;
      }

      await self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return response;
        })
        .catch(async () => (await caches.match('/index.html')) || offlineDocument())
    );
    return;
  }

  if (url.pathname.startsWith('/premium-assets/')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error())
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || Response.error());

      return cached || network;
    })
  );
});