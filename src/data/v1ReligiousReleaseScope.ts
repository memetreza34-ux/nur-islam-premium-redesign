export type V1ReligiousReleaseGroup = 'beginner' | 'learning' | 'core';

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

  { contentId: 'aqidah-tawhid', group: 'learning', label: 'Aqidah: Tawhid' },
  { contentId: 'aqidah-iman', group: 'learning', label: 'Aqidah: sechs Glaubensgrundlagen' },
  { contentId: 'aqidah-names', group: 'learning', label: 'Aqidah: Allahs Namen' },
  { contentId: 'fiqh-purity', group: 'learning', label: 'Fiqh: Reinheit vor dem Gebet' },
  { contentId: 'fiqh-prayer-time', group: 'learning', label: 'Fiqh: Gebetszeiten' },
  { contentId: 'fiqh-asking', group: 'learning', label: 'Fiqh: Wann man nachfragen sollte' },
  { contentId: 'tafsir-fatiha', group: 'learning', label: 'Tafsir: Al-Fatiha' },
  { contentId: 'tafsir-ikhlas', group: 'learning', label: 'Tafsir: Al-Ikhlas' },
  { contentId: 'tafsir-method', group: 'learning', label: 'Tafsir: verantwortungsvoll lesen' },
  { contentId: 'seerah-revelation', group: 'learning', label: 'Seerah: Beginn der Offenbarung' },
  { contentId: 'seerah-hijra', group: 'learning', label: 'Seerah: Hijra' },
  { contentId: 'seerah-example', group: 'learning', label: 'Seerah: Prophet als Vorbild' },
  { contentId: 'hadith-basics', group: 'learning', label: 'Hadith: Grundlagen' },
  { contentId: 'hadith-intention', group: 'learning', label: 'Hadith: Absichten' },
  { contentId: 'hadith-verification', group: 'learning', label: 'Hadith: sicher weitergeben' },
  { contentId: 'akhlaq-sincerity', group: 'learning', label: 'Akhlaq: Aufrichtigkeit' },
  { contentId: 'akhlaq-patience', group: 'learning', label: 'Akhlaq: Geduld' },
  { contentId: 'akhlaq-mercy', group: 'learning', label: 'Akhlaq: Barmherzigkeit und Respekt' },

  { contentId: 'quran-offline-bundle', group: 'core', label: 'Offline-Quran: Text, Übersetzung, Provenienz und Lizenz' },
  { contentId: 'quran-beginner-guide', group: 'core', label: 'Quran für Anfänger' },
  { contentId: 'beginner-reference', group: 'core', label: 'Anfänger-FAQ und Islam A–Z' },
  { contentId: 'purity-basics', group: 'core', label: 'Ghusl & Tayammum Grundlagen' },
  { contentId: 'names-of-allah', group: 'core', label: 'Namen Allahs · einzeln belegtes öffentliches Lernset' },
  { contentId: 'dhikr-counter-steps', group: 'core', label: 'Dhikr-Zählertexte' },
  { contentId: 'dhikr-routines', group: 'core', label: 'Dhikr-Routinen' },
  { contentId: 'duas', group: 'core', label: 'Dua-Bestand' },
  { contentId: 'daily-hadith-rotation', group: 'core', label: 'Hadith des Tages' },
  { contentId: 'worship-guides', group: 'core', label: 'Wudu-/Salah-Anleitungen' },
  { contentId: 'prayer-rakat-sequence', group: 'core', label: 'Rakʿah-für-Rakʿah-Gebetsablauf' },
  { contentId: 'prayer-time-methodology', group: 'core', label: 'Gebetszeiten: Berechnungsmethode, Fallback und lokale Abweichungen' },
  { contentId: 'qibla-guidance', group: 'core', label: 'Qibla: Standort, Bearing und Gerätekompass' },
  { contentId: 'islamic-calendar-content', group: 'core', label: 'Islamischer Kalender: Termine, Fastenhinweise und Datumsunsicherheit' },
];
