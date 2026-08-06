import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookHeart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Droplets,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MapPin,
  Scale,
  ScrollText,
  Settings,
  Sparkles,
  Star,
  TimerReset,
  UsersRound,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LegacyFeatureScreen, learningLegacyFeatures } from './LegacyFeatureScreens';
import type { LegacyFeatureId } from './LegacyFeatureScreens';
import { PrayerLearningScreen, PRAYER_LESSONS } from './PrayerLearningScreen';
import type { PrayerLessonId } from './PrayerLearningScreen';
import { PremiumImage, QiblaObject } from './PremiumVisuals';
import { WorshipGuideScreen } from './ReferenceReadingScreens';

type LearningCategory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

const categories: LearningCategory[] = [
  { id: 'aqidah', title: 'Aqidah', subtitle: 'Glaubenslehre', description: 'Lerne die Grundlagen des islamischen Glaubens klar und strukturiert.', icon: Sparkles },
  { id: 'fiqh', title: 'Fiqh', subtitle: 'Islamische Rechtslehre', description: 'Verstehe Regeln des Alltags, der Anbetung und des Zusammenlebens.', icon: Scale },
  { id: 'tafsir', title: 'Tafsir', subtitle: 'Quran-Erklärungen', description: 'Entdecke Bedeutungen, Hintergründe und Lehren ausgewählter Verse.', icon: BookOpen },
  { id: 'seerah', title: 'Seerah', subtitle: 'Biografie des Propheten', description: 'Lerne das Leben, den Charakter und die Lehren des Propheten kennen.', icon: Landmark },
  { id: 'hadith', title: 'Hadith', subtitle: 'Überlieferungen', description: 'Lies ausgewählte Hadithe mit Quelle und verständlicher Einordnung.', icon: BookHeart },
  { id: 'akhlaq', title: 'Akhlaq', subtitle: 'Charakter & Verhalten', description: 'Stärke deinen Charakter durch Barmherzigkeit, Geduld und Aufrichtigkeit.', icon: HeartHandshake },
];

function readStringSet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set<string>();
  }
}

