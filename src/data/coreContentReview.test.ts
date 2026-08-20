import { describe, expect, it } from 'vitest';
import { CORE_CONTENT_REVIEW_RECORDS } from './coreContentReview';

describe('core religious content review ledger', () => {
  it('keeps core review ids unique', () => {
    const ids = CORE_CONTENT_REVIEW_RECORDS.map((record) => record.contentId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
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
