import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDialog } from './useDialog';
import {
  getCategoryLessons,
  getLearningCategory,
} from './islamicLearningContent';
import type {
  LearningCategoryId,
  LearningLesson,
} from './islamicLearningContent';

const categoryIcons: Record<LearningCategoryId, LucideIcon> = {
  aqidah: Sparkles,
  fiqh: Scale,
  tafsir: BookOpen,
  seerah: Landmark,
  hadith: BookHeart,
  akhlaq: HeartHandshake,
};

const completionParticles = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  angle: (index / 14) * 360,
  distance: 68 + (index % 3) * 17,
  delay: (index % 5) * .05,
}));

function readStringSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function writeStringSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

export function readLastLesson(categoryId: LearningCategoryId, lessons: LearningLesson[]) {
  try {
    const candidate = localStorage.getItem(`nur_learning_last_${categoryId}`);
    return lessons.some((lesson) => lesson.id === candidate) ? candidate as string : lessons[0]?.id ?? '';
  } catch {
    return lessons[0]?.id ?? '';
  }
}

function writeLastLesson(categoryId: LearningCategoryId, lessonId: string) {
  try { localStorage.setItem(`nur_learning_last_${categoryId}`, lessonId); } catch { /* optional */ }
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
  const [selectedLessonId, setSelectedLessonId] = useState(() => readLastLesson(categoryId, lessons));
  const [completed, setCompleted] = useState(() => readStringSet('nur_learning_completed'));
  const [checkedPoints, setCheckedPoints] = useState(() => readStringSet(`nur_learning_points_${readLastLesson(categoryId, lessons)}`));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const closeDialog = useCallback(() => { setCompletionOpen(false); }, []);
  const screenDialog = useDialog(completionOpen, closeDialog, 'Kurs abgeschlossen');

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const CategoryIcon = categoryIcons[categoryId];
  const categoryCompleted = lessons.filter((lesson) => completed.has(lesson.id)).length;
  const categoryProgress = lessons.length ? Math.round((categoryCompleted / lessons.length) * 100) : 0;
  const lessonIndex = Math.max(0, lessons.findIndex((lesson) => lesson.id === selectedLesson?.id));
  const answerCorrect = selectedAnswer === selectedLesson?.question.correctIndex;

  useEffect(() => writeStringSet('nur_learning_completed', completed), [completed]);
  useEffect(() => {
    if (!selectedLesson) return;
    writeLastLesson(categoryId, selectedLesson.id);
    writeStringSet(`nur_learning_points_${selectedLesson.id}`, checkedPoints);
  }, [categoryId, checkedPoints, selectedLesson]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const selectLesson = (lesson: LearningLesson) => {
    setSelectedLessonId(lesson.id);
    setCheckedPoints(readStringSet(`nur_learning_points_${lesson.id}`));
    setSelectedAnswer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePoint = (index: number) => {
    if (!selectedLesson) return;
    const key = `${selectedLesson.id}:${index}`;
    setCheckedPoints((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const answerQuestion = (index: number) => {
    if (!selectedLesson) return;
    setSelectedAnswer(index);
    if (index !== selectedLesson.question.correctIndex) {
      navigator.vibrate?.(35);
      return;
    }

    setCompleted((current) => new Set(current).add(selectedLesson.id));
    setCompletionOpen(true);
    navigator.vibrate?.([45, 30, 70]);
  };

  const resetLesson = () => {
    if (!selectedLesson) return;
    setSelectedAnswer(null);
    setCheckedPoints(new Set());
    setCompleted((current) => {
      const next = new Set(current);
      next.delete(selectedLesson.id);
      return next;
    });
    try { localStorage.removeItem(`nur_learning_points_${selectedLesson.id}`); } catch { /* optional */ }
    flash('Lektionsfortschritt zurückgesetzt');
  };

  const openNextLesson = () => {
    const nextLesson = lessons[lessonIndex + 1];
    setCompletionOpen(false);
    if (nextLesson) selectLesson(nextLesson);
  };

  const shareLesson = async () => {
    if (!selectedLesson) return;
    const sourceList = selectedLesson.sources.map((source) => source.reference).join(' · ');
    const text = `${selectedLesson.title}\n${selectedLesson.summary}\nQuellen: ${sourceList}`;
    try {
      if (navigator.share) await navigator.share({ title: `Nur Islam · ${selectedLesson.title}`, text });
      else {
        await navigator.clipboard.writeText(text);
        flash('Lektionsübersicht kopiert');
      }
    } catch {
      flash('Teilen wurde abgebrochen');
    }
  };

  if (!selectedLesson) {
    return (
      <main className="screen reference-learning-course-screen">
        <button className="gold-button" onClick={onBack}><ChevronLeft size={17} /> Zurück</button>
      </main>
    );
  }

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Islam lernen</span><h1>{category.title}</h1></div>
        <button className="icon-button" onClick={shareLesson} aria-label="Lektion teilen"><Share2 size={19} /></button>
      </header>

      <section className={`reference-learning-course-hero is-${categoryId}`}>
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">{category.subtitle}</span>
          <h2>{category.description}</h2>
          <div className="reference-learning-course-hero__progress">
            <span><i style={{ width: `${categoryProgress}%` }} /></span>
            <strong>{categoryCompleted}/{lessons.length} Lektionen abgeschlossen</strong>
          </div>
        </div>
        <span className="reference-learning-course-hero__icon"><CategoryIcon size={54} /></span>
      </section>

      <section className="reference-learning-lesson-selector" aria-label="Lektionen auswählen">
        {lessons.map((lesson, index) => {
          const isComplete = completed.has(lesson.id);
          return (
            <button key={lesson.id} className={`${selectedLesson.id === lesson.id ? 'is-active' : ''}${isComplete ? ' is-complete' : ''}`} onClick={() => selectLesson(lesson)}>
              <span>{isComplete ? <CircleCheck size={17} /> : index + 1}</span>
              <strong>{lesson.title}</strong>
              <small>{lesson.duration}</small>
            </button>
          );
        })}
      </section>

      <article className="reference-learning-lesson-card">
        <header>
          <span className="overline">{selectedLesson.eyebrow}</span>
          <h2>{selectedLesson.title}</h2>
          <p>{selectedLesson.summary}</p>
          <div><span><BookOpen size={15} /> {selectedLesson.duration}</span><span className={completed.has(selectedLesson.id) ? 'is-complete' : ''}>{completed.has(selectedLesson.id) ? <CircleCheck size={15} /> : <GraduationCap size={15} />}{completed.has(selectedLesson.id) ? 'Abgeschlossen' : 'In Bearbeitung'}</span></div>
        </header>

        <section className="reference-learning-reading">
          {selectedLesson.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </section>
      </article>

      <section className="reference-learning-key-points">
        <div className="section-heading"><div><span className="overline">Merken</span><h2>Kernpunkte</h2></div><ListChecks size={21} /></div>
        <div>
          {selectedLesson.keyPoints.map((point, index) => {
            const key = `${selectedLesson.id}:${index}`;
            const checked = checkedPoints.has(key);
            return <button key={point} className={checked ? 'is-checked' : ''} onClick={() => togglePoint(index)}><span>{checked ? <Check size={16} /> : index + 1}</span><strong>{point}</strong></button>;
          })}
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Nachvollziehbar</span><h2>Quellen & Hinweise</h2></div><ShieldCheck size={21} /></div>
        <div>
          {selectedLesson.sources.map((source) => (
            <article key={`${source.label}-${source.reference}`}>
              <span>{source.label}</span><strong>{source.reference}</strong><p>{source.note}</p>
            </article>
          ))}
        </div>
        <p className="reference-learning-sources__notice">Diese Inhalte sind kompakte Einführungen. Sie ersetzen keine Fatwa, keinen vollständigen Tafsir und keinen persönlichen Unterricht bei komplexen Fragen.</p>
      </section>

      <section className="reference-learning-quiz">
        <div className="reference-learning-quiz__heading"><span><ClipboardCheck size={22} /></span><div><span className="overline">Verständnisfrage</span><h2>{selectedLesson.question.prompt}</h2></div></div>
        <div className="reference-learning-quiz__options">
          {selectedLesson.question.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = selectedAnswer !== null && index === selectedLesson.question.correctIndex;
            const wrong = selected && !correct;
            return <button key={option} className={`${selected ? 'is-selected' : ''}${correct ? ' is-correct' : ''}${wrong ? ' is-wrong' : ''}`} onClick={() => answerQuestion(index)}><span>{correct ? <Check size={16} /> : String.fromCharCode(65 + index)}</span><strong>{option}</strong></button>;
          })}
        </div>
        <AnimatePresence>
          {selectedAnswer !== null ? (
            <motion.div className={answerCorrect ? 'reference-learning-quiz__feedback is-correct' : 'reference-learning-quiz__feedback is-wrong'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {answerCorrect ? <CircleCheck size={18} /> : <Lightbulb size={18} />}<span><strong>{answerCorrect ? 'Richtig' : 'Noch einmal prüfen'}</strong><small>{selectedLesson.question.explanation}</small></span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <div className="reference-learning-course-navigation">
        <button disabled={lessonIndex === 0} onClick={() => selectLesson(lessons[lessonIndex - 1])}><ChevronLeft size={17} /> Vorherige</button>
        {lessonIndex < lessons.length - 1 ? <button className="gold-button" onClick={() => selectLesson(lessons[lessonIndex + 1])}>Nächste Lektion <ChevronRight size={17} /></button> : <button className="gold-button" onClick={onBack}>Zur Übersicht <ChevronRight size={17} /></button>}
      </div>

      {completed.has(selectedLesson.id) ? <button className="reference-learning-reset" onClick={resetLesson}><RotateCcw size={16} /> Lektionsfortschritt zurücksetzen</button> : null}

      <AnimatePresence>
        {completionOpen ? (
          <motion.div className="reference-learning-completion-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCompletionOpen(false)}>
            <motion.section {...screenDialog.props} className="reference-learning-completion-modal" initial={{ opacity: 0, y: 24, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .97 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-learning-completion-modal__close" onClick={() => setCompletionOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <div className="reference-learning-completion-burst" aria-hidden="true">
                {completionParticles.map((particle) => <motion.i key={particle.id} initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, .6], x: Math.cos(particle.angle * Math.PI / 180) * particle.distance, y: Math.sin(particle.angle * Math.PI / 180) * particle.distance }} transition={{ duration: 1.2, delay: particle.delay }} />)}
                <motion.span initial={{ scale: .6 }} animate={{ scale: [1, 1.08, 1] }}><CircleCheck size={43} /></motion.span>
              </div>
              <span className="hero-pill">Lektion abgeschlossen</span><h2>{selectedLesson.title}</h2><p>Du hast die Verständnisfrage richtig beantwortet. Der Fortschritt wurde lokal gespeichert.</p>
              <div className="reference-learning-completion-stats"><span><strong>{categoryCompleted}</strong><small>von {lessons.length} in {category.title}</small></span><span><strong>{categoryProgress}%</strong><small>Kategoriefortschritt</small></span></div>
              <div className="reference-learning-completion-actions"><button onClick={() => setCompletionOpen(false)}>Nochmal lesen</button>{lessons[lessonIndex + 1] ? <button className="gold-button" onClick={openNextLesson}>Weiterlernen <ChevronRight size={17} /></button> : <button className="gold-button" onClick={() => { setCompletionOpen(false); onBack(); }}>Fertig <CircleCheck size={17} /></button>}</div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
