export type DhikrItem = {
  id: string;
  latin: string;
  transliteration?: string;
  arabic: string;
  meaning: string;
  target: number;
  itemSource?: string;
  itemSourceUrl?: string;
  itemNote?: string;
};

export type DhikrRoutine = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  source: string;
  sourceUrl?: string;
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
    sourceUrl: 'https://sunnah.com/muslim:597a',
    note: 'Der Zähler bildet eine Durchführung ab, nicht alle Gebete eines Tages. Für ein weiteres Gebet kannst du die Routine zurücksetzen. Der Fortschrittsbalken ist keine religiöse Bewertung.',
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
        transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu, wa huwa ‘ala kulli shay’in qadir.',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        meaning: 'Niemand hat das Recht, angebetet zu werden, außer Allah allein. Er hat keinen Partner. Ihm gehören Herrschaft und Lob, und Er hat Macht über alle Dinge.',
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
    sourceUrl: 'https://sunnah.com/muslim:2726a',
    items: [
      {
        id: 'creation-praise',
        latin: 'SubhanAllahi wa bihamdihi, adada khalqihi …',
        transliteration: 'SubhanAllahi wa bihamdihi, ‘adada khalqihi, wa rida nafsihi, wa zinata ‘arshihi, wa midada kalimatihi.',
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
    sourceUrl: 'https://sunnah.com/bukhari:6318',
    note: 'Diese Auswahl folgt dem Haupttext von Bukhari 6318: dreimal 33. Dieselbe Stelle nennt zusätzlich eine Variante mit 34 Tasbih. Andere Überlieferungen enthalten andere 33/34-Verteilungen; diese Auswahl erklärt sie nicht für ungültig.',
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
    id: 'evening',
    title: 'Dhikr am Abend',
    shortTitle: 'Abend',
    description: 'Eine Auswahl für den Abend; die Quellen legen hier keine gemeinsame minutengenaue Zeitspanne fest.',
    source: 'Sahih Muslim 2723a, 2692, 2693 · Sunan Abi Dawud 5088',
    note: 'Eine Auswahl, keine vollständig überlieferte gemeinsame Routine. Die Tahlil-Zahl aus Muslim 2693 ist nicht speziell an den Abend gebunden. Zeitliche Einordnungen können variieren.',
    items: [
      {
        id: 'evening-amsayna',
        latin: 'Amsayna wa amsal-mulku lillah',
        transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah. La ilaha illallahu wahdahu la sharika lah. Lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli shay’in qadir. Allahumma as’aluka khayra hadhihil-laylati wa a‘udhu bika min sharri hadhihil-laylati wa sharri ma ba‘daha. Allahumma inni a‘udhu bika minal-kasali wa su’il-kibar. Allahumma inni a‘udhu bika min ‘adhabin fin-nari wa ‘adhabin fil-qabr.',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ اللَّهُمَّ أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ وَأَعُوذُ بِكَ مِنْ شَرِّ هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
        meaning: 'Wir sind in den Abend eingetreten, und alle Herrschaft gehört Allah; Ihm gebührt das Lob. Niemand ist der Anbetung würdig außer Allah allein, ohne Partner. Ihm gehören Herrschaft und Lob, und Er ist über alles mächtig. O Allah, ich bitte Dich um das Gute dieser Nacht und suche Zuflucht bei Dir vor ihrem Übel und dem Übel danach, vor Trägheit und den Beschwerden des Alters sowie vor der Strafe im Feuer und im Grab.',
        target: 1,
        itemSource: 'Sahih Muslim 2723a',
        itemSourceUrl: 'https://sunnah.com/muslim:2723a',
      },
      {
        id: 'evening-protection',
        latin: 'Bismillahil-ladhi la yadurru ma\'asmihi shay',
        transliteration: 'Bismillahil-ladhi la yadurru ma‘a-smihi shay’un fil-ardi wa la fis-sama’i wa huwas-sami‘ul-‘alim.',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        meaning: 'Im Namen Allahs, mit dessen Namen nichts auf der Erde und im Himmel schadet; Er ist der Allhörende, der Allwissende.',
        target: 3,
        itemSource: 'Sunan Abi Dawud 5088',
        itemSourceUrl: 'https://sunnah.com/abudawud:5088',
        itemNote: 'Sahih nach al-Albani in der Online-Ausgabe. Die App leitet daraus keine medizinische Zusage und keinen Ersatz für Vorsichtsmaßnahmen ab.',
      },
      {
        id: 'evening-tasbih',
        latin: 'SubhanAllahi wa bihamdih',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        meaning: 'Preis sei Allah, und Ihm gebührt das Lob.',
        target: 100,
        itemSource: 'Sahih Muslim 2692',
        itemSourceUrl: 'https://sunnah.com/muslim:2692',
      },
      {
        id: 'evening-tahlil',
        latin: 'La ilaha illallahu wahdahu la sharika lah',
        transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu, wa huwa ‘ala kulli shay’in qadir.',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        meaning: 'Niemand ist der Anbetung würdig außer Allah allein. Er hat keinen Partner; Ihm gehören Herrschaft und Lob, und Er ist über alles mächtig.',
        target: 10,
        itemSource: 'Sahih Muslim 2693 · allgemeiner Tahlil, kein spezielles Abendritual',
        itemSourceUrl: 'https://sunnah.com/muslim:2693',
      },
    ],
  },
  {
    id: 'istighfar',
    title: 'Um Vergebung bitten',
    shortTitle: 'Vergebung',
    description: 'Kurze Formeln, um Allah um Vergebung zu bitten; diese Auswahl behauptet keinen besonderen Pflichtzeitpunkt.',
    source: 'Sahih al-Bukhari 6307 · Sunan Abi Dawud 1516',
    sourceUrl: 'https://sunnah.com/bukhari:6307',
    note: 'Die Zählerziele sind persönliche Merkhilfen, keine Pflicht oder Belohnungsgarantie. Abi Dawud 1516 nennt die vollständige Formel hundertmal in einer Sitzung; Bukhari 6307 berichtet von mehr als siebzig Bitten täglich.',
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
        transliteration: 'Rabbighfir li wa tub ‘alayya, innaka antat-tawwabur-rahim.',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        meaning: 'Mein Herr, vergib mir und nimm meine Umkehr an. Du bist der die Reue Annehmende, der Barmherzige.',
        target: 100,
        itemSource: 'Sunan Abi Dawud 1516',
        itemSourceUrl: 'https://sunnah.com/abudawud:1516',
        itemNote: 'Sahih nach al-Albani in der Online-Ausgabe. Der arabische Text dieser Ausgabe endet mit ar-Rahim; die englische Wiedergabe ist dafür kein wortgleiches Gegenstück.',
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
    source: 'Quran 33:56 · allgemeine Grundlage für Segenswünsche',
    sourceUrl: 'https://quran.com/33/56',
    note: 'Kurze persönliche Formulierungen, nicht der Wortlaut von Quran 33:56. Die Ziele 100 und 33 sind frei gewählte Zählerwerte, keine für diese Formeln belegten religiösen Vorgaben. Zum Freitagsbezug: Sunan Abi Dawud 1047, Sahih nach al-Albani in der Online-Ausgabe.',
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
    note: '100 ist ein persönlicher Zählerabschnitt, keine religiöse Vorgabe oder Pflicht zum Abschluss.',
    items: [
      {
        id: 'free-subhanallah',
        latin: 'SubhanAllah',
        arabic: 'سُبْحَانَ اللَّهِ',
        meaning: 'Allah ist frei von jedem Mangel.',
        target: 100,
        itemSource: 'Sahih Muslim 597a · Tasbih-Formel, nicht die frei gewählte Zielzahl',
        itemSourceUrl: 'https://sunnah.com/muslim:597a',
      },
    ],
  },
];

export const DHIKR_ROUTINE_BY_ID = new Map(DHIKR_ROUTINES.map((routine) => [routine.id, routine]));
