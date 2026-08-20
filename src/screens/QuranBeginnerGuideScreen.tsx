import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const quranTerms = [
  { term: 'Sure', meaning: 'Ein Kapitel des Quran. Der Quran enthält 114 Suren.' },
  { term: 'Ayah', meaning: 'Ein einzelner Vers bzw. ein Zeichen innerhalb einer Sure.' },
  { term: 'Juz', meaning: 'Einer von 30 Leseabschnitten, in die der Quran zum Lesen eingeteilt wird.' },
  { term: 'Tafsir', meaning: 'Die Erklärung und Auslegung von Quran-Versen anhand islamischer Quellen und Fachwissen.' },
  { term: 'Deutsche Bedeutung', meaning: 'Eine Übersetzung bzw. Bedeutungswiedergabe hilft beim Verstehen, ersetzt aber nicht den arabischen Qurantext.' },
] as const;

const starterSurahs = [
  { number: 1, name: 'Al-Faatiha', note: '7 Ayat · zentral im Pflichtgebet' },
  { number: 112, name: 'Al-Ikhlaas', note: '4 Ayat · kurze Sure' },
  { number: 113, name: 'Al-Falaq', note: '5 Ayat · kurze Sure' },
  { number: 114, name: 'An-Naas', note: '6 Ayat · kurze Sure' },
] as const;

export function QuranBeginnerGuideScreen({
  onBack,
  onOpenReader,
}: {
  onBack: () => void;
  onOpenReader: (surahNumber: number, ayahNumber?: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zum Quran"><ChevronLeft size={20} /></button>
        <div><span className="overline">Quran verstehen</span><h1>Quran für Anfänger</h1></div>
        <span className="icon-button" aria-hidden="true"><BookOpen size={20} /></span>
      </header>

      <section className="reference-learning-course-hero is-tafsir">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">5 Minuten Orientierung</span>
          <h2>Erst verstehen, dann in 114 Suren eintauchen.</h2>
          <p>Hier lernst du die wichtigsten Begriffe und bekommst einen einfachen Startpunkt, ohne den gesamten Quran-Katalog schon kennen zu müssen.</p>
        </div>
        <span className="reference-learning-course-hero__icon"><GraduationCap size={54} /></span>
      </section>

      <article className="reference-learning-lesson-card">
        <header>
          <span className="overline">Grundlage</span>
          <h2>Was ist der Quran?</h2>
          <p>Der Quran ist die islamische Offenbarung und dient Muslimen als Rechtleitung. Er wurde dem Propheten Muhammad ﷺ offenbart und ist in 114 Suren gegliedert.</p>
        </header>
        <section className="reference-learning-reading">
          <p>Zum Einstieg musst du weder alle Surennamen kennen noch Arabisch beherrschen. Beginne mit dem arabischen Text, einer transparent gekennzeichneten deutschen Bedeutungswiedergabe und kurzen, geprüften Erklärungen.</p>
          <p>Die App trennt Qurantext, deutsche Bedeutung und Tafsir bewusst voneinander. Dadurch erkennst du, was Originaltext, Übersetzung und Erklärung ist.</p>
        </section>
      </article>

      <section className="reference-learning-key-points">
        <div className="section-heading"><div><span className="overline">Orientierung</span><h2>Das solltest du zuerst wissen</h2></div><CircleCheck size={21} /></div>
        <div>
          <button type="button"><span>1</span><strong>Der Quran besteht aus 114 Suren.</strong></button>
          <button type="button"><span>2</span><strong>Eine Sure besteht aus einzelnen Ayat.</strong></button>
          <button type="button"><span>3</span><strong>Juz sind Leseabschnitte, keine zusätzlichen Suren.</strong></button>
          <button type="button"><span>4</span><strong>Übersetzung und Tafsir sind Hilfen zum Verstehen und werden getrennt vom arabischen Qurantext angezeigt.</strong></button>
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Begriffe</span><h2>Quran-Lexikon</h2></div><BookOpen size={21} /></div>
        <div>
          {quranTerms.map((item) => (
            <article key={item.term}><span>Begriff</span><strong>{item.term}</strong><p>{item.meaning}</p></article>
          ))}
        </div>
      </section>

      <section className="reference-learning-key-points">
        <div className="section-heading"><div><span className="overline">Einfach anfangen</span><h2>Vier gute Startpunkte in der App</h2></div><BookOpen size={21} /></div>
        <div>
          {starterSurahs.map((surah, index) => (
            <button key={surah.number} type="button" onClick={() => onOpenReader(surah.number, 1)}>
              <span>{index + 1}</span>
              <strong>{surah.name} · {surah.note}</strong>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Nachvollziehbar</span><h2>Quellen & Prüfung</h2></div><ShieldCheck size={21} /></div>
        <div>
          <article><span>Quran</span><strong>Al-Baqara 2:185</strong><p>Beschreibt den Quran als Rechtleitung für die Menschen.</p></article>
          <article><span>Quran</span><strong>Al-Alaq 96:1–5</strong><p>Gehört zu den ersten offenbarten Versen und verbindet Offenbarung mit Lesen und Wissen.</p></article>
        </div>
        <p className="reference-learning-sources__notice">Die redaktionelle Einführung bleibt bis zum fachlichen Endreview als nicht final freigegeben markiert. Bei Tafsir und Detailfragen werden geprüfte Fachquellen benötigt.</p>
      </section>

      <button className="gold-button" onClick={() => onOpenReader(1, 1)}>Mit Al-Faatiha beginnen <ChevronRight size={17} /></button>
    </motion.main>
  );
}
