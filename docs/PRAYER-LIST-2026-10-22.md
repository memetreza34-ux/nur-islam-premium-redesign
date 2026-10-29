# Gebetsliste · 22.10.2026

Die Liste unter „Gebet“ zeigt Gebetsname und Uhrzeit direkt untereinander. Die ursprünglichen sechs 3D-Icons bleiben erhalten. Alle sechs Zeilen verwenden passende Tageszeit-Landschaften als Hintergrund. Sonnenaufgang hat eine neue Beleuchtungsvariante der vorhandenen Oasenlandschaft erhalten; Prompt, Original und Herkunft sind dokumentiert. Eine dunkle Grünauflage blendet die Bilder hinter der Beschriftung zurück. Die Zeilen haben sechs Pixel Abstand und weiche Ecken statt einer durchgehenden Streifenfläche. Der tiefere Ausschnitt zeigt mehr Landschaft; die Schalter sind heller. Die vorhandenen Erinnerungs- und Gebetet-Schalter stehen rechts und behalten 48-Pixel-Tippflächen.

Arabische Namen und Tageszeit-Erklärungen bleiben im Lernbereich erhalten (`LearnScreen.tsx`, `PRAYER_LESSONS`). Die Quellen- und Gebetszeitdaten wurden nicht verändert. Der Gebetsbogen heißt wie auf der Startseite „Nächstes Gebet“, gegebenenfalls mit „· morgen“.

Sechs Browserprüfungen bestanden: fünf Breiten (320, 360, 390, 430 und 768 Pixel) sowie fehlgeschlagene Icon- und Hintergrundanfragen. Geprüft werden dekodierte Icons und Hintergründe, vollständige Namen, Uhrzeiten unter den Namen, Text-/Schalterüberschneidungen und die Markierungsfunktion. Fehlende Bilder lassen Text und Aktionen erhalten. Aufnahmen warten auf die Bilddekodierung; die Handyaufnahmen wurden zusätzlich visuell geprüft.

`npm run check` vollständig bestanden: 1.145 Tests in 62 Dateien, statische Prüfungen, TypeScript, Build und Bundlegrenzen. CSS: 880.935 statt zuvor 881.647 Bytes; 2.214 statt 2.220 `!important`-Deklarationen. Die Quellprüfungen schützen die gestapelte Beschriftung und Hintergrundebene.

[Browserprotokoll](prayer-list-2026-10-22/browser.log), [Prüfkette](prayer-list-2026-10-22/check.log), [Handyaufnahme](prayer-list-2026-10-22/list-390.jpg), [kleines Handy](prayer-list-2026-10-22/list-320.jpg), [Tablet](prayer-list-2026-10-22/list-768.jpg). Die Aufnahmen enthalten feste Browser-Prüfdaten und sind kein aktueller Gebetsplan.

Das neue Motiv liegt unter `public/premium-assets/high-res-objects/prayer-oasis-sunrise-v1.webp`. Prompt und Original sind unter `output/imagegen/prayer-sunrise-20261022/` gespeichert. Erzeugung: Codex Built-in Imagegen, danach WebP-Konvertierung. Offline-Cache und Registrierung wurden gemeinsam auf Version 118 angehoben.

Kompaktere Fassung: Zeilenhöhe von 80 auf 64 Pixel, vertikaler Innenabstand von 12 auf 6 Pixel, Abstand zwischen Karten von 8 auf 6 Pixel reduziert. Schriftgrößen und 48-Pixel-Tippflächen bleiben erhalten. Nach dieser CSS-Anpassung erneut sechs Browserfälle samt Build sowie Layout-/Stylesheet-Prüfungen bestanden; die vollständige Prüfkette oben bezieht sich auf den unmittelbar vorherigen Stand.
