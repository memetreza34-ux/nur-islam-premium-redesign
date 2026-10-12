import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NAMES_OF_ALLAH } from '../data/namesOfAllahData';
import { getNameSourceEvidence, getRelatedNameSourceContext } from '../data/nameSourceEvidence';
import { NamesScreen } from './NamesScreen';

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

const renderNames = async () => act(async () => root.render(createElement(NamesScreen, { onBack() {} })));
const favoriteButton = (id: number) => host.querySelectorAll<HTMLButtonElement>('.reference-name-heart')[id - 1];
const learnedButton = (id: number) => host.querySelectorAll<HTMLButtonElement>('.reference-name-state')[id - 1];
const mockStorage = (overrides: Partial<Pick<Storage, 'getItem' | 'setItem'>>) => {
  const stored = localStorage;
  vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: stored.setItem.bind(stored), ...overrides });
  return stored;
};

it('keeps read selections when writes fail and makes temporary changes explicit', async () => {
  localStorage.setItem('nur_name_favorites', '["48","65"]');
  localStorage.setItem('nur_name_learned', '["63"]');
  const write = vi.fn(() => { throw new Error('quota'); });
  mockStorage({ setItem: write });
  await renderNames();
  expect(write).not.toHaveBeenCalled();
  expect(favoriteButton(48).getAttribute('aria-pressed')).toBe('true');
  expect(favoriteButton(65).getAttribute('aria-pressed')).toBe('true');
  expect(learnedButton(63).getAttribute('aria-pressed')).toBe('true');
  await act(async () => favoriteButton(1).click());
  expect(host.querySelector('[role=status]')?.textContent).toContain('nicht dauerhaft gespeichert');
  expect(localStorage.getItem('nur_name_favorites')).toBe('["48","65"]');
  expect(favoriteButton(48).getAttribute('aria-pressed')).toBe('true');
});

it('does not overwrite corrupt selections or show their unknown learning progress as zero', async () => {
  localStorage.setItem('nur_name_favorites', '{broken');
  localStorage.setItem('nur_name_learned', '{}');
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  mockStorage({ setItem: write });
  await renderNames();
  await act(async () => { favoriteButton(1).click(); learnedButton(2).click(); });
  expect(write).not.toHaveBeenCalled();
  expect(localStorage.getItem('nur_name_favorites')).toBe('{broken');
  expect(localStorage.getItem('nur_name_learned')).toBe('{}');
  expect(host.querySelector('.reference-name-progress')?.textContent).toContain('Kein bestätigter Lernstand');
  expect(host.textContent).toContain('nicht überschrieben');
});

it('blocks writes after a read failure rather than replacing unknown saved data', async () => {
  const read = vi.fn<Storage['getItem']>(() => { throw new Error('denied'); });
  const write = vi.fn(localStorage.setItem.bind(localStorage));
  const stored = mockStorage({ getItem: read, setItem: write });
  await renderNames();
  read.mockImplementation(stored.getItem.bind(stored));
  await act(async () => favoriteButton(1).click());
  expect(write).not.toHaveBeenCalled();
  expect(host.textContent).toContain('konnten nicht gelesen werden');
});

it('retains ambiguous legacy labels and both distinct Majid IDs on an explicit update', async () => {
  localStorage.setItem('nur_name_favorites', '["Al-Majid","Al-Hayy","48","65","unknown"]');
  await renderNames();
  expect(host.textContent).toContain('nicht eindeutig zuordenbar');
  expect(favoriteButton(62).getAttribute('aria-pressed')).toBe('true');
  await act(async () => favoriteButton(1).click());
  expect(JSON.parse(localStorage.getItem('nur_name_favorites')!)).toEqual(['62', '48', '65', '1', 'Al-Majid', 'unknown']);
  expect(favoriteButton(48).getAttribute('aria-pressed')).toBe('true');
  expect(favoriteButton(65).getAttribute('aria-pressed')).toBe('true');
});

