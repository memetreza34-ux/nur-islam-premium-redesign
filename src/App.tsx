import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Compass,
  Globe2,
  HandHeart,
  Home,
  MapPin,
  Menu,
  MessageCircleQuestion,
  MoonStar,
  Play,
  Quote,
  Sparkles,
  Sunrise,
  SunMedium,
  UsersRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AssistantScreen } from './AssistantScreen';
import { CalendarScreen } from './CalendarScreen';
import { CollectionsScreen } from './CollectionsScreen';
import { DhikrScreen } from './DhikrScreen';
import { MosqueScreen } from './DiscoveryScreens';
import { DuasScreen } from './DuasScreen';
import { InstallAppPrompt } from './InstallAppPrompt';
import { LearnScreen } from './LearnScreen';
import { LegacyFeatureScreen } from './LegacyFeatureScreens';
import type { LegacyFeatureId } from './LegacyFeatureScreens';
import { MoreScreen } from './MoreScreen';
import { NamesScreen } from './NamesScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { PrayerScreen } from './PrayerScreen';
import { QiblaScreen } from './QiblaScreen';
import { QuranReaderScreen } from './QuranReaderScreen';
import { QuranScreen } from './QuranScreen';
import {
  AyahDetailScreen,
  HadithDetailScreen,
  WorshipGuideScreen,
} from './ReferenceReadingScreens';
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
import {
  formatPrayerRemaining,
  getNextPrayer,
  PRAYER_SCHEDULE,
  PRAYER_SCHEDULE_META,
} from './prayerSchedule';

type PrimaryTab = 'home' | 'prayer' | 'calendar' | 'learn' | 'profile';
type LegacyTab = `legacy:${LegacyFeatureId}`;
type Tab = PrimaryTab | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'collections' | 'assistant' | 'reader' | 'ayah' | 'hadith' | 'wudu' | 'salah' | LegacyTab;

type QuickAction = {
  label: string;
  eyebrow: string;
  icon: LucideIcon;
  accent: 'gold' | 'cream' | 'emerald';
  target?: Tab;
};

const quickActions: QuickAction[] = [
  { label: 'Quran lesen', eyebrow: 'Offline weiterlesen', icon: BookOpen, accent: 'gold', target: 'reader' },
  { label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: HandHeart, accent: 'cream', target: 'learn' },
  { label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles, accent: 'emerald', target: 'names' },
  { label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit, accent: 'gold', target: 'legacy:quiz' },
  { label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart, accent: 'cream', target: 'duas' },
  { label: 'KI-Assistent', eyebrow: 'Quellenbasierter Modus', icon: MessageCircleQuestion, accent: 'emerald', target: 'assistant' },
];

const screensWithBottomNavigation = new Set<Tab>([
  'home',
  'quran',
  'dhikr',
  'qibla',
  'profile',
  'prayer',
  'calendar',
  'learn',
  'duas',
  'names',
  'mosques',
  'collections',
  'assistant',
]);

function isLegacyTab(tab: Tab): tab is LegacyTab {
  return tab.startsWith('legacy:');
}

function getLegacyFeatureId(tab: LegacyTab) {
  return tab.slice('legacy:'.length) as LegacyFeatureId;
}

function getIslamicDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('de-DE-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Islamischer Kalender';
  }
}

function getHomeGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 11) return 'Ein friedlicher Morgen für deinen Glauben.';
  if (hour < 18) return 'Ein ruhiger Tag für deinen Glauben.';
  return 'Ein gesegneter Abend für deinen Glauben.';
}

function PrayerVisual({ visual, size = 14 }: { visual: 'moon' | 'sunrise' | 'sun'; size?: number }) {
  if (visual === 'moon') return <MoonStar size={size} />;
  if (visual === 'sunrise') return <Sunrise size={size} />;
  return <SunMedium size={size} />;
}

function hasCompletedOnboarding() {
  try {
    return localStorage.getItem('nur_onboarding_complete') === 'true';
  } catch {
    return false;
  }
}

