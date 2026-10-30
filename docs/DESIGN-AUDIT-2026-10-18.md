# Designprüfung der App

Prüfung am 17.–18. Oktober 2026. Stand: Branch `design/claude-design-system`.

## Urteil

**Die gestalterische Richtung passt. Für eine abschließende Designfreigabe ist die App noch nicht bereit.**

Es braucht keinen neuen Stil. Dunkelgrün, Creme, Gold, die Bogenform und die vereinfachten 3D-Objekte geben der App eine erkennbare Identität. Die größten Probleme liegen in der Lesbarkeit, einigen ungünstigen Zwischenbreiten und der Gewichtung der Inhalte. Gute Einzelbilder gleichen diese Probleme nicht aus.

Diese Prüfung verändert keine App-Oberflächen. Sie bewertet ausschließlich das Aussehen, einschließlich der visuellen Darstellung von Auswahl, Formularen, leeren Ansichten, Ladezuständen und Dialogen. Sie ist keine funktionale oder inhaltliche Releasefreigabe.

## Was erhalten bleiben sollte

- **Palette:** Dunkles Grün mit warmem Creme und sparsamem Gold passt zur ruhigen Ausrichtung. Die helle Ayah-Karte auf Start unterbricht die dunklen Flächen sinnvoll.
- **Schriftpaarung:** Cormorant Garamond für charakteristische Überschriften, Inter für Bedienung und Fließtext, Amiri für Arabisch. Diese Rollen funktionieren grundsätzlich miteinander.
- **Bildsprache:** Teppich, Buch, Hände, Datteln und die übrigen vereinfachten Objekte gehören erkennbar zusammen. Die fünf Gebetslandschaften zeigen eine zusammenhängende Umgebung mit wechselndem Licht.
- **Figurenserie:** Die 15 Wudu-/Salah-Abbildungen wurden gemeinsam verglichen. Kleidung, Haare, Farben und Modellierung bilden eine weitgehend konsistente Serie. Die Figur wirkt jugendlich; das ist eine bewusste Zielgruppenentscheidung, kein Grund, alle Bilder erneut auszutauschen.
- **Qibla:** Der fertig geladene grüne Kompass mit goldener Spitze passt deutlich zur übrigen App. Die leere Fläche während des Nachladens wurde nicht als fertiges Kompassdesign bewertet.
- **Quellen-Info:** Der kleine Info-Einstieg und der darüber geöffnete Dialog reduzieren die Unruhe in den Lesebereichen.
- **Grundstruktur:** In den aufgezeichneten Zuständen wurde keine Überbreite des gesamten Dokuments gemessen. Das beweist allerdings keine guten Umbrüche innerhalb einzelner Karten.

## Vor der Designfreigabe korrigieren

### 1. Längere Texte sind zu klein

**Priorität: hoch.**

Gemessene Beispiele bei 390 px Breite:

| Bereich | Tatsächliche Größe | Problem |
|---|---:|---|
| Deutscher Quran-Text auf Buchseiten | 13,44 px | Zu klein als normale Grundeinstellung für längeres Lesen. |
| Erklärung „Drei Lesearten“ | 12 px | Ein ganzer erklärender Absatz wird wie eine Fußnote behandelt. |
| Mehrere Dua-Bedeutungen und Zusatztexte | 12–13 px | Inhalt und Metadaten unterscheiden sich zu wenig in ihrer Gewichtung. |
| Lernübersicht, Einleitung | 12,8–13,6 px | Gut lesbare Lernartikel und kleine Einführungstexte wirken wie zwei verschiedene Maßstäbe. |
| Premium-Erklärungen | z. B. 12,16 px | Auf den größeren Karten bleibt der Text trotzdem kleinteilig. |

**Empfehlung:** Für tatsächlichen Lesetext ungefähr 16–18 px als Ausgangspunkt verwenden. Erklärende Absätze mindestens 14–16 px; 12–13 px für kurze Metadaten reservieren. Nicht alle Texte pauschal vergrößern. Arabische Texte separat nach Inhalt und Zeilenlänge abstimmen. Eine vorhandene Schriftvergrößerung ersetzt keine gute Grundeinstellung.

Quelle des Buchseitenwertes: [reference-quran-complete.css](</Users/arman/Islam App/nur-islam-premium-redesign/src/styles/reference-quran-complete.css:450>), zusätzlich im Browser gemessen. Rohwerte stehen in der Messdatei.

### 2. Fast unsichtbare Beschriftung auf „Ayah im Fokus“

