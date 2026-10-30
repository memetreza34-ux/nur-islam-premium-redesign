import { SourceInfo } from '../shared/SourceInfo';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { WORSHIP_GUIDES, WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';
import { readGuideProgress, saveGuideStep } from '../services/worshipGuideProgress';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleAlert,
  Copy,
  Droplets,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PremiumImage } from '../shared/PremiumVisuals';
import { useStepNavigation } from '../shared/useStepNavigation';

const WuduLesson = lazy(() => import('../shared/WuduLesson'));

type ToastState = string | null;

type GuideMode = 'wudu' | 'salah';


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
  const { toast, flash } = useToast();
  const [saved, setSaved] = useState(() => readStoredNumber('nur_daily_ayah_saved', 0) === 1);
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
      <SourceInfo title="Quellenkennzeichnung"><section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Klare Quellenkennzeichnung</strong><small>Quran 112:1. Die deutsche Formulierung ist eine sinngemäße Bedeutung und keine vorgetäuschte Originalübersetzung.</small></span></section></SourceInfo>
      <div className="reference-detail-actions"><button onClick={() => void shareAyah()}><Share2 size={18} /> Ayah teilen</button></div>
      <Toast message={toast} />
    </motion.main>
  );
}

export function WorshipGuideScreen({ initialMode, onBack }: { initialMode: GuideMode; onBack: () => void }) {
  const { stepRef, revealStep } = useStepNavigation<HTMLElement>();
  const mode = initialMode;
  const [{ activeStep, stored }, setGuideState] = useState(() => {
    const stored = readGuideProgress(mode);
    return { activeStep: stored.stepIndex, stored };
  });
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const guide = WORSHIP_GUIDE_BY_ID.get(mode) ?? WORSHIP_GUIDES[0];
  const steps = guide.steps;
  const stepIndex = Math.min(activeStep, steps.length - 1);
  const step = steps[stepIndex];
  const stepMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      const stepKey = `nur_guide_${guide.id}_step`;
      if (event.key !== null && event.key !== stepKey) return;
      const stored = readGuideProgress(guide.id);
      setGuideState(current => ({ activeStep: stored.stepValid && (event.key === null || event.key === stepKey) ? stored.stepIndex : current.activeStep, stored }));
      setStorageWarning(null);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [guide.id]);

  const selectStep = (index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= steps.length) return;
    if (stepMenu.current) stepMenu.current.open = false;
    const saved = saveGuideStep(guide.id, index);
    setGuideState({ activeStep: index, stored: readGuideProgress(guide.id) });
    setStorageWarning(saved ? null : 'Speicherung der Schrittposition nicht bestätigt. Du kannst weiterlernen; vorhandene unlesbare Daten bleiben unverändert.');
    if (guide.id !== 'wudu') revealStep();
  };

  const progressNotice = storageWarning ?? (!stored.stepValid
    ? 'Die gespeicherte Leseposition ist nicht lesbar und bleibt unverändert. Du kannst die Schritte trotzdem ansehen.'
    : null);

  const heroAsset = guide.id === 'wudu'
    ? '/premium-assets/high-res-objects/learn-hub-wudu-v1.webp'
    : '/premium-assets/high-res-objects/home-qibla-illustrated-v3.webp';

  return (
    <motion.main className="screen reference-guide-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}>
      <ScreenHeader title={guide.title} eyebrow="Schritt für Schritt" onBack={onBack} />

      <section className="worship-guide-intro" aria-label="Einführung">
        <div aria-hidden="true"><PremiumImage src={heroAsset} className="worship-guide-intro__art" fallback={<Droplets size={48} />} priority /></div>
        <p>{guide.id === 'wudu' ? guide.intro.split('. ')[0] + '.' : guide.intro}</p>
        <SourceInfo title="Hinweise zur Anleitung"><p>{guide.intro}</p><section className="guide-context"><h3>Einordnung</h3><p>Dieser Bereich ist ein verständlicher Überblick. Einzelheiten unterscheiden sich teilweise zwischen Rechtsschulen. Für verbindliche Praxisfragen sollte eine vertrauenswürdige Lehrperson vor Ort hinzugezogen werden.</p></section></SourceInfo>
      </section>

      {progressNotice ? <section className="reference-source-card" role="status"><CircleAlert size={19} /><span><strong>Speicherhinweis</strong><small>{progressNotice}</small></span></section> : null}


      {guide.id === 'wudu' ? (
        <Suspense fallback={<p role="status">Schritte werden geladen …</p>}>
          <WuduLesson steps={steps} stepIndex={stepIndex} onSelect={selectStep} />
        </Suspense>
      ) : <section className="wudu-lesson" aria-label="Anleitung Schritt für Schritt">
        <details className="wudu-lesson__overview" ref={stepMenu}>
          <summary><span>Schritt auswählen</span><small>{steps.length} Schritte</small><ChevronDown size={18} aria-hidden="true" /></summary>
          <ol>{steps.map((item, index) => <li key={item.title}><button aria-label={`Schritt ${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined} onClick={() => selectStep(index)}><span className="wudu-lesson__step-number">{index + 1}</span><span>{item.title}</span><ChevronRight size={16} aria-hidden="true" /></button></li>)}</ol>
        </details>
        <article ref={stepRef} className="wudu-lesson__card" aria-labelledby="guide-step-title">
          <header><p className="wudu-lesson__eyebrow">Schritt {stepIndex + 1} von {steps.length}</p><h2 id="guide-step-title" tabIndex={-1}>{step.title}</h2></header>
          <p>{step.description}</p>
          {step.arabic ? <p className="reference-guide-arabic wudu-lesson__arabic" dir="rtl" lang="ar">{step.arabic}</p> : null}
          {step.transliteration ? <p className="reference-guide-translit wudu-lesson__phonetic">{step.transliteration}</p> : null}
          {step.source ? <SourceInfo key={step.title} title={`Quelle zu „${step.title}“`}><p>{step.source}</p>{step.sourceUrl ? <a href={step.sourceUrl} target="_blank" rel="noreferrer">Fundstelle öffnen</a> : null}</SourceInfo> : null}
          <div className="wudu-lesson__actions"><button disabled={stepIndex === 0} onClick={() => selectStep(stepIndex - 1)}><ChevronLeft size={18} /> Vorheriger Schritt</button><button className="gold-button" onClick={() => stepIndex === steps.length - 1 ? selectStep(0) : selectStep(stepIndex + 1)}>{stepIndex === steps.length - 1 ? 'Von vorn' : 'Nächster Schritt'} <ChevronRight size={18} /></button></div>
        </article>
      </section>}

      {guide.tips.length ? (
        <details className="reference-guide-tips"><summary><BookOpen size={18} aria-hidden="true" /><span>Gut zu wissen</span><ChevronDown size={18} aria-hidden="true" /></summary><ul>{guide.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></details>
      ) : null}


    </motion.main>
  );
}
