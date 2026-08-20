/**
 * Der Ablauf des Pflichtgebets, Rakʿah für Rakʿah.
 *
 * Die Daten zeigen eine verbreitete sunnitische Lernfolge für das eigene Gebet.
 * Sie sind bewusst kein Versuch, alle Rechtsschulen auf eine einzige Detailform
 * festzulegen. Handpositionen, einzelne Eröffnungsformeln, die Einordnung
 * bestimmter Rezitationen und Details beim Gemeinschaftsgebet können variieren.
 */

export type PrayerPosture = 'takbir' | 'qiyam' | 'ruku' | 'standing' | 'sujud' | 'sitting' | 'taslim';

export type RakatStep = {
  id: string;
  title: string;
  description: string;
  posture: PrayerPosture;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  source?: string;
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
  description: 'Fasse die Absicht (Niyyah) im Herzen, hebe die Hände und beginne das Gebet. Die genaue Höhe der Hände wird in verschiedenen überlieferten Formen beschrieben.',
  posture: 'takbir',
  arabic: 'اللَّهُ أَكْبَر',
  transliteration: 'Allahu Akbar',
  translation: 'Allah ist am größten.',
  source: 'Sahih al-Bukhari 738 – Eröffnungstakbir und überlieferte Handhebung',
};

const SANA: RakatStep = {
  id: 'sana',
  title: 'Eröffnungs-Bittgebet (eine überlieferte Form)',
  description: 'Nach dem ersten Takbir kann ein überliefertes Eröffnungs-Bittgebet leise gesprochen werden. Es wird hier nicht als für alle Rechtsschulen identische Pflicht dargestellt.',
  posture: 'qiyam',
  arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
  transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta’ala jadduka, wa la ilaha ghayruk',
  translation: 'Preis sei Dir, o Allah, und Lob sei Dir; gesegnet ist Dein Name, erhaben ist Deine Majestät, und niemand ist anbetungswürdig außer Dir.',
  source: 'Jami at-Tirmidhi 243 – hasan (Darussalam); eine von mehreren überlieferten Eröffnungsformen',
};

const TA_AWWUDH_BASMALAH: RakatStep = {
  id: 'ta-awwudh-basmalah',
  title: 'Zuflucht suchen & Basmalah',
  description: 'Vor der Quranrezitation werden Taʿawwudh und Basmalah in verbreiteten Lernformen gesprochen. Einzelheiten ihrer Wiederholung und Einordnung unterscheiden sich zwischen Rechtsschulen.',
  posture: 'qiyam',
  arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  transliteration: 'A’udhu billahi minash-shaytanir-rajim\nBismillahir-Rahmanir-Rahim',
  translation: 'Ich suche Zuflucht bei Allah vor dem verfluchten Satan. Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
  source: 'Quran 16:98 für Taʿawwudh; Einordnung und Wiederholung der Basmalah im Gebet sind Fiqh-Detailfragen',
};

const FATIHA: RakatStep = {
  id: 'fatiha',
  title: 'Sure Al-Fatihah',
  description: 'Rezitiere Al-Fatihah. Für das Mitbeten hinter einem Imam bestehen bei einzelnen Details anerkannte Rechtsschul-Unterschiede.',
  posture: 'qiyam',
  arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  transliteration: 'Alhamdu lillahi rabbil-’alamin\nAr-Rahmanir-Rahim\nMaliki yawmid-din\nIyyaka na’budu wa iyyaka nasta’in\nIhdinas-siratal-mustaqim\nSiratal-ladhina an’amta ’alayhim ghayril-maghdubi ’alayhim wa lad-dallin',
  translation: 'Alles Lob gehört Allah, dem Herrn der Welten, dem Allerbarmer, dem Barmherzigen, dem Herrscher am Tag des Gerichts. Dir allein dienen wir, und Dich allein bitten wir um Hilfe. Leite uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast, nicht den Weg derer, die Deinen Zorn erregt haben, und nicht den Weg der Irregehenden.',
  source: 'Quran 1:1–7 · Sahih al-Bukhari 756 zur zentralen Bedeutung von Al-Fatiha im Gebet',
};

