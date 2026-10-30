# App-Start und Marken-Ersatzgrafik · 21.10.2026

Beim Prüfen war Port 3004 nicht erreichbar. Der lokale Vorschau-Server wurde neu gestartet. Die genaue zuvor im offenen Browser aufgetretene React-Ausnahme liegt nicht vor; aus dem Screenshot allein lässt sie sich nicht bestimmen.

Die Fehlerseite verwendete das gewählte 3D-Logo, fiel bei fehlgeschlagener Bildanfrage aber auf eine anders gezeichnete flache Moschee zurück. `NurMark` enthält jetzt eine 64-Pixel-WebP-Miniatur derselben ausgewählten 3D-Moschee. Diese Ersatzgrafik steckt als Daten-URL im JavaScript und braucht keine zusätzliche Netzwerkanfrage. Der normale 512-Pixel-Logopfad bleibt erhalten. Die Miniatur wird durch `scripts/generate-brand-fallback.mjs` reproduzierbar erzeugt; Quellprüfsumme und Dateiformat werden getestet.

Der Knopf „App neu laden“ verwirft außerdem den aktuellen app-eigenen Navigationseintrag vor dem Neuladen. So stellt die App nicht erneut die eventuell fehlerhafte Detailansicht her. Andere History-Daten sowie lokal gespeicherte Fortschritte bleiben erhalten. Der normale Zurück-Verlauf wird dadurch nicht verändert; die Bereinigung wird nur über den Fehlerseitenknopf ausgelöst.

## Prüfung

- Vollständiges `npm run check`: 1.145 Tests in 62 Dateien, statische Prüfungen, TypeScript, Build und Bundlegrenzen bestanden. [Protokoll](app-recovery-2026-10-21/check.log).
- 31 Browserprüfungen für Start, Hauptbereiche, Navigation, Neuladen, Logos und verschiedene Displaygrößen bestanden. [Protokoll](app-recovery-2026-10-21/browser-startup.log).
- Nach der letzten Korrektur am Fehlerseitenknopf drei vorhandene Browserprüfungen für Hauptnavigation, Zurück/Vorwärts und Konsolenfehler erneut bestanden. [Endlauf](app-recovery-2026-10-21/browser-final.log). Die Änderung am Recovery-Verlauf selbst ist durch einen gezielten Unit-Test abgesichert.
- [Startseite bei 390 Pixel Breite](app-recovery-2026-10-21/home-390.jpg), [Quellprüfsummen](app-recovery-2026-10-21/source-fingerprint.json).

Die eingebettete Miniatur umfasst 726 Bildbytes. Die JS-Obergrenze steigt begründet um ein gerundetes KB von 390 auf 391 KB; Gesamtgrenze 511 KB und Startgrenze 95 KB bleiben unverändert und werden eingehalten. Keine zusätzliche Abhängigkeit und keine neue Bildgenerierung.
