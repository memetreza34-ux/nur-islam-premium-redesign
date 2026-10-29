# Abschließender Design-Durchgang · 18.10.2026

Aktueller gestalterischer Nachtrag: [Ruhigere Flächen und kompaktere Einleitungen · 19.10.2026](SURFACE-HIERARCHY-2026-10-19.md). Die folgenden Ergebnisse dokumentieren den vorherigen Stand.

## Umfang

Gezielter Feinschliff des bestehenden Designs. Grundlage bleiben Smaragdgrün, Creme, Gold, die Bogenform und die vorhandenen 3D-Bildfamilien. Keine Umstrukturierung der Bereiche und keine Änderung religiöser Quelldaten.

Die Prüfung umfasst die fünf Hauptbereiche, die über „Mehr“ erreichbaren Themen und Dienste, Konto, Notizen, Rechtliches, vier allgemeine Dialoge, den Quran-Leser mit drei Lesearten sowie Wudu und Gebetsablauf. Die responsive Suite vermisst 50 Ansichten pro Bildschirmformat. Für normale Handy- und Tabletbreite werden zusätzlich Einstieg und Ende der scrollbaren Ansichten fotografiert. Das ist eine Stichprobe konkreter Zustände, keine Prüfung jeder möglichen Kombination aus Inhalt, Einstellungen und Gerät.

## Korrekturen

- **Kopfzeilen:** Titel und obere Beschriftung dürfen ausgewogen umbrechen. Die vorherige Einzeilen-Kürzung entfällt. Das hilft langen Titeln und vergrößerter Schrift.
- **99 Namen:** Arabischer Name, Umschrift und Bedeutung erhalten innerhalb der Zeile einen gemeinsamen breiteren Textbereich. Nummer und beide Aktionen bleiben getrennt. Die bisherige zusätzliche arabische Spalte entfällt; alle 99 Namen und Bedeutungen bleiben erhalten.
- **Gebetsliste:** Vier Pixel Abstand zwischen den Textzeilen verhindern die im zusätzlichen Lauf beobachtete Überschneidung zwischen arabischem Namen und deutscher Beschreibung. Die kompakte Uhrzeit-/Aktionsanordnung und 48-Pixel-Tippflächen bleiben bestehen.
- **Quran-Ladezustand:** Während eines laufenden Abrufs heißt die Kopfzeile „Wird geladen“. Ohne verfügbaren Inhalt behauptet sie nicht länger „Lesetexte geladen“. Die vorhandenen detaillierten Lade-, Fehler- und Offlinehinweise bleiben erreichbar.
- **Lesearten:** Das Raster reagiert auf die benötigte Schriftbreite. Bei großer Schrift dürfen die drei Lesearten untereinander stehen; Beschriftungen werden vollständig angezeigt.

## Prüfqualität

Die Aufnahmen warten auf die lokalen nachgeladenen Wudu-/Kompass-Komponenten und auf Schriften. Das Dekodieren sichtbarer Bilder hat eine begrenzte Wartezeit, damit verzögert aktivierte Lazy-Images den Rundgang nicht unbegrenzt blockieren. Fehlende Bilddateien werden durch die vorhandenen Asset-/Fallback-Prüfungen gesondert kontrolliert.

Die beiden Schriftgrößentests des deutschen Leseflusses verwenden ausdrücklich synthetische, als „Prüftext“ erkennbare Absätze. Sie prüfen Schrift und Zeilenumbruch unabhängig von der Erreichbarkeit des Übersetzungsanbieters. Diese Texte sind keine Quran-Übersetzung, werden ausschließlich in Tests eingesetzt und gelangen nicht in die App. Die separate Quran-Quellensuite prüft Abruf-, Cache-, Offline- und Fehlerzustände.

## Prüfergebnis

