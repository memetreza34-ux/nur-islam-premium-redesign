import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  BookOpenCheck,
  Bookmark,
  BrainCircuit,
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Globe2,
  HeartHandshake,
  Library,
  MapPinned,
  Milestone,
  MoonStar,
  Mountain,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TriangleAlert,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export type LegacyFeatureId =
  | 'fasting'
  | 'ummah'
  | 'hadith-library'
  | 'knowledge'
  | 'prophets'
  | 'quiz'
  | 'hajj'
  | 'sunnah'
  | 'sins'
  | 'places'
  | 'jumuah'
  | 'zakat'
  | 'standby';

export type LegacyFeatureItem = {
  id: LegacyFeatureId;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  art: string;
};

export const learningLegacyFeatures: LegacyFeatureItem[] = [
  { id: 'hadith-library', title: 'Hadith-Sammlung', subtitle: 'Quellen & Einordnung', description: 'Hadithe durchsuchen, lesen und lokal speichern.', icon: Library, art: '/premium-assets/high-res-objects/lantern-v2.webp' },
  { id: 'knowledge', title: 'Wissensbibliothek', subtitle: 'Themen strukturiert lernen', description: 'Aqidah, Fiqh, Geschichte und Charakter in einem Bereich.', icon: BookOpenCheck, art: '/premium-assets/high-res-objects/quran-open-v2.webp' },
  { id: 'prophets', title: 'Propheten', subtitle: 'Geschichten & Lehren', description: 'Überblicke über Propheten und zentrale Lehren ihrer Geschichten.', icon: Milestone, art: '/premium-assets/high-res-objects/mihrab-v2.webp' },
  { id: 'quiz', title: 'Islam-Quiz', subtitle: 'Wissen testen', description: 'Kurze Fragen, direkte Auswertung und lokaler Bestwert.', icon: BrainCircuit, art: '/premium-assets/high-res-objects/quran-closed-v2.webp' },
  { id: 'hajj', title: 'Hajj & Umrah', subtitle: 'Ablauf verstehen', description: 'Stationen, Begriffe und Vorbereitung kompakt geordnet.', icon: Mountain, art: '/premium-assets/high-res-objects/kaaba-v2.webp' },
  { id: 'sunnah', title: 'Sunnah im Alltag', subtitle: 'Gute Gewohnheiten', description: 'Praktische, quellenorientierte Alltagserinnerungen.', icon: Sparkles, art: '/premium-assets/high-res-objects/sun-emblem-v2.webp' },
  { id: 'sins', title: 'Fehler & Reue', subtitle: 'Rückkehr zu Allah', description: 'Ein ruhiger Bereich zu Reue, Wiedergutmachung und Hoffnung.', icon: ShieldCheck, art: '/premium-assets/high-res-objects/dome-v2.webp' },
];

export const serviceLegacyFeatures: LegacyFeatureItem[] = [
  { id: 'fasting', title: 'Fasten-Assistent', subtitle: 'Freiwillige Fastentage', description: 'Montag, Donnerstag und weiße Tage im Blick behalten.', icon: MoonStar, art: '/premium-assets/high-res-objects/calendar-chip-v2.webp' },
  { id: 'ummah', title: 'Ummah-Weltkarte', subtitle: 'Muslime weltweit', description: 'Regionen, Orte und Gemeinschaften entdecken.', icon: Globe2, art: '/premium-assets/high-res-objects/dome-v2.webp' },
  { id: 'places', title: 'Islamische Orte', subtitle: 'Makkah, Madinah & Al-Aqsa', description: 'Bedeutende Orte mit kompakten Einführungen.', icon: MapPinned, art: '/premium-assets/high-res-objects/mosque-gold-v2.webp' },
  { id: 'jumuah', title: 'Jumuah', subtitle: 'Freitag vorbereiten', description: 'Checkliste und Erinnerungen für den Freitag.', icon: CalendarHeart, art: '/premium-assets/high-res-objects/mihrab-arch-v2.webp' },
  { id: 'zakat', title: 'Zakat', subtitle: 'Grundlagen verstehen', description: 'Begriffe, Vermögensarten und Hinweise zur Berechnung.', icon: BadgeDollarSign, art: '/premium-assets/high-res-objects/bookmark-v2.webp' },
  { id: 'standby', title: 'Gebetsanzeige', subtitle: 'Standby-Modus', description: 'Ruhige Vollbildansicht für das nächste Gebet.', icon: Radio, art: '/premium-assets/high-res-objects/qibla-compass-v2.webp' },
];

