export type WuduPresentation = {
  cue: string;
  image?: string;
  imageDescription?: string;
  arabicRole?: 'spoken' | 'term';
  pronunciation?: string[];
  meaning?: string;
};

// Presentation only. Order and ritual instructions remain in worshipGuideData.
export const WUDU_PRESENTATION: readonly WuduPresentation[] = [
  { cue: 'Bewusst beginnen', arabicRole: 'spoken', pronunciation: ['Bis-mil-laah'], meaning: 'Im Namen Allahs.' },
  { cue: 'Beide Hände · 3-mal', image: 'wudu-step-hands-v1.webp', imageDescription: 'Zwei Hände werden mit Wasser gewaschen.', arabicRole: 'term', pronunciation: ['Ghasl al-Jadain'] },
  { cue: 'Mund · 3-mal', image: 'wudu-step-mouth-v1.webp', imageDescription: 'Eine Hand bringt etwas Wasser zum Mund.', arabicRole: 'term', pronunciation: ['Al-mad-ma-da'] },
  { cue: 'Nase · 3-mal', image: 'wudu-step-nose-v1.webp', imageDescription: 'Etwas Wasser wird in einer hohlen Hand zur Nase geführt.', arabicRole: 'term', pronunciation: ['Al-is-tin-schaaq wal-is-tin-thaar'] },
  { cue: 'Ganzes Gesicht · 3-mal', image: 'wudu-step-face-v1.webp', imageDescription: 'Zwei nasse Hände waschen das Gesicht.' },
  { cue: 'Bis zum Ellenbogen · 3-mal', image: 'wudu-step-arms-v1.webp', imageDescription: 'Ein Unterarm wird bis zum Ellenbogen gewaschen.' },
  { cue: 'Mit feuchten Händen · 1-mal', image: 'wudu-step-head-v1.webp', imageDescription: 'Feuchte Hände streichen über den Kopf.' },
  { cue: 'Innen und außen · 1-mal', image: 'wudu-step-ears-v1.webp', imageDescription: 'Ein Ohr wird vorsichtig mit den Fingern gereinigt.' },
  { cue: 'Bis zu den Knöcheln · 3-mal', image: 'wudu-step-feet-v1.webp', imageDescription: 'Ein Fuß wird einschließlich des Knöchels gewaschen.' },
  {
    cue: 'Nach der Waschung · freiwillig, keine Pflicht', arabicRole: 'spoken',
    pronunciation: [
      'Asch-hadu an laa ilaaha illallaah, wahdahu laa schariika lah.',
      "Wa asch-hadu anna Muhammadan 'abduhu wa rasuuluh.",
      "Allaahumma-dsch'alnii minat-tawwaabiin, wa-dsch'alnii minal-mutatah-hiriin.",
    ],
  },
];
