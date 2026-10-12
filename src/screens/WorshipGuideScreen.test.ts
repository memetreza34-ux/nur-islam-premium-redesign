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

it('does not create guide position or completion just by opening', async () => {
  await renderGuide();
  expect(localStorage.getItem('nur_guide_salah_step')).toBeNull();
  expect(localStorage.getItem('nur_guide_salah_complete')).toBeNull();
});

it('preserves an unknown stored position instead of clamping it on mount', async () => {
  localStorage.setItem('nur_guide_salah_step', '999');
  await renderGuide();
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('999');
});

it('does not claim completion was saved when the storage write fails', async () => {
  localStorage.setItem('nur_guide_salah_step', String(WORSHIP_GUIDE_BY_ID.get('salah')!.steps.length - 1));
  await renderGuide();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => { throw new Error('Quota'); } });
  await click(named('Abschließen'));
  expect(host.querySelector('.toast')?.textContent).not.toContain('als abgeschlossen gespeichert');
  expect(host.textContent).toContain('Speicherung nicht bestätigt');
  expect(stored.getItem('nur_guide_salah_complete')).toBeNull();
});

it('does not count visiting step six as a completed Wudu course', async () => {
  localStorage.setItem('nur_guide_wudu_step', '5');
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('0/6 Gebetsgrundlagen abgeschlossen');
});

it('does not claim any saved position on a fresh guide', async () => {
  await renderGuide();
  expect(host.querySelector('.worship-guide-intro__meta')?.textContent).toContain('Noch keine bestätigte Speicherung');
});

it('keeps explicit navigation usable while preserving an invalid stored position', async () => {
  localStorage.setItem('nur_guide_salah_step', '999');
  await renderGuide();
  await click(named('Nächster Schritt'));
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 2');
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('999');
  expect(host.textContent).toContain('Speicherung der Schrittposition nicht bestätigt');
});

it('saves an explicitly selected position and restores it after remount', async () => {
  await renderGuide();
  await click(named('Nächster Schritt'));
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('1');
  expect(host.querySelector('.worship-guide-intro__meta')?.textContent).toContain('Position lokal gespeichert');
  await act(async () => root.render(null));
  await renderGuide();
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 2');
});

it('does not claim position storage when a write is silently discarded', async () => {
  await renderGuide();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem() {} });
  await click(named('Nächster Schritt'));
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 2');
  expect(host.querySelector('.worship-guide-intro__meta')?.textContent).toContain('Noch keine bestätigte Speicherung');
  expect(host.textContent).toContain('Speicherung der Schrittposition nicht bestätigt');
});

it('does not confirm silently discarded completion and uses a warning icon', async () => {
  localStorage.setItem('nur_guide_salah_step', String(WORSHIP_GUIDE_BY_ID.get('salah')!.steps.length - 1));
  await renderGuide();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem() {} });
  await click(named('Abschließen'));
  expect(host.querySelector('.toast')?.textContent).toContain('Speicherung nicht bestätigt');
  expect(host.querySelector('.toast svg')?.classList.contains('lucide-circle-alert')).toBe(true);
  expect(host.querySelector('.worship-guide-intro__meta')?.textContent).not.toContain('Abschluss lokal gespeichert');
  expect(stored.getItem('nur_guide_salah_complete')).toBeNull();
});

it('confirms explicit completion and restores the confirmed flag', async () => {
  localStorage.setItem('nur_guide_salah_step', String(WORSHIP_GUIDE_BY_ID.get('salah')!.steps.length - 1));
  await renderGuide();
  await click(named('Abschließen'));
  expect(host.querySelector('.toast')?.textContent).toContain('als abgeschlossen gespeichert');
  expect(host.querySelector('.toast svg')?.classList.contains('lucide-circle-check')).toBe(true);
  expect(localStorage.getItem('nur_guide_salah_complete')).toBe('1');
  await act(async () => root.render(null));
  await renderGuide();
  expect(host.querySelector('.worship-guide-intro__meta')?.textContent).toContain('Abschluss lokal gespeichert');
});

it('preserves an unrecognized completion flag when completion is requested', async () => {
  localStorage.setItem('nur_guide_salah_step', String(WORSHIP_GUIDE_BY_ID.get('salah')!.steps.length - 1));
  localStorage.setItem('nur_guide_salah_complete', 'future');
  await renderGuide();
  await click(named('Abschließen'));
  expect(localStorage.getItem('nur_guide_salah_complete')).toBe('future');
  expect(host.querySelector('.toast')?.textContent).toContain('Speicherung nicht bestätigt');
});

