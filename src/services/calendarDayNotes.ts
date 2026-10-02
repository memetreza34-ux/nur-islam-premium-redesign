export type CalendarDayNote = {
  id: string;
  date: string;
  text: string;
};

const STORAGE_KEY = 'nur_calendar_day_notes_v1';
const MAX_TEXT_LENGTH = 1000;
export const CALENDAR_DAY_NOTES_CHANGED_EVENT = 'nur:calendar-day-notes-changed';

function isValidLocalDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= daysInMonth[month - 1];
}

function normalizeNote(value: unknown): CalendarDayNote | null {
  if (!value || typeof value !== 'object') return null;
  const note = value as Partial<CalendarDayNote>;
  if (Object.keys(note).some((key) => !['id', 'date', 'text'].includes(key))) return null;
  if (typeof note.id !== 'string' || typeof note.date !== 'string' || typeof note.text !== 'string') return null;

  const id = note.id.trim();
  const text = note.text.trim();
  if (!id || !isValidLocalDateKey(note.date) || !text || text.length > MAX_TEXT_LENGTH) return null;
  return { id, date: note.date, text };
}

function parseStoredNotes(raw: string | null): { notes: CalendarDayNote[]; valid: boolean } {
  if (raw === null) return { notes: [], valid: true };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { notes: [], valid: false };
    const notes: CalendarDayNote[] = [];
    const seenIds = new Set<string>();
    let valid = true;
    for (const value of parsed) {
      const note = normalizeNote(value);
      if (!note || seenIds.has(note.id)) {
        valid = false;
        continue;
      }
      notes.push(note);
      seenIds.add(note.id);
    }
    return { notes, valid };
  } catch {
    return { notes: [], valid: false };
  }
}

export function readCalendarDayNotes(): CalendarDayNote[] {
  try {
    return parseStoredNotes(localStorage.getItem(STORAGE_KEY)).notes;
  } catch {
    return [];
  }
}

export function getCalendarDayNotesSnapshot(): { notes: CalendarDayNote[]; raw: string | null } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = parseStoredNotes(raw);
    return parsed.valid ? { notes: parsed.notes, raw } : null;
  } catch {
    return null;
  }
}

export function writeCalendarDayNotes(notes: CalendarDayNote[], expectedRaw?: string | null): boolean {
  if (!Array.isArray(notes)) return false;

  const normalized: CalendarDayNote[] = [];
  const seenIds = new Set<string>();
  for (const value of notes) {
    const note = normalizeNote(value);
    if (!note || seenIds.has(note.id)) return false;
    normalized.push(note);
    seenIds.add(note.id);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!parseStoredNotes(raw).valid || (expectedRaw !== undefined && raw !== expectedRaw)) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    return false;
  }

  if (typeof window !== 'undefined' && typeof Event === 'function') {
    window.dispatchEvent(new Event(CALENDAR_DAY_NOTES_CHANGED_EVENT));
  }
  return true;
}
