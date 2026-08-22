import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  BookHeart,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HandHeart,
  Home,
  MapPin,
  Menu,
  MoonStar,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  SunDim,
  Sunrise,
  Sunset,
  SunMedium,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { getDailyHadith } from '../data/hadithData';
import { BEGINNER_LESSONS, getNextBeginnerLesson } from '../data/beginnerLearningContent';
// Everything below the five bottom-navigation tabs loads on demand. Home,
// Prayer, Calendar, Learn and More stay eager so a tab switch never shows a
// loading state; the detail screens are opened deliberately, which is where a
// short fetch is acceptable and where the entry chunk pays for itself.
//
// Kept lazy for compatibility with stored navigation state. The assistant is
// not linked from the public v1 surfaces until its release gate is cleared.
const AssistantScreen = lazy(() => import('../screens/AssistantScreen')
  .then((module) => ({ default: module.AssistantScreen })));
import { CalendarScreen } from '../screens/CalendarScreen';
const CollectionsScreen = lazy(() => import('../screens/CollectionsScreen')
  .then((module) => ({ default: module.CollectionsScreen })));
const DailyHadithScreen = lazy(() => import('../screens/DailyHadithScreen')
  .then((module) => ({ default: module.DailyHadithScreen })));
const DhikrScreen = lazy(() => import('../screens/DhikrScreen')
  .then((module) => ({ default: module.DhikrScreen })));
const MosqueScreen = lazy(() => import('../screens/DiscoveryScreens')
  .then((module) => ({ default: module.MosqueScreen })));
const DuasScreen = lazy(() => import('../screens/DuasScreen')
  .then((module) => ({ default: module.DuasScreen })));
import { InstallAppPrompt } from '../shared/InstallAppPrompt';
import { LearnScreen } from '../screens/LearnScreen';
const LegalScreen = lazy(() => import('../screens/LegalScreen')
  .then((module) => ({ default: module.LegalScreen })));
// Legacy screens remain in the codebase for later reviewed releases, but the
// public v1 hubs expose only items explicitly marked release-ready.
const LegacyFeatureScreen = lazy(() => import('../screens/LegacyFeatureScreens')
  .then((module) => ({ default: module.LegacyFeatureScreen })));
import { getLegacyFeature, isLegacyFeatureReleaseReady } from '../data/legacyFeatures';
import type { LegacyFeatureId } from '../data/legacyFeatures';
import { MoreScreen } from '../screens/MoreScreen';
const NamesScreen = lazy(() => import('../screens/NamesScreen')
  .then((module) => ({ default: module.NamesScreen })));
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
import { PrayerScreen } from '../screens/PrayerScreen';
const QiblaScreen = lazy(() => import('../screens/QiblaScreen')
  .then((module) => ({ default: module.QiblaScreen })));
const QuranReaderScreen = lazy(() => import('../screens/QuranReaderScreen')
  .then((module) => ({ default: module.QuranReaderScreen })));
const QuranScreen = lazy(() => import('../screens/QuranScreen')
  .then((module) => ({ default: module.QuranScreen })));
const AyahDetailScreen = lazy(() => import('../screens/ReferenceReadingScreens')
  .then((module) => ({ default: module.AyahDetailScreen })));
const WorshipGuideScreen = lazy(() => import('../screens/ReferenceReadingScreens')
  .then((module) => ({ default: module.WorshipGuideScreen })));
import type { NurIcon } from '../shared/NurIcons';
import {
  NurDuaIcon,
  NurMihrabIcon,
  NurQuranIcon,
  NurRosetteIcon,
} from '../shared/NurIcons';
import {
  LanternObject,
  MosqueScene,
  NurMark,
  PremiumImage,
  QiblaObject,
  QuranObject,
  RosetteObject,
} from '../shared/PremiumVisuals';
import {
  formatPrayerRemaining,
  getNextPrayer,
  PRAYER_SCHEDULE,
  PRAYER_SCHEDULE_META,
} from '../services/prayerSchedule';
import type { PrayerScheduleItem } from '../services/prayerSchedule';
import { fetchSurahs, OFFLINE_QURAN_SURAH_SET } from '../services/quranService';

