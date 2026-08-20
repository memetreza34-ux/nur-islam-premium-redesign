import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PremiumImage, QiblaObject } from '../shared/PremiumVisuals';
import { PRAYER_PRACTICE_TIPS, PRAYER_RAKATS_BY_ID } from '../data/prayerRakatData';
import type { PrayerPosture } from '../data/prayerRakatData';

export type PrayerLessonId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/**
 * The posture is written out rather than drawn as an icon. Seven line glyphs
 * for standing, bowing and prostrating are not distinguishable at 19px, and
 * the word is what someone learning the prayer actually needs.
 */
const POSTURE_LABEL: Record<PrayerPosture, string> = {
  takbir: 'Stehend, Hände erhoben',
  qiyam: 'Stehend',
  ruku: 'Verbeugung',
  standing: 'Aufgerichtet',
  sujud: 'Niederwerfung',
  sitting: 'Sitzend',
  taslim: 'Sitzend, Kopf zur Seite',
};

type PrayerLesson = {
  id: PrayerLessonId;
  label: string;
  arabic: string;
  rakahs: number;
  timeLabel: string;
  note: string;
};

export const PRAYER_LESSONS: PrayerLesson[] = [
  { id: 'fajr', label: 'Fajr', arabic: 'الفجر', rakahs: 2, timeLabel: 'Morgengebet', note: 'Zwei Pflicht-Rakʿah' },
  { id: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', rakahs: 4, timeLabel: 'Mittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'asr', label: 'Asr', arabic: 'العصر', rakahs: 4, timeLabel: 'Nachmittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'maghrib', label: 'Maghrib', arabic: 'المغرب', rakahs: 3, timeLabel: 'Abendgebet', note: 'Drei Pflicht-Rakʿah' },
  { id: 'isha', label: 'Isha', arabic: 'العشاء', rakahs: 4, timeLabel: 'Nachtgebet', note: 'Vier Pflicht-Rakʿah' },
];

const preparationItems = [
  'Gebetszeit prüfen',
  'Wudu und Reinheit prüfen',
  'Qibla bestimmen',
  'Ruhigen Gebetsplatz wählen',
] as const;

function readStringSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

export function readNumber(key: string, fallback: number) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw.trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeStringSet(key: string, value: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

export function PrayerLearningScreen({
  initialPrayer = 'fajr',
  onBack,
  onOpenQibla,
  onOpenPrayerTimes,
}: {
  initialPrayer?: PrayerLessonId;
  onBack: () => void;
  onOpenQibla: () => void;
  onOpenPrayerTimes: () => void;
}) {
  const [selectedPrayerId, setSelectedPrayerId] = useState<PrayerLessonId>(initialPrayer);
  const [activeStep, setActiveStep] = useState(() => Math.max(0, readNumber(`nur_prayer_lesson_${initialPrayer}_step`, 0)));
  const [practiceRakah, setPracticeRakah] = useState(() => Math.max(1, readNumber(`nur_prayer_lesson_${initialPrayer}_rakah`, 1)));
  const [preparation, setPreparation] = useState(() => readStringSet('nur_prayer_learning_preparation'));
  const [completedLessons, setCompletedLessons] = useState(() => readStringSet('nur_prayer_learning_complete'));
  const [completionOpen, setCompletionOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const selectedPrayer = useMemo(
    () => PRAYER_LESSONS.find((prayer) => prayer.id === selectedPrayerId) ?? PRAYER_LESSONS[0],
    [selectedPrayerId],
  );

  const rakats = PRAYER_RAKATS_BY_ID.get(selectedPrayerId)?.rakats ?? [];
  const currentRakat = rakats[Math.min(practiceRakah, rakats.length) - 1] ?? rakats[0];
  const steps = currentRakat?.steps ?? [];
  const stepIndex = Math.max(0, Math.min(steps.length - 1, activeStep));
  const currentStep = steps[stepIndex];
  const isLastRakat = practiceRakah >= rakats.length;
  const atLastStep = stepIndex === steps.length - 1;

  const lessonComplete = completedLessons.has(selectedPrayerId);
  const courseProgress = Math.round((completedLessons.size / PRAYER_LESSONS.length) * 100);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    try {
      localStorage.setItem(`nur_prayer_lesson_${selectedPrayerId}_step`, String(activeStep));
      localStorage.setItem(`nur_prayer_lesson_${selectedPrayerId}_rakah`, String(practiceRakah));
    } catch {
      // Local persistence remains optional.
    }
  }, [activeStep, practiceRakah, selectedPrayerId]);

  useEffect(() => writeStringSet('nur_prayer_learning_preparation', preparation), [preparation]);
  useEffect(() => writeStringSet('nur_prayer_learning_complete', completedLessons), [completedLessons]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const selectPrayer = (id: PrayerLessonId) => {
    const prayer = PRAYER_LESSONS.find((item) => item.id === id) ?? PRAYER_LESSONS[0];
    setSelectedPrayerId(id);
    setActiveStep(Math.max(0, readNumber(`nur_prayer_lesson_${id}_step`, 0)));
    setPracticeRakah(Math.max(1, Math.min(prayer.rakahs, readNumber(`nur_prayer_lesson_${id}_rakah`, 1))));
  };

  const selectRakah = (value: number) => {
    setPracticeRakah(value);
    setActiveStep(0);
  };

  const togglePreparation = (item: string) => {
    setPreparation((current) => {
      const next = new Set(current);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  };

  const completeLesson = () => {
    setCompletedLessons((current) => new Set(current).add(selectedPrayerId));
    setCompletionOpen(true);
    navigator.vibrate?.([45, 35, 70]);
  };

  const goToNextStep = () => {
    if (!atLastStep) { setActiveStep(stepIndex + 1); return; }
    if (!isLastRakat) { selectRakah(practiceRakah + 1); return; }
    completeLesson();
  };

  const goToPreviousStep = () => {
    if (stepIndex > 0) { setActiveStep(stepIndex - 1); return; }
    if (practiceRakah > 1) {
      const previous = rakats[practiceRakah - 2];
      setPracticeRakah(practiceRakah - 1);
      setActiveStep(Math.max(0, (previous?.steps.length ?? 1) - 1));
    }
  };

  const restartLesson = () => {
    setActiveStep(0);
    setPracticeRakah(1);
    setCompletedLessons((current) => {
      const next = new Set(current);
      next.delete(selectedPrayerId);
      return next;
    });
    flash(`${selectedPrayer.label}-Lektion neu gestartet`);
  };

  return (
    <motion.main className="screen reference-prayer-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Beten lernen</span><h1>Gebetskurs</h1></div>
        <button className="icon-button" onClick={onOpenQibla} aria-label="Qibla öffnen"><Compass size={20} /></button>
      </header>

      <section className="reference-prayer-course-hero">
        <div className="reference-prayer-course-hero__copy">
          <span className="hero-pill">Schritt für Schritt</span>
          <h2>Lerne jedes Pflichtgebet in Ruhe.</h2>
          <p>Wähle ein Gebet, übe den Ablauf und sieh bei den gesprochenen Kernschritten die verwendete Quran-/Hadith-Referenz direkt mit.</p>
          <div className="reference-prayer-course-hero__progress"><span><i style={{ width: `${courseProgress}%` }} /></span><strong>{completedLessons.size}/5 Gebete gelernt</strong></div>
        </div>
        <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch-v2.webp" fallback={<QiblaObject />} />
      </section>

      <section className="reference-prayer-course-selector" aria-label="Gebet auswählen">
        {PRAYER_LESSONS.map((prayer) => {
          const complete = completedLessons.has(prayer.id);
          return (
            <button key={prayer.id} className={selectedPrayerId === prayer.id ? 'is-active' : ''} onClick={() => selectPrayer(prayer.id)}>
              <span>{complete ? <CircleCheck size={17} /> : prayer.rakahs}</span>
              <strong>{prayer.label}</strong>
              <small>{prayer.arabic}</small>
            </button>
          );
        })}
      </section>

      <section className="reference-prayer-lesson-summary">
        <div><span className="overline">{selectedPrayer.timeLabel}</span><h2>{selectedPrayer.label}</h2><p>{selectedPrayer.note}. Sunnah-Gebete und Detailfragen werden getrennt behandelt.</p></div>
        <span className={lessonComplete ? 'is-complete' : ''}>{lessonComplete ? <CircleCheck size={22} /> : <strong>{selectedPrayer.rakahs}</strong>}<small>Rakʿah</small></span>
      </section>

      <section className="reference-rakah-practice">
        <div><span className="overline">Übungsmodus</span><h2>Rakʿah {practiceRakah} von {selectedPrayer.rakahs}</h2><p>Gehe die Positionen bewusst durch. Es läuft kein Zeitdruck.</p></div>
        <div className="reference-rakah-dots">{Array.from({ length: selectedPrayer.rakahs }, (_, index) => <button key={index} className={practiceRakah === index + 1 ? 'is-active' : practiceRakah > index + 1 ? 'is-complete' : ''} onClick={() => selectRakah(index + 1)} aria-label={`Rakʿah ${index + 1}`}>{practiceRakah > index + 1 ? <Check size={13} /> : index + 1}</button>)}</div>
        <div className="reference-rakah-actions"><button disabled={practiceRakah === 1} onClick={() => selectRakah(Math.max(1, practiceRakah - 1))}><ChevronLeft size={16} /> Vorherige</button><button disabled={practiceRakah === selectedPrayer.rakahs} onClick={() => selectRakah(Math.min(selectedPrayer.rakahs, practiceRakah + 1))}>Nächste Rakʿah <ChevronRight size={16} /></button></div>
      </section>

      {currentStep ? (
        <section className="reference-rakah-step-detail">
          <div className="section-heading">
            <div><span className="overline">{currentRakat?.title} · Schritt {stepIndex + 1} von {steps.length}</span><h2>{currentStep.title}</h2></div>
            <span className="reference-rakah-posture">{POSTURE_LABEL[currentStep.posture]}</span>
          </div>
          <div className="reference-prayer-lesson-progress"><span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
          <p className="reference-rakah-step-detail__description">{currentStep.description}</p>
          {currentStep.arabic ? (
            <div className="reference-rakah-wording">
              <p className="reference-rakah-wording__arabic" lang="ar" dir="rtl">{currentStep.arabic}</p>
              <p className="reference-rakah-wording__transliteration">{currentStep.transliteration}</p>
              <p className="reference-rakah-wording__translation">{currentStep.translation}</p>
              {currentStep.source ? <p className="reference-rakah-wording__source"><ShieldCheck size={14} /> {currentStep.source}</p> : null}
            </div>
          ) : null}
          <div className="reference-prayer-course-navigation">
            <button disabled={stepIndex === 0 && practiceRakah === 1} onClick={goToPreviousStep}><ChevronLeft size={17} /> Zurück</button>
            <button className="gold-button" onClick={goToNextStep}>
              {atLastStep && isLastRakat
                ? <>{lessonComplete ? <CircleCheck size={17} /> : <Sparkles size={17} />}{lessonComplete ? 'Erneut abschließen' : 'Gebet abschließen'}</>
                : <>{atLastStep ? 'Nächste Rakʿah' : 'Nächster Schritt'} <ChevronRight size={17} /></>}
            </button>
          </div>
        </section>
      ) : null}

      <section className="reference-prayer-lesson-steps">
        <div className="section-heading"><div><span className="overline">Ablauf</span><h2>{currentRakat?.title}</h2></div><span>{steps.length} Schritte</span></div>
        <div>
          {steps.map((step, index) => {
            const active = stepIndex === index;
            const complete = index < stepIndex;
            return (
              <button key={`${step.id}-${index}`} className={`${active ? 'is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => setActiveStep(index)}>
                <span>{complete ? <CircleCheck size={19} /> : <strong>{index + 1}</strong>}</span>
                <span><small>{POSTURE_LABEL[step.posture]}</small><strong>{step.title}</strong><em>{step.transliteration ?? step.description}</em></span>
                <ChevronRight size={17} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="reference-prayer-tips">
        <div className="section-heading"><div><span className="overline">Worauf es ankommt</span><h2>Hinweise</h2></div></div>
        <ul>{PRAYER_PRACTICE_TIPS.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </section>

      <section className="reference-prayer-preparation">
        <div className="section-heading"><div><span className="overline">Vor dem Gebet</span><h2>Vorbereitung</h2></div><button className="text-button" onClick={onOpenPrayerTimes}><TimerReset size={15} /> Zeiten</button></div>
        <div>
          {preparationItems.map((item) => {
            const checked = preparation.has(item);
            return <button key={item} className={checked ? 'is-checked' : ''} onClick={() => togglePreparation(item)}><span>{checked ? <Check size={16} /> : null}</span>{item}</button>;
          })}
        </div>
        <button className="reference-qibla-shortcut" onClick={onOpenQibla}><MapPin size={17} /><span><strong>Qibla prüfen</strong><small>Richtung zur Kaaba mit Standort und Gerätesensor</small></span><ChevronRight size={17} /></button>
      </section>

      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Verständlicher Grundlagenkurs</strong><small>Der Ablauf zeigt eine verbreitete sunnitische Lernfolge. Handhaltungen, Formulierungsvarianten und einzelne Fiqh-Details können sich je nach Rechtsschule unterscheiden. Quellen pro Kernschritt ersetzen den fachlichen Endreview nicht.</small></span></section>

      {lessonComplete ? <button className="reference-prayer-course-restart" onClick={restartLesson}><RotateCcw size={16} /> Lektion neu beginnen</button> : null}

      <AnimatePresence>
        {completionOpen ? (
          <motion.div className="reference-prayer-course-complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={microTransition} onClick={() => setCompletionOpen(false)}>
            <motion.section initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .99 }} transition={screenTransition} onClick={(event) => event.stopPropagation()}>
              <span><CircleCheck size={32} /></span><small>Lektion abgeschlossen</small><h2>{selectedPrayer.label} gelernt</h2><p>Du hast den Grundlagenablauf vollständig durchgearbeitet. Wiederhole ihn regelmäßig und lass deine praktische Ausführung von einer vertrauenswürdigen Lehrperson prüfen.</p><button className="gold-button" onClick={() => setCompletionOpen(false)}>Weiterlernen <ChevronRight size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
