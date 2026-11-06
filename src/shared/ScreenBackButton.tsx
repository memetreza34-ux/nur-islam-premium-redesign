import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft } from 'lucide-react';

const BackTarget = createContext<HTMLDivElement | null | undefined>(undefined);

export function ScreenBackProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return <BackTarget.Provider value={target}>
    <div className="screen-back" ref={setTarget} />
    {children}
  </BackTarget.Provider>;
}

export function ScreenBackButton({ onClick, label = 'Zurück' }: { onClick: () => void; label?: string }) {
  const target = useContext(BackTarget);
  const button = <button type="button" className="icon-button" onClick={onClick} aria-label={label}><ChevronLeft size={20} aria-hidden="true" /></button>;
  if (target === undefined) return button;
  return <><span aria-hidden="true" />{target ? createPortal(button, target) : null}</>;
}
