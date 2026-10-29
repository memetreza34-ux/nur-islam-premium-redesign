# Designvereinheitlichung · 18.10.2026

Die neun Gestaltungsprobleme aus dem [Design-Audit](DESIGN-AUDIT-2026-10-18.md) sind umgesetzt und im Browser nachgeprüft. Die bestehende smaragdgrüne, cremefarbene und goldene Gestaltung sowie die 3D-Bildfamilien bleiben die Grundlage. Der Produktumfang und die religiösen Quelldaten wurden dafür nicht erweitert.

## Nachprüfung der Gebetsliste nach Nutzerhinweis

Die vorherigen Prüfungen erkannten Überbreite des Dokuments, aber nicht alle Überlagerungen innerhalb einzelner Gebetszeilen. Auf Handys stehen Uhrzeit und Aktionen jetzt kompakt in der rechten Spalte. Die schweren Buttonrahmen entfallen; die Tippflächen bleiben 48 × 48 Pixel groß. Alle Uhrzeiten schließen an derselben rechten Kante ab. Namen erscheinen vollständig, lange Beschreibungen dürfen bei Bedarf am Wortteil „gebet“ umbrechen. Sonnenaufgang hat keine leeren Aktionsfelder. Das lange Hijri-Datum darf ausgewogen umbrechen.

Die gezielte Prüfung vermisst die tatsächlichen Textrechtecke und kontrolliert sie gegen ihre eigenen Flächen, Uhrzeiten und Schaltflächen. **Zehn Browserprüfungen bestanden**, darunter 320, 360, 390, 430 und 768 px, Bild-Fallback, Datumsnavigation und Monatsplan. Alle zehn Tests bestanden gemeinsam auf dem abschließenden Stand. Eine vorherige Messrundung (47,99994 statt 48 px) wurde mit 0,01 px Toleranz berücksichtigt; die früheren Protokolle bleiben erhalten. Die vollständige Prüfkette mit 1.141 Tests bestand ebenfalls. Die CSS-Grenze wurde weiter auf 884.015 Bytes abgesenkt. [Aktuelle Bilder und Nachweis](release-audit-evidence/prayer-row-compact-2026-10-18/verification.json). Die folgenden Vergleichsbilder und der dortige Quellfingerabdruck dokumentieren den Stand vor diesem Nachtrag.

## Abschließender Feinschliff

Der anschließende visuelle Rundgang mit zusätzlichen Korrekturen an Kopfzeilen, Namensliste, Gebetszeilen und Quran-Lesearten ist im [Abschlussbericht](FINAL-DESIGN-REVIEW-2026-10-18.md) dokumentiert. Dieser Bericht enthält den neueren Prüfstand und die verbleibenden Grenzen.

## Umsetzung und Belege

