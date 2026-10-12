const timings = { Fajr: '05:00', Sunrise: '07:00', Dhuhr: '13:00', Asr: '16:00', Maghrib: '18:00', Isha: '20:00' };

// Synthetic test data, not a religious timetable or a live API check.
export function prayerDayFixture(date: string, times: Record<string, string> = timings) {
  return {
    timings: times,
    date: { gregorian: { date } },
    meta: { latitude: 52.52, longitude: 13.41, timezone: 'Europe/Berlin', method: { id: 13, name: 'Test fixture' }, school: 'STANDARD' },
  };
}

export function prayerRequestFixture(url: string, times: Record<string, string> = timings) {
  const date = new URL(url).pathname.match(/\/timings\/(\d{2}-\d{2}-\d{4})$/)?.[1];
  if (!date) throw new Error(`Unexpected prayer fixture endpoint: ${url}`);
  return { code: 200, data: prayerDayFixture(date, times) };
}
