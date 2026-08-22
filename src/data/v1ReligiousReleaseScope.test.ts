import { describe, expect, it } from 'vitest';
import { BEGINNER_REVIEW_RECORDS } from './beginnerReview';
import { CORE_CONTENT_REVIEW_RECORDS } from './coreContentReview';
import { LEARNING_CONTENT_REVIEW_RECORDS } from './learningContentReview';
import { V1_RELIGIOUS_RELEASE_SCOPE } from './v1ReligiousReleaseScope';

describe('v1 religious release scope', () => {
  it('has one review record for every required release block', () => {
    const scopeIds = V1_RELIGIOUS_RELEASE_SCOPE.map((item) => item.contentId).sort();
    const reviewIds = [
      ...BEGINNER_REVIEW_RECORDS,
      ...LEARNING_CONTENT_REVIEW_RECORDS,
      ...CORE_CONTENT_REVIEW_RECORDS,
    ]
      .map((record) => record.contentId)
      .sort();

    // 10 beginner lessons + 18 learning units + 14 core content areas. The
    // count is pinned so a block cannot quietly leave the release gate.
    const byGroup = (group: string) => V1_RELIGIOUS_RELEASE_SCOPE.filter((item) => item.group === group).length;
    expect(byGroup('beginner')).toBe(10);
    expect(byGroup('learning')).toBe(18);
    expect(byGroup('core')).toBe(14);
    expect(V1_RELIGIOUS_RELEASE_SCOPE).toHaveLength(42);
    expect(new Set(scopeIds).size).toBe(scopeIds.length);
    expect(new Set(reviewIds).size).toBe(reviewIds.length);
    expect(reviewIds).toEqual(scopeIds);
  });

  it('keeps every release-scope label non-empty', () => {
    for (const item of V1_RELIGIOUS_RELEASE_SCOPE) {
      expect(item.contentId.trim()).not.toBe('');
      expect(item.label.trim()).not.toBe('');
    }
  });
});
