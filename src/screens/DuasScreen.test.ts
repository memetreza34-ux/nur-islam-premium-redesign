import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DuasScreen } from './DuasScreen';

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const render = async (initialDuaId?: string) => {
  await act(async () => root.render(createElement(DuasScreen, { onBack() {}, initialDuaId })));
};
const favorite = () => host.querySelector('.reference-dua-card__top button') as HTMLButtonElement;

it('does not seed empty favorites and persists a toggle before showing it as saved', async () => {
  await render();
  expect(localStorage.getItem('nur_dua_favorites')).toBeNull();
  await act(async () => favorite().click());
  expect(JSON.parse(localStorage.getItem('nur_dua_favorites')!)).toEqual(['dua_sorrow_1']);
  expect(favorite().getAttribute('aria-pressed')).toBe('true');
  await act(async () => favorite().click());
  expect(localStorage.getItem('nur_dua_favorites')).toBe('[]');
  expect(favorite().getAttribute('aria-pressed')).toBe('false');
});

it.each(['throw', 'discard'])('does not claim a favorite was saved when storage will %s', async mode => {
  await render();
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => { if (mode === 'throw') throw new DOMException('Full', 'QuotaExceededError'); },
  });
  await act(async () => favorite().click());
  expect(favorite().getAttribute('aria-pressed')).toBe('false');
  expect(host.textContent).toContain('0 gespeicherte Favoriten');
  expect(host.querySelector('.toast')?.textContent).toContain('Favoriten konnten nicht gespeichert werden');
});

it('migrates existing numeric IDs without overwriting them on mount', async () => {
  localStorage.setItem('nur_dua_favorites', '[1,2]');
  await render();
  expect(host.textContent).toContain('2 gespeicherte Favoriten');
  expect(localStorage.getItem('nur_dua_favorites')).toBe('[1,2]');
  await act(async () => favorite().click());
  expect(JSON.parse(localStorage.getItem('nur_dua_favorites')!)).toEqual(['dua_guidance_1', 'dua_protection_1', 'dua_sorrow_1']);
});

it('records opening but does not claim the text was read', async () => {
  await render();
  await act(async () => (host.querySelector('.reference-dua-card__content') as HTMLButtonElement).click());
  expect(host.querySelector('.reference-dua-viewed')?.textContent).toContain('Geöffnet');
  expect(localStorage.getItem('nur_dua_viewed')).toBe('["dua_sorrow_1"]');
  expect(host.textContent).not.toContain('Gelesen');
});

it('distinguishes an in-session opening count from failed persistence', async () => {
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('Blocked'); } });
  await render('dua_morning_3');
  expect(host.textContent).toContain('1 von 34 Duas');
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Speicherung fehlgeschlagen');
  expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Auszug');
});

it('does not substitute another Dua for an unknown selected ID', async () => {
  await render('missing-dua');
  expect(host.querySelector('[role="dialog"]')).toBeNull();
  expect(host.textContent).toContain('0 von 34 Duas');
});
