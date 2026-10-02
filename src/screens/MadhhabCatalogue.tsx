import { useRef, useState } from 'react';
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Landmark,
  MapPin,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { MADHHAB_CATALOGUE, type MadhhabEntry } from '../data/madhhabCatalogueData';
import type { MadhhabId } from '../data/madhhabData';
import type { LegacyFeatureItem } from '../data/legacyFeatures';

function screenFrame(element: HTMLElement | null) {
  return element?.closest<HTMLElement>('.screen-transition-frame') ?? null;
}

function CatalogueHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="reference-screen-header">
      <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
      <div><span className="overline">Islamisches Recht verstehen</span><h1>{title}</h1></div>
      <span className="reference-legacy-header-icon"><Scale size={20} /></span>
    </header>
  );
}

function MadhhabCatalogue({ onOpen }: { onOpen: (id: MadhhabId, source: HTMLElement) => void }) {
  return (
    <>
      <section className="madhhab-intro" aria-labelledby="madhhab-intro-title">
        <div>
          <span className="overline">Einfach erklärt</span>
          <h2 id="madhhab-intro-title">Was ist eine Rechtsschule?</h2>
          <p>Eine Rechtsschule heißt auf Arabisch <strong>Madhhab</strong>. Sie erklärt, wie Gelehrte aus Quran und Sunnah Regeln für Gebet, Alltag und Zusammenleben ableiten.</p>
        </div>
        <p className="madhhab-intro__note">Gemeinsame Glaubensgrundlagen, unterschiedliche Herleitungen – keine vier Religionen und keine Rangliste.</p>
      </section>

      <section className="madhhab-catalogue" aria-labelledby="madhhab-catalogue-title">
        <div className="section-heading"><div><span className="overline">Katalog</span><h2 id="madhhab-catalogue-title">Eine Schule öffnen</h2></div><span className="reference-legacy-count">4</span></div>
        <div className="madhhab-grid">
          {MADHHAB_CATALOGUE.map((school) => (
            <button key={school.id} onClick={(event) => onOpen(school.id, event.currentTarget)} aria-label={`${school.title}e Rechtsschule öffnen`}>
              <span className="madhhab-grid__top"><Landmark size={20} /><span lang="ar" dir="rtl">{school.arabic.replace('الْمَذْهَبُ ', '')}</span></span>
              <strong>{school.title}</strong>
              <em>{school.eponym}</em>
              <span className="madhhab-grid__place"><MapPin size={14} />{school.origin}</span>
              <ChevronRight className="madhhab-grid__arrow" size={19} />
            </button>
          ))}
        </div>
      </section>

      <section className="madhhab-beginner-note">
        <BookOpenCheck size={20} />
        <div><strong>Für den Einstieg</strong><p>Nutze die Übersicht zum Verstehen, nicht zum selbständigen Zusammenstellen einzelner Urteile. Bei persönlichen Rechtsfragen hilft eine qualifizierte, vertrauenswürdige Lehrperson vor Ort.</p></div>
      </section>
    </>
  );
}

