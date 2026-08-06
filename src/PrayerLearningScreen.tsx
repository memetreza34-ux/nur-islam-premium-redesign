import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Footprints,
  Hand,
  HeartHandshake,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, QiblaObject } from './PremiumVisuals';

export type PrayerLessonId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

type PrayerLesson = {
  id: PrayerLessonId;
  label: string;
  arabic: string;
  rakahs: number;
  timeLabel: string;
  note: string;
};

type LessonStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const PRAYER_LESSONS: PrayerLesson[] = [
  { id: 'fajr', label: 'Fajr', arabic: 'الفجر', rakahs: 2, timeLabel: 'Morgengebet', note: 'Zwei Pflicht-Rakʿah' },
  { id: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', rakahs: 4, timeLabel: 'Mittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'asr', label: 'Asr', arabic: 'العصر', rakahs: 4, timeLabel: 'Nachmittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'maghrib', label: 'Maghrib', arabic: 'المغرب', rakahs: 3, timeLabel: 'Abendgebet', note: 'Drei Pflicht-Rakʿah' },
  { id: 'isha', label: 'Isha', arabic: 'العشاء', rakahs: 4, timeLabel: 'Nachtgebet', note: 'Vier Pflicht-Rakʿah' },
];

const lessonSteps: LessonStep[] = [
  { title: 'Vorbereiten und ausrichten', description: 'Prüfe Gebetszeit, Reinheit, Kleidung und Qibla. Fasse die Absicht im Herzen.', icon: Compass },
  { title: 'Eröffnungstakbir und Stehen', description: 'Beginne das Gebet und stehe ruhig. Lerne die Handhaltung entsprechend deiner Rechtsschule.', icon: Hand },
  { title: 'Al-Fatihah und Rezitation', description: 'Rezitiere Al-Fatihah. In den vorgesehenen Einheiten folgt eine weitere Quranrezitation.', icon: BookOpen },
  { title: 'Ruku und Aufrichten', description: 'Gehe ruhig in die Verbeugung und richte dich anschließend vollständig wieder auf.', icon: RotateCcw },
  { title: 'Sujud und Sitzen', description: 'Vollziehe die Niederwerfung, sitze kurz und vollziehe die zweite Niederwerfung.', icon: Sparkles },
  { title: 'Nächste Rakʿah', description: 'Stehe für die nächste Gebetseinheit auf und wiederhole den passenden Ablauf.', icon: Footprints },
  { title: 'Tashahhud und Salam', description: 'Beende das Gebet nach der letzten Rakʿah mit dem Sitzen und dem Salam.', icon: HeartHandshake },
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

function readNumber(key: string, fallback: number) {
  try {
    const value = Number(localStorage.getItem(key));
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
  const [activeStep, setActiveStep] = useState(() => Math.max(0, Math.min(lessonSteps.length - 1, readNumber(`nur_prayer_lesson_${initialPrayer}_step`, 0))));
  const [practiceRakah, setPracticeRakah] = useState(() => Math.max(1, readNumber(`nur_prayer_lesson_${initialPrayer}_rakah`, 1)));
  const [preparation, setPreparation] = useState(() => readStringSet('nur_prayer_learning_preparation'));
  const [completedLessons, setCompletedLessons] = useState(() => readStringSet('nur_prayer_learning_complete'));
  const [completionOpen, setCompletionOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedPrayer = useMemo(
    () => PRAYER_LESSONS.find((prayer) => prayer.id === selectedPrayerId) ?? PRAYER_LESSONS[0],
    [selectedPrayerId],
  );
  const lessonComplete = completedLessons.has(selectedPrayerId);
  const courseProgress = Math.round((completedLessons.size / PRAYER_LESSONS.length) * 100);

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
    setActiveStep(Math.max(0, Math.min(lessonSteps.length - 1, readNumber(`nur_prayer_lesson_${id}_step`, 0))));
    setPracticeRakah(Math.max(1, Math.min(prayer.rakahs, readNumber(`nur_prayer_lesson_${id}_rakah`, 1))));
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
    <motion.main className="screen reference-prayer-course-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Beten lernen</span><h1>Gebetskurs</h1></div>
        <button className="icon-button" onClick={onOpenQibla} aria-label="Qibla öffnen"><Compass size={20} /></button>
      </header>

      <section className="reference-prayer-course-hero">
        <div className="reference-prayer-course-hero__copy">
          <span className="hero-pill">Schritt für Schritt</span>
          <h2>Lerne jedes Pflichtgebet sicher und in Ruhe.</h2>
          <p>Wähle ein Gebet, übe den Ablauf und speichere deinen Fortschritt ausschließlich auf diesem Gerät.</p>
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

      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Verständlicher Grundlagenkurs</strong><small>Der Ablauf ist ein allgemeiner Überblick. Handhaltungen, Formulierungen und einzelne Details können sich je nach Rechtsschule unterscheiden. Für verbindliche Praxisfragen ist eine qualifizierte Lehrperson wichtig.</small></span></section>

      <section className="reference-rakah-practice">
        <div><span className="overline">Übungsmodus</span><h2>Rakʿah {practiceRakah} von {selectedPrayer.rakahs}</h2><p>Gehe die Positionen bewusst durch. Es läuft kein Zeitdruck.</p></div>
        <div className="reference-rakah-dots">{Array.from({ length: selectedPrayer.rakahs }, (_, index) => <button key={index} className={practiceRakah === index + 1 ? 'is-active' : practiceRakah > index + 1 ? 'is-complete' : ''} onClick={() => setPracticeRakah(index + 1)} aria-label={`Rakʿah ${index + 1}`}>{practiceRakah > index + 1 ? <Check size={13} /> : index + 1}</button>)}</div>
        <div className="reference-rakah-actions"><button disabled={practiceRakah === 1} onClick={() => setPracticeRakah((value) => Math.max(1, value - 1))}><ChevronLeft size={16} /> Vorherige</button><button disabled={practiceRakah === selectedPrayer.rakahs} onClick={() => setPracticeRakah((value) => Math.min(selectedPrayer.rakahs, value + 1))}>Nächste Rakʿah <ChevronRight size={16} /></button></div>
      </section>

      <section className="reference-prayer-lesson-steps">
        <div className="section-heading"><div><span className="overline">Ablauf</span><h2>Positionen lernen</h2></div><span>{activeStep + 1}/{lessonSteps.length}</span></div>
        <div className="reference-prayer-lesson-progress"><span style={{ width: `${((activeStep + 1) / lessonSteps.length) * 100}%` }} /></div>
        <div>
          {lessonSteps.map((step, index) => {
            const Icon = step.icon;
            const active = activeStep === index;
            const complete = index < activeStep;
            return (
              <button key={step.title} className={`${active ? 'is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => setActiveStep(index)}>
                <span>{complete ? <CircleCheck size={19} /> : <Icon size={19} />}</span>
                <span><small>Schritt {index + 1}</small><strong>{step.title}</strong><em>{step.description}</em></span>
                <ChevronRight size={17} />
              </button>
            );
          })}
        </div>
      </section>

      <div className="reference-prayer-course-navigation">
        <button disabled={activeStep === 0} onClick={() => setActiveStep((value) => Math.max(0, value - 1))}><ChevronLeft size={17} /> Zurück</button>
        {activeStep === lessonSteps.length - 1 ? (
          <button className="gold-button" onClick={completeLesson}>{lessonComplete ? <CircleCheck size={17} /> : <Sparkles size={17} />}{lessonComplete ? 'Erneut abschließen' : 'Lektion abschließen'}</button>
        ) : (
          <button className="gold-button" onClick={() => setActiveStep((value) => Math.min(lessonSteps.length - 1, value + 1))}>Nächster Schritt <ChevronRight size={17} /></button>
        )}
      </div>

      {lessonComplete ? <button className="reference-prayer-course-restart" onClick={restartLesson}><RotateCcw size={16} /> Lektion neu beginnen</button> : null}

      <AnimatePresence>
        {completionOpen ? (
          <motion.div className="reference-prayer-course-complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCompletionOpen(false)}>
            <motion.section initial={{ opacity: 0, y: 24, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <span><CircleCheck size={32} /></span><small>Lektion abgeschlossen</small><h2>{selectedPrayer.label} gelernt</h2><p>Du hast den Grundlagenablauf vollständig durchgearbeitet. Wiederhole ihn regelmäßig und lass deine praktische Ausführung von einer vertrauenswürdigen Lehrperson prüfen.</p><button className="gold-button" onClick={() => setCompletionOpen(false)}>Weiterlernen <ChevronRight size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
