import { useEffect, useState } from 'react';
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
  getHadithShareText,
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
  const isDaily = hadithId == null;
  const [now, setNow] = useState(() => new Date());
  const entry = isDaily ? getDailyHadith(now) : getHadithById(hadithId);
  const [savedIds, setSavedIds] = useState(readSavedHadithIds);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const saved = entry ? savedIds.has(entry.id) : false;
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (!isDaily) return;
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [isDaily]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const toggleSaved = () => {
    if (!entry) return;
    const next = new Set(savedIds);
    if (next.has(entry.id)) next.delete(entry.id);
    else next.add(entry.id);
    if (!writeSavedHadithIds(next)) {
      setSavedIds(readSavedHadithIds());
      flash('Änderung konnte nicht vollständig gespeichert werden');
      return;
    }
    setSavedIds(next);
    flash(next.has(entry.id) ? 'Hadith gespeichert' : 'Aus Sammlung entfernt');
  };

  const share = async () => {
    if (!entry) return;
    try {
      const result = await shareOrCopy(
        `Nur Islam · ${entry.title}`,
        getHadithShareText(entry),
      );
      flash(result === 'shared' ? 'Hadith geteilt' : 'Hadith kopiert');
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  if (!entry) return (
    <main className="screen reference-detail-screen">
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Deine Sammlung</span><h1>Hadith nicht verfügbar</h1></div>
        <span className="reference-reading-header-spacer" aria-hidden="true" />
      </header>
      <p role="status">Der gespeicherte Verweis ist nicht mehr verfügbar. Es wird kein anderer Hadith als Ersatz angezeigt.</p>
    </main>
  );

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
          <small>Du liest eine sinngemäße Inhaltsangabe, nicht den Originalwortlaut des Hadiths.</small>
          {entry.grading ? <small>{entry.grading.text} <a href={entry.grading.sourceUrl} target="_blank" rel="noopener noreferrer">Bewertungsquelle</a>{entry.grading.comparisonUrl ? <> · <a href={entry.grading.comparisonUrl} target="_blank" rel="noopener noreferrer">Vergleichsquelle</a></> : null}</small> : null}
        </span>
      </section>

      <section className="reference-reflection-card">
        <span className="reference-reflection-card__icon"><Sparkles size={20} /></span>
        <span><small>Quellenmodus</small><h2>{entry.title}</h2><p>Die Tagesauswahl wechselt automatisch. Für den vollständigen Wortlaut und den Kontext ist die angegebene Primärquelle maßgeblich.</p></span>
      </section>

      <div className="reference-detail-actions">
        <button className={saved ? 'is-saved' : ''} onClick={toggleSaved}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}{saved ? 'Gespeichert' : 'Speichern'}</button>
        <button onClick={() => void share()}><Share2 size={18} /> Teilen</button>
      </div>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }} transition={microTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