| Auditpunkt | Umgesetztes Ergebnis | Nachweis |
|---|---|---|
| 1 · Kleine Leseschrift | Deutscher Quran-Buchtext beginnt bei 17 px. Dua-Lesetext verwendet 16 px; erklärende Texte je nach Rolle 14–16 px. Hilfe, Rechtliches und Premium verwenden dieselben Rollen. Lange Anbieter-Adressen dürfen umbrechen. | [Quran-Leser](design-unification-2026-10-18/screenshots/390-german-reading.png), Test `reading text is legible by default`, 250 vermessene Ansichten ohne Text unter 12 px oder abgeschnittene Textknoten. |
| 2 · Ayah-Kontrast | Dunkelgrüne Beschriftung und Aktionen auf Creme. Das Quellen-Badge besteht den Kontrasttest mit mindestens 4,5:1. | [Ayah im Fokus](design-unification-2026-10-18/screenshots/390-ayah.png), Kontrastberechnung aus den tatsächlich berechneten Vorder- und Hintergrundfarben in `e2e/design-unification.spec.ts`. |
| 3 · Handy-Raster | „Mehr“ und die Widget-Auswahl verwenden auf Handys volle Zeilen. „Gebetszeiten“ bleibt bei allen fünf Prüfformaten zusammen. | [Mehr auf Handy](design-unification-2026-10-18/screenshots/390-more.png), [Widgets](design-unification-2026-10-18/screenshots/390-widgets.png); Zeilen- und Geometrietests. |
| 4 · Einführungsausschnitt | Die zusätzliche Vergrößerung der Moschee entfällt auch in beiden kleinen Breakpoints. Beide Minarette bleiben vollständig sichtbar. | [320 px](design-unification-2026-10-18/screenshots/320-onboarding.png), [390 px](design-unification-2026-10-18/screenshots/390-onboarding.png), [Tablet](design-unification-2026-10-18/screenshots/768-onboarding.png); geladene Bilddatei, Bildgrenzen und Skalierung geprüft. |
| 5 · Zu große Einleitungen | Lernen beginnt mit einer flachen Einleitung. Quran-Lesearten und Speicherhinweise stehen in einer aufklappbaren Infozeile. Im Leser ist der Kopfbereich kleiner. Ayah-Karten passen ihre Höhe an den Inhalt an und enthalten eine einzige Kopieraktion. | [Lernen](design-unification-2026-10-18/screenshots/390-learn.png), [Quran](design-unification-2026-10-18/screenshots/390-quran.png), Ayah-Bild; Tests für erreichbare Speicherhinweise, Quellen und Kopieraktion. |
| 6 · Querformat | Bei geringer Höhe stehen Kopfbereich und Gebetsbogen nebeneinander. Die vollständige Hauptuhr liegt oberhalb der unteren Navigation. | [Start im Querformat](design-unification-2026-10-18/screenshots/844-home.png); Uhr- und Navigationsgrenzen in allen fünf Formaten geprüft. |
| 7 · Tabletverteilung | Die Gruppen unter „Mehr“ fließen in zwei Spalten mit zusammengehaltenen Gruppen. Auf Handys bleiben sie einspaltig. Das Tablet nutzt das breitere App-Layout; der Lesebereich bleibt begrenzt. | [Mehr auf Tablet](design-unification-2026-10-18/screenshots/768-more.png), [Tablet quer](design-unification-2026-10-18/screenshots/1024-more.png); Spaltenzahl, Dokumentbreite und 50 Ansichten pro Format geprüft. |
| 8 · Bildrollen | Ummah nutzt den vorhandenen Globus. Zakat erhält ein eigenes Rechner-/Münzmotiv. Ortsbilder sind als Illustrationen gekennzeichnet und bilden eine eigene Informationsfamilie. Matte Gegenstände, ruhige Zeitlandschaften und Handlungsfiguren behalten ihre jeweiligen Aufgaben. | [Ummah](design-unification-2026-10-18/screenshots/390-ummah.png), [Zakat](design-unification-2026-10-18/screenshots/390-zakat.png), Bildzuordnungs- und Herkunftsprüfungen. |
| 9 · Akzente und Hierarchie | Akzenttext, Hauptaktionen und Auswahlzustände verwenden zusammengehörige Farbvariablen. Die Hauptbutton-Verläufe reagieren auf Saphir, Pflaume und Sand. Flache Einleitungen, kompakte Hinweise und weniger verschachtelte Icon-Rahmen reduzieren die Konkurrenz zu den Hauptaktionen. | [Saphir](design-unification-2026-10-18/screenshots/390-accent-sapphire.png), [Pflaume](design-unification-2026-10-18/screenshots/390-accent-plum.png), [Sand](design-unification-2026-10-18/screenshots/390-accent-sand.png); Variablen und berechnete Hauptbutton-Farben geprüft. |

## Prüfung