type PrimaryTab = 'home' | 'prayer' | 'calendar' | 'learn' | 'profile';
type LegacyTab = `legacy:${LegacyFeatureId}`;
type Tab = PrimaryTab | 'quran' | 'dhikr' | 'qibla' | 'duas' | 'names' | 'mosques' | 'collections' | 'assistant' | 'reader' | 'ayah' | 'hadith' | 'wudu' | 'salah' | 'legal' | LegacyTab;
type KnowledgeLevel = 'beginner' | 'familiar' | 'experienced';

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
  icon: NurIcon;
  accent: 'gold' | 'cream' | 'emerald';
  target?: Tab;
};

type HomeQuranProgress = {
  surahNumber: number;
  ayahNumber: number;
  englishName: string;
  numberOfAyahs: number | null;
  offline: boolean;
  hasProgress: boolean;
};

const quickActions: QuickAction[] = [
  { label: 'Quran lesen', eyebrow: 'Lesen & weiterlesen', icon: NurQuranIcon, accent: 'gold', target: 'reader' },
  { label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: NurMihrabIcon, accent: 'cream', target: 'learn' },
  { label: 'Namen Allahs', eyebrow: 'Alle 99 Namen', icon: NurRosetteIcon, accent: 'emerald', target: 'names' },
  { label: 'Duas', eyebrow: 'Für jeden Moment', icon: NurDuaIcon, accent: 'cream', target: 'duas' },
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

function isReleaseBlockedTab(tab: Tab) {
  if (tab === 'assistant') return true;
  return isLegacyTab(tab) && !isLegacyFeatureReleaseReady(getLegacyFeatureId(tab));
}

function getIslamicDate(date = new Date()) {
  return getHijriLabel(date, 'Islamischer Kalender');
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

function readKnowledgeLevel(): KnowledgeLevel {
  try {
    const value = localStorage.getItem('nur_knowledge_level');
    return value === 'familiar' || value === 'experienced' || value === 'beginner' ? value : 'beginner';
  } catch {
    return 'beginner';
  }
}

function readBeginnerCompleted() {
  try {
    const raw = localStorage.getItem('nur_beginner_learning_completed');
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function readHomeQuranProgress(): HomeQuranProgress {
  const emptyProgress: HomeQuranProgress = {
    surahNumber: 1,
    ayahNumber: 1,
    englishName: 'Al-Faatiha',
    numberOfAyahs: 7,
    offline: OFFLINE_QURAN_SURAH_SET.has(1),
    hasProgress: false,
  };
  try {
    const raw = localStorage.getItem('nur_quran_last_read');
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as { surahNumber?: unknown; ayahNumber?: unknown };
    if (
      typeof parsed.surahNumber !== 'number'
      || !Number.isInteger(parsed.surahNumber)
      || parsed.surahNumber < 1
      || parsed.surahNumber > 114
      || typeof parsed.ayahNumber !== 'number'
      || !Number.isInteger(parsed.ayahNumber)
      || parsed.ayahNumber < 1
    ) return emptyProgress;
    const surahNumber = parsed.surahNumber;
    return {
      surahNumber,
      ayahNumber: parsed.ayahNumber,
      englishName: surahNumber === 1 ? 'Al-Faatiha' : surahNumber === 112 ? 'Al-Ikhlaas' : `Sure ${surahNumber}`,
      numberOfAyahs: surahNumber === 1 ? 7 : surahNumber === 112 ? 4 : null,
      offline: OFFLINE_QURAN_SURAH_SET.has(surahNumber),
      hasProgress: true,
    };
  } catch {
    return emptyProgress;
  }
}

function readDhikrTotalToday() {
  try {
    const raw = localStorage.getItem('nur_dhikr_daily_v2');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date?: unknown; counts?: unknown };
    if (parsed.date !== getLocalDateKey() || !parsed.counts || typeof parsed.counts !== 'object' || Array.isArray(parsed.counts)) return 0;
    return Object.values(parsed.counts as Record<string, unknown>).reduce<number>((sum, value) => {
      return sum + (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
    }, 0);
  } catch {
    return 0;
  }
}

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

function isNavigationSnapshot(value: unknown): value is NavigationSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Partial<NavigationSnapshot>;
  return typeof snapshot.activeTab === 'string'
    && Array.isArray(snapshot.navigationHistory)
    && snapshot.navigationHistory.every((tab) => typeof tab === 'string')
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

function ReleaseLockedScreen({ tab, onBack }: { tab: Tab; onBack: () => void }) {
  const legacyFeature = isLegacyTab(tab) ? getLegacyFeature(getLegacyFeatureId(tab)) : null;
  return (
    <main className="screen reference-learning-course-screen">
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Release 1</span><h1>{legacyFeature?.title ?? 'Noch nicht freigegeben'}</h1></div>
        <span className="icon-button" aria-hidden="true"><ShieldCheck size={20} /></span>
      </header>
      <section className="reference-learning-course-hero is-fiqh">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">Noch in Prüfung</span>
          <h2>Dieser Bereich gehört noch nicht zum öffentlichen ersten Release.</h2>
          <p>{legacyFeature?.releaseReason ?? 'Der Bereich wird erst freigeschaltet, wenn Quellen, Sicherheit und fachliche Prüfung vollständig abgeschlossen sind.'}</p>
          <button className="gold-button" onClick={onBack}>Zurück zu den freigegebenen Bereichen <ChevronRight size={17} /></button>
        </div>
      </section>
    </main>
  );
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
  const [knowledgeLevel, setKnowledgeLevel] = useState(readKnowledgeLevel);
  const [beginnerCompleted, setBeginnerCompleted] = useState(readBeginnerCompleted);
  const reduceMotion = useReducedMotion();
  const islamicDate = getIslamicDate(now);
  const nextPrayer = getNextPrayer(now);
  const prayerTimesUnavailable = PRAYER_SCHEDULE_META.sourceLabel === 'Offline-Ersatzzeitplan';
  const greeting = getHomeGreeting(now);
  const dailyHadith = getDailyHadith(now);
  const quranPercent = quranProgress.hasProgress && quranProgress.numberOfAyahs
    ? Math.min(100, Math.max(1, Math.round((quranProgress.ayahNumber / quranProgress.numberOfAyahs) * 100)))
    : 0;
  const isBeginner = knowledgeLevel === 'beginner';
  const beginnerProgress = Math.round((beginnerCompleted.size / BEGINNER_LESSONS.length) * 100);
  const nextBeginnerLesson = getNextBeginnerLesson(beginnerCompleted);
  const beginnerComplete = beginnerCompleted.size >= BEGINNER_LESSONS.length;
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .18, delay: reduceMotion ? 0 : Math.min(index * .025, .1), ease: [0.22, 1, 0.36, 1] as const });

  useEffect(() => {
    const syncLocalProgress = () => {
      setQuranProgress(readHomeQuranProgress());
      setDhikrTotal(readDhikrTotalToday());
      setKnowledgeLevel(readKnowledgeLevel());
      setBeginnerCompleted(readBeginnerCompleted());
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
          ayahNumber: stored.hasProgress ? Math.min(stored.ayahNumber, surah.numberOfAyahs) : 1,
          englishName: surah.englishName,
          numberOfAyahs: surah.numberOfAyahs,
          offline: OFFLINE_QURAN_SURAH_SET.has(surah.number),
          hasProgress: stored.hasProgress,
        });
      })
      .catch(() => {
        // The validated local state remains useful even if metadata cannot load.
      });
    return () => { active = false; };
  }, []);

  const openLastRead = () => onOpenReader(quranProgress.surahNumber, quranProgress.ayahNumber);
  const openBeginnerJourney = () => {
    try { localStorage.setItem('nur_beginner_learning_last', nextBeginnerLesson.id); } catch { /* optional */ }
    onNavigate('learn');
  };

  return (
    <motion.main
      className="screen premium-home premium-home--v2"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
      transition={screenTransition}
    >
      <header className="brand-bar">
        <div className="brand-lockup" aria-label="Nur Islam">
          <PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" className="brand-lockup__mark" fallback={<NurMark />} />
          <span><strong>Nur</strong><small>Dein spiritueller Begleiter</small></span>
        </div>
        <div className="brand-bar__actions">
          <button className="icon-button" onClick={() => onNavigate('prayer')} aria-label="Gebete und Erinnerungen öffnen"><BellRing size={20} /></button>
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

      {isBeginner ? (
        <section className="reference-prayer-learning-hub beginner-home-path" aria-label="Dein nächster Schritt">
          <div className="reference-prayer-learning-hub__glow" />
          <div className="reference-prayer-learning-hub__copy">
            <span className="hero-pill">Neu im Islam · Dein nächster Schritt</span>
            <h2>{beginnerComplete ? 'Grundlagen abgeschlossen' : nextBeginnerLesson.title}</h2>
            <p>{beginnerComplete ? 'Du hast die zehn Einstiegsgrundlagen abgeschlossen. Jetzt kannst du Gebet, Quran und Wissen gezielt vertiefen.' : 'Nur zeigt dir zuerst die Grundlagen, die du als Nächstes brauchst — ohne dich mit allen Funktionen gleichzeitig zu überladen.'}</p>
            <div className="reference-prayer-learning-hub__progress">
              <span><i style={{ width: `${beginnerProgress}%` }} /></span>
              <strong>{Math.min(beginnerCompleted.size, BEGINNER_LESSONS.length)}/{BEGINNER_LESSONS.length} Grundlagen abgeschlossen</strong>
            </div>
            <button className="gold-button" onClick={openBeginnerJourney}>
              <BookOpen size={18} /> {beginnerComplete ? 'Lernen vertiefen' : 'Nächste Grundlage öffnen'} <ChevronRight size={17} />
            </button>
          </div>
          <PremiumImage src="/premium-assets/high-res-objects/quran-open-v2.webp" fallback={<QuranObject />} />
        </section>
      ) : null}

      {prayerTimesUnavailable ? (
        <section className="prayer-hero prayer-hero--v2" aria-label="Gebetszeiten nicht aktuell">
          <div className="prayer-hero__content">
            <div className="hero-meta">
              <span className="hero-pill">Gebetszeiten nicht aktuell</span>
              <span className="location"><MapPin size={14} /> {PRAYER_SCHEDULE_META.city}</span>
            </div>
            <div className="hero-main">
              <div>
                <span className="arabic-label">الصلاة</span>
                <h2>Aktuelle Zeiten prüfen</h2>
                <div className="countdown">Keine Ersatzzeit als Gebetsentscheidung verwenden</div>
              </div>
              <div className="hero-orb">
                <span className="hero-orb__ring" />
                <SunMedium size={31} />
                <strong>—:—</strong>
              </div>
            </div>
            <span className="prayer-source-note">Live-Daten oder ein heutiger gespeicherter Tagesstand fehlen. Öffne die Gebetszeiten und aktualisiere die Daten; lokale Moscheen können zusätzlich abweichen.</span>
            <button className="gold-button" onClick={() => onNavigate('prayer')}>Gebetszeiten prüfen <ChevronRight size={18} /></button>
          </div>
        </section>
      ) : (
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
      )}

      <section className="content-section">
        <div className="section-heading"><div><span className="overline">Deine Reise</span><h2>{isBeginner ? 'Deine wichtigsten Werkzeuge' : 'Spirituelle Werkzeuge'}</h2></div><button className="text-button" onClick={() => onNavigate('learn')}>Alles ansehen <ChevronRight size={16} /></button></div>
        <div className="journey-grid">
          <button className="journey-card journey-card--quran" onClick={openLastRead}>
            <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} />
            <span><small>{quranProgress.hasProgress ? (quranProgress.offline ? 'Offline weiterlesen' : 'Zuletzt gelesen') : 'Quran beginnen'}</small><strong>{quranProgress.englishName}</strong><em>{quranProgress.hasProgress ? `Ayah ${quranProgress.ayahNumber}${quranProgress.numberOfAyahs ? ` von ${quranProgress.numberOfAyahs}` : ''}` : 'Noch kein Lesestand'}</em></span>
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
        <div className="section-heading"><div><span className="overline">Entdecken</span><h2>{isBeginner ? 'Erst die wichtigen Bereiche' : 'Dein täglicher Begleiter'}</h2></div></div>
        <div className="quick-grid quick-grid--v2">
          {quickActions.map(({ label, eyebrow, icon: Icon, accent, target }, index) => (
            <motion.button
              key={label}
              className={`quick-card quick-card--${accent}`}
              onClick={() => target === 'reader' ? openLastRead() : target ? onNavigate(target) : undefined}
              whileTap={{ scale: reduceMotion ? 1 : .985 }}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={itemTransition(index)}
            >
              <span className="quick-card__icon"><Icon size={25} /></span><span className="quick-card__eyebrow">{eyebrow}</span><strong>{label}</strong><ChevronRight className="quick-card__arrow" size={18} />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="continue-card continue-card--v2 glass-card">
        <div className="continue-card__cover"><PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} /></div>
        <div className="continue-card__body"><span className="overline">{quranProgress.hasProgress ? (quranProgress.offline ? 'Offline verfügbar' : 'Zuletzt gelesen') : 'Quran beginnen'}</span><h3>{quranProgress.englishName}</h3><p>{quranProgress.hasProgress ? `Ayah ${quranProgress.ayahNumber}${quranProgress.numberOfAyahs ? ` von ${quranProgress.numberOfAyahs}` : ''} · ${quranPercent}%` : 'Noch kein gespeicherter Lesestand'}</p><div className="reading-progress"><span style={{ width: `${quranPercent}%` }} /></div></div>
        <button className="play-button" aria-label={quranProgress.hasProgress ? 'Weiterlesen' : 'Quran lesen'} onClick={openLastRead}><Play size={20} fill="currentColor" /></button>
      </section>

      <section className="inspiration-grid inspiration-grid--v2">
        <button className="verse-card verse-card--cream reference-daily-card-button" onClick={() => onNavigate('ayah')}>
          <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch-v2.webp" className="verse-card__art" fallback={<LanternObject />} />
          <div className="card-title-row"><span><Sparkles size={16} /> Ayah im Fokus</span><span><BookHeart size={18} /></span></div>
          <p className="arabic-verse" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
          <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote><footer>Al-Ikhlas · 112:1</footer>
        </button>
        <button className="hadith-card glass-card reference-daily-card-button" onClick={() => onNavigate('hadith')}>
          <div className="card-title-row"><span><Quote size={16} /> Hadith des Tages</span></div>
          <blockquote>{dailyHadith.summary}</blockquote><footer>{dailyHadith.title} · {dailyHadith.source}</footer>
        </button>
      </section>

      <section className="content-section recommendations">
        <div className="section-heading"><div><span className="overline">Empfohlen</span><h2>{isBeginner ? 'Als Nächstes sinnvoll' : 'Heute für dich'}</h2></div></div>
        <div className="recommendation-list">
          {isBeginner ? (
            <>
              <button className="recommendation-card" onClick={openBeginnerJourney}><span className="recommendation-card__icon"><BookOpen size={22} /></span><span><small>Neu im Islam</small><strong>{beginnerComplete ? 'Grundlagen vertiefen' : `${nextBeginnerLesson.title} fortsetzen`}</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('learn')}><span className="recommendation-card__icon"><HandHeart size={22} /></span><span><small>Gebet lernen</small><strong>Wudu, Qibla und Salah Schritt für Schritt</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('quran')}><span className="recommendation-card__icon"><BookHeart size={22} /></span><span><small>Quran für Anfänger</small><strong>Begriffe verstehen und ruhig beginnen</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('mosques')}><span className="recommendation-card__icon"><MapPin size={22} /></span><span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span><ChevronRight size={20} /></button>
            </>
          ) : (
            <>
              <button className="recommendation-card" onClick={() => onNavigate('learn')}><span className="recommendation-card__icon"><BookOpen size={22} /></span><span><small>Islam verstehen</small><strong>Grundlagen und geprüfte Lernkurse vertiefen</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('quran')}><span className="recommendation-card__icon"><BookHeart size={22} /></span><span><small>Quran</small><strong>Lesen, fortsetzen und Favoriten verwalten</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('mosques')}><span className="recommendation-card__icon"><MapPin size={22} /></span><span><small>Moschee-Suche</small><strong>Moscheen in deiner Nähe</strong></span><ChevronRight size={20} /></button>
              <button className="recommendation-card" onClick={() => onNavigate('collections')}><span className="recommendation-card__icon"><BookHeart size={22} /></span><span><small>Meine Sammlung</small><strong>Favoriten und Lesezeichen</strong></span><ChevronRight size={20} /></button>
            </>
          )}
        </div>
      </section>
    </motion.main>
  );
}

