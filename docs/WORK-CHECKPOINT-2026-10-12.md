# Arbeitsstand zur GitHub-Sicherung

Stand: 12.10.2026. Sicherung auf `design/claude-design-system`, nicht auf `main`.
Repository: https://github.com/memetreza34-ux/nur-islam-premium-redesign
Basis vor Sicherung: `058b0f7`. Kein Release und keine religiöse Gesamtfreigabe.

## Wo weiterarbeiten

- Zentraler Bericht: `APP-CONTENT-AUDIT-2026-10-11.md`.
- Bestandsaufnahme: 1146 Positionen, 91 ohne Einzelfundstelle, 862 hier verfasst.
  Das sind keine 1146 unabhängigen Aussagen oder 91 erwiesenen Fehler.
- Lerninhalte: 34 zuvor dokumentierte Lektionen; jetzt sechs Gemeinschaftslektionen
  anhand konkreter Quellen abgeglichen/korrigiert. Insgesamt 40/44 und 430/465
  Positionen, vier Seerah-Lektionen/35 Positionen noch offen.
- Neuer Einzelbericht: `COMMUNITY-LEARNING-SOURCE-AUDIT-2026-10-12.md`.
  36 Quellenfelder zu 23 Fundstellen, 20 neue Daten- und neun Browserfälle.
- Wichtigste jüngste Korrekturen: Privatsphäre und Schutzmeldungen in Text/Quiz
  widerspruchsfrei, keine eigene Beweisführung vor Hilfesuchen verlangen,
  Nachbarbegriffe nicht als festen Radius darstellen, beide Tirmidhi-
  Bewertungszuordnungen sichtbar, Schulden-/Handelskontext und Leseschätzungen.
- Noch offen: Seerah, umfangreiche Prophetenkurse, vollständige Wudu-/Salah-
  und Schulvergleiche, Sunnah/Reue, restliche Kalenderanlässe, zusätzliche UI-
  und Dialoginventare sowie die im zentralen Bericht benannten Echtgeräte-/
  Rechte-/Editionsgrenzen. Keine menschliche Freigabe durch KI gesetzt.

## Sicherungsgrenze

Code, Tests, Quellenberichte, generierte Prüfmappe, App-Assets und Logoentwürfe
werden gesichert. Lokale Browser-/Testartefakte in `output/playwright/`,
`test-results/` und `playwright-report/` sind keine App-Quelldateien und bleiben
lokal; keine Umgebungsdateien, Zugangsdaten, macOS-Metadaten oder fremden Projekte.
Keine lokalen Nutzerdaten gelöscht oder überschrieben.

## Verifikation

`npm run check` bestanden: 1028 Tests, Typprüfung, Build und Bundle-Budget
(508 KB gzip). `npm run e2e -- --workers=6` mit lokalem Chrome bestanden:
279 Browserfälle erfolgreich, zwei planmäßig übersprungen. Der 320-px-Umbruch
der Namensbedeutungen wurde nach einem vollständigen Fehlversuch korrigiert und
danach auch im Gesamtbrowserlauf erneut geprüft. `npm run secrets:check` prüfte
679 vorgemerkte Dateien ohne gefundenen Provider-Token, Service-Role- oder
Privatschlüssel. Der Commit- und Push-Nachweis steht im Git-Verlauf.
