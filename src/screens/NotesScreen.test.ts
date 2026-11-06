import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NotesScreen, readLocalNotes } from './NotesScreen';

vi.mock('../services/nurBackend', () => ({ getSession: async () => null }));
vi.mock('motion/react', async original => ({ ...await original<typeof import('motion/react')>(), useReducedMotion: () => true }));

const key = 'nur_local_notes_v1';
const note = { id: 'local-1', title: 'Meine Notiz', body: 'Gespeicherter Text', created_at: '2026-11-05T10:00:00Z', updated_at: '2026-11-05T10:00:00Z' };
let root: Root;
let host: HTMLDivElement;
let storage: Storage;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  storage = localStorage;
  storage.clear();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

const render = () => act(async () => root.render(createElement(NotesScreen, { onBack() {}, onOpenAccount() {} })));
const click = (button: HTMLButtonElement) => act(async () => button.click());
const namedButton = (name: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.getAttribute('aria-label') === name || button.textContent?.trim() === name)!;
const blockWrites = () => vi.stubGlobal('localStorage', {
  getItem: storage.getItem.bind(storage),
  setItem: () => { throw new Error('QuotaExceededError'); },
});
async function fill(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

it('keeps an unsaved draft in the editor and supports retry after storage recovers', async () => {
  await render();
  await click(namedButton('Neue Notiz schreiben'));
  const input = host.querySelector<HTMLInputElement>('input')!;
  const body = host.querySelector<HTMLTextAreaElement>('textarea')!;
  await fill(input, 'Entwurf');
  await fill(body, 'Dieser Text darf nicht verloren gehen.');
  blockWrites();
  await click(namedButton('Speichern'));
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Nicht gespeichert');
  expect(input.value).toBe('Entwurf');
  expect(body.value).toBe('Dieser Text darf nicht verloren gehen.');
  expect(host.querySelectorAll('.reference-notes-list > button')).toHaveLength(0);
  expect(storage.getItem(key)).toBeNull();
  vi.stubGlobal('localStorage', storage);
  await click(namedButton('Speichern'));
  expect(readLocalNotes()).toHaveLength(1);
  expect(readLocalNotes()[0].body).toBe(body.value);
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Notiz lokal auf diesem Gerät gespeichert.');
});

it('retains the last saved version when editing cannot be persisted', async () => {
  storage.setItem(key, JSON.stringify([note]));
  await render();
  await click(host.querySelector<HTMLButtonElement>('.reference-notes-list > button')!);
  const body = host.querySelector<HTMLTextAreaElement>('textarea')!;
  await fill(body, 'Überarbeiteter Text');
  blockWrites();
  await click(namedButton('Speichern'));
  expect(readLocalNotes()).toEqual([note]);
  expect(body.value).toBe('Überarbeiteter Text');
  expect(host.querySelector('[role="status"]')?.textContent).toContain('Nicht gespeichert');
});

it('keeps the saved note and editor visible when deletion is blocked', async () => {
  storage.setItem(key, JSON.stringify([note]));
  await render();
  await click(host.querySelector<HTMLButtonElement>('.reference-notes-list > button')!);
  blockWrites();
  await click(namedButton('Notiz löschen'));
  expect(readLocalNotes()).toEqual([note]);
  expect(host.querySelectorAll('.reference-notes-list > button')).toHaveLength(1);
  expect(host.querySelector('textarea')).not.toBeNull();
  expect(host.querySelector('[role="status"]')?.textContent).toContain('konnte nicht gelöscht werden');
  vi.stubGlobal('localStorage', storage);
  await click(namedButton('Notiz löschen'));
  expect(readLocalNotes()).toEqual([]);
  expect(host.querySelector('textarea')).toBeNull();
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Notiz gelöscht.');
});