function PremiumHome({
  onNavigate,
  onOpenReader,
}: {
  onNavigate: (tab: Tab) => void;
  onOpenReader: (surahNumber: number) => void;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const islamicDate = getIslamicDate(now);
  const nextPrayer = getNextPrayer(now);
  const greeting = getHomeGreeting(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <motion.main
      className="screen premium-home premium-home--v2"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="brand-bar">
        <button className="brand-lockup" onClick={() => showToast('Nur Islam')} aria-label="Nur Islam">
          <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" className="brand-lockup__mark" fallback={<NurMark />} />
          <span><strong>Nur</strong><small>Dein spiritueller Begleiter</small></span>
        </button>
        <div className="brand-bar__actions">
          <button className="icon-button" onClick={() => onNavigate('qibla')} aria-label="Qibla öffnen"><Compass size={20} /></button>
          <button className="icon-button" onClick={() => onNavigate('profile')} aria-label="Mehr öffnen"><Menu size={20} /></button>
        </div>
      </header>

      <section className="welcome-hero">
        <div className="welcome-hero__shade" />
        <PremiumImage src="/premium-assets/high-res-objects/mosque-gold-v2.webp" className="welcome-hero__visual" fallback={<MosqueScene />} />
        <div className="welcome-hero__copy">
          <span className="overline">Assalamu Alaikum</span>
          <h1>{greeting}</h1>
          <p>Möge Allah deinen Tag segnen, dir Frieden schenken und dich im Guten bestärken.</p>
        </div>
        <button className="welcome-hero__date" onClick={() => onNavigate('calendar')}>
          <span className="welcome-hero__date-day">{now.getDate()}</span>
          <span><strong>{islamicDate}</strong><small>Islamischer Kalender</small></span>
          <CalendarDays size={20} />
        </button>
      </section>

      <section className="prayer-hero prayer-hero--v2" aria-label="Nächstes Gebet">
        <div className="prayer-hero__content">
          <div className="hero-meta">
            <span className="hero-pill">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Gebet'}</span>
            <span className="location"><MapPin size={14} /> {PRAYER_SCHEDULE_META.city}</span>
          </div>
          <div className="hero-main">
            <div>
              <span className="arabic-label">{nextPrayer.prayer.arabic}</span>
              <h2>{nextPrayer.prayer.label}</h2>
              <div className="countdown">{nextPrayer.tomorrow ? 'morgen in ' : 'in '}{formatPrayerRemaining(nextPrayer.remaining)}</div>
            </div>
            <div className="hero-orb">
              <span className="hero-orb__ring" />
              <PrayerVisual visual={nextPrayer.prayer.visual} size={31} />
              <strong>{nextPrayer.prayer.time}</strong>
            </div>
          </div>
          <div className="prayer-mini-times">
            {PRAYER_SCHEDULE.map((prayer) => (
              <span className={prayer.id === nextPrayer.prayer.id ? 'is-current' : ''} key={prayer.id}>
                <PrayerVisual visual={prayer.visual} />
                <small>{prayer.compactLabel}</small>
                <strong>{prayer.time}</strong>
              </span>
            ))}
          </div>
          <span className="prayer-source-note">{PRAYER_SCHEDULE_META.sourceLabel} · {PRAYER_SCHEDULE_META.methodLabel}</span>
          <button className="gold-button" onClick={() => onNavigate('prayer')}>Alle Gebetszeiten <ChevronRight size={18} /></button>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="overline">Deine Reise</span><h2>Spirituelle Werkzeuge</h2></div><button className="text-button" onClick={() => onNavigate('learn')}>Alles ansehen <ChevronRight size={16} /></button></div>
        <div className="journey-grid">
          <button className="journey-card journey-card--quran" onClick={() => onOpenReader(112)}>
            <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} />
            <span><small>Offline weiterlesen</small><strong>Surah Al-Ikhlaas</strong><em>4 Ayat vollständig verfügbar</em></span>
          </button>
          <button className="journey-card" onClick={() => onNavigate('dhikr')}>
            <PremiumImage src="/premium-assets/high-res-objects/tasbih-v2.webp" fallback={<RosetteObject />} />
            <span><small>Tägliches Ziel</small><strong>Dhikr</strong><em>33 von 100</em></span>
          </button>
          <button className="journey-card" onClick={() => onNavigate('qibla')}>
            <PremiumImage src="/premium-assets/high-res-objects/qibla-compass-v2.webp" fallback={<QiblaObject />} />
            <span><small>Richtung Mekka</small><strong>Qibla</strong><em>Kompass starten</em></span>
          </button>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="overline">Entdecken</span><h2>Dein täglicher Begleiter</h2></div></div>
        <div className="quick-grid quick-grid--v2">
          {quickActions.map(({ label, eyebrow, icon: Icon, accent, target }, index) => (
            <motion.button
              key={label}
              className={`quick-card quick-card--${accent}`}
              onClick={() => target === 'reader' ? onOpenReader(112) : target ? onNavigate(target) : undefined}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045 }}
            >
              <span className="quick-card__icon"><Icon size={25} /></span><span className="quick-card__eyebrow">{eyebrow}</span><strong>{label}</strong><ChevronRight className="quick-card__arrow" size={18} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="continue-card continue-card--v2 glass-card">
        <div className="continue-card__cover"><PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} /></div>
        <div className="continue-card__body"><span className="overline">Offline verfügbar</span><h3>Surah Al-Ikhlaas</h3><p>Arabisch und deutsche Bedeutung · 4 Ayat</p><div className="reading-progress"><span style={{ width: '25%' }} /></div></div>
        <button className="play-button" aria-label="Weiterlesen" onClick={() => onOpenReader(112)}><Play size={20} fill="currentColor" /></button>
      </section>

      <section className="inspiration-grid inspiration-grid--v2">
        <button className="verse-card verse-card--cream reference-daily-card-button" onClick={() => onNavigate('ayah')}>
          <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" className="verse-card__art" fallback={<LanternObject />} />
          <div className="card-title-row"><span><Sparkles size={16} /> Ayah des Tages</span><span><BookHeart size={18} /></span></div>
          <p className="arabic-verse" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
          <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote><footer>Al-Ikhlas · 112:1</footer>
        </button>
        <button className="hadith-card glass-card reference-daily-card-button" onClick={() => onNavigate('hadith')}><div className="card-title-row"><span><Quote size={16} /> Hadith des Tages</span></div><blockquote>Sinngemäß: Taten werden entsprechend den Absichten bewertet.</blockquote><footer>Sahih al-Bukhari 1</footer></button>
      </section>

      <button className="ai-preview" onClick={() => onNavigate('assistant')}>
        <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" className="ai-preview__mark" fallback={<NurMark />} />
        <span><small>Nur Assistent</small><strong>Assalamu Alaikum</strong><p>Quellenbasierter Bereich für Fragen zu Glauben und Alltag.</p></span>
        <span className="ai-preview__action"><MessageCircleQuestion size={20} /></span>
      </button>

      <section className="content-section recommendations">
        <div className="section-heading"><div><span className="overline">Empfohlen</span><h2>Heute für dich</h2></div></div>
        <div className="recommendation-list">
          <button className="recommendation-card" onClick={() => onNavigate('legacy:fasting')}><span className="recommendation-card__icon"><CrescentObject /></span><span><small>Fasten-Assistent</small><strong>Montag- und Donnerstagfasten</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('legacy:ummah')}><span className="recommendation-card__icon"><Globe2 size={22} /></span><span><small>Ummah-Weltkarte</small><strong>Muslime weltweit entdecken</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('mosques')}><span className="recommendation-card__icon"><UsersRound size={22} /></span><span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('collections')}><span className="recommendation-card__icon"><BookHeart size={22} /></span><span><small>Meine Sammlung</small><strong>Favoriten und Lesezeichen</strong></span><ChevronRight size={20} /></button>
        </div>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}

