import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CloudDownload,
  Copy,
  Database,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  Settings2,
  Share2,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, QuranObject } from './PremiumVisuals';
import {
  fetchSurahBundle,
  getGermanRevelationLabel,
} from './quranService';
import type { QuranSurahBundle } from './quranService';

function readNumber(key: string, fallback: number) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  } catch {
    return fallback;
  }
}

function readBookmarks(surahNumber: number) {
  try {
    const raw = localStorage.getItem(`nur_quran_bookmarks_${surahNumber}`);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === 'number') : []);
  } catch {
    return new Set<number>();
  }
}

function persistRecent(surahNumber: number) {
  try {
    const raw = localStorage.getItem('nur_quran_recent_surahs');
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    const current = Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === 'number') : [];
    localStorage.setItem('nur_quran_recent_surahs', JSON.stringify([surahNumber, ...current.filter((value) => value !== surahNumber)].slice(0, 8)));
  } catch {
    // optional
  }
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

export function QuranReaderScreen({
  surahNumber,
  onBack,
  onOpenSurah,
}: {
  surahNumber: number;
  onBack: () => void;
  onOpenSurah: (number: number) => void;
}) {
  const [bundle, setBundle] = useState<QuranSurahBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [fontSize, setFontSize] = useState(() => readNumber('nur_reader_font_size', 34));
  const [showMeaning, setShowMeaning] = useState(true);
  const [activeAyah, setActiveAyah] = useState(1);
  const [bookmarks, setBookmarks] = useState(() => readBookmarks(surahNumber));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setBundle(null);
    setBookmarks(readBookmarks(surahNumber));
    setActiveAyah(1);

    fetchSurahBundle(surahNumber)
      .then((data) => {
        if (!active) return;
        setBundle(data);
        persistRecent(surahNumber);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Die Sure konnte nicht geladen werden.');
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [reloadToken, surahNumber]);

  useEffect(() => {
    try { localStorage.setItem('nur_reader_font_size', String(fontSize)); } catch { /* optional */ }
  }, [fontSize]);

  useEffect(() => {
    try { localStorage.setItem(`nur_quran_bookmarks_${surahNumber}`, JSON.stringify([...bookmarks])); } catch { /* optional */ }
  }, [bookmarks, surahNumber]);

  useEffect(() => {
    try {
      localStorage.setItem('nur_quran_last_read', JSON.stringify({
        surahNumber,
        ayahNumber: activeAyah,
        updatedAt: new Date().toISOString(),
      }));
    } catch {
      // optional
    }
  }, [activeAyah, surahNumber]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const progress = useMemo(() => {
    if (!bundle) return 0;
    return Math.min(100, Math.max(1, Math.round((activeAyah / bundle.meta.numberOfAyahs) * 100)));
  }, [activeAyah, bundle]);

  const toggleBookmark = (ayah: number) => {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(ayah)) next.delete(ayah);
      else next.add(ayah);
      return next;
    });
  };

  const germanAttribution = bundle?.source === 'offline'
    ? 'Sinngemäße deutsche Bedeutung aus dem übernommenen Altbestand'
    : `Deutsche Übersetzung: ${bundle?.translationLabel ?? 'Bubenheim & Elyas'}`;

  const copyAyah = async (index: number) => {
    if (!bundle) return;
    const arabic = bundle.arabic.ayahs[index]?.text ?? '';
    const german = bundle.german.ayahs[index]?.text ?? '';
    try {
      await copyText(`${arabic}\n\n${germanAttribution}:\n${german}\n\n${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`);
      flash(`Ayah ${index + 1} kopiert`);
    } catch {
      flash('Kopieren war nicht möglich');
    }
  };

  const shareAyah = async (index: number) => {
    if (!bundle) return;
    const text = `${bundle.arabic.ayahs[index]?.text ?? ''}\n\n${germanAttribution}:\n${bundle.german.ayahs[index]?.text ?? ''}\n\n${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`;
    try {
      if (navigator.share) await navigator.share({ title: `${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`, text });
      else await copyText(text);
      flash(navigator.share ? 'Ayah geteilt' : 'Ayah kopiert');
    } catch (reason) {
      if ((reason as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich');
    }
  };

  const nextNumber = Math.min(114, surahNumber + 1);
  const nextAvailable = nextNumber !== surahNumber;
  const readerLabel = bundle?.source === 'offline'
    ? 'Offline-Reader'
    : bundle?.source === 'cache'
      ? 'Im Browser gespeichert'
      : 'Online-Reader';

  return (
    <motion.main className="screen reference-reader-screen reference-reader-screen--dynamic" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zum Quran"><ChevronLeft size={20} /></button>
        <div><span className="overline">{readerLabel}</span><h1>{bundle?.meta.englishName ?? `Sure ${surahNumber}`}</h1></div>
        <button className="icon-button" onClick={() => flash('Schriftgröße und deutsche Bedeutung kannst du direkt unter dem Suren-Kopf anpassen')} aria-label="Leseeinstellungen"><Settings2 size={20} /></button>
      </header>

      {loading ? (
        <div className="reference-reader-loading"><LoaderCircle size={28} className="is-spinning" /><strong>Qurantext wird geladen</strong><small>Lokale Dateien werden bevorzugt; andere Suren werden geprüft online geladen.</small></div>
      ) : error || !bundle ? (
        <section className="reference-reader-unavailable">
          <WifiOff size={34} />
          <span><strong>Diese Sure konnte nicht geladen werden</strong><small>{error ?? 'Offline-Datei und Online-Quelle sind nicht verfügbar.'}</small></span>
          <div className="reference-reader-unavailable__actions"><button onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={16} /> Erneut versuchen</button><button onClick={onBack}>Zur Surenliste</button></div>
        </section>
      ) : (
        <>
          <section className="reference-reader-hero">
            <div><span className="hero-pill">Sure {bundle.meta.number}</span><h2>{bundle.meta.englishName}</h2><p>{bundle.meta.numberOfAyahs} Ayat · {getGermanRevelationLabel(bundle.meta.revelationType)}</p><span className={`reference-reader-source-pill is-${bundle.source}`}>{bundle.source === 'offline' ? <Database size={13} /> : <CloudDownload size={13} />}{bundle.sourceLabel}</span></div>
            <PremiumImage src="/premium-assets/high-res-objects/quran-open-v2.webp" fallback={<QuranObject />} />
            <span className="reference-reader-progress"><i style={{ width: `${progress}%` }} /></span>
          </section>

          <section className="reference-reader-controls">
            <button onClick={() => setShowMeaning((value) => !value)} className={showMeaning ? 'is-active' : ''} aria-pressed={showMeaning}><BookOpen size={18} /><span>{showMeaning ? 'Bedeutung an' : 'Bedeutung aus'}</span></button>
            <div className="reference-font-control"><button onClick={() => setFontSize((value) => Math.max(26, value - 2))} aria-label="Schrift verkleinern"><Minus size={16} /></button><strong>Aa</strong><button onClick={() => setFontSize((value) => Math.min(48, value + 2))} aria-label="Schrift vergrößern"><Plus size={16} /></button></div>
          </section>

          <section className="reference-reader-source">
            <ShieldCheck size={17} />
            {bundle.source === 'offline' ? (
              <span><strong>Lokaler arabischer Qurantext · Sure {bundle.meta.number}</strong><small>Die deutsche Fassung stammt aus dem übernommenen Altbestand und wird als sinngemäße Bedeutung angezeigt. Eine fachliche Endprüfung bleibt vor Veröffentlichung erforderlich.</small></span>
            ) : (
              <span><strong>Arabisch: Uthmani · Deutsch: {bundle.translationLabel}</strong><small>Geladen über Al Quran Cloud und im Browser zwischengespeichert. Die Übersetzung wird unverändert angezeigt und nicht automatisch erneut übersetzt.</small></span>
            )}
          </section>

          <section className="reference-reader-verses">
            {bundle.arabic.ayahs.map((ayah, index) => {
              const ayahNumber = ayah.numberInSurah;
              const saved = bookmarks.has(ayahNumber);
              const german = bundle.german.ayahs[index]?.text;
              return (
                <motion.article
                  key={ayahNumber}
                  className={activeAyah === ayahNumber ? 'reference-reader-verse is-active' : 'reference-reader-verse'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * .018, .24) }}
                  onClick={() => setActiveAyah(ayahNumber)}
                >
                  <header><span>{ayahNumber}</span><div><button onClick={(event) => { event.stopPropagation(); void copyAyah(index); }} aria-label="Ayah kopieren"><Copy size={17} /></button><button onClick={(event) => { event.stopPropagation(); toggleBookmark(ayahNumber); }} className={saved ? 'is-saved' : ''} aria-label="Ayah speichern">{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div></header>
                  <p dir="rtl" style={{ fontSize }}>{ayah.text}</p>
                  {showMeaning && german ? <blockquote><small>{bundle.source === 'offline' ? 'Sinngemäße deutsche Bedeutung' : `Deutsche Übersetzung · ${bundle.translationLabel}`}</small>{german}</blockquote> : null}
                  <footer><span>{bundle.meta.number}:{ayahNumber}</span><button onClick={(event) => { event.stopPropagation(); void shareAyah(index); }}><Share2 size={15} /> Teilen</button></footer>
                </motion.article>
              );
            })}
          </section>

          <button
            className={nextAvailable ? 'reference-reader-next' : 'reference-reader-next is-disabled'}
            onClick={() => nextAvailable ? onOpenSurah(nextNumber) : flash('Du hast das Ende des Surenverzeichnisses erreicht')}
          >
            <span><small>{nextAvailable ? 'Als Nächstes' : 'Abgeschlossen'}</small><strong>{nextAvailable ? `Sure ${nextNumber}` : 'Sure 114 · An-Nas'}</strong></span><ChevronRight size={20} />
          </button>
        </>
      )}

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
