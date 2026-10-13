/**
 * Die wiederkehrenden Termine des islamischen Jahres.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`
 * (`src/services/calendarService.ts`). Der Kalender hier kannte nur die weißen
 * Tage und den Montag/Donnerstag — Ramadan, die beiden Eid-Feste, Arafah,
 * Ashura und Laylat al-Qadr standen nirgends, obwohl der Kalender genau dafür
 * da ist.
 *
 * Alle Daten sind **berechnet**, nicht durch Mondsichtung bestätigt. Der
 * Kalenderbildschirm sagt das ausdrücklich; die Abweichung beträgt in der
 * Praxis bis zu einem Tag.
 *
 * Unsicher datierte oder unterschiedlich bewertete Sonderanlässe werden nicht
 * als religiöse Termine vorgeschlagen. Das ist keine Bewertung der Begehung.
 */

export type IslamicEvent = {
  id: string;
  title: string;
  /** 1 = Muharram … 12 = Dhu al-Hijjah. */
  month: number;
  /** Tag im Hijri-Monat; mehrere für mehrtägige Anlässe. */
  days: readonly number[];
  meaning: string;
  practice: string;
  fasting: boolean;
  source: string;
  sourceUrl: string;
};

export const ISLAMIC_EVENTS: readonly IslamicEvent[] = [
  {
    id: 'islamic-new-year',
    title: 'Islamisches Neujahr',
    month: 1,
    days: [1],
    meaning: 'Beginn des neuen Hijri-Jahres im Muharram, einem der vier heiligen Monate. Die Jahreszählung ist eine Kalenderkonvention; 9:36 nennt die heiligen Monate.',
    practice: 'Kalenderbeginn; daraus wird kein besonderes Ritual für diesen Tag abgeleitet.',
    fasting: false,
    source: 'Quran 9:36',
    sourceUrl: 'https://quran.com/9/36',
  },
  {
    id: 'tasua',
    title: 'Tasuʿa',
    month: 1,
    days: [9],
    meaning: 'Muslim 1134a berichtet die Absicht, im nächsten Jahr auch am neunten Tag zu fasten.',
    practice: 'Freiwillig am 9. und 10. Muharram fasten.',
    fasting: true,
    source: 'Sahih Muslim 1134a',
    sourceUrl: 'https://sunnah.com/muslim:1134a',
  },
  {
    id: 'ashura',
    title: 'Ashura',
    month: 1,
    days: [10],
    meaning: 'Al-Bukhari 2004 berichtet die Rettung Musas und der Kinder Israels als Anlass des Ashura-Fastens.',
    practice: 'Fasten am 10. und idealerweise auch am 9. Muharram.',
    fasting: true,
    source: 'Sahih al-Bukhari 2004',
    sourceUrl: 'https://sunnah.com/bukhari:2004',
  },
  {
    id: 'ramadan',
    title: 'Ramadan beginnt',
    month: 9,
    days: [1],
    meaning: 'Der Monat, in dem der Quran herabgesandt wurde.',
    practice: 'Ramadan-Fasten von der wahren Morgendämmerung bis Sonnenuntergang. Krankheit, Reise und weitere Ausnahmen haben eigene Regeln; hier keine persönliche Pflichtentscheidung.',
    fasting: true,
    source: 'Quran 2:185',
    sourceUrl: 'https://quran.com/2/185',
  },
  {
    id: 'last-ten-ramadan',
    title: 'Letzte zehn Nächte des Ramadan',
    month: 9,
    days: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    meaning: 'In den letzten zehn Nächten intensivierte der Prophet seine Anbetung. Laylat al-Qadr wird in diesem Zeitraum gesucht.',
    practice: 'Nachtgebet und Anbetung intensivieren; die Lernempfehlung ist keine Garantie für ein bestimmtes Datum.',
    fasting: true,
    source: 'Sahih al-Bukhari 2024',
    sourceUrl: 'https://sunnah.com/bukhari:2024',
  },
  {
    id: 'laylat-al-qadr',
    title: 'Laylat al-Qadr suchen',
    month: 9,
    days: [21, 23, 25, 27, 29],
    meaning: 'Kein festes Datum: Laylat al-Qadr wird in den letzten zehn Nächten gesucht, besonders in den ungeraden. Quelle: Sahih al-Bukhari 2017.',
    practice: 'Nachtgebet und Dua. Die angezeigte Hijri-Nacht beginnt am vorherigen Abend mit Sonnenuntergang.',
    fasting: true,
    source: 'Sahih al-Bukhari 2017',
    sourceUrl: 'https://sunnah.com/bukhari:2017',
  },
  {
    id: 'eid-al-fitr',
    title: 'Eid al-Fitr',
    month: 10,
    days: [1],
    meaning: 'Das Fest des Fastenbrechens nach dem Ramadan.',
    practice: 'Zakat al-Fitr vor dem Festgebet; Fasten ist an diesem Festtag untersagt. Einzelheiten des Festgebets und der Abgabe sind gesonderte Regeln.',
    fasting: false,
    source: 'Sahih al-Bukhari 1503 · Zakat al-Fitr; 1991 · Fastenverbot',
    sourceUrl: 'https://sunnah.com/bukhari:1503',
  },
  {
    id: 'first-ten-dhul-hijjah',
    title: 'Erste Tage von Dhul-Hijjah',
    month: 12,
    days: [1, 2, 3, 4, 5, 6, 7],
    meaning: 'Al-Bukhari 969 hebt gute Taten in diesen Tagen hervor.',
    practice: 'Gute Taten und Gedenken Allahs. Daraus folgt keine besondere vorgeschriebene Fastenform für jeden einzelnen Tag.',
    fasting: true,
    source: 'Sahih al-Bukhari 969',
    sourceUrl: 'https://sunnah.com/bukhari:969',
  },
  {
    id: 'tarwiyah',
    title: 'Tag at-Tarwiyah',
    month: 12,
    days: [8],
    meaning: 'Al-Bukhari 1551 nennt den erneuten Ihram am achten Dhul-Hijjah im berichteten Hajj-Ablauf.',
    practice: 'Für Pilger beginnt dieser Hajj-Abschnitt je nach Pilgerform. Die Fastenmarkierung ist ein allgemeiner freiwilliger Hinweis für Nicht-Pilger, kein besonderes Tarwiyah-Gebot.',
    fasting: true,
    source: 'Sahih al-Bukhari 1551',
    sourceUrl: 'https://sunnah.com/bukhari:1551',
  },
  {
    id: 'arafah',
    title: 'Tag von Arafah',
    month: 12,
    days: [9],
    meaning: 'Der wichtigste Tag der Hajj-Wallfahrt.',
    practice: 'Freiwilliges Arafah-Fasten für Nicht-Pilger. Daraus wird keine allgemeine Fastenanweisung für Pilger in Arafat abgeleitet.',
    fasting: true,
    source: 'Sahih Muslim 1162a · Fasten; al-Bukhari 1988 · nichtfastend in Arafat',
    sourceUrl: 'https://sunnah.com/muslim:1162a',
  },
  {
    id: 'eid-al-adha',
    title: 'Eid al-Adha',
    month: 12,
    days: [10],
    meaning: 'Opferfest während der Tage der Hajj.',
    practice: 'Festgebet und Opfer haben eigene Voraussetzungen. Am Festtag wird nicht gefastet.',
    fasting: false,
    source: 'Quran 22:36 · Opfertiere; al-Bukhari 1991 · Fastenverbot',
    sourceUrl: 'https://quran.com/22/36',
  },
  {
    id: 'tashriq',
    title: 'Ayyam at-Tashriq',
    month: 12,
    days: [11, 12, 13],
    meaning: 'Festtage nach Eid al-Adha; Tage des Essens, Trinkens und Dhikr.',
    practice: 'Gedenken Allahs und Fortsetzung der Hajj. Der allgemeine Fastenhinweis bleibt aus; al-Bukhari 1997/1998 nennt eine Ausnahme für Pilger ohne Opfertier.',
    fasting: false,
    source: 'Sahih Muslim 1141b; al-Bukhari 1997/1998 · Pilgerausnahme',
    sourceUrl: 'https://sunnah.com/muslim:1141b',
  },
];

