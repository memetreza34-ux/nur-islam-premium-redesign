import { TopicCardContent } from '../shared/TopicCardContent';
import { PremiumImage } from '../shared/PremiumVisuals';
import { TOPIC_SUMMARIES } from '../data/topicSummaries';
import { useScreenState, useScreenRef } from '../shared/ScreenState';
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ChevronRight,
  CircleCheck,
  Compass,
  Droplets,
  HeartHandshake,
  Landmark,
  ListChecks,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  ScrollText,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LEARNING_CATEGORIES } from '../data/learningCategories';
import type { LearningCategoryId } from '../data/learningCategories';
const LearningCourseScreen = lazy(() => import('./LearningCourseScreen')
  .then((module) => ({ default: module.LearningCourseScreen })));
// The screens are loaded on demand; only their metadata is needed to draw
// the hub tiles.
const LegacyFeatureScreen = lazy(() => import('./LegacyFeatureScreens')
  .then((module) => ({ default: module.LegacyFeatureScreen })));
import { learningLegacyFeatures } from '../data/legacyFeatures';
import type { LegacyFeatureId } from '../data/legacyFeatures';
// Loaded on demand: the course carries the full prayer sequence with its
// Arabic wording and posture figures, outside the learning hub bundle.
const PrayerLearningScreen = lazy(() => import('./PrayerLearningScreen')
  .then((module) => ({ default: module.PrayerLearningScreen })));
import { PRAYER_LESSONS } from '../data/prayerLessons';
import type { PrayerLessonId } from '../data/prayerLessons';
import { WorshipGuideScreen } from './ReferenceReadingScreens';

const categoryIcons: Record<LearningCategoryId, LucideIcon> = {
  faith: ShieldCheck,
  pillars: Landmark,
  terms: ListChecks,
  practice: Droplets,
  character: HeartHandshake,
  community: Users,
  prophet: Star,
};

const categoryArtwork: Record<LearningCategoryId, string> = {
  faith: '/premium-assets/high-res-objects/learn-hub-book-v1.webp',
  pillars: '/premium-assets/high-res-objects/learn-hub-pillars-v1.webp',
  terms: '/premium-assets/high-res-objects/learn-hub-terms-v1.webp',
  practice: '/premium-assets/high-res-objects/learn-hub-wudu-v1.webp',
  character: '/premium-assets/high-res-objects/learn-hub-character-v1.webp',
  community: '/premium-assets/high-res-objects/learn-hub-community-v1.webp',
  prophet: '/premium-assets/high-res-objects/prayer-companion-mosque-v1.webp',
};

const specialArtwork: Partial<Record<LegacyFeatureId, string>> = {
  'hadith-library': '/premium-assets/high-res-objects/learn-hub-hadith-v1.webp',
  hajj: '/premium-assets/high-res-objects/learn-hub-hajj-v1.webp',
  sunnah: '/premium-assets/high-res-objects/learn-hub-sunnah-v1.webp',
  sins: '/premium-assets/high-res-objects/home-duas-v5.webp',
};

const learningChapters: Array<{
  id: string;
  title: string;
  categoryIds: LearningCategoryId[];
}> = [
  {
    id: 'grundlagen',
    title: 'Grundlagen',
    categoryIds: ['faith', 'pillars', 'terms'],
  },
  {
    id: 'alltag',
    title: 'Alltag & Miteinander',
    categoryIds: ['practice', 'character', 'community'],
  },
  {
    id: 'vertiefen',
    title: 'Geschichte & Wissen',
    categoryIds: ['prophet'],
  },
];

const learningAreas = [
  { id: 'gebet', title: 'Gebet', art: '/premium-assets/high-res-objects/home-learn-prayer-v5.webp', Icon: BookOpen },
  { id: 'grundlagen', title: 'Grundlagen', art: categoryArtwork.faith, Icon: ShieldCheck },
  { id: 'alltag', title: 'Alltag', art: categoryArtwork.character, Icon: HeartHandshake },
  { id: 'vertiefen', title: 'Vertiefen', art: specialArtwork['hadith-library']!, Icon: ScrollText },
];

