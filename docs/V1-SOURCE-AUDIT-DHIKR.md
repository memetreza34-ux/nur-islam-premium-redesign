# V1 Source Audit — Dhikr

> Betrifft die v1-Blöcke `dhikr-counter-steps` und `dhikr-routines`.
>
> `source-audited-green` bedeutet: Wortlaut/Anlass/Zahl wurden gegen die angegebenen Primärquellen geprüft. Es ist keine erfundene menschliche Gelehrtenfreigabe.

## Gesamturteil

**Beide Dhikr-v1-Blöcke: `source-audited-green`.**

Kein klarer religiöser Inhaltsfehler gefunden. Die App verwendet nur drei eng begrenzte, quellengebundene Routinen und enthält bewusst keinen freien Zähler mit künstlicher religiöser Zielzahl.

---

## 1. Dhikr nach dem Gebet

**App-Quelle:** Sahih Muslim 597a

**App:**
- 33 × SubhanAllah
- 33 × Alhamdulillah
- 33 × Allahu Akbar
- danach 1 × vollständiger Tahlil zur Hundert

**Primärquelle:** Sahih Muslim 597a.

Die Überlieferung nennt nach jedem Gebet genau 33 Tasbih, 33 Tahmid und 33 Takbir (= 99) und anschließend zur Vollendung von 100:

`لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ`

**Bewertung:** Zahlen, Anlass und Abschlussformel stimmen mit der angegebenen Quelle überein.

Die deutschen Bedeutungen sind ausdrücklich sinngemäße Lernformulierungen, keine vorgetäuschte lizenzierte Hadithübersetzung.

---

## 2. Dhikr am Morgen

**App-Quelle:** Sahih Muslim 2726a

**App:** drei Wiederholungen von:

`سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ`

Die Überlieferung berichtet, dass der Prophet ﷺ am Morgen nach dem Weggehen von Juwairiya vier Aussagen dreimal sprach und bei seiner Rückkehr am Vormittag deren Gewicht hervorhob.

**Bewertung:**
- Morgenkontext: belegt.
- drei Wiederholungen: belegt.
- verwendeter Wortlaut: entspricht Muslim 2726a.

Es existieren überlieferte Wortlautvarianten; die App behauptet nicht, dass nur diese eine Form gültig sei.

---

## 3. Dhikr vor dem Schlafen

**App-Quellen:** Sahih al-Bukhari 3113; Sahih al-Bukhari 5361

**App:**
- 33 × SubhanAllah
- 33 × Alhamdulillah
- 34 × Allahu Akbar

Bukhari 5361 überliefert ausdrücklich beim Zubettgehen:

- Tasbih 33
- Tahmid 33
- Takbir 34

Bukhari 3113 trägt dieselbe ausgewählte 33/33/34-Form. Die App weist zusätzlich transparent darauf hin, dass authentische Wortlautvarianten existieren und erklärt diese nicht für ungültig.

**Bewertung:** Anlass und Zahlen sind stark belegt; die Variantennotiz ist sachgerecht.

---

## 4. Zähler-/UX-Logik

`DhikrScreen.tsx` zählt ausschließlich bis zu den im quellengebundenen Datensatz hinterlegten Zielzahlen. Persistierte Werte werden auf das jeweilige Ziel begrenzt.

Der Fortschritt (`x Wiederholungen bis zum Abschluss dieser Routine`) ist eine reine UI-/Tracking-Aussage. Die App behauptet damit keine zusätzliche religiöse Belohnung oder Pflicht.

Bewusst nicht vorhanden: ein freier Zähler mit einer von der App erfundenen religiösen Zielzahl.

---

## Kleine sprachliche Hinweise

- `SubhanAllah` → `Allah ist frei von jedem Mangel.` ist eine erklärende Lernbedeutung und keine wortwörtliche Übersetzung.
- `Allahu Akbar` → `Allah ist größer als alles.` ist eine erklärende Kurzglosse. Sie wird hier nicht als Fehler bewertet; beim späteren app-weiten Transliterations-/Bedeutungspass kann die Formulierung vereinheitlicht werden.

Keine dieser beiden Stellen rechtfertigt aktuell eine eigenmächtige religiöse Inhaltsänderung.

---

## Quellen

- Sahih Muslim 597a — Dhikr nach dem Gebet: 33/33/33 + Tahlil zur 100.
- Sahih Muslim 2726a — morgendlicher gewichteter Tasbih, dreimal.
- Sahih al-Bukhari 3113 — Schlaf-Dhikr 33/33/34.
- Sahih al-Bukhari 5361 — Schlaf-Dhikr 33/33/34.

## Release-Auditstatus

- `dhikr-counter-steps`: **source-audited-green**
- `dhikr-routines`: **source-audited-green**

Bestehende formale Review-Gates bleiben unverändert; dieser Audit setzt kein künstliches `approved`.

## Nächster Block

`duas` — alle 34 sichtbaren Einträge: Arabisch, Transliteration, sinngemäße deutsche Bedeutung, Anlass, Referenz und Grad prüfen.
