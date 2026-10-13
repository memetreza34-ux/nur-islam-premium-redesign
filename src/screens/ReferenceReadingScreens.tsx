import { lazy, Suspense, useEffect, useState } from 'react';
import { WORSHIP_GUIDES, WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';
import { readGuideProgress, saveGuideCompletion, saveGuideStep } from '../services/worshipGuideProgress';
import type { LucideIcon } from 'lucide-react';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  Copy,
  Droplets,
  Footprints,
  Hand,
  HeartHandshake,
  Landmark,
  ListChecks,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PremiumImage } from '../shared/PremiumVisuals';
import { useStepNavigation } from '../shared/useStepNavigation';

const WuduLesson = lazy(() => import('../shared/WuduLesson'));

type ToastState = string | null;

type GuideMode = 'wudu' | 'salah';


type GuideStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const FOCUSED_AYAH_ARABIC = 'قُلْ هُوَ ٱللَّهُ أَحَدٌ';
const FOCUSED_AYAH_MEANING = 'Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“';
const FOCUSED_AYAH_SOURCE = 'Quran 112:1';

function readStoredNumber(key: string, fallback: number) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

async function shareOrCopy(title: string, text: string) {
  if (navigator.share) {
    await navigator.share({ title, text });
    return 'shared' as const;
  }
  await copyText(text);
  return 'copied' as const;
}

function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };
  return { toast, flash };
}

function ScreenHeader({ title, eyebrow, onBack }: { title: string; eyebrow: string; onBack: () => void }) {
  return (
    <header className="reference-screen-header">
      <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
      <div><span className="overline">{eyebrow}</span><h1>{title}</h1></div>
      <span className="reference-reading-header-spacer" aria-hidden="true" />
    </header>
  );
}

function Toast({ message, error = false }: { message: string | null; error?: boolean }) {
  const reduceMotion = useReducedMotion();
  return <AnimatePresence>{message ? <motion.div className="toast" role="status" initial={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, x: '-50%', y: 0 }} exit={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 6 }} transition={{ duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] }}>{error ? <CircleAlert size={18} /> : <CircleCheck size={18} />} {message}</motion.div> : null}</AnimatePresence>;
}

export function AyahDetailScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(() => readStoredNumber('nur_daily_ayah_saved', 0) === 1);
  const { toast, flash } = useToast();
  const reduceMotion = useReducedMotion();
  const shareText = `${FOCUSED_AYAH_ARABIC}\n\n${FOCUSED_AYAH_MEANING}\n\n${FOCUSED_AYAH_SOURCE}`;

  useEffect(() => {
    // Keep the legacy key for existing users; only the visible product wording
    // changes from a fake daily promise to an honest fixed Quran focus.
    try { localStorage.setItem('nur_daily_ayah_saved', saved ? '1' : '0'); } catch { /* optional */ }
  }, [saved]);

  const copyAyah = async () => {
    try {
      await copyText(shareText);
      flash('Ayah kopiert');
    } catch {
      flash('Kopieren war nicht möglich');
    }
  };

  const shareAyah = async () => {
    try {
      const result = await shareOrCopy('Al-Ikhlas 112:1', shareText);
      flash(result === 'shared' ? 'Ayah geteilt' : 'Ayah kopiert');
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  return (
    <motion.main className="screen reference-detail-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}>
      <ScreenHeader title="Ayah im Fokus" eyebrow="Quran entdecken" onBack={onBack} />

      <section className="reference-ayah-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch-v2.webp" className="reference-ayah-hero__art" fallback={<Sparkles size={72} />} />
        <span className="hero-pill">Sure Al-Ikhlas · 112:1</span>
        <p dir="rtl">{FOCUSED_AYAH_ARABIC}</p>
        <blockquote>{FOCUSED_AYAH_MEANING}</blockquote>
        <div>
          <button onClick={() => void copyAyah()}><Copy size={18} /> Kopieren</button>
          <button className={saved ? 'is-saved' : ''} onClick={() => setSaved((value) => !value)}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Gespeichert' : 'Speichern'}</button>
        </div>
      </section>

      <section className="reference-reflection-card">
        <span className="reference-reflection-card__icon"><BookOpen size={20} /></span>
        <span><small>Im Zusammenhang lesen</small><h2>Sure Al-Ikhlas vollständig öffnen</h2><p>Für Wortlaut und Zusammenhang ist der Quran-Reader maßgeblich. Diese Karte hebt bewusst nur Ayah 112:1 hervor und ersetzt nicht das Lesen der vollständigen Sure.</p></span>
      </section>
      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Klare Quellenkennzeichnung</strong><small>Quran 112:1. Die deutsche Formulierung ist eine sinngemäße Bedeutung und keine vorgetäuschte Originalübersetzung.</small></span></section>
      <div className="reference-detail-actions"><button onClick={() => void copyAyah()}><Copy size={18} /> Kopieren</button><button onClick={() => void shareAyah()}><Share2 size={18} /> Teilen</button></div>
      <Toast message={toast} />
    </motion.main>
  );
}

/**
 * Icons per guide, matched by position. The migrated data carries no icon, and
 * a single repeated glyph beside ten steps reads as a bullet rather than as a
 * step marker.
 */
const GUIDE_ICONS: Record<string, LucideIcon[]> = {
  wudu: [Sparkles, Hand, Droplets, Droplets, Hand, Hand, Droplets, Footprints, Volume2, Check],
  salah: [Sparkles, BookOpen, RotateCcw, Volume2, Sparkles, RotateCcw, Sparkles, BookOpen, Check, Volume2, Check],
  'what-to-say': [Volume2, BookOpen, Volume2, RotateCcw, Volume2, Sparkles, Volume2, Sparkles, BookOpen, Volume2, Check],
  mandatory: [Sparkles, Volume2, BookOpen, RotateCcw, Volume2, Sparkles, Volume2, Sparkles, BookOpen, Volume2, Check, Check],
  mistakes: [RotateCcw, Volume2, Hand, Sparkles, BookOpen, Check],
  sahw: [RotateCcw, BookOpen, Sparkles, RotateCcw, Check, Hand, Volume2],
  shahada: [Volume2, Sparkles, BookOpen, RotateCcw, Hand, Check],
  women: [Hand, Sparkles, RotateCcw, Volume2, BookOpen, Check, Hand],
  'more-prayers': [Sparkles, Sparkles, RotateCcw, Volume2, Sparkles, BookOpen, Check],
  'special-cases': [RotateCcw, RotateCcw, Check, Check, Hand, Volume2, Sparkles],
  occasions: [Sparkles, HeartHandshake, ListChecks, Volume2, Landmark, RotateCcw, Check],
};

const GUIDE_TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'shahada', label: 'Shahada', icon: Sparkles },
  { id: 'wudu', label: 'Wudu', icon: Droplets },
  { id: 'salah', label: 'Salah', icon: Sparkles },
  { id: 'what-to-say', label: 'Wortlaut', icon: Volume2 },
  { id: 'mandatory', label: 'Pflichtteile', icon: Check },
  { id: 'mistakes', label: 'Fehler', icon: RotateCcw },
  { id: 'sahw', label: 'Verzählt?', icon: RotateCcw },
  { id: 'women', label: 'Für Frauen', icon: Hand },
  { id: 'more-prayers', label: 'Weitere Gebete', icon: Sparkles },
  { id: 'special-cases', label: 'Reise & Ausfall', icon: RotateCcw },
  { id: 'occasions', label: 'Anlässe', icon: HeartHandshake },
];