**Priorität: hoch.**

„Sure Al-Ikhlas · 112:1“ wird nahezu weiß auf einer hellen Cremefläche dargestellt. Gemessen wurden `rgb(255,249,238)` als Schrift und `rgb(246,237,220)` unter einer weißen Fläche mit 8 % Deckkraft. Daraus ergibt sich ungefähr **1,10:1 Kontrast**. Die Beschriftung ist im Screenshot fast unsichtbar.

**Empfehlung:** Für diese helle Karte ein eigenes dunkles Textschema verwenden, etwa ein dunkles Grün. Alle Labels, Symbole, Zustände und Buttons auf Creme separat prüfen; die Farben der dunklen Karten dürfen dort nicht ungeprüft weitergelten.

[Beleg: Ayah im Fokus](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-ayah-contrast.png>)

### 3. Die mittlere Handybreite bekommt schlechtere Raster als das kleine Handy

**Priorität: hoch.**

Bei 390 px stehen unter „Mehr“ kleine Einträge nebeneinander. „Gebetszeiten“ bricht im Wort um. Die Widget-Konfiguration verteilt ebenfalls zwei Einträge pro Zeile; Symbol und separater An-/Aus-Bereich lassen für den eigentlichen Text nur einen schmalen Rest. Dadurch entstehen unnötig viele Zeilen und hohe, unruhige Kacheln.

Bei 320 px wechselt dieselbe Gestaltung teilweise zu einer deutlich verständlicheren einspaltigen Liste. Das größere Handy sollte nicht die schlechtere Darstellung erhalten.

**Empfehlung:** Das Raster anhand der benötigten Inhaltsbreite umschalten. Auf Handys für diese beiden Bereiche zunächst eine Spalte vorsehen. Titel und Beschreibung bekommen den Hauptplatz; kleine Zustandsanzeigen dürfen ihn nicht verdrängen. Keine Wörter mitten im Namen zerlegen.

[Beleg: Mehr, 390 px](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-more.png>) · [Widgets, 390 px](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-premium-widgets.png>) · [Widgets, 320 px](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/320-premium-widgets.png>)

## Danach die Gestaltung vereinheitlichen

### 4. Bilder werden an wichtigen Stellen ungünstig beschnitten

**Priorität: mittel.**

Die Moschee im ersten Einführungsschritt ist so stark vergrößert, dass die oberen Minarettteile abgeschnitten werden. Das ist ein sichtbarer Fehler gerade beim ersten Eindruck. Die Bilddatei selbst muss dafür nicht neu erzeugt werden.

**Empfehlung:** Pro Bild einen sicheren Ausschnitt festlegen. Freigestellte Gegenstände vollständig zeigen; Landschaften dürfen den Rahmen füllen. Für die Einführung zuerst Skalierung und Position korrigieren. In der aktuellen CSS-Regel wird das Moscheebild zusätzlich auf `scale(1.62)` vergrößert.

[Beleg: Einführung](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-onboarding-1.png>) · [Bildregel](</Users/arman/Islam App/nur-islam-premium-redesign/src/styles/premium-onboarding-art-lock.css:36>)

### 5. Zu viel Fläche vor dem eigentlichen Inhalt

**Priorität: mittel.**

Im Quran-Bereich folgen Titelbild, Verzeichniskarte und ein längerer Hinweis aufeinander. Die Surenliste liegt dadurch auf dem Handy weit unten. Im Leser kommen erneut eine große Titelkarte und Erklärungen vor dem Text. Auf Lernen stehen mehrere Einführungsblöcke vor den konkreten Schritten. Fast alle erhalten einen ähnlich starken Rahmen und Hintergrund.

Bei „Ayah im Fokus“ bleibt unter dem kurzen Inhalt eine große leere Fläche in der hellen Karte. Kopieren erscheint innerhalb der Karte und anschließend noch einmal darunter.

**Empfehlung:** Pro Ansicht einen klaren Hauptbereich bestimmen. Einführungen kürzer und flacher darstellen; zusätzliche Hinweise kompakt aufklappbar machen. Kurze Verse sollen nicht dieselbe feste Kartenhöhe wie lange Inhalte brauchen. Redundante visuelle Aktionen zusammenführen, ohne den Inhalt zu entfernen.

[Quran-Einstieg](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-quran-top.png>) · [Leser](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-reader.png>) · [Lernen](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/390-learn-top.png>)

### 6. Querformat braucht eine kompaktere erste Bildschirmfläche

