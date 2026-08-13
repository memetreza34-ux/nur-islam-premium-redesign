/**
 * Anleitungen für Wudu und Gebet.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`. Die App führte
 * bisher je sechs verkürzte Schritte für Wudu und Salah, ohne die arabischen
 * Texte — ausgerechnet das, was beim Lernen am meisten gebraucht wird. Drei
 * Anleitungen fehlten ganz: was in den einzelnen Gebetspositionen gesagt wird,
 * die Pflichtteile und die häufigen Fehler.
 *
 * Wo der Altbestand arabischen Text und Umschrift führte, sind beide
 * übernommen. Nichts davon ist hier verfasst.
 *
 * Die fachliche Prüfung steht wie bei allen religiösen Inhalten aus. Sie
 * betrifft besonders die Anleitung zu den Pflichtteilen, weil sich diese
 * Einordnung zwischen den Rechtsschulen unterscheidet.
 */

export type WorshipStep = {
  title: string;
  description: string;
  /** Arabischer Wortlaut, wo der Altbestand einen führte. */
  arabic?: string;
  transliteration?: string;
};

export type WorshipGuide = {
  id: string;
  title: string;
  intro: string;
  steps: WorshipStep[];
  tips: string[];
};

export const WORSHIP_GUIDES: readonly WorshipGuide[] = [
  {
    id: 'wudu',
    title: 'Wudu (Gebetswaschung)',
    intro: 'Wudu ist die rituelle Waschung vor dem Gebet. Sie reinigt Körper und Geist.',
    steps: [
      {
        title: 'Absicht (Niyyah)',
        description: 'Fasse die Absicht im Herzen, Wudu für das Gebet zu vollziehen und sage \'Bismillah\'.',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
      },
      {
        title: 'Hände waschen',
        description: 'Wasche beide Hände bis zu den Handgelenken dreimal gründlich.',
        arabic: 'غَسْلُ الْيَدَيْنِ',
        transliteration: 'Ghasl al-Yadayn',
      },
      {
        title: 'Mund ausspülen',
        description: 'Spüle den Mund dreimal mit Wasser aus.',
        arabic: 'الْمَضْمَضَةُ',
        transliteration: 'Al-Madmadah',
      },
      {
        title: 'Nase reinigen',
        description: 'Ziehe dreimal Wasser in die Nase und schnäuze es wieder aus.',
        arabic: 'الِاسْتِنْشَاقُ وَالِاسْتِنْثَارُ',
        transliteration: 'Al-Istinshaq wal-Istinthar',
      },
      {
        title: 'Gesicht waschen',
        description: 'Wasche das gesamte Gesicht dreimal (von Stirn bis Kinn, Ohr zu Ohr).',
      },
      {
        title: 'Arme waschen',
        description: 'Wasche den rechten, dann den linken Arm bis einschließlich der Ellenbogen dreimal.',
      },
      {
        title: 'Kopf streichen',
        description: 'Streiche mit feuchten Händen einmal über den Kopf (von vorne nach hinten).',
      },
      {
        title: 'Ohren reinigen',
        description: 'Reinige mit den Zeigefingern das Innere und mit den Daumen das Äußere der Ohren einmal.',
      },
      {
        title: 'Füße waschen',
        description: 'Wasche den rechten, dann den linken Fuß bis einschließlich der Knöchel dreimal.',
      },
      {
        title: 'Dua nach dem Wudu',
        description: 'Ich bezeuge, dass es keinen Gott gibt außer Allah, dem Einzigen, der keinen Partner hat, und ich bezeuge, dass Muhammad Sein Diener und Gesandter ist. O Allah, mache mich zu den Reumütigen und mache mich zu den sich Reinigenden.',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        transliteration: 'Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan \'abduhu wa rasuluh. Allahumma j\'alni minat-tawwabina waj\'alni minal-mutatahharin.',
      },
    ],
    tips: ['Verschwende kein Wasser.', 'Achte auf die korrekte Reihenfolge.', 'Stelle sicher, dass alle Stellen nass werden.'],
  },
  {
    id: 'salah',
    title: 'Salah (Gebet)',
    intro: 'Das Gebet ist die direkte Verbindung zu Allah. Es besteht aus festen Schritten und Gebetseinheiten (Rak\'ah). Hier ist der Ablauf für eine Rak\'ah.',
    steps: [
      {
        title: 'Vorbereitung',
        description: 'Stelle sicher, dass du Wudu hast, sauber gekleidet bist und dich in Richtung Qibla wendest.',
      },
      {
        title: 'Takbir al-Ihram',
        description: 'Hebe die Hände zu den Ohren und sage \'Allahu Akbar\', um das Gebet zu beginnen.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
      },
      {
        title: 'Qiyam & Rezitation (1. Rak\'ah)',
        description: 'Stehe aufrecht, lege die Hände auf die Brust und rezitiere Al-Fatiha und eine weitere Sure.',
      },
      {
        title: 'Ruku (Verbeugung)',
        description: 'Verbeuge dich mit geradem Rücken, Hände auf den Knien, und sage \'Subhana Rabbiyal Adhim\' dreimal.',
      },
      {
        title: 'Aufstehen aus Ruku',
        description: 'Richte dich wieder auf und sage \'Sami Allahu liman hamidah\', dann \'Rabbana wa lakal hamd\'.',
      },
      {
        title: 'Sujud (1. Niederwerfung)',
        description: 'Wirf dich nieder (Stirn, Nase, Hände, Knie, Zehen am Boden) und sage \'Subhana Rabbiyal A\'la\' dreimal.',
      },
      {
        title: 'Sitzen zwischen Sujud',
        description: 'Setze dich kurz aufrecht hin, bevor du die zweite Niederwerfung vollziehst.',
      },
      {
        title: 'Sujud (2. Niederwerfung)',
        description: 'Wirf dich erneut nieder und sage \'Subhana Rabbiyal A\'la\' dreimal. Damit ist eine Rak\'ah beendet.',
      },
      {
        title: 'Weitere Rak\'ahs',
        description: 'Stehe auf für die nächste Rak\'ah. Wiederhole die Schritte 3 bis 8. In der 3. und 4. Rak\'ah wird nur Al-Fatiha rezitiert.',
      },
      {
        title: 'Tashahhud (Sitzen)',
        description: 'Sitze nach der 2. Rak\'ah und am Ende des Gebets, um das Tashahhud-Gebet zu rezitieren.',
      },
      {
        title: 'Taslim (Abschluss)',
        description: 'Drehe den Kopf nach rechts, dann nach links und sage jeweils \'Assalamu Alaikum wa Rahmatullah\'.',
      },
    ],
    tips: ['Bete mit Ruhe und Konzentration (Khushu).', 'Lerne die Bedeutung der Worte, die du sagst.', 'Achte auf die korrekten Zeiten der Gebete.', 'Bewege dich nicht zu schnell. Jede Position sollte ruhig eingenommen werden.', 'Schau während des Stehens auf die Stelle der Niederwerfung (Sujud).'],
  },
  {
    id: 'what-to-say',
    title: 'Was sagt man im Gebet?',
    intro: 'Die wichtigsten Worte und Sätze, die im Gebet gesprochen werden.',
    steps: [
      {
        title: 'Takbir (Beginn & Wechsel)',
        description: 'Gott ist am größten.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
      },
      {
        title: 'Eröffnung Bittgebet (Sana)',
        description: 'Gepriesen seist Du, o Allah, und Dir gebührt das Lob. Gesegnet ist Dein Name, erhaben ist Deine Majestät, und es gibt keinen Gott außer Dir.',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabaraka ismuka, wa ta\'ala jadduka, wa la ilaha ghayruka',
      },
      {
        title: 'Al-Fatiha (Die Eröffnende)',
        description: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen. Alles Lob gehört Allah, dem Herrn der Welten, dem Allerbarmen, dem Barmherzigen, dem Herrscher am Tag des Gerichts. Dir allein dienen wir, und Dich allein bitten wir um Hilfe. Führe uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den der Irregehenden.',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Bismillahi r-rahmani r-rahim. Alhamdu lillahi rabbil-\'alamin. Ar-rahmani r-rahim. Maliki yawmid-din. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an\'amta \'alayhim ghayril-maghdubi \'alayhim wa lad-dallin.',
      },
      {
        title: 'Im Ruku (Verbeugung)',
        description: 'Gepriesen sei mein Herr, der Allmächtige. (3x)',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيم',
        transliteration: 'Subhana Rabbiyal Adhim',
      },
      {
        title: 'Beim Aufrichten aus dem Ruku',
        description: 'Allah hört den, der Ihn lobt. Unser Herr, Dir gebührt alles Lob.',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا وَلَكَ الْحَمْد',
        transliteration: 'Sami Allahu liman hamidah. Rabbana wa lakal hamd',
      },
      {
        title: 'Im Sujud (Niederwerfung)',
        description: 'Gepriesen sei mein Herr, der Höchste. (3x)',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
      },
      {
        title: 'Zwischen den Niederwerfungen',
        description: 'Mein Herr, vergib mir.',
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbi ighfir li',
      },
      {
        title: 'Tashahhud (Erster Teil)',
        description: 'Alle Grüße, Gebete und guten Taten gebühren Allah. Friede sei mit dir, o Prophet... Ich bezeuge, dass es keinen Gott gibt außer Allah, und ich bezeuge, dass Muhammad Sein Diener und Gesandter ist.',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu \'alayna wa \'ala \'ibadillahi s-salihin. Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan \'abduhu wa rasuluh.',
      },
      {
        title: 'Salawat (Segenswünsche)',
        description: 'O Allah, segne Muhammad und die Familie von Muhammad, wie Du Ibrahim und die Familie von Ibrahim gesegnet hast...',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad, kama sallayta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik \'ala Muhammadin wa \'ala ali Muhammad, kama barakta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid.',
      },
      {
        title: 'Dua nach Salawat (Optional)',
        description: 'O Allah, ich nehme Zuflucht bei Dir vor der Strafe der Hölle, vor der Strafe des Grabes, vor den Versuchungen des Lebens und des Todes und vor der Versuchung des falschen Messias.',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Allahumma inni a\'udhu bika min \'adhabi jahannam, wa min \'adhabi l-qabr, wa min fitnati l-mahya wal-mamat, wa min sharri fitnati l-masihi d-dajjal.',
      },
      {
        title: 'Taslim (Abschluss)',
        description: 'Der Friede und die Barmherzigkeit Allahs seien mit euch. (Nach rechts und links)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'Assalamu \'alaikum wa rahmatullah',
      },
    ],
    tips: ['Lerne die Texte in deinem eigenen Tempo.', 'Es ist in Ordnung, am Anfang von einem Zettel abzulesen.'],
  },
  {
    id: 'mandatory',
    title: 'Pflichtteile & Grundlagen',
    intro: 'Das Gebet hat bestimmte Säulen (Arkan), ohne die das Gebet ungültig ist.',
    steps: [
      {
        title: 'Die Absicht (Niyyah)',
        description: 'Man muss wissen, welches Gebet man gerade verrichtet (im Herzen, nicht laut gesprochen).',
      },
      {
        title: 'Stehen (Qiyam)',
        description: 'Das Stehen bei den Pflichtgebeten, wenn man dazu in der Lage ist.',
      },
      {
        title: 'Takbir al-Ihram',
        description: 'Das Sprechen von \'Allahu Akbar\' zu Beginn des Gebets.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
      },
      {
        title: 'Rezitation der Al-Fatiha',
        description: 'Das Lesen der Sure Al-Fatiha in jeder Rak\'ah.',
      },
      {
        title: 'Ruku (Verbeugung)',
        description: 'Das Verbeugen, sodass die Hände die Knie erreichen.',
      },
      {
        title: 'Aufrichten aus dem Ruku',
        description: 'Das vollständige Aufrichten nach der Verbeugung.',
      },
      {
        title: 'Sujud (Niederwerfung)',
        description: 'Die Niederwerfung auf sieben Körperteilen (Stirn/Nase, beide Hände, beide Knie, Zehen beider Füße).',
      },
      {
        title: 'Sitzen zwischen den Sujud',
        description: 'Das aufrechte Sitzen zwischen den beiden Niederwerfungen.',
      },
      {
        title: 'Das letzte Sitzen & Tashahhud',
        description: 'Das Sitzen am Ende des Gebets und das Sprechen des Tashahhud.',
      },
      {
        title: 'Taslim',
        description: 'Das Beenden des Gebets mit dem Friedensgruß.',
      },
      {
        title: 'Ruhe (Tuma\'ninah)',
        description: 'Das ruhige Verweilen in jeder Position, ohne Hast.',
      },
      {
        title: 'Reihenfolge (Tartib)',
        description: 'Die Einhaltung der korrekten Reihenfolge dieser Säulen.',
      },
    ],
    tips: ['Wenn du eine Säule vergisst, musst du sie nachholen.', 'Lass dir Zeit im Gebet, Eile zerstört die Ruhe.'],
  },
  {
    id: 'mistakes',
    title: 'Häufige Fehler',
    intro: 'Jeder macht Fehler, besonders am Anfang. Hier sind einige Dinge, auf die du achten solltest, um dein Gebet zu verbessern.',
    steps: [
      {
        title: 'Zu schnelles Beten',
        description: 'Das Gebet hastig auszuführen, ohne in den Positionen zur Ruhe zu kommen (fehlende Tuma\'ninah). Nimm dir Zeit für jede Bewegung.',
      },
      {
        title: 'Umherschauen',
        description: 'Der Blick sollte während des Stehens auf den Ort der Niederwerfung (Sujud) gerichtet sein, nicht nach oben oder zur Seite.',
      },
      {
        title: 'Unvollständiger Sujud',
        description: 'Sicherstellen, dass alle 7 Körperteile (Stirn/Nase, Hände, Knie, Zehen) den Boden berühren. Die Füße sollten nicht in der Luft sein.',
      },
      {
        title: 'Vor dem Imam bewegen',
        description: 'Beim Gemeinschaftsgebet darf man sich nicht vor dem Imam bewegen. Man folgt ihm, nachdem er den Takbir gesprochen hat.',
      },
      {
        title: 'Laute Rezitation bei leisen Gebeten',
        description: 'Dhuhr und Asr sind leise Gebete. Man sollte so rezitieren, dass man sich selbst hört, aber nicht die anderen stört.',
      },
      {
        title: 'Kleidung während des Gebets richten',
        description: 'Unnötige Bewegungen, wie das ständige Richten der Kleidung oder Haare, lenken ab und können das Gebet ungültig machen, wenn es zu viel wird.',
      },
    ],
    tips: ['Sei nicht zu streng mit dir selbst, Allah sieht deine Bemühungen.', 'Wenn du dir unsicher bist, frage jemanden mit Wissen.'],
  },
];

export const WORSHIP_GUIDE_BY_ID = new Map(WORSHIP_GUIDES.map((guide) => [guide.id, guide]));
