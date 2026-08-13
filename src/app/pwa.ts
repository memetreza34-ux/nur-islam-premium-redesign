import { resolveAppPath } from './appPaths';
import { queuePendingNavigation } from '../services/pendingNavigation';

const SERVICE_WORKER_VERSION = '14-20260808-release-hardening';

/**
 * Asks the worker to cache the remaining surahs, once the page is done loading
 * and the browser reports itself idle.
 *
 * The worker used to start this from `activate`, where ~3 MB of downloads
 * competed with the requests the first render was still waiting on. Nothing
 * about the offline promise changes — only when the work begins.
 */
function requestQuranWarmup() {
  const send = () => navigator.serviceWorker.controller?.postMessage({ type: 'WARM_QURAN' });
  const schedule = () => {
    const idle = (window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback;
    if (idle) idle(send, { timeout: 10_000 });
    else window.setTimeout(send, 4_000);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

export function registerNurPwa() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  document.documentElement.classList.toggle('is-standalone', standalone);

  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('is-standalone', event.matches);
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      // This listener is installed before React mounts, so queue the intent as
      // well: the live event is lost when the app is still on the splash.
      if (event.data?.type === 'OPEN_PRAYER') {
        try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
        queuePendingNavigation('prayer');
        window.dispatchEvent(new Event('nur:open-prayer'));
        return;
      }
      if (event.data?.type === 'OPEN_CALENDAR') {
        try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
        queuePendingNavigation('calendar');
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
        requestQuranWarmup();
      })
      .catch(() => {
        // Die App bleibt online verwendbar, falls die Registrierung blockiert ist.
      });
  });
}
