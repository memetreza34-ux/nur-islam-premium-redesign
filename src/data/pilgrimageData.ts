/**
 * Hajj, Umrah und die drei heiligen Moscheen.
 *
 * Anders als alle übrigen Inhaltsbereiche gab es hierfür **keine Vorlage** im
 * Altbestand `memetreza34-ux/nur-islam` — dort standen sechs beziehungsweise
 * drei Stichpunkte. Diese Texte sind daher neu verfasst, und das ist der Grund
 * für die enge Selbstbeschränkung:
 *
 * Beschrieben wird der **Ablauf** — welche Station wann kommt und was dort
 * geschieht. Nicht beschrieben werden **Urteile**: was Pflicht und was Sunnah
 * ist, was die Pilgerfahrt ungültig macht, was bei Versäumnissen zu tun ist.
 * Genau diese Fragen unterscheiden sich zwischen den Rechtsschulen und gehören
 * zu einer qualifizierten Quelle, nicht in eine Übersicht.
 *
 * Wo eine Station eine klare Quranstelle hat, ist sie genannt. Wo keine steht,
 * fehlt sie bewusst, statt eine zu behaupten.
 *
 * Diese Einträge stehen mit erhöhter Priorität auf der Prüfliste, weil sie im
 * Gegensatz zu allen anderen nicht übernommen, sondern verfasst wurden.
 */

export type PilgrimageStation = {
  id: string;
  /** Zeitliche Einordnung, soweit sie zum Ablauf gehört. */
  when: string;
  title: string;
  description: string;
  /** Quranstelle, wo eine eindeutige besteht. */
  reference?: string;
};

export type HolyPlace = {
  id: string;
  name: string;
  city: string;
  description: string;
  reference?: string;
};

export const UMRAH_STATIONS: readonly PilgrimageStation[] = [
  {
    id: 'umrah-ihram',
    when: 'Vor dem Erreichen des Miqat',
    title: 'Ihram',
    description: 'Am Miqat, der festgelegten Grenze, wird der Weihezustand angenommen: Waschung, die vorgesehene Kleidung, die Absicht und die Talbiya. Ab hier gelten die Verhaltensregeln des Ihram.',
  },
  {
    id: 'umrah-tawaf',
    when: 'Nach der Ankunft in Makkah',
    title: 'Tawaf',
    description: 'Sieben Umrundungen der Kaaba, beginnend beim Schwarzen Stein. Anschließend folgt ein Gebet in der Nähe der Maqam Ibrahim.',
  },
  {
    id: 'umrah-sai',
    when: 'Im Anschluss an den Tawaf',
    title: 'Sa’i zwischen Safa und Marwa',
    description: 'Siebenmal wird die Strecke zwischen den beiden Hügeln Safa und Marwa zurückgelegt — in Erinnerung an Hajar, die dort nach Wasser für ihren Sohn Ismail suchte.',
    reference: 'Quran 2:158',
  },
  {
    id: 'umrah-halq',
    when: 'Zum Abschluss',
    title: 'Haarkürzung',
    description: 'Das Haar wird geschoren oder gekürzt. Damit endet der Weihezustand und die Umrah ist abgeschlossen.',
  },
];

export const HAJJ_STATIONS: readonly PilgrimageStation[] = [
  {
    id: 'hajj-ihram',
    when: 'Vor dem 8. Dhul-Hijjah',
    title: 'Ihram',
    description: 'Wie bei der Umrah wird am Miqat der Weihezustand angenommen. Die Absicht richtet sich auf die Hajj.',
  },
  {
    id: 'hajj-mina',
    when: '8. Dhul-Hijjah',
    title: 'Mina',
    description: 'Der Tag und die Nacht werden im Zeltlager von Mina verbracht, mit den regulären Gebeten und in Vorbereitung auf Arafat.',
  },
  {
    id: 'hajj-arafat',
    when: '9. Dhul-Hijjah',
    title: 'Das Stehen in Arafat',
    description: 'Vom Mittag bis Sonnenuntergang verweilen die Pilger in der Ebene von Arafat. Dieser Tag gilt als der zentrale Tag der Pilgerfahrt.',
  },
  {
    id: 'hajj-muzdalifah',
    when: 'Nacht zum 10. Dhul-Hijjah',
    title: 'Muzdalifah',
    description: 'Nach Sonnenuntergang ziehen die Pilger nach Muzdalifah, verrichten dort die Abendgebete und übernachten unter freiem Himmel.',
    reference: 'Quran 2:198',
  },
  {
    id: 'hajj-jamarat',
    when: '10. Dhul-Hijjah',
    title: 'Steinigung, Opfer und Haarkürzung',
    description: 'An den Jamarat werden Steinchen geworfen, es folgen das Opfer und das Scheren oder Kürzen des Haares.',
  },
  {
    id: 'hajj-ifada',
    when: '10. Dhul-Hijjah oder danach',
    title: 'Tawaf al-Ifada',
    description: 'Die Rückkehr nach Makkah für den Tawaf al-Ifada, gefolgt vom Sa’i zwischen Safa und Marwa.',
  },
  {
    id: 'hajj-tashriq',
    when: '11. bis 13. Dhul-Hijjah',
    title: 'Die Tage von Tashriq',
    description: 'Die Pilger bleiben in Mina und setzen die Steinigung an den Jamarat fort.',
  },
  {
    id: 'hajj-wada',
    when: 'Vor der Abreise',
    title: 'Tawaf al-Wada',
    description: 'Der Abschiedstawaf beschließt die Pilgerfahrt vor dem Verlassen Makkahs.',
  },
];

export const HOLY_PLACES: readonly HolyPlace[] = [
  {
    id: 'haram',
    name: 'Al-Masjid al-Haram',
    city: 'Makkah',
    description: 'Die Moschee, die die Kaaba umschließt. Sie ist die Gebetsrichtung aller Musliminnen und Muslime und das Ziel von Hajj und Umrah.',
    reference: 'Quran 2:144',
  },
  {
    id: 'nabawi',
    name: 'Al-Masjid an-Nabawi',
    city: 'Madinah',
    description: 'Die Moschee des Propheten ﷺ, von ihm nach der Auswanderung errichtet. Sie ist zugleich seine Ruhestätte.',
  },
  {
    id: 'aqsa',
    name: 'Al-Masjid al-Aqsa',
    city: 'Jerusalem',
    description: 'Die erste Gebetsrichtung des Islam und im Quran als Ziel der Nachtreise genannt.',
    reference: 'Quran 17:1',
  },
];
