# Belegstellen der 25 Propheten im Quran-Text

<!-- Erzeugt von scripts/scan-quran-prophet-evidence.mjs · npm run prophets:evidence
     Nicht von Hand bearbeiten. -->

**Dies ist keine Freigabe.** Es weist eine einzige Sache nach: dass der Name
im Quran-Text vorkommt, und wo.

Durchsucht wurde der mitgelieferte Bestand — derselbe Text, den
`npm run quran:verify` Ayah für Ayah gegen `quran-uthmani` geprüft hat und den
`npm run quran-integrity:check` per sha256 sichert. Jede Stelle ist
nachschlagbar.

## Was hier nicht bewiesen wird

Was die App über einen Propheten **erzählt**. Dass „Nuh" in Sure 71 steht,
belegt nicht, dass er 950 Jahre predigte — das steht in 29:14, und dort steht
„weilte unter ihnen", nicht „predigte". Für jede erzählte Einzelheit muss die
Stelle einzeln geprüft werden, die sie trägt.

Gesucht wurde nach ganzen Wörtern mit den arabischen Vorsilben, nicht nach
Zeichenketten — sonst zählt jedes längere Wort mit, das den Namen enthält.

Die Zahlen sind **gefundene Fundstellen dieser Schreibweise**, keine Aussage
darüber, wie oft ein Prophet insgesamt im Quran erwähnt wird. Nennungen ohne
den Namen („ihr Bruder", „der Gefährte des Fisches") zählt kein Textsuchlauf
mit, und seltene Formen können durchrutschen. Nach unten ist die Zahl also
belastbar, nach oben nicht.

## Stand

- **25 von 25** Namen kommen im Quran-Text vor.
- Alle 25 wurden gefunden.
- Kontrolle: sechs Suren tragen den Namen eines Propheten als Titel. Der Scan findet jeden davon in seiner eigenen Sure, sonst bricht er ab.

---

| # | Prophet | Arabisch | Stellen | Erste Fundstelle |
| --: | --- | --- | --: | --- |
| 1 | Adam | آدم | 20 | 2:31 |
| 2 | Idris | إدريس | 2 | 19:56 |
| 3 | Nuh / Noah | نوح | 39 | 3:33 |
| 4 | Hud | هود | 9 | 2:111 |
| 5 | Salih | صالح | 42 | 2:62 |
| 6 | Ibrahim / Abraham | إبراهيم | 47 | 3:33 |
| 7 | Lut / Lot | لوط | 25 | 6:86 |
| 8 | Ismail / Ismael | إسماعيل | 12 | 2:125 |
| 9 | Ishaq / Isaak | إسحاق | 16 | 2:133 |
| 10 | Yaqub / Jakob | يعقوب | 16 | 2:132 |
| 11 | Yusuf / Josef | يوسف | 26 | 6:84 |
| 12 | Ayyub / Hiob | أيوب | 4 | 4:163 |
| 13 | Shu'ayb | شعيب | 7 | 7:85 |
| 14 | Musa / Moses | موسى | 108 | 2:51 |
| 15 | Harun / Aaron | هارون | 19 | 2:248 |
| 16 | Dhul-Kifl | ذو الكفل | 2 | 21:85 |
| 17 | Dawud / David | داود | 15 | 2:251 |
| 18 | Sulayman / Salomo | سليمان | 16 | 2:102 |
| 19 | Ilyas / Elias | إلياس | 2 | 6:85 |
| 20 | Al-Yasa / Elischa | اليسع | 2 | 6:86 |
| 21 | Yunus / Jona | يونس | 4 | 4:163 |
| 22 | Zakariyya / Zacharias | زكريا | 5 | 3:37 |
| 23 | Yahya / Johannes | يحيى | 7 | 3:39 |
| 24 | Isa / Jesus | عيسى | 21 | 2:87 |
| 25 | Muhammad | محمد | 4 | 3:144 |

---

## Einzeln

### 1. Adam · آدم

20 Fundstellen.

**2:31** — Und Er lehrte Adam die Namen alle. Hierauf legte Er sie den Engeln vor und sagte: "Teilt Mir deren Namen mit, wenn ihr wahrhaftig seid!"

