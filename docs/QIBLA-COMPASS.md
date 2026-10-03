# Qibla-Kompass

Stand: 03.10.2026.

## Gestaltung

Der Kompass ist ein SVG-Instrument im Smaragd-Creme-Gold-Stil der App, angelehnt
an die vom Nutzer gelieferte Bildvorlage. Das helle Zifferblatt hat 72 Teilstriche,
N/O/S/W und eine dezente Windrose. Ein einzelner goldener Zeiger führt zur
Kaaba-Marke; die feste obere Marke steht für die Ausrichtung des Geräts.
Standort und Entfernung stammen aus den vorhandenen Berechnungen und stehen
oberhalb des Zifferblatts. Richtungszahl, Drehhinweis und Sensorstatus stehen
darunter. Glasreflexe und dauernde Schmuckanimationen entfallen.

Quelle der gesamten Kompassgrafik: eigener UI-Code in `src/shared/QiblaCompass.tsx`,
keine heruntergeladene Grafik und keine Bitmap-Abhängigkeit. `kaaba-v2.webp` bleibt
für andere App-Bereiche erhalten; Prompt, Herkunft und SHA-256 bleiben in
`image-asset-provenance.json` dokumentiert.
Keine neue Bildgenerierung, keine KI-Funktion und keine neue Rechtefreigabe.
Die Kompassgrafik wird erst beim Öffnen von Qibla nachgeladen; währenddessen
bleibt ihr Platz reserviert. Das Startpaket bleibt unter seinem bisherigen Größenlimit.

## Bewegung und Grenzen

- Sanftes Einblenden; Skala und Qibla-Zeiger folgen dem Gerätekompass mit 320 ms Übergang.
- Keine dauernden Schmuckanimationen oder simulierten Sensorsignale.
- Der kürzeste Winkelweg verhindert volle Umdrehungen beim Überqueren von Norden.
- Ohne Sensorsignal steht Norden oben; die Anzeige behauptet keine Geräteausrichtung.
- Relative Alpha-Werte ohne Erd-/Nordbezug werden nicht als Kompass akzeptiert.
  Hintergrund: [MDN – DeviceOrientationEvent.absolute](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/absolute).
- Bei höchstens fünf Grad Restdrehung erscheint eine dezente grüne Annäherung,
  bei höchstens zwei Grad eine kurze Bestätigung. Einmaliges Vibrationsfeedback
  und ein einmaliger Ringimpuls begleiten die Bestätigung, sofern verfügbar.
  Das ist UI-Rückmeldung, keine Zusicherung der Messgenauigkeit. Bei gemeldeter
  Sensorungenauigkeit über 15 Grad, ungültiger negativer Genauigkeitsangabe
  oder starker Neigung gibt es keine Bestätigung. Fehlt eine Genauigkeitsangabe,
  wird diese Einschränkung ausdrücklich angezeigt.
- Rot ist auf verweigerten oder fehlenden Sensorzugriff beschränkt.
- Reduzierte Bewegung schaltet die Übergänge ab.
- Standort, Sensorberechtigung, Start/Stopp, Timeout und lokale Berechnung bleiben
  erhalten. Der Standort wird nicht ohne Nutzeraktion aktualisiert.

Die Darstellung ersetzt keine Prüfung mit einem realen Gerät. Sensorfehler,
magnetische Störungen und plattformspezifische Abweichungen bleiben möglich.

## Prüfung

`e2e/qibla-compass.spec.ts` prüft drei Bildschirmbreiten, 72 Teilstriche,
Annäherung und Ausrichtung, Sensorbewegung und Nordübergang, verweigerte
Berechtigung, fehlenden Nordbezug, reduzierte Bewegung, Standortwechsel und
Darstellung bei blockierten Rasterbildern. Die Berechnung bleibt durch
`src/services/qibla.test.ts` geschützt. Echte Hardwareprüfung bleibt offen.
