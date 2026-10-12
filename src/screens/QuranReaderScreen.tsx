import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
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
  X,
  Share2,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { PremiumImage, QuranObject } from '../shared/PremiumVisuals';
import { fetchSurahBundle } from '../services/quranService';
import { splitOpeningBasmalah } from '../services/quranReadingText';
import surahsJson from '../data/quranSurahs.json';
import type { QuranAyah, QuranSurahBundle, Surah } from '../services/quranService';

function normalizePositiveInteger(value: unknown, fallback = 1) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN;
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

function writeConfirmed(key: string, value: string, expectedRaw?: string | null) {
  try {
    const currentRaw = localStorage.getItem(key);
    if (expectedRaw !== undefined && currentRaw !== expectedRaw) return false;
    localStorage.setItem(key, value);
    return localStorage.getItem(key) === value;
  } catch {
    return false;
  }
}

function readSavedJson<T>(key: string, fallback: T, valid: (value: unknown) => boolean) {
  try {
    const raw = localStorage.getItem(key);
    const value: unknown = raw === null ? fallback : JSON.parse(raw);
    const readable = valid(value);
    return { raw, value: readable ? value as T : fallback, readable };
  } catch {
    return { raw: null, value: fallback, readable: false };
  }
}

function readFontSize() {
  try {
    const raw = localStorage.getItem('nur_reader_font_size');
    if (raw === null || !/^\d+$/.test(raw)) return 34;
    const value = Number(raw);
    if (!Number.isFinite(value)) return 34;
    return Math.min(48, Math.max(26, Math.round(value)));
  } catch {
    return 34;
  }
}

export type ReaderArabicFont = 'amiri' | 'system';
type ReaderMode = 'verse' | 'german-flow' | 'arabic-flow';

function readArabicFont(): ReaderArabicFont {
  try {
    return localStorage.getItem('nur_reader_arabic_font') === 'system' ? 'system' : 'amiri';
  } catch {
    return 'amiri';
  }
}

function readReaderMode(): ReaderMode {
  try {
    const value = localStorage.getItem('nur_quran_reader_mode');
    if (value === 'german-flow' || value === 'arabic-flow') return value;
  } catch {
    // optional
  }
  return 'verse';
}

function paginateAyahs(ayahs: QuranAyah[], characterTarget: number) {
  const pages: QuranAyah[][] = [];
  let page: QuranAyah[] = [];
  let characters = 0;

  ayahs.forEach((ayah) => {
    if (page.length && characters + ayah.text.length > characterTarget) {
      pages.push(page);
      page = [];
      characters = 0;
    }
    page.push(ayah);
    characters += ayah.text.length;
  });
  if (page.length) pages.push(page);
  return pages;
}

function flowStorageKey(kind: 'position' | 'marker', surahNumber: number, mode: ReaderMode) {
  return `nur_quran_flow_${kind}_${surahNumber}_${mode}`;
}

function readFlowAyah(kind: 'position' | 'marker', surahNumber: number, mode: ReaderMode) {
  if (mode === 'verse') return null;
  try {
    return normalizePositiveInteger(localStorage.getItem(flowStorageKey(kind, surahNumber, mode)), 0) || null;
  } catch {
    return null;
  }
}

function pageForAyah(pages: QuranAyah[][], ayahNumber: number) {
  const index = pages.findIndex((page) => page.some((ayah) => ayah.numberInSurah === ayahNumber));
  return index >= 0 ? index : 0;
}

function readBookmarks(surahNumber: number, max = 286) {
  const saved = readSavedJson<unknown[]>(`nur_quran_bookmarks_${surahNumber}`, [], value => Array.isArray(value)
    && value.every(item => normalizePositiveInteger(item, 0) > 0 && normalizePositiveInteger(item, 0) <= max));
  return { ...saved, values: new Set(saved.value.map(value => normalizePositiveInteger(value, 0))) };
}

