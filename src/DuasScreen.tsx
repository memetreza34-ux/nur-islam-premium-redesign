import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  ChevronLeft,
  CircleCheck,
  Copy,
  Filter,
  Heart,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DUA_BY_ID, DUA_CATEGORIES, DUA_CATEGORY_BY_ID, DUAS } from './duaData';
import type { DuaCategoryId, DuaEntry } from './duaData';

type DuaFilter = 'all' | 'favorites' | DuaCategoryId;

const legacyFavoriteMap: Record<number, string> = {
  1: 'dua_guidance_1',
  2: 'dua_protection_1',
  3: 'dua_forgiveness_3',
  4: 'dua_morning_1',
  5: 'dua_morning_2',
};

function readStringSet(key: string, fallback: string[] = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set(fallback);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set(fallback);
    const migrated = parsed
      .map((value) => typeof value === 'number' ? legacyFavoriteMap[value] : value)
      .filter((value): value is string => typeof value === 'string' && DUA_BY_ID.has(value));
    return new Set(migrated);
  } catch {
    return new Set(fallback);
  }
}

function writeStringSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Lokale Speicherung ist in eingeschränkten Browsermodi optional.
  }
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

export function DuasScreen({ onBack, initialDuaId = null }: { onBack: () => void; initialDuaId?: string | null }) {
  const initialDua = initialDuaId ? DUA_BY_ID.get(initialDuaId) ?? null : null;
  const [filter, setFilter] = useState<DuaFilter>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readStringSet('nur_dua_favorites', ['dua_guidance_1']));
  const [viewed, setViewed] = useState(() => {
    const current = readStringSet('nur_dua_viewed');
    if (initialDua) current.add(initialDua.id);
    return current;
  });
  const [selected, setSelected] = useState<DuaEntry | null>(initialDua);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => writeStringSet('nur_dua_favorites', favorites), [favorites]);
  useEffect(() => writeStringSet('nur_dua_viewed', viewed), [viewed]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    return DUAS.filter((dua) => {
      if (filter === 'favorites' && !favorites.has(dua.id)) return false;
      if (filter !== 'all' && filter !== 'favorites' && dua.categoryId !== filter) return false;
      if (!normalized) return true;
      const category = DUA_CATEGORY_BY_ID.get(dua.categoryId)?.title ?? '';
      return `${dua.title} ${dua.arabic} ${dua.transliteration} ${dua.translation} ${dua.source} ${category}`
        .toLocaleLowerCase('de-DE')
        .includes(normalized);
    });
  }, [favorites, filter, query]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openDua = (dua: DuaEntry) => {
    setSelected(dua);
    setViewed((current) => new Set(current).add(dua.id));
  };

  const shareDua = async (dua: DuaEntry) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\nSinngemäße Bedeutung: ${dua.translation}\n\nQuelle im Altbestand: ${dua.source}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: dua.title, text });
        flash('Dua geteilt');
      } else {
        await copyText(text);
        flash('Dua kopiert');
      }
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  const activeLabel = filter === 'all'
    ? 'Alle Kategorien'
    : filter === 'favorites'
      ? 'Favoriten'
      : DUA_CATEGORY_BY_ID.get(filter)?.title ?? 'Duas';

  return (
    <motion.main
      className="screen reference-duas-screen reference-duas-screen--complete"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Bittgebete</span><h1>Duas</h1></div>
        <button className="icon-button" onClick={() => { setFilter('favorites'); flash(`${favorites.size} Favoriten`); }} aria-label="Favoriten anzeigen"><Heart size={20} /></button>
      </header>

      <section className="reference-duas-hero">
        <span className="reference-duas-hero__ornament" aria-hidden="true">۞</span>
        <span className="hero-pill">34 Duas · 13 Bereiche</span>
        <h2>Für viele Momente<br />des Alltags.</h2>
        <p>Arabischer Text, Transliteration, sinngemäße deutsche Bedeutung und sichtbarer Quellenhinweis.</p>
      </section>

      <section className="reference-dua-progress glass-card">
        <span><BookOpenCheck size={21} /></span>
        <div><small>Bereits geöffnet</small><strong>{viewed.size} von {DUAS.length} Duas</strong><em>{favorites.size} Favoriten gespeichert</em></div>
        <div className="reference-dua-progress__bar"><span style={{ width: `${Math.round((viewed.size / DUAS.length) * 100)}%` }} /></div>
      </section>

      <section className="reference-prototype-note">
        <ShieldCheck size={16} />
        <span><strong>Vollständiger Altbestand migriert</strong><small>Die 34 Einträge sind funktional eingebunden. Arabischer Text, Transliteration, Bedeutungsangaben und Quellenhinweise werden vor Veröffentlichung einzeln fachlich geprüft.</small></span>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Dua, Bedeutung oder Quelle suchen …" />
        <Filter size={17} />
      </label>

      <div className="reference-filter-tabs reference-dua-filter-tabs" role="tablist" aria-label="Dua-Kategorien">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Alle · {DUAS.length}</button>
        <button className={filter === 'favorites' ? 'is-active' : ''} onClick={() => setFilter('favorites')}>Favoriten · {favorites.size}</button>
        {DUA_CATEGORIES.map((category) => {
          const count = DUAS.filter((dua) => dua.categoryId === category.id).length;
          return <button key={category.id} className={filter === category.id ? 'is-active' : ''} onClick={() => setFilter(category.id)}>{category.shortTitle} · {count}</button>;
        })}
      </div>

      <div className="reference-dua-results-label"><span>{activeLabel}</span><small>{visible.length} Einträge</small></div>

      {visible.length ? (
        <section className="reference-dua-grid reference-dua-grid--complete">
          {visible.map((dua, index) => {
            const category = DUA_CATEGORY_BY_ID.get(dua.categoryId);
            const isFavorite = favorites.has(dua.id);
            const wasViewed = viewed.has(dua.id);
            return (
              <motion.article key={dua.id} className="reference-dua-card reference-dua-card--complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .018, .24) }}>
                <div className="reference-dua-card__top">
                  <span><Sparkles size={15} /> {category?.title}</span>
                  <button className={isFavorite ? 'is-favorite' : ''} onClick={() => toggleFavorite(dua.id)} aria-label={`${dua.title} als Favorit markieren`} aria-pressed={isFavorite}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
                </div>
                <button className="reference-dua-card__content" onClick={() => openDua(dua)}>
                  <span className={wasViewed ? 'reference-dua-viewed is-viewed' : 'reference-dua-viewed'}><CircleCheck size={14} /> {wasViewed ? 'Gelesen' : 'Öffnen'}</span>
                  <h2>{dua.title}</h2>
                  <p className="reference-dua-card__arabic" dir="rtl">{dua.arabic}</p>
                  <blockquote><small>Sinngemäße Bedeutung</small>{dua.translation}</blockquote>
                </button>
                <footer><small>{dua.source}</small><button onClick={() => shareDua(dua)}><Share2 size={16} /> Teilen</button></footer>
              </motion.article>
            );
          })}
        </section>
      ) : (
        <div className="reference-empty-result"><Search size={25} /><strong>Keine Dua gefunden</strong><small>Ändere Suche oder Kategorie.</small></div>
      )}

      <AnimatePresence>
        {selected ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.section className="reference-dua-modal" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setSelected(null)} aria-label="Schließen"><X size={18} /></button>
              <span className="overline">{DUA_CATEGORY_BY_ID.get(selected.categoryId)?.title}</span>
              <h2>{selected.title}</h2>
              <p className="reference-dua-modal__arabic" dir="rtl">{selected.arabic}</p>
              <section><small>Transliteration</small><p>{selected.transliteration}</p></section>
              <section><small>Sinngemäße Bedeutung</small><p>{selected.translation}</p></section>
              <div className="reference-dua-modal__source"><ShieldCheck size={16} /><span><small>Quellenhinweis aus dem Altbestand</small><strong>{selected.source}</strong><em>Fachliche Einzelprüfung vor Veröffentlichung ausstehend.</em></span></div>
              <div className="reference-dua-modal__actions">
                <button className={favorites.has(selected.id) ? 'is-active' : ''} onClick={() => toggleFavorite(selected.id)}><Heart size={18} fill={favorites.has(selected.id) ? 'currentColor' : 'none'} /> Favorit</button>
                <button onClick={() => copyText(selected.arabic).then(() => flash('Arabischer Text kopiert')).catch(() => flash('Kopieren war nicht möglich'))}><Copy size={18} /> Kopieren</button>
                <button onClick={() => shareDua(selected)}><Share2 size={18} /> Teilen</button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
