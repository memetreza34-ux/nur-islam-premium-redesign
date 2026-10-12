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
import { getNameSourceEvidence, getRelatedNameSourceContext } from '../data/nameSourceEvidence';
import { useDialog } from '../shared/useDialog';

type NameFilter = 'all' | 'favorites' | 'learned';

const nameId = (name: NameOfAllah) => String(name.id);
const validIds = new Set(NAMES_OF_ALLAH.map(nameId));

type NameSelection = {
  values: Set<string>;
  raw: string | null;
  unresolved: (string | number)[];
  readable: boolean;
  issue: string | null;
};

const unresolvedNotice = 'Einige ältere Markierungen sind nicht eindeutig zuordenbar. Sie bleiben gespeichert, werden aber nicht als zugeordnete Namen gezählt.';

function migrateNameSet(key: string): NameSelection {
  try {
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(value => typeof value !== 'string' && typeof value !== 'number')) throw new Error('Invalid name selection');
    const migrated = new Set<string>();
    const unresolved: (string | number)[] = [];

    parsed.forEach((value: string | number) => {
      const candidate = String(value);
      if (validIds.has(candidate)) {
        migrated.add(candidate);
        return;
      }

      const matches = NAMES_OF_ALLAH.filter((entry) => entry.latin === candidate);
      if (matches.length === 1) migrated.add(nameId(matches[0]));
      else unresolved.push(value);
    });

    return { values: migrated, raw, unresolved, readable: true, issue: unresolved.length ? unresolvedNotice : null };
  } catch {
    return { values: new Set(), raw: null, unresolved: [], readable: false, issue: 'Vorhandene Markierungen konnten nicht gelesen werden. Sie werden nicht überschrieben; Änderungen gelten nur für diese Ansicht.' };
  }
}

function writeSet(key: string, current: NameSelection, values: Set<string>): NameSelection {
  const next = { ...current, values };
  if (!current.readable) return next;
  try {
    if (localStorage.getItem(key) !== current.raw) {
      return { ...next, issue: 'Die gespeicherten Markierungen haben sich geändert. Neu öffnen, um sie einzulesen. Änderungen dieser Ansicht sind nicht gespeichert.' };
    }
    const raw = JSON.stringify([...values, ...current.unresolved]);
    localStorage.setItem(key, raw);
    if (localStorage.getItem(key) !== raw) throw new Error('Name selection not persisted');
    return { ...next, raw, issue: current.unresolved.length ? unresolvedNotice : null };
  } catch {
    return { ...next, issue: 'Änderungen konnten nicht dauerhaft gespeichert werden. Bereits gelesene Markierungen bleiben sichtbar; neue Änderungen gelten nur für diese Ansicht.' };
  }
}

