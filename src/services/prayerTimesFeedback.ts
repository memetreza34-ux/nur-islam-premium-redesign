export function prayerTimesFeedback(result: 'live' | 'cache' | 'fallback' | 'location-denied' | 'ignored', liveMessage: string) {
  if (result === 'ignored') return null;
  if (result === 'live') return liveMessage;
  if (result === 'cache') return 'Gespeicherter Tagesstand wird verwendet';
  if (result === 'location-denied') return 'Standort wurde nicht freigegeben';
  return 'Keine bestätigten Gebetszeiten verfügbar – bitte erneut laden';
}
