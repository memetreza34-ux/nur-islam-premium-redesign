# Religiöses Review-Paket · v1

<!-- Generiert aus src/data. Nicht von Hand bearbeiten.
     Erzeugen: npm run review-pack:write · Prüfen: npm run review-pack:check -->

Alle Inhaltsblöcke, die vor der ersten Veröffentlichung eine dokumentierte
fachliche Freigabe brauchen. Dieses Dokument **bewertet nichts**. Es zeigt,
was die App anzeigt, worauf sie sich beruft und was eine qualifizierte Person
entscheiden muss.

**Stand: 42 von 42 Blöcken offen.**

## So wird freigegeben

Eine Freigabe ist ein Eintrag in `src/data/beginnerReview.ts`,
`src/data/learningContentReview.ts` oder `src/data/coreContentReview.ts` mit
`status: 'approved'`, einem Reviewer-Namen, einem Datum (YYYY-MM-DD) und einem
Nachweis. Ohne alle drei Felder schlägt der Release-Gate fehl.

Der Gate blockiert die Veröffentlichung, solange auch nur ein Block offen ist:

```bash
node scripts/check-v1-religious-release-approval.mjs
```

## Für jeden Block gleich zu prüfen

- Arabischer Wortlaut Zeichen für Zeichen, inklusive Vokalisierung.
- Transliteration nach einem einheitlichen Schema.
- Deutsche Wiedergabe: sagt sie nicht mehr, als die Quelle trägt?
- Quellenangabe: Sammlung, Nummer, Grad – und ob der Grad zur verwendeten Bewertung passt.
- Feste Zahlen (3×, 33×, 7×): trägt die Quelle die Zahl als notwendige Anzahl?
- Rechtsschulunterschiede: als gemeinsame Grundlage dargestellt oder als eine Position ausgegeben?
- Fehlender Kontext, der die Aussage im Alltag verschieben würde.

Diese Punkte werden unten nicht wiederholt. Dort steht nur, was für den
jeweiligen Block zusätzlich gilt.

---

## Anfängerlektionen (10)

Der Einstiegspfad für Menschen ohne Vorwissen. Was hier steht, ist für viele der erste Kontakt mit dem Thema.

### Was ist Islam?

`beginner-islam` · **pending**

**Angezeigt als:** Start · Grundlage 1 · 4 Min.

**Zusammenfassung:** Ein erster Überblick darüber, worum es im Islam geht und wie Glaube, Anbetung und gutes Handeln zusammengehören.

**Volltext, wie er im Screen erscheint:**

> Islam beschreibt die bewusste Hinwendung zu Allah und das Leben nach Seiner Rechtleitung. Für Anfänger ist wichtig: Du musst nicht alles auf einmal wissen. Die Grundlagen werden Schritt für Schritt gelernt.
>
> Glaube zeigt sich nicht nur in Wissen. Gebet, Charakter, Barmherzigkeit, Verantwortung und ehrliches Handeln gehören zum religiösen Alltag zusammen.
>
> Diese App beginnt deshalb mit gemeinsamen Grundlagen und trennt sie von Detailfragen, bei denen unterschiedliche anerkannte Auffassungen existieren können.
>

**Kernaussagen:**

- Islam verbindet Glauben, Anbetung und verantwortliches Handeln.
- Grundlagen werden Schritt für Schritt gelernt.
- Detailfragen werden von gemeinsamen Grundlagen getrennt.

**Belege laut App:**

- Quran — Sure Aal-Imran 3:19: Grundlegende Bezugstelle zum Islam als Religion vor Allah.
- Hadith — Sahih Muslim 8a – Hadith Jibril: Ordnet Islam, Iman und Ihsan in einer bekannten Grundlagenüberlieferung ein.

**Glossar:**

- **Islam** — Bezeichnung der Religion und der bewussten Hingabe an Allah.
- **Muslim** — Eine Person, die sich zum Islam bekennt.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Wer ist Allah?

`beginner-allah` · **pending**

**Angezeigt als:** Start · Grundlage 2 · 5 Min.

**Zusammenfassung:** Allah ist der eine Gott, Schöpfer und allein Anbetungswürdige. Der Quran beschreibt Seine Einzigkeit ohne Ihn mit der Schöpfung gleichzusetzen.

**Volltext, wie er im Screen erscheint:**

> Der Mittelpunkt des islamischen Glaubens ist Tawhid: Allah ist einzig und hat keinen Teilhaber. Anbetung wird deshalb allein an Ihn gerichtet.
>
> Der Quran beschreibt Allah mit vollkommenen Namen und Eigenschaften. Diese werden respektvoll aus den Offenbarungsquellen gelernt und nicht frei erfunden.
>
> Für den Einstieg reicht die klare Grundlage: Allah ist der Schöpfer, kennt Seine Schöpfung und ist nicht mit ihr gleichzusetzen.
>

**Kernaussagen:**

- Allah ist einzig und ohne Teilhaber.
- Anbetung wird allein an Allah gerichtet.
- Allah wird nicht mit der Schöpfung gleichgesetzt.

**Belege laut App:**

- Quran — Sure Al-Ikhlas 112:1–4: Beschreibt Allahs Einzigkeit und Unvergleichbarkeit.
- Quran — Sure Al-Baqara 2:255: Beschreibt unter anderem Allahs Wissen, Herrschaft und Erhaltung der Schöpfung.

**Glossar:**

- **Allah** — Arabische Bezeichnung für Gott; im Islam der eine Schöpfer und allein Anbetungswürdige.
- **Tawhid** — Die grundlegende Überzeugung von Allahs Einzigkeit.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Shahada

`beginner-shahada` · **pending**

**Angezeigt als:** Start · Grundlage 3 · 5 Min.

**Zusammenfassung:** Die Shahada fasst das grundlegende Bekenntnis des Islam zusammen: Allah allein wird angebetet und Muhammad ﷺ ist Sein Gesandter.

**Volltext, wie er im Screen erscheint:**

> Die Shahada ist das Glaubensbekenntnis. Sie wird nicht als bloßer Satz verstanden, sondern als Bekenntnis zu Allahs Einzigkeit und zur Botschaft des Propheten Muhammad ﷺ.
>
> Für jemanden, der Islam kennenlernt, ist zunächst die Bedeutung wichtiger als perfekte Aussprache. Arabische Aussprache kann anschließend in Ruhe gelernt werden.
>
> Persönliche Fragen zu einem formellen Übertritt, Zeugen oder besonderen Umständen sollten bei Bedarf mit einer vertrauenswürdigen Moschee oder qualifizierten Lehrperson geklärt werden.
>

**Kernaussagen:**

- Die Shahada bekennt Allahs Einzigkeit.
- Sie bekennt Muhammad ﷺ als Gesandten Allahs.
- Bedeutung und Aufrichtigkeit stehen vor reinem Auswendiglernen.

**Belege laut App:**

- Quran — Sure Muhammad 47:19: Bezugstelle zur Erkenntnis, dass niemand außer Allah anbetungswürdig ist.
- Quran — Sure Al-Fath 48:29: Bezeichnet Muhammad ﷺ als Gesandten Allahs.

**Glossar:**

- **Shahada** — Das islamische Glaubensbekenntnis.
- **Rasul** — Gesandter.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Prophet Muhammad ﷺ

`beginner-prophet` · **pending**

**Angezeigt als:** Start · Grundlage 4 · 6 Min.

**Zusammenfassung:** Muhammad ﷺ ist im Islam der Gesandte Allahs und der letzte Prophet. Sein Leben und seine überlieferte Lehre helfen beim Verständnis islamischer Praxis.

**Volltext, wie er im Screen erscheint:**

> Muslime beten Muhammad ﷺ nicht an. Sie folgen ihm als Propheten und Gesandten und richten die Anbetung allein an Allah.
>
> Sein Leben wird in der Seerah studiert. Überlieferungen über Aussagen, Handlungen und Bestätigungen werden in der Hadith-Wissenschaft gesammelt und geprüft.
>
> Für Anfänger ist wichtig, zwischen Verehrung und Anbetung zu unterscheiden: Respekt und Liebe zum Propheten gehören zum Glauben, Anbetung gehört Allah allein.
>

**Kernaussagen:**

- Muhammad ﷺ ist Gesandter Allahs.
- Muslime beten ihn nicht an.
- Seerah und Hadith helfen, sein Leben und seine Lehre kennenzulernen.

**Belege laut App:**

- Quran — Sure Al-Ahzab 33:40: Bezeichnet Muhammad ﷺ als Gesandten Allahs und Siegel der Propheten.
- Quran — Sure Al-Anbiya 21:107: Beschreibt seine Sendung als Barmherzigkeit für die Welten.

**Glossar:**

- **Seerah** — Die Biografie des Propheten Muhammad ﷺ.
- **Hadith** — Überlieferung über Aussagen, Handlungen oder Bestätigungen des Propheten ﷺ.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Quran, Sunnah und Hadith

`beginner-quran-sunnah` · **pending**

**Angezeigt als:** Start · Grundlage 5 · 6 Min.

**Zusammenfassung:** Der Quran ist die Offenbarung Allahs. Die Sunnah bezeichnet die prophetische Lehre und Praxis; Hadithe sind Überlieferungen, durch die vieles davon berichtet wird.

**Volltext, wie er im Screen erscheint:**

> Der Quran besteht aus Suren und einzelnen Ayat. Eine deutsche Übersetzung hilft beim Verstehen, ist aber nicht mit dem arabischen Quran-Wortlaut identisch.
>
> Die Sunnah beschreibt den überlieferten Weg des Propheten ﷺ. Hadithe besitzen unterschiedliche Überlieferungswege und Bewertungen; deshalb sollte nicht jedes Zitat aus dem Internet ungeprüft übernommen werden.
>
> Tafsir erklärt Quranverse mit sprachlichem, historischem und überlieferungsbezogenem Kontext. Eine kurze App-Erklärung ersetzt keinen vollständigen Tafsir.
>

**Kernaussagen:**

- Der Quran ist die Offenbarung Allahs.
- Übersetzung und arabischer Originalwortlaut werden getrennt.
- Hadithe brauchen nachvollziehbare Quellen und Einordnung.

**Belege laut App:**

- Quran — Sure Al-Hijr 15:9: Bezugstelle zum offenbarten Gedenken und dessen Bewahrung.
- Quran — Sure An-Nahl 16:44: Beschreibt die Aufgabe des Gesandten, den Menschen die Offenbarung zu erläutern.

**Glossar:**

- **Sure** — Ein Kapitel des Quran.
- **Ayah** — Ein Vers bzw. Zeichen innerhalb einer Sure.
- **Tafsir** — Erklärung und Auslegung des Quran.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Fünf Säulen

`beginner-five-pillars` · **pending**

**Angezeigt als:** Start · Grundlage 6 · 6 Min.

**Zusammenfassung:** Shahada, Gebet, Zakat, Fasten im Ramadan und Hajj bilden die bekannten fünf Säulen des Islam.

**Volltext, wie er im Screen erscheint:**

> Die fünf Säulen geben dem religiösen Leben eine klare Grundstruktur. Sie verbinden Glaubensbekenntnis, tägliche Anbetung, soziale Verantwortung, Fasten und Pilgerfahrt.
>
> Nicht jede Säule betrifft jede Person in jeder Situation auf identische Weise. Zakat und Hajj hängen beispielsweise von Voraussetzungen ab, die in einer Grundlagenlektion nicht individuell entschieden werden können.
>
> Für den Einstieg liegt der praktische Schwerpunkt der App zunächst auf Shahada-Verständnis, Reinheit und den fünf täglichen Pflichtgebeten.
>

