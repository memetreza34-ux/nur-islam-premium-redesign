# Gebetsverweise und Quran-Einstieg — 25.10.2026

Die sechs bestehenden Gebetsverweise stehen in drei Gruppen: Gebetspraxis, Duas & Dhikr, Moscheen & Fasten. Jede Gruppe hat zwei gleich gestaltete Themenkarten mit den vorhandenen 3D-Motiven. Die doppelte Überschrift „Rund ums Gebet / Direkt weiter“ entfällt.

Der Quran-Einstieg verwendet wieder den Garten im Mihrab-Bogen. Sure und tatsächlich gespeicherte Ayah stehen mittig; die breite Leseschaltfläche steht darunter. Ohne gespeicherte Lesestelle gibt es „Lesen beginnen“ und keine vorgetäuschte Ayah-Position. Auf Tablets bleiben Bogen und Schaltfläche auf 420 px begrenzt. Suche, Favoriten, Quelleninformationen und der vollständige Katalog bleiben erhalten.

## Prüfung

- Browser: Gruppen und Quran-Bogen bei 320, 390 und 768 px; Screenshots visuell geprüft.
- Alle sechs Verweise öffnen ihr Ziel. Weiterlesen öffnet die tatsächlich gespeicherte Ayah. Neuer Lesestart, Suche, Favoriten und fehlendes Bild funktionieren.
- TypeScript, Produktionsbuild, Bildzuordnung, Persistenzregeln, Layout-, Symbol- und CSS-Prüfungen bestanden.
- Bundle: 496 KB gzip innerhalb 511 KB. CSS-Gesamtgröße sinkt gegenüber dem vorherigen Stand von 797.687 auf 797.072 Bytes.

Browserprotokolle: `/tmp/nur-prayer-quran-layout-20261025.log`, `/tmp/nur-prayer-quran-layout-final-20261025.log`, `/tmp/nur-quran-tablet-final-20261025.log`. Zwei Tablet-Geometrieabweichungen wurden korrigiert und gezielt erneut geprüft.
