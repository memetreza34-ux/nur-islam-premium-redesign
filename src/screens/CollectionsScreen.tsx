import { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DUA_BY_ID } from '../data/duaData';
import { getHadithById, readSavedHadithIds } from '../data/hadithData';
import { NAMES_OF_ALLAH } from '../data/namesOfAllahData';
import { PremiumImage, QuranObject } from '../shared/PremiumVisuals';

const knownSurahLabels: Record<number, string> = {
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

function readNumberSet(key: string, fallback: number[] = [], max = Number.POSITIVE_INFINITY) {
  const values = readUnknownArray(key, fallback);
  const numbers = values
    .map((value) => typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN)
    .filter((value) => Number.isInteger(value) && value > 0 && value <= max);
  return new Set(numbers);
}

function isValidDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function readDateSet(key: string) {
  return new Set(readUnknownArray(key).filter((value): value is string => typeof value === 'string' && isValidDateKey(value)));
}

function writeStringSet(key: string, value: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Speicherung ist in eingeschränkten Browsermodi optional.
  }
}

export function readDuaFavoriteSet() {
  const migrated = new Set<string>();
  readUnknownArray('nur_dua_favorites').forEach((value) => {
    const candidate = String(value);
    if (DUA_BY_ID.has(candidate)) migrated.add(candidate);
    else if (legacyDuaFavorites[candidate]) migrated.add(legacyDuaFavorites[candidate]);
  });
  writeStringSet('nur_dua_favorites', migrated);
  return migrated;
}

export function readNameFavoriteSet() {
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
  return Array.from({ length: 114 }, (_, index) => index + 1)
    .map((surahNumber) => ({
      surahNumber,
      label: knownSurahLabels[surahNumber] ?? `Sure ${surahNumber}`,
      bookmarks: readNumberSet(`nur_quran_bookmarks_${surahNumber}`),
    }))
    .filter((group) => group.bookmarks.size > 0);
}

type CollectionsScreenProps = {
  onBack: () => void;
  onOpenQuran: () => void;
  onOpenReader: (surahNumber: number, ayahNumber?: number) => void;
  onOpenDua: (id: string) => void;
  onOpenName: (id: string) => void;
  onOpenAyah: () => void;
  onOpenHadith: (id: string) => void;
  onOpenCalendarDate: (date: string) => void;
};

