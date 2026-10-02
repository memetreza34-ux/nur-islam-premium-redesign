# Fünf Gebetslandschaften

Stand: 27.08.2026. Auf Betreiberwunsch gestaltet, keine Änderung der Gebetsberechnung.

## Gestaltung und Zuordnung

Eine zusammengehörige Oasenlandschaft mit Hügeln und Palmen, fünf Lichtstimmungen:

| Aktuelle lokale Tagesphase | Festes Bild im Ordner `public/premium-assets/high-res-objects/` | Stimmung |
|---|---|---|
| Fajr bis Sonnenaufgang | `prayer-fajr-v1.webp` | Blau und Rosé vor Sonnenaufgang; keine sichtbare Sonne |
| Sonnenaufgang bis Asr | `prayer-dhuhr-v1.webp` | Klares Tageslicht, hoher seitlicher Sonnenschein |
| Asr bis Maghrib | `prayer-asr-v1.webp` | Warmes Nachmittagslicht, längere Schatten |
| Maghrib bis Isha | `prayer-maghrib-v1.webp` | Orange-violetter Horizont nach Sonnenuntergang |
| Isha bis Fajr | `prayer-isha-v1.webp` | Nacht mit Sternen und stilisierter Mondsichel |

Auf Betreiberwunsch wurde die erste Zuordnung zum kommenden Gebet ersetzt.
Start und Gebetsseite berechnen jetzt mit `getCurrentPrayerScene(now, schedule, timezone)`
die aktuelle Bildstimmung aus dem vorhandenen Zeitplan und seiner Standort-Zeitzone.
`MihrabArch` erhält diese unabhängig vom nächsten Gebet als `scene`.
Die Berechnung von Gebetsname, Uhrzeit, Countdown und Fortschritt bleibt unverändert.
Nach Isha bleibt die Nachtlandschaft stehen, obwohl Fajr das kommende Gebet ist.
Ab Sonnenaufgang wird bereits das helle Tagesmotiv verwendet, nicht erst ab Dhuhr.
Isha nach Mitternacht wird unterstützt. Ohne gültige Grenzen oder Zeitzone wird
kein Tagesmotiv geraten; der grüne Grundverlauf bleibt. Ohne verwendbaren
Gebetszeitplan bleibt die vorhandene ehrliche Fehlermeldung erhalten.

Die Bilder illustrieren die **aktuelle lokale Tagesphase**, nicht das kommende Gebet.
Sie zeigen keine berechnete Sonnenposition, Mondphase oder Live-Wetterlage.
Bei einem Wechsel bleibt der goldene Fortschrittsbogen bestehen; nur das Bild blendet
über 800 ms um. Bei reduzierter Bewegung wird direkt umgeschaltet. Ein grüner
Grundverlauf bleibt auch bei fehlendem Bild erhalten. Der Bildbereich ist dekorativ
und vor Screenreadern verborgen; Uhrzeit und Gebetsname bleiben echter HTML-Text.
Eine radiale Abdunklung schützt die Textmitte, ohne die Landschaftsränder zu verdecken.

## Startseiten-Variante vom 28.08.2026

Auf Start und der Gebetsseite entfällt der äußere Kartenkasten. Die Landschaft läuft unten weich
aus, der animierte Goldbogen bleibt vollständig sichtbar. Die sechs Zeiten stehen
ohne Rahmen darunter; ein kurzer goldener Strich markiert das nächste Gebet.
Der Countdown hat auf beiden Seiten keine zusätzliche Kapsel mehr. Auf der
Gebetsseite stehen Markieren und Hinweiston frei unter dem Bogen; Tagesliste,
Erinnerungen und Berechnung bleiben unverändert. Keine neuen Bilder und keine
geänderten Zeiten.

## Bildherkunft

Erstellt mit der eingebauten OpenAI-Bildgenerierung in Codex, nicht über einen
API-Aufruf der App. Keine KI-, Chat- oder Assistentenfunktion hinzugefügt.
Das genaue Modell wurde vom Werkzeug nicht offengelegt.

Fajr wurde allein aus einem eigenen Textprompt erzeugt. Für die vier weiteren Bilder
diente ausschließlich diese eigene Fajr-Generation als Eingabebild, um Kamera und
Landschaft zu erhalten. Keine Fremdfotos, Marken oder religiösen Texte als Input.

Alle fünf finalen Dateien: 1200 × 800 Pixel, WebP, zusammen rund 304 KiB.
Konvertierung: `cwebp -q 85 -m 6 -resize 1200 800`.
Der [vollständige Prompt-Satz, Originalpfade und SHA-256-Nachweis](./image-asset-provenance.json)
stehen im Manifest bei `prayer-*-v1.webp`. Die früher verwendete Datei
`home-prayer-sky-v1.webp` wird nicht mehr in den Gebetskarten verwendet. Seit
28.08. dient sie als rein dekorativer Quran-Lesehintergrund und liegt im Cache v23.

Die fünf Bilder werden lokal ausgeliefert und seit 28.08. zusammen mit den
sechs neuen Listen-Miniaturen im App-Shell-Cache (ab v22) abgelegt.
Die Prüfung des Herkunftsnachweises ist keine rechtliche oder religiöse Freigabe.

## Prüfung

- `npm run check`: Bilddekodierung, Herkunfts-Hashes, beide Bildschirmzuordnungen,
  Offline-Einträge, Fortschrittsbogen, reduzierte Bewegung, Unit-Tests und Build.
- `npm run e2e -- e2e/prayer-landscapes.spec.ts`: alle fünf Motive auf beiden
  Seiten, Text innerhalb der Karte bei 320 Pixel Breite, Nacht-/Tageswechsel
  sowie Wechsel während eines laufenden Countdowns und abweichende Geräte-Zeitzone.
  Unit-Tests prüfen exakte Phasengrenzen, Sommer-/Winterzeit, fehlende Daten und Isha
  nach Mitternacht. Nur Testdaten; kein neuer Ersatzzeitplan.