const allFeatures = [...learningLegacyFeatures, ...serviceLegacyFeatures];

const featureContent: Record<Exclude<LegacyFeatureId, 'quiz' | 'fasting' | 'hadith-library'>, string[]> = {
  knowledge: ['Grundlagen des Glaubens', 'Anbetung und Alltag', 'Islamische Geschichte', 'Charakter und Verhalten'],
  prophets: ['Adam – Schöpfung und Verantwortung', 'Nuh – Geduld und Standhaftigkeit', 'Ibrahim – Vertrauen und Hingabe', 'Musa – Mut und Führung', 'Isa – Zeichen und Barmherzigkeit', 'Muhammad ﷺ – Vorbild und Botschaft'],
  hajj: ['Ihram und Absicht', 'Tawaf', 'Sa’i zwischen Safa und Marwa', 'Arafat', 'Muzdalifah und Mina', 'Abschluss und Rückkehr'],
  sunnah: ['Gute Absicht erneuern', 'Mit Bismillah beginnen', 'Freundlich sprechen', 'Dankbarkeit zeigen', 'Rechte anderer achten', 'Regelmäßig um Vergebung bitten'],
  sins: ['Fehler ehrlich erkennen', 'Die Handlung beenden', 'Allah um Vergebung bitten', 'Entschlossen nicht zurückzukehren', 'Rechte anderer wiederherstellen', 'Hoffnung nicht verlieren'],
  ummah: ['Gemeinschaften nach Region', 'Moscheen und Bildungsorte', 'Sprachen und Kulturen', 'Lokale Veranstaltungen'],
  places: ['Al-Masjid al-Haram in Makkah', 'Al-Masjid an-Nabawi in Madinah', 'Al-Masjid al-Aqsa in Jerusalem'],
  jumuah: ['Ghusl und saubere Kleidung', 'Frühzeitig zur Moschee gehen', 'Khutbah aufmerksam zuhören', 'Salawat und Dua vermehren'],
  zakat: ['Zakatpflichtige Vermögensarten erfassen', 'Nisab und Besitzdauer prüfen', 'Schulden und verfügbare Mittel einordnen', 'Bei Unsicherheit eine qualifizierte Stelle fragen'],
  standby: ['Nächstes Gebet groß anzeigen', 'Restzeit ruhig darstellen', 'Bildschirm wach halten', 'Helligkeit reduzieren'],
};

const quizQuestions = [
  { question: 'Wie viele Pflichtgebete gibt es täglich?', answers: ['Drei', 'Vier', 'Fünf', 'Sechs'], correct: 2 },
  { question: 'Welche Sure eröffnet den Quran?', answers: ['Al-Fatiha', 'Al-Baqara', 'Al-Ikhlas', 'An-Nas'], correct: 0 },
  { question: 'In welchem Monat wird gefastet?', answers: ['Muharram', 'Rajab', 'Ramadan', 'Shawwal'], correct: 2 },
  { question: 'Wohin richtet sich das Gebet?', answers: ['Madinah', 'Zur Kaaba', 'Jerusalem', 'Zum Sonnenaufgang'], correct: 1 },
  { question: 'Wie heißt die Gebetswaschung?', answers: ['Adhan', 'Wudu', 'Dhikr', 'Khutbah'], correct: 1 },
];

