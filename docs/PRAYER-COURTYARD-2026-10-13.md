# Fünf Lichtstimmungen desselben Moscheehofs

Stand: 13.10.2026. Diese Serie ist ausschließlich für die Anfangsanimation vorgesehen. Die zu breite Einbindung wurde auf Betreiberhinweis korrigiert.

Ein fiktionaler Hof mit elfenbeinfarbenem Stein, smaragdgrüner Kuppel und zurückhaltenden Messingdetails. Gleiche frontale Perspektive und Architektur, fünf Lichtstimmungen. Der obere Bereich bleibt für die Texte ruhig; keine Personen oder eingebauten Schriftzüge. Die Bilder sind dekorativ und zeigen keinen belegten realen Ort, berechneten Sonnenstand oder Live-Wetter.

| Gebetsmotiv | Datei im Bildordner | Licht |
|---|---|---|
| Fajr | `prayer-fajr-v3.webp` | Kühle Morgendämmerung vor Sonnenaufgang |
| Dhuhr | `prayer-dhuhr-v3.webp` | Klares Tageslicht |
| Asr | `prayer-asr-v3.webp` | Warmes Nachmittagslicht |
| Maghrib | `prayer-maghrib-v3.webp` | Abenddämmerung |
| Isha | `prayer-isha-v3.webp` | Nacht mit dezent beleuchteten Hofbögen |

Laufzeitdateien: `public/premium-assets/high-res-objects/`. Fünf WebP-Dateien in nativer Originalauflösung zu je 1536 × 1024 Pixel, zusammen 1.388.376 Bytes. Qualitätsencoding mit `cwebp -q 95 -m 6 -sharp_yuv`, ohne Verkleinerung. Die v1-Oasenbilder bleiben in den Gebetsansichten aktiv; die verkleinerten v2-Dateien bleiben als Archiv erhalten.

Die Serie wird ausschließlich in der Anfangsanimation verwendet. Start, Gebet, Lernübersicht, Gebetskurs und Gebetswidgets verwenden wieder die bisherigen Oasenbilder v1. `getSplashBackdrop` und `getPrayerBackdrop` halten die Zuordnungen getrennt. Das Einstiegsbild folgt der aktuellen lokalen Tages-/Gebetsphase desselben Zeitplans wie Start und Gebet. Die Textanzeige kündigt unabhängig davon das nächste Pflichtgebet an. Vor Maghrib bleibt beispielsweise das Asr-Bild sichtbar; nach Isha bleibt das Nachtbild auch bei angekündigtem Fajr. Die Auswahl nutzt nur einen aktuellen Zeitplan mit gültigen Grenzen und Zeitzone. Gebetszeiten und Countdown werden nicht verändert. Fehlende Daten oder Bilder behalten ihre vorhandenen Fallbacks. Der App-Shell-Cache v86 enthält beide Bildserien; neue Dateinamen verhindern die Verwechslung mit älteren Browserbildern.

Erzeugt mit der eingebauten Codex-Bildgenerierung (`image_gen`), ohne API-Schlüssel oder Bildgenerierungsfunktion in der App. Das Werkzeug hat keinen exakten Modellnamen offengelegt. Die Tageslichtvorlage entstand aus Text und wurde einmal für den Textbereich neu gerahmt. Die vier weiteren Bilder sind Lichtvarianten dieser eigenen Vorlage. Keine fremden Fotos als Eingabe.

Originale einschließlich Zwischenvorlage: [`output/imagegen/prayer-courtyard/`](../output/imagegen/prayer-courtyard/). Der [vollständige Prompt-Satz](../output/imagegen/prayer-courtyard/prompts.json) nennt die Ausgangsdateien und Referenzen für jede Variante. Der [Herkunftsnachweis](image-asset-provenance.json) enthält SHA-256-Werte der Laufzeitbilder. Dieser Nachweis behauptet keine pauschale rechtliche oder religiöse Freigabe.

## Qualitätskorrektur

