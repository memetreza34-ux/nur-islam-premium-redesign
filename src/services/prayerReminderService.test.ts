import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PRAYER_SCHEDULE } from './prayerSchedule';
import { startPrayerReminderScheduler } from './prayerReminderService';
import type { PrayerReminderDetail } from './prayerReminderService';

const originalSchedule = PRAYER_SCHEDULE.map((prayer) => ({ ...prayer }));

function scheduleDhuhrMinutesAgo(minutes: number) {
  const when = new Date(Date.now() - minutes * 60_000);
  const time = `${String(when.getHours()).padStart(2, '0')}:${String(when.getMinutes()).padStart(2, '0')}`;
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, {
    id: 'dhuhr',
    label: 'Dhuhr',
    compactLabel: 'Dhuhr',
    arabic: 'الظهر',
    time,
    description: 'Mittagsgebet',
    obligatory: true,
    visual: 'sun',
  });
}

async function collectRemindersAfterStart() {
  const fired: PrayerReminderDetail[] = [];
  const listener = (event: Event) => fired.push((event as CustomEvent<PrayerReminderDetail>).detail);
  window.addEventListener('nur:prayer-reminder-fired', listener);

  const stop = startPrayerReminderScheduler();
  // The scheduler checks immediately; let its async notification path settle.
  await new Promise((resolve) => setTimeout(resolve, 0));
  stop();

  window.removeEventListener('nur:prayer-reminder-fired', listener);
  return fired;
}

describe('prayer reminders', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('nur_prayer_notifications', JSON.stringify(['dhuhr']));
  });

  afterEach(() => {
    PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...originalSchedule.map((prayer) => ({ ...prayer })));
  });

  it('fires for a prayer that just started', async () => {
    scheduleDhuhrMinutesAgo(0);
    expect((await collectRemindersAfterStart()).map((detail) => detail.prayerId)).toEqual(['dhuhr']);
  });

  // A background tab gets its timers throttled to a minute or worse, so the
  // scheduler can wake up minutes late. It must still deliver the reminder.
  it('still fires when a throttled timer wakes up four minutes late', async () => {
    scheduleDhuhrMinutesAgo(4);
    expect((await collectRemindersAfterStart()).map((detail) => detail.prayerId)).toEqual(['dhuhr']);
  });

  it('does not fire once the catch-up window has passed', async () => {
    scheduleDhuhrMinutesAgo(20);
    expect(await collectRemindersAfterStart()).toEqual([]);
  });

  it('does not fire before the prayer time', async () => {
    scheduleDhuhrMinutesAgo(-5);
    expect(await collectRemindersAfterStart()).toEqual([]);
  });

  it('fires only once per prayer and day', async () => {
    scheduleDhuhrMinutesAgo(2);
    expect(await collectRemindersAfterStart()).toHaveLength(1);
    expect(await collectRemindersAfterStart()).toHaveLength(0);
  });

  it('stays silent for prayers the user has not enabled', async () => {
    localStorage.setItem('nur_prayer_notifications', JSON.stringify([]));
    scheduleDhuhrMinutesAgo(1);
    expect(await collectRemindersAfterStart()).toEqual([]);
  });
});