Weitere: 2:34, 2:37, 3:33, 3:59, 5:27, 7:11, 7:26, 7:27, 7:31, 7:35, 7:172, 17:61, 17:70, 18:50 … (5 weitere)

Geprüft: ☐

### 2. Idris · إدريس

2 Fundstellen.

**19:56** — Und gedenke im Buch Idris'. Er war ein Wahrhaftiger und Prophet.

Weitere: 21:85

Geprüft: ☐

### 3. Nuh / Noah · نوح

39 Fundstellen.

**3:33** — Gewiß, Allah hat Adam und Nuh und die Sippe Ibrahims und die Sippe 'Imrans vor den (anderen) Weltenbewohnern auserwählt,

Weitere: 4:163, 6:84, 7:59, 7:69, 9:70, 10:71, 11:25, 11:36, 11:42, 11:45, 11:89, 14:9, 17:3, 17:17 … (24 weitere)

Geprüft: ☐

### 4. Hud · هود

> **Vorsicht beim Zählen:** هود steht auch für „Juden" (etwa 2:111). Treffer können das Volk meinen.

9 Fundstellen.

**2:111** — Und sie sagen: "Niemand wird in den (Paradies)garten eingehen außer, wer Jude oder Christ ist." Das sind ihre Wünsche. Sag: "Bringt euren Beweis vor, wenn ihr wahrhaftig seid!"

Weitere: 2:135, 2:140, 7:65, 11:50, 11:58, 11:60, 11:89, 26:124

Geprüft: ☐

### 5. Salih · صالح

> **Vorsicht beim Zählen:** صالح ist auch das gewöhnliche Wort für „rechtschaffen". Treffer können das Adjektiv meinen.

42 Fundstellen.

**2:62** — Gewiß, diejenigen, die glauben, und diejenigen, die dem Judentum angehören, und die Christen und die Säbier - wer immer an Allah und den Jüngsten Tag glaubt und rechtschaffen handelt, - die haben ihren Lohn bei ihrem Herrn, und keine Furch…

Weitere: 5:69, 7:73, 7:75, 7:189, 7:190, 9:102, 9:120, 11:46, 11:61, 11:66, 11:89, 16:97, 18:82, 18:88 … (27 weitere)

Geprüft: ☐

### 6. Ibrahim / Abraham · إبراهيم

47 Fundstellen.

**3:33** — Gewiß, Allah hat Adam und Nuh und die Sippe Ibrahims und die Sippe 'Imrans vor den (anderen) Weltenbewohnern auserwählt,

Weitere: 3:65, 3:67, 3:68, 3:84, 3:95, 3:97, 4:54, 4:125, 4:163, 6:74, 6:75, 6:83, 6:161, 9:70 … (32 weitere)

Geprüft: ☐

### 7. Lut / Lot · لوط

25 Fundstellen.

**6:86** — und lsma'il, Alyasa', Yunus und Lut: jeden (von ihnen) haben Wir vor den (anderen) Weltenbewohnern bevorzugt;

Weitere: 7:80, 11:70, 11:74, 11:77, 11:89, 15:59, 15:61, 21:71, 21:74, 22:43, 26:160, 26:161, 27:54, 27:56 … (10 weitere)

Geprüft: ☐

### 8. Ismail / Ismael · إسماعيل

12 Fundstellen.

**2:125** — Und als Wir das Haus zu einem Ort der Einkehr für die Menschen und zu einer Stätte der Sicherheit machten und (sagten): "Nehmt Ibrahims Standort als Gebetsplatz!" Und Wir verpflichteten Ibrahim und Isma'il: "Reinigt Mein Haus für diejenige…

Weitere: 2:127, 2:133, 2:136, 2:140, 3:84, 4:163, 6:86, 14:39, 19:54, 21:85, 38:48

Geprüft: ☐

### 9. Ishaq / Isaak · إسحاق

16 Fundstellen.

**2:133** — Oder wart ihr etwa Zeugen, als Ya'qub der Tod nahte? Als er zu seinen Söhnen sagte: "Wem werdet ihr nach mir dienen?" Sie sagten: "Wir werden deinem Gott und dem Gott deiner Vorväter Ibrahim, lsma'il und Ishaq dienen, als dem Einen Gott, u…

