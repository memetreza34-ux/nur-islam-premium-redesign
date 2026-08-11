import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SAHABAH, WOMEN_IN_ISLAM } from '../data/companionData';
import { GLOSSARY_TERMS, KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { REPENTANCE_GROUPS, SUNNAH_GROUPS } from '../data/practiceData';
import { UMMAH_COUNTRIES, UMMAH_REGIONS, UMMAH_TOTAL } from '../data/ummahData';
import { PROPHETS } from '../data/prophetData';
import { QUIZ_CATEGORIES } from '../data/quizData';
import { learningLegacyFeatures, serviceLegacyFeatures, visual } from '../data/legacyFeatures';
import type { LegacyFeatureId, LegacyFeatureItem } from '../data/legacyFeatures';
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
import { motion, useReducedMotion } from 'motion/react';
import { versionAppPath } from '../app/appPaths';
import { HADITH_LIBRARY, readSavedHadithIds, writeSavedHadithIds } from '../data/hadithData';
import { syncRollingFastingReminders } from '../services/fastingReminderService';
import { formatPrayerRemaining, getNextPrayer } from '../services/prayerSchedule';

const allFeatures = [...learningLegacyFeatures, ...serviceLegacyFeatures];

type GenericFeatureId = Exclude<LegacyFeatureId, 'quiz' | 'fasting' | 'hadith-library' | 'jumuah' | 'zakat' | 'standby' | 'prophets' | 'sahabah' | 'women' | 'knowledge' | 'sunnah' | 'sins' | 'ummah'>;

const featureContent: Record<GenericFeatureId, string[]> = {
  hajj: ['Ihram und Absicht', 'Tawaf', 'Sa’i zwischen Safa und Marwa', 'Arafat', 'Muzdalifah und Mina', 'Abschluss und Rückkehr'],
  places: ['Al-Masjid al-Haram in Makkah', 'Al-Masjid an-Nabawi in Madinah', 'Al-Masjid al-Aqsa in Jerusalem'],
};

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
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readSavedHadithIds());
  const filtered = HADITH_LIBRARY.filter((item) => `${item.title} ${item.summary} ${item.source}`.toLocaleLowerCase('de-DE').includes(query.toLocaleLowerCase('de-DE')));

  const toggleFavorite = (id: string) => {
    const value = new Set(favorites);
    if (value.has(id)) value.delete(id);
    else value.add(id);
    setFavorites(value);
    writeSavedHadithIds(value);
  };

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <label className="reference-legacy-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hadithe durchsuchen" /></label>
      <section className="reference-hadith-library">
        {filtered.map((item) => {
          const saved = favorites.has(item.id);
          return (
            <article key={item.id}>
              <div><span className="overline">{item.title}</span><p>{item.summary}</p><small>{item.source}</small></div>
              <button onClick={() => toggleFavorite(item.id)} aria-label={saved ? 'Aus Favoriten entfernen' : 'Als Favorit speichern'} aria-pressed={saved} className={saved ? 'is-saved' : ''}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button>
            </article>
          );
        })}
      </section>
      {!filtered.length ? <div className="reference-empty-result"><Search size={24} /><strong>Kein Hadith gefunden</strong><small>Ändere den Suchbegriff.</small></div> : null}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die deutsche Formulierung ist als sinngemäße Inhaltsangabe gekennzeichnet. Wortlaut, Übersetzung und Einordnung benötigen vor Veröffentlichung eine fachliche Endprüfung.</p></section>
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
        <span className="overline">{nextPrayer.tomorrow ? 'Morgen früh' : 'Nächstes Gebet'}</span>
        <p className="reference-standby-arabic" dir="rtl">{nextPrayer.prayer.arabic}</p>
        <h2>{nextPrayer.prayer.label}</h2>
        <strong>{nextPrayer.prayer.time}</strong>
        <span className="reference-standby-countdown">noch {formatPrayerRemaining(nextPrayer.remaining)}</span>
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
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Lokal gespeichert</span><h2>Freitags-Checkliste</h2></div><span className="reference-legacy-count">{completed.length}/{jumuahChecklist.length}</span></div>
        <div className="reference-legacy-list reference-legacy-list--checklist">
          {jumuahChecklist.map((entry, index) => (
            <button key={entry} onClick={() => toggle(entry)} className={completed.includes(entry) ? 'is-complete' : ''} aria-pressed={completed.includes(entry)}>
              <span>{completed.includes(entry) ? <CircleCheck size={19} /> : index + 1}</span><strong>{entry}</strong><Check size={17} />
            </button>
          ))}
        </div>
      </section>
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die Checkliste ist eine persönliche Merkhilfe. Einzelheiten zur Freitagsvorbereitung sollten vor Veröffentlichung fachlich geprüft werden.</p></section>
    </LegacyMotionMain>
  );
}

function ProphetsFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const prophet = PROPHETS.find((entry) => entry.id === openId) ?? null;

  if (prophet) {
    return (
      <LegacyMotionMain>
        <FeatureHeader feature={feature} onBack={() => setOpenId(null)} />
        <section className="reference-person-detail">
          {/* `role` is a full sentence in the source data, not a label, so it
              reads as prose here. Setting it as the overline turned a two-line
              sentence into all-caps. */}
          <span className="overline">Prophet</span>
          <h2>{prophet.name}{prophet.commonName ? ` · ${prophet.commonName}` : ''}</h2>
          <p className="reference-person-detail__intro">{prophet.intro}</p>
          <p>{prophet.description}</p>
          <p>{prophet.role}</p>
        </section>

        <section className="reference-legacy-section">
          <div className="section-heading"><div><span className="overline">Kernpunkte</span><h2>Worum es geht</h2></div><span className="reference-legacy-count">{prophet.keyPoints.length}</span></div>
          <div className="reference-legacy-list reference-legacy-list--overview">
            {prophet.keyPoints.map((point, index) => (
              <article key={point}><span>{index + 1}</span><strong>{point}</strong></article>
            ))}
          </div>
        </section>

        <section className="reference-legacy-section">
          <div className="section-heading"><div><span className="overline">Lehren</span><h2>Was daraus folgt</h2></div><span className="reference-legacy-count">{prophet.lessons.length}</span></div>
          <div className="reference-legacy-list reference-legacy-list--overview">
            {prophet.lessons.map((lesson, index) => (
              <article key={lesson}><span>{index + 1}</span><strong>{lesson}</strong></article>
            ))}
          </div>
        </section>

        <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Übernommener Inhalt ohne Einzelnachweis je Aussage. Die fachliche Prüfung steht vor der Veröffentlichung aus.</p></section>
      </LegacyMotionMain>
    );
  }

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Übersicht</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{PROPHETS.length}</span></div>
        <div className="reference-person-list">
          {PROPHETS.map((entry) => (
            <button key={entry.id} onClick={() => setOpenId(entry.id)}>
              <span><strong>{entry.name}</strong><small>{entry.intro}</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
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
      <section className="reference-legacy-notice"><HeartHandshake size={19} /><p>Zu jeder Person sind bisher nur Name, Ehrenname und Rolle hinterlegt. Ausführliche Darstellungen folgen erst nach fachlicher Prüfung.</p></section>
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
        <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Übernommener Inhalt ohne Einzelnachweis je Aussage. Die fachliche Prüfung steht vor der Veröffentlichung aus.</p></section>
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
  const groups = feature.id === 'sunnah' ? SUNNAH_GROUPS : REPENTANCE_GROUPS;
  const total = groups.reduce((count, group) => count + group.items.length, 0);

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      {groups.map((group) => (
        <section className="reference-legacy-section" key={group.id}>
          <div className="section-heading"><div><span className="overline">{group.category}</span></div><span className="reference-legacy-count">{group.items.length}</span></div>
          <div className="reference-practice-list">
            {group.items.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                {/* The proof travelled with the entry and is shown with it: an
                    instruction about practice without its basis is the thing
                    this app avoids everywhere else. */}
                <small><ShieldCheck size={14} /> {item.proof}</small>
              </article>
            ))}
          </div>
        </section>
      ))}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>{total} Einträge mit dem jeweils hinterlegten Beleg. Wortlaut und Einordnung stehen vor der Veröffentlichung zur fachlichen Prüfung.</p></section>
    </LegacyMotionMain>
  );
}

function UmmahFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Größenordnung</span><h2>Weltweit</h2></div></div>
        <p className="reference-topic-text">{UMMAH_TOTAL} Musliminnen und Muslime, verteilt auf:</p>
        <div className="reference-person-list reference-person-list--static">
          {UMMAH_REGIONS.map((region) => (
            <article key={region.name}><strong>{region.name}</strong><small>{region.share}</small></article>
          ))}
        </div>
      </section>

      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Länder</span><h2>Nach Bevölkerung</h2></div><span className="reference-legacy-count">{UMMAH_COUNTRIES.length}</span></div>
        <div className="reference-person-list reference-person-list--static">
          {UMMAH_COUNTRIES.map((country) => (
            <article key={country.id}>
              <strong>{country.name}</strong>
              <small>{country.muslimPopulation} · {country.share} der Bevölkerung · {country.region}</small>
              <small>{country.info}</small>
            </article>
          ))}
        </div>
      </section>

      {/* The old data carries no source and no reference year, so the figures
          are labelled as the rough order of magnitude they are. */}
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Die Zahlen stammen aus dem übernommenen Altbestand und tragen dort weder Quelle noch Stichjahr. Sie sind als Größenordnung zu lesen, nicht als belastbare Statistik, und werden vor der Veröffentlichung mit einer datierten Quelle ersetzt.</p></section>
    </LegacyMotionMain>
  );
}

function GenericOverviewFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const entries = featureContent[feature.id as GenericFeatureId] ?? [];

  return (
    <LegacyMotionMain>
      <FeatureHeader feature={feature} onBack={onBack} />
      <section className="reference-legacy-section">
        <div className="section-heading"><div><span className="overline">Übersicht</span><h2>{feature.title}</h2></div><span className="reference-legacy-count">{entries.length}</span></div>
        <div className="reference-legacy-list reference-legacy-list--overview">
          {entries.map((entry, index) => (
            <article key={entry}><span>{index + 1}</span><strong>{entry}</strong></article>
          ))}
        </div>
      </section>
      <section className="reference-legacy-notice"><HeartHandshake size={19} /><p>Dieser Bereich ist aktuell eine Übersicht ohne vorgetäuschte Detail-Navigation. Vertiefende religiöse Inhalte werden erst als anklickbare Lektionen freigeschaltet, wenn Inhalt und Quellen fachlich geprüft sind.</p></section>
    </LegacyMotionMain>
  );
}

export function LegacyFeatureScreen({ featureId, onBack }: { featureId: LegacyFeatureId; onBack: () => void }) {
  const feature = allFeatures.find((item) => item.id === featureId) ?? learningLegacyFeatures[0];
  if (featureId === 'quiz') return <QuizFeature feature={feature} onBack={onBack} />;
  if (featureId === 'prophets') return <ProphetsFeature feature={feature} onBack={onBack} />;
  if (featureId === 'knowledge') return <KnowledgeFeature feature={feature} onBack={onBack} />;
  if (featureId === 'sunnah' || featureId === 'sins') return <PracticeFeature feature={feature} onBack={onBack} />;
  if (featureId === 'ummah') return <UmmahFeature feature={feature} onBack={onBack} />;
  if (featureId === 'sahabah' || featureId === 'women') return <PeopleListFeature feature={feature} onBack={onBack} />;
  if (featureId === 'fasting') return <FastingFeature feature={feature} onBack={onBack} />;
  if (featureId === 'hadith-library') return <HadithLibraryFeature feature={feature} onBack={onBack} />;
  if (featureId === 'jumuah') return <JumuahFeature feature={feature} onBack={onBack} />;
  if (featureId === 'zakat') return <ZakatFeature feature={feature} onBack={onBack} />;
  if (featureId === 'standby') return <StandbyFeature feature={feature} onBack={onBack} />;
  return <GenericOverviewFeature feature={feature} onBack={onBack} />;
}
