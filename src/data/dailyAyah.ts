import { getPrayerClock } from '../services/prayerSchedule';

// Own short paraphrases; source comparison: docs/DAILY-AYAH-SOURCE-AUDIT-2026-10-11.md. No human approval.
export const DAILY_AYAHS = [
  { surahNumber: 112, ayahNumber: 1, surahName: 'Al-Ikhlas', arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', meaning: 'Sprich: Er ist Allah, der Eine.', source: 'Quran 112:1' },
  { surahNumber: 94, ayahNumber: 5, surahName: 'Asch-Scharh', arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', meaning: 'Gewiss, mit der Schwierigkeit kommt Erleichterung.', source: 'Quran 94:5' },
  { surahNumber: 93, ayahNumber: 11, surahName: 'Ad-Duha', arabic: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', meaning: 'Sprich über die Gaben deines Herrn.', source: 'Quran 93:11' },
  { surahNumber: 1, ayahNumber: 5, surahName: 'Al-Fatiha', arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', meaning: 'Dich allein beten wir an, und Dich allein bitten wir um Hilfe.', source: 'Quran 1:5' },
  { surahNumber: 1, ayahNumber: 6, surahName: 'Al-Fatiha', arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', meaning: 'Führe uns auf den geraden Weg.', source: 'Quran 1:6' },
] as const;

export function getDailyAyah(now = new Date(), timezone?: string) {
  const clock = getPrayerClock(now, timezone);
  if (!clock) return DAILY_AYAHS[0];
  const day = Math.floor(Date.parse(`${clock.dateKey}T00:00:00Z`) / 86400000);
  return DAILY_AYAHS[((day % DAILY_AYAHS.length) + DAILY_AYAHS.length) % DAILY_AYAHS.length];
}
