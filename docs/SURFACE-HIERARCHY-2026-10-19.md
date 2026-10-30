# Ruhigere Flächen · 19.10.2026

## Gestaltung

Der bestehende grün-creme-goldene Stil und die 3D-Motive bleiben erhalten. Dieser Durchgang verändert die Gewichtung der Flächen:

- Kopfzeilen ohne zusätzliche goldene Außenkontur und Schatten. Die vorhandenen Zurück- und Einstellungsaktionen bleiben erkennbar.
- Unter „Mehr“ erhalten die Verzeichniszeilen weniger Außenrahmen; ihre Flächen und Symbole bleiben als Ziele sichtbar.
- Lernkurse zeigen Einleitung, Lektionskopf, Lesetext und Zusammenfassungen offener. Kursplan und Verständnisfrage bleiben als bedienbare Karten abgesetzt.
- Die Wudu-Einleitung stellt das Motiv neben den Titel und den Erklärungstext darunter auf die volle verfügbare Breite.
- Die Einleitung zu den 99 Namen ist kompakter. Der Hinweis „Traditionelle Lernliste“ bleibt direkt sichtbar. Die ausführliche Einordnung steht vollständig im vorhandenen Quellen-Dialog. Alle 99 Namen bleiben erhalten.

Keine Umstrukturierung der Navigation, keine Änderung religiöser Quelldaten und keine neuen Bilddateien. Bestehende CSS-Regeln wurden angepasst; keine zusätzliche Stylesheet-Schicht. CSS sinkt von 883.423 auf 881.647 Bytes, `!important` von 2.229 auf 2.220. Die Obergrenzen wurden entsprechend gesenkt.

## Nachweis

- 7 gezielte Browserprüfungen für die neuen Flächen und Quellen-Dialoge bestanden, bei 320, 390 und 768 Pixel Breite.
- 27 weitere Browserprüfungen bestanden: Gestaltung, große Schrift, vollständige Namenszeilen, Quran-Leser und responsive Rundgänge. Dabei 250 Ansichten in fünf Formaten vermessen: 320 × 740, 390 × 844, 844 × 390, 768 × 1024 und 1024 × 768. Die vorhandenen Ausnahmen für kurze Textlinks und schmale Kalenderzellen bleiben bestehen.
- Zehn aktuelle Aufnahmen von Handy und Tablet gespeichert; repräsentative Ansichten visuell geprüft. [Lernkurs auf dem Handy](surface-hierarchy-2026-10-19/course-390.jpg), [Wudu-Einleitung](surface-hierarchy-2026-10-19/wudu-intro-390.jpg), [99 Namen](surface-hierarchy-2026-10-19/names-intro-390.jpg), [Mehr](surface-hierarchy-2026-10-19/more-390.jpg), [Lernkurs auf dem Tablet](surface-hierarchy-2026-10-19/course-768.jpg).
- `npm run check` vollständig bestanden: 1.141 Tests in 61 Dateien, statische Prüfungen, TypeScript und Produktionsbuild. Bundle: 510 KB gzip bei 511 KB Grenze. [Prüfkette](surface-hierarchy-2026-10-19/check.log).
- [Messwerte](surface-hierarchy-2026-10-19/measurements.json), [gezielter Browserlauf](surface-hierarchy-2026-10-19/nur-surface-final-20261019.log), [breiter Browserlauf](surface-hierarchy-2026-10-19/nur-surface-responsive-20261019.log), [Quellfingerabdruck](surface-hierarchy-2026-10-19/source-fingerprint.json).

Die Entwicklung des neuen Tests brauchte Korrekturen: Zunächst wurde vor dem Anzeigen der Navigation nach einem Zurück-Knopf gesucht; später wurde der beschriftete Kursknopf „Zurück zu Lernen“ nicht vom zu engen Testselektor erkannt. Beide Probleme lagen im Testablauf. Die abschließenden Läufe sind oben verlinkt.

## Einordnung

Die textreichen Lernseiten wirken jetzt offener; interaktive Elemente heben sich besser vom Lesetext ab. Gold bleibt Teil der Gestaltung, ist aber seltener ein zusätzlicher Außenrahmen. Dies ist ein gezielter gestalterischer Fortschritt, keine vollständige Abnahme auf echten Geräten. Größere Systemschrift, Tastatur und installierter Modus müssen weiterhin auf realen Handys und Tablets erprobt werden.
