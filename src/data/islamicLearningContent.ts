export type LearningCategoryId = 'aqidah' | 'fiqh' | 'tafsir' | 'seerah' | 'hadith' | 'akhlaq';

export type LearningSource = {
  label: string;
  reference: string;
  note: string;
};

export type LearningQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LearningLesson = {
  id: string;
  categoryId: LearningCategoryId;
  title: string;
  eyebrow: string;
  duration: string;
  summary: string;
  paragraphs: string[];
  keyPoints: string[];
  sources: LearningSource[];
  question: LearningQuestion;
};

export type LearningCategory = {
  id: LearningCategoryId;
  title: string;
  subtitle: string;
  description: string;
  lessonCount: number;
};

export const LEARNING_CATEGORIES: LearningCategory[] = [
  {
    id: 'aqidah',
    title: 'Aqidah',
    subtitle: 'Glaubenslehre',
    description: 'Grundlagen des Glaubens an Allah, Seine Offenbarung und das Jenseits.',
    lessonCount: 3,
  },
  {
    id: 'fiqh',
    title: 'Fiqh',
    subtitle: 'Islamische Praxis',
    description: 'Ein verständlicher Einstieg in Reinheit, Gebet und verantwortliche Entscheidungen.',
    lessonCount: 3,
  },
  {
    id: 'tafsir',
    title: 'Tafsir',
    subtitle: 'Quran verstehen',
    description: 'Ausgewählte Suren und Grundregeln für einen verantwortlichen Umgang mit Erklärungen.',
    lessonCount: 3,
  },
  {
    id: 'seerah',
    title: 'Seerah',
    subtitle: 'Leben des Propheten',
    description: 'Zentrale Stationen der prophetischen Biografie und ihre Lehren für den Alltag.',
    lessonCount: 3,
  },
  {
    id: 'hadith',
    title: 'Hadith',
    subtitle: 'Überlieferungen',
    description: 'Was Hadithe sind, wie Quellen geprüft werden und wie Absicht Handlungen prägt.',
    lessonCount: 3,
  },
  {
    id: 'akhlaq',
    title: 'Akhlaq',
    subtitle: 'Charakter & Verhalten',
    description: 'Aufrichtigkeit, Geduld, Barmherzigkeit und respektvoller Umgang.',
    lessonCount: 3,
  },
];

