import { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Filter,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DUA_BY_ID } from './duaData';
import { NAMES_OF_ALLAH } from './namesOfAllahData';
import { PremiumImage, MosqueScene, QuranObject } from './PremiumVisuals';

const mosques = [
  ['Şehitlik-Moschee', 'Columbiadamm, Berlin', '2,1 km'],
  ['Ibn-Rushd-Goethe-Moschee', 'Moabit, Berlin', '3,8 km'],
  ['Dar Assalam Moschee', 'Neukölln, Berlin', '5,4 km'],
  ['Mevlana Moschee', 'Kreuzberg, Berlin', '6,2 km'],
  ['Islamisches Kulturzentrum', 'Tempelhof, Berlin', '7,1 km'],
];

function readStringSet(key: string, fallback: string[] = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : fallback;
    if (!Array.isArray(parsed)) return new Set(fallback);
    return new Set(parsed.filter((value): value is string => typeof value === 'string'));
  } catch {
    return new Set(fallback);
  }
}

function readNumberSet(key: string, fallback: number[] = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : fallback;
    if (!Array.isArray(parsed)) return new Set(fallback);
    return new Set(parsed.filter((value): value is number => typeof value === 'number'));
  } catch {
    return new Set(fallback);
  }
}

function readBoolean(key: string) {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function Toast({ message }: { message: string | null }) {
  return <AnimatePresence>{message ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {message}</motion.div> : null}</AnimatePresence>;
}

export function MosqueScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const visible = mosques.filter(([name, address]) => `${name} ${address}`.toLowerCase().includes(query.toLowerCase()));
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  return (
    <motion.main className="screen reference-mosque-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack}><ChevronLeft size={20} /></button>
        <div><span className="overline">In deiner Nähe</span><h1>Moschee-Finder</h1></div>
        <button className="icon-button" onClick={() => flash('Standort aktualisiert')}><LocateFixed size={20} /></button>
      </header>

      <section className="reference-mosque-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mosque-gold-v2.webp" fallback={<MosqueScene />} />
        <div><span className="hero-pill">Berlin</span><h2>Finde einen Ort<br />für dein Gebet.</h2><p>Moscheen im Umkreis mit Entfernung, Adresse und direkter Navigation.</p></div>
      </section>

      <section className="reference-prototype-note"><ShieldCheck size={16} /><span><strong>Beispieldaten im Prototyp</strong><small>Entfernungen und Gebetszeiten werden vor Veröffentlichung durch eine Live-Karten- und Moscheequelle ersetzt.</small></span></section>

      <label className="reference-input-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Moschee suchen …" /><Filter size={17} /></label>

      <div className="reference-nearby-label"><span><Navigation size={15} /> Nahe deinem Standort</span><button onClick={() => flash('Kartenansicht geöffnet')}><Map size={16} /> Karte</button></div>

      <section className="reference-mosque-list">
        {visible.map(([name, address, distance], index) => (
          <motion.button key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} onClick={() => flash(`${name} geöffnet`)}>
            <span className="reference-mosque-list__pin"><MapPin size={20} /></span>
            <span><strong>{name}</strong><small>{address}</small><em>Demo-Zeitplan · Dhuhr 12:45</em></span>
            <span className="reference-mosque-distance">{distance}</span>
            <ChevronRight size={18} />
          </motion.button>
        ))}
      </section>

      <button className="reference-map-button" onClick={() => flash('Kartenansicht geöffnet')}><Map size={18} /> Auf der Karte anzeigen</button>
      <Toast message={toast} />
    </motion.main>
  );
}

