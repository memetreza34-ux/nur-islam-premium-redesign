import type { MadhhabId } from './madhhabData';

export type MadhhabSource = {
  title: string;
  publisher: string;
  href: string;
  homepage?: string;
  language: 'Arabisch' | 'Englisch' | 'Türkisch';
};

export type MadhhabEntry = {
  id: MadhhabId;
  name: string;
  title: string;
  arabic: string;
  pronunciation: string;
  eponym: string;
  dates: string;
  origin: string;
  short: string;
  history: readonly string[];
  method: readonly { title: string; text: string }[];
  spread: string;
  practice: string;
  sources: readonly MadhhabSource[];
};

export const MADHHAB_CATALOGUE: readonly MadhhabEntry[] = [
  {
    id: 'hanafi',
    name: 'Hanafi',
    title: 'Hanafitisch',
    arabic: 'الْمَذْهَبُ الْحَنَفِيُّ',
    pronunciation: 'al-Madhhab al-Hanafī',
    eponym: 'Abu Hanifa an-Nuʿman',
    dates: 'Gestorben 150 AH · 767 n. Chr.',
    origin: 'Kufa, Irak',
    short: 'Eine in Kufa gewachsene Rechtstradition, die Textbelege mit systematischer juristischer Herleitung verbindet.',
    history: [
      'Die Schule ist nach Abu Hanifa benannt. Ihre spätere Gestalt entstand jedoch nicht durch eine einzelne Person allein.',
      'Seine Schüler – besonders Abu Yusuf und Muhammad asch-Schaibani – überlieferten, ordneten und entwickelten die Lehre weiter. Erst spätere Generationen formten daraus eine beständige Rechtsschule.',
    ],
    method: [
      { title: 'Gemeinsame Grundlage', text: 'Quran und Sunnah bilden wie bei allen vier Schulen die Ausgangspunkte. Hinzu kommen Gelehrtenkonsens und Analogieschluss nach den Regeln der Schule.' },
      { title: 'Systematischer Vergleich', text: 'Der Analogieschluss (Qiyas) wird stark systematisiert: Ein bereits belegter Fall dient dazu, einen neuen, vergleichbaren Fall einzuordnen.' },
      { title: 'Istihsan und Gewohnheit', text: 'Kontrollierter juristischer Vorzug (Istihsan) und anerkannte örtliche Gewohnheit (ʿUrf) können berücksichtigt werden, sofern sie höherrangigen Belegen nicht widersprechen.' },
    ],
    spread: 'Historisch besonders in Gebieten des Osmanischen Reiches sowie in Teilen Süd- und Zentralasiens verbreitet. Heutige regionale Mehrheiten sagen nichts über den Wert einer Schule aus.',
    practice: 'Typische Unterschiede zu anderen Schulen betreffen einzelne Regeln etwa zu Wudu, Gebet oder Verträgen. Sie beruhen auf unterschiedlichen juristischen Wegen – nicht auf einem anderen Quran oder einem anderen Propheten.',
    sources: [
      { title: 'Hanefî Mezhebi', publisher: 'TDV İslâm Ansiklopedisi', href: 'https://islamansiklopedisi.org.tr/hanefi-mezhebi', language: 'Türkisch', homepage: 'https://islamansiklopedisi.org.tr/' },
    ],
  },
  {
    id: 'maliki',
    name: 'Maliki',
    title: 'Malikitisch',
    arabic: 'الْمَذْهَبُ الْمَالِكِيُّ',
    pronunciation: 'al-Madhhab al-Mālikī',
    eponym: 'Malik ibn Anas',
    dates: 'Gestorben 179 AH · 795 n. Chr.',
    origin: 'Medina',
    short: 'Eine in Medina gewachsene Rechtstradition, die neben den Textquellen der überlieferten Praxis Medinas besonderes Gewicht gibt.',
    history: [
      'Die Schule ist nach Malik ibn Anas, dem Gelehrten von Medina und Verfasser des al-Muwatta, benannt.',
      'Seine Schüler trugen seine Lehre nach Ägypten, Nordafrika und al-Andalus. Auch hier entwickelten spätere Gelehrte das Schulwerk über Jahrhunderte weiter.',
    ],
    method: [
      { title: 'Gemeinsame Grundlage', text: 'Quran und Sunnah stehen am Anfang. Konsens und Analogieschluss gehören ebenfalls zur juristischen Arbeit.' },
      { title: 'Praxis der Menschen Medinas', text: 'Der überlieferten Praxis Medinas (ʿAmal ahl al-Madina) kommt besonderes Gewicht zu, weil dort viele Gefährten und ihre Schüler lebten.' },
      { title: 'Nutzen und Vorbeugung', text: 'Öffentliches Wohl (Maslaha) und das Verhindern von Wegen zu Schaden (Sadd adh-Dharaʾi) spielen in der später ausformulierten Methodik eine erkennbare Rolle.' },
    ],
    spread: 'Historisch und bis heute besonders in Nord- und Westafrika verbreitet. Regionale Praxis kann innerhalb derselben Schule verschiedene Lehrwege und anerkannte Auffassungen kennen.',
    practice: 'Die Schule ist keine Sammlung von Gewohnheiten Medinas ohne Belege. Sie besitzt eine ausgearbeitete Methodik, in der Text, Überlieferung und juristische Herleitung zusammenspielen.',
    sources: [
      { title: 'Mâlikî Mezhebi', publisher: 'TDV İslâm Ansiklopedisi', href: 'https://islamansiklopedisi.org.tr/maliki-mezhebi', language: 'Türkisch', homepage: 'https://islamansiklopedisi.org.tr/' },
    ],
  },
  {
    id: 'shafii',
    name: 'Shafiʿi',
    title: 'Schafiitisch',
    arabic: 'الْمَذْهَبُ الشَّافِعِيُّ',
    pronunciation: 'al-Madhhab asch-Schāfiʿī',
    eponym: 'Muhammad ibn Idris asch-Schafiʿi',
    dates: 'Gestorben 204 AH · 820 n. Chr.',
    origin: 'Makka, Bagdad und Ägypten',
    short: 'Eine Rechtstradition, die das Verhältnis von Quran, Sunnah, Konsens und Analogieschluss besonders systematisch ordnete.',
    history: [
      'Asch-Schafiʿi lernte unter anderem bei Malik ibn Anas und begegnete später auch der irakischen Rechtstradition.',
      'Seine Schriften – besonders ar-Risala – prägten die systematische Lehre von den Grundlagen juristischer Herleitung. In Ägypten überarbeitete er Teile seiner früheren Auffassungen.',
    ],
    method: [
      { title: 'Quran und Sunnah', text: 'Die prophetische Sunnah wird als eigenständige, verbindliche Erklärung neben dem Quran methodisch deutlich gefasst.' },
      { title: 'Geordnete Herleitung', text: 'Konsens und Analogieschluss werden in eine geregelte Beweisführung eingeordnet. Qiyas verbindet einen neuen Fall über einen erkennbaren gemeinsamen Grund mit einem belegten Fall.' },
      { title: 'Keine freie Vorliebe', text: 'Asch-Schafiʿi wandte sich gegen ein ungeregeltes Istihsan: Ein Urteil soll nicht bloß deshalb gelten, weil es einer Person angemessen erscheint.' },
    ],
    spread: 'Historisch besonders in Teilen Ägyptens, Ostafrikas, des Jemen und Südostasiens verbreitet. Auch diese Verteilung hat sich über die Jahrhunderte verändert.',
    practice: 'Die schafiitische Methodik versucht, einzelne Urteile eng an eine nachvollziehbare Beweiskette zu binden. Das verhindert dennoch nicht, dass innerhalb der Schule mehrere überlieferte Auffassungen vorkommen.',
    sources: [
      { title: 'Şâfiî Mezhebi', publisher: 'TDV İslâm Ansiklopedisi', href: 'https://islamansiklopedisi.org.tr/safii-mezhebi', language: 'Türkisch', homepage: 'https://islamansiklopedisi.org.tr/' },
    ],
  },
  {
    id: 'hanbali',
    name: 'Hanbali',
    title: 'Hanbalitisch',
    arabic: 'الْمَذْهَبُ الْحَنْبَلِيُّ',
    pronunciation: 'al-Madhhab al-Hanbalī',
    eponym: 'Ahmad ibn Hanbal',
    dates: 'Gestorben 241 AH · 855 n. Chr.',
    origin: 'Bagdad',
    short: 'Eine in Bagdad gewachsene Rechtstradition mit besonders starker Ausrichtung auf Textbelege und überlieferte Aussagen der frühen Generationen.',
    history: [
      'Die Schule ist nach dem Hadithgelehrten und Juristen Ahmad ibn Hanbal benannt.',
      'Seine Schüler sammelten Antworten zu Rechtsfragen. Spätere Gelehrte ordneten diese Überlieferungen, klärten mehrere Berichte zu einer Frage und bauten daraus die Methodik der Schule aus.',
    ],
    method: [
      { title: 'Text und Überlieferung', text: 'Quran, Sunnah und überlieferte Auffassungen der Gefährten erhalten ein besonders sichtbares Gewicht.' },
      { title: 'Vorsicht bei Spekulation', text: 'Wo ein naher Textbeleg oder eine frühe Überlieferung vorliegt, wird freie juristische Spekulation bewusst zurückgestellt.' },
      { title: 'Qiyas bleibt Teil der Schule', text: 'Analogieschluss wird nicht pauschal ausgeschlossen. Er kommt innerhalb der später entwickelten Schulmethodik dort zum Einsatz, wo kein näherer Beleg entscheidet.' },
    ],
    spread: 'Historisch in mehreren Regionen vertreten, besonders auf der Arabischen Halbinsel. Aus der Verbreitung lässt sich keine Rangfolge ableiten.',
    practice: '„Stärker textorientiert“ bedeutet nicht, dass die anderen Schulen Quran und Sunnah weniger achten. Der Unterschied liegt darin, wie Belege gewichtet, verbunden und auf neue Fälle angewandt werden.',
    sources: [
      { title: 'Hanbelî Mezhebi', publisher: 'TDV İslâm Ansiklopedisi', href: 'https://islamansiklopedisi.org.tr/hanbeli-mezhebi', language: 'Türkisch', homepage: 'https://islamansiklopedisi.org.tr/' },
    ],
  },
] as const;
