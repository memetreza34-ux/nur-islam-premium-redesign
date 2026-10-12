# Praxisleitfäden · Speicherwahrheit · 12. Oktober 2026

## Umfang und Nachweismethode

Gemeinsame Fortschritts-/Abschlussmechanik aller **elf bestehenden
Praxisleitfäden** in `ReferenceReadingScreens.tsx` sowie ihr Wudu-Abschluss
im Lernhub. Nicht der vollständige religiöse Inhalt ihrer 102
Inventarpositionen. Wudu bleibt ein manueller Lernleitfaden; ein gespeicherter
Kursabschluss bestätigt weder Kenntnis noch eine ausgeführte/rituell gültige
Waschung. Kein menschlicher Freigabestatus und keine neue Funktion.

Code gelesen: Schritt-/Abschlussbehandlung, Wudu-Stepper, Lernhub-Zähler,
Guide-Katalog/IDs, bestehende Wudu-Browserregressionen und die betroffenen
Strukturprüfer. Vorhandene ältere grüne Berichte nicht als Nachweis des
aktuellen Fehlerverhaltens übernommen.

## Reproduzierte Fehler und Korrekturen

| Konkrete Aussage bzw. Verhalten | Nachweis im alten Stand | Korrektur / Grenze |
|---|---|---|
| Öffnen eines Leitfadens speichert einen Schritt | Neuer Test erwartete keinen Schreibvorgang, fand `nur_guide_salah_step = "0"`. | Kein Schreiben beim Mount oder Moduswechsel; nur ausdrückliche Auswahl/Navigationsaktion schreibt Position. |
| Unbekannter Schritt wird still repariert | Neuer Test setzte `999`; Mount überschrieb mit `10`, dem letzten Salah-Index. | Vorhandene nicht zuordenbare, negative, nicht ganzzahlige oder nicht kanonische Werte bleiben erhalten. Anzeige startet bei lesbarem Ersatzindex, sichtbar als nicht zuordenbar, nicht als reparierte Speicherung. |
| „als abgeschlossen gespeichert“ nach Quota-Fehler | Neuer Test provozierte `setItem`-Exception; alter Code zeigte trotzdem Erfolg. | Bestätigung erst nach exakt passendem Rücklesen. Schreibfehler, fehlende Rechte, still verworfene/abweichende Speicherung und Rücklesefehler liefern keine Erfolgsmeldung. Warnsymbol statt Erfolgshäkchen. |
| Einführungszeile behauptet immer Speicherung | Zeile „Fortschritt lokal gespeichert“ ohne geprüfte Schreibbestätigung. | Unterscheidet keinen bestätigten Stand, gespeicherte Position, gespeicherten Abschluss und nicht lesbaren Bestand. Bei nicht bestätigter Aktion zusätzlich dauerhafter Speicherhinweis; Navigation funktioniert lokal weiter. |
| Wudu ab besuchtem Index 5 abgeschlossen | Neuer Hub-Test mit nur Schritt `5` erhielt `1/6`, erwartet `0/6`. | Nur expliziter lesbarer Abschlusswert `nur_guide_wudu_complete = "1"` zählt, nicht Cursorposition. Keine automatische Migration alter Cursorstände zu Abschlüssen. |
| Frühere Schritte gelten nach Sprung als erledigt | Alte Nicht-Wudu-Karten leiteten `is-complete` und Häkchen aus `index < stepIndex` ab. | Nur aktuelle Auswahl markiert; vorherige, möglicherweise übersprungene Schritte nicht als gelesen/abgeschlossen behauptet. |
| Unbekannte Gebets-IDs zählen im Hub | Fünf unbekannte IDs ergaben `5/6`; doppelte/unknown IDs konnten einen falschen Zähler erzeugen. | Hub zählt nur unterschiedliche IDs der fünf bestehenden Gebetslektionen. Unbekannte IDs bleiben unverändert gespeichert, zählen nicht als Abschluss vorhandener Kurse. |
| Fehlerhafte Gebetsabschlussdaten sind scheinbar leer | Zusätzliche Tests mit `{broken`, `true` und `["fajr",123]` reproduzierten erfundene Null-/Teilzähler. | Struktur als Array nichtleerer Strings geprüft; bei nicht lesbarer Struktur lautet der Hubstatus „Abschlussstatus nicht vollständig lesbar“. Kein Nullfortschritt erfunden und keine gespeicherten Daten ersetzt. |

Erste vier fehlschlagende Tests:
`/private/tmp/nur-guide-storage-before-20261012.log`.
Weitere fünf Hub-Reproduktionen:
`/private/tmp/nur-guide-hub-before-20261012.log`.
Diese neun Fehler wurden vor ihren jeweiligen Korrekturen tatsächlich ausgeführt.
Die zusätzliche Sprung-/Häkchenregression schützt den nach Codebefund
korrigierten Pfad; kein eigener alter Fehllauf dafür behauptet.