**Kernaussagen:**

- Shahada
- Salah – die Pflichtgebete
- Zakat
- Fasten im Ramadan
- Hajj für diejenigen, die dazu in der Lage sind

**Belege laut App:**

- Hadith — Sahih al-Bukhari 8; Sahih Muslim 16c: Authentische Überlieferungen über die fünf Säulen des Islam.

**Glossar:**

- **Salah** — Das rituelle islamische Gebet.
- **Zakat** — Verpflichtende Abgabe unter ihren jeweiligen Voraussetzungen.
- **Hajj** — Die Pilgerfahrt nach Makkah unter ihren jeweiligen Voraussetzungen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Sechs Glaubensgrundlagen

`beginner-six-beliefs` · **pending**

**Angezeigt als:** Start · Grundlage 7 · 6 Min.

**Zusammenfassung:** Zum Iman gehören der Glaube an Allah, Seine Engel, Seine Bücher, Seine Gesandten, den Jüngsten Tag und die göttliche Bestimmung.

**Volltext, wie er im Screen erscheint:**

> Diese sechs Punkte strukturieren die grundlegende islamische Glaubenslehre. Sie werden häufig anhand des Hadith Jibril erklärt.
>
> Einzelne Themen wie die göttliche Bestimmung sind tiefgehend. Eine Anfängerlektion sollte hier Orientierung geben und Spekulationen vermeiden.
>
> Wenn du diese sechs Grundlagen benennen und grob erklären kannst, hast du ein wichtiges Fundament für spätere Aqidah-Lektionen.
>

**Kernaussagen:**

- Allah
- Engel
- Bücher/Offenbarungen
- Gesandte
- Jüngster Tag
- Göttliche Bestimmung

**Belege laut App:**

- Quran — Sure Al-Baqara 2:285: Nennt mehrere zentrale Glaubensgrundlagen.
- Hadith — Sahih Muslim 8a – Hadith Jibril: Überliefert die bekannten sechs Grundlagen des Iman.

**Glossar:**

- **Iman** — Glaube; im Grundlagenunterricht oft anhand der sechs Glaubensgrundlagen erklärt.
- **Qadr** — Die göttliche Bestimmung; ein vertieftes Glaubensthema.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Reinheit – Einstieg

`beginner-purity` · **pending**

**Angezeigt als:** Start · Grundlage 8 · 7 Min.

**Zusammenfassung:** Rituelle Reinheit gehört zur Gebetsvorbereitung. Wudu ist die Gebetswaschung; Ghusl und Tayammum betreffen besondere Situationen.

**Volltext, wie er im Screen erscheint:**

> Der Quran nennt in Sure Al-Maida 5:6 grundlegende Regeln zur Waschung vor dem Gebet und zum Tayammum. Die App erklärt Wudu zusätzlich praktisch Schritt für Schritt.
>
> Ghusl ist eine vollständige rituelle Waschung in bestimmten Situationen. Tayammum ist keine frei wählbare Alternative zu Wudu, sondern gilt nur unter seinen Voraussetzungen; Sure Al-Maida 5:6 nennt unter anderem Situationen, in denen kein Wasser gefunden wird.
>
> Details zu Krankheit, Verletzung, Menstruation, Wochenbett oder anderen persönlichen Situationen gehören in fachlich geprüfte Sonderlektionen und sollten nicht aus einer kurzen Zusammenfassung abgeleitet werden.
>

**Kernaussagen:**

- Wudu gehört zu den zentralen Gebetsvorbereitungen.
- Ghusl betrifft bestimmte Zustände, die eine vollständige Waschung erfordern.
- Tayammum besitzt eigene Voraussetzungen und ist keine beliebige Alternative zu Wudu.

**Belege laut App:**

- Quran — Sure Al-Maida 5:6: Grundlegende Bezugstelle zu Wudu, ritueller Gesamtwaschung und Tayammum.

**Glossar:**

- **Wudu** — Rituelle Gebetswaschung.
- **Ghusl** — Rituelle Ganzkörperwaschung in bestimmten Situationen.
- **Tayammum** — Rituelle Ersatzreinigung unter ihren religiösen Voraussetzungen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Gebet – Einstieg

`beginner-prayer` · **pending**

**Angezeigt als:** Start · Grundlage 9 · 7 Min.

**Zusammenfassung:** Das Gebet ist eine zentrale tägliche Anbetung. Die fünf Pflichtgebete besitzen festgelegte Zeiträume und werden in Richtung Qibla verrichtet.

**Volltext, wie er im Screen erscheint:**

> Die fünf täglichen Pflichtgebete heißen Fajr, Dhuhr, Asr, Maghrib und Isha. Sie verteilen sich über den Tag und geben dem Alltag feste Zeiten der Anbetung.
>
> Eine Rakʿah ist eine Gebetseinheit mit mehreren Positionen und Rezitationen. Die App führt jede der Pflichtgebete Rakʿah für Rakʿah durch.
>
> Berechnete Gebetszeiten können je nach Standort, Methode und lokaler Praxis leicht abweichen. Deshalb zeigt die App die verwendete Methode und empfiehlt bei Unsicherheit den lokalen Abgleich.
>

**Kernaussagen:**

- Es gibt fünf tägliche Pflichtgebete.
- Gebete besitzen festgelegte Zeiträume.
- Eine Rakʿah ist eine Gebetseinheit.
- Qibla bezeichnet die Gebetsrichtung zur Kaaba in Makkah.

**Belege laut App:**

- Quran — Sure An-Nisa 4:103: Beschreibt das Gebet als zeitlich festgelegte Pflicht.
- Hadith — Sahih al-Bukhari 7372: Nennt ausdrücklich fünf verpflichtende Gebete in Tag und Nacht.
- Hadith — Sahih al-Bukhari 528; Sahih Muslim 667: Beschreibt die Bedeutung der fünf täglichen Gebete.

**Glossar:**

- **Rakʿah** — Eine Einheit innerhalb des rituellen Gebets.
- **Qibla** — Die Gebetsrichtung zur Kaaba in Makkah.
- **Fard** — Pflicht bzw. verpflichtende Handlung im religiösen Kontext.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

### Nächste Schritte

`beginner-next-steps` · **pending**

**Angezeigt als:** Start · Grundlage 10 · 4 Min.

**Zusammenfassung:** Nach den Grundlagen geht es nicht darum, alles sofort zu beherrschen. Ein stabiler Alltag entsteht durch regelmäßiges Gebet, Quran, Dhikr, Lernen und guten Charakter.

**Volltext, wie er im Screen erscheint:**

> Beginne mit kleinen, regelmäßigen Schritten. Festige zuerst Reinheit und Gebet, lerne Al-Fatiha und kurze Suren und lies parallel die Bedeutung des Quran.
>
> Nutze Fragen als Anlass zum Lernen. Bei komplexen persönlichen Fiqh-Themen sollte eine qualifizierte Person mit vollständigem Kontext gefragt werden.
>
> Danach kannst du die Bereiche Aqidah, Fiqh, Tafsir, Seerah, Hadith und Akhlaq systematisch vertiefen.
>

**Kernaussagen:**

- Regelmäßigkeit ist wichtiger als möglichst viele Inhalte auf einmal.
- Gebet und Quran bilden einen starken täglichen Lernanker.
- Komplexe persönliche Rechtsfragen brauchen qualifizierten Kontext.

**Belege laut App:**

- Quran — Sure Taha 20:114: Enthält die Bitte, im Wissen gemehrt zu werden.
- Hadith — Sahih al-Bukhari 6465; Sahih Muslim 783b: Authentische Überlieferungen darüber, dass beständige Taten besonders geliebt sind.

**Glossar:**

