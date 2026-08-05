import { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Headphones,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, QuranObject } from './PremiumVisuals';

const recentSurahs = [
  { name: 'Al-Kahf', meta: 'Sure 18 · Ayah 32', juz: 'Juz 15' },
  { name: 'Yasin', meta: 'Sure 36 · Ayah 12', juz: 'Juz 22' },
  { name: 'Ar-Rahman', meta: 'Sure 55 · Ayah 1', juz: 'Juz 27' },
];

export function QuranScreen({ onBack, onOpenReader, onOpenAyah }: { onBack: () => void; onOpenReader: () => void; onOpenAyah: () => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  return (
    <motion.main className="screen reference-quran-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Quran</h1></div>
        <button className="icon-button" onClick={() => flash('Quran-Einstellungen geöffnet')}><Settings size={20} /></button>
      </header>

      <section className="reference-quran-continue">
        <div className="reference-quran-continue__copy">
          <span className="hero-pill">Weiterlesen</span>
          <h2>Surah Al-Kahf</h2>
          <p>Ayah 32 · zuletzt heute gelesen</p>
          <span className="reference-quran-progress"><i /></span>
          <button className="reference-inline-button" onClick={onOpenReader}>Weiterlesen <ChevronRight size={16} /></button>
        </div>
        <PremiumImage src="/premium-assets/high-res-objects/quran-closed.png" className="reference-quran-continue__book" fallback={<QuranObject />} />
      </section>

      <section className="reference-quran-tools">
        <div className="section-heading"><div><span className="overline">Entdecken</span><h2>Quran erkunden</h2></div></div>
        <div className="reference-quran-tool-grid">
          <button onClick={onOpenReader}><span><BookOpen size={23} /></span><strong>Alle Suren</strong><small>114 Kapitel</small></button>
          <button onClick={() => flash('Juz-Auswahl geöffnet')}><span><Box size={23} /></span><strong>Juz</strong><small>30 Abschnitte</small></button>
          <button onClick={() => flash('Lesezeichen geöffnet')}><span><Bookmark size={23} /></span><strong>Lesezeichen</strong><small>Gespeichert</small></button>
          <button onClick={() => flash('Audio-Modus geöffnet')}><span><Headphones size={23} /></span><strong>Audio</strong><small>Rezitation</small></button>
        </div>
      </section>

      <button className="reference-search-bar" onClick={() => flash('Quran-Suche geöffnet')}><Search size={18} /><span>Sure, Ayah oder Thema suchen</span></button>

      <section className="reference-quran-recent">
        <div className="section-heading"><div><span className="overline">Dein Verlauf</span><h2>Zuletzt gelesen</h2></div><button className="text-button" onClick={() => flash('Gesamter Verlauf geöffnet')}>Alle <ChevronRight size={15} /></button></div>
        <div className="reference-quran-list">
          {recentSurahs.map((surah) => (
            <button key={surah.name} onClick={onOpenReader}>
              <span className="reference-quran-list__mark"><Sparkles size={17} /></span>
              <span><strong>{surah.name}</strong><small>{surah.meta}</small></span>
              <em>{surah.juz}</em>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      </section>

      <button className="reference-quran-verse reference-quran-verse--button" onClick={onOpenAyah}>
        <div className="reference-quran-verse__shade" />
        <span className="overline">Ayah des Tages</span>
        <p dir="rtl">قُلْ هُوَ ٱللَّهُ أَحَدٌ</p>
        <blockquote>Sinngemäße Bedeutung: „Sprich: Allah ist Einer.“</blockquote>
        <small>Al-Ikhlas · 112:1</small>
        <span className="reference-quran-verse__action"><Bookmark size={17} /> Details öffnen</span>
      </button>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
