import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  MapPin,
  RotateCcw,
  Pause,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PremiumImage, QiblaObject } from '../shared/PremiumVisuals';
import { PrayerPostureFigure } from '../shared/PrayerPostureFigure';
import { RecitationButton } from '../shared/RecitationButton';
import {
  PRAYER_PRACTICE_TIPS,
  PRAYER_RAKATS_BY_ID,
  RECITATION_HINT,
  RECITATION_LABEL,
  recitationCredit,
  recitationUrls,
  recitationUrlsForRun,
  stepRunDuration,
} from '../data/prayerRakatData';
import type { PrayerPosture, RakatStep } from '../data/prayerRakatData';
import { MADHHABS, MADHHAB_DIFFERENCES_BY_STEP, MADHHAB_DISCLAIMER } from '../data/madhhabData';
import { PRAYER_LESSONS } from '../data/prayerLessons';
import type { PrayerLessonId } from '../data/prayerLessons';

export type { PrayerLessonId };

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
  rising: 'Aufstehen',
  sujud: 'Niederwerfung',
  sitting: 'Sitzend',
  taslim: 'Sitzend, Kopf zur Seite',
};

/**
 * Wie oft der Wortlaut gesprochen wird. Stand vorher nur mitten im
 * Beschreibungssatz („Sage dreimal“) — in der Schrittliste, aus der man beim
 * Üben abliest, war die Zahl damit gar nicht zu sehen.
 */
function repetitionLabel(step: RakatStep) {
  return `${step.repetitions ?? 1}×`;
}

/**
 * Ein Eintrag je Durchgang. Was dreimal gesprochen wird, steht dreimal da:
 * eine „3×“-Marke über einem einzelnen Absatz sagt zwar die Zahl, aber beim
 * Üben liest man mit und verliert ohne die Wiederholungen den Überblick, beim
 * wievielten Mal man ist. Wo die Durchgänge sich unterscheiden — beim Taslim
 * die Richtung —, trägt jeder seine eigene Beschriftung.
 */