const SHORT_SURAH: RakatStep = {
  id: 'short-surah',
  title: 'Weitere Quranrezitation',
  description: 'In den ersten beiden Rakʿah folgt in der verbreiteten Lernpraxis nach Al-Fatihah weitere Quranrezitation, zum Beispiel Al-Ikhlas.',
  posture: 'qiyam',
  arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  transliteration: 'Qul huwallahu ahad\nAllahus-samad\nLam yalid wa lam yulad\nWa lam yakul-lahu kufuwan ahad',
  translation: 'Sprich: Er ist Allah, Einer. Allah ist As-Samad. Er zeugt nicht und ist nicht gezeugt worden, und Ihm ebenbürtig ist keiner.',
  source: 'Quran 112:1–4 · Sahih al-Bukhari 776 belegt zusätzliche Quranrezitation nach Al-Fatiha in den ersten Rakʿah als prophetische Praxis',
};

const RUKU: RakatStep = {
  id: 'ruku',
  title: 'Ruku (Verbeugung)',
  description: 'Sage „Allahu Akbar“, verbeuge dich ruhig und sprich den überlieferten Tasbih. Eine bestimmte Wiederholungszahl wird hier nicht als allgemeine Pflicht dargestellt.',
  posture: 'ruku',
  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
  transliteration: 'Subhana Rabbiyal Adhim',
  translation: 'Preis sei meinem Herrn, dem Gewaltigen.',
  source: 'Jami at-Tirmidhi 262 – sahih (Darussalam)',
};

const RISING_RUKU: RakatStep = {
  id: 'rising-ruku',
  title: 'Aufrichten aus dem Ruku',
  description: 'Richte dich vollständig auf. Beim eigenen Gebet wird „Sami Allahu liman hamidah“ gesprochen; anschließend „Rabbana wa lakal hamd“. Beim Gemeinschaftsgebet bestehen Detailunterschiede.',
  posture: 'standing',
  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْدُ',
  transliteration: 'Sami Allahu liman hamidah\nRabbana wa lakal hamd',
  translation: 'Allah hört den, der Ihn lobt. Unser Herr, Dir gebührt alles Lob.',
  source: 'Sahih al-Bukhari 789; für den Mitbetenden hinter dem Imam siehe auch Bukhari 733–734',
};

const SUJUD: RakatStep = {
  id: 'sujud',
  title: 'Sujud (Niederwerfung)',
  description: 'Sage „Allahu Akbar“, vollziehe die Niederwerfung ruhig und sprich den überlieferten Tasbih. Eine feste Wiederholungszahl wird hier nicht als allgemeine Pflicht dargestellt.',
  posture: 'sujud',
  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
  transliteration: 'Subhana Rabbiyal A’la',
  translation: 'Preis sei meinem Herrn, dem Höchsten.',
  source: 'Jami at-Tirmidhi 262 – sahih (Darussalam)',
};

const SITTING_SUJUD: RakatStep = {
  id: 'sitting-sujud',
  title: 'Sitzen zwischen den Niederwerfungen',
  description: 'Sage „Allahu Akbar“, setze dich ruhig auf und sprich ein überliefertes Bittgebet, zum Beispiel:',
  posture: 'sitting',
  arabic: 'رَبِّ اغْفِرْ لِي',
  transliteration: 'Rabbighfir li',
  translation: 'Mein Herr, vergib mir.',
  source: 'Sunan Ibn Majah 897 – sahih (Darussalam); dort zweimal überliefert',
};

const SUJUD_SECOND: RakatStep = {
  ...SUJUD,
  id: 'sujud-second',
  title: 'Zweite Niederwerfung',
  description: 'Vollziehe die zweite Niederwerfung ruhig und sprich den überlieferten Tasbih.',
};

const TASHAHHUD: RakatStep = {
  id: 'tashahhud',
  title: 'Tashahhud (At-Tahiyyat)',
  description: 'Setze dich hin und rezitiere das Tashahhud. Es sind mehrere authentische Tashahhud-Formen überliefert; hier wird die bekannte Ibn-Masʿud-Form gezeigt.',
  posture: 'sitting',
  arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
  transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu ’alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh, as-salamu ’alayna wa ’ala ’ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan ’abduhu wa rasuluh.',
  translation: 'Alle Ehrerbietungen, Gebete und guten Dinge gebühren Allah. Friede sei mit dir, o Prophet, und die Barmherzigkeit Allahs und Seine Segnungen. Friede sei mit uns und mit den rechtschaffenen Dienern Allahs. Ich bezeuge, dass niemand außer Allah anbetungswürdig ist, und ich bezeuge, dass Muhammad Sein Diener und Gesandter ist.',
  source: 'Sunan an-Nasa’i 1170 – authentische Ibn-Masʿud-Form des Tashahhud',
};