- **31 Browserprüfungen im abschließenden Lauf bestanden.** Darin: fünf responsive Rundgänge, Gestaltung, Einführung, Quellen-Dialoge, Namensliste und große Schrift.
- **250 vermessene Ansichten:** 50 je Format bei 320 × 740, 390 × 844, 844 × 390, 768 × 1024 und 1024 × 768. Keine erfassten Texte unter 12 px, keine vertikal abgeschnittenen Textknoten und kein seitlich überstehender Text. Die Suite prüft außerdem Eingabegrößen, Navigation und Tippflächen; kurze Textlinks und schmale Kalenderzellen sind gesondert ausgenommen.
- Der gezielte vorherige Lauf mit **21 Tests** für Namensliste, große Schrift, Gebetsminiaturen und Quran-Quellen-/Offlinezustände bestand ebenfalls.
- **`npm run check` bestanden:** 1.141 Tests in 61 Dateien, TypeScript, sämtliche eingebundenen statischen Prüfungen, Produktionsbuild und Bundlegrenze. Bundle weiterhin 510 KB gzip bei 511 KB Grenze.
- **273 komprimierte Bildschirmaufnahmen** mit Prüfsummen der PNG-Originale und JPEG-Ausgaben. [Bildübersicht der Detailkorrekturen](final-design-review-2026-10-18/detail-overview.jpg), [Bildverzeichnis](final-design-review-2026-10-18/screenshots.json), [Messwerte und Nachweis](final-design-review-2026-10-18/verification.json), [Quellfingerabdruck](final-design-review-2026-10-18/source-fingerprint.json), [Prüfkette](final-design-review-2026-10-18/check.log).
- Keine neue CSS-Datei und keine weitere Override-Schicht. CSS von 884.015 auf **883.423 Bytes** reduziert; Anzahl der `!important`-Deklarationen unverändert bei 2.229.

Frühere fehlgeschlagene Läufe sind aufbewahrt: Eine Tablet-Geometriemessung meldete die Uhr außerhalb des Sichtbereichs; die unmittelbar danach erzeugte Aufnahme zeigte sie innerhalb der ersten Bildschirmfläche. Der genaue Auslöser dieses Zwischenstands ist nicht abschließend geklärt. Die Prüfung wartet jetzt auf die sichtbare Geometrie innerhalb von fünf Sekunden, statt nur einmal zu messen; ein dauerhaft außerhalb liegendes Element würde weiterhin fehlschlagen. Zwei Lesetests hingen von nicht rechtzeitig verfügbaren Anbietertexten ab; nur diese Gestaltungsprüfungen verwenden jetzt synthetische Texte. Der neu ergänzte Bildaufnahme-Helfer wartete außerdem unbegrenzt auf Lazy-Images; seine Wartezeit ist nun begrenzt. Die dabei entdeckte Überschneidung einer arabischen Gebetsbeschriftung wurde in der App korrigiert. [Erster Lauf](final-design-review-2026-10-18/initial-browser-run.log), [Zwischenlauf](final-design-review-2026-10-18/intermediate-browser-run.log), [Endlauf](final-design-review-2026-10-18/final-browser-run.log).

## Ehrliche Einordnung

Die Gestaltung bildet eine zusammenhängende App. Die Kernansichten wirken am stärksten: Start, Gebetszeiten, Quran, Lernen und der grüne Kompass. Die textreichen Informations- und Lernseiten sind bewusst sachlicher; nicht jeder Bereich braucht eine weitere Illustration. Gold und Konturen sind weiterhin deutlich Teil der Gestaltung, besonders in langen Listen. Das ist eine Stilentscheidung, keine pauschale Barrierefreiheitsfreigabe.

Der nächste sinnvolle Abnahmeschritt ist die Benutzung auf echten Geräten, besonders mit größerer Systemschrift, eingeblendeter Tastatur und im installierten Modus. Die Browserprüfung belegt die hier dokumentierten Formate und Zustände. Sie ersetzt weder diese Geräteabnahme noch eine Store-Freigabe.
