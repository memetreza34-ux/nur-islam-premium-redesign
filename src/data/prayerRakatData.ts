/**
 * Der Ablauf des Pflichtgebets, Rakʿah für Rakʿah.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`
 * (`src/services/prayerLearningData.ts`), wo jeder Schritt bereits arabischen
 * Wortlaut, Umschrift und deutsche Bedeutung trug. Der Lernbereich hier führte
 * stattdessen sieben allgemeine Positionen ohne Wortlaut, gleich für alle fünf
 * Gebete — man konnte daraus nicht beten lernen, weil nirgends stand, was man
 * in welcher Rakʿah tatsächlich sagt.
 *
 * Arabischer Text, Umschrift und Bedeutung sind wortgleich übernommen und
 * stehen als solche auf der Prüfliste (`npm run review:write`). Die
 * Zusammensetzung der Rakʿah unterscheidet sich zwischen den Rechtsschulen in
 * Details; der Bildschirm weist darauf hin.
 */

/** Körperhaltung während des Schritts — bestimmt Bild und Beschriftung. */
export type PrayerPosture = 'takbir' | 'qiyam' | 'ruku' | 'standing' | 'sujud' | 'sitting' | 'rising' | 'taslim';

export type RakatStep = {
  id: string;
  title: string;
  description: string;
  posture: PrayerPosture;
  /** Wortlaut, wo es einen festen gibt. Schritte ohne sind reine Bewegung. */
  arabic?: string;
  transliteration?: string;
  translation?: string;
  /**
   * Wie oft der Wortlaut gesprochen wird. Stand vorher nur im Beschreibungssatz
   * („Sage dreimal"), womit die Zahl in der Schrittliste unsichtbar war und man
   * beim Üben raten musste. Als eigenes Feld steht sie überall, wo der Schritt
   * auftaucht.
   */
  repetitions?: number;
  /** Wo die Zahl nicht fest ist, sagt dieser Zusatz warum. */
  repetitionNote?: string;
  /**
   * Beschriftung der einzelnen Durchgänge, wo sie sich unterscheiden. Beim
   * Taslim ist der erste nach rechts und der zweite nach links gerichtet —
   * eine bloße „1.“ und „2.“ würde das verschweigen. Ohne Angabe werden die
   * Durchgänge einfach gezählt.
   */
  repetitionLabels?: readonly string[];
  /**
   * Woher der Wortlaut stammt. Duas, Dhikr und die Hadith-Sammlung der App
   * tragen das längst (`npm run content-sources:check`), die Gebetsschritte
   * waren die Lücke: hier stand arabischer Wortlaut ohne jeden Beleg.
   *
   * Koranstellen sind exakt angegeben. Bei den überlieferten Formeln steht die
   * Sammlung ohne Nummer — die Nummerierung unterscheidet sich zwischen den
   * Ausgaben, und geraten wird sie nicht. Das Schließen dieser Lücke ist Arbeit
   * für eine fachliche Prüfung, kein Build-Schritt; genauso hält es
   * `hadithData.ts`.
   */
  source: string;
  /**
   * Fortlaufende Koran-Versnummern für die Rezitation zum Anhören. Nur für die
   * Schritte, die Koran sind — dort gibt es eine Aufnahme eines anerkannten
   * Rezitators (Mishary Alafasy über dieselbe Quelle, aus der die App den
   * Quran-Text bezieht). Für die überlieferten Gebetsformeln gibt es keine
   * solche Aufnahme, und eine künstlich erzeugte Stimme steht hier nicht:
   * wer nachspricht, prägt sich die Aussprache ein, die er hört.
   */
  audioAyahs?: readonly number[];
  /**
   * Aufnahme für die überlieferten Gebetsformeln, die kein Koran sind und
   * deshalb bei der Quran-Quelle nicht vorkommen.
   *
   * Zugeordnet über den arabischen Wortlaut, nicht nach Gehör: die Quelle
   * (Hisn al-Muslim, `hisnmuslim.com/api`) liefert zu jeder Aufnahme den Text
   * mit, sodass der Abgleich prüfbar ist statt geraten. Der Test dazu steht in
   * `prayerRakatData.test.ts`; er vergleicht die hinterlegten Texte Zeichen für
   * Zeichen mit dem, was die Quelle zur selben Datei ausliefert.
   *
   * Bewusst leer bleiben vier Schritte, jeder aus demselben Grund — man würde
   * etwas anderes hören, als man liest. Für Takbir und Taslim führt die Quelle
   * keinen eigenen Eintrag. Beim Bittgebet vor dem Salam weicht die Reihenfolge
   * der Zufluchtnahmen ab. Und das Aufrichten aus dem Ruku trägt hier zwei
   * Formeln, die die Quelle getrennt aufnimmt und deren zweite sie in der
   * längeren überlieferten Fassung spricht.
   */
  audioUrl?: string;
};

