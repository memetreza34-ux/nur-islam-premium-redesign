import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function ReadingIntroduction({ children, className = '', label }: { children: ReactNode; className?: string; label?: string }) {
  return <details className={`reading-introduction ${className}`.trim()} aria-label={label}>
    <summary><span>Einführung</span><ChevronDown size={18} aria-hidden="true" /></summary>
    <div className="reading-introduction__body">{children}</div>
  </details>;
}
