import { describe, expect, it } from 'vitest';
import { KAABA, calculateBearing, calculateDistance } from './QiblaScreen';

// A wrong qibla points people the wrong way in prayer, so this is checked two
// independent ways: against published bearings for well-known cities, and
// against the compass quadrant each city must fall into. The quadrant checks
// survive a rewrite of the formula and catch the classic mistakes — swapped
// latitude and longitude, a flipped sign, degrees fed in as radians.

const CITIES = {
  berlin: { latitude: 52.5200, longitude: 13.4050 },
  london: { latitude: 51.5074, longitude: -0.1278 },
  newYork: { latitude: 40.7128, longitude: -74.0060 },
  jakarta: { latitude: -6.2088, longitude: 106.8456 },
  capeTown: { latitude: -33.9249, longitude: 18.4241 },
  istanbul: { latitude: 41.0082, longitude: 28.9784 },
};

describe('qibla bearing', () => {
  it('uses the Kaaba as its target', () => {
    expect(KAABA).toEqual({ latitude: 21.4225, longitude: 39.8262 });
  });

  it.each([
    ['Berlin', CITIES.berlin, 136.68],
    ['London', CITIES.london, 118.99],
    ['New York', CITIES.newYork, 58.48],
    ['Jakarta', CITIES.jakarta, 295.15],
    ['Cape Town', CITIES.capeTown, 23.35],
    ['Istanbul', CITIES.istanbul, 151.62],
  ])('matches the published bearing from %s', (_city, origin, expected) => {
    expect(calculateBearing(origin, KAABA)).toBeCloseTo(expected, 1);
  });

  it.each([
    ['Berlin', CITIES.berlin, 90, 180],
    ['London', CITIES.london, 90, 180],
    ['Istanbul', CITIES.istanbul, 90, 180],
    ['New York', CITIES.newYork, 0, 90],
    ['Cape Town', CITIES.capeTown, 0, 90],
    ['Jakarta', CITIES.jakarta, 270, 360],
  ])('points from %s into the quadrant geography demands', (_city, origin, min, max) => {
    const bearing = calculateBearing(origin, KAABA);
    expect(bearing).toBeGreaterThanOrEqual(min);
    expect(bearing).toBeLessThanOrEqual(max);
  });

  it('always returns a bearing inside a single turn', () => {
    for (const origin of Object.values(CITIES)) {
      const bearing = calculateBearing(origin, KAABA);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    }
  });

  it('points due north from straight south of the Kaaba on the same meridian', () => {
    expect(calculateBearing({ latitude: 0, longitude: KAABA.longitude }, KAABA)).toBeCloseTo(0, 6);
  });

  it('points due south from straight north of the Kaaba on the same meridian', () => {
    expect(calculateBearing({ latitude: 60, longitude: KAABA.longitude }, KAABA)).toBeCloseTo(180, 6);
  });
});

describe('distance to the Kaaba', () => {
  it.each([
    ['Berlin', CITIES.berlin, 4130],
    ['London', CITIES.london, 4794],
    ['New York', CITIES.newYork, 10306],
    ['Jakarta', CITIES.jakarta, 7920],
  ])('matches the great-circle distance from %s', (_city, origin, expected) => {
    expect(calculateDistance(origin, KAABA)).toBeCloseTo(expected, -1);
  });

  it('is zero at the Kaaba itself', () => {
    expect(calculateDistance(KAABA, KAABA)).toBeCloseTo(0, 6);
  });

  it('is symmetric', () => {
    expect(calculateDistance(CITIES.berlin, KAABA)).toBeCloseTo(calculateDistance(KAABA, CITIES.berlin), 6);
  });
});
