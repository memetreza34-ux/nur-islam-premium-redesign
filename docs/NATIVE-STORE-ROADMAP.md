# Native Apps: was dazukäme

**Noch nichts davon ist begonnen, und das ist Absicht.** Nur Islam ist heute
React + Vite + PWA. Es gibt keinen Capacitor, kein iOS-Projekt, kein
Android-Projekt. Dieses Dokument beschreibt, was ein Store-Release zusätzlich
verlangt — damit die Entscheidung mit Kenntnis der Kosten fällt, nicht
nebenbei.

Solange die Entscheidung nicht getroffen ist, bleibt die PWA der Releaseweg.

---

## Zuerst zu entscheiden

- [ ] PWA **und** Stores, oder PWA allein?
- [ ] Falls Stores: beide gleichzeitig oder erst einer?
- [ ] Wer betreibt die Developer-Accounts? Beide sind kostenpflichtig und an
      eine verifizierte Identität gebunden.

Erst nach dieser Entscheidung lohnt sich technische Arbeit daran.

---

## Technischer Aufbau

| Schritt | Umfang |
| --- | --- |
| Capacitor oder vergleichbare Shell einbinden | überschaubar |
| iOS-Projekt anlegen, Bundle-ID, Signierung | mittel |
| Android-Projekt anlegen, Package-Name, Signierung | mittel |
| Native Berechtigungen (Standort, Sensoren, Benachrichtigungen) | mittel — anderes Modell als im Browser |
| Icons und Splash Screens je Plattform | klein, aber viele Größen |
| Deep Links / Universal Links | mittel |
| Native Benachrichtigungsstrategie | **groß** — siehe unten |

### Benachrichtigungen sind der eigentliche Grund

Die PWA sagt heute ausdrücklich **nicht** zu, dass Erinnerungen bei
geschlossener App zuverlässig ankommen — weil Browser das nicht garantieren.
Genau das können native Apps. Wenn Store-Apps kommen, ist das der Gewinn, und
zugleich der aufwendigste Teil: lokale Benachrichtigungen planen, bei
Zeitzonenwechsel neu planen, Batterieoptimierung auf Android berücksichtigen,
Berechtigungen sauber erfragen.

---

## Store-Anforderungen

### Beide

- [ ] Datenschutzerklärung unter einer öffentlichen URL
- [ ] Store-Beschreibung, Screenshots je Gerätegröße, Vorschaugrafiken
- [ ] Altersfreigabe
- [ ] Support-Kontakt

### Apple App Store

- [ ] Privacy Labels („App-Datenschutz") — muss zur tatsächlichen Verarbeitung
      passen
- [ ] **Kontolöschung aus der App heraus**, sobald die App Kontoerstellung
      anbietet. Nur-Islam-Daten zu löschen genügt dafür nicht; der Auth-Account
      selbst muss gelöscht werden können.
- [ ] Sign in with Apple, falls andere Anmeldedienste Dritter angeboten werden
- [ ] Review-Hinweise: Testzugang für den Prüfer

### Google Play

- [ ] Data Safety-Formular
- [ ] **Kontolöschung**, ebenfalls in der App und zusätzlich über eine
      öffentlich erreichbare Web-Adresse
- [ ] Zielversion der Android-API einhalten
- [ ] Deklaration sensibler Berechtigungen

**Die Kontolöschung ist bei beiden ein Blocker**, nicht eine Empfehlung. Sie
braucht einen serverseitigen privilegierten Pfad mit Authentifizierung,
Bestätigung und Schutz davor, ein fremdes Konto zu löschen. Ein Service-Role-Key
gehört dafür nicht ins Frontend.

Beide Regelwerke ändern sich. Bei der Umsetzung gegen die offiziellen Quellen
prüfen, nicht gegen dieses Dokument.

---

## Was zusätzlich laufend anfällt

- Zwei weitere Build-Pipelines
- Store-Reviews bei jedem Update, mit Wartezeit
- Zwei weitere Rollback-Wege, langsamer als bei der PWA
- Getrennte Fehlerberichte je Plattform
- Jährliche Kosten für beide Developer-Accounts

---

## Empfehlung

PWA zuerst veröffentlichen. Sie ist fertig genug, sobald die inhaltlichen und
rechtlichen Blocker geklärt sind, und liefert reale Nutzung, an der sich
entscheiden lässt, ob native Apps den Aufwand wert sind.

Der Store-Track sollte erst beginnen, wenn es einen konkreten Grund gibt — und
der wahrscheinlichste Grund sind zuverlässige Gebetserinnerungen bei
geschlossener App.
