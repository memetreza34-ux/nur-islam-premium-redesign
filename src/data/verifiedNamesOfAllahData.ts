export type VerifiedNameOfAllah = {
  key: string;
  legacyId: number | null;
  latin: string;
  arabic: string;
  meaning: string;
  source: string;
  sourceNote: string;
};

/**
 * Public v1 learning set for Names of Allah.
 *
 * Every entry below is explicitly present as a name/designation of Allah in
 * the cited Quran passage. This is intentionally NOT presented as "the"
 * canonical complete list of 99 names. Sahih al-Bukhari 7392 and Sahih Muslim
 * 2677a establish the virtue/report concerning 99 names but do not enumerate
 * one fixed list there.
 *
 * German meanings are short learning glosses, not exhaustive theological
 * definitions. A qualified editorial review remains required before release.
 */
export const VERIFIED_NAMES_OF_ALLAH: readonly VerifiedNameOfAllah[] = [
  { key: 'allah', legacyId: null, latin: 'Allah', arabic: 'اللَّهُ', meaning: 'Allah – der Eigenname Gottes im Islam', source: 'Quran 59:22', sourceNote: 'Der Vers nennt ausdrücklich „Allah“ und weitere Namen.' },
  { key: 'ar-rahman', legacyId: 1, latin: 'Ar-Rahman', arabic: 'الرَّحْمَنُ', meaning: 'Der Allerbarmer', source: 'Quran 59:22', sourceNote: 'Im Vers ausdrücklich als Ar-Rahman genannt.' },
  { key: 'ar-rahim', legacyId: 2, latin: 'Ar-Rahim', arabic: 'الرَّحِيمُ', meaning: 'Der Barmherzige', source: 'Quran 59:22', sourceNote: 'Im Vers ausdrücklich als Ar-Rahim genannt.' },
  { key: 'al-malik', legacyId: 3, latin: 'Al-Malik', arabic: 'الْمَلِكُ', meaning: 'Der König', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Malik genannt.' },
  { key: 'al-quddus', legacyId: 4, latin: 'Al-Quddus', arabic: 'الْقُدُّوسُ', meaning: 'Der Heilige, vollkommen Reine', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Quddus genannt.' },
  { key: 'as-salam', legacyId: 5, latin: 'As-Salam', arabic: 'السَّلَامُ', meaning: 'Der vollkommen Fehlerfreie, Quelle des Friedens', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als As-Salam genannt; deutsche Kurzfassung ist sinngemäß.' },
  { key: 'al-mumin', legacyId: 6, latin: "Al-Mu'min", arabic: 'الْمُؤْمِنُ', meaning: 'Der Sicherheit Gewährende', source: 'Quran 59:23', sourceNote: "Im Vers ausdrücklich als Al-Mu'min genannt." },
  { key: 'al-muhaymin', legacyId: 7, latin: 'Al-Muhaymin', arabic: 'الْمُهَيْمِنُ', meaning: 'Der alles Überwachende und Bewahrende', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Muhaymin genannt; deutsche Kurzfassung ist sinngemäß.' },
  { key: 'al-aziz', legacyId: 8, latin: 'Al-Aziz', arabic: 'الْعَزِيزُ', meaning: 'Der Allmächtige, Unüberwindliche', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Aziz genannt.' },
  { key: 'al-jabbar', legacyId: 9, latin: 'Al-Jabbar', arabic: 'الْجَبَّارُ', meaning: 'Der Allgewaltige', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Jabbar genannt.' },
  { key: 'al-mutakabbir', legacyId: 10, latin: 'Al-Mutakabbir', arabic: 'الْمُتَكَبِّرُ', meaning: 'Der an Größe Erhabene', source: 'Quran 59:23', sourceNote: 'Im Vers ausdrücklich als Al-Mutakabbir genannt.' },
  { key: 'al-khaliq', legacyId: 11, latin: 'Al-Khaliq', arabic: 'الْخَالِقُ', meaning: 'Der Schöpfer', source: 'Quran 59:24', sourceNote: 'Im Vers ausdrücklich als Al-Khaliq genannt.' },
  { key: 'al-bari', legacyId: 12, latin: "Al-Bari'", arabic: 'الْبَارِئُ', meaning: 'Der Hervorbringer', source: 'Quran 59:24', sourceNote: "Im Vers ausdrücklich als Al-Bari' genannt." },
  { key: 'al-musawwir', legacyId: 13, latin: 'Al-Musawwir', arabic: 'الْمُصَوِّرُ', meaning: 'Der Gestaltgeber', source: 'Quran 59:24', sourceNote: 'Im Vers ausdrücklich als Al-Musawwir genannt.' },
  { key: 'al-hakim', legacyId: 46, latin: 'Al-Hakim', arabic: 'الْحَكِيمُ', meaning: 'Der Allweise', source: 'Quran 59:24; 6:18', sourceNote: 'Der Name erscheint ausdrücklich in beiden Versen.' },
  { key: 'al-hayy', legacyId: 62, latin: 'Al-Hayy', arabic: 'الْحَيُّ', meaning: 'Der Lebendige', source: 'Quran 2:255; 3:2', sourceNote: 'In beiden Versen ausdrücklich als Al-Hayy genannt.' },
  { key: 'al-qayyum', legacyId: 63, latin: 'Al-Qayyum', arabic: 'الْقَيُّومُ', meaning: 'Der aus Sich Bestehende und alles Erhaltende', source: 'Quran 2:255; 3:2', sourceNote: 'In beiden Versen ausdrücklich als Al-Qayyum genannt; deutsche Kurzfassung ist sinngemäß.' },
  { key: 'al-aliyy', legacyId: 36, latin: "Al-'Ali", arabic: 'الْعَلِيُّ', meaning: 'Der Höchste', source: 'Quran 2:255', sourceNote: 'Am Versende ausdrücklich als Al-Aliyy genannt.' },
  { key: 'al-azim', legacyId: 33, latin: "Al-'Azim", arabic: 'الْعَظِيمُ', meaning: 'Der Gewaltige', source: 'Quran 2:255', sourceNote: 'Am Versende ausdrücklich als Al-Azim genannt.' },
  { key: 'al-awwal', legacyId: 73, latin: 'Al-Awwal', arabic: 'الْأَوَّلُ', meaning: 'Der Erste', source: 'Quran 57:3', sourceNote: 'Im Vers ausdrücklich als Al-Awwal genannt.' },
  { key: 'al-akhir', legacyId: 74, latin: 'Al-Akhir', arabic: 'الْآخِرُ', meaning: 'Der Letzte', source: 'Quran 57:3', sourceNote: 'Im Vers ausdrücklich als Al-Akhir genannt.' },
  { key: 'az-zahir', legacyId: 75, latin: 'Az-Zahir', arabic: 'الظَّاهِرُ', meaning: 'Der Offenbare', source: 'Quran 57:3', sourceNote: 'Im Vers ausdrücklich als Az-Zahir genannt; Tafsir vertieft die genaue Bedeutung.' },
  { key: 'al-batin', legacyId: 76, latin: 'Al-Batin', arabic: 'الْبَاطِنُ', meaning: 'Der Verborgene', source: 'Quran 57:3', sourceNote: 'Im Vers ausdrücklich als Al-Batin genannt; Tafsir vertieft die genaue Bedeutung.' },
  { key: 'al-ghafur', legacyId: 34, latin: 'Al-Ghafur', arabic: 'الْغَفُورُ', meaning: 'Der Allvergebende', source: 'Quran 85:14', sourceNote: 'Im Vers ausdrücklich als Al-Ghafur genannt.' },
  { key: 'al-wadud', legacyId: 47, latin: 'Al-Wadud', arabic: 'الْوَدُودُ', meaning: 'Der Liebevolle', source: 'Quran 85:14', sourceNote: 'Im Vers ausdrücklich als Al-Wadud genannt.' },
  { key: 'as-sami', legacyId: 26, latin: "As-Sami'", arabic: 'السَّمِيعُ', meaning: 'Der Allhörende', source: 'Quran 42:11', sourceNote: "Im Vers ausdrücklich als As-Sami' genannt." },
  { key: 'al-basir', legacyId: 27, latin: 'Al-Basir', arabic: 'الْبَصِيرُ', meaning: 'Der Allsehende', source: 'Quran 42:11', sourceNote: 'Im Vers ausdrücklich als Al-Basir genannt.' },
  { key: 'al-fattah', legacyId: 18, latin: 'Al-Fattah', arabic: 'الْفَتَّاحُ', meaning: 'Der Öffnende und Entscheidende', source: 'Quran 34:26', sourceNote: 'Im Vers ausdrücklich als Al-Fattah genannt; der Kontext spricht vom wahrheitsgemäßen Richten.' },
  { key: 'al-alim', legacyId: 19, latin: "Al-'Alim", arabic: 'الْعَلِيمُ', meaning: 'Der Allwissende', source: 'Quran 34:26', sourceNote: 'Im Vers ausdrücklich als Al-Alim genannt.' },
  { key: 'ar-razzaq', legacyId: 17, latin: 'Ar-Razzaq', arabic: 'الرَّزَّاقُ', meaning: 'Der Versorger', source: 'Quran 51:58', sourceNote: 'Im Vers ausdrücklich als Ar-Razzaq genannt.' },
  { key: 'al-matin', legacyId: 54, latin: 'Al-Matin', arabic: 'الْمَتِينُ', meaning: 'Der unerschütterlich Starke', source: 'Quran 51:58', sourceNote: 'Im Vers ausdrücklich als Al-Matin genannt; deutsche Kurzfassung ist sinngemäß.' },
  { key: 'al-khabir', legacyId: 31, latin: 'Al-Khabir', arabic: 'الْخَبِيرُ', meaning: 'Der Allkundige', source: 'Quran 6:18', sourceNote: 'Im Vers ausdrücklich als Al-Khabir genannt.' },
] as const;

export const VERIFIED_NAME_BY_KEY = new Map(VERIFIED_NAMES_OF_ALLAH.map((name) => [name.key, name]));