const hadithItems = [
  { id: 'intentions', title: 'Absichten', summary: 'Sinngemäßer Inhalt: Der Wert einer Handlung hängt von der Absicht ab.', source: 'Sahih al-Bukhari 1; Sahih Muslim 1907' },
  { id: 'mercy', title: 'Barmherzigkeit', summary: 'Sinngemäßer Inhalt: Wer anderen keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt.', source: 'Sahih al-Bukhari 6013; Sahih Muslim 2319' },
  { id: 'good-word', title: 'Ein gutes Wort', summary: 'Sinngemäßer Inhalt: Auch ein gutes Wort gilt als Wohltätigkeit.', source: 'Sahih al-Bukhari 2989; Sahih Muslim 1009' },
  { id: 'anger', title: 'Selbstbeherrschung', summary: 'Sinngemäßer Inhalt: Wirkliche Stärke zeigt sich darin, sich im Zorn zu beherrschen.', source: 'Sahih al-Bukhari 6114; Sahih Muslim 2609' },
  { id: 'brother', title: 'Für den anderen wünschen', summary: 'Sinngemäßer Inhalt: Vollständiger Glaube schließt ein, für andere das Gute zu wünschen, das man für sich selbst wünscht.', source: 'Sahih al-Bukhari 13; Sahih Muslim 45' },
  { id: 'ease', title: 'Erleichtern', summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht; gebt frohe Botschaft und schreckt nicht ab.', source: 'Sahih al-Bukhari 69; Sahih Muslim 1734' },
  { id: 'cleanliness', title: 'Reinheit', summary: 'Sinngemäßer Inhalt: Reinheit besitzt im Glauben einen hohen Stellenwert.', source: 'Sahih Muslim 223' },
  { id: 'smile', title: 'Freundlichkeit', summary: 'Sinngemäßer Inhalt: Freundliche Begegnung und ein lächelndes Gesicht sind gute Taten.', source: 'Jami at-Tirmidhi 1956' },
];

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is optional when storage access is restricted.
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }).format(date);
}

function nextWeekday(target: number) {
  const date = new Date();
  const difference = (target - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + difference);
  return date;
}

function getHijriDay(date: Date) {
  try {
    return Number(new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric' }).format(date));
  } catch {
    return 0;
  }
}

function findNextWhiteDay() {
  const date = new Date();
  for (let index = 1; index <= 45; index += 1) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() + index);
    const day = getHijriDay(candidate);
    if (day >= 13 && day <= 15) return { date: candidate, day };
  }
  return null;
}

function FeatureHeader({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const Icon = feature.icon;
  return (
    <>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Aus der vollständigen Nur-Islam-App</span><h1>{feature.title}</h1></div>
        <span className="reference-legacy-header-icon"><Icon size={20} /></span>
      </header>
      <section className="reference-legacy-hero">
        <div className="reference-legacy-hero__copy"><span className="hero-pill">{feature.subtitle}</span><h2>{feature.title}</h2><p>{feature.description}</p></div>
        <img src={feature.art} alt="" aria-hidden="true" />
      </section>
    </>
  );
}

function QuizFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const bestScore = readStored('nur_quiz_best_score', 0);
  const question = quizQuestions[index];

  const answer = (answerIndex: number) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === question.correct) setScore((value) => value + 1);
  };

  const next = () => {
    if (index === quizQuestions.length - 1) {
      const finalScore = score + (selected === question.correct ? 1 : 0);
      writeStored('nur_quiz_best_score', Math.max(bestScore, finalScore));
      setComplete(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      {complete ? (
        <section className="reference-quiz-result">
          <span><CircleCheck size={30} /></span><h2>{score} von {quizQuestions.length} richtig</h2><p>Dein Bestwert wird nur auf diesem Gerät gespeichert.</p>
          <button className="gold-button" onClick={restart}><RotateCcw size={17} /> Erneut versuchen</button>
        </section>
      ) : (
        <section className="reference-quiz-card">
          <div className="reference-quiz-progress"><span style={{ width: `${((index + 1) / quizQuestions.length) * 100}%` }} /></div>
          <small>Frage {index + 1} von {quizQuestions.length}</small><h2>{question.question}</h2>
          <div className="reference-quiz-answers">
            {question.answers.map((item, answerIndex) => {
              const isSelected = selected === answerIndex;
              const isCorrect = selected !== null && answerIndex === question.correct;
              const isWrong = isSelected && answerIndex !== question.correct;
              return <button key={item} className={`${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`} onClick={() => answer(answerIndex)}><span>{String.fromCharCode(65 + answerIndex)}</span>{item}{isCorrect ? <Check size={18} /> : null}</button>;
            })}
          </div>
          <button className="gold-button" disabled={selected === null} onClick={next}>{index === quizQuestions.length - 1 ? 'Auswertung' : 'Weiter'} <ChevronRight size={17} /></button>
        </section>
      )}
    </motion.main>
  );
}

function FastingFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [reminders, setReminders] = useState(() => readStored('nur_fasting_reminders', false));
  const nextMonday = useMemo(() => nextWeekday(1), []);
  const nextThursday = useMemo(() => nextWeekday(4), []);
  const whiteDay = useMemo(findNextWhiteDay, []);

  const toggle = () => {
    const value = !reminders;
    setReminders(value);
    writeStored('nur_fasting_reminders', value);
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section"><div className="section-heading"><div><span className="overline">Nächste Möglichkeiten</span><h2>Freiwillige Fastentage</h2></div></div>
        <div className="reference-fasting-grid">
          <article><MoonStar size={22} /><small>Montag</small><strong>{formatDate(nextMonday)}</strong></article>
          <article><MoonStar size={22} /><small>Donnerstag</small><strong>{formatDate(nextThursday)}</strong></article>
          <article><Star size={22} /><small>Weißer Tag</small><strong>{whiteDay ? `${formatDate(whiteDay.date)} ·  ${whiteDay.day}. Hijri-Tag` : 'Nicht berechenbar'}</strong></article>
        </div>
      </section>
      <section className="reference-legacy-notice"><TriangleAlert size={19} /><p>Die berechneten Hijri-Tage können je nach Region und lokaler Mondsichtung abweichen.</p></section>
      <button className="reference-legacy-toggle" onClick={toggle}><span><CalendarHeart size={20} /><span><strong>Fasten-Erinnerungen</strong><small>Lokal auf diesem Gerät speichern</small></span></span><em className={reminders ? 'is-on' : ''}><i /></em></button>
    </motion.main>
  );
}

function HadithLibraryFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => readStored('nur_hadith_library_favorites', []));
  const filtered = hadithItems.filter((item) => `${item.title} ${item.summary} ${item.source}`.toLowerCase().includes(query.toLowerCase()));

  const toggleFavorite = (id: string) => {
    const value = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(value);
    writeStored('nur_hadith_library_favorites', value);
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <label className="reference-legacy-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hadithe durchsuchen" /></label>
      <section className="reference-hadith-library">
        {filtered.map((item) => <article key={item.id}><div><span className="overline">{item.title}</span><p>{item.summary}</p><small>{item.source}</small></div><button onClick={() => toggleFavorite(item.id)} aria-label={favorites.includes(item.id) ? 'Aus Favoriten entfernen' : 'Als Favorit speichern'} className={favorites.includes(item.id) ? 'is-saved' : ''}><Bookmark size={18} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button></article>)}
      </section>
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die deutsche Formulierung ist als sinngemäße Inhaltsangabe gekennzeichnet. Für Veröffentlichungen werden Wortlaut, Übersetzung und Einordnung erneut fachlich geprüft.</p></section>
    </motion.main>
  );
}

function GenericFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const entries = featureContent[feature.id as Exclude<LegacyFeatureId, 'quiz' | 'fasting' | 'hadith-library'>];
  const [completed, setCompleted] = useState<string[]>(() => readStored(`nur_feature_${feature.id}_progress`, []));

  const toggle = (entry: string) => {
    const value = completed.includes(entry) ? completed.filter((item) => item !== entry) : [...completed, entry];
    setCompleted(value);
    writeStored(`nur_feature_${feature.id}_progress`, value);
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section"><div className="section-heading"><div><span className="overline">Übersicht</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{completed.length}/{entries.length}</span></div>
        <div className="reference-legacy-list">{entries.map((entry, index) => <button key={entry} onClick={() => toggle(entry)} className={completed.includes(entry) ? 'is-complete' : ''}><span>{completed.includes(entry) ? <CircleCheck size={19} /> : index + 1}</span><strong>{entry}</strong><ChevronRight size={18} /></button>)}</div>
      </section>
      <section className="reference-legacy-notice"><HeartHandshake size={19} /><p>Dieser Bereich übernimmt die Funktion aus der alten App in die neue Premium-Struktur. Inhalte mit religiöser oder finanzieller Tragweite ersetzen keine individuelle Auskunft durch eine qualifizierte Stelle.</p></section>
    </motion.main>
  );
}

export function LegacyFeatureScreen({ featureId, onBack }: { featureId: LegacyFeatureId; onBack: () => void }) {
  const feature = allFeatures.find((item) => item.id === featureId) ?? learningLegacyFeatures[0];
  if (featureId === 'quiz') return <QuizFeature feature={feature} onBack={onBack} />;
  if (featureId === 'fasting') return <FastingFeature feature={feature} onBack={onBack} />;
  if (featureId === 'hadith-library') return <HadithLibraryFeature feature={feature} onBack={onBack} />;
  return <GenericFeature feature={feature} onBack={onBack} />;
}