/** Fastentage um die Monatsmitte; keine exakte astronomische Vollmondangabe. */
export const WHITE_DAYS = [13, 14, 15] as const;

export const WHITE_DAYS_EVENT = {
  title: 'Weiße Tage',
  meaning: 'Der 13., 14. und 15. Tag des Hijri-Monats; keine exakte Vollmondvorhersage.',
  practice: 'Das Fasten an diesen drei Tagen wird empfohlen.',
} as const;

export const WEEKLY_FAST_EVENT = {
  meaning: 'Wöchentliche Sunnah-Fastentage.',
  practice: 'Freiwilliges Fasten an diesen Tagen.',
} as const;

/**
 * Eid fällt auf das Ende eines Fastenabschnitts, nicht mitten hinein — an
 * diesen Tagen ist das Fasten untersagt, deshalb darf kein Fastenhinweis
 * stehenbleiben, nur weil ein anderer Anlass denselben Tag trifft.
 */
export const NO_FASTING_DAYS: readonly { month: number; days: readonly number[] }[] = [
  { month: 10, days: [1] },
  { month: 12, days: [10, 11, 12, 13] },
];

export function findIslamicEvents(month: number, day: number): readonly IslamicEvent[] {
  if (!month || !day) return [];
  return ISLAMIC_EVENTS.filter((event) => event.month === month && event.days.includes(day));
}

export function isFastingForbidden(month: number, day: number) {
  return NO_FASTING_DAYS.some((entry) => entry.month === month && entry.days.includes(day));
}