/** Wo die Rezitation eines Schritts liegt, in Abspielreihenfolge. */
const QURAN_RECITATION_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';

export function recitationUrls(step: RakatStep): readonly string[] {
  if (step.audioAyahs) return step.audioAyahs.map((ayah) => `${QURAN_RECITATION_BASE}/${ayah}.mp3`);
  return step.audioUrl ? [step.audioUrl] : [];
}

/**
 * Dieselbe Rezitation, so oft wie der Schritt gesprochen wird.
 *
 * Für den Durchlauf: der Tasbih im Ruku steht dreimal auf dem Bildschirm, also
 * klingt er auch dreimal. Ihn einmal abzuspielen, während daneben drei Zeilen
 * stehen, würde genau die Zahl unterlaufen, die der Kurs beibringen will.
 * Beim Koran bleibt es bei einem Durchgang — die Sure wird nicht wiederholt.
 */
export function recitationUrlsForRun(step: RakatStep): readonly string[] {
  const once = recitationUrls(step);
  if (!once.length || step.audioAyahs) return once;
  return Array.from({ length: step.repetitions ?? 1 }, () => once).flat();
}

/**
 * Wie lange ein Schritt im Durchlauf stehen bleibt, wenn es keine Aufnahme
 * gibt, die das Ende ansagt. Bemessen am Lesen: Grundzeit plus Zeit für den
 * Wortlaut, mal der Anzahl der Durchgänge — wer dreimal sprechen soll, braucht
 * die dreifache Zeit.
 */
export function stepRunDuration(step: RakatStep): number {
  const wording = (step.transliteration ?? '').length;
  const perRun = 1600 + wording * 55;
  return Math.min(2200 + perRun * (step.repetitions ?? 1), 26_000);
}

/** Wer die Aufnahme spricht — steht unter dem Wortlaut neben der Belegstelle. */
export function recitationCredit(step: RakatStep): string | null {
  if (step.audioAyahs) return 'Rezitation: Mishary Alafasy';
  return step.audioUrl ? 'Aufnahme: Hisn al-Muslim (hisnmuslim.com)' : null;
}

/**
 * Ob in dieser Rakʿah laut oder leise rezitiert wird. Fehlte bisher komplett —
 * es ist aber der Unterschied zwischen Fajr und Dhuhr, den man beim Beten als
 * Erstes merkt, und ohne den man den Ablauf nicht wirklich kann.
 */
export type Recitation = 'aloud' | 'silent';

export type Rakat = {
  number: number;
  title: string;
  recitation: Recitation;
  steps: readonly RakatStep[];
};

export type RakatPrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type RakatPrayer = {
  id: RakatPrayerId;
  rakats: readonly Rakat[];
};

const TAKBIR: RakatStep = {
  id: 'takbir',
  title: 'Takbir al-Ihram',
  // Ohne Höhenangabe: „zu den Ohren“ ist die hanafitische Position, während
  // Maliki und Shafiʿi Schulterhöhe sagen. Der Rechtsschul-Block am Schritt
  // nennt alle vier.
  description: 'Fasse die Absicht (Niyyah) im Herzen. Hebe die Hände und beginne das Gebet.',
  posture: 'takbir',
  arabic: 'اللَّهُ أَكْبَر',
  transliteration: 'Allahu Akbar',
  translation: 'Allah ist am größten.',
  repetitions: 1,
  source: 'Sahih al-Bukhari; Sahih Muslim',
};

