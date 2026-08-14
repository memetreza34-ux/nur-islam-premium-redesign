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

/** Körperhaltung während des Schritts — bestimmt das Symbol in der Liste. */
export type PrayerPosture = 'takbir' | 'qiyam' | 'ruku' | 'standing' | 'sujud' | 'sitting' | 'taslim';

export type RakatStep = {
  id: string;
  title: string;
  description: string;
  posture: PrayerPosture;
  /** Wortlaut, wo es einen festen gibt. Schritte ohne sind reine Bewegung. */
  arabic?: string;
  transliteration?: string;
  translation?: string;
};

export type Rakat = {
  number: number;
  title: string;
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
  description: 'Fasse die Absicht (Niyyah) im Herzen. Hebe die Hände zu den Ohren und beginne das Gebet.',
  posture: 'takbir',
  arabic: 'اللَّهُ أَكْبَر',
  transliteration: 'Allahu Akbar',
  translation: 'Allah ist am größten.',
};

const SANA: RakatStep = {
  id: 'sana',
  title: 'Eröffnungs-Bittgebet (Sana)',
  description: 'Leise rezitieren nach dem ersten Takbir:',
  posture: 'qiyam',
  arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
  transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta’ala jadduka, wa la ilaha ghayruk',
  translation: 'Preis sei Dir, o Allah, und Lob sei Dir, und gesegnet ist Dein Name, und hoch erhaben ist Deine Majestät, und es gibt keinen Gott außer Dir.',
};

const TA_AWWUDH_BASMALAH: RakatStep = {
  id: 'ta-awwudh-basmalah',
  title: 'Zuflucht suchen & Basmalah',
  description: 'Vor der Rezitation des Korans:',
  posture: 'qiyam',
  arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  transliteration: 'A’udhu billahi minash-shaytanir-rajim\nBismillahir-Rahmanir-Rahim',
  translation: 'Ich suche Zuflucht bei Allah vor dem verfluchten Satan. Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
};

const FATIHA: RakatStep = {
  id: 'fatiha',
  title: 'Sure Al-Fatihah',
  description: 'Diese Sure muss in jeder Rakʿah rezitiert werden:',
  posture: 'qiyam',
  arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  transliteration: 'Alhamdu lillahi rabbil-’alamin\nAr-Rahmanir-Rahim\nMaliki yawmid-din\nIyyaka na’budu wa iyyaka nasta’in\nIhdinas-siratal-mustaqim\nSiratal-ladhina an’amta ’alayhim ghayril-maghdubi ’alayhim wa lad-dallin (Amin)',
  translation: 'Alles Lob gehört Allah, dem Herrn der Welten, dem Allerbarmer, dem Barmherzigen, dem Herrscher am Tag des Gerichts. Dir allein dienen wir, und Dich allein bitten wir um Hilfe. Leite uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den Weg der Irregehenden.',
};

const SHORT_SURAH: RakatStep = {
  id: 'short-surah',
  title: 'Eine weitere Sure (z. B. Al-Ikhlas)',
  description: 'Nach Al-Fatihah in den ersten beiden Rakʿah:',
  posture: 'qiyam',
  arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  transliteration: 'Qul huwallahu ahad\nAllahus-samad\nLam yalid wa lam yulad\nWa lam yakul-lahu kufuwan ahad',
  translation: 'Sprich: Er ist Allah, ein Einziger, Allah, der Absolute. Er zeugt nicht und ist nicht gezeugt worden, und Ihm ebenbürtig ist keiner.',
};

const RUKU: RakatStep = {
  id: 'ruku',
  title: 'Ruku (Verbeugung)',
  description: 'Sage „Allahu Akbar“, verbeuge dich mit geradem Rücken, Hände auf den Knien. Sage dreimal:',
  posture: 'ruku',
  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
  transliteration: 'Subhana Rabbiyal Adhim',
  translation: 'Preis sei meinem Herrn, dem Allmächtigen.',
};

const RISING_RUKU: RakatStep = {
  id: 'rising-ruku',
  title: 'Aufrichten aus dem Ruku',
  description: 'Richte dich wieder auf und sage beim Hochgehen „Sami Allahu liman hamidah“, im Stehen dann „Rabbana wa lakal hamd“.',
  posture: 'standing',
  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْدُ',
  transliteration: 'Sami Allahu liman hamidah\nRabbana wa lakal hamd',
  translation: 'Allah hört den, der Ihn lobt. Unser Herr, Dir gebührt alles Lob.',
};

const SUJUD: RakatStep = {
  id: 'sujud',
  title: 'Sujud (Niederwerfung)',
  description: 'Sage „Allahu Akbar“ und wirf dich nieder (Stirn, Nase, Hände, Knie und Zehen am Boden). Sage dreimal:',
  posture: 'sujud',
  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
  transliteration: 'Subhana Rabbiyal A’la',
  translation: 'Preis sei meinem Herrn, dem Höchsten.',
};

const SITTING_SUJUD: RakatStep = {
  id: 'sitting-sujud',
  title: 'Sitzen zwischen den Niederwerfungen',
  description: 'Sage „Allahu Akbar“, setze dich aufrecht hin und sage:',
  posture: 'sitting',
  arabic: 'رَبِّ اغْفِرْ لِي',
  transliteration: 'Rabbighfir li',
  translation: 'Mein Herr, vergib mir.',
};

const SUJUD_SECOND: RakatStep = {
  ...SUJUD,
  id: 'sujud-second',
  title: 'Zweite Niederwerfung',
  description: 'Wirf dich erneut nieder und sage dreimal:',
};

