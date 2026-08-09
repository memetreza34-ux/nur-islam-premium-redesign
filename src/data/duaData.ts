export type DuaCategoryId =
  | 'depression_anxiety'
  | 'morning_evening'
  | 'health_healing'
  | 'forgiveness'
  | 'success_guidance'
  | 'debt_wealth'
  | 'protection'
  | 'family_parents'
  | 'sleep_wake'
  | 'anger'
  | 'daily_life'
  | 'travel_mosque'
  | 'hardship_patience';

export type DuaEntry = {
  id: string;
  categoryId: DuaCategoryId;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
};

export const DUA_CATEGORIES: Array<{ id: DuaCategoryId; title: string; shortTitle: string }> = [
  { id: 'depression_anxiety', title: 'Angst, Kummer & Trauer', shortTitle: 'Kummer' },
  { id: 'morning_evening', title: 'Morgen & Abend', shortTitle: 'Morgen/Abend' },
  { id: 'health_healing', title: 'Gesundheit & Heilung', shortTitle: 'Heilung' },
  { id: 'forgiveness', title: 'Vergebung & Reue', shortTitle: 'Vergebung' },
  { id: 'success_guidance', title: 'Erfolg & Rechtleitung', shortTitle: 'Rechtleitung' },
  { id: 'debt_wealth', title: 'Schulden & Versorgung', shortTitle: 'Versorgung' },
  { id: 'protection', title: 'Schutz', shortTitle: 'Schutz' },
  { id: 'family_parents', title: 'Familie & Eltern', shortTitle: 'Familie' },
  { id: 'sleep_wake', title: 'Schlafen & Aufwachen', shortTitle: 'Schlaf' },
  { id: 'anger', title: 'Bei Wut & Zorn', shortTitle: 'Wut' },
  { id: 'daily_life', title: 'Alltag & Gewohnheiten', shortTitle: 'Alltag' },
  { id: 'travel_mosque', title: 'Reise & Moschee', shortTitle: 'Reise' },
  { id: 'hardship_patience', title: 'Erschwernis & Geduld', shortTitle: 'Geduld' },
];

/**
 * Vollständiger Dua-Bestand der bisherigen Nur-Islam-App.
 * Arabischer Text, Transliteration, Bedeutungsangaben und Quellenhinweise
 * bleiben vor einer Veröffentlichung fachlich und redaktionell zu prüfen.
 */
