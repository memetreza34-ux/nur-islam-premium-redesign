import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Compass,
  Globe2,
  HandHeart,
  Home,
  MapPin,
  MessageCircleQuestion,
  MoonStar,
  Play,
  Quote,
  Settings,
  Sparkles,
  SunMedium,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PrayerScreen } from './PrayerScreen';
import { CalendarScreen } from './CalendarScreen';
import { LearnScreen } from './LearnScreen';
import { MoreScreen } from './MoreScreen';

type Tab = 'home' | 'prayer' | 'calendar' | 'learn' | 'more';

type QuickAction = {
  label: string;
  eyebrow: string;
  icon: LucideIcon;
  accent: 'gold' | 'cream' | 'emerald';
};

const quickActions: QuickAction[] = [
  { label: 'Quran lesen', eyebrow: 'Weiterlernen', icon: BookOpen, accent: 'gold' },
  { label: 'Wudu & Salah', eyebrow: 'Schritt für Schritt', icon: HandHeart, accent: 'cream' },
  { label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles, accent: 'emerald' },
  { label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit, accent: 'gold' },
  { label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart, accent: 'cream' },
  { label: 'KI-Assistent', eyebrow: 'Bald verfügbar', icon: MessageCircleQuestion, accent: 'emerald' },
];

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function getIslamicDate() {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  } catch {
    return 'Islamischer Kalender';
  }
}

function ProgressRing({ value, total }: { value: number; total: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / total);

  return (
    <div className="progress-ring" aria-label={`${value} von ${total} Gebeten erledigt`}>
      <svg viewBox="0 0 84 84" role="img">
        <circle className="progress-ring__track" cx="42" cy="42" r={radius} />
        <circle
          className="progress-ring__value"
          cx="42"
          cy="42"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <strong>{value}/{total}</strong>
    </div>
  );
}

function MosqueSilhouette() {
  return (
    <svg className="mosque-silhouette" viewBox="0 0 520 220" aria-hidden="true">
      <defs>
        <linearGradient id="mosqueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(251, 226, 157, .22)" />
          <stop offset="1" stopColor="rgba(4, 36, 28, 0)" />
        </linearGradient>
      </defs>
      <path
        d="M34 205h452M77 205v-82h34v82m-17-82V78m0 0-15 24h30L94 78Zm315 127v-82h34v82m-17-82V78m0 0-15 24h30l-15-24ZM161 205v-73h198v73m-154 0v-60c0-31 24-57 55-57s55 26 55 57v60M260 88V58m0 0-12 20h24l-12-20Z"
        fill="url(#mosqueFill)"
        stroke="rgba(244, 214, 143, .34)"
        strokeWidth="2"
      />
    </svg>
  );
}

