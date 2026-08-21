import { useMemo, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  CircleCheck,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  getDailyHadith,
  getHadithById,
  readSavedHadithIds,
  writeSavedHadithIds,
} from '../data/hadithData';

async function shareOrCopy(title: string, text: string) {
  if (navigator.share) {
    await navigator.share({ title, text });
    return 'shared' as const;
  }
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
  return 'copied' as const;
}

export function DailyHadithScreen({
  onBack,
  hadithId,
}: {
  onBack: () => void;
  hadithId?: string | null;
}) {
  const entry = useMemo(() => getHadithById(hadithId) ?? getDailyHadith(), [hadithId]);
  const [savedIds, setSavedIds] = useState(readSavedHadithIds);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const saved = savedIds.has(entry.id);
  const isDaily = !hadithId;
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const toggleSaved = () => {
    const next = new Set(savedIds);
    if (next.has(entry.id)) next.delete(entry.id);
    else next.add(entry.id);
    setSavedIds(next);
    writeSavedHadithIds(next);
    flash(next.has(entry.id) ? 'Hadith gespeichert' : 'Aus Sammlung entfernt');
  };

  const share = async () => {
    try {
      const result = await shareOrCopy(
        `Nur Islam · ${entry.title}`,
        `${entry.summary}\n\nQuelle: ${entry.source}`,
      );
      flash(result === 'shared' ? 'Hadith geteilt' : 'Hadith kopiert');
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  return (
    <motion.main className="screen reference-detail-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">{isDaily ? 'Tägliche Auswahl' : 'Deine Sammlung'}</span><h1>{isDaily ? 'Hadith des Tages' : 'Gespeicherter Hadith'}</h1></div>
        <span className="reference-reading-header-spacer" aria-hidden="true" />
      </header>

      <section className="reference-hadith-hero">
        <span className="reference-hadith-hero__mark">ﷺ</span>
        <span className="hero-pill">{entry.title}</span>
        <blockquote>{entry.summary}</blockquote>
        <footer>{entry.source}</footer>
      </section>

      {/* Shown only where the carried-over entry brought one: an empty box
          under every hadith would suggest a missing explanation rather than an
          entry that never had one. */}
      {entry.context ? (
        <section className="reference-hadith-context">
          <BookOpen size={18} />
          <p>{entry.context}</p>
        </section>
      ) : null}

      <section className="reference-source-card reference-source-card--strong">
        <ShieldCheck size={19} />
        <span>
          <strong>{entry.source}</strong>
          <small>Nur Islam zeigt hier bewusst eine sinngemäße Inhaltsangabe. Wortlaut, Übersetzung und fachliche Einordnung bleiben vor Veröffentlichung Teil der religiösen Endprüfung.</small>
        </span>
      </section>

      <section className="reference-reflection-card">
        <span className="reference-reflection-card__icon"><Sparkles size={20} /></span>
        <span><small>Quellenmodus</small><h2>{entry.title}</h2><p>{isDaily ? 'Die Tagesauswahl wechselt automatisch. ' : 'Dies ist ein fest gespeicherter Eintrag aus deiner Sammlung. '}Für den vollständigen Wortlaut und den Kontext ist die angegebene Quellenangabe maßgeblich.</p></span>
      </section>

      <div className="reference-detail-actions">
        <button className={saved ? 'is-saved' : ''} onClick={toggleSaved}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Gespeichert' : 'Speichern'}</button>
        <button onClick={() => void share()}><Share2 size={18} /> Teilen</button>
      </div>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
