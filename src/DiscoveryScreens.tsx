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
import { OFFLINE_QURAN_SURAHS } from './quranService';

const mosques = [
  ['Şehitlik-Moschee', 'Columbiadamm, Berlin', '2,1 km'],
  ['Ibn-Rushd-Goethe-Moschee', 'Moabit, Berlin', '3,8 km'],
  ['Dar Assalam Moschee', 'Neukölln, Berlin', '5,4 km'],
  ['Mevlana Moschee', 'Kreuzberg, Berlin', '6,2 km'],
  ['Islamisches Kulturzentrum', 'Tempelhof, Berlin', '7,1 km'],
];

const offlineSurahLabels: Record<number, string> = {
  1: 'Al-Faatiha',
  112: 'Al-Ikhlaas',
  113: 'Al-Falaq',
  114: 'An-Naas',
};

const legacyDuaFavorites: Record<string, string> = {
  '1': 'dua_guidance_1',
  '2': 'dua_protection_1',
  '3': 'dua_forgiveness_3',
  '4': 'dua_morning_1',
  '5': 'dua_morning_2',
};

function readUnknownArray(key: string, fallback: unknown[] = []) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readStringSet(key: string, fallback: string[] = []) {
  return new Set(readUnknownArray(key, fallback).filter((value): value is string => typeof value === 'string'));
}

function readNumberSet(key: string, fallback: number[] = []) {
  const values = readUnknownArray(key, fallback);
  const numbers = values
    .map((value) => typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN)
    .filter((value) => Number.isInteger(value) && value > 0);
  return new Set(numbers);
}

function writeStringSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Speicherung ist in eingeschränkten Browsermodi optional.
  }
}

function readDuaFavoriteSet() {
  const migrated = new Set<string>();
  readUnknownArray('nur_dua_favorites').forEach((value) => {
    const candidate = String(value);
    if (DUA_BY_ID.has(candidate)) migrated.add(candidate);
    else if (legacyDuaFavorites[candidate]) migrated.add(legacyDuaFavorites[candidate]);
  });
  writeStringSet('nur_dua_favorites', migrated);
  return migrated;
}

function readNameFavoriteSet() {
  const migrated = new Set<string>();
  readUnknownArray('nur_name_favorites').forEach((value) => {
    const candidate = String(value);
    const byId = NAMES_OF_ALLAH.find((entry) => String(entry.id) === candidate);
    if (byId) {
      migrated.add(String(byId.id));
      return;
    }

    const legacy = NAMES_OF_ALLAH.find((entry) => entry.latin === candidate);
    if (legacy) migrated.add(String(legacy.id));
  });
  writeStringSet('nur_name_favorites', migrated);
  return migrated;
}

function readBoolean(key: string) {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function readQuranBookmarkGroups() {
  return OFFLINE_QURAN_SURAHS
    .map((surahNumber) => ({
      surahNumber,
      label: offlineSurahLabels[surahNumber] ?? `Sure ${surahNumber}`,
      bookmarks: readNumberSet(`nur_quran_bookmarks_${surahNumber}`),
    }))
    .filter((group) => group.bookmarks.size > 0);
}

function Toast({ message }: { message: string | null }) {
  return <AnimatePresence>{message ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {message}</motion.div> : null}</AnimatePresence>;
}

export function MosqueScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const visible = mosques.filter(([name, address]) => `${name} ${address}`.toLocaleLowerCase('de-DE').includes(query.toLocaleLowerCase('de-DE')));
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  return (
    <motion.main className="screen reference-mosque-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">In deiner Nähe</span><h1>Moschee-Finder</h1></div>
        <button className="icon-button" onClick={() => flash('Standortaktualisierung folgt mit der Live-Kartenquelle')} aria-label="Standort aktualisieren"><LocateFixed size={20} /></button>
      </header>

      <section className="reference-mosque-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mosque-gold-v2.webp" fallback={<MosqueScene />} />
        <div><span className="hero-pill">Berlin</span><h2>Finde einen Ort<br />für dein Gebet.</h2><p>Moscheen im Umkreis mit Entfernung, Adresse und direkter Navigation.</p></div>
      </section>

      <section className="reference-prototype-note"><ShieldCheck size={16} /><span><strong>Beispieldaten im Prototyp</strong><small>Entfernungen und Gebetszeiten werden vor Veröffentlichung durch eine Live-Karten- und Moscheequelle ersetzt.</small></span></section>

      <label className="reference-input-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Moschee suchen …" /><Filter size={17} /></label>

      <div className="reference-nearby-label"><span><Navigation size={15} /> Nahe deinem Standort</span><button onClick={() => flash('Live-Kartenansicht noch nicht verbunden')}><Map size={16} /> Karte</button></div>

      <section className="reference-mosque-list">
        {visible.map(([name, address, distance], index) => (
          <motion.button key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} onClick={() => flash(`${name}: Demo-Eintrag`)}>
            <span className="reference-mosque-list__pin"><MapPin size={20} /></span>
            <span><strong>{name}</strong><small>{address}</small><em>Demo-Zeitplan · Dhuhr 12:45</em></span>
            <span className="reference-mosque-distance">{distance}</span>
            <ChevronRight size={18} />
          </motion.button>
        ))}
      </section>

      {!visible.length ? <div className="reference-empty-result"><Search size={24} /><strong>Keine Moschee gefunden</strong><small>Ändere den Suchbegriff.</small></div> : null}
      <button className="reference-map-button" onClick={() => flash('Live-Kartenansicht noch nicht verbunden')}><Map size={18} /> Auf der Karte anzeigen</button>
      <Toast message={toast} />
    </motion.main>
  );
}

