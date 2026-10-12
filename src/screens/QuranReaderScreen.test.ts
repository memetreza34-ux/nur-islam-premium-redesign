import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fetchSurahBundle } from '../services/quranService';
import { QuranReaderScreen } from './QuranReaderScreen';

vi.mock('../services/quranService', () => ({ fetchSurahBundle: vi.fn() }));
vi.mock('motion/react', async importOriginal => ({ ...await importOriginal<typeof import('motion/react')>(), useReducedMotion: () => true }));
let root: Root;
let host: HTMLDivElement;
const originalScroll = Element.prototype.scrollIntoView;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  localStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
  vi.mocked(fetchSurahBundle).mockImplementation(async number => {
    const arabic = JSON.parse(readFileSync(`public/data/quran/ar/${number}.json`, 'utf8'));
    return { meta: arabic, arabic, german: null, transliteration: null, source: 'offline', sourceLabel: 'Arabisch auf dem Gerät', translationSource: 'unavailable', transliterationSource: 'unavailable', translationLabel: 'Bubenheim & Elyas', transliterationLabel: 'Lateinschrift' };
  });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  Element.prototype.scrollIntoView = originalScroll;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const render = async (number = 112) => act(async () => root.render(createElement(QuranReaderScreen, { surahNumber: number, onBack() {}, onOpenSurah() {} })));
const click = async (button: HTMLButtonElement) => act(async () => button.click());
const firstBookmark = () => host.querySelector('#quran-ayah-112-1 button[aria-label="Ayah speichern"]') as HTMLButtonElement;
const buttonNamed = (name: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.getAttribute('aria-label') === name)!;
const setMode = async () => click([...host.querySelectorAll<HTMLButtonElement>('.reference-reader-mode-tabs button')][2]);
const mockStorage = (overrides: Partial<Pick<Storage, 'getItem' | 'setItem'>>) => {
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: stored.setItem.bind(stored), ...overrides });
  return stored;
};

it('does not rewrite bookmarks just by opening a surah', async () => {
  localStorage.setItem('nur_quran_bookmarks_112', '[2]');
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  mockStorage({ setItem: write });
  await render();
  expect(write.mock.calls.some(([key]) => key === 'nur_quran_bookmarks_112')).toBe(false);
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[2]');
});

it.each(['throw', 'discard'])('does not claim a bookmark was saved when storage will %s', async mode => {
  await render();
  mockStorage({ setItem: () => { if (mode === 'throw') throw new DOMException('Full', 'QuotaExceededError'); } });
  await click(firstBookmark());
  expect(firstBookmark().classList.contains('is-saved')).toBe(false);
  expect(host.textContent).toContain('nicht gespeichert');
});

it('preserves malformed bookmarks instead of clearing them on mount or toggle', async () => {
  localStorage.setItem('nur_quran_bookmarks_112', '{broken');
  await render();
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('{broken');
  await click(firstBookmark());
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('{broken');
  expect(host.textContent).toContain('nicht gespeichert');
});

it('does not claim a saved book-page marker after a failed write', async () => {
  await render();
  await setMode();
  mockStorage({ setItem: () => { throw new Error('Quota'); } });
  await click(buttonNamed('Lesestelle merken'));
  expect(buttonNamed('Lesestelle merken').classList.contains('is-saved')).toBe(false);
  expect(host.querySelector('.toast')?.textContent).toContain('nicht gespeichert');
  expect(host.querySelector('.toast')?.textContent).not.toContain('Lesestelle auf Seite');
});

it('does not show an out-of-range page marker as saved on page one', async () => {
  localStorage.setItem('nur_quran_flow_marker_112_arabic-flow', '999');
  await render();
  await setMode();
  expect(buttonNamed('Lesestelle merken').classList.contains('is-saved')).toBe(false);
  expect(localStorage.getItem('nur_quran_flow_marker_112_arabic-flow')).toBe('999');
});

