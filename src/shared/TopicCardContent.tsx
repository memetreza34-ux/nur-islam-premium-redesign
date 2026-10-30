import type { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PremiumImage } from './PremiumVisuals';

export function TopicCardContent({ title, description, art, fallback, status, expandable = false }: {
  title: string;
  description: string;
  art?: string;
  fallback: ReactNode;
  status?: ReactNode;
  expandable?: boolean;
}) {
  const Arrow = expandable ? ChevronDown : ChevronRight;
  return <>
    <span className="topic-card__art" aria-hidden="true">{art ? <PremiumImage src={art} fallback={fallback} /> : fallback}</span>
    <span className="topic-card__copy">
      <strong className="topic-card__title">{title}</strong>
      <span className="topic-card__description">{description}</span>
      {status != null && <small className="topic-card__status">{status}</small>}
    </span>
    <Arrow className="topic-card__arrow" size={18} aria-hidden="true" />
  </>;
}