export function WorshipGuideScreen({ initialMode, onBack }: { initialMode: GuideMode; onBack: () => void }) {
  const { stepRef, revealStep } = useStepNavigation<HTMLButtonElement>();
  const [mode, setMode] = useState<string>(initialMode);
  const [{ activeStep, stored }, setGuideState] = useState(() => {
    const stored = readGuideProgress(initialMode);
    return { activeStep: stored.stepIndex, stored };
  });
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [toastError, setToastError] = useState(false);
  const { toast, flash } = useToast();
  const reduceMotion = useReducedMotion();

  const guide = WORSHIP_GUIDE_BY_ID.get(mode) ?? WORSHIP_GUIDES[0];
  const steps = guide.steps;
  const icons = GUIDE_ICONS[guide.id] ?? [];
  const stepIndex = Math.min(activeStep, steps.length - 1);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      const stepKey = `nur_guide_${guide.id}_step`;
      if (event.key !== null && event.key !== stepKey && event.key !== `nur_guide_${guide.id}_complete`) return;
      const stored = readGuideProgress(guide.id);
      setGuideState(current => ({ activeStep: stored.stepValid && (event.key === null || event.key === stepKey) ? stored.stepIndex : current.activeStep, stored }));
      setStorageWarning(null);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [guide.id]);

  const changeMode = (next: string) => {
    if (!WORSHIP_GUIDE_BY_ID.has(next)) return;
    const stored = readGuideProgress(next);
    setMode(next);
    setGuideState({ activeStep: stored.stepIndex, stored });
    setStorageWarning(null);
  };

  const selectStep = (index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= steps.length) return;
    const saved = saveGuideStep(guide.id, index);
    setGuideState({ activeStep: index, stored: readGuideProgress(guide.id) });
    setStorageWarning(saved ? null : 'Speicherung der Schrittposition nicht bestätigt. Du kannst weiterlernen; vorhandene unlesbare Daten bleiben unverändert.');
    if (guide.id !== 'wudu') revealStep();
  };

  const completeGuide = () => {
    if (stepIndex !== steps.length - 1) return;
    const saved = saveGuideCompletion(guide.id);
    setGuideState(current => ({ ...current, stored: readGuideProgress(guide.id) }));
    setToastError(!saved);
    if (!saved) setStorageWarning('Speicherung nicht bestätigt. Der Abschluss konnte nicht lokal bestätigt werden; vorhandene unlesbare Daten bleiben unverändert.');
    else setStorageWarning(null);
    flash(saved ? `${guide.title} als abgeschlossen gespeichert` : 'Speicherung nicht bestätigt');
  };

  const progressNotice = storageWarning ?? (!stored.stepValid || !stored.completionValid
    ? 'Vorhandene Fortschrittsdaten sind nicht lesbar oder nicht zuordenbar und bleiben unverändert. Du kannst die Schritte trotzdem ansehen.'
    : null);
  const storageLabel = !stored.stepValid || !stored.completionValid ? 'Gespeicherter Fortschritt nicht lesbar'
    : stored.completed ? 'Abschluss lokal gespeichert'
      : stored.hasStep && stored.stepIndex === stepIndex ? 'Position lokal gespeichert' : 'Noch keine bestätigte Speicherung';

  const heroAsset = guide.id === 'wudu'
    ? '/premium-assets/high-res-objects/wudu-washing-v1.webp'
    : '/premium-assets/high-res-objects/qibla-compass-v2.webp';

  return (
    <motion.main className="screen reference-guide-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}>
      <ScreenHeader title={guide.title} eyebrow="Schritt für Schritt" onBack={onBack} />

      <div className="reference-guide-tabs reference-guide-tabs--wide">
        {GUIDE_TABS.map((tab) => (
          <button key={tab.id} className={mode === tab.id ? 'is-active' : ''} onClick={() => changeMode(tab.id)}>
            <tab.icon size={17} /> {tab.label}
          </button>
        ))}
      </div>

      <section className="worship-guide-intro" aria-label="Einführung">
        <header>
          <span className="overline">Ablauf</span>
          <h2>{guide.id === 'wudu' ? <>Wudu <span>Gebetswaschung</span></> : guide.title}</h2>
        </header>
        <div className="worship-guide-intro__body">
          <p>{guide.intro}</p>
          <div aria-hidden="true"><PremiumImage src={heroAsset} className="worship-guide-intro__art" fallback={<Droplets size={48} />} priority /></div>
        </div>
        <p className="worship-guide-intro__meta">{steps.length} Schritte · {storageLabel}</p>
      </section>

      {progressNotice ? <section className="reference-source-card" role="status"><CircleAlert size={19} /><span><strong>Speicherhinweis</strong><small>{progressNotice}</small></span></section> : null}
      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Wichtiger Hinweis</strong><small>Dieser Bereich ist ein verständlicher Überblick. Einzelheiten unterscheiden sich teilweise zwischen Rechtsschulen. Für verbindliche Praxisfragen sollte eine vertrauenswürdige Lehrperson vor Ort hinzugezogen werden.</small></span></section>
      <section className="reference-guide-progress"><span><strong>Schritt {stepIndex + 1}</strong><small>von {steps.length}</small></span><div><i style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div></section>

      {guide.id === 'wudu' ? (
        <Suspense fallback={<p role="status">Schritte werden geladen …</p>}>
          <WuduLesson steps={steps} stepIndex={stepIndex} onSelect={selectStep} onComplete={completeGuide} />
        </Suspense>
      ) : <section className="reference-guide-steps">
        {steps.map((step, index) => {
          const Icon = icons[index] ?? Sparkles;
          const active = index === stepIndex;
          return (
            <button ref={active ? stepRef : undefined} key={step.title} className={active ? 'is-active' : ''} onClick={() => selectStep(index)}>
              <span><Icon size={20} /></span>
              <span>
                <small>Schritt {index + 1}</small>
                <strong>{step.title}</strong>
                <em>{step.description}</em>
                {/* The words themselves, where the source carries them — the
                    reason this guide exists rather than a summary of it. */}
                {step.arabic ? <span className="reference-guide-arabic" dir="rtl" lang="ar">{step.arabic}</span> : null}
                {step.transliteration ? <span className="reference-guide-translit">{step.transliteration}</span> : null}
              </span>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </section>}

      {guide.id !== 'wudu' && steps[stepIndex]?.source ? <section className="reference-source-card"><BookOpen size={19} /><span><strong>Quelle zu „{steps[stepIndex].title}“</strong><small>{steps[stepIndex].source}</small>{steps[stepIndex].sourceUrl ? <a href={steps[stepIndex].sourceUrl} target="_blank" rel="noreferrer">Fundstelle öffnen</a> : null}</span></section> : null}

      {guide.tips.length ? (
        <section className="reference-legacy-notice">
          <Sparkles size={19} />
          <p>{guide.tips.join(' ')}</p>
        </section>
      ) : null}

      {guide.id !== 'wudu' ? <div className="reference-guide-navigation"><button disabled={stepIndex === 0} onClick={() => selectStep(stepIndex - 1)}><ChevronLeft size={18} /> Zurück</button><button className="gold-button" onClick={() => stepIndex === steps.length - 1 ? completeGuide() : selectStep(stepIndex + 1)}>{stepIndex === steps.length - 1 ? 'Abschließen' : 'Nächster Schritt'} <ChevronRight size={18} /></button></div> : null}
      <Toast message={toast} error={toastError} />
    </motion.main>
  );
}
