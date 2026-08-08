import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  BellRing,
  BookOpenCheck,
  Bookmark,
  BrainCircuit,
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Globe2,
  HeartHandshake,
  Library,
  MapPinned,
  Maximize2,
  Milestone,
  Minimize2,
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
import { motion } from 'motion/react';
import { readCalendarEntries, writeCalendarEntries } from './calendarReminderService';
import type { PersonalCalendarEntry } from './calendarReminderService';
import { formatPrayerRemaining, getNextPrayer } from './prayerSchedule';

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

const VISUAL_REVISION = '8';
const visual = (path: string) => `${path}?v=${VISUAL_REVISION}`;
const FASTING_REMINDER_ID_BASE = 7_100_000_000_000;
const FASTING_REMINDER_ID_MAX = FASTING_REMINDER_ID_BASE + 1_000_000_000;

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
  { id: 'fasting', title: 'Fasten-Assistent', subtitle: 'Freiwillige Fastentage', description: 'Montag, Donnerstag und berechnete weiße Tage mit echten lokalen Erinnerungen planen.', icon: MoonStar, art: '/premium-assets/high-res-objects/calendar-chip-v2.webp' },
  { id: 'ummah', title: 'Ummah-Übersicht', subtitle: 'Muslime weltweit', description: 'Regionen, Orte und Gemeinschaften als Lernübersicht entdecken.', icon: Globe2, art: '/premium-assets/high-res-objects/dome-v2.webp' },
  { id: 'places', title: 'Islamische Orte', subtitle: 'Makkah, Madinah & Al-Aqsa', description: 'Bedeutende Orte mit kompakten Einführungen.', icon: MapPinned, art: '/premium-assets/high-res-objects/mosque-gold-v2.webp' },
  { id: 'jumuah', title: 'Jumuah', subtitle: 'Freitag vorbereiten', description: 'Eine lokal gespeicherte Checkliste für die Freitagsvorbereitung.', icon: CalendarHeart, art: '/premium-assets/high-res-objects/mihrab-arch-v2.webp' },
  { id: 'zakat', title: 'Zakat-Rechner', subtitle: 'Planungshilfe', description: 'Eine transparente 2,5%-Planungsrechnung für eine zuvor fachlich bestimmte Bemessungsgrundlage.', icon: BadgeDollarSign, art: '/premium-assets/high-res-objects/bookmark-v2.webp' },
  { id: 'standby', title: 'Gebetsanzeige', subtitle: 'Standby-Modus', description: 'Ruhige Live-Ansicht für das nächste Gebet mit optionalem Vollbild.', icon: Radio, art: '/premium-assets/high-res-objects/qibla-compass-v2.webp' },
];

const allFeatures = [...learningLegacyFeatures, ...serviceLegacyFeatures];

type GenericFeatureId = Exclude<LegacyFeatureId, 'quiz' | 'fasting' | 'hadith-library' | 'zakat' | 'standby'>;

const featureContent: Record<GenericFeatureId, string[]> = {
  knowledge: ['Grundlagen des Glaubens', 'Anbetung und Alltag', 'Islamische Geschichte', 'Charakter und Verhalten'],
  prophets: ['Adam – Schöpfung und Verantwortung', 'Nuh – Geduld und Standhaftigkeit', 'Ibrahim – Vertrauen und Hingabe', 'Musa – Mut und Führung', 'Isa – Zeichen und Barmherzigkeit', 'Muhammad ﷺ – Vorbild und Botschaft'],
  hajj: ['Ihram und Absicht', 'Tawaf', 'Sa’i zwischen Safa und Marwa', 'Arafat', 'Muzdalifah und Mina', 'Abschluss und Rückkehr'],
  sunnah: ['Gute Absicht erneuern', 'Mit Bismillah beginnen', 'Freundlich sprechen', 'Dankbarkeit zeigen', 'Rechte anderer achten', 'Regelmäßig um Vergebung bitten'],
  sins: ['Fehler ehrlich erkennen', 'Die Handlung beenden', 'Allah um Vergebung bitten', 'Entschlossen nicht zurückzukehren', 'Rechte anderer wiederherstellen', 'Hoffnung nicht verlieren'],
  ummah: ['Gemeinschaften nach Region', 'Moscheen und Bildungsorte', 'Sprachen und Kulturen', 'Lokale Veranstaltungen'],
  places: ['Al-Masjid al-Haram in Makkah', 'Al-Masjid an-Nabawi in Madinah', 'Al-Masjid al-Aqsa in Jerusalem'],
  jumuah: ['Ghusl und saubere Kleidung', 'Frühzeitig zur Moschee gehen', 'Khutbah aufmerksam zuhören', 'Salawat und Dua vermehren'],
};

