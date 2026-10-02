export type LearningCategoryId = 'faith' | 'pillars' | 'terms' | 'practice' | 'character' | 'community' | 'prophet';

export type LearningCategory = {
  id: LearningCategoryId;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  lessonIds: string[];
};

export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    id: 'faith',
    title: 'Allah & der Glaube',
    subtitle: 'Das Fundament',
    description: 'Erst den Zusammenhang verstehen, dann jede der sechs Glaubensgrundlagen einzeln lernen.',
    topics: ['Tawhid', 'Engel', 'Bücher', 'Gesandte', 'Jüngster Tag', 'Qadar'],
    lessonIds: ['faith-overview', 'faith-allah', 'faith-angels', 'faith-books', 'faith-messengers', 'faith-last-day', 'faith-decree'],
  },
  {
    id: 'pillars',
    title: 'Die fünf Säulen',
    subtitle: 'Islam leben',
    description: 'Erst den Zusammenhang verstehen, dann Shahada, Gebet, Zakat, Fasten und Hajj einzeln und der Reihe nach lernen.',
    topics: ['Shahada', 'Gebet', 'Zakat', 'Ramadan', 'Hajj'],
    lessonIds: ['pillars-overview', 'pillars-shahada', 'pillars-prayer', 'pillars-zakat', 'pillars-fasting', 'pillars-hajj'],
  },
  {
    id: 'terms',
    title: 'Wichtige Begriffe',
    subtitle: 'Einfach verstehen',
    description: 'Zentrale Wörter aus Glauben, Gottesdienst und Fiqh einzeln lernen: Bedeutung, Beispiel und wichtige Abgrenzung.',
    topics: ['Islam, Iman, Ihsan', 'Niyyah', 'Fard', 'Sunnah', 'Halal & Haram', 'Fiqh'],
    lessonIds: ['terms-overview', 'terms-islam-iman-ihsan', 'terms-niyyah', 'terms-fard', 'terms-sunnah', 'terms-mubah-makruh', 'terms-halal', 'terms-haram', 'terms-dua', 'terms-dhikr', 'terms-tawba', 'terms-hadith-fiqh-madhhab'],
  },
  {
    id: 'practice',
    title: 'Reinheit & Alltag',
    subtitle: 'Sicher handeln',
    description: 'Mit einer Einführung beginnen, dann Wudu, Ghusl, Tayammum, Gebetszeiten und persönliche Fragen sicher einordnen.',
    topics: ['Wudu', 'Ghusl & Tayammum', 'Gebetszeiten', 'Fragen bei Unsicherheit'],
    lessonIds: ['practice-overview', 'fiqh-purity', 'fiqh-ghusl-tayammum', 'fiqh-prayer-time', 'fiqh-asking'],
  },
  {
    id: 'character',
    title: 'Charakter & Rechte',
    subtitle: 'Glaube im Verhalten',
    description: 'Aufrichtigkeit, Geduld und Barmherzigkeit als innere Haltung und sichtbares Verhalten lernen.',
    topics: ['Aufrichtigkeit', 'Geduld', 'Barmherzigkeit'],
    lessonIds: ['character-overview', 'akhlaq-sincerity', 'akhlaq-patience', 'akhlaq-mercy'],
  },
  {
    id: 'community',
    title: 'Miteinander & Verantwortung',
    subtitle: 'Rechte im Alltag',
    description: 'Eltern, Nachbarn, Sprache, Privatsphäre, Eigentum und fairen Umgang anhand klarer Quellen praktisch lernen.',
    topics: ['Eltern', 'Nachbarn', 'Sprache', 'Privatsphäre', 'Fairer Umgang'],
    lessonIds: ['community-overview', 'community-parents', 'community-neighbors', 'community-speech', 'akhlaq-rights', 'community-money'],
  },
  {
    id: 'prophet',
    title: 'Der Prophet ﷺ',
    subtitle: 'Vorbild & Geschichte',
    description: 'Mit einer Einführung beginnen, dann wichtige Stationen der Seerah mit Quelle, Kontext und Lehre verstehen.',
    topics: ['Offenbarung', 'Hijra', 'Prophetisches Vorbild'],
    lessonIds: ['prophet-overview', 'seerah-revelation', 'seerah-hijra', 'seerah-example'],
  },
];