Weitere: 2:136, 2:140, 3:84, 4:163, 6:84, 11:71, 12:6, 12:38, 14:39, 19:49, 21:72, 29:27, 37:112, 37:113 … (1 weitere)

Geprüft: ☐

### 10. Yaqub / Jakob · يعقوب

16 Fundstellen.

**2:132** — Und Ibrahim befahl es seinen Söhnen an - (er) und Ya'qub: "O meine Kinder, Allah hat euch die Religion auserwählt; so sterbt denn nicht, außer (Ihm) ergeben zu sein!"

Weitere: 2:133, 2:136, 2:140, 3:84, 4:163, 6:84, 11:71, 12:6, 12:38, 12:68, 19:6, 19:49, 21:72, 29:27 … (1 weitere)

Geprüft: ☐

### 11. Yusuf / Josef · يوسف

26 Fundstellen.

**6:84** — Und Wir schenkten ihm Ishaq und Ya'qub; jeden (von ihnen) haben Wir rechtgeleitet. Und (auch) Nuh haben Wir zuvor rechtgeleitet, und aus seiner Nachkommenschaft Dawud, Sulaiman, Ayyub, Yusuf, Musa und Harun - so vergelten Wir (es) den Gute…

Weitere: 12:4, 12:7, 12:8, 12:9, 12:10, 12:11, 12:17, 12:21, 12:29, 12:46, 12:51, 12:56, 12:58, 12:69 … (11 weitere)

Geprüft: ☐

### 12. Ayyub / Hiob · أيوب

4 Fundstellen.

**4:163** — Gewiß, Wir haben dir (Offenbarung) eingegeben, wie Wir Nuh und den Propheten nach ihm (Offenbarung) eingegeben haben. Und Wir haben Ibrahim, Isma'il, Ishaq, Ya'qub, den Stämmen, "Isa, Ayyub, Yunus, Harun und Sulaiman (Offenbarung) eingegeb…

Weitere: 6:84, 21:83, 38:41

Geprüft: ☐

### 13. Shu'ayb · شعيب

7 Fundstellen.

**7:85** — Und (Wir sandten) zu Madyan ihren Bruder Su'aib. Er sagte: "O mein Volk, dient Allah! Keinen Gott habt ihr außer Ihm. Nun ist ein klarer Beweis von eurem Herrn zu euch gekommen; so gebt volles Maß und Gewicht und schmälert den Menschen nic…

Weitere: 7:90, 7:92, 11:84, 11:94, 26:177, 29:36

Geprüft: ☐

### 14. Musa / Moses · موسى

108 Fundstellen.

**2:51** — Und als Wir Uns mit Musa auf vierzig Nächte verabredeten, da nahmt ihr dann nach ihm das Kalb an, womit ihr Unrecht tatet.

Weitere: 2:53, 2:54, 2:60, 2:67, 2:87, 2:92, 2:108, 2:136, 2:246, 2:248, 3:84, 4:153, 4:164, 5:20 … (93 weitere)

Geprüft: ☐

### 15. Harun / Aaron · هارون

19 Fundstellen.

**2:248** — Und ihr Prophet sagte zu ihnen: "Das Zeichen seiner Herrschaft ist, daß die Bundeslade zu euch kommen wird; in ihr ist innere Ruhe von eurem Herrn und ein Rest von dem, was die Sippe Musas und die Sippe Haruns hinterließen, getragen von En…

Weitere: 4:163, 6:84, 7:122, 7:142, 10:75, 19:28, 19:53, 20:30, 20:70, 20:90, 21:48, 23:45, 25:35, 26:13 … (4 weitere)

Geprüft: ☐

### 16. Dhul-Kifl · ذو الكفل

> **Vorsicht beim Zählen:** ذو الكفل steht im Quran flektiert (ذَا ٱلْكِفْلِ); gesucht wurde die Grundform.

2 Fundstellen.

**21:85** — Und (auch) Isma'il und Idris und Du'1-Kifl. Jeder gehörte zu den Standhaften.

Weitere: 38:48

Geprüft: ☐

### 17. Dawud / David · داود

15 Fundstellen.

**2:251** — Und so schlugen sie sie mit Allahs Erlaubnis, und Dawud tötete Galut. Und Allah gab ihm die Herrschaft und die Weisheit und lehrte ihn von dem, was Er wollte. Und wenn nicht Allah die einen Menschen durch die anderen zurückweisen würde, ge…