function BottomNavigation({ active, onChange }: { active: PrimaryTab; onChange: (tab: PrimaryTab) => void }) {
  const items: Array<{ id: PrimaryTab; label: string; icon: LucideIcon }> = [
    { id: 'home', label: 'Start', icon: Home },
    { id: 'prayer', label: 'Gebete', icon: SunMedium },
    { id: 'calendar', label: 'Kalender', icon: CalendarDays },
    { id: 'learn', label: 'Islam verstehen', icon: BookOpen },
    { id: 'profile', label: 'Mehr', icon: Menu },
  ];

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`${active === id ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'}${id === 'learn' ? ' bottom-nav__item--learn' : ''}`} onClick={() => onChange(id)} aria-current={active === id ? 'page' : undefined}>
          <span><Icon size={20} /></span><small>{id === 'learn' ? <><span>Islam</span>{' '}<span>verstehen</span></> : label}</small>
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
      if (!entry || !isNavigationSnapshot(entry.snapshot)) return;
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

  const screen = isReleaseBlockedTab(activeTab)
    ? <ReleaseLockedScreen tab={activeTab} onBack={() => goBack('home')} />
    : isLegacyTab(activeTab)
      ? <LegacyFeatureScreen featureId={getLegacyFeatureId(activeTab)} onBack={goBack} />
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
                            : activeTab === 'prayer'
                              ? <PrayerScreen onBack={goBack} />
                              : activeTab === 'calendar'
                                ? <CalendarScreen onBack={goBack} initialDateKey={selectedCalendarDate} />
                                : activeTab === 'learn'
                                  ? <LearnScreen onBack={goBack} onOpenPrayer={() => navigate('prayer')} onOpenQibla={() => navigate('qibla')} />
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
                                          : <AssistantScreen onBack={goBack} />;

  return (
    <div className="app-background app-background--v2">
      <div className="background-orbit background-orbit--one" />
      <div className="background-orbit background-orbit--two" />
      <div className={screensWithBottomNavigation.has(activeTab) ? 'app-shell' : 'app-shell app-shell--detail'}>
        <AnimatePresence mode="wait">
          <motion.div key={`${activeTab}-${activeTab === 'reader' ? `${selectedSurahNumber}-${selectedAyahNumber}` : activeTab === 'duas' ? selectedDuaId ?? '' : activeTab === 'names' ? selectedNameId ?? '' : activeTab === 'calendar' ? selectedCalendarDate ?? '' : activeTab === 'hadith' ? selectedHadithId ?? 'daily' : ''}`} className="screen-transition-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .12, ease: [0.22, 1, 0.36, 1] }}>
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
