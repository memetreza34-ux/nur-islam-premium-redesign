import { useScreenState } from '../shared/ScreenState';
import { SourceInfo } from '../shared/SourceInfo';
import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  BookOpen,
  ChevronDown,
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
  TimerReset,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PremiumImage } from '../shared/PremiumVisuals';
import { PrayerPostureImage } from '../shared/PrayerPostureImage';
import { RecitationButton } from '../shared/RecitationButton';
import { useStepNavigation } from '../shared/useStepNavigation';
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

const PRAYER_TIME_IMAGE: Record<PrayerLessonId, string> = {
  fajr: 'prayer-oasis-fajr-v2.webp',
  dhuhr: 'prayer-oasis-dhuhr-v2.webp',
  asr: 'prayer-oasis-asr-v2.webp',
  maghrib: 'prayer-oasis-maghrib-v2.webp',
  isha: 'prayer-oasis-isha-v2.webp',
};

const PRAYER_MINI_IMAGE: Record<PrayerLessonId, string> = {
  fajr: 'prayer-mini-fajr-v2.webp',
  dhuhr: 'prayer-mini-dhuhr-v2.webp',
  asr: 'prayer-mini-asr-v2.webp',
  maghrib: 'prayer-mini-maghrib-v2.webp',
  isha: 'prayer-mini-isha-v2.webp',
};

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
  backLabel = 'Zurück zu Lernen',
  onOpenQibla,
  onOpenPrayerTimes,
}: {
  initialPrayer?: PrayerLessonId;
  onBack: () => void;
  backLabel?: string;
  onOpenQibla: () => void;
  onOpenPrayerTimes: () => void;
}) {
  const [selectedPrayerId, setSelectedPrayerId] = useScreenState<PrayerLessonId>('prayer-course.prayer', initialPrayer);
  const [activeStep, setActiveStep] = useState(() => Math.max(0, readNumber(`nur_prayer_lesson_${selectedPrayerId}_step`, 0)));
  const [practiceRakah, setPracticeRakah] = useState(() => Math.max(1, readNumber(`nur_prayer_lesson_${selectedPrayerId}_rakah`, 1)));
  const [preparation, setPreparation] = useState(() => readStringSet('nur_prayer_learning_preparation'));
  const [stepChooserOpen, setStepChooserOpen] = useState(false);
  /**
   * Der Durchlauf: der Ablauf läuft von selbst weiter, mit Rezitation, wo es
   * eine gibt. Gedacht zum Mitbeten — die Hände bleiben frei, was beim Üben
   * eines Ablaufs, der beide Hände braucht, der eigentliche Punkt ist.
   */
  const [runMode, setRunMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const { stepRef, revealStep } = useStepNavigation<HTMLElement>();

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
    setStepChooserOpen(false);
    revealStep();
  };

  const selectStep = (index: number) => {
    setActiveStep(index);
    setStepChooserOpen(false);
    revealStep();
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
    if (!runMode || !currentStep) return;
    if (stepRecitation.length) return;
    const timer = window.setTimeout(() => goToNextStep(), stepRunDuration(currentStep));
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runMode, currentStep?.id, practiceRakah, stepRecitation.length]);

  /** Ein Wechsel des Gebets hält den Durchlauf an — sonst liefe er im neuen weiter. */
  useEffect(() => { setRunMode(false); }, [selectedPrayerId]);

  const toggleRun = () => {
    if (!runMode) revealStep();
    setRunMode((current) => {
      if (current) return false;
      // Ein Durchlauf beginnt am Anfang des Gebets, nicht mitten im Schritt,
      // auf dem man zuletzt stehen geblieben ist.
      setPracticeRakah(1);
      setActiveStep(0);
      return true;
    });
  };

  /** Walks the whole prayer: past the last step of a Rakʿah comes the next one. */
  const goToNextStep = () => {
    if (!atLastStep) { setActiveStep(stepIndex + 1); revealStep(); return; }
    if (!isLastRakat) { selectRakah(practiceRakah + 1); return; }
    restartPractice();
  };

  const goToPreviousStep = () => {
    if (stepIndex > 0) { setActiveStep(stepIndex - 1); revealStep(); return; }
    if (practiceRakah > 1) {
      const previous = rakats[practiceRakah - 2];
      setPracticeRakah(practiceRakah - 1);
      setActiveStep(Math.max(0, (previous?.steps.length ?? 1) - 1));
      revealStep();
    }
  };

  const restartPractice = () => {
    setRunMode(false);
    setActiveStep(0);
    setPracticeRakah(1);
    revealStep();
  };

  return (
    <motion.main className="screen reference-prayer-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label={backLabel}><ChevronLeft size={20} /></button>
        <div><span className="overline">Beten lernen</span><h1>Gebetskurs</h1></div>
        <button className="icon-button" onClick={onOpenQibla} aria-label="Qibla öffnen"><Compass size={20} /></button>
      </header>

      {/* Ein durchgehendes Zeitfenster statt Bild plus leerer Kartenhälfte:
          Landschaft, Gebetsidentität und Lernstand bilden eine Fläche. */}
      <section className="reference-prayer-course-hero reference-prayer-course-hero--compact" data-prayer-scene={selectedPrayerId}>
        <PremiumImage
          src={`/premium-assets/high-res-objects/${PRAYER_TIME_IMAGE[selectedPrayerId]}`}
          alt={`${selectedPrayer.timeLabel} als ruhige Tageszeit-Landschaft`}
          className="reference-prayer-course-hero__time-art"
          fallback={<PrayerPostureImage posture="qiyam" />}
          priority
        />
        <div className="reference-prayer-course-hero__copy">
          <span className="reference-prayer-course-hero__eyebrow">{selectedPrayer.timeLabel}</span>
          <div className="reference-prayer-course-hero__title">
            <h2>{selectedPrayer.label}</h2>
            <span lang="ar" dir="rtl">{selectedPrayer.arabic}</span>
          </div>
          <p>{selectedPrayer.rakahs} Rakʿah</p>
        </div>
      </section>

      <section className="reference-prayer-course-selector" aria-label="Gebet auswählen">
        {PRAYER_LESSONS.map((prayer) => {
          return (
            <button key={prayer.id} className={selectedPrayerId === prayer.id ? 'is-active' : ''} aria-pressed={selectedPrayerId === prayer.id} onClick={() => selectPrayer(prayer.id)}>
              <span className="reference-prayer-course-selector__image">
                <img src={`/premium-assets/high-res-objects/${PRAYER_MINI_IMAGE[prayer.id]}`} alt="" />
              </span>
              <strong>{prayer.label}</strong>
            </button>
          );
        })}
      </section>

      <details className="reference-prayer-preparation">
        <summary>Vor dem Gebet</summary>
        <div className="section-heading"><h2>Vorbereitung</h2><button className="text-button" onClick={onOpenPrayerTimes}><TimerReset size={15} /> Zeiten</button></div>
        <div>
          {preparationItems.map((item) => {
            const checked = preparation.has(item);
            return <button key={item} className={checked ? 'is-checked' : ''} onClick={() => togglePreparation(item)}><span>{checked ? <Check size={16} /> : null}</span>{item}</button>;
          })}
        </div>
        <button className="reference-qibla-shortcut" onClick={onOpenQibla}><MapPin size={17} /><span><strong>Qibla prüfen</strong><small>Richtung zur Kaaba</small></span><ChevronRight size={17} /></button>
      </details>

      {/* Übungsmodus: nur noch Standortanzeige und Sprungmarken. Die eigenen
          „Vorherige / Nächste Rakʿah“-Knöpfe sind weg — sie waren ein zweiter
          Weg durch dasselbe, und wer sie benutzte, sprang am Ablauf vorbei.
          Weiter geht es über „Nächster Schritt“, der von selbst in die nächste
          Rakʿah läuft. */}
      <details className="reference-rakah-practice">
        <summary>Übung einstellen</summary>
        <div className="reference-rakah-practice__head">
          <div><h2>Rakʿah {practiceRakah} von {selectedPrayer.rakahs}</h2></div>
          <div className="reference-rakah-dots">{Array.from({ length: selectedPrayer.rakahs }, (_, index) => <button key={index} className={practiceRakah === index + 1 ? 'is-active' : ''} onClick={() => selectRakah(index + 1)} aria-label={`Rakʿah ${index + 1}`}>{index + 1}</button>)}</div>
        </div>
        {/* Der Durchlauf läuft von selbst weiter, damit man mitbeten kann,
            statt zwischen den Positionen zum Weitertippen zu greifen. */}
        <button className={`reference-rakah-run${runMode ? ' is-running' : ''}`} onClick={toggleRun}>
          {runMode ? <Pause size={17} /> : <Play size={17} />}
          <span>
            <strong>{runMode ? 'Durchlauf anhalten' : 'Durchlauf starten'}</strong>
            <small>{runMode
              ? `Läuft: Rakʿah ${practiceRakah}, Schritt ${stepIndex + 1} von ${steps.length}`
              : 'Automatisch weiter · mit Quran-Aufnahmen'}</small>
          </span>
        </button>

      </details>

      {currentStep ? (
        <details
          className="reference-prayer-step-chooser"
          open={stepChooserOpen}
          onToggle={(event) => setStepChooserOpen(event.currentTarget.open)}
        >
          <summary>
            <span><strong>Schritt auswählen</strong></span>
            <ChevronDown size={18} />
          </summary>
          <div>
            {steps.map((step, index) => (
              <button
                key={`${step.id}-${index}`}
                className={stepIndex === index ? 'is-active' : ''}
                onClick={() => selectStep(index)}
              >
                <PrayerPostureImage posture={step.posture} compact />
                <span><small>{index + 1}. {POSTURE_LABEL[step.posture]}</small><strong>{step.title}</strong></span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </details>
      ) : null}

      {currentStep ? (
        <section ref={stepRef} aria-labelledby="prayer-step-title" className={`reference-rakah-step-detail${runMode ? ' is-running' : ''}`}>
          <div className="section-heading">
            <div><span className="overline">Rakʿah {practiceRakah} · Schritt {stepIndex + 1} von {steps.length}</span><h2 id="prayer-step-title" tabIndex={-1}>{currentStep.title}</h2></div>
          </div>
          <div className="reference-rakah-step-detail__body">
            <figure className="reference-rakah-figure">
              <PrayerPostureImage posture={currentStep.posture} />
              <figcaption>{POSTURE_LABEL[currentStep.posture]}</figcaption>
            </figure>
            <div className="reference-rakah-instruction"><h3>So geht’s</h3><p className="reference-rakah-step-detail__description">{currentStep.description}</p></div>
          </div>
          {stepRecitation.length > 0 && currentRakat ? <div className="reference-rakah-recitation">
            <strong>{RECITATION_LABEL[currentRakat.recitation]}</strong>
            <SourceInfo title="Laut oder leise rezitieren"><p>{RECITATION_HINT[currentRakat.recitation]}</p></SourceInfo>
          </div> : null}
          {currentStep.arabic ? (
            <div className="reference-rakah-wording">
              <div className="reference-rakah-wording__count">
                <div><h3>Das sprichst du</h3><span>{repetitionLabel(currentStep)} sprechen</span></div>
                {/* Nur bei Quran-Versen mit dokumentierter Audio-Nutzung. */}
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
                        <p className="reference-rakah-wording__pronunciation"><span>Deutsche Aussprachehilfe</span>{currentStep.pronunciation ?? currentStep.transliteration}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <p className="reference-rakah-wording__arabic" lang="ar" dir="rtl">{currentStep.arabic}</p>
                  <p className="reference-rakah-wording__pronunciation"><span>Deutsche Aussprachehilfe</span>{currentStep.pronunciation ?? currentStep.transliteration}</p>
                </>
              )}
              <p className="reference-rakah-wording__translation"><span>Sinngemäße Bedeutung</span>{currentStep.translation}</p>
              <details className="reference-guide-tips">
                <summary><BookOpen size={18} aria-hidden="true" /><span>Hinweise zum Wortlaut</span><ChevronDown size={18} aria-hidden="true" /></summary>
                {currentStep.repetitionNote ? <p className="reference-rakah-pronunciation-note">{currentStep.repetitionNote}</p> : null}
                <p className="reference-rakah-pronunciation-note">Näherung für deutschsprachige Anfänger. „dh“, „gh“ und „q“ haben im Deutschen keine genaue Entsprechung – nutze bei Quran-Abschnitten die Aufnahme und sonst eine qualifizierte Lehrperson.</p>
              </details>
              {/* Woher der Wortlaut stammt. Duas und Hadithe der App tragen das
                  längst; die Gebetsschritte standen bis hierher ohne Beleg. */}
              <div className="reference-rakah-source-row"><span>Quelle und Einordnung</span><SourceInfo title={`Quelle zu „${currentStep.title}“`}><p className="reference-rakah-source">
                {currentStep.source}
                {recitationCredit(currentStep) ? ` · ${recitationCredit(currentStep)}` : ''}
              </p></SourceInfo></div>
            </div>
          ) : null}
          {/* Zugeklappt, weil es den Ablauf nicht ersetzt, sondern erklärt:
              wer den Schritt lernt, will erst wissen, was er tut. Wer neben
              jemandem betet, der es anders macht, findet die Antwort hier. */}
          {stepDifferences.length ? (
            <details className="reference-madhhab">
              <summary>
                <Scale size={16} />
                <span><strong>Nach Rechtsschule</strong></span>
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
                  <SourceInfo title={difference.question}><a href={difference.sourceUrl} target="_blank" rel="noreferrer">{difference.source}</a></SourceInfo>
                </div>
              ))}
              <p className="reference-madhhab__note">{MADHHAB_DISCLAIMER}</p>
            </details>
          ) : null}
          <div className="reference-prayer-course-navigation">
            <button disabled={stepIndex === 0 && practiceRakah === 1} onClick={goToPreviousStep}><ChevronLeft size={17} /> Zurück</button>
            <button className="gold-button" onClick={goToNextStep}>
              {atLastStep && isLastRakat
                ? <><RotateCcw size={17} /> Von vorn</>
                : <>{atLastStep ? 'Nächste Rakʿah' : 'Nächster Schritt'} <ChevronRight size={17} /></>}
            </button>
          </div>
        </section>
      ) : null}

      <details className="reference-guide-tips">
        <summary><BookOpen size={18} aria-hidden="true" /><span>Hinweise zum Üben</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <ul>{PRAYER_PRACTICE_TIPS.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </details>


      <SourceInfo title="Hinweise zum Gebetskurs"><section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Verständlicher Grundlagenkurs</strong><small>Der Ablauf ist ein allgemeiner Überblick. Handhaltungen, Formulierungen und einzelne Details können sich je nach Rechtsschule unterscheiden. Für verbindliche Praxisfragen ist eine qualifizierte Lehrperson wichtig.<br />Nur die Quran-Abschnitte haben eine Aufnahme. Sie wird erst beim Antippen von Islamic Network gestreamt und von Mishary Alafasy rezitiert. Für die übrigen Formeln helfen arabischer Wortlaut und deutsche Aussprachehilfe.</small></span></section></SourceInfo>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