function PremiumHome({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [completed, setCompleted] = useState(() => new Set(['Fajr', 'Dhuhr', 'Asr']));
  const [toast, setToast] = useState<string | null>(null);
  const islamicDate = useMemo(getIslamicDate, []);

  const togglePrayer = (prayer: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(prayer)) next.delete(prayer);
      else next.add(prayer);
      return next;
    });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <motion.main
      className="screen premium-home"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="topbar glass-card">
        <div>
          <span className="overline">Nur Islam</span>
          <h1>Assalamu Alaikum</h1>
          <div className="date-chip">
            <MoonStar size={14} />
            <span>{islamicDate}</span>
          </div>
        </div>

        <div className="topbar__actions">
          <button className="icon-button" onClick={() => showToast('Qibla-Kompass geöffnet')} aria-label="Qibla öffnen">
            <Compass size={20} />
          </button>
          <button className="icon-button" onClick={() => onNavigate('more')} aria-label="Einstellungen öffnen">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <section className="prayer-hero" aria-label="Nächstes Gebet">
        <MosqueSilhouette />
        <div className="prayer-hero__halo" />
        <div className="prayer-hero__content">
          <div className="hero-meta">
            <span className="hero-pill">Nächstes Gebet</span>
            <span className="location"><MapPin size={14} /> Berlin</span>
          </div>

          <div className="hero-main">
            <div>
              <span className="arabic-label">الظهر</span>
              <h2>Dhuhr</h2>
              <div className="countdown"><Clock3 size={16} /> in 2 Std. 15 Min.</div>
            </div>
            <div className="hero-time">
              <strong>12:45</strong>
              <span>Mittagsgebet</span>
            </div>
          </div>

          <div className="hero-progress" aria-hidden="true"><span /></div>

          <button className="gold-button" onClick={() => onNavigate('prayer')}>
            Zu den Gebeten <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="tracker glass-card">
        <div className="tracker__summary">
          <ProgressRing value={completed.size} total={5} />
          <div>
            <span className="overline">Gebets-Tracker</span>
            <h3>Dein heutiger Fortschritt</h3>
            <p>{completed.size === 5 ? 'Alle Pflichtgebete erledigt.' : 'Bleib Schritt für Schritt konsequent.'}</p>
          </div>
        </div>

        <div className="prayer-checks">
          {prayers.map((prayer) => {
            const done = completed.has(prayer);
            return (
              <button
                key={prayer}
                className={done ? 'prayer-check prayer-check--done' : 'prayer-check'}
                onClick={() => togglePrayer(prayer)}
                aria-pressed={done}
              >
                <span>{done ? <CircleCheck size={17} /> : null}</span>
                {prayer}
              </button>
            );
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="overline">Entdecken</span>
            <h2>Dein täglicher Begleiter</h2>
          </div>
          <button className="text-button" onClick={() => onNavigate('learn')}>Alles ansehen <ChevronRight size={16} /></button>
        </div>

        <div className="quick-grid">
          {quickActions.map(({ label, eyebrow, icon: Icon, accent }, index) => (
            <motion.button
              key={label}
              className={`quick-card quick-card--${accent}`}
              onClick={() => showToast(`${label} geöffnet`)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045 }}
            >
              <span className="quick-card__icon"><Icon size={25} /></span>
              <span className="quick-card__eyebrow">{eyebrow}</span>
              <strong>{label}</strong>
              <ChevronRight className="quick-card__arrow" size={18} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="continue-card glass-card">
        <div className="continue-card__cover" aria-hidden="true">
          <BookOpen size={35} />
          <span>الكهف</span>
        </div>
        <div className="continue-card__body">
          <span className="overline">Weiterlesen</span>
          <h3>Surah Al-Kahf</h3>
          <p>Ayah 18 von 110 · zuletzt heute gelesen</p>
          <div className="reading-progress"><span /></div>
        </div>
        <button className="play-button" aria-label="Weiterlesen" onClick={() => showToast('Quran-Lesemodus geöffnet')}>
          <Play size={20} fill="currentColor" />
        </button>
      </section>

      <section className="inspiration-grid">
        <article className="verse-card">
          <div className="card-title-row">
            <span><Sparkles size={16} /> Ayah des Tages</span>
            <button onClick={() => showToast('Ayah gespeichert')} aria-label="Ayah speichern"><BookHeart size={18} /></button>
          </div>
          <p className="arabic-verse" dir="rtl">وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ</p>
          <blockquote>„Und gedenkt Allahs häufig, auf dass es euch wohl ergehen möge.“</blockquote>
          <footer>Al-Anfal · 8:45</footer>
        </article>

        <article className="hadith-card glass-card">
          <div className="card-title-row">
            <span><Quote size={16} /> Hadith des Tages</span>
          </div>
          <blockquote>„Die Taten werden nur nach den Absichten beurteilt.“</blockquote>
          <footer>Sahih al-Bukhari</footer>
        </article>
      </section>

      <section className="content-section recommendations">
        <div className="section-heading">
          <div>
            <span className="overline">Empfohlen</span>
            <h2>Heute für dich</h2>
          </div>
        </div>

        <div className="recommendation-list">
          <button className="recommendation-card" onClick={() => showToast('Fasten-Assistent geöffnet')}>
            <span className="recommendation-card__icon"><SunMedium size={22} /></span>
            <span><small>Fasten-Assistent</small><strong>Montag- und Donnerstagfasten</strong></span>
            <ChevronRight size={20} />
          </button>
          <button className="recommendation-card" onClick={() => showToast('Ummah-Weltkarte geöffnet')}>
            <span className="recommendation-card__icon"><Globe2 size={22} /></span>
            <span><small>Ummah-Weltkarte</small><strong>Muslime weltweit entdecken</strong></span>
            <ChevronRight size={20} />
          </button>
          <button className="recommendation-card" onClick={() => showToast('Moschee-Suche geöffnet')}>
            <span className="recommendation-card__icon"><UsersRound size={22} /></span>
            <span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span>
            <ChevronRight size={20} />
          </button>
        </div>
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

function BottomNavigation({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
    { id: 'home', label: 'Start', icon: Home },
    { id: 'prayer', label: 'Gebete', icon: MoonStar },
    { id: 'calendar', label: 'Kalender', icon: CalendarDays },
    { id: 'learn', label: 'Lernen', icon: BookOpen },
    { id: 'more', label: 'Mehr', icon: UserRound },
  ];

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={active === id ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'} onClick={() => onChange(id)}>
          <span><Icon size={20} /></span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="app-background">
      <div className="background-orbit background-orbit--one" />
      <div className="background-orbit background-orbit--two" />
      <div className="app-shell">
        {activeTab === 'home' ? (
          <PremiumHome onNavigate={setActiveTab} />
        ) : activeTab === 'prayer' ? (
          <PrayerScreen onBack={() => setActiveTab('home')} />
        ) : activeTab === 'calendar' ? (
          <CalendarScreen onBack={() => setActiveTab('home')} />
        ) : activeTab === 'learn' ? (
          <LearnScreen onBack={() => setActiveTab('home')} />
        ) : (
          <MoreScreen onBack={() => setActiveTab('home')} />
        )}
        <BottomNavigation active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