export function CollectionsScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState('Alle');
  const [toast, setToast] = useState<string | null>(null);
  const quranBookmarkGroups = useMemo(readQuranBookmarkGroups, []);
  const quranSurahFavorites = useMemo(() => readNumberSet('nur_quran_surah_favorites'), []);
  const duaFavorites = useMemo(readDuaFavoriteSet, []);
  const nameFavorites = useMemo(readNameFavoriteSet, []);
  const calendarFavorites = useMemo(() => readStringSet('nur_calendar_favorites'), []);
  const ayahSaved = useMemo(() => readBoolean('nur_daily_ayah_saved'), []);
  const hadithSaved = useMemo(() => readBoolean('nur_daily_hadith_saved'), []);
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  const showQuran = filter === 'Alle' || filter === 'Quran';
  const showDuas = filter === 'Alle' || filter === 'Duas';
  const showNames = filter === 'Alle' || filter === 'Namen';
  const showHadith = filter === 'Alle' || filter === 'Hadith';
  const showDates = filter === 'Alle' || filter === 'Termine';
  const hasQuran = quranBookmarkGroups.length > 0 || quranSurahFavorites.size > 0;
  const hasAny = hasQuran || duaFavorites.size > 0 || nameFavorites.size > 0 || ayahSaved || hadithSaved || calendarFavorites.size > 0;

  const emptyForFilter = !hasAny
    || (filter === 'Quran' && !hasQuran)
    || (filter === 'Duas' && duaFavorites.size === 0)
    || (filter === 'Namen' && nameFavorites.size === 0)
    || (filter === 'Hadith' && !ayahSaved && !hadithSaved)
    || (filter === 'Termine' && calendarFavorites.size === 0);

  return (
    <motion.main className="screen reference-collections-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Gespeichert</span><h1>Meine Sammlung</h1></div>
        <button className="icon-button" onClick={() => flash('Sammlung ist aktuell')} aria-label="Sammlung aktualisieren"><Search size={20} /></button>
      </header>

      <div className="reference-filter-tabs reference-filter-tabs--wide">
        {['Alle', 'Quran', 'Duas', 'Namen', 'Hadith', 'Termine'].map((item) => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>

      {showQuran && hasQuran ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Quran</span><h2>Lesezeichen & Suren</h2></div></div>
          <div className="reference-collection-grid">
            <button onClick={() => flash('Quran-Sammlung geöffnet')}><PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} /><span><strong>{quranBookmarkGroups.reduce((sum, group) => sum + group.bookmarks.size, 0)} Ayah-Lesezeichen</strong><small>{quranSurahFavorites.size} Lieblingssuren</small></span><Bookmark size={17} /></button>
          </div>
          <div className="reference-collection-rows">
            {quranBookmarkGroups.map((group) => <button key={`bookmark-${group.surahNumber}`} onClick={() => flash(`${group.label} geöffnet`)}><span><BookOpen size={18} /></span><span><strong>{group.label}</strong><small>Sure {group.surahNumber} · {group.bookmarks.size} gespeicherte Ayat</small></span><ChevronRight size={17} /></button>)}
            {[...quranSurahFavorites].map((surahNumber) => <button key={`favorite-${surahNumber}`} onClick={() => flash(`${offlineSurahLabels[surahNumber] ?? `Sure ${surahNumber}`} geöffnet`)}><span><Sparkles size={18} /></span><span><strong>{offlineSurahLabels[surahNumber] ?? `Sure ${surahNumber}`}</strong><small>Lieblingssure · Nummer {surahNumber}</small></span><ChevronRight size={17} /></button>)}
          </div>
        </section>
      ) : null}

      {showDuas && duaFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Duas</span><h2>Favoriten</h2></div></div>
          <div className="reference-collection-rows">
            {[...duaFavorites].map((id) => {
              const dua = DUA_BY_ID.get(id);
              if (!dua) return null;
              return <button key={id} onClick={() => flash(`${dua.title} geöffnet`)}><span><Sparkles size={18} /></span><span><strong>{dua.title}</strong><small>{dua.source}</small></span><ChevronRight size={17} /></button>;
            })}
          </div>
        </section>
      ) : null}

      {showNames && nameFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Asma’ul Husna</span><h2>Lieblingsnamen</h2></div></div>
          <div className="reference-collection-rows">
            {[...nameFavorites].map((id) => {
              const name = NAMES_OF_ALLAH.find((entry) => String(entry.id) === id);
              if (!name) return null;
              return <button key={id} onClick={() => flash(`${name.latin} geöffnet`)}><span><Sparkles size={18} /></span><span><strong>{name.latin}</strong><small>{name.meaning}</small></span><ChevronRight size={17} /></button>;
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
