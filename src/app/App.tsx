import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import {
  BellRing,
  BookHeart,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  Globe2,
  HandHeart,
  MapPin,
  Menu,
  MoonStar,
  Quote,
  Sparkles,
  SunDim,
  Sunrise,
  Sunset,
  SunMedium,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getDailyHadith } from '../data/hadithData';
import { readDhikrTotalToday } from '../services/dhikrDailyState';
import { isWidgetId, WIDGET_ACTIONS } from '../services/widgetActions';
import { readQuranLastRead } from '../services/premiumLocalService';
import { LEARNING_CATEGORIES } from '../data/learningCategories';
import type { LearningCategoryId } from '../data/learningCategories';
import { CalendarScreen } from '../screens/CalendarScreen';
import { CollectionsScreen } from '../screens/CollectionsScreen';
import { DailyHadithScreen } from '../screens/DailyHadithScreen';
import { DhikrScreen } from '../screens/DhikrScreen';
import { MosqueScreen } from '../screens/DiscoveryScreens';
import { DuasScreen } from '../screens/DuasScreen';
import { InstallAppPrompt } from '../shared/InstallAppPrompt';
import { MihrabArch } from '../shared/MihrabArch';
import { NavigationIcon } from '../shared/NavigationIcon';
import { getCurrentPrayerScene } from '../shared/prayerBackdrops';
import { LegalScreen } from '../screens/LegalScreen';
const LearnScreen = lazy(() => import('../screens/LearnScreen')
  .then((module) => ({ default: module.LearnScreen })));
// Split out of the initial bundle: these thirteen screens carry the quiz
// catalogue, the prophets and the companion lists, and none of them is
// reachable before the learning hub. Loading them on the way in kept ~20 KB
// gzipped off the first paint.
const LegacyFeatureScreen = lazy(() => import('../screens/LegacyFeatureScreens')
  .then((module) => ({ default: module.LegacyFeatureScreen })));
import type { LegacyFeatureId } from '../data/legacyFeatures';
import { learningLegacyFeatures, quizFeature, serviceLegacyFeatures } from '../data/legacyFeatures';
import { readScreenScroll, rememberScreenScroll } from '../services/screenScrollMemory';
import { AccountScreen } from '../screens/AccountScreen';
import { NotesScreen } from '../screens/NotesScreen';
const MoreScreen = lazy(() => import('../screens/MoreScreen')
  .then((module) => ({ default: module.MoreScreen })));
import { NamesScreen } from '../screens/NamesScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { getHijriLabel } from '../services/hijriCalendar';
import {
  browserNavigationDepth,
  pushBrowserNavigation,
  readBrowserNavigation,
  replaceBrowserNavigation,
} from '../services/browserNavigation';
import { consumePendingNavigation } from '../services/pendingNavigation';
import type { PendingNavigationIntent } from '../services/pendingNavigation';
import { QiblaScreen } from '../screens/QiblaScreen';
const PrayerScreen = lazy(() => import('../screens/PrayerScreen')
  .then((module) => ({ default: module.PrayerScreen })));
import { QuranReaderScreen } from '../screens/QuranReaderScreen';
import { QuranScreen } from '../screens/QuranScreen';
import {
  AyahDetailScreen,
  WorshipGuideScreen,
} from '../screens/ReferenceReadingScreens';
import type { NurIcon } from '../shared/NurIcons';
import {
  NurDuaIcon,
  NurMihrabIcon,
  NurQuizIcon,
  NurRosetteIcon,
} from '../shared/NurIcons';
import {
  LanternObject,
  NurMark,
  PremiumImage,
  QiblaObject,
  QuranObject,
  RosetteObject,
} from '../shared/PremiumVisuals';
import {
  formatPrayerRemaining,
  getNextPrayer,
  isSharedPrayerScheduleCurrent,
  PRAYER_SCHEDULE,
  PRAYER_SCHEDULE_META,
} from '../services/prayerSchedule';
import type { PrayerScheduleItem } from '../services/prayerSchedule';
import { readHomeQuranProgress } from '../services/homeQuranProgress';

type PrimaryTab = 'home' | 'prayer' | 'quran' | 'learn' | 'profile';
type LegacyTab = `legacy:${LegacyFeatureId}`;
type LearningCategoryTab = `learn:${LearningCategoryId}`;
type Tab = PrimaryTab | 'calendar' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'collections' | 'reader' | 'ayah' | 'hadith' | 'wudu' | 'salah' | 'prayer-learning' | 'legal' | 'account' | 'notes' | LegacyTab | LearningCategoryTab;

type NavigationSnapshot = {
  activeTab: Tab;
  navigationHistory: Tab[];
  selectedSurahNumber: number;
  selectedAyahNumber: number;
  selectedDuaId: string | null;
  selectedNameId: string | null;
  selectedCalendarDate: string | null;
  selectedHadithId: string | null;
};

type QuickAction = {
  label: string;
  eyebrow: string;
  detail: string;
  icon: NurIcon;
  art: string;
  accent: 'gold' | 'cream' | 'emerald';
  target: Tab;
};

