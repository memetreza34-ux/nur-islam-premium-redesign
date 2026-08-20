import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { BEGINNER_LESSONS } from '../data/beginnerLearningContent';

type StarterDay = {
  day: number;
  title: string;
  description: string;
  lessonIds: string[];
};

const STARTER_DAYS: StarterDay[] = [
  {
    day: 1,
    title: 'Islam und Allah kennenlernen',
    description: 'Beginne mit der Grundidee des Islam und lerne die zentrale Bedeutung von Allahs Einzigkeit kennen.',
    lessonIds: ['beginner-islam', 'beginner-allah'],
  },
  {
    day: 2,
    title: 'Die Shahada verstehen',
    description: 'Konzentriere dich auf Bedeutung und Einordnung des islamischen Glaubensbekenntnisses.',
    lessonIds: ['beginner-shahada'],
  },
  {
    day: 3,
    title: 'Prophet, Quran und Sunnah',
    description: 'Ordne Prophet Muhammad ﷺ, Quran, Sunnah und Hadith auf Anfängerniveau ein.',
    lessonIds: ['beginner-prophet', 'beginner-quran-sunnah'],
  },
  {
    day: 4,
    title: 'Säulen und Glaubensgrundlagen',
    description: 'Lerne die fünf Säulen und die sechs Glaubensgrundlagen als Orientierungssystem kennen.',
    lessonIds: ['beginner-five-pillars', 'beginner-six-beliefs'],
  },
  {
    day: 5,
    title: 'Reinheit verstehen',
    description: 'Unterscheide Wudu, Ghusl und Tayammum zunächst auf Grundlagenebene.',
    lessonIds: ['beginner-purity'],
  },
  {
    day: 6,
    title: 'Gebet einordnen',
    description: 'Verstehe die fünf Pflichtgebete, Gebetszeiten, Qibla und den Begriff Rakʿah.',
    lessonIds: ['beginner-prayer'],
  },
  {
    day: 7,
    title: 'Deinen Weg fortsetzen',
    description: 'Fasse die Woche zusammen und entscheide, welche Grundlagen du als Nächstes festigen möchtest.',
    lessonIds: ['beginner-next-steps'],
  },
];

function getLessonTitle(id: string) {
  return BEGINNER_LESSONS.find((lesson) => lesson.id === id)?.title ?? id;
}

export function BeginnerStarterPlanScreen({
  onBack,
  onOpenLesson,
  completed,
}: {
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  completed: Set<string>;
}) {
  const reduceMotion = useReducedMotion();
  const completedDays = STARTER_DAYS.filter((day) => day.lessonIds.every((id) => completed.has(id))).length;
  const progress = Math.round((completedDays / STARTER_DAYS.length) * 100);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Neu im Islam"><ChevronLeft size={20} /></button>
        <div><span className="overline">Geführter Einstieg</span><h1>Deine ersten 7 Tage</h1></div>
        <span className="icon-button" aria-hidden="true"><CalendarDays size={20} /></span>
      </header>

      <section className="reference-learning-course-hero is-aqidah">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">Ein Schritt pro Tag</span>
          <h2>Eine einfache Reihenfolge für deine erste Woche.</h2>
          <p>Der Plan bündelt ausschließlich die bestehenden Anfängerlektionen. Du kannst jederzeit langsamer lernen, wiederholen oder einen Tag auf mehrere Tage verteilen.</p>
          <div className="reference-learning-course-hero__progress">
            <span><i style={{ width: `${progress}%` }} /></span>
            <strong>{completedDays}/7 Tage abgeschlossen</strong>
          </div>
        </div>
        <span className="reference-learning-course-hero__icon"><GraduationCap size={54} /></span>
      </section>

      <section className="reference-five-prayer-lessons" aria-label="Sieben Tage Grundlagenplan">
        <div className="section-heading"><div><span className="overline">Deine erste Woche</span><h2>Tag für Tag</h2></div><span>{completedDays}/7</span></div>
        <div>
          {STARTER_DAYS.map((day, index) => {
            const dayComplete = day.lessonIds.every((id) => completed.has(id));
            const nextLessonId = day.lessonIds.find((id) => !completed.has(id)) ?? day.lessonIds[0];
            return (
              <motion.button
                key={day.day}
                className={dayComplete ? 'is-complete' : ''}
                onClick={() => onOpenLesson(nextLessonId)}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : .2, delay: reduceMotion ? 0 : Math.min(index * .025, .12), ease: [0.22, 1, 0.36, 1] }}
              >
                <span>{dayComplete ? <CircleCheck size={19} /> : day.day}</span>
                <span>
                  <small>{day.lessonIds.map(getLessonTitle).join(' · ')}</small>
                  <strong>{day.title}</strong>
                  <em>{day.description}</em>
                </span>
                <ChevronRight size={17} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Wichtig</span><h2>Kein Zeitdruck</h2></div><ShieldCheck size={21} /></div>
        <p className="reference-learning-sources__notice">„7 Tage“ beschreibt nur eine mögliche Lernreihenfolge. Der Plan behauptet nicht, dass die islamischen Grundlagen innerhalb einer Woche vollständig gelernt oder praktisch beherrscht sein müssen. Für religiöse Aussagen gelten weiterhin die Quellen- und Reviewhinweise der jeweiligen Lektion.</p>
      </section>
    </motion.main>
  );
}