function readStoredStep(key: string) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function LearnScreen({
  onBack,
  onOpenPrayer,
  onOpenQibla,
  onOpenNames,
  onOpenQuranReference,
  directPrayerCourse = false,
  directPrayerBackLabel = 'Zurück zu Gebet',
  initialLearningCategory,
}: {
  onBack: () => void;
  onOpenPrayer: () => void;
  onOpenQibla: () => void;
  onOpenNames: () => void;
  onOpenQuranReference: (surahNumber: number, ayahNumber?: number) => void;
  directPrayerCourse?: boolean;
  directPrayerBackLabel?: string;
  initialLearningCategory?: LearningCategoryId;
}) {
  const [wuduOpen, setWuduOpen] = useScreenState('learn.wudu', false);
  const [prayerLesson, setPrayerLesson] = useScreenState<PrayerLessonId | null>('learn.prayer', null);
  const [learningCategory, setLearningCategory] = useScreenState<LearningCategoryId | null>('learn.category', initialLearningCategory ?? null);
  const [legacyFeature, setLegacyFeature] = useScreenState<LegacyFeatureId | null>('learn.legacy', () => {
    try { return localStorage.getItem('nur_prophet_course_return_v1') ? 'prophets' : null; }
    catch { return null; }
  });
  const [toast, setToast] = useState<string | null>(null);
  const learningOverviewScroll = useScreenRef('learn.overview-scroll', readStoredStep('nur_learning_overview_scroll_v1'));
  const learningScrollFrame = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();


  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .025, .12), ease: [0.22, 1, 0.36, 1] as const });
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const rememberOverview = useCallback((source?: HTMLElement) => {
    const frame = source?.closest<HTMLElement>('.screen-transition-frame')
      ?? document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame')
      ?? null;
    learningScrollFrame.current = frame;
    learningOverviewScroll.current = frame?.scrollTop ?? 0;
    try { localStorage.setItem('nur_learning_overview_scroll_v1', String(learningOverviewScroll.current)); } catch { /* optional */ }
  }, []);

  const restoreOverview = useCallback(() => {
    const offset = learningOverviewScroll.current;
    const restore = () => {
      const frame = learningScrollFrame.current?.isConnected ? learningScrollFrame.current
        : document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame');
      if (frame) frame.scrollTop = offset;
    };
    window.setTimeout(restore, 0);
    window.setTimeout(restore, 160);
  }, []);

  const openLearningCategory = useCallback((categoryId: LearningCategoryId, source?: HTMLElement) => {
    rememberOverview(source);
    setLearningCategory(categoryId);
  }, [rememberOverview, setLearningCategory]);

  const closeLearningCategory = useCallback(() => {
    if (initialLearningCategory) { onBack(); return; }
    setLearningCategory(null);
    restoreOverview();
  }, [initialLearningCategory, onBack, restoreOverview, setLearningCategory]);

  const openLegacyFeature = useCallback((featureId: LegacyFeatureId, source?: HTMLElement) => {
    rememberOverview(source);
    setLegacyFeature(featureId);
  }, [rememberOverview, setLegacyFeature]);

  const closeLegacyFeature = useCallback(() => {
    setLegacyFeature(null);
    restoreOverview();
  }, [restoreOverview, setLegacyFeature]);

  const openWudu = (source?: HTMLElement) => { rememberOverview(source); setWuduOpen(true); };
  const openPrayerLesson = (id: PrayerLessonId, source?: HTMLElement) => { rememberOverview(source); setPrayerLesson(id); };
  const closeWudu = () => { setWuduOpen(false); restoreOverview(); };
  const closePrayerLesson = () => { setPrayerLesson(null); restoreOverview(); };

  const renderCategoryCard = (categoryId: LearningCategoryId) => {
    const category = LEARNING_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return null;
    const index = LEARNING_CATEGORIES.findIndex((item) => item.id === categoryId);
    const Icon = categoryIcons[category.id];
    return (
      <motion.button
        key={category.id}
        className={`topic-card reference-foundation-step learn-library-card${index < 2 ? ' is-core' : ''}`}
        onClick={(event) => openLearningCategory(category.id, event.currentTarget)}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={itemTransition(index)}
      >
        <TopicCardContent title={category.title} description={TOPIC_SUMMARIES[category.id]} art={categoryArtwork[category.id]} fallback={<Icon />} />
      </motion.button>
    );
  };

  const renderSpecialCard = ({
    number,
    title,
    description,
    status,
    Icon,
    art,
    onOpen,
    className = '',
  }: {
    number: number;
    title: string;
    description: string;
    status?: string;
    Icon: LucideIcon;
    art: string;
    onOpen: (source: HTMLButtonElement) => void;
    className?: string;
  }) => (
    <motion.button
      key={title}
      className={`topic-card reference-foundation-step learn-library-card ${className}`.trim()}
      onClick={(event) => onOpen(event.currentTarget)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={itemTransition(number)}
    >
      <TopicCardContent title={title} description={description} art={art} fallback={<Icon />} status={status} />
    </motion.button>
  );

  if (wuduOpen) {
    return <WorshipGuideScreen initialMode="wudu" onBack={closeWudu} />;
  }

  if (directPrayerCourse || prayerLesson) {
    return (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
      <PrayerLearningScreen
        initialPrayer={prayerLesson ?? PRAYER_LESSONS[0].id}
        onBack={directPrayerCourse ? onBack : closePrayerLesson}
        backLabel={directPrayerCourse ? directPrayerBackLabel : 'Zurück zu Lernen'}
        onOpenQibla={onOpenQibla}
        onOpenPrayerTimes={onOpenPrayer}
      />
      </Suspense>
    );
  }

  if (learningCategory) {
    return (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
        <LearningCourseScreen categoryId={learningCategory} onBack={closeLearningCategory} />
      </Suspense>
    );
  }

  if (legacyFeature) {
    return (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
        <LegacyFeatureScreen featureId={legacyFeature} onBack={closeLegacyFeature} onOpenQuranReference={onOpenQuranReference} />
      </Suspense>
    );
  }

  return (
    <motion.main className="screen reference-learn-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header reference-screen-header--banner">
        <span aria-hidden="true" />
        <div><span className="overline">Nur Islam</span><h1>Lernen</h1></div>
        <span aria-hidden="true" />
      </header>

      <nav className="learn-library-index" aria-label="Lernbereiche">
        {learningAreas.map(({ id, title, art, Icon }) => (
          <button key={id} aria-controls={`lernen-${id}`} onClick={() => document.getElementById(`lernen-${id}`)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })}>
            <span className="learn-library-index__art" aria-hidden="true"><PremiumImage src={art} fallback={<Icon />} /></span>
            <span>{title}</span>
          </button>
        ))}
      </nav>

      <section className="learn-library-practice learn-library-practice--priority" id="lernen-gebet" aria-labelledby="prayer-practice-title">
        <header className="learn-library-section-heading">
          <h2 id="prayer-practice-title">Gebetspraxis</h2>
        </header>
        <div className="learn-library-actions topic-list">
          <button className="topic-card" aria-label="Wudu Schritt für Schritt" onClick={event => openWudu(event.currentTarget)}>
            <TopicCardContent title="Wudu" description={TOPIC_SUMMARIES.wudu} art="/premium-assets/high-res-objects/learn-hub-wudu-v1.webp" fallback={<Droplets />} />
          </button>
          <button className="topic-card" aria-label="Gebetsablauf Rakʿah mit Wortlaut" onClick={event => openPrayerLesson(PRAYER_LESSONS[0].id, event.currentTarget)}>
            <TopicCardContent title="Gebetsablauf" description={TOPIC_SUMMARIES.salah} art="/premium-assets/high-res-objects/home-learn-prayer-v5.webp" fallback={<BookOpen />} />
          </button>
          <button className="topic-card" onClick={onOpenQibla}>
            <TopicCardContent title="Qibla" description={TOPIC_SUMMARIES.qibla} art="/premium-assets/high-res-objects/home-qibla-illustrated-v3.webp" fallback={<Compass />} />
          </button>
        </div>
      </section>

      <section className="reference-learning-section reference-knowledge-curriculum" aria-label="Wissensthemen">
        <div className="reference-foundation-path learn-library-path">
          {learningChapters.map((chapter, chapterIndex) => {
            return (
              <section className="learn-library-chapter" id={`lernen-${chapter.id}`} key={chapter.id} aria-labelledby={`lernen-${chapter.id}-title`}>
                <header className="learn-library-chapter__header learn-library-section-heading">
                  <h2 id={`lernen-${chapter.id}-title`}>{chapter.title}</h2>
                </header>

                <div className="learn-library-card-grid topic-list">
                  {chapter.categoryIds.map(renderCategoryCard)}
                  {chapterIndex === 2 ? (
                    <>
                      {renderSpecialCard({ number: 8, title: 'Die 25 Propheten', description: TOPIC_SUMMARIES.prophets, Icon: ScrollText, art: '/premium-assets/high-res-objects/learn-hub-prophets-v2.webp', onOpen: (source) => openLegacyFeature('prophets', source), className: 'reference-foundation-step--prophets' })}
                      {renderSpecialCard({ number: 9, title: '99 Namen Allahs', description: TOPIC_SUMMARIES.names, Icon: Sparkles, art: '/premium-assets/high-res-objects/home-names-v5.webp', onOpen: () => onOpenNames(), className: 'reference-foundation-step--names' })}
                      {renderSpecialCard({ number: 10, title: 'Die vier Rechtsschulen', description: TOPIC_SUMMARIES.madhhabs, Icon: Scale, art: '/premium-assets/high-res-objects/learn-hub-madhhabs-v1.webp', onOpen: (source) => openLegacyFeature('madhhabs', source), className: 'reference-foundation-step--madhhabs' })}
                      {learningLegacyFeatures.filter((feature) => feature.id !== 'prophets' && feature.id !== 'madhhabs').map((feature, index) => renderSpecialCard({ number: 11 + index, title: feature.title, description: TOPIC_SUMMARIES[feature.id as keyof typeof TOPIC_SUMMARIES], Icon: feature.icon, art: specialArtwork[feature.id] ?? feature.art, onOpen: (source) => openLegacyFeature(feature.id, source) }))}
                    </>
                  ) : null}
                </div>

              </section>
            );
          })}
        </div>
      </section>

      <section className="reference-knowledge-quote">
        <span className="reference-knowledge-quote__mark"><Star size={18} /></span>
        <p>Sinngemäß: „Mein Herr, mehre mein Wissen.“</p><small>Quran · Taha 20:114</small>
      </section>


      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
