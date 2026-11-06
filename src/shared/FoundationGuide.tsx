import { SourceInfo } from './SourceInfo';
import { ReadingNavigation } from './ReadingNavigation';
import { ReadingIntroduction } from './ReadingIntroduction';
import { useScreenState } from './ScreenState';
import { createContext, useContext, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export type GuideChapter = { id: string; title: string };
type Reader = { chapters: GuideChapter[]; activeId: string; select: (id: string) => void; onBack: () => void };
const FoundationReaderContext = createContext<Reader | null>(null);

export function FoundationReader({ chapters, initialChapter = chapters[0]?.id, onBack, children }: { chapters: GuideChapter[]; initialChapter?: string; onBack: () => void; children: ReactNode }) {
  const [savedId, setSavedId] = useScreenState('foundation-reading-chapter', initialChapter);
  const activeId = chapters.some(chapter => chapter.id === savedId) ? savedId! : chapters[0]?.id ?? '';
  const select = (id: string) => {
    if (!chapters.some(chapter => chapter.id === id)) return;
    setSavedId(id);
    document.querySelector<HTMLElement>('.screen-transition-frame')?.scrollTo(0, 0);
  };
  return <FoundationReaderContext.Provider value={{ chapters, activeId, select, onBack }}>{children}</FoundationReaderContext.Provider>;
}

export function FoundationGuideIntro({ introduction, chapters }: { introduction: string; chapters: GuideChapter[] }) {
  const reader = useContext(FoundationReaderContext);
  const index = chapters.findIndex(chapter => chapter.id === reader?.activeId);
  return <div className="foundation-guide-intro">
    <ReadingIntroduction className="foundation-guide-context">
      <p>{introduction}</p>
    </ReadingIntroduction>
    <details className="foundation-guide-outline">
      <summary className="learning-course-v2__plan-toggle"><span><strong>Kapitel auswählen</strong><small>{index + 1} von {chapters.length}</small></span><ChevronDown size={18} /></summary>
      <ol className="learning-course-v2__lessons" aria-label="Kapitelübersicht">
        {chapters.map((chapter, chapterIndex) => <li key={chapter.id}>
          <button type="button" className={chapter.id === reader?.activeId ? 'is-active' : ''} aria-current={chapter.id === reader?.activeId ? 'step' : undefined} aria-controls={chapter.id} onClick={event => {
            reader?.select(chapter.id);
            const menu = event.currentTarget.closest('details');
            if (menu) { menu.open = false; menu.querySelector('summary')?.focus({ preventScroll: true }); }
          }}><span>{chapterIndex + 1}</span><span><strong>{chapter.title}</strong></span><ChevronRight size={18} aria-hidden="true" /></button>
        </li>)}
      </ol>
    </details>
  </div>;
}

export function FoundationChapter({ id, title, number, children }: GuideChapter & { number: number; children: ReactNode }) {
  const reader = useContext(FoundationReaderContext);
  const index = reader?.chapters.findIndex(chapter => chapter.id === id) ?? -1;
  const last = !reader || index === reader.chapters.length - 1;
  return <article className="foundation-chapter" id={id} aria-labelledby={`${id}-title`} hidden={!!reader && reader.activeId !== id}>
    <header><span className="overline">Kapitel {number}{reader ? ` von ${reader.chapters.length}` : ''}</span><h2 id={`${id}-title`}>{title}</h2></header>
    <div className="foundation-chapter-content">{children}</div>
    {reader ? <ReadingNavigation previousDisabled={index === 0} onPrevious={() => reader.select(reader.chapters[index - 1].id)} onNext={() => last ? reader.onBack() : reader.select(reader.chapters[index + 1].id)} nextLabel={last ? 'Zur Übersicht' : 'Nächstes Kapitel'} /> : null}
  </article>;
}

export function FoundationExample({ children }: { children: ReactNode }) {
  return <p className="foundation-example"><strong>Zum Beispiel</strong>{children}</p>;
}

export function FoundationSource({ href, children }: { href: string; children: string }) {
  return <SourceInfo title="Quellenangabe" label={children}><a className="foundation-source" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${children} (externe Quelle, neuer Tab)`}>{children}<span aria-hidden="true"> ↗</span></a></SourceInfo>;
}