const SANA: RakatStep = {
  id: 'sana',
  title: 'Eröffnungs-Bittgebet (Sana)',
  // Die Maliki-Schule kennt hier kein Eröffnungsbittgebet; „leise rezitieren“
  // als Anweisung wäre für sie schlicht falsch.
  description: 'In den meisten Rechtsschulen folgt hier ein leises Eröffnungsbittgebet:',
  posture: 'qiyam',
  arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
  transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta’ala jadduka, wa la ilaha ghayruk',
  translation: 'Preis sei Dir, o Allah, und Lob sei Dir, und gesegnet ist Dein Name, und hoch erhaben ist Deine Majestät, und es gibt keinen Gott außer Dir.',
  repetitions: 1,
  source: 'Sunan Abu Dawud; Sunan at-Tirmidhi; Sunan Ibn Majah',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/28.mp3',
};

/**
 * Nur in der ersten Rakʿah. Das Ta’awwudh eröffnet die Rezitation des ganzen
 * Gebets und wird nach überwiegender Auffassung nicht in jeder Einheit
 * wiederholt; ab der zweiten Rakʿah steht deshalb `BASMALAH` allein.
 */
const TA_AWWUDH_BASMALAH: RakatStep = {
  id: 'ta-awwudh-basmalah',
  title: 'Zuflucht suchen & Basmalah',
  description: 'Einmal zu Beginn der Rezitation, leise:',
  posture: 'qiyam',
  arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  transliteration: 'A’udhu billahi minash-shaytanir-rajim\nBismillahir-Rahmanir-Rahim',
  translation: 'Ich suche Zuflucht bei Allah vor dem verfluchten Satan. Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
  repetitions: 1,
  repetitionNote: 'Nur in der ersten Rakʿah.',
  source: 'Quran 16:98 (Ta’awwudh); Quran 1:1 (Basmalah)',
};

const BASMALAH: RakatStep = {
  id: 'basmalah',
  title: 'Basmalah',
  // Ob die Basmalah gesprochen wird und wie laut, ist genau der Punkt, an dem
  // die vier Schulen auseinandergehen — der Block darunter sagt es.
  description: 'Vor Al-Fatihah in jeder weiteren Rakʿah. Ob und wie laut, unterscheidet sich je nach Rechtsschule:',
  posture: 'qiyam',
  arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  transliteration: 'Bismillahir-Rahmanir-Rahim',
  translation: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
  repetitions: 1,
  source: 'Quran 1:1',
  audioAyahs: [1],
};

const FATIHA: RakatStep = {
  id: 'fatiha',
  title: 'Sure Al-Fatihah',
  description: 'Diese Sure muss in jeder Rakʿah rezitiert werden:',
  posture: 'qiyam',
  arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  transliteration: 'Alhamdu lillahi rabbil-’alamin\nAr-Rahmanir-Rahim\nMaliki yawmid-din\nIyyaka na’budu wa iyyaka nasta’in\nIhdinas-siratal-mustaqim\nSiratal-ladhina an’amta ’alayhim ghayril-maghdubi ’alayhim wa lad-dallin (Amin)',
  translation: 'Alles Lob gehört Allah, dem Herrn der Welten, dem Allerbarmer, dem Barmherzigen, dem Herrscher am Tag des Gerichts. Dir allein dienen wir, und Dich allein bitten wir um Hilfe. Leite uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den Weg der Irregehenden.',
  repetitions: 1,
  source: 'Quran, Sure 1 (Al-Fatihah)',
  // Die sieben Verse der Fatihah stehen am Anfang des Korans: 1 ist die
  // Basmalah, 2 bis 7 der hier abgedruckte Wortlaut.
  audioAyahs: [2, 3, 4, 5, 6, 7],
};

const SHORT_SURAH: RakatStep = {
  id: 'short-surah',
  title: 'Eine weitere Sure (z. B. Al-Ikhlas)',
  description: 'Nach Al-Fatihah in den ersten beiden Rakʿah:',
  posture: 'qiyam',
  arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  transliteration: 'Qul huwallahu ahad\nAllahus-samad\nLam yalid wa lam yulad\nWa lam yakul-lahu kufuwan ahad',
  translation: 'Sprich: Er ist Allah, ein Einziger, Allah, der Absolute. Er zeugt nicht und ist nicht gezeugt worden, und Ihm ebenbürtig ist keiner.',
  repetitions: 1,
  repetitionNote: 'Jede Sure ist möglich, nicht nur diese.',
  source: 'Quran, Sure 112 (Al-Ikhlas)',
  // Sure 112 beginnt bei der 6222. Ayah des Korans.
  audioAyahs: [6222, 6223, 6224, 6225],
};

