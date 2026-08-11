/**
 * Fragenkatalog für das Islam-Quiz.
 *
 * Übernommen aus dem Altbestand `memetreza34-ux/nur-islam`, wo die Fragen im
 * Klartext in den Firestore-Einspielskripten lagen. Nichts hiervon ist neu
 * verfasst — die deutsche Fassung wurde unverändert übertragen.
 *
 * Jede Frage trägt ihre Erklärung mit sich. Ein Quiz, das nur "richtig" oder
 * "falsch" meldet, prüft ab; eines, das die Antwort begründet, bringt bei.
 *
 * Die fachliche Endprüfung steht wie bei allen religiösen Inhalten aus.
 */

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Index in `options`. */
  correctAnswer: number;
  explanation: string;
};

export type QuizCategory = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

export const QUIZ_CATEGORIES: readonly QuizCategory[] = [
  {
    id: 'aqidah',
    title: 'Glaube (Aqidah)',
    description: 'Fragen zu den Grundlagen des islamischen Glaubens',
    questions: [
      {
        id: 'a1',
        question: 'Was ist die Bedeutung von "Tawhid"?',
        options: ['Das Gebet', 'Die Einheit und Einzigartigkeit Allahs', 'Das Fasten', 'Die Pilgerfahrt'],
        correctAnswer: 1,
        explanation: 'Tawhid ist der Glaube an die absolute Einheit und Einzigartigkeit Allahs.',
      },
      {
        id: 'a2',
        question: 'Wie viele Säulen des Glaubens (Iman) gibt es?',
        options: ['5', '6', '7', '99'],
        correctAnswer: 1,
        explanation: 'Es gibt 6 Säulen des Glaubens: Glaube an Allah, Seine Engel, Seine Bücher, Seine Gesandten, den Jüngsten Tag und die Vorherbestimmung.',
      },
      {
        id: 'a3',
        question: 'Was ist "Schirk"?',
        options: ['Eine freiwillige Spende', 'Allah Partner beigesellen', 'Das rituelle Waschen', 'Die Pilgerfahrt'],
        correctAnswer: 1,
        explanation: 'Schirk bedeutet, Allah Partner beizugesellen. Es ist die größte Sünde im Islam.',
      },
      {
        id: 'a4',
        question: 'Welcher Engel ist für die Offenbarung zuständig?',
        options: ['Mika\'il', 'Israfil', 'Jibril', 'Azra\'il'],
        correctAnswer: 2,
        explanation: 'Der Engel Jibril (Gabriel) überbrachte den Propheten die Offenbarungen Allahs.',
      },
      {
        id: 'a5',
        question: 'Was bedeutet "Al-Qadr"?',
        options: ['Das Gebet', 'Die Vorherbestimmung', 'Das Fasten', 'Die Engel'],
        correctAnswer: 1,
        explanation: 'Al-Qadr ist der Glaube an die göttliche Vorherbestimmung (dass Allah alles weiß und bestimmt hat).',
      },
      {
        id: 'a6',
        question: 'Wer sind die "Kiraman Katibin"?',
        options: ['Zwei Propheten', 'Die edlen schreibenden Engel', 'Die ersten Muslime', 'Die Wächter des Paradieses'],
        correctAnswer: 1,
        explanation: 'Die Kiraman Katibin sind die zwei Engel, die auf den Schultern sitzen und die guten und schlechten Taten aufschreiben.',
      },
      {
        id: 'a7',
        question: 'Welches Buch wurde dem Propheten Dawud (a.s.) offenbart?',
        options: ['Tawrat (Thora)', 'Injil (Evangelium)', 'Zabur (Psalmen)', 'Koran'],
        correctAnswer: 2,
        explanation: 'Allah offenbarte dem Propheten Dawud (a.s.) das Buch Zabur (die Psalmen).',
      },
      {
        id: 'a8',
        question: 'Was ist die "Fitrah"?',
        options: ['Ein Gebet', 'Die natürliche, angeborene Veranlagung zum Glauben an Allah', 'Ein Fastentag', 'Eine Art von Spende'],
        correctAnswer: 1,
        explanation: 'Fitrah ist der angeborene, natürliche Zustand des Menschen, der ihn dazu neigen lässt, an den einen Schöpfer zu glauben.',
      },
      {
        id: 'a9',
        question: 'Was bedeutet der Name Allahs "Al-Ahad"?',
        options: ['Der Allwissende', 'Der Barmherzige', 'Der Einzige', 'Der Schöpfer'],
        correctAnswer: 2,
        explanation: 'Al-Ahad bedeutet "Der Einzige", der keine Partner, Gleichen oder Teilhaber hat.',
      },
      {
        id: 'a10',
        question: 'Was ist das "Barzakh"?',
        options: ['Das Paradies', 'Die Hölle', 'Das Zwischenstadium nach dem Tod bis zum Jüngsten Tag', 'Der Tag des Gerichts'],
        correctAnswer: 2,
        explanation: 'Das Barzakh ist die Zwischenwelt oder das Leben im Grab, in dem die Seelen bis zur Auferstehung verweilen.',
      },
    ],
  },
  {
    id: 'sahabah',
    title: 'Die Gefährten (Sahabah)',
    description: 'Fragen über die Gefährten des Propheten ﷺ',
    questions: [
      {
        id: 'sah1',
        question: 'Wer war der beste Freund des Propheten ﷺ und der erste Kalif?',
        options: ['Umar ibn Al-Khattab', 'Uthman ibn Affan', 'Ali ibn Abi Talib', 'Abu Bakr As-Siddiq'],
        correctAnswer: 3,
        explanation: 'Abu Bakr As-Siddiq (r.a.) war der engste Freund des Propheten ﷺ und der erste rechtgeleitete Kalif.',
      },
      {
        id: 'sah2',
        question: 'Welcher Gefährte trug den Titel "Al-Faruq" (der Unterscheider)?',
        options: ['Abu Bakr', 'Umar ibn Al-Khattab', 'Uthman', 'Ali'],
        correctAnswer: 1,
        explanation: 'Umar ibn Al-Khattab (r.a.) wurde Al-Faruq genannt, weil er Wahrheit und Falschheit klar unterschied.',
      },
      {
        id: 'sah3',
        question: 'Welcher Gefährte war bekannt für seine extreme Schüchternheit und Bescheidenheit?',
        options: ['Abu Bakr', 'Umar', 'Uthman ibn Affan', 'Ali'],
        correctAnswer: 2,
        explanation: 'Uthman ibn Affan (r.a.) war so bescheiden, dass sogar die Engel vor ihm Scham empfanden.',
      },
      {
        id: 'sah4',
        question: 'Wer war der Cousin und Schwiegersohn des Propheten ﷺ?',
        options: ['Abu Sufyan', 'Ali ibn Abi Talib', 'Zaid ibn Harithah', 'Bilal ibn Rabah'],
        correctAnswer: 1,
        explanation: 'Ali ibn Abi Talib (r.a.) war der Cousin des Propheten ﷺ und heiratete dessen Tochter Fatima (r.a.).',
      },
      {
        id: 'sah5',
        question: 'Welcher Gefährte überlieferte die meisten Ahadith (Aussprüche des Propheten)?',
        options: ['Abu Hurairah', 'Abdullah ibn Umar', 'Anas ibn Malik', 'Aischa'],
        correctAnswer: 0,
        explanation: 'Abu Hurairah (r.a.) überlieferte mit über 5000 Ahadith die meisten Aussprüche des Propheten ﷺ.',
      },
      {
        id: 'sah6',
        question: 'Wer war der erste Mu\'adhin (Gebetsrufer) im Islam?',
        options: ['Ammar ibn Yasir', 'Salman al-Farsi', 'Bilal ibn Rabah', 'Suhayb ar-Rumi'],
        correctAnswer: 2,
        explanation: 'Bilal ibn Rabah (r.a.) wurde wegen seiner schönen Stimme vom Propheten ﷺ als erster Gebetsrufer ausgewählt.',
      },
      {
        id: 'sah7',
        question: 'Welcher Gefährte schlug vor, einen Graben um Medina zu graben (Schlachtgraben)?',
        options: ['Khalid ibn al-Walid', 'Salman al-Farsi', 'Abu Ubaidah', 'Saad ibn Muadh'],
        correctAnswer: 1,
        explanation: 'Salman al-Farsi (r.a.) brachte die persische Taktik des Grabenziehens ein, um Medina zu verteidigen.',
      },
      {
        id: 'sah8',
        question: 'Wer war der "Vertraute der Geheimnisse" des Propheten ﷺ?',
        options: ['Hudhaifah ibn al-Yaman', 'Abdullah ibn Masud', 'Zaid ibn Thabit', 'Abu Dharr al-Ghifari'],
        correctAnswer: 0,
        explanation: 'Hudhaifah ibn al-Yaman (r.a.) kannte die Namen der Heuchler, die der Prophet ﷺ ihm anvertraut hatte.',
      },
      {
        id: 'sah9',
        question: 'Welcher Gefährte wurde "Schwert Allahs" genannt?',
        options: ['Hamza ibn Abdul-Muttalib', 'Ali ibn Abi Talib', 'Khalid ibn al-Walid', 'Amr ibn al-Aas'],
        correctAnswer: 2,
        explanation: 'Khalid ibn al-Walid (r.a.) war ein unbesiegter Feldherr und erhielt diesen Titel vom Propheten ﷺ.',
      },
      {
        id: 'sah10',
        question: 'Wer war der Hauptschreiber der Offenbarungen (Koran)?',
        options: ['Zaid ibn Thabit', 'Abdullah ibn Abbas', 'Abu Hurairah', 'Hassan ibn Thabit'],
        correctAnswer: 0,
        explanation: 'Zaid ibn Thabit (r.a.) war der Hauptschreiber des Propheten ﷺ und leitete später die Zusammenstellung des Korans.',
      },
    ],
  },
  {
    id: 'women_in_islam',
    title: 'Frauen im Islam',
    description: 'Fragen über bedeutende Frauen in der islamischen Geschichte',
    questions: [
      {
        id: 'w1',
        question: 'Wer war die erste Frau, die den Islam annahm?',
        options: ['Aischa bint Abu Bakr', 'Khadijah bint Khuwaylid', 'Fatima bint Muhammad', 'Sumayyah bint Khayyat'],
        correctAnswer: 1,
        explanation: 'Khadijah (r.a.) war die erste Ehefrau des Propheten ﷺ und der allererste Mensch, der den Islam annahm.',
      },
      {
        id: 'w2',
        question: 'Wer war die erste Märtyrerin im Islam?',
        options: ['Asma bint Abu Bakr', 'Khadijah', 'Sumayyah bint Khayyat', 'Umm Salama'],
        correctAnswer: 2,
        explanation: 'Sumayyah (r.a.) wurde wegen ihres Glaubens von Abu Jahl getötet und ist die erste Märtyrerin im Islam.',
      },
      {
        id: 'w3',
        question: 'Welche Frau wird im Koran namentlich erwähnt?',
        options: ['Maryam (Maria)', 'Aasiyah', 'Khadijah', 'Fatima'],
        correctAnswer: 0,
        explanation: 'Maryam (a.s.), die Mutter von Prophet Isa (a.s.), ist die einzige Frau, die im Koran namentlich erwähnt wird.',
      },
      {
        id: 'w4',
        question: 'Wer war die Frau des Pharao, die Musa (a.s.) aufzog und an Allah glaubte?',
        options: ['Hajar', 'Sarah', 'Aasiyah', 'Zuleikha'],
        correctAnswer: 2,
        explanation: 'Aasiyah (r.a.) war die gläubige Frau des Pharao und wird im Koran als Vorbild für die Gläubigen genannt.',
      },
      {
        id: 'w5',
        question: 'Welche Tochter des Propheten ﷺ heiratete Ali ibn Abi Talib?',
        options: ['Zainab', 'Ruqayyah', 'Umm Kulthum', 'Fatima'],
        correctAnswer: 3,
        explanation: 'Fatima (r.a.) heiratete Ali (r.a.) und sie sind die Eltern von Hasan und Husain.',
      },
      {
        id: 'w6',
        question: 'Welche Ehefrau des Propheten ﷺ überlieferte die meisten Ahadith?',
        options: ['Khadijah', 'Aischa', 'Hafsa', 'Umm Salama'],
        correctAnswer: 1,
        explanation: 'Aischa (r.a.) war eine große Gelehrte und überlieferte über 2200 Ahadith.',
      },
      {
        id: 'w7',
        question: 'Wer lief zwischen den Hügeln Safa und Marwa auf der Suche nach Wasser?',
        options: ['Sarah', 'Hajar', 'Maryam', 'Aasiyah'],
        correctAnswer: 1,
        explanation: 'Hajar (r.a.), die Frau von Ibrahim (a.s.), lief auf der Suche nach Wasser für ihren Sohn Ismail. Das Sa\'i beim Hajj erinnert daran.',
      },
      {
        id: 'w8',
        question: 'Welche Frau wird als "Mutter der Gläubigen" bezeichnet?',
        options: ['Die Töchter des Propheten', 'Die Ehefrauen des Propheten', 'Die weiblichen Gefährten', 'Die Mütter der Propheten'],
        correctAnswer: 1,
        explanation: 'Die Ehefrauen des Propheten Muhammad ﷺ tragen den ehrenvollen Titel "Mütter der Gläubigen" (Ummahat al-Mu\'minin).',
      },
      {
        id: 'w9',
        question: 'Welche Tochter von Abu Bakr brachte dem Propheten ﷺ während der Hijra Essen in die Höhle Thawr?',
        options: ['Aischa', 'Asma', 'Fatima', 'Zainab'],
        correctAnswer: 1,
        explanation: 'Asma bint Abu Bakr (r.a.) riskierte ihr Leben, um den Propheten ﷺ und ihren Vater heimlich mit Nahrung zu versorgen.',
      },
      {
        id: 'w10',
        question: 'Wer war die Mutter des Propheten Muhammad ﷺ?',
        options: ['Halima', 'Aminah bint Wahb', 'Khadijah', 'Fatima bint Asad'],
        correctAnswer: 1,
        explanation: 'Aminah bint Wahb war die Mutter des Propheten ﷺ. Sie starb, als er noch ein kleines Kind war.',
      },
    ],
  },
  {
    id: 'akhlaq',
    title: 'Charakter & Ethik (Akhlaq)',
    description: 'Fragen zum islamischen Verhalten und Charakter',
    questions: [
      {
        id: 'ak1',
        question: 'Was sagte der Prophet ﷺ über den Grund seiner Entsendung?',
        options: ['Um Kriege zu führen', 'Um Reichtum zu sammeln', 'Um die edlen Charakterzüge zu vervollkommnen', 'Um neue Gesetze zu erfinden'],
        correctAnswer: 2,
        explanation: 'Der Prophet ﷺ sagte: "Ich wurde nur entsandt, um die edlen Charakterzüge zu vervollkommnen."',
      },
      {
        id: 'ak2',
        question: 'Was ist im Islam schwerer auf der Waage (Mizan) am Tag des Gerichts?',
        options: ['Viel Geld', 'Guter Charakter (Akhlaq)', 'Körperliche Stärke', 'Lange Reden'],
        correctAnswer: 1,
        explanation: 'Der Prophet ﷺ sagte, dass nichts schwerer auf der Waage wiegt als ein guter Charakter.',
      },
      {
        id: 'ak3',
        question: 'Wie sollte ein Muslim mit seinen Eltern umgehen?',
        options: ['Sie ignorieren', 'Mit Güte und Respekt (Birr al-Walidayn)', 'Nur an Feiertagen besuchen', 'Ihnen widersprechen'],
        correctAnswer: 1,
        explanation: 'Güte zu den Eltern (Birr al-Walidayn) ist eine der wichtigsten Pflichten im Islam, direkt nach der Anbetung Allahs.',
      },
      {
        id: 'ak4',
        question: 'Was ist "Ghibah"?',
        options: ['Lügen', 'Über jemanden in seiner Abwesenheit etwas Schlechtes sagen', 'Stehlen', 'Betrügen'],
        correctAnswer: 1,
        explanation: 'Ghibah (Lästerung) ist, über jemanden in seiner Abwesenheit etwas zu sagen, das er nicht mögen würde. Es ist streng verboten.',
      },
      {
        id: 'ak5',
        question: 'Was ist die islamische Begrüßung?',
        options: ['Guten Tag', 'Hallo', 'As-salamu alaykum (Friede sei mit euch)', 'Willkommen'],
        correctAnswer: 2,
        explanation: 'Die Begrüßung der Muslime ist "As-salamu alaykum", was bedeutet: Der Friede sei mit euch.',
      },
      {
        id: 'ak6',
        question: 'Was sagte der Prophet ﷺ über den Nachbarn?',
        options: ['Man soll ihn ignorieren', 'Wer an Allah glaubt, soll seinen Nachbarn gut behandeln', 'Man darf ihn stören', 'Man muss ihn nicht grüßen'],
        correctAnswer: 1,
        explanation: 'Der Prophet ﷺ betonte die Rechte des Nachbarn so sehr, dass er dachte, der Nachbar würde bald erbberechtigt werden.',
      },
      {
        id: 'ak7',
        question: 'Was ist "Sabr"?',
        options: ['Wut', 'Geduld und Standhaftigkeit', 'Trauer', 'Angst'],
        correctAnswer: 1,
        explanation: 'Sabr ist die Geduld in schwierigen Zeiten, beim Gehorsam gegenüber Allah und beim Fernhalten von Sünden.',
      },
      {
        id: 'ak8',
        question: 'Welche Eigenschaft wird als "die Hälfte des Glaubens" bezeichnet?',
        options: ['Reichtum', 'Reinheit (Taharah)', 'Intelligenz', 'Schnelligkeit'],
        correctAnswer: 1,
        explanation: 'Der Prophet ﷺ sagte: "Die Reinheit (Taharah) ist die Hälfte des Glaubens."',
      },
      {
        id: 'ak9',
        question: 'Was ist die beste Tat nach den Pflichtgebeten?',
        options: ['Schlafen', 'Essen', 'Gutes Verhalten und anderen helfen', 'Reisen'],
        correctAnswer: 2,
        explanation: 'Gutes Verhalten, Freundlichkeit und das Helfen anderer gehören zu den besten Taten im Islam.',
      },
      {
        id: 'ak10',
        question: 'Was sagte der Prophet ﷺ über ein Lächeln?',
        options: ['Es ist ein Zeichen von Schwäche', 'Es ist eine Sadaqah (Spende/Almosen)', 'Es ist unnötig', 'Es ist nur für Kinder'],
        correctAnswer: 1,
        explanation: 'Der Prophet ﷺ sagte: "Dein Lächeln in das Gesicht deines Bruders ist für dich eine Sadaqah (Spende)."',
      },
    ],
  },
  {
    id: 'hadith',
    title: 'Hadith',
    description: 'Fragen zu den Aussprüchen und Handlungen des Propheten ﷺ',
    questions: [
      {
        id: 'had1',
        question: 'Was ist ein Hadith?',
        options: ['Ein Kapitel im Koran', 'Eine Überlieferung der Aussprüche, Handlungen oder stillschweigenden Zustimmungen des Propheten ﷺ', 'Ein Gebet', 'Ein Engel'],
        correctAnswer: 1,
        explanation: 'Ein Hadith ist eine Überlieferung über das, was der Prophet Muhammad ﷺ gesagt, getan oder stillschweigend gebilligt hat.',
      },
      {
        id: 'had2',
        question: 'Welches ist das authentischste Hadith-Buch?',
        options: ['Sunan Abu Dawud', 'Sahih Muslim', 'Sahih Al-Bukhari', 'Muwatta Malik'],
        correctAnswer: 2,
        explanation: 'Sahih Al-Bukhari gilt bei den sunnitischen Muslimen als das authentischste Buch nach dem Koran.',
      },
      {
        id: 'had3',
        question: 'Aus welchen zwei Hauptteilen besteht ein Hadith?',
        options: ['Frage und Antwort', 'Isnad (Überliefererkette) und Matn (Text)', 'Koran und Sunnah', 'Anfang und Ende'],
        correctAnswer: 1,
        explanation: 'Ein Hadith besteht aus dem Isnad (der Kette der Überlieferer) und dem Matn (dem eigentlichen Text der Überlieferung).',
      },
      {
        id: 'had4',
        question: 'Was bedeutet "Sahih" in Bezug auf einen Hadith?',
        options: ['Schwach', 'Erfunden', 'Authentisch / Gesund', 'Gut'],
        correctAnswer: 2,
        explanation: 'Ein Sahih-Hadith ist eine authentische Überlieferung, die strenge Kriterien der Zuverlässigkeit erfüllt.',
      },
      {
        id: 'had5',
        question: 'Was bedeutet "Da\'if" in Bezug auf einen Hadith?',
        options: ['Schwach', 'Authentisch', 'Lang', 'Kurz'],
        correctAnswer: 0,
        explanation: 'Ein Da\'if-Hadith ist eine schwache Überlieferung, bei der die Kriterien für Authentizität nicht vollständig erfüllt sind.',
      },
      {
        id: 'had6',
        question: 'Wer ist der Autor von "Sahih Muslim"?',
        options: ['Imam Malik', 'Imam Ahmad', 'Imam Muslim ibn al-Hajjaj', 'Imam At-Tirmidhi'],
        correctAnswer: 2,
        explanation: 'Imam Muslim ibn al-Hajjaj sammelte die Ahadith in seinem berühmten Werk "Sahih Muslim".',
      },
      {
        id: 'had7',
        question: 'Wie nennt man die sechs wichtigsten Hadith-Sammlungen?',
        options: ['Al-Kutub As-Sittah', 'Al-Qur\'an', 'Tafsir', 'Fiqh'],
        correctAnswer: 0,
        explanation: 'Die sechs wichtigsten Sammlungen (Bukhari, Muslim, Abu Dawud, Tirmidhi, An-Nasa\'i, Ibn Majah) nennt man Al-Kutub As-Sittah.',
      },
      {
        id: 'had8',
        question: 'Was ist ein "Hadith Qudsi"?',
        options: ['Ein Hadith über Engel', 'Ein Hadith, in dem der Prophet ﷺ die Worte Allahs wiedergibt (nicht Teil des Korans)', 'Ein langes Hadith', 'Ein schwaches Hadith'],
        correctAnswer: 1,
        explanation: 'Ein Hadith Qudsi (heiliger Hadith) enthält die Worte Allahs, die vom Propheten ﷺ formuliert wurden, aber nicht zum Koran gehören.',
      },
      {
        id: 'had9',
        question: 'Mit welchem berühmten Hadith beginnt Sahih Al-Bukhari?',
        options: ['Der Hadith über das Gebet', 'Der Hadith über die Absichten (Niyyah)', 'Der Hadith über das Fasten', 'Der Hadith über Jibril'],
        correctAnswer: 1,
        explanation: 'Sahih Al-Bukhari beginnt mit dem Hadith: "Die Taten sind entsprechend den Absichten..."',
      },
      {
        id: 'had10',
        question: 'Wer war Imam An-Nawawi?',
        options: ['Ein Prophet', 'Ein Kalif', 'Ein berühmter Gelehrter, der die "40 Hadithe" sammelte', 'Ein Gefährte des Propheten'],
        correctAnswer: 2,
        explanation: 'Imam An-Nawawi war ein großer Gelehrter, berühmt für seine Sammlung der "40 Hadithe" (Arba\'in An-Nawawiyyah).',
      },
    ],
  },
  {
    id: 'dua',
    title: 'Bittgebete (Dua)',
    description: 'Fragen zu den Bittgebeten im Islam',
    questions: [
      {
        id: 'dua1',
        question: 'Was bedeutet das Wort "Dua"?',
        options: ['Fasten', 'Spenden', 'Rufen / Bitten (zu Allah)', 'Pilgern'],
        correctAnswer: 2,
        explanation: 'Dua bedeutet wörtlich "rufen" oder "bitten" und ist die direkte Kommunikation mit Allah.',
      },
      {
        id: 'dua2',
        question: 'Was sagte der Prophet ﷺ über das Dua?',
        options: ['Es ist nur für Propheten', 'Es ist der Kern der Anbetung (Ibadah)', 'Es ist nicht wichtig', 'Es wird nur im Ramadan akzeptiert'],
        correctAnswer: 1,
        explanation: 'Der Prophet ﷺ sagte: "Das Bittgebet (Dua) ist die Anbetung (Ibadah)."',
      },
      {
        id: 'dua3',
        question: 'Wann ist eine der besten Zeiten, um Dua zu machen?',
        options: ['Während man schläft', 'Im letzten Drittel der Nacht', 'Beim Essen', 'Beim Sprechen mit Freunden'],
        correctAnswer: 1,
        explanation: 'Das letzte Drittel der Nacht (Tahajjud-Zeit) ist eine Zeit, in der Allah die Bittgebete besonders erhört.',
      },
      {
        id: 'dua4',
        question: 'Welches Dua sprach der Prophet Yunus (a.s.) im Bauch des Wals?',
        options: ['Allahu Akbar', 'La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin', 'Alhamdulillah', 'Subhanallah'],
        correctAnswer: 1,
        explanation: 'Er rief: "Es gibt keinen Gott außer Dir. Preis sei Dir! Gewiss, ich gehörte zu den Ungerechten."',
      },
      {
        id: 'dua5',
        question: 'Was sollte man tun, bevor man ein Dua beginnt?',
        options: ['Allah lobpreisen und Segenswünsche auf den Propheten ﷺ sprechen', 'Laut schreien', 'Die Augen schließen', 'Sich hinlegen'],
        correctAnswer: 0,
        explanation: 'Es gehört zu den Etiketten des Dua, mit dem Lobpreis Allahs und Salawat auf den Propheten ﷺ zu beginnen.',
      },
      {
        id: 'dua6',
        question: 'In welcher Position im Gebet ist man Allah am nächsten (und Dua ist sehr empfohlen)?',
        options: ['Beim Stehen (Qiyam)', 'Beim Verbeugen (Ruku)', 'Bei der Niederwerfung (Sujud)', 'Beim Sitzen (Tashahhud)'],
        correctAnswer: 2,
        explanation: 'Der Prophet ﷺ sagte: "Am nächsten ist der Diener seinem Herrn, wenn er sich in der Niederwerfung (Sujud) befindet; so vermehrt darin das Bittgebet."',
      },
      {
        id: 'dua7',
        question: 'Was bedeutet "Ameen" am Ende eines Duas?',
        options: ['Ende', 'O Allah, erhöre es (nimm es an)', 'Frieden', 'Danke'],
        correctAnswer: 1,
        explanation: 'Ameen ist eine Bitte an Allah, das gesprochene Bittgebet zu erhören und anzunehmen.',
      },
      {
        id: 'dua8',
        question: 'Welches Dua wird oft beim Verlassen des Hauses gesprochen?',
        options: ['Bismillahi tawakkaltu \'alallah...', 'Alhamdulillah', 'Subhanallah', 'Allahu Akbar'],
        correctAnswer: 0,
        explanation: 'Bismillahi tawakkaltu \'alallah, wa la hawla wa la quwwata illa billah (Im Namen Allahs, ich vertraue auf Allah...).',
      },
      {
        id: 'dua9',
        question: 'Wessen Dua wird laut einem Hadith nicht abgewiesen?',
        options: ['Die des Fastenden, bis er das Fasten bricht', 'Die des Reichen', 'Die des Starken', 'Die desjenigen, der viel schläft'],
        correctAnswer: 0,
        explanation: 'Der Prophet ﷺ zählte den Fastenden zu den Personen, deren Bittgebet von Allah nicht abgewiesen wird.',
      },
      {
        id: 'dua10',
        question: 'Was ist "Istikhara"?',
        options: ['Ein Gebet um Vergebung', 'Ein Gebet, um Allah um die beste Entscheidung in einer Angelegenheit zu bitten', 'Ein Gebet für Regen', 'Ein Gebet bei einer Sonnenfinsternis'],
        correctAnswer: 1,
        explanation: 'Das Istikhara-Gebet und -Dua wird verrichtet, wenn man vor einer Entscheidung steht und Allah um Führung bittet.',
      },
    ],
  },
];

export const QUIZ_QUESTION_COUNT = QUIZ_CATEGORIES.reduce(
  (total, category) => total + category.questions.length,
  0,
);
