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
  source?: string;
  sourceUrl?: string;
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
    intro: 'Eine Lernfolge für die rituelle Gebetswaschung. Dreimaliges Waschen ist überliefert, aber keine allgemeine Mindestzahl für jeden Schritt. Pflichtumfang, Absicht und Reihenfolge werden je nach Rechtsschule unterschiedlich eingeordnet.',
    steps: [
      {
        title: 'Absicht (Niyyah)',
        description: 'Fasse die Absicht im Herzen. Bismillah ist eine gebräuchliche Eröffnung; die rechtliche Einordnung ist schulabhängig. Die arabischen Bezeichnungen der folgenden Handlungen sind keine zu sprechenden Gebetsformeln.',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        source: 'TDV İslâm Ansiklopedisi · ABDEST: Absicht, Eröffnung und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/abdest',
      },
      {
        title: 'Hände waschen',
        description: 'Wasche beide Hände bis zu den Handgelenken dreimal gründlich.',
        arabic: 'غَسْلُ الْيَدَيْنِ',
        transliteration: 'Ghasl al-Yadayn',
        source: 'Sahih al-Bukhari 164 · dreimal in dieser Ablaufbeschreibung',
        sourceUrl: 'https://sunnah.com/bukhari:164',
      },
      {
        title: 'Mund ausspülen',
        description: 'Spüle den Mund dreimal mit Wasser aus.',
        arabic: 'الْمَضْمَضَةُ',
        transliteration: 'Al-Madmadah',
        source: 'Sahih Muslim 235a · dreimal Mund und Nase in dieser Beschreibung',
        sourceUrl: 'https://sunnah.com/muslim:235a',
      },
      {
        title: 'Nase reinigen',
        description: 'Ziehe dreimal Wasser in die Nase und schnäuze es wieder aus.',
        arabic: 'الِاسْتِنْشَاقُ وَالِاسْتِنْثَارُ',
        transliteration: 'Al-Istinshaq wal-Istinthar',
        source: 'Sahih Muslim 235a · Mund und Nase, keine universelle Mindestzahl',
        sourceUrl: 'https://sunnah.com/muslim:235a',
      },
      {
        title: 'Gesicht waschen',
        description: 'Wasche das gesamte Gesicht dreimal (von Stirn bis Kinn, Ohr zu Ohr).',
        source: 'Sahih al-Bukhari 164 · dreimal Gesicht waschen',
        sourceUrl: 'https://sunnah.com/bukhari:164',
      },
      {
        title: 'Arme waschen',
        description: 'Wasche den rechten, dann den linken Arm bis einschließlich der Ellenbogen dreimal.',
        source: 'Sahih al-Bukhari 164 · bis zu den Ellenbogen, dreimal; Muslim 235a beschreibt zweimal',
        sourceUrl: 'https://sunnah.com/bukhari:164',
      },
      {
        title: 'Kopf streichen',
        description: 'Streiche mit feuchten Händen über den Kopf. Muslim 235a beschreibt die Bewegung nach vorne und zurück. Wie viel vom Kopf verpflichtend zu bestreichen ist, unterscheidet sich je nach Rechtsschule.',
        sourceUrl: 'https://sunnah.com/muslim:235a',
        source: 'Sahih Muslim 235a · beschriebener Ablauf, kein vollständiger Schulvergleich',
      },
      {
        title: 'Ohren reinigen',
        description: 'Reinige mit den Zeigefingern das Innere und mit den Daumen das Äußere der Ohren einmal.',
        source: 'Sunan Abi Dawud 135 · Beschreibung mit Zeigefingern und Daumen; keine eigene Authentizitätsbewertung',
        sourceUrl: 'https://sunnah.com/abudawud:135',
      },
      {
        title: 'Füße waschen',
        description: 'Wasche den rechten, dann den linken Fuß bis einschließlich der Knöchel dreimal.',
        source: 'Sahih Muslim 235a · Füße bis zu den Knöcheln; al-Bukhari 164 nennt dreimal',
        sourceUrl: 'https://sunnah.com/muslim:235a',
      },
      {
        title: 'Dua nach dem Wudu',
        description: 'Sinngemäße Bedeutung: Ich bezeuge, dass allein Allah Anbetung gebührt, ohne Partner, und dass Muhammad Sein Diener und Gesandter ist. Diese Lernfassung verwendet das Glaubensbekenntnis aus Muslim 234b.',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan \'abduhu wa rasuluh.',
        sourceUrl: 'https://sunnah.com/muslim:234b',
        source: 'Sahih Muslim 234b · Glaubensbekenntnis nach der Waschung',
      },
    ],
    tips: ['Spare Wasser.', 'Die Lernfolge zeigt eine überlieferte Ausführung; Pflichtumfang und Reihenfolge haben schulabhängige Einzelheiten.', 'Benetze die jeweils zu waschenden Körperbereiche vollständig.'],
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
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Takbir al-Ihram',
        description: 'Hebe die Hände und sage \'Allahu Akbar\', um das Gebet zu beginnen. Wie hoch die Hände gehen und wo sie danach liegen, unterscheidet sich zwischen den Rechtsschulen; der Gebetskurs zeigt die vier Positionen.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Qiyam & Rezitation (1. Rak\'ah)',
        description: 'Im Stehen wird Quran rezitiert. Der Gebetskurs zeigt Al-Fatihah und eine weitere Sure als Lernfolge für Alleinbetende oder den Imam. Die eigene Rezitation hinter dem Imam ist schulabhängig.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Ruku (Verbeugung)',
        description: 'Beuge dich und lege die Hände auf die Knie. Die Lernfassung zeigt Subhana Rabbiyal Adhim dreimal; die Zahl ist keine allgemeine Mindestzahl.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Aufstehen aus Ruku',
        description: 'Richte dich wieder auf. Die Lernfolge zeigt Sami Allahu liman hamidah und den anschließenden Lobpreis. Für Mitbetende hinter dem Imam nennt al-Bukhari 722 die Antwort Rabbana lakal hamd; die Zuordnung ist nicht für alle Betenden gleich.',
        sourceUrl: 'https://sunnah.com/bukhari:722',
        source: 'Sahih al-Bukhari 722 · Antwort der Mitbetenden',
      },
      {
        title: 'Sujud (1. Niederwerfung)',
        description: 'Die Lernfolge zeigt Stirn und Nase, Hände, Knie und Zehen am Boden und Subhana Rabbiyal A\'la dreimal. Die rechtliche Einordnung der Details ist schulabhängig.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Sitzen zwischen Sujud',
        description: 'Setze dich kurz aufrecht hin, bevor du die zweite Niederwerfung vollziehst.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Sujud (2. Niederwerfung)',
        description: 'Nach dem Sitzen folgt eine zweite Niederwerfung mit demselben Lobpreis. Die Lernfassung verwendet drei Wiederholungen als Lernzahl.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Weitere Rak\'ahs',
        description: 'Drei- und vierteilige Pflichtgebete haben weitere Einheiten; freiwillige Gebete und Witr haben eigene Abläufe. Die Übersicht ersetzt nicht den vollständigen Kurs für das jeweilige Gebet.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Tashahhud (Sitzen)',
        description: 'Sitze nach der 2. Rak\'ah und am Ende des Gebets, um das Tashahhud-Gebet zu rezitieren.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Taslim (Abschluss)',
        description: 'Drehe den Kopf nach rechts, dann nach links und sage jeweils \'Assalamu Alaikum wa Rahmatullah\'.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
    ],
    tips: ['Nimm jede Position ruhig ein.', 'Lerne die Bedeutung der gesprochenen Worte.', 'Beachte die Gebetszeiten.'],
  },
  {
    id: 'what-to-say',
    title: 'Was sagt man im Gebet?',
    intro: 'Überlieferte Wortlaute und sinngemäße Bedeutungen als Lernhilfe. Die Auswahl bildet nicht sämtliche Varianten und Rechtsschulregeln ab.',
    steps: [
      {
        title: 'Takbir (Beginn & Wechsel)',
        description: 'Gott ist am größten.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
        source: 'Sahih al-Bukhari 789 · Wechsel-Takbir',
        sourceUrl: 'https://sunnah.com/bukhari:789',
      },
      {
        title: 'Eröffnung Bittgebet (Sana)',
        description: 'Gepriesen seist Du, o Allah, und Dir gebührt das Lob. Gesegnet ist Dein Name, erhaben ist Deine Majestät, und es gibt keinen Gott außer Dir.',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabaraka ismuka, wa ta\'ala jadduka, wa la ilaha ghayruka',
        source: 'Jami at-Tirmidhi 243 · hasan nach Darussalam; die Quelle nennt Kritik an einem Überlieferer',
        sourceUrl: 'https://sunnah.com/tirmidhi:243',
      },
      {
        title: 'Al-Fatiha (Die Eröffnende)',
        description: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen. Alles Lob gehört Allah, dem Herrn der Welten, dem Allerbarmen, dem Barmherzigen, dem Herrscher am Tag des Gerichts. Dir allein dienen wir, und Dich allein bitten wir um Hilfe. Führe uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den der Irregehenden.',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Bismillahi r-rahmani r-rahim. Alhamdu lillahi rabbil-\'alamin. Ar-rahmani r-rahim. Maliki yawmid-din. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an\'amta \'alayhim ghayril-maghdubi \'alayhim wa lad-dallin.',
        source: 'Quran 1:1–7 · sinngemäße Bedeutung und vereinfachte Lesehilfe',
        sourceUrl: 'https://quran.com/1',
      },
      {
        title: 'Im Ruku (Verbeugung)',
        description: 'Sinngemäße Bedeutung: Gepriesen sei mein Herr, der Gewaltige. Dreimal ist hier eine Lernfolge, keine allgemeine Aussage zum Mindestumfang aller Rechtsschulen.',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيم',
        transliteration: 'Subhana Rabbiyal Adhim',
        source: 'Jami at-Tirmidhi 262 · Wortlaut, sahih nach Darussalam; keine allgemeine Mindestzahl',
        sourceUrl: 'https://sunnah.com/tirmidhi:262',
      },
      {
        title: 'Beim Aufrichten aus dem Ruku',
        description: 'Allah hört den, der Ihn lobt. Unser Herr, Dir gebührt alles Lob.',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا وَلَكَ الْحَمْد',
        transliteration: 'Sami Allahu liman hamidah. Rabbana wa lakal hamd',
        source: 'Sahih al-Bukhari 722 und 789 · Lobpreis und Zuordnung der Antwort hinter dem Imam',
        sourceUrl: 'https://sunnah.com/bukhari:722',
      },
      {
        title: 'Im Sujud (Niederwerfung)',
        description: 'Sinngemäße Bedeutung: Gepriesen sei mein Herr, der Höchste. Dreimal ist hier eine Lernfolge, keine allgemeine Aussage zum Mindestumfang aller Rechtsschulen.',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
        source: 'Jami at-Tirmidhi 262 · Wortlaut, sahih nach Darussalam; keine allgemeine Mindestzahl',
        sourceUrl: 'https://sunnah.com/tirmidhi:262',
      },
      {
        title: 'Zwischen den Niederwerfungen',
        description: 'Mein Herr, vergib mir.',
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbi ighfir li',
        source: 'Sunan Ibn Majah 897 · Rabbighfir li, sahih nach Darussalam',
        sourceUrl: 'https://sunnah.com/ibnmajah:897',
      },
      {
        title: 'Tashahhud (Erster Teil)',
        description: 'Sinngemäße Bedeutung des vollständig angezeigten Wortlauts: Grüße, Gebete und gute Dinge gebühren Allah. Es folgen Friedenswünsche für den Propheten und Allahs rechtschaffene Diener sowie das Glaubensbekenntnis.',
        arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu \'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu \'alayna wa \'ala \'ibadillahi s-salihin. Ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan \'abduhu wa rasuluh.',
        source: 'Sunan an-Nasa’i 1170 · Ibn-Masud-Form, sahih nach Darussalam',
        sourceUrl: 'https://sunnah.com/nasai:1170',
      },
      {
        title: 'Salawat (Segenswünsche)',
        description: 'Sinngemäße Inhaltsangabe: Bitte um Segnung und Segen für Muhammad und seine Familie, mit Bezug auf Ibrahim und seine Familie. Arabisch ist die hier ausgewählte vollständige Formel; weitere überlieferte Fassungen bestehen.',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad, kama sallayta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik \'ala Muhammadin wa \'ala ali Muhammad, kama barakta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid.',
        source: 'Sahih al-Bukhari 3370 · ausgewählte Salawat-Fassung',
        sourceUrl: 'https://sunnah.com/bukhari:3370',
      },
      {
        title: 'Dua nach Salawat',
        description: 'O Allah, ich nehme Zuflucht bei Dir vor der Strafe der Hölle, vor der Strafe des Grabes, vor den Versuchungen des Lebens und des Todes und vor der Versuchung des falschen Messias.',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Allahumma inni a\'udhu bika min \'adhabi jahannam, wa min \'adhabi l-qabr, wa min fitnati l-mahya wal-mamat, wa min sharri fitnati l-masihi d-dajjal.',
        source: 'Sahih Muslim 588a · Zuflucht vor vier Dingen; rechtliche Einordnung nicht in allen Schulen gleich',
        sourceUrl: 'https://sunnah.com/muslim:588a',
      },
      {
        title: 'Taslim (Abschluss)',
        description: 'Der Friede und die Barmherzigkeit Allahs seien mit euch. (Nach rechts und links)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'Assalamu \'alaikum wa rahmatullah',
        source: 'Sunan an-Nasa’i 1320 · Salam rechts und links, sahih nach Darussalam',
        sourceUrl: 'https://sunnah.com/nasai:1320',
      },
    ],
    tips: ['Übe die Texte außerhalb des Gebets in deinem eigenen Tempo.', 'Lesen von einem Zettel oder Mushaf während des Gebets wird unterschiedlich eingeordnet; dafür gibt es keine pauschale Erlaubnis für alle Rechtsschulen.'],
  },
  {
    id: 'mandatory',
    title: 'Pflichtteile & Grundlagen',
    intro: 'Wichtige Voraussetzungen und Bestandteile des Gebets. Die Rechtsschulen unterscheiden Bedingungen, Säulen, Pflichten und Empfehlungen; diese Übersicht ist keine gemeinsame abschließende Gültigkeitsliste.',
    steps: [
      {
        title: 'Die Absicht (Niyyah)',
        description: 'Die Absicht bestimmt im Herzen, welches Gebet verrichtet wird. Eine ausgesprochene Formel ist keine allgemeine Voraussetzung.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Stehen (Qiyam)',
        description: 'Das Stehen bei den Pflichtgebeten, wenn man dazu in der Lage ist.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Takbir al-Ihram',
        description: 'Das Sprechen von \'Allahu Akbar\' zu Beginn des Gebets.',
        arabic: 'اللَّهُ أَكْبَر',
        transliteration: 'Allahu Akbar',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Rezitation der Al-Fatiha',
        description: 'Al-Fatihah besitzt eine zentrale Bedeutung im Gebet. Die Pflicht zur eigenen Rezitation, besonders hinter dem Imam, wird zwischen den Rechtsschulen unterschiedlich bestimmt.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Ruku (Verbeugung)',
        description: 'Das Verbeugen, sodass die Hände die Knie erreichen.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Aufrichten aus dem Ruku',
        description: 'Das vollständige Aufrichten nach der Verbeugung.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Sujud (Niederwerfung)',
        description: 'Die Niederwerfung auf sieben Körperteilen (Stirn/Nase, beide Hände, beide Knie, Zehen beider Füße).',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Sitzen zwischen den Sujud',
        description: 'Das aufrechte Sitzen zwischen den beiden Niederwerfungen.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Das letzte Sitzen & Tashahhud',
        description: 'Das Sitzen am Ende des Gebets und das Sprechen des Tashahhud.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Taslim',
        description: 'Das Beenden des Gebets mit dem Friedensgruß.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Ruhe (Tuma\'ninah)',
        description: 'Das ruhige Verweilen in jeder Position, ohne Hast.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Reihenfolge (Tartib)',
        description: 'Der Gebetskurs zeigt eine geordnete Abfolge. Die rechtliche Einordnung und Folgen einer ausgelassenen oder vertauschten Handlung sind schulabhängig.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
    ],
    tips: ['Ein fehlender wesentlicher Bestandteil wird nicht automatisch durch Sujud as-Sahw ersetzt. Die konkrete Korrektur hängt vom Fehler und der Rechtsschule ab.', 'Nimm die Gebetspositionen ruhig ein.'],
  },
  {
    id: 'mistakes',
    title: 'Häufige Fehler',
    intro: 'Jeder macht Fehler, besonders am Anfang. Hier sind einige Dinge, auf die du achten solltest, um dein Gebet zu verbessern.',
    steps: [
      {
        title: 'Zu schnelles Beten',
        description: 'Das Gebet hastig auszuführen, ohne in den Positionen zur Ruhe zu kommen (fehlende Tuma\'ninah). Nimm dir Zeit für jede Bewegung.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Umherschauen',
        description: 'Der Blick sollte während des Stehens auf den Ort der Niederwerfung (Sujud) gerichtet sein, nicht nach oben oder zur Seite.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Unvollständiger Sujud',
        description: 'Sicherstellen, dass alle 7 Körperteile (Stirn/Nase, Hände, Knie, Zehen) den Boden berühren. Die Füße sollten nicht in der Luft sein.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Vor dem Imam bewegen',
        description: 'Beim Gemeinschaftsgebet darf man sich nicht vor dem Imam bewegen. Man folgt ihm, nachdem er den Takbir gesprochen hat.',
        source: 'Sahih al-Bukhari 722 · dem Imam folgen',
        sourceUrl: 'https://sunnah.com/bukhari:722',
      },
      {
        title: 'Laute Rezitation bei leisen Gebeten',
        description: 'Lautes und leises Rezitieren hängen von Gebetsart und Rolle ab: Alleinbetender, Imam oder Mitbetender. Die App erklärt nicht eine einzige Hörbarkeitsgrenze zur Bedingung aller Rechtsschulen.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Kleidung während des Gebets richten',
        description: 'Die Beurteilung von Bewegungen hängt unter anderem von Art, Umfang, Notwendigkeit und Rechtsschule ab. Dieser Überblick legt keine einheitliche Anzahl fest und erklärt nicht jede notwendige Anpassung der Kleidung zum Gebetsfehler.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
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
    intro: 'Für bestimmte versehentliche Fehler sind zwei Ausgleichs-Niederwerfungen überliefert. Nicht jeder Fehler hat dieselben Folgen; Sujud as-Sahw ersetzt nicht pauschal alles Fehlende.',
    steps: [
      {
        title: 'Was Sujud as-Sahw ist',
        description: 'Zwei Niederwerfungen zur Korrektur bestimmter versehentlicher Fehler. Al-Bukhari 1224 beschreibt sie vor dem Salam nach ausgelassenem Sitzen; 1229 beschreibt zunächst das Ergänzen fehlender Einheiten und dann Niederwerfungen nach dem Salam.',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
        sourceUrl: 'https://sunnah.com/bukhari:1224',
        source: 'Sahih al-Bukhari 1224 und 1229 · unterschiedliche konkrete Fälle',
      },
      {
        title: 'Das Sitzen nach der zweiten Einheit fehlt',
        description: 'Al-Bukhari 1224 berichtet vom Aufstehen nach der zweiten Einheit ohne Sitzen und zwei Niederwerfungen vor dem Salam. Das ist keine pauschale Regel für jeden als Pflicht bezeichneten Bestandteil. Ob zurückgekehrt oder weitergebetet wird, hängt vom erreichten Zustand und der Rechtsschule ab.',
        sourceUrl: 'https://sunnah.com/bukhari:1224',
        source: 'Sahih al-Bukhari 1224 · ausgelassenes Sitzen nach der zweiten Einheit',
      },
      {
        title: 'Du bist dir unsicher, wie viele Rakʿah',
        description: 'Muslim 571a beschreibt bei nicht auflösbarem Zweifel das Weiterbeten auf Grundlage der sicheren Zahl und zwei Niederwerfungen vor dem Salam. Andere Zweifelssituationen und schulabhängige Regeln werden durch diesen einen Bericht nicht vollständig beantwortet.',
        sourceUrl: 'https://sunnah.com/muslim:571a',
        source: 'Sahih Muslim 571a · nicht auflösbarer Zweifel zwischen drei und vier Einheiten',
      },
      {
        title: 'Du hast eine Rakʿah zu viel gebetet',
        description: 'Zusätzliche Einheiten sind ein eigener Fehlerfall. Zeitpunkt des Bemerkens, bewusstes oder versehentliches Handeln und Rechtsschule sind für die Korrektur relevant. Diese Übersicht gibt deshalb keinen universellen Ablauf für jede zusätzliche Einheit.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Wann die Niederwerfung erfolgt',
        description: 'Nach dem letzten Tashahhud. Ob vor oder nach dem Salam, unterscheidet sich zwischen den Rechtsschulen und je nach Art des Versehens — eine qualifizierte Lehrperson kann sagen, was in deiner Rechtsschule gilt.',
        source: 'Sahih al-Bukhari 1224 und 1229; Sahih Muslim 571a · verschiedene überlieferte Fehlerfälle',
        sourceUrl: 'https://sunnah.com/bukhari:1229',
      },
      {
        title: 'Was Sujud as-Sahw nicht heilt',
        description: 'Al-Bukhari 1229 beschreibt das Ergänzen zweier fehlender Einheiten vor den Ausgleichs-Niederwerfungen. Der Bericht stützt keine Aussage, dass zwei Niederwerfungen jeden fehlenden Bestandteil ersetzen.',
        sourceUrl: 'https://sunnah.com/bukhari:1229',
        source: 'Sahih al-Bukhari 1229 · Ergänzen fehlender Einheiten',
      },
      {
        title: 'Falsch rezitiert oder verhaspelt',
        description: 'Stocken, ein korrigierter Versprecher und ein Fehler, der den Sinn verändert, sind nicht gleichzusetzen. Die Gültigkeit kann nicht allein aus dem Wort Versprecher beurteilt werden. Für die Folgen zählen Art des Fehlers, Korrektur und Rechtsschule.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
    ],
    tips: ['Ein gelegentlicher Zweifel und wiederkehrende belastende Zweifel sind unterschiedlich zu behandeln.', 'Bei wiederkehrender Unsicherheit nicht eigenständig jedes Gebet wiederholen; die passende Regel hängt vom konkreten Fall ab.'],
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
        source: 'Dar al-Ifta Ägypten · How to become a Muslim: Bekenntnis und Einstieg',
        sourceUrl: 'https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim',
      },
      {
        title: 'Erster Teil: „Kein Gott außer Allah“',
        description: 'Das Bekenntnis, dass allein Allah Anbetung gebührt und Ihm nichts und niemand beigesellt wird. Es ist der Kern des Islam, auf dem alles Weitere steht.',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
        transliteration: 'La ilaha illallah',
        source: 'Dar al-Ifta Ägypten · How to become a Muslim: Bekenntnis und Einstieg',
        sourceUrl: 'https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim',
      },
      {
        title: 'Zweiter Teil: „Muhammad ist der Gesandte Allahs“',
        description: 'Das Bekenntnis, dass Muhammad ﷺ von Allah gesandt wurde und die Botschaft überbracht hat. Damit wird angenommen, was er gelehrt hat — der Quran und seine Sunnah.',
        arabic: 'مُحَمَّدٌ رَسُولُ اللَّهِ',
        transliteration: 'Muhammadun rasulullah',
        source: 'Dar al-Ifta Ägypten · How to become a Muslim: Bekenntnis und Einstieg',
        sourceUrl: 'https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim',
      },
      {
        title: 'Wo sie im Alltag vorkommt',
        description: 'Das Glaubensbekenntnis begegnet im Tashahhud. Die hier gelernte Bekenntnisfassung und die im Gebetskurs angegebene Tashahhud-Fassung sind nicht wortgleich.',
        source: 'Sunan an-Nasa’i 1170 · Bekenntnis im Ibn-Masud-Tashahhud',
        sourceUrl: 'https://sunnah.com/nasai:1170',
      },
      {
        title: 'Wenn du den Islam annehmen möchtest',
        description: 'Dar al-Ifta beschreibt das aufrichtige Bekenntnis mit Überzeugung als Eintritt in den Islam. Eine öffentliche Zeremonie oder amtliche Bescheinigung ist dort keine Voraussetzung. Eine Moschee kann beim weiteren Lernen unterstützen.',
        source: 'Dar al-Ifta Ägypten · How to become a Muslim: Bekenntnis und Einstieg',
        sourceUrl: 'https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim',
      },
      {
        title: 'Was danach kommt',
        description: 'Dar al-Ifta empfiehlt danach eine vollständige Waschung zur Vorbereitung auf das Gebet und das Lernen der religiösen Pflichten. Einzelheiten der Reinheit und des Gebets stehen in den jeweiligen Lernbereichen.',
        source: 'Dar al-Ifta Ägypten · How to become a Muslim: Bekenntnis und Einstieg',
        sourceUrl: 'https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim',
      },
    ],
    tips: ['Verstehe die Bedeutung des Bekenntnisses.', 'Lerne die Aussprache und die weitere Praxis Schritt für Schritt.'],
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
        description: 'Gesicht und Hände werden in der verbreiteten Einordnung von der Bedeckung ausgenommen; zu den Füßen bestehen unterschiedliche Auffassungen. Eine einzelne Auffassung wird hier nicht als Regel aller Rechtsschulen ausgegeben.',
        sourceUrl: 'https://www.dar-alifta.org/ar/Fatwa/Details/16173/حكم-كشف-قدم-المرأة-في-الصلاة-وخارجها',
        source: 'Dar al-Ifta Ägypten · Fatwa 5499 vom 09.11.2003: unterschiedliche Einordnung der Füße',
      },
      {
        title: 'Die Haltung in Ruku und Sujud',
        description: 'Die hanafitische Ablaufbeschreibung in TDV NAMAZ unterscheidet einzelne Haltungen von Frauen und Männern. Daraus wird keine verbindliche Regel sämtlicher Rechtsschulen abgeleitet.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Menstruation und Wochenbett',
        description: 'Muslim 335c berichtet für Menstruation, dass ausgefallenes Fasten nachgeholt wurde, Gebete dagegen nicht. Die Bestimmung von Menstruation, Wochenbett und anderen Blutungen hat eigene Regeln; eine unklare Blutung wird hier nicht automatisch einer dieser Kategorien zugeordnet.',
        source: 'Sahih Muslim 335c · Menstruation und Nachholen; keine vollständige Blutungsdiagnose',
        sourceUrl: 'https://sunnah.com/muslim:335c',
      },
      {
        title: 'Laut oder leise rezitieren',
        description: 'Der Grundablauf unterscheidet hörbare und leise Rezitation. Die Einzelheiten hängen auch davon ab, ob jemand allein, als Imam oder hinter dem Imam betet. Dieser Überblick legt keine gesonderte Lautstärkeregel für Frauen fest.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Im Gemeinschaftsgebet',
        description: 'Gemeinschaftsgebet, Reihen und Vorbeten werden in den Rechtsschulen unterschiedlich eingeordnet. Diese Übersicht gibt keine allgemeine Erlaubnis oder Verbotsregel zum Vorbeten einer Frau aus.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ: Ablauf und Schulunterschiede',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Moschee oder zu Hause',
        description: 'Al-Bukhari 900 überliefert, Frauen nicht vom Besuch der Moscheen Allahs abzuhalten. Der Bericht wird hier ohne eine pauschale Rangfolge für jede persönliche Situation wiedergegeben.',
        source: 'Sahih al-Bukhari 900 · Moscheebesuch von Frauen',
        sourceUrl: 'https://sunnah.com/bukhari:900',
      },
      {
        title: 'Wenn Kinder dazwischenkommen',
        description: 'Al-Bukhari 516 beschreibt das Gebet mit Umama: Der Prophet trug sie im Stehen und setzte sie beim Niederwerfen ab. Der Bericht erlaubt nicht pauschal jede Art oder Menge an Bewegung im Gebet.',
        source: 'Sahih al-Bukhari 516 · Tragen und Absetzen von Umama während des Gebets',
        sourceUrl: 'https://sunnah.com/bukhari:516',
      },
    ],
    tips: ['Die Einordnung einzelner Haltungen kann sich zwischen Rechtsschulen unterscheiden.', 'Die Quelle zum Nachholen bezieht sich ausdrücklich auf Menstruation; unklare Blutungen brauchen eine eigene Einordnung.'],
  },
  {
    /**
     * Der Kurs führt die fünf Pflichtgebete. Was sonst noch gebetet wird, kam
     * in der App nirgends vor — obwohl die Sunnah-Gebete zum Alltag der meisten
     * gehören und das Witr für viele jeden Abend dazukommt.
     */
    id: 'more-prayers',
    title: 'Weitere Gebete',
    intro: 'Hier stehen unterschiedliche zusätzliche Gebete und das Freitagsgebet. Sie besitzen nicht alle denselben rechtlichen Rang. Das Freitagsgebet ist unter seinen Voraussetzungen verpflichtend; auch Witr wird schulabhängig eingeordnet.',
    steps: [
      {
        title: 'Sunnah-Gebete rund um die Pflicht (Rawatib)',
        description: 'Tirmidhi 415 nennt zwölf Einheiten: zwei vor Fajr, vier vor und zwei nach Dhuhr, zwei nach Maghrib und zwei nach Isha. Das ist eine belegte Auswahl, keine vollständige Liste aller zusätzlich überlieferten Gebete.',
        source: 'Jami at-Tirmidhi 415 · sahih nach Darussalam; at-Tirmidhi nennt hasan sahih',
        sourceUrl: 'https://sunnah.com/tirmidhi:415',
      },
      {
        title: 'Die zwei vor Fajr',
        description: 'Muslim 725a würdigt die zwei Einheiten vor Fajr. Muslim 726 berichtet dort die Rezitation von Al-Kafirun und Al-Ikhlas; das ist eine belegte Fassung, keine Behauptung, nur diese Suren seien zulässig.',
        source: 'Sahih Muslim 725a und 726 · Vorzug und eine Rezitationsfassung',
        sourceUrl: 'https://sunnah.com/muslim:726',
      },
      {
        title: 'Witr — der Abschluss der Nacht',
        description: 'Witr ist ein nächtliches Gebet mit ungerader Einheitenzahl. Hanafitisch wird es als wajib eingeordnet, in anderen Rechtsschulen als Sunnah. Zahl und Ablauf unterscheiden sich; eine einzelne Einheit ist keine pauschale Anleitung für jede Schule.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, Abschnitt Gebetsarten; al-Bukhari 1137 zur überlieferten Nachtgebetsfolge',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Tahajjud — das Nachtgebet',
        description: 'Al-Bukhari 1137 beschreibt das Nachtgebet in Zweiergruppen und einen ungeraden Abschluss vor der Morgendämmerung. Aus diesem Bericht wird keine einzige notwendige Uhrzeit innerhalb der Nacht abgeleitet.',
        source: 'Sahih al-Bukhari 1137 · Ausführung des Nachtgebets',
        sourceUrl: 'https://sunnah.com/bukhari:1137',
      },
      {
        title: 'Duha — der Vormittag',
        description: 'Duha bezeichnet ein freiwilliges Gebet am Vormittag, nachdem die Sonne ausreichend gestiegen ist und vor dem Zeitpunkt des Mittagszenits. Dieser Überblick legt keine allgemeine maximale Einheitenzahl für alle Schulen fest.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Das Freitagsgebet (Jumuah)',
        description: 'Die Freitagsansprache und das anschließende Gemeinschaftsgebet gehören zusammen. Wer die Ansprache verpasst hat, hat damit nicht automatisch das Gebet verpasst. Wird das Freitagsgebet tatsächlich verpasst, wird Dhuhr mit vier Einheiten verrichtet; Einzelheiten des verspäteten Anschlusses sind gesondert zu prüfen.',
        sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/22217/manner-of-making-up-the-missed-friday-prayer',
        source: 'Dar al-Ifta Ägypten · Manner of making up the missed Friday prayer',
      },
      {
        title: 'Wenn du zwischen Pflicht und Sunnah wählen musst',
        description: 'Pflichtgebete werden nicht durch zusätzliche Gebete ersetzt. Der genaue Rang einer zusätzlich genannten Gebetsart muss einzeln betrachtet werden; nicht alles außerhalb der fünf Pflichtgebete ist ohne Weiteres gleich einzuordnen.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
    ],
    tips: ['Lerne Gebetsarten und ihren jeweiligen Rang getrennt kennen.', 'Eine persönliche Lernroutine ersetzt keine religiösen Pflichten.'],
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
        description: 'Die Verkürzung betrifft unter ihren Voraussetzungen die viergliedrigen Pflichtgebete Dhuhr, Asr und Isha. Entfernung, Aufenthaltsabsicht und Reiseende werden je nach Rechtsschule bestimmt; eine beliebige Ortsfahrt genügt nicht.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Auf Reisen: zwei Gebete zusammenlegen (Jam)',
        description: 'Das Zusammenlegen von Dhuhr/Asr oder Maghrib/Isha wird nicht von allen Rechtsschulen als allgemeine Reiseerleichterung erlaubt. Die hanafitische Schule unterscheidet echtes Zusammenlegen von zwei Gebeten an den benachbarten Grenzen ihrer eigenen Zeiten; besondere Hajj-Fälle sind gesondert zu betrachten.',
        source: 'Darul Iftaa Chicago, 16.03.2026 · hanafitische Unterscheidung von echtem und scheinbarem Zusammenlegen',
        sourceUrl: 'https://daruliftaa.us/fatwa/1328/',
      },
      {
        title: 'Ein Gebet ist ausgefallen',
        description: 'Al-Bukhari 597 beschreibt das Nachholen eines vergessenen Gebets beim Erinnern. Verschlafen, bewusstes Auslassen und Hindernisse haben eigene Einordnungen; dieser Beleg ist keine vollständige Regel für jeden versäumten Fall.',
        sourceUrl: 'https://sunnah.com/bukhari:597',
        source: 'Sahih al-Bukhari 597 · vergessenes Gebet',
      },
      {
        title: 'Mehrere Gebete nachholen',
        description: 'Reihenfolge, Dringlichkeit und ein möglicher Konflikt mit der aktuellen Gebetszeit werden schulabhängig behandelt. Die App gibt dafür keine pauschale Reihenfolgeregel aus, insbesondere nicht für über Jahre versäumte Gebete.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Im Sitzen beten',
        description: 'Al-Bukhari 1117 nennt Stehen, bei Unfähigkeit Sitzen und bei weiterer Unfähigkeit Liegen auf der Seite. Wer einzelne Bewegungen noch ausführen kann, ist nicht automatisch von allen anderen befreit; die konkrete Ausführung hängt von den Möglichkeiten ab.',
        sourceUrl: 'https://sunnah.com/bukhari:1117',
        source: 'Sahih al-Bukhari 1117 · Gebet nach körperlicher Fähigkeit',
      },
      {
        title: 'Wenn die Zeit knapp wird',
        description: 'Al-Bukhari 580 spricht vom Erreichen einer vollständigen Einheit innerhalb der Zeit. Das ist keine Erlaubnis, Gebete absichtlich bis zum Zeitende aufzuschieben, und keine vollständige Darstellung aller Grenzfälle.',
        sourceUrl: 'https://sunnah.com/bukhari:580',
        source: 'Sahih al-Bukhari 580 · eine Einheit innerhalb der Zeit',
      },
      {
        title: 'Unterwegs ohne Gebetsplatz',
        description: 'Ein eigens gekaufter Gebetsteppich ist kein vorgeschriebener Gegenstand dieser Lernfolge. Reinigung des Gebetsorts und das Ermitteln der Qibla sind eigene Fragen. Bloße Schätzung begründet hier keine pauschale Gültigkeitszusage.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
    ],
    tips: ['Verkürzen und Zusammenlegen sind unterschiedliche Regeln.', 'Erleichterungen haben Voraussetzungen und ersetzen keine beliebige Veränderung des Gebets.'],
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
        description: 'Überliefert ist ein Festgebet mit anschließender Ansprache. Anzahl und Position zusätzlicher Takbirat sowie der rechtliche Rang werden je nach Rechtsschule unterschiedlich eingeordnet. Die App legt dafür keine allgemeine Takbir-Reihenfolge fest.',
        source: 'TDV İslâm Ansiklopedisi · NAMAZ, M. Kamil Yaşaroğlu: Begriffe und Schulunterschiede; keine Einzelfall-Fatwa',
        sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
      },
      {
        title: 'Das Totengebet (Janazah)',
        description: 'Al-Bukhari 1333 berichtet ein Totengebet mit vier Takbirat und geordneten Reihen. Aus diesem Bericht allein werden nicht sämtliche Bestandteile, rechtlichen Bedingungen oder Varianten abgeleitet.',
        source: 'Sahih al-Bukhari 1333 · vier Takbirat im berichteten Totengebet',
        sourceUrl: 'https://sunnah.com/bukhari:1333',
      },
      {
        title: 'Janazah: die vier Takbirat der Reihe nach',
        description: 'Al-Bukhari 1335 berichtet Al-Fatihah im Totengebet. Die Einordnung dieser Rezitation und der weiteren Bestandteile ist schulabhängig. Der Bericht wird nicht als universelle Anleitung für jede Rechtsschule ausgegeben.',
        source: 'Sahih al-Bukhari 1335; TDV NAMAZ zur schulabhängigen Ausgestaltung',
        sourceUrl: 'https://sunnah.com/bukhari:1335',
      },
      {
        title: 'Istikhara — vor einer Entscheidung',
        description: 'Al-Bukhari 1166 beschreibt zwei Einheiten außerhalb des Pflichtgebets und das Bittgebet bei einer beabsichtigten Angelegenheit. Der angezeigte arabische Text und die Lesehilfe sind nur der Anfang, nicht das vollständige Bittgebet. Die App stellt keine notwendige Traumantwort oder zusätzliche feste Formel auf.',
        arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
        transliteration: 'Allahumma inni astakhiruka bi ’ilmika, wa astaqdiruka bi qudratika, wa as’aluka min fadlikal-’adhim',
        sourceUrl: 'https://sunnah.com/bukhari:1166',
        source: 'Sahih al-Bukhari 1166 · vollständiger Wortlaut in der Fundstelle; hier ausdrücklich ein Auszug',
      },
      {
        title: 'Zwei Rakʿah beim Betreten der Moschee',
        description: 'Al-Bukhari 444 beschreibt zwei Einheiten vor dem Hinsetzen. Während einer Freitagsansprache bestehen unterschiedliche juristische Einordnungen; Muslim 875a berichtet ausdrücklich von einer Aufforderung zum Gebet während der Ansprache.',
        sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/7874/is-it-permissible-to-perform-sunnah-prayer-upon-entrance-to-the-mosque-when-frid',
        source: 'Sahih al-Bukhari 444; Sahih Muslim 875a; Dar al-Ifta, Fatwa 7874 zum Schulunterschied',
      },
      {
        title: 'Das Gebet der Reue',
        description: 'Dar al-Ifta nennt ein Gebet mit zwei Einheiten als begleitende Empfehlung zur Reue. Gebetszeiten und Ausnahmen sind gesondert zu beachten. Aufhören, Bedauern und verletzte Rechte bleiben eigene Voraussetzungen.',
        sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/7148/how-can-i-repent-from-a-sin-so-god-would-forgive-me',
        source: 'Dar al-Ifta Ägypten · Bedingungen und begleitende Empfehlungen der Reue',
      },
      {
        title: 'Zeiten, in denen nicht gebetet wird',
        description: 'Muslim 831 nennt Sonnenaufgang, Mittagszenit und Sonnenuntergang; al-Bukhari 588 nennt zusätzlich die Zeit nach Fajr und nach Asr. Welche Gebete und Ausnahmen jeweils betroffen sind, wird schulabhängig bestimmt. Eine pauschale Ausnahme für sämtliche Pflicht- und Nachholgebete wird hier nicht behauptet.',
        sourceUrl: 'https://sunnah.com/muslim:831',
        source: 'Sahih Muslim 831; Sahih al-Bukhari 588 · Zeiträume, kein vollständiger Ausnahmevergleich',
      },
    ],
    tips: ['Für Janazah, Eid und andere Anlässe unterscheiden sich Einzelheiten der Durchführung.', 'Istikhara 1166 nennt ein Gebet und Bittgebet, aber keine notwendige Traum- oder Zeichenantwort.'],
  },
];

export const WORSHIP_GUIDE_BY_ID = new Map(WORSHIP_GUIDES.map((guide) => [guide.id, guide]));