const RUKU: RakatStep = {
  id: 'ruku',
  title: 'Ruku (Verbeugung)',
  description: 'Sage „Allahu Akbar“, verbeuge dich mit geradem Rücken, Hände auf den Knien. Komm zur Ruhe, dann sprich:',
  posture: 'ruku',
  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
  transliteration: 'Subhana Rabbiyal Adhim',
  translation: 'Preis sei meinem Herrn, dem Allmächtigen.',
  repetitions: 3,
  repetitionNote: 'Dreimal ist die Sunnah, einmal genügt.',
  source: 'Sunan Abu Dawud; Sunan Ibn Majah',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/33.mp3',
};

const RISING_RUKU: RakatStep = {
  id: 'rising-ruku',
  title: 'Aufrichten aus dem Ruku',
  description: 'Richte dich wieder auf und sage beim Hochgehen „Sami Allahu liman hamidah“, im Stehen dann „Rabbana wa lakal hamd“.',
  posture: 'standing',
  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْدُ',
  transliteration: 'Sami Allahu liman hamidah\nRabbana wa lakal hamd',
  translation: 'Allah hört den, der Ihn lobt. Unser Herr, Dir gebührt alles Lob.',
  repetitions: 1,
  source: 'Sahih al-Bukhari; Sahih Muslim',
};

const SUJUD: RakatStep = {
  id: 'sujud',
  title: 'Sujud (Niederwerfung)',
  description: 'Sage „Allahu Akbar“ und wirf dich nieder (Stirn, Nase, Hände, Knie und Zehen am Boden). Komm zur Ruhe, dann sprich:',
  posture: 'sujud',
  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
  transliteration: 'Subhana Rabbiyal A’la',
  translation: 'Preis sei meinem Herrn, dem Höchsten.',
  repetitions: 3,
  repetitionNote: 'Dreimal ist die Sunnah, einmal genügt.',
  source: 'Sahih Muslim; Sunan Abu Dawud',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/41.mp3',
};

const SITTING_SUJUD: RakatStep = {
  id: 'sitting-sujud',
  title: 'Sitzen zwischen den Niederwerfungen',
  description: 'Sage „Allahu Akbar“, setze dich aufrecht hin, komm zur Ruhe und sprich:',
  posture: 'sitting',
  arabic: 'رَبِّ اغْفِرْ لِي',
  transliteration: 'Rabbighfir li',
  translation: 'Mein Herr, vergib mir.',
  repetitions: 1,
  repetitionNote: 'Auch mehrfach überliefert.',
  source: 'Sunan Abu Dawud; Sunan Ibn Majah',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/48.mp3',
};

const SUJUD_SECOND: RakatStep = {
  ...SUJUD,
  id: 'sujud-second',
  title: 'Zweite Niederwerfung',
  description: 'Sage „Allahu Akbar“, wirf dich ein zweites Mal nieder und sprich wie zuvor:',
};

/**
 * Der Schritt, der bisher fehlte. Nach der zweiten Niederwerfung stand im
 * Ablauf nichts mehr — die Rakʿah hörte einfach auf, und dass man sich mit
 * einem Takbir wieder aufrichtet, stand nirgends.
 */
const RISE_TO_NEXT_RAKAH: RakatStep = {
  id: 'rise-to-next-rakah',
  title: 'Aufstehen zur nächsten Rakʿah',
  description: 'Richte dich aus der Niederwerfung auf und stehe auf. Beim Aufstehen sagst du:',
  posture: 'rising',
  arabic: 'اللَّهُ أَكْبَر',
  transliteration: 'Allahu Akbar',
  translation: 'Allah ist am größten.',
  repetitions: 1,
  source: 'Sahih al-Bukhari; Sahih Muslim',
};

