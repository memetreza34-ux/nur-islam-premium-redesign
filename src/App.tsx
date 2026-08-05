import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  BrainCircuit,
  CalendarDays,
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
import { MoreScreen } from './MoreScreen';
import { LearnScreen } from './LearnScreen';
import {
  CrescentObject,
  LanternObject,
  MosqueScene,
  NurMark,
  PremiumImage,
  QiblaObject,
  QuranObject,
  RosetteObject,
} from './PremiumVisuals';

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
  { label: 'KI-Assistent', eyebrow: 'Design vorbereitet', icon: MessageCircleQuestion, accent: 'emerald' },
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
      className="screen premium-home premium-home--v2"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="brand-bar">
        <button className="brand-lockup" onClick={() => showToast('Nur Islam')} aria-label="Nur Islam">
          <PremiumImage
            src="/premium-assets/high-res-objects/nur-logo-emblem.png"
            className="brand-lockup__mark"
            fallback={<NurMark />}
          />
          <span><strong>Nur</strong><small>Dein spiritueller Begleiter</small></span>
        </button>
        <div className="brand-bar__actions">
          <button className="icon-button" onClick={() => showToast('Qibla-Kompass geöffnet')} aria-label="Qibla öffnen"><Compass size={20} /></button>
          <button className="icon-button" onClick={() => onNavigate('more')} aria-label="Einstellungen öffnen"><Settings size={20} /></button>
        </div>
      </header>

      <section className="welcome-hero">
        <div className="welcome-hero__shade" />
        <PremiumImage
          src="/premium-assets/high-res-objects/mosque-gold.png"
          className="welcome-hero__visual"
          fallback={<MosqueScene />}
        />
        <div className="welcome-hero__copy">
          <span className="overline">Assalamu Alaikum</span>
          <h1>Ein ruhiger Ort für deinen Glauben.</h1>
          <p>Möge Allah deinen Tag segnen, dir Frieden schenken und dich im Guten bestärken.</p>
        </div>
        <div className="welcome-hero__date">
          <span className="welcome-hero__date-day">20</span>
          <span><strong>{islamicDate}</strong><small>Islamischer Kalender</small></span>
          <CalendarDays size={20} />
        </div>
      </section>

      <section className="prayer-hero prayer-hero--v2" aria-label="Nächstes Gebet">
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
            <div className="hero-orb">
              <span className="hero-orb__ring" />
              <SunMedium size={31} />
              <strong>12:45</strong>
            </div>
          </div>
          <div className="prayer-mini-times">
            {[
              ['Fajr', '05:24'], ['Sonne', '06:49'], ['Dhuhr', '12:45'], ['Asr', '15:37'], ['Maghrib', '17:28'], ['Isha', '18:54'],
            ].map(([name, time]) => <span className={name === 'Dhuhr' ? 'is-current' : ''} key={name}><SunMedium size={14} /><small>{name}</small><strong>{time}</strong></span>)}
          </div>
          <button className="gold-button" onClick={() => onNavigate('prayer')}>Alle Gebetszeiten <ChevronRight size={18} /></button>
        </div>
      </section>

      <section className="tracker glass-card tracker--v2">
        <div className="tracker__summary">
          <ProgressRing value={completed.size} total={5} />
          <div><span className="overline">Gebets-Tracker</span><h3>Dein Fortschritt heute</h3><p>{completed.size === 5 ? 'Alle Pflichtgebete erledigt.' : 'Bleib Schritt für Schritt konsequent.'}</p></div>
        </div>
        <div className="prayer-checks">
          {prayers.map((prayer) => {
            const done = completed.has(prayer);
            return <button key={prayer} className={done ? 'prayer-check prayer-check--done' : 'prayer-check'} onClick={() => togglePrayer(prayer)} aria-pressed={done}><span>{done ? <CircleCheck size={17} /> : null}</span>{prayer}</button>;
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="overline">Deine Reise</span><h2>Spirituelle Werkzeuge</h2></div><button className="text-button" onClick={() => onNavigate('learn')}>Alles ansehen <ChevronRight size={16} /></button></div>
        <div className="journey-grid">
          <button className="journey-card journey-card--quran" onClick={() => showToast('Quran-Bereich geöffnet')}>
            <PremiumImage src="/premium-assets/high-res-objects/quran-closed.png" fallback={<QuranObject />} />
            <span><small>Weiterlesen</small><strong>Surah Al-Kahf</strong><em>Ayah 18 von 110</em></span>
          </button>
          <button className="journey-card" onClick={() => showToast('Dhikr geöffnet')}>
            <PremiumImage src="/premium-assets/high-res-objects/tasbih.png" fallback={<RosetteObject />} />
            <span><small>Tägliches Ziel</small><strong>Dhikr</strong><em>33 von 100</em></span>
          </button>
          <button className="journey-card" onClick={() => showToast('Qibla geöffnet')}>
            <PremiumImage src="/premium-assets/high-res-objects/qibla-compass.png" fallback={<QiblaObject />} />
            <span><small>Richtung Mekka</small><strong>Qibla</strong><em>Kompass starten</em></span>
          </button>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="overline">Entdecken</span><h2>Dein täglicher Begleiter</h2></div></div>
        <div className="quick-grid quick-grid--v2">
          {quickActions.map(({ label, eyebrow, icon: Icon, accent }, index) => (
            <motion.button key={label} className={`quick-card quick-card--${accent}`} onClick={() => showToast(`${label} geöffnet`)} whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}>
              <span className="quick-card__icon"><Icon size={25} /></span><span className="quick-card__eyebrow">{eyebrow}</span><strong>{label}</strong><ChevronRight className="quick-card__arrow" size={18} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="continue-card continue-card--v2 glass-card">
        <div className="continue-card__cover"><PremiumImage src="/premium-assets/high-res-objects/quran-bookmark.png" fallback={<QuranObject />} /></div>
        <div className="continue-card__body"><span className="overline">Weiterlesen</span><h3>Surah Al-Kahf</h3><p>Ayah 18 von 110 · zuletzt heute gelesen</p><div className="reading-progress"><span /></div></div>
        <button className="play-button" aria-label="Weiterlesen" onClick={() => showToast('Quran-Lesemodus geöffnet')}><Play size={20} fill="currentColor" /></button>
      </section>

      <section className="inspiration-grid inspiration-grid--v2">
        <article className="verse-card verse-card--cream">
          <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch.png" className="verse-card__art" fallback={<LanternObject />} />
          <div className="card-title-row"><span><Sparkles size={16} /> Ayah des Tages</span><button onClick={() => showToast('Ayah gespeichert')} aria-label="Ayah speichern"><BookHeart size={18} /></button></div>
          <p className="arabic-verse" dir="rtl">وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ</p>
          <blockquote>„Und gedenkt Allahs häufig, auf dass es euch wohl ergehen möge.“</blockquote><footer>Al-Anfal · 8:45</footer>
        </article>
        <article className="hadith-card glass-card"><div className="card-title-row"><span><Quote size={16} /> Hadith des Tages</span></div><blockquote>„Die Taten werden nur nach den Absichten beurteilt.“</blockquote><footer>Sahih al-Bukhari</footer></article>
      </section>

      <section className="ai-preview">
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem.png" className="ai-preview__mark" fallback={<NurMark />} />
        <span><small>Nur Assistent</small><strong>Assalamu Alaikum</strong><p>Der visuelle Bereich ist vorbereitet. Eine echte KI-Verbindung folgt separat.</p></span>
        <button onClick={() => showToast('KI-Assistent benötigt noch einen Anbieter')}><MessageCircleQuestion size={20} /></button>
      </section>

      <section className="content-section recommendations">
        <div className="section-heading"><div><span className="overline">Empfohlen</span><h2>Heute für dich</h2></div></div>
        <div className="recommendation-list">
          <button className="recommendation-card" onClick={() => showToast('Fasten-Assistent geöffnet')}><span className="recommendation-card__icon"><CrescentObject /></span><span><small>Fasten-Assistent</small><strong>Montag- und Donnerstagfasten</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => showToast('Ummah-Weltkarte geöffnet')}><span className="recommendation-card__icon"><Globe2 size={22} /></span><span><small>Ummah-Weltkarte</small><strong>Muslime weltweit entdecken</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => showToast('Moschee-Suche geöffnet')}><span className="recommendation-card__icon"><UsersRound size={22} /></span><span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span><ChevronRight size={20} /></button>
        </div>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}

function BottomNavigation({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
    { id: 'home', label: 'Start', icon: Home },
    { id: 'prayer', label: 'Gebete', icon: MoonStar },
    { id: 'calendar', label: 'Kalender', icon: CalendarDays },
    { id: 'learn', label: 'Lernen', icon: BookOpen },
    { id: 'more', label: 'Profil', icon: UserRound },
  ];
  return <nav className="bottom-nav" aria-label="Hauptnavigation">{items.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'} onClick={() => onChange(id)}><span><Icon size={20} /></span><small>{label}</small></button>)}</nav>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  return (
    <div className="app-background app-background--v2">
      <div className="background-orbit background-orbit--one" /><div className="background-orbit background-orbit--two" />
      <div className="app-shell">
        {activeTab === 'home' ? <PremiumHome onNavigate={setActiveTab} /> : activeTab === 'prayer' ? <PrayerScreen onBack={() => setActiveTab('home')} /> : activeTab === 'calendar' ? <CalendarScreen onBack={() => setActiveTab('home')} /> : activeTab === 'learn' ? <LearnScreen onBack={() => setActiveTab('home')} /> : <MoreScreen onBack={() => setActiveTab('home')} />}
        <BottomNavigation active={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
