import type { BeginnerReviewRecord } from './beginnerReview';

/**
 * P0 religious content outside the beginner curriculum that still needs a
 * qualified release review before it may be treated as public v1 content.
 */
export const CORE_CONTENT_REVIEW_RECORDS: BeginnerReviewRecord[] = [
  { contentId: 'names-of-allah', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'dhikr-counter-steps', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
];
