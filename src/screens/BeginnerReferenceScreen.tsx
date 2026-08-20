import { BookOpen, ChevronLeft, CircleHelp, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const glossary = [
  ['Allah', 'Der eine Gott, Schöpfer und allein Anbetungswürdige im Islam.'],
  ['Islam', 'Die Religion der bewussten Hingabe an Allah und des Lebens nach Seiner Rechtleitung.'],
  ['Muslim', 'Eine Person, die sich zum Islam bekennt.'],
  ['Shahada', 'Das islamische Glaubensbekenntnis.'],
  ['Tawhid', 'Die grundlegende Überzeugung von Allahs Einzigkeit.'],
  ['Salah', 'Das rituelle islamische Gebet.'],
  ['Rakʿah', 'Eine Gebetseinheit innerhalb der Salah.'],
  ['Wudu', 'Die rituelle Gebetswaschung.'],
  ['Ghusl', 'Eine vollständige rituelle Waschung in bestimmten Situationen.'],
  ['Tayammum', 'Eine Form ritueller Reinigung mit sauberem Erdboden unter bestimmten Voraussetzungen.'],
  ['Qibla', 'Die Gebetsrichtung zur Kaaba in Makkah.'],
  ['Dua', 'Bittgebet bzw. persönliche Anrufung Allahs.'],
  ['Dhikr', 'Gedenken Allahs durch überlieferte oder allgemeine Formen des Erinnerns.'],
  ['Quran', 'Die Offenbarung Allahs an den Propheten Muhammad ﷺ.'],
  ['Sure', 'Ein Kapitel des Quran.'],
  ['Ayah', 'Ein Vers bzw. Zeichen innerhalb einer Sure.'],
  ['Tafsir', 'Erklärung und Auslegung des Quran.'],
  ['Sunnah', 'Der überlieferte Weg und die Lehre des Propheten Muhammad ﷺ.'],
  ['Hadith', 'Eine Überlieferung über Aussagen, Handlungen oder Bestätigungen des Propheten ﷺ.'],
  ['Seerah', 'Die Biografie des Propheten Muhammad ﷺ.'],
  ['Aqidah', 'Islamische Glaubenslehre.'],
  ['Fiqh', 'Islamische Rechts- und Praxislehre.'],
  ['Akhlaq', 'Charakter und gutes Verhalten.'],
  ['Fard', 'Eine verpflichtende Handlung im religiösen Kontext.'],
  ['Sunnah-Handlung', 'Eine Handlung, die auf die prophetische Praxis zurückgeführt wird; ihre rechtliche Einordnung kann je nach Kontext genauer unterschieden werden.'],
  ['Halal', 'Erlaubt bzw. zulässig im religiösen Kontext.'],
  ['Haram', 'Religiös verboten; solche Urteile sollen nicht ohne belastbare Grundlage ausgesprochen werden.'],
] as const;

const faqs = [
  {
    question: 'Ich kenne fast nichts über Islam. Wo soll ich anfangen?',
    answer: 'Beginne mit Allahs Einzigkeit, der Shahada, den fünf Säulen und den sechs Glaubensgrundlagen. Danach sind Reinheit und Gebet die wichtigsten praktischen Grundlagen. Der Bereich „Neu im Islam“ führt genau in dieser Reihenfolge durch die Themen.',
    source: 'Sahih Muslim 8a – Hadith Jibril',
  },
  {
    question: 'Muss ich alles sofort wissen oder auswendig können?',
    answer: 'Nein. Grundlagen werden Schritt für Schritt gelernt. Für den Lernalltag ist ein kleiner, regelmäßiger Fortschritt sinnvoller als möglichst viel auf einmal zu beginnen.',
    source: 'Sahih al-Bukhari 6465 – beständige Taten, auch wenn sie klein sind',
  },
  {
    question: 'Was ist die Qibla?',
    answer: 'Qibla bezeichnet die Gebetsrichtung zur Kaaba in Makkah. Die App kann sie über Standort und Gerätesensoren bestimmen; bei Sensorproblemen sollte die Richtung zusätzlich abgeglichen werden.',
    source: 'Quran 2:144',
  },
  {
    question: 'Was ist eine Rakʿah?',
    answer: 'Eine Rakʿah ist eine Einheit des rituellen Gebets. Sie enthält mehrere Positionen und Rezitationen. Die fünf Pflichtgebete bestehen aus unterschiedlich vielen Pflicht-Rakʿah.',
    source: 'App-Lernbereich „Gebetskurs“ – fachlicher Ablaufreview erforderlich',
  },
  {
    question: 'Warum können zwei Gebetskalender unterschiedliche Zeiten zeigen?',
    answer: 'Digitale Gebetszeiten werden aus Standortdaten und einer Berechnungsmethode erzeugt. Besonders Fajr, Isha und Asr können je nach Methode oder lokaler Praxis abweichen. Deshalb muss die App die verwendete Methode sichtbar machen.',
    source: 'Produkt-/Berechnungsinformation; religiöser Zeitrahmen: Quran 4:103',
  },
  {
    question: 'Was ist der Unterschied zwischen Quran, Übersetzung und Tafsir?',
    answer: 'Der arabische Quran-Wortlaut wird vom übersetzten Bedeutungsinhalt getrennt dargestellt. Eine Übersetzung hilft beim Verstehen; Tafsir erklärt Verse ausführlicher und berücksichtigt zusätzlichen Kontext.',
    source: 'Redaktionsstandard der App; Quran-Inhalte benötigen definierte Edition und Übersetzungsquelle',
  },
  {
    question: 'Was ist der Unterschied zwischen Sunnah und Hadith?',
    answer: 'Sunnah bezeichnet den überlieferten prophetischen Weg und seine Lehre. Hadithe sind einzelne Überlieferungen, durch die Aussagen, Handlungen oder Bestätigungen berichtet werden. Hadithe benötigen Quellen und Einordnung.',
    source: 'Quran 16:44; App-Hadithstandard mit Sammlung und Referenz',
  },
  {
    question: 'Was mache ich, wenn ich bei einer religiösen Frage unsicher bin?',
    answer: 'Unsicherheit sollte nicht verborgen oder durch Raten ersetzt werden. Bei persönlichen oder strittigen Fragen ist es besser, eine qualifizierte und vertrauenswürdige Person mit dem vollständigen Kontext zu fragen.',
    source: 'Quran 16:43; Quran 17:36',
  },
  {
    question: 'Was ist Dua?',
    answer: 'Dua ist die Anrufung Allahs mit Bitten, Dank, Hoffnung und persönlichen Anliegen. In der App werden überlieferte Duas mit Quelle, arabischem Text und Bedeutung getrennt dargestellt.',
    source: 'Quran 2:186',
  },
  {
    question: 'Was ist Dhikr?',
    answer: 'Dhikr bedeutet Gedenken Allahs. Dazu gehören überlieferte Formulierungen und andere erlaubte Formen des Erinnerns. Behauptete Wiederholungszahlen werden in der App nur verwendet, wenn eine Quelle sie trägt.',
    source: 'Quran 13:28; App-Contentstandard für Dhikr',
  },
  {
    question: 'Warum gibt es unterschiedliche Meinungen bei manchen Details?',
    answer: 'Nicht jede Detailfrage wird von allen Gelehrten oder Rechtsschulen identisch eingeordnet. Die App soll deshalb gemeinsame Grundlagen von anerkannten Detailunterschieden trennen und keine Einzelposition als alternativlos darstellen.',
    source: 'Redaktions-/Fiqhstandard der App; fachlicher Endreview erforderlich',
  },
  {
    question: 'Kann die App mir eine persönliche Fatwa geben?',
    answer: 'Nein. Nur ist als Lern- und Quellenbegleiter gedacht. Persönliche Rechtsfragen können von Umständen abhängen, die eine allgemeine App-Lektion nicht vollständig kennt.',
    source: 'Produktprinzip „Keine Fatwa-Maschine“',
  },
] as const;

export function BeginnerReferenceScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();
  const normalized = query.trim().toLocaleLowerCase('de');
  const filteredGlossary = useMemo(() => glossary.filter(([term, meaning]) => !normalized || `${term} ${meaning}`.toLocaleLowerCase('de').includes(normalized)), [normalized]);
  const filteredFaqs = useMemo(() => faqs.filter((item) => !normalized || `${item.question} ${item.answer}`.toLocaleLowerCase('de').includes(normalized)), [normalized]);
  const screenTransition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main className="screen reference-learning-course-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={screenTransition}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück zu Islam lernen"><ChevronLeft size={20} /></button>
        <div><span className="overline">Anfängerhilfe</span><h1>Fragen & Begriffe</h1></div>
        <span className="icon-button" aria-hidden="true"><CircleHelp size={20} /></span>
      </header>

      <section className="reference-learning-course-hero is-akhlaq">
        <div className="reference-learning-course-hero__glow" />
        <div className="reference-learning-course-hero__copy">
          <span className="hero-pill">Schnell verstehen</span>
          <h2>Islamische Begriffe und typische Anfängerfragen an einem Ort.</h2>
          <p>Suche nach einem Begriff oder einer Frage. Komplexe persönliche Rechtsfragen werden bewusst nicht automatisch entschieden.</p>
        </div>
        <span className="reference-learning-course-hero__icon"><BookOpen size={54} /></span>
      </section>

      <label className="reference-quran-search">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Begriff oder Frage suchen …" aria-label="Anfängerhilfe durchsuchen" />
      </label>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Islam A–Z</span><h2>Begriffe einfach erklärt</h2></div><BookOpen size={21} /></div>
        <div>
          {filteredGlossary.map(([term, meaning]) => <article key={term}><span>Begriff</span><strong>{term}</strong><p>{meaning}</p></article>)}
        </div>
        {!filteredGlossary.length ? <p className="reference-learning-sources__notice">Kein passender Begriff gefunden.</p> : null}
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">FAQ</span><h2>Häufige Anfängerfragen</h2></div><CircleHelp size={21} /></div>
        <div>
          {filteredFaqs.map((item) => <article key={item.question}><span>Frage</span><strong>{item.question}</strong><p>{item.answer}</p><small>{item.source}</small></article>)}
        </div>
        {!filteredFaqs.length ? <p className="reference-learning-sources__notice">Keine passende Anfängerfrage gefunden.</p> : null}
      </section>

      <section className="reference-learning-sources">
        <div className="section-heading"><div><span className="overline">Vertrauen</span><h2>Grenzen dieser Hilfe</h2></div><ShieldCheck size={21} /></div>
        <p className="reference-learning-sources__notice">FAQ und Glossar sind Lernhilfen. Religiöse Aussagen benötigen vor dem öffentlichen Release einen fachlichen Endreview. Bei Ehe, Scheidung, Erbrecht, Finanzverträgen, Krankheit oder anderen komplexen persönlichen Fällen soll die App an qualifizierte Beratung verweisen.</p>
      </section>
    </motion.main>
  );
}
