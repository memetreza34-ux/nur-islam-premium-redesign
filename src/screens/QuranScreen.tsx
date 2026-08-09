import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
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
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, QuranObject } from '../shared/PremiumVisuals';
import {
  fetchSurahs,
  getGermanRevelationLabel,
  OFFLINE_QURAN_SURAH_SET,
  OFFLINE_QURAN_SURAHS,
} from '../services/quranService';
import type { Surah } from '../services/quranService';

type QuranFilter = 'all' | 'offline' | 'favorites' | 'Meccan' | 'Medinan';

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
      if ((filter === 'Meccan' || filter === 'Medinan') && surah.revelationType !== filter) return false;
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

  return (
    <motion.main
      className="screen reference-quran-screen reference-quran-screen--complete"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Quran-Bibliothek</span><h1>Quran</h1></div>
        <button className="icon-button" onClick={() => { setFilter('favorites'); flash(`${favorites.size} Lieblingssuren`); }} aria-label="Lieblingssuren"><Heart size={20} /></button>
      </header>

      <section className="reference-quran-continue">
        <div className="reference-quran-continue__copy">
          <span className="hero-pill">{lastRead ? 'Weiterlesen' : 'Quran beginnen'}</span>
          <h2>{lastSurah?.englishName ?? (lastRead ? `Sure ${lastRead.surahNumber}` : 'Al-Faatiha')}</h2>
          <p>{lastRead ? `Sure ${readerSurahNumber} · Ayah ${lastAyah}` : 'Noch kein gespeicherter Lesestand · Start bei Sure 1'}</p>
          <span className="reference-quran-progress"><i style={{ width: `${lastRead && lastSurah ? Math.min(100, Math.max(1, (lastAyah / lastSurah.numberOfAyahs) * 100)) : 0}%` }} /></span>
          <button className="reference-inline-button" onClick={() => onOpenReader(readerSurahNumber, lastAyah)}>{lastRead ? 'Weiterlesen' : 'Lesen beginnen'} <ChevronRight size={16} /></button>
        </div>
        <PremiumImage src="/premium-assets/high-res-objects/quran-closed-v2.webp" className="reference-quran-continue__book" fallback={<QuranObject />} />
      </section>

      <section className="reference-quran-library-status glass-card">
        <span><BookOpen size={21} /></span>
        <div><small>Quran-Verzeichnis</small><strong>Alle 114 Suren lesbar</strong><em>{OFFLINE_QURAN_SURAHS.length} Suren fest offline · weitere Suren online mit Browser-Cache</em></div>
        <span className="reference-quran-library-status__count">114</span>
      </section>

      <section className="reference-prototype-note reference-quran-online-note">
        <ShieldCheck size={16} />
        <span><strong>Offline zuerst, online nur bei Bedarf</strong><small>Die vier lokalen Suren werden ohne externe Anfrage geladen. Weitere Suren kommen aus Al Quran Cloud mit arabischem Uthmani-Text und deutscher Bubenheim-&-Elyas-Übersetzung und werden anschließend im Browser zwischengespeichert.</small></span>
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
        <button className={filter === 'Meccan' ? 'is-active' : ''} onClick={() => setFilter('Meccan')}>Mekkanisch</button>
        <button className={filter === 'Medinan' ? 'is-active' : ''} onClick={() => setFilter('Medinan')}>Medinensisch</button>
      </div>

      {loading ? (
        <div className="reference-quran-loading"><LoaderCircle size={24} className="is-spinning" /><strong>Surenliste wird geladen</strong></div>
      ) : error ? (
        <div className="reference-empty-result"><WifiOff size={25} /><strong>Quran-Verzeichnis nicht verfügbar</strong><small>{error}</small><button className="reference-inline-button" onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={16} /> Erneut versuchen</button></div>
      ) : visible.length ? (
        <section className="reference-quran-catalog">
          <div className="reference-quran-results"><span>{filter === 'all' ? 'Alle Suren' : filter === 'offline' ? 'Offline lesbar' : filter === 'favorites' ? 'Lieblingssuren' : getGermanRevelationLabel(filter)}</span><small>{visible.length} Ergebnisse</small></div>
          <div className="reference-quran-list reference-quran-list--catalog">
            {visible.map((surah, index) => {
              const offline = OFFLINE_QURAN_SURAH_SET.has(surah.number);
              const favorite = favorites.has(surah.number);
              return (
                <motion.article key={surah.number} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .008, .18) }}>
                  <button className="reference-quran-list__main" onClick={() => onOpenReader(surah.number, 1)}>
                    <span className="reference-quran-list__number">{surah.number}</span>
                    <span className="reference-quran-list__copy"><strong>{surah.englishName}</strong><small>{getGermanRevelationLabel(surah.revelationType)} · {surah.numberOfAyahs} Ayat</small></span>
                    <span className="reference-quran-list__arabic" dir="rtl">{surah.name.replace('سُورَةُ ', '')}</span>
                    <span className={offline ? 'reference-quran-availability is-available' : 'reference-quran-availability is-online'}>{offline ? 'Offline' : <><CloudDownload size={12} /> Online</>}</span>
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

      <button className="reference-quran-verse reference-quran-verse--button" onClick={onOpenAyah}>
        <div className="reference-quran-verse__shade" />
        <span className="overline">Ayah des Tages</span>
        <p dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
        <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote>
        <small>Al-Ikhlas · 112:1</small>
        <span className="reference-quran-verse__action"><Sparkles size={17} /> Details öffnen</span>
      </button>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
