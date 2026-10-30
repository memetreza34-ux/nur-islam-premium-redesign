import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { WorshipGuideScreen } from './ReferenceReadingScreens';
import { LearnScreen } from './LearnScreen';
import { WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';

vi.mock('motion/react', async importOriginal => ({ ...await importOriginal<typeof import('motion/react')>(), useReducedMotion: () => true }));
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
const renderGuide = () => act(async () => root.render(createElement(WorshipGuideScreen, { initialMode: 'salah', onBack() {} })));
const renderHub = () => act(async () => root.render(createElement(LearnScreen, { onBack() {}, onOpenPrayer() {}, onOpenQibla() {}, onOpenNames() {}, onOpenQuranReference() {} })));
const click = (button: HTMLButtonElement) => act(async () => button.click());
const named = (text: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.includes(text))!;
const activeIndex = () => [...host.querySelectorAll('.wudu-lesson__overview button')].findIndex(button => button.getAttribute('aria-current') === 'step');
const last = WORSHIP_GUIDE_BY_ID.get('salah')!.steps.length - 1;

it('does not create guide position or completion just by opening', async () => {
  await renderGuide();
  expect(localStorage.getItem('nur_guide_salah_step')).toBeNull();
  expect(localStorage.getItem('nur_guide_salah_complete')).toBeNull();
  expect(host.querySelector('.reference-guide-progress')).toBeNull();
});

it('keeps explicit navigation usable while preserving an invalid stored position', async () => {
  localStorage.setItem('nur_guide_salah_step', '999');
  await renderGuide();
  await click(named('Nächster Schritt'));
  expect(activeIndex()).toBe(1);
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('999');
  expect(host.textContent).toContain('Speicherung der Schrittposition nicht bestätigt');
});

it('restores a selected reading position after remount', async () => {
  await renderGuide();
  await click(named('Nächster Schritt'));
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('1');
  await act(async () => root.render(null));
  await renderGuide();
  expect(activeIndex()).toBe(1);
});

for (const failure of ['throw', 'discard'] as const) {
  it(`keeps reading navigation usable and warns when position writes ${failure}`, async () => {
    await renderGuide();
    const stored = localStorage;
    vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem() { if (failure === 'throw') throw new Error('Quota'); } });
    await click(named('Nächster Schritt'));
    expect(activeIndex()).toBe(1);
    expect(host.textContent).toContain('Speicherung der Schrittposition nicht bestätigt');
    expect(stored.getItem('nur_guide_salah_step')).toBeNull();
    expect(stored.getItem('nur_guide_salah_complete')).toBeNull();
  });
}

it.each([null, '0', '1', 'future'])('restarts reading without touching retired completion data %j', async value => {
  localStorage.setItem('nur_guide_salah_step', String(last));
  if (value !== null) localStorage.setItem('nur_guide_salah_complete', value);
  await renderGuide();
  expect(activeIndex()).toBe(last);
  expect(named('Abschließen')).toBeUndefined();
  await click(named('Von vorn'));
  expect(activeIndex()).toBe(0);
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('0');
  expect(localStorage.getItem('nur_guide_salah_complete')).toBe(value);
  expect(host.querySelector('.toast')).toBeNull();
});

it('opens another guide without writing and keeps their reading positions separate', async () => {
  await renderGuide();
  await click(named('Nächster Schritt'));
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  expect(host.querySelector('.reference-guide-tabs')).toBeNull();
  await act(async () => root.render(null));
  await act(async () => root.render(createElement(WorshipGuideScreen, { initialMode: 'wudu', onBack() {} })));
  expect(setItem).not.toHaveBeenCalled();
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('1');
  expect(localStorage.getItem('nur_guide_wudu_step')).toBeNull();
});

it('updates from another tab without writing and preserves the visible position when external data is malformed', async () => {
  await renderGuide();
  localStorage.setItem('nur_guide_salah_step', '2');
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  await act(async () => window.dispatchEvent(new StorageEvent('storage', { key: 'nur_guide_salah_step' })));
  expect(activeIndex()).toBe(2);
  expect(setItem).not.toHaveBeenCalled();
  localStorage.setItem('nur_guide_salah_step', 'unknown');
  await act(async () => window.dispatchEvent(new StorageEvent('storage', { key: 'nur_guide_salah_step' })));
  expect(activeIndex()).toBe(2);
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('unknown');
  expect(host.textContent).toContain('nicht lesbar');
});

it.each(['["fajr"]', '["fajr","fajr","future"]', '["fajr",123]', '{broken', 'true'])('ignores retired learning flags %j and keeps all direct entries', async raw => {
  localStorage.setItem('nur_prayer_learning_complete', raw);
  localStorage.setItem('nur_guide_wudu_complete', 'future');
  await renderHub();
  expect(host.querySelector('.learn-library-prayer-entry')).toBeNull();
  expect(host.querySelectorAll('.learn-library-prayer-card')).toHaveLength(0);
  expect(host.querySelectorAll('button[aria-label="Gebetsablauf Rakʿah mit Wortlaut"]')).toHaveLength(1);
  expect(host.querySelectorAll('.reference-foundation-step')).toHaveLength(14);
  expect(host.querySelectorAll('.is-complete')).toHaveLength(0);
  expect(host.querySelector('.reference-prayer-learning-hub__progress')).toBeNull();
  expect(localStorage.getItem('nur_prayer_learning_complete')).toBe(raw);
  expect(localStorage.getItem('nur_guide_wudu_complete')).toBe('future');
});

it('does not turn a reading jump into completed steps', async () => {
  await renderGuide();
  await click(host.querySelectorAll<HTMLButtonElement>('.wudu-lesson__overview button')[5]);
  expect(activeIndex()).toBe(5);
  expect(host.querySelectorAll('.is-complete')).toHaveLength(0);
  expect(localStorage.getItem('nur_guide_salah_complete')).toBeNull();
});
