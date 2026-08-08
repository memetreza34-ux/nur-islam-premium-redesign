import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { BellRing, CalendarDays, CircleCheck, Clock3, CloudOff, RefreshCw, ShieldAlert, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CalendarReminderDetail } from './calendarReminderService';
import type { PrayerReminderDetail } from './prayerReminderService';
import { NurMark, PremiumImage } from './PremiumVisuals';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { failed: boolean };

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Nur Islam render error', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="reference-system-error">
        <div className="reference-system-error__halo" />
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" className="reference-system-error__logo" fallback={<NurMark />} />
        <span className="reference-system-error__icon"><ShieldAlert size={24} /></span>
        <span className="overline">Nur Islam</span>
        <h1>Die Ansicht konnte nicht geladen werden.</h1>
        <p>Deine lokal gespeicherten Fortschritte bleiben erhalten. Lade die App neu, um zur Startseite zurückzukehren.</p>
        <button className="gold-button" onClick={() => window.location.reload()}><RefreshCw size={18} /> App neu laden</button>
      </main>
    );
  }
}

export function NetworkStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let restoredTimer: number | undefined;
    const handleOffline = () => { setOnline(false); setRestored(false); };
    const handleOnline = () => {
      setOnline(true);
      setRestored(true);
      restoredTimer = window.setTimeout(() => setRestored(false), 2400);
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      if (restoredTimer) window.clearTimeout(restoredTimer);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online || restored ? (
        <motion.div className={online ? 'reference-network-status is-online' : 'reference-network-status is-offline'} initial={{ opacity: 0, y: -16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .97 }} role="status">
          {online ? <CircleCheck size={17} /> : <CloudOff size={17} />}
          <span><strong>{online ? 'Wieder verbunden' : 'Offline-Modus'}</strong><small>{online ? 'Aktuelle Inhalte können wieder geladen werden.' : 'Gespeicherte Bereiche bleiben verfügbar.'}</small></span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function PrayerReminderBanner() {
  const [reminder, setReminder] = useState<PrayerReminderDetail | null>(null);

  useEffect(() => {
    let hideTimer: number | undefined;
    const handleReminder = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<PrayerReminderDetail>;
      setReminder(event.detail);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setReminder(null), 12000);
    };
    window.addEventListener('nur:prayer-reminder-fired', handleReminder);
    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener('nur:prayer-reminder-fired', handleReminder);
    };
  }, []);

  const openPrayerTracker = () => {
    setReminder(null);
    try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
    window.dispatchEvent(new Event('nur:open-prayer'));
  };

  return (
    <AnimatePresence>
      {reminder ? (
        <motion.aside className="reference-prayer-reminder-banner" initial={{ opacity: 0, y: -22, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: .97 }} role="alert" aria-live="assertive">
          <span className="reference-prayer-reminder-banner__icon"><BellRing size={22} /></span>
          <span className="reference-prayer-reminder-banner__copy"><small>{reminder.arabic} · {reminder.time}</small><strong>{reminder.label} · Gebetszeit</strong><em><Clock3 size={13} /> {reminder.description}</em></span>
          <button className="reference-prayer-reminder-banner__open" onClick={openPrayerTracker}>Öffnen</button>
          <button className="reference-prayer-reminder-banner__close" onClick={() => setReminder(null)} aria-label="Erinnerung schließen"><X size={16} /></button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function CalendarReminderBanner() {
  const [reminder, setReminder] = useState<CalendarReminderDetail | null>(null);

  useEffect(() => {
    let hideTimer: number | undefined;
    const handleReminder = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<CalendarReminderDetail>;
      setReminder(event.detail);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setReminder(null), 12000);
    };
    window.addEventListener('nur:calendar-reminder-fired', handleReminder);
    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener('nur:calendar-reminder-fired', handleReminder);
    };
  }, []);

  const openCalendar = () => {
    setReminder(null);
    try { localStorage.setItem('nur_onboarding_complete', 'true'); } catch { /* optional */ }
    window.dispatchEvent(new Event('nur:open-calendar'));
  };

  return (
    <AnimatePresence>
      {reminder ? (
        <motion.aside className="reference-prayer-reminder-banner reference-calendar-reminder-banner" initial={{ opacity: 0, y: -22, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: .97 }} role="alert" aria-live="assertive">
          <span className="reference-prayer-reminder-banner__icon"><CalendarDays size={22} /></span>
          <span className="reference-prayer-reminder-banner__copy"><small>{reminder.time} Uhr · Persönlicher Termin</small><strong>{reminder.title}</strong><em><Clock3 size={13} /> Jetzt im Kalender geplant</em></span>
          <button className="reference-prayer-reminder-banner__open" onClick={openCalendar}>Kalender</button>
          <button className="reference-prayer-reminder-banner__close" onClick={() => setReminder(null)} aria-label="Erinnerung schließen"><X size={16} /></button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
