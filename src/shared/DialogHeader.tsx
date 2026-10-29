import { X } from 'lucide-react';
import { PremiumImage } from './PremiumVisuals';

export function DialogHeader({ title, subtitle, onClose, closeLabel = 'Schließen', titleId, art }: {
  title: string; subtitle?: string; onClose: () => void; closeLabel?: string; titleId?: string; art?: string;
}) {
  return <header className={art ? 'dialog-header dialog-header--art' : 'dialog-header'}>
    {art ? <PremiumImage className="dialog-header__art" src={art} fallback={null} /> : null}
    <div className="dialog-header__copy"><h2 id={titleId} className="dialog-header__title">{title}</h2>{subtitle ? <span className="dialog-header__subtitle">{subtitle}</span> : null}</div>
    <button type="button" className="dialog-header__close" onClick={onClose} aria-label={closeLabel}><X size={20} aria-hidden="true" /></button>
  </header>;
}
