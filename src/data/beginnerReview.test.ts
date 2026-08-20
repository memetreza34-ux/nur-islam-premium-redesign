import { describe, expect, it } from 'vitest';
import { BEGINNER_LESSONS } from './beginnerLearningContent';
import { BEGINNER_REVIEW_RECORDS } from './beginnerReview';

describe('beginner content review ledger', () => {
  it('covers every P0 beginner lesson exactly once', () => {
    const lessonIds = BEGINNER_LESSONS.map((lesson) => lesson.id).sort();
    const reviewIds = BEGINNER_REVIEW_RECORDS.map((record) => record.contentId).sort();

    expect(new Set(reviewIds).size).toBe(reviewIds.length);
    expect(reviewIds).toEqual(lessonIds);
  });

  it('keeps pending and approved metadata internally consistent', () => {
    for (const record of BEGINNER_REVIEW_RECORDS) {
      if (record.status === 'pending') {
        expect(record.reviewer).toBeNull();
        expect(record.reviewedAt).toBeNull();
        expect(record.evidence).toBeNull();
        continue;
      }

      expect(record.reviewer?.trim().length).toBeGreaterThan(0);
      expect(record.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.evidence?.trim().length).toBeGreaterThan(0);
    }
  });
});
