import { useState } from 'react';
import { ChevronLeft, FileText, ScrollText, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import {
  hasUnfilledOperatorDetails,
  imprintSections,
  licenseSections,
  privacySections,
} from '../data/legalContent';
import type { LegalSection } from '../data/legalContent';

type LegalTab = 'privacy' | 'imprint' | 'licenses';

const TABS: Array<{ id: LegalTab; label: string; sections: LegalSection[] }> = [
  { id: 'privacy', label: 'Datenschutz', sections: privacySections },
  { id: 'imprint', label: 'Impressum', sections: imprintSections },
  { id: 'licenses', label: 'Lizenzen', sections: licenseSections },
];

export function LegalScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<LegalTab>('privacy');
  const active = TABS.find((entry) => entry.id === tab) ?? TABS[0];

  return (
    <motion.main className="screen reference-legal-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Rechtliches</span><h1>{active.label}</h1></div>
        <span className="reference-legal-header-icon" aria-hidden="true"><ScrollText size={20} /></span>
      </header>

      <div className="reference-legal-tabs" role="tablist">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            role="tab"
            aria-selected={entry.id === tab}
            className={entry.id === tab ? 'is-active' : ''}
            onClick={() => setTab(entry.id)}
          >
            {entry.id === 'privacy' ? <ShieldCheck size={16} /> : <FileText size={16} />}
            {entry.label}
          </button>
        ))}
      </div>

      {hasUnfilledOperatorDetails() ? (
        <section className="reference-legal-pending" role="status">
          <strong>Noch nicht veröffentlichungsfertig</strong>
          <small>
            Die Anbieterangaben sind noch nicht eingetragen. Bis dahin ist dieser Bereich unvollständig
            und die App darf nicht öffentlich angeboten werden.
          </small>
        </section>
      ) : null}

      {active.sections.map((section) => (
        <section className="reference-legal-section" key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      <section className="reference-legal-note">
        <ShieldCheck size={18} />
        <span>
          <strong>Stand der Angaben</strong>
          <small>
            Die Beschreibung der Datenverarbeitung folgt dem tatsächlichen Verhalten der App und wird
            automatisch gegen die im Code verwendeten Dienste geprüft. Sie ersetzt keine
            Rechtsberatung.
          </small>
        </span>
      </section>
    </motion.main>
  );
}
