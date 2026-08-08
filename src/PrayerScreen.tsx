import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Bell,
  BellRing,
  Check,
  ChevronLeft,
  CircleCheck,
  Clock3,
  LocateFixed,
  MapPin,
  MoonStar,
  Navigation,
  RefreshCw,
  Settings2,
  Share2,
  Sparkles,
  Sunrise,
  SunMedium,
  Volume2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  formatPrayerRemaining,
  getNextPrayer,
  OBLIGATORY_PRAYER_IDS,
} from './prayerSchedule';
import type { PrayerScheduleItem } from './prayerSchedule';
import {
  ASR_SCHOOL_OPTIONS,
  PRAYER_METHOD_OPTIONS,
} from './prayerTimesService';
import type { AsrSchool, PrayerCalculationMethod } from './prayerTimesService';
import { usePrayerTimes } from './usePrayerTimes';

const obligatoryIds = OBLIGATORY_PRAYER_IDS;
const celebrationParticles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  angle: (index / 18) * 360,
  distance: 86 + (index % 4) * 18,
  delay: (index % 6) * .045,
  size: 5 + (index % 3) * 2,
}));

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getOffsetDateKey(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - offset);
  return getDateKey(date);
}

function readSet(key: string, fallback: string[]) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return new Set(fallback);
    const parsed = JSON.parse(stored) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.map(String) : fallback);
  } catch {
    return new Set(fallback);
  }
}

function writeSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

function hasCompletedAllPrayers(value: Set<string>) {
  return obligatoryIds.every((id) => value.has(id));
}

function calculatePrayerStreak() {
  let streak = 0;
  for (let offset = 0; offset < 366; offset += 1) {
    const completed = readSet(`nur_prayers_${getOffsetDateKey(offset)}`, []);
    if (!hasCompletedAllPrayers(completed)) break;
    streak += 1;
  }
  return streak;
}

function getGregorianDate(date = new Date()) {
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function getHijriDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return 'Islamisches Datum';
  }
}

function PrayerIcon({ prayer, size = 21 }: { prayer: PrayerScheduleItem; size?: number }) {
  if (prayer.visual === 'moon') return <MoonStar size={size} />;
  if (prayer.visual === 'sunrise') return <Sunrise size={size} />;
  return <SunMedium size={size} />;
}

async function playReminderTone() {
  const AudioContextConstructor = window.AudioContext
    ?? (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return false;

  const context = new AudioContextConstructor();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.05);
  gain.connect(context.destination);

  [523.25, 659.25].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.18);
    oscillator.stop(context.currentTime + 0.72 + index * 0.18);
  });

  window.setTimeout(() => void context.close(), 1250);
  return true;
}

