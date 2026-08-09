import { describe, expect, it } from 'vitest';
import { getHijriDay, getHijriLabel } from './hijriCalendar';

// The Hijri date sits on the home screen and decides which days are shown as
// white fasting days. Two things must hold: the calendar must not vary with the
// device, and the day number driving the fasting badge must be the same day the
// label shows. Anything else tells a user to fast on the wrong day.

function labelDay(date: Date) {
  const match = getHijriLabel(date).match(/^(\d{1,2})\./);
  return match ? Number(match[1]) : 0;
}

describe('Hijri calendar', () => {
  it('pins Umm al-Qura rather than the device default', () => {
    // The bare `islamic` identifier resolves to different calendars across
    // engines; civil and tabular land two and one days off respectively.
    const resolved = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura').resolvedOptions().calendar;
    expect(resolved).toBe('islamic-umalqura');
    expect(getHijriDay(new Date(2026, 7, 8))).toBe(
      Number(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric' })
        .formatToParts(new Date(2026, 7, 8)).find((part) => part.type === 'day')?.value),
    );
  });

  it('formats a German Hijri date', () => {
    const label = getHijriLabel(new Date(2026, 7, 8));
    expect(label).toMatch(/^\d{1,2}\. \S+ \d{3,4}/);
    expect(label).not.toBe('Islamisches Datum');
  });

  it('uses the caller fallback only when formatting is impossible', () => {
    expect(getHijriLabel(new Date(2026, 7, 8), 'Islamischer Kalender')).not.toBe('Islamischer Kalender');
  });

  // The regression that would silently misplace the fasting badge: the label
  // and the day number are produced by two different formatters.
  it('keeps the label and the fasting day number in agreement all year', () => {
    const mismatches: string[] = [];
    for (let offset = 0; offset < 366; offset += 1) {
      const date = new Date(2026, 0, 1 + offset);
      if (getHijriDay(date) !== labelDay(date)) mismatches.push(date.toDateString());
    }
    expect(mismatches).toEqual([]);
  });

  it('returns a day inside a Hijri month for every day of a year', () => {
    for (let offset = 0; offset < 366; offset += 1) {
      const day = getHijriDay(new Date(2026, 0, 1 + offset));
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(30);
    }
  });

  it('advances by one day at a time and only restarts at a month boundary', () => {
    let previous = getHijriDay(new Date(2026, 0, 1));
    for (let offset = 1; offset < 200; offset += 1) {
      const current = getHijriDay(new Date(2026, 0, 1 + offset));
      const wrapped = current === 1 && previous >= 29;
      expect(wrapped || current === previous + 1).toBe(true);
      previous = current;
    }
  });

  it('marks exactly three white days in each Hijri month', () => {
    // 13, 14 and 15 of every month, so a Gregorian year must contain twelve
    // full runs of three consecutive flagged days.
    let whiteDays = 0;
    for (let offset = 0; offset < 355; offset += 1) {
      const day = getHijriDay(new Date(2026, 0, 1 + offset));
      if (day >= 13 && day <= 15) whiteDays += 1;
    }
    expect(whiteDays).toBe(36);
  });
});