const quizQuestions = [
  { question: 'Wie viele Pflichtgebete gibt es täglich?', answers: ['Drei', 'Vier', 'Fünf', 'Sechs'], correct: 2 },
  { question: 'Welche Sure eröffnet den Quran?', answers: ['Al-Fatiha', 'Al-Baqara', 'Al-Ikhlas', 'An-Nas'], correct: 0 },
  { question: 'In welchem Monat wird gefastet?', answers: ['Muharram', 'Rajab', 'Ramadan', 'Shawwal'], correct: 2 },
  { question: 'Wohin richtet sich das Gebet?', answers: ['Madinah', 'Zur Kaaba', 'Jerusalem', 'Zum Sonnenaufgang'], correct: 1 },
  { question: 'Wie heißt die Gebetswaschung?', answers: ['Adhan', 'Wudu', 'Dhikr', 'Khutbah'], correct: 1 },
] as const;

const hadithItems = [
  { id: 'intentions', title: 'Absichten', summary: 'Sinngemäßer Inhalt: Der Wert einer Handlung hängt von der Absicht ab.', source: 'Sahih al-Bukhari 1; Sahih Muslim 1907' },
  { id: 'mercy', title: 'Barmherzigkeit', summary: 'Sinngemäßer Inhalt: Wer anderen keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt.', source: 'Sahih al-Bukhari 6013; Sahih Muslim 2319' },
  { id: 'good-word', title: 'Ein gutes Wort', summary: 'Sinngemäßer Inhalt: Auch ein gutes Wort gilt als Wohltätigkeit.', source: 'Sahih al-Bukhari 2989; Sahih Muslim 1009' },
  { id: 'anger', title: 'Selbstbeherrschung', summary: 'Sinngemäßer Inhalt: Wirkliche Stärke zeigt sich darin, sich im Zorn zu beherrschen.', source: 'Sahih al-Bukhari 6114; Sahih Muslim 2609' },
  { id: 'brother', title: 'Für den anderen wünschen', summary: 'Sinngemäßer Inhalt: Vollständiger Glaube schließt ein, für andere das Gute zu wünschen, das man für sich selbst wünscht.', source: 'Sahih al-Bukhari 13; Sahih Muslim 45' },
  { id: 'ease', title: 'Erleichtern', summary: 'Sinngemäßer Inhalt: Erleichtert und erschwert nicht; gebt frohe Botschaft und schreckt nicht ab.', source: 'Sahih al-Bukhari 69; Sahih Muslim 1734' },
  { id: 'cleanliness', title: 'Reinheit', summary: 'Sinngemäßer Inhalt: Reinheit besitzt im Glauben einen hohen Stellenwert.', source: 'Sahih Muslim 223' },
  { id: 'smile', title: 'Freundlichkeit', summary: 'Sinngemäßer Inhalt: Freundliche Begegnung und ein lächelndes Gesicht sind gute Taten.', source: 'Jami at-Tirmidhi 1956' },
] as const;

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Speicherung ist in eingeschränkten Browsermodi optional.
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: 'long' }).format(date);
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function previousDay(date: Date) {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() - 1);
  return value;
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
  const today = new Date();
  for (let offset = 1; offset <= 45; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    const hijriDay = getHijriDay(candidate);
    if (hijriDay >= 13 && hijriDay <= 15) return { date: candidate, day: hijriDay };
  }
  return null;
}

function fastingReminderId(date: Date, index: number) {
  return FASTING_REMINDER_ID_BASE + Number(dateKey(date).replaceAll('-', '')) * 10 + index;
}

