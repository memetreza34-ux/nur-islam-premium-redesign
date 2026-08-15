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
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useDialog(open: boolean, onClose: () => void, label: string | undefined) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Move focus into the dialog so the next Tab stays inside it and a screen
    // reader starts reading here rather than behind the overlay.
    const focusTarget = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? dialogRef.current;
    focusTarget?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      // Keep Tab inside the dialog. Moving focus in on open was not enough:
      // three presses walked out of the overlay and onto the bottom navigation
      // underneath, where the controls are covered but still operable, and
      // nothing on screen says where focus went.
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);
      if (focusable.length === 0) {
        // Nothing to land on — hold focus on the dialog rather than let it out.
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
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
