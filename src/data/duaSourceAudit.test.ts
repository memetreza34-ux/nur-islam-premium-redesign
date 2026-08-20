import { describe, expect, it } from 'vitest';
import { DUAS } from './duaData';
import { DUA_SOURCE_AUDIT } from './duaSourceAudit';

const byId = new Map(DUAS.map((dua) => [dua.id, dua]));

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

  it('keeps corrected references and meanings from regressing', () => {
    expect(byId.get('dua_hardship_4')?.source).toContain('2427');
    expect(byId.get('dua_provision_1')?.source).toContain('2697b');
    expect(byId.get('dua_mosque_enter')?.source).toContain('713a');
    expect(byId.get('dua_mosque_leave')?.source).toContain('713a');
    expect(byId.get('dua_hardship_1')?.source).toContain('918b');

    expect(byId.get('dua_sorrow_1')?.translation).toContain('mit dem Du Dich selbst benannt hast');
    expect(byId.get('dua_morning_1')?.translation).toContain('vor dem Übel dessen, was ich getan habe');
    expect(byId.get('dua_eating_before')?.translation).toBe('Im Namen Allahs.');
    expect(byId.get('dua_eating_before')?.source).toContain('sahih (Al-Albani)');
    expect(byId.get('dua_eating_after')?.source).toContain('hasan (Darussalam)');

    expect(byId.get('dua_bathroom_enter')?.arabic).not.toContain('بِسْمِ اللَّهِ');
    expect(byId.get('dua_bathroom_enter')?.source).toBe('Sahih al-Bukhari 142');
  });
});
