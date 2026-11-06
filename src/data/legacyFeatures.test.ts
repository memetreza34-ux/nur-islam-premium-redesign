import { describe, expect, it } from 'vitest';
import { learningLegacyFeatures, serviceLegacyFeatures } from './legacyFeatures';

describe('Active feature destinations', () => {
  it('keeps unique destinations and excludes the removed quiz', () => {
    const ids = [...learningLegacyFeatures, ...serviceLegacyFeatures].map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('quiz');
  });
});
