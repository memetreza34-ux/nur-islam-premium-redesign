import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DailyHadithScreen } from './DailyHadithScreen';
import { getDailyHadith, getHadithById } from '../data/hadithData';

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 10, 23, 59, 45));
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
  vi.useRealTimers();
});

it('changes the open daily selection after local midnight without reopening', async () => {
  const today = getDailyHadith(new Date());
  await act(async () => root.render(createElement(DailyHadithScreen, { onBack() {} })));
  expect(host.querySelector('blockquote')?.textContent).toBe(today.summary);
  await act(async () => vi.advanceTimersByTime(30000));
  const tomorrow = getDailyHadith(new Date());
  expect(tomorrow.id).not.toBe(today.id);
  expect(host.querySelector('blockquote')?.textContent).toBe(tomorrow.summary);
});

it('refreshes the daily selection on return from a suspended tab', async () => {
  await act(async () => root.render(createElement(DailyHadithScreen, { onBack() {} })));
  await act(async () => {
    vi.setSystemTime(new Date(2026, 9, 11, 8));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  expect(host.querySelector('blockquote')?.textContent).toBe(getDailyHadith(new Date()).summary);
});

it('does not rotate a deliberately selected saved Hadith', async () => {
  const entry = getHadithById('smile')!;
  await act(async () => root.render(createElement(DailyHadithScreen, { hadithId: entry.id, onBack() {} })));
  await act(async () => vi.advanceTimersByTime(60000));
  expect(host.querySelector('blockquote')?.textContent).toBe(entry.summary);
});

it.each(['missing-id', ''])('does not replace invalid saved id %s with the daily selection', async id => {
  const onBack = vi.fn();
  await act(async () => root.render(createElement(DailyHadithScreen, { hadithId: id, onBack })));
  expect(host.textContent).toContain('Hadith nicht verfügbar');
  expect(host.querySelector('blockquote')).toBeNull();
  await act(async () => (host.querySelector('button') as HTMLButtonElement).click());
  expect(onBack).toHaveBeenCalledOnce();
});

it('shows a storage failure instead of a saved badge or success message', async () => {
  await act(async () => root.render(createElement(DailyHadithScreen, { onBack() {} })));
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => { throw new DOMException('Full', 'QuotaExceededError'); },
  });
  await act(async () => (host.querySelector('.reference-detail-actions button') as HTMLButtonElement).click());
  expect(host.textContent).toContain('Änderung konnte nicht vollständig gespeichert werden');
  expect(host.querySelector('.reference-detail-actions button')?.classList.contains('is-saved')).toBe(false);
  expect(host.querySelector('.toast')?.textContent).not.toContain('Hadith gespeichert');
});
