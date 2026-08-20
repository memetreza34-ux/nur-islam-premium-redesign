import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  GraduationCap,
  LocateFixed,
  MoonStar,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { saveMosqueOrigin } from '../services/mosqueService';
import { OBLIGATORY_PRAYER_IDS } from '../services/prayerSchedule';
import { bootstrapSharedPrayerTimes, savePrayerLocation } from '../services/prayerTimesService';
import {
  MosqueScene,
  NurMark,
  PremiumImage,
  QiblaObject,
  QuranObject,
  RosetteObject,
} from '../shared/PremiumVisuals';

type OnboardingSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  fallback: ReactNode;
  icon: LucideIcon;
  points: string[];
};

type KnowledgeLevel = 'beginner' | 'familiar' | 'experienced';

const knowledgeLevels: Array<{ id: KnowledgeLevel; title: string; description: string; icon: LucideIcon }> = [
  { id: 'beginner', title: 'Ich bin neu', description: 'Führe mich Schritt für Schritt durch die wichtigsten Grundlagen.', icon: GraduationCap },
  { id: 'familiar', title: 'Ich kenne die Grundlagen', description: 'Gebet, Quran und Wissen strukturiert vertiefen.', icon: BookOpen },
  { id: 'experienced', title: 'Ich praktiziere bereits', description: 'Alle Bereiche direkt nutzen und gezielt lernen.', icon: Sparkles },
];

