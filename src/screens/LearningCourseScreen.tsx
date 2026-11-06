import { ScreenBackButton } from '../shared/ScreenBackButton';
import { SourceInfo } from '../shared/SourceInfo';
import { ReadingNavigation } from '../shared/ReadingNavigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { resolveAppPath } from '../app/appPaths';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Share2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { readLearningPosition, writeLearningPosition } from '../services/learningProgress';
import {
  getCategoryLessons,
  getLearningCategory,
} from '../data/islamicLearningContent';
import type {
  LearningCategoryId,
  LearningLesson,
} from '../data/islamicLearningContent';

const readingSectionTitles = ['Einfach erklärt', 'Warum das wichtig ist', 'Gut einordnen'];
const COURSE_BANNERS: Record<LearningCategoryId, string> = {
  faith: 'course-banner-faith-v1.webp',
  pillars: 'course-banner-pillars-v1.webp',
  terms: 'course-banner-terms-v1.webp',
  practice: 'course-banner-practice-v1.webp',
  character: 'course-banner-character-v1.webp',
  community: 'course-banner-community-v1.webp',
  prophet: 'course-banner-prophet-v1.webp',
};

export function readLastLesson(categoryId: LearningCategoryId, lessons: LearningLesson[]) {
  return readLearningPosition(categoryId, lessons).lessonId;
}