const quickActions: QuickAction[] = [
  { label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', detail: 'Schritt für Schritt lernen', icon: NurMihrabIcon, art: '/premium-assets/high-res-objects/home-learn-prayer-v2.webp', accent: 'cream', target: 'prayer-learning' },
  { label: '99 Namen Allahs', eyebrow: 'Heute entdecken', detail: 'Namen und Bedeutungen', icon: NurRosetteIcon, art: '/premium-assets/high-res-objects/home-names-v1.webp', accent: 'emerald', target: 'names' },
  { label: 'Islam Quiz', eyebrow: 'Wissen testen', detail: 'Fragen direkt beantworten', icon: NurQuizIcon, art: '/premium-assets/high-res-objects/home-quiz-v2.webp', accent: 'gold', target: 'legacy:quiz' },
  { label: 'Duas', eyebrow: 'Für jeden Moment', detail: 'Bittgebete für deinen Tag', icon: NurDuaIcon, art: '/premium-assets/high-res-objects/home-duas-v2.webp', accent: 'cream', target: 'duas' },
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
  'prayer-learning',
  'duas',
  'names',
  'mosques',
  'collections',
  'account',
  'notes',
]);

function isLegacyTab(tab: Tab): tab is LegacyTab {
  return tab.startsWith('legacy:');
}

function getLegacyFeatureId(tab: LegacyTab) {
  return tab.slice('legacy:'.length) as LegacyFeatureId;
}

function isLearningCategoryTab(tab: Tab): tab is LearningCategoryTab {
  return tab.startsWith('learn:');
}

function getLearningCategoryId(tab: LearningCategoryTab) {
  return tab.slice('learn:'.length) as LearningCategoryId;
}

function getIslamicDate(date = new Date(), timezone?: string) {
  return getHijriLabel(date, 'Islamischer Kalender', timezone);
}

function getGermanDate(date: Date, timeZone?: string, compact = false) {
  const options: Intl.DateTimeFormatOptions = {
    ...(compact ? {} : { weekday: 'short' }),
    day: 'numeric',
    month: compact ? 'short' : 'long',
    year: 'numeric',
    ...(timeZone ? { timeZone } : {}),
  };
  try {
    return new Intl.DateTimeFormat('de-DE', options).format(date);
  } catch {
    return new Intl.DateTimeFormat('de-DE', {
      ...(compact ? {} : { weekday: 'short' }),
      day: 'numeric',
      month: compact ? 'short' : 'long',
      year: 'numeric',
    }).format(date);
  }
}

/**
 * The union is taken from the schedule rather than repeated, because it was
 * repeated: this copy still knew only three positions after the schedule grew
 * to five, so Home kept drawing Asr with the midday sun.
 */
function PrayerVisual({ visual, size = 14 }: { visual: PrayerScheduleItem['visual']; size?: number }) {
  if (visual === 'moon') return <MoonStar size={size} />;
  if (visual === 'sunrise') return <Sunrise size={size} />;
  if (visual === 'sunset') return <Sunset size={size} />;
  if (visual === 'afternoon') return <SunDim size={size} />;
  return <SunMedium size={size} />;
}

function hasCompletedOnboarding() {
  try {
    return localStorage.getItem('nur_onboarding_complete') === 'true';
  } catch {
    return false;
  }
}

function isKnownTab(value: unknown): value is Tab {
  if (typeof value !== 'string') return false;
  return screensWithBottomNavigation.has(value as Tab)
    || ['reader', 'ayah', 'hadith', 'wudu', 'salah', 'legal'].includes(value)
    || LEARNING_CATEGORIES.some((category) => value === `learn:${category.id}`)
    || [...learningLegacyFeatures, ...serviceLegacyFeatures, quizFeature].some((feature) => value === `legacy:${feature.id}`);
}

function isNavigationSnapshot(value: unknown): value is NavigationSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Partial<NavigationSnapshot>;
  return isKnownTab(snapshot.activeTab)
    && Array.isArray(snapshot.navigationHistory)
    && snapshot.navigationHistory.every(isKnownTab)
    && typeof snapshot.selectedSurahNumber === 'number'
    && Number.isInteger(snapshot.selectedSurahNumber)
    && snapshot.selectedSurahNumber >= 1
    && snapshot.selectedSurahNumber <= 114
    && typeof snapshot.selectedAyahNumber === 'number'
    && Number.isInteger(snapshot.selectedAyahNumber)
    && snapshot.selectedAyahNumber >= 1
    && (snapshot.selectedDuaId === null || typeof snapshot.selectedDuaId === 'string')
    && (snapshot.selectedNameId === null || typeof snapshot.selectedNameId === 'string')
    && (snapshot.selectedCalendarDate === null || typeof snapshot.selectedCalendarDate === 'string')
    && (snapshot.selectedHadithId === null || typeof snapshot.selectedHadithId === 'string');
}