function persistRecent(surahNumber: number) {
  const saved = readSavedJson<unknown[]>('nur_quran_recent_surahs', [], value => Array.isArray(value)
    && value.every(item => { const value = normalizePositiveInteger(item, 0); return value >= 1 && value <= 114; }));
  const current = saved.value.map(value => normalizePositiveInteger(value, 0));
  return saved.readable && writeConfirmed('nur_quran_recent_surahs', JSON.stringify([surahNumber, ...current.filter(value => value !== surahNumber)].slice(0, 8)), saved.raw);
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text);
}

export function QuranReaderScreen({
  surahNumber,
  initialAyahNumber = 1,
  onBack,
  onOpenSurah,
}: {
  surahNumber: number;
  initialAyahNumber?: number;
  onBack: () => void;
  onOpenSurah: (number: number) => void;
}) {
  const [bundle, setBundle] = useState<QuranSurahBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [fontSize, setFontSize] = useState(readFontSize);
  const [arabicFont, setArabicFont] = useState<ReaderArabicFont>(readArabicFont);
  const [readerMode, setReaderMode] = useState<ReaderMode>(readReaderMode);
  const [flowPageIndex, setFlowPageIndex] = useState(0);
  const [savedFlowAyah, setSavedFlowAyah] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeAyah, setActiveAyah] = useState(() => normalizePositiveInteger(initialAyahNumber));
  const [bookmarks, setBookmarks] = useState(() => readBookmarks(surahNumber));
  const [toast, setToast] = useState<{ message: string; failed: boolean } | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setBundle(null);
    setBookmarks(readBookmarks(surahNumber));
    setActiveAyah(normalizePositiveInteger(initialAyahNumber));

    fetchSurahBundle(surahNumber)
      .then((data) => {
        if (!active) return;
        setBundle(data);
        const saved = readBookmarks(surahNumber, data.meta.numberOfAyahs);
        setBookmarks(saved);
        if (!saved.readable) setStorageWarning('Lesezeichen konnten nicht gelesen werden. Vorhandene Daten werden nicht überschrieben.');
        if (!persistRecent(surahNumber)) setStorageWarning('Speicherung zuletzt geöffneter Suren nicht bestätigt. Nicht lesbare Daten werden nicht automatisch ersetzt.');
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Die Sure konnte nicht geladen werden.');
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [initialAyahNumber, reloadToken, surahNumber]);

  useEffect(() => {
    if (!bundle) return undefined;
    const targetAyah = Math.min(bundle.meta.numberOfAyahs, normalizePositiveInteger(initialAyahNumber));
    setActiveAyah(targetAyah);
    if (targetAyah <= 1) return undefined;

    const timer = window.setTimeout(() => {
      const target = document.getElementById(`quran-ayah-${surahNumber}-${targetAyah}`);
      if (!target) return;
      if (reduceMotion) target.scrollIntoView({ behavior: 'auto', block: 'center' });
      else target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, reduceMotion ? 0 : 120);
    return () => window.clearTimeout(timer);
  }, [bundle, initialAyahNumber, reduceMotion, surahNumber]);

  useEffect(() => {
    if (!bundle || bundle.meta.number !== surahNumber) return;
    const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah));
    const saved = readSavedJson<Record<string, unknown> | null>('nur_quran_last_read', null, value => {
      if (value === null) return true;
      if (typeof value !== 'object' || Array.isArray(value)) return false;
      const { surahNumber, ayahNumber } = value as Record<string, unknown>;
      const surah = (surahsJson as Surah[]).find(item => item.number === surahNumber);
      return !!surah && typeof ayahNumber === 'number' && Number.isSafeInteger(ayahNumber) && ayahNumber >= 1 && ayahNumber <= surah.numberOfAyahs;
    });
    if (!saved.readable || !writeConfirmed('nur_quran_last_read', JSON.stringify({
        surahNumber: bundle.meta.number,
        ayahNumber: validatedAyah,
        updatedAt: new Date().toISOString(),
      }), saved.raw)) setStorageWarning('Speicherung des Lesefortschritts nicht bestätigt. Nicht lesbare Daten werden nicht automatisch ersetzt.');
  }, [activeAyah, bundle, surahNumber]);

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const flash = (message: string, failed = false) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast({ message, failed });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  const storageFailed = (message: string) => { setStorageWarning(message); flash(message, true); };
  const changeFontSize = (change: number) => {
    const next = Math.min(48, Math.max(26, fontSize + change));
    setFontSize(next);
    if (!writeConfirmed('nur_reader_font_size', String(next))) storageFailed('Schriftgröße geändert; Speicherung für spätere Sitzungen nicht bestätigt.');
  };
  const changeArabicFont = (next: ReaderArabicFont) => {
    setArabicFont(next);
    if (!writeConfirmed('nur_reader_arabic_font', next)) storageFailed('Schrift geändert; Speicherung für spätere Sitzungen nicht bestätigt.');
  };
  const changeReaderMode = (next: ReaderMode) => {
    setReaderMode(next);
    if (!writeConfirmed('nur_quran_reader_mode', next)) storageFailed('Leseart geändert; Speicherung für spätere Sitzungen nicht bestätigt.');
  };

  const closeSettings = useCallback(() => { setSettingsOpen(false); }, []);
  const settingsDialog = useDialog(settingsOpen, closeSettings, 'Leseeinstellungen');


  const progress = useMemo(() => {
    if (!bundle) return 0;
    return Math.min(100, Math.max(1, Math.round((activeAyah / bundle.meta.numberOfAyahs) * 100)));
  }, [activeAyah, bundle]);

  const arabicReading = useMemo(() => bundle ? splitOpeningBasmalah(bundle.arabic) : null, [bundle]);

  const flowPages = useMemo(() => {
    if (!bundle || readerMode === 'verse') return [];
    const ayahs = readerMode === 'german-flow' ? bundle.german?.ayahs ?? [] : arabicReading?.ayahs ?? [];
    return paginateAyahs(ayahs, readerMode === 'german-flow' ? 1_150 : 760);
  }, [arabicReading, bundle, readerMode]);

  const currentFlowPage = flowPages[Math.min(flowPageIndex, Math.max(0, flowPages.length - 1))] ?? [];
  const markerPageIndex = savedFlowAyah ? pageForAyah(flowPages, savedFlowAyah) : null;

  useEffect(() => {
    if (!bundle || readerMode === 'verse' || !flowPages.length) return;
    const marker = readFlowAyah('marker', surahNumber, readerMode);
    const position = readFlowAyah('position', surahNumber, readerMode);
    setSavedFlowAyah(marker && marker <= bundle.meta.numberOfAyahs ? marker : null);
    const pageIndex = pageForAyah(flowPages, position ?? normalizePositiveInteger(initialAyahNumber));
    setFlowPageIndex(pageIndex);
    setActiveAyah(flowPages[pageIndex][0].numberInSurah);
  }, [bundle, flowPages, initialAyahNumber, readerMode, surahNumber]);

  const openFlowPage = (pageIndex: number) => {
    if (readerMode === 'verse' || !flowPages.length) return;
    const nextIndex = Math.min(flowPages.length - 1, Math.max(0, pageIndex));
    const firstAyah = flowPages[nextIndex]?.[0]?.numberInSurah ?? 1;
    setFlowPageIndex(nextIndex);
    setActiveAyah(firstAyah);
    if (!writeConfirmed(flowStorageKey('position', surahNumber, readerMode), String(firstAyah))) storageFailed('Speicherung der letzten Leseseite nicht bestätigt.');
    window.setTimeout(() => document.querySelector('.reference-reader-flow')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 0);
  };

  const saveFlowMarker = () => {
    if (readerMode === 'verse' || !currentFlowPage.length) return;
    const firstAyah = currentFlowPage[0].numberInSurah;
    if (!writeConfirmed(flowStorageKey('marker', surahNumber, readerMode), String(firstAyah))) {
      storageFailed('Lesestelle nicht gespeichert oder nicht überprüfbar.');
      return;
    }
    setSavedFlowAyah(firstAyah);
    flash(`Lesestelle auf Seite ${flowPageIndex + 1} gespeichert`);
  };

  const toggleBookmark = (ayah: number) => {
    if (!bundle) return;
    const key = `nur_quran_bookmarks_${surahNumber}`;
    const next = new Set(bookmarks.values);
    if (next.has(ayah)) next.delete(ayah);
    else next.add(ayah);
    const raw = JSON.stringify([...next]);
    if (!bookmarks.readable || !writeConfirmed(key, raw, bookmarks.raw)) {
      storageFailed('Lesezeichen-Änderung nicht gespeichert oder nicht überprüfbar. Lade die Sure erneut, um den Bestand zu prüfen.');
      setBookmarks(readBookmarks(surahNumber, bundle.meta.numberOfAyahs));
      return;
    }
    setBookmarks({ raw, value: [...next], values: next, readable: true });
  };

  const pronunciationAttribution = `Aussprachehilfe: ${bundle?.transliterationLabel ?? 'Lateinschrift'}`;
  const germanAttribution = `Deutsche Übersetzung: ${bundle?.translationLabel ?? 'Bubenheim & Elyas'}`;

  const ayahText = (index: number) => {
    if (!bundle) return '';
    const arabic = arabicReading?.ayahs[index]?.text ?? '';
    const pronunciation = bundle.transliteration?.ayahs[index]?.text;
    const german = bundle.german?.ayahs[index]?.text;
    const reference = `${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`;
    return [
      arabic,
      pronunciation ? `${pronunciationAttribution}:\n${pronunciation}` : null,
      german ? `${germanAttribution}:\n${german}` : null,
      reference,
    ].filter(Boolean).join('\n\n');
  };

  const copyAyah = async (index: number) => {
    if (!bundle) return;
    try {
      await copyText(ayahText(index));
      flash(`Ayah ${index + 1} kopiert`);
    } catch {
      flash('Kopieren war nicht möglich', true);
    }
  };

  const shareAyah = async (index: number) => {
    if (!bundle) return;
    const text = ayahText(index);
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: `${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`, text });
        flash('Ayah geteilt');
      } else {
        await copyText(text);
        flash('Ayah kopiert');
      }
    } catch (reason) {
      if ((reason as DOMException)?.name !== 'AbortError') flash('Teilen war nicht möglich', true);
    }
  };

  const nextNumber = Math.min(114, surahNumber + 1);
  const nextAvailable = nextNumber !== surahNumber;
  const readerLabel = bundle?.transliterationSource === 'unavailable' && bundle?.translationSource === 'unavailable'
    ? 'Arabisch offline'
    : bundle?.transliterationSource === 'cache' && bundle?.translationSource === 'cache'
      ? 'Im Browser gespeichert'
      : 'Lesetexte geladen';
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const toastTransition = { duration: reduceMotion ? 0 : .2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-reader-screen reference-reader-screen--dynamic" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zum Quran"><ChevronLeft size={20} /></button>
        <div><span className="overline">{readerLabel}</span><h1>{bundle?.meta.englishName ?? `Sure ${surahNumber}`}</h1></div>
        <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Leseeinstellungen öffnen"><Settings2 size={20} /></button>
      </header>

      {storageWarning ? <section className="reference-reader-source" role="status"><Database size={17} /><span><strong>Lokale Speicherung nicht bestätigt</strong><small>{storageWarning}</small></span></section> : null}

      {loading ? (
        <div className="reference-reader-loading"><LoaderCircle size={28} className="is-spinning" /><strong>Qurantext wird geladen</strong><small>Arabisch wird aus den lokalen Dateien geladen; Bedeutung und Umschrift werden separat abgerufen.</small></div>
      ) : error || !bundle ? (
        <section className="reference-reader-unavailable">
          <WifiOff size={34} />
          <span><strong>Diese Sure konnte nicht geladen werden</strong><small>{error ?? 'Die lokale arabische Datei ist nicht verfügbar.'}</small></span>
          <div className="reference-reader-unavailable__actions"><button onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={16} /> Erneut versuchen</button><button onClick={onBack}>Zur Surenliste</button></div>
        </section>
      ) : (
        <>
          <section className="reference-reader-hero">
            <div><span className="hero-pill">Sure {bundle.meta.number}</span><h2>{bundle.meta.englishName}</h2><p>{bundle.meta.numberOfAyahs} Ayat</p><span className={`reference-reader-source-pill is-${bundle.source}`}>{bundle.source === 'offline' ? <Database size={13} /> : <CloudDownload size={13} />}{bundle.sourceLabel}</span></div>
            <PremiumImage src="/premium-assets/high-res-objects/quran-open-v3.webp" fallback={<QuranObject />} />
            <span className="reference-reader-progress"><i style={{ width: `${progress}%` }} /></span>
          </section>

          <section className="reference-reader-modebar" tabIndex={-1} aria-label="Leseart wählen">
            <div className="reference-reader-mode-tabs">
              <button className={readerMode === 'verse' ? 'is-active' : ''} onClick={() => changeReaderMode('verse')} aria-pressed={readerMode === 'verse'}><strong>Versweise</strong><small>Alle drei Texte</small></button>
              <button className={readerMode === 'german-flow' ? 'is-active' : ''} onClick={() => changeReaderMode('german-flow')} aria-pressed={readerMode === 'german-flow'}><strong>Deutsch</strong><small>Buchseiten</small></button>
              <button className={readerMode === 'arabic-flow' ? 'is-active' : ''} onClick={() => changeReaderMode('arabic-flow')} aria-pressed={readerMode === 'arabic-flow'}><strong>Arabisch</strong><small>Buchseiten</small></button>
            </div>
            {readerMode !== 'german-flow' ? <div className="reference-font-control"><button onClick={() => changeFontSize(-2)} aria-label="Arabische Schrift verkleinern"><Minus size={16} /></button><strong>Aa</strong><button onClick={() => changeFontSize(2)} aria-label="Arabische Schrift vergrößern"><Plus size={16} /></button></div> : null}
          </section>

          <section className="reference-reader-source">
            <ShieldCheck size={17} />
            <span>
              <strong>{readerMode === 'verse' ? 'Arabisch · Aussprache · deutsche Übersetzung' : readerMode === 'german-flow' ? `Deutsche Übersetzung · ${bundle.translationLabel}` : 'Arabischer Originaltext'}</strong>
              <small>{readerMode === 'verse' ? 'Die drei Texte stehen getrennt untereinander. Die Aussprachehilfe unterstützt das Mitlesen, ersetzt aber keine Tajwid-Anleitung.' : 'Buchseiten werden beim Weiterblättern lokal gemerkt, sofern dein Browser Speicherung erlaubt. Eine feste Lesestelle kannst du zusätzlich speichern. Gelöschte Browserdaten entfernen auch diese Einträge.'}</small>
            </span>
          </section>

          {arabicReading?.openingBasmalah && (readerMode === 'verse' || readerMode === 'arabic-flow' && flowPageIndex === 0) ? (
            <section className="reference-reader-basmalah" aria-label="Unnummerierter Surenbeginn">
              <small>Basmalah · unnummerierter Surenbeginn</small>
              <p className="reference-reader-arabic" dir="rtl" style={{ fontSize, fontFamily: arabicFont === 'system' ? 'system-ui, sans-serif' : undefined }}>{arabicReading.openingBasmalah}</p>
            </section>
          ) : null}

          {readerMode === 'verse' ? (
            <section className="reference-reader-verses">
              {arabicReading?.ayahs.map((ayah, index) => {
                const ayahNumber = ayah.numberInSurah;
                const saved = bookmarks.values.has(ayahNumber);
                const pronunciation = bundle.transliteration?.ayahs[index]?.text;
                const german = bundle.german?.ayahs[index]?.text;
                return (
                  <motion.article
                    id={`quran-ayah-${bundle.meta.number}-${ayahNumber}`}
                    key={ayahNumber}
                    className={activeAyah === ayahNumber ? 'reference-reader-verse is-active' : 'reference-reader-verse'}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .012, .16), ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveAyah(ayahNumber)}
                  >
                    <header><span>{ayahNumber}</span><div><button onClick={(event) => { event.stopPropagation(); void copyAyah(index); }} aria-label="Ayah kopieren"><Copy size={17} /></button><button onClick={(event) => { event.stopPropagation(); toggleBookmark(ayahNumber); }} className={saved ? 'is-saved' : ''} aria-label="Ayah speichern">{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div></header>
                    <p className="reference-reader-arabic" dir="rtl" style={{ fontSize, fontFamily: arabicFont === 'system' ? 'system-ui, sans-serif' : undefined }}>{ayah.text}</p>
                    <div className="reference-reader-verse__reading">
                      {pronunciation ? (
                        <section className="reference-reader-pronunciation">
                          <small>Aussprache</small>
                          <p>{pronunciation}</p>
                        </section>
                      ) : (
                        <section className="reference-reader-pronunciation is-unavailable"><small>Aussprache</small><p>Nicht verfügbar: Eine Verbindung zur Quelle oder ein nutzbarer Browser-Cache ist nötig.</p></section>
                      )}
                      {german ? (
                        <section className="reference-reader-translation">
                          <small>Deutsche Übersetzung · {bundle.translationLabel}</small>
                          <p>{german}</p>
                        </section>
                      ) : (
                        <section className="reference-reader-translation is-unavailable"><small>Deutsche Übersetzung</small><p>Nicht verfügbar: Eine Verbindung zur Quelle oder ein nutzbarer Browser-Cache ist nötig.</p></section>
                      )}
                    </div>
                    <footer><span>{bundle.meta.number}:{ayahNumber}</span><button onClick={(event) => { event.stopPropagation(); void shareAyah(index); }}><Share2 size={15} /> Teilen</button></footer>
                  </motion.article>
                );
              })}
            </section>
          ) : (
            <>
              <motion.article className={`reference-reader-flow is-${readerMode}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
                <header>
                  <span><small>Sure {bundle.meta.number}</small><h2>{bundle.meta.englishName}</h2></span>
                  <span className="reference-reader-flow__page"><strong>Seite {flowPageIndex + 1}</strong><small>von {Math.max(1, flowPages.length)}</small></span>
                </header>
                {readerMode === 'german-flow' ? (
                  bundle.german ? (
                    <motion.p key={`german-${flowPageIndex}`} className="reference-reader-flow__text is-german" initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, x: 0 }} transition={toastTransition}>
                      {currentFlowPage.map((ayah) => <span id={`quran-ayah-${bundle.meta.number}-${ayah.numberInSurah}`} key={ayah.numberInSurah}>{ayah.text} <sup aria-label={`Vers ${ayah.numberInSurah}`}>{ayah.numberInSurah}</sup>{' '}</span>)}
                    </motion.p>
                  ) : <p className="reference-reader-flow__empty">Deutsche Übersetzung nicht verfügbar: Eine Verbindung zur Quelle oder ein nutzbarer Browser-Cache ist nötig.</p>
                ) : (
                  <motion.p key={`arabic-${flowPageIndex}`} className="reference-reader-flow__text is-arabic" dir="rtl" style={{ fontSize, fontFamily: arabicFont === 'system' ? 'system-ui, sans-serif' : undefined }} initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }} animate={{ opacity: 1, x: 0 }} transition={toastTransition}>
                    {currentFlowPage.map((ayah) => <span id={`quran-ayah-${bundle.meta.number}-${ayah.numberInSurah}`} key={ayah.numberInSurah}>{ayah.text} <sup aria-label={`Vers ${ayah.numberInSurah}`}>﴿{ayah.numberInSurah}﴾</sup>{' '}</span>)}
                  </motion.p>
                )}
                <footer><span>{currentFlowPage.length ? `Ayat ${currentFlowPage[0].numberInSurah}–${currentFlowPage[currentFlowPage.length - 1].numberInSurah}` : `${bundle.meta.numberOfAyahs} Ayat`}</span><span>{readerMode === 'german-flow' ? bundle.translationLabel : 'Arabischer Qurantext'}</span></footer>
              </motion.article>

              {flowPages.length ? (
                <nav className="reference-reader-pagination" aria-label="Leseseiten">
                  <button onClick={() => openFlowPage(flowPageIndex - 1)} disabled={flowPageIndex === 0} aria-label="Vorherige Leseseite"><ChevronLeft size={18} /><span>Zurück</span></button>
                  <button className={markerPageIndex === flowPageIndex ? 'reference-reader-pagination__marker is-saved' : 'reference-reader-pagination__marker'} onClick={saveFlowMarker} aria-label="Lesestelle merken">{markerPageIndex === flowPageIndex ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}<span>{markerPageIndex === flowPageIndex ? 'Gemerkt' : 'Lesestelle merken'}</span></button>
                  <button onClick={() => openFlowPage(flowPageIndex + 1)} disabled={flowPageIndex === flowPages.length - 1} aria-label="Nächste Leseseite"><span>Weiter</span><ChevronRight size={18} /></button>
                  {markerPageIndex !== null && markerPageIndex !== flowPageIndex ? <button className="reference-reader-pagination__return" onClick={() => openFlowPage(markerPageIndex)}>Zur Markierung · Seite {markerPageIndex + 1}</button> : null}
                </nav>
              ) : null}
            </>
          )}

          <button
            className={nextAvailable ? 'reference-reader-next' : 'reference-reader-next is-disabled'}
            onClick={() => nextAvailable ? onOpenSurah(nextNumber) : flash('Du hast das Ende des Surenverzeichnisses erreicht')}
          >
            <span><small>{nextAvailable ? 'Als Nächstes' : 'Abgeschlossen'}</small><strong>{nextAvailable ? `Sure ${nextNumber}` : 'Sure 114 · An-Nas'}</strong></span><ChevronRight size={20} />
          </button>
        </>
      )}

      <AnimatePresence>
        {settingsOpen ? (
          <motion.div className="reference-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section
              {...settingsDialog.props}
              className="reference-profile-modal reference-reader-settings-modal"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            >
              <header>
                <div><span className="overline">Lesen</span><h2>Leseeinstellungen</h2></div>
                <button className="reference-modal-close" onClick={closeSettings} aria-label="Schließen"><X size={20} /></button>
              </header>

              <div className="reference-reader-setting">
                <span><strong>Schriftgröße</strong><small>Gilt für den arabischen Text.</small></span>
                <div className="reference-font-control">
                  <button onClick={() => changeFontSize(-2)} aria-label="Schrift verkleinern"><Minus size={16} /></button>
                  <strong>{fontSize}</strong>
                  <button onClick={() => changeFontSize(2)} aria-label="Schrift vergrößern"><Plus size={16} /></button>
                </div>
              </div>

              <div className="reference-reader-setting">
                <span><strong>Arabische Schrift</strong><small>Amiri ist mitgeliefert; die Systemschrift nutzt die Schrift deines Geräts.</small></span>
                <div className="reference-choice-row">
                  <button className={arabicFont === 'amiri' ? 'is-active' : ''} onClick={() => changeArabicFont('amiri')} aria-pressed={arabicFont === 'amiri'}>Amiri</button>
                  <button className={arabicFont === 'system' ? 'is-active' : ''} onClick={() => changeArabicFont('system')} aria-pressed={arabicFont === 'system'}>System</button>
                </div>
              </div>

              <p className="reference-reader-settings-note">Die arabische Schriftgröße gilt in der versweisen und in der fortlaufenden arabischen Ansicht für alle Suren.</p>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" role="status" initial={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }} exit={{ opacity: 0, x: '-50%', y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .985 }} transition={toastTransition}>{toast.failed ? <X size={18} /> : <CircleCheck size={18} />} {toast.message}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