it('does not write on a guide switch and keeps each selected cursor separate', async () => {
  await renderGuide();
  await click(named('Nächster Schritt'));
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  const tab = [...host.querySelectorAll<HTMLButtonElement>('.reference-guide-tabs button')].find(button => button.textContent?.trim() === 'Shahada')!;
  await click(tab);
  expect(setItem).not.toHaveBeenCalled();
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('1');
  expect(localStorage.getItem('nur_guide_shahada_step')).toBeNull();
});

it('updates from a genuine other-tab storage event without mount-style writes', async () => {
  await renderGuide();
  localStorage.setItem('nur_guide_salah_step', '2');
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  await act(async () => window.dispatchEvent(new StorageEvent('storage', { key: 'nur_guide_salah_step' })));
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 3');
  expect(setItem).not.toHaveBeenCalled();
});

it('preserves the current visible step when an external value becomes unrecognized', async () => {
  await renderGuide();
  await click(named('Nächster Schritt'));
  localStorage.setItem('nur_guide_salah_step', 'unknown');
  await act(async () => window.dispatchEvent(new StorageEvent('storage', { key: 'nur_guide_salah_step' })));
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 2');
  expect(localStorage.getItem('nur_guide_salah_step')).toBe('unknown');
  expect(host.textContent).toContain('nicht lesbar oder nicht zuordenbar');
});

it('counts confirmed Wudu completion independently from merely visiting its last step', async () => {
  localStorage.setItem('nur_guide_wudu_complete', '1');
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('1/6 Gebetsgrundlagen abgeschlossen');
});

it('shows an unreadable Wudu completion status instead of inventing zero completions', async () => {
  localStorage.setItem('nur_guide_wudu_complete', 'unknown');
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('Abschlussstatus nicht vollständig lesbar');
  expect(localStorage.getItem('nur_guide_wudu_complete')).toBe('unknown');
});

it('refreshes the hub when another tab changes the explicit Wudu completion flag', async () => {
  await renderHub();
  localStorage.setItem('nur_guide_wudu_complete', '1');
  await act(async () => window.dispatchEvent(new StorageEvent('storage', { key: 'nur_guide_wudu_complete' })));
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('1/6 Gebetsgrundlagen abgeschlossen');
});

it('does not count unknown prayer IDs as completed existing prayer lessons', async () => {
  localStorage.setItem('nur_prayer_learning_complete', '["future-a","future-b","future-c","future-d","future-e"]');
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('0/6 Gebetsgrundlagen abgeschlossen');
  expect(localStorage.getItem('nur_prayer_learning_complete')).toBe('["future-a","future-b","future-c","future-d","future-e"]');
});

it.each(['{broken', '["fajr",123]', 'true'])('does not invent an empty completion status from malformed prayer data %j', async raw => {
  localStorage.setItem('nur_prayer_learning_complete', raw);
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('Abschlussstatus nicht vollständig lesbar');
  expect(localStorage.getItem('nur_prayer_learning_complete')).toBe(raw);
});

it('counts only known distinct prayer IDs and the confirmed Wudu flag', async () => {
  localStorage.setItem('nur_prayer_learning_complete', '["fajr","fajr","future"]');
  localStorage.setItem('nur_guide_wudu_complete', '1');
  await renderHub();
  expect(host.querySelector('.reference-prayer-learning-hub__progress strong')?.textContent).toBe('2/6 Gebetsgrundlagen abgeschlossen');
});

it('does not mark skipped guide steps as completed merely by selecting a later position', async () => {
  await renderGuide();
  const buttons = host.querySelectorAll<HTMLButtonElement>('.reference-guide-steps button');
  await click(buttons[5]);
  expect(host.querySelector('.reference-guide-progress')?.textContent).toContain('Schritt 6');
  expect(host.querySelectorAll('.reference-guide-steps .is-complete')).toHaveLength(0);
  expect(host.querySelectorAll('.reference-guide-steps .lucide-circle-check')).toHaveLength(0);
  expect(localStorage.getItem('nur_guide_salah_complete')).toBeNull();
});
