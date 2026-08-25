import { ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE } from './additionalNamesOfAllahEvidence';
import { NAMES_OF_ALLAH } from './namesOfAllahData';
import { VERIFIED_NAMES_OF_ALLAH } from './verifiedNamesOfAllahData';

export type LegacyNameAuditStatus = 'individually-source-audited' | 'needs-individual-source-review';

const individuallySourcedLegacyIds = new Set<number>([
  ...VERIFIED_NAMES_OF_ALLAH
    .map((name) => name.legacyId)
    .filter((id): id is number => id !== null),
  ...ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE.map((entry) => entry.legacyId),
]);

/**
 * Audit view of the complete 99-name learning list.
 *
 * This is a review ledger, not a visibility rule. All 99 names stay in the app.
 *
 * `individually-source-audited` means a concrete Quran passage or strong sahih
 * hadith has been documented for the individual designation strongly enough to
 * pass the conservative source-audit threshold. It is NOT a human scholarly
 * approval flag.
 *
 * `needs-individual-source-review` means the fixed list-form is still awaiting
 * stronger individual evidence or a transparent decision about an attribute /
 * grammatical derivation. It is not a claim that the entry is false and it is
 * never an instruction to hide or delete it.
 */
export const LEGACY_NAMES_AUDIT = NAMES_OF_ALLAH.map((name) => ({
  id: name.id,
  latin: name.latin,
  status: individuallySourcedLegacyIds.has(name.id)
    ? 'individually-source-audited' as const
    : 'needs-individual-source-review' as const,
}));

export const LEGACY_NAMES_NEEDING_SOURCE_REVIEW = LEGACY_NAMES_AUDIT.filter(
  (entry) => entry.status === 'needs-individual-source-review',
);
export const LEGACY_NAMES_MAPPED = LEGACY_NAMES_AUDIT.filter(
  (entry) => entry.status === 'individually-source-audited',
);
