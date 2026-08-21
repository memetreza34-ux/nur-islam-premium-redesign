import { NAMES_OF_ALLAH } from './namesOfAllahData';
import { VERIFIED_NAMES_OF_ALLAH } from './verifiedNamesOfAllahData';

export type LegacyNameAuditStatus = 'mapped-to-quran-sourced-public-entry' | 'legacy-quarantined';

const verifiedLegacyIds = new Set(
  VERIFIED_NAMES_OF_ALLAH
    .map((name) => name.legacyId)
    .filter((id): id is number => id !== null),
);

/**
 * Audit view of the old fixed 99-name learning list.
 *
 * `mapped-to-quran-sourced-public-entry` means that this legacy row has a
 * corresponding entry in the new public set with an explicit Quran citation.
 * `legacy-quarantined` does NOT mean the wording is necessarily false; it means
 * Nur Islam has not yet established and reviewed that individual row strongly
 * enough to expose it as public v1 religious content.
 */
export const LEGACY_NAMES_AUDIT = NAMES_OF_ALLAH.map((name) => ({
  id: name.id,
  latin: name.latin,
  status: verifiedLegacyIds.has(name.id)
    ? 'mapped-to-quran-sourced-public-entry' as const
    : 'legacy-quarantined' as const,
}));

export const LEGACY_NAMES_QUARANTINED = LEGACY_NAMES_AUDIT.filter((entry) => entry.status === 'legacy-quarantined');
export const LEGACY_NAMES_MAPPED = LEGACY_NAMES_AUDIT.filter((entry) => entry.status === 'mapped-to-quran-sourced-public-entry');