function PremiumHome({
  onNavigate,
  onOpenReader,
}: {
  onNavigate: (tab: Tab) => void;
  onOpenReader: (surahNumber: number, ayahNumber?: number) => void;
}) {
  const [now, setNow] = useState(() => new Date());
  const [quranProgress, setQuranProgress] = useState(readHomeQuranProgress);
  const [dhikrTotal, setDhikrTotal] = useState(readDhikrTotalToday);
  const reduceMotion = useReducedMotion();
  const islamicDate = getIslamicDate(now, PRAYER_SCHEDULE_META.timezone);
  const germanDate = getGermanDate(now, PRAYER_SCHEDULE_META.timezone);
  const compactGermanDate = getGermanDate(now, PRAYER_SCHEDULE_META.timezone, true);
  const nextPrayer = getNextPrayer(now);
  const currentScene = getCurrentPrayerScene(now, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META.timezone);
  const currentTimetable = isSharedPrayerScheduleCurrent(now);
  const dailyHadith = getDailyHadith(now);
  const quranPercent = quranProgress.hasProgress && quranProgress.numberOfAyahs
    ? Math.min(100, Math.max(1, Math.round((quranProgress.ayahNumber / quranProgress.numberOfAyahs) * 100)))
    : 0;
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .18, delay: reduceMotion ? 0 : Math.min(index * .025, .1), ease: [0.22, 1, 0.36, 1] as const });

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

  const openLastRead = () => onOpenReader(quranProgress.surahNumber, quranProgress.ayahNumber);

  return (
    <motion.main
      className="screen premium-home premium-home--v2"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
      transition={screenTransition}
    >
      <h1 className="sr-only">Start – Nur Islam</h1>
      <header className="brand-bar">
        <div className="brand-lockup" aria-label="Nur Islam">
          <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v3.svg" className="brand-lockup__mark" fallback={<NurMark />} />
          <span><strong>Nur</strong><small>Dein spiritueller Begleiter</small></span>
        </div>
        <div className="brand-bar__actions">
          <button className="icon-button" onClick={() => onNavigate('prayer')} aria-label="Gebete und Erinnerungen öffnen"><BellRing size={20} /></button>
          <button className="icon-button" onClick={() => onNavigate('qibla')} aria-label="Qibla-Kompass öffnen"><Compass size={20} /></button>
          <button className="icon-button" onClick={() => onNavigate('profile')} aria-label="Mehr öffnen"><Menu size={20} /></button>
        </div>
      </header>

      <section className="home-standfirst" aria-label="Ort und Datum">
        <button className="home-standfirst__place" onClick={() => onNavigate('prayer')} aria-label={`Gebetsstandort prüfen: ${PRAYER_SCHEDULE_META.locationLabel}`}><MapPin size={14} /><span>{PRAYER_SCHEDULE_META.locationLabel}<small className="home-standfirst__place-detail">{PRAYER_SCHEDULE_META.locationSource === 'device' ? 'Gespeicherter Standort' : 'Standardstandort · prüfen'}</small><small className="home-standfirst__place-compact">{PRAYER_SCHEDULE_META.locationSource === 'device' ? 'Gespeichert' : 'Voreingestellt'}</small></span></button>
        <button className="home-standfirst__date" onClick={() => onNavigate('calendar')} aria-label={`${germanDate}, ${islamicDate} – Islamischen Kalender öffnen`}>
          <CalendarDays size={15} />
          <span className="home-standfirst__date-copy"><strong className="home-standfirst__date-long">{germanDate}</strong><strong className="home-standfirst__date-short">{compactGermanDate}</strong><small>{islamicDate}</small></span>
        </button>
      </section>

      {/* No usable timetable means there is no next prayer to name. */}
      {nextPrayer ? (
      <section className="home-prayer-focus" aria-label="Nächstes Gebet">
        <div className="home-prayer-focus__content">
          <MihrabArch
            className="home-prayer-arch"
            overline={nextPrayer.tomorrow ? 'Nächstes Gebet · morgen' : 'Nächstes Gebet'}
            title={nextPrayer.prayer.label}
            titleArabic={nextPrayer.prayer.arabic}
            value={nextPrayer.prayer.time}
            meta={`${nextPrayer.tomorrow ? 'morgen in ' : 'in '}${formatPrayerRemaining(nextPrayer.remaining)}`}
            progress={nextPrayer.progress}
            height={230}
            scene={currentScene}
          />
          {nextPrayer.tomorrow && <span className="overline">Heutiger Gebetsplan</span>}
          <div className="home-prayer-times" aria-label="Heutige Gebetszeiten">
            {PRAYER_SCHEDULE.map((prayer) => (
              <span className={!nextPrayer.tomorrow && prayer.id === nextPrayer.prayer.id ? 'is-current' : ''} key={prayer.id}>
                <PrayerVisual visual={prayer.visual} />
                <small>{prayer.compactLabel}</small>
                <strong className="ds-num">{prayer.time}</strong>
              </span>
            ))}
          </div>
        </div>
      </section>
      ) : (
        <section className="prayer-hero prayer-hero--v2" aria-label="Gebetszeiten nicht verfügbar">
          <div className="prayer-hero__content">
            <span className="overline">{currentTimetable ? 'Nächsten Tag vorbereiten' : 'Deine Gebetszeiten'}</span>
            <h2>{currentTimetable ? 'Die nächsten Zeiten fehlen noch.' : 'Zeiten für deinen Standort laden'}</h2>
            <span className="prayer-source-note">{currentTimetable ? 'Die heutigen Zeiten sind gespeichert. Für das nächste Gebet liegt noch kein verlässlicher Folgetagsplan vor.' : 'Hier erscheinen deine Gebetszeiten, sobald ein aktueller Plan verfügbar ist. Es werden keine Ersatzzeiten angezeigt.'}</span>
            <button className="gold-button" onClick={() => onNavigate('prayer')}>Gebetszeiten prüfen <ChevronRight size={18} /></button>
          </div>
        </section>
      )}
      {currentTimetable && <button className="home-prayer-note" onClick={() => onNavigate('prayer')}><span>{PRAYER_SCHEDULE_META.source === 'cache' ? 'AlAdhan · heute gespeichert' : 'AlAdhan · berechnete Zeiten'}<small>{PRAYER_SCHEDULE_META.timezone} · Berechnung prüfen</small></span><ChevronRight size={16} /></button>}

          <button className="journey-card journey-card--quran" data-home-section="continue" onClick={openLastRead} aria-label={`${quranProgress.hasProgress ? 'Weiterlesen' : 'Quran beginnen'}: ${quranProgress.englishName}`}>
            <PremiumImage src="/premium-assets/high-res-objects/home-quran-illustrated-v1.webp" fallback={<QuranObject />} />
            <span><small>{quranProgress.hasProgress ? (quranProgress.offline ? 'Offline weiterlesen' : 'Zuletzt gelesen') : 'Quran beginnen'}</small><strong>{quranProgress.englishName}</strong><em>{quranProgress.hasProgress ? `Ayah ${quranProgress.ayahNumber} von ${quranProgress.numberOfAyahs}` : 'Noch kein Lesestand'}</em><span className="home-reading-progress" aria-hidden="true"><span style={{ width: `${quranPercent}%` }} /></span><span className="journey-card__action">{quranProgress.hasProgress ? 'Weiterlesen' : 'Jetzt beginnen'} <ChevronRight size={16} /></span></span>
          </button>
      <section className="content-section" data-home-section="journey">
        <div className="section-heading"><div><span className="overline">Dein Alltag</span><h2>Deine täglichen Begleiter</h2></div></div>
        <div className="journey-grid">
          <button className="journey-card" onClick={() => onNavigate('dhikr')}>
            <PremiumImage src="/premium-assets/high-res-objects/home-dhikr-illustrated-v1.webp" fallback={<RosetteObject />} />
            <span><small>Heute gezählt</small><strong>Dhikr</strong><em>{dhikrTotal} Wiederholungen</em></span>
          </button>
          <button className="journey-card" onClick={() => onNavigate('qibla')}>
            <PremiumImage src="/premium-assets/high-res-objects/home-qibla-illustrated-v1.webp" fallback={<QiblaObject />} />
            <span><small>Richtung Mekka</small><strong>Qibla</strong><em>Kompass starten</em></span>
          </button>
        </div>
      </section>

      <section className="content-section" data-home-section="discover">
        <div className="section-heading"><div><span className="overline">Entdecken</span><h2>Wissen & Inspiration</h2></div><button className="text-button" onClick={() => onNavigate('learn')}>Zum Lernen <ChevronRight size={16} /></button></div>
        <div className="quick-grid quick-grid--v2">
          {quickActions.map(({ label, eyebrow, detail, icon: Icon, art, accent, target }, index) => (
            <motion.button
              key={label}
              className={`quick-card quick-card--${accent}`}
              data-art={target}
              onClick={() => onNavigate(target)}
              whileTap={{ scale: reduceMotion ? 1 : .985 }}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={itemTransition(index)}
            >
              <span className="quick-card__art">
                <PremiumImage src={art} className="quick-card__art-image" fallback={<Icon size={25} />} />
              </span>
              <span className="quick-card__eyebrow">{eyebrow}</span><strong>{label}</strong><span className="quick-card__detail">{detail}</span><ChevronRight className="quick-card__arrow" size={18} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="inspiration-grid inspiration-grid--v2" data-home-section="inspiration">
        <button className="verse-card verse-card--cream reference-daily-card-button" onClick={() => onNavigate('ayah')}>
          <PremiumImage src="/premium-assets/high-res-objects/ayah-focus-bg-v1.webp" className="verse-card__art" fallback={<LanternObject />} />
          <div className="card-title-row"><span><Sparkles size={16} /> Ayah im Fokus</span><span><BookHeart size={18} /></span></div>
          <p className="arabic-verse" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
          <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote><footer>Al-Ikhlas · 112:1</footer>
        </button>
        <button className="hadith-card glass-card reference-daily-card-button" onClick={() => onNavigate('hadith')}>
          <div className="card-title-row"><span><Quote size={16} /> Hadith des Tages</span></div>
          <blockquote>{dailyHadith.summary}</blockquote><footer>{dailyHadith.title} · {dailyHadith.source}</footer>
        </button>
      </section>

      <section className="content-section recommendations" data-home-section="recommendations">
        <div className="section-heading"><div><span className="overline">Mehr entdecken</span><h2>Weitere Bereiche</h2></div></div>
        <div className="recommendation-list">
          <button className="recommendation-card" onClick={() => onNavigate('legacy:fasting')}><span className="recommendation-card__icon"><MoonStar size={22} /></span><span><small>Fastenplan</small><strong>Fastentage & Erinnerungen planen</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('legacy:ummah')}><span className="recommendation-card__icon"><Globe2 size={22} /></span><span><small>Ummah-Übersicht</small><strong>Regionen und Gemeinschaften entdecken</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('mosques')}><span className="recommendation-card__icon"><MapPin size={22} /></span><span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span><ChevronRight size={20} /></button>
          <button className="recommendation-card" onClick={() => onNavigate('collections')}><span className="recommendation-card__icon"><BookHeart size={22} /></span><span><small>Meine Sammlung</small><strong>Favoriten und Lesezeichen</strong></span><ChevronRight size={20} /></button>
        </div>
      </section>
    </motion.main>
  );
}

