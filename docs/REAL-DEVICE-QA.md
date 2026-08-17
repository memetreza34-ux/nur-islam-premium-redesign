# Nur Islam – reale Geräteabnahme

**Zweck:** Diese Matrix ist für die physische Release-Abnahme. Browser-/Playwright-/WebKit-Simulationen zählen hier ausdrücklich nicht als bestanden.

Für jeden Lauf dokumentieren:

- Datum
- App-/Commit-Stand
- Gerät
- Betriebssystemversion
- Browser/PWA-Modus
- Ergebnis `PASS`, `FAIL` oder `BLOCKED`
- kurze Notiz bei Abweichungen

## 1. Mindestgeräte

### iPhone

- Gerät: ____________________
- iOS-Version: ____________________
- Safari-Version / PWA: ____________________
- Commit: ____________________
- Datum: ____________________

### Android

- Gerät: ____________________
- Android-Version: ____________________
- Chrome-Version / PWA: ____________________
- Commit: ____________________
- Datum: ____________________

## 2. Installation und Lifecycle

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Webseite lädt erstmals korrekt | ☐ | ☐ | |
| PWA lässt sich installieren / zum Home-Bildschirm hinzufügen | ☐ | ☐ | |
| App-Icon und Name korrekt | ☐ | ☐ | |
| Start aus Home-Bildschirm ohne Browser-Chrome | ☐ | ☐ | |
| App nach vollständigem Beenden erneut startbar | ☐ | ☐ | |
| vorhandene lokale Daten bleiben nach Neustart erhalten | ☐ | ☐ | |
| Update auf neue Version ohne kaputten Cache | ☐ | ☐ | |
| Recovery nach Netz-/Cache-Wechsel | ☐ | ☐ | |

## 3. Offline / Online

Vorbereitung: App einmal vollständig online öffnen.

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Offline-Shell startet | ☐ | ☐ | |
| arabischer Quran weiterhin erreichbar | ☐ | ☐ | |
| bereits gecachte deutsche Surah weiterhin erreichbar | ☐ | ☐ | |
| Online-Funktionen zeigen verständlichen Fallback statt Crash | ☐ | ☐ | |
| Wechsel offline → online erholt sich ohne Reload-Schleife | ☐ | ☐ | |
| Wechsel online → offline erzeugt keinen Datenverlust | ☐ | ☐ | |

## 4. Standort und Gebetszeiten

### Standort erlaubt

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Browser/OS fragt Standortberechtigung korrekt ab | ☐ | ☐ | |
| aktueller Ort wird plausibel erkannt | ☐ | ☐ | |
| Gebetszeiten werden geladen | ☐ | ☐ | |
| Ort/Zeitzone wirken plausibel | ☐ | ☐ | |
| keine exakten Koordinaten werden sichtbar unnötig gespeichert | ☐ | ☐ | |

### Standort verweigert

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Ablehnung verursacht keinen Crash | ☐ | ☐ | |
| Fallback-Ort wird verständlich angezeigt/genutzt | ☐ | ☐ | |
| erneuter Berechtigungsversuch ist nachvollziehbar | ☐ | ☐ | |

### Zeitprüfung

- [ ] mindestens einen Tageswechsel prüfen
- [ ] nächstes Gebet vor/nach Mitternacht prüfen
- [ ] Zeitzonenanzeige plausibel
- [ ] DST-/Sommerzeitpfad anhand eines geeigneten Testdatums oder Geräte-Zeitzonenwechsels prüfen
- [ ] lokale Moschee-/Gebetszeiten soweit sinnvoll mit einer vertrauenswürdigen lokalen Quelle vergleichen

## 5. Qibla / Sensoren

