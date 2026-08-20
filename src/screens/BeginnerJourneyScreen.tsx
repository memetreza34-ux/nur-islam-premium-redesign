import { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Droplets,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { BEGINNER_LESSONS, getNextBeginnerLesson } from '../data/beginnerLearningContent';
import type { BeginnerLearningLesson } from '../data/beginnerLearningContent';
import { BeginnerReferenceScreen } from './BeginnerReferenceScreen';
import { PurityBasicsScreen } from './PurityBasicsScreen';

function readCompleted() {
  try {
    const raw = localStorage.getItem('nur_beginner_learning_completed');
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function writeCompleted(value: Set<string>) {
  try { localStorage.setItem('nur_beginner_learning_completed', JSON.stringify([...value])); } catch { /* optional */ }
}

function readLastLesson() {
  try {
    const stored = localStorage.getItem('nur_beginner_learning_last');
    return BEGINNER_LESSONS.some((lesson) => lesson.id === stored) ? stored as string : BEGINNER_LESSONS[0].id;
  } catch {
    return BEGINNER_LESSONS[0].id;
  }
}

export function BeginnerJourneyScreen({ onBack }: { onBack: () => void }) {
  const [completed, setCompleted] = useState(readCompleted);
  const [selectedLessonId, setSelectedLessonId] = useState(readLastLesson);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [purityOpen, setPurityOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const selectedLesson = useMemo(
    () => BEGINNER_LESSONS.find((lesson) => lesson.id === selectedLessonId) ?? BEGINNER_LESSONS[0],
    [selectedLessonId],
  );
  const lessonIndex = BEGINNER_LESSONS.findIndex((lesson) => lesson.id === selectedLesson.id);
  const progress = Math.round((completed.size / BEGINNER_LESSONS.length) * 100);

  const selectLesson = (lesson: BeginnerLearningLesson) => {
    setSelectedLessonId(lesson.id);
    try { localStorage.setItem('nur_beginner_learning_last', lesson.id); } catch { /* optional */ }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const markComplete = () => {
    const next = new Set(completed).add(selectedLesson.id);
    setCompleted(next);
    writeCompleted(next);
    navigator.vibrate?.([35, 25, 55]);
  };

  const continueJourney = () => {
    const next = getNextBeginnerLesson(completed);
    selectLesson(next);
  };

  if (referenceOpen) return <BeginnerReferenceScreen onBack={() => setReferenceOpen(false)} />;
  if (purityOpen) return <PurityBasicsScreen onBack={() => setPurityOpen(false)} />;

  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Islam lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Geführter Einstieg</span><h1>Neu im Islam</h1></div>
        <button className="icon-button" onClick={() => setReferenceOpen(true)} aria-label="Anfängerfragen und Begriffe öffnen"><CircleHelp size={20} /></button>
      </header>

      <section className="reference-learning-course-hero is-aqidah">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">Ohne Vorwissen starten</span>
          <h2>Die wichtigsten Grundlagen in einer festen Reihenfolge.</h2>
          <p>Beginne bei Islam und Shahada, lerne Quran, Glaubensgrundlagen, Reinheit und Gebet kennen und gehe danach in die vertieften Kurse.</p>
          <div className="reference-learning-course-hero__progress">
            <span><i style={{ width: `${progress}%` }} /></span>
            <strong>{completed.size}/{BEGINNER_LESSONS.length} Grundlagen abgeschlossen</strong>
          </div>
        </div>
        <span className="reference-learning-course-hero__icon"><GraduationCap size={54} /></span>
      </section>

      <section className="reference-prayer-learning-actions">
        <button onClick={() => setReferenceOpen(true)}><span><CircleHelp size={22} /></span><span><strong>Fragen & Begriffe</strong><small>Anfänger-FAQ und Islam A–Z</small></span><ChevronRight size={17} /></button>
        <button onClick={() => setPurityOpen(true)}><span><Droplets size={22} /></span><span><strong>Ghusl & Tayammum</strong><small>Reinheit einfach unterscheiden</small></span><ChevronRight size={17} /></button>
      </section>

      <section className="reference-learning-lesson-selector" aria-label="Grundlagen auswählen">
        {BEGINNER_LESSONS.map((lesson, index) => {
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
          <div>
            <span><BookOpen size={15} /> {selectedLesson.duration}</span>
            <span className={completed.has(selectedLesson.id) ? 'is-complete' : ''}>{completed.has(selectedLesson.id) ? <CircleCheck size={15} /> : <GraduationCap size={15} />}{completed.has(selectedLesson.id) ? 'Abgeschlossen' : 'In Bearbeitung'}</span>
          </div>
        </header>

        <section className="reference-learning-reading">
          {selectedLesson.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      </article>

      <section className="reference-learning-key-points">
        <div className="section-heading"><div><span className="overline">Merken</span><h2>Kernpunkte</h2></div><Check size={21} /></div>
        <div>
          {selectedLesson.keyPoints.map((point, index) => <button key={point} type="button"><span>{index + 1}</span><strong>{point}</strong></button>)}
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Nachvollziehbar</span><h2>Quellen & Prüfung</h2></div><ShieldCheck size={21} /></div>
        <div>
          {selectedLesson.sources.map((source) => (
            <article key={`${source.label}-${source.reference}`}>
              <span>{source.label}</span><strong>{source.reference}</strong><p>{source.note}</p>
            </article>
          ))}
        </div>
        <p className="reference-learning-sources__notice">Redaktionsstatus: fachlicher Endreview vor öffentlichem Release erforderlich. Diese Einführung ersetzt keine individuelle Fatwa oder persönliche Beratung bei Sonderfällen.</p>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Begriffe</span><h2>Einfach erklärt</h2></div><BookOpen size={21} /></div>
        <div>
          {selectedLesson.glossary.map((item) => <article key={item.term}><span>Begriff</span><strong>{item.term}</strong><p>{item.meaning}</p></article>)}
        </div>
      </section>

      <div className="reference-learning-course-navigation">
        <button disabled={lessonIndex === 0} onClick={() => selectLesson(BEGINNER_LESSONS[lessonIndex - 1])}><ChevronLeft size={17} /> Vorherige</button>
        {!completed.has(selectedLesson.id) ? (
          <button className="gold-button" onClick={markComplete}><CircleCheck size={17} /> Als verstanden markieren</button>
        ) : lessonIndex < BEGINNER_LESSONS.length - 1 ? (
          <button className="gold-button" onClick={() => selectLesson(BEGINNER_LESSONS[lessonIndex + 1])}>Nächste Grundlage <ChevronRight size={17} /></button>
        ) : (
          <button className="gold-button" onClick={onBack}>Vertiefung öffnen <ChevronRight size={17} /></button>
        )}
      </div>

      {completed.size > 0 && completed.size < BEGINNER_LESSONS.length ? <button className="reference-learning-reset" onClick={continueJourney}>Zum nächsten offenen Thema <ChevronRight size={16} /></button> : null}
    </motion.main>
  );
}
