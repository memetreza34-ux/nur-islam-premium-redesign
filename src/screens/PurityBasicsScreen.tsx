import { ChevronLeft, Droplets, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function PurityBasicsScreen({ onBack }: { onBack: () => void }) {
  const reduceMotion = useReducedMotion();
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Islam lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Reinheit · Grundlagen</span><h1>Ghusl & Tayammum</h1></div>
        <span className="icon-button" aria-hidden="true"><Droplets size={20} /></span>
      </header>

      <section className="reference-learning-course-hero is-fiqh">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">Für Anfänger</span>
          <h2>Verstehe zuerst, wann welche Form der rituellen Reinheit gemeint ist.</h2>
          <p>Diese Seite vermittelt nur die gemeinsame Grundlage. Sonderfälle und Rechtsschuldetails müssen vor dem öffentlichen Release fachlich abschließend geprüft werden.</p>
        </div>
        <span className="reference-learning-course-hero__icon"><Droplets size={54} /></span>
      </section>

      <article className="reference-learning-lesson-card">
        <header><span className="overline">Grundlage 1</span><h2>Wudu</h2><p>Wudu ist die rituelle Gebetswaschung und gehört zu den zentralen Vorbereitungen für das Gebet.</p></header>
        <section className="reference-learning-reading">
          <p>Sure Al-Maida 5:6 nennt Gesicht, Arme bis zu den Ellenbogen, das Streichen über den Kopf und die Füße bis zu den Knöcheln. Authentische Hadithe beschreiben darüber hinaus vollständige prophetische Wudu-Abläufe.</p>
          <p>Welche Ereignisse Wudu aufheben und wie Sonderfälle behandelt werden, soll die App nur mit geprüftem Fiqh-Kontext darstellen.</p>
        </section>
      </article>

      <article className="reference-learning-lesson-card">
        <header><span className="overline">Grundlage 2</span><h2>Ghusl</h2><p>Ghusl bezeichnet die rituelle Ganzkörperreinigung in Situationen, in denen sie erforderlich ist.</p></header>
        <section className="reference-learning-reading">
          <p>Sure Al-Maida 5:6 nennt Janabah und die Aufforderung zur vollständigen Reinigung. Für Anfänger genügt zunächst die klare Unterscheidung: Wudu und Ghusl sind nicht dasselbe.</p>
          <p>Auslöser, Mindestbestandteile und besondere Situationen — etwa Krankheit, Menstruation oder Wochenbett — dürfen nicht aus einer kurzen App-Zusammenfassung abgeleitet werden und benötigen einen fachlich geprüften Detailbereich.</p>
        </section>
      </article>

      <article className="reference-learning-lesson-card">
        <header><span className="overline">Grundlage 3</span><h2>Tayammum</h2><p>Tayammum ist eine in Quran 5:6 genannte Form ritueller Reinigung für bestimmte Ausnahmebedingungen.</p></header>
        <section className="reference-learning-reading">
          <p>Sure Al-Maida 5:6 nennt unter anderem Krankheit, Reise und Situationen ohne gefundenes Wasser und beschreibt Tayammum mit sauberer Erde bzw. Erdboden sowie das Bestreichen von Gesicht und Händen.</p>
          <p>Tayammum ist keine frei wählbare Abkürzung. Wie die genannten Voraussetzungen zusammenwirken und welches Material im Detail genügt, wird in den Rechtsschulen näher eingeordnet und gehört in den fachlichen Review.</p>
        </section>
      </article>

      <section className="reference-learning-key-points">
        <div className="section-heading"><div><span className="overline">Merken</span><h2>Die einfache Unterscheidung</h2></div><Sparkles size={21} /></div>
        <div>
          <button type="button"><span>1</span><strong>Wudu: rituelle Gebetswaschung.</strong></button>
          <button type="button"><span>2</span><strong>Ghusl: rituelle Ganzkörperreinigung in bestimmten Situationen.</strong></button>
          <button type="button"><span>3</span><strong>Tayammum: Ersatzreinigung nur unter ihren religiösen Voraussetzungen.</strong></button>
        </div>
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Quelle & Review</span><h2>Vor Release prüfen</h2></div><ShieldCheck size={21} /></div>
        <div><article><span>Quran</span><strong>Sure Al-Maida 5:6</strong><p>Grundlegende Bezugstelle zu Wudu, Janabah/Reinigung und Tayammum.</p></article></div>
        <p className="reference-learning-sources__notice">Redaktionsstatus: fachlicher Endreview erforderlich. Die Seite vermittelt keine individuelle Rechtsentscheidung und vermeidet bewusst strittige Detailregeln.</p>
      </section>
    </motion.main>
  );
}
