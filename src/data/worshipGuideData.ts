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
    // Kurzüberblick, nicht der Ablauf: den führt der Gebetskurs, Rakʿah für
    // Rakʿah und je Gebet unterschiedlich. Zwei Beschreibungen derselben Sache
    // laufen mit der Zeit auseinander — diese hier sagte noch „Hände auf die
    // Brust“, während der Kurs inzwischen zeigt, dass genau das sich zwischen
    // den Rechtsschulen unterscheidet. Der Überblick bleibt, weil er eine
    // eigene Aufgabe hat: einmal sehen, woraus eine Rakʿah besteht.
    title: 'Salah (Gebet)',
    intro: 'Ein Überblick, woraus eine Gebetseinheit (Rakʿah) besteht. Den vollständigen Ablauf mit Wortlaut, Wiederholungen und den Unterschieden je Gebet führt der Gebetskurs unter „Beten lernen“.',
    steps: [
      {
        title: 'Vorbereitung',
        description: 'Stelle sicher, dass du Wudu hast, sauber gekleidet bist und dich in Richtung Qibla wendest.',
      },
      {
        title: 'Takbir al-Ihram',
        description: 'Hebe die Hände und sage \'Allahu Akbar\', um das Gebet zu beginnen. Wie hoch die Hände gehen und wo sie danach liegen, unterscheidet sich zwischen den Rechtsschulen; der Gebetskurs zeigt die vier Positionen.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
      },
      {
        title: 'Qiyam & Rezitation (1. Rak\'ah)',
        description: 'Stehe aufrecht, lege die Hände wie in deiner Rechtsschule üblich und rezitiere Al-Fatiha und eine weitere Sure.',
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
  {
    /**
     * Die häufigste Frage von Anfängern — und die einzige, auf die der Kurs
     * bisher keine Antwort hatte: Was ist, wenn man sich verzählt oder etwas
     * vergisst? Ohne Antwort darauf bricht man das Gebet ab oder beginnt neu,
     * beides unnötig.
     *
     * Beschreibend gehalten wie der Rest: was üblicherweise getan wird, nicht
     * was gelten soll. Der Zeitpunkt der Niederwerfung — vor oder nach dem
     * Salam — unterscheidet sich zwischen den Rechtsschulen und wird als
     * Unterschied benannt, nicht entschieden.
     */
    id: 'sahw',
    title: 'Wenn etwas schiefgeht',
    intro: 'Sich zu verzählen oder etwas zu vergessen passiert jedem. Dafür gibt es die Niederwerfung der Vergesslichkeit (Sujud as-Sahw) — das Gebet wird deswegen nicht abgebrochen und nicht neu begonnen.',
    steps: [
      {
        title: 'Was Sujud as-Sahw ist',
        description: 'Zwei zusätzliche Niederwerfungen am Ende des Gebets. Sie gleichen aus, was aus Versehen zu viel, zu wenig oder in falscher Reihenfolge geschehen ist. Gesprochen wird darin dasselbe wie in jeder Niederwerfung.',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
      },
      {
        title: 'Du hast ein Pflichtteil vergessen',
        description: 'Zum Beispiel das erste Tashahhud: Merkst du es, bevor du ganz aufgerichtet stehst, setzt du dich zurück und holst es nach. Stehst du schon, betest du weiter und machst am Ende Sujud as-Sahw.',
      },
      {
        title: 'Du bist dir unsicher, wie viele Rakʿah',
        description: 'Kannst du dich nicht entscheiden, gehst du von der kleineren Zahl aus, betest die fehlende Einheit und machst am Ende Sujud as-Sahw. Bist du dir überwiegend sicher, folgst du dieser Einschätzung.',
      },
      {
        title: 'Du hast eine Rakʿah zu viel gebetet',
        description: 'Fällt es dir während des Gebets auf, setzt du dich sofort zum Tashahhud. Fällt es erst nach dem Salam auf, machst du Sujud as-Sahw nach.',
      },
      {
        title: 'Wann die Niederwerfung erfolgt',
        description: 'Nach dem letzten Tashahhud. Ob vor oder nach dem Salam, unterscheidet sich zwischen den Rechtsschulen und je nach Art des Versehens — eine qualifizierte Lehrperson kann sagen, was in deiner Rechtsschule gilt.',
      },
      {
        title: 'Was Sujud as-Sahw nicht heilt',
        description: 'Fehlt eine Rakʿah ganz, oder wurde ein Grundpfeiler wie die Niederwerfung ausgelassen, reicht die Ausgleichs-Niederwerfung nicht — das Fehlende wird nachgeholt. Absichtliches Auslassen ist ohnehin etwas anderes als Vergessen.',
      },
      {
        title: 'Falsch rezitiert oder verhaspelt',
        description: 'Ein Versprecher in der Rezitation macht das Gebet nicht ungültig. Du korrigierst dich und betest weiter; eine Ausgleichs-Niederwerfung ist dafür nicht nötig.',
      },
    ],
    tips: [
      'Zweifel im Gebet sind normal und kein Zeichen, dass etwas mit dir nicht stimmt.',
      'Wer regelmäßig unsicher ist, zählt am besten laut im Kopf mit — Rakʿah für Rakʿah.',
      'Bei wiederkehrenden Zweifeln lohnt sich eine Rückfrage bei einer Lehrperson, statt jedes Gebet zu wiederholen.',
    ],
  },
  {
    /**
     * Die erste Säule stand in der App bisher als ein Satz im Artikel über die
     * fünf Säulen. Für jemanden, der zum Islam findet, ist sie der Einstieg —
     * und dann braucht es den Wortlaut, die Aussprache und die Bedeutung, nicht
     * eine Aufzählung, in der sie an erster Stelle vorkommt.
     */
    id: 'shahada',
    title: 'Die Shahada',
    intro: 'Das Glaubensbekenntnis ist die erste der fünf Säulen. Wer es mit Überzeugung ausspricht, tritt in den Islam ein — und es begleitet danach jedes Gebet, denn es steht im Tashahhud.',
    steps: [
      {
        title: 'Der Wortlaut',
        description: 'Das Bekenntnis besteht aus zwei Teilen, die zusammen gesprochen werden. Sprich sie langsam und in Ruhe; die Bedeutung zählt, nicht die Geschwindigkeit.',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
        transliteration: 'Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan rasulullah',
      },
      {
        title: 'Erster Teil: „Kein Gott außer Allah“',
        description: 'Das Bekenntnis, dass allein Allah Anbetung gebührt und Ihm nichts und niemand beigesellt wird. Es ist der Kern des Islam, auf dem alles Weitere steht.',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
        transliteration: 'La ilaha illallah',
      },
      {
        title: 'Zweiter Teil: „Muhammad ist der Gesandte Allahs“',
        description: 'Das Bekenntnis, dass Muhammad ﷺ von Allah gesandt wurde und die Botschaft überbracht hat. Damit wird angenommen, was er gelehrt hat — der Quran und seine Sunnah.',
        arabic: 'مُحَمَّدٌ رَسُولُ اللَّهِ',
        transliteration: 'Muhammadun rasulullah',
      },
      {
        title: 'Wo sie im Alltag vorkommt',
        description: 'Im Gebetsruf, in jedem Tashahhud des Gebets und im Gedenken. Wer das Gebet lernt, spricht sie also mehrmals täglich — der Gebetskurs zeigt, an welcher Stelle.',
      },
      {
        title: 'Wenn du den Islam annehmen möchtest',
        description: 'Entscheidend ist, dass du die Worte verstehst und mit Überzeugung sprichst. Üblich ist es, sie vor Zeugen zu sprechen, etwa in einer Moschee; verbindliche Auskunft zum Ablauf gibt eine Moschee vor Ort.',
      },
      {
        title: 'Was danach kommt',
        description: 'Üblich sind eine vollständige Waschung (Ghusl) und der Beginn mit den täglichen Gebeten. Vieles lernt sich mit der Zeit — der Wudu-Bereich und der Gebetskurs sind dafür der Anfang.',
      },
    ],
    tips: [
      'Die Bedeutung ist wichtiger als eine fehlerfreie Aussprache — die kommt mit der Übung.',
      'Niemand muss alles wissen, bevor er anfängt.',
      'Eine Moschee vor Ort hilft beim Einstieg und beantwortet Fragen, die eine App nicht beantworten kann.',
    ],
  },
  {
    /**
     * Fehlte ganz. Der Kurs beschrieb das Gebet durchgehend so, als wäre die
     * Ausführung für alle gleich — was in mehreren Punkten nicht stimmt, und
     * beim praktisch wichtigsten (Menstruation) zu der falschen Annahme führt,
     * die ausgefallenen Gebete seien nachzuholen.
     *
     * Beschreibend gehalten, mit den Unterschieden als Unterschieden. Wo eine
     * Frage zwischen den Rechtsschulen verläuft, steht das dabei.
     */
    id: 'women',
    title: 'Frauen im Gebet',
    intro: 'In den meisten Punkten beten Frauen und Männer gleich. Einige Fragen stellen sich aber nur Frauen, und zu manchen Details gibt es unterschiedliche Auffassungen — hier stehen sie beieinander.',
    steps: [
      {
        title: 'Kleidung im Gebet',
        description: 'Nach überwiegender Auffassung ist der Körper bis auf Gesicht und Hände bedeckt. Die Kleidung sollte weit genug sein, dass sie die Gestalt nicht abzeichnet, und blickdicht sein.',
      },
      {
        title: 'Die Haltung in Ruku und Sujud',
        description: 'Verbreitet in mehreren Rechtsschulen ist eine kompaktere Haltung: die Arme näher am Körper, in der Niederwerfung der Oberkörper näher an den Oberschenkeln. Andere Gelehrte sehen die Ausführung als identisch mit der des Mannes an. Beides wird praktiziert.',
      },
      {
        title: 'Menstruation und Wochenbett',
        description: 'In dieser Zeit wird nicht gebetet — und die ausgefallenen Gebete werden nicht nachgeholt. Das ist eine Erleichterung, kein Versäumnis. Das Fasten des Ramadan wird dagegen später nachgeholt.',
      },
      {
        title: 'Laut oder leise rezitieren',
        description: 'In den laut gebeteten Gebeten wird auch laut rezitiert, wenn keine fremden Männer mithören. Sonst wird leise rezitiert.',
      },
      {
        title: 'Im Gemeinschaftsgebet',
        description: 'Frauen beten in einer eigenen Reihe hinter den Männern. Betet eine Frau anderen Frauen vor, steht sie in der Mitte ihrer Reihe und nicht davor.',
      },
      {
        title: 'Moschee oder zu Hause',
        description: 'Der Moscheebesuch steht Frauen offen. Zugleich ist überliefert, dass auch das Gebet zu Hause großen Lohn trägt — beides ist gültig, und die Wahl bleibt frei.',
      },
      {
        title: 'Wenn Kinder dazwischenkommen',
        description: 'Ein Kind hochzunehmen oder eine kleine Bewegung macht das Gebet nicht ungültig. Vom Propheten ﷺ ist überliefert, dass er mit einem Kind auf dem Arm betete und die Niederwerfung verlängerte, weil ein Kind auf seinem Rücken saß.',
      },
    ],
    tips: [
      'In den Grundzügen — Ablauf, Wortlaut, Zeiten — unterscheidet sich nichts.',
      'Zu den Details der Haltung gibt es mehr als eine vertretbare Auffassung; eine Lehrperson vor Ort ordnet ein, was in deiner Umgebung üblich ist.',
      'Fragen zu Menstruation und Reinheit beantwortet eine Frau mit Wissen oft leichter als eine App.',
    ],
  },
  {
    /**
     * Der Kurs führt die fünf Pflichtgebete. Was sonst noch gebetet wird, kam
     * in der App nirgends vor — obwohl die Sunnah-Gebete zum Alltag der meisten
     * gehören und das Witr für viele jeden Abend dazukommt.
     */
    id: 'more-prayers',
    title: 'Weitere Gebete',
    intro: 'Neben den fünf Pflichtgebeten gibt es Gebete, die freiwillig sind, aber zum Alltag der meisten gehören. Keines davon ist Pflicht — sie kommen dazu, wenn das Pflichtgebet steht.',
    steps: [
      {
        title: 'Sunnah-Gebete rund um die Pflicht (Rawatib)',
        description: 'Vor oder nach den Pflichtgebeten: 2 vor Fajr, 4 vor und 2 nach Dhuhr, 2 nach Maghrib, 2 nach Isha. Sie werden wie ein normales Gebet verrichtet, nur ohne Adhan und leise.',
      },
      {
        title: 'Die zwei vor Fajr',
        description: 'Vom Propheten ﷺ ist überliefert, dass sie ihm lieber waren als die Welt und alles darin. Kurz gehalten, meist mit Al-Kafirun und Al-Ikhlas.',
      },
      {
        title: 'Witr — der Abschluss der Nacht',
        description: 'Eine ungerade Zahl an Rakʿah nach Isha, meist drei, mindestens eine. Es ist das letzte Gebet des Tages; wer nachts aufsteht, betet es nach dem Tahajjud.',
      },
      {
        title: 'Tahajjud — das Nachtgebet',
        description: 'Freiwilliges Gebet in der zweiten Nachthälfte, nach dem Schlafen. Es hat keine feste Rakʿah-Zahl; zwei genügen.',
      },
      {
        title: 'Duha — der Vormittag',
        description: 'Zwei bis acht Rakʿah zwischen Sonnenaufgang und Mittag, wenn die Sonne gestiegen ist. Eine ruhige Gewohnheit für den Tagesanfang.',
      },
      {
        title: 'Das Freitagsgebet (Jumuah)',
        description: 'Es ersetzt am Freitag das Dhuhr und besteht aus einer Ansprache (Khutbah) und zwei Rakʿah in Gemeinschaft — nicht aus vier. Wer die Ansprache verpasst, betet Dhuhr wie gewohnt.',
      },
      {
        title: 'Wenn du zwischen Pflicht und Sunnah wählen musst',
        description: 'Die Pflicht geht vor. Ein Sunnah-Gebet auszulassen ist kein Versäumnis; ein Pflichtgebet auszulassen schon. Wer wenig Zeit hat, betet die Pflicht in Ruhe statt beides in Eile.',
      },
    ],
    tips: [
      'Fang mit zwei Rakʿah an, nicht mit allen zwölf — eine Gewohnheit, die hält, ist mehr wert als eine, die nach einer Woche endet.',
      'Die Sunnah-Gebete werden leise gebetet, auch bei Fajr und Maghrib.',
      'Zwischen Pflicht- und Sunnah-Gebet lohnt ein kurzer Moment, statt sofort weiterzubeten.',
    ],
  },
  {
    /**
     * Die Lagen, in denen das Gebet anders aussieht als im Kurs. Sie fehlten
     * ganz — obwohl „ich war unterwegs“ und „ich habe eins verpasst“ die
     * ersten beiden Situationen sind, in die jeder gerät.
     */
    id: 'special-cases',
    title: 'Besondere Lagen',
    intro: 'Auf Reisen, bei Krankheit oder wenn ein Gebet ausgefallen ist, sieht das Gebet anders aus als im Kurs. Diese Erleichterungen sind Teil der Sache, kein Notbehelf.',
    steps: [
      {
        title: 'Auf Reisen: vier werden zwei (Qasr)',
        description: 'Ab einer Reise über die übliche Entfernung hinaus werden Dhuhr, Asr und Isha auf zwei Rakʿah verkürzt. Fajr bleibt bei zwei, Maghrib bei drei. Ab welcher Entfernung und wie lange die Erleichterung gilt, beantwortet eine Lehrperson.',
      },
      {
        title: 'Auf Reisen: zwei Gebete zusammenlegen (Jam)',
        description: 'Dhuhr mit Asr und Maghrib mit Isha dürfen unterwegs zusammen gebetet werden — entweder zur früheren oder zur späteren Zeit. Beide werden nacheinander verrichtet, jedes für sich.',
      },
      {
        title: 'Ein Gebet ist ausgefallen',
        description: 'Es wird nachgeholt, sobald man daran denkt — auch außerhalb seiner Zeit. Wer verschlafen hat oder es vergaß, betet es nach und beginnt nicht von vorn mit dem ganzen Tag.',
      },
      {
        title: 'Mehrere Gebete nachholen',
        description: 'In der Reihenfolge, in der sie ausgefallen sind, und möglichst zügig. Bei sehr vielen versäumten Gebeten über Jahre hinweg ist eine Lehrperson der richtige Ansprechpartner — dafür gibt es keine Faustregel, die für alle passt.',
      },
      {
        title: 'Im Sitzen beten',
        description: 'Wer nicht stehen kann, betet im Sitzen; wer nicht sitzen kann, im Liegen. Die Bewegungen werden angedeutet, die Niederwerfung tiefer als die Verbeugung. Das Gebet ist vollwertig, nicht halb.',
      },
      {
        title: 'Wenn die Zeit knapp wird',
        description: 'Läuft die Gebetszeit aus, wird gebetet statt gewartet — auch wenn man nur eine Rakʿah in der Zeit schafft, gilt das Gebet als rechtzeitig begonnen.',
      },
      {
        title: 'Unterwegs ohne Gebetsplatz',
        description: 'Ein sauberer Untergrund genügt, ein Teppich ist nicht nötig. Wenn die Qibla nicht zu bestimmen ist, betet man nach bester Einschätzung — das Gebet bleibt gültig.',
      },
    ],
    tips: [
      'Die Erleichterungen sind kein Nachlass, den man sich verdienen muss — sie gehören dazu.',
      'Im Zweifel lieber beten als aufschieben; nachbessern lässt sich später.',
      'Wie weit eine Reise sein muss, damit Qasr gilt, wird unterschiedlich beantwortet. Frag vor der Abreise, nicht unterwegs.',
    ],
  },
  {
    /**
     * Gebete, die man selten braucht und dann sofort — beim Totengebet steht
     * man in der Reihe und hat keine Zeit nachzuschlagen, wie es geht. Genau
     * deshalb gehören sie in die App und nicht nur in ein Buch.
     */
    id: 'occasions',
    title: 'Zu besonderen Anlässen',
    intro: 'Gebete, die nicht zum Tagesablauf gehören: zu den Festen, beim Abschied von einem Verstorbenen, vor einer Entscheidung. Man braucht sie selten — und dann meist ohne Vorbereitung.',
    steps: [
      {
        title: 'Das Eid-Gebet',
        description: 'Zwei Rakʿah am Morgen von Eid al-Fitr und Eid al-Adha, in Gemeinschaft und ohne Adhan oder Iqama. Es enthält zusätzliche Takbirat vor der Rezitation; wie viele es sind, unterscheidet sich zwischen den Rechtsschulen. Die Ansprache folgt nach dem Gebet, nicht davor wie am Freitag.',
      },
      {
        title: 'Das Totengebet (Janazah)',
        description: 'Es wird im Stehen gebetet, ohne Verbeugung und ohne Niederwerfung, und besteht aus vier Takbirat. Es ist eine Gemeinschaftspflicht: verrichtet es ein Teil der Gemeinde, ist sie für alle erfüllt.',
      },
      {
        title: 'Janazah: die vier Takbirat der Reihe nach',
        description: 'Nach dem ersten Takbir Al-Fatihah, nach dem zweiten die Segenswünsche für den Propheten ﷺ, nach dem dritten ein Bittgebet für den Verstorbenen, nach dem vierten das Taslim. Dazwischen bleibt man stehen.',
      },
      {
        title: 'Istikhara — vor einer Entscheidung',
        description: 'Zwei Rakʿah, danach das überlieferte Bittgebet um Rechtleitung. Es ersetzt nicht das Nachdenken und das Einholen von Rat, sondern kommt dazu — und wird gebetet, bevor man sich festgelegt hat.',
        arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
        transliteration: 'Allahumma inni astakhiruka bi ’ilmika, wa astaqdiruka bi qudratika, wa as’aluka min fadlikal-’adhim',
      },
      {
        title: 'Zwei Rakʿah beim Betreten der Moschee',
        description: 'Wer die Moschee betritt, betet zwei Rakʿah, bevor er sich setzt (Tahiyyat al-Masjid). Läuft gerade das Pflichtgebet oder die Freitagsansprache, entfällt das.',
      },
      {
        title: 'Das Gebet der Reue',
        description: 'Zwei Rakʿah nach einem Fehler, gefolgt von aufrichtiger Bitte um Vergebung. Es ist an keine Zeit gebunden und an keine Formel — die Umkehr ist der Inhalt.',
      },
      {
        title: 'Zeiten, in denen nicht gebetet wird',
        description: 'Bei Sonnenaufgang, im Zenit und bei Sonnenuntergang wird kein freiwilliges Gebet verrichtet. Pflichtgebete und nachzuholende Gebete sind davon nicht betroffen.',
      },
    ],
    tips: [
      'Beim Totengebet in der Reihe genügt es, den Takbirat des Imams zu folgen — man muss nicht alles auswendig können, um mitzubeten.',
      'Das Eid-Gebet hat keine feste Nachholmöglichkeit; wer es verpasst, verpasst es.',
      'Istikhara ist kein Orakel. Überliefert ist das Gebet, nicht die Erwartung eines Traums oder Zeichens.',
    ],
  },
];

export const WORSHIP_GUIDE_BY_ID = new Map(WORSHIP_GUIDES.map((guide) => [guide.id, guide]));
