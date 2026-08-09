import { useEffect, useState } from 'react';
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
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage } from '../shared/PremiumVisuals';

type ToastState = string | null;

type GuideMode = 'wudu' | 'salah';

type GuideStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const DAILY_AYAH_ARABIC = 'قُلْ هُوَ ٱللَّهُ أَحَدٌ';
const DAILY_AYAH_MEANING = 'Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“';
const DAILY_AYAH_SOURCE = 'Quran 112:1';
const DAILY_HADITH_TEXT = 'Sinngemäß: Taten werden entsprechend den Absichten bewertet, und jeder Mensch erhält entsprechend seiner Absicht.';
const DAILY_HADITH_SOURCE = 'Sahih al-Bukhari 1 · Sahih Muslim 1907';

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
  return <AnimatePresence>{message ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {message}</motion.div> : null}</AnimatePresence>;
}

export function AyahDetailScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(() => readStoredNumber('nur_daily_ayah_saved', 0) === 1);
  const { toast, flash } = useToast();
  const shareText = `${DAILY_AYAH_ARABIC}\n\n${DAILY_AYAH_MEANING}\n\n${DAILY_AYAH_SOURCE}`;

  useEffect(() => {
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
    <motion.main className="screen reference-detail-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <ScreenHeader title="Ayah des Tages" eyebrow="Tägliche Inspiration" onBack={onBack} />

      <section className="reference-ayah-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch-v2.webp" className="reference-ayah-hero__art" fallback={<Sparkles size={72} />} />
        <span className="hero-pill">Sure Al-Ikhlas · 112:1</span>
        <p dir="rtl">{DAILY_AYAH_ARABIC}</p>
        <blockquote>{DAILY_AYAH_MEANING}</blockquote>
        <div>
          <button onClick={() => void copyAyah()}><Copy size={18} /> Kopieren</button>
          <button className={saved ? 'is-saved' : ''} onClick={() => setSaved((value) => !value)}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Gespeichert' : 'Speichern'}</button>
        </div>
      </section>

      <section className="reference-reflection-card"><span className="reference-reflection-card__icon"><Sparkles size={20} /></span><span><small>Reflexion</small><h2>Die vollkommene Einheit Allahs</h2><p>Die Sure richtet den Glauben ausschließlich auf Allah. Sie beschreibt Seine Einzigkeit und dass nichts mit Ihm vergleichbar ist.</p></span></section>
      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Klare Quellenkennzeichnung</strong><small>Quran 112:1. Die deutsche Formulierung ist eine sinngemäße Bedeutung und keine vorgetäuschte Originalübersetzung.</small></span></section>
      <div className="reference-detail-actions"><button onClick={() => void copyAyah()}><Copy size={18} /> Kopieren</button><button onClick={() => void shareAyah()}><Share2 size={18} /> Teilen</button></div>
      <Toast message={toast} />
    </motion.main>
  );
}