function BottomNavigation({ active, onChange }: { active: PrimaryTab; onChange: (tab: PrimaryTab) => void }) {
  const items: Array<{ id: PrimaryTab; label: string; icon: LucideIcon }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prayer', label: 'Gebete', icon: SunMedium },
    { id: 'calendar', label: 'Kalender', icon: CalendarDays },
    { id: 'learn', label: 'Lernen', icon: BookOpen },
    { id: 'profile', label: 'Mehr', icon: Menu },
  ];

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={active === id ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'} onClick={() => onChange(id)}>
          <span><Icon size={20} /></span><small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(hasCompletedOnboarding);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(112);
  const primaryActive: PrimaryTab = activeTab === 'prayer'
    ? 'prayer'
    : activeTab === 'calendar'
      ? 'calendar'
      : activeTab === 'learn'
        ? 'learn'
        : ['profile', 'duas', 'names', 'mosques', 'collections', 'assistant'].includes(activeTab)
          ? 'profile'
          : 'home';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, onboardingComplete, selectedSurahNumber]);

  useEffect(() => {
    const openPrayerTracker = () => {
      setOnboardingComplete(true);
      setActiveTab('prayer');
    };
    window.addEventListener('nur:open-prayer', openPrayerTracker);
    return () => window.removeEventListener('nur:open-prayer', openPrayerTracker);
  }, []);

  const goHome = () => setActiveTab('home');
  const goQuran = () => setActiveTab('quran');
  const goLearn = () => setActiveTab('learn');
  const openReader = (surahNumber: number) => {
    setSelectedSurahNumber(surahNumber);
    setActiveTab('reader');
  };

  if (!onboardingComplete) {
    return (
      <div className="app-background app-background--v2">
        <div className="background-orbit background-orbit--one" />
        <div className="background-orbit background-orbit--two" />
        <div className="app-shell app-shell--onboarding">
          <OnboardingScreen onComplete={() => {
            setOnboardingComplete(true);
            setActiveTab('home');
          }} />
        </div>
      </div>
    );
  }

  const screen = isLegacyTab(activeTab)
    ? <LegacyFeatureScreen featureId={getLegacyFeatureId(activeTab)} onBack={goHome} />
    : activeTab === 'home'
      ? <PremiumHome onNavigate={setActiveTab} onOpenReader={openReader} />
      : activeTab === 'quran'
        ? <QuranScreen onBack={goHome} onOpenReader={openReader} onOpenAyah={() => setActiveTab('ayah')} />
        : activeTab === 'reader'
          ? <QuranReaderScreen surahNumber={selectedSurahNumber} onBack={goQuran} onOpenSurah={setSelectedSurahNumber} />
          : activeTab === 'ayah'
            ? <AyahDetailScreen onBack={goHome} />
            : activeTab === 'hadith'
              ? <HadithDetailScreen onBack={goHome} />
              : activeTab === 'wudu'
                ? <WorshipGuideScreen initialMode="wudu" onBack={goLearn} />
                : activeTab === 'salah'
                  ? <WorshipGuideScreen initialMode="salah" onBack={goLearn} />
                  : activeTab === 'dhikr'
                    ? <DhikrScreen onBack={goHome} />
                    : activeTab === 'qibla'
                      ? <QiblaScreen onBack={goHome} />
                      : activeTab === 'profile'
                        ? <MoreScreen onBack={goHome} onNavigate={(destination) => setActiveTab(destination)} />
                        : activeTab === 'prayer'
                          ? <PrayerScreen onBack={goHome} />
                          : activeTab === 'calendar'
                            ? <CalendarScreen onBack={goHome} />
                            : activeTab === 'learn'
                              ? <LearnScreen onBack={goHome} onOpenPrayer={() => setActiveTab('prayer')} onOpenQibla={() => setActiveTab('qibla')} />
                              : activeTab === 'duas'
                                ? <DuasScreen onBack={goHome} />
                                : activeTab === 'names'
                                  ? <NamesScreen onBack={goHome} />
                                  : activeTab === 'mosques'
                                    ? <MosqueScreen onBack={goHome} />
                                    : activeTab === 'collections'
                                      ? <CollectionsScreen
                                          onBack={goHome}
                                          onOpenQuran={goQuran}
                                          onOpenReader={openReader}
                                          onOpenDuas={() => setActiveTab('duas')}
                                          onOpenNames={() => setActiveTab('names')}
                                          onOpenAyah={() => setActiveTab('ayah')}
                                          onOpenHadith={() => setActiveTab('hadith')}
                                          onOpenCalendar={() => setActiveTab('calendar')}
                                        />
                                      : <AssistantScreen onBack={goHome} />;

  return (
    <div className="app-background app-background--v2">
      <div className="background-orbit background-orbit--one" />
      <div className="background-orbit background-orbit--two" />
      <div className={screensWithBottomNavigation.has(activeTab) ? 'app-shell' : 'app-shell app-shell--detail'}>
        <AnimatePresence mode="wait">
          <motion.div key={`${activeTab}-${activeTab === 'reader' ? selectedSurahNumber : ''}`} className="screen-transition-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
            {screen}
          </motion.div>
        </AnimatePresence>
        {screensWithBottomNavigation.has(activeTab) ? <BottomNavigation active={primaryActive} onChange={setActiveTab} /> : null}
      </div>
      <InstallAppPrompt />
    </div>
  );
}