const TASHAHHUD: RakatStep = {
  id: 'tashahhud',
  title: 'Tashahhud (At-Tahiyyat)',
  description: 'Setze dich hin und rezitiere das Tashahhud:',
  posture: 'sitting',
  arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
  transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu ’alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh, as-salamu ’alayna wa ’ala ’ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan ’abduhu wa rasuluh.',
  translation: 'Alle Ehrerbietungen, Gebete und guten Taten gebühren Allah. Friede sei mit dir, o Prophet, und die Barmherzigkeit Allahs und Seine Segnungen. Friede sei mit uns und mit den rechtschaffenen Dienern Allahs. Ich bezeuge, dass es keinen Gott gibt außer Allah, und ich bezeuge, dass Muhammad Sein Diener und Gesandter ist.',
};

const SALAWAT: RakatStep = {
  id: 'salawat',
  title: 'Salawat auf den Propheten ﷺ',
  description: 'Im letzten Sitzen folgen nach dem Tashahhud die Segenswünsche (Salawat Ibrahimiyyah):',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
  transliteration: 'Allahumma salli ’ala Muhammadin wa ’ala ali Muhammadin, kama sallayta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid. Allahumma barik ’ala Muhammadin wa ’ala ali Muhammadin, kama barakta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid.',
  translation: 'O Allah, segne Muhammad und die Familie von Muhammad, wie Du Ibrahim und die Familie von Ibrahim gesegnet hast. Wahrlich, Du bist lobenswert und ruhmreich. O Allah, schenke Muhammad und der Familie von Muhammad Segen, wie Du Ibrahim und der Familie von Ibrahim Segen geschenkt hast. Wahrlich, Du bist lobenswert und ruhmreich.',
};

const DUA_BEFORE_SALAM: RakatStep = {
  id: 'dua-before-salam',
  title: 'Bittgebet vor dem Salam (optional)',
  description: 'Vor dem Beenden des Gebets kann ein Bittgebet gesprochen werden, zum Beispiel:',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
  transliteration: 'Allahumma inni a’udhu bika min ’adhabi jahannam, wa min ’adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal.',
  translation: 'O Allah, ich suche Zuflucht bei Dir vor der Strafe der Hölle, vor der Strafe des Grabes, vor den Versuchungen des Lebens und des Todes und vor der Versuchung des falschen Messias (Dajjal).',
};

const TASLIM: RakatStep = {
  id: 'taslim',
  title: 'Taslim (Abschluss)',
  description: 'Drehe den Kopf nach rechts, dann nach links und sage jeweils:',
  posture: 'taslim',
  arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
  transliteration: 'Assalamu Alaikum wa Rahmatullah',
  translation: 'Der Friede und die Barmherzigkeit Allahs seien mit euch.',
};

/** Der Kern jeder Rakʿah: Verbeugung, Aufrichten, zwei Niederwerfungen. */
const BOWING_AND_PROSTRATION = [RUKU, RISING_RUKU, SUJUD, SITTING_SUJUD, SUJUD_SECOND] as const;

/** Erste Rakʿah: als einzige mit Eröffnungstakbir und Sana. */
const rakatOne = (): Rakat => ({
  number: 1,
  title: '1. Rakʿah',
  steps: [TAKBIR, SANA, TA_AWWUDH_BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION],
});

/** Zweite Rakʿah im Gebet mit mehr als zwei Einheiten: endet im Sitzen. */
const rakatTwoMiddle = (): Rakat => ({
  number: 2,
  title: '2. Rakʿah',
  steps: [TA_AWWUDH_BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, TASHAHHUD],
});

/** In der dritten und vierten Einheit folgt nach Al-Fatihah keine weitere Sure. */
const rakatMiddleShort = (number: number): Rakat => ({
  number,
  title: `${number}. Rakʿah`,
  steps: [TA_AWWUDH_BASMALAH, FATIHA, ...BOWING_AND_PROSTRATION],
});

const closingSteps = [TASHAHHUD, SALAWAT, DUA_BEFORE_SALAM, TASLIM] as const;

const rakatFinal = (number: number, withShortSurah: boolean): Rakat => ({
  number,
  title: `${number}. Rakʿah (Abschluss)`,
  steps: withShortSurah
    ? [TA_AWWUDH_BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, ...closingSteps]
    : [TA_AWWUDH_BASMALAH, FATIHA, ...BOWING_AND_PROSTRATION, ...closingSteps],
});

const twoRakatPrayer = (id: RakatPrayerId): RakatPrayer => ({
  id,
  rakats: [rakatOne(), rakatFinal(2, true)],
});

const threeRakatPrayer = (id: RakatPrayerId): RakatPrayer => ({
  id,
  rakats: [rakatOne(), rakatTwoMiddle(), rakatFinal(3, false)],
});

const fourRakatPrayer = (id: RakatPrayerId): RakatPrayer => ({
  id,
  rakats: [rakatOne(), rakatTwoMiddle(), rakatMiddleShort(3), rakatFinal(4, false)],
});

export const PRAYER_RAKATS: readonly RakatPrayer[] = [
  twoRakatPrayer('fajr'),
  fourRakatPrayer('dhuhr'),
  fourRakatPrayer('asr'),
  threeRakatPrayer('maghrib'),
  fourRakatPrayer('isha'),
];

export const PRAYER_RAKATS_BY_ID = new Map(PRAYER_RAKATS.map((prayer) => [prayer.id, prayer]));

export const PRAYER_PRACTICE_TIPS: readonly string[] = [
  'Bete mit Ruhe und Konzentration (Khushuʿ).',
  'Bewege dich nicht zu schnell. Jede Position sollte ruhig eingenommen werden.',
  'Schau während des Stehens auf die Stelle der Niederwerfung.',
  'Fasse die Absicht (Niyyah) vor jedem Gebet im Herzen.',
  'Achte auf die korrekten Zeiten der Gebete.',
];
