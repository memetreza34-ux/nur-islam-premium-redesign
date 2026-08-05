import { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Filter,
  Heart,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Search,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, MosqueScene, QuranObject } from './PremiumVisuals';

const names = [
  ['Ar-Rahman', 'ٱلرَّحْمَـٰنُ', 'Der Allerbarmende'],
  ['Ar-Rahim', 'ٱلرَّحِيمُ', 'Der Barmherzige'],
  ['Al-Malik', 'ٱلْمَلِكُ', 'Der König'],
  ['Al-Quddus', 'ٱلْقُدُّوسُ', 'Der Heilige'],
  ['As-Salam', 'ٱلسَّلَامُ', 'Der Frieden'],
  ["Al-Mu'min", 'ٱلْمُؤْمِنُ', 'Der Sicherheit Gewährende'],
  ['Al-Muhaymin', 'ٱلْمُهَيْمِنُ', 'Der Beschützer'],
];

const mosques = [
  ['Şehitlik-Moschee', 'Columbiadamm, Berlin', '2,1 km'],
  ['Ibn-Rushd-Goethe-Moschee', 'Moabit, Berlin', '3,8 km'],
  ['Dar Assalam Moschee', 'Neukölln, Berlin', '5,4 km'],
  ['Mevlana Moschee', 'Kreuzberg, Berlin', '6,2 km'],
  ['Islamisches Kulturzentrum', 'Tempelhof, Berlin', '7,1 km'],
];

function Toast({ message }: { message: string | null }) {
  return <AnimatePresence>{message ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {message}</motion.div> : null}</AnimatePresence>;
}

