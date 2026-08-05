export function registerNurPwa() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  document.documentElement.classList.toggle('is-standalone', standalone);

  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('is-standalone', event.matches);
  });

  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // The app remains fully usable online when registration is unavailable.
    });
  });
}