export const DUAS: DuaEntry[] = [
  {
    id: 'dua_sorrow_1', categoryId: 'depression_anxiety', title: 'Bei Kummer und Trauer',
    arabic: `اللَّهُمَّ إِنِّي عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي`,
    transliteration: `Allahumma inni 'abduk, wabnu 'abdik, wabnu amatik, nasiyati biyadika, madhin fiyya hukmuk, 'adlun fiyya qada'uk, as'aluka bikulli ismin huwa lak, sammayta bihi nafsak, aw anzaltahu fi kitabik, aw 'allamtahu ahadan min khalqik, awista'tharta bihi fi 'ilmil-ghaybi 'indak, an taj'alal-Qur'ana rabi'a qalbi, wa nura sadri, wa jala'a huzni, wa dhahaba hammi.`,
    translation: `O Allah, ich bin Dein Diener, der Sohn Deines Dieners, der Sohn Deiner Dienerin. Meine Stirnlocke ist in Deiner Hand. Dein Urteil über mich wird ausgeführt und Deine Bestimmung über mich ist gerecht. Ich bitte Dich mit jedem Namen, der Dir gehört, dass Du den Quran zum Frühling meines Herzens, zum Licht meiner Brust, zur Beseitigung meiner Trauer und zum Verschwinden meines Kummers machst.`,
    source: 'Ahmad 1/391 · im Altbestand als sahih gekennzeichnet',
  },
  {
    id: 'dua_distress_2', categoryId: 'depression_anxiety', title: 'Bei schwerer Not',
    arabic: `لا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ، وَرَبُّ الْأَرْضِ، وَرَبُّ الْعَرْشِ الْكَرِيمِ`,
    transliteration: `La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.`,
    translation: `Es gibt keinen Gott außer Allah, dem Allmächtigen, dem Nachsichtigen. Es gibt keinen Gott außer Allah, dem Herrn des gewaltigen Throns. Es gibt keinen Gott außer Allah, dem Herrn der Himmel, der Erde und des edlen Throns.`,
    source: 'Sahih al-Bukhari 6346 · Sahih Muslim 2730',
  },
  {
    id: 'dua_anxiety_3', categoryId: 'depression_anxiety', title: 'Gegen Sorgen und Faulheit',
    arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ`,
    transliteration: `Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.`,
    translation: `O Allah, ich suche Zuflucht bei Dir vor Sorge und Trauer, vor Unfähigkeit und Faulheit, vor Geiz und Feigheit, vor der Last der Schulden und davor, von Menschen überwältigt zu werden.`,
    source: 'Sahih al-Bukhari 2893',
  },
  {
    id: 'dua_hardship_4', categoryId: 'depression_anxiety', title: 'Wenn etwas zu schwer fällt',
    arabic: `اللَّهُمَّ لا سَهْلَ إِلاَّ ما جَعَلْتَهُ سَهْلاً، وأنْتَ تَجْعَلُ الحَزْنَ إِذَا شِئْتَ سَهْلاً`,
    transliteration: `Allahumma la sahla illa ma ja'altahu sahlan, wa anta taj'alul-hazna idha shi'ta sahlan.`,
    translation: `O Allah, nichts ist leicht außer dem, was Du leicht machst. Und Du machst das Schwere leicht, wenn Du willst.`,
    source: 'Ibn Hibban 974 · im Altbestand als sahih gekennzeichnet',
  },
  {
    id: 'dua_mercy_5', categoryId: 'depression_anxiety', title: 'Bitte um Barmherzigkeit',
    arabic: `يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ`,
    transliteration: `Ya Hayyu ya Qayyum, birahmatika astaghith, aslih li sha'ni kullah, wa la takilni ila nafsi tarfata 'ayn.`,
    translation: `O Lebendiger, o Beständiger, durch Deine Barmherzigkeit suche ich Hilfe. Bringe alle meine Angelegenheiten in Ordnung und überlasse mich nicht mir selbst, auch nicht für einen Augenblick.`,
    source: 'Al-Hakim 1/545 · im Altbestand als sahih gekennzeichnet',
  },
  {
    id: 'dua_morning_1', categoryId: 'morning_evening', title: 'Der Meister der Vergebung',
    arabic: `اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ`,
    transliteration: `Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa ant.`,
    translation: `O Allah, Du bist mein Herr. Es gibt keinen Gott außer Dir. Du hast mich erschaffen und ich bin Dein Diener. Ich halte mich an Deinen Bund und Dein Versprechen, so gut ich kann. Ich bekenne Deine Gnade und meine Sünde. Vergib mir, denn niemand vergibt Sünden außer Dir.`,
    source: 'Sahih al-Bukhari 6306',
  },
  {
    id: 'dua_morning_2', categoryId: 'morning_evening', title: 'Schutz vor allem Übel · dreimal',
    arabic: `بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ`,
    transliteration: `Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim.`,
    translation: `Im Namen Allahs, mit dessen Namen nichts auf der Erde oder im Himmel schaden kann. Er ist der Allhörende, der Allwissende.`,
    source: 'Abu Dawud 5088 · At-Tirmidhi 3388',
  },
  {
    id: 'dua_morning_3', categoryId: 'morning_evening', title: 'Bitte um Wohlbefinden',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ`,
    transliteration: `Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah.`,
    translation: `O Allah, ich bitte Dich um Wohlbefinden im Diesseits und im Jenseits.`,
    source: 'Abu Dawud 5074',
  },
  {
    id: 'dua_healing_1', categoryId: 'health_healing', title: 'Heilung bei Krankheit',
    arabic: `اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لا شِفَاءَ إِلا شِفَاؤُكَ، شِفَاءً لا يُغَادِرُ سَقَمًا`,
    transliteration: `Allahumma Rabban-nasi, adhhibil-ba's, ishfihi wa antash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama.`,
    translation: `O Allah, Herr der Menschen, nimm das Leid hinweg. Heile, denn Du bist der Heiler. Es gibt keine Heilung außer Deiner Heilung, eine Heilung, die keine Krankheit zurücklässt.`,
    source: 'Sahih al-Bukhari 5743 · Sahih Muslim 2191',
  },
  {
    id: 'dua_pain_1', categoryId: 'health_healing', title: 'Bei Schmerzen im Körper',
    arabic: `بِسْمِ اللَّهِ (ثلاثاً) ... أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (سبعاً)`,
    transliteration: `Bismillah (dreimal). A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir (siebenmal).`,
    translation: `Im Namen Allahs, dreimal. Ich suche Zuflucht bei Allah und Seiner Macht vor dem Übel dessen, was ich spüre und wovor ich mich fürchte, siebenmal.`,
    source: 'Sahih Muslim 2202',
  },
  {
    id: 'dua_forgiveness_1', categoryId: 'forgiveness', title: 'Dua des Propheten Yunus',
    arabic: `لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ`,
    transliteration: `La ilaha illa anta subhanaka inni kuntu minaz-zalimin.`,
    translation: `Es gibt keinen Gott außer Dir. Gepriesen seist Du. Wahrlich, ich gehörte zu den Ungerechten.`,
    source: 'Quran 21:87 · At-Tirmidhi 3505',
  },
  {
    id: 'dua_forgiveness_2', categoryId: 'forgiveness', title: 'Umfassende Vergebung',
    arabic: `اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلانِيَتَهُ وَسِرَّهُ`,
    transliteration: `Allahummaghfir li dhanbi kullah, diqqahu wa jillah, wa awwalahu wa akhirah, wa 'alaniyatahu wa sirrah.`,
    translation: `O Allah, vergib mir alle meine Sünden, die kleinen und großen, die ersten und letzten, die offenen und geheimen.`,
    source: 'Sahih Muslim 483',
  },
  {
    id: 'dua_forgiveness_3', categoryId: 'forgiveness', title: 'Bitte um Vergebung',
    arabic: `أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ`,
    transliteration: `Astaghfirullaha wa atubu ilayh.`,
    translation: `Ich bitte Allah um Vergebung und kehre reuevoll zu Ihm zurück.`,
    source: 'Sahih al-Bukhari 6307',
  },
  {
    id: 'dua_success_1', categoryId: 'success_guidance', title: 'Gutes im Diesseits und Jenseits',
    arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`,
    transliteration: `Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.`,
    translation: `Unser Herr, gib uns im Diesseits Gutes und im Jenseits Gutes und bewahre uns vor der Strafe des Feuers.`,
    source: 'Quran 2:201 · Sahih al-Bukhari 4522',
  },
  {
    id: 'dua_guidance_1', categoryId: 'success_guidance', title: 'Bitte um Rechtleitung',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى`,
    transliteration: `Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina.`,
    translation: `O Allah, ich bitte Dich um Rechtleitung, Gottesfurcht, Keuschheit und Unabhängigkeit.`,
    source: 'Sahih Muslim 2721',
  },
  {
    id: 'dua_knowledge_1', categoryId: 'success_guidance', title: 'Für nützliches Wissen',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا`,
    transliteration: `Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.`,
    translation: `O Allah, ich bitte Dich um nützliches Wissen, gute Versorgung und angenommene Taten.`,
    source: 'Ibn Majah 925 · im Altbestand als sahih gekennzeichnet',
  },
  {
    id: 'dua_debt_1', categoryId: 'debt_wealth', title: 'Befreiung von Schulden',
    arabic: `اللَّهُمَّ اكْفِنِي بِحَلالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ`,
    transliteration: `Allahummak-fini bihalalika 'an haramik, wa aghnini bifadlika 'amman siwak.`,
    translation: `O Allah, genüge mir mit dem, was Du erlaubt hast, damit ich nicht brauche, was Du verboten hast, und mache mich durch Deine Huld unabhängig von allen außer Dir.`,
    source: 'At-Tirmidhi 3563 · im Altbestand als hasan gekennzeichnet',
  },
  {
    id: 'dua_provision_1', categoryId: 'debt_wealth', title: 'Bitte um Versorgung',
    arabic: `اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي، وَارْزُقْنِي`,
    transliteration: `Allahummaghfir li, warhamni, wahdini, wa 'afini, warzuqni.`,
    translation: `O Allah, vergib mir, erbarme Dich meiner, leite mich recht, gib mir Wohlbefinden und versorge mich.`,
    source: 'Sahih Muslim 2697',
  },
  {
    id: 'dua_protection_1', categoryId: 'protection', title: 'Schutz vor dem bösen Blick',
    arabic: `أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لامَّةٍ`,
    transliteration: `A'udhu bikalimatillahit-tammah, min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.`,
    translation: `Ich suche Zuflucht bei den vollkommenen Worten Allahs vor jedem Teufel, jedem schädlichen Tier und jedem bösen Blick.`,
    source: 'Sahih al-Bukhari 3371',
  },
  {
    id: 'dua_protection_2', categoryId: 'protection', title: 'Beim Verlassen des Hauses',
    arabic: `بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ`,
    transliteration: `Bismillahi, tawakkaltu 'alal-lahi, la hawla wa la quwwata illa billah.`,
    translation: `Im Namen Allahs. Ich vertraue auf Allah. Es gibt keine Macht und keine Kraft außer durch Allah.`,
    source: 'Abu Dawud 5095',
  },
  {
    id: 'dua_parents_1', categoryId: 'family_parents', title: 'Für die Eltern',
    arabic: `رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا`,
    transliteration: `Rabbir-hamhuma kama rabbayani saghira.`,
    translation: `Mein Herr, erbarme Dich ihrer, wie sie mich aufgezogen haben, als ich klein war.`,
    source: 'Quran 17:24',
  },
  {
    id: 'dua_family_1', categoryId: 'family_parents', title: 'Für rechtschaffene Nachkommen',
    arabic: `رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا`,
    transliteration: `Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama.`,
    translation: `Unser Herr, schenke uns an unseren Ehepartnern und Nachkommen Augentrost und mache uns zu einem Vorbild für die Gottesfürchtigen.`,
    source: 'Quran 25:74',
  },
  {
    id: 'dua_sleep_1', categoryId: 'sleep_wake', title: 'Vor dem Schlafen',
    arabic: `بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا`,
    transliteration: `Bismik-Allahumma amutu wa ahya.`,
    translation: `In Deinem Namen, o Allah, sterbe ich und lebe ich.`,
    source: 'Sahih al-Bukhari 6312',
  },
  {
    id: 'dua_wake_1', categoryId: 'sleep_wake', title: 'Beim Aufwachen',
    arabic: `الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ`,
    transliteration: `Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.`,
    translation: `Alles Lob gebührt Allah, Der uns lebendig gemacht hat, nachdem Er uns sterben ließ. Zu Ihm ist die Auferstehung.`,
    source: 'Sahih al-Bukhari 6312',
  },
  {
    id: 'dua_anger_1', categoryId: 'anger', title: 'Zuflucht vor dem Teufel',
    arabic: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ`,
    transliteration: `A'udhu billahi minash-shaytanir-rajim.`,
    translation: `Ich suche Zuflucht bei Allah vor dem verfluchten Satan.`,
    source: 'Sahih al-Bukhari 6115',
  },
  {
    id: 'dua_eating_before', categoryId: 'daily_life', title: 'Vor dem Essen',
    arabic: `بِسْمِ اللَّهِ`,
    transliteration: `Bismillah.`,
    translation: `Im Namen Allahs. Wenn es am Anfang vergessen wurde: Im Namen Allahs am Anfang und am Ende.`,
    source: 'Abu Dawud 3767',
  },
  {
    id: 'dua_eating_after', categoryId: 'daily_life', title: 'Nach dem Essen',
    arabic: `الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلا قُوَّةٍ`,
    transliteration: `Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.`,
    translation: `Alles Lob gebührt Allah, Der mich hiermit gespeist und es mir als Versorgung gegeben hat, ohne meine eigene Macht und Kraft.`,
    source: 'At-Tirmidhi 3458',
  },
  {
    id: 'dua_bathroom_enter', categoryId: 'daily_life', title: 'Vor dem Betreten der Toilette',
    arabic: `بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ`,
    transliteration: `Bismillahi, Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.`,
    translation: `Im Namen Allahs. O Allah, ich suche Zuflucht bei Dir vor den männlichen und weiblichen Teufeln.`,
    source: 'Sahih al-Bukhari 142',
  },
  {
    id: 'dua_bathroom_leave', categoryId: 'daily_life', title: 'Nach dem Verlassen der Toilette',
    arabic: `غُفْرَانَكَ`,
    transliteration: `Ghufranaka.`,
    translation: `Ich bitte um Deine Vergebung.`,
    source: 'Abu Dawud 30',
  },
  {
    id: 'dua_mosque_enter', categoryId: 'travel_mosque', title: 'Beim Betreten der Moschee',
    arabic: `اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ`,
    transliteration: `Allahummaf-tah li abwaba rahmatik.`,
    translation: `O Allah, öffne mir die Tore Deiner Barmherzigkeit.`,
    source: 'Sahih Muslim 713',
  },
  {
    id: 'dua_mosque_leave', categoryId: 'travel_mosque', title: 'Beim Verlassen der Moschee',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ`,
    transliteration: `Allahumma inni as'aluka min fadlik.`,
    translation: `O Allah, ich bitte Dich um Deine Huld.`,
    source: 'Sahih Muslim 713',
  },
  {
    id: 'dua_travel', categoryId: 'travel_mosque', title: 'Beim Besteigen eines Verkehrsmittels',
    arabic: `سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ`,
    transliteration: `Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.`,
    translation: `Gepriesen sei Der, Der uns dies dienstbar gemacht hat, während wir dazu nicht imstande gewesen wären. Wahrlich, zu unserem Herrn werden wir zurückkehren.`,
    source: 'Quran 43:13–14',
  },
  {
    id: 'dua_hardship_1', categoryId: 'hardship_patience', title: 'Bei einem Unglück',
    arabic: `إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي، وَأَخْلِفْ لِي خَيْرًا مِنْهَا`,
    transliteration: `Inna lillahi wa inna ilayhi raji'un, Allahumma'jurni fi musibati, wa akhlif li khayran minha.`,
    translation: `Wahrlich, wir gehören Allah und zu Ihm kehren wir zurück. O Allah, belohne mich für mein Unglück und gib mir etwas Besseres als Ersatz dafür.`,
    source: 'Sahih Muslim 918',
  },
  {
    id: 'dua_patience_1', categoryId: 'hardship_patience', title: 'Bitte um Geduld',
    arabic: `رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ`,
    transliteration: `Rabbana afrigh 'alayna sabran wa tawaffana muslimin.`,
    translation: `Unser Herr, gieße Geduld über uns aus und lass uns als Muslime sterben.`,
    source: 'Quran 7:126',
  },
];

export const DUA_BY_ID = new Map(DUAS.map((dua) => [dua.id, dua]));
export const DUA_CATEGORY_BY_ID = new Map(DUA_CATEGORIES.map((category) => [category.id, category]));
