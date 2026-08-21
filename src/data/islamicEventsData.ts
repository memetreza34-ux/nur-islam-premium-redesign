/**
 * Öffentliche, wiederkehrende Hinweise des islamischen Jahres.
 *
 * Alle Hijri-Daten sind berechnet und können von lokaler Mondsichtung bzw.
 * zuständigen Stellen um einen Tag abweichen. Die Liste ist bewusst
 * konservativ: Datierungen mit unsicherem historischem Datum oder umstrittener
 * Sonderpraxis werden nicht als normale v1-Kalenderereignisse ausgespielt.
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
  /** Only true when the calendar may safely show "Freiwilliges Fasten". */
  fasting: boolean;
  source: string;
};

export const ISLAMIC_EVENTS: readonly IslamicEvent[] = [
  {
    id: 'islamic-new-year',
    title: '1. Muharram · Beginn des Hijri-Jahres',
    month: 1,
    days: [1],
    meaning: 'Der erste Tag des Monats Muharram markiert rechnerisch den Beginn eines neuen Hijri-Jahres.',
    practice: 'Die App behauptet für den Jahreswechsel kein besonderes Neujahrsritual. Allgemeine gute Taten, Dua und Reue sind nicht auf diesen Tag beschränkt.',
    fasting: false,
    source: 'Kalenderdefinition · keine besondere Neujahrs-Sunnah behauptet',
  },
  {
    id: 'tasua',
    title: 'Tasuʿa',
    month: 1,
    days: [9],
    meaning: 'Der 9. Muharram wird zusammen mit dem Ashura-Fasten überliefert.',
    practice: 'Freiwillig am 9. Muharram fasten; Ashura folgt am 10. Muharram.',
    fasting: true,
    source: 'Sahih Muslim 1134a–b',
  },
  {
    id: 'ashura',
    title: 'Ashura',
    month: 1,
    days: [10],
    meaning: 'In der authentischen Überlieferung wird dieser Tag mit der Rettung von Musa und Bani Israil verbunden.',
    practice: 'Freiwilliges Fasten am 10. Muharram; die zusätzliche 9.-Muharram-Praxis wird separat angezeigt.',
    fasting: true,
    source: 'Sahih al-Bukhari 2004 · Sahih Muslim 1134a · Sahih Muslim 1162a',
  },
  {
    id: 'ramadan',
    title: 'Ramadan beginnt',
    month: 9,
    days: [1],
    meaning: 'Ramadan ist der Monat, in dem der Quran herabgesandt wurde und in dem das Fasten vorgeschrieben ist.',
    practice: 'Das Ramadan-Fasten wird hier nicht als freiwilliges Fasten gekennzeichnet. Persönliche Ausnahmen und Sonderfälle gehören in qualifizierte Fiqh-Beratung.',
    fasting: false,
    source: 'Quran 2:183–185',
  },
  {
    id: 'laylat-al-qadr',
    title: 'Laylat al-Qadr suchen',
    month: 9,
    days: [21, 23, 25, 27, 29],
    meaning: 'Die genaue Nacht wird hier nicht auf den 27. Ramadan festgelegt. Der Prophet ﷺ wies an, sie in den ungeraden Nächten der letzten zehn Nächte zu suchen.',
    practice: 'In diesen Nächten besonders um Gebet, Dua und Quran bemühen; auch die übrigen letzten zehn Nächte bleiben wichtig.',
    fasting: false,
    source: 'Quran 97:1–5 · Sahih al-Bukhari 2017',
  },
  {
    id: 'last-ten-ramadan',
    title: 'Letzte zehn Nächte des Ramadan',
    month: 9,
    days: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    meaning: 'Für die letzten zehn Nächte ist verstärkter Gottesdienst überliefert; je nach Monatslänge kann Ramadan nach dem 29. Tag enden.',
    practice: 'Mehr Gebet und Gottesdienst; Iʿtikaf ist für die letzten zehn Tage/Nächte authentisch überliefert. Die App legt Laylat al-Qadr nicht auf eine einzige Nacht fest.',
    fasting: false,
    source: 'Sahih al-Bukhari 2024 · Sahih al-Bukhari 2026',
  },
  {
    id: 'eid-al-fitr',
    title: 'Eid al-Fitr',
    month: 10,
    days: [1],
    meaning: 'Das Fest des Fastenbrechens folgt auf Ramadan.',
    practice: 'Festtag. Das Fasten an Eid al-Fitr ist untersagt; weitere Fiqh-Details zu Festgebet und Zakat al-Fitr werden separat geprüft.',
    fasting: false,
    source: 'Sahih Muslim 1138 · Sahih Muslim 1140',
  },
  {
    id: 'first-ten-dhul-hijjah',
    title: 'Erste Tage von Dhul-Hijjah',
    month: 12,
    days: [1, 2, 3, 4, 5, 6, 7, 8],
    meaning: 'Für die ersten zehn Tage von Dhul-Hijjah ist eine besondere Bedeutung guter Taten authentisch überliefert.',
    practice: 'Allgemein gute Taten vermehren. Die App behauptet hier keine einzelne spezielle Handlung für jeden dieser Tage; Arafah und Eid werden gesondert angezeigt.',
    fasting: false,
    source: 'Sahih al-Bukhari 969',
  },
  {
    id: 'arafah',
    title: 'Tag von Arafah',
    month: 12,
    days: [9],
    meaning: 'Der 9. Dhul-Hijjah ist der Tag von Arafah und ein zentraler Tag der Hajj.',
    practice: 'Für Nicht-Pilger ist das freiwillige Fasten mit großer Belohnung überliefert. Hajj-spezifische Regeln werden nicht durch diesen allgemeinen Kalenderhinweis entschieden.',
    fasting: true,
    source: 'Sahih Muslim 1162a–b',
  },
  {
    id: 'eid-al-adha',
    title: 'Eid al-Adha',
    month: 12,
    days: [10],
    meaning: 'Der 10. Dhul-Hijjah ist Eid al-Adha, das Opferfest.',
    practice: 'Festtag. Fasten ist an diesem Tag untersagt. Einzelheiten zu Festgebet und Opfer richten sich nach Fiqh und persönlicher Situation.',
    fasting: false,
    source: 'Sahih Muslim 1138 · Sahih Muslim 1140',
  },
  {
    id: 'tashriq',
    title: 'Ayyam at-Tashriq',
    month: 12,
    days: [11, 12, 13],
    meaning: 'Die Tage nach Eid al-Adha werden als Tage des Essens, Trinkens und Gedenkens Allahs beschrieben.',
    practice: 'Für den allgemeinen Nutzer zeigt die App an diesen Tagen keinen freiwilligen Fastenhinweis. Hajj-spezifische Ausnahmen werden hier nicht entschieden.',
    fasting: false,
    source: 'Sahih Muslim 1141a · Sahih Muslim 1142a',
  },
];

