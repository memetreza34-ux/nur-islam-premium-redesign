/**
 * Anfängerfreundliche Anleitungen für rituelle Reinheit und Gebet.
 *
 * Release-Regel: Nur Inhalte, deren Grundablauf nachvollziehbar aus Quran oder
 * belastbaren Hadithen abgeleitet werden kann, werden hier als Lernfolge
 * angezeigt. Rechtsschulabhängige Listen von "Säulen", "Pflichten" oder
 * Ungültigkeitsgründen bleiben bis zum fachlichen Review bewusst ohne
 * Detailanweisung.
 */

export type WorshipStep = {
  title: string;
  description: string;
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
    intro: 'Wudu ist die rituelle Gebetswaschung. Quran 5:6 nennt die grundlegenden zu waschenden bzw. zu streichenden Körperbereiche; authentische Hadithe beschreiben ausführlichere prophetische Wudu-Abläufe.',
    steps: [
      {
        title: 'Absicht',
        description: 'Beabsichtige im Herzen, Wudu zu vollziehen. Die Absicht ist keine auswendig zu sprechende Formel.',
      },
      {
        title: 'Hände waschen',
        description: 'Wasche zu Beginn die Hände. In authentischen Beschreibungen des prophetischen Wudu ist dreimaliges Waschen überliefert.',
      },
      {
        title: 'Mund und Nase reinigen',
        description: 'Spüle den Mund und reinige die Nase mit Wasser. In authentischen Wudu-Beschreibungen ist dies mehrfach überliefert.',
      },
      {
        title: 'Gesicht waschen',
        description: 'Wasche das Gesicht vollständig. Quran 5:6 nennt das Waschen des Gesichts ausdrücklich; dreimaliges Waschen ist in authentischen Wudu-Beschreibungen überliefert.',
      },
      {
        title: 'Arme bis zu den Ellenbogen waschen',
        description: 'Wasche die Arme einschließlich der Ellenbogen. Quran 5:6 nennt diesen Bereich ausdrücklich. Die überlieferten Wudu-Beschreibungen zeigen unterschiedliche zulässige Wiederholungszahlen.',
      },
      {
        title: 'Über den Kopf streichen',
        description: 'Streiche mit feuchten Händen über den Kopf. Quran 5:6 nennt das Streichen über den Kopf; die genaue Ausführung wird in den Rechtsschulen in Details unterschiedlich beschrieben.',
      },
      {
        title: 'Füße bis zu den Knöcheln waschen',
        description: 'Wasche die Füße einschließlich der Knöchel. Quran 5:6 nennt diesen Bereich ausdrücklich.',
      },
      {
        title: 'Shahada nach dem Wudu',
        description: 'Nach vollständig ausgeführtem Wudu ist die folgende Shahada authentisch in Sahih Muslim 234a/234b überliefert:',
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: "Ashhadu an la ilaha illallah wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
      },
    ],
    tips: [
      'Grundlage: Quran 5:6.',
      'Ausführliche Wudu-Beschreibungen: Sahih al-Bukhari 164 und Sahih Muslim 235a.',
      'Die Zahl drei ist in authentischen Wudu-Beschreibungen häufig überliefert, aber nicht jeder Waschschritt wird dadurch zu einer universell dreimal verpflichtenden Handlung.',
      'Details zu Reihenfolge, Ohren, Bismillah und einzelnen Pflicht-/Sunnah-Einordnungen unterscheiden sich zwischen Rechtsschulen und bleiben bis zum Fachreview bewusst getrennt.',
    ],
  },
  {
    id: 'salah',
    title: 'Salah (Gebet)',
    intro: 'Für den Gebetsablauf nutzt Nur Islam den separaten Rakʿah-für-Rakʿah-Kurs. Diese ältere Kurzfassung wird nicht mehr als zweite verbindliche Anleitung angezeigt.',
    steps: [
      {
        title: 'Zum Gebetskurs wechseln',
        description: 'Nutze den Bereich „Beten lernen“. Dort werden die fünf Pflichtgebete einzeln gezeigt und Rechtsschul-Unterschiede ausdrücklich gekennzeichnet.',
      },
    ],
    tips: ['Die fünf Pflichtgebete und ihre Pflicht-Rakʿah bleiben im eigenen Gebetskurs erhalten.'],
  },
  {
    id: 'what-to-say',
    title: 'Wortlaut im Gebet',
    intro: 'Arabische Gebetstexte werden im Rakʿah-für-Rakʿah-Kurs an der jeweiligen Position gezeigt. Diese alte Doppelliste wird nicht mehr als eigenständige verbindliche Fassung verwendet.',
    steps: [
      {
        title: 'Geprüften Lernpfad verwenden',
        description: 'Öffne den Gebetskurs für Takbir, Al-Fatiha, Ruku, Sujud, Tashahhud, Salawat und Taslim im jeweiligen Ablauf.',
      },
    ],
    tips: ['Aussprache-Audio wird erst mit einer geeigneten geprüften und lizenzierten Quelle ergänzt.'],
  },
  {
    id: 'mandatory',
    title: 'Pflichtteile & Grundlagen',
    intro: 'Die genaue juristische Einteilung in Säulen, Pflichten und Sunnah-Handlungen ist nicht in allen Rechtsschulen identisch. Deshalb zeigt die App hier bis zum fachlichen Review keine universelle Liste.',
    steps: [
      {
        title: 'Rechtsschul-Unterschiede beachten',
        description: 'Für die verbindliche Einordnung dessen, was bei Vergessen oder Auslassen das Gebet ungültig macht oder wie es ausgeglichen wird, ist die jeweilige Rechtsschule bzw. eine qualifizierte Lehrperson maßgeblich.',
      },
    ],
    tips: ['Nur Islam gibt hier bewusst keine individuelle Fatwa und keine scheinbar rechtsschulübergreifende Ungültigkeitsregel aus.'],
  },
  {
    id: 'mistakes',
    title: 'Häufige Fehler',
    intro: 'Allgemeine Lernhinweise dürfen nicht mit rechtlichen Urteilen über Gültigkeit verwechselt werden. Die frühere Liste enthielt solche Vermischungen und ist deshalb bis zum Fachreview zurückgenommen.',
    steps: [
      {
        title: 'Sicherer Grundsatz',
        description: 'Bete mit Ruhe und folge einer verlässlichen Lernmethode. Wenn du unsicher bist, ob ein konkreter Fehler das Gebet beeinflusst, frage mit vollständigem Kontext eine qualifizierte Lehrperson.',
      },
    ],
    tips: ['Insbesondere Gemeinschaftsgebet, Vergessen, zusätzliche Bewegungen und Rezitationsdetails können eine genauere fiqhbezogene Einordnung benötigen.'],
  },
];

export const WORSHIP_GUIDE_BY_ID = new Map(WORSHIP_GUIDES.map((guide) => [guide.id, guide]));
