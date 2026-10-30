# Handy- und Tablet-Anpassung · 16. Oktober 2026

## Darstellung

- App-Fläche bis 900 px auf Tablets, ab 600 px Bildschirmbreite. Inhalte behalten ihre eigenen Lesebreiten; die Gebets-Hauptkarte ist auf 620 px begrenzt.
- Das Verzeichnis verteilt seine Gruppen auf Tablets auf zwei Spalten. Innerhalb einer Gruppe bleiben die Einträge lange Zeilen.
- Kleine Hinweise mindestens 12 px; ergänzende Texte 13–14 px. Keine weitere Verkleinerung auf schmalen Handys.
- Eingabefelder mindestens 16 px. Die Seite erlaubt weiterhin Browser-Zoom.
- Kompakte Aktionsflächen auf 44 px angehoben. Siebenspaltige Kalender dürfen auf 320 px schmalere Zellen haben; die Höhe bleibt mindestens 44 px.
- Dynamische Bildschirmhöhe und sichere Displayränder berücksichtigt. Die Navigation bleibt auch im Querformat am unteren Rand. Veraltete Abstände für die frühere feste Navigation entfernt.
- Dialogabstände an die tatsächliche Navigationshöhe angepasst. Der Inhalt langer Dialoge bleibt scrollbar.
- Bestehende Bildwelt, Gebetszuordnung und gespeicherte Fortschritte bleiben erhalten. Keine neuen Bilder erforderlich.

## Nachweis

`e2e/responsive-app.spec.ts` erfasst Hauptseiten, das vollständige Verzeichnis, Dienste, Konto, Notizen, Rechtliches, Profildialoge, drei Quran-Leseansichten, Wudu und den Gebetsablauf. Die Matrix umfasst 320×740, 390×844, 844×390, 768×1024 und 1024×768 px. Ein separater Durchlauf prüft alle drei Einführungsseiten in drei Größen.

Geprüft werden seitliches Überlaufen von Text und Dokument, verdeckte Textzeilen, Schriftgrößen, Eingabefelder, Aktionsflächen, Tablet-Breite und Lage der Navigation. Die bestehenden fachlichen Browserprüfungen ergänzen Navigation, Speicherung, Offline-Betrieb und Lernabläufe.

Browser-Simulation und visuelle Kontrolle ersetzen keine abschließende Prüfung auf echten iPhones, Android-Geräten und Tablets. Insbesondere native Bildschirmtastaturen, Sensoren und Systemdialoge sind hier nicht als physisch geprüft ausgewiesen.

## Ergebnis

- `npm run check`: alle 57 Release-Prüfungen, 1.047 Tests in 59 Dateien, Typprüfung, Build und Bundle-Budget bestanden. Übertragungsgröße: 508 KB gzip bei 511 KB Budget.
- 293 eindeutige Browserprüfungen in Etappen bestanden. Zwei reine Diagnose-Werkzeuge bleiben ohne ihre optionalen Umgebungsvariablen übersprungen.
- 250 Ansichten in der neuen Größenmatrix ohne seitlichen Textüberlauf, verdeckte Textzeilen oder unterschrittene Schrift-/Aktionsgrößen. Zusätzlich neun Einführungsansichten geprüft.
- Rückkehr zur gespeicherten Scrollposition korrigiert: Layout-Ereignisse einer ausblendenden Seite überschreiben den gespeicherten Wert nicht mehr. Beide vorhandenen Rückkehrprüfungen bestanden.
- Siehe `release-audit-evidence/responsive-verification-2026-10-16.json` und die Messwerte in `release-audit-evidence/responsive-final-2026-10-16/`.
