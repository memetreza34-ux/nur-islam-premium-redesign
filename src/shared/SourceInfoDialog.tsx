import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { DialogHeader } from './DialogHeader';

export default function SourceInfoDialog({ id, title, trigger, onClose, children }: { id: string; title: string; trigger: RefObject<HTMLButtonElement | null>; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
    };
  }, [trigger]);
  return createPortal(<dialog ref={dialog} id={id} className="source-info-dialog" aria-modal="true" aria-labelledby={`${id}-title`} onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <DialogHeader title={title} titleId={`${id}-title`} onClose={onClose} closeLabel="Quellen schließen" />
    <div className="source-info-dialog__body">{children}</div>
  </dialog>, document.body);
}
