import { describe, expect, it } from 'vitest';
import { DUAS } from './duaData';
import { DUA_SOURCE_AUDIT } from './duaSourceAudit';

describe('dua source audit', () => {
  it('covers every dua exactly once', () => {
    const duaIds = DUAS.map((dua) => dua.id).sort();
    const auditIds = DUA_SOURCE_AUDIT.map((record) => record.duaId).sort();

    expect(DUAS).toHaveLength(34);
    expect(DUA_SOURCE_AUDIT).toHaveLength(34);
    expect(new Set(auditIds).size).toBe(auditIds.length);
    expect(auditIds).toEqual(duaIds);
  });

  it('keeps every audit record traceable', () => {
    for (const record of DUA_SOURCE_AUDIT) {
      expect(record.evidence.trim()).not.toBe('');
      expect(record.note.trim()).not.toBe('');
      expect(['primary-checked', 'secondary-authentication-checked']).toContain(record.status);
    }
  });
});
