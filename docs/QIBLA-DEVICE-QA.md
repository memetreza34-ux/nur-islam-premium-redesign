# Gerätetest: Qibla

Die Berechnung der Großkreis-Peilung nach Mekka ist durch Unit-Tests abgedeckt.
Was nicht abgedeckt ist: ob der Kompass auf echten Geräten das tut, was der
Bildschirm behauptet.

---

## Was die App bereits garantiert

Automatisch geprüft:

- Ohne freigegebenen Gerätestandort **keine** persönliche Gradzahl.
- Relative Sensorwerte gelten nicht als Nordreferenz.
- Absolute Orientierung wird bevorzugt, wenn das Gerät sie liefert.
- Genauigkeit wird nicht vorgetäuscht.
- Sensor-Listener werden beim Verlassen des Screens abgemeldet.

---

## Gerätematrix

| Gerät | iOS/Android | Browser | Als PWA installiert | Ergebnis |
| --- | --- | --- | --- | --- |
| iPhone, aktuelle iOS-Version | | Safari | nein | |
| iPhone, aktuelle iOS-Version | | Safari | **ja** | |
| iPhone, ältere unterstützte iOS-Version | | Safari | nein | |
| Android, aktuelle Version | | Chrome | nein | |
| Android, aktuelle Version | | Chrome | **ja** | |
| Android ohne Magnetometer | | Chrome | nein | |
| Tablet | | | | |

iOS verlangt für `DeviceOrientationEvent` eine ausdrückliche Freigabe, die nur
aus einer Nutzergeste heraus angefordert werden darf — die installierte PWA ist
deshalb ein eigener Testfall und nicht durch Safari abgedeckt.

---

## Testfälle je Gerät

| Fall | Erwartet |
| --- | --- |
| Standort noch nicht freigegeben | keine Gradzahl, klare Aufforderung |
| Standortfreigabe verweigert | keine Gradzahl, Erklärung, kein Ersatzwert |
| Sensorfreigabe verweigert (iOS) | Richtung zur Kaaba als Grad**zahl** ohne Live-Kompass, klar benannt |
| Kein Magnetometer vorhanden | Kompass aus, statische Peilung, Hinweis |
| Nur relative Orientierung verfügbar | kein Anspruch auf Nordausrichtung |
| Gerät um 360° drehen | Nadel läuft rund, springt nicht |
| Übergang 359° → 0° | kein Sprung, kein Aufblitzen |
| Display drehen (Hoch-/Querformat) | Peilung bleibt korrekt |
| Neben Metall, Lautsprecher, Laptop | Abweichung sichtbar; sagt die App etwas zur Genauigkeit? |
| Nach Kalibrierung (Achterbewegung) | Wert stabilisiert sich |
| Ortswechsel über mehrere hundert Kilometer | Peilung ändert sich plausibel |
| Bildschirm sperren und entsperren | Sensor läuft weiter oder wird sauber neu gestartet |
| App in den Hintergrund, zurück | keine hängende Nadel |
| Screen verlassen und zurück | keine doppelten Listener, keine Sprünge |

---

## Plausibilitätsprüfung

Von Deutschland aus liegt Mekka in südöstlicher Richtung. Grobe Erwartung:

Erwartungswerte, berechnet mit der Formel der App (`calculateBearing` gegen
`KAABA` = 21.4225 N, 39.8262 O) für die Stadtkoordinaten:

| Ort | Erwartete Peilung |
| --- | --- |
| Berlin | 136,7° |
| Hamburg | 133,0° |
| München | 129,8° |
| Köln | 126,7° |
| Frankfurt am Main | 128,1° |
| Stuttgart | 127,3° |

Zum Erkennen grober Fehler, nicht zur Abnahme auf das Grad genau — der genaue
Wert hängt am angezeigten Standort, nicht am Stadtmittelpunkt. Weicht die App
bei stehendem Standort um mehr als etwa 2° von diesen Werten ab, stimmt etwas
nicht; dann zuerst die Koordinaten prüfen, nicht die Formel.

Diese Zahlen sind eine Großkreis-Peilung gegen **geografisch** Nord. Ein
physischer Kompass zeigt magnetisch Nord; in Deutschland liegen dazwischen
derzeit wenige Grad. Ein Vergleich mit einem Handkompass muss diese Deklination
berücksichtigen, sonst wirkt eine korrekte Anzeige falsch.

Gegenprobe mit einem physischen Kompass und einer zweiten App gehört dazu.
Wenn beide Apps gleich zeigen und der physische Kompass abweicht, liegt es
wahrscheinlich an der magnetischen Deklination.

---

## Zu erfassen

- Gerät, Betriebssystem, Browser, installiert oder nicht
- Freigabestatus für Standort und Sensor
- Angezeigte Gradzahl und Vergleichswert
- Verhalten bei Störung und bei Drehung
- Screenshots der Fehlerzustände

---

## Ergebnisse

*Noch keine durchgeführt.*