## Autoritative Codebelege

- `src/services/worshipGuideProgress.ts`: bekannte Guide-ID, gültiger ganzzahliger
  Cursor innerhalb tatsächlicher Schrittlänge, explizite Flags `0`/`1`, separate
  Lesbarkeitszustände. Keine Mutation beim Lesen. Vor Änderung aktuelle Daten
  geprüft, nicht lesbare Zielwerte nicht überschrieben. Position und Abschluss
  unabhängig: eine ausdrückliche Änderung repariert nicht das andere Feld.
- `src/screens/ReferenceReadingScreens.tsx`: Auswahl-/Abschlussaktionen nutzen
  bestätigte Speicherung; kein Guide-Mount-Schreibeffekt mehr. Letzter Schritt
  allein speichert noch keinen Abschluss. Allgemeiner Speicherhinweis und
  Fehlerfeedback statt stiller Ausnahmebehandlung. Storage-Listener schreibt nicht.
- `src/screens/LearnScreen.tsx`: Wudu-Flag statt Cursor; Gebets-IDs gegen
  `PRAYER_LESSONS` gefiltert, beschädigtes Format nicht als leer betrachtet.
  Tatsächliche Storage-Events aktualisieren die Hubanzeige.
- `src/shared/WuduLesson.tsx`: vorhandene Navigation und finaler Abschlussknopf
  bleiben erhalten; Wortlaut/Bild-/Quellenbestand nicht verändert.
- `scripts/check-progress-persistence-truth.mjs`: schützt Rücklesen, aktuelle
  Werte, Guide-Validierung und das Verbot cursorbasierter Abschlussbehauptungen.
  `check-worship-guides.mjs` prüft die Anbindung an die bestätigte Auswahl statt
  den alten direkten Setter. `check-functional-hardening.mjs` prüft jetzt den
  zentralen Abschlussaufruf statt einen längst verschobenen Speicherliteral.
  Keine bestehenden Inhalts-/Arabisch-/Mengenassertions entfernt.

Keine religiösen externen Quellen für Speicherverhalten verwendet. Hier sind
Code, tatsächlich ausgeführte Fehlerfälle und bestätigte Daten die passenden
Belege, keine thematisch ähnliche Quran-/Hadithstelle.

## Absicherung

**67 neue Regressionen**: 44 Servicefälle plus 23 Komponenten-/Hubfälle.
Alle elf bestehenden Guide-IDs mit tatsächlicher Schrittlänge, passende
Rücklesebestätigung, zehn unlesbare Positionen, fünf unbekannte Abschlussformen,
unbekannte Guides, ungültige neue Indizes, Lese-/Schreib-/Rücklesefehler,
stiller Verlust und abweichender Wert; Erhalt unabhängiger Datenfelder.
Komponenten: Mount, explizite Auswahl, Remount, Moduswechsel, Abschluss,
Warnsymbol, Erhalt unlesbarer Daten und Storage-Events; Hub mit bekannten,
unbekannten und strukturell ungültigen Gebetsabschlüssen.
Fokussiert **67 Tests bestanden**, Exit 0:
`/private/tmp/nur-guide-storage-focused-final-20261012.log`.

Gesamt `npm run check` **Exit 0**, **994 Tests in 56 Dateien**, zehn
Node-Prüferregressionen, Typprüfung, Produktionsbuild und Budgetcheck:
`/private/tmp/nur-guide-storage-check-complete-20261012.log`.
Nach Bildkorrektur erneut vollständig bestanden, Exit 0, gleiche Anzahl:
`/private/tmp/nur-guide-storage-check-post-visual-20261012.log`.
Erster Gesamtlauf scheiterte am alten `onSelect={setActiveStep}`-Literal;
Anbindung an bestätigten Setter mit zusätzlichem Funktionsbeleg angepasst.
Danach vollständiger Lauf bis zur gemessenen Budgetüberschreitung (382 statt
381 KB JS). Nach JS-Anpassung meldete der Prüfer Gesamt 504 statt 503 KB.
Beide Grenzen nur um gemessenen Bedarf erhöht, nicht Assertions entfernt.
Keine neue CSS-Regel oder Bibliothek. JS **382 KB**, CSS **123 KB**,
Gesamt **504 KB gzip** (gerundete Teile nicht additiv), Entry **92/95 KB**,
größter Chunk **320/500 KB raw**. Shell/Registrierung zunächst **v75**,
nach zusätzlicher Rückmeldungs-Korrektur gemeinsam **v76**.