Nicht im Emulator abhaken.

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Sensorberechtigung erscheint korrekt, falls OS sie verlangt | ☐ | ☐ | |
| Ablehnung wird verständlich behandelt | ☐ | ☐ | |
| Kompass reagiert beim Drehen des Geräts | ☐ | ☐ | |
| Richtung stabilisiert sich nach kurzer Bewegung/Kalibrierung | ☐ | ☐ | |
| Qibla-Richtung ist grob mit einer unabhängigen Referenz plausibel | ☐ | ☐ | |
| Hoch-/Querformat verursacht keinen falschen Sprung | ☐ | ☐ | |
| Rückkehr aus Hintergrund stellt Sensorpfad wieder her | ☐ | ☐ | |

## 6. Benachrichtigungen / Erinnerungen

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Berechtigung wird nur nach Nutzeraktion angefragt | ☐ | ☐ | |
| Ablehnung verursacht keinen Fehlerzustand | ☐ | ☐ | |
| erlaubte lokale Erinnerung erscheint | ☐ | ☐ | |
| Reminder wird nicht unkontrolliert doppelt ausgelöst | ☐ | ☐ | |
| deaktivierte Erinnerung bleibt deaktiviert | ☐ | ☐ | |

## 7. Kernnavigation

Mindestens einmal physisch öffnen und zurücknavigieren:

- [ ] Home
- [ ] Quran
- [ ] Gebetszeiten
- [ ] Qibla
- [ ] Dhikr
- [ ] Duas
- [ ] Lernen/Wissen
- [ ] Konto & Sicherung
- [ ] Premium-Oberfläche
- [ ] Impressum/Datenschutz/Lizenzen

## 8. Premium lokal

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Premium-Oberfläche öffnet | ☐ | ☐ | |
| Quran-Plan lässt sich speichern | ☐ | ☐ | |
| Routine lässt sich erstellen und abhaken | ☐ | ☐ | |
| Widgets/Home-Personalisierung bleibt nach Neustart | ☐ | ☐ | |
| Journal bleibt nach Neustart lokal erhalten | ☐ | ☐ | |
| Design-Akzent bleibt erhalten | ☐ | ☐ | |
| Cloud-Backup überschreibt/überträgt das private Premium-Journal nicht | ☐ | ☐ | |

## 9. Konto / Cloud

Nur mit Testkonto durchführen; keine produktiven Daten verwenden.

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| Registrierung/Login | ☐ | ☐ | |
| Logout | ☐ | ☐ | |
| explizites Backup | ☐ | ☐ | |
| Restore | ☐ | ☐ | |
| Cloud-Notiz erstellen/ändern/löschen | ☐ | ☐ | |
| Export funktioniert | ☐ | ☐ | |
| Cloud-Daten löschen funktioniert | ☐ | ☐ | |

## 10. UI / Accessibility-Sanity

| Test | iPhone | Android | Notiz |
|---|---|---|---|
| 200% Browser-/System-Zoom soweit unterstützt ohne unbenutzbare UI | ☐ | ☐ | |
| Bildschirmtastatur verdeckt wichtige Eingaben nicht dauerhaft | ☐ | ☐ | |
| Modals lassen sich schließen | ☐ | ☐ | |
| lange Seiten scrollen korrekt | ☐ | ☐ | |
| Dark Mode lesbar | ☐ | ☐ | |
| Light Mode lesbar | ☐ | ☐ | |
| keine horizontale Scroll-Leiste bei normaler Nutzung | ☐ | ☐ | |

## 11. Release-Abnahme

### iPhone

- [ ] alle P0-Gerätetests PASS
- [ ] keine ungeklärte Sensorabweichung
- [ ] keine reproduzierbare Datenverlust-/Cache-Störung
- Tester/Datum: ____________________

### Android

- [ ] alle P0-Gerätetests PASS
- [ ] keine ungeklärte Sensorabweichung
- [ ] keine reproduzierbare Datenverlust-/Cache-Störung
- Tester/Datum: ____________________

**Freigaberegel:** Ein nicht getesteter Punkt ist nicht automatisch bestanden. `BLOCKED` und `FAIL` bleiben offen, bis sie nachvollziehbar geklärt sind.