it('does not invent a Majid selection from a legacy label shared by two names', async () => {
  localStorage.setItem('nur_name_favorites', '["Al-Majid"]');
  await renderNames();
  expect(favoriteButton(48).getAttribute('aria-pressed')).toBe('false');
  expect(favoriteButton(65).getAttribute('aria-pressed')).toBe('false');
  expect(localStorage.getItem('nur_name_favorites')).toBe('["Al-Majid"]');
});

it('detects a silent write failure and protects changes made in another view', async () => {
  await renderNames();
  const write = vi.fn(() => {});
  const stored = mockStorage({ setItem: write });
  await act(async () => favoriteButton(1).click());
  expect(host.textContent).toContain('nicht dauerhaft gespeichert');
  stored.setItem('nur_name_favorites', '["2"]');
  await act(async () => favoriteButton(3).click());
  expect(localStorage.getItem('nur_name_favorites')).toBe('["2"]');
  expect(host.textContent).toContain('haben sich geändert');
});

it('persists learning updates, restores them and preserves intentionally empty favorites', async () => {
  localStorage.setItem('nur_name_favorites', '[]');
  await renderNames();
  expect(host.textContent).toContain('Favoriten · 0');
  await act(async () => learnedButton(63).click());
  expect(localStorage.getItem('nur_name_learned')).toBe('["63"]');
  await act(async () => root.render(createElement(NamesScreen, { key: 'remount', onBack() {} })));
  expect(learnedButton(63).getAttribute('aria-pressed')).toBe('true');
  expect(localStorage.getItem('nur_name_favorites')).toBe('[]');
});

it.each([0, 11, 22, 33, 44, 55, 66, 77, 88])('renders every name and its source boundary without hiding the unresolved forms (offset %s)', async (offset) => {
  expect(NAMES_OF_ALLAH).toHaveLength(99);
  for (const name of NAMES_OF_ALLAH.slice(offset, offset + 11)) {
    await act(async () => root.render(createElement(NamesScreen, { key: name.id, onBack() {}, initialNameId: String(name.id) })));
    expect(host.querySelectorAll('.reference-name-list__main')).toHaveLength(99);
    const dialog = host.querySelector('.reference-name-modal')!;
    expect(dialog.textContent).toContain(name.arabic);
    expect(dialog.textContent).toContain(name.meaning);
    expect(dialog.textContent).toContain('Umschrift ist eine angenäherte Lesehilfe');
    const evidence = getNameSourceEvidence(name.id);
    const related = getRelatedNameSourceContext(name.id);
    expect([...dialog.querySelectorAll('a')].map(link => link.href)).toEqual(evidence?.links.map(link => link.url) ?? (related ? [related.url] : []));
    if (evidence) expect(dialog.textContent).toContain(evidence.note);
    else expect(dialog.textContent).toContain('keine direkte Einzelfundstelle dokumentiert');
    if (related) {
      expect(dialog.textContent).toContain('kein direkter Namensbeleg');
      expect(dialog.textContent).toContain(related.note);
      expect(dialog.textContent).not.toContain('Dokumentierte Fundstelle:');
    }
    for (const link of dialog.querySelectorAll('a')) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noreferrer');
    }
  }
});

it('qualifies the enumeration with the exact collection and named grading publisher', async () => {
  await act(async () => root.render(createElement(NamesScreen, { onBack() {} })));
  const text = host.querySelector('.reference-names-hero')!.textContent;
  expect(text).toContain('zählen sie aber nicht einzeln auf');
  expect(text).toContain('Darussalam als Daʿif');
  expect(text).toContain('at-Tirmidhi bezeichnet den Bericht als Gharib');
  expect([...host.querySelectorAll('.reference-names-hero a')].map(link => link.getAttribute('href'))).toEqual([
    'https://sunnah.com/bukhari:7392', 'https://sunnah.com/muslim:2677a', 'https://sunnah.com/tirmidhi:3507',
  ]);
});
