import type { ReactNode } from 'react';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DHIKR_ROUTINES } from '../data/dhikrData';
import { DhikrScreen } from './DhikrScreen';

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
const render = async () => { await act(async () => root.render(createElement(DhikrScreen, { onBack() {} }))); };
const click = async (selector: string, index = 0) => {
  await act(async () => (host.querySelectorAll(selector)[index] as HTMLButtonElement).click());
};

it('renders every complete reading aid, meaning and qualified source', async () => {
  await render();
  for (const [routineIndex, routine] of DHIKR_ROUTINES.entries()) {
    await click('.reference-dhikr-category-grid button', routineIndex);
    for (const [itemIndex, item] of routine.items.entries()) {
      await click('.reference-dhikr-step-tabs button', itemIndex);
      const copy = host.querySelector('.reference-dhikr-copy')!;
      expect(copy.textContent).toContain(item.arabic);
      expect(copy.textContent).toContain(`Umschrift: ${item.transliteration ?? item.latin}`);
      expect(copy.textContent).toContain(`Sinngemäße Bedeutung: ${item.meaning}`);
      const source = host.querySelector('.reference-dhikr-source')!;
      expect(source.textContent).toContain(item.itemSource ?? routine.source);
      if (routine.note) expect(source.textContent).toContain(routine.note);
      if (item.itemNote) expect(source.textContent).toContain(item.itemNote);
      const link = source.querySelector('a')!;
      expect(link.getAttribute('href')).toBe(item.itemSourceUrl ?? routine.sourceUrl);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
  }
});

it('keeps a manually selected unfinished step when counting it', async () => {
  await render();
  await click('.reference-dhikr-step-tabs button', 1);
  await click('.reference-dhikr-ring');
  expect(host.querySelector('.reference-dhikr-copy h2')?.textContent).toBe('Alhamdulillah');
  expect(host.querySelector('.reference-dhikr-ring strong')?.textContent).toBe('1');
  expect(JSON.parse(localStorage.getItem('nur_dhikr_daily_v2')!).counts).toEqual({ 'after-prayer:alhamdulillah': 1 });
});

it('explains that reset counts are not a cumulative all-day total', async () => {
  await render();
  await click('.reference-dhikr-ring');
  await click('.reference-dhikr-reset');
  await click('[aria-label="Heutige Statistik öffnen"]');
  expect(host.querySelector('.reference-dhikr-stats-summary strong')?.textContent).toBe('0');
  expect(host.querySelector('.reference-dhikr-stats-summary')?.textContent).toContain('Summe aktueller Zählerstände');
  expect(host.querySelector('.reference-dhikr-stats-note')?.textContent).toContain('Zurückgesetzte Wiederholungen sind nicht mehr');
});

it.each(['throw', 'discard'])('does not claim persisted statistics when storage will %s', async mode => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => { if (mode === 'throw') throw new Error('Blocked'); },
  });
  await render();
  await click('.reference-dhikr-ring');
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Speicherung fehlgeschlagen');
  await click('[aria-label="Heutige Statistik öffnen"]');
  expect(host.querySelector('.reference-dhikr-stats-note')?.textContent).toContain('nur in dieser Sitzung');
  expect(host.querySelector('.reference-dhikr-stats-summary strong')?.textContent).toBe('1');
});

// Content assertions inspect the disclosure payload; browser tests cover its interaction.
vi.mock('../shared/SourceInfo', () => ({ SourceInfo: ({ children }: { children: ReactNode }) => createElement('span', null, children) }));