/**
 * Historisch oder praktisch verbreitete Datierungen, die v1 bewusst NICHT als
 * feste öffentliche religiöse Kalenderereignisse ausspielt.
 */
export const QUARANTINED_CALENDAR_NOTICES = [
  {
    id: 'mawlid-12-rabi-al-awwal',
    label: '12. Rabi al-Awwal als Geburtsdatum des Propheten ﷺ',
    reason: 'Das genaue Geburtsdatum ist historisch nicht auf derselben sicheren Belegstufe wie die öffentlichen Kerntermine; besondere Begehungsformen werden zudem unterschiedlich bewertet.',
  },
  {
    id: 'isra-miraj-27-rajab',
    label: '27. Rajab als Datum von Isra und Miʿraj',
    reason: 'Isra und Miʿraj sind belegt, ein sicher authentisch festgelegtes Datum am 27. Rajab wird hier jedoch nicht behauptet.',
  },
  {
    id: 'mid-shaban-15',
    label: '15. Shaʿban mit besonderer Sonderpraxis',
    reason: 'Überlieferungen und daraus abgeleitete besondere Praktiken werden unterschiedlich bewertet; v1 zeigt daher keinen pauschalen Sonderritual-Hinweis.',
  },
] as const;

/** An diesen drei Tagen jedes Hijri-Monats ist freiwilliges Fasten überliefert. */
export const WHITE_DAYS = [13, 14, 15] as const;

export const WHITE_DAYS_EVENT = {
  title: 'Weiße Tage',
  meaning: 'Der 13., 14. und 15. Tag jedes islamischen Monats.',
  practice: 'Freiwilliges Fasten an diesen drei Tagen ist überliefert.',
  source: 'Jamiʿ at-Tirmidhi 761 · Hasan',
} as const;

export const WEEKLY_FAST_EVENT = {
  meaning: 'Montag und Donnerstag sind als freiwillige Fastentage überliefert.',
  practice: 'Freiwilliges Fasten an diesen Tagen.',
  source: 'Jamiʿ at-Tirmidhi 747 · Hasan · Sunan Abi Dawud 2436',
} as const;

/**
 * An diesen Tagen darf die allgemeine Kalenderlogik keinen freiwilligen
 * Fastenhinweis anzeigen. Hajj-spezifische Sonderfälle werden nicht von diesem
 * allgemeinen Kalender entschieden.
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