export function CollectionsScreen({
  onBack,
  onOpenQuran,
  onOpenReader,
  onOpenDua,
  onOpenName,
  onOpenAyah,
  onOpenHadith,
  onOpenCalendarDate,
}: CollectionsScreenProps) {
  const [filter, setFilter] = useState('Alle');
  const quranBookmarkGroups = useMemo(readQuranBookmarkGroups, []);
  const quranSurahFavorites = useMemo(() => readNumberSet('nur_quran_surah_favorites', [], 114), []);
  const duaFavorites = useMemo(readDuaFavoriteSet, []);
  const nameFavorites = useMemo(readNameFavoriteSet, []);
  const calendarFavorites = useMemo(() => readDateSet('nur_calendar_favorites'), []);
  const ayahSaved = useMemo(() => readBoolean('nur_daily_ayah_saved'), []);
  const hadithFavorites = useMemo(readSavedHadithIds, []);

  const showQuran = filter === 'Alle' || filter === 'Quran';
  const showDuas = filter === 'Alle' || filter === 'Duas';
  const showNames = filter === 'Alle' || filter === 'Namen';
  const showDaily = filter === 'Alle' || filter === 'Tagesinhalte';
  const showDates = filter === 'Alle' || filter === 'Termine';
  const hasQuran = quranBookmarkGroups.length > 0 || quranSurahFavorites.size > 0;
  const hasAny = hasQuran || duaFavorites.size > 0 || nameFavorites.size > 0 || ayahSaved || hadithFavorites.size > 0 || calendarFavorites.size > 0;

  const emptyForFilter = !hasAny
    || (filter === 'Quran' && !hasQuran)
    || (filter === 'Duas' && duaFavorites.size === 0)
    || (filter === 'Namen' && nameFavorites.size === 0)
    || (filter === 'Tagesinhalte' && !ayahSaved && hadithFavorites.size === 0)
    || (filter === 'Termine' && calendarFavorites.size === 0);

  return (
    <motion.main className="screen reference-collections-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Gespeichert</span><h1>Meine Sammlung</h1></div>
        <button
          className="icon-button"
          onClick={() => setFilter('Alle')}
          aria-label="Sammlungsfilter zurücksetzen"
          title="Filter zurücksetzen"
          disabled={filter === 'Alle'}
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="reference-filter-tabs reference-filter-tabs--wide">
        {['Alle', 'Quran', 'Duas', 'Namen', 'Tagesinhalte', 'Termine'].map((item) => (
          <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>

      {showQuran && hasQuran ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Quran</span><h2>Lesezeichen & Suren</h2></div></div>
          <div className="reference-collection-grid">
            <button onClick={onOpenQuran} aria-label="Quran-Sammlung öffnen">
              <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" fallback={<QuranObject />} />
              <span><strong>{quranBookmarkGroups.reduce((sum, group) => sum + group.bookmarks.size, 0)} Ayah-Lesezeichen</strong><small>{quranSurahFavorites.size} Lieblingssuren</small></span>
              <Bookmark size={17} />
            </button>
          </div>
          <div className="reference-collection-rows">
            {quranBookmarkGroups.flatMap((group) => [...group.bookmarks]
              .sort((a, b) => a - b)
              .map((ayahNumber) => (
                <button key={`bookmark-${group.surahNumber}-${ayahNumber}`} onClick={() => onOpenReader(group.surahNumber, ayahNumber)} aria-label={`${group.label} Ayah ${ayahNumber} direkt öffnen`}>
                  <span><BookOpen size={18} /></span>
                  <span><strong>{group.label} · Ayah {ayahNumber}</strong><small>Sure {group.surahNumber}:{ayahNumber} · gespeichertes Lesezeichen</small></span>
                  <ChevronRight size={17} />
                </button>
              )))}
            {[...quranSurahFavorites].sort((a, b) => a - b).map((surahNumber) => (
              <button key={`favorite-${surahNumber}`} onClick={() => onOpenReader(surahNumber, 1)}>
                <span><Sparkles size={18} /></span>
                <span><strong>{knownSurahLabels[surahNumber] ?? `Sure ${surahNumber}`}</strong><small>Lieblingssure · Nummer {surahNumber}</small></span>
                <ChevronRight size={17} />
              </button>
            ))}
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
              return (
                <button key={id} onClick={() => onOpenDua(id)} aria-label={`${dua.title} direkt öffnen`}>
                  <span><Sparkles size={18} /></span><span><strong>{dua.title}</strong><small>{dua.source}</small></span><ChevronRight size={17} />
                </button>
              );
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
              return (
                <button key={id} onClick={() => onOpenName(id)} aria-label={`${name.latin} direkt öffnen`}>
                  <span><Sparkles size={18} /></span><span><strong>{name.latin}</strong><small>{name.meaning}</small></span><ChevronRight size={17} />
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showDaily && (ayahSaved || hadithFavorites.size > 0) ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Tagesinhalte</span><h2>Ayah & Hadithe</h2></div></div>
          <div className="reference-collection-rows">
            {ayahSaved ? <button onClick={onOpenAyah}><span><BookOpen size={18} /></span><span><strong>Al-Ikhlas 112:1</strong><small>Gespeicherte Ayah</small></span><ChevronRight size={17} /></button> : null}
            {[...hadithFavorites].map((id) => {
              const hadith = getHadithById(id);
              if (!hadith) return null;
              return (
                <button key={`hadith-${id}`} onClick={() => onOpenHadith(id)} aria-label={`${hadith.title} direkt öffnen`}>
                  <span><BookOpen size={18} /></span><span><strong>{hadith.title}</strong><small>{hadith.source}</small></span><ChevronRight size={17} />
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showDates && calendarFavorites.size > 0 ? (
        <section className="reference-collection-section">
          <div className="section-heading"><div><span className="overline">Kalender</span><h2>Gespeicherte Tage</h2></div></div>
          <div className="reference-collection-rows">
            {[...calendarFavorites].sort().map((date) => (
              <button key={date} onClick={() => onOpenCalendarDate(date)}>
                <span><CalendarDays size={18} /></span>
                <span><strong>{new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))}</strong><small>Islamischer Kalenderhinweis</small></span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {emptyForFilter ? <div className="reference-empty-result"><Bookmark size={25} /><strong>Noch nichts gespeichert</strong><small>Favorisiere Inhalte in Quran, Duas, Namen, Tagesinhalten oder Kalender.</small></div> : null}
    </motion.main>
  );
}