it.each(['nur_reader_font_size', 'nur_reader_arabic_font', 'nur_quran_reader_mode'])('does not rewrite %s on mount', async key => {
  localStorage.setItem(key, 'unknown-preference');
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  mockStorage({ setItem: write });
  await render();
  expect(write.mock.calls.some(([writtenKey]) => writtenKey === key)).toBe(false);
  expect(localStorage.getItem(key)).toBe('unknown-preference');
});

it('starts with the actual default font size when there is no saved preference', async () => {
  await render();
  expect((host.querySelector('.reference-reader-arabic') as HTMLElement).style.fontSize).toBe('34px');
});

it('does not erase existing bookmarks when their read fails', async () => {
  localStorage.setItem('nur_quran_bookmarks_112', '[2]');
  const getItem = localStorage.getItem.bind(localStorage);
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  const stored = mockStorage({ getItem: key => { if (key === 'nur_quran_bookmarks_112') throw new DOMException('Denied', 'SecurityError'); return getItem(key); }, setItem: write });
  await render();
  await click(firstBookmark());
  expect(stored.getItem('nur_quran_bookmarks_112')).toBe('[2]');
  expect(write.mock.calls.some(([key]) => key === 'nur_quran_bookmarks_112')).toBe(false);
  expect(host.textContent).toContain('nicht gespeichert');
});

it('keeps a stored bookmark visible when removing it fails', async () => {
  localStorage.setItem('nur_quran_bookmarks_112', '[1]');
  await render();
  mockStorage({ setItem: () => { throw new Error('Blocked'); } });
  await click(firstBookmark());
  expect(firstBookmark().classList.contains('is-saved')).toBe(true);
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[1]');
});

it('preserves a bookmark update from another tab instead of overwriting it', async () => {
  await render();
  localStorage.setItem('nur_quran_bookmarks_112', '[2]');
  await click(firstBookmark());
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[2]');
  expect(firstBookmark().classList.contains('is-saved')).toBe(false);
  expect(host.textContent).toContain('nicht gespeichert');
});

it('writes, restores and explicitly removes confirmed bookmarks', async () => {
  await render();
  await click(firstBookmark());
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[1]');
  await render(113);
  await render(112);
  expect(firstBookmark().classList.contains('is-saved')).toBe(true);
  await click(firstBookmark());
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[]');
  expect(firstBookmark().classList.contains('is-saved')).toBe(false);
});

it('does not write bookmarks into a different surah on a prop change', async () => {
  localStorage.setItem('nur_quran_bookmarks_112', '[1]');
  localStorage.setItem('nur_quran_bookmarks_113', '[3]');
  await render();
  await render(113);
  expect(localStorage.getItem('nur_quran_bookmarks_112')).toBe('[1]');
  expect(localStorage.getItem('nur_quran_bookmarks_113')).toBe('[3]');
  expect(host.querySelector('#quran-ayah-113-3 button[aria-label="Ayah speichern"]')?.classList.contains('is-saved')).toBe(true);
});

it.each(['{broken', '{"surahNumber":112,"ayahNumber":5}', '{"surahNumber":115,"ayahNumber":1}'])('preserves invalid previous reading progress %s', async raw => {
  localStorage.setItem('nur_quran_last_read', raw);
  await render();
  await click(host.querySelector('#quran-ayah-112-2') as unknown as HTMLButtonElement);
  expect(localStorage.getItem('nur_quran_last_read')).toBe(raw);
  expect(host.textContent).toContain('Speicherung des Lesefortschritts nicht bestätigt');
});

it.each(['{broken', '[1,115]'])('preserves invalid recent-surah data %s', async raw => {
  localStorage.setItem('nur_quran_recent_surahs', raw);
  await render();
  expect(localStorage.getItem('nur_quran_recent_surahs')).toBe(raw);
  expect(host.textContent).toContain('Speicherung zuletzt geöffneter Suren nicht bestätigt');
});

it('keeps the font change usable but warns when the preference is not saved', async () => {
  await render();
  mockStorage({ setItem: () => {} });
  await click(buttonNamed('Arabische Schrift vergrößern'));
  expect((host.querySelector('.reference-reader-arabic') as HTMLElement).style.fontSize).toBe('36px');
  expect(host.textContent).toContain('Schriftgröße geändert; Speicherung für spätere Sitzungen nicht bestätigt');
  expect(localStorage.getItem('nur_reader_font_size')).toBeNull();
});