**Priorität: mittel.**

Bei 844 × 390 px zeigt Start zunächst die Kopfzeile, Ort/Datum und den oberen Teil des Bogens. Die eigentliche Gebetsuhr liegt unterhalb der sichtbaren Fläche. Scrollen ist möglich; das Problem ist die gestalterische Priorität beim Einstieg.

**Empfehlung:** Bei geringer Höhe den Kopfbereich verkürzen und Zeit, Name sowie verbleibende Zeit kompakt neben oder auf einer kleineren Bildfläche platzieren. Die dekorative Bogenhöhe darf die wichtigste Information nicht verdrängen.

[Beleg: Handyquerformat](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/844-main-Start.png>)

### 7. Tabletbreite ist vorhanden, aber nicht immer sinnvoll verteilt

**Priorität: mittel.**

„Mehr“ stellt Gruppen mit sehr unterschiedlicher Länge nebeneinander. Neben der kurzen linken Spalte bleibt dadurch viel ungenutzter Platz. Andere Bereiche werden hauptsächlich breiter, während ihre kleinen Texte gleich klein bleiben. Der Quran-Bogen ist angenehm begrenzt; dieses begrenzte Lesemaß ist ein gutes Vorbild.

**Empfehlung:** Gruppen mit ausgeglichener Höhe anordnen oder ihre Inhalte in ein durchgehendes Raster setzen. Lesetext begrenzen, Listen gezielt in Spalten verteilen. Kein pauschales Vergrößern aller Elemente.

[Mehr auf Tablet](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/768-more-top.png>) · [Quran im Tabletquerformat](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/1024-main-Quran.png>)

### 8. Bildwelt: gemeinsame Regeln statt überall neue Motive

**Priorität: mittel.**

Die Objektserie und die Landschaften bilden die stärksten Familien. Die detaillierten Ortsbilder wirken wesentlich realistischer. Außerdem stehen dieselben Gegenstände teils für unterschiedliche Themen: Das Herzmotiv beim Zakat-Rechner und die Ringe in der Ummah-Übersicht sind weniger eindeutig als Buch, Teppich oder Moschee. Wiederholte Buchbilder beim Thema Quran sind dagegen eine sinnvolle Wiedererkennung.

**Empfehlung:** Drei feste Rollen definieren: matte 3D-Objekte für Themen, ruhige Landschaften für Zeit/Stimmung, Figuren ausschließlich für Handlungen. Ortsbilder entweder bewusst als eigene Informationsbildfamilie behandeln oder an die Modelloptik angleichen. Einen Gegenstand nicht für mehrere unverbundene Bedeutungen verwenden. Die vorhandenen konsistenten Motive behalten.

[Objekte und Orte im Vergleich](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/contact-390-4.png>) · [15 Figurenbilder](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots/character-art-comparison.png>)

### 9. Akzente und Umrandungen brauchen eine klarere Rangfolge

**Priorität: mittel bis niedrig.**

Gold markiert Buttons, aktive Navigation, Überschriften, Metadaten, Zierlinien und mehrere verschachtelte Rahmen. Dadurch konkurrieren dekorative und bedienbare Elemente um Aufmerksamkeit. Manche Flächen enthalten Karte, Unterkarte, Badge und zusätzliche Kontur zugleich.

**Empfehlung:** Kräftiges Gold vor allem für die wichtigste Aktion und ausgewählte Zustände einsetzen. Überschriften überwiegend in Creme, Goldlabels gezielter einsetzen, nicht jede Information erneut einfassen. Warnungen nicht allein durch dieselbe Goldfarbe von gewöhnlicher Hervorhebung unterscheiden.

Die alternativen Akzente Saphir/Pflaume/Sand wurden im Quellcode betrachtet, nicht als aktive Nutzereinstellung umgestellt. Dort ändern sich `--gold` und weitere Variablen, aber beispielsweise nicht `--gold-text`; zusätzlich existieren feste Goldwerte. Deshalb ist eine vollständig einheitliche Akzentumschaltung damit noch nicht belegt.

## Empfohlener visueller Maßstab

Keine neue Marke, sondern feste Rollen für die vorhandenen Mittel:

