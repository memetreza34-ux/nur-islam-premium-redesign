import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AnimatePresence, motion } from 'motion/react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/amiri/400.css';
import App from './App';
import { resolveAppPath } from './appPaths';
import { AppErrorBoundary, CalendarReminderBanner, NetworkStatus, PrayerReminderBanner } from './AppSystemLayer';
import { blockForeignFraming, isFramedByForeignSite } from './frameGuard';
import { startCalendarReminderScheduler } from '../services/calendarReminderService';
import { startFastingReminderMaintenance } from '../services/fastingReminderService';
import { startInstallPromptCapture } from '../services/installPromptService';
import { queuePendingNavigation } from '../services/pendingNavigation';
import { startPrayerReminderScheduler } from '../services/prayerReminderService';
import { bootstrapSharedPrayerTimes, getPrayerDateKey } from '../services/prayerTimesService';
import { PRAYER_SCHEDULE_META } from '../services/prayerSchedule';
import { registerNurPwa } from './pwa';
import { SplashScreen } from '../screens/SplashScreen';
import { initializeTheme } from '../services/themeService';
import '../styles.css';
import '../styles/premium-legacy-art-final.css';
import '../styles/premium-local-features.css';

const PremiumSystemLayer = React.lazy(() => import('./PremiumSystemLayer').then(({ PremiumSystemLayer }) => ({ default: PremiumSystemLayer })));

function consumeInitialNavigationIntent() {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get('open');
  const intent = requested === 'prayer' ? 'prayer' : requested === 'calendar' ? 'calendar' : null;
  if (!intent) return;

  try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* direct navigation still works */ }
  queuePendingNavigation(intent);
  url.searchParams.delete('open');
  const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', cleanUrl);
}

function prepareImmediatePreview() {
  const params = new URLSearchParams(window.location.search);
  const forceOnboarding = params.get('onboarding') === '1';
  const previewMode = import.meta.env.DEV || params.get('preview') === '1';

  try {
    if (forceOnboarding) localStorage.removeItem('nur_onboarding_complete');
    else if (previewMode) localStorage.setItem('nur_onboarding_complete', 'true');
  } catch {
    // Die Vorschau bleibt auch ohne verfügbaren Browser-Speicher nutzbar.
  }

  document.documentElement.classList.toggle('is-preview', previewMode && !forceOnboarding);
  const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (manifest) manifest.href = resolveAppPath('manifest.webmanifest');
}

function startScreenScrollReset() {
  const root = document.getElementById('root');
  if (!root) return () => undefined;

  let activeFrame: Element | null = null;
  const syncScreen = () => {
    const nextFrame = root.querySelector('.screen-transition-frame');
    if (!nextFrame || nextFrame === activeFrame) return;
    activeFrame = nextFrame;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const observer = new MutationObserver(syncScreen);
  observer.observe(root, { childList: true, subtree: true });
  syncScreen();
  return () => observer.disconnect();
}

const stopInstallPromptCapture = startInstallPromptCapture();
consumeInitialNavigationIntent();
prepareImmediatePreview();
const stopThemeWatcher = initializeTheme();
const sharedPrayerTimesReady = bootstrapSharedPrayerTimes();

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
registerNurPwa();

function BootRoot() {
  const [ready, setReady] = useState(false);
  const [, setPrayerTimesVersion] = useState(0);
  const prayerDateKeyRef = useRef(getPrayerDateKey(new Date(), PRAYER_SCHEDULE_META.timezone));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('splash') === '1') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 160 : 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => ready ? startScreenScrollReset() : undefined, [ready]);

  useEffect(() => {
    let active = true;
    const renderLatestPrayerTimes = () => { if (active) setPrayerTimesVersion((version) => version + 1); };
    const refreshAfterDayChange = () => {
      const currentDateKey = getPrayerDateKey(new Date(), PRAYER_SCHEDULE_META.timezone);
      if (currentDateKey === prayerDateKeyRef.current) return;
      prayerDateKeyRef.current = currentDateKey;
      void bootstrapSharedPrayerTimes();
    };
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') refreshAfterDayChange(); };

    window.addEventListener('nur:prayer-times-updated', renderLatestPrayerTimes);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const dayChangeTimer = window.setInterval(refreshAfterDayChange, 60000);
    void sharedPrayerTimesReady.then(() => {
      prayerDateKeyRef.current = getPrayerDateKey(new Date(), PRAYER_SCHEDULE_META.timezone);
      renderLatestPrayerTimes();
    });

    return () => {
      active = false;
      window.removeEventListener('nur:prayer-times-updated', renderLatestPrayerTimes);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(dayChangeTimer);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let stopPrayerReminders: (() => void) | null = null;
    const stopCalendarReminders = startCalendarReminderScheduler();
    const stopFastingReminderMaintenance = startFastingReminderMaintenance();

    void sharedPrayerTimesReady.finally(() => {
      if (!disposed) stopPrayerReminders = startPrayerReminderScheduler();
    });

    return () => {
      disposed = true;
      stopPrayerReminders?.();
      stopCalendarReminders();
      stopFastingReminderMaintenance();
    };
  }, []);

  return (
    <AnimatePresence mode="sync" initial={false}>
      {ready ? (
        <motion.div key="app" className="app-entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .28 }}>
          <AppErrorBoundary>
            <App />
            <React.Suspense fallback={null}>
              <PremiumSystemLayer />
            </React.Suspense>
            <NetworkStatus />
            <PrayerReminderBanner />
            <CalendarReminderBanner />
          </AppErrorBoundary>
        </motion.div>
      ) : <SplashScreen key="splash" />}
    </AnimatePresence>
  );
}

window.addEventListener('pagehide', () => {
  stopThemeWatcher();
  stopInstallPromptCapture();
}, { once: true });

const rootElement = document.getElementById('root')!;

if (isFramedByForeignSite()) {
  blockForeignFraming(rootElement);
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BootRoot />
    </React.StrictMode>,
  );
}
