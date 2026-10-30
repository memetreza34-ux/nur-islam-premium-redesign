import { describe, expect, it } from 'vitest';
import { getCalendarEvent } from './calendarViewModel';
import { getHijriMonth, getHijriDay } from './hijriCalendar';

describe('calendar religious scope', () => {
  it('never calls Ramadan fasting voluntary, including ordinary weekdays and white days', () => {
    let seen = 0;
    for (let offset = 0; offset < 740; offset++) {
      const date = new Date(2026, 0, 1 + offset, 12);
      if (getHijriMonth(date) !== 9) continue;
      const event = getCalendarEvent(date);
      expect(event?.fastingKind).toBe('ramadan');
      expect(event?.sourceUrl).toMatch(/^https:\/\//);
      expect(event?.practice).not.toContain('Freiwilliges');
      seen++;
    }
    expect(seen).toBeGreaterThanOrEqual(58);
  });

  it('keeps voluntary reminders out of Eid and Tashriq while explaining the pilgrim exception', () => {
    let seen = 0;
    for (let offset = 0; offset < 740; offset++) {
      const date = new Date(2026, 0, 1 + offset, 12);
      const month = getHijriMonth(date), day = getHijriDay(date);
      if (!(month === 10 && day === 1) && !(month === 12 && day >= 10 && day <= 13)) continue;
      const event = getCalendarEvent(date);
      expect(event?.fasting).toBe(false);
      if (day >= 11 && month === 12) expect(event?.practice).toContain('Ausnahme');
      seen++;
    }
    expect(seen).toBeGreaterThanOrEqual(10);
  });
});
