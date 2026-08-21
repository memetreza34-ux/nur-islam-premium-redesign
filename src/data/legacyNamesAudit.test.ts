import { describe, expect, it } from 'vitest';
import { LEGACY_NAMES_AUDIT, LEGACY_NAMES_MAPPED, LEGACY_NAMES_QUARANTINED } from './legacyNamesAudit';

describe('legacy Names quarantine', () => {
  it('accounts for every old 99-list row exactly once', () => {
    expect(LEGACY_NAMES_AUDIT).toHaveLength(99);
    expect(new Set(LEGACY_NAMES_AUDIT.map((entry) => entry.id)).size).toBe(99);
    expect(LEGACY_NAMES_MAPPED).toHaveLength(31);
    expect(LEGACY_NAMES_QUARANTINED).toHaveLength(68);
    expect(LEGACY_NAMES_MAPPED.length + LEGACY_NAMES_QUARANTINED.length).toBe(99);
  });

  it('never treats a quarantined legacy row as public-ready', () => {
    for (const entry of LEGACY_NAMES_QUARANTINED) {
      expect(entry.status).toBe('legacy-quarantined');
    }
  });
});
