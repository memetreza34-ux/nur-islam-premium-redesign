/**
 * Gefährten des Propheten und bedeutende Frauen im Islam.
 *
 * Beide Bereiche fehlten in dieser App vollständig; die Einträge lagen im
 * Altbestand `memetreza34-ux/nur-islam`. Dort ist zu jeder Person nur Name,
 * Ehrenname und Rolle hinterlegt — mehr steht hier bewusst nicht, statt den
 * Eindruck ausgearbeiteter Biografien zu erwecken.
 *
 * Die fachliche Prüfung steht wie bei allen religiösen Inhalten aus.
 */

export type CompanionEntry = {
  id: string;
  name: string;
  honorific: string;
  role: string;
};

export type WomanEntry = {
  id: string;
  name: string;
  note: string;
};

export const SAHABAH: readonly CompanionEntry[] = [
  {
    id: 'abu-bakr-as-siddiq',
    name: 'Abu Bakr as-Siddiq',
    honorific: 'Der Wahrhaftige',
    role: 'Erster Kalif',
  },
  {
    id: 'umar-ibn-al-khattab',
    name: 'Umar ibn al-Khattab',
    honorific: 'Al-Faruq (Der Unterscheider)',
    role: 'Zweiter Kalif',
  },
  {
    id: 'uthman-ibn-affan',
    name: 'Uthman ibn Affan',
    honorific: 'Dhun-Nurayn (Besitzer der zwei Lichter)',
    role: 'Dritter Kalif',
  },
  {
    id: 'ali-ibn-abi-talib',
    name: 'Ali ibn Abi Talib',
    honorific: 'Asadullah (Löwe Allahs)',
    role: 'Vierter Kalif',
  },
  {
    id: 'khalid-ibn-al-walid',
    name: 'Khalid ibn al-Walid',
    honorific: 'Sayfullah (Schwert Allahs)',
    role: 'Großer Feldherr',
  },
  {
    id: 'hamza-ibn-abd-al-muttalib',
    name: 'Hamza ibn Abd al-Muttalib',
    honorific: 'Sayyid ash-Shuhada (Herr der Märtyrer)',
    role: 'Onkel des Propheten',
  },
  {
    id: 'bilal-ibn-rabah',
    name: 'Bilal ibn Rabah',
    honorific: 'Muadhin des Propheten',
    role: 'Erster Muadhin',
  },
  {
    id: 'zayd-ibn-thabit',
    name: 'Zayd ibn Thabit',
    honorific: 'Schreiber der Offenbarung',
    role: 'Koran-Experte',
  },
  {
    id: 'abu-ubaidah-ibn-al-jarrah',
    name: 'Abu Ubaidah ibn al-Jarrah',
    honorific: 'Amin al-Ummah (Vertrauenswürdiger der Ummah)',
    role: 'Einer der zehn Versprochenen',
  },
  {
    id: 'talha-ibn-ubaidullah',
    name: 'Talha ibn Ubaidullah',
    honorific: 'Der großzügige Talha',
    role: 'Einer der zehn Versprochenen',
  },
  {
    id: 'az-zubair-ibn-al-awwam',
    name: 'Az-Zubair ibn al-Awwam',
    honorific: 'Hawari (Jünger) des Propheten',
    role: 'Einer der zehn Versprochenen',
  },
  {
    id: 'abdurrahman-ibn-auf',
    name: 'Abdurrahman ibn Auf',
    honorific: 'Der erfolgreiche Kaufmann',
    role: 'Einer der zehn Versprochenen',
  },
  {
    id: 'sa-d-ibn-abi-waqqas',
    name: 'Sa\'d ibn Abi Waqqas',
    honorific: 'Der erste, der einen Pfeil für Allah schoss',
    role: 'Einer der zehn Versprochenen',
  },
  {
    id: 'said-ibn-zayd',
    name: 'Said ibn Zayd',
    honorific: 'Einer der zehn Versprochenen',
    role: 'Früher Konvertit',
  },
  {
    id: 'mus-ab-ibn-umair',
    name: 'Mus\'ab ibn Umair',
    honorific: 'Der erste Botschafter des Islam',
    role: 'Lehrer in Medina',
  },
];

export const WOMEN_IN_ISLAM: readonly WomanEntry[] = [
  {
    id: 'khadija-bint-khuwaylid',
    name: 'Khadija bint Khuwaylid',
    note: 'Die erste Frau des Propheten ﷺ und die erste Muslimin',
  },
  {
    id: 'aisha-bint-abi-bakr',
    name: 'Aisha bint Abi Bakr',
    note: 'Bekannt für ihr tiefes Wissen und die Überlieferung vieler Hadithe',
  },
  {
    id: 'fatima-az-zahra',
    name: 'Fatima az-Zahra',
    note: 'Die Tochter des Propheten ﷺ und Mutter von Hassan und Hussein',
  },
  {
    id: 'maryam-maria',
    name: 'Maryam (Maria)',
    note: 'Die Mutter von Prophet Isa (a.s.) und die einzige Frau, nach der eine Sure benannt ist',
  },
  {
    id: 'asiya',
    name: 'Asiya',
    note: 'Die Frau des Pharao, die an Allah glaubte',
  },
  {
    id: 'hajar',
    name: 'Hajar',
    note: 'Die Mutter von Ismail (a.s.) und diejenige, die zwischen Safa und Marwa lief',
  },
  {
    id: 'sarah',
    name: 'Sarah',
    note: 'Die Frau von Ibrahim (a.s.) und Mutter von Ishaq (a.s.)',
  },
  {
    id: 'sumayyah-bint-khayyat',
    name: 'Sumayyah bint Khayyat',
    note: 'Die erste Märtyrerin im Islam',
  },
  {
    id: 'zaynab-bint-ali',
    name: 'Zaynab bint Ali',
    note: 'Die Enkelin des Propheten ﷺ, bekannt für ihre Standhaftigkeit',
  },
  {
    id: 'umm-salama',
    name: 'Umm Salama',
    note: 'Eine der Mütter der Gläubigen, bekannt für ihren weisen Rat',
  },
];
