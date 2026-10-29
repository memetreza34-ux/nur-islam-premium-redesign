import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { SplashScreen } from './SplashScreen';

it('reveals the selected mosque with the same fallback and no daily text or request', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(createElement(SplashScreen)));
    expect(host.querySelector('.entry-emblem img')?.getAttribute('src')).toContain('nur-logo-mosque-3d-v1.webp');
    expect(host.querySelector('.entry-emblem .premium-image__fallback image')?.getAttribute('href')).toMatch(/^data:image\/webp;base64,/);
    expect(host.querySelectorAll('.entry-door')).toHaveLength(2);
    expect(host.querySelector('.entry-wordmark')?.textContent).toBe('Nur Islam');
    expect(host.textContent).not.toMatch(/Ayah|Nächstes Gebet|Dein App-Name/);
    expect(host.querySelector('[role="status"]')?.textContent).toBe('App wird geöffnet');
    expect(fetch).not.toHaveBeenCalled();
  } finally {
    await act(async () => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
  }
});
