import { describe, expect, it } from 'vitest';
import { PRAYER_SCHEDULE } from '../services/prayerSchedule';
import { getCurrentPrayerScene, getPrayerBackdrop, PRAYER_BACKDROPS, type PrayerBackdropId } from './prayerBackdrops';

const times = ['04:10', '06:00', '13:10', '17:00', '20:10', '22:10'];
const schedule = PRAYER_SCHEDULE.map((item, index) => ({ ...item, time: times[index] }));
const at = (time: string) => new Date(`2026-08-27T${time}:00+02:00`);

describe('prayer landscape mapping', () => {
  it('has one distinct image per obligatory prayer', () => {
    expect(Object.keys(PRAYER_BACKDROPS)).toEqual(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']);
    expect(new Set(Object.values(PRAYER_BACKDROPS)).size).toBe(5);
    for (const prayer of PRAYER_SCHEDULE.filter((item) => item.obligatory)) {
      expect(getPrayerBackdrop(prayer.id as PrayerBackdropId)).toContain(`prayer-${prayer.id}-v1.webp`);
    }
  });

  it('does not invent a scene for missing data or timezone', () => {
    expect(getPrayerBackdrop()).toBeUndefined();
    expect(getCurrentPrayerScene(at('12:00'), schedule)).toBeUndefined();
    expect(getCurrentPrayerScene(at('12:00'), schedule, 'invalid')).toBeUndefined();
    expect(getCurrentPrayerScene(at('12:00'), [], 'Europe/Berlin')).toBeUndefined();
    expect(getCurrentPrayerScene(new Date('invalid'), schedule, 'Europe/Berlin')).toBeUndefined();
  });

  it.each([
    ['00:00', 'isha'], ['04:09', 'isha'], ['04:10', 'fajr'], ['05:59', 'fajr'],
    ['06:00', 'dhuhr'], ['13:10', 'dhuhr'], ['16:59', 'dhuhr'], ['17:00', 'asr'],
    ['20:09', 'asr'], ['20:10', 'maghrib'], ['22:09', 'maghrib'], ['22:10', 'isha'], ['23:59', 'isha'],
  ])('%s shows the current %s mood', (time, expected) => {
    expect(getCurrentPrayerScene(at(time), schedule, 'Europe/Berlin')).toBe(expected);
  });

  it('uses the selected timezone instead of the device timezone', () => {
    const instant = new Date('2026-08-27T16:30:00Z');
    expect(getCurrentPrayerScene(instant, schedule, 'Europe/Berlin')).toBe('asr');
    expect(getCurrentPrayerScene(instant, schedule, 'America/New_York')).toBe('dhuhr');
    expect(getCurrentPrayerScene(new Date('2026-01-15T16:30:00Z'), schedule, 'Europe/Berlin')).toBe('asr');
  });

  it('handles Isha after midnight', () => {
    const lateIsha = schedule.map((item) => item.id === 'isha' ? { ...item, time: '00:30' } : item);
    expect(getCurrentPrayerScene(at('00:29'), lateIsha, 'Europe/Berlin')).toBe('maghrib');
    expect(getCurrentPrayerScene(at('00:30'), lateIsha, 'Europe/Berlin')).toBe('isha');
    expect(getCurrentPrayerScene(at('04:10'), lateIsha, 'Europe/Berlin')).toBe('fajr');
  });

  it('rejects incomplete or unordered boundaries without mutating the timetable', () => {
    const before = structuredClone(schedule);
    for (const id of ['fajr', 'sunrise', 'asr', 'maghrib', 'isha']) {
      const incomplete = schedule.map((item) => item.id === id ? { ...item, time: '—:—' } : item);
      expect(getCurrentPrayerScene(at('12:00'), incomplete, 'Europe/Berlin')).toBeUndefined();
    }
    const unordered = schedule.map((item) => item.id === 'sunrise' ? { ...item, time: '22:00' } : item);
    expect(getCurrentPrayerScene(at('12:00'), unordered, 'Europe/Berlin')).toBeUndefined();
    expect(schedule).toEqual(before);
  });
});
