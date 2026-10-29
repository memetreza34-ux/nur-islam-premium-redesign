import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { restoreScrollWhenReady } from './restoreScreenScroll';

let node: HTMLDivElement;
let contentHeight: number;
let offset: number;

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal('requestAnimationFrame', () => 1);
  vi.stubGlobal('cancelAnimationFrame', () => {});
  node = document.createElement('div');
  document.body.append(node);
  contentHeight = 100;
  offset = 0;
  Object.defineProperty(node, 'scrollTop', {
    get: () => offset,
    set: (value: number) => { offset = Math.max(0, Math.min(value, contentHeight - 100)); },
  });
  node.append(document.createElement('div'));
});
afterEach(() => { node.remove(); vi.unstubAllGlobals(); });

it('waits for late content instead of losing a clamped return position', async () => {
  const stop = restoreScrollWhenReady(node, 640, 'late-content-test');
  expect(node.scrollTop).toBe(0);
  expect(node.dataset.restoringScroll).toBe('true');
  contentHeight = 1600;
  node.replaceChildren(document.createElement('main'));
  await vi.waitFor(() => expect(node.scrollTop).toBe(640));
  expect(node.dataset.restoringScroll).toBeUndefined();
  stop();
});

it('stops waiting as soon as the user chooses to scroll', async () => {
  const stop = restoreScrollWhenReady(node, 640, 'user-scroll-test');
  node.dispatchEvent(new Event('wheel'));
  contentHeight = 1600;
  node.replaceChildren(document.createElement('main'));
  await new Promise(resolve => setTimeout(resolve, 20));
  expect(node.scrollTop).toBe(0);
  expect(node.dataset.restoringScroll).toBeUndefined();
  stop();
});
