import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export type GuideChapter = { id: string; title: string };

export function FoundationGuideIntro({ introduction, chapters }: { introduction: string; chapters: GuideChapter[] }) {
  return (
    <div className="foundation-guide-intro">
      <p>{introduction}</p>
      <details className="foundation-guide-outline">
        <summary><span>Kapitelübersicht<small>Der Reihe nach lesen oder direkt springen</small></span><ChevronDown size={18} /></summary>
        <nav aria-label="Kapitelübersicht">
          {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{chapter.title}</a>)}
        </nav>
      </details>
    </div>
  );
}

export function FoundationChapter({ id, title, number, children }: GuideChapter & { number: number; children: ReactNode }) {
  return (
    <section className="foundation-chapter" id={id} aria-labelledby={`${id}-title`}>
      <header><span>{String(number).padStart(2, '0')}</span><h2 id={`${id}-title`}>{title}</h2></header>
      <div className="foundation-chapter-content">{children}</div>
    </section>
  );
}

export function FoundationExample({ children }: { children: ReactNode }) {
  return <p className="foundation-example"><strong>Zum Beispiel</strong>{children}</p>;
}

export function FoundationSource({ href, children }: { href: string; children: string }) {
  return <a className="foundation-source" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${children} (externe Quelle, neuer Tab)`}>{children}<span aria-hidden="true"> ↗</span></a>;
}
