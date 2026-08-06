import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BarChart3,
  BedDouble,
  ChevronLeft,
  CircleCheck,
  ListRestart,
  MoonStar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DHIKR_ROUTINES, DHIKR_ROUTINE_BY_ID } from './dhikrData';
import { PremiumImage, RosetteObject } from './PremiumVisuals';

type DailyDhikrState = {
  date: string;
  counts: Record<string, number>;
};

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function readDailyState(): DailyDhikrState {
  const fallback = { date: todayKey(), counts: {} };
  try {
    const raw = localStorage.getItem('nur_dhikr_daily_v2');
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DailyDhikrState>;
    if (parsed.date !== fallback.date || !parsed.counts || typeof parsed.counts !== 'object') return fallback;
    return { date: parsed.date, counts: parsed.counts as Record<string, number> };
  } catch {
    return fallback;
  }
}

function readRoutineId() {
  try {
    const stored = localStorage.getItem('nur_dhikr_active_routine');
    return stored && DHIKR_ROUTINE_BY_ID.has(stored) ? stored : DHIKR_ROUTINES[0].id;
  } catch {
    return DHIKR_ROUTINES[0].id;
  }
}

function routineIcon(id: string) {
  if (id === 'morning-weighted') return SunMedium;
  if (id === 'before-sleep') return BedDouble;
  if (id === 'after-prayer') return Sparkles;
  return MoonStar;
}

