# Handy-Kurzprüfung vom 15.10.2026

Geprüft wurde die lokale Vorschau auf Port 3004, jeweils Start, Gebet, Quran, Lernen und Mehr bei 320 × 740 und 390 × 844 CSS-Pixeln. Gemessen wurden gerenderte Text- und Schaltflächenrechtecke sowie Schriftgrößen; bei 390 Pixeln zusätzlich Bildladezustand und Bildgrenzen. Dies ist eine gezielte Layoutprüfung der Hauptseiten, keine vollständige Funktions- oder Geräteabnahme.

## Ergebnis

- Auf allen zehn Hauptseitenansichten entspricht die Dokumentbreite der Bildschirmbreite. Keine gemessenen Text- oder Schaltflächenrechtecke ragen seitlich heraus.
- Bei 390 Pixeln wurden auf den fünf Hauptseiten keine fehlgeschlagenen oder seitlich überlaufenden sichtbaren Inhaltsbilder festgestellt.
- Kleine Begleittexte sind noch zu klein für eine pauschale Aussage, dass bereits alles gut auf Handys lesbar ist: zum Beispiel Standort-/Datumszusätze auf Start mit 9–11 Pixeln, Tagesstatus bei Gebet mit 8,16 Pixeln, Quran-Hinweistext mit 10 Pixeln und Profilhinweis bei Mehr mit 8,64 Pixeln.
- Einzelne Tippflächen unterschreiten das hier verwendete Komfortziel von 44 × 44 Pixeln. Bei 390 Pixeln betrifft dies auf Gebet unter anderem Standort (40 Pixel hoch), Monatsplan (36), Monatsnavigation (40 × 40) und Notiz hinzufügen (38). Die drei Quran-Filter sind 42 Pixel hoch. Bei 320 Pixeln kommen insbesondere die dicht angeordneten Kalenderfelder hinzu.
- Die Bilder und das Grundlayout sind somit bereits an Handybreiten angepasst. Kleine Informationstexte und einzelne Bedienflächen brauchen noch eine gezielte Überarbeitung.

## Grenzen und nächste Schritte

Die kürzlich geänderten Quran- und Gebetsansichten wurden zusätzlich durch bestehende Browserprüfungen bei 320, 390 und 768 Pixeln geprüft. Daraus folgt keine Prüfung jeder Unterseite, jedes Dialogs oder jeder Browser-Textvergrößerung. In dieser Kurzprüfung wurde keine Bedienung auf einem echten iPhone oder Android-Gerät getestet, insbesondere keine Geräte-Sensoren, Systemschriftvergrößerung, Bildschirmtastatur oder installierte PWA.

Als nächster Schritt sollten kleine Informationstexte lesbarer und kompakte Schaltflächen fingerfreundlicher werden. Anschließend sind große Systemschrift und echte Geräte zu prüfen. In dieser Kurzprüfung wurde der App-Code nicht geändert.

Messwerte: [JSON](release-audit-evidence/mobile-main-pages-review-2026-10-15.json). Ansicht: [Quran bei 320 Pixeln](release-audit-evidence/mobile-main-pages-quran-320-2026-10-15.jpg).