const SALAWAT: RakatStep = {
  id: 'salawat',
  title: 'Salawat auf den Propheten ﷺ',
  description: 'Im letzten Sitzen werden nach dem Tashahhud Segenswünsche gesprochen. Mehrere authentische Formulierungen sind überliefert; die juristische Einordnung einzelner Teile unterscheidet sich zwischen Rechtsschulen.',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
  transliteration: 'Allahumma salli ’ala Muhammadin wa ’ala ali Muhammadin, kama sallayta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid. Allahumma barik ’ala Muhammadin wa ’ala ali Muhammadin, kama barakta ’ala Ibrahima wa ’ala ali Ibrahima, innaka Hamidun Majid.',
  translation: 'O Allah, segne Muhammad und die Familie von Muhammad, wie Du Ibrahim und die Familie von Ibrahim gesegnet hast. Wahrlich, Du bist lobenswert und ruhmreich. O Allah, schenke Muhammad und der Familie von Muhammad Segen, wie Du Ibrahim und der Familie von Ibrahim Segen geschenkt hast. Wahrlich, Du bist lobenswert und ruhmreich.',
  source: 'Sahih al-Bukhari 6357 – überlieferte Salawat-Form; authentische Varianten existieren',
};

const DUA_BEFORE_SALAM: RakatStep = {
  id: 'dua-before-salam',
  title: 'Bittgebet vor dem Salam',
  description: 'Nach dem Tashahhud ist die Zuflucht vor vier Dingen überliefert. Die App zeigt diese bekannte Form:',
  posture: 'sitting',
  arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
  transliteration: 'Allahumma inni a’udhu bika min ’adhabi jahannam, wa min ’adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal.',
  translation: 'O Allah, ich suche Zuflucht bei Dir vor der Strafe der Hölle, vor der Strafe des Grabes, vor den Prüfungen des Lebens und des Todes und vor dem Übel der Prüfung des falschen Messias (Dajjal).',
  source: 'Sahih Muslim 588 – überlieferte Zuflucht nach dem Tashahhud',
};

const TASLIM: RakatStep = {
  id: 'taslim',
  title: 'Taslim (Abschluss)',
  description: 'Beende das Gebet mit dem Friedensgruß. Eine authentisch überlieferte Form erfolgt nach rechts und anschließend nach links.',
  posture: 'taslim',
  arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
  transliteration: 'Assalamu Alaikum wa Rahmatullah',
  translation: 'Der Friede und die Barmherzigkeit Allahs seien mit euch.',
  source: 'Sunan an-Nasa’i 1320 – sahih (Darussalam); Friedensgruß nach rechts und links',
};

const BOWING_AND_PROSTRATION = [RUKU, RISING_RUKU, SUJUD, SITTING_SUJUD, SUJUD_SECOND] as const;

const rakatOne = (): Rakat => ({
  number: 1,
  title: '1. Rakʿah',
  steps: [TAKBIR, SANA, TA_AWWUDH_BASMALAH, FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION],
});

const rakatTwoMiddle = (): Rakat => ({
  number: 2,
  title: '2. Rakʿah',
  steps: [FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, TASHAHHUD],
});

const rakatMiddleShort = (number: number): Rakat => ({
  number,
  title: `${number}. Rakʿah`,
  steps: [FATIHA, ...BOWING_AND_PROSTRATION],
});

const closingSteps = [TASHAHHUD, SALAWAT, DUA_BEFORE_SALAM, TASLIM] as const;

const rakatFinal = (number: number, withShortSurah: boolean): Rakat => ({
  number,
  title: `${number}. Rakʿah (Abschluss)`,
  steps: withShortSurah
    ? [FATIHA, SHORT_SURAH, ...BOWING_AND_PROSTRATION, ...closingSteps]
    : [FATIHA, ...BOWING_AND_PROSTRATION, ...closingSteps],
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
  'Fasse die Absicht (Niyyah) vor dem Gebet im Herzen.',
  'Achte auf die korrekte Gebetszeit und Qibla.',
  'Bei Gemeinschaftsgebet oder Rechtsschuldetails folge einer verlässlichen lokalen Lehrperson bzw. deiner Rechtsschule.',
];
