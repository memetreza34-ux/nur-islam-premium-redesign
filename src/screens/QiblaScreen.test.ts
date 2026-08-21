import { describe, expect, it } from 'vitest';
import { KAABA, calculateBearing, calculateDistance } from './QiblaScreen';

describe('Qibla great-circle calculations', () => {
  it('matches stable reference bearings for distant cities', () => {
    expect(calculateBearing({ latitude: 52.52, longitude: 13.405 }, KAABA)).toBeCloseTo(136.685, 2);
    expect(calculateBearing({ latitude: 51.5074, longitude: -0.1278 }, KAABA)).toBeCloseTo(118.987, 2);
    expect(calculateBearing({ latitude: 40.7128, longitude: -74.006 }, KAABA)).toBeCloseTo(58.482, 2);
    expect(calculateBearing({ latitude: -6.2088, longitude: 106.8456 }, KAABA)).toBeCloseTo(295.152, 2);
  });

  it('returns plausible great-circle distances to the Kaaba', () => {
    expect(calculateDistance({ latitude: 52.52, longitude: 13.405 }, KAABA)).toBeCloseTo(4130.2, 0);
    expect(calculateDistance({ latitude: 51.5074, longitude: -0.1278 }, KAABA)).toBeCloseTo(4793.8, 0);
    expect(calculateDistance(KAABA, KAABA)).toBeCloseTo(0, 8);
  });

  it('keeps every bearing normalized to 0–360 degrees', () => {
    for (const point of [
      { latitude: 80, longitude: -170 },
      { latitude: -80, longitude: 170 },
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 179 },
    ]) {
      const value = calculateBearing(point, KAABA);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(360);
    }
  });
});
