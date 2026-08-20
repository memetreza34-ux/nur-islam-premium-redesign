export type DhikrItem = {
  id: string;
  latin: string;
  arabic: string;
  meaning: string;
  target: number;
};

export type DhikrRoutine = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  source: string;
  note?: string;
  items: DhikrItem[];
};

/**
 * Kleine, bewusst begrenzte Dhikr-Auswahl mit sichtbaren Quellenhinweisen.
 * Die deutschen Bedeutungen sind sinngemäße Formulierungen und keine
 * vorgetäuschten Originalübersetzungen der Hadith-Werke.
 *
 * Ein freier Zähler wird bewusst nicht mit einer künstlichen Zielzahl in diese
 * Liste aufgenommen: Eine App-Zielzahl darf nicht wie eine religiös festgelegte
 * Wiederholungszahl wirken.
 */
export const DHIKR_ROUTINES: DhikrRoutine[] = [
  {
    id: 'after-prayer',
    title: 'Dhikr nach dem Gebet',
    shortTitle: 'Nach Gebet',
    description: '33-mal Tasbih, 33-mal Tahmid, 33-mal Takbir und ein abschließender Tahlil.',
    source: 'Sahih Muslim 597a',
    items: [
      {
        id: 'subhanallah',
        latin: 'SubhanAllah',
        arabic: 'سُبْحَانَ اللَّهِ',
        meaning: 'Allah ist frei von jedem Mangel.',
        target: 33,
      },
      {
        id: 'alhamdulillah',
        latin: 'Alhamdulillah',
        arabic: 'الْحَمْدُ لِلَّهِ',
        meaning: 'Alles Lob gebührt Allah.',
        target: 33,
      },
      {
        id: 'allahu-akbar',
        latin: 'Allahu Akbar',
        arabic: 'اللَّهُ أَكْبَرُ',
        meaning: 'Allah ist größer als alles.',
        target: 33,
      },
      {
        id: 'tahlil-completion',
        latin: 'La ilaha illa Allah wahdahu la sharika lah',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        meaning: 'Niemand hat das Recht, angebetet zu werden, außer Allah allein. Ihm gehören Herrschaft und Lob, und Er hat Macht über alle Dinge.',
        target: 1,
      },
    ],
  },
  {
    id: 'morning-weighted',
    title: 'Dhikr am Morgen',
    shortTitle: 'Morgen',
    description: 'Ein umfassender Tasbih, dreimal gesprochen.',
    source: 'Sahih Muslim 2726a',
    items: [
      {
        id: 'creation-praise',
        latin: 'SubhanAllahi wa bihamdihi, adada khalqihi …',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
        meaning: 'Allah sei gepriesen und gelobt – entsprechend der Zahl Seiner Schöpfung, Seinem Wohlgefallen, dem Gewicht Seines Thrones und der Tinte Seiner Worte.',
        target: 3,
      },
    ],
  },
  {
    id: 'before-sleep',
    title: 'Dhikr vor dem Schlafen',
    shortTitle: 'Vor Schlaf',
    description: 'Tasbih, Tahmid und Takbir vor dem Einschlafen.',
    source: 'Sahih al-Bukhari 6318',
    note: 'Die Überlieferung enthält bei der Verteilung der 33/34 Zählungen eine bekannte Variante. Diese App zeigt die im Haupttext genannte 33er-Folge und kennzeichnet die Quelle sichtbar.',
    items: [
      {
        id: 'sleep-allahu-akbar',
        latin: 'Allahu Akbar',
        arabic: 'اللَّهُ أَكْبَرُ',
        meaning: 'Allah ist größer als alles.',
        target: 33,
      },
      {
        id: 'sleep-subhanallah',
        latin: 'SubhanAllah',
        arabic: 'سُبْحَانَ اللَّهِ',
        meaning: 'Allah ist frei von jedem Mangel.',
        target: 33,
      },
      {
        id: 'sleep-alhamdulillah',
        latin: 'Alhamdulillah',
        arabic: 'الْحَمْدُ لِلَّهِ',
        meaning: 'Alles Lob gebührt Allah.',
        target: 33,
      },
    ],
  },
];

export const DHIKR_ROUTINE_BY_ID = new Map(DHIKR_ROUTINES.map((routine) => [routine.id, routine]));
