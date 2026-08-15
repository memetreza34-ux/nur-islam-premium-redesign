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
  {
    /**
     * Das Gegenstück zum Morgen. Es fehlte — obwohl „Morgen und Abend“ im
     * Quran und in der Überlieferung durchgehend als Paar vorkommen und die
     * App den Morgen bereits führte.
     */
    id: 'evening',
    title: 'Dhikr am Abend',
    shortTitle: 'Abend',
    description: 'Das Gegenstück zum Morgen-Dhikr, gesprochen nach dem Nachmittag bis zum Einbruch der Nacht.',
    source: 'Sunan Abu Dawud; Sunan at-Tirmidhi',
    note: 'Die Zeitspanne wird unterschiedlich angegeben — verbreitet ist zwischen Asr und Maghrib.',
    items: [
      {
        id: 'evening-amsayna',
        latin: 'Amsayna wa amsal-mulku lillah',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
        meaning: 'Wir haben den Abend erreicht, und die Herrschaft gehört Allah.',
        target: 1,
      },
      {
        id: 'evening-protection',
        latin: 'Bismillahil-ladhi la yadurru ma\'asmihi shay',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
        meaning: 'Im Namen Allahs, bei dessen Namen nichts schaden kann.',
        target: 3,
      },
      {
        id: 'evening-tasbih',
        latin: 'SubhanAllahi wa bihamdih',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        meaning: 'Preis sei Allah, und Ihm gebührt das Lob.',
        target: 100,
      },
      {
        id: 'evening-tahlil',
        latin: 'La ilaha illallahu wahdahu la sharika lah',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        meaning: 'Es gibt keinen Gott außer Allah allein, Er hat keinen Partner.',
        target: 10,
      },
    ],
  },
  {
    /**
     * Die häufigste Frage nach einem Fehler ist, was man jetzt sagt. Bisher
     * stand die Antwort in der App nur verstreut in den Duas.
     */
    id: 'istighfar',
    title: 'Um Vergebung bitten',
    shortTitle: 'Vergebung',
    description: 'Kurze Formeln der Umkehr, die zu jeder Zeit und an jedem Ort gesprochen werden können.',
    source: 'Sahih al-Bukhari; Sahih Muslim',
    note: 'Keine der Formeln ist an eine Zahl gebunden — die Zielwerte sind verbreitete Gewohnheiten, keine Vorschrift.',
    items: [
      {
        id: 'astaghfirullah',
        latin: 'Astaghfirullah',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        meaning: 'Ich bitte Allah um Vergebung.',
        target: 100,
      },
      {
        id: 'rabbighfir',
        latin: 'Rabbighfir li wa tub ’alayya',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
        meaning: 'Mein Herr, vergib mir und nimm meine Umkehr an.',
        target: 100,
      },
      {
        id: 'astaghfirullah-atub',
        latin: 'Astaghfirullaha wa atubu ilayh',
        arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        meaning: 'Ich bitte Allah um Vergebung und wende mich Ihm zu.',
        target: 33,
      },
    ],
  },
  {
    id: 'salawat',
    title: 'Segenswünsche für den Propheten',
    shortTitle: 'Salawat',
    description: 'Segenswünsche für den Propheten ﷺ — besonders am Freitag verbreitet, an keinen Tag gebunden.',
    source: 'Sunan Abu Dawud; Sunan an-Nasa’i',
    items: [
      {
        id: 'salawat-short',
        latin: 'Allahumma salli ’ala Muhammad',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        meaning: 'O Allah, segne Muhammad.',
        target: 100,
      },
      {
        id: 'salawat-full',
        latin: 'Allahumma salli wa sallim ’ala nabiyyina Muhammad',
        arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
        meaning: 'O Allah, segne unseren Propheten Muhammad und schenke ihm Frieden.',
        target: 33,
      },
    ],
  },
  {
    id: 'free-counter',
    title: 'Freier Zähler',
    shortTitle: 'Frei',
    description: 'Ein neutraler Zähler für persönlichen Dhikr ohne vorgegebene religiöse Anzahl.',
    source: 'Persönlicher Zähler · keine bestimmte Anzahl behauptet',
    items: [
      {
        id: 'free-subhanallah',
        latin: 'SubhanAllah',
        arabic: 'سُبْحَانَ اللَّهِ',
        meaning: 'Allah ist frei von jedem Mangel.',
        target: 100,
      },
    ],
  },
];

export const DHIKR_ROUTINE_BY_ID = new Map(DHIKR_ROUTINES.map((routine) => [routine.id, routine]));
