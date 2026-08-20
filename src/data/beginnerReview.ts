export type BeginnerReviewStatus = 'pending' | 'approved';

export type BeginnerReviewRecord = {
  contentId: string;
  status: BeginnerReviewStatus;
  reviewer: string | null;
  reviewedAt: string | null;
  evidence: string | null;
};

/**
 * Release approval is intentionally stored separately from lesson copy.
 * A content edit must never inherit an old approval by accident.
 */
export const BEGINNER_REVIEW_RECORDS: BeginnerReviewRecord[] = [
  { contentId: 'beginner-islam', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-allah', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-shahada', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-prophet', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-quran-sunnah', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-five-pillars', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-six-beliefs', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-purity', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-prayer', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
  { contentId: 'beginner-next-steps', status: 'pending', reviewer: null, reviewedAt: null, evidence: null },
];

export function getBeginnerReviewRecord(contentId: string) {
  return BEGINNER_REVIEW_RECORDS.find((record) => record.contentId === contentId) ?? null;
}

export function isBeginnerContentApproved(contentId: string) {
  return getBeginnerReviewRecord(contentId)?.status === 'approved';
}
