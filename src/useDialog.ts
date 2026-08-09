import { useEffect, useRef } from 'react';

/**
 * Keyboard and screen-reader behaviour for the app's modal dialogs.
 *
 * Every dialog was a plain <section>: nothing announced that a dialog had
 * opened, Escape did nothing, and focus stayed behind the overlay, so closing
 * one without a mouse meant tabbing through the whole screen underneath.
 *
 * Returns the props a dialog needs. Spread them onto the dialog element and
 * pass the same title the dialog shows, so the name a screen reader reads is
 * the one on screen.
 *
 *   const dialog = useDialog(Boolean(selected), () => setSelected(null), selected?.latin);
 *   <motion.section {...dialog.props}>
 */
export function useDialog(open: boolean, onClose: () => void, label: string | undefined) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Move focus into the dialog so the next Tab stays inside it and a screen
    // reader starts reading here rather than behind the overlay.
    const focusTarget = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) ?? dialogRef.current;
    focusTarget?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Hand focus back to whatever opened the dialog, so the user does not
      // land at the top of the page.
      previouslyFocused.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return {
    props: {
      ref: (node: HTMLElement | null) => { dialogRef.current = node; },
      role: 'dialog' as const,
      'aria-modal': true,
      'aria-label': label,
      tabIndex: -1,
    },
  };
}
