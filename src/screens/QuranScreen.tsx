import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  BookHeart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CloudDownload,
  Filter,
  Heart,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MihrabArch } from '../shared/MihrabArch';
import { PremiumImage } from '../shared/PremiumVisuals';
import {
  fetchSurahs,
  OFFLINE_QURAN_SURAH_SET,
  OFFLINE_QURAN_SURAHS,
} from '../services/quranService';
import type { Surah } from '../services/quranService';

type QuranFilter = 'all' | 'offline' | 'favorites';

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
  onBack,
  onOpenReader,
  onOpenAyah,
}: {
  onBack: () => void;
  onOpenReader: (surahNumber: number, ayahNumber?: number) => void;
  onOpenAyah: () => void;
}) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<QuranFilter>('all');
  const [favorites, setFavorites] = useState(() => readNumberSet('nur_quran_surah_favorites'));
  const [lastRead] = useState(readLastRead);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
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
  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const flash = (message: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    return surahs.filter((surah) => {
      if (filter === 'offline' && !OFFLINE_QURAN_SURAH_SET.has(surah.number)) return false;
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
  const toastTransition = { duration: reduceMotion ? 0 : .2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main
      className="screen reference-quran-screen reference-quran-screen--complete"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={screenTransition}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Quran-Bibliothek</span><h1>Quran</h1></div>
        <button className="icon-button" onClick={() => { setFilter('favorites'); flash(`${favorites.size} Lieblingssuren`); }} aria-label="Lieblingssuren"><Heart size={20} /></button>
      </header>

      <section className="quran-focus" aria-label="Quran-Lesestand">
        {/* Same arch as Prayer, measuring the reading position instead of time. */}
        <MihrabArch
          overline={lastRead ? 'Weiterlesen' : 'Quran beginnen'}
          title={lastSurah ? `Sure ${readerSurahNumber}` : 'Sure 1'}
          titleArabic={lastSurah?.name}
          value={lastSurah?.englishName ?? 'Al-Faatiha'}
          valueAs="display"
          meta={lastRead && lastSurah
            ? `Ayah ${lastAyah} von ${lastSurah.numberOfAyahs}`
            : 'Noch kein Lesestand'}
          progress={lastRead && lastSurah ? Math.min(100, Math.max(1, (lastAyah / lastSurah.numberOfAyahs) * 100)) : 0}
          height={230}
          backdropSrc="/premium-assets/high-res-objects/home-prayer-sky-v1.webp"
        />
        <button className="gold-button" onClick={() => onOpenReader(readerSurahNumber, lastAyah)}>{lastRead ? 'Weiterlesen' : 'Lesen beginnen'} <ChevronRight size={16} /></button>
      </section>

      <section className="reference-quran-library-status glass-card">
        <div aria-hidden="true"><PremiumImage src="/premium-assets/high-res-objects/mini-quran-v1.webp" className="quran-directory-art" fallback={<BookOpen size={21} />} /></div>
        <div><small>Quran-Verzeichnis</small><strong>Alle 114 Suren lesbar</strong><em>Arabisch offline · Aussprache und deutsche Bedeutung mit Browser-Cache</em></div>
        <span className="reference-quran-library-status__count">114</span>
      </section>

      <section className="reference-prototype-note reference-quran-online-note">
        <ShieldCheck size={16} />
        <span><strong>Drei Lesearten</strong><small>Lies jede Sure Vers für Vers oder als deutschen beziehungsweise arabischen Lesetext auf Buchseiten. Die letzte Seite wird automatisch gemerkt. Alle {OFFLINE_QURAN_SURAHS.length} Suren liegen arabisch auf dem Gerät; Aussprachehilfe und deutsche Übersetzung werden nach dem ersten Laden gespeichert.</small></span>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nummer, Surenname oder Arabisch suchen …" />
        <Filter size={17} />
      </label>

      <div className="reference-filter-tabs reference-quran-filter-tabs" role="tablist" aria-label="Suren filtern">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Alle · 114</button>
        <button className={filter === 'offline' ? 'is-active' : ''} onClick={() => setFilter('offline')}>Offline · {OFFLINE_QURAN_SURAHS.length}</button>
        <button className={filter === 'favorites' ? 'is-active' : ''} onClick={() => setFilter('favorites')}>Favoriten · {favorites.size}</button>
      </div>

      {loading ? (
        <div className="reference-quran-loading"><LoaderCircle size={24} className="is-spinning" /><strong>Surenliste wird geladen</strong></div>
      ) : error ? (
        <div className="reference-empty-result"><WifiOff size={25} /><strong>Quran-Verzeichnis nicht verfügbar</strong><small>{error}</small><button className="reference-inline-button" onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={16} /> Erneut versuchen</button></div>
      ) : visible.length ? (
        <section className="reference-quran-catalog">
          <div className="reference-quran-results"><span>{filter === 'all' ? 'Alle Suren' : filter === 'offline' ? 'Offline lesbar' : 'Lieblingssuren'}</span><small>{visible.length} Ergebnisse</small></div>
          <div className="reference-quran-list reference-quran-list--catalog">
            {visible.map((surah, index) => {
              const offline = OFFLINE_QURAN_SURAH_SET.has(surah.number);
              const favorite = favorites.has(surah.number);
              const ayahExtent = Math.max(8, Math.round((surah.numberOfAyahs / 286) * 100));
              return (
                <motion.article
                  key={surah.number}
                  className="reference-quran-surah-card"
                  style={{ '--surah-extent': `${ayahExtent}%` } as CSSProperties}
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
                      <span className="reference-quran-list__index">Sure {surah.number} von 114</span>
                      <strong>{surah.englishName}</strong>
                      <small>
                        <span>{surah.numberOfAyahs} Ayat</span>
                        <span className={offline ? 'reference-quran-availability is-available' : 'reference-quran-availability is-online'}>{offline ? 'Auf dem Gerät' : <><CloudDownload size={12} /> Online laden</>}</span>
                      </small>
                      <span className="reference-quran-list__extent" aria-hidden="true"><i /></span>
                    </span>
                    <span className="reference-quran-list__arabic" dir="rtl"><small>سُورَة</small><strong>{surah.name.replace('سُورَةُ ', '')}</strong></span>
                  </button>
                  <button className={favorite ? 'reference-quran-favorite is-active' : 'reference-quran-favorite'} onClick={() => toggleFavorite(surah.number)} aria-label={`${surah.englishName} als Favorit markieren`} aria-pressed={favorite}>{favorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button>
                </motion.article>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="reference-empty-result"><Search size={25} /><strong>Keine Sure gefunden</strong><small>Ändere Suche oder Filter.</small></div>
      )}

      <button className="verse-card verse-card--cream reference-daily-card-button quran-daily-ayah" onClick={onOpenAyah} aria-label="Ayah des Tages – Details öffnen">
        <PremiumImage src="/premium-assets/high-res-objects/ayah-focus-bg-v1.webp" className="verse-card__art" fallback={<BookOpen />} />
        <div className="card-title-row"><span><Sparkles size={16} /> Ayah des Tages</span><span><BookHeart size={18} /></span></div>
        <p className="arabic-verse" dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
        <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote>
        <footer>Al-Ikhlas · 112:1</footer>
      </button>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .985 }} transition={toastTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