- `npm run check`: sämtliche 57 eingebundenen Prüfschritte, **61 Testdateien mit 1.141 Tests**, TypeScript und Produktionsbuild bestanden.
- Bundle: **510 KB gzip** innerhalb des bestehenden 511-KB-Limits; Einstieg 94 KB innerhalb von 95 KB.
- **59 unterschiedliche Browser-Tests** erfolgreich abgeschlossen: Design, vollständige responsive Rundgänge, Premium, Quran-Quellenintegrität, Quellen-Info, Zurück-Navigation und Qibla.
- Der breite Browserlauf bestand 58 von 59 Tests. Der neue Zakat-Bildtest suchte fälschlich ausschließlich im Hauptverzeichnis; Zakat liegt im Serviceverzeichnis. Nach der reinen Testkorrektur bestand die gesamte 13-teilige Designsuite. Die vollständigen Protokolle bleiben erhalten; der zwischenzeitliche Testfehler ist nicht ausgeblendet.
- Fünf Formate: **320 × 740, 390 × 844, 768 × 1024, 1024 × 768 und 844 × 390**. Jeweils 50 Ansichten vermessen: keine seitlich überstehenden oder abgeschnittenen Textknoten, keine zu kleinen Formulareingaben und keine Texte unter dem 12-px-Metadatenminimum. Das ist kein pauschaler 16-px-Mindestwert für sämtliche kurzen Metadaten.
- Zusätzlich: drei Einführungsschritte, vier Akzente, vollständige Bildausschnitte sowie Hauptbereiche und Quran-Leser mit **verdoppelter Grundschrift**. [Große Leseschrift](design-unification-2026-10-18/screenshots/390-large-type-reader.png).
- Die bestehenden Quellen-, Offline- und Navigationsprüfungen bleiben aktiv. Speicherhinweise und Warnungen sind weiterhin erreichbar.
- Keine zusätzliche CSS-Datei oder weitere Override-Schicht. Unbenutzte Regeln der früheren Qibla-Ansicht wurden entfernt. Die Grenzen wurden auf **2.229 `!important`-Deklarationen und 884.671 CSS-Bytes** abgesenkt. Der aktuelle grüne Vektorkompass blieb erhalten und bestand seine eigenen Tests. [Bereinigungsnachweis](design-unification-2026-10-18/retired-qibla-css.json).

[Messwerte, Bildprüfsummen und Testprotokolle](design-unification-2026-10-18/evidence.json) · [Quellstand](design-unification-2026-10-18/source-fingerprint.json) · [Vollständige Prüfkette](design-unification-2026-10-18/check.log)

## Neues Bild

Das neue [Zakat-Rechner-Motiv](../public/premium-assets/high-res-objects/zakat-calculator-v1.webp) wurde mit der **eingebauten Bildgenerierung** erstellt. Die eigenen Fasten- und Quran-Illustrationen dienten ausschließlich als Stilreferenzen. [Vollständiger Prompt und Eingaberollen](../output/imagegen/design-unification-20261018/prompts.json), [PNG-Original](../output/imagegen/design-unification-20261018/zakat-calculator.png). Die 512 × 512 Pixel große WebP-Ausgabe bewahrt die erzeugte Transparenz. Herkunft und SHA-256 stehen im [Bildmanifest](image-asset-provenance.json).

## Maßstab und Grenzen

Als Maßstab dienten Apples Hinweise zu Bildausschnitten, Kontrast, Layout und mindestens 44 pt großen Tippzielen sowie Googles Empfehlung von 48 dp für Android-Tippziele: [Apple Design Tips](https://developer.apple.com/design/tips/), [Google Android Accessibility](https://support.google.com/accessibility/android/answer/7101858?hl=en). Die zentrale Steuerungsgröße der Web-App beträgt nun 48 CSS-Pixel; die breiten Browserprüfungen kontrollieren mindestens 44 CSS-Pixel hohe Bedienelemente. Native pt/dp und Web-CSS-Pixel sind unterschiedliche Einheiten. Schmale Kalenderzellen und eingebettete Textlinks werden in den Messdaten gesondert behandelt.

Die visuelle Umsetzung ist abgeschlossen. Browseremulation ersetzt keine abschließende Prüfung auf echten Geräten. Eine Freigabe durch App Store oder Google Play wurde weder durchgeführt noch zugesichert. Impressum, tatsächliche Hosting-Datenschutzangaben, Rechte und die weiteren Release-Voraussetzungen aus `AGENTS.md` bleiben eigenständige Abnahmepunkte.