export function CollectionsScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState('Alle');
  const [toast, setToast] = useState<string | null>(null);
  const quranBookmarks = useMemo(() => readNumberSet('nur_quran_bookmarks_112'), []);
  const duaFavorites = useMemo(() => readStringSet('nur_dua_favorites'), []);
  const nameFavorites = useMemo(() => readStringSet('nur_name_favorites'), []);
  const calendarFavorites = useMemo(() => readStringSet('nur_calendar_favorites'), []);
  const ayahSaved = useMemo(() => readBoolean('nur_daily_ayah_saved'), []);
  const hadithSaved = useMemo(() => readBoolean('nur_daily_hadith_saved'), []);
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  const showQuran = filter === 'Alle' || filter === 'Quran';
  const showDuas = filter === 'Alle' || filter === 'Duas';
  const showNames = filter === 'Alle' || filter === 'Namen';
  const showHadith = filter === 'Alle' || filter === 'Hadith';
  const showDates = filter === 'Alle' || filter === 'Termine';
  const hasAny = quranBookmarks.size > 0 || duaFavorites.size > 0 || nameFavorites.size > 0 || ayahSaved || hadithSaved || calendarFavorites.size > 0;

  const emptyForFilter = !hasAny
    || (filter === 'Quran' && quranBookmarks.size === 0)
    || (filter === 'Duas' && duaFavorites.size === 0)
    || (filter === 'Namen' && nameFavorites.size === 0)
    || (filter === 'Hadith' && !ayahSaved && !hadithSaved)
    || (filter === 'Termine' && calendarFavorites.size === 0);

  return (
    <motion.main className="screen reference-collections-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack}><ChevronLeft size={20} /></button>
        <div><span className="overline">Gespeichert</span><h1>Meine Sammlung</h1></div>
        <button className="icon-button" onClick={() => flash('Sammlung aktualisiert')}><Search size={20} /></button>
      </header>

      <div className="reference-filter-tabs reference-filter-tabs--wide">
        {['Alle', 'Quran', 'Duas', 'Namen', 'Hadith', 'Termine'].map((item) => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>

      {showQuran && quranBookmarks.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Quran</span><h2>Lesezeichen</h2></div></div>
          <div className="reference-collection-grid">
            <button onClick={() => flash('Al-Ikhlas geöffnet')}><PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} /><span><strong>Al-Ikhlas</strong><small>{quranBookmarks.size} gespeicherte Ayat</small></span><Bookmark size={17} /></button>
          </div>
        </section>
      ) : null}

      {showDuas && duaFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Duas</span><h2>Favoriten</h2></div></div>
          <div className="reference-collection-rows">
            {[...duaFavorites].map((id) => {
              const dua = DUA_BY_ID.get(id);
              return <button key={id} onClick={() => flash(`${dua?.title ?? 'Dua'} geöffnet`)}><span><Sparkles size={18} /></span><span><strong>{dua?.title ?? id}</strong><small>{dua?.source ?? 'Gespeicherte Dua'}</small></span><ChevronRight size={17} /></button>;
            })}
          </div>
        </section>
      ) : null}

      {showNames && nameFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Asma’ul Husna</span><h2>Lieblingsnamen</h2></div></div>
          <div className="reference-collection-rows">
            {[...nameFavorites].map((latin) => {
              const name = NAMES_OF_ALLAH.find((entry) => entry.latin === latin);
              return <button key={latin} onClick={() => flash(`${latin} geöffnet`)}><span><Sparkles size={18} /></span><span><strong>{latin}</strong><small>{name?.meaning ?? 'Gespeicherter Name'}</small></span><ChevronRight size={17} /></button>;
            })}
          </div>
        </section>
      ) : null}

      {showHadith && (ayahSaved || hadithSaved) ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Tagesinhalte</span><h2>Ayah & Hadith</h2></div></div>
          <div className="reference-collection-rows">
            {ayahSaved ? <button onClick={() => flash('Ayah des Tages geöffnet')}><span><BookOpen size={18} /></span><span><strong>Al-Ikhlas 112:1</strong><small>Ayah des Tages</small></span><ChevronRight size={17} /></button> : null}
            {hadithSaved ? <button onClick={() => flash('Hadith geöffnet')}><span><BookOpen size={18} /></span><span><strong>Taten nach den Absichten</strong><small>Sahih al-Bukhari 1</small></span><ChevronRight size={17} /></button> : null}
          </div>
        </section>
      ) : null}

      {showDates && calendarFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Kalender</span><h2>Gespeicherte Tage</h2></div></div>
          <div className="reference-collection-rows">
            {[...calendarFavorites].map((date) => <button key={date} onClick={() => flash(`${date} geöffnet`)}><span><CalendarDays size={18} /></span><span><strong>{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))}</strong><small>Islamischer Kalenderhinweis</small></span><ChevronRight size={17} /></button>)}
          </div>
        </section>
      ) : null}

      {emptyForFilter ? <div className="reference-empty-result"><Bookmark size={25} /><strong>Noch nichts gespeichert</strong><small>Favorisiere Inhalte in Quran, Duas, Namen, Hadith oder Kalender.</small></div> : null}

      <Toast message={toast} />
    </motion.main>
  );
}
