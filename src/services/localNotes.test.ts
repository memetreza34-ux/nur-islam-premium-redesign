import { beforeEach, describe, expect, it } from 'vitest';
import { noteSignature, readLocalNotes, writeLocalNotes } from '../screens/NotesScreen';

// Notes are the only place a user writes their own text, so losing one is the
// worst data loss in the app. Two mechanisms decide that: the reader, which
// filters what it accepts, and the signature, which decides during the import
// into the cloud whether a local note is "already there" and can be dropped.

const LOCAL_KEY = 'nur_local_notes_v1';
const NOTE = {
  id: 'local-1',
  title: 'Dua für die Familie',
  body: 'Nach dem Maghrib lesen.',
  created_at: '2026-08-08T10:00:00.000Z',
  updated_at: '2026-08-08T10:00:00.000Z',
};

function store(value: unknown) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(value));
}

describe('local notes storage', () => {
  beforeEach(() => localStorage.clear());

  it('reads a well-formed note back unchanged', () => {
    store([NOTE]);
    expect(readLocalNotes()).toEqual([NOTE]);
  });

  it('accepts an empty title and an empty body, which are valid notes', () => {
    store([{ ...NOTE, title: '', body: '' }]);
    expect(readLocalNotes()).toHaveLength(1);
  });

  it('rejects entries missing a field or carrying an unparseable date', () => {
    store([
      NOTE,
      { ...NOTE, id: 2 },
      { ...NOTE, title: null },
      { ...NOTE, body: undefined },
      { ...NOTE, created_at: 'irgendwann' },
      { ...NOTE, updated_at: '' },
      null,
      'note',
    ]);
    expect(readLocalNotes()).toEqual([NOTE]);
  });

  it('survives corrupted storage', () => {
    localStorage.setItem(LOCAL_KEY, '{not json');
    expect(readLocalNotes()).toEqual([]);
    store('not an array');
    expect(readLocalNotes()).toEqual([]);
  });

  // Unlike the calendar reader, this one must not repair storage in place: a
  // note it cannot parse is still the user's writing, and overwriting the file
  // would throw the text away instead of leaving it recoverable.
  it('leaves unreadable notes in storage rather than deleting them', () => {
    const raw = [NOTE, { ...NOTE, id: 'local-2', created_at: 'kaputt' }];
    store(raw);
    readLocalNotes();
    expect(JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')).toEqual(raw);
  });

  it('round-trips through a write', () => {
    writeLocalNotes([NOTE]);
    expect(readLocalNotes()).toEqual([NOTE]);
  });
});

describe('note signature used to skip duplicates on cloud import', () => {
  it('treats the same note as already present regardless of title case or padding', () => {
    expect(noteSignature('  Dua Für Die Familie  ', 'Text'))
      .toBe(noteSignature('dua für die familie', 'Text'));
  });

  it('ignores surrounding whitespace in the body', () => {
    expect(noteSignature('Titel', '  Text  ')).toBe(noteSignature('Titel', 'Text'));
  });

  // Everything below must stay distinct, because a colliding signature means a
  // local note is silently discarded instead of being imported.
  it('keeps notes with different bodies apart', () => {
    expect(noteSignature('Titel', 'Erster Text')).not.toBe(noteSignature('Titel', 'Zweiter Text'));
  });

  it('keeps notes with different titles apart', () => {
    expect(noteSignature('Erster', 'Text')).not.toBe(noteSignature('Zweiter', 'Text'));
  });

  it('does not let a title bleed into a body', () => {
    // Without a separator, "ab" + "c" and "a" + "bc" would collide.
    expect(noteSignature('ab', 'c')).not.toBe(noteSignature('a', 'bc'));
  });

  it('keeps an empty note apart from a note that only has a title', () => {
    expect(noteSignature('', '')).not.toBe(noteSignature('Titel', ''));
  });

  it('preserves case inside the body, which is the user’s own wording', () => {
    expect(noteSignature('Titel', 'Allah')).not.toBe(noteSignature('Titel', 'allah'));
  });
});
