import { ChevronDown, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { useScreenState } from './ScreenState';

export function ReadingHelp({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useScreenState(`reading-help:${title}`, false);
  return (
    <details className="reading-help" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary><Info size={18} aria-hidden="true" /><span>{title}</span><ChevronDown size={18} aria-hidden="true" /></summary>
      <div>{children}</div>
    </details>
  );
}
