import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookmarkCheck,
  Check,
  ChevronLeft,
  CircleCheck,
  Filter,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { NAMES_OF_ALLAH } from '../data/namesOfAllahData';
import type { NameOfAllah } from '../data/namesOfAllahData';
import { useDialog } from '../shared/useDialog';

type NameFilter = 'all' | 'favorites' | 'learned';

const nameId = (name: NameOfAllah) => String(name.id);
const validIds = new Set(NAMES_OF_ALLAH.map(nameId));

function migrateNameSet(key: string, fallback: string[] = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : fallback;
    const values = Array.isArray(parsed) ? parsed : fallback;
    const migrated = new Set<string>();

    values.forEach((value) => {
      const candidate = String(value);
      if (validIds.has(candidate)) {
        migrated.add(candidate);
        return;
      }

      const legacyMatch = NAMES_OF_ALLAH.find((entry) => entry.latin === candidate);
      if (legacyMatch) migrated.add(nameId(legacyMatch));
    });

    localStorage.setItem(key, JSON.stringify([...migrated]));
    return migrated;
  } catch {
    return new Set(fallback.filter((value) => validIds.has(value)));
  }
}

function writeSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Lokale Speicherung bleibt in eingeschränkten Browsermodi optional.
  }
}

export function NamesScreen({ onBack, initialNameId = null }: { onBack: () => void; initialNameId?: string | null }) {
  const initialName = initialNameId ? NAMES_OF_ALLAH.find((entry) => String(entry.id) === initialNameId) ?? null : null;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NameFilter>('all');
  const [favorites, setFavorites] = useState(() => migrateNameSet('nur_name_favorites'));
  const [learned, setLearned] = useState(() => migrateNameSet('nur_name_learned'));
  const [selected, setSelected] = useState<NameOfAllah | null>(initialName);
  const closeName = useCallback(() => setSelected(null), []);
  const nameDialog = useDialog(Boolean(selected), closeName, selected?.latin);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => writeSet('nur_name_favorites', favorites), [favorites]);
  useEffect(() => writeSet('nur_name_learned', learned), [learned]);
  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    return NAMES_OF_ALLAH.filter((name) => {
      const id = nameId(name);
      if (filter === 'favorites' && !favorites.has(id)) return false;
      if (filter === 'learned' && !learned.has(id)) return false;
      if (!normalized) return true;
      return `${name.id} ${name.latin} ${name.arabic} ${name.meaning}`
        .toLocaleLowerCase('de-DE')
        .includes(normalized);
    });
  }, [favorites, filter, learned, query]);

  const progress = Math.round((learned.size / NAMES_OF_ALLAH.length) * 100);

  const flash = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2100);
  };

  const toggleFavorite = (name: NameOfAllah) => {
    const id = nameId(name);
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLearned = (name: NameOfAllah) => {
    const id = nameId(name);
    setLearned((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const overlayTransition = { duration: reduceMotion ? 0 : .2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main
      className="screen reference-names-screen reference-names-screen--complete"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={screenTransition}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Asma’ul Husna</span><h1>Namen Allahs lernen</h1></div>
        <button className="icon-button" onClick={() => { setFilter('favorites'); flash(`${favorites.size} Favoriten`); }} aria-label="Favoriten anzeigen"><Heart size={20} /></button>
      </header>

      <section className="reference-names-hero">
        <span className="reference-names-hero__allah" dir="rtl">الله</span>
        <span className="hero-pill">Asma’ul Husna</span>
        <h2>Eine verbreitete<br />99er-Lernliste.</h2>
        <p>Nutze diese Zusammenstellung zum Lernen. Sie wird nicht als die einzige authentisch festgelegte vollständige Namensliste ausgegeben.</p>
      </section>

      <section className="reference-name-progress glass-card">
        <span className="reference-name-progress__icon"><BookmarkCheck size={22} /></span>
        <span><small>Dein Lernfortschritt</small><strong>{learned.size} von 99 Einträgen gelernt</strong><em>{progress} % dieser Lernliste abgeschlossen</em></span>
        <div className="reference-name-progress__bar"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <section className="reference-prototype-note">
        <ShieldCheck size={16} />
        <span><strong>Quellenstatus transparent</strong><small>Sahih al-Bukhari 7392 und Sahih Muslim 2677a bestätigen die besondere Überlieferung zu 99 Namen, schreiben dort aber keine konkrete 99er-Liste aus. Diese verbreitete Zusammenstellung aus dem Altbestand benötigt deshalb für jeden Eintrag und die Reihenfolge noch eine fachliche Quellenprüfung.</small></span>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Arabisch, Name oder Bedeutung suchen …" />
        <Filter size={17} />
      </label>

      <div className="reference-filter-tabs reference-name-filter-tabs">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Lernliste · 99</button>
        <button className={filter === 'favorites' ? 'is-active' : ''} onClick={() => setFilter('favorites')}>Favoriten · {favorites.size}</button>
        <button className={filter === 'learned' ? 'is-active' : ''} onClick={() => setFilter('learned')}>Gelernt · {learned.size}</button>
      </div>

      {visible.length > 0 ? (
        <section className="reference-name-list reference-name-list--complete">
          {visible.map((name, index) => {
            const id = nameId(name);
            const isFavorite = favorites.has(id);
            const isLearned = learned.has(id);
            return (
              <motion.article key={id} initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .009, .14), ease: [0.22, 1, 0.36, 1] }}>
                <button className="reference-name-list__main" onClick={() => setSelected(name)}>
                  <span className="reference-name-list__number">{String(name.id).padStart(2, '0')}</span>
                  <span className="reference-name-list__arabic" dir="rtl">{name.arabic}</span>
                  <span className="reference-name-list__copy"><strong>{name.latin}</strong><small>{name.meaning}</small></span>
                </button>
                <button className={isLearned ? 'reference-name-state is-active' : 'reference-name-state'} onClick={() => toggleLearned(name)} aria-label={`${name.latin} als gelernt markieren`} aria-pressed={isLearned}><Check size={17} /></button>
                <button className={isFavorite ? 'reference-name-heart is-active' : 'reference-name-heart'} onClick={() => toggleFavorite(name)} aria-label={`${name.latin} als Favorit markieren`} aria-pressed={isFavorite}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
              </motion.article>
            );
          })}
        </section>
      ) : (
        <div className="reference-empty-result"><Sparkles size={25} /><strong>Keine Namen gefunden</strong><small>Ändere Suche oder Filter.</small></div>
      )}

      <AnimatePresence>
        {selected ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onClick={() => setSelected(null)}>
            <motion.section {...nameDialog.props} className="reference-name-modal" initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 9, scale: reduceMotion ? 1 : .99 }} transition={overlayTransition} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setSelected(null)} aria-label="Schließen"><X size={18} /></button>
              <span className="overline">Eintrag {selected.id} von 99 dieser Lernliste</span>
              <p className="reference-name-modal__arabic" dir="rtl">{selected.arabic}</p>
              <h2>{selected.latin}</h2>
              <p className="reference-name-modal__meaning">{selected.meaning}</p>
              <div className="reference-name-modal__notice"><ShieldCheck size={16} /><span>Arabische Form, Transliteration, deutsche Bedeutung und Einordnung dieses Eintrags sind Teil des noch offenen fachlichen Endreviews. Diese Position in der 99er-Lernliste wird nicht als allein verbindliche kanonische Reihenfolge ausgegeben.</span></div>
              <div className="reference-name-modal__actions">
                <button className={favorites.has(nameId(selected)) ? 'is-active' : ''} onClick={() => toggleFavorite(selected)}><Heart size={18} fill={favorites.has(nameId(selected)) ? 'currentColor' : 'none'} /> Favorit</button>
                <button className={learned.has(nameId(selected)) ? 'is-active' : ''} onClick={() => toggleLearned(selected)}><CircleCheck size={18} /> {learned.has(nameId(selected)) ? 'Gelernt' : 'Als gelernt markieren'}</button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .985 }} transition={overlayTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
