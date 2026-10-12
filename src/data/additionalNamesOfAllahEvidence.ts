export type AdditionalNameEvidence = {
  legacyId: number;
  evidenceKind: 'quran' | 'sahih-hadith';
  source: string;
  sourceNote: string;
  auditStatus: 'source-audited-green';
};

/**
 * Individually sourced additions discovered during the strict V1 Names audit.
 *
 * These entries extend the older Quran-only audit subset without replacing the
 * public 99-name learning list. A row appears here only where the cited Quran
 * passage or sahih hadith directly attributes the relevant designation/form to
 * Allah strongly enough for the conservative source-audit threshold.
 *
 * This is evidence metadata, NOT a human scholarly `approved` flag.
 */
export const ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE: readonly AdditionalNameEvidence[] = [
  { legacyId: 14, evidenceKind: 'quran', source: 'Quran 39:5', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Ghaffar.', auditStatus: 'source-audited-green' },
  { legacyId: 15, evidenceKind: 'quran', source: 'Quran 39:4', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Qahhar.', auditStatus: 'source-audited-green' },
  { legacyId: 16, evidenceKind: 'quran', source: 'Quran 3:8', sourceNote: 'Die Dua-Anrede bezeichnet Allah direkt als Al-Wahhab.', auditStatus: 'source-audited-green' },
  { legacyId: 20, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 3451', sourceNote: 'Im Kontext von Preisentwicklung und Versorgung nennt die Überlieferung Allah ausdrücklich Al-Qabid zusammen mit Al-Basit; Einstufung: Sahih (Al-Albani). Die deutsche Angabe ist eine kurze sinngemäße Erklärung.', auditStatus: 'source-audited-green' },
  { legacyId: 21, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 3451', sourceNote: 'Im Kontext von Preisentwicklung und Versorgung nennt die Überlieferung Allah ausdrücklich Al-Basit zusammen mit Al-Qabid; Einstufung: Sahih (Al-Albani). Die deutsche Angabe ist eine kurze sinngemäße Erklärung.', auditStatus: 'source-audited-green' },
  { legacyId: 28, evidenceKind: 'sahih-hadith', source: 'Sunan Abi Dawud 4955', sourceNote: 'Die Überlieferung sagt ausdrücklich: Allah ist Al-Hakam; Einstufung: Sahih (Al-Albani).', auditStatus: 'source-audited-green' },
  { legacyId: 30, evidenceKind: 'quran', source: 'Quran 6:103; 42:19', sourceNote: '6:103 nennt Al-Latif und Al-Khabir; 42:19 beschreibt Allah als Latif gegenüber Seinen Dienern. Die sinngemäße Kurzglosse verbindet Güte und das Wissen um Verborgenes; sie ist keine körperliche oder menschliche Gefühlsbeschreibung.', auditStatus: 'source-audited-green' },
  { legacyId: 32, evidenceKind: 'quran', source: 'Quran 2:225', sourceNote: 'Der Vers bezeichnet Allah direkt als Halim, hier ohne bestimmten Artikel. Der Kontext betrifft unbeabsichtigte Eide; daraus wird keine eigene Rechtsregel abgeleitet.', auditStatus: 'source-audited-green' },
  { legacyId: 35, evidenceKind: 'quran', source: 'Quran 35:30', sourceNote: 'Der Vers bezeichnet Allah direkt als Shakur, hier ohne bestimmten Artikel. Im Kontext werden gute Taten belohnt und der Lohn aus Seiner Gunst vermehrt; die deutsche Angabe ist eine sinngemäße Kurzglosse.', auditStatus: 'source-audited-green' },

  { legacyId: 37, evidenceKind: 'quran', source: 'Quran 22:62', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Kabir.', auditStatus: 'source-audited-green' },
  { legacyId: 38, evidenceKind: 'quran', source: 'Quran 11:57', sourceNote: 'Hud bezeichnet den Herrn als Hafiz über alle Dinge, hier ohne bestimmten Artikel. Die Kurzglosse beschreibt Bewahrung.', auditStatus: 'source-audited-green' },
  { legacyId: 39, evidenceKind: 'quran', source: 'Quran 4:85', sourceNote: 'Muqit steht hier ohne bestimmten Artikel. Ibn Kathir (gekürzte Online-Fassung) nennt Überwachung, Zeugenschaft und Macht als Erklärungen. „Erhalter“ ist eine kurze sinngemäße Glosse, keine vollständige Definition.', auditStatus: 'source-audited-green' },
  { legacyId: 40, evidenceKind: 'quran', source: 'Quran 4:6; 4:86', sourceNote: 'Hasib steht in beiden Versen ohne bestimmten Artikel. 4:6 betrifft die Übergabe von Waisenvermögen; 4:86 spricht von Rechenschaft über alles. Ibn Kathir erläutert zu 4:6 Zeugenschaft, Abrechnung und Überwachung; die Kurzglosse ist sinngemäß.', auditStatus: 'source-audited-green' },
  { legacyId: 42, evidenceKind: 'quran', source: 'Quran 82:6', sourceNote: 'Der Vers bezeichnet den Herrn direkt als Al-Karim.', auditStatus: 'source-audited-green' },
  { legacyId: 43, evidenceKind: 'quran', source: 'Quran 4:1', sourceNote: 'Der Vers bezeichnet Allah als Raqib über euch, hier ohne bestimmten Artikel.', auditStatus: 'source-audited-green' },
  { legacyId: 44, evidenceKind: 'quran', source: 'Quran 11:61', sourceNote: 'Salih nennt den Herrn nahe und Mujib, hier ohne bestimmten Artikel, im Aufruf zu Vergebung und Reue. Daraus folgt keine Zusage, jeder Wunsch werde sofort erfüllt.', auditStatus: 'source-audited-green' },
  { legacyId: 45, evidenceKind: 'quran', source: 'Quran 2:115', sourceNote: 'Wasi und Alim stehen ohne bestimmten Artikel. Die Kurzglosse ist keine körperlich-räumliche Definition und keine eigene Regel zur Gebetsrichtung.', auditStatus: 'source-audited-green' },
  { legacyId: 48, evidenceKind: 'quran', source: 'Quran 11:73', sourceNote: 'Der Vers bezeichnet Allah als Hamid und Majīd (مجيد), ohne bestimmten Artikel. Diese Form unterscheidet sich von Mājid (ماجد), Eintrag 65; die vereinfachte Umschrift der Lernliste bildet diesen Unterschied nicht ab.', auditStatus: 'source-audited-green' },
  { legacyId: 50, evidenceKind: 'quran', source: 'Quran 22:17', sourceNote: 'Der Vers bezeichnet Allah als Shahid über alle Dinge, hier ohne bestimmten Artikel; gemeint ist Zeugenschaft.', auditStatus: 'source-audited-green' },
  { legacyId: 51, evidenceKind: 'quran', source: 'Quran 22:6; 22:62', sourceNote: 'Beide Stellen bezeichnen Allah ausdrücklich als Al-Haqq.', auditStatus: 'source-audited-green' },
  { legacyId: 52, evidenceKind: 'quran', source: 'Quran 3:173', sourceNote: 'Die Ayah nennt Allah ausdrücklich den besten Wakil.', auditStatus: 'source-audited-green' },
  { legacyId: 53, evidenceKind: 'quran', source: 'Quran 22:40', sourceNote: 'Qawiyy und Aziz stehen hier ohne bestimmten Artikel. Der Stärke-Beleg wird nicht als eigene Kriegs- oder Rechtsregel verwendet.', auditStatus: 'source-audited-green' },
  { legacyId: 55, evidenceKind: 'quran', source: 'Quran 42:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Waliyy und Al-Hamid.', auditStatus: 'source-audited-green' },
  { legacyId: 56, evidenceKind: 'quran', source: 'Quran 42:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Waliyy und Al-Hamid.', auditStatus: 'source-audited-green' },
  { legacyId: 60, evidenceKind: 'quran', source: 'Quran 41:39', sourceNote: 'Der Vers nennt Allah den Belebenden der Toten (Muhyi al-mawta), in einer Wortverbindung ohne bestimmten Artikel. Das ist nicht der wörtlich identische alleinstehende Listeneintrag Al-Muhyi; der Kontext verbindet das Beleben der Erde mit der Auferweckung.', auditStatus: 'source-audited-green' },

  { legacyId: 66, evidenceKind: 'quran', source: 'Quran 39:4', sourceNote: 'Der Vers bezeichnet Allah ausdrücklich als Al-Wahid.', auditStatus: 'source-audited-green' },
  { legacyId: 67, evidenceKind: 'quran', source: 'Quran 112:1', sourceNote: 'Der Vers sagt Allah ist Ahad, ohne bestimmten Artikel. Der Kontext betont Allahs Einzigkeit und Unvergleichbarkeit.', auditStatus: 'source-audited-green' },
  { legacyId: 68, evidenceKind: 'quran', source: 'Quran 112:2', sourceNote: 'Der Vers nennt Allah ausdrücklich As-Samad. Die Kurzglosse nennt Seine Unabhängigkeit und die Angewiesenheit der Schöpfung; der gekürzte Ibn-Kathir-Tafsir zu 112:1–4 erläutert weitere Vollkommenheitsnuancen.', auditStatus: 'source-audited-green' },
  { legacyId: 69, evidenceKind: 'quran', source: 'Quran 6:65', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Qadir.', auditStatus: 'source-audited-green' },
  { legacyId: 70, evidenceKind: 'quran', source: 'Quran 18:45', sourceNote: 'Der Vers bezeichnet Allah als Muqtadir über alle Dinge, ohne bestimmten Artikel. Gemeint ist umfassende Macht; der Kontext vergleicht das vergängliche diesseitige Leben mit Pflanzen.', auditStatus: 'source-audited-green' },
  { legacyId: 71, evidenceKind: 'sahih-hadith', source: 'Sahih al-Bukhari 6398', sourceNote: 'Das prophetische Dua richtet sich an Allah: „Du bist Al-Muqaddim“.', auditStatus: 'source-audited-green' },
  { legacyId: 72, evidenceKind: 'sahih-hadith', source: 'Sahih al-Bukhari 6398', sourceNote: 'Das prophetische Dua richtet sich an Allah: „Du bist Al-Mu’akhkhir“.', auditStatus: 'source-audited-green' },
  { legacyId: 78, evidenceKind: 'quran', source: 'Quran 13:9', sourceNote: 'Die Ayah nennt Allah Al-Mutaal (المتعال); das finale Ya der üblichen Listenform Al-Mutaali (المتعالي) ist im Vers nicht geschrieben. Der Kontext verbindet Erhabenheit mit Kenntnis des Verborgenen und Sichtbaren.', auditStatus: 'source-audited-green' },
  { legacyId: 79, evidenceKind: 'quran', source: 'Quran 52:28', sourceNote: 'Der Vers bezeichnet Allah direkt als Al-Barr und Ar-Rahim.', auditStatus: 'source-audited-green' },
  { legacyId: 80, evidenceKind: 'quran', source: 'Quran 2:37', sourceNote: 'Der Vers bezeichnet Allah direkt als At-Tawwab und Ar-Rahim.', auditStatus: 'source-audited-green' },

  { legacyId: 82, evidenceKind: 'quran', source: 'Quran 4:99', sourceNote: 'Der Vers bezeichnet Allah als Afuww und Ghafur, ohne bestimmten Artikel. Der Kontext betrifft Menschen, die nicht auswandern können; keine pauschale Vergebungszusage für beliebige Handlungen.', auditStatus: 'source-audited-green' },
  { legacyId: 83, evidenceKind: 'quran', source: 'Quran 3:30', sourceNote: 'Der Vers bezeichnet Allah als Ra’uf gegenüber den Dienern, ohne bestimmten Artikel. Die Glosse beschreibt besondere Güte und Barmherzigkeit, nicht eine menschliche Gefühlsreaktion.', auditStatus: 'source-audited-green' },
  { legacyId: 84, evidenceKind: 'quran', source: 'Quran 3:26', sourceNote: 'Die direkte Anrede nennt Malik al-Mulk in der Anredeform Malika. Gemeint ist umfassende Herrschaft, nicht nur ein einzelnes Königreich.', auditStatus: 'source-audited-green' },
  { legacyId: 85, evidenceKind: 'quran', source: 'Quran 55:27; 55:78', sourceNote: '55:27 enthält Dhu (ذو), 55:78 die grammatische Form Dhi (ذي), jeweils mit al-Jalal wal-Ikram. Die Listenform ist keine wortgleiche Wiedergabe beider Verse; unterschiedliche Kasus bedeuten hier keinen anderen Namen.', auditStatus: 'source-audited-green' },
  { legacyId: 87, evidenceKind: 'quran', source: 'Quran 3:9', sourceNote: 'Die Dua nennt den Herrn Jami an-nas, Versammler der Menschen am angekündigten Tag. Diese Genitivverbindung steht ohne bestimmten Artikel am Wort Jami, nicht als isolierte Listenform Al-Jami.', auditStatus: 'source-audited-green' },
  { legacyId: 88, evidenceKind: 'quran', source: 'Quran 22:64', sourceNote: 'Der Vers nennt Al-Ghaniyy und Al-Hamid. Gemeint ist auch Unabhängigkeit, nicht bloß Geldreichtum: Der gekürzte Ibn-Kathir-Tafsir zu 22:63–66 erläutert, dass Allah nichts benötigt und die Schöpfung auf Ihn angewiesen ist.', auditStatus: 'source-audited-green' },
  { legacyId: 93, evidenceKind: 'quran', source: 'Quran 24:35', sourceNote: 'Der Vers nennt Nur der Himmel und der Erde als Genitivverbindung, nicht die isolierte Listenform An-Nur. Der gekürzte Ibn-Kathir-Tafsir erläutert unter anderem Rechtleitung und Beleuchtung. Die Kurzglosse entscheidet diese Auslegungen nicht; keine Gleichsetzung Allahs mit geschaffenem, physikalischem Licht.', auditStatus: 'source-audited-green' },
  { legacyId: 94, evidenceKind: 'quran', source: 'Quran 25:31', sourceNote: 'Der Vers bezeichnet den Herrn als Hadi und Nasir, ohne bestimmten Artikel. Rechtleitung und Hilfe im Kontext der Gegner der Propheten; keine Garantie für jede persönliche Entscheidung.', auditStatus: 'source-audited-green' },
  { legacyId: 95, evidenceKind: 'quran', source: 'Quran 2:117', sourceNote: 'Der Vers nennt Badi der Himmel und der Erde als Genitivverbindung, ohne bestimmten Artikel am Wort Badi. Der gekürzte Ibn-Kathir-Tafsir erklärt Erschaffung ohne vorausgehendes Vorbild. Keine wortgleiche isolierte Listenform Al-Badi.', auditStatus: 'source-audited-green' },
] as const;

export const ADDITIONAL_NAME_EVIDENCE_BY_LEGACY_ID = new Map(
  ADDITIONAL_NAMES_OF_ALLAH_EVIDENCE.map((entry) => [entry.legacyId, entry]),
);
