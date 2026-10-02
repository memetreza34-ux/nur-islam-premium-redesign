# Die vier sunnitischen Rechtsschulen

Stand: 2. September 2026. Vom Nutzer ausdrücklich gewünschter zusätzlicher Katalog.

## Aufbau

Unter Lernen → Dein Grundlagenpfad → Die vier Rechtsschulen als eigene Kategorie im Zwei-Spalten-Raster. Kein zusätzlicher Eintrag unter „Weitere Funktionen“. Der Katalog enthält vier gleichwertige Karten in zwei Spalten, auch auf schmalen Bildschirmen. Kein Ranking, kein Auswahlzwang und keine Einstellung der persönlichen Rechtsschule.

Jede Detailseite enthält Kurzbeschreibung, Namensgeber und Lebensdaten, Geschichte, drei methodische Schwerpunkte, Verbreitung, praktische Einordnung sowie Fachartikel und institutionelle Startseiten. Rückkehr über den App-Zurück-Button stellt die Position im Katalog wieder her. Die bisherigen Gebetsvergleiche bleiben unverändert.

## Quellen und Grenzen

Historische Rechtsschulen besitzen keine jeweils zentrale, weltweit verbindliche offizielle Homepage. Die App kennzeichnet stattdessen Startseiten der Institutionen und direkte Fachartikel. Keine Institution wird als alleinige Vertretung einer Schule bezeichnet.

Grundlage sind die vier Fachartikel der [TDV İslâm Ansiklopedisi](https://islamansiklopedisi.org.tr/):

- [Hanafitische Schule](https://islamansiklopedisi.org.tr/hanefi-mezhebi)
- [Malikitische Schule](https://islamansiklopedisi.org.tr/maliki-mezhebi)
- [Schafiitische Schule](https://islamansiklopedisi.org.tr/safii-mezhebi)
- [Hanbalitische Schule](https://islamansiklopedisi.org.tr/hanbeli-mezhebi)

Weitere Fachlinks: Dar al-Ifta Ägypten, marokkanisches Ministerium für Stiftungen und Islamische Angelegenheiten, Al-Azhar und Oxford Bibliographies. Exakte URLs stehen bei der jeweiligen Schule in `src/data/madhhabCatalogueData.ts`. Sprachen werden angezeigt; externe Links öffnen mit `noopener noreferrer`. Ein bibliografischer Eintrag kann einen kostenpflichtigen Volltext enthalten.

Die Texte sind eigenständige vereinfachte Zusammenfassungen, keine Fatwas. Unterschiede innerhalb der Schulen sind nicht vollständig dargestellt. Neue Inhalte stehen als ungeprüft in der generierten religiösen Prüfmappe. Eine menschliche fachliche Freigabe ist vor Veröffentlichung erforderlich; technische Tests belegen keine religiöse Richtigkeit.

## Technik

Eigener nachgeladener Katalog, keine zusätzliche Laufzeitbibliothek oder KI-Funktion. Bestehende Gestaltung wird wiederverwendet. Die neuen Stilregeln benötigen kein `!important` und keine zusätzliche Override-Datei. Das Gesamtbudget berücksichtigt die ausdrücklich ergänzte Oberfläche; das Startpaket behält sein separates Limit.

## Prüfung

`npm run check` bestanden: 57 Projektprüfungen, 227 Tests, TypeScript und Produktionsbuild. Fünf Tests schützen Vollständigkeit und HTTPS-Links des neuen Datenmoduls, nicht dessen religiöse Richtigkeit. Im Browser geprüft: alle vier Detailseiten, Fach- und Startseitenlinks, lesbare Darstellung bei 320, 390 und 768 Pixeln. Rücksprung bei unveränderter Bildschirmgröße: 386 px vor dem Öffnen und 386 px nach der Rückkehr. Die Darstellungsprüfung ersetzt keinen Test auf echten Mobilgeräten.
