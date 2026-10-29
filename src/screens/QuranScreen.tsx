import { useScreenState } from '../shared/ScreenState';
import { SourceInfo } from '../shared/SourceInfo';
import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  BookHeart,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  Search,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PremiumImage } from '../shared/PremiumVisuals';
import { MihrabArch } from '../shared/MihrabArch';
import {
  fetchSurahs,
  OFFLINE_QURAN_SURAHS,
} from '../services/quranService';
import type { Surah } from '../services/quranService';

type QuranFilter = 'all' | 'favorites';

type LastRead = {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: string;
};

function readNumberSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    const values = Array.isArray(parsed) ? parsed : [];
    const valid = values
      .map((value) => typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN)
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 114);
    return new Set(valid);
  } catch {
    return new Set<number>();
  }
}

function readLastRead(): LastRead | null {
  try {
    const raw = localStorage.getItem('nur_quran_last_read');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastRead>;
    if (
      typeof parsed.surahNumber !== 'number'
      || !Number.isInteger(parsed.surahNumber)
      || parsed.surahNumber < 1
      || parsed.surahNumber > 114
      || typeof parsed.ayahNumber !== 'number'
      || !Number.isInteger(parsed.ayahNumber)
      || parsed.ayahNumber < 1
    ) return null;
    return {
      surahNumber: parsed.surahNumber,
      ayahNumber: parsed.ayahNumber,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

function persistSet(key: string, value: Set<number>) {
  try { localStorage.setItem(key, JSON.stringify([...value])); } catch { /* optional */ }
}

export function QuranScreen({
  onOpenReader,
  onOpenAyah,
}: {
  onOpenReader: (surahNumber: number, ayahNumber?: number) => void;
  onOpenAyah: () => void;
}) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [query, setQuery] = useScreenState('quran.query', '');
  const [savedFilter, setFilter] = useScreenState<QuranFilter>('quran.filter', 'all');
  const filter = savedFilter === 'favorites' ? 'favorites' : 'all';
  const [favorites, setFavorites] = useState(() => readNumberSet('nur_quran_surah_favorites'));
  const [lastRead] = useState(readLastRead);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchSurahs()
      .then((items) => {
        if (!active) return;
        setSurahs(items);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Die Surenliste konnte nicht geladen werden.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [reloadToken]);

  useEffect(() => persistSet('nur_quran_surah_favorites', favorites), [favorites]);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    return surahs.filter((surah) => {
      if (filter === 'favorites' && !favorites.has(surah.number)) return false;
      if (!normalized) return true;
      return `${surah.number} ${surah.name} ${surah.englishName} ${surah.englishNameTranslation}`
        .toLocaleLowerCase('de-DE')
        .includes(normalized);
    });
  }, [favorites, filter, query, surahs]);

  const lastSurah = lastRead
    ? surahs.find((surah) => surah.number === lastRead.surahNumber)
    : surahs.find((surah) => surah.number === 1);
  const lastAyah = lastRead && lastSurah ? Math.min(lastRead.ayahNumber, lastSurah.numberOfAyahs) : 1;
  const readerSurahNumber = lastSurah?.number ?? lastRead?.surahNumber ?? 1;

  const toggleFavorite = (number: number) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
  };

  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main
      className="screen reference-quran-screen reference-quran-screen--complete"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={screenTransition}
    >
      <header className="reference-screen-header reference-screen-header--banner">
        <span aria-hidden="true" />
        <div><span className="overline">Quran-Bibliothek</span><h1>Quran</h1></div>
        <SourceInfo title="Lesen & Offline">
          <p>Lies jede Sure versweise oder auf Buchseiten. Alle {OFFLINE_QURAN_SURAHS.length} Suren sind arabisch mitgeliefert. Aussprachehilfe und deutsche Übersetzung werden separat geladen. Leseseiten und geladene Texte werden lokal gespeichert, sofern dein Browser Speicherung erlaubt. Gelöschte Browserdaten entfernen auch gespeicherte Texte und Lesestellen.</p>
        </SourceInfo>
      </header>

      <section className="quran-focus" aria-label="Quran-Lesestand">
        <MihrabArch
          overline={lastRead ? 'Deine Lesestelle' : 'Quran lesen'}
          title={`Sure ${readerSurahNumber}`}
          titleArabic={lastSurah?.name}
          value={lastSurah?.englishName ?? (lastRead ? `Sure ${readerSurahNumber}` : 'Al-Faatiha')}
          valueAs="display"
          meta={lastRead && lastSurah ? <span id="quran-resume-position">Ayah {lastAyah} von {lastSurah.numberOfAyahs}</span> : undefined}
          progress={0}
          height={250}
          className="quran-reading-arch"
          backdropSrc="/premium-assets/high-res-objects/quran-garden-hero-v2.webp"
        />
        <button className="gold-button quran-resume" onClick={() => onOpenReader(readerSurahNumber, lastAyah)} aria-describedby={lastRead && lastSurah ? 'quran-resume-position' : undefined}>
          {lastRead ? 'Weiterlesen' : 'Lesen beginnen'}<ChevronRight size={18} aria-hidden="true" />
        </button>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input aria-label="Suren suchen" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sure oder Nummer suchen …" />
      </label>

      <div className="reference-filter-tabs reference-quran-filter-tabs" role="group" aria-label="Suren filtern">
        <button className={filter === 'all' ? 'is-active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Alle</button>
        <button className={filter === 'favorites' ? 'is-active' : ''} aria-pressed={filter === 'favorites'} onClick={() => setFilter('favorites')}>Favoriten</button>
      </div>

      {!loading && !error && query.trim() ? <div className="reference-quran-results" role="status"><small>{visible.length} {visible.length === 1 ? 'Sure gefunden' : 'Suren gefunden'}</small></div> : null}

      {loading ? (
        <div className="reference-quran-loading"><LoaderCircle size={24} className="is-spinning" /><strong>Surenliste wird geladen</strong></div>
      ) : error ? (
        <div className="reference-empty-result"><WifiOff size={25} /><strong>Quran-Verzeichnis nicht verfügbar</strong><small>{error}</small><button className="reference-inline-button" onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={16} /> Erneut versuchen</button></div>
      ) : visible.length ? (
        <section className="reference-quran-catalog">
          <div className="reference-quran-list reference-quran-list--catalog">
            {visible.map((surah, index) => {
              const favorite = favorites.has(surah.number);
              return (
                <motion.article
                  key={surah.number}
                  className="reference-quran-surah-card"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .006, .12), ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    className="reference-quran-list__main"
                    onClick={() => onOpenReader(surah.number, 1)}
                    aria-label={`Sure ${surah.number}: ${surah.englishName}, ${surah.numberOfAyahs} Ayat öffnen`}
                  >
                    <span className="reference-quran-list__number" aria-hidden="true"><b>{surah.number}</b></span>
                    <span className="reference-quran-list__copy">
                      <strong>{surah.englishName}</strong>
                      <small>
                        <span>{surah.numberOfAyahs} Ayat</span>
                        <span className="reference-quran-list__arabic" lang="ar" dir="rtl">{surah.name.replace('سُورَةُ ', '')}</span>
                      </small>
                    </span>
                  </button>
                  <button className={favorite ? 'reference-quran-favorite is-active' : 'reference-quran-favorite'} onClick={() => toggleFavorite(surah.number)} aria-label={`${surah.englishName} als Favorit markieren`} aria-pressed={favorite}>{favorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button>
                </motion.article>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="reference-empty-result">{filter === 'favorites' && !query.trim() ? <><BookHeart size={25} /><strong>Noch keine Lieblingssuren</strong><small>Tippe auf das Lesezeichen neben einer Sure.</small></> : <><Search size={25} /><strong>Keine Sure gefunden</strong><small>Ändere Suche oder Filter.</small></>}</div>
      )}

      <button className="verse-card verse-card--cream reference-daily-card-button quran-daily-ayah" onClick={onOpenAyah} aria-label="Ayah des Tages – Details öffnen">
        <PremiumImage src="/premium-assets/high-res-objects/ayah-oasis-card-v1.webp" className="daily-ayah__backdrop" fallback={null} />
        <div className="card-title-row"><span><Sparkles size={16} /> Ayah des Tages</span><span><BookHeart size={18} /></span></div>
        <p className="arabic-verse" lang="ar" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
        <span className="daily-ayah__meaning-label">Sinngemäße Bedeutung</span>
        <blockquote>Sprich: Allah ist Einer.</blockquote>
        <footer>Al-Ikhlas · 112:1</footer>
      </button>


    </motion.main>
  );
}