function BottomNavigation({ active, onChange }: { active: PrimaryTab; onChange: (tab: PrimaryTab) => void }) {
  const items: Array<{ id: PrimaryTab; label: string }> = [
    { id: 'home', label: 'Start' },
    { id: 'prayer', label: 'Gebet' },
    { id: 'quran', label: 'Quran' },
    { id: 'learn', label: 'Lernen' },
    { id: 'profile', label: 'Mehr' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map(({ id, label }) => (
        <button key={id} className={active === id ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'} onClick={() => onChange(id)} aria-current={active === id ? 'page' : undefined}>
          <span><NavigationIcon name={id} /></span><small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(hasCompletedOnboarding);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [navigationHistory, setNavigationHistory] = useState<Tab[]>([]);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(112);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState(1);
  const [selectedDuaId, setSelectedDuaId] = useState<string | null>(null);
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [selectedHadithId, setSelectedHadithId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const currentNavigationSnapshot: NavigationSnapshot = {
    activeTab,
    navigationHistory,
    selectedSurahNumber,
    selectedAyahNumber,
    selectedDuaId,
    selectedNameId,
    selectedCalendarDate,
    selectedHadithId,
  };
  const latestNavigationSnapshotRef = useRef(currentNavigationSnapshot);
  const pendingBrowserRootRef = useRef<NavigationSnapshot | null>(null);
  latestNavigationSnapshotRef.current = currentNavigationSnapshot;
  // The marked tab answers "where am I", so a screen marks the tab it is
  // reached from. Qibla stays with Gebet because it is the prayer direction;
  // Dhikr and the calendar are opened from Mehr and now say so.
  const primaryActive: PrimaryTab = ['prayer', 'qibla'].includes(activeTab)
    ? 'prayer'
    : ['quran', 'reader', 'ayah'].includes(activeTab)
      ? 'quran'
      : isLearningCategoryTab(activeTab) || ['learn', 'prayer-learning', 'duas', 'names', 'wudu', 'salah'].includes(activeTab)
        ? 'learn'
        : ['profile', 'mosques', 'collections', 'account', 'notes', 'calendar', 'dhikr'].includes(activeTab)
          ? 'profile'
          : 'home';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeTab, onboardingComplete, reduceMotion, selectedSurahNumber, selectedAyahNumber, selectedDuaId, selectedNameId, selectedCalendarDate, selectedHadithId]);

  const buildNavigationSnapshot = (overrides: Partial<NavigationSnapshot> = {}): NavigationSnapshot => ({
    ...latestNavigationSnapshotRef.current,
    ...overrides,
  });

  const applyNavigationSnapshot = (snapshot: NavigationSnapshot) => {
    setActiveTab(snapshot.activeTab);
    setNavigationHistory([...snapshot.navigationHistory].slice(-24));
    setSelectedSurahNumber(snapshot.selectedSurahNumber);
    setSelectedAyahNumber(snapshot.selectedAyahNumber);
    setSelectedDuaId(snapshot.selectedDuaId);
    setSelectedNameId(snapshot.selectedNameId);
    setSelectedCalendarDate(snapshot.selectedCalendarDate);
    setSelectedHadithId(snapshot.selectedHadithId);
  };

  const resetBrowserRoot = (snapshot: NavigationSnapshot) => {
    const depth = browserNavigationDepth();
    if (depth > 0) {
      pendingBrowserRootRef.current = snapshot;
      window.history.go(-depth);
      return;
    }
    replaceBrowserNavigation(snapshot, 0);
    applyNavigationSnapshot(snapshot);
  };

  const moveTo = (tab: Tab, rememberOrigin = true, overrides: Partial<NavigationSnapshot> = {}) => {
    if (tab === activeTab && Object.keys(overrides).length === 0) return;
    const nextHistory = rememberOrigin && tab !== activeTab
      ? [...navigationHistory, activeTab].slice(-24)
      : navigationHistory;
    const snapshot = buildNavigationSnapshot({
      activeTab: tab,
      navigationHistory: nextHistory,
      selectedDuaId: tab === 'duas' ? null : selectedDuaId,
      selectedNameId: tab === 'names' ? null : selectedNameId,
      selectedCalendarDate: tab === 'calendar' ? null : selectedCalendarDate,
      selectedHadithId: tab === 'hadith' ? null : selectedHadithId,
      ...overrides,
    });

    if (tab === activeTab) replaceBrowserNavigation(snapshot, browserNavigationDepth());
    else pushBrowserNavigation(snapshot);
    applyNavigationSnapshot(snapshot);
  };

  const navigate = (tab: Tab) => moveTo(tab, true);

  const navigatePrimary = (tab: PrimaryTab) => {
    resetBrowserRoot(buildNavigationSnapshot({
      activeTab: tab,
      navigationHistory: [],
      selectedDuaId: null,
      selectedNameId: null,
      selectedCalendarDate: null,
      selectedHadithId: null,
    }));
  };

  const goBack = (fallback: Tab = 'home') => {
    if (browserNavigationDepth() > 0) {
      window.history.back();
      return;
    }

    const remaining = [...navigationHistory];
    let previous = remaining.pop();
    while (previous === activeTab) previous = remaining.pop();
    const snapshot = buildNavigationSnapshot({
      activeTab: previous ?? fallback,
      navigationHistory: remaining,
      selectedDuaId: null,
      selectedNameId: null,
      selectedCalendarDate: null,
      selectedHadithId: null,
    });
    replaceBrowserNavigation(snapshot, 0);
    applyNavigationSnapshot(snapshot);
  };

  useEffect(() => {
    if (!onboardingComplete) return;

    const handlePopState = (event: PopStateEvent) => {
      const pendingRoot = pendingBrowserRootRef.current;
      if (pendingRoot) {
        pendingBrowserRootRef.current = null;
        replaceBrowserNavigation(pendingRoot, 0);
        applyNavigationSnapshot(pendingRoot);
        return;
      }

      const entry = readBrowserNavigation<NavigationSnapshot>(event.state);
      if (!entry) return;
      if (!isNavigationSnapshot(entry.snapshot)) {
        const home = buildNavigationSnapshot({ activeTab: 'home', navigationHistory: [] });
        replaceBrowserNavigation(home, 0);
        applyNavigationSnapshot(home);
        return;
      }
      applyNavigationSnapshot(entry.snapshot);
    };

    const existing = readBrowserNavigation<NavigationSnapshot>();
    if (existing && isNavigationSnapshot(existing.snapshot)) applyNavigationSnapshot(existing.snapshot);
    else replaceBrowserNavigation(buildNavigationSnapshot(), 0);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onboardingComplete]);

  useEffect(() => {
    const openRootTab = (tab: 'prayer' | 'calendar') => {
      setOnboardingComplete(true);
      resetBrowserRoot(buildNavigationSnapshot({
        activeTab: tab,
        navigationHistory: [],
        selectedDuaId: null,
        selectedNameId: null,
        selectedCalendarDate: null,
        selectedHadithId: null,
      }));
    };
    const openPrayerTracker = () => openRootTab('prayer');
    const openCalendar = () => openRootTab('calendar');
    const applyNavigationIntent = (intent: PendingNavigationIntent) => {
      if (intent === 'prayer') openPrayerTracker();
      else openCalendar();
    };
    window.addEventListener('nur:open-prayer', openPrayerTracker);
    window.addEventListener('nur:open-calendar', openCalendar);
    // A notification can wake the PWA before this screen exists, so the live
    // event above would fire into nothing. Drain the queued intent only after
    // the listeners are in place.
    const pending = consumePendingNavigation();
    if (pending) applyNavigationIntent(pending);
    return () => {
      window.removeEventListener('nur:open-prayer', openPrayerTracker);
      window.removeEventListener('nur:open-calendar', openCalendar);
    };
  }, []);

  const openQuran = () => moveTo('quran', true, { selectedAyahNumber: 1 });

  const openReader = (surahNumber: number, ayahNumber = 1) => {
    const safeAyahNumber = Math.max(1, Math.floor(ayahNumber));
    const directTargets = {
      selectedDuaId: null,
      selectedNameId: null,
      selectedCalendarDate: null,
      selectedHadithId: null,
    };

    if (activeTab === 'reader') {
      const snapshot = buildNavigationSnapshot({
        selectedSurahNumber: surahNumber,
        selectedAyahNumber: safeAyahNumber,
        ...directTargets,
      });
      replaceBrowserNavigation(snapshot, browserNavigationDepth());
      applyNavigationSnapshot(snapshot);
      return;
    }

    if (activeTab === 'home') {
      const quranSnapshot = buildNavigationSnapshot({
        activeTab: 'quran',
        navigationHistory,
        ...directTargets,
      });
      pushBrowserNavigation(quranSnapshot);
      const readerSnapshot = {
        ...quranSnapshot,
        activeTab: 'reader' as const,
        navigationHistory: [...navigationHistory, 'quran' as Tab].slice(-24),
        selectedSurahNumber: surahNumber,
        selectedAyahNumber: safeAyahNumber,
      };
      pushBrowserNavigation(readerSnapshot);
      applyNavigationSnapshot(readerSnapshot);
      return;
    }

    const readerSnapshot = buildNavigationSnapshot({
      activeTab: 'reader',
      navigationHistory: [...navigationHistory, activeTab].slice(-24),
      selectedSurahNumber: surahNumber,
      selectedAyahNumber: safeAyahNumber,
      ...directTargets,
    });
    pushBrowserNavigation(readerSnapshot);
    applyNavigationSnapshot(readerSnapshot);
  };

  useEffect(() => {
    const openWidget = (event: Event) => {
      const id: unknown = (event as CustomEvent).detail;
      if (!isWidgetId(id)) return;
      const target = WIDGET_ACTIONS[id].destination;
      if (target === 'reader') {
        const position = id === 'daily-inspiration' ? { surahNumber: 112, ayahNumber: 1 } : readQuranLastRead();
        openReader(position.surahNumber, position.ayahNumber);
      } else if (target !== 'routines' && target !== 'quran' && target !== 'stats' && target !== 'design') {
        navigate(target);
      }
    };
    window.addEventListener('nur:open-widget', openWidget);
    return () => window.removeEventListener('nur:open-widget', openWidget);
  });

  const openSavedDua = (id: string) => moveTo('duas', true, {
    selectedDuaId: id,
    selectedNameId: null,
    selectedCalendarDate: null,
    selectedHadithId: null,
  });

  const openSavedName = (id: string) => moveTo('names', true, {
    selectedDuaId: null,
    selectedNameId: id,
    selectedCalendarDate: null,
    selectedHadithId: null,
  });

  const openSavedCalendarDate = (date: string) => moveTo('calendar', true, {
    selectedDuaId: null,
    selectedNameId: null,
    selectedCalendarDate: date,
    selectedHadithId: null,
  });

  const openSavedHadith = (id: string) => moveTo('hadith', true, {
    selectedDuaId: null,
    selectedNameId: null,
    selectedCalendarDate: null,
    selectedHadithId: id,
  });

  if (!onboardingComplete) {
    return (
      <div className="app-background app-background--v2">
        <div className="background-orbit background-orbit--one" />
        <div className="background-orbit background-orbit--two" />
        <div className="app-shell app-shell--onboarding">
          <OnboardingScreen onComplete={() => {
            const snapshot = buildNavigationSnapshot({
              activeTab: 'home',
              navigationHistory: [],
              selectedDuaId: null,
              selectedNameId: null,
              selectedCalendarDate: null,
              selectedHadithId: null,
            });
            replaceBrowserNavigation(snapshot, 0);
            applyNavigationSnapshot(snapshot);
            setOnboardingComplete(true);
          }} />
        </div>
      </div>
    );
  }

  const screen = isLegacyTab(activeTab)
    ? (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
        <LegacyFeatureScreen featureId={getLegacyFeatureId(activeTab)} onBack={goBack} onOpenQuranReference={openReader} />
      </Suspense>
    )
    : activeTab === 'home'
      ? <PremiumHome onNavigate={navigate} onOpenReader={openReader} />
      : activeTab === 'quran'
        ? <QuranScreen onBack={goBack} onOpenReader={openReader} onOpenAyah={() => navigate('ayah')} />
        : activeTab === 'reader'
          ? <QuranReaderScreen surahNumber={selectedSurahNumber} initialAyahNumber={selectedAyahNumber} onBack={goBack} onOpenSurah={(number) => openReader(number, 1)} />
          : activeTab === 'ayah'
            ? <AyahDetailScreen onBack={goBack} />
            : activeTab === 'hadith'
              ? <DailyHadithScreen onBack={goBack} hadithId={selectedHadithId} />
              : activeTab === 'wudu'
                ? <WorshipGuideScreen initialMode="wudu" onBack={goBack} />
                : activeTab === 'salah'
                  ? <WorshipGuideScreen initialMode="salah" onBack={goBack} />
                  : activeTab === 'legal'
                    ? <LegalScreen onBack={goBack} />
                    : activeTab === 'dhikr'
                    ? <DhikrScreen onBack={goBack} />
                    : activeTab === 'qibla'
                      ? <QiblaScreen onBack={goBack} />
                      : activeTab === 'profile'
                        ? <MoreScreen onBack={goBack} onNavigate={(destination) => navigate(destination)} />
                        : activeTab === 'account'
                        ? <AccountScreen onBack={goBack} onOpenLegal={() => navigate('legal')} />
                        : activeTab === 'notes'
                        ? <NotesScreen onBack={goBack} onOpenAccount={() => navigate('account')} />
                        : activeTab === 'prayer'
                          ? <PrayerScreen
                              onBack={goBack}
                              openCalendar={openSavedCalendarDate}
                              openDhikr={() => navigate('dhikr')}
                              openDuas={() => navigate('duas')}
                              openFastingPlan={() => navigate('legacy:fasting')}
                              openLearn={() => navigate('prayer-learning')}
                              openMosques={() => navigate('mosques')}
                              openQibla={() => navigate('qibla')}
                            />
                          : activeTab === 'calendar'
                            ? <CalendarScreen onBack={goBack} initialDateKey={selectedCalendarDate} />
                            : isLearningCategoryTab(activeTab)
                              ? <LearnScreen initialLearningCategory={getLearningCategoryId(activeTab)} onBack={goBack} onOpenPrayer={() => navigate('prayer')} onOpenQibla={() => navigate('qibla')} onOpenNames={() => navigate('names')} onOpenQuranReference={openReader} />
                            : activeTab === 'learn'
                              ? <LearnScreen onBack={goBack} onOpenPrayer={() => navigate('prayer')} onOpenQibla={() => navigate('qibla')} onOpenNames={() => navigate('names')} onOpenQuranReference={openReader} />
                              : activeTab === 'prayer-learning'
                                ? <LearnScreen directPrayerCourse directPrayerBackLabel={navigationHistory.at(-1) === 'home' ? 'Zurück zu Start' : navigationHistory.at(-1) === 'prayer' ? 'Zurück zu Gebet' : 'Zurück'} onBack={goBack} onOpenPrayer={() => navigate('prayer')} onOpenQibla={() => navigate('qibla')} onOpenNames={() => navigate('names')} onOpenQuranReference={openReader} />
                              : activeTab === 'duas'
                                ? <DuasScreen onBack={goBack} initialDuaId={selectedDuaId} />
                                : activeTab === 'names'
                                  ? <NamesScreen onBack={goBack} initialNameId={selectedNameId} />
                                  : activeTab === 'mosques'
                                    ? <MosqueScreen onBack={goBack} />
                                    : activeTab === 'collections'
                                      ? <CollectionsScreen
                                          onBack={goBack}
                                          onOpenQuran={openQuran}
                                          onOpenReader={openReader}
                                          onOpenDua={openSavedDua}
                                          onOpenName={openSavedName}
                                          onOpenAyah={() => navigate('ayah')}
                                          onOpenHadith={openSavedHadith}
                                          onOpenCalendarDate={openSavedCalendarDate}
                                        />
                                      : <PremiumHome onNavigate={navigate} onOpenReader={openReader} />;

  const screenKey = `${activeTab}-${activeTab === 'reader' ? `${selectedSurahNumber}-${selectedAyahNumber}` : activeTab === 'duas' ? selectedDuaId ?? '' : activeTab === 'names' ? selectedNameId ?? '' : activeTab === 'calendar' ? selectedCalendarDate ?? '' : activeTab === 'hadith' ? selectedHadithId ?? 'daily' : ''}`;

  const rememberScroll = (event: UIEvent<HTMLDivElement>) => {
    rememberScreenScroll(screenKey, event.currentTarget.scrollTop);
  };

  /**
   * Puts a returning screen back where it was left. The assignment is repeated
   * on the next frame because a screen that renders its list after mount is
   * still short at this point, and the browser clamps a scroll offset to the
   * height it can currently reach.
   */
  const restoreScreenScroll = (node: HTMLDivElement | null) => {
    if (!node) return;
    const offset = readScreenScroll(screenKey);
    if (offset === 0) return;
    node.scrollTop = offset;
    requestAnimationFrame(() => {
      if (node.isConnected && node.scrollTop < offset) node.scrollTop = offset;
    });
  };

  return (
    <div className="app-background app-background--v2">
      <div className="background-orbit background-orbit--one" />
      <div className="background-orbit background-orbit--two" />
      <div className={screensWithBottomNavigation.has(activeTab) ? 'app-shell' : 'app-shell app-shell--detail'}>
        {/* The frame carries no fade of its own. It used to animate opacity
            0 -> 1 -> 0 around every screen change, while each screen already
            animates itself in. Switching tabs faster than that 120ms exit left
            the frame stuck at opacity 0 with a fully rendered screen inside
            it — a blank app until the next tap. Reproduced by clicking through
            the tab bar at 60ms intervals. */}
        <AnimatePresence mode="wait">
          <motion.div key={screenKey} ref={restoreScreenScroll} onScroll={rememberScroll} className="screen-transition-frame">
            <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
              {screen}
            </Suspense>
          </motion.div>
        </AnimatePresence>
        {screensWithBottomNavigation.has(activeTab) ? <BottomNavigation active={primaryActive} onChange={navigatePrimary} /> : null}
      </div>
      <InstallAppPrompt />
    </div>
  );
}
