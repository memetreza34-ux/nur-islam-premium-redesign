import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Bell,
  BellRing,
  Check,
  ChevronLeft,
  CircleCheck,
  Clock3,
  MapPin,
  MoonStar,
  Navigation,
  RefreshCw,
  Sunrise,
  SunMedium,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type PrayerItem = {
  id: string;
  label: string;
  arabic: string;
  time: string;
  description: string;
  icon: typeof MoonStar;
  obligatory: boolean;
};

const prayerTimes: PrayerItem[] = [
  { id: 'fajr', label: 'Fajr', arabic: 'الفجر', time: '04:18', description: 'Morgengebet', icon: MoonStar, obligatory: true },
  { id: 'sunrise', label: 'Sonnenaufgang', arabic: 'الشروق', time: '05:54', description: 'Shuruq', icon: Sunrise, obligatory: false },
  { id: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', time: '12:45', description: 'Mittagsgebet', icon: SunMedium, obligatory: true },
  { id: 'asr', label: 'Asr', arabic: 'العصر', time: '16:42', description: 'Nachmittagsgebet', icon: SunMedium, obligatory: true },
  { id: 'maghrib', label: 'Maghrib', arabic: 'المغرب', time: '19:36', description: 'Abendgebet', icon: Sunrise, obligatory: true },
  { id: 'isha', label: 'Isha', arabic: 'العشاء', time: '21:07', description: 'Nachtgebet', icon: MoonStar, obligatory: true },
];

const obligatoryPrayers = prayerTimes.filter((item) => item.obligatory);
const obligatoryIds = obligatoryPrayers.map((item) => item.id);

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readSet(key: string, fallback: string[]) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return new Set(fallback);
    const parsed = JSON.parse(stored) as string[];
    return new Set(Array.isArray(parsed) ? parsed : fallback);
  } catch {
    return new Set(fallback);
  }
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatRemaining(totalMinutes: number) {
  const safe = Math.max(0, totalMinutes);
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes} Min.`;
  return `${hours} Std. ${minutes} Min.`;
}

function getGregorianDate(date = new Date()) {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getHijriDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Islamisches Datum';
  }
}

function getNextPrayer(now: Date) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextToday = obligatoryPrayers.find((prayer) => toMinutes(prayer.time) > currentMinutes);

  if (nextToday) {
    const index = obligatoryPrayers.findIndex((prayer) => prayer.id === nextToday.id);
    const previous = index > 0 ? obligatoryPrayers[index - 1] : obligatoryPrayers[obligatoryPrayers.length - 1];
    const nextMinutes = toMinutes(nextToday.time);
    const previousMinutes = index > 0 ? toMinutes(previous.time) : toMinutes(previous.time) - 1440;
    const elapsed = currentMinutes - previousMinutes;
    const interval = Math.max(1, nextMinutes - previousMinutes);
    return {
      prayer: nextToday,
      remaining: nextMinutes - currentMinutes,
      progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
      tomorrow: false,
    };
  }

  const fajr = obligatoryPrayers[0];
  const isha = obligatoryPrayers[obligatoryPrayers.length - 1];
  const nextMinutes = toMinutes(fajr.time) + 1440;
  const previousMinutes = toMinutes(isha.time);
  const interval = nextMinutes - previousMinutes;
  const elapsed = currentMinutes - previousMinutes;
  return {
    prayer: fajr,
    remaining: nextMinutes - currentMinutes,
    progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
    tomorrow: true,
  };
}

export function PrayerScreen({ onBack }: { onBack: () => void }) {
  const dateKey = useMemo(() => getDateKey(), []);
  const [completed, setCompleted] = useState(() => readSet(`nur_prayers_${dateKey}`, ['fajr']));
  const [notifications, setNotifications] = useState(() => readSet('nur_prayer_notifications', ['fajr', 'dhuhr', 'maghrib', 'isha']));
  const [adhanPlaying, setAdhanPlaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState<string | null>(null);
  const dateLabel = useMemo(() => getGregorianDate(now), [now]);
  const hijriLabel = useMemo(() => getHijriDate(now), [now]);
  const nextPrayer = useMemo(() => getNextPrayer(now), [now]);
  const completedCount = obligatoryIds.filter((id) => completed.has(id)).length;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(`nur_prayers_${dateKey}`, JSON.stringify([...completed]));
  }, [completed, dateKey]);

  useEffect(() => {
    localStorage.setItem('nur_prayer_notifications', JSON.stringify([...notifications]));
  }, [notifications]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const toggleCompleted = (id: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleNotification = (id: string) => {
    setNotifications((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const refresh = () => {
    setRefreshing(true);
    setNow(new Date());
    window.setTimeout(() => {
      setRefreshing(false);
      flash('Angezeigter Zeitplan aktualisiert');
    }, 700);
  };

  const NextIcon = nextPrayer.prayer.icon;
  const nextDone = completed.has(nextPrayer.prayer.id);

  return (
    <motion.main
      className="screen prayer-screen reference-prayer-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">{hijriLabel}</span><h1>Gebetszeiten</h1></div>
        <button className="icon-button" onClick={refresh} aria-label="Gebetszeiten aktualisieren"><RefreshCw size={20} className={refreshing ? 'spin' : ''} /></button>
      </header>

      <section className="prayer-location-card glass-card reference-prayer-location">
        <span className="prayer-location-card__icon"><Navigation size={20} /></span>
        <span><small>{dateLabel}</small><strong>Berlin, Deutschland</strong></span>
        <button onClick={() => flash('Standortauswahl geöffnet')}>Ändern</button>
      </section>

      <section className="next-prayer-panel reference-next-prayer">
        <div className="next-prayer-panel__glow" />
        <div className="next-prayer-panel__topline">
          <span className="hero-pill">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Gebet'}</span>
          <span><MapPin size={14} /> Berlin</span>
        </div>
        <div className="next-prayer-panel__main">
          <div><span className="arabic-label">{nextPrayer.prayer.arabic}</span><h2>{nextPrayer.prayer.label}</h2><p>{nextPrayer.prayer.description}</p></div>
          <div className="next-prayer-panel__time"><span className="reference-next-prayer__icon"><NextIcon size={23} /></span><strong>{nextPrayer.prayer.time}</strong><span><Clock3 size={15} /> noch {formatRemaining(nextPrayer.remaining)}</span></div>
        </div>
        <div className="next-prayer-panel__progress"><span style={{ width: `${nextPrayer.progress}%` }} /></div>
        <div className="next-prayer-panel__actions">
          <button className="gold-button" onClick={() => toggleCompleted(nextPrayer.prayer.id)}>
            {nextDone ? <CircleCheck size={18} /> : <Check size={18} />}
            {nextDone ? 'Als gebetet markiert' : 'Als gebetet markieren'}
          </button>
          <button
            className={adhanPlaying ? 'adhan-button adhan-button--active' : 'adhan-button'}
            onClick={() => {
              setAdhanPlaying((value) => !value);
              flash(adhanPlaying ? 'Adhan-Vorschau beendet' : 'Adhan-Vorschau aktiviert');
            }}
            aria-pressed={adhanPlaying}
            aria-label="Adhan-Vorschau umschalten"
          >
            {adhanPlaying ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
        </div>
      </section>

      <section className="daily-prayer-progress glass-card reference-prayer-progress">
        <div className="daily-prayer-progress__ring" style={{ '--progress': `${completedCount * 20}%` } as CSSProperties}><span><strong>{completedCount}</strong>/5</span></div>
        <div><span className="overline">Gebets-Tracker</span><h3>{completedCount === 5 ? 'Alle Pflichtgebete geschafft' : 'Dein Fortschritt heute'}</h3><p>{completedCount === 5 ? 'Möge Allah deine Gebete annehmen.' : `${5 - completedCount} Pflichtgebete sind noch offen.`}</p></div>
      </section>

      <section className="prayer-schedule-section">
        <div className="section-heading">
          <div><span className="overline">Tagesübersicht</span><h2>Alle Gebetszeiten</h2></div>
          <button className="text-button" onClick={() => flash('Benachrichtigungen geöffnet')}><BellRing size={15} /> Erinnerungen</button>
        </div>

        <div className="prayer-schedule-list">
          {prayerTimes.map((prayer, index) => {
            const Icon = prayer.icon;
            const isNext = prayer.id === nextPrayer.prayer.id;
            const done = completed.has(prayer.id);
            const notificationOn = notifications.has(prayer.id);

            return (
              <motion.article key={prayer.id} className={isNext ? 'prayer-time-row prayer-time-row--next' : 'prayer-time-row'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
                <span className="prayer-time-row__icon"><Icon size={21} /></span>
                <span className="prayer-time-row__name"><small>{prayer.arabic}</small><strong>{prayer.label}</strong><em>{prayer.description}</em></span>
                <strong className="prayer-time-row__time">{prayer.time}</strong>
                <button className={notificationOn ? 'prayer-alert prayer-alert--on' : 'prayer-alert'} onClick={() => toggleNotification(prayer.id)} aria-label={`Benachrichtigung für ${prayer.label}`} aria-pressed={notificationOn}>{notificationOn ? <BellRing size={17} /> : <Bell size={17} />}</button>
                {prayer.obligatory ? <button className={done ? 'prayer-complete prayer-complete--done' : 'prayer-complete'} onClick={() => toggleCompleted(prayer.id)} aria-label={`${prayer.label} als gebetet markieren`} aria-pressed={done}>{done ? <CircleCheck size={19} /> : <span />}</button> : <span className="prayer-complete prayer-complete--disabled" />}
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="method-card glass-card reference-prayer-method">
        <span className="method-card__icon"><MoonStar size={22} /></span>
        <span><small>Lokaler Demo-Zeitplan</small><strong>Diyanet · Standard-Asr</strong><em>Vor Veröffentlichung mit einer echten Gebetszeitenquelle verbinden.</em></span>
        <button onClick={() => flash('Berechnungseinstellungen geöffnet')}>Anpassen</button>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
