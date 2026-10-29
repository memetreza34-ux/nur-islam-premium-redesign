const VISUAL_VERSION = '20260826-original-art';
const CACHE_NAME = `nur-islam-premium-v122-${VISUAL_VERSION}`;
const QURAN_CACHE_PREFIX = 'nur-quran-online-';
const scoped = (path = '') => new URL(path.replace(/^\/+/, ''), self.registration.scope).toString();
const premiumAsset = (name) => `${scoped(`premium-assets/high-res-objects/${name}`)}?v=${name === 'nur-logo-mosque-3d-v1.webp' ? '20261016-mosque-3d-v1' : VISUAL_VERSION}`;
const INDEX_URL = scoped('index.html');
const PREMIUM_PATHNAME = new URL('premium-assets/', self.registration.scope).pathname;

const APP_SHELL = [
  scoped(),
  INDEX_URL,
  scoped('manifest.webmanifest'),
  scoped('nur-app-icon.svg'),
  scoped('nur-app-icon.svg?v=20261016-mosque-3d-v1'),
  scoped('nur-app-icon-192.png'),
  scoped('nur-app-icon-512.png'),
  scoped('nur-app-icon-maskable-512.png'),
  scoped('premium-assets/high-res-objects/nur-logo-emblem.png'),
  scoped('premium-assets/high-res-objects/nur-logo-emblem.png?v=20261016-mosque-3d-v1'),
  premiumAsset('nur-logo-mosque-3d-v1.webp'),
  premiumAsset('prayer-companion-mosque-v1.webp'),
  premiumAsset('learn-hub-book-v1.webp'),
  premiumAsset('home-dhikr-illustrated-v3.webp'),
  premiumAsset('home-qibla-illustrated-v3.webp'),
  premiumAsset('home-learn-prayer-v5.webp'),
  premiumAsset('home-duas-v5.webp'),
  premiumAsset('learn-hub-hajj-v1.webp'),
  premiumAsset('learn-hub-terms-v1.webp'),
  premiumAsset('learn-hub-sunnah-v1.webp'),
  premiumAsset('learn-hub-character-v1.webp'),
  premiumAsset('learn-hub-community-v1.webp'),
  premiumAsset('zakat-calculator-v1.webp'),
  premiumAsset('home-names-v5.webp'),
  premiumAsset('home-quiz-v6.webp'),
  premiumAsset('prayer-companion-fasting-v1.webp'),
  premiumAsset('learn-hub-pillars-v1.webp'),
  premiumAsset('learn-hub-wudu-v1.webp'),
  premiumAsset('learn-hub-prophets-v2.webp'),
  premiumAsset('learn-hub-madhhabs-v1.webp'),
  premiumAsset('learn-hub-hadith-v1.webp'),
  premiumAsset('wudu-step-hands-v2.webp'),
  premiumAsset('wudu-step-mouth-v2.webp'),
  premiumAsset('wudu-step-nose-v2.webp'),
  premiumAsset('wudu-step-face-v2.webp'),
  premiumAsset('wudu-step-arms-v2.webp'),
  premiumAsset('wudu-step-head-v2.webp'),
  premiumAsset('wudu-step-ears-v2.webp'),
  premiumAsset('wudu-step-feet-v2.webp'),
  premiumAsset('salah-posture-standing-v2.webp'),
  premiumAsset('salah-posture-takbir-v2.webp'),
  premiumAsset('salah-posture-qiyam-v2.webp'),
  premiumAsset('salah-posture-ruku-v2.webp'),
  premiumAsset('salah-posture-sujud-v2.webp'),
  premiumAsset('salah-posture-sitting-v2.webp'),
  premiumAsset('salah-posture-taslim-v2.webp'),
  premiumAsset('quran-garden-hero-v2.webp'),
  premiumAsset('ayah-oasis-card-v1.webp'),
  premiumAsset('prayer-oasis-fajr-v2.webp'),
  premiumAsset('prayer-oasis-sunrise-v1.webp'),
  premiumAsset('prayer-oasis-dhuhr-v2.webp'),
  premiumAsset('prayer-oasis-asr-v2.webp'),
  premiumAsset('prayer-oasis-maghrib-v2.webp'),
  premiumAsset('prayer-oasis-isha-v2.webp'),
  premiumAsset('splash-arcade-fajr-v1.webp'),
  premiumAsset('splash-arcade-dhuhr-v1.webp'),
  premiumAsset('splash-arcade-asr-v1.webp'),
  premiumAsset('splash-arcade-maghrib-v1.webp'),
  premiumAsset('splash-arcade-isha-v1.webp'),
  premiumAsset('prayer-mini-fajr-v2.webp'),
  premiumAsset('prayer-mini-sunrise-v1.webp'),
  premiumAsset('prayer-mini-dhuhr-v2.webp'),
  premiumAsset('prayer-mini-asr-v2.webp'),
  premiumAsset('prayer-mini-maghrib-v2.webp'),
  premiumAsset('prayer-mini-isha-v2.webp'),
  scoped('data/quran/surahs.json'),
  scoped('data/quran/ar/1.json'),
  scoped('data/quran/ar/112.json'),
  scoped('data/quran/ar/113.json'),
  scoped('data/quran/ar/114.json'),
];

// The remaining 110 surahs are ~3 MB. They are not part of install, and no
// longer part of activate either: starting that download the moment the worker
// takes over put it in direct competition with the requests the first render is
// waiting on. The client asks for it once it has gone idle, and it runs one
// file at a time, skipping whatever is already cached. A file that fails is
// picked up on the next request, or fetched on demand by the read handler.
const QURAN_WARM_URLS = Array.from({ length: 114 }, (_, index) => index + 1)
  .map((number) => scoped(`data/quran/ar/${number}.json`));

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
        .catch(async () => (await caches.match(request, { ignoreSearch: true })) || Response.error()),
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
