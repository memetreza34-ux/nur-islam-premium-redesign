import { describe, expect, it } from 'vitest';
import { learningLegacyFeatures, quizFeature, serviceLegacyFeatures } from './legacyFeatures';

describe('Start quiz destination', () => {
  it('resolves its own title instead of falling back to the Hadith collection', () => {
    const destinations = [...learningLegacyFeatures, ...serviceLegacyFeatures, quizFeature];
    const quiz = destinations.find(({ id }) => id === 'quiz');
    expect(quiz?.title).toBe('Islam Quiz');
    expect(quiz?.subtitle).toBe('Wissen testen');
    expect(quiz?.description).toContain('Fragen und Erklärungen');
  });

  it('does not add a duplicate entry to the learning or services directory', () => {
    expect([...learningLegacyFeatures, ...serviceLegacyFeatures].some(({ id }) => id === 'quiz')).toBe(false);
  });
});
