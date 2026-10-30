/**
 * Gefährten des Propheten und bedeutende Frauen im Islam.
 *
 * Beide Bereiche fehlten in dieser App vollständig; die Einträge lagen im
 * Altbestand `memetreza34-ux/nur-islam`. Dort ist zu jeder Person nur Name,
 * Ehrenname und Rolle hinterlegt — mehr steht hier bewusst nicht, statt den
 * Eindruck ausgearbeiteter Biografien zu erwecken.
 *
 * Quellenabgleich beider Kurztextbestände: 11.10.2026; keine Fachfreigabe.
 * Historische Fachliteratur ist nicht automatisch ein Prophetenzitat.
 */

export type CompanionEntry = {
  id: string;
  name: string;
  honorific: string;
  role: string;
  sources: readonly { label: string; url: string }[];
  sourceNote?: string;
};

export type WomanEntry = {
  id: string;
  name: string;
  note: string;
  sources: readonly { label: string; url: string }[];
  sourceNote?: string;
};

export const SAHABAH: readonly CompanionEntry[] = [
  {
    id: 'abu-bakr-as-siddiq',
    name: 'Abu Bakr as-Siddiq',
    honorific: 'Der Wahrhaftige',
    role: 'Erster Kalif',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Ebû Bekir', url: 'https://islamansiklopedisi.org.tr/ebu-bekir' },
      { label: 'Sahih al-Bukhari 3675 · Siddiq', url: 'https://sunnah.com/bukhari:3675' },
    ],
    sourceNote: 'Chronologische Amtsfolge; religiöse Bewertungen der Nachfolge unterscheiden sich zwischen sunnitischen und schiitischen Traditionen.',
  },
  {
    id: 'umar-ibn-al-khattab',
    name: 'Umar ibn al-Khattab',
    honorific: 'Al-Faruq (Der Unterscheider)',
    role: 'Zweiter Kalif',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Ömer', url: 'https://islamansiklopedisi.org.tr/omer' },
      { label: 'TDV İslâm Ansiklopedisi · Fârûk', url: 'https://islamansiklopedisi.org.tr/faruk--omer' },
    ],
    sourceNote: 'Chronologische Amtsfolge; religiöse Bewertungen der Nachfolge unterscheiden sich zwischen sunnitischen und schiitischen Traditionen. Al-Faruq ist ein überlieferter Beiname; seine ursprüngliche Vergabe wird unterschiedlich berichtet.',
  },
  {
    id: 'uthman-ibn-affan',
    name: 'Uthman ibn Affan',
    honorific: 'Dhun-Nurayn (Besitzer der zwei Lichter)',
    role: 'Dritter Kalif',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Osman', url: 'https://islamansiklopedisi.org.tr/osman' }],
    sourceNote: 'Chronologische Amtsfolge; religiöse Bewertungen der Nachfolge unterscheiden sich zwischen sunnitischen und schiitischen Traditionen. Dhun-Nurayn ist ein historischer Beiname.',
  },
  {
    id: 'ali-ibn-abi-talib',
    name: 'Ali ibn Abi Talib',
    honorific: 'Bekannt als Asadullah (Löwe Allahs)',
    role: 'Vierter Kalif',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Ali', url: 'https://islamansiklopedisi.org.tr/ali' },
      { label: 'TDV İslâm Ansiklopedisi · Haydar, Beinamen', url: 'https://islamansiklopedisi.org.tr/haydar' },
    ],
    sourceNote: 'Chronologische Amtsfolge; religiöse Bewertungen der Nachfolge unterscheiden sich zwischen sunnitischen und schiitischen Traditionen. Der Beiname ist historisch belegt, hier kein wortgleiches Prophetenzitat.',
  },
  {
    id: 'khalid-ibn-al-walid',
    name: 'Khalid ibn al-Walid',
    honorific: 'Sayfullah (Schwert Allahs)',
    role: 'Bekannter Feldherr',
    sources: [
      { label: 'Sahih al-Bukhari 4262 · Schwert unter Allahs Schwertern', url: 'https://sunnah.com/bukhari:4262' },
      { label: 'TDV İslâm Ansiklopedisi · Hâlid b. Velîd', url: 'https://islamansiklopedisi.org.tr/halid-b-velid' },
    ],
  },
  {
    id: 'hamza-ibn-abd-al-muttalib',
    name: 'Hamza ibn Abd al-Muttalib',
    honorific: 'Sayyid ash-Shuhada (Herr der Märtyrer)',
    role: 'Onkel des Propheten',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Hamza', url: 'https://islamansiklopedisi.org.tr/hamza' }],
    sourceNote: 'Sayyid ash-Shuhada ist hier ein historisch überlieferter Ehrenname, kein wörtliches Prophetenzitat.',
  },
  {
    id: 'bilal-ibn-rabah',
    name: 'Bilal ibn Rabah',
    honorific: 'Muezzin des Propheten',
    role: 'Erster Muezzin des Propheten',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Bilâl-i Habeşî', url: 'https://islamansiklopedisi.org.tr/bilal-i-habesi' }],
  },
  {
    id: 'zayd-ibn-thabit',
    name: 'Zayd ibn Thabit',
    honorific: 'Schreiber der Offenbarung',
    role: 'An der Sammlung des Quran beteiligt',
    sources: [{ label: 'Sahih al-Bukhari 4986', url: 'https://sunnah.com/bukhari:4986' }],
    sourceNote: 'Der Bericht nennt ihn als Offenbarungsschreiber und beschreibt den Auftrag zur Sammlung; keine Behauptung einer alleinigen Urheberschaft.',
  },
  {
    id: 'abu-ubaidah-ibn-al-jarrah',
    name: 'Abu Ubaidah ibn al-Jarrah',
    honorific: 'Amin al-Ummah (Vertrauenswürdiger der Ummah)',
    role: 'Einer der zehn mit dem Paradies Verheißenen',
    sources: [
      { label: 'Sahih al-Bukhari 3744 · Amin', url: 'https://sunnah.com/bukhari:3744' },
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'talha-ibn-ubaidullah',
    name: 'Talha ibn Ubaidullah',
    honorific: 'Für seine Großzügigkeit bekannt',
    role: 'Einer der zehn mit dem Paradies Verheißenen',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Talha b. Ubeydullah', url: 'https://islamansiklopedisi.org.tr/talha-b-ubeydullah' },
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'az-zubair-ibn-al-awwam',
    name: 'Az-Zubair ibn al-Awwam',
    honorific: 'Hawari (Jünger) des Propheten',
    role: 'Einer der zehn mit dem Paradies Verheißenen',
    sources: [
      { label: 'Sahih al-Bukhari 3719 · Hawari', url: 'https://sunnah.com/bukhari:3719' },
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'abdurrahman-ibn-auf',
    name: 'Abdurrahman ibn Auf',
    honorific: 'Als Kaufmann tätig',
    role: 'Einer der zehn mit dem Paradies Verheißenen',
    sources: [
      { label: 'Sahih al-Bukhari 2048 · Handel in Medina', url: 'https://sunnah.com/bukhari:2048' },
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'sa-d-ibn-abi-waqqas',
    name: 'Sa\'d ibn Abi Waqqas',
    honorific: 'Nach eigener Überlieferung der erste Araber, der einen Pfeil auf Allahs Weg schoss',
    role: 'Einer der zehn mit dem Paradies Verheißenen',
    sources: [
      { label: 'Sahih al-Bukhari 3728 · Aussage von Saʿd', url: 'https://sunnah.com/bukhari:3728' },
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'said-ibn-zayd',
    name: 'Said ibn Zayd',
    honorific: 'Einer der zehn mit dem Paradies Verheißenen',
    role: 'Früher Muslim',
    sources: [
      { label: 'Jami at-Tirmidhi 3747', url: 'https://sunnah.com/tirmidhi:3747' },
      { label: 'TDV İslâm Ansiklopedisi · Saîd b. Zeyd', url: 'https://islamansiklopedisi.org.tr/said-b-zeyd' },
    ],
    sourceNote: '3747: Sahih nach Darussalam; Aussage aus sunnitischer Hadithüberlieferung.',
  },
  {
    id: 'mus-ab-ibn-umair',
    name: 'Mus\'ab ibn Umair',
    honorific: 'Als Lehrer nach Medina gesandt',
    role: 'Lehrer in Medina',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Musʿab b. Umeyr', url: 'https://islamansiklopedisi.org.tr/musab-b-umeyr' }],
    sourceNote: 'Historischer Bericht über seine Lehr- und Verkündigungsaufgabe; keine allgemeine diplomatische Rangbehauptung.',
  },
];

export const WOMEN_IN_ISLAM: readonly WomanEntry[] = [
  {
    id: 'khadija-bint-khuwaylid',
    name: 'Khadija bint Khuwaylid',
    note: 'Die erste Frau des Propheten ﷺ und die erste Muslimin',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Hatice', url: 'https://islamansiklopedisi.org.tr/hatice' },
      { label: 'Sahih Muslim 2436', url: 'https://sunnah.com/muslim:2436' },
    ],
  },
  {
    id: 'aisha-bint-abi-bakr',
    name: 'Aisha bint Abi Bakr',
    note: 'Bekannt für ihr tiefes Wissen und die Überlieferung vieler Hadithe',
    sources: [
      { label: 'Jami at-Tirmidhi 3883', url: 'https://sunnah.com/tirmidhi:3883' },
      { label: 'TDV İslâm Ansiklopedisi · Âişe', url: 'https://islamansiklopedisi.org.tr/aise' },
    ],
    sourceNote: '3883: Hasan nach Darussalam; at-Tirmidhi nennt im Sammlungstext Hasan Sahih Gharib.',
  },
  {
    id: 'fatima-az-zahra',
    name: 'Fatima az-Zahra',
    note: 'Die Tochter des Propheten ﷺ und Mutter von Hassan und Hussein',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Fâtıma, Biografie', url: 'https://islamansiklopedisi.org.tr/fatima#1' }],
  },
  {
    id: 'maryam-maria',
    name: 'Maryam (Maria)',
    note: 'Die Mutter von Prophet Isa (a.s.); Sure 19 trägt ihren Namen',
    sources: [
      { label: 'Quran 3:45', url: 'https://quran.com/3/45' },
      { label: 'Sure 19 · Maryam, Namensherkunft', url: 'https://quran.com/19/info' },
    ],
  },
  {
    id: 'asiya',
    name: 'Asiya',
    note: 'Die Frau des Pharao, die an Allah glaubte',
    sources: [
      { label: 'Quran 66:11', url: 'https://quran.com/66/11' },
      { label: 'Sahih al-Bukhari 3433', url: 'https://sunnah.com/bukhari:3433' },
    ],
    sourceNote: 'Der Quran nennt hier die Frau des Pharao, nicht ihren Namen. Asiya wird in der Hadithüberlieferung genannt.',
  },
  {
    id: 'hajar',
    name: 'Hajar',
    note: 'Die Mutter von Ismail (a.s.) und diejenige, die zwischen Safa und Marwa lief',
    sources: [
      { label: 'Sahih al-Bukhari 3364', url: 'https://sunnah.com/bukhari:3364' },
      { label: 'Sahih al-Bukhari 3358 · Name Hajar', url: 'https://sunnah.com/bukhari:3358' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah',
    note: 'Die Frau von Ibrahim (a.s.) und Mutter von Ishaq (a.s.)',
    sources: [
      { label: 'Quran 11:71', url: 'https://quran.com/11/71' },
      { label: 'TDV İslâm Ansiklopedisi · Sâre', url: 'https://islamansiklopedisi.org.tr/sare' },
    ],
    sourceNote: 'Der Vers nennt Ibrahims Frau und die Nachricht über Ishaq, nicht den Namen Sarah. Die Namenszuordnung folgt der Überlieferung.',
  },
  {
    id: 'sumayyah-bint-khayyat',
    name: 'Sumayyah bint Khayyat',
    note: 'In der islamischen Geschichtsschreibung als erste Märtyrerin bekannt',
    sources: [
      { label: 'TDV İslâm Ansiklopedisi · Sümeyye', url: 'https://islamansiklopedisi.org.tr/sumeyye-bint-hubbat' },
      { label: 'Dorar · Bericht von Mujahid und Überlieferungsgrenze', url: 'https://dorar.net/h/cL5BONqW?osoul=1' },
    ],
    sourceNote: 'Historische Einordnung, kein wortgleiches Prophetenzitat. Dorar ordnet diesem Bericht die Bewertung mursal von Shuayb al-Arnaut zu: eine unterbrochene Überlieferung.',
  },
  {
    id: 'zaynab-bint-ali',
    name: 'Zaynab bint Ali',
    note: 'Die Enkelin des Propheten ﷺ; in historischen Berichten über Karbala für ihre Standhaftigkeit bekannt',
    sources: [{ label: 'TDV İslâm Ansiklopedisi · Zeyneb bint Ali', url: 'https://islamansiklopedisi.org.tr/zeyneb-bint-ali' }],
  },
  {
    id: 'umm-salama',
    name: 'Umm Salama',
    note: 'Eine der Mütter der Gläubigen, bekannt für ihren weisen Rat',
    sources: [
      { label: 'Quran 33:6 · Bezeichnung für die Ehefrauen', url: 'https://quran.com/33/6' },
      { label: 'Sahih Muslim 918b · Ehefrau des Propheten', url: 'https://sunnah.com/muslim:918b' },
      { label: 'Sahih al-Bukhari 2731–2732 · Rat bei Hudaybiyya', url: 'https://sunnah.com/bukhari:2731' },
    ],
  },
];
