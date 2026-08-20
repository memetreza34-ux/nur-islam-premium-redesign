import type { BeginnerReviewRecord } from './beginnerReview';

/**
 * P0 religious content outside the beginner curriculum that still needs a
 * qualified release review before it may be treated as public v1 content.
 */
export const CORE_CONTENT_REVIEW_RECORDS: BeginnerReviewRecord[] = [
  { contentId: 'quran-offline-bundle', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'quran-beginner-guide', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-reference', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'purity-basics', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'names-of-allah', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'dhikr-counter-steps', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'dhikr-routines', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'duas', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'daily-hadith-rotation', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'worship-guides', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'prayer-rakat-sequence', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
];
