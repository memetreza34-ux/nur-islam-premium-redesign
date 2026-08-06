const SERVICE_WORKER_VERSION = '6';

export function registerNurPwa() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  document.documentElement.classList.toggle('is-standalone', standalone);

  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('is-standalone', event.matches);
  });

  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register(`/sw.js?v=${SERVICE_WORKER_VERSION}`, { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => {
        // Die App bleibt online verwendbar, falls die Registrierung blockiert ist.
      });
  });
}
