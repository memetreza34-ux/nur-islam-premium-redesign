/**
 * Wissensbibliothek.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`. Der Bereich zeigte
 * bisher vier Stichpunkte; die Themen samt Abschnitten und Glossar lagen
 * dort vollständig vor.
 *
 * Sinngemäße Lerntexte mit Einzelfundstellen; KI-Quellenabgleich ist keine
 * menschliche Fachfreigabe. Siehe docs/KNOWLEDGE-SOURCE-AUDIT-2026-10-11.md.
 */

export type KnowledgeSection = {
  subtitle: string;
  text: string;
  source: string;
  sourceUrl: string;
};

export type KnowledgeTopic = {
  id: string;
  title: string;
  intro: string;
  source: string;
  sourceUrl: string;
  sections: KnowledgeSection[];
};

export type GlossaryTerm = {
  term: string;
  definition: string;
  source: string;
  sourceUrl: string;
};

export const KNOWLEDGE_TOPICS: readonly KnowledgeTopic[] = [
  {
    id: 'what-is-islam',
    title: 'Was ist Islam?',
    intro: 'Der Islam ist eine monotheistische Religion, die auf der Hingabe an den einen Gott (Allah) basiert.',
    source: 'Quran 3:19–20', sourceUrl: 'https://quran.com/3/19',
    sections: [
      { subtitle: 'Bedeutung', text: 'Islam wird hier als Hingabe an Allah erklärt. Quran 3:19–20 verbindet die Religion mit dieser Hingabe; das ist keine wörtliche Übersetzung einer arabischen Wortwurzel.', source: 'Quran 3:19–20', sourceUrl: 'https://quran.com/3/19' },
      { subtitle: 'Der Kern', text: 'Im Zentrum steht das Bekenntnis, dass es keinen Gott außer Allah gibt und Muhammad Sein Gesandter ist.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: 'Lebensweise', text: 'Zum islamischen Leben gehört der Umgang mit anderen Menschen. Quran 16:90 fordert Gerechtigkeit, Güte und Unterstützung für Verwandte und untersagt Unrecht.', source: 'Quran 16:90', sourceUrl: 'https://quran.com/16/90' },
    ],
  },
  {
    id: '5-pillars',
    title: 'Die 5 Säulen des Islam',
    intro: 'Die fünf Säulen bilden das Fundament des muslimischen Lebens und Glaubens.',
    source: 'Sahih Muslim 8a · Jibril-Hadith', sourceUrl: 'https://sunnah.com/muslim:8a',
    sections: [
      { subtitle: '1. Shahada', text: 'Das Glaubensbekenntnis, sinngemäß: Es gibt keinen Gott außer Allah, und Muhammad ist Sein Gesandter.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: '2. Salah', text: 'Die fünf täglichen Pflichtgebete.', source: 'Sahih al-Bukhari 46', sourceUrl: 'https://sunnah.com/bukhari:46' },
      { subtitle: '3. Zakah', text: 'Die verpflichtende Vermögensabgabe unter ihren jeweiligen Voraussetzungen. Die Empfängergruppen nennt Quran 9:60; Zakah ist nicht mit jeder freiwilligen Spende gleichzusetzen.', source: 'Quran 9:60', sourceUrl: 'https://quran.com/9/60' },
      { subtitle: '4. Sawm', text: 'Das Fasten im Monat Ramadan. Der Fastentag reicht vom Eintritt der Morgendämmerung (Fajr) bis zum Sonnenuntergang.', source: 'Quran 2:187 · Sahih al-Bukhari 1916 und 1954', sourceUrl: 'https://quran.com/2/187' },
      { subtitle: '5. Hajj', text: 'Die Pilgerfahrt nach Makkah für jene, die dazu fähig sind. Sie ist nicht jedes Jahr erneut verpflichtend.', source: 'Sahih Muslim 8a und 1337', sourceUrl: 'https://sunnah.com/muslim:1337' },
    ],
  },
  {
    id: '6-articles',
    title: 'Die 6 Glaubensgrundsätze',
    intro: 'Der Jibril-Hadith nennt diese sechs Glaubensinhalte (Iman).',
    source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a',
    sections: [
      { subtitle: '1. Allah', text: 'Der Glaube an Allah; das im selben Hadith genannte Bekenntnis bezeugt, dass es keinen Gott außer Ihm gibt.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: '2. Engel', text: 'Der Glaube an Allahs Engel. Dass sie aus Licht erschaffen wurden, wird in Sahih Muslim 2996 überliefert.', source: 'Sahih Muslim 8a und 2996', sourceUrl: 'https://sunnah.com/muslim:2996' },
      { subtitle: '3. Bücher', text: 'Der Glaube an die von Allah offenbarten Schriften.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: '4. Propheten', text: 'Der Glaube an Allahs Gesandte.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: '5. Jüngster Tag', text: 'Der Glaube an den Jüngsten Tag.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
      { subtitle: '6. Vorherbestimmung', text: 'Der Glaube an die göttliche Vorherbestimmung, ihr Gutes und ihr Schlechtes. Diese Kurzfassung erklärt nicht sämtliche theologischen Einzelheiten.', source: 'Sahih Muslim 8a', sourceUrl: 'https://sunnah.com/muslim:8a' },
    ],
  },
  {
    id: 'salah',
    title: 'Was ist Salah?',
    intro: 'Salah bezeichnet das rituelle Gebet. Zu den Pflichten gehören fünf Gebete am Tag und in der Nacht.',
    source: 'Sahih al-Bukhari 46', sourceUrl: 'https://sunnah.com/bukhari:46',
    sections: [
      { subtitle: 'Zweck', text: 'Das Gebet dient dem Gedenken an Allah. Quran 20:14 nennt diesen Zusammenhang in der Ansprache an Musa.', source: 'Quran 20:14', sourceUrl: 'https://quran.com/20/14' },
      { subtitle: 'Zeiten', text: 'Fünf tägliche Pflichtgebete werden verrichtet: Fajr, Dhuhr, Asr, Maghrib und Isha.', source: 'Sahih al-Bukhari 46 · Sahih Muslim 612a', sourceUrl: 'https://sunnah.com/muslim:612a' },
      { subtitle: 'Voraussetzung', text: 'Für das Gebet ist rituelle Reinheit erforderlich. Bestehendes Wudu muss nicht vor jedem Gebet neu gemacht werden. Ghusl und Tayammum haben eigene Voraussetzungen.', source: 'Quran 5:6 · Grundlage der Reinheitsregeln', sourceUrl: 'https://quran.com/5/6' },
    ],
  },
  {
    id: 'zakah',
    title: 'Was ist Zakah?',
    intro: 'Zakah ist die soziale Pflichtabgabe, die den Reichtum reinigt und Bedürftigen hilft.',
    source: 'Quran 9:60 und 9:103', sourceUrl: 'https://quran.com/9/60',
    sections: [
      { subtitle: 'Bedeutung', text: 'Quran 9:103 verbindet die Vermögensabgabe mit Reinigung und Läuterung. Hier wird dieser religiöse Zusammenhang erläutert, keine vollständige sprachliche Definition.', source: 'Quran 9:103', sourceUrl: 'https://quran.com/9/103' },
      { subtitle: 'Berechnung', text: 'Bei bestimmten zakatpflichtigen Vermögensarten gilt ein Satz von 2,5 %, wenn unter anderem Nisab und die erforderliche Besitzdauer erfüllt sind. Das ist keine pauschale Abgabe auf alles Vermögen. Vermögensart, Schulden und Rechtsschule müssen berücksichtigt werden.', source: 'Sunan Abi Dawud 1573 · Gold und Silber, Schwelle und Besitzdauer', sourceUrl: 'https://sunnah.com/abudawud:1573' },
      { subtitle: 'Wirkung', text: 'Zakah unterstützt die in Quran 9:60 genannten Empfängergruppen, darunter Arme, Bedürftige und Verschuldete. Nicht jeder wohltätige Zweck ist automatisch ein zulässiger Zakah-Empfänger.', source: 'Quran 9:60', sourceUrl: 'https://quran.com/9/60' },
    ],
  },
  {
    id: 'sawm',
    title: 'Was ist Sawm?',
    intro: 'Sawm ist das Fasten im heiligen Monat Ramadan.',
    source: 'Sahih Muslim 8a · Ramadanfasten', sourceUrl: 'https://sunnah.com/muslim:8a',
    sections: [
      { subtitle: 'Ablauf', text: 'Vom Eintritt der Morgendämmerung (Fajr) bis zum Sonnenuntergang wird auf Essen, Trinken und Geschlechtsverkehr verzichtet. „Intimität“ wäre zu pauschal: Nicht jede Form von Nähe ist damit gemeint.', source: 'Quran 2:187 · Sahih al-Bukhari 1916 und 1954', sourceUrl: 'https://quran.com/2/187' },
      { subtitle: 'Ziel', text: 'Quran 2:183 verbindet das vorgeschriebene Fasten mit Gottesbewusstsein (Taqwa). Das ist keine Garantie für eine bestimmte persönliche oder gesundheitliche Wirkung.', source: 'Quran 2:183', sourceUrl: 'https://quran.com/2/183' },
      { subtitle: 'Ausnahmen', text: 'Für Krankheit und Reisen nennt der Quran Erleichterungen und das Nachholen. Schwangerschaft und Stillzeit haben situationsabhängige Regeln; sie bedeuten keine pauschale dauerhafte Befreiung. Voraussetzungen, Nachholen und mögliche Ersatzleistungen gehören in eine qualifizierte Auskunft.', source: 'Quran 2:184–185 · Sunan Abi Dawud 2408; rechtliche Einzelheiten fachlich klären', sourceUrl: 'https://quran.com/2/184-185' },
    ],
  },
  {
    id: 'hajj',
    title: 'Was ist Hajj?',
    intro: 'Die Hajj ist die Pilgerfahrt zum Heiligtum in Makkah. Der prophetische Ablauf wird unter anderem von Jabir überliefert.',
    source: 'Sahih Muslim 1218a', sourceUrl: 'https://sunnah.com/muslim:1218a',
    sections: [
      { subtitle: 'Pflicht', text: 'Quran 3:97 knüpft die Pilgerpflicht an die Fähigkeit dazu. Sahih Muslim 1337 stellt klar, dass sie nicht jährlich erneut verpflichtend ist. Die persönlichen Voraussetzungen werden hier nicht abschließend beurteilt.', source: 'Quran 3:97 · Sahih Muslim 1337', sourceUrl: 'https://quran.com/3/97' },
      { subtitle: 'Einheit', text: 'Die Pilgerfahrt erinnert an eine Gemeinschaft über Herkunftsgrenzen hinweg. Diese didaktische Einordnung steht im Zusammenhang mit Quran 49:13: Völker und Stämme sollen einander kennenlernen; der Maßstab vor Allah ist Gottesbewusstsein, nicht Herkunft.', source: 'Quran 49:13 · Einordnung, keine Pilgerstatistik', sourceUrl: 'https://quran.com/49/13' },
      { subtitle: 'Rituale', text: 'Dazu gehören das Umrunden der Kaaba (Tawaf) und der Aufenthalt bei Arafat. Jabirs Bericht beschreibt beide Stationen; diese Kurzfassung ist keine vollständige Hajj-Anleitung.', source: 'Sahih Muslim 1218a', sourceUrl: 'https://sunnah.com/muslim:1218a' },
    ],
  },
  {
    id: 'sunnah',
    title: 'Was ist Sunnah?',
    intro: 'Die Sunnah bezeichnet den Weg und die Lebensweise des Propheten Muhammad (saws).',
    source: 'Sunnah.com · Über Hadith und Sunnah', sourceUrl: 'https://sunnah.com/about',
    sections: [
      { subtitle: 'Vorbild', text: 'Quran 33:21 bezeichnet Allahs Gesandten als gutes Vorbild für jene, die auf Allah und den Jüngsten Tag hoffen und Allah häufig gedenken.', source: 'Quran 33:21', sourceUrl: 'https://quran.com/33/21' },
      { subtitle: 'Hadith', text: 'Hadithe überliefern unter anderem Worte, Handlungen und Billigungen des Propheten. Nicht jede Überlieferung ist allein deshalb authentisch; aus einem einzelnen Bericht folgt nicht automatisch eine allgemeine Rechtsregel.', source: 'Sunnah.com · About Hadith / Important Note', sourceUrl: 'https://sunnah.com/about' },
      { subtitle: 'Bedeutung', text: 'Quran 3:31 verbindet die Liebe zu Allah mit dem Folgen des Gesandten. Diese sinngemäße Zusammenfassung ist keine eigenständige rechtliche Einordnung jeder überlieferten Handlung.', source: 'Quran 3:31', sourceUrl: 'https://quran.com/3/31' },
    ],
  },
  {
    id: 'madhhabs',
    title: 'Die 4 Rechtsschulen (Madhahib)',
    intro: 'Die vier verbreiteten sunnitischen Rechtsschulen heißen Hanafi, Maliki, Shafi’i und Hanbali. Sie unterscheiden sich in ihrer Rechtsmethodik und in einzelnen praktischen Regeln. Dieser Überblick ersetzt keine rechtsschulbezogene Auskunft.',
    source: 'TDV İslâm Ansiklopedisi · sunnitische Rechtsschulen', sourceUrl: 'https://islamansiklopedisi.org.tr/hanefi-mezhebi',
    sections: [
      { subtitle: '1. Hanafi', text: 'Die Schule ist nach Abu Hanifa benannt und entwickelte sich aus der Rechtstradition von Kufa im Irak. Auch seine Schüler prägten sie. Quran und Sunnah werden mit juristischen Methoden wie Qiyas (Analogieschluss) ausgelegt; Qiyas bedeutet nicht einfach freie Vernunft statt Textbeleg.', source: 'TDV · Hanefî Mezhebi, Entstehung', sourceUrl: 'https://islamansiklopedisi.org.tr/hanefi-mezhebi' },
      { subtitle: '2. Maliki', text: 'Die Schule ist nach Malik ibn Anas benannt und hat ihre Wurzeln in Medina. Neben Überlieferungen berücksichtigt sie die Praxis Medinas und juristische Methoden wie Qiyas. Die spätere Praxis der Stadt ist nicht pauschal mit unmittelbarer Augenzeugenschaft beim Propheten gleichzusetzen.', source: 'TDV · Mâlikî Mezhebi, Entstehung', sourceUrl: 'https://islamansiklopedisi.org.tr/maliki-mezhebi' },
      { subtitle: '3. Shafi\'i', text: 'Die Schule ist nach Imam asch-Schafi’i benannt. Er setzte sich mit den Rechtstraditionen des Hidschaz und des Irak auseinander und entwickelte einen eigenen Ansatz. Seine Schüler und spätere Gelehrte bauten die Schule weiter aus.', source: 'TDV · Şâfiî Mezhebi, Entstehung', sourceUrl: 'https://islamansiklopedisi.org.tr/safii-mezhebi' },
      { subtitle: '4. Hanbali', text: 'Die Schule entstand um die überlieferten Positionen Ahmad ibn Hanbals. Sein Studium von Hadithen prägte diesen Ansatz. Diese Kurzbeschreibung ist keine Rangfolge der Texttreue gegenüber den anderen Schulen.', source: 'TDV · Hanbelî Mezhebi, Entstehung', sourceUrl: 'https://islamansiklopedisi.org.tr/hanbeli-mezhebi' },
      { subtitle: 'Einordnung', text: 'Fiqh-Unterschiede werden hier nicht als Fehler oder als Rangliste von Rechtsschulen behandelt. Einzelne Überlieferungen reichen nicht aus, um ohne Rechtsmethodik selbst allgemeine Urteile abzuleiten.', source: 'Sunnah.com · Important Note', sourceUrl: 'https://sunnah.com/about' },
    ],
  },
  {
    id: 'akhlaq',
    title: 'Charakter & Ethik (Akhlaq)',
    intro: 'Charakter und guter Umgang mit Menschen sind wichtige Themen des islamischen Lernens. Dieser Überblick ist keine wörtliche Hadith-Wiedergabe.',
    source: 'Quran 16:90', sourceUrl: 'https://quran.com/16/90',
    sections: [
      { subtitle: 'Ehrlichkeit (Sidq)', text: 'Wahrhaftigkeit wird gefordert: Die Überlieferung verbindet sie mit rechtschaffenem Handeln und warnt vor Lügen. Sie behauptet nicht, dass jeder Muslim tatsächlich immer wahrhaftig handelt.', source: 'Sahih al-Bukhari 6094', sourceUrl: 'https://sunnah.com/bukhari:6094' },
      { subtitle: 'Geduld (Sabr)', text: 'Quran 2:153 fordert die Gläubigen auf, Hilfe in Geduld und Gebet zu suchen.', source: 'Quran 2:153', sourceUrl: 'https://quran.com/2/153' },
      { subtitle: 'Güte zu Eltern', text: 'Quran 17:23–24 fordert gute Behandlung, respektvolle Worte und Barmherzigkeit gegenüber den Eltern. Diese Kurzfassung entscheidet nicht jede Frage zu Gehorsam oder schwierigen Familienverhältnissen.', source: 'Quran 17:23–24', sourceUrl: 'https://quran.com/17/23-24' },
      { subtitle: 'Nachbarschaft', text: 'Quran 4:36 fordert Güte gegenüber nahen und fernen Nachbarn. Die Aufforderung wird hier als sinngemäßer Lerntext wiedergegeben.', source: 'Quran 4:36', sourceUrl: 'https://quran.com/4/36' },
    ],
  },
  {
    id: 'knowledge-islam',
    title: 'Wissen im Islam',
    intro: 'Das Lernen hat im Islam einen hohen Stellenwert. Sahih Muslim 2699a würdigt den Weg des Wissenserwerbs; damit wird hier keine pauschale Pflicht zu jedem Wissensgebiet behauptet.',
    source: 'Sahih Muslim 2699a', sourceUrl: 'https://sunnah.com/muslim:2699a',
    sections: [
      { subtitle: 'Erster Befehl', text: 'Aischas Bericht über den Beginn der Quran-Offenbarung beschreibt die Aufforderung „Iqra“ (Lies / rezitiere) und die ersten Verse von Sure 96. Der Bericht erwähnt zuvor wahrhaftige Träume; „erste Quran-Offenbarung“ ist daher präziser als jede Form von Offenbarung.', source: 'Sahih al-Bukhari 3', sourceUrl: 'https://sunnah.com/bukhari:3' },
      { subtitle: 'Status der Gelehrten', text: 'In dieser Überlieferung werden Gelehrte als Erben der Propheten bezeichnet: Gemeint ist das Wissen, nicht Geld. Die Quellenplattform gibt die Bewertung Sahih nach al-Albani an; das ist keine eigene KI-Authentifizierung.', source: 'Sunan Abi Dawud 3641 · Sahih nach al-Albani auf Sunnah.com', sourceUrl: 'https://sunnah.com/abudawud:3641' },
      { subtitle: 'Nutzen', text: 'Der Prophet bat Allah um Zuflucht vor Wissen, das keinen Nutzen bringt. Das lenkt den Blick auf nützliches Wissen, nicht nur auf die Menge des Gelernten.', source: 'Sahih Muslim 2722', sourceUrl: 'https://sunnah.com/muslim:2722' },
    ],
  },
];

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  { term: 'Ummah', definition: 'Hier: die Gemeinschaft der Muslime. Der Begriff kann je nach Kontext auch andere Gemeinschaften bezeichnen.', source: 'Quran 2:143 · andere Gemeinschaften: 6:38', sourceUrl: 'https://quran.com/2/143' },
  { term: 'Qibla', definition: 'Die Richtung, der man sich beim Gebet zuwendet; für Muslime zum Heiligtum in Makkah (Kaaba).', source: 'Quran 2:144', sourceUrl: 'https://quran.com/2/144' },
  { term: 'Wudu', definition: 'Die rituelle Waschung für das Gebet. Bestehendes Wudu muss nicht vor jedem Gebet erneuert werden.', source: 'Quran 5:6 · Reinheitsregeln und Erläuterung', sourceUrl: 'https://quran.com/5/6' },
  { term: 'Dhikr', definition: 'Das Gedenken an Allah, unter anderem durch Lobpreisung.', source: 'Quran 33:41–42', sourceUrl: 'https://quran.com/33/41-42' },
  { term: 'Dua', definition: 'Das Anrufen und Bitten Allahs; nicht auf eigene, frei formulierte Worte beschränkt.', source: 'Quran 40:60', sourceUrl: 'https://quran.com/40/60' },
  { term: 'Hadith', definition: 'Eine Überlieferung unter anderem über Worte, Handlungen oder Billigungen des Propheten. Die Bezeichnung allein sagt nichts über ihre Authentizität.', source: 'Sunnah.com · About Hadith', sourceUrl: 'https://sunnah.com/about' },
];
