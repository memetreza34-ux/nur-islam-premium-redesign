import { describe, expect, it } from 'vitest';
import { prayerTimesFeedback } from './prayerTimesFeedback';

describe('prayer result messages', () => {
  it('only reports success for a fresh validated response', () => {
    expect(prayerTimesFeedback('live', 'Zeiten geladen')).toBe('Zeiten geladen');
  });
  it('distinguishes a cached day from unavailable times', () => {
    expect(prayerTimesFeedback('cache', 'Zeiten geladen')).toBe('Gespeicherter Tagesstand wird verwendet');
    const unavailable = prayerTimesFeedback('fallback', 'Zeiten geladen');
    expect(unavailable).toContain('Keine bestätigten Gebetszeiten');
    expect(unavailable).not.toContain('Gespeichert');
  });
  it('does not describe denied location permission as a successful fetch', () => {
    expect(prayerTimesFeedback('location-denied', 'Zeiten geladen')).toBe('Standort wurde nicht freigegeben');
  });
  it('does not issue feedback for an obsolete request', () => {
    expect(prayerTimesFeedback('ignored', 'Zeiten geladen')).toBeNull();
  });
});