export function HadithDetailScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(() => readStoredNumber('nur_daily_hadith_saved', 0) === 1);
  const { toast, flash } = useToast();
  const shareText = `${DAILY_HADITH_TEXT}\n\n${DAILY_HADITH_SOURCE}`;

  useEffect(() => {
    try { localStorage.setItem('nur_daily_hadith_saved', saved ? '1' : '0'); } catch { /* optional */ }
  }, [saved]);

  const shareHadith = async () => {
    try {
      const result = await shareOrCopy('Hadith über die Absicht', shareText);
      flash(result === 'shared' ? 'Hadith geteilt' : 'Hadith kopiert');
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  return (
    <motion.main className="screen reference-detail-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <ScreenHeader title="Hadith des Tages" eyebrow="Authentische Überlieferung" onBack={onBack} />

      <section className="reference-hadith-hero"><span className="reference-hadith-hero__mark">ﷺ</span><span className="hero-pill">Absicht · Niyyah</span><blockquote>{DAILY_HADITH_TEXT}</blockquote><footer>Überliefert von ʿUmar ibn al-Khattab</footer></section>
      <section className="reference-source-card reference-source-card--strong"><ShieldCheck size={19} /><span><strong>{DAILY_HADITH_SOURCE}</strong><small>Der Text wird bewusst sinngemäß wiedergegeben. Vor Veröffentlichung sollten Wortlaut und Lokalisierung nochmals mit einer geprüften Hadith-Datenquelle abgeglichen werden.</small></span></section>
      <section className="reference-reflection-card"><span className="reference-reflection-card__icon"><Sparkles size={20} /></span><span><small>Was du mitnehmen kannst</small><h2>Die Absicht gibt der Tat ihre Richtung</h2><p>Eine alltägliche Handlung kann durch eine aufrichtige Absicht zu einer guten Tat werden. Prüfe vor wichtigen Handlungen, warum du sie ausführst.</p></span></section>
      <section className="reference-hadith-points">{['Absicht vor der Handlung bewusst machen', 'Aufrichtigkeit regelmäßig prüfen', 'Gute Gewohnheiten mit einem klaren Ziel verbinden'].map((point) => <span key={point}><Check size={16} /> {point}</span>)}</section>
      <div className="reference-detail-actions"><button className={saved ? 'is-saved' : ''} onClick={() => setSaved((value) => !value)}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Gespeichert' : 'Speichern'}</button><button onClick={() => void shareHadith()}><Share2 size={18} /> Teilen</button></div>
      <Toast message={toast} />
    </motion.main>
  );
}

const wuduSteps: GuideStep[] = [
  { title: 'Absicht fassen', description: 'Fasse im Herzen die Absicht, die Gebetswaschung für Allah durchzuführen.', icon: Sparkles },
  { title: 'Hände waschen', description: 'Wasche beide Hände gründlich bis zu den Handgelenken.', icon: Hand },
  { title: 'Mund und Nase', description: 'Spüle den Mund und reinige die Nase behutsam.', icon: Droplets },
  { title: 'Gesicht und Arme', description: 'Wasche das Gesicht und anschließend beide Arme bis einschließlich der Ellenbogen.', icon: Droplets },
  { title: 'Kopf wischen', description: 'Wische mit nassen Händen über den Kopf; Details können je nach Rechtsschule variieren.', icon: Hand },
  { title: 'Füße waschen', description: 'Wasche beide Füße bis einschließlich der Knöchel.', icon: Footprints },
];

const salahSteps: GuideStep[] = [
  { title: 'Absicht und Takbir', description: 'Richte dich zur Qibla aus, fasse die Absicht und beginne mit dem Eröffnungstakbir.', icon: Sparkles },
  { title: 'Stehen und rezitieren', description: 'Rezitiere Al-Fatihah und je nach Gebetseinheit weitere Quranverse.', icon: BookOpen },
  { title: 'Ruku', description: 'Verbeuge dich ruhig und sprich die vorgeschriebenen Lobpreisungen.', icon: RotateCcw },
  { title: 'Aufrichten', description: 'Richte dich vollständig aus der Verbeugung auf.', icon: Volume2 },
  { title: 'Sujud', description: 'Vollziehe die Niederwerfung mit Ruhe und Demut.', icon: Sparkles },
  { title: 'Sitzen und Abschluss', description: 'Vollende die Gebetseinheiten, Tashahhud und den Salam entsprechend dem Gebet.', icon: Check },
];

export function WorshipGuideScreen({ initialMode, onBack }: { initialMode: GuideMode; onBack: () => void }) {
  const [mode, setMode] = useState<GuideMode>(initialMode);
  const [activeStep, setActiveStep] = useState(() => Math.max(0, Math.min(5, readStoredNumber(`nur_guide_${initialMode}_step`, 0))));
  const { toast, flash } = useToast();
  const steps = mode === 'wudu' ? wuduSteps : salahSteps;

  useEffect(() => {
    try { localStorage.setItem(`nur_guide_${mode}_step`, String(activeStep)); } catch { /* optional */ }
  }, [mode, activeStep]);

  const changeMode = (next: GuideMode) => {
    setMode(next);
    setActiveStep(Math.max(0, Math.min(5, readStoredNumber(`nur_guide_${next}_step`, 0))));
  };

  const completeGuide = () => {
    try { localStorage.setItem(`nur_guide_${mode}_complete`, '1'); } catch { /* optional */ }
    flash(`${mode === 'wudu' ? 'Wudu' : 'Salah'}-Anleitung als abgeschlossen gespeichert`);
  };

  const heroAsset = mode === 'wudu'
    ? '/premium-assets/high-res-objects/mosque-gold-v2.webp'
    : '/premium-assets/high-res-objects/qibla-compass-v2.webp';

  return (
    <motion.main className="screen reference-guide-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <ScreenHeader title={mode === 'wudu' ? 'Wudu lernen' : 'Salah lernen'} eyebrow="Schritt für Schritt" onBack={onBack} />

      <div className="reference-guide-tabs"><button className={mode === 'wudu' ? 'is-active' : ''} onClick={() => changeMode('wudu')}><Droplets size={18} /> Wudu</button><button className={mode === 'salah' ? 'is-active' : ''} onClick={() => changeMode('salah')}><Sparkles size={18} /> Salah</button></div>

      <section className={`reference-guide-hero reference-guide-hero--${mode}`}>
        <PremiumImage src={heroAsset} fallback={mode === 'wudu' ? <Droplets size={76} /> : <Sparkles size={76} />} />
        <div><span className="hero-pill">{mode === 'wudu' ? 'Reinigung' : 'Gebet'}</span><h2>{mode === 'wudu' ? 'Bereite dich bewusst auf das Gebet vor.' : 'Lerne den Ablauf ruhig und verständlich.'}</h2><p>{steps.length} kompakte Schritte · Fortschritt lokal gespeichert</p></div>
      </section>

      <section className="reference-source-card"><ShieldCheck size={19} /><span><strong>Wichtiger Hinweis</strong><small>Dieser Bereich ist ein verständlicher Überblick. Einzelheiten unterscheiden sich teilweise zwischen Rechtsschulen. Für verbindliche Praxisfragen sollte eine vertrauenswürdige Lehrperson vor Ort hinzugezogen werden.</small></span></section>
      <section className="reference-guide-progress"><span><strong>Schritt {activeStep + 1}</strong><small>von {steps.length}</small></span><div><i style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div></section>

      <section className="reference-guide-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index === activeStep;
          const complete = index < activeStep;
          return <button key={step.title} className={`${active ? 'is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => setActiveStep(index)}><span>{complete ? <CircleCheck size={20} /> : <Icon size={20} />}</span><span><small>Schritt {index + 1}</small><strong>{step.title}</strong><em>{step.description}</em></span><ChevronRight size={18} /></button>;
        })}
      </section>

      <div className="reference-guide-navigation"><button disabled={activeStep === 0} onClick={() => setActiveStep((value) => Math.max(0, value - 1))}><ChevronLeft size={18} /> Zurück</button><button className="gold-button" onClick={() => activeStep === steps.length - 1 ? completeGuide() : setActiveStep((value) => Math.min(steps.length - 1, value + 1))}>{activeStep === steps.length - 1 ? 'Abschließen' : 'Nächster Schritt'} <ChevronRight size={18} /></button></div>
      <Toast message={toast} />
    </motion.main>
  );
}
