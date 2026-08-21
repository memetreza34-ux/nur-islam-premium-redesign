import { beforeEach, describe, expect, it } from 'vitest';
import { getHijriDay, getHijriMonth } from './hijriCalendar';
import { buildRollingFastingReminders } from './fastingReminderService';

function atNoon(date: Date) {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value;
}

function addDays(date: Date, days: number) {
  const value = atNoon(date);
  value.setDate(value.getDate() + days);
  return value;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function findHijriDate(month: number, day: number) {
  const cursor = new Date(2026, 0, 1, 12);
  for (let offset = 0; offset < 800; offset += 1) {
    const candidate = addDays(cursor, offset);
    if (getHijriMonth(candidate) === month && getHijriDay(candidate) === day) return candidate;
  }
  throw new Error(`Could not resolve Hijri ${month}/${day} in test window.`);
}

describe('fasting reminder religious safety', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('nur_fasting_reminders', 'true');
  });

  it('never creates a voluntary fasting reminder for 13 Dhu al-Hijjah even though it is a white day', () => {
    const target = findHijriDate(12, 13);
    const now = addDays(target, -5);
    const reminderDate = dateKey(addDays(target, -1));

    const reminders = buildRollingFastingReminders(now);

    expect(reminders.some((entry) => entry.date === reminderDate)).toBe(false);
  });

  it('never creates a voluntary fasting reminder for Eid al-Fitr', () => {
    const target = findHijriDate(10, 1);
    const now = addDays(target, -5);
    const reminderDate = dateKey(addDays(target, -1));

    const reminders = buildRollingFastingReminders(now);

    expect(reminders.some((entry) => entry.date === reminderDate)).toBe(false);
  });

  it('still creates ordinary Monday or Thursday suggestions outside prohibited days', () => {
    const start = new Date(2026, 0, 1, 12);
    const reminders = buildRollingFastingReminders(start);

    expect(reminders.some((entry) => entry.title.includes('Montag') || entry.title.includes('Donnerstag'))).toBe(true);
  });
});
