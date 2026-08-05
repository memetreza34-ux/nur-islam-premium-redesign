import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BarChart3,
  ChevronLeft,
  CircleCheck,
  MoonStar,
  RotateCcw,
  Settings,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, RosetteObject } from './PremiumVisuals';

const dhikrCategories = [
  { label: 'Morgen', icon: SunMedium },
  { label: 'Abend', icon: MoonStar },
  { label: 'Nach Gebet', icon: Sparkles },
  { label: 'Vor Schlaf', icon: MoonStar },
];

function readDhikrCount() {
  try {
    const stored = Number(localStorage.getItem('nur_dhikr_count'));
    return Number.isFinite(stored) ? Math.min(100, Math.max(0, stored)) : 33;
  } catch {
    return 33;
  }
}

export function DhikrScreen({ onBack }: { onBack: () => void }) {
  const [count, setCount] = useState(readDhikrCount);
  const [activeCategory, setActiveCategory] = useState('Morgen');
  const [toast, setToast] = useState<string | null>(null);
  const progress = Math.min(100, count);

  useEffect(() => {
    try {
      localStorage.setItem('nur_dhikr_count', String(count));
    } catch {
      // Persistence is optional in restricted browser modes.
    }
  }, [count]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  return (
    <motion.main className="screen reference-dhikr-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Dhikr</h1></div>
        <button className="icon-button" onClick={() => flash('Dhikr-Statistik geöffnet')}><BarChart3 size={20} /></button>
      </header>

      <section className="reference-dhikr-counter">
        <div className="reference-dhikr-counter__glow" />
        <PremiumImage src="/premium-assets/high-res-objects/tasbih.webp" className="reference-dhikr-counter__tasbih" fallback={<RosetteObject />} />
        <button className="reference-dhikr-ring" style={{ '--dhikr-progress': `${progress * 3.6}deg` } as CSSProperties} onClick={() => setCount((value) => Math.min(100, value + 1))} aria-label="Dhikr-Zähler erhöhen">
          <span><strong>{count}</strong><small>/ 100</small></span>
        </button>
        <div className="reference-dhikr-copy">
          <span className="overline">Aktueller Dhikr</span>
          <h2>SubhanAllah</h2>
          <p dir="rtl">سُبْحَانَ اللَّهِ</p>
          <small>Gepriesen sei Allah</small>
        </div>
        <button className="reference-dhikr-reset" onClick={() => setCount(0)}><RotateCcw size={16} /> Zurücksetzen</button>
      </section>

      <section className="reference-dhikr-goal">
        <div><span className="overline">Tagesziel</span><strong>{progress}%</strong></div>
        <span><i style={{ width: `${progress}%` }} /></span>
        <p>{count >= 100 ? 'Tagesziel erreicht. Möge Allah deinen Dhikr annehmen.' : `${100 - count} Wiederholungen bis zum Tagesziel.`}</p>
      </section>

      <section className="reference-dhikr-categories">
        <div className="section-heading"><div><span className="overline">Sammlungen</span><h2>Dhikr auswählen</h2></div></div>
        <div className="reference-dhikr-category-grid">
          {dhikrCategories.map(({ label, icon: Icon }) => (
            <button key={label} className={activeCategory === label ? 'is-active' : ''} onClick={() => { setActiveCategory(label); flash(`${label}-Dhikr ausgewählt`); }}>
              <span><Icon size={23} /></span><strong>{label}</strong><small>12 Erinnerungen</small>
            </button>
          ))}
        </div>
      </section>

      <section className="reference-dhikr-remembrance">
        <div><span className="overline">Ausgewählte Sammlung</span><h3>{activeCategory}</h3><p dir="rtl">الْحَمْدُ لِلَّهِ</p><small>Alles Lob gebührt Allah</small></div>
        <button onClick={() => flash('Dhikr-Einstellungen geöffnet')}><Settings size={18} /></button>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