const slides: OnboardingSlide[] = [
  {
    eyebrow: 'Willkommen bei Nur',
    title: 'Ein ruhiger Ort für deinen Glauben.',
    description: 'Gebetszeiten, Quran, Dhikr und islamisches Wissen in einer klaren, hochwertigen App.',
    image: '/premium-assets/high-res-objects/mosque-gold-v2.webp',
    fallback: <MosqueScene />,
    icon: MoonStar,
    points: ['Wichtige Bereiche direkt erreichbar', 'Ruhiges Smaragd- und Gold-Design', 'Persönlicher Fortschritt auf deinem Gerät'],
  },
  {
    eyebrow: 'Gebet & Richtung',
    title: 'Behalte deine Gebete im Blick.',
    description: 'Sieh Gebetszeiten, aktiviere Erinnerungen und finde die Qibla in einem einheitlichen Ablauf.',
    image: '/premium-assets/high-res-objects/qibla-compass-v2.webp',
    fallback: <QiblaObject />,
    icon: Compass,
    points: ['Gebets-Tracker für fünf Pflichtgebete', 'Qibla-Kompass mit klarer Ausrichtung', 'Erinnerungen individuell einstellbar'],
  },
  {
    eyebrow: 'Wissen & Alltag',
    title: 'Lerne, lies und gedenke Allahs.',
    description: 'Setze deine Quran-Lektüre fort, nutze Dhikr-Ziele und öffne verständliche Lernbereiche.',
    image: '/premium-assets/high-res-objects/quran-closed-v2.webp',
    fallback: <QuranObject />,
    icon: Sparkles,
    points: ['Quran-Reader mit Lesezeichen', 'Dhikr-Zähler und tägliche Ziele', 'Wudu-, Salah- und Wissenslektionen'],
  },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [locationReady, setLocationReady] = useState(false);
  const [notificationsReady, setNotificationsReady] = useState(false);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const slide = slides[index];
  const SlideIcon = slide.icon;
  const isLast = index === slides.length - 1;
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };
  const microTransition = { duration: reduceMotion ? 0 : .18, ease: [0.22, 1, 0.36, 1] as const };

  const selectKnowledgeLevel = (level: KnowledgeLevel) => {
    setKnowledgeLevel(level);
    try { localStorage.setItem('nur_knowledge_level', level); } catch { /* optional */ }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Standort wird auf diesem Gerät nicht unterstützt. Berlin bleibt als Standard gesetzt.');
      return;
    }

    setStatus('Standort wird angefragt …');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        savePrayerLocation({ latitude, longitude, label: 'Aktueller Gerätestandort', source: 'device' });
        saveMosqueOrigin({ latitude, longitude, label: 'Aktueller Gerätestandort', source: 'device' });
        setLocationReady(true);
        setStatus('Standort gespeichert. Gebetszeiten und Moschee-Suche verwenden jetzt deinen Gerätestandort.');
        void bootstrapSharedPrayerTimes();
      },
      () => {
        setStatus('Standort wurde nicht freigegeben. Du kannst ihn später bei Gebetszeiten oder Moscheen aktivieren.');
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 },
    );
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      setStatus('Benachrichtigungen werden in diesem Browser nicht unterstützt.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        try { localStorage.setItem('nur_prayer_notifications', JSON.stringify(OBLIGATORY_PRAYER_IDS)); } catch { /* optional */ }
        setNotificationsReady(true);
        setStatus('Gebetserinnerungen sind für alle fünf Pflichtgebete aktiviert. Sie funktionieren zuverlässig, solange die App oder PWA aktiv ist.');
      } else {
        setStatus('Benachrichtigungen wurden nicht freigegeben. Du kannst sie später bei den Gebetszeiten aktivieren.');
      }
    } catch {
      setStatus('Benachrichtigungen konnten nicht angefragt werden.');
    }
  };

  const finish = () => {
    try {
      localStorage.setItem('nur_onboarding_complete', 'true');
      if (!knowledgeLevel && !localStorage.getItem('nur_knowledge_level')) localStorage.setItem('nur_knowledge_level', 'beginner');
    } catch { /* optional */ }
    onComplete();
  };

  return (
    <motion.main
      className="reference-onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : .99 }}
      transition={screenTransition}
    >
      <header className="reference-onboarding__topbar">
        <span className="reference-onboarding__brand"><PremiumImage src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp" fallback={<NurMark />} priority /><strong>Nur</strong></span>
        <button onClick={finish}>Überspringen</button>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={index}
          className="reference-onboarding__slide"
          initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduceMotion ? 0 : -14 }}
          transition={screenTransition}
        >
          <div className={`reference-onboarding__visual reference-onboarding__visual--${index + 1}`}>
            <span className="reference-onboarding__halo" />
            <PremiumImage src={slide.image} fallback={slide.fallback} priority />
            {index === 2 ? <span className="reference-onboarding__tasbih"><PremiumImage src="/premium-assets/high-res-objects/tasbih-v2.webp" fallback={<RosetteObject />} priority /></span> : null}
            <span className="reference-onboarding__visual-icon"><SlideIcon size={20} /></span>
          </div>

          <div className="reference-onboarding__copy">
            <span className="overline">{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <div className="reference-onboarding__points">
              {slide.points.map((point) => <span key={point}><CircleCheck size={16} /> {point}</span>)}
            </div>
          </div>

          {isLast ? (
            <>
              <div className="reference-onboarding__copy">
                <span className="overline">Dein Startpunkt</span>
                <h2>Wie gut kennst du den Islam?</h2>
                <p>Damit Nur dir zuerst die Inhalte zeigt, die zu deinem aktuellen Stand passen.</p>
              </div>
              <div className="reference-onboarding__permissions">
                {knowledgeLevels.map(({ id, title, description, icon: Icon }) => (
                  <button key={id} className={knowledgeLevel === id ? 'is-ready' : ''} onClick={() => selectKnowledgeLevel(id)}>
                    <span><Icon size={19} /></span>
                    <span><strong>{title}</strong><small>{description}</small></span>
                    {knowledgeLevel === id ? <CircleCheck size={18} /> : <ChevronRight size={18} />}
                  </button>
                ))}
              </div>

              <div className="reference-onboarding__permissions">
                <button className={locationReady ? 'is-ready' : ''} onClick={requestLocation}>
                  <span><LocateFixed size={19} /></span>
                  <span><strong>Standort</strong><small>Für Gebetszeiten und Moscheen</small></span>
                  {locationReady ? <CircleCheck size={18} /> : <ChevronRight size={18} />}
                </button>
                <button className={notificationsReady ? 'is-ready' : ''} onClick={requestNotifications}>
                  <span><BellRing size={19} /></span>
                  <span><strong>Gebetserinnerungen</strong><small>Für alle fünf Pflichtgebete</small></span>
                  {notificationsReady ? <CircleCheck size={18} /> : <ChevronRight size={18} />}
                </button>
                <span className="reference-onboarding__privacy"><ShieldCheck size={15} /> Freigaben sind optional. Standortdaten werden für Live-Funktionen an die jeweils ausgewiesenen externen Dienste übermittelt.</span>
              </div>
            </>
          ) : null}
        </motion.section>
      </AnimatePresence>

      <footer className="reference-onboarding__footer">
        <div className="reference-onboarding__dots">
          {slides.map((item, dotIndex) => <button key={item.title} className={dotIndex === index ? 'is-active' : ''} onClick={() => setIndex(dotIndex)} aria-label={`Seite ${dotIndex + 1}`} />)}
        </div>

        <div className="reference-onboarding__actions">
          <button className="reference-onboarding__back" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}><ChevronLeft size={18} /> Zurück</button>
          <button className="gold-button" onClick={() => isLast ? finish() : setIndex((value) => Math.min(slides.length - 1, value + 1))}>{isLast ? 'Nur öffnen' : 'Weiter'} <ChevronRight size={18} /></button>
        </div>

        <AnimatePresence>{status ? <motion.p className="reference-onboarding__status" initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={microTransition}>{status}</motion.p> : null}</AnimatePresence>
      </footer>
    </motion.main>
  );
}
