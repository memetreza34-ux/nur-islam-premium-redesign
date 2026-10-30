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
const buttonNamed = (text: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.includes(text))!;

it.each(['{broken', '["faith-overview","pillars-hajj"]'])('preserves old completion data while reading: %s', async saved => {
  localStorage.setItem('nur_learning_completed', saved);
  await render();
  await click(buttonNamed('Nächste Lektion'));
  expect(localStorage.getItem('nur_learning_completed')).toBe(saved);
  expect(host.querySelector('[role="dialog"]')).toBeNull();
  expect(host.querySelector('.learning-course-v2__quiz-options')).toBeNull();
  expect(host.querySelector('.learning-course-v2__lesson h2')?.textContent).toBe(getCategoryLessons('faith')[1].title);
  expect(host.textContent).not.toMatch(/abgeschlossen|zurücksetzen/i);
});

it('does not create completion or cursor values just by opening a lesson', async () => {
  await render();
  expect(host.querySelector('.learning-course-v2__quiz-options')).toBeNull();
  expect(localStorage.getItem('nur_learning_completed')).toBeNull();
  expect(localStorage.getItem('nur_learning_last_faith')).toBeNull();
});

it('keeps all lessons available to read even with an old completed state', async () => {
  localStorage.setItem('nur_learning_completed', JSON.stringify(getCategoryLessons('faith').map(lesson => lesson.id)));
  await render();
  await click(buttonNamed('Lektion auswählen'));
  const lessons = host.querySelectorAll<HTMLButtonElement>('.learning-course-v2__lessons button');
  expect(lessons).toHaveLength(7);
  for (const lesson of lessons) {
    expect(lesson.textContent).toContain('Min');
    expect(lesson.disabled).toBe(false);
    expect(lesson.classList.contains('is-complete')).toBe(false);
  }
  await click(lessons[6]);
  expect(host.querySelector('.learning-course-v2__lesson h2')?.textContent).toBe(getCategoryLessons('faith')[6].title);
});

it('keeps obsolete cursor data and displays an honest fallback warning', async () => {
  localStorage.setItem('nur_learning_last_faith', 'obsolete-lesson');
  await render();
  expect(localStorage.getItem('nur_learning_last_faith')).toBe('obsolete-lesson');
  expect(host.textContent).toContain('nicht lesbar oder nicht zuordenbar');
});

it('remembers the reading position without marking a lesson complete', async () => {
  await render();
  await click(buttonNamed('Nächste Lektion'));
  const next = getCategoryLessons('faith')[1];
  expect(localStorage.getItem('nur_learning_last_faith')).toBe(next.id);
  await act(async () => root.render(null));
  await render();
  expect(host.querySelector('.learning-course-v2__lesson h2')?.textContent).toBe(next.title);
  expect(localStorage.getItem('nur_learning_completed')).toBeNull();
});

it('keeps reading usable when storage is unavailable', async () => {
  await render();
  vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Denied'); }, setItem: () => { throw new Error('Denied'); } });
  expect(host.querySelector('.learning-course-v2__quiz-options')).toBeNull();
  expect(host.querySelector('[role="dialog"]')).toBeNull();
  await click(buttonNamed('Nächste Lektion'));
  expect(host.querySelector('.learning-course-v2__lesson h2')?.textContent).toBe('1. Glaube an Allah');
  expect(host.textContent).toContain('Speicherung der letzten Lektionsposition');
});