/** Nach dem mittleren Tashahhud geht es im Stehen weiter, ebenfalls mit Takbir. */
const RISE_AFTER_TASHAHHUD: RakatStep = {
  ...RISE_TO_NEXT_RAKAH,
  id: 'rise-after-tashahhud',
  description: 'Stehe nach dem Tashahhud wieder auf und sage dabei:',
};

const TASHAHHUD: RakatStep = {
  id: 'tashahhud',
  title: 'Tashahhud (At-Tahiyyat)',
  description: 'Setze dich hin und rezitiere das Tashahhud:',
  posture: 'sitting',
  arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
  transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu ’alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh, as-salamu ’alayna wa ’ala ’ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan ’abduhu wa rasuluh.',
  translation: 'Alle Ehrerbietungen, Gebete und guten Taten gebühren Allah. Friede sei mit dir, o Prophet, und die Barmherzigkeit Allahs und Seine Segnungen. Friede sei mit uns und mit den rechtschaffenen Dienern Allahs. Ich bezeuge, dass es keinen Gott gibt außer Allah, und ich bezeuge, dass Muhammad Sein Diener und Gesandter ist.',
  repetitions: 1,
  source: 'Sahih al-Bukhari; Sahih Muslim (überliefert von Ibn Masʿud)',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/52.mp3',
};

const SALAWAT: RakatStep = {
  id: 'salawat',
  title: 'Salawat auf den Propheten ﷺ',
  description: 'Im letzten Sitzen folgen nach dem Tashahhud die Segenswünsche (Salawat Ibrahimiyyah):',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
  transliteration: 'Allahumma salli ’ala Muhammadin wa ’ala ali Muhammadin, kama sallayta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid. Allahumma barik ’ala Muhammadin wa ’ala ali Muhammadin, kama barakta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid.',
  translation: 'O Allah, segne Muhammad und die Familie von Muhammad, wie Du Ibrahim und die Familie von Ibrahim gesegnet hast. Wahrlich, Du bist lobenswert und ruhmreich. O Allah, schenke Muhammad und der Familie von Muhammad Segen, wie Du Ibrahim und der Familie von Ibrahim Segen geschenkt hast. Wahrlich, Du bist lobenswert und ruhmreich.',
  repetitions: 1,
  source: 'Sahih al-Bukhari; Sahih Muslim',
  audioUrl: 'https://www.hisnmuslim.com/audio/ar/53.mp3',
};

const DUA_BEFORE_SALAM: RakatStep = {
  id: 'dua-before-salam',
  title: 'Bittgebet vor dem Salam (optional)',
  description: 'Vor dem Beenden des Gebets kann ein Bittgebet gesprochen werden, zum Beispiel:',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
  transliteration: 'Allahumma inni a’udhu bika min ’adhabi jahannam, wa min ’adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal.',
  translation: 'O Allah, ich suche Zuflucht bei Dir vor der Strafe der Hölle, vor der Strafe des Grabes, vor den Versuchungen des Lebens und des Todes und vor der Versuchung des falschen Messias (Dajjal).',
  repetitions: 1,
  repetitionNote: 'Freiwillig; auch ein eigenes Bittgebet ist möglich.',
  source: 'Sahih Muslim',
};

const TASLIM: RakatStep = {
  id: 'taslim',
  title: 'Taslim (Abschluss)',
  description: 'Drehe den Kopf zuerst nach rechts, dann nach links. Beide Male sagst du:',
  posture: 'taslim',
  arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
  transliteration: 'Assalamu Alaikum wa Rahmatullah',
  translation: 'Der Friede und die Barmherzigkeit Allahs seien mit euch.',
  repetitions: 2,
  repetitionNote: 'Einmal nach rechts, einmal nach links.',
  repetitionLabels: ['nach rechts', 'nach links'],
  source: 'Sahih Muslim; Sunan Abu Dawud',
};

/** Der Kern jeder Rakʿah: Verbeugung, Aufrichten, zwei Niederwerfungen. */
const BOWING_AND_PROSTRATION = [RUKU, RISING_RUKU, SUJUD, SITTING_SUJUD, SUJUD_SECOND] as const;

