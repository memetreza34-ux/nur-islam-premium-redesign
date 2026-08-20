export type BeginnerLearningSource = {
  label: string;
  reference: string;
  note: string;
};

export type BeginnerLearningLesson = {
  id: string;
  title: string;
  eyebrow: string;
  duration: string;
  summary: string;
  paragraphs: string[];
  keyPoints: string[];
  sources: BeginnerLearningSource[];
  glossary: Array<{ term: string; meaning: string }>;
  reviewStatus: 'needs-expert-review';
};

/**
 * P0 beginner curriculum for the first public release.
 *
 * Every lesson deliberately stays at introductory level and carries explicit
 * source metadata. `needs-expert-review` is intentional: references being
 * present does not mean the religious wording has already passed the final
 * scholarly/editorial release review.
 */
export const BEGINNER_LESSONS: BeginnerLearningLesson[] = [
  {
    id: 'beginner-islam',
    title: 'Was ist Islam?',
    eyebrow: 'Start · Grundlage 1',
    duration: '4 Min.',
    summary: 'Ein erster Überblick darüber, worum es im Islam geht und wie Glaube, Anbetung und gutes Handeln zusammengehören.',
    paragraphs: [
      'Islam beschreibt die bewusste Hinwendung zu Allah und das Leben nach Seiner Rechtleitung. Für Anfänger ist wichtig: Du musst nicht alles auf einmal wissen. Die Grundlagen werden Schritt für Schritt gelernt.',
      'Glaube zeigt sich nicht nur in Wissen. Gebet, Charakter, Barmherzigkeit, Verantwortung und ehrliches Handeln gehören zum religiösen Alltag zusammen.',
      'Diese App beginnt deshalb mit gemeinsamen Grundlagen und trennt sie von Detailfragen, bei denen unterschiedliche anerkannte Auffassungen existieren können.',
    ],
    keyPoints: ['Islam verbindet Glauben, Anbetung und verantwortliches Handeln.', 'Grundlagen werden Schritt für Schritt gelernt.', 'Detailfragen werden von gemeinsamen Grundlagen getrennt.'],
    sources: [
      { label: 'Quran', reference: 'Sure Aal-Imran 3:19', note: 'Grundlegende Bezugstelle zum Islam als Religion vor Allah.' },
      { label: 'Hadith', reference: 'Sahih Muslim 8a – Hadith Jibril', note: 'Ordnet Islam, Iman und Ihsan in einer bekannten Grundlagenüberlieferung ein.' },
    ],
    glossary: [
      { term: 'Islam', meaning: 'Bezeichnung der Religion und der bewussten Hingabe an Allah.' },
      { term: 'Muslim', meaning: 'Eine Person, die sich zum Islam bekennt.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-allah',
    title: 'Wer ist Allah?',
    eyebrow: 'Start · Grundlage 2',
    duration: '5 Min.',
    summary: 'Allah ist der eine Gott, Schöpfer und allein Anbetungswürdige. Der Quran beschreibt Seine Einzigkeit ohne Ihn mit der Schöpfung gleichzusetzen.',
    paragraphs: [
      'Der Mittelpunkt des islamischen Glaubens ist Tawhid: Allah ist einzig und hat keinen Teilhaber. Anbetung wird deshalb allein an Ihn gerichtet.',
      'Der Quran beschreibt Allah mit vollkommenen Namen und Eigenschaften. Diese werden respektvoll aus den Offenbarungsquellen gelernt und nicht frei erfunden.',
      'Für den Einstieg reicht die klare Grundlage: Allah ist der Schöpfer, kennt Seine Schöpfung und ist nicht mit ihr gleichzusetzen.',
    ],
    keyPoints: ['Allah ist einzig und ohne Teilhaber.', 'Anbetung wird allein an Allah gerichtet.', 'Allah wird nicht mit der Schöpfung gleichgesetzt.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Ikhlas 112:1–4', note: 'Beschreibt Allahs Einzigkeit und Unvergleichbarkeit.' },
      { label: 'Quran', reference: 'Sure Al-Baqara 2:255', note: 'Beschreibt unter anderem Allahs Wissen, Herrschaft und Erhaltung der Schöpfung.' },
    ],
    glossary: [
      { term: 'Allah', meaning: 'Arabische Bezeichnung für Gott; im Islam der eine Schöpfer und allein Anbetungswürdige.' },
      { term: 'Tawhid', meaning: 'Die grundlegende Überzeugung von Allahs Einzigkeit.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-shahada',
    title: 'Die Shahada verstehen',
    eyebrow: 'Start · Grundlage 3',
    duration: '5 Min.',
    summary: 'Die Shahada fasst das grundlegende Bekenntnis des Islam zusammen: Allah allein wird angebetet und Muhammad ﷺ ist Sein Gesandter.',
    paragraphs: [
      'Die Shahada ist das Glaubensbekenntnis. Sie wird nicht als bloßer Satz verstanden, sondern als Bekenntnis zu Allahs Einzigkeit und zur Botschaft des Propheten Muhammad ﷺ.',
      'Für jemanden, der Islam kennenlernt, ist zunächst die Bedeutung wichtiger als perfekte Aussprache. Arabische Aussprache kann anschließend in Ruhe gelernt werden.',
      'Persönliche Fragen zu einem formellen Übertritt, Zeugen oder besonderen Umständen sollten bei Bedarf mit einer vertrauenswürdigen Moschee oder qualifizierten Lehrperson geklärt werden.',
    ],
    keyPoints: ['Die Shahada bekennt Allahs Einzigkeit.', 'Sie bekennt Muhammad ﷺ als Gesandten Allahs.', 'Bedeutung und Aufrichtigkeit stehen vor reinem Auswendiglernen.'],
    sources: [
      { label: 'Quran', reference: 'Sure Muhammad 47:19', note: 'Bezugstelle zur Erkenntnis, dass niemand außer Allah anbetungswürdig ist.' },
      { label: 'Quran', reference: 'Sure Al-Fath 48:29', note: 'Bezeichnet Muhammad ﷺ als Gesandten Allahs.' },
    ],
    glossary: [
      { term: 'Shahada', meaning: 'Das islamische Glaubensbekenntnis.' },
      { term: 'Rasul', meaning: 'Gesandter.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-prophet',
    title: 'Wer war Muhammad ﷺ?',
    eyebrow: 'Start · Grundlage 4',
    duration: '6 Min.',
    summary: 'Muhammad ﷺ ist im Islam der Gesandte Allahs und der letzte Prophet. Sein Leben und seine überlieferte Lehre helfen beim Verständnis islamischer Praxis.',
    paragraphs: [
      'Muslime beten Muhammad ﷺ nicht an. Sie folgen ihm als Propheten und Gesandten und richten die Anbetung allein an Allah.',
      'Sein Leben wird in der Seerah studiert. Überlieferungen über Aussagen, Handlungen und Bestätigungen werden in der Hadith-Wissenschaft gesammelt und geprüft.',
      'Für Anfänger ist wichtig, zwischen Verehrung und Anbetung zu unterscheiden: Respekt und Liebe zum Propheten gehören zum Glauben, Anbetung gehört Allah allein.',
    ],
    keyPoints: ['Muhammad ﷺ ist Gesandter Allahs.', 'Muslime beten ihn nicht an.', 'Seerah und Hadith helfen, sein Leben und seine Lehre kennenzulernen.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Ahzab 33:40', note: 'Bezeichnet Muhammad ﷺ als Gesandten Allahs und Siegel der Propheten.' },
      { label: 'Quran', reference: 'Sure Al-Anbiya 21:107', note: 'Beschreibt seine Sendung als Barmherzigkeit für die Welten.' },
    ],
    glossary: [
      { term: 'Seerah', meaning: 'Die Biografie des Propheten Muhammad ﷺ.' },
      { term: 'Hadith', meaning: 'Überlieferung über Aussagen, Handlungen oder Bestätigungen des Propheten ﷺ.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-quran-sunnah',
    title: 'Quran, Sunnah und Hadith',
    eyebrow: 'Start · Grundlage 5',
    duration: '6 Min.',
    summary: 'Der Quran ist die Offenbarung Allahs. Die Sunnah bezeichnet die prophetische Lehre und Praxis; Hadithe sind Überlieferungen, durch die vieles davon berichtet wird.',
    paragraphs: [
      'Der Quran besteht aus Suren und einzelnen Ayat. Eine deutsche Übersetzung hilft beim Verstehen, ist aber nicht mit dem arabischen Quran-Wortlaut identisch.',
      'Die Sunnah beschreibt den überlieferten Weg des Propheten ﷺ. Hadithe besitzen unterschiedliche Überlieferungswege und Bewertungen; deshalb sollte nicht jedes Zitat aus dem Internet ungeprüft übernommen werden.',
      'Tafsir erklärt Quranverse mit sprachlichem, historischem und überlieferungsbezogenem Kontext. Eine kurze App-Erklärung ersetzt keinen vollständigen Tafsir.',
    ],
    keyPoints: ['Der Quran ist die Offenbarung Allahs.', 'Übersetzung und arabischer Originalwortlaut werden getrennt.', 'Hadithe brauchen nachvollziehbare Quellen und Einordnung.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Hijr 15:9', note: 'Bezugstelle zum offenbarten Gedenken und dessen Bewahrung.' },
      { label: 'Quran', reference: 'Sure An-Nahl 16:44', note: 'Beschreibt die Aufgabe des Gesandten, den Menschen die Offenbarung zu erläutern.' },
    ],
    glossary: [
      { term: 'Sure', meaning: 'Ein Kapitel des Quran.' },
      { term: 'Ayah', meaning: 'Ein Vers bzw. Zeichen innerhalb einer Sure.' },
      { term: 'Tafsir', meaning: 'Erklärung und Auslegung des Quran.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-five-pillars',
    title: 'Die fünf Säulen',
    eyebrow: 'Start · Grundlage 6',
    duration: '6 Min.',
    summary: 'Shahada, Gebet, Zakat, Fasten im Ramadan und Hajj bilden die bekannten fünf Säulen des Islam.',
    paragraphs: [
      'Die fünf Säulen geben dem religiösen Leben eine klare Grundstruktur. Sie verbinden Glaubensbekenntnis, tägliche Anbetung, soziale Verantwortung, Fasten und Pilgerfahrt.',
      'Nicht jede Säule betrifft jede Person in jeder Situation auf identische Weise. Zakat und Hajj hängen beispielsweise von Voraussetzungen ab, die in einer Grundlagenlektion nicht individuell entschieden werden können.',
      'Für den Einstieg liegt der praktische Schwerpunkt der App zunächst auf Shahada-Verständnis, Reinheit und den fünf täglichen Pflichtgebeten.',
    ],
    keyPoints: ['Shahada', 'Salah – die Pflichtgebete', 'Zakat', 'Fasten im Ramadan', 'Hajj für diejenigen, die dazu in der Lage sind'],
    sources: [
      { label: 'Hadith', reference: 'Sahih al-Bukhari 8; Sahih Muslim 16c', note: 'Authentische Überlieferungen über die fünf Säulen des Islam.' },
    ],
    glossary: [
      { term: 'Salah', meaning: 'Das rituelle islamische Gebet.' },
      { term: 'Zakat', meaning: 'Verpflichtende Abgabe unter ihren jeweiligen Voraussetzungen.' },
      { term: 'Hajj', meaning: 'Die Pilgerfahrt nach Makkah unter ihren jeweiligen Voraussetzungen.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-six-beliefs',
    title: 'Die sechs Glaubensgrundlagen',
    eyebrow: 'Start · Grundlage 7',
    duration: '6 Min.',
    summary: 'Zum Iman gehören der Glaube an Allah, Seine Engel, Seine Bücher, Seine Gesandten, den Jüngsten Tag und die göttliche Bestimmung.',
    paragraphs: [
      'Diese sechs Punkte strukturieren die grundlegende islamische Glaubenslehre. Sie werden häufig anhand des Hadith Jibril erklärt.',
      'Einzelne Themen wie die göttliche Bestimmung sind tiefgehend. Eine Anfängerlektion sollte hier Orientierung geben und Spekulationen vermeiden.',
      'Wenn du diese sechs Grundlagen benennen und grob erklären kannst, hast du ein wichtiges Fundament für spätere Aqidah-Lektionen.',
    ],
    keyPoints: ['Allah', 'Engel', 'Bücher/Offenbarungen', 'Gesandte', 'Jüngster Tag', 'Göttliche Bestimmung'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Baqara 2:285', note: 'Nennt mehrere zentrale Glaubensgrundlagen.' },
      { label: 'Hadith', reference: 'Sahih Muslim 8a – Hadith Jibril', note: 'Überliefert die bekannten sechs Grundlagen des Iman.' },
    ],
    glossary: [
      { term: 'Iman', meaning: 'Glaube; im Grundlagenunterricht oft anhand der sechs Glaubensgrundlagen erklärt.' },
      { term: 'Qadr', meaning: 'Die göttliche Bestimmung; ein vertieftes Glaubensthema.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-purity',
    title: 'Reinheit: Wudu, Ghusl und Tayammum',
    eyebrow: 'Start · Grundlage 8',
    duration: '7 Min.',
    summary: 'Rituelle Reinheit gehört zur Gebetsvorbereitung. Wudu ist die Gebetswaschung; Ghusl und Tayammum betreffen besondere Situationen.',
    paragraphs: [
      'Der Quran nennt in Sure Al-Maida 5:6 grundlegende Regeln zur Waschung vor dem Gebet und zum Tayammum. Die App erklärt Wudu zusätzlich praktisch Schritt für Schritt.',
      'Ghusl ist eine vollständige rituelle Waschung in bestimmten Situationen. Tayammum ist keine frei wählbare Alternative zu Wudu, sondern gilt nur unter seinen Voraussetzungen; Sure Al-Maida 5:6 nennt unter anderem Situationen, in denen kein Wasser gefunden wird.',
      'Details zu Krankheit, Verletzung, Menstruation, Wochenbett oder anderen persönlichen Situationen gehören in fachlich geprüfte Sonderlektionen und sollten nicht aus einer kurzen Zusammenfassung abgeleitet werden.',
    ],
    keyPoints: ['Wudu gehört zu den zentralen Gebetsvorbereitungen.', 'Ghusl betrifft bestimmte Zustände, die eine vollständige Waschung erfordern.', 'Tayammum besitzt eigene Voraussetzungen und ist keine beliebige Alternative zu Wudu.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Maida 5:6', note: 'Grundlegende Bezugstelle zu Wudu, ritueller Gesamtwaschung und Tayammum.' },
    ],
    glossary: [
      { term: 'Wudu', meaning: 'Rituelle Gebetswaschung.' },
      { term: 'Ghusl', meaning: 'Rituelle Ganzkörperwaschung in bestimmten Situationen.' },
      { term: 'Tayammum', meaning: 'Rituelle Ersatzreinigung unter ihren religiösen Voraussetzungen.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-prayer',
    title: 'Warum und wann Muslime beten',
    eyebrow: 'Start · Grundlage 9',
    duration: '7 Min.',
    summary: 'Das Gebet ist eine zentrale tägliche Anbetung. Die fünf Pflichtgebete besitzen festgelegte Zeiträume und werden in Richtung Qibla verrichtet.',
    paragraphs: [
      'Die fünf täglichen Pflichtgebete heißen Fajr, Dhuhr, Asr, Maghrib und Isha. Sie verteilen sich über den Tag und geben dem Alltag feste Zeiten der Anbetung.',
      'Eine Rakʿah ist eine Gebetseinheit mit mehreren Positionen und Rezitationen. Die App führt jede der Pflichtgebete Rakʿah für Rakʿah durch.',
      'Berechnete Gebetszeiten können je nach Standort, Methode und lokaler Praxis leicht abweichen. Deshalb zeigt die App die verwendete Methode und empfiehlt bei Unsicherheit den lokalen Abgleich.',
    ],
    keyPoints: ['Es gibt fünf tägliche Pflichtgebete.', 'Gebete besitzen festgelegte Zeiträume.', 'Eine Rakʿah ist eine Gebetseinheit.', 'Qibla bezeichnet die Gebetsrichtung zur Kaaba in Makkah.'],
    sources: [
      { label: 'Quran', reference: 'Sure An-Nisa 4:103', note: 'Beschreibt das Gebet als zeitlich festgelegte Pflicht.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 7372', note: 'Nennt ausdrücklich fünf verpflichtende Gebete in Tag und Nacht.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 528; Sahih Muslim 667', note: 'Beschreibt die Bedeutung der fünf täglichen Gebete.' },
    ],
    glossary: [
      { term: 'Rakʿah', meaning: 'Eine Einheit innerhalb des rituellen Gebets.' },
      { term: 'Qibla', meaning: 'Die Gebetsrichtung zur Kaaba in Makkah.' },
      { term: 'Fard', meaning: 'Pflicht bzw. verpflichtende Handlung im religiösen Kontext.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
  {
    id: 'beginner-next-steps',
    title: 'Dein nächster Schritt',
    eyebrow: 'Start · Grundlage 10',
    duration: '4 Min.',
    summary: 'Nach den Grundlagen geht es nicht darum, alles sofort zu beherrschen. Ein stabiler Alltag entsteht durch regelmäßiges Gebet, Quran, Dhikr, Lernen und guten Charakter.',
    paragraphs: [
      'Beginne mit kleinen, regelmäßigen Schritten. Festige zuerst Reinheit und Gebet, lerne Al-Fatiha und kurze Suren und lies parallel die Bedeutung des Quran.',
      'Nutze Fragen als Anlass zum Lernen. Bei komplexen persönlichen Fiqh-Themen sollte eine qualifizierte Person mit vollständigem Kontext gefragt werden.',
      'Danach kannst du die Bereiche Aqidah, Fiqh, Tafsir, Seerah, Hadith und Akhlaq systematisch vertiefen.',
    ],
    keyPoints: ['Regelmäßigkeit ist wichtiger als möglichst viele Inhalte auf einmal.', 'Gebet und Quran bilden einen starken täglichen Lernanker.', 'Komplexe persönliche Rechtsfragen brauchen qualifizierten Kontext.'],
    sources: [
      { label: 'Quran', reference: 'Sure Taha 20:114', note: 'Enthält die Bitte, im Wissen gemehrt zu werden.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 6465; Sahih Muslim 783b', note: 'Authentische Überlieferungen darüber, dass beständige Taten besonders geliebt sind.' },
    ],
    glossary: [
      { term: 'Aqidah', meaning: 'Islamische Glaubenslehre.' },
      { term: 'Fiqh', meaning: 'Islamische Rechts- und Praxislehre.' },
      { term: 'Akhlaq', meaning: 'Charakter und gutes Verhalten.' },
    ],
    reviewStatus: 'needs-expert-review',
  },
];

export function getNextBeginnerLesson(completed: Set<string>) {
  return BEGINNER_LESSONS.find((lesson) => !completed.has(lesson.id)) ?? BEGINNER_LESSONS[BEGINNER_LESSONS.length - 1];
}