export function PrayerScreen({ onBack }: { onBack: () => void }) {
  const initialDateKey = useRef(getDateKey()).current;
  const [now, setNow] = useState(() => new Date());
  const currentDateKey = useMemo(() => getDateKey(now), [now]);
  const [completedDateKey, setCompletedDateKey] = useState(initialDateKey);
  const [completed, setCompleted] = useState(() => readSet(`nur_prayers_${initialDateKey}`, []));
  const [notifications, setNotifications] = useState(() => readSet('nur_prayer_notifications', []));
  const [tonePlaying, setTonePlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [completionStreak, setCompletionStreak] = useState(() => calculatePrayerStreak());
  const {
    schedule: prayerTimes,
    meta,
    preferences,
    status,
    refreshing,
    error,
    refresh,
    requestLocation,
    updatePreferences,
  } = usePrayerTimes();
  const [draftMethod, setDraftMethod] = useState<PrayerCalculationMethod>(preferences.method);
  const [draftSchool, setDraftSchool] = useState<AsrSchool>(preferences.school);
  const dateLabel = useMemo(() => getGregorianDate(now), [now]);
  const hijriLabel = useMemo(() => getHijriDate(now), [now]);
  const nextPrayer = useMemo(() => getNextPrayer(now, prayerTimes), [now, prayerTimes]);
  const completedCount = obligatoryIds.filter((id) => completed.has(id)).length;
  const previousCompletedCount = useRef(completedCount);

  useEffect(() => {
    const syncClock = () => setNow(new Date());
    const timer = window.setInterval(syncClock, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncClock();
    };
    window.addEventListener('focus', syncClock);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', syncClock);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (completedDateKey === currentDateKey) return;
    const nextCompleted = readSet(`nur_prayers_${currentDateKey}`, []);
    setCompletedDateKey(currentDateKey);
    setCompleted(nextCompleted);
    previousCompletedCount.current = obligatoryIds.filter((id) => nextCompleted.has(id)).length;
    setCompletionStreak(calculatePrayerStreak());
    setCelebrationOpen(false);
  }, [completedDateKey, currentDateKey]);

  useEffect(() => writeSet(`nur_prayers_${completedDateKey}`, completed), [completed, completedDateKey]);
  useEffect(() => writeSet('nur_prayer_notifications', notifications), [notifications]);
  useEffect(() => {
    setDraftMethod(preferences.method);
    setDraftSchool(preferences.school);
  }, [preferences]);

  useEffect(() => {
    const previous = previousCompletedCount.current;
    if (previous < 5 && completedCount === 5) {
      const streak = calculatePrayerStreak();
      setCompletionStreak(streak);
      setCelebrationOpen(true);
      navigator.vibrate?.([55, 35, 90]);
    }
    previousCompletedCount.current = completedCount;
  }, [completedCount]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const toggleCompleted = (id: string) => {
    if (!obligatoryIds.includes(id as typeof obligatoryIds[number])) return;
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleNotification = async (id: string) => {
    if (!obligatoryIds.includes(id as typeof obligatoryIds[number])) {
      flash('Erinnerungen sind nur für die fünf Pflichtgebete verfügbar');
      return;
    }

    const enabling = !notifications.has(id);
    let systemNotificationAvailable = 'Notification' in window && Notification.permission === 'granted';
    if (enabling && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      systemNotificationAvailable = permission === 'granted';
    }

    setNotifications((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

    if (!enabling) {
      flash('Erinnerung ausgeschaltet');
    } else if (systemNotificationAvailable) {
      flash('Erinnerung mit Systembenachrichtigung aktiviert');
    } else {
      flash('In-App-Erinnerung aktiviert; Systembenachrichtigungen sind nicht verfügbar');
    }
  };

  const handleRefresh = async () => {
    setNow(new Date());
    const result = await refresh();
    flash(result === 'live' ? 'Live-Gebetszeiten aktualisiert' : 'Offline-Zeitplan wird weiter verwendet');
  };

  const handleLocation = async () => {
    const result = await requestLocation();
    flash(result === 'live' ? 'Gebetszeiten für deinen Standort geladen' : result === 'location-denied' ? 'Standort wurde nicht freigegeben' : 'Gespeicherter Zeitplan wird verwendet');
  };

  const applyPreferences = async () => {
    const result = await updatePreferences({ method: draftMethod, school: draftSchool });
    setSettingsOpen(false);
    flash(result === 'live' ? 'Berechnungseinstellung übernommen' : 'Einstellung gespeichert – Offline-Fallback aktiv');
  };

  const testTone = async () => {
    if (tonePlaying) return;
    setTonePlaying(true);
    const played = await playReminderTone();
    if (!played) flash('Audio wird in diesem Browser nicht unterstützt');
    window.setTimeout(() => setTonePlaying(false), 1200);
  };

  const shareCompletion = async () => {
    const text = `Mein heutiger Gebets-Tracker ist vollständig: 5 von 5 Pflichtgebeten.${completionStreak > 1 ? ` Aktuelle Serie: ${completionStreak} Tage.` : ''}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Nur Islam · Gebets-Tracker', text });
      else {
        await navigator.clipboard.writeText(text);
        flash('Abschluss wurde kopiert');
      }
    } catch {
      flash('Teilen wurde abgebrochen');
    }
  };

  const nextDone = completed.has(nextPrayer.prayer.id);
  const nextTrackable = Boolean(nextPrayer.prayer.obligatory);
  const statusLabel = status === 'live'
    ? 'Live berechnet'
    : status === 'loading'
      ? 'Wird aktualisiert …'
      : status === 'cache'
        ? 'Gespeicherte Live-Zeiten'
        : status === 'location-denied'
          ? 'Standort nicht freigegeben'
          : 'Offline-Fallback';

  return (
    <motion.main className="screen prayer-screen reference-prayer-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">{hijriLabel}</span><h1>Gebetszeiten</h1></div>
        <button className="icon-button" onClick={handleRefresh} aria-label="Gebetszeiten aktualisieren" disabled={refreshing}><RefreshCw size={20} className={refreshing ? 'spin' : ''} /></button>
      </header>

      <section className={`reference-prayer-live-status is-${status}`} aria-live="polite">
        <span className="reference-prayer-live-status__dot" />
        <span><strong>{statusLabel}</strong><small>{meta.sourceLabel} · {meta.timezone ?? 'lokale Zeitzone'}</small></span>
        {error ? <em title={error}>Fallback aktiv</em> : null}
      </section>

      <section className="prayer-location-card glass-card reference-prayer-location">
        <span className="prayer-location-card__icon"><Navigation size={20} /></span>
        <span><small>{dateLabel}</small><strong>{meta.locationLabel}</strong></span>
        <button onClick={handleLocation} disabled={refreshing} className={refreshing ? 'is-loading' : ''}><LocateFixed size={16} /> {refreshing ? 'Lädt' : 'Standort'}</button>
      </section>
      <p className="reference-prayer-location-privacy">Standort ist optional. Bei Nutzung werden die Gerätekoordinaten zur Berechnung der Gebetszeiten an AlAdhan übermittelt.</p>

      <section className="next-prayer-panel reference-next-prayer">
        <div className="next-prayer-panel__glow" />
        <div className="next-prayer-panel__topline"><span className="hero-pill">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Pflichtgebet'}</span><span><MapPin size={14} /> {meta.city}</span></div>
        <div className="next-prayer-panel__main">
          <div><span className="arabic-label">{nextPrayer.prayer.arabic}</span><h2>{nextPrayer.prayer.label}</h2><p>{nextPrayer.prayer.description}</p></div>
          <div className="next-prayer-panel__time"><span className="reference-next-prayer__icon"><PrayerIcon prayer={nextPrayer.prayer} size={23} /></span><strong>{nextPrayer.prayer.time}</strong><span><Clock3 size={15} /> noch {formatPrayerRemaining(nextPrayer.remaining)}</span></div>
        </div>
        <div className="next-prayer-panel__progress"><span style={{ width: `${nextPrayer.progress}%` }} /></div>
        <div className="next-prayer-panel__actions">
          <button className="gold-button" onClick={() => toggleCompleted(nextPrayer.prayer.id)} disabled={!nextTrackable}>
            {nextDone ? <CircleCheck size={18} /> : <Check size={18} />}{nextTrackable ? nextDone ? 'Als gebetet markiert' : 'Als gebetet markieren' : 'Kein Pflichtgebet'}
          </button>
          <button className={tonePlaying ? 'adhan-button adhan-button--active' : 'adhan-button'} onClick={testTone} disabled={tonePlaying} aria-label="Hinweiston testen"><Volume2 size={19} /></button>
        </div>
      </section>

      <section className={completedCount === 5 ? 'daily-prayer-progress glass-card reference-prayer-progress is-complete' : 'daily-prayer-progress glass-card reference-prayer-progress'}>
        <div className="daily-prayer-progress__ring" style={{ '--progress': `${completedCount * 20}%` } as CSSProperties}><span><strong>{completedCount}</strong>/5</span></div>
        <div><span className="overline">Gebets-Tracker</span><h3>{completedCount === 5 ? 'Alle Pflichtgebete abgeschlossen' : 'Dein Fortschritt heute'}</h3><p>{completedCount === 5 ? `Möge Allah deine Gebete annehmen.${completionStreak > 1 ? ` Serie: ${completionStreak} Tage.` : ''}` : `${5 - completedCount} Pflichtgebete sind noch offen.`}</p></div>
        {completedCount === 5 ? <button className="reference-prayer-complete-replay" onClick={() => setCelebrationOpen(true)} aria-label="Abschlussanimation erneut anzeigen"><Sparkles size={18} /></button> : null}
      </section>

      <section className="prayer-schedule-section">
        <div className="section-heading"><div><span className="overline">Tagesübersicht</span><h2>Alle Gebetszeiten</h2></div><button className="text-button" onClick={() => setSettingsOpen(true)}><Settings2 size={15} /> Berechnung</button></div>
        <div className="prayer-schedule-list">
          {prayerTimes.map((prayer, index) => {
            const isNext = prayer.id === nextPrayer.prayer.id;
            const done = completed.has(prayer.id);
            const notificationOn = prayer.obligatory && notifications.has(prayer.id);
            return (
              <motion.article key={prayer.id} className={`${isNext ? 'prayer-time-row prayer-time-row--next' : 'prayer-time-row'}${done ? ' prayer-time-row--done' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
                <span className="prayer-time-row__icon"><PrayerIcon prayer={prayer} /></span><span className="prayer-time-row__name"><small>{prayer.arabic}</small><strong>{prayer.label}</strong><em>{prayer.description}</em></span><strong className="prayer-time-row__time">{prayer.time}</strong>
                {prayer.obligatory ? <button className={notificationOn ? 'prayer-alert prayer-alert--on' : 'prayer-alert'} onClick={() => void toggleNotification(prayer.id)} aria-label={`Erinnerung für ${prayer.label}`} aria-pressed={notificationOn}>{notificationOn ? <BellRing size={17} /> : <Bell size={17} />}</button> : <span className="prayer-alert prayer-alert--disabled" aria-hidden="true" />}
                {prayer.obligatory ? <button className={done ? 'prayer-complete prayer-complete--done' : 'prayer-complete'} onClick={() => toggleCompleted(prayer.id)} aria-label={`${prayer.label} als gebetet markieren`} aria-pressed={done}>{done ? <CircleCheck size={19} /> : <span />}</button> : <span className="prayer-complete prayer-complete--disabled" />}
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="method-card glass-card reference-prayer-method">
        <span className="method-card__icon"><MoonStar size={22} /></span>
        <span><small>{meta.sourceLabel}</small><strong>{meta.methodLabel}</strong><em>{meta.calculationNotice}</em></span>
        <button onClick={() => setSettingsOpen(true)}>Anpassen</button>
      </section>

      <AnimatePresence>
        {settingsOpen ? (
          <motion.div className="reference-prayer-settings-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingsOpen(false)}>
            <motion.section className="reference-prayer-settings-modal" initial={{ opacity: 0, y: 28, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-prayer-settings-modal__close" onClick={() => setSettingsOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-prayer-settings-modal__icon"><Settings2 size={25} /></span>
              <span className="overline">Gebetszeiten</span><h2>Berechnung anpassen</h2><p>Die Auswahl beeinflusst insbesondere Fajr, Isha und Asr. Vergleiche die Zeiten bei Unsicherheit mit deiner örtlichen Moschee.</p>

              <div className="reference-prayer-settings-group"><strong>Berechnungsmethode</strong><div>{PRAYER_METHOD_OPTIONS.map((option) => <button key={option.id} className={draftMethod === option.id ? 'is-active' : ''} onClick={() => setDraftMethod(option.id)}><span>{option.shortLabel}</span><small>{option.label}</small></button>)}</div></div>
              <div className="reference-prayer-settings-group"><strong>Asr-Berechnung</strong><div>{ASR_SCHOOL_OPTIONS.map((option) => <button key={option.id} className={draftSchool === option.id ? 'is-active' : ''} onClick={() => setDraftSchool(option.id)}><span>{option.label}</span><small>{option.description}</small></button>)}</div></div>
              <button className="gold-button" onClick={applyPreferences} disabled={refreshing}>{refreshing ? <RefreshCw size={17} className="spin" /> : <Check size={17} />} Übernehmen</button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {celebrationOpen ? (
          <motion.div className="prayer-completion-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCelebrationOpen(false)}>
            <motion.section className="prayer-completion-modal" initial={{ opacity: 0, y: 26, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .97 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} onClick={(event) => event.stopPropagation()} aria-live="polite">
              <button className="prayer-completion-modal__close" onClick={() => setCelebrationOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <div className="prayer-completion-burst" aria-hidden="true">
                {celebrationParticles.map((particle) => <motion.i key={particle.id} style={{ '--angle': `${particle.angle}deg`, '--distance': `${particle.distance}px`, width: particle.size, height: particle.size } as CSSProperties} initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, .6], x: Math.cos(particle.angle * Math.PI / 180) * particle.distance, y: Math.sin(particle.angle * Math.PI / 180) * particle.distance }} transition={{ duration: 1.35, delay: particle.delay, ease: 'easeOut' }} />)}
                <motion.span initial={{ scale: .55, rotate: -12 }} animate={{ scale: [1, 1.08, 1], rotate: 0 }} transition={{ duration: .7 }}><CircleCheck size={46} /></motion.span>
              </div>
              <span className="hero-pill">5 von 5</span><h2>Alle Pflichtgebete abgeschlossen</h2><p>Möge Allah deine Gebete annehmen und dir Beständigkeit schenken.</p>
              <div className="prayer-completion-stats"><span><strong>5</strong><small>Gebete heute</small></span><span><strong>{Math.max(1, completionStreak)}</strong><small>{completionStreak === 1 ? 'vollständiger Tag' : 'Tage Serie'}</small></span></div>
              <div className="prayer-completion-actions"><button onClick={shareCompletion}><Share2 size={17} /> Teilen</button><button className="gold-button" onClick={() => setCelebrationOpen(false)}>Alhamdulillah <Sparkles size={17} /></button></div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
