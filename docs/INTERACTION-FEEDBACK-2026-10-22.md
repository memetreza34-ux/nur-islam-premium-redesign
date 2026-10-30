# Einheitliche Bedienrückmeldung · 22.10.2026

Aktive Buttons, Links mit Ziel, Details-Zusammenfassungen und Elemente mit Button-Rolle teilen die Rückmeldung aus `premium-motion-performance-lock.css`: Mit feinem Mauszeiger sechs Prozent heller, beim Drücken sechs Prozent dunkler. Der Übergang dauert 140 Millisekunden. Bei reduzierter Bewegung erfolgt der Zustandswechsel sofort. Deaktivierte und als deaktiviert ausgezeichnete Elemente erhalten diese Rückmeldung nicht; ihre bisherigen deaktivierten Farben bleiben erhalten. Tastatur-Fokusränder und Auswahlzustände bleiben erhalten.

66 alte Hover-/Druckregeln aus 37 bestehenden Stylesheets sowie eine Hover-Regel aus dem zentralen App-Stylesheet wurden entfernt beziehungsweise aus gemischten Selektoren herausgelöst. Nicht zugehörige Fokusregeln bleiben bestehen. Fünf unterschiedliche `whileTap`-Skalierungen in Start, Lernen und Mehr entfallen. Bilder und Karten verschieben oder vergrößern sich beim Darüberfahren nicht mehr. Statische Flächen reagieren nicht; bei Karten mit mehreren Aktionen reagiert das jeweilige Bedienelement. Keine neue Stylesheet-Ebene.

Die vorhandenen Micro-UI- und Touch-Prüfungen schützen die gemeinsame Regel, Maus-Abfrage, deaktivierte Zustände und reduzierte Bewegung. Komponenten dürfen keine eigenen Hover-/Druckregeln danebenführen.

24 Browserprüfungen bestanden: fünf neue Interaktionsfälle, 18 bestehende Kernabläufe und die bestehende Prüfung für reduzierte Bewegung. Geprüft wurden beide Farbschemata, alle fünf Hauptseiten, stehende Karten-/Bildgrenzen beim Hover, mobile Druckreaktion ohne klebenden Hover, unveränderte Favoriten-/Erinnerungszustände beim Hover, deaktiviertes Aktualisieren und sichtbarer Tastaturfokus. Die beiden zunächst falschen Testannahmen wurden korrigiert: deaktivierte Schalter behalten ihre vorhandene Entsättigung, und die Tastaturprüfung beginnt innerhalb der App statt hinter dem letzten Navigationsknopf im Browserrahmen.

`npm run check` vollständig bestanden: 1.145 Tests in 62 Dateien, statische Prüfungen, TypeScript, Build und Bundlegrenzen. Stylesheet-Umfang: 863.515 statt 878.599 Bytes; 2.184 statt 2.204 Important-Regeln. Der CSS-Budgetwert wurde entsprechend abgesenkt.

[Browserprotokoll](interaction-feedback-2026-10-22/browser.log) · [Prüfkette](interaction-feedback-2026-10-22/check.log) · [Zusammengeführte Regeln](interaction-feedback-2026-10-22/consolidated-rules.json)