export function NamesScreen({ onBack, initialNameId = null }: { onBack: () => void; initialNameId?: string | null }) {
  const initialName = initialNameId ? NAMES_OF_ALLAH.find((entry) => String(entry.id) === initialNameId) ?? null : null;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NameFilter>('all');
  const [favoriteSelection, setFavorites] = useState(() => migrateNameSet('nur_name_favorites'));
  const [learnedSelection, setLearned] = useState(() => migrateNameSet('nur_name_learned'));
  const favorites = favoriteSelection.values;
  const learned = learnedSelection.values;
  const storageIssues = [...new Set([favoriteSelection.issue, learnedSelection.issue].filter(Boolean))];
  const [selected, setSelected] = useState<NameOfAllah | null>(initialName);
  const closeName = useCallback(() => setSelected(null), []);
  const nameDialog = useDialog(Boolean(selected), closeName, selected?.latin);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const selectedEvidence = selected ? getNameSourceEvidence(selected.id) : null;
  const relatedEvidence = selected ? getRelatedNameSourceContext(selected.id) : null;

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
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(writeSet('nur_name_favorites', favoriteSelection, next));
  };

  const toggleLearned = (name: NameOfAllah) => {
    const id = nameId(name);
    const next = new Set(learned);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLearned(writeSet('nur_name_learned', learnedSelection, next));
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
        <div><span className="overline">Asma’ul Husna</span><h1>99 Namen Allahs</h1></div>
        <button className="icon-button" onClick={() => { setFilter('favorites'); flash(favoriteSelection.readable ? `${favorites.size} Favoriten` : 'Favoriten konnten nicht gelesen werden'); }} aria-label="Favoriten anzeigen"><Heart size={20} /></button>
      </header>

      <section className="reference-names-hero">
        <span className="reference-names-hero__allah" dir="rtl">الله</span>
        <span className="hero-pill">Asma’ul Husna</span>
        <h2>Alle 99 Namen<br />an einem Ort.</h2>
        <p>Suche, favorisiere und markiere Namen, die du bereits gelernt hast.</p>
        <p>Verbreitete traditionelle Lernliste. Die feste Auswahl und einzelne Namensformen werden unterschiedlich eingeordnet; nicht jeder Eintrag ist bereits mit einem eigenen Beleg geprüft.</p>
        <p className="reference-name-source"><a href="https://sunnah.com/bukhari:7392" target="_blank" rel="noopener noreferrer">Bukhari 7392</a> und <a href="https://sunnah.com/muslim:2677a" target="_blank" rel="noopener noreferrer">Muslim 2677a</a> erwähnen 99 Namen, zählen sie aber nicht einzeln auf. Die Aufzählung in <a href="https://sunnah.com/tirmidhi:3507" target="_blank" rel="noopener noreferrer">Tirmidhi 3507</a> wird in der verlinkten Ausgabe von Darussalam als Daʿif eingestuft; at-Tirmidhi bezeichnet den Bericht als Gharib. Daraus folgt keine pauschale Ablehnung der einzeln anderweitig belegten Namen.</p>
      </section>

      {storageIssues.length ? <div className="reference-name-modal__notice" role="status"><ShieldCheck size={16} /><span>{storageIssues.join(' ')}</span></div> : null}

      <section className="reference-name-progress glass-card">
        <span className="reference-name-progress__icon"><BookmarkCheck size={22} /></span>
        <span><small>Dein Lernfortschritt</small><strong>{learnedSelection.readable ? `${learned.size} von 99 gelernt` : 'Gespeicherter Lernstand nicht lesbar'}</strong><em>{learnedSelection.readable ? `${progress} % abgeschlossen` : 'Kein bestätigter Lernstand'}</em></span>
        <div className="reference-name-progress__bar"><span style={{ width: `${progress}%` }} /></div>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Arabisch, Name oder Bedeutung suchen …" />
        <Filter size={17} />
      </label>

      <div className="reference-filter-tabs reference-name-filter-tabs">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Alle 99</button>
        <button className={filter === 'favorites' ? 'is-active' : ''} onClick={() => setFilter('favorites')}>Favoriten · {favoriteSelection.readable ? favorites.size : '?'}</button>
        <button className={filter === 'learned' ? 'is-active' : ''} onClick={() => setFilter('learned')}>Gelernt · {learnedSelection.readable ? learned.size : '?'}</button>
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
              <span className="overline">Name {selected.id} von 99</span>
              <p className="reference-name-modal__arabic" dir="rtl">{selected.arabic}</p>
              <h2>{selected.latin}</h2>
              <p className="reference-name-modal__meaning">{selected.meaning}</p>
              {storageIssues.length ? <div className="reference-name-modal__notice" role="status"><ShieldCheck size={16} /><span>{storageIssues.join(' ')}</span></div> : null}
              <div className="reference-name-modal__notice"><ShieldCheck size={16} /><span>Die deutsche Bedeutungsangabe ist eine kurze Erklärung. Sie gibt nicht alle Bedeutungsnuancen des arabischen Namens wieder.</span></div>
              <div className="reference-name-modal__notice reference-name-source">
                <span>{selectedEvidence ? <>Dokumentierte Fundstelle: {selectedEvidence.links.map((link, index) => <span key={link.url}>{index ? ' · ' : ''}<a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></span>)}<br />{selectedEvidence.note}</> : <>Für diese Namensform ist im aktuellen Prüfbestand keine direkte Einzelfundstelle dokumentiert. Das ist kein Urteil, dass die Bezeichnung falsch sei. Die traditionelle Listenform und mögliche Ableitungen sind gesondert zu prüfen.{relatedEvidence ? <><br />Verwandter Beleg, kein direkter Namensbeleg: <a href={relatedEvidence.url} target="_blank" rel="noopener noreferrer">{relatedEvidence.label}</a><br />{relatedEvidence.note}</> : null}</>}<br />Die Umschrift ist eine angenäherte Lesehilfe. Eine Fundstelle allein bestätigt nicht alle Bedeutungsnuancen oder die gesamte Lernliste.</span>
              </div>
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