function repetitionRuns(step: RakatStep) {
  const total = step.repetitions ?? 1;
  return Array.from({ length: total }, (_, index) => ({
    key: index,
    label: step.repetitionLabels?.[index] ?? `${index + 1}.`,
  }));
}

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
  /**
   * Der Durchlauf: der Ablauf läuft von selbst weiter, mit Rezitation, wo es
   * eine gibt. Gedacht zum Mitbeten — die Hände bleiben frei, was beim Üben
   * eines Ablaufs, der beide Hände braucht, der eigentliche Punkt ist.
   */
  const [runMode, setRunMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const selectedPrayer = useMemo(
    () => PRAYER_LESSONS.find((prayer) => prayer.id === selectedPrayerId) ?? PRAYER_LESSONS[0],
    [selectedPrayerId],
  );

  // The steps belong to one Rakʿah, not to the prayer as a whole: the first
  // opens with the Takbir, the middle ones drop the second Surah, and only the
  // last carries the Tashahhud and the Salam. Showing one generic list for all
  // of them was the reason this screen could not teach the prayer.
  const rakats = PRAYER_RAKATS_BY_ID.get(selectedPrayerId)?.rakats ?? [];
  const currentRakat = rakats[Math.min(practiceRakah, rakats.length) - 1] ?? rakats[0];
  const steps = currentRakat?.steps ?? [];
  const stepIndex = Math.max(0, Math.min(steps.length - 1, activeStep));
  const currentStep = steps[stepIndex];
  const stepRecitation = currentStep ? (runMode ? recitationUrlsForRun(currentStep) : recitationUrls(currentStep)) : [];
  const stepDifferences = currentStep ? MADHHAB_DIFFERENCES_BY_STEP.get(currentStep.id) ?? [] : [];
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

  /** Moving between Rakʿah restarts the sequence — each one has its own steps. */
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

  /**
   * Der Takt. Wo eine Aufnahme läuft, gibt sie das Ende vor — sie meldet sich
   * über `onFinished`. Wo keine läuft, zählt eine am Wortlaut bemessene Zeit.
   * Beides endet in `goToNextStep`, damit der Durchlauf denselben Weg nimmt
   * wie das Weitertippen und nicht an der Rakʿah-Grenze anders läuft.
   */
  useEffect(() => {
    if (!runMode || !currentStep || completionOpen) return;
    if (stepRecitation.length) return;
    const timer = window.setTimeout(() => goToNextStep(), stepRunDuration(currentStep));
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runMode, currentStep?.id, practiceRakah, stepRecitation.length, completionOpen]);

  /** Ein Wechsel des Gebets hält den Durchlauf an — sonst liefe er im neuen weiter. */
  useEffect(() => { setRunMode(false); }, [selectedPrayerId]);

  const toggleRun = () => {
    setRunMode((current) => {
      if (current) return false;
      // Ein Durchlauf beginnt am Anfang des Gebets, nicht mitten im Schritt,
      // auf dem man zuletzt stehen geblieben ist.
      setPracticeRakah(1);
      setActiveStep(0);
      return true;
    });
  };

  const completeLesson = () => {
    setCompletedLessons((current) => new Set(current).add(selectedPrayerId));
    setCompletionOpen(true);
    setRunMode(false);
    navigator.vibrate?.([45, 35, 70]);
  };

  /** Walks the whole prayer: past the last step of a Rakʿah comes the next one. */
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

      {/* Flach gehalten. Der Kurs-Fortschritt gehört an den Anfang, das
          Titelbild trägt ihn — aber davor stand ein 236px hoher Block mit
          Überschrift und Erklärsatz, und darunter noch eine Zusammenfassung,
          die dieselbe Rakʿah-Zahl ein drittes Mal zeigte. Zusammen war der
          eigentliche Lerninhalt fast zwei Bildschirme tief. */}
      <section className="reference-prayer-course-hero reference-prayer-course-hero--compact">
        <div className="reference-prayer-course-hero__copy">
          {/* Das gewählte Gebet steht hier, nicht mehr „Schritt für Schritt“:
              es ist die Angabe, die die gestrichene Zusammenfassungskarte als
              Einzige beigetragen hat. */}
          <span className="hero-pill">{selectedPrayer.label} · {selectedPrayer.timeLabel}</span>
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

      {/* Übungsmodus: nur noch Standortanzeige und Sprungmarken. Die eigenen
          „Vorherige / Nächste Rakʿah“-Knöpfe sind weg — sie waren ein zweiter
          Weg durch dasselbe, und wer sie benutzte, sprang am Ablauf vorbei.
          Weiter geht es über „Nächster Schritt“, der von selbst in die nächste
          Rakʿah läuft. */}
      <section className="reference-rakah-practice">
        <div className="reference-rakah-practice__head">
          <div><span className="overline">Übungsmodus</span><h2>Rakʿah {practiceRakah} von {selectedPrayer.rakahs}</h2></div>
          <div className="reference-rakah-dots">{Array.from({ length: selectedPrayer.rakahs }, (_, index) => <button key={index} className={practiceRakah === index + 1 ? 'is-active' : practiceRakah > index + 1 ? 'is-complete' : ''} onClick={() => selectRakah(index + 1)} aria-label={`Rakʿah ${index + 1}`}>{practiceRakah > index + 1 ? <Check size={13} /> : index + 1}</button>)}</div>
        </div>
        {/* Der Durchlauf läuft von selbst weiter, damit man mitbeten kann,
            statt zwischen den Positionen zum Weitertippen zu greifen. */}
        <button className={`reference-rakah-run${runMode ? ' is-running' : ''}`} onClick={toggleRun}>
          {runMode ? <Pause size={17} /> : <Play size={17} />}
          <span>
            <strong>{runMode ? 'Durchlauf anhalten' : 'Durchlauf starten'}</strong>
            <small>{runMode
              ? `Läuft: Rakʿah ${practiceRakah}, Schritt ${stepIndex + 1} von ${steps.length}`
              : 'Der Ablauf blättert selbst weiter und spricht mit, wo es eine Aufnahme gibt'}</small>
          </span>
        </button>

        {/* Laut oder leise ist der Unterschied, den man beim Beten als Erstes
            merkt, und er hängt an der Rakʿah — nicht am Gebet als Ganzem. */}
        {currentRakat ? (
          <p className={`reference-rakah-recitation reference-rakah-recitation--${currentRakat.recitation}`}>
            <strong>{RECITATION_LABEL[currentRakat.recitation]}</strong>
            <span>{RECITATION_HINT[currentRakat.recitation]}</span>
          </p>
        ) : null}
      </section>

      {currentStep ? (
        <section className={`reference-rakah-step-detail${runMode ? ' is-running' : ''}`}>
          <div className="section-heading">
            <div><span className="overline">Schritt {stepIndex + 1} von {steps.length}</span><h2>{currentStep.title}</h2></div>
            <span className="reference-rakah-posture">{POSTURE_LABEL[currentStep.posture]}</span>
          </div>
          <div className="reference-prayer-lesson-progress"><span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
          {/* Bild und Beschreibung nebeneinander: die Haltung sehen und
              gleichzeitig lesen, was man darin sagt. */}
          <div className="reference-rakah-step-detail__body">
            <figure className="reference-rakah-figure">
              <PrayerPostureFigure posture={currentStep.posture} labelled />
              <figcaption>{POSTURE_LABEL[currentStep.posture]}</figcaption>
            </figure>
            <p className="reference-rakah-step-detail__description">{currentStep.description}</p>
          </div>
          {currentStep.arabic ? (
            <div className="reference-rakah-wording">
              <div className="reference-rakah-wording__count">
                <strong>{repetitionLabel(currentStep)}</strong>
                <span>sprechen{currentStep.repetitionNote ? ` · ${currentStep.repetitionNote}` : ''}</span>
                {/* Nur bei Koran — siehe RecitationButton, warum die
                    überlieferten Formeln keine Aufnahme bekommen. */}
                {stepRecitation.length ? (
                  <RecitationButton
                    key={`${currentStep.id}-${practiceRakah}-${runMode}`}
                    urls={stepRecitation}
                    autoPlay={runMode}
                    onFinished={runMode ? goToNextStep : undefined}
                  />
                ) : null}
              </div>
              {/* Jeder Durchgang trägt beides: den arabischen Wortlaut und die
                  Umschrift. Wer das Gebet lernt, spricht meist von der Umschrift
                  ab — sie einmal unter drei arabische Zeilen zu setzen hieße,
                  genau der Zeile die Wiederholung vorzuenthalten, die gelesen
                  wird. Die Bedeutung steht weiter einmal darunter: sie wird
                  nicht mitgesprochen. */}
              {(currentStep.repetitions ?? 1) > 1 ? (
                <ol className="reference-rakah-runs">
                  {repetitionRuns(currentStep).map((run) => (
                    <li key={run.key}>
                      <span className="reference-rakah-runs__label">{run.label}</span>
                      <div>
                        <p className="reference-rakah-wording__arabic" lang="ar" dir="rtl">{currentStep.arabic}</p>
                        <p className="reference-rakah-wording__transliteration">{currentStep.transliteration}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <p className="reference-rakah-wording__arabic" lang="ar" dir="rtl">{currentStep.arabic}</p>
                  <p className="reference-rakah-wording__transliteration">{currentStep.transliteration}</p>
                </>
              )}
              <p className="reference-rakah-wording__translation">{currentStep.translation}</p>
              {/* Woher der Wortlaut stammt. Duas und Hadithe der App tragen das
                  längst; die Gebetsschritte standen bis hierher ohne Beleg. */}
              <p className="reference-rakah-source">
                {currentStep.source}
                {recitationCredit(currentStep) ? ` · ${recitationCredit(currentStep)}` : ''}
              </p>
            </div>
          ) : null}
          {/* Zugeklappt, weil es den Ablauf nicht ersetzt, sondern erklärt:
              wer den Schritt lernt, will erst wissen, was er tut. Wer neben
              jemandem betet, der es anders macht, findet die Antwort hier. */}
          {stepDifferences.length ? (
            <details className="reference-madhhab">
              <summary>
                <Scale size={16} />
                <span><strong>Nach Rechtsschule</strong><small>{stepDifferences.length === 1 ? 'Ein Punkt, an dem' : `${stepDifferences.length} Punkte, an denen`} sich die Praxis unterscheidet</small></span>
                <ChevronRight size={16} />
              </summary>
              {stepDifferences.map((difference) => (
                <div key={difference.question} className="reference-madhhab__topic">
                  <h3>{difference.question}</h3>
                  <dl>
                    {MADHHABS.map((madhhab) => (
                      <div key={madhhab.id}>
                        <dt>{madhhab.name}</dt>
                        <dd>{difference.positions[madhhab.id]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              <p className="reference-madhhab__note">{MADHHAB_DISCLAIMER}</p>
            </details>
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
                {/* Die Haltung als Bild, damit die Liste im Überflug lesbar
                    ist; die Schrittnummer wandert dafür in die Textzeile.
                    Auch abgearbeitete Schritte behalten ihr Bild — man blättert
                    hier zurück, um etwas nachzuschauen, und ein Haken an der
                    Stelle nimmt genau das weg. Erledigt zeigt die Färbung. */}
                <span><PrayerPostureFigure posture={step.posture} /></span>
                <span>
                  <small>{index + 1}. {POSTURE_LABEL[step.posture]}</small>
                  <strong>{step.title}</strong>
                  <em>{step.transliteration ?? step.description}</em>
                </span>
                {step.arabic ? <span className="reference-rakah-step-count">{repetitionLabel(step)}</span> : <ChevronRight size={17} />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="reference-prayer-tips">
        <div className="section-heading"><div><span className="overline">Worauf es ankommt</span><h2>Hinweise</h2></div></div>
        <ul>{PRAYER_PRACTICE_TIPS.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </section>

      {/* Below the sequence on purpose: the checklist is what you do once
          before praying, the sequence is what this screen is for. */}
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

      {/* Warum an manchen Schritten „Anhören“ steht und an anderen nicht —
          einmal erklärt, statt an zwölf Schritten einen Hinweis zu zeigen. */}
      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Verständlicher Grundlagenkurs</strong><small>Der Ablauf ist ein allgemeiner Überblick. Handhaltungen, Formulierungen und einzelne Details können sich je nach Rechtsschule unterscheiden. Für verbindliche Praxisfragen ist eine qualifizierte Lehrperson wichtig.<br />Aufnahmen werden beim Antippen aus dem Netz geladen: die Koran-Abschnitte von Mishary Alafasy, die überlieferten Formeln aus Hisn al-Muslim. Ein paar Schritte bleiben ohne Ton, weil dort keine Aufnahme vorliegt, die genau dem hier abgedruckten Wortlaut entspricht — gehört und gelesen soll dasselbe sein.</small></span></section>

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
