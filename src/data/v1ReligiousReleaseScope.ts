export type V1ReligiousReleaseGroup = 'beginner' | 'core';

export type V1ReligiousReleaseScopeItem = {
  contentId: string;
  group: V1ReligiousReleaseGroup;
  label: string;
};

/**
 * Single source of truth for religious/editorial blocks that must carry a
 * documented approval before the first public release may merge to main.
 */
export const V1_RELIGIOUS_RELEASE_SCOPE: readonly V1ReligiousReleaseScopeItem[] = [
  { contentId: 'beginner-islam', group: 'beginner', label: 'Was ist Islam?' },
  { contentId: 'beginner-allah', group: 'beginner', label: 'Wer ist Allah?' },
  { contentId: 'beginner-shahada', group: 'beginner', label: 'Shahada' },
  { contentId: 'beginner-prophet', group: 'beginner', label: 'Prophet Muhammad ﷺ' },
  { contentId: 'beginner-quran-sunnah', group: 'beginner', label: 'Quran, Sunnah und Hadith' },
  { contentId: 'beginner-five-pillars', group: 'beginner', label: 'Fünf Säulen' },
  { contentId: 'beginner-six-beliefs', group: 'beginner', label: 'Sechs Glaubensgrundlagen' },
  { contentId: 'beginner-purity', group: 'beginner', label: 'Reinheit – Einstieg' },
  { contentId: 'beginner-prayer', group: 'beginner', label: 'Gebet – Einstieg' },
  { contentId: 'beginner-next-steps', group: 'beginner', label: 'Nächste Schritte' },
  { contentId: 'quran-offline-bundle', group: 'core', label: 'Offline-Quran: Text, Übersetzung, Provenienz und Lizenz' },
  { contentId: 'quran-beginner-guide', group: 'core', label: 'Quran für Anfänger' },
  { contentId: 'beginner-reference', group: 'core', label: 'Anfänger-FAQ und Islam A–Z' },
  { contentId: 'purity-basics', group: 'core', label: 'Ghusl & Tayammum Grundlagen' },
  { contentId: 'names-of-allah', group: 'core', label: '99 Namen Allahs' },
  { contentId: 'dhikr-counter-steps', group: 'core', label: 'Dhikr-Zählertexte' },
  { contentId: 'dhikr-routines', group: 'core', label: 'Dhikr-Routinen' },
  { contentId: 'duas', group: 'core', label: 'Dua-Bestand' },
  { contentId: 'daily-hadith-rotation', group: 'core', label: 'Hadith des Tages' },
  { contentId: 'worship-guides', group: 'core', label: 'Wudu-/Salah-Anleitungen' },
  { contentId: 'prayer-rakat-sequence', group: 'core', label: 'Rakʿah-für-Rakʿah-Gebetsablauf' },
];