Weitere: 4:163, 5:78, 6:84, 17:55, 21:78, 21:79, 27:15, 27:16, 34:10, 34:13, 38:17, 38:22, 38:24, 38:30

Geprüft: ☐

### 18. Sulayman / Salomo · سليمان

16 Fundstellen.

**2:102** — Und sie folgten dem, was die Teufel unter der Herrschaft Sulaimans (den Menschen) verlasen. Nicht Sulaiman war ungläubig, sondern die Teufel waren es, indem sie die Menschen in der Zauberei unterwiesen und in dem, was auf die (beiden) enge…

Weitere: 4:163, 6:84, 21:78, 21:79, 21:81, 27:15, 27:16, 27:17, 27:18, 27:30, 27:36, 27:44, 34:12, 38:30 … (1 weitere)

Geprüft: ☐

### 19. Ilyas / Elias · إلياس

2 Fundstellen.

**6:85** — und Zakariyya, Yahya, 'Isa und Ilyas: jeder (von ihnen) gehört zu den Rechtschaffenen;

Weitere: 37:123

Geprüft: ☐

### 20. Al-Yasa / Elischa · اليسع

2 Fundstellen.

**6:86** — und lsma'il, Alyasa', Yunus und Lut: jeden (von ihnen) haben Wir vor den (anderen) Weltenbewohnern bevorzugt;

Weitere: 38:48

Geprüft: ☐

### 21. Yunus / Jona · يونس

4 Fundstellen.

**4:163** — Gewiß, Wir haben dir (Offenbarung) eingegeben, wie Wir Nuh und den Propheten nach ihm (Offenbarung) eingegeben haben. Und Wir haben Ibrahim, Isma'il, Ishaq, Ya'qub, den Stämmen, "Isa, Ayyub, Yunus, Harun und Sulaiman (Offenbarung) eingegeb…

Weitere: 6:86, 10:98, 37:139

Geprüft: ☐

### 22. Zakariyya / Zacharias · زكريا

5 Fundstellen.

**3:37** — Da nahm ihr Herr sie auf gütigste Art an und ließ sie auf schöne Weise heranwachsen und gab sie Zakariyya zur Betreuung. Jedesmal, wenn Zakariyya zu ihr in die Zelle trat, fand er bei ihr Versorgung. Er sagte: "O Maryam, woher hast du das?…

Weitere: 3:38, 6:85, 19:2, 21:89

Geprüft: ☐

### 23. Yahya / Johannes · يحيى

> **Vorsicht beim Zählen:** يحيى ist auch die Verbform „er lebt". Treffer können das Verb meinen.

7 Fundstellen.

**3:39** — Und da riefen ihm die Engel zu, während er betend in der Zelle stand: "Allah verkündet dir Yahya, ein Wort von Allah zu bestätigen, einen Herrn, einen Keuschen und Propheten von den Rechtschaffenen."

Weitere: 6:85, 8:42, 19:7, 20:74, 21:90, 87:13

Geprüft: ☐

### 24. Isa / Jesus · عيسى

21 Fundstellen.

**2:87** — Und Wir gaben bereits Musa die Schrift und ließen nach ihm die Gesandten folgen. Und Wir gaben 'Isa, dem Sohn Maryams, die klaren Beweise und stärkten ihn mit dem Heiligen Geist. War es nicht (so), daß jedesmal, wenn euch (Juden) ein Gesan…

Weitere: 2:136, 2:253, 3:45, 3:52, 3:59, 3:84, 4:157, 4:163, 4:171, 5:46, 5:78, 5:114, 6:85, 19:34 … (6 weitere)

Geprüft: ☐

### 25. Muhammad · محمد

4 Fundstellen.

**3:144** — Und Muhammad ist doch nur ein Gesandter, vor dem schon Gesandte vorübergegangen sind. Wenn er nun stirbt oder getötet wird, werdet ihr euch (dann) auf den Fersen umkehren? Und wer sich auf den Fersen umkehrt, wird Allah keinerlei Schaden z…

Weitere: 33:40, 47:2, 48:29

Geprüft: ☐