export function DhikrScreen({ onBack }: { onBack: () => void }) {
  const [dailyState, setDailyState] = useState(readDailyState);
  const [activeRoutineId, setActiveRoutineId] = useState(readRoutineId);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const routine = DHIKR_ROUTINE_BY_ID.get(activeRoutineId) ?? DHIKR_ROUTINES[0];
  const item = routine.items[Math.min(activeItemIndex, routine.items.length - 1)];
  const itemKey = `${routine.id}:${item.id}`;
  const count = Math.min(item.target, Math.max(0, dailyState.counts[itemKey] ?? 0));
  const itemProgress = Math.round((count / item.target) * 100);

  const routineStats = useMemo(() => {
    const completed = routine.items.reduce((sum, entry) => {
      const value = dailyState.counts[`${routine.id}:${entry.id}`] ?? 0;
      return sum + Math.min(entry.target, Math.max(0, value));
    }, 0);
    const target = routine.items.reduce((sum, entry) => sum + entry.target, 0);
    return { completed, target, progress: Math.round((completed / target) * 100) };
  }, [dailyState.counts, routine]);

  const totalToday = useMemo(() => Object.values(dailyState.counts).reduce((sum, value) => sum + Math.max(0, value), 0), [dailyState.counts]);

  useEffect(() => {
    try {
      localStorage.setItem('nur_dhikr_daily_v2', JSON.stringify(dailyState));
      localStorage.setItem('nur_dhikr_active_routine', activeRoutineId);
      localStorage.setItem('nur_dhikr_count', String(count));
    } catch {
      // Lokale Speicherung ist in eingeschränkten Browsermodi optional.
    }
  }, [activeRoutineId, count, dailyState]);

  useEffect(() => {
    const firstIncomplete = routine.items.findIndex((entry) => (dailyState.counts[`${routine.id}:${entry.id}`] ?? 0) < entry.target);
    setActiveItemIndex(firstIncomplete === -1 ? Math.max(0, routine.items.length - 1) : firstIncomplete);
  }, [activeRoutineId, dailyState.counts, routine]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const increment = () => {
    if (count >= item.target) {
      const nextIndex = activeItemIndex + 1;
      if (nextIndex < routine.items.length) setActiveItemIndex(nextIndex);
      else flash('Diese Dhikr-Routine ist für heute abgeschlossen');
      return;
    }

    const nextCount = count + 1;
    setDailyState((current) => ({
      ...current,
      counts: { ...current.counts, [itemKey]: nextCount },
    }));

    if (nextCount === item.target) {
      const nextIndex = activeItemIndex + 1;
      if (nextIndex < routine.items.length) {
        flash(`${item.latin} abgeschlossen`);
        window.setTimeout(() => setActiveItemIndex(nextIndex), 260);
      } else {
        flash('Routine abgeschlossen');
      }
    }
  };

  const resetCurrent = () => {
    setDailyState((current) => ({ ...current, counts: { ...current.counts, [itemKey]: 0 } }));
    flash('Aktueller Zähler zurückgesetzt');
  };

  const resetRoutine = () => {
    setDailyState((current) => {
      const counts = { ...current.counts };
      routine.items.forEach((entry) => { delete counts[`${routine.id}:${entry.id}`]; });
      return { ...current, counts };
    });
    setActiveItemIndex(0);
    flash('Routine zurückgesetzt');
  };

  return (
    <motion.main className="screen reference-dhikr-screen reference-dhikr-screen--complete" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Tägliche Erinnerung</span><h1>Dhikr</h1></div>
        <button className="icon-button" onClick={() => flash(`${totalToday} Wiederholungen heute`)} aria-label="Heutige Statistik"><BarChart3 size={20} /></button>
      </header>

      <section className="reference-dhikr-counter">
        <div className="reference-dhikr-counter__glow" />
        <PremiumImage src="/premium-assets/high-res-objects/tasbih-v2.webp" className="reference-dhikr-counter__tasbih" fallback={<RosetteObject />} />
        <button className="reference-dhikr-ring" style={{ '--dhikr-progress': `${itemProgress * 3.6}deg` } as CSSProperties} onClick={increment} aria-label={`${item.latin} zählen`}>
          <span><strong>{count}</strong><small>/ {item.target}</small></span>
        </button>
        <div className="reference-dhikr-copy">
          <span className="overline">{routine.shortTitle} · Schritt {activeItemIndex + 1}/{routine.items.length}</span>
          <h2>{item.latin}</h2>
          <p dir="rtl">{item.arabic}</p>
          <small>{item.meaning}</small>
        </div>
        <button className="reference-dhikr-reset" onClick={resetCurrent}><RotateCcw size={16} /> Aktuellen Zähler zurücksetzen</button>
      </section>

      <section className="reference-dhikr-goal">
        <div><span className="overline">Routine-Fortschritt</span><strong>{routineStats.progress}%</strong></div>
        <span><i style={{ width: `${routineStats.progress}%` }} /></span>
        <p>{routineStats.progress >= 100 ? 'Routine abgeschlossen. Der Fortschritt wird morgen automatisch neu begonnen.' : `${routineStats.target - routineStats.completed} Wiederholungen bis zum Abschluss dieser Routine.`}</p>
      </section>

      <section className="reference-dhikr-step-tabs" aria-label="Dhikr-Schritte">
        {routine.items.map((entry, index) => {
          const entryCount = Math.min(entry.target, dailyState.counts[`${routine.id}:${entry.id}`] ?? 0);
          const complete = entryCount >= entry.target;
          return <button key={entry.id} className={activeItemIndex === index ? 'is-active' : ''} onClick={() => setActiveItemIndex(index)}><span>{complete ? <CircleCheck size={15} /> : index + 1}</span><strong>{entry.latin}</strong><small>{entryCount}/{entry.target}</small></button>;
        })}
      </section>

      <section className="reference-dhikr-categories">
        <div className="section-heading"><div><span className="overline">Belegte Routinen</span><h2>Dhikr auswählen</h2></div></div>
        <div className="reference-dhikr-category-grid">
          {DHIKR_ROUTINES.map((entry) => {
            const Icon = routineIcon(entry.id);
            const completed = entry.items.reduce((sum, part) => sum + Math.min(part.target, dailyState.counts[`${entry.id}:${part.id}`] ?? 0), 0);
            const target = entry.items.reduce((sum, part) => sum + part.target, 0);
            return (
              <button key={entry.id} className={activeRoutineId === entry.id ? 'is-active' : ''} onClick={() => { setActiveRoutineId(entry.id); setActiveItemIndex(0); }}>
                <span><Icon size={23} /></span><strong>{entry.shortTitle}</strong><small>{completed}/{target}</small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="reference-dhikr-source">
        <ShieldCheck size={18} />
        <span><small>Quellenhinweis</small><strong>{routine.source}</strong><p>{routine.description}</p>{routine.note ? <em>{routine.note}</em> : null}</span>
      </section>

      <button className="reference-dhikr-routine-reset" onClick={resetRoutine}><ListRestart size={17} /> Gesamte ausgewählte Routine zurücksetzen</button>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
