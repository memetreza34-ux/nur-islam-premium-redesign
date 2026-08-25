export type AdditionalNameEvidence = {
  legacyId: number;
  evidenceKind: 'quran' | 'sahih-hadith';
  source: string;
  sourceNote: string;
  auditStatus: 'source-audited-green';
};

/**
 * Individually sourced additions discovered during the strict V1 Names audit.
 *
 * These entries extend the older Quran-only audit subset without replacing the
 * public 99-name learning list. A row appears here only where the cited Quran
 * passage or sahih hadith directly attributes the relevant designation/form to
 * Allah strongly enough for the conservative source-audit threshold.
 *
 * This is evidence metadata, NOT a human scholarly `approved` flag.
 */
export const ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE: readonly AdditionalNameEvidence[] = [
  { legacyId: 14, evidenceKind: 'quran', source: 'Quran 39:5', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Ghaffar.', auditStatus: 'source-audited-green' },
  { legacyId: 15, evidenceKind: 'quran', source: 'Quran 39:4', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Qahhar.', auditStatus: 'source-audited-green' },
  { legacyId: 16, evidenceKind: 'quran', source: 'Quran 3:8', sourceNote: 'Die Dua-Anrede bezeichnet Allah direkt als Al-Wahhab.', auditStatus: 'source-audited-green' },
  { legacyId: 20, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 3451', sourceNote: 'Die Überlieferung nennt Allah ausdrücklich Al-Qabid; Einstufung: Sahih (Al-Albani).', auditStatus: 'source-audited-green' },
  { legacyId: 21, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 3451', sourceNote: 'Die Überlieferung nennt Allah ausdrücklich Al-Basit; Einstufung: Sahih (Al-Albani).', auditStatus: 'source-audited-green' },
  { legacyId: 28, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 4955', sourceNote: 'Die Überlieferung sagt ausdrücklich: Allah ist Al-Hakam; Einstufung: Sahih (Al-Albani).', auditStatus: 'source-audited-green' },
  { legacyId: 30, evidenceKind: 'quran', source: 'Quran 6:103', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Latif und Al-Khabir.', auditStatus: 'source-audited-green' },
  { legacyId: 32, evidenceKind: 'quran', source: 'Quran 2:225', sourceNote: 'Der Vers bezeichnet Allah direkt als Halim.', auditStatus: 'source-audited-green' },
  { legacyId: 35, evidenceKind: 'quran', source: 'Quran 35:30', sourceNote: 'Der Kontext bezeichnet Allah direkt als Shakur.', auditStatus: 'source-audited-green' },

  { legacyId: 37, evidenceKind: 'quran', source: 'Quran 22:62', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Kabir.', auditStatus: 'source-audited-green' },
  { legacyId: 38, evidenceKind: 'quran', source: 'Quran 11:57', sourceNote: 'Der Vers bezeichnet den Herrn direkt als Hafiz über alle Dinge.', auditStatus: 'source-audited-green' },
  { legacyId: 39, evidenceKind: 'quran', source: 'Quran 4:85', sourceNote: 'Der Vers bezeichnet Allah direkt als Muqit über alle Dinge.', auditStatus: 'source-audited-green' },
  { legacyId: 40, evidenceKind: 'quran', source: 'Quran 4:6', sourceNote: 'Der Vers bezeichnet Allah direkt als Hasib.', auditStatus: 'source-audited-green' },
  { legacyId: 42, evidenceKind: 'quran', source: 'Quran 82:6', sourceNote: 'Der Vers bezeichnet den Herrn direkt als Al-Karim.', auditStatus: 'source-audited-green' },
  { legacyId: 43, evidenceKind: 'quran', source: 'Quran 4:1', sourceNote: 'Der Vers bezeichnet Allah direkt als Raqib über euch.', auditStatus: 'source-audited-green' },
  { legacyId: 44, evidenceKind: 'quran', source: 'Quran 11:61', sourceNote: 'Der Vers bezeichnet den Herrn direkt als nahe und Mujib.', auditStatus: 'source-audited-green' },
  { legacyId: 45, evidenceKind: 'quran', source: 'Quran 2:115', sourceNote: 'Der Vers bezeichnet Allah direkt als Wasi und Alim.', auditStatus: 'source-audited-green' },
  { legacyId: 48, evidenceKind: 'quran', source: 'Quran 11:73', sourceNote: 'Der Kontext bezeichnet Allah direkt als Hamid und Majid (الْمَجِيدُ / Majīd).', auditStatus: 'source-audited-green' },
  { legacyId: 50, evidenceKind: 'quran', source: 'Quran 22:17', sourceNote: 'Der Vers bezeichnet Allah direkt als Shahid über alle Dinge.', auditStatus: 'source-audited-green' },
  { legacyId: 51, evidenceKind: 'quran', source: 'Quran 22:6; 22:62', sourceNote: 'Beide Stellen bezeichnen Allah ausdrücklich als Al-Haqq.', auditStatus: 'source-audited-green' },
  { legacyId: 52, evidenceKind: 'quran', source: 'Quran 3:173', sourceNote: 'Die Ayah nennt Allah ausdrücklich den besten Wakil.', auditStatus: 'source-audited-green' },
  { legacyId: 53, evidenceKind: 'quran', source: 'Quran 22:40', sourceNote: 'Der Vers bezeichnet Allah direkt als Qawiyy und Aziz.', auditStatus: 'source-audited-green' },
  { legacyId: 55, evidenceKind: 'quran', source: 'Quran 42:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Waliyy und Al-Hamid.', auditStatus: 'source-audited-green' },
  { legacyId: 56, evidenceKind: 'quran', source: 'Quran 42:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Waliyy und Al-Hamid.', auditStatus: 'source-audited-green' },
  { legacyId: 60, evidenceKind: 'quran', source: 'Quran 41:39', sourceNote: 'Der Vers bezeichnet Allah im Kontext direkt als den Belebenden der Toten (Muhyi).', auditStatus: 'source-audited-green' },

  { legacyId: 66, evidenceKind: 'quran', source: 'Quran 39:4', sourceNote: 'Der Vers bezeichnet Allah ausdrücklich als Al-Wahid.', auditStatus: 'source-audited-green' },
  { legacyId: 67, evidenceKind: 'quran', source: 'Quran 112:1', sourceNote: 'Der Vers sagt ausdrücklich: Allah ist Ahad.', auditStatus: 'source-audited-green' },
  { legacyId: 68, evidenceKind: 'quran', source: 'Quran 112:2', sourceNote: 'Der Vers nennt Allah ausdrücklich As-Samad.', auditStatus: 'source-audited-green' },
  { legacyId: 69, evidenceKind: 'quran', source: 'Quran 6:65', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Qadir.', auditStatus: 'source-audited-green' },
  { legacyId: 70, evidenceKind: 'quran', source: 'Quran 18:45', sourceNote: 'Der Vers bezeichnet Allah direkt als Muqtadir über alle Dinge.', auditStatus: 'source-audited-green' },
  { legacyId: 71, evidenceKind: 'sahih-hadith', source: 'Sahih al-Bukhari 6398', sourceNote: 'Das prophetische Dua richtet sich an Allah: „Du bist Al-Muqaddim“.', auditStatus: 'source-audited-green' },
  { legacyId: 72, evidenceKind: 'sahih-hadith', source: 'Sahih al-Bukhari 6398', sourceNote: 'Das prophetische Dua richtet sich an Allah: „Du bist Al-Mu’akhkhir“.', auditStatus: 'source-audited-green' },
  { legacyId: 78, evidenceKind: 'quran', source: 'Quran 13:9', sourceNote: 'Die Ayah bezeichnet Allah im Kontext direkt als Al-Muta’ali.', auditStatus: 'source-audited-green' },
  { legacyId: 79, evidenceKind: 'quran', source: 'Quran 52:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Barr und Ar-Rahim.', auditStatus: 'source-audited-green' },
  { legacyId: 80, evidenceKind: 'quran', source: 'Quran 2:37', sourceNote: 'Der Vers bezeichnet Allah direkt als At-Tawwab und Ar-Rahim.', auditStatus: 'source-audited-green' },

  { legacyId: 82, evidenceKind: 'quran', source: 'Quran 4:99', sourceNote: 'Der Vers bezeichnet Allah direkt als Afuww und Ghafur.', auditStatus: 'source-audited-green' },
  { legacyId: 83, evidenceKind: 'quran', source: 'Quran 3:30', sourceNote: 'Der Vers bezeichnet Allah direkt als Ra’uf gegenüber den Dienern.', auditStatus: 'source-audited-green' },
  { legacyId: 84, evidenceKind: 'quran', source: 'Quran 3:26', sourceNote: 'Die direkte Anrede lautet „Allah, Malik-ul-Mulk“.', auditStatus: 'source-audited-green' },
  { legacyId: 85, evidenceKind: 'quran', source: 'Quran 55:27; 55:78', sourceNote: 'Der Quran bezeichnet den Herrn mit Dhul-Jalali wal-Ikram.', auditStatus: 'source-audited-green' },
  { legacyId: 87, evidenceKind: 'quran', source: 'Quran 3:9', sourceNote: 'Die Dua richtet sich an den Herrn als den Versammler der Menschen.', auditStatus: 'source-audited-green' },
  { legacyId: 88, evidenceKind: 'quran', source: 'Quran 22:64', sourceNote: 'Der Vers bezeichnet Allah ausdrücklich als Al-Ghaniyy und Al-Hamid.', auditStatus: 'source-audited-green' },
  { legacyId: 93, evidenceKind: 'quran', source: 'Quran 24:35', sourceNote: 'Die Ayah beginnt ausdrücklich mit „Allah ist das Licht der Himmel und der Erde“; die genaue Bedeutung bleibt tafsirbewusst.', auditStatus: 'source-audited-green' },
  { legacyId: 94, evidenceKind: 'quran', source: 'Quran 25:31', sourceNote: 'Der Vers bezeichnet den Herrn direkt als Hadi und Nasir.', auditStatus: 'source-audited-green' },
  { legacyId: 95, evidenceKind: 'quran', source: 'Quran 2:117', sourceNote: 'Der Quran bezeichnet Allah direkt als Badi’ der Himmel und der Erde.', auditStatus: 'source-audited-green' },
] as const;

export const ADDITIONAL_NAME_EVIDENCE_BY_LEGACY_ID = new Map(
  ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE.map((entry) => [entry.legacyId, entry]),
);
