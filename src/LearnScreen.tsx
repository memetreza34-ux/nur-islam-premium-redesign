import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Compass,
  GraduationCap,
  HandHeart,
  Heart,
  Landmark,
  MessageCircleQuestion,
  MoonStar,
  Search,
  Sparkles,
  Star,
  SunMedium,
  TentTree,
  UsersRound,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Category = 'Alle' | 'Quran & Sunnah' | 'Glauben' | 'Praxis' | 'Geschichte';

type Module = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: Exclude<Category, 'Alle'>;
  icon: LucideIcon;
  progress: number;
  lessons: number;
  accent: 'gold' | 'cream' | 'emerald';
  badge?: string;
};

const categories: Category[] = ['Alle', 'Quran & Sunnah', 'Glauben', 'Praxis', 'Geschichte'];

const modules: Module[] = [
  { id: 'quran', title: 'Quran lesen', subtitle: 'Arabisch, Übersetzung & Tafsir', description: 'Lies Suren, setze Lesezeichen und führe deinen persönlichen Lesefortschritt fort.', category: 'Quran & Sunnah', icon: BookOpen, progress: 34, lessons: 114, accent: 'gold', badge: 'Weiterlesen' },
  { id: 'hadith', title: 'Hadith', subtitle: 'Überlieferungen verstehen', description: 'Entdecke ausgewählte Hadithe mit Quelle, Einordnung und verständlicher Erklärung.', category: 'Quran & Sunnah', icon: BookHeart, progress: 12, lessons: 80, accent: 'cream' },
  { id: 'knowledge', title: 'Islamisches Wissen', subtitle: 'Aqida, Fiqh und Alltag', description: 'Strukturierte Grundlagen zu Glauben, Gottesdienst, Charakter und muslimischem Alltag.', category: 'Glauben', icon: GraduationCap, progress: 21, lessons: 48, accent: 'emerald', badge: 'Beliebt' },
  { id: 'names', title: '99 Namen Allahs', subtitle: 'Bedeutung und Reflexion', description: 'Lerne die schönsten Namen Allahs mit Bedeutung, Aussprache und persönlicher Reflexion.', category: 'Glauben', icon: Sparkles, progress: 18, lessons: 99, accent: 'gold' },
  { id: 'prophets', title: 'Propheten', subtitle: 'Geschichten und Lehren', description: 'Lerne die Geschichten der Propheten und die wichtigsten Lehren für das heutige Leben.', category: 'Geschichte', icon: UsersRound, progress: 8, lessons: 25, accent: 'cream' },
  { id: 'wudu', title: 'Wudu & Salah', subtitle: 'Schritt für Schritt', description: 'Visuelle Anleitungen für Gebetswaschung, Gebetsablauf und häufige Fragen.', category: 'Praxis', icon: HandHeart, progress: 67, lessons: 18, accent: 'emerald', badge: 'Fortsetzen' },
  { id: 'duas', title: 'Duas', subtitle: 'Für jeden Moment', description: 'Authentische Bittgebete für Alltag, Schutz, Reisen, Schlaf und besondere Situationen.', category: 'Quran & Sunnah', icon: Heart, progress: 27, lessons: 64, accent: 'gold' },
  { id: 'fasting', title: 'Fasten-Assistent', subtitle: 'Ramadan und freiwilliges Fasten', description: 'Fastentage, Absicht, Regeln und praktische Begleitung übersichtlich an einem Ort.', category: 'Praxis', icon: SunMedium, progress: 15, lessons: 22, accent: 'cream' },
  { id: 'hajj', title: 'Hajj & Umrah', subtitle: 'Ablauf und Vorbereitung', description: 'Eine klare Schritt-für-Schritt-Begleitung für Rituale, Duas und organisatorische Vorbereitung.', category: 'Praxis', icon: TentTree, progress: 4, lessons: 31, accent: 'emerald' },
  { id: 'history', title: 'Islamische Geschichte', subtitle: 'Orte, Epochen und Persönlichkeiten', description: 'Erkunde wichtige Orte, Ereignisse und Persönlichkeiten der islamischen Geschichte.', category: 'Geschichte', icon: Landmark, progress: 9, lessons: 45, accent: 'gold' },
  { id: 'qibla', title: 'Qibla verstehen', subtitle: 'Richtung, Kaaba und Gebet', description: 'Verstehe die Bedeutung der Qibla und nutze anschließend den integrierten Kompass.', category: 'Praxis', icon: Compass, progress: 0, lessons: 7, accent: 'cream' },
  { id: 'quiz', title: 'Islam Quiz', subtitle: 'Wissen spielerisch prüfen', description: 'Teste dein Wissen in verschiedenen Kategorien und sammle Lernfortschritt.', category: 'Glauben', icon: BrainCircuit, progress: 42, lessons: 20, accent: 'emerald', badge: 'Neu' },
];

