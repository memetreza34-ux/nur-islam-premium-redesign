import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ReadingNavigation({ onPrevious, onNext, previousDisabled = false, nextDisabled = false, previousLabel = 'Vorherige', nextLabel = 'Nächste Lektion', className = '' }: {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}) {
  return <div className={`learning-course-v2__navigation ${className}`.trim()} role="group" aria-label="Lektionsnavigation">
    <button type="button" disabled={previousDisabled} onClick={onPrevious}><ChevronLeft size={17} /> {previousLabel}</button>
    <button type="button" className="gold-button" disabled={nextDisabled} onClick={onNext}>{nextLabel}<ChevronRight size={17} /></button>
  </div>;
}
