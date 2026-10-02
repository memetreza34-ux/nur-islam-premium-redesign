# Entfernung des Assistenten · 27.08.2026

Auf ausdrücklichen Betreiberwunsch bietet die App keinen Chat- oder KI-Assistenten mehr.

## Entfernt

- Nur-Assistent: Bildschirm, Vorschläge, Eingabeformular, lokale Antwort-/Suchlogik und NurAssistantIcon.
- Home-Kachel, Vorschau, Navigationsziel und Premium-Home-Einstellung.
- Nur für den Assistenten verwendete Stile sowie Kachelbild, Preload und Offline-Cache-Eintrag.
- Alte Antworttests werden durch `no-assistant:check` und Regressionstests für fehlende Einstiegspunkte, alte Navigation und gespeicherte Einstellungen ersetzt.

Der bisherige Antwortmodus war lokal und band keinen frei generierenden KI-Dienst an. Auch dieser Modus wird nicht mehr ausgeliefert. Browserzustände mit entfernten Zielen werden verworfen. PWA-Shell v19 ersetzt beim nächsten erfolgreichen Update den bisherigen App-Cache. Bereits installierte Offline-Kopien aktualisieren sich erst bei erneuter Verbindung.

## Unverändert

Quran, Gebetszeiten, Qibla, Duas, Lerninhalte, Notizen und Erinnerungen bleiben erhalten. Der bisher als „Fasten-Assistent“ bezeichnete feste Kalender heißt jetzt „Fastenplan“; er erzeugt keine Antworten. Die übrigen statischen KI-generierten Illustrationen bleiben erhalten und weiterhin als solche dokumentiert. Das entfernte Kachelbild steht nur noch als historischer Datensatz unter `retiredAssets` im Bildmanifest.

## Grenzen des Nachweises

Der neue Guard prüft bekannte Assistenten-Dateien, Runtime-Verweise, KI-SDKs und Provider-Endpunkte. Dies ist eine technische Regressionserkennung, kein vollständiger Rechts- oder Sicherheitsnachweis. Die Entfernung bestätigt insbesondere keine pauschale Ausnahme vom EU AI Act oder sonstigen Gesetzen. Impressum, Datenschutz, Inhalte und Bildrechte benötigen weiterhin die bereits vorgesehenen menschlichen Prüfungen.

Ältere Masterpläne und Übergabedokumente mit Assistenten-Vorschlägen sind historische Planungsstände, keine aktuelle Beauftragung. Maßgeblich sind diese Entscheidung und AGENTS.md.
