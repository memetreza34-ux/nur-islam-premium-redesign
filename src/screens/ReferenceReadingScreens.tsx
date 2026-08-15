import { useEffect, useState } from 'react';
import { WORSHIP_GUIDES, WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';
import type { LucideIcon } from 'lucide-react';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
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

function Toast({ message }: { message: string | null }) {
  const reduceMotion = useReducedMotion();
  return <AnimatePresence>{message ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={{ duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] }}><CircleCheck size={18} /> {message}</motion.div> : null}</AnimatePresence>;
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
  const [mode, setMode] = useState<string>(initialMode);
  const [activeStep, setActiveStep] = useState(() => Math.max(0, readStoredNumber(`nur_guide_${initialMode}_step`, 0)));
  const { toast, flash } = useToast();
  const reduceMotion = useReducedMotion();

  const guide = WORSHIP_GUIDE_BY_ID.get(mode) ?? WORSHIP_GUIDES[0];
  const steps = guide.steps;
  const icons = GUIDE_ICONS[guide.id] ?? [];
  // Clamped against the guide actually shown: the stored index belongs to a
  // list whose length differs per guide, and each one grew when the full data
  // was migrated.
  const stepIndex = Math.min(activeStep, steps.length - 1);

  useEffect(() => {
    try { localStorage.setItem(`nur_guide_${mode}_step`, String(stepIndex)); } catch { /* optional */ }
  }, [mode, stepIndex]);

  const changeMode = (next: string) => {
    setMode(next);
    setActiveStep(Math.max(0, readStoredNumber(`nur_guide_${next}_step`, 0)));
  };

  const completeGuide = () => {
    try { localStorage.setItem(`nur_guide_${mode}_complete`, '1'); } catch { /* optional */ }
    flash(`${guide.title} als abgeschlossen gespeichert`);
  };

  const heroAsset = guide.id === 'wudu'
    ? '/premium-assets/high-res-objects/mosque-gold-v2.webp'
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

      <section className={`reference-guide-hero reference-guide-hero--${guide.id}`}>
        <PremiumImage src={heroAsset} fallback={<Droplets size={76} />} />
        {/* The intro is a sentence, not a heading: as an h2 it hit the display
            face at hero size and broke mid-word in a narrow column. */}
        <div><span className="hero-pill">Ablauf</span><h2>{guide.title}</h2><p>{guide.intro}</p><p>{steps.length} Schritte · Fortschritt lokal gespeichert</p></div>
      </section>

      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Wichtiger Hinweis</strong><small>Dieser Bereich ist ein verständlicher Überblick. Einzelheiten unterscheiden sich teilweise zwischen Rechtsschulen. Für verbindliche Praxisfragen sollte eine vertrauenswürdige Lehrperson vor Ort hinzugezogen werden.</small></span></section>
      <section className="reference-guide-progress"><span><strong>Schritt {stepIndex + 1}</strong><small>von {steps.length}</small></span><div><i style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div></section>

      <section className="reference-guide-steps">
        {steps.map((step, index) => {
          const Icon = icons[index] ?? Sparkles;
          const active = index === stepIndex;
          const complete = index < stepIndex;
          return (
            <button key={step.title} className={`${active ? 'is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => setActiveStep(index)}>
              <span>{complete ? <CircleCheck size={20} /> : <Icon size={20} />}</span>
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
      </section>

      {guide.tips.length ? (
        <section className="reference-legacy-notice">
          <Sparkles size={19} />
          <p>{guide.tips.join(' ')}</p>
        </section>
      ) : null}

      <div className="reference-guide-navigation"><button disabled={stepIndex === 0} onClick={() => setActiveStep((value) => Math.max(0, value - 1))}><ChevronLeft size={18} /> Zurück</button><button className="gold-button" onClick={() => stepIndex === steps.length - 1 ? completeGuide() : setActiveStep((value) => Math.min(steps.length - 1, value + 1))}>{stepIndex === steps.length - 1 ? 'Abschließen' : 'Nächster Schritt'} <ChevronRight size={18} /></button></div>
      <Toast message={toast} />
    </motion.main>
  );
}

