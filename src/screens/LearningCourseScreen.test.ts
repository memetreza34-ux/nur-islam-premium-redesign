import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LearningCourseScreen } from './LearningCourseScreen';
import { getCategoryLessons } from '../data/islamicLearningContent';

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
const render = () => act(async () => root.render(createElement(LearningCourseScreen, { categoryId: 'faith', onBack() {} })));
const click = (button: HTMLButtonElement) => act(async () => button.click());
const correct = () => host.querySelector<HTMLButtonElement>('.learning-course-v2__quiz-options button')!;
const buttonNamed = (text: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.includes(text))!;

it('does not replace malformed progress just by opening a course', async () => {
  localStorage.setItem('nur_learning_completed', '{broken');
  await render();
  expect(localStorage.getItem('nur_learning_completed')).toBe('{broken');
});

it('does not claim completion was stored when a write fails', async () => {
  await render();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => { throw new Error('Quota'); } });
  await click(correct());
  expect(host.querySelector('[role="dialog"]')?.textContent).not.toContain('Der Fortschritt wurde lokal gespeichert');
  expect(host.textContent).toContain('Speicherung nicht bestätigt');
  expect(stored.getItem('nur_learning_completed') ?? '').not.toContain(getCategoryLessons('faith')[0].id);
});

it('does not create completion or cursor values on mount', async () => {
  await render();
  expect(localStorage.getItem('nur_learning_completed')).toBeNull();
  expect(localStorage.getItem('nur_learning_last_faith')).toBeNull();
});

it('keeps obsolete cursor data and displays an honest fallback warning', async () => {
  localStorage.setItem('nur_learning_last_faith', 'obsolete-lesson');
  await render();
  expect(localStorage.getItem('nur_learning_last_faith')).toBe('obsolete-lesson');
  expect(host.textContent).toContain('nicht lesbar oder nicht zuordenbar');
});

it('shows a confirmed completion and restores it after remount', async () => {
  await render();
  await click(correct());
  expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Der Fortschritt wurde lokal gespeichert');
  expect(localStorage.getItem('nur_learning_completed')).toBe('["faith-overview"]');
  await act(async () => root.render(null));
  await render();
  expect(host.querySelector('.learning-course-v2__plan-toggle')?.textContent).toContain('1 von 7 abgeschlossen');
});

it('preserves malformed data when a correct answer is attempted', async () => {
  localStorage.setItem('nur_learning_completed', '{broken');
  await render();
  await click(correct());
  expect(localStorage.getItem('nur_learning_completed')).toBe('{broken');
  expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Speicherung nicht bestätigt');
  expect(host.querySelector('.learning-course-v2__plan-toggle')?.textContent).toContain('Fortschritt nicht lesbar');
});

it('does not increase displayed completion after a silently discarded write', async () => {
  await render();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => {} });
  await click(correct());
  expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Speicherung nicht bestätigt');
  expect(host.querySelector('.learning-course-v2__plan-toggle')?.textContent).toContain('0 von 7 abgeschlossen');
});

it('does not erase a completion or claim success after failed reset', async () => {
  localStorage.setItem('nur_learning_completed', '["faith-overview"]');
  await render();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => { throw new Error('Denied'); } });
  await click(buttonNamed('Lektionsfortschritt zurücksetzen'));
  expect(stored.getItem('nur_learning_completed')).toBe('["faith-overview"]');
  expect(host.querySelector('.learning-course-v2__plan-toggle')?.textContent).toContain('1 von 7 abgeschlossen');
  expect(host.querySelector('.toast')?.textContent).toContain('Zurücksetzen nicht bestätigt');
  expect(host.querySelector('.toast svg')?.classList.contains('lucide-x')).toBe(true);
});

it('confirms explicit reset and preserves another course’s data', async () => {
  localStorage.setItem('nur_learning_completed', '["faith-overview","pillars-hajj"]');
  await render();
  await click(buttonNamed('Lektionsfortschritt zurücksetzen'));
  expect(localStorage.getItem('nur_learning_completed')).toBe('["pillars-hajj"]');
  expect(host.querySelector('.toast')?.textContent).toContain('Lektionsfortschritt zurückgesetzt');
});

it('keeps explicit navigation usable while showing a cursor write warning', async () => {
  await render();
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => { throw new Error('Full'); } });
  await click(buttonNamed('Nächste Lektion'));
  expect(host.querySelector('.learning-course-v2__lesson h2')?.textContent).toBe('1. Glaube an Allah');
  expect(host.textContent).toContain('Speicherung der letzten Lektionsposition');
  expect(stored.getItem('nur_learning_last_faith')).toBeNull();
});