- **Aqidah** — Islamische Glaubenslehre.
- **Fiqh** — Islamische Rechts- und Praxislehre.
- **Akhlaq** — Charakter und gutes Verhalten.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/beginnerLearningContent.ts`

---

## Vertiefungslektionen (18)

Aqidah, Fiqh, Tafsir, Seerah, Hadith und Akhlaq.

### Aqidah: Tawhid

`aqidah-tawhid` · **pending**

**Angezeigt als:** Aqidah · Grundlage 1 · 6 Min.

**Zusammenfassung:** Tawhid bedeutet, Allah als einzigen Schöpfer, Herrn und allein Anbetungswürdigen anzuerkennen.

**Volltext, wie er im Screen erscheint:**

> Der islamische Glaube beginnt mit der Überzeugung, dass Allah einzig ist und keinen Teilhaber hat. Alle Formen der Anbetung werden deshalb allein an Ihn gerichtet.
>
> Diese Überzeugung betrifft nicht nur Worte. Sie prägt Vertrauen, Hoffnung und Dankbarkeit und richtet das Herz auf Allah als letztliche Quelle von Hilfe und Erfolg aus, ohne erlaubte Hilfe durch Menschen zu leugnen.
>
> Die Lektion ist eine Einführung. Detaillierte theologische Begriffe sollten mit verlässlichen Lehrpersonen und anerkannten Grundlagenwerken vertieft werden.
>

**Kernaussagen:**

- Allah ist einzig und ohne Teilhaber.
- Anbetung wird allein an Allah gerichtet.
- Tawhid wirkt sich auf Vertrauen und Alltag aus.

**Belege laut App:**

- Quran — Sure Al-Ikhlas 112:1–4: Beschreibt Allahs Einzigkeit und Unvergleichbarkeit.
- Quran — Sure Al-Baqara 2:255: Betont Allahs Herrschaft, Wissen und Erhaltung der Schöpfung.

**Quizfrage:** Was beschreibt Tawhid in dieser Einführung am besten?

- **(richtig)** Allah allein anzubeten und Ihm keinen Teilhaber zuzuschreiben
- (falsch) Nur bestimmte gute Taten auszuführen
- (falsch) Eine bestimmte Sprache zu sprechen

Erklärung: Tawhid richtet Glauben und Anbetung ausschließlich auf Allah.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Aqidah: sechs Glaubensgrundlagen

`aqidah-iman` · **pending**

**Angezeigt als:** Aqidah · Grundlage 2 · 7 Min.

**Zusammenfassung:** Der Glaube umfasst Allah, Engel, Offenbarungen, Gesandte, den Jüngsten Tag und Allahs Bestimmung.

**Volltext, wie er im Screen erscheint:**

> Die Glaubensgrundlagen geben eine klare Ordnung: Der Mensch glaubt an Allah, Seine Engel, Seine Bücher, Seine Gesandten, den Jüngsten Tag und die göttliche Bestimmung.
>
> Diese Punkte gehören zusammen. Der Glaube an Offenbarung führt etwa dazu, die Botschaft der Gesandten ernst zu nehmen und Verantwortung vor Allah anzuerkennen.
>
> Fragen zur Bestimmung und menschlichen Verantwortung sind anspruchsvoll. Diese Einführung vermeidet vereinfachende Spekulationen und verweist für Details auf qualifizierten Unterricht.
>

**Kernaussagen:**

- Die sechs Grundlagen bilden eine zusammenhängende Glaubensordnung.
- Offenbarung und Gesandte vermitteln Orientierung.
- Der Jüngste Tag erinnert an Verantwortung.

**Belege laut App:**

- Quran — Sure Al-Baqara 2:285: Nennt Allah, Engel, Bücher und Gesandte.
- Hadith — Sahih Muslim 8a – Hadith Jibril: Überliefert die bekannten Grundlagen von Iman, Islam und Ihsan.

**Quizfrage:** Welcher Punkt gehört zu den sechs Glaubensgrundlagen?

- **(richtig)** Der Glaube an den Jüngsten Tag
- (falsch) Eine bestimmte Nationalität
- (falsch) Ein festgelegter Beruf

Erklärung: Der Jüngste Tag gehört ausdrücklich zu den bekannten Grundlagen des Iman.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Aqidah: Allahs Namen

`aqidah-names` · **pending**

**Angezeigt als:** Aqidah · Grundlage 3 · 6 Min.

**Zusammenfassung:** Allahs schöne Namen helfen, über Seine Barmherzigkeit, Weisheit und Größe nachzudenken.

**Volltext, wie er im Screen erscheint:**

> Der Quran ruft dazu auf, Allah mit Seinen schönen Namen anzurufen. Namen wie Ar-Rahman oder Al-Hakim weisen auf Barmherzigkeit beziehungsweise Weisheit hin.
>
> Die Namen werden nicht losgelöst vom Quran und der authentischen Überlieferung erfunden. Ihre Bedeutung wird respektvoll und ohne Vergleich mit der Schöpfung verstanden.
>
> Im Alltag kann dieses Wissen Dua und Vertrauen vertiefen: Wer Allah als barmherzig kennt, hofft auf Seine Barmherzigkeit und bemüht sich selbst um Barmherzigkeit.
>

**Kernaussagen:**

- Allahs Namen stammen aus Offenbarungsquellen.
- Sie werden ohne Vergleich mit der Schöpfung verstanden.
- Das Wissen soll Dua und Charakter beeinflussen.

**Belege laut App:**

- Quran — Sure Al-Araf 7:180: Fordert dazu auf, Allah mit Seinen schönen Namen anzurufen.
- Quran — Sure Al-Hashr 59:22–24: Nennt mehrere Namen und Eigenschaften Allahs.

**Quizfrage:** Wie sollte man mit Allahs Namen umgehen?

- **(richtig)** Sie aus Quran und authentischer Überlieferung lernen
- (falsch) Beliebige neue Namen erfinden
- (falsch) Sie nur als dekorative Begriffe betrachten

Erklärung: Die Namen werden aus den Offenbarungsquellen gelernt und sollen Glauben und Handeln prägen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Fiqh: Reinheit vor dem Gebet

`fiqh-purity` · **pending**

**Angezeigt als:** Fiqh · Praxis 1 · 7 Min.

**Zusammenfassung:** Wudu gehört zu den zentralen Vorbereitungen für das Gebet und wird in der App gesondert praktisch erklärt.

**Volltext, wie er im Screen erscheint:**

> Vor dem Pflichtgebet wird der Zustand der rituellen Reinheit geprüft. Der Quran nennt dabei die grundlegenden Körperbereiche der Gebetswaschung.
>
> Fiqh unterscheidet zwischen allgemeinen Grundlagen und Details, bei denen Rechtsschulen unterschiedliche Auffassungen vertreten können. Die App kennzeichnet solche Unterschiede, statt eine Einzelmeinung als einzige Möglichkeit darzustellen.
>
> Bei Krankheit, Verletzung oder fehlendem Wasser können besondere Regeln gelten. Solche Situationen benötigen eine verlässliche, individuell passende Auskunft.
>

**Kernaussagen:**

- Wudu ist eine zentrale Gebetsvorbereitung.
- Rechtsschulen können Details unterschiedlich einordnen.
- Sonderfälle sollten qualifiziert geklärt werden.

**Belege laut App:**

- Quran — Sure Al-Maida 5:6: Nennt Grundlagen von Wudu und Tayammum.
- App-Bereich — Wudu lernen: Interaktive Schrittfolge mit sichtbarem Rechtsschulhinweis.

**Quizfrage:** Was ist bei unterschiedlichen Fiqh-Details wichtig?

- **(richtig)** Unterschiede transparent kennzeichnen
- (falsch) Jede andere Auffassung abwerten
- (falsch) Sonderfälle ohne Wissen selbst entscheiden

Erklärung: Ein verantwortlicher Lernbereich macht anerkannte Unterschiede sichtbar und verweist bei Sonderfällen an Fachkundige.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Fiqh: Gebetszeiten

`fiqh-prayer-time` · **pending**

**Angezeigt als:** Fiqh · Praxis 2 · 6 Min.

**Zusammenfassung:** Jedes Pflichtgebet besitzt einen bestimmten Zeitrahmen; berechnete App-Zeiten sollten lokal abgeglichen werden.

**Volltext, wie er im Screen erscheint:**

> Der Quran beschreibt das Gebet als Verpflichtung zu festgelegten Zeiten. Deshalb ist nicht nur die Anzahl, sondern auch der Zeitrahmen wichtig.
>
> Digitale Zeiten werden aus Standort, astronomischen Daten und einer Berechnungsmethode ermittelt. Verschiedene Methoden können besonders bei Fajr, Isha und Asr abweichen.
>
> Die App zeigt Methode und Asr-Auswahl sichtbar an und empfiehlt bei Unsicherheit den Abgleich mit einer örtlichen Moschee oder einem verlässlichen Kalender.
>

**Kernaussagen:**

- Pflichtgebete haben festgelegte Zeitrahmen.
- Berechnungsmethoden können Unterschiede erzeugen.
- Lokaler Abgleich bleibt wichtig.

**Belege laut App:**

- Quran — Sure An-Nisa 4:103: Beschreibt das Gebet als zeitlich festgelegte Pflicht.
- App-Bereich — Gebetszeiten: Zeigt Standort, Methode, Asr-Auswahl und Datenstatus.

**Quizfrage:** Warum können zwei Gebetskalender leicht abweichen?

- **(richtig)** Wegen unterschiedlicher Berechnungsmethoden und lokaler Einstellungen
- (falsch) Weil Gebetszeiten frei erfunden werden
- (falsch) Weil der Wochentag keine Rolle spielt

Erklärung: Standort, Methode und lokale Anpassungen können zu abweichenden berechneten Zeiten führen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Fiqh: Wann man nachfragen sollte

`fiqh-asking` · **pending**

**Angezeigt als:** Fiqh · Praxis 3 · 5 Min.

**Zusammenfassung:** Nicht jede individuelle Situation lässt sich durch eine allgemeine App-Lektion sicher beantworten.

**Volltext, wie er im Screen erscheint:**

> Fiqh wendet Offenbarungsquellen und juristische Methoden auf konkrete Handlungen an. Persönliche Umstände können die Einordnung verändern.
>
> Bei Ehe, Scheidung, Erbrecht, Finanzverträgen, Krankheit oder komplizierten Gebetsfragen reicht eine allgemeine Zusammenfassung häufig nicht aus.
>
> Ein verantwortlicher Umgang bedeutet, Unsicherheit zuzugeben und eine vertrauenswürdige, qualifizierte Person mit den vollständigen Umständen zu fragen.
>

**Kernaussagen:**

- Individuelle Umstände können die Antwort verändern.
- Komplexe Rechtsfragen brauchen vollständigen Kontext.
- Unsicherheit sollte klar benannt werden.

**Belege laut App:**

- Quran — Sure An-Nahl 16:43: Verweist bei fehlendem Wissen auf kundige Personen.
- Quran — Sure Al-Isra 17:36: Warnt davor, etwas ohne Wissen zu verfolgen.

**Quizfrage:** Was ist bei einer komplexen persönlichen Fiqh-Frage am sichersten?

- **(richtig)** Die vollständigen Umstände einer qualifizierten Person schildern
- (falsch) Nur einen kurzen Social-Media-Clip verwenden
- (falsch) Unsicherheit verbergen

Erklärung: Komplexe Einzelfälle benötigen Kontext und qualifizierte Einordnung.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Tafsir: Al-Fatiha

`tafsir-fatiha` · **pending**

**Angezeigt als:** Tafsir · Sure 1 · 8 Min.

**Zusammenfassung:** Al-Fatiha verbindet Lob Allahs, Barmherzigkeit, Verantwortung und die Bitte um den geraden Weg.

**Volltext, wie er im Screen erscheint:**

> Al-Fatiha eröffnet den Quran und ist ein zentraler Bestandteil des rituellen Gebets. Wie ihre Rezitation für einzelne Betende im Gemeinschaftsgebet eingeordnet wird, wird im Fiqh unterschiedlich behandelt. Ihre Themen führen vom Lob Allahs zur bewussten Anbetung und zur Bitte um Führung.
>
> Die Sure erinnert an Allahs Barmherzigkeit und an den Tag der Abrechnung. Dadurch verbindet sie Hoffnung mit Verantwortung.
>
> Diese Lektion fasst zentrale Themen sinngemäß zusammen. Sie ersetzt keinen vollständigen Tafsir und keine sprachliche Analyse des arabischen Textes.
>

**Kernaussagen:**

- Al-Fatiha beginnt mit Lob Allahs.
- Anbetung und Bitte um Hilfe werden verbunden.
- Die Sure enthält die Bitte um Führung.

**Belege laut App:**

- Quran — Sure Al-Fatiha 1:1–7: Primärtext der Lektion.
- Hadith — Sahih al-Bukhari 756: Belegt die zentrale Bedeutung von Al-Fatiha im Gebet; Detailfragen zum Gemeinschaftsgebet werden fiqhlich unterschiedlich eingeordnet.
- Hinweis — Sinngemäße Themenübersicht: Keine vollständige Übersetzung oder umfassende Tafsir-Auslegung.

**Quizfrage:** Welche Bitte steht im Zentrum von Al-Fatiha?

- **(richtig)** Die Bitte um Führung auf den geraden Weg
- (falsch) Die Bitte um materiellen Reichtum
- (falsch) Die Bitte um eine bestimmte Sprache

Erklärung: Al-Fatiha enthält ausdrücklich die Bitte um Führung.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Tafsir: Al-Ikhlas

`tafsir-ikhlas` · **pending**

**Angezeigt als:** Tafsir · Sure 112 · 6 Min.

**Zusammenfassung:** Die kurze Sure fasst zentrale Aussagen über Allahs Einzigkeit und Unvergleichbarkeit zusammen.

**Volltext, wie er im Screen erscheint:**

> Al-Ikhlas erklärt, dass Allah einer ist, nennt Ihn As-Samad und erklärt, dass Ihm nichts ebenbürtig ist. As-Samad wird in Erklärungen unter anderem mit Allahs vollkommener Unabhängigkeit und der Abhängigkeit der Schöpfung von Ihm verbunden. Die Sure weist Vorstellungen zurück, die Allah menschliche Abstammung zuschreiben.
>
> Die Sure ist kurz, enthält aber eine grundlegende Glaubensaussage. Deshalb sollte sie nicht nur auswendig gelernt, sondern auch in ihrer Bedeutung verstanden werden.
>
> Die deutsche Darstellung in der App wird als sinngemäße Bedeutung gekennzeichnet. Der arabische Qurantext bleibt der Offenbarungstext.
>

**Kernaussagen:**

- Allah ist einzig.
- Allah wird in der Sure As-Samad genannt.
- Nichts ist Ihm ebenbürtig.

**Belege laut App:**

- Quran — Sure Al-Ikhlas 112:1–4: Primärtext der Lektion.
- App-Bereich — Quran-Reader · Sure 112: Arabischer Text und gekennzeichnete sinngemäße Bedeutung.

**Quizfrage:** Welche Aussage passt zu Al-Ikhlas?

- **(richtig)** Nichts ist Allah ebenbürtig
- (falsch) Allah ist Teil der Schöpfung
- (falsch) Allah benötigt Unterstützung

Erklärung: Die Sure betont ausdrücklich Allahs Einzigkeit und Unvergleichbarkeit.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Tafsir: verantwortungsvoll lesen

`tafsir-method` · **pending**

**Angezeigt als:** Tafsir · Methode · 7 Min.

**Zusammenfassung:** Quran-Erklärung berücksichtigt Sprache, Kontext, andere Verse und authentische Überlieferungen.

**Volltext, wie er im Screen erscheint:**

> Ein einzelner übersetzter Satz reicht nicht immer aus, um einen Vers vollständig zu verstehen. Wortgebrauch, Zusammenhang und Offenbarungskontext können wichtig sein.
>
> Seriöser Tafsir vergleicht Verse miteinander und berücksichtigt authentische Erklärungen aus der prophetischen Überlieferung sowie die Arbeit qualifizierter Gelehrter.
>
> Die App trennt daher Qurantext, sinngemäße Bedeutung und erklärenden Kommentar sichtbar voneinander.
>

**Kernaussagen:**

- Kontext und Sprache sind wichtig.
- Verse werden nicht isoliert gegeneinander ausgespielt.
- Text, Bedeutung und Kommentar müssen getrennt erkennbar sein.

**Belege laut App:**

- Quran — Sure Muhammad 47:24: Ruft zur reflektierten Beschäftigung mit dem Quran auf.
- Quran — Sure An-Nahl 16:44: Nennt die erklärende Aufgabe des Gesandten.

**Quizfrage:** Was gehört zu einem verantwortlichen Tafsir-Umgang?

- **(richtig)** Kontext und weitere Offenbarungsquellen berücksichtigen
- (falsch) Nur einen isolierten übersetzten Satz verwenden
- (falsch) Kommentar als Qurantext ausgeben

Erklärung: Tafsir benötigt Kontext und eine klare Trennung zwischen Offenbarungstext und Erklärung.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Seerah: Beginn der Offenbarung

`seerah-revelation` · **pending**

**Angezeigt als:** Seerah · Mekka 1 · 7 Min.

**Zusammenfassung:** Die ersten offenbarten Verse rufen zum Lesen im Namen Allahs auf und markieren den Beginn der Sendung.

**Volltext, wie er im Screen erscheint:**

> Die prophetische Sendung begann in Mekka. Die ersten Verse der Sure Al-Alaq verbinden Lesen, Wissen und die Anerkennung Allahs als Schöpfer.
>
> Andere mekkanische Quranstellen betonen zudem Verantwortung gegenüber Bedürftigen und Schwachen. Die frühe Verkündigung traf auf Widerstand; genaue historische Ursachen und Entwicklungen sollten aus belastbaren Seerah-Quellen gelernt werden.
>
> Seerah wird aus Quran, authentischen Hadithen und kritisch eingeordneten historischen Berichten gelernt. Nicht jede populäre Erzählung besitzt dieselbe Belegstärke.
>

**Kernaussagen:**

- Die Offenbarung begann in Mekka.
- Die ersten Verse verbinden Wissen und Glauben.
- Seerah-Berichte besitzen unterschiedliche Belegstärken.

**Belege laut App:**

- Quran — Sure Al-Alaq 96:1–5: Die bekannten ersten offenbarten Verse.
- Hadith — Sahih al-Bukhari 3: Bericht über den Beginn der Offenbarung.
- Quran — Sure Al-Balad 90:12–17: Mekkanische Verse über Hilfe für Bedürftige, Glauben, Geduld und Barmherzigkeit.

**Quizfrage:** Welches Thema erscheint in den ersten Versen der Offenbarung?

- **(richtig)** Lesen und Wissen im Namen Allahs
- (falsch) Handelspreise in Medina
- (falsch) Die Anzahl der Gebetszeiten im Detail

Erklärung: Die ersten Verse der Sure Al-Alaq beginnen mit dem Auftrag zu lesen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Seerah: Hijra

`seerah-hijra` · **pending**

**Angezeigt als:** Seerah · Übergang · 8 Min.

**Zusammenfassung:** Die Auswanderung war kein bloßer Ortswechsel, sondern der Beginn einer neuen gemeinschaftlichen Phase.

**Volltext, wie er im Screen erscheint:**

> Nach zunehmender Verfolgung verließen der Prophet und die Muslime Mekka. Die Hijra nach Medina wurde zu einem Wendepunkt der islamischen Geschichte.
>
> Der Quran erinnert an Allahs Unterstützung während der Flucht. Gleichzeitig zeigt die Seerah sorgfältige Planung, Vertrauen und verantwortliches Handeln.
>
> In Medina wurden Gemeinschaft, gegenseitige Pflichten und Regeln des Zusammenlebens weiter aufgebaut. Einzelne historische Vertragsdetails sollten aus geprüften Werken gelernt werden.
>

**Kernaussagen:**

- Die Hijra war ein Wendepunkt.
- Vertrauen auf Allah schließt Planung nicht aus.
- In Medina entstand eine neue Gemeinschaftsordnung.

**Belege laut App:**

- Quran — Sure At-Tawba 9:40: Erinnert an die Flucht und Allahs Beistand.
- Quran — Sure Al-Hashr 59:8–9: Würdigt Auswanderer und Helfer.

**Quizfrage:** Welche Lehre zeigt die Hijra besonders?

- **(richtig)** Vertrauen auf Allah und sorgfältige Planung gehören zusammen
- (falsch) Planung widerspricht Vertrauen
- (falsch) Gemeinschaftliche Verantwortung ist unwichtig

Erklärung: Die Seerah zeigt sowohl Tawakkul als auch umsichtiges Handeln.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Seerah: Prophet als Vorbild

`seerah-example` · **pending**

**Angezeigt als:** Seerah · Alltag · 6 Min.

**Zusammenfassung:** Seerah wird nicht nur als Chronologie gelernt, sondern als Quelle für Charakter, Geduld und verantwortliche Führung.

**Volltext, wie er im Screen erscheint:**

> Der Quran beschreibt den Gesandten Allahs als gutes Vorbild für Menschen, die auf Allah und den Jüngsten Tag hoffen.
>
> Sein Vorbild umfasst Gottesdienst, Familie, Verträge, Barmherzigkeit, Geduld und den Umgang mit Gegnern. Einzelne Ereignisse müssen im historischen Zusammenhang verstanden werden.
>
> Ein praktischer Seerah-Unterricht fragt deshalb: Welche zuverlässige Lehre lässt sich aus einem Ereignis ableiten, ohne den Kontext zu verkürzen?
>

**Kernaussagen:**

- Seerah verbindet Geschichte und Charakterbildung.
- Ereignisse brauchen historischen Kontext.
- Lehren sollen zuverlässig und praktisch sein.

**Belege laut App:**

- Quran — Sure Al-Ahzab 33:21: Bezeichnet den Gesandten als gutes Vorbild.
- Quran — Sure Al-Qalam 68:4: Würdigt seinen hervorragenden Charakter.

**Quizfrage:** Wie sollte Seerah gelernt werden?

- **(richtig)** Mit Quellen, Kontext und praktischen Charakterlehren
- (falsch) Nur als Sammlung dramatischer Geschichten
- (falsch) Ohne zwischen starken und schwachen Berichten zu unterscheiden

Erklärung: Verantwortliches Seerah-Lernen verbindet belegte Geschichte mit Kontext und Nutzen.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Hadith: Grundlagen

`hadith-basics` · **pending**

**Angezeigt als:** Hadith · Grundlage 1 · 7 Min.

**Zusammenfassung:** Hadithe überliefern Aussagen, Handlungen und Bestätigungen des Propheten und werden nach festen Kriterien geprüft.

**Volltext, wie er im Screen erscheint:**

> Ein Hadith besteht vereinfacht aus einer Überliefererkette und einem berichteten Inhalt. Hadithwissenschaft untersucht beide Bereiche.
>
> Nicht jede zugeschriebene Aussage ist authentisch. Einstufungen wie sahih oder daif beruhen auf der Prüfung von Überlieferern, Verbindungen und Inhalt.
>
> Die App sollte deshalb keine unbelegte Aussage als prophetischen Wortlaut darstellen und bei paraphrasierten Texten ausdrücklich „sinngemäß“ schreiben.
>

**Kernaussagen:**

- Hadithe besitzen Überliefererkette und Inhalt.
- Authentizität wird geprüft.
- Sinngemäße Wiedergaben müssen gekennzeichnet werden.

**Belege laut App:**

- Quran — Sure Al-Hujurat 49:6: Betont die Prüfung von Nachrichten.
- App-Prinzip — Quellenkennzeichnung: Hadithnummer und Sammlung werden sichtbar angegeben.

**Quizfrage:** Warum darf nicht jede verbreitete Aussage sofort als Hadith gelten?

- **(richtig)** Weil Überlieferung und Inhalt geprüft werden müssen
- (falsch) Weil Hadithe grundsätzlich keine Quellen haben
- (falsch) Weil nur moderne Texte zählen

Erklärung: Hadithwissenschaft bewertet die Zuverlässigkeit einer Überlieferung anhand festgelegter Kriterien.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Hadith: Absichten

`hadith-intention` · **pending**

**Angezeigt als:** Hadith · Grundlage 2 · 6 Min.

**Zusammenfassung:** Der bekannte Hadith über die Absicht zeigt, dass das innere Ziel einer Handlung religiöse Bedeutung besitzt.

**Volltext, wie er im Screen erscheint:**

> Der Hadith wird sinngemäß so verstanden, dass Handlungen entsprechend den Absichten bewertet werden und jeder Mensch das erhält, was er beabsichtigt hat.
>
> Eine gute Absicht allein macht eine ansonsten verbotene Handlung nicht automatisch erlaubt. Ob Mittel und Handlung erlaubt sind, muss unabhängig von der guten Absicht geprüft werden.
>
> Praktisch hilft eine kurze innere Prüfung: Warum tue ich das, und kann ich meine Absicht aufrichtig auf Allah ausrichten?
>

**Kernaussagen:**

- Die Absicht gibt der Handlung Richtung.
- Eine gute Absicht macht Verbotenes nicht automatisch erlaubt.
- Absichten können bewusst erneuert werden.

**Belege laut App:**

- Hadith — Sahih al-Bukhari 1: Bekannter Hadith über Handlungen und Absichten.
- Hadith — Sahih Muslim 1907: Parallele authentische Überlieferung zum Thema Absicht.

**Quizfrage:** Was folgt aus dem Hadith über die Absicht?

- **(richtig)** Die Absicht ist wichtig, macht aber nicht automatisch jede Handlung erlaubt
- (falsch) Eine gute Absicht macht jede Handlung erlaubt
- (falsch) Nur sichtbare Ergebnisse zählen

Erklärung: Aufrichtigkeit ist zentral; die Erlaubtheit einer Handlung muss dennoch eigenständig beurteilt werden.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Hadith: sicher weitergeben

`hadith-verification` · **pending**

**Angezeigt als:** Hadith · Grundlage 3 · 5 Min.

**Zusammenfassung:** Vor dem Teilen sollte geprüft werden, ob Sammlung, Nummer, Einstufung und Wortlaut nachvollziehbar sind.

**Volltext, wie er im Screen erscheint:**

> Kurze Bilder und Videos verbreiten häufig Aussagen ohne Quelle. Ein verantwortlicher Nutzer sucht mindestens nach Sammlung, Nummer und einer nachvollziehbaren Einstufung.
>
> Übersetzungen können voneinander abweichen. Deshalb sollte zwischen arabischem Wortlaut, Übersetzung und eigener Zusammenfassung unterschieden werden.
>
> Kann eine Aussage nicht geprüft werden, ist es besser, sie nicht dem Propheten zuzuschreiben und die Unsicherheit offen zu benennen.
>

**Kernaussagen:**

- Sammlung und Nummer prüfen.
- Übersetzung und Zusammenfassung trennen.
- Ungeprüfte Zuschreibungen nicht weiterverbreiten.

**Belege laut App:**

- Quran — Sure Al-Hujurat 49:6: Grundsatz der Nachrichtenprüfung.
- Quran — Sure Al-Isra 17:36: Warnt vor Aussagen ohne Wissen.

**Quizfrage:** Was sollte vor dem Teilen eines Hadith-Bildes geprüft werden?

- **(richtig)** Quelle, Nummer und nachvollziehbare Einstufung
- (falsch) Nur das Design
- (falsch) Nur die Anzahl der Likes

Erklärung: Eine nachvollziehbare Quelle ist wichtiger als Reichweite oder Gestaltung.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Akhlaq: Aufrichtigkeit

`akhlaq-sincerity` · **pending**

**Angezeigt als:** Akhlaq · Charakter 1 · 6 Min.

**Zusammenfassung:** Aufrichtigkeit richtet gute Taten auf Allah aus und hilft, Selbstdarstellung zu kontrollieren.

**Volltext, wie er im Screen erscheint:**

> Aufrichtigkeit bedeutet, eine gute Tat nicht nur für Anerkennung, Status oder Lob auszuführen. Die Absicht wird auf Allah ausgerichtet.
>
> Menschen können gemischte Motive haben. Deshalb ist Aufrichtigkeit kein einmaliger Zustand, sondern eine regelmäßige innere Korrektur.
>
> Bei manchen guten Taten – etwa freiwilliger Wohltätigkeit – kann bewusstes Verbergen vor Selbstdarstellung schützen. Vor und nach einer Handlung kann außerdem die eigene Absicht geprüft werden.
>

**Kernaussagen:**

- Gute Taten werden auf Allah ausgerichtet.
- Absichten können gemischt sein und brauchen Korrektur.
- Verborgene gute Taten können in bestimmten Situationen Aufrichtigkeit fördern.

**Belege laut App:**

- Quran — Sure Al-Bayyina 98:5: Verbindet Gottesdienst mit aufrichtiger Hingabe.
- Hadith — Sahih al-Bukhari 1: Grundlage zur Bedeutung der Absicht.
- Quran — Sure Al-Baqara 2:271: Nennt verborgen gegebene Almosen in diesem Zusammenhang als besser.

**Quizfrage:** Welche Gewohnheit kann Aufrichtigkeit fördern?

- **(richtig)** Die Absicht regelmäßig prüfen
- (falsch) Jede gute Tat öffentlich machen
- (falsch) Nur auf Lob achten

Erklärung: Die bewusste Prüfung und Erneuerung der Absicht stärkt Aufrichtigkeit.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Akhlaq: Geduld

`akhlaq-patience` · **pending**

**Angezeigt als:** Akhlaq · Charakter 2 · 6 Min.

**Zusammenfassung:** Geduld zeigt sich unter anderem in Standhaftigkeit im Guten, Selbstkontrolle und Ruhe in Prüfungen.

**Volltext, wie er im Screen erscheint:**

> Sabr wird oft nur als passives Warten verstanden. Im islamischen Charakter umfasst Geduld auch Standhaftigkeit und Selbstkontrolle.
>
> Geduld schließt angemessenes Handeln nicht aus. Man darf Hilfe suchen, Grenzen setzen und Ungerechtigkeit auf erlaubte Weise ansprechen.
>
> Eine praktische Übung ist die kurze Pause vor einer Reaktion: atmen, Worte prüfen und eine Antwort wählen, die nicht zusätzlich schadet.
>

**Kernaussagen:**

- Geduld ist mehr als passives Warten.
- Hilfe suchen und Grenzen setzen können mit Geduld vereinbar sein.
- Selbstkontrolle schützt vor schädlichen Reaktionen.

**Belege laut App:**

- Quran — Sure Al-Baqara 2:153: Verbindet Geduld, Gebet und Allahs Beistand.
- Quran — Sure Aal Imran 3:134: Lobt Menschen, die Zorn zurückhalten und vergeben.

**Quizfrage:** Was bedeutet Geduld hier?

- **(richtig)** Standhaft bleiben und Reaktionen kontrollieren
- (falsch) Jede Ungerechtigkeit schweigend akzeptieren
- (falsch) Nie Hilfe suchen

Erklärung: Geduld bedeutet nicht automatisch Passivität; sie schließt kontrolliertes und erlaubtes Handeln nicht aus.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

### Akhlaq: Barmherzigkeit und Respekt

`akhlaq-mercy` · **pending**

**Angezeigt als:** Akhlaq · Charakter 3 · 7 Min.

**Zusammenfassung:** Guter Charakter zeigt sich in Sprache, Vergebung, Hilfe und dem Schutz der Würde anderer.

**Volltext, wie er im Screen erscheint:**

> Der Quran verbindet Gerechtigkeit mit Güte und warnt vor Spott, Beleidigung, übler Nachrede und unbegründetem Misstrauen.
>
> Barmherzigkeit bedeutet nicht, jedes Verhalten gutzuheißen. Kritik kann notwendig sein, soll aber wahr, verhältnismäßig und frei von Demütigung bleiben.
>
> Im digitalen Alltag gilt derselbe Maßstab: keine Beschämung, keine ungeprüften Anschuldigungen und keine Weitergabe privater Fehler zur Unterhaltung.
>

**Kernaussagen:**

- Würde und Gerechtigkeit gehören zusammen.
- Kritik darf nicht zur Demütigung werden.
- Auch online gelten islamische Charakterregeln.

**Belege laut App:**

- Quran — Sure An-Nahl 16:90: Gebietet Gerechtigkeit und Güte.
- Quran — Sure Al-Hujurat 49:11–12: Warnt vor Spott, Verdächtigung und übler Nachrede.

**Quizfrage:** Wie sieht verantwortliche Kritik aus?

- **(richtig)** Wahr, angemessen und ohne Demütigung
- (falsch) Öffentlich möglichst verletzend
- (falsch) Auf ungeprüfte Gerüchte gestützt

Erklärung: Gerechtigkeit und Barmherzigkeit verlangen klare, aber respektvolle Kritik.

**Zu entscheiden:** Stimmen Aussagen, Belege und Zuordnung? Ist die Vereinfachung für Anfänger zulässig oder verkürzt sie sinnentstellend?

**Datei:** `src/data/islamicLearningContent.ts`

---

## Religiöse Kernbereiche (14)

Funktionen, deren Inhalt religiös trägt: Quran, Namen, Duas, Dhikr, Gebet, Kalender.

### Offline-Quran: Text, Übersetzung, Provenienz und Lizenz

`quran-offline-bundle` · **pending**

**Technisch bereits geprüft (keine fachliche Aussage):**

- Arabisch: 6236/6236 Ayat identisch mit quran-uthmani.
- Deutsch: 6236/6236 Ayat identisch mit de.aburida (Abu Rida).
- 114 Suren, kufische Zählung, sha256-Manifest über alle 229 Dateien.

**Zu entscheiden:**

- Ist die deutsche Übersetzung von Abu Rida für diese App die richtige Wahl?
- Ist die Darstellung im Reader (Arabisch + Übersetzung + Quellenhinweis) angemessen?
- Genügt der Hinweis, dass die Übersetzung eine Bedeutungswiedergabe und kein Ersatz für den arabischen Text ist?

**Zusätzlich blockiert:** Lizenz/Nutzungsrecht für arabische Edition und Übersetzung sind ungeklärt. Siehe docs/QURAN-PROVENANCE.md.

**Dateien:** `public/data/quran/**`, `src/services/quranService.ts`, `docs/QURAN-PROVENANCE.md`

---

### Quran für Anfänger

`quran-beginner-guide` · **pending**

**Zu entscheiden:**

- Sind die Begriffserklärungen (Sure, Ayah, Juz, Manzil) korrekt und anfängergerecht?
- Ist die Anleitung zum Umgang mit dem Quran (Reinheit, Haltung, Rezitation) vollständig genug, ohne zu belehren?

**Dateien:** `src/screens/QuranBeginnerGuideScreen.tsx`

---

### Anfänger-FAQ und Islam A–Z

`beginner-reference` · **pending**

**Zu entscheiden:**

- Sind FAQ-Antworten und Islam-A–Z-Einträge inhaltlich korrekt?
- Werden Fragen, bei denen anerkannte Unterschiede bestehen, als solche kenntlich gemacht?

**Dateien:** `src/screens/BeginnerReferenceScreen.tsx`

---

### Ghusl & Tayammum Grundlagen

`purity-basics` · **pending**

**Zu entscheiden:**

- Ghusl: Pflichtteile und empfohlene Teile korrekt getrennt?
- Tayammum: Voraussetzungen und Ablauf korrekt, inklusive der Fälle, in denen es zulässig ist?
- Wird deutlich, wann eine konkrete Frage an eine örtliche Autorität gehört?

**Dateien:** `src/screens/PurityBasicsScreen.tsx`

---

### Namen Allahs · vollständige 99er-Lernliste mit laufender Einzelbeleg-Prüfung

`names-of-allah` · **pending**

**Umfang:** 99 Lernnamen sichtbar. 31 davon sind auf einen eigenen quellenbelegten Eintrag gemappt, 68 brauchen diese Einzelprüfung noch. Der belegte Bestand enthält 32 Einträge, darunter „Allah“ ohne Legacy-Zuordnung.

**Zu entscheiden:**

- Je Name: Arabisch, Transliteration, deutsche Kurzbedeutung.
- Je Name: Einzelbeleg aus Quran oder authentischem Hadith.
- Abgeleitete oder umstrittene Namen als solche kennzeichnen.
- Al-Majid (الْمَجِيدُ) und Al-Majid (الْمَاجِدُ) unterscheiden sich; die Transliteration darf sie nicht gleichsetzen.
- Die App darf keine bestimmte 99er-Reihenfolge als die einzige authentische Liste ausgeben.

**Dateien:** `src/data/namesOfAllahData.ts`, `src/data/verifiedNamesOfAllahData.ts`, `src/screens/NamesScreen.tsx`

<details><summary>Die 99 Lernnamen und ihr Belegstand</summary>

| # | Latein | Arabisch | Bedeutung laut App | Einzelbeleg |
| --- | --- | --- | --- | --- |
| 1 | Ar-Rahman | الرَّحْمَنُ | Der Allerbarmer | Quran 59:22 |
| 2 | Ar-Rahim | الرَّحِيمُ | Der Barmherzige | Quran 59:22 |
| 3 | Al-Malik | الْمَلِكُ | Der König | Quran 59:23 |
| 4 | Al-Quddus | الْقُدُّوسُ | Der Heilige | Quran 59:23 |
| 5 | As-Salam | السَّلَامُ | Der Friedensspender | Quran 59:23 |
| 6 | Al-Mu'min | الْمُؤْمِنُ | Der Sicherheit Gewährende | Quran 59:23 |
| 7 | Al-Muhaymin | الْمُهَيْمِنُ | Der Beschützer | Quran 59:23 |
| 8 | Al-Aziz | الْعَزِيزُ | Der Allmächtige | Quran 59:23 |
| 9 | Al-Jabbar | الْجَبَّارُ | Der Bezwinger | Quran 59:23 |
| 10 | Al-Mutakabbir | الْمُتَكَبِّرُ | Der Erhabene über alle Größe | Quran 59:23 |
| 11 | Al-Khaliq | الْخَالِقُ | Der Schöpfer | Quran 59:24 |
| 12 | Al-Bari' | الْبَارِئُ | Der Erschaffer | Quran 59:24 |
| 13 | Al-Musawwir | الْمُصَوِّرُ | Der Formgeber | Quran 59:24 |
| 14 | Al-Ghaffar | الْغَفَّارُ | Der Allverzeihende | **offen** |
| 15 | Al-Qahhar | الْقَهَّارُ | Der Bezwinger | **offen** |
| 16 | Al-Wahhab | الْوَهَّابُ | Der Geber | **offen** |
| 17 | Ar-Razzaq | الرَّزَّاقُ | Der Versorger | Quran 51:58 |
| 18 | Al-Fattah | الْفَتَّاحُ | Der Öffner | Quran 34:26 |
| 19 | Al-'Alim | الْعَلِيمُ | Der Allwissende | Quran 34:26 |
| 20 | Al-Qabid | الْقَابِضُ | Der Zurückhaltende | **offen** |
| 21 | Al-Basit | الْبَاسِطُ | Der Gewährende | **offen** |
| 22 | Al-Khafid | الْخَافِضُ | Der Erniedrigende | **offen** |
| 23 | Ar-Rafi' | الرَّافِعُ | Der Erhöhende | **offen** |
| 24 | Al-Mu'izz | الْمُعِزُّ | Der Ehrende | **offen** |
| 25 | Al-Mudhill | الْمُذِلُّ | Der Demütigende | **offen** |
| 26 | As-Sami' | السَّمِيعُ | Der Allhörende | Quran 42:11 |
| 27 | Al-Basir | الْبَصِيرُ | Der Allsehende | Quran 42:11 |
| 28 | Al-Hakam | الْحَكَمُ | Der Richter | **offen** |
| 29 | Al-'Adl | الْعَدْلُ | Der Gerechte | **offen** |
| 30 | Al-Latif | اللَّطِيفُ | Der Gütige und Feinfühlige | **offen** |
| 31 | Al-Khabir | الْخَبِيرُ | Der Allkundige | Quran 6:18 |
| 32 | Al-Halim | الْحَلِيمُ | Der Nachsichtige | **offen** |
| 33 | Al-'Azim | الْعَظِيمُ | Der Großartige | Quran 2:255 |
| 34 | Al-Ghafur | الْغَفُورُ | Der Allvergebende | Quran 85:14 |
| 35 | Ash-Shakur | الشَّكُورُ | Der Dank Anerkennende | **offen** |
| 36 | Al-'Ali | الْعَلِيُّ | Der Erhabene | Quran 2:255 |
| 37 | Al-Kabir | الْكَبِيرُ | Der Große | **offen** |
| 38 | Al-Hafiz | الْحَفِيظُ | Der Bewahrer | **offen** |
| 39 | Al-Muqit | الْمُقِيتُ | Der Erhalter | **offen** |
| 40 | Al-Hasib | الْحَسِيبُ | Der Berechner | **offen** |
| 41 | Al-Jalil | الْجَلِيلُ | Der Majestätische | **offen** |
| 42 | Al-Karim | الْكَرِيمُ | Der Großzügige | **offen** |
| 43 | Ar-Raqib | الرَّقِيبُ | Der Wachsame | **offen** |
| 44 | Al-Mujib | الْمُجِيبُ | Der Erhörende | **offen** |
| 45 | Al-Wasi' | الْوَاسِعُ | Der Allumfassende | **offen** |
| 46 | Al-Hakim | الْحَكِيمُ | Der Weise | Quran 59:24; 6:18 |
| 47 | Al-Wadud | الْوَدُودُ | Der Liebevolle | Quran 85:14 |
| 48 | Al-Majid | الْمَجِيدُ | Der Ruhmreiche | **offen** |
| 49 | Al-Ba'ith | الْبَاعِثُ | Der Auferwecker | **offen** |
| 50 | Ash-Shahid | الشَّهِيدُ | Der Zeuge | **offen** |
| 51 | Al-Haqq | الْحَقُّ | Die Wahrheit | **offen** |
| 52 | Al-Wakil | الْوَكِيلُ | Der Sachwalter | **offen** |
| 53 | Al-Qawiyy | الْقَوِيُّ | Der Starke | **offen** |
| 54 | Al-Matin | الْمَتِينُ | Der Feste | Quran 51:58 |
| 55 | Al-Waliyy | الْوَلِيُّ | Der Schutzherr | **offen** |
| 56 | Al-Hamid | الْحَمِيدُ | Der Preiswürdige | **offen** |
| 57 | Al-Muhsi | الْمُحْصِي | Der alles Erfassende | **offen** |
| 58 | Al-Mubdi' | الْمُبْدِئُ | Der Urheber | **offen** |
| 59 | Al-Mu'id | الْمُعِيدُ | Der Wiederhersteller | **offen** |
| 60 | Al-Muhyi | الْمُحْيِي | Der Lebensspender | **offen** |
| 61 | Al-Mumit | الْمُمِيتُ | Der den Tod Bestimmende | **offen** |
| 62 | Al-Hayy | الْحَيُّ | Der Lebendige | Quran 2:255; 3:2 |
| 63 | Al-Qayyum | الْقَيُّومُ | Der Beständige | Quran 2:255; 3:2 |
| 64 | Al-Wajid | الْوَاجِدُ | Der Findende | **offen** |
| 65 | Al-Majid | الْمَاجِدُ | Der Edle | **offen** |
| 66 | Al-Wahid | الْوَاحِدُ | Der Eine | **offen** |
| 67 | Al-Ahad | الْأَحَدُ | Der Einzige | **offen** |
| 68 | As-Samad | الصَّمَدُ | Der Unabhängige | **offen** |
| 69 | Al-Qadir | الْقَادِرُ | Der Mächtige | **offen** |
| 70 | Al-Muqtadir | الْمُقْتَدِرُ | Der alles Bestimmende | **offen** |
| 71 | Al-Muqaddim | الْمُقَدِّمُ | Der Voranstellende | **offen** |
| 72 | Al-Mu'akhkhir | الْمُؤَخِّرُ | Der Aufschiebende | **offen** |
| 73 | Al-Awwal | الْأَوَّلُ | Der Erste | Quran 57:3 |
| 74 | Al-Akhir | الْآخِرُ | Der Letzte | Quran 57:3 |
| 75 | Az-Zahir | الظَّاهِرُ | Der Offenbare | Quran 57:3 |
| 76 | Al-Batin | الْبَاطِنُ | Der Verborgene | Quran 57:3 |
| 77 | Al-Wali | الْوَالِي | Der Regierende | **offen** |
| 78 | Al-Muta'ali | الْمُتَعَالِي | Der Höchsterhabene | **offen** |
| 79 | Al-Barr | الْبَرُّ | Der Gütige | **offen** |
| 80 | At-Tawwab | التَّوَّابُ | Der Reue Annehmende | **offen** |
| 81 | Al-Muntaqim | الْمُنْتَقِمُ | Der Vergelter | **offen** |
| 82 | Al-'Afuww | الْعَفُوُّ | Der Verzeihende | **offen** |
| 83 | Ar-Ra'uf | الرَّؤُوفُ | Der Mitleidige | **offen** |
| 84 | Malik-ul-Mulk | مَالِكُ الْمُلْكِ | Der Herrscher über das Königreich | **offen** |
| 85 | Dhul-Jalali wal-Ikram | ذُو الْجَلَالِ وَالْإِكْرَامِ | Der Herr der Majestät und Ehre | **offen** |
| 86 | Al-Muqsit | الْمُقْسِطُ | Der gerecht Handelnde | **offen** |
| 87 | Al-Jami' | الْجَامِعُ | Der Versammelnde | **offen** |
| 88 | Al-Ghaniyy | الْغَنِيُّ | Der Reiche | **offen** |
| 89 | Al-Mughni | الْمُغْنِي | Der Bereicherer | **offen** |
| 90 | Al-Mani' | الْمَانِعُ | Der Verhinderer | **offen** |
| 91 | Ad-Darr | الضَّارُّ | Der Schaden Bestimmende | **offen** |
| 92 | An-Nafi' | النَّافِعُ | Der Nutzen Gewährende | **offen** |
| 93 | An-Nur | النُّورُ | Das Licht | **offen** |
| 94 | Al-Hadi | الْهَادِي | Der Leitende | **offen** |
| 95 | Al-Badi' | الْبَدِيعُ | Der unvergleichliche Schöpfer | **offen** |
| 96 | Al-Baqi | الْبَاقِي | Der Ewigbleibende | **offen** |
| 97 | Al-Warith | الْوَارِثُ | Der Erbe | **offen** |
| 98 | Ar-Rashid | الرَّشِيدُ | Der Richtungsweisende | **offen** |
| 99 | As-Sabur | الصَّبُورُ | Der Geduldige | **offen** |

</details>

---

### Dhikr-Zählertexte

`dhikr-counter-steps` · **pending**

**Umfang:** 3 Routinen mit zusammen 8 einzelnen Formeln.

**Zu entscheiden:**

- Je Formel: Arabisch, Transliteration, Bedeutung, Beleg.
- Wiederholungszahlen: trägt der Beleg die Zahl?

**Dateien:** `src/data/dhikrData.ts`, `src/screens/DhikrScreen.tsx`

<details><summary>Alle Dhikr-Formeln mit Wiederholungszahl</summary>

| Routine | Formel | Arabisch | Bedeutung | Wiederholungen | Quelle der Routine |
| --- | --- | --- | --- | --- | --- |
| Dhikr nach dem Gebet | SubhanAllah | سُبْحَانَ اللَّهِ | Allah ist frei von jedem Mangel. | 33 | Sahih Muslim 597a |
| Dhikr nach dem Gebet | Alhamdulillah | الْحَمْدُ لِلَّهِ | Alles Lob gebührt Allah. | 33 | Sahih Muslim 597a |
| Dhikr nach dem Gebet | Allahu Akbar | اللَّهُ أَكْبَرُ | Allah ist größer als alles. | 33 | Sahih Muslim 597a |
| Dhikr nach dem Gebet | La ilaha illa Allah wahdahu la sharika lah | لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ | Niemand hat das Recht, angebetet zu werden, außer Allah allein. Ihm gehören Herrschaft und Lob, und Er hat Macht über alle Dinge. | 1 | Sahih Muslim 597a |
| Dhikr am Morgen | SubhanAllahi wa bihamdihi, adada khalqihi … | سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ | Allah sei gepriesen und gelobt – entsprechend der Zahl Seiner Schöpfung, Seinem Wohlgefallen, dem Gewicht Seines Thrones und der Tinte Seiner Worte. | 3 | Sahih Muslim 2726a |
| Dhikr vor dem Schlafen | SubhanAllah | سُبْحَانَ اللَّهِ | Allah ist frei von jedem Mangel. | 33 | Sahih al-Bukhari 3113; Sahih al-Bukhari 5361 |
| Dhikr vor dem Schlafen | Alhamdulillah | الْحَمْدُ لِلَّهِ | Alles Lob gebührt Allah. | 33 | Sahih al-Bukhari 3113; Sahih al-Bukhari 5361 |
| Dhikr vor dem Schlafen | Allahu Akbar | اللَّهُ أَكْبَرُ | Allah ist größer als alles. | 34 | Sahih al-Bukhari 3113; Sahih al-Bukhari 5361 |

</details>

---

### Dhikr-Routinen

`dhikr-routines` · **pending**

**Umfang:** 3 Routinen.

**Zu entscheiden:**

- Sind die Routinen als überlieferte Praxis belegt oder als Vorschlag der App gekennzeichnet?
- Werden Tagesziele nicht als religiös vorgeschriebene Zahl dargestellt?

**Dateien:** `src/data/dhikrData.ts`

---

### Dua-Bestand

`duas` · **pending**

**Umfang:** 34 sichtbare Duas, 34 davon mit Eintrag im Quellen-Audit.

**Zu entscheiden:**

- Je Dua: Arabisch, Transliteration, Bedeutung, Referenz, Grad, Anlass.
- Varianten als Varianten kennzeichnen.

**Dateien:** `src/data/duaData.ts`, `src/data/duaSourceAudit.ts`, `src/screens/DuasScreen.tsx`

<details><summary>Alle Duas mit Quellenstand</summary>

| # | Titel | Quelle laut App | Audit-Status | Nachweis im Audit |
| --- | --- | --- | --- | --- |
| 1 | Bei Kummer und Trauer | Ahmad 1/391 · Hisn al-Muslim 120 · dort als authentisch nach Al-Albani angegeben | secondary-authentication-checked | Ahmad 1/391; Hisn al-Muslim 120 |
| 2 | Bei schwerer Not | Sahih al-Bukhari 6346 · Sahih Muslim 2730a | primary-checked | Sahih al-Bukhari 6346; Sahih Muslim 2730a |
| 3 | Gegen Sorgen und Faulheit | Sahih al-Bukhari 2893 | primary-checked | Sahih al-Bukhari 2893 |
| 4 | Wenn etwas zu schwer fällt | Sahih Ibn Hibban 2427 · Hisn al-Muslim 139 · dort als authentisch angegeben | secondary-authentication-checked | Sahih Ibn Hibban 2427; Hisn al-Muslim 139 |
| 5 | Bitte um Barmherzigkeit | Al-Hakim 1/545 · Hisn al-Muslim 88 · Kette dort als sahih angegeben | secondary-authentication-checked | Al-Hakim 1/545; Hisn al-Muslim 88 |
| 6 | Der Meister der Vergebung | Sahih al-Bukhari 6306 | primary-checked | Sahih al-Bukhari 6306 |
| 7 | Schutz vor allem Übel · dreimal | Sunan Abi Dawud 5088 · Jami at-Tirmidhi 3388 | primary-checked | Sunan Abi Dawud 5088; Jami at-Tirmidhi 3388 |
| 8 | Bitte um Wohlbefinden · Auszug | Sunan Abi Dawud 5074 · Auszug aus einer längeren Morgen-/Abend-Dua | primary-checked | Sunan Abi Dawud 5074 |
| 9 | Heilung bei Krankheit | Sahih al-Bukhari 5743 · Sahih Muslim 2191 | primary-checked | Sahih al-Bukhari 5743; Sahih Muslim 2191 |
| 10 | Bei Schmerzen im Körper | Sahih Muslim 2202 | primary-checked | Sahih Muslim 2202 |
| 11 | Dua des Propheten Yunus | Quran 21:87 · Jami at-Tirmidhi 3505 (sahih, Darussalam) | primary-checked | Quran 21:87; Jami at-Tirmidhi 3505 |
| 12 | Umfassende Vergebung | Sahih Muslim 483 | primary-checked | Sahih Muslim 483 |
| 13 | Bitte um Vergebung | Sahih al-Bukhari 6307 | primary-checked | Sahih al-Bukhari 6307 |
| 14 | Gutes im Diesseits und Jenseits | Quran 2:201 · Sahih al-Bukhari 4522 | primary-checked | Quran 2:201; Sahih al-Bukhari 4522 |
| 15 | Bitte um Rechtleitung | Sahih Muslim 2721a | primary-checked | Sahih Muslim 2721a |
| 16 | Für nützliches Wissen | Sunan Ibn Majah 925 · sahih (Darussalam) | primary-checked | Sunan Ibn Majah 925 |
| 17 | Befreiung von Schulden | Jami at-Tirmidhi 3563 · hasan (Darussalam) | primary-checked | Jami at-Tirmidhi 3563 |
| 18 | Bitte um Versorgung | Sahih Muslim 2697b | primary-checked | Sahih Muslim 2697b |
| 19 | Schutz vor dem bösen Blick | Sahih al-Bukhari 3371 | primary-checked | Sahih al-Bukhari 3371 |
| 20 | Beim Verlassen des Hauses | Sunan Abi Dawud 5095 · sahih (Al-Albani) | primary-checked | Sunan Abi Dawud 5095 |
| 21 | Für die Eltern | Quran 17:24 | primary-checked | Quran 17:24 |
| 22 | Für rechtschaffene Nachkommen | Quran 25:74 | primary-checked | Quran 25:74 |
| 23 | Vor dem Schlafen | Sahih al-Bukhari 6312 | primary-checked | Sahih al-Bukhari 6312 |
| 24 | Beim Aufwachen | Sahih al-Bukhari 6312 | primary-checked | Sahih al-Bukhari 6312 |
| 25 | Zuflucht vor dem Teufel | Sahih al-Bukhari 6115 | primary-checked | Sahih al-Bukhari 6115 |
| 26 | Vor dem Essen | Sunan Abi Dawud 3767 · sahih (Al-Albani) | primary-checked | Sunan Abi Dawud 3767 |
| 27 | Nach dem Essen | Jami at-Tirmidhi 3458 · hasan (Darussalam) | primary-checked | Jami at-Tirmidhi 3458 |
| 28 | Vor dem Betreten der Toilette | Sahih al-Bukhari 142 | primary-checked | Sahih al-Bukhari 142 |
| 29 | Nach dem Verlassen der Toilette | Sunan Abi Dawud 30 · sahih (Al-Albani) | primary-checked | Sunan Abi Dawud 30 |
| 30 | Beim Betreten der Moschee | Sahih Muslim 713a | primary-checked | Sahih Muslim 713a |
| 31 | Beim Verlassen der Moschee | Sahih Muslim 713a | primary-checked | Sahih Muslim 713a |
| 32 | Beim Besteigen eines Verkehrsmittels | Quran 43:13–14 | primary-checked | Quran 43:13–14 |
| 33 | Bei einem Unglück | Sahih Muslim 918b | primary-checked | Sahih Muslim 918b |
| 34 | Bitte um Geduld | Quran 7:126 | primary-checked | Quran 7:126 |

</details>

---

### Hadith des Tages

`daily-hadith-rotation` · **pending**

**Umfang:** 7 Hadithe im Tagespool, aus einer Bibliothek von 25. Nur der Pool wird täglich ausgespielt.

**Zu entscheiden:**

- Passt jede Nummer zum gezeigten Inhalt?
- Ist die sinngemäße Zusammenfassung nicht stärker als das Original?
- Ist der Tagespool als Ganzes für eine tägliche Ausspielung geeignet?

**Dateien:** `src/data/hadithData.ts`, `src/screens/DailyHadithScreen.tsx`

<details><summary>Tagespool und übrige Bibliothek</summary>

**Im Tagespool:**

| ID | Titel | Sinngemäße Zusammenfassung | Quelle |
| --- | --- | --- | --- |
| `intentions` | Absichten | Sinngemäßer Inhalt: Der Wert einer Handlung hängt von der Absicht ab. | Sahih al-Bukhari 1; Sahih Muslim 1907 |
| `mercy` | Barmherzigkeit | Sinngemäßer Inhalt: Wer anderen keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt. | Sahih al-Bukhari 6013; Sahih Muslim 2319a |
| `good-word` | Ein gutes Wort | Sinngemäßer Inhalt: Auch ein gutes Wort gilt als Wohltätigkeit. | Sahih al-Bukhari 2989; Sahih Muslim 1009 |
| `anger` | Selbstbeherrschung | Sinngemäßer Inhalt: Wirkliche Stärke zeigt sich darin, sich im Zorn zu beherrschen. | Sahih al-Bukhari 6114; Sahih Muslim 2609 |
| `brother` | Für den anderen wünschen | Sinngemäßer Inhalt: Vollständiger Glaube schließt ein, für andere das Gute zu wünschen, das man für sich selbst wünscht. | Sahih al-Bukhari 13; Sahih Muslim 45 |
| `ease` | Erleichtern | Sinngemäßer Inhalt: Erleichtert und erschwert nicht; gebt frohe Botschaft und schreckt nicht ab. | Sahih al-Bukhari 69; Sahih Muslim 1734 |
| `cleanliness` | Reinheit | Sinngemäßer Inhalt: Reinheit besitzt im Glauben einen hohen Stellenwert. | Sahih Muslim 223 |

**Nicht im Tagespool, aber in der Bibliothek:**

| ID | Titel | Quelle |
| --- | --- | --- |
| `smile` | Freundlichkeit | Jami at-Tirmidhi 1956 |
| `die-taten-sind-entsprechend` | Absicht der Taten | Sahih al-Bukhari 1; Sahih Muslim 1907a |
| `der-beste-unter-euch` | Quran lernen und lehren | Sahih al-Bukhari 5027 |
| `ein-muslim-ist-derjenige` | Zunge und Hand | Sahih al-Bukhari 10 |
| `wer-an-allah-und` | Gutes sprechen oder schweigen | Sahih al-Bukhari 6018; Sahih Muslim 47b |
| `allah-ist-barmherzig-gegenuber` | Barmherzigkeit auf der Erde | Jami at-Tirmidhi 1924 |
| `der-islam-ist-auf` | Die fünf Säulen | Sahih al-Bukhari 8; Sahih Muslim 16c |
| `keiner-von-euch-glaubt` | Für den Bruder wünschen | Sahih al-Bukhari 13; Sahih Muslim 45a |
| `die-religion-ist-aufrichtiger` | Aufrichtiger Rat | Sahih Muslim 55a |
| `es-gehort-zum-guten` | Was einen nichts angeht | Jami at-Tirmidhi 2317 · auf Sunnah.com/Darussalam als Da’if eingestuft |
| `die-reinheit-ist-die` | Reinheit | Sahih Muslim 223 |
| `erleichtert-und-erschwert-nicht` | Erleichtern statt erschweren | Sahih al-Bukhari 69; Sahih Muslim 1734 |
| `der-starke-glaubige-ist` | Der starke Gläubige | Sahih Muslim 2664 |
| `furchte-allah-wo-immer` | Gottesfurcht im Alltag | Jami at-Tirmidhi 1987 · Hasan (Darussalam) |
| `die-allah-liebsten-taten` | Beständigkeit | Sahih al-Bukhari 6465; Sahih Muslim 783b |
| `wer-einen-weg-beschreitet` | Wissen suchen | Sahih Muslim 2699a |
| `dein-lacheln-deinem-bruder` | Das Lächeln als Sadaqa | Jami at-Tirmidhi 1956 · Hasan (Darussalam) |
| `der-beste-von-euch` | Umgang mit der Familie | Jami at-Tirmidhi 3895 · Sahih (Darussalam) |

</details>

---

### Wudu-/Salah-Anleitungen

`worship-guides` · **pending**

**Umfang:** 5 Anleitungen mit zusammen 12 Schritten.

**Zu entscheiden:**

- Wudu und Salah: Pflicht, Sunnah und Empfehlung sauber getrennt?
- Keine einzelne Handhaltung oder Fingerbewegung als alternativlos dargestellt?

**Dateien:** `src/data/worshipGuideData.ts`, `src/screens/ReferenceReadingScreens.tsx`

<details><summary>Alle Anleitungsschritte</summary>

**Wudu (Gebetswaschung)** — Wudu ist die rituelle Gebetswaschung. Quran 5:6 nennt die grundlegenden zu waschenden bzw. zu streichenden Körperbereiche; authentische Hadithe beschreiben ausführlichere prophetische Wudu-Abläufe.

| # | Schritt | Beschreibung |
| --- | --- | --- |
| 1 | Absicht | Beabsichtige im Herzen, Wudu zu vollziehen. Die Absicht ist keine auswendig zu sprechende Formel. |
| 2 | Hände waschen | Wasche zu Beginn die Hände. In authentischen Beschreibungen des prophetischen Wudu ist dreimaliges Waschen überliefert. |
| 3 | Mund und Nase reinigen | Spüle den Mund und reinige die Nase mit Wasser. In authentischen Wudu-Beschreibungen ist dies mehrfach überliefert. |
| 4 | Gesicht waschen | Wasche das Gesicht vollständig. Quran 5:6 nennt das Waschen des Gesichts ausdrücklich; dreimaliges Waschen ist in authentischen Wudu-Beschreibungen überliefert. |
| 5 | Arme bis zu den Ellenbogen waschen | Wasche die Arme einschließlich der Ellenbogen. Quran 5:6 nennt diesen Bereich ausdrücklich. Die überlieferten Wudu-Beschreibungen zeigen unterschiedliche zulässige Wiederholungszahlen. |
| 6 | Über den Kopf streichen | Streiche mit feuchten Händen über den Kopf. Quran 5:6 nennt das Streichen über den Kopf; die genaue Ausführung wird in den Rechtsschulen in Details unterschiedlich beschrieben. |
| 7 | Füße bis zu den Knöcheln waschen | Wasche die Füße einschließlich der Knöchel. Quran 5:6 nennt diesen Bereich ausdrücklich. |
| 8 | Shahada nach dem Wudu | Nach vollständig ausgeführtem Wudu ist die folgende Shahada authentisch in Sahih Muslim 234a/234b überliefert: |

**Salah (Gebet)** — Für den Gebetsablauf nutzt Nur Islam den separaten Rakʿah-für-Rakʿah-Kurs. Diese ältere Kurzfassung wird nicht mehr als zweite verbindliche Anleitung angezeigt.

| # | Schritt | Beschreibung |
| --- | --- | --- |
| 1 | Zum Gebetskurs wechseln | Nutze den Bereich „Beten lernen“. Dort werden die fünf Pflichtgebete einzeln gezeigt und Rechtsschul-Unterschiede ausdrücklich gekennzeichnet. |

**Wortlaut im Gebet** — Arabische Gebetstexte werden im Rakʿah-für-Rakʿah-Kurs an der jeweiligen Position gezeigt. Diese alte Doppelliste wird nicht mehr als eigenständige verbindliche Fassung verwendet.

| # | Schritt | Beschreibung |
| --- | --- | --- |
| 1 | Geprüften Lernpfad verwenden | Öffne den Gebetskurs für Takbir, Al-Fatiha, Ruku, Sujud, Tashahhud, Salawat und Taslim im jeweiligen Ablauf. |

**Pflichtteile & Grundlagen** — Die genaue juristische Einteilung in Säulen, Pflichten und Sunnah-Handlungen ist nicht in allen Rechtsschulen identisch. Deshalb zeigt die App hier bis zum fachlichen Review keine universelle Liste.

| # | Schritt | Beschreibung |
| --- | --- | --- |
| 1 | Rechtsschul-Unterschiede beachten | Für die verbindliche Einordnung dessen, was bei Vergessen oder Auslassen das Gebet ungültig macht oder wie es ausgeglichen wird, ist die jeweilige Rechtsschule bzw. eine qualifizierte Lehrperson maßgeblich. |

**Häufige Fehler** — Allgemeine Lernhinweise dürfen nicht mit rechtlichen Urteilen über Gültigkeit verwechselt werden. Die frühere Liste enthielt solche Vermischungen und ist deshalb bis zum Fachreview zurückgenommen.

| # | Schritt | Beschreibung |
| --- | --- | --- |
| 1 | Sicherer Grundsatz | Bete mit Ruhe und folge einer verlässlichen Lernmethode. Wenn du unsicher bist, ob ein konkreter Fehler das Gebet beeinflusst, frage mit vollständigem Kontext eine qualifizierte Lehrperson. |

</details>

---

### Rakʿah-für-Rakʿah-Gebetsablauf

`prayer-rakat-sequence` · **pending**

**Umfang:** 5 Gebete mit zusammen 151 beschriebenen Schritten.

**Zu entscheiden:**

- Je gesprochenem Text: Arabisch, Transliteration, Bedeutung, Beleg.
- Rakʿah-Zahlen je Gebet korrekt.
- Unterschiede zwischen Rechtsschulen im Ablauf kenntlich gemacht.

**Dateien:** `src/data/prayerRakatData.ts`, `src/screens/PrayerLearningScreen.tsx`

---

### Gebetszeiten: Berechnungsmethode, Fallback und lokale Abweichungen

`prayer-time-methodology` · **pending**

**Technisch bereits geprüft (keine fachliche Aussage):**

- Ohne Gerätestandort zeigt die App keine persönlichen Gebetszeiten.
- Der Ersatzzeitplan enthält keine Uhrzeiten und löst keine Erinnerungen aus.

**Zu entscheiden:**

- Ist die Standardmethode (Diyanet, experimentell) eine vertretbare Voreinstellung?
- Ist die Unterscheidung Standard-/Hanafi-Asr korrekt beschrieben?
- Ist der Hinweis auf mögliche Abweichungen zur örtlichen Moschee ausreichend deutlich?

**Dateien:** `src/services/prayerTimesService.ts`, `src/screens/PrayerScreen.tsx`

---

### Qibla: Standort, Bearing und Gerätekompass

`qibla-guidance` · **pending**

**Technisch bereits geprüft (keine fachliche Aussage):**

- Ohne Gerätestandort zeigt die App keine persönliche Gradzahl.

**Zu entscheiden:**

- Ist die Erklärung zur Gebetsrichtung und zum Umgang mit Ungenauigkeit religiös angemessen?
- Ist der Hinweis ausreichend, dass ein Kompass eine Hilfe und keine Gewissheit ist?

**Dateien:** `src/screens/QiblaScreen.tsx`, `src/services/qibla.ts`

---

### Islamischer Kalender: Termine, Fastenhinweise und Datumsunsicherheit

`islamic-calendar-content` · **pending**

**Umfang:** 11 benannte Termine und 2 Regeln für Tage, an denen nicht gefastet wird.

**Technisch bereits geprüft (keine fachliche Aussage):**

- Der islamische Tag wechselt ab Maghrib; ohne verlässliche Maghrib-Zeit sagt die App das.

**Zu entscheiden:**

- Sind die Termine, ihre Bedeutung und die Praxishinweise korrekt?
- Sind die Tage, an denen Fasten unzulässig ist, vollständig?
- Ist der Hinweis auf berechnetes Datum vs. örtliche Mondsichtung ausreichend?

**Dateien:** `src/data/islamicEventsData.ts`, `src/screens/CalendarScreen.tsx`, `src/services/islamicDay.ts`

<details><summary>Termine und Fastenregeln</summary>

| Hijri-Monat | Tage | Termin | Bedeutung | Quelle |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1. Muharram · Beginn des Hijri-Jahres | Der erste Tag des Monats Muharram markiert rechnerisch den Beginn eines neuen Hijri-Jahres. | Kalenderdefinition · keine besondere Neujahrs-Sunnah behauptet |
| 1 | 9 | Tasuʿa | Der 9. Muharram wird zusammen mit dem Ashura-Fasten überliefert. | Sahih Muslim 1134a–b |
| 1 | 10 | Ashura | In der authentischen Überlieferung wird dieser Tag mit der Rettung von Musa und Bani Israil verbunden. | Sahih al-Bukhari 2004 · Sahih Muslim 1134a · Sahih Muslim 1162a |
| 9 | 1 | Ramadan beginnt | Ramadan ist der Monat, in dem der Quran herabgesandt wurde und in dem das Fasten vorgeschrieben ist. | Quran 2:183–185 |
| 9 | 21, 23, 25, 27, 29 | Laylat al-Qadr suchen | Die genaue Nacht wird hier nicht auf den 27. Ramadan festgelegt. Der Prophet ﷺ wies an, sie in den ungeraden Nächten der letzten zehn Nächte zu suchen. | Quran 97:1–5 · Sahih al-Bukhari 2017 |
| 9 | 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 | Letzte zehn Nächte des Ramadan | Für die letzten zehn Nächte ist verstärkter Gottesdienst überliefert; je nach Monatslänge kann Ramadan nach dem 29. Tag enden. | Sahih al-Bukhari 2024 · Sahih al-Bukhari 2026 |
| 10 | 1 | Eid al-Fitr | Das Fest des Fastenbrechens folgt auf Ramadan. | Sahih Muslim 1138 · Sahih Muslim 1140 |
| 12 | 1, 2, 3, 4, 5, 6, 7, 8 | Erste Tage von Dhul-Hijjah | Für die ersten zehn Tage von Dhul-Hijjah ist eine besondere Bedeutung guter Taten authentisch überliefert. | Sahih al-Bukhari 969 |
| 12 | 9 | Tag von Arafah | Der 9. Dhul-Hijjah ist der Tag von Arafah und ein zentraler Tag der Hajj. | Sahih Muslim 1162a–b |
| 12 | 10 | Eid al-Adha | Der 10. Dhul-Hijjah ist Eid al-Adha, das Opferfest. | Sahih Muslim 1138 · Sahih Muslim 1140 |
| 12 | 11, 12, 13 | Ayyam at-Tashriq | Die Tage nach Eid al-Adha werden als Tage des Essens, Trinkens und Gedenkens Allahs beschrieben. | Sahih Muslim 1141a · Sahih Muslim 1142a |

**Tage, an denen nicht gefastet wird:**

- Monat 10, Tag(e) 1
- Monat 12, Tag(e) 10, 11, 12, 13

</details>

---
