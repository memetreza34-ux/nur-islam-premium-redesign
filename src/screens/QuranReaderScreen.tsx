import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  X,
  Share2,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../shared/useDialog';
import { PremiumImage, QuranObject } from '../shared/PremiumVisuals';
import {
  fetchSurahBundle,
  getGermanRevelationLabel,
} from '../services/quranService';
import type { QuranSurahBundle } from '../services/quranService';

function normalizePositiveInteger(value: unknown, fallback = 1) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : Number.NaN;
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function readFontSize() {
  try {
    const value = Number(localStorage.getItem('nur_reader_font_size'));
    if (!Number.isFinite(value)) return 34;
    return Math.min(48, Math.max(26, Math.round(value)));
  } catch {
    return 34;
  }
}

/** Meaning stayed on across restarts only by accident: it was never stored. */
function readShowMeaning() {
  try {
    return localStorage.getItem('nur_reader_show_meaning') !== '0';
  } catch {
    return true;
  }
}

export type ReaderArabicFont = 'amiri' | 'system';

function readArabicFont(): ReaderArabicFont {
  try {
    return localStorage.getItem('nur_reader_arabic_font') === 'system' ? 'system' : 'amiri';
  } catch {
    return 'amiri';
  }
}

function readBookmarks(surahNumber: number) {
  try {
    const raw = localStorage.getItem(`nur_quran_bookmarks_${surahNumber}`);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    if (!Array.isArray(parsed)) return new Set<number>();
    return new Set(parsed
      .map((value) => normalizePositiveInteger(value, 0))
      .filter((value) => value > 0));
  } catch {
    return new Set<number>();
  }
}

