const VISUAL_VERSION = '20260808-release-hardening';
const CACHE_NAME = `nur-islam-premium-v14-${VISUAL_VERSION}`;
const QURAN_CACHE_PREFIX = 'nur-quran-online-';
const scoped = (path = '') => new URL(path.replace(/^\/+/, ''), self.registration.scope).toString();
const premiumAsset = (name) => `${scoped(`premium-assets/high-res-objects/${name}`)}?v=${VISUAL_VERSION}`;
const INDEX_URL = scoped('index.html');
const PREMIUM_PATHNAME = new URL('premium-assets/', self.registration.scope).pathname;

const APP_SHELL = [
  scoped(),
  INDEX_URL,
  scoped('manifest.webmanifest'),
  scoped('nur-app-icon.svg'),
  scoped('nur-app-icon-192.png'),
  scoped('nur-app-icon-512.png'),
  scoped('premium-assets/high-res-objects/nur-logo-emblem.png'),
  premiumAsset('nur-logo-emblem-v2.webp'),
  premiumAsset('mosque-gold-v2.svg'),
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
  scoped('data/quran/surahs.json'),
  scoped('data/quran/ar/1.json'),
  scoped('data/quran/de/1.json'),
  scoped('data/quran/ar/112.json'),
  scoped('data/quran/de/112.json'),
  scoped('data/quran/ar/113.json'),
  scoped('data/quran/de/113.json'),
  scoped('data/quran/ar/114.json'),
  scoped('data/quran/de/114.json'),
];

// The remaining 110 surahs are ~3 MB. They are not part of install, and no
// longer part of activate either: starting that download the moment the worker
// takes over put it in direct competition with the requests the first render is
// waiting on. The client asks for it once it has gone idle, and it runs one
// file at a time, skipping whatever is already cached. A file that fails is
// picked up on the next request, or fetched on demand by the read handler.
const QURAN_WARM_URLS = Array.from({ length: 114 }, (_, index) => index + 1)
  .flatMap((number) => [scoped(`data/quran/ar/${number}.json`), scoped(`data/quran/de/${number}.json`)]);

async function warmQuranCache() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of QURAN_WARM_URLS) {
    if (await cache.match(url)) continue;
    try {
      await cache.add(url);
    } catch {
      // Offline or a transient failure: the next activation picks it up again.
    }
  }
}

// The retry control is a link to the current URL rather than a button calling
// location.reload(): the worker builds this document itself, so an inline
// handler would be the only script anywhere in the app that a content policy
// cannot cover. A link needs no script, and the response carries its own
// policy that forbids scripts and every outbound request.
function offlineDocument() {
  return new Response(
    '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#001b16"><title>Nur Islam · Offline</title><style>html,body{margin:0;min-height:100%;background:#00120f;color:#fff8ea;font-family:system-ui,sans-serif}body{display:grid;min-height:100vh;place-items:center;padding:24px;box-sizing:border-box;background:radial-gradient(circle at 50% 0%,rgba(226,191,119,.08),transparent 18rem),linear-gradient(180deg,#042a21 0%,#001b16 48%,#00120f 100%)}.card{max-width:360px;padding:28px;border:1px solid rgba(226,191,119,.3);border-radius:28px;background:linear-gradient(145deg,rgba(13,87,67,.92),rgba(0,27,22,.98));text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.42)}h1{font-family:Georgia,serif;font-size:2rem;margin:0 0 10px;color:#fff8ea}p{color:#91a89e;font-size:.9rem;line-height:1.6;margin:0 0 18px}a.retry{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border:1px solid rgba(226,191,119,.35);border-radius:18px;background:linear-gradient(135deg,#f2d79a,#e2bf77);color:#10251e;font-weight:700;text-decoration:none}</style></head><body><main class="card"><h1>Nur Islam ist offline</h1><p>Gespeicherte Inhalte stehen nach dem ersten vollständigen Laden weiterhin zur Verfügung. Prüfe deine Verbindung und versuche es erneut.</p><a class="retry" href="">Erneut versuchen</a></main></body></html>',
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
      },
      status: 503,
    },
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && !key.startsWith(QURAN_CACHE_PREFIX))
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  // Warming used to run from `activate`, which meant ~3 MB of surah files
  // started downloading while the page was still fetching what it needed to
  // render. The client asks for it once it is idle instead.
  if (event.data?.type === 'WARM_QURAN') event.waitUntil(warmQuranCache());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.target === 'calendar' ? 'calendar' : 'prayer';
  const targetUrl = event.notification.data?.url || `${self.registration.scope}?open=${target}`;
  const messageType = target === 'calendar' ? 'OPEN_CALENDAR' : 'OPEN_PRAYER';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientList) => {
      const existingClient = clientList.find((client) => client.url.startsWith(self.registration.scope)) || clientList[0];
      if (existingClient) {
        await existingClient.focus();
        existingClient.postMessage({ type: messageType });
        return;
      }
      await self.clients.openWindow(targetUrl);
    }),
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
            caches.open(CACHE_NAME).then((cache) => cache.put(INDEX_URL, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(INDEX_URL)) || offlineDocument()),
    );
    return;
  }

  if (url.pathname.startsWith(PREMIUM_PATHNAME)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error()),
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
    }),
  );
});
