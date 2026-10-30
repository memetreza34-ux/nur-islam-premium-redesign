# Einheitliche Themenkarten

Start, Gebet, Lernen, das Verzeichnis unter Mehr und die aufklappbare Tagesübersicht verwenden jetzt `TopicCardContent`. Der Aufbau ist überall Bild bzw. Symbol links, Titel und kurze Erklärung daneben, Pfeil rechts. Echter Fortschritt steht unter der Erklärung und belegt keine seitliche Spalte. Die Bildwelt bleibt erhalten.

| Rolle | Gemeinsame Darstellung |
| --- | --- |
| Titel | Cormorant Garamond, 22 px, Gewicht 600, cremefarben |
| Kurzbeschreibung | Inter, 14 px, Gewicht 400, gedecktes Grünweiß |
| Fortschritt | Inter, 12 px, Gewicht 600, Gold |
| Bildfläche | 56 × 56 px; unter 360 px Bildschirmbreite 48 × 48 px |
| Kartenabstand | 12 px zwischen Bild, Text und Pfeil; unter 360 px 10 px |
| Kartenhöhe | Mindestens 96 px; Text darf umbrechen und wird nicht abgeschnitten |

Die übergroßen zusätzlichen Rubrikzeilen und langen Themenaufzählungen entfallen auf den Einstiegskarten. `topicSummaries.ts` bündelt kurze, konkrete Vorschautexte; wiederkehrende Bereiche wie Qibla und Duas erhalten dieselbe Beschreibung. Kurse, Detailtexte und gespeicherter Lernstand bleiben unverändert. Die 14 Lernkarten und alle Funktionen bleiben erreichbar.

Die Regeln liegen ausschließlich in `nur-design-system.css`. Alte Kartenregeln wurden aus den bisherigen Stilschichten entfernt, statt eine weitere Überschreibungsschicht anzuhängen. CSS sinkt von 863.515 auf 836.075 Byte; `!important` von 2.184 auf 2.148. Die Grenzen wurden entsprechend abgesenkt. PWA-Version 120 aktualisiert den App-Stand.

## Prüfung

- `npm run check`: bestanden, 1.145 Tests in 62 Dateien, Build und Größenlimit bestanden. Komprimiertes Gesamtbudget: 505 KB bei 511 KB Grenze.
- 46 Browserprüfungen bestanden: Navigation, Zurück/Weiter, Lernbereich, Hadith-Favoriten, Maus-/Touch-Rückmeldung und responsive App bei 320 × 740, 390 × 844, 844 × 390, 768 × 1024 und 1024 × 768.
- Nach der abschließenden Textpräzisierung sechs Kartenprüfungen erneut bestanden: 320, 390 und 768 px, jeweils dunkle und explizit gesetzte helle CSS-Darstellung. Geprüft werden gleiche berechnete Schriftgrößen, Gewichte und Farben, Bildgrößen, Platz zwischen Bild/Text/Pfeil, Textumbrüche, Kartenhöhe und maximal 64 Zeichen je Kurzbeschreibung.
- Die App startet weiterhin mit ihrer festen dunklen Palette. Die helle Darstellung wurde nur zur CSS-Kompatibilitätsprüfung gesetzt; es wurde kein neuer Themenumschalter eingebaut.
- Handyaufnahmen von Start, Gebet, Lernen und der hellen CSS-Darstellung visuell geprüft. Keine Aussage über eine Prüfung auf physischen Geräten.

Aufnahmen: [Start](topic-card-consistency-2026-10-23/start-390.png), [Gebet](topic-card-consistency-2026-10-23/gebet-390.png), [Lernen](topic-card-consistency-2026-10-23/lernen-390.png), [helle CSS-Darstellung](topic-card-consistency-2026-10-23/mehr-light-css-390.png).

Protokolle: `/tmp/nur-topic-final-check-20261023.log`, `/tmp/nur-topic-browser-final-20261023.log`, `/tmp/nur-topic-polish-20261023.log`.
