import { afterEach, describe, expect, it } from 'vitest';
import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from './prayerSchedule';
import { getEffectiveIslamicDay, readTrustedMaghribTime, resolveIslamicDay } from './islamicDay';
import { getHijriDay } from './hijriCalendar';

const originalSchedule = PRAYER_SCHEDULE.map((prayer) => ({ ...prayer }));
const originalMeta = { ...PRAYER_SCHEDULE_META };

function restore() {
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...originalSchedule.map((prayer) => ({ ...prayer })));
  for (const key of Object.keys(PRAYER_SCHEDULE_META)) delete (PRAYER_SCHEDULE_META as Record<string, unknown>)[key];
  Object.assign(PRAYER_SCHEDULE_META, originalMeta);
}

function useSharedSchedule(maghrib: string, sourceLabel = 'Live via AlAdhan') {
  Object.assign(PRAYER_SCHEDULE_META, { sourceLabel });
  const entry = PRAYER_SCHEDULE.find((prayer) => prayer.id === 'maghrib');
  if (entry) entry.time = maghrib;
}

const dayOf = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

describe('effective Islamic day', () => {
  afterEach(restore);

  it('stays on the calendar day up to the minute before Maghrib', () => {
    const result = resolveIslamicDay(new Date(2026, 5, 10, 20, 11), '20:12');
    expect(result.afterMaghrib).toBe(false);
    expect(dayOf(result.date)).toBe('2026-6-10');
  });

  // The day turns at Maghrib itself, not a minute later: a night that begins
  // exactly then must already count as the new Islamic day.
  it('turns exactly at Maghrib', () => {
    const result = resolveIslamicDay(new Date(2026, 5, 10, 20, 12), '20:12');
    expect(result.afterMaghrib).toBe(true);
    expect(dayOf(result.date)).toBe('2026-6-11');
  });

  it('stays on the new Islamic day for the rest of the evening', () => {
    const result = resolveIslamicDay(new Date(2026, 5, 10, 23, 59), '20:12');
    expect(result.afterMaghrib).toBe(true);
    expect(dayOf(result.date)).toBe('2026-6-11');
  });

  // Midnight is not a boundary for this calendar. Just after it the Gregorian
  // date has moved on by itself, and the Islamic day must not advance twice.
  it('does not advance a second time at midnight', () => {
    const evening = resolveIslamicDay(new Date(2026, 5, 10, 22, 0), '20:12');
    const afterMidnight = resolveIslamicDay(new Date(2026, 5, 11, 0, 30), '20:14');
    expect(dayOf(evening.date)).toBe('2026-6-11');
    expect(dayOf(afterMidnight.date)).toBe('2026-6-11');
    expect(afterMidnight.afterMaghrib).toBe(false);
  });

  it('gives one continuous Islamic day across a whole evening and night', () => {
    const times = [
      new Date(2026, 5, 10, 20, 12),
      new Date(2026, 5, 10, 21, 30),
      new Date(2026, 5, 11, 3, 0),
      new Date(2026, 5, 11, 12, 0),
      new Date(2026, 5, 11, 20, 12),
    ];
    const days = times.map((time, index) => dayOf(resolveIslamicDay(time, index === 4 ? '20:13' : '20:12').date));
    expect(days).toEqual(['2026-6-11', '2026-6-11', '2026-6-11', '2026-6-11', '2026-6-11']);
  });

  // The switch days are 23 and 25 hours long. The result is fixed at local
  // noon so the shift cannot push the converted date onto a neighbouring day.
  it('crosses the daylight-saving switch days without skipping or repeating', () => {
    const springForward = resolveIslamicDay(new Date(2026, 2, 28, 21, 0), '19:30');
    expect(dayOf(springForward.date)).toBe('2026-3-29');
    expect(springForward.date.getHours()).toBe(12);

    const fallBack = resolveIslamicDay(new Date(2026, 9, 24, 19, 0), '18:15');
    expect(dayOf(fallBack.date)).toBe('2026-10-25');
    expect(fallBack.date.getHours()).toBe(12);
  });

  it('advances the Hijri day too, not only the Gregorian one', () => {
    const before = resolveIslamicDay(new Date(2026, 5, 10, 20, 11), '20:12');
    const after = resolveIslamicDay(new Date(2026, 5, 10, 20, 12), '20:12');
    const step = getHijriDay(after.date) - getHijriDay(before.date);
    // Either the next day of the month, or the first day of the next month.
    expect(step === 1 || getHijriDay(after.date) === 1).toBe(true);
  });

  it('crosses a month end onto the first of the next Hijri month', () => {
    // Walk a year to find an evening whose Hijri month actually rolls over,
    // rather than hardcoding a date that a calendar update could move.
    let crossings = 0;
    for (let offset = 0; offset < 365; offset += 1) {
      const day = new Date(2026, 0, 1 + offset, 20, 0);
      const before = resolveIslamicDay(day, '20:01');
      const after = resolveIslamicDay(day, '19:59');
      if (getHijriDay(after.date) === 1 && getHijriDay(before.date) > 1) crossings += 1;
    }
    expect(crossings).toBeGreaterThanOrEqual(11);
  });

  describe('without a trusted Maghrib time', () => {
    // A guessed sunset would move a religious date by a whole day. Saying "not
    // known" is the only honest answer, and the callers can say so too.
    it('falls back to the calendar day and reports that it did', () => {
      const result = resolveIslamicDay(new Date(2026, 5, 10, 23, 0), null);
      expect(result.resolution).toBe('unknown-maghrib');
      expect(result.afterMaghrib).toBe(false);
      expect(result.maghrib).toBeNull();
      expect(dayOf(result.date)).toBe('2026-6-10');
    });

    it('treats a placeholder time as no time at all', () => {
      expect(resolveIslamicDay(new Date(2026, 5, 10, 23, 0), '—:—').resolution).toBe('unknown-maghrib');
      expect(resolveIslamicDay(new Date(2026, 5, 10, 23, 0), '').resolution).toBe('unknown-maghrib');
      expect(resolveIslamicDay(new Date(2026, 5, 10, 23, 0), '25:00').resolution).toBe('unknown-maghrib');
    });
  });

  describe('reading the shared schedule', () => {
    it('uses the shared Maghrib once the times are trusted', () => {
      useSharedSchedule('20:12');
      expect(readTrustedMaghribTime()).toBe('20:12');
      expect(getEffectiveIslamicDay(new Date(2026, 5, 10, 21, 0)).afterMaghrib).toBe(true);
    });

    it('refuses the bundled fallback schedule', () => {
      useSharedSchedule('20:12', 'Offline-Ersatzzeitplan');
      expect(readTrustedMaghribTime()).toBeNull();
      expect(getEffectiveIslamicDay(new Date(2026, 5, 10, 21, 0)).resolution).toBe('unknown-maghrib');
    });

    it('refuses a trusted source that still carries no Maghrib value', () => {
      useSharedSchedule('—:—');
      expect(readTrustedMaghribTime()).toBeNull();
    });
  });
});
