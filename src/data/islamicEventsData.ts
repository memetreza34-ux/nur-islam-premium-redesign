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
 * Wo die Begehung selbst unter Gelehrten unterschiedlich bewertet wird —
 * Mawlid, Mitte Sha'ban —, ist das im Text vermerkt statt weggelassen.
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
};

export const ISLAMIC_EVENTS: readonly IslamicEvent[] = [
  {
    id: 'islamic-new-year',
    title: 'Islamisches Neujahr',
    month: 1,
    days: [1],
    meaning: 'Beginn des neuen Hijri-Jahres und des heiligen Monats Muharram.',
    practice: 'Ein Tag für Reue, Dua, Dankbarkeit und gute Vorsätze.',
    fasting: false,
  },
  {
    id: 'tasua',
    title: 'Tasuʿa',
    month: 1,
    days: [9],
    meaning: 'Der Tag vor Ashura; das Fasten zusammen mit Ashura ist empfohlen.',
    practice: 'Freiwillig am 9. und 10. Muharram fasten.',
    fasting: true,
  },
  {
    id: 'ashura',
    title: 'Ashura',
    month: 1,
    days: [10],
    meaning: 'Der Tag, an dem Musa (as) und sein Volk gerettet wurden.',
    practice: 'Fasten am 10. und idealerweise auch am 9. Muharram.',
    fasting: true,
  },
  {
    id: 'mawlid',
    title: 'Geburt des Propheten ﷺ',
    month: 3,
    days: [12],
    meaning: 'Ein verbreitet bekannter historischer Termin zur Geburt des Propheten ﷺ; die Art der Begehung wird unter Gelehrten unterschiedlich bewertet.',
    practice: 'Salawat senden, seine Sunnah lernen und sich an belegtes Wissen halten.',
    fasting: false,
  },
  {
    id: 'isra-miraj',
    title: 'Isra und Miʿraj',
    month: 7,
    days: [27],
    meaning: 'Erinnert an die Nachtreise und Himmelfahrt des Propheten ﷺ; das genaue Datum ist nicht sicher belegt.',
    practice: 'Surah al-Isra lesen, über das Gebet lernen, unbelegte Sonderrituale meiden.',
    fasting: false,
  },
  {
    id: 'mid-shaban',
    title: 'Mitte Shaʿban',
    month: 8,
    days: [15],
    meaning: 'Ein bekannter Termin vor Ramadan; besondere Handlungen dazu werden unterschiedlich bewertet.',
    practice: 'Allgemein: Reue, Dua und Vorbereitung auf den Ramadan.',
    fasting: false,
  },
  {
    id: 'ramadan',
    title: 'Ramadan beginnt',
    month: 9,
    days: [1],
    meaning: 'Der heiligste Monat im Islam, in dem der Quran herabgesandt wurde.',
    practice: 'Fasten von der Morgendämmerung bis zum Sonnenuntergang.',
    fasting: true,
  },
  {
    id: 'last-ten-ramadan',
    title: 'Letzte zehn Nächte des Ramadan',
    month: 9,
    days: [21, 22, 23, 24, 25, 26, 28, 29, 30],
    meaning: 'Die wichtigsten Nächte des Ramadan, in denen Laylat al-Qadr gesucht wird.',
    practice: 'Mehr Quran, Dua, Nachtgebet, Dhikr und Iʿtikaf, wenn möglich.',
    fasting: true,
  },
  {
    id: 'laylat-al-qadr',
    title: 'Laylat al-Qadr',
    month: 9,
    days: [27],
    meaning: 'Die Nacht der Bestimmung ist besser als tausend Monate; sie wird in den letzten ungeraden Nächten gesucht.',
    practice: 'Nachtgebet, Dua, Quran und die Bitte: Allahumma innaka ʿafuwwun tuhibbul-ʿafwa faʿfu ʿanni.',
    fasting: true,
  },
  {
    id: 'eid-al-fitr',
    title: 'Eid al-Fitr',
    month: 10,
    days: [1],
    meaning: 'Das Fest des Fastenbrechens nach dem Ramadan.',
    practice: 'Festgebet, Zakat al-Fitr und Feiern mit der Familie.',
    fasting: false,
  },
  {
    id: 'first-ten-dhul-hijjah',
    title: 'Erste zehn Tage von Dhul-Hijjah',
    month: 12,
    days: [1, 2, 3, 4, 5, 6, 7],
    meaning: 'Sehr gesegnete Tage für gute Taten, Dhikr und Fasten.',
    practice: 'Mehr Takbir, Dhikr, Spenden, Quran und freiwilliges Fasten bis Arafah.',
    fasting: true,
  },
  {
    id: 'tarwiyah',
    title: 'Tag at-Tarwiyah',
    month: 12,
    days: [8],
    meaning: 'Beginn wichtiger Hajj-Riten vor Arafah.',
    practice: 'Pilger beginnen mit den Hajj-Riten; für Nicht-Pilger gute Taten und freiwilliges Fasten.',
    fasting: true,
  },
  {
    id: 'arafah',
    title: 'Tag von Arafah',
    month: 12,
    days: [9],
    meaning: 'Der wichtigste Tag der Hajj-Wallfahrt.',
    practice: 'Das Fasten wird für Nicht-Pilger sehr empfohlen.',
    fasting: true,
  },
  {
    id: 'eid-al-adha',
    title: 'Eid al-Adha',
    month: 12,
    days: [10],
    meaning: 'Das Opferfest zum Gedenken an Ibrahim (as).',
    practice: 'Festgebet und das rituelle Opfer (Qurbani).',
    fasting: false,
  },
  {
    id: 'tashriq',
    title: 'Ayyam at-Tashriq',
    month: 12,
    days: [11, 12, 13],
    meaning: 'Festtage nach Eid al-Adha; Tage des Essens, Trinkens und Dhikr.',
    practice: 'Takbir, Dhikr, Freude mit der Familie und Fortsetzung der Hajj-Riten.',
    fasting: false,
  },
];

/** An diesen drei Tagen jedes Hijri-Monats ist der Mond voll. */
export const WHITE_DAYS = [13, 14, 15] as const;

export const WHITE_DAYS_EVENT = {
  title: 'Weiße Tage',
  meaning: 'Die Tage mit Vollmond in jedem islamischen Monat.',
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
