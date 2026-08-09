import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createElement, useState } from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { useDialog } from './useDialog';

// Rendered for real rather than asserted on attributes alone: the point of the
// hook is what happens to focus and to the Escape key, and neither is visible
// in the returned props.

let container: HTMLDivElement;
let root: Root;

function Harness({ label }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useDialog(open, () => setOpen(false), label);
  return createElement('div', null,
    createElement('button', { id: 'opener', onClick: () => setOpen(true) }, 'Öffnen'),
    open
      ? createElement('section', { ...dialog.props, id: 'dialog' },
          createElement('button', { id: 'inside' }, 'Aktion'))
      : null,
  );
}

function render(label?: string) {
  act(() => { root.render(createElement(Harness, { label })); });
}

function openDialog() {
  act(() => { container.querySelector<HTMLButtonElement>('#opener')!.click(); });
}

function pressEscape() {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('dialog behaviour', () => {
  it('announces itself as a named dialog', () => {
    render('Dhikr-Statistik');
    openDialog();

    const dialog = container.querySelector('#dialog')!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    // Without a name a screen reader only says "dialog", which tells nobody
    // which one opened.
    expect(dialog.getAttribute('aria-label')).toBe('Dhikr-Statistik');
  });

  it('moves focus into the dialog instead of leaving it behind the overlay', () => {
    render();
    openDialog();
    expect(document.activeElement?.id).toBe('inside');
  });

  it('closes on Escape', () => {
    render();
    openDialog();
    expect(container.querySelector('#dialog')).not.toBeNull();

    pressEscape();

    expect(container.querySelector('#dialog')).toBeNull();
  });

  it('returns focus to the control that opened it', () => {
    render();
    container.querySelector<HTMLButtonElement>('#opener')!.focus();
    openDialog();
    expect(document.activeElement?.id).toBe('inside');

    pressEscape();

    // Landing back at the top of the page after closing would lose a keyboard
    // user's place entirely.
    expect(document.activeElement?.id).toBe('opener');
  });

  it('ignores Escape while closed', () => {
    render();
    pressEscape();
    expect(container.querySelector('#dialog')).toBeNull();
  });
});
