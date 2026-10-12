import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Route,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { readLearningProgress, readLearningPosition, updateLearningCompletion, writeLearningPosition } from '../services/learningProgress';
import {
  getCategoryLessons,
  getLearningCategory,
} from '../data/islamicLearningContent';
import type {
  LearningCategoryId,
  LearningLesson,
} from '../data/islamicLearningContent';

const readingSectionTitles = ['Einfach erklärt', 'Warum das wichtig ist', 'Gut einordnen'];

const completionParticles = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  angle: (index / 10) * 360,
  distance: 54 + (index % 3) * 14,
  delay: (index % 5) * .04,
}));

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
  const [progress, setProgress] = useState(readLearningProgress);
  const completed = progress.completed;
  const [progressWarning, setProgressWarning] = useState<string | null>(() => progress.valid ? null : 'Vorhandener Lernfortschritt nicht lesbar. Die gespeicherten Daten bleiben unverändert.');
  const [resumeWarning, setResumeWarning] = useState<string | null>(() => resume.valid ? null : 'Gespeicherte Lektionsposition nicht lesbar oder nicht zuordenbar. Der vorhandene Wert bleibt unverändert.');
  const [completionSaved, setCompletionSaved] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [courseMapOpen, setCourseMapOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; failed: boolean } | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const closeDialog = useCallback(() => { setCompletionOpen(false); }, []);
  const screenDialog = useDialog(completionOpen, closeDialog, 'Verständnisfrage beantwortet');

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const categoryCompleted = lessons.filter((lesson) => completed.has(lesson.id)).length;
  const categoryProgress = lessons.length ? Math.round((categoryCompleted / lessons.length) * 100) : 0;
  const lessonIndex = Math.max(0, lessons.findIndex((lesson) => lesson.id === selectedLesson?.id));
  const answerCorrect = selectedAnswer === selectedLesson?.question.correctIndex;

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
    setSelectedAnswer(null);
    setCompletionOpen(false);
    setCompletionSaved(false);
    setCourseMapOpen(false);
    scrollToCourseTop();
  };

  useEffect(() => {
    scrollToCourseTop();
  }, [categoryId]);

  const answerQuestion = (index: number) => {
    if (!selectedLesson) return;
    setSelectedAnswer(index);
    if (index !== selectedLesson.question.correctIndex) {
      navigator.vibrate?.(35);
      return;
    }

    const result = updateLearningCompletion(selectedLesson.id, true);
    setCompletionSaved(Boolean(result));
    if (result) setProgress(result);
    setProgressWarning(result ? null : 'Speicherung nicht bestätigt. Vorhandene Daten wurden nicht absichtlich ersetzt; ein Schreibversuch kann ohne überprüfbares Rücklesen erfolgreich gewesen sein.');
    setCompletionOpen(true);
    navigator.vibrate?.([45, 30, 70]);
  };

  const resetLesson = () => {
    if (!selectedLesson) return;
    setSelectedAnswer(null);
    const result = updateLearningCompletion(selectedLesson.id, false);
    if (result) setProgress(result);
    setProgressWarning(result ? null : 'Zurücksetzen des Lernfortschritts nicht gespeichert oder nicht überprüfbar.');
    flash(result ? 'Lektionsfortschritt zurückgesetzt' : 'Zurücksetzen nicht bestätigt', !result);
  };

  const openNextLesson = () => {
    const nextLesson = lessons[lessonIndex + 1];
    setCompletionOpen(false);
    if (nextLesson) selectLesson(nextLesson);
  };

  const shareLesson = async () => {
    if (!selectedLesson) return;
    const sourceList = selectedLesson.sources.map((source) => `${source.reference}${source.url ? ` (${source.url})` : ''}`).join(' · ');
    const text = `${selectedLesson.title}\n${selectedLesson.summary}\nQuellen: ${sourceList}`;
    try {
      if (navigator.share) await navigator.share({ title: `Nur Islam · ${selectedLesson.title}`, text });
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
    <motion.main className="screen reference-learning-course-screen learning-course-v2" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Islam verstehen</span><h1>{category.title}</h1></div>
        <button className="icon-button" onClick={shareLesson} aria-label="Lektion teilen"><Share2 size={19} /></button>
      </header>

      {progressWarning || resumeWarning ? <p className="learning-course-v2__sources-notice" role="status">{[progressWarning, resumeWarning].filter(Boolean).join(' ')}</p> : null}

      <section className={`learning-course-v2__intro is-${categoryId}`} aria-labelledby="learning-course-title">
        <div className="learning-course-v2__intro-copy">
          <span className="overline">Kursziel</span>
          <h2 id="learning-course-title">Was du in diesem Kurs lernst</h2>
          <p>{category.description}</p>
          <div className="learning-course-v2__progress">
            <span><i style={{ width: `${categoryProgress}%` }} /></span>
            <strong>Jetzt: Lektion {lessonIndex + 1} von {lessons.length} · {selectedLesson.title}</strong>
          </div>
        </div>
      </section>

      <section className="learning-course-v2__path" aria-label="Kursplan">
        <button className="learning-course-v2__plan-toggle" onClick={() => setCourseMapOpen((open) => !open)} aria-expanded={courseMapOpen}>
          <span className="learning-course-v2__plan-icon"><Route size={20} /></span>
          <span><strong>Kursplan</strong><small>{progress.valid ? `${categoryCompleted} von ${lessons.length} abgeschlossen · der Reihe nach lernen` : 'Gespeicherter Fortschritt nicht lesbar · der Reihe nach lernen'}</small></span>
          <ChevronDown className={courseMapOpen ? 'is-open' : ''} size={19} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {courseMapOpen ? (
            <motion.ol className="learning-course-v2__lessons" aria-label="Lektionen auswählen" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={microTransition}>
              {lessons.map((lesson, index) => {
                const isComplete = completed.has(lesson.id);
                const isActive = selectedLesson.id === lesson.id;
                return (
                  <li key={lesson.id}>
                    <button className={`${isActive ? 'is-active' : ''}${isComplete ? ' is-complete' : ''}`} onClick={() => selectLesson(lesson)} aria-current={isActive ? 'step' : undefined}>
                      <span>{isComplete ? <CircleCheck size={17} /> : index + 1}</span>
                      <span><strong>{lesson.title}</strong><small>{lesson.duration} · {isComplete ? 'Abgeschlossen' : isActive ? 'Du bist hier' : 'Danach'}</small></span>
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
          <span className="overline">Jetzt lernen · {selectedLesson.eyebrow}</span>
          <h2>{selectedLesson.title}</h2>
          <p><strong>Ziel:</strong> {selectedLesson.summary}</p>
          <div><span><BookOpen size={15} /> {selectedLesson.duration}</span><span className={completed.has(selectedLesson.id) ? 'is-complete' : ''}>{completed.has(selectedLesson.id) ? <CircleCheck size={15} /> : <GraduationCap size={15} />}{/* „In Bearbeitung“ stand hier und wurde als Zustand der App gelesen —
              als sei die Lektion noch nicht fertig geschrieben. Gemeint ist der
              Fortschritt des Lesenden, und der heißt schlicht: noch nicht
              gelesen. */}
            {progress.valid ? completed.has(selectedLesson.id) ? 'Abgeschlossen' : 'Verständnisfrage offen' : 'Abschlussstatus nicht verfügbar'}</span></div>
        </header>

        <section className="learning-course-v2__reading" aria-label="Lektionsinhalt">
          {selectedLesson.paragraphs.map((paragraph, index) => (
            <section className="learning-course-v2__reading-section" key={paragraph}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{selectedLesson.sectionTitles?.[index] ?? readingSectionTitles[index] ?? `Abschnitt ${index + 1}`}</h3>
                <p>{paragraph}</p>
              </div>
            </section>
          ))}
        </section>

        {selectedLesson.detailItems?.length ? (
          <section className="learning-course-v2__details" aria-labelledby="learning-details-title">
            <span className="overline">Auf einen Blick</span>
            <h3 id="learning-details-title">Das gehört zu diesem Thema</h3>
            <div>
              {selectedLesson.detailItems.map((item) => <article key={item.title}><strong>{item.title}</strong><p lang={item.lang} dir={item.lang === 'ar' ? 'rtl' : undefined}>{item.text}</p></article>)}
            </div>
          </section>
        ) : null}
      </article>

      <section className="learning-course-v2__takeaways">
        <div className="section-heading"><div><span className="overline">Kurz zusammengefasst</span><h2>Das solltest du mitnehmen</h2></div><CircleCheck size={21} /></div>
        <ul>{selectedLesson.keyPoints.map((point) => <li key={point}><Check size={16} /><strong>{point}</strong></li>)}</ul>
      </section>

      <section className="learning-course-v2__quiz">
        <div className="learning-course-v2__quiz-heading"><span><ClipboardCheck size={22} /></span><div><span className="overline">Verständnisfrage</span><h2>{selectedLesson.question.prompt}</h2></div></div>
        <div className="learning-course-v2__quiz-options">
          {selectedLesson.question.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = selectedAnswer !== null && index === selectedLesson.question.correctIndex;
            const wrong = selected && !correct;
            return <button key={option} className={`${selected ? 'is-selected' : ''}${correct ? ' is-correct' : ''}${wrong ? ' is-wrong' : ''}`} onClick={() => answerQuestion(index)}><span>{correct ? <Check size={16} /> : String.fromCharCode(65 + index)}</span><strong>{option}</strong></button>;
          })}
        </div>
        <AnimatePresence>
          {selectedAnswer !== null ? (
            <motion.div className={answerCorrect ? 'learning-course-v2__quiz-feedback is-correct' : 'learning-course-v2__quiz-feedback is-wrong'} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={microTransition}>
              {answerCorrect ? <CircleCheck size={18} /> : <Lightbulb size={18} />}<span><strong>{answerCorrect ? 'Richtig' : 'Noch einmal prüfen'}</strong><small>{selectedLesson.question.explanation}</small></span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <details className="learning-course-v2__sources">
        <summary><span><ShieldCheck size={20} /><strong>Quellen und wichtige Einordnung</strong></span><ChevronDown size={18} /></summary>
        <div>
          {selectedLesson.sources.map((source) => (
            <article key={`${source.label}-${source.reference}`}>
              <span>{source.label}</span><strong>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{source.reference}</a> : source.reference}</strong><p>{source.note}</p>
            </article>
          ))}
        </div>
        <p className="learning-course-v2__sources-notice">Diese Inhalte sind kompakte Einführungen. Sie ersetzen keine Fatwa, keinen vollständigen Tafsir und keinen persönlichen Unterricht bei komplexen Fragen.</p>
      </details>

      <div className="learning-course-v2__navigation">
        <button disabled={lessonIndex === 0} onClick={() => selectLesson(lessons[lessonIndex - 1])}><ChevronLeft size={17} /> Vorherige</button>
        {lessonIndex < lessons.length - 1 ? <button className="gold-button" onClick={() => selectLesson(lessons[lessonIndex + 1])}>Nächste Lektion <ChevronRight size={17} /></button> : <button className="gold-button" onClick={onBack}>Zur Übersicht <ChevronRight size={17} /></button>}
      </div>

      {completed.has(selectedLesson.id) ? <button className="reference-learning-reset" onClick={resetLesson}><RotateCcw size={16} /> Lektionsfortschritt zurücksetzen</button> : null}

      <AnimatePresence>
        {completionOpen ? (
          <motion.div className="reference-learning-completion-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setCompletionOpen(false)}>
            <motion.section {...screenDialog.props} className="reference-learning-completion-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .985 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-learning-completion-modal__close" onClick={() => setCompletionOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <div className="reference-learning-completion-burst" aria-hidden="true">
                {!reduceMotion ? completionParticles.map((particle) => <motion.i key={particle.id} initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, .9, 0], scale: [0, .9, .45], x: Math.cos(particle.angle * Math.PI / 180) * particle.distance, y: Math.sin(particle.angle * Math.PI / 180) * particle.distance }} transition={{ duration: .82, delay: particle.delay, ease: [0.22, 1, 0.36, 1] }} />) : null}
                <motion.span initial={{ scale: reduceMotion ? 1 : .82 }} animate={{ scale: reduceMotion ? 1 : [1, 1.045, 1] }} transition={{ duration: reduceMotion ? 0 : .42 }}><CircleCheck size={43} /></motion.span>
              </div>
              <span className="hero-pill">{completionSaved ? 'Lektion abgeschlossen' : 'Richtig beantwortet'}</span><h2>{selectedLesson.title}</h2><p>Du hast die Verständnisfrage richtig beantwortet. {completionSaved ? 'Der Fortschritt wurde lokal gespeichert.' : 'Speicherung nicht bestätigt. Dein gespeicherter Fortschritt wird hier nicht als erhöht angezeigt.'}</p>
              <div className="reference-learning-completion-stats"><span><strong>{progress.valid ? categoryCompleted : '—'}</strong><small>von {lessons.length} in {category.title}</small></span><span><strong>{progress.valid ? `${categoryProgress}%` : '—'}</strong><small>Kategoriefortschritt</small></span></div>
              <div className="reference-learning-completion-actions"><button onClick={() => setCompletionOpen(false)}>Nochmal lesen</button>{lessons[lessonIndex + 1] ? <button className="gold-button" onClick={openNextLesson}>Weiterlernen <ChevronRight size={17} /></button> : <button className="gold-button" onClick={() => { setCompletionOpen(false); onBack(); }}>Fertig <CircleCheck size={17} /></button>}</div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" role="status" initial={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, x: '-50%', y: 0 }} exit={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 6 }} transition={microTransition}>{toast.failed ? <X size={18} /> : <CircleCheck size={18} />} {toast.message}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