| Bestandteil | Ziel |
|---|---|
| Hintergrund | Bestehendes tiefes Grün behalten; Hauptinhalt klar von der Fläche abheben. |
| Haupttext | Creme auf Dunkelgrün, dunkles Grün auf Creme. |
| Längerer Lesetext | Ausgangspunkt 16–18 px, angemessene Zeilenhöhe und begrenzte Zeilenlänge. |
| Erklärende Absätze | Etwa 14–16 px statt einer längeren Passage in Metadatengröße. |
| Kurze Metadaten | 12–13 px können bleiben, wenn Kontrast und Abstand ausreichen. |
| Titel | Serifenschrift gezielt für Haupttitel; Inter für Steuerung und sachliche Zwischenüberschriften. |
| Arabisch | Eigenes Schriftmaß und Zeilenhöhe nach Textlänge; nicht einfach mit den lateinischen Labels skalieren. |
| Gold | Hauptaktion, aktive Auswahl und wenige gezielte Akzente. |
| Bilder | Einheitliche Materialien, klare semantische Zuordnung und überprüfte Ausschnitte. |
| Karten | Weniger verschachtelte Rahmen; Abstände und Typografie sollen die Hierarchie tragen. |

## Geprüfter Umfang und Grenzen

- Fünf Bildschirmformate: **320 × 740, 390 × 844, 768 × 1024, 1024 × 768 und 844 × 390 px**.
- Alle fünf Hauptbereiche. 29 weitere Verzeichniseinstiege wurden bei 320, 390 und 768 px erfasst: Gebetskurs, Wudu, Qibla, Dhikr, Duas, Moscheen, Kalender, Fasten, Sammlung, sieben Grundlagen-/Lernbereiche, Ayah, Namen, Ummah, Hadith, Rechtsschulen, Propheten, Hajj, Sunnah, Reue, Orte, Jumuah, Zakat und Gebetsanzeige.
- Ergänzend: Quran-Leser in drei Lesearten, Wudu-Bildschritt, Propheten- und Rechtsschuldetail, Quiz und Frageansicht, Konto, leere Notizen und Editor, Datenschutz, Sprache, Einstellungen, Hilfe, Über-Dialog, Quellen-Info sowie die sieben Premiumansichten. Einführung und Startbild wurden gesondert erfasst.
- Die 390-px-Ansichten wurden breit visuell verglichen. Kleine und breite Formate wurden zusätzlich vermessen und anhand ihrer Screenshots auf problematische Vorlagen geprüft. Nicht jeder Vers, Name, jede Quizantwort oder jeder Kursabschnitt wurde einzeln beurteilt; gemeinsame Vorlagen wurden exemplarisch geprüft.
- Aufnahmen von Lade- und Übergangszuständen bleiben in den Rohdaten. Ein flüchtig leerer Übergang wurde nicht ohne erneute Prüfung als Designfehler gewertet. Der endgültige Kompass wurde separat aufgenommen.
- Die Bewegung wurde während der Navigation beobachtet; Fade-/Übergangsregeln und Regeln für reduzierte Bewegung sind im Code vorhanden. Ein eigener vollständiger Test mit reduzierter Bewegung war nicht Bestandteil dieser visuellen Aufnahme.
- Emulierte Browsergrößen ersetzen keine abschließende Sichtprüfung auf echten Displays, bei anderem Umgebungslicht und mit vergrößerter Systemschrift.
- Keine neuen Funktions-, Inhalts-, Rechts- oder Sicherheitsprüfungen wurden aus diesen Designaufnahmen abgeleitet. Frühere grüne Tests sind kein Beweis für ein fertiges Aussehen.

## Nächster sinnvoller Durchgang

1. Leseschrift und helle Karten korrigieren.
2. Die beiden problematischen Handy-Raster reparieren.
3. Einführungsausschnitt und niedrige Querformatansicht anpassen.
4. Einleitungen, Kartenrangfolge und Tabletverteilung vereinfachen.
5. Verbleibende Bild- und Akzentabweichungen vereinheitlichen.
6. Danach dieselben repräsentativen Ansichten erneut nebeneinander prüfen und auf echten Geräten ansehen.

## Nachweise

Die Rohdaten sind **Aufzeichnungen, keine bestandenen Qualitätsprüfungen**. Sie enthalten wiederholte Messungen und Übergangszustände.

- [Messwerte](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/measurements.json>)
- [Verzeichnis-Abdeckung](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/coverage.json>)
- [Prüfzusammenfassung und Grenzen](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/verification-2026-10-18.json>)
- [Fingerabdruck des aktuellen Quellstands](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/source-fingerprint-2026-10-18.json>)
- [Screenshot-Verzeichnis](</Users/arman/Islam App/nur-islam-premium-redesign/docs/design-audit-2026-10-17/screenshots>)
