import { SourceInfo } from './SourceInfo';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export type GuideChapter = { id: string; title: string };

export function FoundationGuideIntro({ introduction, chapters }: { introduction: string; chapters: GuideChapter[] }) {
  return (
    <div className="foundation-guide-intro">
      <p>{introduction}</p>
      <details className="foundation-guide-outline">
        <summary><span>Kapitel auswählen</span><ChevronDown size={18} /></summary>
        <nav aria-label="Kapitelübersicht">
          {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={(event) => {
            const target = document.getElementById(chapter.id);
            if (target instanceof HTMLDetailsElement) target.open = true;
            const menu = event.currentTarget.closest('details');
            if (menu) menu.open = false;
          }}><span>{String(index + 1).padStart(2, '0')}</span>{chapter.title}</a>)}
        </nav>
      </details>
    </div>
  );
}

export function FoundationChapter({ id, title, number, children, defaultOpen = number === 1 }: GuideChapter & { number: number; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="foundation-chapter" id={id} aria-labelledby={`${id}-title`} open={defaultOpen}>
      <summary><span>{number}</span><h2 id={`${id}-title`}>{title}</h2><ChevronDown size={18} aria-hidden="true" /></summary>
      <div className="foundation-chapter-content">{children}</div>
    </details>
  );
}

export function FoundationExample({ children }: { children: ReactNode }) {
  return <p className="foundation-example"><strong>Zum Beispiel</strong>{children}</p>;
}

export function FoundationSource({ href, children }: { href: string; children: string }) {
  return <SourceInfo title="Quellenangabe"><a className="foundation-source" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${children} (externe Quelle, neuer Tab)`}>{children}<span aria-hidden="true"> ↗</span></a></SourceInfo>;
}
