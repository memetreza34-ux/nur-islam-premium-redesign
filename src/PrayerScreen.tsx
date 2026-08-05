import { useMemo, useState } from 'react';
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

const obligatoryIds = prayerTimes.filter((item) => item.obligatory).map((item) => item.id);

function getGregorianDate() {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export function PrayerScreen({ onBack }: { onBack: () => void }) {
  const [completed, setCompleted] = useState(() => new Set(['fajr']));
  const [notifications, setNotifications] = useState(() => new Set(['fajr', 'dhuhr', 'maghrib', 'isha']));
  const [adhanPlaying, setAdhanPlaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dateLabel = useMemo(getGregorianDate, []);
  const completedCount = obligatoryIds.filter((id) => completed.has(id)).length;

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
    window.setTimeout(() => {
      setRefreshing(false);
      flash('Gebetszeiten aktualisiert');
    }, 900);
  };

  return (
    <motion.main
      className="screen prayer-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="prayer-page-header glass-card">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite">
          <ChevronLeft size={20} />
        </button>
        <div>
          <span className="overline">Heute</span>
          <h1>Gebetszeiten</h1>
        </div>
        <button className="icon-button" onClick={refresh} aria-label="Gebetszeiten aktualisieren">
          <RefreshCw size={20} className={refreshing ? 'spin' : ''} />
        </button>
      </header>

      <section className="prayer-location-card glass-card">
        <span className="prayer-location-card__icon"><Navigation size={20} /></span>
        <span>
          <small>Aktueller Standort</small>
          <strong>Berlin, Deutschland</strong>
        </span>
        <button onClick={() => flash('Standortauswahl geöffnet')}>Ändern</button>
      </section>

      <section className="next-prayer-panel">
        <div className="next-prayer-panel__glow" />
        <div className="next-prayer-panel__topline">
          <span className="hero-pill">Nächstes Gebet</span>
          <span><MapPin size={14} /> Berlin</span>
        </div>
        <div className="next-prayer-panel__main">
          <div>
            <span className="arabic-label">الظهر</span>
            <h2>Dhuhr</h2>
            <p>Mittagsgebet</p>
          </div>
          <div className="next-prayer-panel__time">
            <strong>12:45</strong>
            <span><Clock3 size={15} /> noch 2 Std. 15 Min.</span>
          </div>
        </div>
        <div className="next-prayer-panel__progress"><span /></div>
        <div className="next-prayer-panel__actions">
          <button className="gold-button" onClick={() => toggleCompleted('dhuhr')}>
            {completed.has('dhuhr') ? <CircleCheck size={18} /> : <Check size={18} />}
            {completed.has('dhuhr') ? 'Als gebetet markiert' : 'Als gebetet markieren'}
          </button>
          <button
            className={adhanPlaying ? 'adhan-button adhan-button--active' : 'adhan-button'}
            onClick={() => {
              setAdhanPlaying((value) => !value);
              flash(adhanPlaying ? 'Adhan gestoppt' : 'Adhan gestartet');
            }}
            aria-pressed={adhanPlaying}
          >
            {adhanPlaying ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
        </div>
      </section>

      <section className="daily-prayer-progress glass-card">
        <div className="daily-prayer-progress__ring" style={{ '--progress': `${completedCount * 20}%` } as React.CSSProperties}>
          <span><strong>{completedCount}</strong>/5</span>
        </div>
        <div>
          <span className="overline">Gebets-Tracker</span>
          <h3>{completedCount === 5 ? 'Alle Pflichtgebete geschafft' : 'Dein Fortschritt heute'}</h3>
          <p>{completedCount === 5 ? 'Möge Allah deine Gebete annehmen.' : `${5 - completedCount} Pflichtgebete sind noch offen.`}</p>
        </div>
      </section>

      <section className="prayer-schedule-section">
        <div className="section-heading">
          <div>
            <span className="overline">Tagesübersicht</span>
            <h2>Alle Gebetszeiten</h2>
          </div>
          <button className="text-button" onClick={() => flash('Benachrichtigungen geöffnet')}>
            <BellRing size={15} /> Erinnerungen
          </button>
        </div>

        <div className="prayer-schedule-list">
          {prayerTimes.map((prayer, index) => {
            const Icon = prayer.icon;
            const isNext = prayer.id === 'dhuhr';
            const done = completed.has(prayer.id);
            const notificationOn = notifications.has(prayer.id);

            return (
              <motion.article
                key={prayer.id}
                className={isNext ? 'prayer-time-row prayer-time-row--next' : 'prayer-time-row'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <span className="prayer-time-row__icon"><Icon size={21} /></span>
                <span className="prayer-time-row__name">
                  <small>{prayer.arabic}</small>
                  <strong>{prayer.label}</strong>
                  <em>{prayer.description}</em>
                </span>
                <strong className="prayer-time-row__time">{prayer.time}</strong>
                <button
                  className={notificationOn ? 'prayer-alert prayer-alert--on' : 'prayer-alert'}
                  onClick={() => toggleNotification(prayer.id)}
                  aria-label={`Benachrichtigung für ${prayer.label}`}
                  aria-pressed={notificationOn}
                >
                  {notificationOn ? <BellRing size={17} /> : <Bell size={17} />}
                </button>
                {prayer.obligatory ? (
                  <button
                    className={done ? 'prayer-complete prayer-complete--done' : 'prayer-complete'}
                    onClick={() => toggleCompleted(prayer.id)}
                    aria-label={`${prayer.label} als gebetet markieren`}
                    aria-pressed={done}
                  >
                    {done ? <CircleCheck size={19} /> : <span />}
                  </button>
                ) : <span className="prayer-complete prayer-complete--disabled" />}
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="method-card glass-card">
        <span className="method-card__icon"><MoonStar size={22} /></span>
        <span>
          <small>Berechnungsmethode</small>
          <strong>Diyanet · Standard-Asr</strong>
          <em>Zeitzone Europa/Berlin</em>
        </span>
        <button onClick={() => flash('Berechnungseinstellungen geöffnet')}>Anpassen</button>
      </section>

      <AnimatePresence>
        {toast ? (
          <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <CircleCheck size={18} /> {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
