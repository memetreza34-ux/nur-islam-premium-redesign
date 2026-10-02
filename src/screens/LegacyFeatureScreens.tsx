import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { SAHABAH, WOMEN_IN_ISLAM } from '../data/companionData';
import { GLOSSARY_TERMS, KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { REPENTANCE_GROUPS, SUNNAH_GROUPS } from '../data/practiceData';
import { UMMAH_COUNTRIES, UMMAH_REGIONS } from '../data/ummahData';
import { HAJJ_STATIONS, HOLY_PLACES, UMRAH_STATIONS } from '../data/pilgrimageData';
import type { PilgrimageStation } from '../data/pilgrimageData';
import { PROPHETS } from '../data/prophetData';
import { PROPHET_COURSES } from '../data/prophetCourseData';
import { PROPHET_COURSE_OVERVIEWS } from '../data/prophetCourseOverviews';
import { QUIZ_CATEGORIES } from '../data/quizData';
import { learningLegacyFeatures, quizFeature, serviceLegacyFeatures, visual } from '../data/legacyFeatures';
import type { LegacyFeatureId, LegacyFeatureItem } from '../data/legacyFeatures';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeDollarSign,
  BellRing,
  BookOpenCheck,
  Bookmark,
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
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
import { motion, useReducedMotion } from 'motion/react';
import { versionAppPath } from '../app/appPaths';
import { HADITH_LIBRARY, readSavedHadithIds, writeSavedHadithIds } from '../data/hadithData';
import { FOUNDATION_SUPPLEMENTS } from '../data/foundationSupplementData';
import { FoundationChapter, FoundationExample, FoundationGuideIntro, FoundationSource } from '../shared/FoundationGuide';
import { syncRollingFastingReminders } from '../services/fastingReminderService';
import { formatPrayerRemaining, getNextPrayer } from '../services/prayerSchedule';
const MadhhabCatalogueFeature = lazy(() => import('./MadhhabCatalogue').then((module) => ({ default: module.MadhhabCatalogueFeature })));

const allFeatures = [...learningLegacyFeatures, ...serviceLegacyFeatures];

const PROPHET_PROGRESS_KEY = 'nur_prophet_course_progress_v1';
const PROPHET_RETURN_KEY = 'nur_prophet_course_return_v1';

type ProphetCourseProgress = Record<string, {
  chapterIndex: number;
  completedChapterIds: string[];
}>;

const PROPHET_NAME_PRONUNCIATION: Readonly<Record<string, string>> = {
  adam: 'Aa-dam', idris: 'Id-riis', nuh: 'Nuuh', hud: 'Huud', salih: 'Saa-lih',
  ibrahim: 'Ib-raa-hiim', lut: 'Luut', ismail: 'Is-maa-iil', ishaq: 'Is-haaq',
  yaqub: 'Ja-quub', yusuf: 'Juu-suf', ayyub: 'Aj-juub', shuayb: 'Schu-aib',
  musa: 'Muu-saa', harun: 'Haa-ruun', 'dhul-kifl': 'Dhul-Kifl', dawud: 'Daa-wuud',
  sulayman: 'Su-lai-maan', ilyas: 'Il-jaas', 'al-yasa': 'Al-Ja-sa', yunus: 'Juu-nus',
  zakariyya: 'Sa-ka-rij-jaa', yahya: 'Jah-jaa', isa: 'Ii-saa', muhammad: 'Mu-ham-mad',
};

function parseQuranReference(reference: string) {
  const match = reference.match(/Quran\s+(\d+):(\d+)/i);
  if (!match) return null;
  return { surahNumber: Number(match[1]), ayahNumber: Number(match[2]) };
}

const jumuahChecklist = [
  'Ghusl und saubere Kleidung',
  'Frühzeitig zur Moschee gehen',
  'Khutbah aufmerksam zuhören',
  'Salawat und Dua vermehren',
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

function FeatureHeader({
  feature,
  onBack,
  showHero = true,
}: {
  feature: LegacyFeatureItem;
  onBack: () => void;
  showHero?: boolean;
}) {
  const Icon = feature.icon;
  return (
    <>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam Premium</span><h1>{feature.title}</h1></div>
        <span className="reference-legacy-header-icon"><Icon size={20} /></span>
      </header>
      {showHero ? <section className="reference-legacy-hero">
        <div className="reference-legacy-hero__copy"><span className="hero-pill">{feature.subtitle}</span><h2>{feature.title}</h2><p>{feature.description}</p></div>
        <img src={visual(feature.art)} alt="" aria-hidden="true" draggable={false} />
      </section> : null}
    </>
  );
}

function LegacyMotionMain({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.main
      className={`screen reference-legacy-screen${className ? ` ${className}` : ''}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

function QuizFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  // Best scores are per category rather than one global number: with six
  // categories a single figure says nothing about where you stand.
  const [bestScores, setBestScores] = useState<Record<string, number>>(() => readStored('nur_quiz_best_scores', {}));
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  const category = QUIZ_CATEGORIES.find((entry) => entry.id === categoryId) ?? null;
  const questions = category?.questions ?? [];
  const question = questions[index];

  const startCategory = (id: string) => {
    setCategoryId(id);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  };

  const answer = (answerIndex: number) => {
    if (selected !== null || !question) return;
    setSelected(answerIndex);
    if (answerIndex === question.correctAnswer) setScore((value) => value + 1);
  };

  const next = () => {
    if (selected === null || !category) return;
    if (index === questions.length - 1) {
      const finalScore = Math.min(questions.length, score);
      const nextBest = { ...bestScores, [category.id]: Math.max(bestScores[category.id] ?? 0, finalScore) };
      setBestScores(nextBest);
      writeStored('nur_quiz_best_scores', nextBest);
      setComplete(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  if (!category) {
    return (
      <LegacyMotionMain>
        <FeatureHeader feature={feature} onBack={onBack} />
        <section className="reference-quiz-categories">
          {QUIZ_CATEGORIES.map((entry) => {
            const best = bestScores[entry.id];
            return (
              <button key={entry.id} onClick={() => startCategory(entry.id)}>
                <span className="reference-quiz-categories__copy">
                  <strong>{entry.title}</strong>
                  <small>{entry.description}</small>
                  <em>{entry.questions.length} Fragen{best === undefined ? '' : ` · Bestwert ${best} von ${entry.questions.length}`}</em>
                </span>
                <ChevronRight size={18} />
              </button>
            );
          })}
        </section>
      </LegacyMotionMain>
    );
  }

  const best = bestScores[category.id] ?? 0;

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      {complete ? (
        <section className="reference-quiz-result">
          <span><CircleCheck size={30} /></span>
          <h2>{score} von {questions.length} richtig</h2>
          <p>{category.title} · Bestwert {best} von {questions.length}. Die Speicherung erfolgt nur auf diesem Gerät.</p>
          <button className="gold-button" onClick={() => startCategory(category.id)}><RotateCcw size={17} /> Erneut versuchen</button>
          <button className="reference-quiz-back" onClick={() => setCategoryId(null)}><ChevronLeft size={16} /> Andere Kategorie</button>
        </section>
      ) : question ? (
        <section className="reference-quiz-card">
          <div className="reference-quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <small>{category.title} · Frage {index + 1} von {questions.length}</small>
          <h2>{question.question}</h2>
          <div className="reference-quiz-answers">
            {question.options.map((item, answerIndex) => {
              const isSelected = selected === answerIndex;
              const isCorrect = selected !== null && answerIndex === question.correctAnswer;
              const isWrong = isSelected && answerIndex !== question.correctAnswer;
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
          {/* Shown only after answering: the reason is the point of the quiz,
              but revealing it earlier would give the answer away. */}
          {selected === null ? null : (
            <p className="reference-quiz-explanation">
              <ShieldCheck size={16} />
              <span>{question.explanation}</span>
            </p>
          )}
          <button className="gold-button" disabled={selected === null} onClick={next}>{index === questions.length - 1 ? 'Auswertung' : 'Weiter'} <ChevronRight size={17} /></button>
        </section>
      ) : null}
    </LegacyMotionMain>
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
    syncRollingFastingReminders();
  }, [reminderTime, reminders]);

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
    <LegacyMotionMain>
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
    </LegacyMotionMain>
  );
}

function HadithLibraryFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const guide = FOUNDATION_SUPPLEMENTS['hadith-library'];
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readSavedHadithIds());
  const filtered = HADITH_LIBRARY.filter((item) => `${item.title} ${item.summary} ${item.source} ${item.context ?? ''}`.toLocaleLowerCase('de-DE').includes(query.trim().toLocaleLowerCase('de-DE')));

  const toggleFavorite = (id: string) => {
    const value = new Set(favorites);
    if (value.has(id)) value.delete(id);
    else value.add(id);
    setFavorites(value);
    writeSavedHadithIds(value);
  };

  return (
    <LegacyMotionMain className="foundation-guide">
      <FeatureHeader feature={feature} onBack={onBack} showHero={false} />
      <FoundationGuideIntro {...guide} />
      <FoundationChapter {...guide.chapters[0]} number={1}>
        <p><strong>Definition.</strong> Ein Hadith ist eine überlieferte Nachricht über den Propheten ﷺ, beispielsweise über eine Aussage, Handlung oder Billigung. Der Text berichtet von seinem Vorbild; er ist nicht mit einem Quranvers gleichzusetzen.</p>
        <p><strong>Begriffe.</strong> Der Inhalt einer Überlieferung heißt Matn, ihre Überliefererkette Isnad. Sammlung, Fundstelle und fachliche Beurteilung helfen dabei, eine Nachricht nachzuvollziehen.</p>
        <FoundationExample>Al-Bukhari 1 behandelt die Bedeutung der Absicht. Du kannst zunächst den Grundgedanken lesen und anschließend über die genaue Nummer die Überlieferung nachschlagen.</FoundationExample>
        <FoundationSource href="https://sunnah.com/about">Sunnah.com · Hadithe und Quellen</FoundationSource>
        <FoundationSource href="https://sunnah.com/bukhari:1">Beispiel: Sahih al-Bukhari 1</FoundationSource>
      </FoundationChapter>
      <FoundationChapter {...guide.chapters[1]} number={2}>
        <p><strong>So liest du die Angabe.</strong> „Sahih al-Bukhari 1“ nennt die Sammlung und eine Nummer. Die Zählung kann zwischen Ausgaben abweichen. Eine Quellenangabe allein erklärt noch nicht alle Umstände oder die Anwendung.</p>
        <p><strong>Wichtig zu unterscheiden.</strong> Nicht jede Sammlung enthält ausschließlich als authentisch bewertete Überlieferungen. Bei einer Einstufung wie sahih, hasan oder daʿif sind die angegebene Beurteilung und ihre Herkunft wichtig. Einzelne übersetzte Sätze ersetzen keine fachliche Herleitung einer religiösen Regel.</p>
        <p>In dieser App steht unter jedem Eintrag die Fundstelle. „Sinngemäßer Inhalt“ ist eine Zusammenfassung in eigenen Worten, kein arabischer Originaltext und keine wortgetreue Übersetzung.</p>
        <FoundationSource href="https://sunnah.com/about">Einordnung und Grenzen der Sammlung</FoundationSource>
      </FoundationChapter>
      <FoundationChapter {...guide.chapters[2]} number={3}>
      <p>Suche nach einem Thema oder einer Quellenangabe. Das Lesezeichen speichert den Eintrag lokal in deinem Browser.</p>
      <label className="reference-legacy-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hadithe durchsuchen" /></label>
      <p className="foundation-guide-result" role="status">{filtered.length} von {HADITH_LIBRARY.length} Hadithen · {favorites.size} gespeichert</p>
      <section className="reference-hadith-library">
        {filtered.map((item) => {
          const saved = favorites.has(item.id);
          return (
            <article key={item.id}>
              <div><h3>{item.title}</h3><p className="foundation-guide-label">Sinngemäßer Inhalt</p><p>{item.summary}</p>{item.context ? <p className="foundation-hadith-context"><strong>Einordnung.</strong> {item.context}</p> : null}<small>{item.source}</small></div>
              <button onClick={() => toggleFavorite(item.id)} aria-label={saved ? 'Aus Favoriten entfernen' : 'Als Favorit speichern'} aria-pressed={saved} className={saved ? 'is-saved' : ''}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button>
            </article>
          );
        })}
      </section>
      {!filtered.length ? <div className="reference-empty-result"><Search size={24} /><strong>Kein Hadith gefunden</strong><small>Ändere den Suchbegriff.</small></div> : null}
      </FoundationChapter>
    </LegacyMotionMain>
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
    <LegacyMotionMain>
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
    </LegacyMotionMain>
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
    <LegacyMotionMain className="reference-standby-screen">
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-standby-stage">
        {/* A standby screen is read from across the room, so it must not name a
            prayer the app has no usable times for. */}
        {nextPrayer ? (
          <>
            <span className="overline">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Gebet'}</span>
            <p className="reference-standby-arabic" dir="rtl">{nextPrayer.prayer.arabic}</p>
            <h2>{nextPrayer.prayer.label}</h2>
            <strong>{nextPrayer.prayer.time}</strong>
            <span className="reference-standby-countdown">noch {formatPrayerRemaining(nextPrayer.remaining)}</span>
          </>
        ) : (
          <>
            <span className="overline">Gebetszeiten nicht verfügbar</span>
            <p className="reference-standby-arabic" dir="rtl">الصلاة</p>
            <h2>Keine aktuellen Zeiten</h2>
            <strong>—:—</strong>
            <span className="reference-standby-countdown">Öffne die Gebetszeiten und aktualisiere sie.</span>
          </>
        )}
        <button className="gold-button" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}{fullscreen ? 'Vollbild beenden' : 'Vollbild starten'}</button>
      </section>
      {status ? <section className="reference-legacy-notice"><TriangleAlert size={19} /><p>{status}</p></section> : null}
    </LegacyMotionMain>
  );
}

function JumuahFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [completed, setCompleted] = useState<string[]>(() => {
    const stored = readStored<string[]>('nur_feature_jumuah_progress', []);
    return stored.filter((entry) => jumuahChecklist.includes(entry as typeof jumuahChecklist[number]));
  });

  const toggle = (entry: string) => {
    const value = completed.includes(entry) ? completed.filter((item) => item !== entry) : [...completed, entry];
    setCompleted(value);
    writeStored('nur_feature_jumuah_progress', value);
  };

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-person-detail" aria-labelledby="reference-jumuah-intro-title">
        <span className="overline">Freitagsgebet</span>
        <h2 id="reference-jumuah-intro-title">Was ist Jumuah?</h2>
        <p className="reference-person-detail__intro">Jumuah ist das gemeinschaftliche Gebet am Freitag. Es findet zur Mittagszeit statt und besteht aus der Khutbah und zwei Rakʿah mit dem Imam.</p>
        <p><strong>Bedeutung.</strong> Der Freitag bringt die Gemeinde zum Gebet und zur Erinnerung an Allah zusammen. Der Quran fordert dazu auf, beim Gebetsruf den Handel ruhen zu lassen und sich dem Gebet zuzuwenden.</p>
        <p><strong>Für wen.</strong> Im Allgemeinen ist Jumuah für erwachsene, ortsansässige muslimische Männer verpflichtend, sofern sie teilnehmen können. Frauen, Reisende und Kranke sind grundsätzlich nicht verpflichtet, dürfen aber teilnehmen. Einzelheiten unterscheiden sich je nach Rechtsschule.</p>
        <p><strong>Während der Khutbah.</strong> Die Predigt gehört zur Jumuah. Man hört aufmerksam zu und vermeidet Gespräche.</p>
      </section>
      <section className="reference-legacy-section reference-jumuah-prep">
        <div className="section-heading"><div><span className="overline">Deine Vorbereitung</span><h2>Vor dem Gebet</h2></div><span className="reference-legacy-count">{completed.length}/{jumuahChecklist.length}</span></div>
        <div className="reference-legacy-list reference-legacy-list--checklist">
          {jumuahChecklist.map((entry, index) => (
            <button key={entry} onClick={() => toggle(entry)} className={completed.includes(entry) ? 'is-complete' : ''} aria-pressed={completed.includes(entry)}>
              <span>{completed.includes(entry) ? <CircleCheck size={19} /> : index + 1}</span><strong>{entry}</strong><Check size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die Checkliste ist eine persönliche Merkhilfe. Quellen: <a href="https://quran.com/62/9" target="_blank" rel="noreferrer">Quran 62:9</a> · <a href="https://sunnah.com/bukhari:934" target="_blank" rel="noreferrer">Bukhari 934</a> · <a href="https://sunnah.com/muslim:846a" target="_blank" rel="noreferrer">Muslim 846a</a></p></section>
    </LegacyMotionMain>
  );
}

function ProphetsFeature({
  feature,
  onBack,
  onOpenQuranReference,
}: {
  feature: LegacyFeatureItem;
  onBack: () => void;
  onOpenQuranReference?: (surahNumber: number, ayahNumber?: number) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [progressByProphet, setProgressByProphet] = useState<ProphetCourseProgress>(() =>
    readStored<ProphetCourseProgress>(PROPHET_PROGRESS_KEY, {}));
  const catalogueScroll = useRef(0);
  const prophetScrollFrame = useRef<HTMLElement | null>(null);
  const prophet = PROPHETS.find((entry) => entry.id === openId) ?? null;
  const course = prophet ? PROPHET_COURSES[prophet.id] : null;
  const overview = prophet ? PROPHET_COURSE_OVERVIEWS[prophet.id] : null;
  const chapter = course?.chapters[chapterIndex] ?? null;
  const storedProgress = prophet ? progressByProphet[prophet.id] : null;
  const completedChapterIds = course
    ? course.chapters.map((entry) => entry.id).filter((id) => storedProgress?.completedChapterIds?.includes(id))
    : [];
  const courseComplete = Boolean(course && completedChapterIds.length === course.chapters.length);
  const courseReferences = course
    ? [...new Set(course.chapters.flatMap((entry) => entry.quranReferences))]
    : [];
  const courseEssentials = course
    ? course.chapters.map((entry) => ({
        id: entry.id,
        title: entry.title,
        statement: entry.keyPoints[0],
        references: entry.quranReferences,
      }))
    : [];

  useEffect(() => {
    const target = readStored<{ prophetId?: string; chapterIndex?: number; scrollTop?: number } | null>(PROPHET_RETURN_KEY, null);
    try { localStorage.removeItem(PROPHET_RETURN_KEY); } catch { /* optional */ }
    if (!target?.prophetId || !PROPHET_COURSES[target.prophetId]) return;
    const chapterCount = PROPHET_COURSES[target.prophetId].chapters.length;
    setOpenId(target.prophetId);
    setChapterIndex(Math.max(0, Math.min(Number(target.chapterIndex) || 0, chapterCount - 1)));
    const restore = () => {
      const frame = document.querySelector<HTMLElement>('.reference-prophet-course')?.closest<HTMLElement>('.screen-transition-frame') ?? null;
      if (!frame) return;
      prophetScrollFrame.current = frame;
      frame.scrollTop = Math.max(0, Number(target.scrollTop) || 0);
    };
    window.setTimeout(restore, 0);
    window.setTimeout(restore, 160);
  }, []);

  const openProphet = (id: string, source?: HTMLElement) => {
    const savedIndex = progressByProphet[id]?.chapterIndex ?? 0;
    const chapterCount = PROPHET_COURSES[id]?.chapters.length ?? 1;
    const frame = source?.closest<HTMLElement>('.screen-transition-frame') ?? null;
    prophetScrollFrame.current = frame;
    catalogueScroll.current = frame?.scrollTop ?? 0;
    setOpenId(id);
    setChapterIndex(Math.max(0, Math.min(savedIndex, chapterCount - 1)));
    const moveToStart = () => { if (prophetScrollFrame.current) prophetScrollFrame.current.scrollTop = 0; };
    window.setTimeout(moveToStart, 0);
    window.setTimeout(moveToStart, 160);
  };

  const closeProphet = () => {
    const offset = catalogueScroll.current;
    setOpenId(null);
    setChapterIndex(0);
    const restore = () => {
      const frame = prophetScrollFrame.current
        ?? document.querySelector<HTMLElement>('.reference-prophet-catalogue')?.closest<HTMLElement>('.screen-transition-frame')
        ?? null;
      if (frame) frame.scrollTop = offset;
    };
    window.setTimeout(restore, 0);
    window.setTimeout(restore, 160);
  };

  const selectChapter = (index: number) => {
    if (!prophet || !course) return;
    const safeIndex = Math.max(0, Math.min(index, course.chapters.length - 1));
    setChapterIndex(safeIndex);
    setProgressByProphet((current) => {
      const previous = current[prophet.id];
      const next = {
        ...current,
        [prophet.id]: {
          chapterIndex: safeIndex,
          completedChapterIds: previous?.completedChapterIds ?? [],
        },
      };
      writeStored(PROPHET_PROGRESS_KEY, next);
      return next;
    });
  };

  const markCurrentChapterComplete = () => {
    if (!prophet || !chapter) return;
    setProgressByProphet((current) => {
      const previous = current[prophet.id];
      const completed = previous?.completedChapterIds ?? [];
      if (completed.includes(chapter.id)) return current;
      const next = {
        ...current,
        [prophet.id]: {
          chapterIndex,
          completedChapterIds: [...completed, chapter.id],
        },
      };
      writeStored(PROPHET_PROGRESS_KEY, next);
      return next;
    });
  };

  const openQuranSource = (reference: string) => {
    const target = parseQuranReference(reference);
    if (!target || !prophet || !onOpenQuranReference) return;
    const frame = document.querySelector<HTMLElement>('.reference-prophet-course')?.closest<HTMLElement>('.screen-transition-frame') ?? null;
    writeStored(PROPHET_RETURN_KEY, { prophetId: prophet.id, chapterIndex, scrollTop: frame?.scrollTop ?? 0 });
    onOpenQuranReference(target.surahNumber, target.ayahNumber);
  };

  if (prophet && course && overview && chapter) {
    return (
      <LegacyMotionMain className="reference-prophet-course">
        <FeatureHeader feature={feature} onBack={closeProphet} showHero={false} />

        <section className="reference-prophet-course__hero">
          <span className="overline">Einzelkurs · {course.chapters.length} Kapitel</span>
          <div className="reference-prophet-course__title">
            <div>
              <h2>{prophet.name}{prophet.commonName ? ` · ${prophet.commonName}` : ''}</h2>
              <p lang="ar" dir="rtl">{prophet.arabic}</p>
              <small><span>Lesehilfe</span> {PROPHET_NAME_PRONUNCIATION[prophet.id]}</small>
            </div>
            <span>{PROPHETS.findIndex((entry) => entry.id === prophet.id) + 1}</span>
          </div>
          <p>{course.introduction}</p>
          <div className="reference-prophet-course__progress" aria-label={`Kapitel ${chapterIndex + 1} von ${course.chapters.length}`}>
            <span style={{ width: `${((chapterIndex + 1) / course.chapters.length) * 100}%` }} />
          </div>
          <small>Kapitel {chapterIndex + 1} von {course.chapters.length}</small>
        </section>

        <section className="reference-prophet-status" aria-label="Kursstatus">
          <span><CircleCheck size={15} />{completedChapterIds.length}/{course.chapters.length} abgeschlossen</span>
          <span><BookOpenCheck size={15} />Mit Quran-Belegstellen</span>
        </section>

        <section className="reference-prophet-overview" aria-label={`Ausführliche Einführung zu ${prophet.name}`}>
          <div className="section-heading">
            <div><span className="overline">Kurseinstieg</span><h2>Bevor du beginnst</h2></div>
            <span className="reference-legacy-count">Quran</span>
          </div>
          <div className="reference-prophet-overview__text">
            <p>{overview.orientation}</p>
            <p>{overview.coursePath}</p>
          </div>
          <div className="reference-prophet-overview__goals">
            <span className="overline">Nach diesem Kurs kannst du</span>
            {overview.learningGoals.map((goal, index) => (
              <p key={goal}><span>{String(index + 1).padStart(2, '0')}</span>{goal}</p>
            ))}
          </div>
          <section className="reference-prophet-overview__facts" aria-label={`Sicher belegte Kernaussagen zu ${prophet.name}`}>
            <div>
              <span className="overline">Direkt aus den Versen</span>
              <h3>Sicher im Quran belegt</h3>
              <p>Eine Kernaussage pro Kapitel. Die ausführliche Erklärung folgt darunter.</p>
            </div>
            <ol>
              {courseEssentials.map((item, index) => (
                <li key={item.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.statement}</p>
                    <small>{item.references.join(' · ')}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <div className="reference-prophet-overview__boundary">
            <ShieldCheck size={18} />
            <p><strong>Grenze des sicheren Wissens:</strong> {overview.boundary}</p>
          </div>
          <small>{courseReferences.length} verschiedene Quran-Passagen bilden den Quellenrahmen dieses Kurses.</small>
        </section>

        <section className="reference-prophet-plan" aria-label={`Kursplan für ${prophet.name}`}>
          <div className="section-heading">
            <div><span className="overline">Dein roter Faden</span><h2>Kursplan</h2></div>
            <span className="reference-legacy-count">{course.chapters.length}</span>
          </div>
          <div className="reference-prophet-plan__list">
            {course.chapters.map((entry, index) => (
              <button
                key={entry.id}
                className={`${index === chapterIndex ? 'is-active' : ''}${completedChapterIds.includes(entry.id) ? ' is-complete' : ''}`}
                onClick={() => selectChapter(index)}
                aria-current={index === chapterIndex ? 'step' : undefined}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{entry.title}</strong><small>{entry.summary}</small></span>
                {completedChapterIds.includes(entry.id) ? <CircleCheck size={17} /> : <ChevronRight size={17} />}
              </button>
            ))}
          </div>
        </section>

        <article className="reference-prophet-lesson">
          <header>
            <span className="overline">Kapitel {String(chapterIndex + 1).padStart(2, '0')} · {prophet.name}</span>
            <h2>{chapter.title}</h2>
            <p>{chapter.summary}</p>
          </header>

          <div className="reference-prophet-lesson__text">
            <section>
              <span className="overline">01 · Ausgangspunkt</span>
              <p>{chapter.summary}</p>
            </section>
            <section>
              <span className="overline">02 · Was der Quran berichtet</span>
              {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          </div>

          <section className="reference-prophet-lesson__takeaways">
            <span className="overline">Das solltest du mitnehmen</span>
            {chapter.keyPoints.map((point, index) => (
              <p key={point}><span>{index + 1}</span>{point}</p>
            ))}
          </section>

          <section className="reference-prophet-lesson__questions">
            <span className="overline">Prüfe dein Verständnis</span>
            <ol>
              <li>Warum ist „{chapter.keyPoints[0]}“ für dieses Kapitel zentral?</li>
              <li>Wie hängt diese Aussage mit „{chapter.keyPoints[1]}“ zusammen?</li>
              <li>Welche der genannten Quran-Stellen belegt diese Aussage unmittelbar?</li>
              <li>Welche Einzelheiten bleiben offen, wenn du ausschließlich die angegebenen Verse zugrunde legst?</li>
            </ol>
          </section>

          <section className="reference-prophet-lesson__sources">
            <span className="overline">Im Quran nachlesen</span>
            <div>
              {chapter.quranReferences.map((reference) => {
                const target = parseQuranReference(reference);
                return (
                  <button
                    key={reference}
                    type="button"
                    onClick={() => openQuranSource(reference)}
                    disabled={!target || !onOpenQuranReference}
                    aria-label={`${reference} im Quran öffnen`}
                  >
                    <BookOpenCheck size={15} />
                    <span><small>Quran</small>{reference.replace(/^Quran\s+/i, '')}</span>
                    <ChevronRight size={14} />
                  </button>
                );
              })}
            </div>
          </section>

          <nav className="reference-prophet-lesson__nav" aria-label="Kapitelnavigation">
            <button
              className="reference-prophet-lesson__complete"
              onClick={markCurrentChapterComplete}
              aria-pressed={completedChapterIds.includes(chapter.id)}
            >
              {completedChapterIds.includes(chapter.id) ? <CircleCheck size={17} /> : <Check size={17} />}
              {completedChapterIds.includes(chapter.id) ? 'Kapitel abgeschlossen' : 'Kapitel als abgeschlossen markieren'}
            </button>
            <button onClick={() => selectChapter(chapterIndex - 1)} disabled={chapterIndex === 0}>
              <ChevronLeft size={17} /> Zurück
            </button>
            <button onClick={() => selectChapter(chapterIndex + 1)} disabled={chapterIndex === course.chapters.length - 1}>
              Weiter <ChevronRight size={17} />
            </button>
          </nav>
        </article>

        {courseComplete ? (
          <section className="reference-prophet-completion" aria-label="Kurs abgeschlossen">
            <div><CircleCheck size={24} /><span className="overline">Kurs abgeschlossen</span></div>
            <h2>Du hast den Quran-Kurs zu {prophet.name} beendet.</h2>
            <p>Diese drei Punkte bilden deinen Lernabschluss:</p>
            <ol>{overview.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}</ol>
            <div className="reference-prophet-completion__actions">
              <button onClick={() => selectChapter(0)}>Zum ersten Kapitel</button>
              <button onClick={closeProphet}>Zu allen Propheten</button>
            </div>
          </section>
        ) : null}

        <section className="reference-prophet-course__core">
          <div><span>Kernthema</span><strong>{prophet.focus}</strong></div>
          <div><span>Merksatz</span><strong>{prophet.lesson}</strong></div>
        </section>

        <section className="reference-legacy-notice">
          <ShieldCheck size={19} />
          <p>Quran-Grundkurs mit Belegstellen. Wo der Quran keine Details nennt oder Gelehrte unterschiedlich einordnen, sagt der Kurs das ausdrücklich.</p>
        </section>
      </LegacyMotionMain>
    );
  }

  if (prophet) {
    return (
      <LegacyMotionMain>
        <FeatureHeader feature={feature} onBack={closeProphet} showHero={false} />
        <section className="reference-legacy-notice">
          <ShieldCheck size={19} />
          <p>Für diesen Propheten ist kein Kurs verfügbar.</p>
        </section>
      </LegacyMotionMain>
    );
  }

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} showHero={false} />
      <section className="reference-prophet-catalogue-intro">
        <span className="overline">25 eigenständige Kurse</span>
        <h2>Von Adam bis Muhammad ﷺ</h2>
        <p>Öffne einen Propheten und lerne Schritt für Schritt: sichere Einordnung, wichtige Quran-Ereignisse, zentrale Lehren und die genauen Belegstellen.</p>
        <div>
          <span><strong>25</strong> Propheten</span>
          <span><strong>{Object.values(PROPHET_COURSES).reduce((sum, entry) => sum + entry.chapters.length, 0)}</strong> Kapitel</span>
          <span><strong>Quran</strong> als Grundlage</span>
        </div>
      </section>

      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Kursübersicht</span><h2>Wen möchtest du kennenlernen?</h2></div><span className="reference-legacy-count">{PROPHETS.length}</span></div>
        <div className="reference-person-list reference-prophet-catalogue">
          {PROPHETS.map((entry, index) => {
            const entryCourse = PROPHET_COURSES[entry.id];
            return (
              <button key={entry.id} onClick={(event) => openProphet(entry.id, event.currentTarget)}>
                <span className="reference-prophet-catalogue__number">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <strong>{entry.name} · <span lang="ar" dir="rtl">{entry.arabic}</span></strong>
                  <small>{entry.summary}</small>
                  <em>{entryCourse?.chapters.length ?? 0} Kapitel · mit Quran-Stellen</em>
                </span>
                <ChevronRight size={18} />
              </button>
            );
          })}
          </div>
        </section>
    </LegacyMotionMain>
  );
}

function PeopleListFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  // Sahabah and women in Islam carry a name, an honorific and a role, and
  // nothing more in the source data. They are listed rather than made tappable:
  // a detail view would open on three lines and promise a biography that does
  // not exist.
  const isSahabah = feature.id === 'sahabah';
  const entries = isSahabah
    ? SAHABAH.map((entry) => ({ id: entry.id, name: entry.name, note: `${entry.honorific} · ${entry.role}` }))
    : WOMEN_IN_ISLAM.map((entry) => ({ id: entry.id, name: entry.name, note: entry.note }));

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Übersicht</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{entries.length}</span></div>
        <div className="reference-person-list reference-person-list--static">
          {entries.map((entry) => (
            <article key={entry.id}><strong>{entry.name}</strong><small>{entry.note}</small></article>
          ))}
        </div>
      </section>
    </LegacyMotionMain>
  );
}

function KnowledgeFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const topic = KNOWLEDGE_TOPICS.find((entry) => entry.id === openId) ?? null;

  if (topic) {
    return (
      <LegacyMotionMain>
        <FeatureHeader feature={feature} onBack={() => setOpenId(null)} />
        <section className="reference-person-detail">
          <span className="overline">Thema</span>
          <h2>{topic.title}</h2>
          <p className="reference-person-detail__intro">{topic.intro}</p>
        </section>
        {topic.sections.map((section) => (
          <section className="reference-legacy-section" key={section.subtitle}>
            <div className="section-heading"><div><span className="overline">{section.subtitle}</span></div></div>
            <p className="reference-topic-text">{section.text}</p>
          </section>
        ))}
        <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Dieser Überblick enthält nicht zu jeder Aussage einen Einzelnachweis.</p></section>
      </LegacyMotionMain>
    );
  }

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Themen</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{KNOWLEDGE_TOPICS.length}</span></div>
        <div className="reference-person-list">
          {KNOWLEDGE_TOPICS.map((entry) => (
            <button key={entry.id} onClick={() => setOpenId(entry.id)}>
              <span><strong>{entry.title}</strong><small>{entry.intro}</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Glossar</span><h2>Begriffe</h2></div><span className="reference-legacy-count">{GLOSSARY_TERMS.length}</span></div>
        <div className="reference-person-list reference-person-list--static">
          {GLOSSARY_TERMS.map((entry) => (
            <article key={entry.term}><strong>{entry.term}</strong><small>{entry.definition}</small></article>
          ))}
        </div>
      </section>
    </LegacyMotionMain>
  );
}

function PracticeFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const isSunnah = feature.id === 'sunnah';
  const guide = FOUNDATION_SUPPLEMENTS[isSunnah ? 'sunnah' : 'sins'];
  const groups = isSunnah ? SUNNAH_GROUPS : [...REPENTANCE_GROUPS].reverse();

  return (
    <LegacyMotionMain className="foundation-guide">
      <FeatureHeader feature={feature} onBack={onBack} showHero={false} />
      <FoundationGuideIntro {...guide} />
      <FoundationChapter {...guide.chapters[0]} number={1}>
        {isSunnah ? <>
          <p><strong>Definition.</strong> Sunnah bezeichnet das überlieferte Vorbild des Propheten ﷺ. Hadithe berichten davon. Nicht jede Handlung, die als prophetisches Vorbild beschrieben wird, hat automatisch denselben rechtlichen Rang; „Sunnah“ kann im Fiqh auch eine empfohlene Handlung bezeichnen.</p>
          <p><strong>Dein Einstieg.</strong> Wähle eine überschaubare Gewohnheit und verstehe zuerst ihren Sinn. Kleine, regelmäßig ausgeführte gute Taten werden in al-Bukhari 6464 besonders hervorgehoben. Das ist keine Aufforderung, religiöse Pflichten durch freiwillige Gewohnheiten zu ersetzen.</p>
          <FoundationExample>Du möchtest bewusster essen. Beginne damit, dich vor der Mahlzeit an Allah zu erinnern. So hat deine Übung einen festen Platz im Tag.</FoundationExample>
          <FoundationSource href="https://sunnah.com/bukhari:6464">Sahih al-Bukhari 6464 · regelmäßig Gutes tun</FoundationSource>
        </> : <>
          <p><strong>Definition.</strong> Tawbah ist die Umkehr zu Allah. Istighfar ist die Bitte um Vergebung. Beides gehört zusammen, aber nur Worte zu sprechen und bewusst beim Unrecht zu bleiben, ist nicht dasselbe wie eine aufrichtige Umkehr.</p>
          <p>Der folgende Weg beginnt mit Hoffnung. Danach geht es um deine eigene Veränderung und um die Rechte anderer. Die Beispiele zeigen mögliche Anwendungen; sie ersetzen keine Einzelfallberatung.</p>
          <FoundationSource href="https://quran.com/3/135">Quran 3:135 · Vergebung suchen und Unrecht beenden</FoundationSource>
        </>}
      </FoundationChapter>
      {groups.map((group, index) => (
        <FoundationChapter key={group.id} id={`practice-${group.id}`} title={guide.chapters[index + 1].title} number={index + 2}>
          {group.id === 'major' ? <p>Diese Beispiele zeigen, dass manche Verfehlungen besonders schwer wiegen. Es ist keine vollständige Liste und keine Grundlage, um konkrete Menschen zu verurteilen.</p> : null}
          <div className="foundation-topic-list">
            {group.items.map((item, itemIndex) => <article key={item.title}>
              <h3><span>{itemIndex + 1}.</span> {item.title}</h3>
              {item.meaning ? <p><strong>Bedeutung.</strong> {item.meaning}</p> : null}
              <p>{item.description}</p>
              {item.example ? <FoundationExample>{item.example}</FoundationExample> : null}
              {item.sourceUrl ? <FoundationSource href={item.sourceUrl}>{item.proof}</FoundationSource> : <p className="foundation-guide-label">Hinterlegter Beleg: {item.proof}</p>}
            </article>)}
          </div>
        </FoundationChapter>
      ))}
    </LegacyMotionMain>
  );
}

function UmmahFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Verteilung</span><h2>Weltweit</h2></div></div>
        <p className="reference-topic-text">Wie sich die muslimische Weltbevölkerung auf die Regionen verteilt:</p>
        <div className="reference-person-list reference-person-list--static">
          {UMMAH_REGIONS.map((region) => (
            <article key={region.name}><strong>{region.name}</strong><small>{region.share}</small></article>
          ))}
        </div>
      </section>

      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Länder</span><h2>Muslimischer Anteil</h2></div><span className="reference-legacy-count">{UMMAH_COUNTRIES.length}</span></div>
        <div className="reference-person-list reference-person-list--static">
          {UMMAH_COUNTRIES.map((country) => (
            <article key={country.id}>
              <strong>{country.name}</strong>
              <small>{country.share} der Bevölkerung · {country.region}</small>
              <small>{country.info}</small>
            </article>
          ))}
        </div>
      </section>

      {/* The absolute figures are gone rather than promised. What is left still
          carries no source, and the notice says so instead of announcing a fix
          that has no date on it. */}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Absolute Bevölkerungszahlen zeigt diese Übersicht nicht mehr: die übernommenen Werte trugen weder Quelle noch Stichjahr, und eine undatierte Bevölkerungszahl lässt sich nicht überprüfen. Auch die Anteile hier sind eine grobe Einordnung ohne Einzelnachweis, keine Statistik.</p></section>
    </LegacyMotionMain>
  );
}

function StationList({ stations }: { stations: readonly PilgrimageStation[] }) {
  return (
    <div className="reference-practice-list">
      {stations.map((station, index) => (
        <article key={station.id}>
          <span className="reference-station-when">{index + 1} · {station.when}</span>
          <strong>{station.title}</strong>
          <p>{station.description}</p>
          {/* Only where a clear verse exists. An entry without one shows
              nothing rather than an invented reference. */}
          {station.reference ? <small><ShieldCheck size={14} /> {station.reference}</small> : null}
        </article>
      ))}
    </div>
  );
}

function PilgrimageFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const guide = FOUNDATION_SUPPLEMENTS.hajj;
  return (
    <LegacyMotionMain className="foundation-guide">
      <FeatureHeader feature={feature} onBack={onBack} showHero={false} />
      <FoundationGuideIntro {...guide} />
      <FoundationChapter {...guide.chapters[0]} number={1}>
        <p><strong>Hajj</strong> ist die Pilgerfahrt zu festgelegten Tagen im Monat Dhul-Hijjah. <strong>Umrah</strong> ist die kleinere Pilgerfahrt mit einem eigenen Ablauf. Eine Umrah ersetzt die Hajj nicht. Quran 3:97 verbindet die Hajj mit der Fähigkeit, den Weg dorthin zu bewältigen.</p>
        <p><strong>Ihram</strong> ist der religiöse Weihezustand, nicht bloß die Bezeichnung für Kleidung. <strong>Miqat</strong> bezeichnet hier die festgelegte Grenze für den Eintritt in diesen Zustand. <strong>Talbiya</strong> ist der dabei gesprochene Pilgerruf.</p>
        <div className="foundation-topic-list">
          <article><h3>Tamattuʿ</h3><p>Zuerst Umrah, danach Ende ihres Ihram. Später folgt ein neuer Ihram für Hajj.</p></article>
          <article><h3>Qiran</h3><p>Umrah und Hajj werden in einem gemeinsamen Ihram verbunden.</p></article>
          <article><h3>Ifrad</h3><p>Der Ihram gilt zunächst der Hajj allein.</p></article>
        </div>
        <p>Welche Form gewählt wird, beeinflusst weitere Schritte, etwa das Opfer und die Zuordnung des Sa’i. Die Rechtsschulen unterscheiden sich auch darin, welche Form sie bevorzugen.</p>
        <FoundationExample>Wer Tamattuʿ macht, bleibt nach der abgeschlossenen Umrah nicht bis zum Beginn der Hajj im selben Ihram. Deshalb beginnt nicht jede Pilgerfahrt mit derselben Reiseabfolge.</FoundationExample>
        <FoundationSource href="https://quran.com/3/97">Quran 3:97 · Fähigkeit zur Pilgerfahrt</FoundationSource>
        <FoundationSource href="https://dar-alifta.org/en/fatwa/details/6382/the-meaning-of-hajj-ifrad-qiran-and-tamattu">Dar al-Ifta · die drei Pilgerformen</FoundationSource>
      </FoundationChapter>
      <FoundationChapter {...guide.chapters[1]} number={2}>
        <p>Nutze diese Fragen als Vorbereitung, nicht als individuelle religiöse Entscheidung:</p>
        <ul className="foundation-checklist">
          <li><strong>Welcher Ablauf gilt für mich?</strong> Kläre Pilgerform, Miqat, Begleitung und den Umgang mit besonderen Situationen vor der Reise.</li>
          <li><strong>Was brauche ich organisatorisch?</strong> Prüfe aktuelle Einreise- und Buchungsvorgaben bei offiziellen Stellen. Diese App verspricht keine Genehmigung.</li>
          <li><strong>Welche Unterstützung brauche ich?</strong> Besprich gesundheitliche Belastungen mit medizinischem Fachpersonal und benötigte Hilfen mit deiner Reisebegleitung.</li>
          <li><strong>Wen frage ich unterwegs?</strong> Halte die Kontaktdaten deiner Gruppe und einer qualifizierten Ansprechperson bereit, damit du bei Unsicherheit nicht raten musst.</li>
        </ul>
        <FoundationSource href="https://hajj.nusuk.sa/">Nusuk Hajj · offizielle Plattform</FoundationSource>
        <FoundationSource href="https://umrah.nusuk.sa/">Nusuk Umrah · offizielle Plattform</FoundationSource>
      </FoundationChapter>
      <FoundationChapter {...guide.chapters[2]} number={3}>
        <p>Der folgende Ablauf beschreibt die Umrah. Die Ortsnamen und Handlungen werden jeweils direkt erklärt.</p>
        <StationList stations={UMRAH_STATIONS} />
        <FoundationSource href="https://umrah.nusuk.sa/Journey">Nusuk · Umrah Schritt für Schritt</FoundationSource>
      </FoundationChapter>
      <FoundationChapter {...guide.chapters[3]} number={4}>
        <p>Die Daten sind Hijri-Tage, keine festen Daten des gregorianischen Kalenders. Dies ist eine Orientierung über den üblichen zeitlichen Weg; konkrete Zeiten, Erleichterungen und Rechtsfragen klärst du mit deiner Begleitung.</p>
        <StationList stations={HAJJ_STATIONS} />
        <FoundationSource href="https://www.dar-alifta.org/en/article/details/29/overview-of-the-rites-of-hajj-and-umrah">Dar al-Ifta · Ablauf und Unterschiede</FoundationSource>
      </FoundationChapter>

      {/* This is the one area written for this app rather than carried over,
          so the limit is stated rather than implied. */}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Diese Übersicht beschreibt den Ablauf, nicht die Urteile. Was Pflicht und was Sunnah ist, was bei Versäumnissen gilt und worin sich die Rechtsschulen unterscheiden, gehört zu einer qualifizierten Quelle.</p></section>
    </LegacyMotionMain>
  );
}

const HOLY_PLACE_REGIONS = [
  { id: 'makkah', label: 'Makkah', note: 'Qibla & Offenbarung' },
  { id: 'madinah', label: 'Madinah', note: 'Hijra & Gemeinschaft' },
  { id: 'jerusalem', label: 'Jerusalem', note: 'Al-Aqsa & Nachtreise' },
] as const;

function HolyPlacesFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const jumpToRegion = (regionId: string) => {
    document.getElementById(`holy-region-${regionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <LegacyMotionMain className="holy-places-screen">
      <FeatureHeader feature={feature} onBack={onBack} showHero={false} />

      <section className="holy-places-hero" aria-labelledby="holy-places-title">
        <img
          className="holy-places-hero__image"
          src={HOLY_PLACES[0].image}
          alt=""
          aria-hidden="true"
        />
        <div className="holy-places-hero__copy">
          <span className="overline">Islamische Geschichte entdecken</span>
          <h1 id="holy-places-title">Bedeutende Orte</h1>
          <p>Sechs Orte in Makkah, Madinah und Jerusalem – verständlich erklärt und mit Quellen belegt.</p>
          <span className="holy-places-hero__meta">Makkah <i /> Madinah <i /> Jerusalem</span>
        </div>
      </section>

      <nav className="holy-places-route" aria-label="Region auswählen">
        {HOLY_PLACE_REGIONS.map((region) => (
          <button key={region.id} type="button" onClick={() => jumpToRegion(region.id)}>
            <MapPinned size={18} aria-hidden="true" />
            <span><strong>{region.label}</strong><small>{region.note}</small></span>
          </button>
        ))}
      </nav>

      <div className="holy-places-atlas">
        {HOLY_PLACE_REGIONS.map((region) => {
          const places = HOLY_PLACES.filter((item) => item.region === region.label);
          return (
            <section className="holy-places-region" id={`holy-region-${region.id}`} key={region.id}>
              <header>
                <div><span className="overline">{region.note}</span><h2>{region.label}</h2></div>
                <span>{places.length} {places.length === 1 ? 'Ort' : 'Orte'}</span>
              </header>
              <div className="holy-places-region__grid">
                {places.map((place, placeIndex) => (
                  <article className={`holy-place-card${placeIndex === 0 ? ' holy-place-card--lead' : ''}`} key={place.id}>
                    <figure>
                      <img src={place.image} alt={place.imageAlt} loading="lazy" />
                      <figcaption><MapPinned size={14} aria-hidden="true" />{place.city}</figcaption>
                    </figure>
                    <div className="holy-place-card__body">
                      <span className="overline">{place.eyebrow}</span>
                      <h3>{place.name}</h3>
                      <p className="holy-place-card__intro">{place.description}</p>
                      <p className="holy-place-card__context">{place.context}</p>
                      <div className="holy-place-card__facts" aria-label={`Kurzüberblick zu ${place.name}`}>
                        {place.facts.map((fact) => <span key={fact}><CircleCheck size={15} aria-hidden="true" />{fact}</span>)}
                      </div>
                      <a href={place.sourceUrl} target="_blank" rel="noreferrer">
                        <BookOpenCheck size={16} aria-hidden="true" />
                        <span>Quelle: {place.sourceLabel}</span>
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="holy-places-note">
        <ShieldCheck size={20} aria-hidden="true" />
        <div><strong>Zur Einordnung</strong><p>Die Seite vermittelt Geschichte und Orientierung. Sie ersetzt keine Reise-, Sicherheits- oder Ritualberatung vor Ort.</p></div>
      </section>
    </LegacyMotionMain>
  );
}

/**
 * Reached only if a feature id is added without a screen behind it.
 *
 * Every one of the fifteen has its own screen now, so this renders nothing that
 * pretends to be content — it names the gap instead. The bullet lists this
 * replaced did the opposite: four lines of text that looked like an article.
 */
function UnbuiltFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-notice">
        <ShieldCheck size={19} />
        <p>Für diesen Bereich ist noch kein Inhalt hinterlegt. Er wird erst freigeschaltet, wenn Inhalt und Quellen stehen.</p>
      </section>
    </LegacyMotionMain>
  );
}

export function LegacyFeatureScreen({
  featureId,
  onBack,
  onOpenQuranReference,
}: {
  featureId: LegacyFeatureId;
  onBack: () => void;
  onOpenQuranReference?: (surahNumber: number, ayahNumber?: number) => void;
}) {
  const feature = featureId === 'quiz'
    ? quizFeature
    : allFeatures.find((item) => item.id === featureId) ?? learningLegacyFeatures[0];
  if (featureId === 'quiz') return <QuizFeature feature={feature} onBack={onBack} />;
  if (featureId === 'prophets') return <ProphetsFeature feature={feature} onBack={onBack} onOpenQuranReference={onOpenQuranReference} />;
  if (featureId === 'knowledge') return <KnowledgeFeature feature={feature} onBack={onBack} />;
  if (featureId === 'madhhabs') return <Suspense fallback={<p role="status">Rechtsschulen werden geladen …</p>}><MadhhabCatalogueFeature feature={feature} onBack={onBack} /></Suspense>;
  if (featureId === 'sunnah' || featureId === 'sins') return <PracticeFeature feature={feature} onBack={onBack} />;
  if (featureId === 'ummah') return <UmmahFeature feature={feature} onBack={onBack} />;
  if (featureId === 'hajj') return <PilgrimageFeature feature={feature} onBack={onBack} />;
  if (featureId === 'places') return <HolyPlacesFeature feature={feature} onBack={onBack} />;
  if (featureId === 'sahabah' || featureId === 'women') return <PeopleListFeature feature={feature} onBack={onBack} />;
  if (featureId === 'fasting') return <FastingFeature feature={feature} onBack={onBack} />;
  if (featureId === 'hadith-library') return <HadithLibraryFeature feature={feature} onBack={onBack} />;
  if (featureId === 'jumuah') return <JumuahFeature feature={feature} onBack={onBack} />;
  if (featureId === 'zakat') return <ZakatFeature feature={feature} onBack={onBack} />;
  if (featureId === 'standby') return <StandbyFeature feature={feature} onBack={onBack} />;
  return <UnbuiltFeature feature={feature} onBack={onBack} />;
}
