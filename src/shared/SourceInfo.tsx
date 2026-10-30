import { lazy, Suspense, useId, useRef, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

// Warm the dialog before its first opening, including a later offline opening.
const dialogModule = import('./SourceInfoDialog');
void dialogModule.catch(() => {});
const SourceInfoDialog = lazy(() => dialogModule);

export function SourceInfo({ title = 'Quellen und Einordnung', children }: { title?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return <span className="source-info">
    <button ref={trigger} type="button" className="source-info__trigger" aria-label={`Quellen anzeigen: ${title}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={event => { event.stopPropagation(); setOpen(true); }}><Info size={20} aria-hidden="true" /></button>
    {open ? <Suspense fallback={null}><SourceInfoDialog id={id} title={title} trigger={trigger} onClose={() => setOpen(false)}>{children}</SourceInfoDialog></Suspense> : null}
  </span>;
}