function persistRecent(surahNumber: number) {
  try {
    const raw = localStorage.getItem('nur_quran_recent_surahs');
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    const current = Array.isArray(parsed)
      ? parsed
        .map((value) => normalizePositiveInteger(value, 0))
        .filter((value) => value >= 1 && value <= 114)
      : [];
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
  const [showMeaning, setShowMeaning] = useState(readShowMeaning);
  const [arabicFont, setArabicFont] = useState<ReaderArabicFont>(readArabicFont);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeAyah, setActiveAyah] = useState(() => normalizePositiveInteger(initialAyahNumber));
  const [bookmarks, setBookmarks] = useState(() => readBookmarks(surahNumber));
  const [toast, setToast] = useState<string | null>(null);
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
        setBookmarks((current) => new Set([...current].filter((ayahNumber) => ayahNumber <= data.meta.numberOfAyahs)));
        persistRecent(surahNumber);
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
    try { localStorage.setItem('nur_reader_font_size', String(fontSize)); } catch { /* optional */ }
  }, [fontSize]);

  useEffect(() => {
    try { localStorage.setItem('nur_reader_show_meaning', showMeaning ? '1' : '0'); } catch { /* optional */ }
  }, [showMeaning]);

  useEffect(() => {
    try { localStorage.setItem('nur_reader_arabic_font', arabicFont); } catch { /* optional */ }
  }, [arabicFont]);

  useEffect(() => {
    try { localStorage.setItem(`nur_quran_bookmarks_${surahNumber}`, JSON.stringify([...bookmarks])); } catch { /* optional */ }
  }, [bookmarks, surahNumber]);

  useEffect(() => {
    if (!bundle) return;
    const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah));
    try {
      localStorage.setItem('nur_quran_last_read', JSON.stringify({
        surahNumber: bundle.meta.number,
        ayahNumber: validatedAyah,
        updatedAt: new Date().toISOString(),
      }));
    } catch {
      // optional
    }
  }, [activeAyah, bundle]);

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

  const closeSettings = useCallback(() => { setSettingsOpen(false); }, []);
  const settingsDialog = useDialog(settingsOpen, closeSettings, 'Leseeinstellungen');


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

  // Offline and online serve the same edition, so the credit does not depend on
  // where the text came from. It used to: offline was labelled a "sinngemäße
  // Bedeutung aus dem Altbestand", which was a verbatim third-party translation
  // presented as the app's own paraphrase.
  const germanAttribution = `Deutsche Übersetzung: ${bundle?.translationLabel ?? 'Bubenheim & Elyas'}`;

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
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: `${bundle.meta.englishName} ${bundle.meta.number}:${index + 1}`, text });
        flash('Ayah geteilt');
      } else {
        await copyText(text);
        flash('Ayah kopiert');
      }
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
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const toastTransition = { duration: reduceMotion ? 0 : .2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-reader-screen reference-reader-screen--dynamic" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zum Quran"><ChevronLeft size={20} /></button>
        <div><span className="overline">{readerLabel}</span><h1>{bundle?.meta.englishName ?? `Sure ${surahNumber}`}</h1></div>
        <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Leseeinstellungen öffnen"><Settings2 size={20} /></button>
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

          <section className="reference-reader-controls" tabIndex={-1}>
            <button onClick={() => setShowMeaning((value) => !value)} className={showMeaning ? 'is-active' : ''} aria-pressed={showMeaning}><BookOpen size={18} /><span>{showMeaning ? 'Bedeutung an' : 'Bedeutung aus'}</span></button>
            <div className="reference-font-control"><button onClick={() => setFontSize((value) => Math.max(26, value - 2))} aria-label="Schrift verkleinern"><Minus size={16} /></button><strong>Aa</strong><button onClick={() => setFontSize((value) => Math.min(48, value + 2))} aria-label="Schrift vergrößern"><Plus size={16} /></button></div>
          </section>

          <section className="reference-reader-source">
            <ShieldCheck size={17} />
            {bundle.source === 'offline' ? (
              <span><strong>Arabisch: Uthmani · Deutsch: {bundle.translationLabel}</strong><small>Sure {bundle.meta.number} liegt vollständig auf dem Gerät und wird ohne externe Anfrage geladen. Die Übersetzung wird unverändert angezeigt.</small></span>
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
                  id={`quran-ayah-${bundle.meta.number}-${ayahNumber}`}
                  key={ayahNumber}
                  className={activeAyah === ayahNumber ? 'reference-reader-verse is-active' : 'reference-reader-verse'}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .012, .16), ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveAyah(ayahNumber)}
                >
                  <header><span>{ayahNumber}</span><div><button onClick={(event) => { event.stopPropagation(); void copyAyah(index); }} aria-label="Ayah kopieren"><Copy size={17} /></button><button onClick={(event) => { event.stopPropagation(); toggleBookmark(ayahNumber); }} className={saved ? 'is-saved' : ''} aria-label="Ayah speichern">{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div></header>
                  <p dir="rtl" style={{ fontSize, fontFamily: arabicFont === 'system' ? 'system-ui, sans-serif' : undefined }}>{ayah.text}</p>
                  {showMeaning && german ? <blockquote><small>Deutsche Übersetzung · {bundle.translationLabel}</small>{german}</blockquote> : null}
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
                  <button onClick={() => setFontSize((value) => Math.max(26, value - 2))} aria-label="Schrift verkleinern"><Minus size={16} /></button>
                  <strong>{fontSize}</strong>
                  <button onClick={() => setFontSize((value) => Math.min(48, value + 2))} aria-label="Schrift vergrößern"><Plus size={16} /></button>
                </div>
              </div>

              <div className="reference-reader-setting">
                <span><strong>Arabische Schrift</strong><small>Amiri ist mitgeliefert; die Systemschrift nutzt die Schrift deines Geräts.</small></span>
                <div className="reference-choice-row">
                  <button className={arabicFont === 'amiri' ? 'is-active' : ''} onClick={() => setArabicFont('amiri')} aria-pressed={arabicFont === 'amiri'}>Amiri</button>
                  <button className={arabicFont === 'system' ? 'is-active' : ''} onClick={() => setArabicFont('system')} aria-pressed={arabicFont === 'system'}>System</button>
                </div>
              </div>

              <div className="reference-reader-setting">
                <span><strong>Deutsche Bedeutung</strong><small>Wird unter jedem Vers angezeigt.</small></span>
                <div className="reference-choice-row">
                  <button className={showMeaning ? 'is-active' : ''} onClick={() => setShowMeaning(true)} aria-pressed={showMeaning}>An</button>
                  <button className={!showMeaning ? 'is-active' : ''} onClick={() => setShowMeaning(false)} aria-pressed={!showMeaning}>Aus</button>
                </div>
              </div>

              <p className="reference-reader-settings-note">Die Einstellungen gelten für alle Suren und bleiben auf diesem Gerät gespeichert.</p>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : .985 }} transition={toastTransition}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