export function NamesScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => new Set(['Ar-Rahman']));
  const [toast, setToast] = useState<string | null>(null);
  const visible = useMemo(() => names.filter(([latin, , meaning]) => `${latin} ${meaning}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  return (
    <motion.main className="screen reference-names-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack}><ChevronLeft size={20} /></button>
        <div><span className="overline">Asma’ul Husna</span><h1>99 Namen Allahs</h1></div>
        <button className="icon-button" onClick={() => flash(`${favorites.size} Favoriten`)}><Heart size={20} /></button>
      </header>

      <section className="reference-names-hero">
        <span className="reference-names-hero__allah" dir="rtl">الله</span>
        <span className="hero-pill">Asma’ul Husna</span>
        <h2>Allah hat 99<br />wunderschöne Namen.</h2>
        <p>Sie zu kennen vertieft den Glauben. Sie zu verstehen stärkt die Anbetung.</p>
      </section>

      <label className="reference-input-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Einen Namen suchen …" /><Filter size={17} /></label>

      <section className="reference-name-list">
        {visible.map(([latin, arabic, meaning], index) => (
          <motion.button key={latin} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .03 }} onClick={() => flash(`${latin}: ${meaning}`)}>
            <span className="reference-name-list__arabic" dir="rtl">{arabic}</span>
            <span><strong>{latin}</strong><small>{meaning}</small></span>
            <span className={favorites.has(latin) ? 'reference-name-heart is-active' : 'reference-name-heart'} onClick={(event) => { event.stopPropagation(); setFavorites((current) => { const next = new Set(current); if (next.has(latin)) next.delete(latin); else next.add(latin); return next; }); }}><Heart size={18} fill={favorites.has(latin) ? 'currentColor' : 'none'} /></span>
          </motion.button>
        ))}
      </section>
      <Toast message={toast} />
    </motion.main>
  );
}

export function MosqueScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const visible = mosques.filter(([name, address]) => `${name} ${address}`.toLowerCase().includes(query.toLowerCase()));
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  return (
    <motion.main className="screen reference-mosque-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack}><ChevronLeft size={20} /></button>
        <div><span className="overline">In deiner Nähe</span><h1>Moschee-Finder</h1></div>
        <button className="icon-button" onClick={() => flash('Standort aktualisiert')}><LocateFixed size={20} /></button>
      </header>

      <section className="reference-mosque-hero">
        <PremiumImage src="/premium-assets/high-res-objects/mosque-gold.png" fallback={<MosqueScene />} />
        <div><span className="hero-pill">Berlin</span><h2>Finde einen Ort<br />für dein Gebet.</h2><p>Moscheen im Umkreis mit Entfernung, Adresse und direkter Navigation.</p></div>
      </section>

      <label className="reference-input-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Moschee suchen …" /><Filter size={17} /></label>

      <div className="reference-nearby-label"><span><Navigation size={15} /> Nahe deinem Standort</span><button onClick={() => flash('Kartenansicht geöffnet')}><Map size={16} /> Karte</button></div>

      <section className="reference-mosque-list">
        {visible.map(([name, address, distance], index) => (
          <motion.button key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} onClick={() => flash(`${name} geöffnet`)}>
            <span className="reference-mosque-list__pin"><MapPin size={20} /></span>
            <span><strong>{name}</strong><small>{address}</small><em>Nächstes Gebet: Dhuhr · 12:45</em></span>
            <span className="reference-mosque-distance">{distance}</span>
            <ChevronRight size={18} />
          </motion.button>
        ))}
      </section>

      <button className="reference-map-button" onClick={() => flash('Kartenansicht geöffnet')}><Map size={18} /> Auf der Karte anzeigen</button>
      <Toast message={toast} />
    </motion.main>
  );
}

export function CollectionsScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState('Alle');
  const [toast, setToast] = useState<string | null>(null);
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2100); };

  return (
    <motion.main className="screen reference-collections-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack}><ChevronLeft size={20} /></button>
        <div><span className="overline">Gespeichert</span><h1>Meine Sammlung</h1></div>
        <button className="icon-button" onClick={() => flash('Sammlung durchsucht')}><Search size={20} /></button>
      </header>

      <div className="reference-filter-tabs reference-filter-tabs--wide">
        {['Alle', 'Quran', 'Duas', 'Hadith', 'Termine'].map((item) => <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>

      <section className="reference-collection-section">
        <div className="section-heading"><div><span className="overline">Quran</span><h2>Lesezeichen</h2></div></div>
        <div className="reference-collection-grid">
          <button onClick={() => flash('Surah Al-Kahf geöffnet')}><PremiumImage src="/premium-assets/high-res-objects/quran-closed.png" fallback={<QuranObject />} /><span><strong>Al-Kahf</strong><small>Juz 15 · Ayah 1</small></span><Bookmark size={17} /></button>
          <button onClick={() => flash('Surah Yasin geöffnet')}><PremiumImage src="/premium-assets/high-res-objects/quran-closed.png" fallback={<QuranObject />} /><span><strong>Yasin</strong><small>Juz 22 · Ayah 12</small></span><Bookmark size={17} /></button>
        </div>
      </section>

      <section className="reference-collection-section">
        <div className="section-heading"><div><span className="overline">Erinnerungen</span><h2>Duas & Hadithe</h2></div></div>
        <div className="reference-collection-rows">
          <button onClick={() => flash('Dua geöffnet')}><span><Sparkles size={18} /></span><span><strong>Dua um Rechtleitung</strong><small>Morgen</small></span><ChevronRight size={17} /></button>
          <button onClick={() => flash('Hadith geöffnet')}><span><BookOpen size={18} /></span><span><strong>Taten nach den Absichten</strong><small>Sahih al-Bukhari</small></span><ChevronRight size={17} /></button>
          <button onClick={() => flash('Freitags-Erinnerung geöffnet')}><span><CalendarDays size={18} /></span><span><strong>Freitags-Erinnerung</strong><small>Jeden Freitag</small></span><ChevronRight size={17} /></button>
        </div>
      </section>
      <Toast message={toast} />
    </motion.main>
  );
}
