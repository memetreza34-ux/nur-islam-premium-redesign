import { beforeEach, describe, expect, it } from 'vitest';
import { readDhikrDailyState, readDhikrTotalToday } from './dhikrDailyState';

const today = new Date(2026, 8, 23, 12);

describe('shared Dhikr daily state', () => {
  beforeEach(() => localStorage.clear());

  it('shows only valid counts for the selected day and caps them at their targets', () => {
    localStorage.setItem('nur_dhikr_daily_v2', JSON.stringify({
      date: '2026-09-23',
      counts: {
        'after-prayer:subhanallah': 999,
        'after-prayer:alhamdulillah': 2.9,
        'after-prayer:tahlil-completion': 1,
        'unknown:item': 10,
        'after-prayer:allahu-akbar': -4,
      },
    }));

    expect(readDhikrDailyState(today).counts).toEqual({
      'after-prayer:subhanallah': 33,
      'after-prayer:alhamdulillah': 2,
      'after-prayer:tahlil-completion': 1,
    });
    expect(readDhikrTotalToday(today)).toBe(36);
  });

  it('does not show a prior day or malformed storage as today’s progress', () => {
    localStorage.setItem('nur_dhikr_daily_v2', JSON.stringify({ date: '2026-09-22', counts: { 'after-prayer:subhanallah': 20 } }));
    expect(readDhikrTotalToday(today)).toBe(0);
    localStorage.setItem('nur_dhikr_daily_v2', '{invalid');
    expect(readDhikrTotalToday(today)).toBe(0);
  });
});
