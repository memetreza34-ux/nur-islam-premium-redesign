import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  Heart,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Dua = {
  id: number;
  title: string;
  category: string;
  arabic: string;
  translation: string;
  source: string;
};

const duas: Dua[] = [
  {
    id: 1,
    title: 'Dua um Rechtleitung',
    category: 'Allgemein',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا',
    translation: 'Unser Herr, lass unsere Herzen nicht abirren, nachdem Du uns rechtgeleitet hast.',
    source: 'Quran · 3:8',
  },
  {
    id: 2,
    title: 'Dua um Schutz',
    category: 'Schutz',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    translation: 'Ich suche Zuflucht bei Allahs vollkommenen Worten vor dem Übel dessen, was Er erschaffen hat.',
    source: 'Sahih Muslim',
  },
  {
    id: 3,
    title: 'Dua um Vergebung',
    category: 'Vergebung',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ',
    translation: 'Mein Herr, vergib mir, meinen Eltern und den Gläubigen.',
    source: 'Quran · 14:41',
  },
  {
    id: 4,
    title: 'Morgen-Dhikr',
    category: 'Morgen',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    translation: 'Wir haben den Morgen erreicht, und alle Herrschaft gehört Allah.',
    source: 'Sahih Muslim',
  },
  {
    id: 5,
    title: 'Abend-Dhikr',
    category: 'Abend',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    translation: 'Wir haben den Abend erreicht, und alle Herrschaft gehört Allah.',
    source: 'Sahih Muslim',
  },
];

const categories = ['Alle', 'Morgen', 'Abend', 'Schutz', 'Vergebung'];

export function DuasScreen({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState('Alle');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => new Set<number>([1]));
  const [toast, setToast] = useState<string | null>(null);

  const visible = useMemo(() => duas.filter((dua) => {
    const categoryMatch = category === 'Alle' || dua.category === category;
    const queryMatch = `${dua.title} ${dua.translation}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [category, query]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <motion.main className="screen reference-duas-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Duas</h1></div>
        <button className="icon-button" onClick={() => flash(`${favorites.size} Favoriten`)}><Heart size={20} /></button>
      </header>

      <section className="reference-duas-hero">
        <span className="reference-duas-hero__ornament" aria-hidden="true">۞</span>
        <span className="hero-pill">Dua-Sammlung</span>
        <h2>Sprich mit Allah<br />in jedem Moment.</h2>
        <p>Ausgewählte Bittgebete mit arabischem Text, verständlicher Übersetzung und klarer Quelle.</p>
      </section>

      <label className="reference-input-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Dua suchen …" />
      </label>

      <div className="reference-filter-tabs" role="tablist">
        {categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>

      <section className="reference-dua-grid">
        {visible.map((dua, index) => (
          <motion.article key={dua.id} className="reference-dua-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }}>
            <div className="reference-dua-card__top">
              <span><Sparkles size={15} /> {dua.category}</span>
              <button className={favorites.has(dua.id) ? 'is-favorite' : ''} onClick={() => toggleFavorite(dua.id)} aria-label="Favorit"><Heart size={18} fill={favorites.has(dua.id) ? 'currentColor' : 'none'} /></button>
            </div>
            <h2>{dua.title}</h2>
            <p className="reference-dua-card__arabic" dir="rtl">{dua.arabic}</p>
            <blockquote>{dua.translation}</blockquote>
            <footer><small>{dua.source}</small><button onClick={() => flash('Dua geteilt')}><Share2 size={16} /> Teilen</button></footer>
          </motion.article>
        ))}
      </section>

      {!visible.length ? <div className="reference-empty-result"><Search size={25} /><strong>Keine Dua gefunden</strong><small>Ändere Suche oder Kategorie.</small></div> : null}

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
