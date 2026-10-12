import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SplashScreen } from './SplashScreen';
import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META, setFollowingPrayerDay } from '../services/prayerSchedule';

let root: Root;
let host: HTMLDivElement;
const originalMeta = { ...PRAYER_SCHEDULE_META };
const originalSchedule = PRAYER_SCHEDULE.map(item => ({ ...item }));
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-10T14:00:00+02:00'));
  vi.stubGlobal('fetch', vi.fn());
  Object.assign(PRAYER_SCHEDULE_META, { dateKey: '2026-10-10', source: 'live', timezone: 'Europe/Berlin' });
  PRAYER_SCHEDULE.forEach((item, index) => { item.time = ['05:00', '07:00', '13:00', '16:00', '18:00', '20:00'][index]; });
  setFollowingPrayerDay(null);
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  Object.keys(PRAYER_SCHEDULE_META).forEach(key => { delete PRAYER_SCHEDULE_META[key as keyof typeof PRAYER_SCHEDULE_META]; });
  Object.assign(PRAYER_SCHEDULE_META, originalMeta);
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...originalSchedule.map(item => ({ ...item })));
  setFollowingPrayerDay(null);
  vi.useRealTimers();
});
it('shows the real next obligatory prayer and local Ayah without fetching', async () => {
  await act(async () => root.render(createElement(SplashScreen)));
  expect(host.querySelector('[data-testid="splash-prayer"]')?.textContent).toContain('Asr16:00');
  expect(host.querySelector('[data-testid="splash-ayah"]')?.textContent).toContain('Quran');
  expect(host.querySelector('.reference-splash__mark')).toBeNull();
  expect(host.querySelector('[data-testid="splash-ayah"] img')).toBeNull();
  expect(host.querySelector('.reference-splash__arabic')?.getAttribute('lang')).toBe('ar');
  expect(fetch).not.toHaveBeenCalled();
});
it.each([
  ['04:00', 'fajr'], ['08:00', 'dhuhr'], ['14:00', 'asr'], ['17:00', 'maghrib'], ['19:00', 'isha'],
])('maps %s to the existing %s prayer landscape', async (time, prayer) => {
  vi.setSystemTime(new Date(`2026-10-10T${time}:00+02:00`));
  await act(async () => root.render(createElement(SplashScreen)));
  expect(host.querySelector('.reference-splash__prayer-art img')?.getAttribute('src')).toContain(`prayer-${prayer}-v1.webp`);
});
it.each(['fallback', 'stale'] as const)('does not invent a time with %s data', async state => {
  if (state === 'fallback') PRAYER_SCHEDULE_META.source = 'fallback';
  else PRAYER_SCHEDULE_META.dateKey = '2026-10-09';
  await act(async () => root.render(createElement(SplashScreen)));
  expect(host.querySelector('[data-testid="splash-prayer"]')?.textContent).toContain('noch nicht verfügbar');
  expect(host.querySelector('.reference-splash__time')).toBeNull();
  expect(host.querySelector('.reference-splash__prayer-art')).toBeNull();
});
it('refreshes when shared times update and labels cached data', async () => {
  PRAYER_SCHEDULE_META.source = 'fallback';
  await act(async () => root.render(createElement(SplashScreen)));
  await act(async () => {
    PRAYER_SCHEDULE_META.source = 'cache';
    window.dispatchEvent(new Event('nur:prayer-times-updated'));
  });
  expect(host.textContent).toContain('Asr16:00');
  expect(host.textContent).toContain('Gespeicherte Gebetszeiten');
});
it('only shows tomorrow after a verified following timetable is available', async () => {
  vi.setSystemTime(new Date('2026-10-10T23:00:00+02:00'));
  await act(async () => root.render(createElement(SplashScreen)));
  expect(host.querySelector('.reference-splash__time')).toBeNull();
  await act(async () => {
    setFollowingPrayerDay({ schedule: PRAYER_SCHEDULE.map(item => ({ ...item })), meta: { ...PRAYER_SCHEDULE_META, dateKey: '2026-10-11' } });
    window.dispatchEvent(new Event('nur:prayer-times-updated'));
  });
  expect(host.textContent).toContain('Nächstes Gebet · morgen');
  expect(host.textContent).toContain('Fajr05:00');
  expect(host.querySelector('.reference-splash__prayer-art img')?.getAttribute('src')).toContain('prayer-fajr-v1.webp');
});