it('does not write a marker when its existing value cannot be read', async () => {
  localStorage.setItem('nur_quran_flow_marker_112_arabic-flow', '2');
  await render();
  await setMode();
  const getItem = localStorage.getItem.bind(localStorage);
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  const stored = mockStorage({ getItem: key => { if (key.includes('flow_marker')) throw new Error('Denied'); return getItem(key); }, setItem: write });
  await click(buttonNamed('Lesestelle merken'));
  expect(stored.getItem('nur_quran_flow_marker_112_arabic-flow')).toBe('2');
  expect(write.mock.calls.some(([key]) => key.includes('flow_marker'))).toBe(false);
  expect(host.querySelector('.toast')?.textContent).toContain('nicht gespeichert');
});

it('warns persistently when writing reading progress fails', async () => {
  await render();
  const previous = localStorage.getItem('nur_quran_last_read');
  mockStorage({ setItem: () => { throw new DOMException('Blocked', 'QuotaExceededError'); } });
  await click(host.querySelector('#quran-ayah-112-2') as unknown as HTMLButtonElement);
  expect(localStorage.getItem('nur_quran_last_read')).toBe(previous);
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Speicherung des Lesefortschritts nicht bestätigt');
});

it('writes the selected verse as the confirmed progress', async () => {
  await render();
  await click(host.querySelector('#quran-ayah-112-3') as unknown as HTMLButtonElement);
  expect(JSON.parse(localStorage.getItem('nur_quran_last_read')!)).toMatchObject({ surahNumber: 112, ayahNumber: 3 });
});

it('restores the flow page and records its actual first verse as progress', async () => {
  await render(2);
  await setMode();
  await click(buttonNamed('Nächste Leseseite'));
  const ayahNumber = Number(localStorage.getItem('nur_quran_flow_position_2_arabic-flow'));
  expect(ayahNumber).toBeGreaterThan(1);
  await render(112);
  await render(2);
  expect(host.querySelector('.reference-reader-flow__page strong')?.textContent).toBe('Seite 2');
  expect(JSON.parse(localStorage.getItem('nur_quran_last_read')!)).toMatchObject({ surahNumber: 2, ayahNumber });
});

it('changes the visible page but does not claim persistence if the position write fails', async () => {
  await render(2);
  await setMode();
  mockStorage({ setItem: () => {} });
  await click(buttonNamed('Nächste Leseseite'));
  expect(host.querySelector('.reference-reader-flow__page strong')?.textContent).toBe('Seite 2');
  expect(localStorage.getItem('nur_quran_flow_position_2_arabic-flow')).toBeNull();
  expect(host.textContent).toContain('Speicherung der letzten Leseseite nicht bestätigt');
});

it('does not claim confirmation if the post-write read fails', async () => {
  await render();
  const stored = localStorage;
  let written = false;
  mockStorage({ getItem: key => { if (written && key === 'nur_quran_bookmarks_112') throw new Error('Readback denied'); return stored.getItem(key); }, setItem: (key, value) => { stored.setItem(key, value); if (key === 'nur_quran_bookmarks_112') written = true; } });
  await click(firstBookmark());
  expect(firstBookmark().classList.contains('is-saved')).toBe(false);
  expect(stored.getItem('nur_quran_bookmarks_112')).toBe('[1]');
  expect(host.textContent).toContain('nicht überprüfbar');
});

it('warns about a session-only reader mode without falsely claiming it was stored', async () => {
  await render();
  mockStorage({ setItem: () => {} });
  await setMode();
  expect(host.querySelector('.reference-reader-flow.is-arabic-flow')).not.toBeNull();
  expect(localStorage.getItem('nur_quran_reader_mode')).toBeNull();
  expect(host.textContent).toContain('Leseart geändert; Speicherung für spätere Sitzungen nicht bestätigt');
});