function readStoredStep(key: string) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function LearnScreen({
  onBack,
  onOpenPrayer,
  onOpenQibla,
}: {
  onBack: () => void;
  onOpenPrayer: () => void;
  onOpenQibla: () => void;
}) {
  const [selected, setSelected] = useState<LearningCategory | null>(null);
  const [wuduOpen, setWuduOpen] = useState(false);
  const [prayerLesson, setPrayerLesson] = useState<PrayerLessonId | null>(null);
  const [legacyFeature, setLegacyFeature] = useState<LegacyFeatureId | null>(null);
  const [learningPlanOpen, setLearningPlanOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const completedPrayerLessons = readStringSet('nur_prayer_learning_complete');
  const wuduFinished = readStoredStep('nur_guide_wudu_step') >= 5;
  const completedCoreLessons = Math.min(6, completedPrayerLessons.size + (wuduFinished ? 1 : 0));
  const coreProgress = Math.round((completedCoreLessons / 6) * 100);
  const nextPrayer = PRAYER_LESSONS.find((prayer) => !completedPrayerLessons.has(prayer.id)) ?? PRAYER_LESSONS[0];

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  if (wuduOpen) {
    return <WorshipGuideScreen initialMode="wudu" onBack={() => setWuduOpen(false)} />;
  }

  if (prayerLesson) {
    return (
      <PrayerLearningScreen
        initialPrayer={prayerLesson}
        onBack={() => setPrayerLesson(null)}
        onOpenQibla={onOpenQibla}
        onOpenPrayerTimes={onOpenPrayer}
      />
    );
  }

  if (legacyFeature) {
    return <LegacyFeatureScreen featureId={legacyFeature} onBack={() => setLegacyFeature(null)} />;
  }

  return (
    <motion.main className="screen reference-learn-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zur Startseite"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Islam lernen</h1></div>
        <button className="icon-button" onClick={() => setLearningPlanOpen(true)} aria-label="Lernplan öffnen"><Settings size={20} /></button>
      </header>

      <section className="reference-prayer-learning-hub">
        <div className="reference-prayer-learning-hub__glow" />
        <div className="reference-prayer-learning-hub__copy">
          <span className="hero-pill">Das A und O</span>
          <h2>Beten lernen</h2>
          <p>Vom Wudu über Qibla und Gebetszeiten bis zum vollständigen Ablauf aller fünf Pflichtgebete.</p>
          <div className="reference-prayer-learning-hub__progress">
            <span><i style={{ width: `${coreProgress}%` }} /></span>
            <strong>{completedCoreLessons}/6 Grundlagen abgeschlossen</strong>
          </div>
          <button className="gold-button" onClick={() => setPrayerLesson(nextPrayer.id)}>
            <GraduationCap size={18} /> {completedPrayerLessons.size ? `${nextPrayer.label} weiterlernen` : 'Gebetskurs starten'} <ChevronRight size={17} />
          </button>
        </div>
        <PremiumImage src="/premium-assets/high-res-objects/mihrab-arch-v2.webp" fallback={<QiblaObject />} />
      </section>

      <section className="reference-prayer-learning-actions">
        <button onClick={() => setWuduOpen(true)}><span><Droplets size={22} /></span><span><strong>Wudu lernen</strong><small>Vorbereitung Schritt für Schritt</small></span><ChevronRight size={17} /></button>
        <button onClick={onOpenPrayer}><span><TimerReset size={22} /></span><span><strong>Gebetszeiten</strong><small>Heute tracken und erinnern</small></span><ChevronRight size={17} /></button>
        <button onClick={onOpenQibla}><span><Compass size={22} /></span><span><strong>Qibla finden</strong><small>Standort und Live-Kompass</small></span><ChevronRight size={17} /></button>
      </section>

      <section className="reference-five-prayer-lessons">
        <div className="section-heading"><div><span className="overline">Die fünf Pflichtgebete</span><h2>Einzeln lernen</h2></div><span>{completedPrayerLessons.size}/5</span></div>
        <div>
          {PRAYER_LESSONS.map((prayer, index) => {
            const complete = completedPrayerLessons.has(prayer.id);
            return (
              <motion.button key={prayer.id} className={complete ? 'is-complete' : ''} onClick={() => setPrayerLesson(prayer.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}>
                <span>{complete ? <CircleCheck size={19} /> : prayer.rakahs}</span>
                <span><small>{prayer.arabic} · {prayer.timeLabel}</small><strong>{prayer.label}</strong><em>{prayer.note}</em></span>
                <ChevronRight size={17} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-learning-section">
        <div className="section-heading"><div><span className="overline">Danach vertiefen</span><h2>Weitere Lernbereiche</h2></div></div>
        <div className="reference-category-grid">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button key={category.id} className="reference-category-card" onClick={() => setSelected(category)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }} whileTap={{ scale: 0.97 }}>
                <span className="reference-category-card__ornament" aria-hidden="true">۞</span>
                <span className="reference-category-card__icon"><Icon size={24} /></span>
                <strong>{category.title}</strong><small>{category.subtitle}</small>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-learning-section reference-expanded-learning">
        <div className="section-heading"><div><span className="overline">Wissen & Alltag</span><h2>Weitere Funktionen</h2></div></div>
        <div className="reference-expanded-learning-grid">
          {learningLegacyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button key={feature.id} onClick={() => setLegacyFeature(feature.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} whileTap={{ scale: .98 }}>
                <span className="reference-expanded-learning-grid__icon"><Icon size={22} /></span>
                <span><small>{feature.subtitle}</small><strong>{feature.title}</strong><em>{feature.description}</em></span><ChevronRight size={18} />
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="reference-knowledge-quote">
        <span className="reference-knowledge-quote__mark"><Star size={18} /></span>
        <p>Sinngemäß: „Mein Herr, mehre mein Wissen.“</p><small>Quran · Taha 20:114</small>
      </section>

      <AnimatePresence>
        {selected ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.section className="reference-category-modal" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setSelected(null)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-category-modal__icon"><selected.icon size={31} /></span><span className="overline">Islam lernen</span><h2>{selected.title}</h2><h3>{selected.subtitle}</h3><p>{selected.description}</p>
              <div className="reference-category-modal__meta"><span><CircleCheck size={16} /> Quellen werden sichtbar ausgewiesen</span><span><ScrollText size={16} /> Schrittweise Lektionen</span><span><UsersRound size={16} /> Für Einsteiger geeignet</span></div>
              <button className="gold-button" onClick={() => { flash(`${selected.title} ist als nächster Ausbau vorgemerkt`); setSelected(null); }}>Bereich ansehen <ChevronRight size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {learningPlanOpen ? (
          <motion.div className="reference-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLearningPlanOpen(false)}>
            <motion.section className="reference-category-modal reference-learning-plan-modal" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .98 }} onClick={(event) => event.stopPropagation()}>
              <button className="reference-modal-close" onClick={() => setLearningPlanOpen(false)} aria-label="Schließen"><X size={18} /></button>
              <span className="reference-category-modal__icon"><GraduationCap size={31} /></span><span className="overline">Dein Lernplan</span><h2>Erst das Gebet festigen</h2><p>Die Reihenfolge ist bewusst praktisch aufgebaut. Dein Fortschritt wird nur lokal gespeichert.</p>
              <div className="reference-learning-plan-list"><span className={wuduFinished ? 'is-complete' : ''}><i>{wuduFinished ? <CircleCheck size={16} /> : 1}</i><strong>Wudu lernen</strong></span><span><i>2</i><strong>Qibla und Gebetszeiten verstehen</strong></span><span className={completedPrayerLessons.size === 5 ? 'is-complete' : ''}><i>{completedPrayerLessons.size === 5 ? <CircleCheck size={16} /> : 3}</i><strong>Alle fünf Pflichtgebete üben</strong></span><span><i>4</i><strong>Quran, Aqidah und Alltag vertiefen</strong></span></div>
              <button className="gold-button" onClick={() => { setLearningPlanOpen(false); setPrayerLesson(nextPrayer.id); }}>Jetzt weiterlernen <ChevronRight size={17} /></button>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
