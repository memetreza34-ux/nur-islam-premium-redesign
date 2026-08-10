import { afterEach, describe, expect, it, vi } from 'vitest';
import { blockForeignFraming, isFramedByForeignSite } from './frameGuard';

function stubTop(top: unknown) {
  Object.defineProperty(window, 'top', { value: top, configurable: true });
}

afterEach(() => {
  Object.defineProperty(window, 'top', { value: window, configurable: true });
  vi.unstubAllGlobals();
});

describe('isFramedByForeignSite', () => {
  it('allows the normal case where the app owns the whole tab', () => {
    stubTop(window);
    expect(isFramedByForeignSite()).toBe(false);
  });

  it('allows a same-origin frame, which local previews rely on', () => {
    stubTop({ location: { origin: window.location.origin } });
    expect(isFramedByForeignSite()).toBe(false);
  });

  it('blocks a frame on another origin', () => {
    stubTop({ location: { origin: 'https://attacker.example' } });
    expect(isFramedByForeignSite()).toBe(true);
  });

  it('blocks a cross-origin frame whose location cannot be read at all', () => {
    // A real foreign parent throws on property access rather than reporting a
    // different origin, so the thrown case must fail closed.
    stubTop({ get location(): never { throw new DOMException('blocked'); } });
    expect(isFramedByForeignSite()).toBe(true);
  });
});

describe('blockForeignFraming', () => {
  it('replaces the app with a notice and no executable markup', () => {
    const root = document.createElement('div');
    root.textContent = 'app';
    blockForeignFraming(root);

    expect(root.querySelector('.frame-guard')).not.toBeNull();
    expect(root.textContent).toContain('Nur Islam läuft nicht in fremden Seiten');
    expect(root.querySelector('script')).toBeNull();

    const link = root.querySelector('a');
    expect(link?.rel).toBe('noopener noreferrer');
  });
});
