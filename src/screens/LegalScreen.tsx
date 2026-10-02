import { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronLeft,
  Copyright,
  ExternalLink,
  FileCheck2,
  HardDrive,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  hasUnfilledOperatorDetails,
  imprintSections,
  licenseSections,
  OPERATOR_PLACEHOLDER,
  operator,
  privacySections,
} from '../data/legalContent';
import type { LegalSection } from '../data/legalContent';

type LegalTab = 'privacy' | 'imprint' | 'licenses';

const TABS: Array<{ id: LegalTab; label: string; sections: LegalSection[]; icon: typeof ShieldCheck }> = [
  { id: 'privacy', label: 'Datenschutz', sections: privacySections, icon: ShieldCheck },
  { id: 'imprint', label: 'Impressum', sections: imprintSections, icon: Building2 },
  { id: 'licenses', label: 'Lizenzen', sections: licenseSections, icon: Copyright },
];

const TAB_INTRO: Record<LegalTab, { eyebrow: string; title: string; text: string; facts: string[] }> = {
  privacy: {
    eyebrow: 'Privatsphäre verständlich',
    title: 'Deine Daten. Klar erklärt.',
    text: 'Hier erfährst du ohne versteckte Formulierungen, was auf deinem Gerät bleibt und wann externe Dienste beteiligt sind.',
    facts: ['Lokal ohne Konto', 'Cloud nur mit Einwilligung', 'Keine Werbe-Tracker'],
  },
  imprint: {
    eyebrow: 'Anbieter & Verantwortung',
    title: 'Wer hinter Nur Islam steht.',
    text: 'Anbieter, Kontakt und inhaltliche Verantwortung werden an einer dauerhaft erreichbaren Stelle gebündelt.',
    facts: ['Anbieter', 'Kontakt', 'Inhaltsverantwortung'],
  },
  licenses: {
    eyebrow: 'Quellen & Nutzungsrechte',
    title: 'Herkunft sichtbar gemacht.',
    text: 'Kartendaten, Schriften, Aufnahmen, Texte und erzeugte Illustrationen werden nachvollziehbar zugeordnet.',
    facts: ['Offene Lizenzen', 'Quellenhinweise', 'KI-Bilder offengelegt'],
  },
};

const OFFICIAL_SOURCES: Record<LegalTab, Array<{ label: string; href: string }>> = {
  privacy: [
    { label: 'Art. 13 DSGVO', href: 'https://eur-lex.europa.eu/eli/reg/2016/679/art_13/oj' },
    { label: '§ 25 TDDDG', href: 'https://www.gesetze-im-internet.de/ttdsg/__25.html' },
  ],
  imprint: [
    { label: '§ 5 DDG', href: 'https://www.gesetze-im-internet.de/ddg/__5.html' },
  ],
  licenses: [
    { label: 'EU-Leitlinien zu Art. 50 AI Act', href: 'https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations' },
  ],
};

export function LegalScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<LegalTab>('privacy');
  const reduceMotion = useReducedMotion();
  const active = TABS.find((entry) => entry.id === tab) ?? TABS[0];
  const intro = TAB_INTRO[active.id];
  const ActiveIcon = active.icon;

  return (
    <motion.main className="screen reference-legal-screen" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header reference-legal-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Rechtliches</span><h1>{active.label}</h1></div>
        <span className="reference-legal-header-icon" aria-hidden="true"><Scale size={20} /></span>
      </header>

      <section className="reference-legal-hero">
        <span className="reference-legal-hero__icon" aria-hidden="true"><ActiveIcon size={25} /></span>
        <span className="overline">{intro.eyebrow}</span>
        <h2>{intro.title}</h2>
        <p>{intro.text}</p>
        <div className="reference-legal-facts" aria-label="Kurzüberblick">
          {intro.facts.map((fact) => <span key={fact}><Check size={13} />{fact}</span>)}
        </div>
      </section>

      <div className="reference-legal-tabs" role="tablist" aria-label="Rechtliche Bereiche">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <button
              key={entry.id}
              id={`legal-tab-${entry.id}`}
              role="tab"
              aria-selected={entry.id === tab}
              aria-controls={`legal-panel-${entry.id}`}
              className={entry.id === tab ? 'is-active' : ''}
              onClick={() => setTab(entry.id)}
            >
              <Icon size={16} />
              <span>{entry.label}</span>
            </button>
          );
        })}
      </div>

      {hasUnfilledOperatorDetails() ? (
        <section className="reference-legal-pending" role="status">
          <span className="reference-legal-pending__icon"><AlertTriangle size={20} /></span>
          <div>
            <span className="overline">Veröffentlichung gesperrt</span>
            <strong>Noch nicht veröffentlichungsfertig</strong>
            <p>Die gesetzlich erforderlichen Anbieterangaben sind noch nicht vollständig. Die App darf bis zur Ergänzung nicht öffentlich angeboten werden.</p>
            <div className="reference-legal-pending__checks">
              <span className="is-ready"><Check size={12} /> Name: {operator.name}</span>
              <span><AlertTriangle size={12} /> Ladungsfähige Anschrift fehlt</span>
              <span><AlertTriangle size={12} /> Kontakt-E-Mail fehlt</span>
            </div>
          </div>
        </section>
      ) : null}

      <div
        className="reference-legal-sections"
        id={`legal-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`legal-tab-${active.id}`}
      >
        {active.sections.map((section, index) => {
          const visibleParagraphs = section.paragraphs.filter((paragraph) => !paragraph.includes(OPERATOR_PLACEHOLDER));
          const hasPendingParagraph = visibleParagraphs.length !== section.paragraphs.length;

          return (
            <section className="reference-legal-section" key={section.heading}>
              <header>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{section.heading}</h2>
              </header>
              <div>
                {visibleParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {hasPendingParagraph ? (
                  <p className="reference-legal-section__missing"><AlertTriangle size={15} /> Diese Pflichtangabe ist noch offen und wird mit den echten Betreiberdaten ergänzt.</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="reference-legal-sources">
        <span className="reference-legal-sources__icon"><FileCheck2 size={19} /></span>
        <div>
          <strong>Offizielle Grundlagen</strong>
          <small>Zuletzt fachlich geprüft am 12. September 2026. Keine individuelle Rechtsberatung.</small>
          <nav aria-label="Offizielle Rechtsquellen">
            {OFFICIAL_SOURCES[active.id].map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={12} /></a>
            ))}
          </nav>
        </div>
        <HardDrive size={17} aria-hidden="true" />
      </footer>
    </motion.main>
  );
}
