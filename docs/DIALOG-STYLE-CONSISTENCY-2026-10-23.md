# Einheitliche Fenster – 23. Oktober 2026

Gemeinsamer Kopfbereich in `src/shared/DialogHeader.tsx`: Titel, optionale Kurzangabe oder vorhandene Themenillustration und 44-px-Schließen-Knopf. Einstellungen, Sprache, Kalender, Tagesnotizen, Gebetsmonat, Quran-Leseeinstellungen, Duas, Namen, Dhikr-Statistik, Moscheedetails und Quellen verwenden dieselbe Gestaltung.

Schrift, Abstände, aktive Auswahl und Hauptschaltflächen liegen im bestehenden Dialog-Stylesheet. Kurze Formulare passen bei 320×568, 390×844 und 768×1024 ohne Scrollen. Lange Lesetexte bleiben vollständig zugänglich; die Kopfzeile bleibt beim Scrollen erreichbar.

Quellen werden vor dem ersten Öffnen vorgeladen. Der Offline-Test wartet auf den vollständig geladenen Gebetsbereich und bestätigt den ersten Quellenaufruf nach dem Wechsel in den Offline-Modus. Native Dialog- und Fokusbehandlung bleiben erhalten.

Validierung: vollständiges `npm run check` mit 1.127 Tests, TypeScript, Build und unverändertem Bundle-Limit bestanden. Drei abschließende Browserabläufe vergleichen Titel, Auswahlstile, Hauptschaltflächenbreiten und Geometrie über die Fenster hinweg; vier zusätzliche Profil-Prüfungen bestätigen Schließen und Fokus-Rückgabe. Kalender-/Notizabläufe, Quellen und Offline-Zugriff separat bestanden.

Sichtbelege: `dialog-style-consistency-2026-10-23/`.

Der frühere Lernplan mit Zahnrad im Lernbereich wurde auf Wunsch entfernt. Die 14 Themenkarten öffnen die Lektionen weiterhin direkt. Die Prüfung der Hauptreiter schützt die Überschrift ohne zusätzliche Einstellungen.