export const LEARNING_LESSONS: LearningLesson[] = [
  {
    id: 'aqidah-tawhid',
    categoryId: 'aqidah',
    title: 'Tawhid: Allah allein anbeten',
    eyebrow: 'Aqidah · Grundlage 1',
    duration: '6 Min.',
    summary: 'Tawhid bedeutet, Allah als einzigen Schöpfer, Herrn und allein Anbetungswürdigen anzuerkennen.',
    paragraphs: [
      'Der islamische Glaube beginnt mit der Überzeugung, dass Allah einzig ist und keinen Teilhaber hat. Alle Formen der Anbetung werden deshalb allein an Ihn gerichtet.',
      'Diese Überzeugung betrifft nicht nur Worte. Sie prägt Vertrauen, Hoffnung und Dankbarkeit und richtet das Herz auf Allah als letztliche Quelle von Hilfe und Erfolg aus, ohne erlaubte Hilfe durch Menschen zu leugnen.',
      'Die Lektion ist eine Einführung. Detaillierte theologische Begriffe sollten mit verlässlichen Lehrpersonen und anerkannten Grundlagenwerken vertieft werden.',
    ],
    keyPoints: ['Allah ist einzig und ohne Teilhaber.', 'Anbetung wird allein an Allah gerichtet.', 'Tawhid wirkt sich auf Vertrauen und Alltag aus.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Ikhlas 112:1–4', note: 'Beschreibt Allahs Einzigkeit und Unvergleichbarkeit.' },
      { label: 'Quran', reference: 'Sure Al-Baqara 2:255', note: 'Betont Allahs Herrschaft, Wissen und Erhaltung der Schöpfung.' },
    ],
    question: {
      prompt: 'Was beschreibt Tawhid in dieser Einführung am besten?',
      options: ['Allah allein anzubeten und Ihm keinen Teilhaber zuzuschreiben', 'Nur bestimmte gute Taten auszuführen', 'Eine bestimmte Sprache zu sprechen'],
      correctIndex: 0,
      explanation: 'Tawhid richtet Glauben und Anbetung ausschließlich auf Allah.',
    },
  },
  {
    id: 'aqidah-iman',
    categoryId: 'aqidah',
    title: 'Die sechs Glaubensgrundlagen',
    eyebrow: 'Aqidah · Grundlage 2',
    duration: '7 Min.',
    summary: 'Der Glaube umfasst Allah, Engel, Offenbarungen, Gesandte, den Jüngsten Tag und Allahs Bestimmung.',
    paragraphs: [
      'Die Glaubensgrundlagen geben eine klare Ordnung: Der Mensch glaubt an Allah, Seine Engel, Seine Bücher, Seine Gesandten, den Jüngsten Tag und die göttliche Bestimmung.',
      'Diese Punkte gehören zusammen. Der Glaube an Offenbarung führt etwa dazu, die Botschaft der Gesandten ernst zu nehmen und Verantwortung vor Allah anzuerkennen.',
      'Fragen zur Bestimmung und menschlichen Verantwortung sind anspruchsvoll. Diese Einführung vermeidet vereinfachende Spekulationen und verweist für Details auf qualifizierten Unterricht.',
    ],
    keyPoints: ['Die sechs Grundlagen bilden eine zusammenhängende Glaubensordnung.', 'Offenbarung und Gesandte vermitteln Orientierung.', 'Der Jüngste Tag erinnert an Verantwortung.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Baqara 2:285', note: 'Nennt Allah, Engel, Bücher und Gesandte.' },
      { label: 'Hadith', reference: 'Sahih Muslim 8a – Hadith Jibril', note: 'Überliefert die bekannten Grundlagen von Iman, Islam und Ihsan.' },
    ],
    question: {
      prompt: 'Welcher Punkt gehört zu den sechs Glaubensgrundlagen?',
      options: ['Der Glaube an den Jüngsten Tag', 'Eine bestimmte Nationalität', 'Ein festgelegter Beruf'],
      correctIndex: 0,
      explanation: 'Der Jüngste Tag gehört ausdrücklich zu den bekannten Grundlagen des Iman.',
    },
  },
  {
    id: 'aqidah-names',
    categoryId: 'aqidah',
    title: 'Allah durch Seine Namen kennenlernen',
    eyebrow: 'Aqidah · Grundlage 3',
    duration: '6 Min.',
    summary: 'Allahs schöne Namen helfen, über Seine Barmherzigkeit, Weisheit und Größe nachzudenken.',
    paragraphs: [
      'Der Quran ruft dazu auf, Allah mit Seinen schönen Namen anzurufen. Namen wie Ar-Rahman oder Al-Hakim weisen auf Barmherzigkeit beziehungsweise Weisheit hin.',
      'Die Namen werden nicht losgelöst vom Quran und der authentischen Überlieferung erfunden. Ihre Bedeutung wird respektvoll und ohne Vergleich mit der Schöpfung verstanden.',
      'Im Alltag kann dieses Wissen Dua und Vertrauen vertiefen: Wer Allah als barmherzig kennt, hofft auf Seine Barmherzigkeit und bemüht sich selbst um Barmherzigkeit.',
    ],
    keyPoints: ['Allahs Namen stammen aus Offenbarungsquellen.', 'Sie werden ohne Vergleich mit der Schöpfung verstanden.', 'Das Wissen soll Dua und Charakter beeinflussen.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Araf 7:180', note: 'Fordert dazu auf, Allah mit Seinen schönen Namen anzurufen.' },
      { label: 'Quran', reference: 'Sure Al-Hashr 59:22–24', note: 'Nennt mehrere Namen und Eigenschaften Allahs.' },
    ],
    question: {
      prompt: 'Wie sollte man mit Allahs Namen umgehen?',
      options: ['Sie aus Quran und authentischer Überlieferung lernen', 'Beliebige neue Namen erfinden', 'Sie nur als dekorative Begriffe betrachten'],
      correctIndex: 0,
      explanation: 'Die Namen werden aus den Offenbarungsquellen gelernt und sollen Glauben und Handeln prägen.',
    },
  },
  {
    id: 'fiqh-purity',
    categoryId: 'fiqh',
    title: 'Reinheit vor dem Gebet',
    eyebrow: 'Fiqh · Praxis 1',
    duration: '7 Min.',
    summary: 'Wudu gehört zu den zentralen Vorbereitungen für das Gebet und wird in der App gesondert praktisch erklärt.',
    paragraphs: [
      'Vor dem Pflichtgebet wird der Zustand der rituellen Reinheit geprüft. Der Quran nennt dabei die grundlegenden Körperbereiche der Gebetswaschung.',
      'Fiqh unterscheidet zwischen allgemeinen Grundlagen und Details, bei denen Rechtsschulen unterschiedliche Auffassungen vertreten können. Die App kennzeichnet solche Unterschiede, statt eine Einzelmeinung als einzige Möglichkeit darzustellen.',
      'Bei Krankheit, Verletzung oder fehlendem Wasser können besondere Regeln gelten. Solche Situationen benötigen eine verlässliche, individuell passende Auskunft.',
    ],
    keyPoints: ['Wudu ist eine zentrale Gebetsvorbereitung.', 'Rechtsschulen können Details unterschiedlich einordnen.', 'Sonderfälle sollten qualifiziert geklärt werden.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Maida 5:6', note: 'Nennt Grundlagen von Wudu und Tayammum.' },
      { label: 'App-Bereich', reference: 'Wudu lernen', note: 'Interaktive Schrittfolge mit sichtbarem Rechtsschulhinweis.' },
    ],
    question: {
      prompt: 'Was ist bei unterschiedlichen Fiqh-Details wichtig?',
      options: ['Unterschiede transparent kennzeichnen', 'Jede andere Auffassung abwerten', 'Sonderfälle ohne Wissen selbst entscheiden'],
      correctIndex: 0,
      explanation: 'Ein verantwortlicher Lernbereich macht anerkannte Unterschiede sichtbar und verweist bei Sonderfällen an Fachkundige.',
    },
  },
  {
    id: 'fiqh-prayer-time',
    categoryId: 'fiqh',
    title: 'Gebetszeiten und Verantwortung',
    eyebrow: 'Fiqh · Praxis 2',
    duration: '6 Min.',
    summary: 'Jedes Pflichtgebet besitzt einen bestimmten Zeitrahmen; berechnete App-Zeiten sollten lokal abgeglichen werden.',
    paragraphs: [
      'Der Quran beschreibt das Gebet als Verpflichtung zu festgelegten Zeiten. Deshalb ist nicht nur die Anzahl, sondern auch der Zeitrahmen wichtig.',
      'Digitale Zeiten werden aus Standort, astronomischen Daten und einer Berechnungsmethode ermittelt. Verschiedene Methoden können besonders bei Fajr, Isha und Asr abweichen.',
      'Die App zeigt Methode und Asr-Auswahl sichtbar an und empfiehlt bei Unsicherheit den Abgleich mit einer örtlichen Moschee oder einem verlässlichen Kalender.',
    ],
    keyPoints: ['Pflichtgebete haben festgelegte Zeitrahmen.', 'Berechnungsmethoden können Unterschiede erzeugen.', 'Lokaler Abgleich bleibt wichtig.'],
    sources: [
      { label: 'Quran', reference: 'Sure An-Nisa 4:103', note: 'Beschreibt das Gebet als zeitlich festgelegte Pflicht.' },
      { label: 'App-Bereich', reference: 'Gebetszeiten', note: 'Zeigt Standort, Methode, Asr-Auswahl und Datenstatus.' },
    ],
    question: {
      prompt: 'Warum können zwei Gebetskalender leicht abweichen?',
      options: ['Wegen unterschiedlicher Berechnungsmethoden und lokaler Einstellungen', 'Weil Gebetszeiten frei erfunden werden', 'Weil der Wochentag keine Rolle spielt'],
      correctIndex: 0,
      explanation: 'Standort, Methode und lokale Anpassungen können zu abweichenden berechneten Zeiten führen.',
    },
  },
  {
    id: 'fiqh-asking',
    categoryId: 'fiqh',
    title: 'Wann man nachfragen sollte',
    eyebrow: 'Fiqh · Praxis 3',
    duration: '5 Min.',
    summary: 'Nicht jede individuelle Situation lässt sich durch eine allgemeine App-Lektion sicher beantworten.',
    paragraphs: [
      'Fiqh wendet Offenbarungsquellen und juristische Methoden auf konkrete Handlungen an. Persönliche Umstände können die Einordnung verändern.',
      'Bei Ehe, Scheidung, Erbrecht, Finanzverträgen, Krankheit oder komplizierten Gebetsfragen reicht eine allgemeine Zusammenfassung häufig nicht aus.',
      'Ein verantwortlicher Umgang bedeutet, Unsicherheit zuzugeben und eine vertrauenswürdige, qualifizierte Person mit den vollständigen Umständen zu fragen.',
    ],
    keyPoints: ['Individuelle Umstände können die Antwort verändern.', 'Komplexe Rechtsfragen brauchen vollständigen Kontext.', 'Unsicherheit sollte klar benannt werden.'],
    sources: [
      { label: 'Quran', reference: 'Sure An-Nahl 16:43', note: 'Verweist bei fehlendem Wissen auf kundige Personen.' },
      { label: 'Quran', reference: 'Sure Al-Isra 17:36', note: 'Warnt davor, etwas ohne Wissen zu verfolgen.' },
    ],
    question: {
      prompt: 'Was ist bei einer komplexen persönlichen Fiqh-Frage am sichersten?',
      options: ['Die vollständigen Umstände einer qualifizierten Person schildern', 'Nur einen kurzen Social-Media-Clip verwenden', 'Unsicherheit verbergen'],
      correctIndex: 0,
      explanation: 'Komplexe Einzelfälle benötigen Kontext und qualifizierte Einordnung.',
    },
  },
  {
    id: 'tafsir-fatiha',
    categoryId: 'tafsir',
    title: 'Al-Fatiha: Lob, Anbetung und Führung',
    eyebrow: 'Tafsir · Sure 1',
    duration: '8 Min.',
    summary: 'Al-Fatiha verbindet Lob Allahs, Barmherzigkeit, Verantwortung und die Bitte um den geraden Weg.',
    paragraphs: [
      'Al-Fatiha eröffnet den Quran und ist ein zentraler Bestandteil des rituellen Gebets. Wie ihre Rezitation für einzelne Betende im Gemeinschaftsgebet eingeordnet wird, wird im Fiqh unterschiedlich behandelt. Ihre Themen führen vom Lob Allahs zur bewussten Anbetung und zur Bitte um Führung.',
      'Die Sure erinnert an Allahs Barmherzigkeit und an den Tag der Abrechnung. Dadurch verbindet sie Hoffnung mit Verantwortung.',
      'Diese Lektion fasst zentrale Themen sinngemäß zusammen. Sie ersetzt keinen vollständigen Tafsir und keine sprachliche Analyse des arabischen Textes.',
    ],
    keyPoints: ['Al-Fatiha beginnt mit Lob Allahs.', 'Anbetung und Bitte um Hilfe werden verbunden.', 'Die Sure enthält die Bitte um Führung.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Fatiha 1:1–7', note: 'Primärtext der Lektion.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 756', note: 'Belegt die zentrale Bedeutung von Al-Fatiha im Gebet; Detailfragen zum Gemeinschaftsgebet werden fiqhlich unterschiedlich eingeordnet.' },
      { label: 'Hinweis', reference: 'Sinngemäße Themenübersicht', note: 'Keine vollständige Übersetzung oder umfassende Tafsir-Auslegung.' },
    ],
    question: {
      prompt: 'Welche Bitte steht im Zentrum von Al-Fatiha?',
      options: ['Die Bitte um Führung auf den geraden Weg', 'Die Bitte um materiellen Reichtum', 'Die Bitte um eine bestimmte Sprache'],
      correctIndex: 0,
      explanation: 'Al-Fatiha enthält ausdrücklich die Bitte um Führung.',
    },
  },
  {
    id: 'tafsir-ikhlas',
    categoryId: 'tafsir',
    title: 'Al-Ikhlas: Allahs Einzigkeit',
    eyebrow: 'Tafsir · Sure 112',
    duration: '6 Min.',
    summary: 'Die kurze Sure fasst zentrale Aussagen über Allahs Einzigkeit und Unvergleichbarkeit zusammen.',
    paragraphs: [
      'Al-Ikhlas erklärt, dass Allah einer ist, nennt Ihn As-Samad und erklärt, dass Ihm nichts ebenbürtig ist. As-Samad wird in Erklärungen unter anderem mit Allahs vollkommener Unabhängigkeit und der Abhängigkeit der Schöpfung von Ihm verbunden. Die Sure weist Vorstellungen zurück, die Allah menschliche Abstammung zuschreiben.',
      'Die Sure ist kurz, enthält aber eine grundlegende Glaubensaussage. Deshalb sollte sie nicht nur auswendig gelernt, sondern auch in ihrer Bedeutung verstanden werden.',
      'Die deutsche Darstellung in der App wird als sinngemäße Bedeutung gekennzeichnet. Der arabische Qurantext bleibt der Offenbarungstext.',
    ],
    keyPoints: ['Allah ist einzig.', 'Allah wird in der Sure As-Samad genannt.', 'Nichts ist Ihm ebenbürtig.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Ikhlas 112:1–4', note: 'Primärtext der Lektion.' },
      { label: 'App-Bereich', reference: 'Quran-Reader · Sure 112', note: 'Arabischer Text und gekennzeichnete sinngemäße Bedeutung.' },
    ],
    question: {
      prompt: 'Welche Aussage passt zu Al-Ikhlas?',
      options: ['Nichts ist Allah ebenbürtig', 'Allah ist Teil der Schöpfung', 'Allah benötigt Unterstützung'],
      correctIndex: 0,
      explanation: 'Die Sure betont ausdrücklich Allahs Einzigkeit und Unvergleichbarkeit.',
    },
  },
  {
    id: 'tafsir-method',
    categoryId: 'tafsir',
    title: 'Tafsir verantwortungsvoll lesen',
    eyebrow: 'Tafsir · Methode',
    duration: '7 Min.',
    summary: 'Quran-Erklärung berücksichtigt Sprache, Kontext, andere Verse und authentische Überlieferungen.',
    paragraphs: [
      'Ein einzelner übersetzter Satz reicht nicht immer aus, um einen Vers vollständig zu verstehen. Wortgebrauch, Zusammenhang und Offenbarungskontext können wichtig sein.',
      'Seriöser Tafsir vergleicht Verse miteinander und berücksichtigt authentische Erklärungen aus der prophetischen Überlieferung sowie die Arbeit qualifizierter Gelehrter.',
      'Die App trennt daher Qurantext, sinngemäße Bedeutung und erklärenden Kommentar sichtbar voneinander.',
    ],
    keyPoints: ['Kontext und Sprache sind wichtig.', 'Verse werden nicht isoliert gegeneinander ausgespielt.', 'Text, Bedeutung und Kommentar müssen getrennt erkennbar sein.'],
    sources: [
      { label: 'Quran', reference: 'Sure Muhammad 47:24', note: 'Ruft zur reflektierten Beschäftigung mit dem Quran auf.' },
      { label: 'Quran', reference: 'Sure An-Nahl 16:44', note: 'Nennt die erklärende Aufgabe des Gesandten.' },
    ],
    question: {
      prompt: 'Was gehört zu einem verantwortlichen Tafsir-Umgang?',
      options: ['Kontext und weitere Offenbarungsquellen berücksichtigen', 'Nur einen isolierten übersetzten Satz verwenden', 'Kommentar als Qurantext ausgeben'],
      correctIndex: 0,
      explanation: 'Tafsir benötigt Kontext und eine klare Trennung zwischen Offenbarungstext und Erklärung.',
    },
  },
  {
    id: 'seerah-revelation',
    categoryId: 'seerah',
    title: 'Beginn der Offenbarung',
    eyebrow: 'Seerah · Mekka 1',
    duration: '7 Min.',
    summary: 'Die ersten offenbarten Verse rufen zum Lesen im Namen Allahs auf und markieren den Beginn der Sendung.',
    paragraphs: [
      'Die prophetische Sendung begann in Mekka. Die ersten Verse der Sure Al-Alaq verbinden Lesen, Wissen und die Anerkennung Allahs als Schöpfer.',
      'Andere mekkanische Quranstellen betonen zudem Verantwortung gegenüber Bedürftigen und Schwachen. Die frühe Verkündigung traf auf Widerstand; genaue historische Ursachen und Entwicklungen sollten aus belastbaren Seerah-Quellen gelernt werden.',
      'Seerah wird aus Quran, authentischen Hadithen und kritisch eingeordneten historischen Berichten gelernt. Nicht jede populäre Erzählung besitzt dieselbe Belegstärke.',
    ],
    keyPoints: ['Die Offenbarung begann in Mekka.', 'Die ersten Verse verbinden Wissen und Glauben.', 'Seerah-Berichte besitzen unterschiedliche Belegstärken.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Alaq 96:1–5', note: 'Die bekannten ersten offenbarten Verse.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 3', note: 'Bericht über den Beginn der Offenbarung.' },
      { label: 'Quran', reference: 'Sure Al-Balad 90:12–17', note: 'Mekkanische Verse über Hilfe für Bedürftige, Glauben, Geduld und Barmherzigkeit.' },
    ],
    question: {
      prompt: 'Welches Thema erscheint in den ersten Versen der Offenbarung?',
      options: ['Lesen und Wissen im Namen Allahs', 'Handelspreise in Medina', 'Die Anzahl der Gebetszeiten im Detail'],
      correctIndex: 0,
      explanation: 'Die ersten Verse der Sure Al-Alaq beginnen mit dem Auftrag zu lesen.',
    },
  },
  {
    id: 'seerah-hijra',
    categoryId: 'seerah',
    title: 'Die Hijra nach Medina',
    eyebrow: 'Seerah · Übergang',
    duration: '8 Min.',
    summary: 'Die Auswanderung war kein bloßer Ortswechsel, sondern der Beginn einer neuen gemeinschaftlichen Phase.',
    paragraphs: [
      'Nach zunehmender Verfolgung verließen der Prophet und die Muslime Mekka. Die Hijra nach Medina wurde zu einem Wendepunkt der islamischen Geschichte.',
      'Der Quran erinnert an Allahs Unterstützung während der Flucht. Gleichzeitig zeigt die Seerah sorgfältige Planung, Vertrauen und verantwortliches Handeln.',
      'In Medina wurden Gemeinschaft, gegenseitige Pflichten und Regeln des Zusammenlebens weiter aufgebaut. Einzelne historische Vertragsdetails sollten aus geprüften Werken gelernt werden.',
    ],
    keyPoints: ['Die Hijra war ein Wendepunkt.', 'Vertrauen auf Allah schließt Planung nicht aus.', 'In Medina entstand eine neue Gemeinschaftsordnung.'],
    sources: [
      { label: 'Quran', reference: 'Sure At-Tawba 9:40', note: 'Erinnert an die Flucht und Allahs Beistand.' },
      { label: 'Quran', reference: 'Sure Al-Hashr 59:8–9', note: 'Würdigt Auswanderer und Helfer.' },
    ],
    question: {
      prompt: 'Welche Lehre zeigt die Hijra besonders?',
      options: ['Vertrauen auf Allah und sorgfältige Planung gehören zusammen', 'Planung widerspricht Vertrauen', 'Gemeinschaftliche Verantwortung ist unwichtig'],
      correctIndex: 0,
      explanation: 'Die Seerah zeigt sowohl Tawakkul als auch umsichtiges Handeln.',
    },
  },
  {
    id: 'seerah-example',
    categoryId: 'seerah',
    title: 'Der Prophet als Vorbild',
    eyebrow: 'Seerah · Alltag',
    duration: '6 Min.',
    summary: 'Seerah wird nicht nur als Chronologie gelernt, sondern als Quelle für Charakter, Geduld und verantwortliche Führung.',
    paragraphs: [
      'Der Quran beschreibt den Gesandten Allahs als gutes Vorbild für Menschen, die auf Allah und den Jüngsten Tag hoffen.',
      'Sein Vorbild umfasst Gottesdienst, Familie, Verträge, Barmherzigkeit, Geduld und den Umgang mit Gegnern. Einzelne Ereignisse müssen im historischen Zusammenhang verstanden werden.',
      'Ein praktischer Seerah-Unterricht fragt deshalb: Welche zuverlässige Lehre lässt sich aus einem Ereignis ableiten, ohne den Kontext zu verkürzen?',
    ],
    keyPoints: ['Seerah verbindet Geschichte und Charakterbildung.', 'Ereignisse brauchen historischen Kontext.', 'Lehren sollen zuverlässig und praktisch sein.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Ahzab 33:21', note: 'Bezeichnet den Gesandten als gutes Vorbild.' },
      { label: 'Quran', reference: 'Sure Al-Qalam 68:4', note: 'Würdigt seinen hervorragenden Charakter.' },
    ],
    question: {
      prompt: 'Wie sollte Seerah gelernt werden?',
      options: ['Mit Quellen, Kontext und praktischen Charakterlehren', 'Nur als Sammlung dramatischer Geschichten', 'Ohne zwischen starken und schwachen Berichten zu unterscheiden'],
      correctIndex: 0,
      explanation: 'Verantwortliches Seerah-Lernen verbindet belegte Geschichte mit Kontext und Nutzen.',
    },
  },
  {
    id: 'hadith-basics',
    categoryId: 'hadith',
    title: 'Was ist ein Hadith?',
    eyebrow: 'Hadith · Grundlage 1',
    duration: '7 Min.',
    summary: 'Hadithe überliefern Aussagen, Handlungen und Bestätigungen des Propheten und werden nach festen Kriterien geprüft.',
    paragraphs: [
      'Ein Hadith besteht vereinfacht aus einer Überliefererkette und einem berichteten Inhalt. Hadithwissenschaft untersucht beide Bereiche.',
      'Nicht jede zugeschriebene Aussage ist authentisch. Einstufungen wie sahih oder daif beruhen auf der Prüfung von Überlieferern, Verbindungen und Inhalt.',
      'Die App sollte deshalb keine unbelegte Aussage als prophetischen Wortlaut darstellen und bei paraphrasierten Texten ausdrücklich „sinngemäß“ schreiben.',
    ],
    keyPoints: ['Hadithe besitzen Überliefererkette und Inhalt.', 'Authentizität wird geprüft.', 'Sinngemäße Wiedergaben müssen gekennzeichnet werden.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Hujurat 49:6', note: 'Betont die Prüfung von Nachrichten.' },
      { label: 'App-Prinzip', reference: 'Quellenkennzeichnung', note: 'Hadithnummer und Sammlung werden sichtbar angegeben.' },
    ],
    question: {
      prompt: 'Warum darf nicht jede verbreitete Aussage sofort als Hadith gelten?',
      options: ['Weil Überlieferung und Inhalt geprüft werden müssen', 'Weil Hadithe grundsätzlich keine Quellen haben', 'Weil nur moderne Texte zählen'],
      correctIndex: 0,
      explanation: 'Hadithwissenschaft bewertet die Zuverlässigkeit einer Überlieferung anhand festgelegter Kriterien.',
    },
  },
  {
    id: 'hadith-intention',
    categoryId: 'hadith',
    title: 'Handlungen und Absichten',
    eyebrow: 'Hadith · Grundlage 2',
    duration: '6 Min.',
    summary: 'Der bekannte Hadith über die Absicht zeigt, dass das innere Ziel einer Handlung religiöse Bedeutung besitzt.',
    paragraphs: [
      'Der Hadith wird sinngemäß so verstanden, dass Handlungen entsprechend den Absichten bewertet werden und jeder Mensch das erhält, was er beabsichtigt hat.',
      'Eine gute Absicht allein macht eine ansonsten verbotene Handlung nicht automatisch erlaubt. Ob Mittel und Handlung erlaubt sind, muss unabhängig von der guten Absicht geprüft werden.',
      'Praktisch hilft eine kurze innere Prüfung: Warum tue ich das, und kann ich meine Absicht aufrichtig auf Allah ausrichten?',
    ],
    keyPoints: ['Die Absicht gibt der Handlung Richtung.', 'Eine gute Absicht macht Verbotenes nicht automatisch erlaubt.', 'Absichten können bewusst erneuert werden.'],
    sources: [
      { label: 'Hadith', reference: 'Sahih al-Bukhari 1', note: 'Bekannter Hadith über Handlungen und Absichten.' },
      { label: 'Hadith', reference: 'Sahih Muslim 1907', note: 'Parallele authentische Überlieferung zum Thema Absicht.' },
    ],
    question: {
      prompt: 'Was folgt aus dem Hadith über die Absicht?',
      options: ['Die Absicht ist wichtig, macht aber nicht automatisch jede Handlung erlaubt', 'Eine gute Absicht macht jede Handlung erlaubt', 'Nur sichtbare Ergebnisse zählen'],
      correctIndex: 0,
      explanation: 'Aufrichtigkeit ist zentral; die Erlaubtheit einer Handlung muss dennoch eigenständig beurteilt werden.',
    },
  },
  {
    id: 'hadith-verification',
    categoryId: 'hadith',
    title: 'Hadithe sicher weitergeben',
    eyebrow: 'Hadith · Grundlage 3',
    duration: '5 Min.',
    summary: 'Vor dem Teilen sollte geprüft werden, ob Sammlung, Nummer, Einstufung und Wortlaut nachvollziehbar sind.',
    paragraphs: [
      'Kurze Bilder und Videos verbreiten häufig Aussagen ohne Quelle. Ein verantwortlicher Nutzer sucht mindestens nach Sammlung, Nummer und einer nachvollziehbaren Einstufung.',
      'Übersetzungen können voneinander abweichen. Deshalb sollte zwischen arabischem Wortlaut, Übersetzung und eigener Zusammenfassung unterschieden werden.',
      'Kann eine Aussage nicht geprüft werden, ist es besser, sie nicht dem Propheten zuzuschreiben und die Unsicherheit offen zu benennen.',
    ],
    keyPoints: ['Sammlung und Nummer prüfen.', 'Übersetzung und Zusammenfassung trennen.', 'Ungeprüfte Zuschreibungen nicht weiterverbreiten.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Hujurat 49:6', note: 'Grundsatz der Nachrichtenprüfung.' },
      { label: 'Quran', reference: 'Sure Al-Isra 17:36', note: 'Warnt vor Aussagen ohne Wissen.' },
    ],
    question: {
      prompt: 'Was sollte vor dem Teilen eines Hadith-Bildes geprüft werden?',
      options: ['Quelle, Nummer und nachvollziehbare Einstufung', 'Nur das Design', 'Nur die Anzahl der Likes'],
      correctIndex: 0,
      explanation: 'Eine nachvollziehbare Quelle ist wichtiger als Reichweite oder Gestaltung.',
    },
  },
  {
    id: 'akhlaq-sincerity',
    categoryId: 'akhlaq',
    title: 'Aufrichtigkeit',
    eyebrow: 'Akhlaq · Charakter 1',
    duration: '6 Min.',
    summary: 'Aufrichtigkeit richtet gute Taten auf Allah aus und hilft, Selbstdarstellung zu kontrollieren.',
    paragraphs: [
      'Aufrichtigkeit bedeutet, eine gute Tat nicht nur für Anerkennung, Status oder Lob auszuführen. Die Absicht wird auf Allah ausgerichtet.',
      'Menschen können gemischte Motive haben. Deshalb ist Aufrichtigkeit kein einmaliger Zustand, sondern eine regelmäßige innere Korrektur.',
      'Bei manchen guten Taten – etwa freiwilliger Wohltätigkeit – kann bewusstes Verbergen vor Selbstdarstellung schützen. Vor und nach einer Handlung kann außerdem die eigene Absicht geprüft werden.',
    ],
    keyPoints: ['Gute Taten werden auf Allah ausgerichtet.', 'Absichten können gemischt sein und brauchen Korrektur.', 'Verborgene gute Taten können in bestimmten Situationen Aufrichtigkeit fördern.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Bayyina 98:5', note: 'Verbindet Gottesdienst mit aufrichtiger Hingabe.' },
      { label: 'Hadith', reference: 'Sahih al-Bukhari 1', note: 'Grundlage zur Bedeutung der Absicht.' },
      { label: 'Quran', reference: 'Sure Al-Baqara 2:271', note: 'Nennt verborgen gegebene Almosen in diesem Zusammenhang als besser.' },
    ],
    question: {
      prompt: 'Welche Gewohnheit kann Aufrichtigkeit fördern?',
      options: ['Die Absicht regelmäßig prüfen', 'Jede gute Tat öffentlich machen', 'Nur auf Lob achten'],
      correctIndex: 0,
      explanation: 'Die bewusste Prüfung und Erneuerung der Absicht stärkt Aufrichtigkeit.',
    },
  },
  {
    id: 'akhlaq-patience',
    categoryId: 'akhlaq',
    title: 'Geduld und Selbstkontrolle',
    eyebrow: 'Akhlaq · Charakter 2',
    duration: '6 Min.',
    summary: 'Geduld zeigt sich unter anderem in Standhaftigkeit im Guten, Selbstkontrolle und Ruhe in Prüfungen.',
    paragraphs: [
      'Sabr wird oft nur als passives Warten verstanden. Im islamischen Charakter umfasst Geduld auch Standhaftigkeit und Selbstkontrolle.',
      'Geduld schließt angemessenes Handeln nicht aus. Man darf Hilfe suchen, Grenzen setzen und Ungerechtigkeit auf erlaubte Weise ansprechen.',
      'Eine praktische Übung ist die kurze Pause vor einer Reaktion: atmen, Worte prüfen und eine Antwort wählen, die nicht zusätzlich schadet.',
    ],
    keyPoints: ['Geduld ist mehr als passives Warten.', 'Hilfe suchen und Grenzen setzen können mit Geduld vereinbar sein.', 'Selbstkontrolle schützt vor schädlichen Reaktionen.'],
    sources: [
      { label: 'Quran', reference: 'Sure Al-Baqara 2:153', note: 'Verbindet Geduld, Gebet und Allahs Beistand.' },
      { label: 'Quran', reference: 'Sure Aal Imran 3:134', note: 'Lobt Menschen, die Zorn zurückhalten und vergeben.' },
    ],
    question: {
      prompt: 'Was bedeutet Geduld hier?',
      options: ['Standhaft bleiben und Reaktionen kontrollieren', 'Jede Ungerechtigkeit schweigend akzeptieren', 'Nie Hilfe suchen'],
      correctIndex: 0,
      explanation: 'Geduld bedeutet nicht automatisch Passivität; sie schließt kontrolliertes und erlaubtes Handeln nicht aus.',
    },
  },
  {
    id: 'akhlaq-mercy',
    categoryId: 'akhlaq',
    title: 'Barmherzig und respektvoll handeln',
    eyebrow: 'Akhlaq · Charakter 3',
    duration: '7 Min.',
    summary: 'Guter Charakter zeigt sich in Sprache, Vergebung, Hilfe und dem Schutz der Würde anderer.',
    paragraphs: [
      'Der Quran verbindet Gerechtigkeit mit Güte und warnt vor Spott, Beleidigung, übler Nachrede und unbegründetem Misstrauen.',
      'Barmherzigkeit bedeutet nicht, jedes Verhalten gutzuheißen. Kritik kann notwendig sein, soll aber wahr, verhältnismäßig und frei von Demütigung bleiben.',
      'Im digitalen Alltag gilt derselbe Maßstab: keine Beschämung, keine ungeprüften Anschuldigungen und keine Weitergabe privater Fehler zur Unterhaltung.',
    ],
    keyPoints: ['Würde und Gerechtigkeit gehören zusammen.', 'Kritik darf nicht zur Demütigung werden.', 'Auch online gelten islamische Charakterregeln.'],
    sources: [
      { label: 'Quran', reference: 'Sure An-Nahl 16:90', note: 'Gebietet Gerechtigkeit und Güte.' },
      { label: 'Quran', reference: 'Sure Al-Hujurat 49:11–12', note: 'Warnt vor Spott, Verdächtigung und übler Nachrede.' },
    ],
    question: {
      prompt: 'Wie sieht verantwortliche Kritik aus?',
      options: ['Wahr, angemessen und ohne Demütigung', 'Öffentlich möglichst verletzend', 'Auf ungeprüfte Gerüchte gestützt'],
      correctIndex: 0,
      explanation: 'Gerechtigkeit und Barmherzigkeit verlangen klare, aber respektvolle Kritik.',
    },
  },
];

export function getCategoryLessons(categoryId: LearningCategoryId) {
  return LEARNING_LESSONS.filter((lesson) => lesson.categoryId === categoryId);
}

export function getLearningCategory(categoryId: LearningCategoryId) {
  return LEARNING_CATEGORIES.find((category) => category.id === categoryId) ?? LEARNING_CATEGORIES[0];
}
