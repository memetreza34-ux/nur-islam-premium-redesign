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
import { fetchSurahs, OFFLINE_QURAN_SURAH_SET } from './quranService';

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

type HomeQuranProgress = {
  surahNumber: number;
  ayahNumber: number;
  englishName: string;
  numberOfAyahs: number | null;
  offline: boolean;
};

const quickActions: QuickAction[] = [
  { label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen, accent: 'gold', target: 'reader' },
  { label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: HandHeart, accent: 'cream', target: 'learn' },
  { label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles, accent: 'emerald', target: 'names' },
  { label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit, accent: 'gold', target: 'legacy:quiz' },
  { label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart, accent: 'cream', target: 'duas' },
  { label: 'Nur Assistent', eyebrow: 'Lokaler Quellenmodus', icon: MessageCircleQuestion, accent: 'emerald', target: 'assistant' },
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

function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function readHomeQuranProgress(): HomeQuranProgress {
  const fallback: HomeQuranProgress = {
    surahNumber: 112,
    ayahNumber: 1,
    englishName: 'Al-Ikhlaas',
    numberOfAyahs: 4,
    offline: true,
  };
  try {
    const raw = localStorage.getItem('nur_quran_last_read');
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as { surahNumber?: unknown; ayahNumber?: unknown };
    const surahNumber = typeof parsed.surahNumber === 'number' && Number.isInteger(parsed.surahNumber) && parsed.surahNumber >= 1 && parsed.surahNumber <= 114
      ? parsed.surahNumber
      : fallback.surahNumber;
    const ayahNumber = typeof parsed.ayahNumber === 'number' && Number.isInteger(parsed.ayahNumber) && parsed.ayahNumber >= 1
      ? parsed.ayahNumber
      : 1;
    return {
      surahNumber,
      ayahNumber,
      englishName: surahNumber === 112 ? 'Al-Ikhlaas' : `Sure ${surahNumber}`,
      numberOfAyahs: surahNumber === 112 ? 4 : null,
      offline: OFFLINE_QURAN_SURAH_SET.has(surahNumber),
    };
  } catch {
    return fallback;
  }
}

function readDhikrTotalToday() {
  try {
    const raw = localStorage.getItem('nur_dhikr_daily_v2');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date?: unknown; counts?: unknown };
    if (parsed.date !== getLocalDateKey() || !parsed.counts || typeof parsed.counts !== 'object' || Array.isArray(parsed.counts)) return 0;
    return Object.values(parsed.counts as Record<string, unknown>).reduce((sum, value) => {
      return sum + (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
    }, 0);
  } catch {
    return 0;
  }
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
  const [quranProgress, setQuranProgress] = useState(readHomeQuranProgress);
  const [dhikrTotal, setDhikrTotal] = useState(readDhikrTotalToday);
  const islamicDate = getIslamicDate(now);
  const nextPrayer = getNextPrayer(now);
  const greeting = getHomeGreeting(now);
  const quranPercent = quranProgress.numberOfAyahs
    ? Math.min(100, Math.max(1, Math.round((quranProgress.ayahNumber / quranProgress.numberOfAyahs) * 100)))
    : 1;

  useEffect(() => {
    const syncLocalProgress = () => {
      setQuranProgress(readHomeQuranProgress());
      setDhikrTotal(readDhikrTotalToday());
    };
    const timer = window.setInterval(() => {
      setNow(new Date());
      syncLocalProgress();
    }, 30000);
    const handleFocus = () => {
      setNow(new Date());
      syncLocalProgress();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const stored = readHomeQuranProgress();
    void fetchSurahs()
      .then((surahs) => {
        if (!active) return;
        const surah = surahs.find((item) => item.number === stored.surahNumber);
        if (!surah) return;
        setQuranProgress({
          surahNumber: surah.number,
          ayahNumber: Math.min(stored.ayahNumber, surah.numberOfAyahs),
          englishName: surah.englishName,
          numberOfAyahs: surah.numberOfAyahs,
          offline: OFFLINE_QURAN_SURAH_SET.has(surah.number),
        });
      })
      .catch(() => {
        // The localStorage fallback remains useful even if metadata cannot load.
      });
    return () => { active = false; };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const openLastRead = () => onOpenReader(quranProgress.surahNumber);

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
          <button className="journey-card journey-card--quran" onClick={openLastRead}>
            <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} />
            <span><small>{quranProgress.offline ? 'Offline weiterlesen' : 'Zuletzt gelesen'}</small><strong>{quranProgress.englishName}</strong><em>Ayah {quranProgress.ayahNumber}{quranProgress.numberOfAyahs ? ` von ${quranProgress.numberOfAyahs}` : ''}</em></span>
          </button>
          <button className="journey-card" onClick={() => onNavigate('dhikr')}>
            <PremiumImage src="/premium-assets/high-res-objects/tasbih-v2.webp" fallback={<RosetteObject />} />
            <span><small>Heute gezählt</small><strong>Dhikr</strong><em>{dhikrTotal} Wiederholungen</em></span>
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
              onClick={() => target === 'reader' ? openLastRead() : target ? onNavigate(target) : undefined}
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
        <div className="continue-card__body"><span className="overline">{quranProgress.offline ? 'Offline verfügbar' : 'Zuletzt gelesen'}</span><h3>{quranProgress.englishName}</h3><p>Ayah {quranProgress.ayahNumber}{quranProgress.numberOfAyahs ? ` von ${quranProgress.numberOfAyahs}` : ''} · {quranPercent}%</p><div className="reading-progress"><span style={{ width: `${quranPercent}%` }} /></div></div>
        <button className="play-button" aria-label="Weiterlesen" onClick={openLastRead}><Play size={20} fill="currentColor" /></button>
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
        <span><small>Nur Assistent</small><strong>Lokaler Quellenmodus</strong><p>Antwortet nur auf unterstützte Themen mit sichtbarem Quellenhinweis – ohne erfundene religiöse Antworten.</p></span>
        <span className="ai-preview__action"><MessageCircleQuestion size={20} /></span>
      </button>

      <section className="content-section recommendations">
        <div className="section-heading"><div><span className="overline">Empfohlen</span><h2>Heute für dich</h2></div></div>
        <div className="recommendation-list">
          <button className="recommendation-card" onClick={() => onNavigate('legacy:fasting')}><span className="recommendation-card__icon"><CrescentObject /></span><span><small>Fasten-Assistent</small><strong>Fastentage & Erinnerungen planen</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('legacy:ummah')}><span className="recommendation-card__icon"><Globe2 size={22} /></span><span><small>Ummah-Übersicht</small><strong>Regionen und Gemeinschaften entdecken</strong></span><ChevronRight size={20} /></button>
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
  const [selectedDuaId, setSelectedDuaId] = useState<string | null>(null);
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
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
  }, [activeTab, onboardingComplete, selectedSurahNumber, selectedDuaId, selectedNameId, selectedCalendarDate]);

  const clearDirectTargets = () => {
    setSelectedDuaId(null);
    setSelectedNameId(null);
    setSelectedCalendarDate(null);
  };

  const navigate = (tab: Tab) => {
    if (tab === 'duas') setSelectedDuaId(null);
    if (tab === 'names') setSelectedNameId(null);
    if (tab === 'calendar') setSelectedCalendarDate(null);
    setActiveTab(tab);
  };

  useEffect(() => {
    const openPrayerTracker = () => {
      setOnboardingComplete(true);
      clearDirectTargets();
      setActiveTab('prayer');
    };
    window.addEventListener('nur:open-prayer', openPrayerTracker);
    return () => window.removeEventListener('nur:open-prayer', openPrayerTracker);
  }, []);

  const goHome = () => {
    clearDirectTargets();
    setActiveTab('home');
  };
  const goQuran = () => setActiveTab('quran');
  const goLearn = () => setActiveTab('learn');
  const openReader = (surahNumber: number) => {
    clearDirectTargets();
    setSelectedSurahNumber(surahNumber);
    setActiveTab('reader');
  };
  const openSavedDua = (id: string) => {
    setSelectedDuaId(id);
    setSelectedNameId(null);
    setSelectedCalendarDate(null);
    setActiveTab('duas');
  };
  const openSavedName = (id: string) => {
    setSelectedNameId(id);
    setSelectedDuaId(null);
    setSelectedCalendarDate(null);
    setActiveTab('names');
  };
  const openSavedCalendarDate = (date: string) => {
    setSelectedCalendarDate(date);
    setSelectedDuaId(null);
    setSelectedNameId(null);
    setActiveTab('calendar');
  };

  if (!onboardingComplete) {
    return (
      <div className="app-background app-background--v2">
        <div className="background-orbit background-orbit--one" />
        <div className="background-orbit background-orbit--two" />
        <div className="app-shell app-shell--onboarding">
          <OnboardingScreen onComplete={() => {
            setOnboardingComplete(true);
            clearDirectTargets();
            setActiveTab('home');
          }} />
        </div>
      </div>
    );
  }

  const screen = isLegacyTab(activeTab)
    ? <LegacyFeatureScreen featureId={getLegacyFeatureId(activeTab)} onBack={goHome} />
    : activeTab === 'home'
      ? <PremiumHome onNavigate={navigate} onOpenReader={openReader} />
      : activeTab === 'quran'
        ? <QuranScreen onBack={goHome} onOpenReader={openReader} onOpenAyah={() => navigate('ayah')} />
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
                        ? <MoreScreen onBack={goHome} onNavigate={(destination) => navigate(destination)} />
                        : activeTab === 'prayer'
                          ? <PrayerScreen onBack={goHome} />
                          : activeTab === 'calendar'
                            ? <CalendarScreen onBack={goHome} initialDateKey={selectedCalendarDate} />
                            : activeTab === 'learn'
                              ? <LearnScreen onBack={goHome} onOpenPrayer={() => navigate('prayer')} onOpenQibla={() => navigate('qibla')} />
                              : activeTab === 'duas'
                                ? <DuasScreen onBack={goHome} initialDuaId={selectedDuaId} />
                                : activeTab === 'names'
                                  ? <NamesScreen onBack={goHome} initialNameId={selectedNameId} />
                                  : activeTab === 'mosques'
                                    ? <MosqueScreen onBack={goHome} />
                                    : activeTab === 'collections'
                                      ? <CollectionsScreen
                                          onBack={goHome}
                                          onOpenQuran={goQuran}
                                          onOpenReader={openReader}
                                          onOpenDua={openSavedDua}
                                          onOpenName={openSavedName}
                                          onOpenAyah={() => navigate('ayah')}
                                          onOpenHadith={() => navigate('hadith')}
                                          onOpenCalendarDate={openSavedCalendarDate}
                                        />
                                      : <AssistantScreen onBack={goHome} />;

  return (
    <div className="app-background app-background--v2">
      <div className="background-orbit background-orbit--one" />
      <div className="background-orbit background-orbit--two" />
      <div className={screensWithBottomNavigation.has(activeTab) ? 'app-shell' : 'app-shell app-shell--detail'}>
        <AnimatePresence mode="wait">
          <motion.div key={`${activeTab}-${activeTab === 'reader' ? selectedSurahNumber : activeTab === 'duas' ? selectedDuaId ?? '' : activeTab === 'names' ? selectedNameId ?? '' : activeTab === 'calendar' ? selectedCalendarDate ?? '' : ''}`} className="screen-transition-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
            {screen}
          </motion.div>
        </AnimatePresence>
        {screensWithBottomNavigation.has(activeTab) ? <BottomNavigation active={primaryActive} onChange={navigate} /> : null}
      </div>
      <InstallAppPrompt />
    </div>
  );
}