export function LearningCourseScreen({
  categoryId,
  onBack,
}: {
  categoryId: LearningCategoryId;
  onBack: () => void;
}) {
  const category = useMemo(() => getLearningCategory(categoryId), [categoryId]);
  const lessons = useMemo(() => getCategoryLessons(categoryId), [categoryId]);
  const [resume, setResume] = useState(() => readLearningPosition(categoryId, lessons));
  const selectedLessonId = resume.lessonId;
  const [resumeWarning, setResumeWarning] = useState<string | null>(() => resume.valid ? null : 'Gespeicherte Lektionsposition nicht lesbar oder nicht zuordenbar. Der vorhandene Wert bleibt unverändert.');
  const [courseMapOpen, setCourseMapOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; failed: boolean } | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const lessonIndex = Math.max(0, lessons.findIndex((lesson) => lesson.id === selectedLesson?.id));

  useEffect(() => () => { if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current); }, []);

  const flash = (message: string, failed = false) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast({ message, failed });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 4000);
  };

  const scrollToCourseTop = () => document.querySelector<HTMLElement>('.screen-transition-frame')?.scrollTo(0, 0);

  const selectLesson = (lesson: LearningLesson) => {
    const valid = writeLearningPosition(categoryId, lesson.id);
    setResume({ lessonId: lesson.id, valid });
    setResumeWarning(valid ? null : 'Lektion geöffnet; Speicherung der letzten Lektionsposition für spätere Sitzungen nicht bestätigt.');
    setCourseMapOpen(false);
    scrollToCourseTop();
  };

  useEffect(() => {
    scrollToCourseTop();
  }, [categoryId]);

  const shareLesson = async () => {
    if (!selectedLesson) return;
    const sourceList = selectedLesson.sources.map((source) => `${source.reference}${source.url ? ` (${source.url})` : ''}`).join(' · ');
    const text = `${selectedLesson.title}\n${selectedLesson.summary}\nQuellen: ${sourceList}`;
    try {
      if (navigator.share) await navigator.share({ title: `Awwaba · ${selectedLesson.title}`, text });
      else {
        await navigator.clipboard.writeText(text);
        flash('Lektionsübersicht kopiert');
      }
    } catch (error) {
      flash(error instanceof Error && error.name === 'AbortError' ? 'Teilen wurde abgebrochen' : 'Lektionsübersicht konnte nicht geteilt oder kopiert werden', true);
    }
  };

  if (!selectedLesson) {
    return (
      <main className="screen reference-learning-course-screen">
        <button className="gold-button" onClick={onBack}><ChevronLeft size={17} /> Zurück</button>
      </main>
    );
  }

  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen learning-course-v2" data-course-category={categoryId} style={{ '--screen-banner-art': `url("${resolveAppPath(`/premium-assets/high-res-objects/${COURSE_BANNERS[categoryId]}`)}")` } as CSSProperties} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header reference-screen-header--banner">
        <ScreenBackButton onClick={onBack} label="Zurück zu Lernen" />
        <div><span className="overline">Islam verstehen</span><h1>{category.title}</h1></div>
        <button className="icon-button" onClick={shareLesson} aria-label="Lektion teilen"><Share2 size={19} /></button>
      </header>

      {resumeWarning ? <p className="learning-course-v2__sources-notice" role="status">{resumeWarning}</p> : null}

      <section className="learning-course-v2__path" aria-label="Lektionsauswahl">
        <button className="learning-course-v2__plan-toggle" onClick={() => setCourseMapOpen((open) => !open)} aria-expanded={courseMapOpen}>
          <span><strong>Lektion auswählen</strong><small>{lessonIndex + 1} von {lessons.length}</small></span>
          <ChevronDown className={courseMapOpen ? 'is-open' : ''} size={19} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {courseMapOpen ? (
            <motion.ol className="learning-course-v2__lessons" aria-label="Lektionen auswählen" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={microTransition}>
              {lessons.map((lesson, index) => {
                const isActive = selectedLesson.id === lesson.id;
                return (
                  <li key={lesson.id}>
                    <button className={isActive ? 'is-active' : ''} onClick={() => selectLesson(lesson)} aria-current={isActive ? 'step' : undefined}>
                      <span>{index + 1}</span>
                      <span><strong>{lesson.title}</strong><small>{lesson.duration}</small></span>
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </motion.ol>
          ) : null}
        </AnimatePresence>
      </section>

      <article className="learning-course-v2__lesson">
        <header>
          <span className="overline">Lektion {lessonIndex + 1} · {selectedLesson.duration}</span>
          <h2>{selectedLesson.title}</h2>
          <p>{selectedLesson.summary}</p>
        </header>

        <section className="learning-course-v2__reading" aria-label="Lektionsinhalt">
          {selectedLesson.paragraphs.map((paragraph, index) => (
            <section className="learning-course-v2__reading-section" key={paragraph}>
              <div>
                <h3>{selectedLesson.sectionTitles?.[index] ?? readingSectionTitles[index] ?? `Abschnitt ${index + 1}`}</h3>
                <p>{paragraph}</p>
              </div>
            </section>
          ))}
        </section>

        {selectedLesson.detailItems?.length ? (
          <details className="learning-course-v2__details" key={selectedLesson.id}>
            <summary><h3>Auf einen Blick</h3><ChevronDown size={18} aria-hidden="true" /></summary>
            <div>
              {selectedLesson.detailItems.map((item) => <article key={item.title}><strong>{item.title}</strong><p lang={item.lang} dir={item.lang === 'ar' ? 'rtl' : undefined}>{item.text}</p></article>)}
            </div>
          </details>
        ) : null}
      </article>

      <section className="learning-course-v2__takeaways">
        <div className="section-heading"><h2>Das Wichtigste</h2></div>
        <ul>{selectedLesson.keyPoints.map((point) => <li key={point}><Check size={16} /><strong>{point}</strong></li>)}</ul>
      </section>

      <div className="learning-course-v2__source-row"><span>Quellen und Einordnung</span><SourceInfo title="Quellen und wichtige Einordnung"><section className="learning-course-v2__sources">
        <div>
          {selectedLesson.sources.map((source) => (
            <article key={`${source.label}-${source.reference}`}>
              <span>{source.label}</span><strong>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{source.reference}</a> : source.reference}</strong><p>{source.note}</p>
            </article>
          ))}
        </div>
        <p className="learning-course-v2__sources-notice">Diese Inhalte sind kompakte Einführungen. Sie ersetzen keine Fatwa, keinen vollständigen Tafsir und keinen persönlichen Unterricht bei komplexen Fragen.</p>
      </section></SourceInfo></div>

      <ReadingNavigation previousDisabled={lessonIndex === 0} onPrevious={() => selectLesson(lessons[lessonIndex - 1])} onNext={() => lessonIndex < lessons.length - 1 ? selectLesson(lessons[lessonIndex + 1]) : onBack()} nextLabel={lessonIndex < lessons.length - 1 ? 'Nächste Lektion' : 'Zur Übersicht'} />

      <AnimatePresence>{toast ? <motion.div className="toast" role="status" initial={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, x: '-50%', y: 0 }} exit={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 6 }} transition={microTransition}>{toast.failed ? <X size={18} /> : <CircleCheck size={18} />} {toast.message}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
