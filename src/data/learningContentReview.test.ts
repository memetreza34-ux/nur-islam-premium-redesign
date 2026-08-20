import { describe, expect, it } from 'vitest';
import { LEARNING_LESSONS } from './islamicLearningContent';
import { LEARNING_CONTENT_REVIEW_RECORDS } from './learningContentReview';

describe('deeper learning review ledger', () => {
  it('covers all 18 visible learning lessons exactly once', () => {
    const lessonIds = LEARNING_LESSONS.map((lesson) => lesson.id).sort();
    const reviewIds = LEARNING_CONTENT_REVIEW_RECORDS.map((record) => record.contentId).sort();

    expect(LEARNING_LESSONS).toHaveLength(18);
    expect(LEARNING_CONTENT_REVIEW_RECORDS).toHaveLength(18);
    expect(new Set(reviewIds).size).toBe(reviewIds.length);
    expect(reviewIds).toEqual(lessonIds);
  });

  it('does not fabricate approval metadata for pending lessons', () => {
    for (const record of LEARNING_CONTENT_REVIEW_RECORDS) {
      expect(record.status).toBe('pending');
      expect(record.reviewer).toBeNull();
      expect(record.reviewedAt).toBeNull();
      expect(record.evidence).toBeNull();
    }
  });
});