export function LearnScreen({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<Category>('Alle');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Module | null>(null);
  const [favorites, setFavorites] = useState(() => new Set(['quran', 'names']));
  const [toast, setToast] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('de-DE');
    return modules.filter((module) => {
      const categoryMatches = category === 'Alle' || module.category === category;
      const queryMatches = !normalized || `${module.title} ${module.subtitle} ${module.description}`.toLocaleLowerCase('de-DE').includes(normalized);
      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  const overallProgress = Math.round(modules.reduce((sum, module) => sum + module.progress, 0) / modules.length);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <motion.main
      className="screen learn-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="learn-header glass-card">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div>
          <span className="overline">Lernen & entdecken</span>
          <h1>Islam verstehen</h1>
        </div>
        <span className="learn-header__icon"><GraduationCap size={23} /></span>
      </header>

      <section className="learning-hero">
        <div className="learning-hero__pattern" aria-hidden="true">۞</div>
        <div className="learning-hero__copy">
          <span className="hero-pill">Deine Lernreise</span>
          <h2>Wissen, das dich im Alltag begleitet</h2>
          <p>Strukturierte Inhalte in einem ruhigen, klaren und hochwertigen Lernerlebnis.</p>
        </div>
        <div className="learning-progress">
          <div className="learning-progress__ring" style={{ '--learn-progress': `${overallProgress}%` } as React.CSSProperties}>
            <strong>{overallProgress}%</strong>
          </div>
          <span><strong>Gesamtfortschritt</strong><small>{favorites.size} Favoriten · {modules.length} Bereiche</small></span>
        </div>
      </section>

      <section className="learn-search-section">
        <label className="learn-search glass-card">
          <Search size={19} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quran, Gebet, Propheten …" />
          {query ? <button onClick={() => setQuery('')} aria-label="Suche löschen"><X size={17} /></button> : null}
        </label>
        <div className="learn-filters" aria-label="Lernkategorien">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'learn-filter learn-filter--active' : 'learn-filter'} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="featured-learning glass-card">
        <div className="featured-learning__icon"><BookOpen size={30} /></div>
        <div>
          <span className="overline">Zuletzt geöffnet</span>
          <h2>Surah Al-Kahf weiterlesen</h2>
          <p>Ayah 18 von 110 · Übersetzung und Tafsir</p>
          <div className="featured-learning__progress"><span /></div>
        </div>
        <button onClick={() => flash('Quran-Lesemodus geöffnet')} aria-label="Weiterlesen"><ChevronRight size={21} /></button>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div><span className="overline">Bibliothek</span><h2>{category === 'Alle' ? 'Alle Lernbereiche' : category}</h2></div>
          <span className="learn-result-count">{filteredModules.length} Bereiche</span>
        </div>

        {filteredModules.length ? (
          <div className="learning-grid">
            {filteredModules.map((module, index) => {
              const Icon = module.icon;
              const favorite = favorites.has(module.id);
              return (
                <motion.article
                  key={module.id}
                  className={`learning-card learning-card--${module.accent}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.035, 0.25) }}
                >
                  <button className={favorite ? 'learning-card__favorite learning-card__favorite--active' : 'learning-card__favorite'} onClick={() => toggleFavorite(module.id)} aria-label={`${module.title} favorisieren`}>
                    <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
                  </button>
                  {module.badge ? <span className="learning-card__badge">{module.badge}</span> : null}
                  <span className="learning-card__icon"><Icon size={27} /></span>
                  <span className="learning-card__category">{module.category}</span>
                  <h3>{module.title}</h3>
                  <p>{module.subtitle}</p>
                  <div className="learning-card__meta">
                    <span><Clock3 size={14} /> {module.lessons} Einheiten</span>
                    <strong>{module.progress}%</strong>
                  </div>
                  <div className="learning-card__progress"><span style={{ width: `${module.progress}%` }} /></div>
                  <button className="learning-card__open" onClick={() => setSelected(module)}>Öffnen <ChevronRight size={17} /></button>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="learn-empty glass-card">
            <Search size={30} />
            <h3>Keine Inhalte gefunden</h3>
            <p>Ändere den Suchbegriff oder wähle eine andere Kategorie.</p>
            <button className="gold-button" onClick={() => { setQuery(''); setCategory('Alle'); }}>Alle Bereiche anzeigen</button>
          </div>
        )}
      </section>

      <section className="ai-learning-card glass-card">
        <span className="ai-learning-card__icon"><MessageCircleQuestion size={28} /></span>
        <div><span className="overline">KI-Assistent</span><h2>Fragen stellen und Inhalte erklären lassen</h2><p>Das Premium-Design ist vorbereitet. Die echte, quellenbasierte KI-Anbindung folgt separat.</p></div>
        <span className="ai-learning-card__status">Design bereit</span>
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div className="learn-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.section className="learn-modal" initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <button className="learn-modal__close" onClick={() => setSelected(null)} aria-label="Schließen"><X size={19} /></button>
              <span className={`learn-modal__icon learn-modal__icon--${selected.accent}`}><selected.icon size={33} /></span>
              <span className="overline">{selected.category}</span>
              <h2>{selected.title}</h2>
              <h3>{selected.subtitle}</h3>
              <p>{selected.description}</p>
              <div className="learn-modal__stats">
                <span><strong>{selected.lessons}</strong><small>Einheiten</small></span>
                <span><strong>{selected.progress}%</strong><small>Fortschritt</small></span>
                <span><strong>{favorites.has(selected.id) ? 'Ja' : 'Nein'}</strong><small>Favorit</small></span>
              </div>
              <button className="gold-button" onClick={() => { flash(`${selected.title} geöffnet`); setSelected(null); }}>Lernen beginnen <ChevronRight size={17} /></button>
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
