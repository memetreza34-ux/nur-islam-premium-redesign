import React, { useEffect, useState } from 'react';
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
import { AppErrorBoundary, NetworkStatus, PrayerReminderBanner } from './AppSystemLayer';
import { startPrayerReminderScheduler } from './prayerReminderService';
import { bootstrapSharedPrayerTimes } from './prayerTimesService';
import { ReferenceArtworkHost } from './ReferenceArtworkHost';
import { registerNurPwa } from './pwa';
import { SplashScreen } from './SplashScreen';
import './styles.css';

const VISUAL_VERSION = '20260806-visual4';
const PREVIEW_ASSETS = [
  'nur-logo-emblem-v2.webp',
  'mosque-gold-v2.webp',
  'quran-closed-v2.webp',
  'tasbih-v2.webp',
  'qibla-compass-v2.webp',
];

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

  PREVIEW_ASSETS.forEach((name) => {
    const href = `/premium-assets/high-res-objects/${name}?v=${VISUAL_VERSION}`;
    if (document.head.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

prepareImmediatePreview();
const sharedPrayerTimesReady = bootstrapSharedPrayerTimes();

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
registerNurPwa();

function BootRoot() {
  const [ready, setReady] = useState(false);
  const [, setPrayerTimesVersion] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previewMode = document.documentElement.classList.contains('is-preview');
    const timer = window.setTimeout(() => setReady(true), previewMode || reducedMotion ? 160 : 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    void sharedPrayerTimesReady.then(() => {
      if (active) setPrayerTimesVersion((version) => version + 1);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => startPrayerReminderScheduler(), []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {ready ? (
        <motion.div
          key="app"
          className="app-entry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .28 }}
        >
          <AppErrorBoundary>
            <App />
            <ReferenceArtworkHost />
            <NetworkStatus />
            <PrayerReminderBanner />
          </AppErrorBoundary>
        </motion.div>
      ) : <SplashScreen key="splash" />}
    </AnimatePresence>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BootRoot />
  </React.StrictMode>,
);