function MadhhabDetail({ school, onBack }: { school: MadhhabEntry; onBack: () => void }) {
  return (
    <>
      <section className="madhhab-detail-hero">
        <span className="madhhab-detail-hero__icon"><Landmark size={28} /></span>
        <div><span className="overline">Eine von vier sunnitischen Rechtsschulen</span><h2>{school.title}</h2><p lang="ar" dir="rtl">{school.arabic}</p><small>{school.pronunciation}</small></div>
      </section>

      <nav className="madhhab-detail-jump" aria-label="Inhalt dieser Rechtsschule">
        <a href="#madhhab-kurz">Kurz erklärt</a><a href="#madhhab-geschichte">Geschichte</a><a href="#madhhab-methode">Methode</a><a href="#madhhab-quellen">Quellen</a>
      </nav>

      <article className="madhhab-detail">
        <section id="madhhab-kurz">
          <span className="overline">Kurz erklärt</span><h3>Was diese Schule kennzeichnet</h3><p className="madhhab-detail__lead">{school.short}</p>
          <dl className="madhhab-facts">
            <div><dt>Namensgeber</dt><dd>{school.eponym}</dd></div>
            <div><dt>Lebenszeit</dt><dd>{school.dates}</dd></div>
            <div><dt>Frühes Zentrum</dt><dd>{school.origin}</dd></div>
          </dl>
        </section>

        <section id="madhhab-geschichte">
          <span className="overline">Entstehung</span><h3>Nicht das Werk eines Einzelnen</h3>
          {school.history.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section id="madhhab-methode">
          <span className="overline">Methodik</span><h3>Wie juristische Urteile hergeleitet werden</h3>
          <div className="madhhab-method-list">
            {school.method.map((entry, index) => <div key={entry.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{entry.title}</h4><p>{entry.text}</p></div></div>)}
          </div>
        </section>

        <section>
          <span className="overline">Einordnung</span><h3>Verbreitung und Praxis</h3>
          <div className="madhhab-context-grid"><div><MapPin size={18} /><h4>Historische Verbreitung</h4><p>{school.spread}</p></div><div><Scale size={18} /><h4>Was der Unterschied bedeutet</h4><p>{school.practice}</p></div></div>
        </section>

        <section id="madhhab-quellen">
          <span className="overline">Zum Weiterlesen</span><h3>Quellen und offizielle Startseiten</h3>
          <p>Da eine historische Rechtsschule keine zentrale Organisation ist, gibt es keine „offizielle Homepage“ der Schule. Diese direkten Fachlinks stammen von anerkannten Institutionen und Nachschlagewerken.</p>
          <div className="madhhab-source-list">
            {school.sources.map((source) => (
              <div key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                <span><strong>{source.title}</strong><small>{source.publisher} · {source.language}</small></span><ExternalLink size={17} />
              </a>
              {source.homepage && <a className="madhhab-source-home" href={source.homepage} target="_blank" rel="noopener noreferrer" aria-label={`Offizielle Startseite: ${source.publisher}`}>Startseite der Institution<ExternalLink size={14} /></a>}
              </div>
            ))}
          </div>
        </section>
      </article>

      <button className="madhhab-back-button" onClick={onBack}><ChevronLeft size={18} />Zurück zu allen vier Schulen</button>
      <section className="reference-legacy-notice"><ShieldCheck size={19} /><p>Diese Lernübersicht ersetzt keine Fatwa. Die verlinkten Quellen helfen dir, Methodik und Geschichte der Rechtsschulen zu vertiefen.</p></section>
    </>
  );
}

export function MadhhabCatalogueFeature({ feature, onBack }: { feature: LegacyFeatureItem; onBack: () => void }) {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<MadhhabId | null>(null);
  const returnScroll = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const selected = MADHHAB_CATALOGUE.find((school) => school.id === selectedId) ?? null;

  const openSchool = (id: MadhhabId, source: HTMLElement) => {
    const frame = screenFrame(source);
    returnScroll.current = frame?.scrollTop ?? 0;
    setSelectedId(id);
    requestAnimationFrame(() => screenFrame(mainRef.current)?.scrollTo({ top: 0, behavior: 'instant' }));
  };

  const closeSchool = () => {
    setSelectedId(null);
    requestAnimationFrame(() => screenFrame(mainRef.current)?.scrollTo({ top: returnScroll.current, behavior: 'instant' }));
  };

  return (
    <motion.main
      ref={mainRef}
      className="screen reference-legacy-screen madhhab-screen"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}
    >
      <CatalogueHeader title={selected?.title ?? feature.title} onBack={selected ? closeSchool : onBack} />
      {selected ? <MadhhabDetail school={selected} onBack={closeSchool} /> : <MadhhabCatalogue onOpen={openSchool} />}
    </motion.main>
  );
}
