import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Scale,
  ScrollText,
  Settings,
  Sparkles,
  Star,
  UsersRound,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type LearningCategory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

const categories: LearningCategory[] = [
  {
    id: 'aqidah',
    title: 'Aqidah',
    subtitle: 'Glaubenslehre',
    description: 'Lerne die Grundlagen des islamischen Glaubens klar und strukturiert.',
    icon: Sparkles,
  },
  {
    id: 'fiqh',
    title: 'Fiqh',
    subtitle: 'Islamische Rechtslehre',
    description: 'Verstehe Regeln des Alltags, der Anbetung und des Zusammenlebens.',
    icon: Scale,
  },
  {
    id: 'tafsir',
    title: 'Tafsir',
    subtitle: 'Quran-Erklärungen',
    description: 'Entdecke Bedeutungen, Hintergründe und Lehren ausgewählter Verse.',
    icon: BookOpen,
  },
  {
    id: 'seerah',
    title: 'Seerah',
    subtitle: 'Biografie des Propheten',
    description: 'Lerne das Leben, den Charakter und die Lehren des Propheten kennen.',
    icon: Landmark,
  },
  {
    id: 'hadith',
    title: 'Hadith',
    subtitle: 'Überlieferungen',
    description: 'Lies ausgewählte Hadithe mit Quelle und verständlicher Einordnung.',
    icon: BookHeart,
  },
  {
    id: 'akhlaq',
    title: 'Akhlaq',
    subtitle: 'Charakter & Verhalten',
    description: 'Stärke deinen Charakter durch Barmherzigkeit, Geduld und Aufrichtigkeit.',
    icon: HeartHandshake,
  },
];

export function LearnScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<LearningCategory | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <motion.main
      className="screen reference-learn-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite">
          <ChevronLeft size={20} />
        </button>
        <div>
          <span className="overline">Nur Islam</span>
          <h1>Islam lernen</h1>
        </div>
        <button className="icon-button" onClick={() => flash('Lerneinstellungen geöffnet')} aria-label="Lerneinstellungen">
          <Settings size={20} />
        </button>
      </header>

      <section className="reference-learning-hero">
        <div className="reference-learning-hero__shade" />
        <div className="reference-learning-hero__copy">
          <span className="hero-pill">Deine Lernreise</span>
          <h2>Suche Wissen.<br />Wachse im Glauben.</h2>
          <p>Entdecke sorgfältig aufgebaute Lektionen, die deinen Alltag und deine Verbindung zu Allah stärken.</p>
        </div>
        <div className="reference-learning-hero__badge">
          <GraduationCap size={17} />
          <span><strong>12 Lektionen</strong><small>bereits abgeschlossen</small></span>
        </div>
      </section>

      <section className="reference-learning-section">
        <div className="section-heading">
          <div>
            <span className="overline">Lernbereiche</span>
            <h2>Kategorien</h2>
          </div>
          <button className="text-button" onClick={() => flash('Alle Kategorien werden angezeigt')}>
            Alle anzeigen <ChevronRight size={16} />
          </button>
        </div>

        <div className="reference-category-grid">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                className="reference-category-card"
                onClick={() => setSelected(category)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.045 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="reference-category-card__ornament" aria-hidden="true">۞</span>
                <span className="reference-category-card__icon"><Icon size={24} /></span>
                <strong>{category.title}</strong>
                <small>{category.subtitle}</small>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-continue-section">
        <div className="section-heading">
          <div>
            <span className="overline">Dein Fortschritt</span>
            <h2>Weiterlernen</h2>
          </div>
          <button className="text-button" onClick={() => flash('Dein Lernfortschritt wurde geöffnet')}>
            Alle <ChevronRight size={16} />
          </button>
        </div>

        <button className="reference-continue-card" onClick={() => flash('Die Reinigung des Herzens geöffnet')}>
          <span className="reference-continue-card__cover"><BookMarked size={28} /></span>
          <span className="reference-continue-card__copy">
            <small>Akhlaq · Lektion 4</small>
            <strong>Die Reinigung des Herzens</strong>
            <em>45 % abgeschlossen</em>
            <span className="reference-progress"><span /></span>
          </span>
          <ChevronRight size={20} />
        </button>
      </section>

      <section className="reference-knowledge-quote">
        <span className="reference-knowledge-quote__mark"><Star size={18} /></span>
        <p>„Und sprich: Mein Herr, mehre mein Wissen.“</p>
        <small>Sure Taha · 20:114</small>
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="reference-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.section
              className="reference-category-modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="reference-modal-close" onClick={() => setSelected(null)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-category-modal__icon"><selected.icon size={31} /></span>
              <span className="overline">Islam lernen</span>
              <h2>{selected.title}</h2>
              <h3>{selected.subtitle}</h3>
              <p>{selected.description}</p>
              <div className="reference-category-modal__meta">
                <span><CircleCheck size={16} /> Authentische Quellen</span>
                <span><ScrollText size={16} /> Schrittweise Lektionen</span>
                <span><UsersRound size={16} /> Für Einsteiger geeignet</span>
              </div>
              <button className="gold-button" onClick={() => { flash(`${selected.title} geöffnet`); setSelected(null); }}>
                Lernen beginnen <ChevronRight size={17} />
              </button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <CircleCheck size={18} /> {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
