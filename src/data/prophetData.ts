export type ProphetEntry = {
  id: string;
  name: string;
  arabic: string;
  commonName?: string;
  summary: string;
  focus: string;
  lesson: string;
  quranReferences: string[];
};

export const PROPHETS: readonly ProphetEntry[] = [
  {
    id: 'adam', name: 'Adam', arabic: 'آدم',
    summary: 'Der erste Mensch und ein Prophet Allahs. Der Quran berichtet von seiner Erschaffung, seiner Prüfung, seiner Reue und neuer Rechtleitung.',
    focus: 'Erschaffung, Verantwortung und Reue',
    lesson: 'Ein Fehler muss nicht das Ende sein: Aufrichtige Reue führt zurück zu Allah.',
    quranReferences: ['Quran 2:30–39 (Al-Baqara)', 'Quran 20:115–123 (Ta-Ha)'],
  },
  {
    id: 'idris', name: 'Idris', arabic: 'إدريس',
    summary: 'Der Quran bezeichnet Idris als wahrhaftig und als Propheten, der zu einem hohen Rang erhoben wurde. Weitere Lebensdetails werden nicht ausgeführt.',
    focus: 'Wahrhaftigkeit und hoher Rang',
    lesson: 'Nur sicher Belegtes wird behauptet; Wahrhaftigkeit ist eine prophetische Eigenschaft.',
    quranReferences: ['Quran 19:56–57 (Maryam)', 'Quran 21:85–86 (Al-Anbiya)'],
  },
  {
    id: 'nuh', name: 'Nuh', arabic: 'نوح', commonName: 'Noah',
    summary: 'Nuh rief sein Volk beharrlich zur Anbetung Allahs. Auf Allahs Befehl baute er die Arche; die Gläubigen wurden vor der Flut gerettet.',
    focus: 'Geduldiger Aufruf, Arche und Rettung',
    lesson: 'Standhaftigkeit hängt nicht von schneller Anerkennung oder vielen Anhängern ab.',
    quranReferences: ['Quran 11:25–49 (Hud)', 'Quran 71:1–28 (Nuh)'],
  },
  {
    id: 'hud', name: 'Hud', arabic: 'هود',
    summary: 'Hud wurde zum Volk ʿAd gesandt. Er rief zur Anbetung Allahs und warnte ein mächtiges Volk vor Hochmut und falscher Sicherheit.',
    focus: 'Tawhid und Warnung vor Hochmut',
    lesson: 'Materielle Stärke ersetzt weder Dankbarkeit noch Verantwortung.',
    quranReferences: ['Quran 7:65–72 (Al-Araf)', 'Quran 11:50–60 (Hud)'],
  },
  {
    id: 'salih', name: 'Salih', arabic: 'صالح',
    summary: 'Salih wurde zu Thamud gesandt. Die Kamelstute wurde als deutliches Zeichen und Prüfung genannt, doch sein Volk missachtete die Warnung.',
    focus: 'Zeichen, Prüfung und Verantwortung',
    lesson: 'Klares Wissen schützt nicht, wenn Überheblichkeit die Umkehr verhindert.',
    quranReferences: ['Quran 7:73–79 (Al-Araf)', 'Quran 11:61–68 (Hud)'],
  },
  {
    id: 'ibrahim', name: 'Ibrahim', arabic: 'إبراهيم', commonName: 'Abraham',
    summary: 'Ibrahim trat dem Götzendienst entgegen, bestand schwere Prüfungen und errichtete mit Ismail die Grundlagen der Kaaba.',
    focus: 'Tawhid, Prüfungen und Kaaba',
    lesson: 'Hingabe an Allah verlangt Klarheit, Mut und Vertrauen.',
    quranReferences: ['Quran 2:124–132 (Al-Baqara)', 'Quran 21:51–73 (Al-Anbiya)'],
  },
  {
    id: 'lut', name: 'Lut', arabic: 'لوط', commonName: 'Lot',
    summary: 'Lut warnte sein Volk vor schwerem Fehlverhalten. Die Botschaft wurde abgelehnt; Lut und die Gläubigen wurden gerettet.',
    focus: 'Standhaftigkeit, Warnung und Rettung',
    lesson: 'Mehrheitsverhalten macht Unrecht nicht richtig.',
    quranReferences: ['Quran 7:80–84 (Al-Araf)', 'Quran 11:77–83 (Hud)'],
  },
  {
    id: 'ismail', name: 'Ismail', arabic: 'إسماعيل', commonName: 'Ismael',
    summary: 'Ismail unterstützte Ibrahim beim Errichten der Kaaba. Der Quran hebt seine Verlässlichkeit sowie seine Sorge um Gebet und Zakat hervor.',
    focus: 'Verlässlichkeit, Gebet und Familie',
    lesson: 'Glaube wird durch eingehaltene Versprechen und Verantwortung vorgelebt.',
    quranReferences: ['Quran 2:125–129 (Al-Baqara)', 'Quran 19:54–55 (Maryam)'],
  },
  {
    id: 'ishaq', name: 'Ishaq', arabic: 'إسحاق', commonName: 'Isaak',
    summary: 'Ishaq wurde Ibrahim und seiner Frau trotz ihres hohen Alters als frohe Botschaft angekündigt. Er gehört zu einer rechtgeleiteten Familie von Propheten.',
    focus: 'Frohe Botschaft und Fortsetzung der Rechtleitung',
    lesson: 'Allahs Möglichkeiten sind nicht an menschliche Erwartungen gebunden.',
    quranReferences: ['Quran 11:69–73 (Hud)', 'Quran 37:112–113 (As-Saffat)'],
  },
  {
    id: 'yaqub', name: 'Yaqub', arabic: 'يعقوب', commonName: 'Jakob',
    summary: 'Yaqub verlor den Kontakt zu Yusuf und trauerte tief. Dennoch sprach er von schöner Geduld und gab die Hoffnung auf Allahs Hilfe nicht auf.',
    focus: 'Trauer, schöne Geduld und Hoffnung',
    lesson: 'Trauer und Glaube widersprechen sich nicht; Geduld bedeutet nicht Hoffnungslosigkeit.',
    quranReferences: ['Quran 12:83–98 (Yusuf)'],
  },
  {
    id: 'yusuf', name: 'Yusuf', arabic: 'يوسف', commonName: 'Josef',
    summary: 'Yusuf wurde von seinen Brüdern getrennt, verkauft und unschuldig eingesperrt. Später erhielt er Verantwortung in Ägypten und vergab seiner Familie.',
    focus: 'Prüfung, Integrität, Verantwortung und Vergebung',
    lesson: 'Macht kann für Vergebung statt für Rache genutzt werden.',
    quranReferences: ['Quran 12:4–101 (Yusuf)'],
  },
  {
    id: 'ayyub', name: 'Ayyub', arabic: 'أيوب', commonName: 'Hiob',
    summary: 'Ayyub rief Allah in schwerer Bedrängnis um Hilfe. Allah nahm die Not von ihm und stellte seine Familie und Gaben wieder her.',
    focus: 'Bedrängnis, Dua und Geduld',
    lesson: 'Geduld schließt ein ehrliches Bittgebet und die Bitte um Hilfe nicht aus.',
    quranReferences: ['Quran 21:83–84 (Al-Anbiya)', 'Quran 38:41–44 (Sad)'],
  },
  {
    id: 'shuayb', name: 'Shuʿayb', arabic: 'شعيب',
    summary: 'Shuʿayb rief die Menschen von Madyan zur Anbetung Allahs sowie zu vollem Maß und Gewicht. Er warnte ausdrücklich vor Betrug.',
    focus: 'Tawhid und Ehrlichkeit im Handel',
    lesson: 'Glaube und wirtschaftliche Gerechtigkeit gehören zusammen.',
    quranReferences: ['Quran 7:85–93 (Al-Araf)', 'Quran 11:84–95 (Hud)'],
  },
  {
    id: 'musa', name: 'Musa', arabic: 'موسى', commonName: 'Moses',
    summary: 'Musa erhielt Offenbarung, trat Pharao entgegen und führte die Kinder Israels aus Unterdrückung. Seine Geschichte umfasst Mut, Leitung und viele Prüfungen.',
    focus: 'Offenbarung, Pharao, Auszug und Führung',
    lesson: 'Mut kann mit Angst beginnen und wächst durch Vertrauen auf Allah.',
    quranReferences: ['Quran 20:9–98 (Ta-Ha)', 'Quran 28:3–46 (Al-Qasas)'],
  },
  {
    id: 'harun', name: 'Harun', arabic: 'هارون', commonName: 'Aaron',
    summary: 'Harun unterstützte seinen Bruder Musa in dessen Auftrag. Während Musas Abwesenheit bemühte er sich, sein Volk vor Abweichung zu bewahren.',
    focus: 'Zusammenarbeit und Verantwortung',
    lesson: 'Eine wichtige Aufgabe darf gemeinsam getragen werden.',
    quranReferences: ['Quran 20:29–36 (Ta-Ha)', 'Quran 20:90–94 (Ta-Ha)'],
  },
  {
    id: 'dhul-kifl', name: 'Dhul-Kifl', arabic: 'ذو الكفل',
    summary: 'Dhul-Kifl wird im Quran unter den Geduldigen und Guten genannt. Eine ausführliche Lebensgeschichte wird dort nicht erzählt.',
    focus: 'Geduld und Rechtschaffenheit',
    lesson: 'Wenige sichere Informationen sind besser als ausgeschmückte Geschichten.',
    quranReferences: ['Quran 21:85–86 (Al-Anbiya)', 'Quran 38:48 (Sad)'],
  },
  {
    id: 'dawud', name: 'Dawud', arabic: 'داود', commonName: 'David',
    summary: 'Dawud erhielt Weisheit, Herrschaft und den Zabur. Der Quran verbindet seine Geschichte mit gerechtem Urteil, Anbetung und Umkehr.',
    focus: 'Offenbarung, Herrschaft und Gerechtigkeit',
    lesson: 'Macht braucht gerechtes Urteil und die Bereitschaft, Fehler zu erkennen.',
    quranReferences: ['Quran 2:251 (Al-Baqara)', 'Quran 38:17–26 (Sad)'],
  },
  {
    id: 'sulayman', name: 'Sulayman', arabic: 'سليمان', commonName: 'Salomo',
    summary: 'Sulayman erhielt ein außergewöhnliches Königreich. Die Begegnung mit der Königin von Saba zeigt Weisheit, Einladung und Dankbarkeit.',
    focus: 'Große Gaben, Weisheit und Dankbarkeit',
    lesson: 'Außergewöhnliche Fähigkeiten sind eine Verantwortung und kein Grund für Hochmut.',
    quranReferences: ['Quran 27:15–44 (An-Naml)', 'Quran 34:12–14 (Saba)'],
  },
  {
    id: 'ilyas', name: 'Ilyas', arabic: 'إلياس', commonName: 'Elias',
    summary: 'Ilyas rief sein Volk von der Anbetung Baals zur alleinigen Anbetung Allahs zurück. Der Quran zählt ihn zu den Gesandten und Rechtschaffenen.',
    focus: 'Klare Zurückweisung des Götzendienstes',
    lesson: 'Tawhid bleibt die gemeinsame Botschaft aller Gesandten.',
    quranReferences: ['Quran 37:123–132 (As-Saffat)'],
  },
  {
    id: 'al-yasa', name: 'Al-Yasaʿ', arabic: 'اليسع', commonName: 'Elischa',
    summary: 'Al-Yasaʿ wird namentlich unter rechtgeleiteten und ausgezeichneten Menschen genannt. Weitere Einzelheiten erzählt der Quran nicht.',
    focus: 'Rechtleitung und Auszeichnung',
    lesson: 'Eine ehrliche Zusammenfassung benennt auch die Grenze des sicheren Wissens.',
    quranReferences: ['Quran 6:86 (Al-Anam)', 'Quran 38:48 (Sad)'],
  },
  {
    id: 'yunus', name: 'Yunus', arabic: 'يونس', commonName: 'Jona',
    summary: 'Yunus wurde von einem großen Fisch verschlungen. Er lobpries Allah und bekannte sein Unrecht; Allah rettete ihn und sandte ihn erneut zu seinem Volk.',
    focus: 'Bedrängnis, Dua, Rettung und Rückkehr',
    lesson: 'In tiefster Not bleibt Dua möglich, und ein Fehler muss eine gute Aufgabe nicht beenden.',
    quranReferences: ['Quran 21:87–88 (Al-Anbiya)', 'Quran 37:139–148 (As-Saffat)'],
  },
  {
    id: 'zakariyya', name: 'Zakariyya', arabic: 'زكريا', commonName: 'Zacharias',
    summary: 'Zakariyya bat Allah im hohen Alter um rechtschaffene Nachkommenschaft. Sein leises Dua wurde mit der frohen Botschaft von Yahya beantwortet.',
    focus: 'Hoffnungsvolles Dua und Yahyas Geburt',
    lesson: 'Dua darf auch menschlich unwahrscheinliche Hoffnungen enthalten.',
    quranReferences: ['Quran 3:38–41 (Al Imran)', 'Quran 19:2–11 (Maryam)'],
  },
  {
    id: 'yahya', name: 'Yahya', arabic: 'يحيى', commonName: 'Johannes',
    summary: 'Yahya erhielt schon als Kind Weisheit. Er wird als rein, gottesbewusst, gütig zu seinen Eltern und frei von Überheblichkeit beschrieben.',
    focus: 'Frühe Weisheit, Reinheit und Güte',
    lesson: 'Wissen zeigt sich nicht nur in Worten, sondern auch im Charakter.',
    quranReferences: ['Quran 19:7–15 (Maryam)', 'Quran 3:39 (Al Imran)'],
  },
  {
    id: 'isa', name: 'Isa', arabic: 'عيسى', commonName: 'Jesus',
    summary: 'Isa wurde ohne Vater geboren, erhielt das Injil und vollbrachte Zeichen durch Allahs Erlaubnis. Er rief zur Anbetung Allahs.',
    focus: 'Besondere Geburt, Injil und Zeichen',
    lesson: 'Muslime ehren Isa als Messias und Gesandten, ohne ihn anzubeten.',
    quranReferences: ['Quran 3:45–55 (Al Imran)', 'Quran 5:110–120 (Al-Maida)'],
  },
  {
    id: 'muhammad', name: 'Muhammad', arabic: 'محمد',
    summary: 'Muhammad ﷺ empfing den Quran, übermittelte die Botschaft und lebte sie vor. Der Quran bezeichnet ihn als Siegel der Propheten und Barmherzigkeit für die Welten.',
    focus: 'Quran, letzte Prophetie und gelebtes Vorbild',
    lesson: 'Liebe zum Propheten zeigt sich in verantwortlichem Befolgen, nicht in Anbetung.',
    quranReferences: ['Quran 33:40 (Al-Ahzab)', 'Quran 21:107 (Al-Anbiya)'],
  },
];
