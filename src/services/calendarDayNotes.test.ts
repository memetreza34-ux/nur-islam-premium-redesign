import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readCalendarEntries } from './calendarReminderService';
import { CALENDAR_DAY_NOTES_CHANGED_EVENT, getCalendarDayNotesSnapshot, readCalendarDayNotes, writeCalendarDayNotes } from './calendarDayNotes';
import type { CalendarDayNote } from './calendarDayNotes';

const NOTES_KEY = 'nur_calendar_day_notes_v1';
const ENTRIES_KEY = 'nur_calendar_entries';
const NOTE: CalendarDayNote = { id: 'note-1', date: '2026-10-01', text: 'Dua für die Familie' };

describe('calendar day notes', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('round-trips multiple notes on the same day and trims their text', () => {
    const second = { id: 'note-2', date: NOTE.date, text: 'Moschee besuchen' };
    expect(writeCalendarDayNotes([{ ...NOTE, text: `  ${NOTE.text}  ` }, second])).toBe(true);
    expect(readCalendarDayNotes()).toEqual([NOTE, second]);
    expect(JSON.parse(localStorage.getItem(NOTES_KEY) ?? '[]')).toEqual([NOTE, second]);
  });

  it('filters invalid stored notes without overwriting the original data', () => {
    const raw = JSON.stringify([
      NOTE,
      { ...NOTE, id: 'note-2', date: '2026-02-30' },
      { ...NOTE, id: 'note-3', text: ' '.repeat(3) },
      { ...NOTE, id: 'note-4', text: 'x'.repeat(1001) },
      { ...NOTE, id: 'note-5', text: 42 },
      { ...NOTE, id: NOTE.id, text: 'Doppelte ID' },
    ]);
    localStorage.setItem(NOTES_KEY, raw);

    expect(readCalendarDayNotes()).toEqual([NOTE]);
    expect(localStorage.getItem(NOTES_KEY)).toBe(raw);
    expect(getCalendarDayNotesSnapshot()).toBeNull();
    expect(writeCalendarDayNotes([NOTE])).toBe(false);
    expect(localStorage.getItem(NOTES_KEY)).toBe(raw);
  });

  it('returns an empty list for broken JSON and keeps the raw value recoverable', () => {
    localStorage.setItem(NOTES_KEY, '{kaputt');
    expect(readCalendarDayNotes()).toEqual([]);
    expect(localStorage.getItem(NOTES_KEY)).toBe('{kaputt');
    expect(writeCalendarDayNotes([NOTE])).toBe(false);
    expect(localStorage.getItem(NOTES_KEY)).toBe('{kaputt');
  });

  it('does not replace a newer snapshot from another tab', () => {
    const snapshot = getCalendarDayNotesSnapshot();
    expect(snapshot).toEqual({ notes: [], raw: null });
    expect(writeCalendarDayNotes([NOTE])).toBe(true);
    expect(writeCalendarDayNotes([{ ...NOTE, text: 'Veralteter Entwurf' }], snapshot?.raw)).toBe(false);
    expect(readCalendarDayNotes()).toEqual([NOTE]);
  });

  it('validates local calendar dates, including leap years and month boundaries', () => {
    expect(writeCalendarDayNotes([{ ...NOTE, date: '2024-02-29' }])).toBe(true);
    expect(readCalendarDayNotes()[0]?.date).toBe('2024-02-29');

    const validRaw = localStorage.getItem(NOTES_KEY);
    for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-01-00', '2026-1-01', '2026-01-01T00:00:00Z']) {
      expect(writeCalendarDayNotes([{ ...NOTE, date }])).toBe(false);
      expect(localStorage.getItem(NOTES_KEY)).toBe(validRaw);
    }
  });

  it('rejects an invalid batch and preserves existing notes', () => {
    expect(writeCalendarDayNotes([NOTE])).toBe(true);
    const original = localStorage.getItem(NOTES_KEY);

    expect(writeCalendarDayNotes([NOTE, { ...NOTE, id: 'note-2', text: 'x'.repeat(1001) }])).toBe(false);
    expect(writeCalendarDayNotes([NOTE, { ...NOTE, text: 'Noch eine Notiz' }])).toBe(false);
    expect(writeCalendarDayNotes(null as unknown as CalendarDayNote[])).toBe(false);
    expect(localStorage.getItem(NOTES_KEY)).toBe(original);
  });

  it('returns false when browser storage rejects the write', () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error('Storage unavailable'); } };
    vi.stubGlobal('localStorage', storage);
    expect(writeCalendarDayNotes([NOTE])).toBe(false);
  });

  it('announces only successful writes so open calendars can refresh', () => {
    const listener = vi.fn();
    window.addEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, listener);
    try {
      expect(writeCalendarDayNotes([NOTE])).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(writeCalendarDayNotes([{ ...NOTE, text: '' }])).toBe(false);
      expect(listener).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(CALENDAR_DAY_NOTES_CHANGED_EVENT, listener);
    }
  });

  it('leaves existing calendar appointments untouched', () => {
    const entry = { id: 1, date: NOTE.date, title: 'Termin in der Moschee', time: '18:30', reminder: true };
    const raw = JSON.stringify([entry]);
    localStorage.setItem(ENTRIES_KEY, raw);

    expect(writeCalendarDayNotes([NOTE])).toBe(true);
    expect(localStorage.getItem(ENTRIES_KEY)).toBe(raw);
    expect(readCalendarEntries()).toEqual([entry]);
  });
});