Erster Browserlauf **31 Fälle bestanden (1,6 Minuten), Exit 0**:
zwölf neue Guide-/Hub-Speicherfälle bei 320/768/1280 px, sieben bestehende
Wudu-Stepper-/Bild-/Reloadfälle und zwölf Praxis-Lektionsfälle.
`/private/tmp/nur-guide-storage-e2e-20261012.log`.
Er enthält einen echten zweiten lokalen Tab für Storage-Events, aber die
geänderten Werte sind ausdrücklich synthetische Testdaten; keine Nutzerdaten.
Bildkontrolle trotz grünem Lauf: kurzer Toast auf 320 px rechts abgeschnitten.
Nach ergänzter Geometrieassertion reproduziert: rechte Kante 450 gegenüber
maximal 321 px, **ein Fall fehlgeschlagen**, Exit 1:
`/private/tmp/nur-guide-toast-before-20261012.log`.
Ursache: CSS `left: 50%`/`translateX(-50%)` wird durch Motion-Y-Transformation
ersetzt. X-Zentrierung nun in Initial-, Aktiv- und Exit-Zustand beibehalten.
Keine Änderung an globalen CSS-Regeln. Abschließender Browser-Nachlauf:
**31 Fälle bestanden (1,6 Minuten), Exit 0**, mit Erfolg- und
Fehler-Toastgrenzen bei allen drei Breiten:
`/private/tmp/nur-guide-storage-e2e-post-visual-20261012.log`.
Erfolgsbild 320 px, Schreibfehler 768 px und stiller Schreibverlust 1280 px
tatsächlich betrachtet: Rückmeldungen zentriert, lange Erfolgsmeldung auf
Handy lesbar umgebrochen; dauerhafter Speicherhinweis ebenfalls lesbar.
Fixierter Kopf/Fuß und scrollende Ausschnitte bleiben; keine Behauptung,
alle Inhalte seien gleichzeitig sichtbar oder die ganze App visuell freigegeben.

Debugging-Skill führte zu tatsächlich fehlschlagenden Vorher-Tests;
Fehlerbehandlungs-Skill zur Trennung nicht lesbarer Daten von leerem Stand;
E2E-/Playwright-Skills zur realen Browser-/Rücklese-/Bildprüfung.
Keine zusätzliche Paketinstallation und keine externe Publikation.
`git diff --check` und `npm run review:check` nach Abschluss bestanden, Exit 0.

Standbindung (SHA-256):

- `src/services/worshipGuideProgress.ts`: `73c88cf2b4da4e105b225e5bc9ee27eb93ae474a0604a7becc374f497e5fb2e7`
- `src/services/worshipGuideProgress.test.ts`: `eda36925d01bec67ac0ccdde9859f1c10ea0c2f18f0478c850af1771e73bbd4a`
- `src/screens/ReferenceReadingScreens.tsx`: `c0b1648adc762fb8d1aa424fbd82db3e4c5666665e97c9f00875b5304883dd3f`
- `src/screens/LearnScreen.tsx`: `d95c43bdf29df07d9e256790f0f3dbe80442565fbf8eec8bf4bef2b1be8bdac3`
- `src/screens/WorshipGuideScreen.test.ts`: `66d24aaa00bdffd4351edd9135bba384945c2480c88a38a297bab13172e984cb`
- `e2e/worship-guide-storage.spec.ts`: `eb162adb45cc127a08ec8d5091ea46cf9d6ecf729209393a333d5aac9437d072`

## Grenzen und weiterer Umfang

- Rücklesebestätigung ist keine Zusage unbegrenzter Speicherdauer, Cloud-Sicherung
  oder manipulationssicherer Lernbescheinigung. Browserdaten können extern
  geändert/gelöscht werden. Ein formal gültiges Flag ist eine lokale Markierung.
- Storage-Events halten mehrere lokale Tabs auf aktuellem Stand, bieten aber
  keine atomare Konfliktauflösung gleichzeitiger Schreibvorgänge. Letzter
  Schreibvorgang eines skalaren Cursor-/Flagwerts kann gewinnen.
- Beschädigte Daten bewusst nicht automatisch zurücksetzen. Anzeige/Nachfragen
  funktionieren weiter. Kein neuer Reparatur- oder Löschknopf eingeführt.
- Die übrige Speicherung im vollständigen Gebetskurs und in Prophetenkursen,
  Quran-/Ayah-Detail und andere noch offene App-Pfade sind durch diesen
  gezielten Mechaniktest nicht vollständig bestätigt.
- Religiöse Prüfung der ausführlichen Wudu-/Salah-Texte und weitere Inhalte
  bleiben offen; aktuelle Quellenprüfung der Lernlektionen weiterhin
  **30/44, 329/465 Inventarpositionen**, **14/136 offen**. Die hier korrigierte
  Speicheranzeige erhöht diese religiöse Abdeckungszahl nicht.
- Keine Veröffentlichung, kein Push, kein menschlicher Freigabestatus,
  keine Prüfung echter Sensoren oder Geräte aus Browserbreiten abgeleitet.