/** Erste Rakʿah: als einzige mit Eröffnungstakbir und Sana. */
const rakatOne = (recitation: Recitation): Rakat => ({
  number: 1,
  title: '1. Rakʿah',
  recitation,
  steps: [TAKBIR, SANA, TA_AWWUDH_BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, RISE_TO_NEXT_RAKAH],
});

/** Zweite Rakʿah im Gebet mit mehr als zwei Einheiten: sitzt zum Tashahhud. */
const rakatTwoMiddle = (recitation: Recitation): Rakat => ({
  number: 2,
  title: '2. Rakʿah',
  recitation,
  steps: [BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, TASHAHHUD, RISE_AFTER_TASHAHHUD],
});

/** In der dritten und vierten Einheit folgt nach Al-Fatihah keine weitere Sure. */
const rakatMiddleShort = (number: number): Rakat => ({
  number,
  title: `${number}. Rakʿah`,
  // Ab der dritten Rakʿah wird in jedem Gebet leise rezitiert.
  recitation: 'silent',
  steps: [BASMALAH, FATIHA, ...BOWING_AND_PROSTRATION, RISE_TO_NEXT_RAKAH],
});

const closingSteps = [TASHAHHUD, SALAWAT, DUA_BEFORE_SALAM, TASLIM] as const;

const rakatFinal = (number: number, withShortSurah: boolean, recitation: Recitation = 'silent'): Rakat => ({
  number,
  title: `${number}. Rakʿah (Abschluss)`,
  recitation,
  steps: withShortSurah
    ? [BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, ...closingSteps]
    : [BASMALAH, FATIHA, ...BOWING_AND_PROSTRATION, ...closingSteps],
});

/** Fajr ist das einzige Pflichtgebet, in dem beide Rakʿah laut rezitiert werden. */
const twoRakatPrayer = (id: RakatPrayerId): RakatPrayer => ({
  id,
  rakats: [rakatOne('aloud'), rakatFinal(2, true, 'aloud')],
});

/** Maghrib: die ersten beiden Rakʿah laut, die abschließende leise. */
const threeRakatPrayer = (id: RakatPrayerId): RakatPrayer => ({
  id,
  rakats: [rakatOne('aloud'), rakatTwoMiddle('aloud'), rakatFinal(3, false)],
});

/**
 * Dhuhr und Asr werden durchgehend leise gebetet, Isha in den ersten beiden
 * Rakʿah laut — der Ablauf ist derselbe, nur die Stimme unterscheidet sich.
 */
const fourRakatPrayer = (id: RakatPrayerId, openingRecitation: Recitation): RakatPrayer => ({
  id,
  rakats: [rakatOne(openingRecitation), rakatTwoMiddle(openingRecitation), rakatMiddleShort(3), rakatFinal(4, false)],
});

export const PRAYER_RAKATS: readonly RakatPrayer[] = [
  twoRakatPrayer('fajr'),
  fourRakatPrayer('dhuhr', 'silent'),
  fourRakatPrayer('asr', 'silent'),
  threeRakatPrayer('maghrib'),
  fourRakatPrayer('isha', 'aloud'),
];

/** Was der Hinweis über der Rakʿah sagt — laut oder leise, und für wen. */
export const RECITATION_LABEL: Record<Recitation, string> = {
  aloud: 'Laut rezitieren',
  silent: 'Leise rezitieren',
};

export const RECITATION_HINT: Record<Recitation, string> = {
  aloud: 'Al-Fatihah und die Sure werden hörbar gesprochen. In der Gemeinschaft rezitiert der Imam, die Betenden hören zu.',
  silent: 'Al-Fatihah und die Sure werden so leise gesprochen, dass nur du selbst sie hörst.',
};

export const PRAYER_RAKATS_BY_ID = new Map(PRAYER_RAKATS.map((prayer) => [prayer.id, prayer]));

export const PRAYER_PRACTICE_TIPS: readonly string[] = [
  'Bete mit Ruhe und Konzentration (Khushuʿ).',
  'Bewege dich nicht zu schnell. Jede Position sollte ruhig eingenommen werden.',
  'Schau während des Stehens auf die Stelle der Niederwerfung.',
  'Fasse die Absicht (Niyyah) vor jedem Gebet im Herzen.',
  'Achte auf die korrekten Zeiten der Gebete.',
];
