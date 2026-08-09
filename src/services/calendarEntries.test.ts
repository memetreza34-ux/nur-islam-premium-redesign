import { beforeEach, describe, expect, it } from 'vitest';
import { readCalendarEntries, writeCalendarEntries } from './calendarReminderService';
import {
  buildRollingFastingReminders,
  isManagedFastingReminder,
  syncRollingFastingReminders,
} from './fastingReminderService';

// Generated fasting reminders live in the same store as the appointments the
// user typed in themselves. The store also rewrites itself while reading. So
// the thing to protect is simple: a user's own entries must survive every
// sync, every rewrite and every piece of junk in storage.

const STORAGE_KEY = 'nur_calendar_entries';
const OWN_ENTRY = { id: 1, date: '2026-08-20', title: 'Termin in der Moschee', time: '18:30', reminder: true };

function store(value: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function enableFasting(time = '20:00') {
  localStorage.setItem('nur_fasting_reminders', 'true');
  localStorage.setItem('nur_fasting_reminder_time', JSON.stringify(time));
}

describe('calendar entries', () => {
  beforeEach(() => localStorage.clear());

  it('reads back a valid entry unchanged', () => {
    store([OWN_ENTRY]);
    expect(readCalendarEntries()).toEqual([OWN_ENTRY]);
  });

  it('drops entries with an impossible date or time rather than showing them', () => {
    store([
      OWN_ENTRY,
      { ...OWN_ENTRY, id: 2, date: '2026-02-30' },
      { ...OWN_ENTRY, id: 3, date: 'irgendwann' },
      { ...OWN_ENTRY, id: 4, time: '25:00' },
      { ...OWN_ENTRY, id: 5, time: 'abends' },
      { ...OWN_ENTRY, id: 6, title: '' },
    ]);
    expect(readCalendarEntries()).toEqual([OWN_ENTRY]);
  });

  it('survives corrupted storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(readCalendarEntries()).toEqual([]);
    store('not an array');
    expect(readCalendarEntries()).toEqual([]);
    store([null, 42, 'x', {}]);
    expect(readCalendarEntries()).toEqual([]);
  });

  it('repairs storage in place so the same junk is not re-parsed forever', () => {
    store([OWN_ENTRY, { id: 2, date: 'kaputt', title: 'x', time: '10:00', reminder: false }]);
    readCalendarEntries();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([OWN_ENTRY]);
  });

  it('refuses to persist an invalid entry', () => {
    writeCalendarEntries([OWN_ENTRY, { ...OWN_ENTRY, id: 2, time: '99:99' }]);
    expect(readCalendarEntries()).toEqual([OWN_ENTRY]);
  });
});

describe('rolling fasting reminders', () => {
  beforeEach(() => localStorage.clear());

  it('generates nothing while the feature is off', () => {
    expect(buildRollingFastingReminders()).toEqual([]);
  });

  it('only proposes Mondays, Thursdays and white days', () => {
    enableFasting();
    for (const reminder of buildRollingFastingReminders()) {
      expect(reminder.title).toMatch(/Montag|Donnerstag|Hijri-Tag/);
    }
  });

  it('reminds on the evening before the fasting day, not on the day itself', () => {
    enableFasting();
    const reminders = buildRollingFastingReminders(new Date(2026, 7, 8));
    expect(reminders.length).toBeGreaterThan(0);

    for (const reminder of reminders) {
      expect(reminder.time).toBe('20:00');
      expect(reminder.reminder).toBe(true);

      // The day after the reminder is the day being fasted, so it has to be
      // the weekday the title names. Reminding on the fasting day itself would
      // reach the user long after the pre-dawn meal.
      const [year, month, day] = reminder.date.split('-').map(Number);
      const fastingDay = new Date(year, month - 1, day + 1);
      if (reminder.title.includes('Montag')) expect(fastingDay.getDay()).toBe(1);
      if (reminder.title.includes('Donnerstag')) expect(fastingDay.getDay()).toBe(4);
      // A reminder is never for a day already past.
      expect(fastingDay.getTime()).toBeGreaterThan(new Date(2026, 7, 8).getTime());
    }
  });

  it('marks every generated entry as managed and leaves user ids alone', () => {
    enableFasting();
    for (const reminder of buildRollingFastingReminders()) {
      expect(isManagedFastingReminder(reminder)).toBe(true);
    }
    expect(isManagedFastingReminder(OWN_ENTRY)).toBe(false);
  });

  it('keeps the user’s own appointments when syncing', () => {
    store([OWN_ENTRY]);
    enableFasting();

    syncRollingFastingReminders();

    const entries = readCalendarEntries();
    expect(entries).toContainEqual(OWN_ENTRY);
    expect(entries.length).toBeGreaterThan(1);
  });

  it('does not pile up duplicates when synced repeatedly', () => {
    store([OWN_ENTRY]);
    enableFasting();

    syncRollingFastingReminders();
    const afterFirst = readCalendarEntries();
    syncRollingFastingReminders();
    syncRollingFastingReminders();

    expect(readCalendarEntries()).toEqual(afterFirst);
  });

  it('withdraws its own entries when the feature is switched off, keeping the user’s', () => {
    store([OWN_ENTRY]);
    enableFasting();
    syncRollingFastingReminders();
    expect(readCalendarEntries().length).toBeGreaterThan(1);

    localStorage.setItem('nur_fasting_reminders', 'false');
    syncRollingFastingReminders();

    expect(readCalendarEntries()).toEqual([OWN_ENTRY]);
  });

  it('follows a changed reminder time', () => {
    enableFasting('05:15');
    const reminders = buildRollingFastingReminders();
    expect(reminders.length).toBeGreaterThan(0);
    for (const reminder of reminders) expect(reminder.time).toBe('05:15');
  });

  it('falls back to a sane time when the stored one is nonsense', () => {
    localStorage.setItem('nur_fasting_reminders', 'true');
    localStorage.setItem('nur_fasting_reminder_time', JSON.stringify('99:99'));
    for (const reminder of buildRollingFastingReminders()) expect(reminder.time).toBe('20:00');
  });
});
