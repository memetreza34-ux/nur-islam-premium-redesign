/**
 * Die fünf Pflichtgebete als Kurzliste.
 *
 * Getrennt vom Kursbildschirm, damit der Lernbereich die fünf Kacheln zeigen
 * kann, ohne den ganzen Gebetsablauf mitzuladen: der Kurs bringt die Rakʿah mit
 * arabischem Wortlaut und die Haltungsfiguren mit, und das hatte den
 * Startbundle über sein Limit gedrückt.
 */

export type PrayerLessonId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerLesson = {
  id: PrayerLessonId;
  label: string;
  arabic: string;
  rakahs: number;
  timeLabel: string;
  note: string;
};

export const PRAYER_LESSONS: readonly PrayerLesson[] = [
  { id: 'fajr', label: 'Fajr', arabic: 'الفجر', rakahs: 2, timeLabel: 'Morgengebet', note: 'Zwei Pflicht-Rakʿah' },
  { id: 'dhuhr', label: 'Dhuhr', arabic: 'الظهر', rakahs: 4, timeLabel: 'Mittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'asr', label: 'Asr', arabic: 'العصر', rakahs: 4, timeLabel: 'Nachmittagsgebet', note: 'Vier Pflicht-Rakʿah' },
  { id: 'maghrib', label: 'Maghrib', arabic: 'المغرب', rakahs: 3, timeLabel: 'Abendgebet', note: 'Drei Pflicht-Rakʿah' },
  { id: 'isha', label: 'Isha', arabic: 'العشاء', rakahs: 4, timeLabel: 'Nachtgebet', note: 'Vier Pflicht-Rakʿah' },
];
