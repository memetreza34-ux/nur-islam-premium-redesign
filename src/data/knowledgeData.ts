/**
 * Wissensbibliothek.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`. Der Bereich zeigte
 * bisher vier Stichpunkte; die zwölf Themen samt Abschnitten und Glossar lagen
 * dort vollständig vor.
 *
 * Die fachliche Prüfung steht wie bei allen religiösen Inhalten aus.
 */

export type KnowledgeSection = {
  subtitle: string;
  text: string;
};

export type KnowledgeTopic = {
  id: string;
  title: string;
  intro: string;
  sections: KnowledgeSection[];
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export const KNOWLEDGE_TOPICS: readonly KnowledgeTopic[] = [
  {
    id: 'what-is-islam',
    title: 'Was ist Islam?',
    intro: 'Der Islam ist eine monotheistische Religion, die auf der Hingabe an den einen Gott (Allah) basiert.',
    sections: [
      { subtitle: 'Bedeutung', text: 'Das Wort "Islam" stammt von der arabischen Wurzel "s-l-m", was Frieden und Hingabe bedeutet.' },
      { subtitle: 'Der Kern', text: 'Im Zentrum steht das Bekenntnis, dass es keinen Gott außer Allah gibt und Muhammad Sein Gesandter ist.' },
      { subtitle: 'Lebensweise', text: 'Der Islam ist nicht nur eine Religion, sondern eine umfassende Lebensweise, die Frieden und Gerechtigkeit fördert.' },
    ],
  },
  {
    id: '5-pillars',
    title: 'Die 5 Säulen des Islam',
    intro: 'Die fünf Säulen bilden das Fundament des muslimischen Lebens und Glaubens.',
    sections: [
      { subtitle: '1. Shahada', text: 'Das Glaubensbekenntnis: "Es gibt keinen Gott außer Allah, und Muhammad ist Sein Gesandter."' },
      { subtitle: '2. Salah', text: 'Die fünf täglichen Pflichtgebete zu festgesetzten Zeiten.' },
      { subtitle: '3. Zakah', text: 'Die verpflichtende Abgabe eines Teils des Vermögens an Bedürftige.' },
      { subtitle: '4. Sawm', text: 'Das Fasten im Monat Ramadan von der Morgendämmerung bis zum Sonnenuntergang.' },
      { subtitle: '5. Hajj', text: 'Die Pilgerfahrt nach Makkah, die einmal im Leben für jene Pflicht ist, die dazu fähig sind.' },
    ],
  },
  {
    id: '6-articles',
    title: 'Die 6 Glaubensgrundsätze',
    intro: 'Diese Grundsätze definieren, woran ein Muslim im Inneren glaubt (Iman).',
    sections: [
      { subtitle: '1. Allah', text: 'Der Glaube an den einen, einzigen Gott ohne Partner.' },
      { subtitle: '2. Engel', text: 'Der Glaube an die Engel als Diener Allahs aus Licht.' },
      { subtitle: '3. Bücher', text: 'Der Glaube an die offenbarten Schriften (Koran, Evangelium, Thora, Psalmen).' },
      { subtitle: '4. Propheten', text: 'Der Glaube an alle Gesandten Allahs, von Adam bis Muhammad (saws).' },
      { subtitle: '5. Jüngster Tag', text: 'Der Glaube an die Auferstehung und das Jenseits.' },
      { subtitle: '6. Vorherbestimmung', text: 'Der Glaube an Allahs Wissen und Bestimmung über alles.' },
    ],
  },
  {
    id: 'salah',
    title: 'Was ist Salah?',
    intro: 'Salah ist das tägliche Gebet und die direkte Verbindung zwischen dem Gläubigen und Allah.',
    sections: [
      { subtitle: 'Zweck', text: 'Es dient dazu, Allah zu gedenken, Ihm zu danken und um Rechtleitung zu bitten.' },
      { subtitle: 'Zeiten', text: 'Es wird fünfmal täglich verrichtet: Fajr, Dhuhr, Asr, Maghrib und Isha.' },
      { subtitle: 'Voraussetzung', text: 'Vor dem Gebet wird die rituelle Waschung (Wudu) vollzogen.' },
    ],
  },
  {
    id: 'zakah',
    title: 'Was ist Zakah?',
    intro: 'Zakah ist die soziale Pflichtabgabe, die den Reichtum reinigt und Bedürftigen hilft.',
    sections: [
      { subtitle: 'Bedeutung', text: 'Das Wort bedeutet "Reinigung" und "Wachstum".' },
      { subtitle: 'Berechnung', text: 'In der Regel werden 2,5% des überschüssigen Vermögens pro Jahr gespendet.' },
      { subtitle: 'Wirkung', text: 'Es fördert soziale Gerechtigkeit und mindert Gier im Herzen.' },
    ],
  },
  {
    id: 'sawm',
    title: 'Was ist Sawm?',
    intro: 'Sawm ist das Fasten im heiligen Monat Ramadan.',
    sections: [
      { subtitle: 'Ablauf', text: 'Vom ersten Licht der Morgendämmerung bis zum Sonnenuntergang wird auf Essen, Trinken und Intimität verzichtet.' },
      { subtitle: 'Ziel', text: 'Es stärkt die Selbstbeherrschung, Gottesfurcht (Taqwa) und das Mitgefühl für die Armen.' },
      { subtitle: 'Ausnahmen', text: 'Kranke, Reisende, Kinder und Schwangere sind vom Fasten befreit.' },
    ],
  },
  {
    id: 'hajj',
    title: 'Was ist Hajj?',
    intro: 'Die Hajj ist die jährliche Pilgerfahrt nach Makkah.',
    sections: [
      { subtitle: 'Pflicht', text: 'Jeder Muslim, der körperlich und finanziell dazu in der Lage ist, muss die Hajj einmal im Leben vollziehen.' },
      { subtitle: 'Einheit', text: 'Millionen von Muslimen aus aller Welt kommen zusammen, was die Gleichheit aller Menschen vor Gott symbolisiert.' },
      { subtitle: 'Rituale', text: 'Dazu gehören das Umrunden der Kaaba und das Stehen auf der Ebene von Arafat.' },
    ],
  },
  {
    id: 'sunnah',
    title: 'Was ist Sunnah?',
    intro: 'Die Sunnah bezeichnet den Weg und die Lebensweise des Propheten Muhammad (saws).',
    sections: [
      { subtitle: 'Vorbild', text: 'Sie dient als praktisches Beispiel dafür, wie man den Koran im Alltag umsetzt.' },
      { subtitle: 'Hadith', text: 'Die Sunnah wird durch Hadithe (überlieferte Aussprüche und Taten) an uns weitergegeben.' },
      { subtitle: 'Bedeutung', text: 'Das Befolgen der Sunnah hilft dabei, Allahs Liebe und Wohlgefallen zu erlangen.' },
    ],
  },
  {
    id: 'madhhabs',
    title: 'Die 4 Rechtsschulen (Madhahib)',
    intro: 'Im sunnitischen Islam gibt es vier anerkannte Rechtsschulen (Madhahib), die sich in der Methodik der Rechtsfindung (Fiqh) unterscheiden, aber alle auf dem Koran und der Sunnah basieren. Sie sind alle zu 100% gültig und respektiert.',
    sections: [
      { subtitle: '1. Hanafi', text: 'Gegründet von Imam Abu Hanifa (gest. 767 n. Chr.). Bekannt für die starke Betonung der Vernunft (Qiyas) bei der Rechtsfindung. Weit verbreitet in der Türkei, Südasien (Indien, Pakistan, Bangladesch), Zentralasien und dem Balkan.' },
      { subtitle: '2. Maliki', text: 'Gegründet von Imam Malik ibn Anas (gest. 795 n. Chr.). Stützt sich stark auf die Praxis der Bewohner von Medina (Amal Ahl al-Madinah), da diese die direkte Tradition des Propheten (saws) erlebten. Vorherrschend in Nord- und Westafrika.' },
      { subtitle: '3. Shafi\'i', text: 'Gegründet von Imam Al-Shafi\'i (gest. 820 n. Chr.). Er systematisierte die Prinzipien der islamischen Rechtswissenschaft (Usul al-Fiqh) und suchte einen Mittelweg zwischen der Hanafi- und Maliki-Schule. Weit verbreitet in Südostasien (Indonesien, Malaysia), Ägypten, Ostafrika und Teilen des Nahen Ostens.' },
      { subtitle: '4. Hanbali', text: 'Gegründet von Imam Ahmad ibn Hanbal (gest. 855 n. Chr.). Bekannt für die strikte Anlehnung an den Text (Koran und Hadith) und die Zurückhaltung bei der Anwendung von Vernunftschlüssen, wenn Texte vorhanden sind. Hauptsächlich auf der Arabischen Halbinsel verbreitet.' },
      { subtitle: 'Gemeinsamkeit', text: 'Alle vier Schulen erkennen sich gegenseitig als orthodox und gültig an. Die Unterschiede liegen in Details der Ausübung (z.B. Gebetshaltung) und Methodik, nicht in den Glaubensgrundlagen (Aqidah).' },
    ],
  },
  {
    id: 'akhlaq',
    title: 'Charakter & Ethik (Akhlaq)',
    intro: 'Der Prophet Muhammad (saws) sagte: "Ich wurde nur gesandt, um die edlen Charaktereigenschaften zu vervollkommnen."',
    sections: [
      { subtitle: 'Ehrlichkeit (Sidq)', text: 'Ein Muslim ist stets wahrhaftig in Worten und Taten. Ehrlichkeit ist die Grundlage des Vertrauens.' },
      { subtitle: 'Geduld (Sabr)', text: 'Standhaftigkeit in schwierigen Zeiten und Selbstbeherrschung sind zentrale Tugenden.' },
      { subtitle: 'Güte zu Eltern', text: 'Der Respekt und die Fürsorge für die Eltern stehen im Islam an extrem hoher Stelle.' },
      { subtitle: 'Nachbarschaft', text: 'Gutes Benehmen gegenüber Nachbarn, unabhängig von ihrem Glauben, ist eine religiöse Pflicht.' },
    ],
  },
  {
    id: 'knowledge-islam',
    title: 'Wissen im Islam',
    intro: 'Das Streben nach Wissen ist eine Pflicht für jeden Muslim, Mann oder Frau.',
    sections: [
      { subtitle: 'Erster Befehl', text: 'Das erste Wort, das dem Propheten (saws) offenbart wurde, war "Iqra" (Lies!).' },
      { subtitle: 'Status der Gelehrten', text: 'Gelehrte haben im Islam einen hohen Rang, da sie das Erbe der Propheten bewahren.' },
      { subtitle: 'Nutzen', text: 'Wissen soll nicht nur angehäuft, sondern zum Wohle der Menschheit angewendet werden.' },
    ],
  },
];

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  { term: 'Ummah', definition: 'Die weltweite Gemeinschaft der Muslime.' },
  { term: 'Qibla', definition: 'Die Gebetsrichtung nach Makkah (Kaaba).' },
  { term: 'Wudu', definition: 'Die rituelle Waschung vor dem Gebet.' },
  { term: 'Dhikr', definition: 'Das Gedenken an Allah durch Lobpreisung.' },
  { term: 'Dua', definition: 'Das persönliche Bittgebet zu Allah.' },
  { term: 'Hadith', definition: 'Überlieferte Aussprüche oder Taten des Propheten.' },
];