function isFastingReminder(entry: PersonalCalendarEntry) {
  return entry.id >= FASTING_REMINDER_ID_BASE && entry.id < FASTING_REMINDER_ID_MAX;
}

function buildFastingReminderEntries(time: string, monday: Date, thursday: Date, whiteDay: ReturnType<typeof findNextWhiteDay>) {
  const items: Array<{ date: Date; title: string; index: number }> = [
    { date: monday, title: 'Fasten morgen · Montag', index: 1 },
    { date: thursday, title: 'Fasten morgen · Donnerstag', index: 2 },
  ];
  if (whiteDay) items.push({ date: whiteDay.date, title: `Fasten morgen · ${whiteDay.day}. berechneter Hijri-Tag`, index: 3 });

  return items.map(({ date, title, index }): PersonalCalendarEntry => {
    const reminderDate = previousDay(date);
    return {
      id: fastingReminderId(date, index),
      date: dateKey(reminderDate),
      title,
      time,
      reminder: true,
    };
  });
}

function FeatureHeader({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const Icon = feature.icon;
  return (
    <>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam Premium</span><h1>{feature.title}</h1></div>
        <span className="reference-legacy-header-icon"><Icon size={20} /></span>
      </header>
      <section className="reference-legacy-hero">
        <div className="reference-legacy-hero__copy"><span className="hero-pill">{feature.subtitle}</span><h2>{feature.title}</h2><p>{feature.description}</p></div>
        <img src={visual(feature.art)} alt="" aria-hidden="true" draggable={false} />
      </section>
    </>
  );
}

function QuizFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [bestScore, setBestScore] = useState(() => Math.min(quizQuestions.length, Math.max(0, readStored('nur_quiz_best_score', 0))));
  const question = quizQuestions[index];

  const answer = (answerIndex: number) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === question.correct) setScore((value) => value + 1);
  };

  const next = () => {
    if (selected === null) return;
    if (index === quizQuestions.length - 1) {
      const finalScore = Math.min(quizQuestions.length, score);
      const nextBest = Math.max(bestScore, finalScore);
      setBestScore(nextBest);
      writeStored('nur_quiz_best_score', nextBest);
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
          <span><CircleCheck size={30} /></span>
          <h2>{score} von {quizQuestions.length} richtig</h2>
          <p>Bestwert: {bestScore} von {quizQuestions.length}. Die Speicherung erfolgt nur auf diesem Gerät.</p>
          <button className="gold-button" onClick={restart}><RotateCcw size={17} /> Erneut versuchen</button>
        </section>
      ) : (
        <section className="reference-quiz-card">
          <div className="reference-quiz-progress"><span style={{ width: `${((index + 1) / quizQuestions.length) * 100}%` }} /></div>
          <small>Frage {index + 1} von {quizQuestions.length} · Bestwert {bestScore}</small>
          <h2>{question.question}</h2>
          <div className="reference-quiz-answers">
            {question.answers.map((item, answerIndex) => {
              const isSelected = selected === answerIndex;
              const isCorrect = selected !== null && answerIndex === question.correct;
              const isWrong = isSelected && answerIndex !== question.correct;
              return (
                <button
                  key={item}
                  className={`${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}
                  onClick={() => answer(answerIndex)}
                  disabled={selected !== null}
                >
                  <span>{String.fromCharCode(65 + answerIndex)}</span>{item}{isCorrect ? <Check size={18} /> : null}
                </button>
              );
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
  const [reminderTime, setReminderTime] = useState(() => readStored('nur_fasting_reminder_time', '20:00'));
  const [status, setStatus] = useState<string | null>(null);
  const nextMonday = useMemo(() => nextWeekday(1), []);
  const nextThursday = useMemo(() => nextWeekday(4), []);
  const whiteDay = useMemo(findNextWhiteDay, []);

  useEffect(() => {
    writeStored('nur_fasting_reminders', reminders);
    writeStored('nur_fasting_reminder_time', reminderTime);
    const retained = readCalendarEntries().filter((entry) => !isFastingReminder(entry));
    const fastingEntries = reminders ? buildFastingReminderEntries(reminderTime, nextMonday, nextThursday, whiteDay) : [];
    writeCalendarEntries([...retained, ...fastingEntries]);
  }, [nextMonday, nextThursday, reminderTime, reminders, whiteDay]);

  const toggle = async () => {
    const value = !reminders;
    setReminders(value);
    if (!value) {
      setStatus('Fasten-Erinnerungen wurden entfernt.');
      return;
    }

    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        setStatus(permission === 'granted'
          ? 'Erinnerungen geplant. Systemmeldungen sind freigegeben.'
          : 'Erinnerungen geplant. Ohne Systemfreigabe erscheinen sie nur bei aktiver App/PWA.');
        return;
      } catch {
        // In-app reminders still work while the app is active.
      }
    }
    setStatus('Erinnerungen für den Vorabend wurden geplant.');
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Nächste Möglichkeiten</span><h2>Freiwillige Fastentage</h2></div></div>
        <div className="reference-fasting-grid">
          <article><MoonStar size={22} /><small>Montag</small><strong>{formatDate(nextMonday)}</strong></article>
          <article><MoonStar size={22} /><small>Donnerstag</small><strong>{formatDate(nextThursday)}</strong></article>
          <article><Star size={22} /><small>Weißer Tag</small><strong>{whiteDay ? `${formatDate(whiteDay.date)} · ${whiteDay.day}. Hijri-Tag` : 'Nicht berechenbar'}</strong></article>
        </div>
      </section>
      <section className="reference-legacy-notice"><TriangleAlert size={19} /><p>Berechnete Hijri-Tage können je nach Region und lokaler Mondsichtung abweichen.</p></section>
      <section className="reference-fasting-reminder-settings">
        <label><span><Clock3 size={17} /> Erinnerung am Vorabend</span><input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} /></label>
        <button className="reference-legacy-toggle" onClick={() => void toggle()} aria-pressed={reminders}>
          <span><BellRing size={20} /><span><strong>Fasten-Erinnerungen</strong><small>{reminders ? `Geplant für ${reminderTime} Uhr` : 'Für die nächsten angezeigten Fastentage'}</small></span></span>
          <em className={reminders ? 'is-on' : ''}><i /></em>
        </button>
        {status ? <small className="reference-fasting-reminder-status">{status}</small> : null}
      </section>
    </motion.main>
  );
}

function HadithLibraryFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => readStored('nur_hadith_library_favorites', []));
  const filtered = hadithItems.filter((item) => `${item.title} ${item.summary} ${item.source}`.toLocaleLowerCase('de-DE').includes(query.toLocaleLowerCase('de-DE')));

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
        {filtered.map((item) => (
          <article key={item.id}>
            <div><span className="overline">{item.title}</span><p>{item.summary}</p><small>{item.source}</small></div>
            <button onClick={() => toggleFavorite(item.id)} aria-label={favorites.includes(item.id) ? 'Aus Favoriten entfernen' : 'Als Favorit speichern'} aria-pressed={favorites.includes(item.id)} className={favorites.includes(item.id) ? 'is-saved' : ''}><Bookmark size={18} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button>
          </article>
        ))}
      </section>
      {!filtered.length ? <div className="reference-empty-result"><Search size={24} /><strong>Kein Hadith gefunden</strong><small>Ändere den Suchbegriff.</small></div> : null}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die deutsche Formulierung ist als sinngemäße Inhaltsangabe gekennzeichnet. Wortlaut, Übersetzung und Einordnung benötigen vor Veröffentlichung eine fachliche Endprüfung.</p></section>
    </motion.main>
  );
}

function ZakatFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [base, setBase] = useState(() => readStored('nur_zakat_base', ''));
  const [deductions, setDeductions] = useState(() => readStored('nur_zakat_deductions', ''));
  const baseValue = Math.max(0, Number(base) || 0);
  const deductionValue = Math.max(0, Number(deductions) || 0);
  const net = Math.max(0, baseValue - deductionValue);
  const estimate = net * 0.025;

  useEffect(() => {
    writeStored('nur_zakat_base', base);
    writeStored('nur_zakat_deductions', deductions);
  }, [base, deductions]);

  const money = (value: number) => value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-zakat-calculator">
        <span className="overline">Planungsrechnung</span>
        <h2>2,5%-Schätzung</h2>
        <p>Trage nur eine Bemessungsgrundlage ein, für die nach deiner verlässlichen fachlichen Prüfung tatsächlich die 2,5%-Berechnung anwendbar ist.</p>
        <label>Bemessungsgrundlage in €<input type="number" min="0" step="0.01" inputMode="decimal" value={base} onChange={(event) => setBase(event.target.value)} placeholder="0,00" /></label>
        <label>Berücksichtigte Abzüge in €<input type="number" min="0" step="0.01" inputMode="decimal" value={deductions} onChange={(event) => setDeductions(event.target.value)} placeholder="0,00" /></label>
        <div className="reference-zakat-result"><span><small>Rechenbasis</small><strong>{money(net)} €</strong></span><span><small>2,5 % davon</small><strong>{money(estimate)} €</strong></span></div>
      </section>
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Diese Rechnung entscheidet nicht, ob Zakat fällig ist. Nisab, Besitzdauer, Vermögensart, Schulden und weitere Regeln müssen fachlich geprüft werden.</p></section>
    </motion.main>
  );
}

function StandbyFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const [fullscreen, setFullscreen] = useState(() => Boolean(document.fullscreenElement));
  const [status, setStatus] = useState<string | null>(null);
  const nextPrayer = getNextPrayer(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('fullscreenchange', syncFullscreen);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else setStatus('Vollbild wird von diesem Browser nicht unterstützt.');
    } catch {
      setStatus('Vollbild konnte nicht gestartet werden.');
    }
  };

  return (
    <motion.main className="screen reference-legacy-screen reference-standby-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-standby-stage">
        <span className="overline">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Gebet'}</span>
        <p className="reference-standby-arabic" dir="rtl">{nextPrayer.prayer.arabic}</p>
        <h2>{nextPrayer.prayer.label}</h2>
        <strong>{nextPrayer.prayer.time}</strong>
        <span className="reference-standby-countdown">noch {formatPrayerRemaining(nextPrayer.remaining)}</span>
        <button className="gold-button" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}{fullscreen ? 'Vollbild beenden' : 'Vollbild starten'}</button>
      </section>
      {status ? <section className="reference-legacy-notice"><TriangleAlert size={19} /><p>{status}</p></section> : null}
    </motion.main>
  );
}

function GenericFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const entries = featureContent[feature.id as GenericFeatureId] ?? [];
  const [completed, setCompleted] = useState<string[]>(() => readStored(`nur_feature_${feature.id}_progress`, []));

  const toggle = (entry: string) => {
    const value = completed.includes(entry) ? completed.filter((item) => item !== entry) : [...completed, entry];
    setCompleted(value);
    writeStored(`nur_feature_${feature.id}_progress`, value);
  };

  return (
    <motion.main className="screen reference-legacy-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Übersicht</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{completed.length}/{entries.length}</span></div>
        <div className="reference-legacy-list">
          {entries.map((entry, index) => <button key={entry} onClick={() => toggle(entry)} className={completed.includes(entry) ? 'is-complete' : ''}><span>{completed.includes(entry) ? <CircleCheck size={19} /> : index + 1}</span><strong>{entry}</strong><ChevronRight size={18} /></button>)}
        </div>
      </section>
      <section className="reference-legacy-notice"><HeartHandshake size={19} /><p>Religiöse oder finanzielle Inhalte ersetzen keine individuelle Auskunft durch eine qualifizierte Stelle.</p></section>
    </motion.main>
  );
}

export function LegacyFeatureScreen({ featureId, onBack }: { featureId: LegacyFeatureId; onBack: () => void }) {
  const feature = allFeatures.find((item) => item.id === featureId) ?? learningLegacyFeatures[0];
  if (featureId === 'quiz') return <QuizFeature feature={feature} onBack={onBack} />;
  if (featureId === 'fasting') return <FastingFeature feature={feature} onBack={onBack} />;
  if (featureId === 'hadith-library') return <HadithLibraryFeature feature={feature} onBack={onBack} />;
  if (featureId === 'zakat') return <ZakatFeature feature={feature} onBack={onBack} />;
  if (featureId === 'standby') return <StandbyFeature feature={feature} onBack={onBack} />;
  return <GenericFeature feature={feature} onBack={onBack} />;
}