Die zuerst eingebundene v2-Serie war auf 1200 × 800 verkleinert. Ein hoher Retina-Ausschnitt vergrößerte ihre Pixel deutlich; die bisherige globale grüne Abdunklung ließ die Gebäudedetails zusätzlich flach erscheinen. Die v3-Serie verwendet die vollständigen Originale. Die zunächst begrenzte Abdunklung im Cache-Stand v83 wurde danach auf Betreiberwunsch vollständig entfernt (v84). Die Bildhelligkeit bleibt unverändert; Dhuhr und Asr erhalten dunklen Text, die übrigen Motive hellen Text. Die Tagesfarben greifen erst nach erfolgreichem Bildladen, damit fehlende Bilder auf dem grünen Grund weiterhin lesbar bleiben. Der Ladehinweis hat einen eigenen kleinen Hintergrund. Keine künstliche Hochskalierung und kein neues Motiv. Die Quellenbilder bleiben 1536 × 1024; bei größeren Gerätepixel-Flächen kann der Browser weiterhin vergrößern.

## Prüfung des ersten v2-Stands

Die vollständige technische Prüfkette ist bestanden: 1.041 Tests, TypeScript, Build, Bildherkunft und Asset-/Bundle-Prüfungen. 36 gezielte Browserfälle bestätigen Einstieg, Bildwechsel, Gebet, Lernen und Offline. Serie, Handy-Einstieg und helle/dunkle Gebetsansicht bei 320 Pixeln wurden visuell geprüft. [Prüfnachweis](release-audit-evidence/prayer-courtyard-verification-2026-10-13.json).

## Prüfung der v3-Qualitätskorrektur

Die vollständige technische Prüfkette und 1.041 Tests sind erneut bestanden. Alle 36 betroffenen Browserfälle sind mit den neuen v3-Dateien grün. Die gesamte Bildwelt bleibt erhalten; verbessert wurden Dateiauflösung, WebP-Encoding und die örtliche Abdunklung. Ansichten bei 648 × 764 und 390 × 844 wurden visuell geprüft. [Aktueller Prüfnachweis](release-audit-evidence/courtyard-quality-verification-2026-10-13.json).

## Originalhelligkeit, Stand v84

Bildüberlagerung entfernt: `::before` ist ausgeblendet, Bildfilter `none`, Bilddeckkraft `1`. Die vorhandenen v3-Bilddateien bleiben unverändert. 1.041 Tests und vollständige technische Prüfkette bestanden. 28 Browserfälle bestanden im Gesamtlauf; der 29. scheiterte ausschließlich beim Screenshot-Schreiben an `ENOSPC` und bestand anschließend einzeln. [Prüfnachweis](release-audit-evidence/original-brightness-verification-2026-10-13.json).

## Einbindung korrigiert, Stand v85

Auf Betreiberhinweis bleiben die ursprünglichen v1-Oasenbilder außerhalb der Anfangsanimation aktiv. Die beiden Zuordnungen und beide Offline-Serien sind getrennt. 1.041 Tests bestanden; TypeScript, Build und technische Prüfungen einschließlich der korrigierten JS-Budgetgrenze sind bestanden. 36 unterschiedliche Browserfälle wurden kombiniert bestätigt: 35 im ersten Lauf und alle neun Gebetslandschaftsfälle im Nachlauf nach Präzisierung des Testselektors. Die tatsächliche Gebetsansicht und die separate Anfangsanimation wurden visuell geprüft. [Prüfnachweis](release-audit-evidence/opening-only-verification-2026-10-13.json).

## Aktuelle Phase und nächstes Gebet getrennt, Stand v86

Das Hintergrundbild folgt jetzt der aktuellen lokalen Phase; die Ankündigung bleibt beim nächsten Pflichtgebet. Beispiel: Asr-Bild mit Maghrib-Ankündigung. Bildfarben beziehen sich auf das tatsächlich geladene aktuelle Motiv. Ohne aktuellen verwendbaren Zeitplan wird kein Motiv geraten. 1.047 Tests, vollständige technische Prüfkette und 13 Browserfälle für Einstieg/Offline bestanden. [Prüfnachweis](release-audit-evidence/current-opening-verification-2026-10-13.json).
