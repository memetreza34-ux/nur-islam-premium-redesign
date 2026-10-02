# Qibla-Kompass

Stand: 01.10.2026.

## Gestaltung

Der Kompass ist ein ruhiges SVG-Instrument im Smaragd-Gold-Stil der App.
Ein schmaler Messingring fasst das dunkle Zifferblatt mit 72 Teilstrichen und
vier Gradwerten ein. Die kleinere zweifarbige Nadel zeigt Norden; ein breiterer
goldener Zeiger führt zur Kaaba-Marke auf der Skala. Beide reagieren unabhängig
auf die Geräteausrichtung.
Glasreflexe, Schmuckgrafik und künstliche Lichtkegel entfallen.
Richtungszahl, Gerätehaltung, Standort und Bedienhinweise stehen außerhalb
des Zifferblatts, damit die Richtung im Mittelpunkt bleibt.

Quelle der gesamten Kompassgrafik: eigener UI-Code in `src/shared/QiblaCompass.tsx`,
keine heruntergeladene Grafik und keine Bitmap-Abhängigkeit. `kaaba-v2.webp` bleibt
für andere App-Bereiche erhalten; Prompt, Herkunft und SHA-256 bleiben in
`image-asset-provenance.json` dokumentiert.
Keine neue Bildgenerierung, keine KI-Funktion und keine neue Rechtefreigabe.
Die Kompassgrafik wird erst beim Öffnen von Qibla nachgeladen; währenddessen
bleibt ihr Platz reserviert. Das Startpaket bleibt unter seinem bisherigen Größenlimit.

## Bewegung und Grenzen

- Sanftes Einblenden; Nordnadel, Skala und Qibla-Marke folgen dem Gerätekompass mit 320 ms Übergang.
- Keine dauernden Schmuckanimationen oder simulierten Sensorsignale.
- Der kürzeste Winkelweg verhindert volle Umdrehungen beim Überqueren von Norden.
- Ohne Sensorsignal steht Norden oben; die Anzeige behauptet keine Geräteausrichtung.
- Relative Alpha-Werte ohne Erd-/Nordbezug werden nicht als Kompass akzeptiert.
  Hintergrund: [MDN – DeviceOrientationEvent.absolute](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/absolute).
- Innerhalb von fünf Grad wechselt der Goldakzent zu einem hellen Grün.
  Das ist UI-Rückmeldung, keine Zusicherung der Messgenauigkeit. Bei gemeldeter
  Sensorungenauigkeit über 15 Grad oder ungültiger negativer Genauigkeitsangabe
  erscheint stattdessen ein Hinweis.
- Reduzierte Bewegung schaltet die Übergänge ab.
- Standort, Sensorberechtigung, Start/Stopp, Timeout und lokale Berechnung bleiben
  erhalten. Der Standort wird nicht ohne Nutzeraktion aktualisiert.

Die Darstellung ersetzt keine Prüfung mit einem realen Gerät. Sensorfehler,
magnetische Störungen und plattformspezifische Abweichungen bleiben möglich.

## Prüfung

`e2e/qibla-compass.spec.ts` prüft drei Bildschirmbreiten, Sensorbewegung und
Nordübergang, verweigerte Berechtigung, fehlenden Nordbezug, reduzierte Bewegung,
Standortwechsel und Darstellung bei blockierten Rasterbildern. Die Berechnung bleibt durch
`src/services/qibla.test.ts` geschützt; zusätzliche Winkeldelta-Tests schützen
die kurze Drehrichtung. Echte Hardwareprüfung bleibt offen.

Prüflauf am 01.10.2026: Build, Typprüfung, `qibla:check` und `visual:check`
bestanden. Die Browser-Tests konnten lokal nicht starten, weil die benötigte
Playwright-Chromium-Version nicht installiert ist. Die Vorschau wurde bei 320
und 390 Pixeln visuell geprüft; ein Test auf realer Sensorhardware bleibt offen.
