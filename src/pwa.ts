import { resolveAppPath } from './appPaths';

const SERVICE_WORKER_VERSION = '11-20260808-release-hardening';

export function registerNurPwa() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  document.documentElement.classList.toggle('is-standalone', standalone);

  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('is-standalone', event.matches);
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'OPEN_PRAYER') {
        try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
        window.dispatchEvent(new Event('nur:open-prayer'));
        return;
      }
      if (event.data?.type === 'OPEN_CALENDAR') {
        try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
        window.dispatchEvent(new Event('nur:open-calendar'));
      }
    });
  }

  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    let refreshing = false;
    const serviceWorkerUrl = `${resolveAppPath('sw.js')}?v=${SERVICE_WORKER_VERSION}`;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register(serviceWorkerUrl, {
        scope: import.meta.env.BASE_URL,
        updateViaCache: 'none',
      })
      .then(async (registration) => {
        await registration.update();
        if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) worker.postMessage({ type: 'SKIP_WAITING' });
          });
        });
      })
      .catch(() => {
        // Die App bleibt online verwendbar, falls die Registrierung blockiert ist.
      });
  });
}
