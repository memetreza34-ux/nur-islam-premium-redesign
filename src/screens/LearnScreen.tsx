import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Droplets,
  GraduationCap,
  HeartHandshake,
  Landmark,
  ListChecks,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  ScrollText,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
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
// Arabic wording and the posture figures, which pushed the startup bundle past
// its entry budget. The hub only needs the five prayers' names.
const PrayerLearningScreen = lazy(() => import('./PrayerLearningScreen')
  .then((module) => ({ default: module.PrayerLearningScreen })));
import { PRAYER_LESSONS } from '../data/prayerLessons';
import type { PrayerLessonId } from '../data/prayerLessons';
import { PremiumImage } from '../shared/PremiumVisuals';
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
  faith: '/premium-assets/high-res-objects/learn-faith-v3.webp',
  pillars: '/premium-assets/high-res-objects/learn-pillars-v3.webp',
  terms: '/premium-assets/high-res-objects/learn-terms-v3.webp',
  practice: '/premium-assets/high-res-objects/learn-practice-v3.webp',
  character: '/premium-assets/high-res-objects/learn-character-v3.webp',
  community: '/premium-assets/high-res-objects/learn-community-v3.webp',
  prophet: '/premium-assets/high-res-objects/learn-seerah-v3.webp',
};

const specialArtwork: Partial<Record<LegacyFeatureId, string>> = {
  'hadith-library': '/premium-assets/high-res-objects/learn-hadith-v3.webp',
  hajj: '/premium-assets/high-res-objects/kaaba-v2.webp',
  sunnah: '/premium-assets/high-res-objects/learn-sunnah-v3.webp',
  sins: '/premium-assets/high-res-objects/learn-repentance-v3.webp',
};

const learningChapters: Array<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  categoryIds: LearningCategoryId[];
}> = [
  {
    id: 'grundlagen',
    eyebrow: 'Kapitel 1 · Beginne hier',
    title: 'Glaube und Grundwissen',
    description: 'Erst das Fundament verstehen: woran Muslime glauben, wie die fünf Säulen zusammenhängen und was zentrale Begriffe bedeuten.',
    categoryIds: ['faith', 'pillars', 'terms'],
  },
  {
    id: 'alltag',
    eyebrow: 'Kapitel 2 · Anwenden',
    title: 'Praxis und Miteinander',
    description: 'Reinheit, Gebet, Charakter und die Rechte anderer Schritt für Schritt in den Alltag übertragen.',
    categoryIds: ['practice', 'character', 'community'],
  },
  {
    id: 'vertiefen',
    eyebrow: 'Kapitel 3 · Zusammenhänge',
    title: 'Geschichte und Vertiefung',
    description: 'Den Propheten ﷺ, die Quran-Erzählungen und wichtige Quellen kennenlernen und Unterschiede richtig einordnen.',
    categoryIds: ['prophet'],
  },
];

function readStringSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

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
  const [wuduOpen, setWuduOpen] = useState(false);
  const [prayerLesson, setPrayerLesson] = useState<PrayerLessonId | null>(null);
  const [learningCategory, setLearningCategory] = useState<LearningCategoryId | null>(initialLearningCategory ?? null);
  const [legacyFeature, setLegacyFeature] = useState<LegacyFeatureId | null>(() => {
    try { return localStorage.getItem('nur_prophet_course_return_v1') ? 'prophets' : null; }
    catch { return null; }
  });
  const [learningPlanOpen, setLearningPlanOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const learningOverviewScroll = useRef(readStoredStep('nur_learning_overview_scroll_v1'));
  const learningScrollFrame = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const closeDialog = useCallback(() => { setLearningPlanOpen(false); }, []);
  const screenDialog = useDialog(learningPlanOpen, closeDialog, 'Lernplan');

  const completedPrayerLessons = readStringSet('nur_prayer_learning_complete');
  const completedKnowledgeLessons = readStringSet('nur_learning_completed');
  const learnedNames = readStringSet('nur_name_learned');
  const wuduFinished = readStoredStep('nur_guide_wudu_step') >= 5;
  const completedCoreLessons = Math.min(6, completedPrayerLessons.size + (wuduFinished ? 1 : 0));
  const totalKnowledgeLessons = LEARNING_CATEGORIES.reduce((sum, category) => sum + category.lessonIds.length, 0);
  const completedKnowledgeCount = LEARNING_CATEGORIES.reduce(
    (sum, category) => sum + category.lessonIds.filter((lessonId) => completedKnowledgeLessons.has(lessonId)).length,
    0,
  );
  const knowledgeProgress = Math.round((completedKnowledgeCount / totalKnowledgeLessons) * 100);
  const coreProgress = Math.round((completedCoreLessons / 6) * 100);
  const nextKnowledgeCategory = LEARNING_CATEGORIES.find((category) =>
    category.lessonIds.some((lessonId) => !completedKnowledgeLessons.has(lessonId)),
  );
  const categoryIsComplete = (categoryId: LearningCategoryId) => {
    const category = LEARNING_CATEGORIES.find((item) => item.id === categoryId);
    return Boolean(category?.lessonIds.every((lessonId) => completedKnowledgeLessons.has(lessonId)));
  };
  const nextPrayer = PRAYER_LESSONS.find((prayer) => !completedPrayerLessons.has(prayer.id)) ?? PRAYER_LESSONS[0];
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const itemTransition = (index: number) => ({ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .025, .12), ease: [0.22, 1, 0.36, 1] as const });
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const openLearningCategory = useCallback((categoryId: LearningCategoryId, source?: HTMLElement) => {
    const frame = source?.closest<HTMLElement>('.screen-transition-frame')
      ?? document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame')
      ?? null;
    learningScrollFrame.current = frame;
    learningOverviewScroll.current = frame?.scrollTop ?? 0;
    try { localStorage.setItem('nur_learning_overview_scroll_v1', String(learningOverviewScroll.current)); } catch { /* optional */ }
    setLearningCategory(categoryId);
  }, []);

  const closeLearningCategory = useCallback(() => {
    if (initialLearningCategory) {
      onBack();
      return;
    }
    const offset = learningOverviewScroll.current;
    setLearningCategory(null);
    const restore = () => {
      const frame = learningScrollFrame.current
        ?? document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame')
        ?? null;
      if (!frame) return;
      learningScrollFrame.current = frame;
      frame.scrollTop = offset;
    };
    window.setTimeout(restore, 0);
    // Removing the focused Back button can trigger the browser's own focus
    // scroll after React has committed the overview. Restore once more after
    // that hand-off so the user's position wins.
    window.setTimeout(restore, 160);
  }, [initialLearningCategory, onBack]);

  const openLegacyFeature = useCallback((featureId: LegacyFeatureId, source?: HTMLElement) => {
    const frame = source?.closest<HTMLElement>('.screen-transition-frame')
      ?? document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame')
      ?? null;
    learningScrollFrame.current = frame;
    learningOverviewScroll.current = frame?.scrollTop ?? 0;
    try { localStorage.setItem('nur_learning_overview_scroll_v1', String(learningOverviewScroll.current)); } catch { /* optional */ }
    setLegacyFeature(featureId);
  }, []);

  const closeLegacyFeature = useCallback(() => {
    const offset = learningOverviewScroll.current;
    setLegacyFeature(null);
    const restore = () => {
      const frame = learningScrollFrame.current
        ?? document.querySelector<HTMLElement>('.reference-learn-screen')?.closest<HTMLElement>('.screen-transition-frame')
        ?? null;
      if (frame) frame.scrollTop = offset;
    };
    window.setTimeout(restore, 0);
    window.setTimeout(restore, 160);
  }, []);

  const renderCategoryCard = (categoryId: LearningCategoryId) => {
    const category = LEARNING_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return null;
    const index = LEARNING_CATEGORIES.findIndex((item) => item.id === categoryId);
    const Icon = categoryIcons[category.id];
    const completedInCategory = category.lessonIds.filter((lessonId) => completedKnowledgeLessons.has(lessonId)).length;
    const complete = completedInCategory === category.lessonIds.length;
    return (
      <motion.button
        key={category.id}
        className={`reference-foundation-step learn-library-card${index < 2 ? ' is-core' : ''}${complete ? ' is-complete' : ''}`}
        onClick={(event) => openLearningCategory(category.id, event.currentTarget)}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={itemTransition(index)}
        whileTap={{ scale: reduceMotion ? 1 : .99 }}
      >
        <span className="reference-foundation-step__marker"><small>{String(index + 1).padStart(2, '0')}</small>{complete ? <CircleCheck size={21} /> : <Icon size={21} />}</span>
        <span className="learn-library-card__art" aria-hidden="true"><PremiumImage src={categoryArtwork[category.id]} fallback={<Icon />} /></span>
        <span className="reference-foundation-step__copy">
          <small>{index < 2 ? 'Unverzichtbare Grundlage' : category.subtitle}</small>
          <strong>{category.title}</strong>
          <em>{category.topics.join(' · ')}</em>
        </span>
        <span className="reference-foundation-step__status"><small>{completedInCategory}/{category.lessonIds.length}</small><ChevronRight size={18} /></span>
      </motion.button>
    );
  };

  const renderSpecialCard = ({
    number,
    title,
    subtitle,
    description,
    status,
    Icon,
    art,
    onOpen,
    className = '',
  }: {
    number: number;
    title: string;
    subtitle: string;
    description: string;
    status: string;
    Icon: LucideIcon;
    art: string;
    onOpen: (source: HTMLButtonElement) => void;
    className?: string;
  }) => (
    <motion.button
      key={title}
      className={`reference-foundation-step learn-library-card ${className}`.trim()}
      onClick={(event) => onOpen(event.currentTarget)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={itemTransition(number)}
      whileTap={{ scale: reduceMotion ? 1 : .99 }}
    >
      <span className="reference-foundation-step__marker"><small>{String(number).padStart(2, '0')}</small><Icon size={21} /></span>
      <span className="learn-library-card__art" aria-hidden="true"><PremiumImage src={art} fallback={<Icon />} /></span>
      <span className="reference-foundation-step__copy"><small>{subtitle}</small><strong>{title}</strong><em>{description}</em></span>
      <span className="reference-foundation-step__status"><small>{status}</small><ChevronRight size={18} /></span>
    </motion.button>
  );

  if (wuduOpen) {
    return <WorshipGuideScreen initialMode="wudu" onBack={() => setWuduOpen(false)} />;
  }

  if (directPrayerCourse || prayerLesson) {
    return (
      <Suspense fallback={<div className="screen-lazy-fallback" aria-busy="true" />}>
      <PrayerLearningScreen
        initialPrayer={prayerLesson ?? nextPrayer.id}
        onBack={directPrayerCourse ? onBack : () => setPrayerLesson(null)}
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
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Lernen</h1></div>
        <button className="icon-button" onClick={() => setLearningPlanOpen(true)} aria-label="Lernplan öffnen"><Settings size={20} /></button>
      </header>

      <section className="learn-library-intro" aria-label="Einführung in den Lernbereich">
        <div className="learn-library-intro__copy">
          <span className="overline">Dein Lernbereich</span>
          <h2>Islam verstehen.<br />Schritt für Schritt.</h2>
          <p>Beginne mit dem Gebet. Danach lernst du die Grundlagen des Glaubens, den Alltag und die Geschichten der Propheten in einer klaren Reihenfolge.</p>
          <div className="learn-library-intro__path" aria-label="Inhalte des Lernbereichs">
            <span>Beten</span><i />
            <span>Grundlagen</span><i />
            <span>Vertiefen</span>
          </div>
        </div>
        <div className="learn-library-intro__art" aria-hidden="true">
          <PremiumImage src="/premium-assets/high-res-objects/home-quran-illustrated-v1.webp" fallback={<BookOpen />} priority />
        </div>
      </section>

      <section className="learn-library-prayer-entry" aria-label="Beten lernen">
        <div className="learn-library-prayer-entry__copy">
          <div className="learning-intro__heading">
            <span className="overline">Gebet · Beginne hier</span>
            <h2>Beten lernen</h2>
          </div>
          <p className="learning-intro__description">Vom Wudu bis zur vollständigen Rakʿah — mit Haltung, arabischem Wortlaut und Aussprachehilfe.</p>
          <div className="reference-prayer-learning-hub__progress">
            <span><i style={{ width: `${coreProgress}%` }} /></span>
            <strong>{completedCoreLessons}/6 Gebetsgrundlagen abgeschlossen</strong>
          </div>
          <button className="gold-button" onClick={() => setPrayerLesson(nextPrayer.id)}>
            <GraduationCap size={18} /> {completedPrayerLessons.size ? `${nextPrayer.label} weiterlernen` : 'Gebetskurs starten'} <ChevronRight size={17} />
          </button>
        </div>
        <div className="learning-intro__art" aria-hidden="true">
          <PremiumImage src="/premium-assets/high-res-objects/home-learn-prayer-v2.webp" fallback={<GraduationCap />} priority />
        </div>
      </section>

      <section className="learn-library-practice learn-library-practice--priority" aria-labelledby="prayer-practice-title">
        <div className="learn-library-practice__intro">
          <span className="overline">Schritt für Schritt</span>
          <h3 id="prayer-practice-title">Vom Wudu bis zur vollständigen Rakʿah</h3>
          <p>Bereite dich vor, finde die Qibla und übe anschließend jedes Pflichtgebet mit Wortlaut und Haltung.</p>
        </div>
        <div className="learn-library-actions">
          <button onClick={() => setWuduOpen(true)}>
            <span className="learn-library-action-visual"><PremiumImage src="/premium-assets/high-res-objects/wudu-washing-v1.webp" fallback={<Droplets />} /></span>
            <span><strong>Wudu</strong><small>Schritt für Schritt</small></span><ChevronRight size={17} />
          </button>
          <button onClick={() => setPrayerLesson(nextPrayer.id)}>
            <span className="learn-library-action-visual"><PremiumImage src="/premium-assets/high-res-objects/learn-salah-v3.webp" fallback={<BookOpen />} /></span>
            <span><strong>Gebetsablauf</strong><small>Rakʿah mit Wortlaut</small></span><ChevronRight size={17} />
          </button>
          <button onClick={onOpenQibla}>
            <span className="learn-library-action-visual"><PremiumImage src="/premium-assets/high-res-objects/home-qibla-illustrated-v1.webp" fallback={<Compass />} /></span>
            <span><strong>Qibla</strong><small>Live-Kompass</small></span><ChevronRight size={17} />
          </button>
        </div>
        <div className="learn-library-prayers">
          <div className="section-heading"><div><span className="overline">Die fünf Pflichtgebete</span><h2>Einzeln üben</h2></div><span>{completedPrayerLessons.size}/5</span></div>
          <div className="learn-library-prayer-strip">
            {PRAYER_LESSONS.map((prayer, index) => {
              const complete = completedPrayerLessons.has(prayer.id);
              return (
                <motion.button key={prayer.id} className={`learn-library-prayer-card learn-library-prayer-card--${prayer.id}${complete ? ' is-complete' : ''}`} onClick={() => setPrayerLesson(prayer.id)} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={itemTransition(index)}>
                  <span className="learn-library-prayer-scene" aria-hidden="true"><PremiumImage src={`/premium-assets/high-res-objects/prayer-${prayer.id}-v1.webp`} fallback={<Sparkles />} /></span>
                  <span className="learn-library-prayer-copy">
                    <span><strong>{prayer.label}</strong><b lang="ar" dir="rtl">{prayer.arabic}</b></span>
                    <small>{prayer.timeLabel}</small>
                    <em>{prayer.note}</em>
                  </span>
                  <span className="learn-library-prayer-rakahs">{complete ? <CircleCheck size={16} /> : prayer.rakahs}<small>Rakʿah</small></span>
                  <ChevronRight size={17} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="reference-learning-section reference-knowledge-curriculum">
        <div className="section-heading">
          <div><span className="overline">Danach weiterlernen</span><h2>Dein Grundlagenpfad</h2></div>
          <span className="reference-knowledge-progress">{completedKnowledgeCount}/{totalKnowledgeLessons}</span>
        </div>
        <div className="reference-knowledge-overview">
          <span><i style={{ width: `${knowledgeProgress}%` }} /></span>
          <small>{knowledgeProgress}% abgeschlossen · drei Kapitel führen vom Fundament zur Vertiefung</small>
        </div>
        <nav className="learn-library-index" aria-label="Kapitel im Lernweg">
          {learningChapters.map((chapter, index) => (
            <button key={chapter.id} onClick={() => document.getElementById(`lernen-${chapter.id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })}>
              <small>0{index + 1}</small><strong>{index === 0 ? 'Grundlagen' : index === 1 ? 'Praxis' : 'Vertiefen'}</strong>
            </button>
          ))}
        </nav>

        <div className="reference-foundation-path learn-library-path">
          {learningChapters.map((chapter, chapterIndex) => {
            return (
              <section className="learn-library-chapter" id={`lernen-${chapter.id}`} key={chapter.id}>
                <header className="learn-library-chapter__header">
                  <div><span>{chapter.eyebrow}</span><h3>{chapter.title}</h3><p>{chapter.description}</p></div>
                </header>

                <div className="learn-library-card-grid">
                  {chapter.categoryIds.map(renderCategoryCard)}
                  {chapterIndex === 2 ? (
                    <>
                      {renderSpecialCard({ number: 8, title: 'Die 25 Propheten', subtitle: 'Im Quran namentlich genannt', description: 'Kursplan · wichtige Ereignisse · Quran-Stellen', status: '25 Kurse', Icon: ScrollText, art: '/premium-assets/high-res-objects/learn-prophets-v3.webp', onOpen: (source) => openLegacyFeature('prophets', source), className: 'reference-foundation-step--prophets' })}
                      {renderSpecialCard({ number: 9, title: '99 Namen Allahs', subtitle: 'Asma’ul Husna', description: 'Arabisch · Aussprache · Bedeutung', status: `${learnedNames.size}/99`, Icon: Sparkles, art: '/premium-assets/high-res-objects/home-names-v1.webp', onOpen: () => onOpenNames(), className: learnedNames.size === 99 ? 'reference-foundation-step--names is-complete' : 'reference-foundation-step--names' })}
                      {renderSpecialCard({ number: 10, title: 'Die vier Rechtsschulen', subtitle: 'Fiqh verstehen', description: 'Hanafi · Maliki · Schafiʿi · Hanbali', status: '4 Schulen', Icon: Scale, art: '/premium-assets/high-res-objects/learn-madhhabs-v3.webp', onOpen: (source) => openLegacyFeature('madhhabs', source), className: 'reference-foundation-step--madhhabs' })}
                      {learningLegacyFeatures.filter((feature) => feature.id !== 'prophets' && feature.id !== 'madhhabs').map((feature, index) => renderSpecialCard({ number: 11 + index, title: feature.title, subtitle: feature.subtitle, description: feature.description, status: 'Vertiefen', Icon: feature.icon, art: specialArtwork[feature.id] ?? feature.art, onOpen: (source) => openLegacyFeature(feature.id, source) }))}
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

      <AnimatePresence>
        {learningPlanOpen ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setLearningPlanOpen(false)}>
            <motion.section {...screenDialog.props} className="reference-category-modal reference-learning-plan-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setLearningPlanOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-category-modal__icon"><GraduationCap size={31} /></span><span className="overline">Dein Lernplan</span><h2>Dein Grundlagenweg</h2><p>Vom Glauben über zentrale Begriffe bis zur Anwendung im Alltag. Dein Fortschritt wird nur lokal gespeichert.</p>
              <div className="reference-learning-plan-list">
                <span className={categoryIsComplete('faith') && categoryIsComplete('pillars') ? 'is-complete' : ''}><i>{categoryIsComplete('faith') && categoryIsComplete('pillars') ? <CircleCheck size={16} /> : 1}</i><strong>Glaube und fünf Säulen verstehen</strong></span>
                <span className={categoryIsComplete('terms') ? 'is-complete' : ''}><i>{categoryIsComplete('terms') ? <CircleCheck size={16} /> : 2}</i><strong>Wichtige Begriffe sicher unterscheiden</strong></span>
                <span className={categoryIsComplete('practice') && wuduFinished && completedPrayerLessons.size === 5 ? 'is-complete' : ''}><i>{categoryIsComplete('practice') && wuduFinished && completedPrayerLessons.size === 5 ? <CircleCheck size={16} /> : 3}</i><strong>Reinheit, Qibla und Gebet üben</strong></span>
                <span className={categoryIsComplete('character') && categoryIsComplete('community') ? 'is-complete' : ''}><i>{categoryIsComplete('character') && categoryIsComplete('community') ? <CircleCheck size={16} /> : 4}</i><strong>Charakter und Verantwortung leben</strong></span>
                <span className={categoryIsComplete('prophet') ? 'is-complete' : ''}><i>{categoryIsComplete('prophet') ? <CircleCheck size={16} /> : 5}</i><strong>Den Propheten ﷺ kennenlernen</strong></span>
              </div>
              <button className="gold-button" onClick={(event) => {
                setLearningPlanOpen(false);
                if (nextKnowledgeCategory) openLearningCategory(nextKnowledgeCategory.id, event.currentTarget);
                else if (!wuduFinished) setWuduOpen(true);
                else setPrayerLesson(nextPrayer.id);
              }}>Jetzt weiterlernen <ChevronRight size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
