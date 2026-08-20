import { describe, expect, it } from 'vitest';
import { CORE_CONTENT_REVIEW_RECORDS } from './coreContentReview';

describe('core religious content review ledger', () => {
  it('tracks the remaining p0 source-review gaps', () => {
    expect(CORE_CONTENT_REVIEW_RECORDS.map((record) => record.contentId).sort()).toEqual([
      'dhikr-counter-steps',
      'names-of-allah',
      'prayer-rakat-sequence',
      'worship-guides',
    ]);
  });

  it('requires complete metadata once a record is approved', () => {
    for (const record of CORE_CONTENT_REVIEW_RECORDS) {
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
