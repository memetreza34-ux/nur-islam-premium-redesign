# Nur Islam Premium – Release-Checkliste

**Ziel:** Diese Liste trennt automatisch prüfbare Punkte von Punkten, die reale Betreiberangaben, physische Geräte oder qualifizierte fachliche Freigabe benötigen.

## A. Technisch automatisch prüfbar

Vor jedem Release-relevanten Merge müssen mindestens folgende Nachweise grün sein:

- `npm run check`
- Playwright-E2E
- Browser-/Reference-Render-QA
- TypeScript
- Production Build
- Bundle-Budget
- Security-/Legal-Guards
- Unit-/Integrationstests

Der jeweils neueste GitHub-Actions-Lauf ist die maßgebliche Evidenz. Diese Datei trägt bewusst keine schnell veraltenden Run-IDs ein.

## B. Aktueller Premium-Stand

Das lokale Premium-Komfortpaket ist implementiert. Es umfasst:

- persönlichen Quran-/Khatm-Plan;
- eigene Routinen;
- konfigurierbare In-App-Widgets;
- Home-Personalisierung;
- 7-/30-Tage-Statistiken;
- Favoriten-Ordner;
- privates lokales Journal;
- eigene Erinnerungen;
- Premium-Design-Akzente.

Diese Funktionen verursachen in der aktuellen Form keine KI- oder nutzungsabhängigen API-Kosten. Private Premium-Daten sind vom generischen Cloud-Backup ausgeschlossen.

**Noch nicht aktiv:** echte Abo-Abrechnung und serverseitige Premium-Freischaltung. Payment/Entitlement wird bewusst erst nach den übrigen Release-Härtungen umgesetzt.

## C. P0 – benötigt Angaben oder Freigaben außerhalb des Codes

### Betreiber / Recht

- [ ] echter Betreibername eingetragen
- [ ] ladungsfähige Anschrift eingetragen
- [ ] Kontakt-E-Mail eingetragen
- [ ] Datenschutzerklärung/Impressum durch qualifizierte Stelle final geprüft

Solange `<<BITTE AUSFÜLLEN>>` in den Betreiberfeldern steht, muss `NUR_RELEASE=true npm run check` fehlschlagen.

### Religiöser Fachreview

- [ ] Salah / Gebetspraxis geprüft
- [ ] Sujud as-Sahw geprüft
- [ ] Reisegebet / Qasr / Jamʿ geprüft
- [ ] verpasste Gebete geprüft
- [ ] frauenspezifische Gebetsfragen geprüft
- [ ] Janazah / Eid geprüft
- [ ] Madhhab-Unterschiede geprüft
- [ ] Hajj / Umrah geprüft

Automatisierte Quellen- und Content-Checks ersetzen diesen Fachreview nicht.

### Audio-/Nutzungsrechte

- [ ] Mishary-Alafasy-/Islamic-Network-Nutzung abschließend geklärt **oder** betroffene Audiofunktion für Release deaktiviert
- [ ] Hisn-al-Muslim-Audionutzung abschließend geklärt **oder** betroffene Audiofunktion für Release deaktiviert

Technische Abrufbarkeit gilt nicht als Rechtefreigabe.

### Physische Geräte

Mindestens ein reales iPhone und ein reales Android-Gerät dokumentiert prüfen:

- [ ] PWA-Installation
- [ ] Start / Neustart / Update
- [ ] Offline / Recovery
- [ ] Standort erlauben
- [ ] Standort verweigern
- [ ] Qibla / Kompass / Device Orientation
- [ ] Benachrichtigungen
- [ ] Tastatur / Modals / Scroll
- [ ] Online → Offline → Online
- [ ] Gebetszeiten, Zeitzone und DST-Pfade

Browser-Simulation und WebKit-Render sind dafür kein Ersatz.

## D. P1 – Release-Betrieb

Vor breiter Veröffentlichung:

- [ ] Support-/Korrekturweg festgelegt
- [ ] Rollback-Commit bzw. letzte bekannte grüne Version dokumentiert
- [ ] kleiner Beta-/Staged-Rollout festgelegt
- [ ] Fehlerbeobachtung ohne religiöses Nutzungsverhalten zu tracken festgelegt
- [ ] finaler Smoke-Test nach Deployment

## E. Payment – bewusst letzter Produkt-Schritt

Erst wenn die Punkte oben ausreichend geschlossen sind:

- [ ] Zahlungsweg auswählen
- [ ] 0,99-€-Produkt/Abo konfigurieren
- [ ] serverseitig bestätigtes Entitlement anbinden
- [ ] Premium-Oberfläche hinter Entitlement sperren
- [ ] Kauf/Wiederherstellung/Kündigungsstatus testen
- [ ] Legal-/Datenschutztexte an tatsächliche Zahlungsabwicklung anpassen
- [ ] Store-/Plattformregeln für den konkreten Distributionsweg prüfen

Keine lokale `localStorage`-Flag darf als vertrauenswürdiger Zahlungsnachweis dienen.

## F. Freigabe nach `main`

Erst nach Abschluss der relevanten P0-Punkte:

1. neuesten RC vollständig prüfen;
2. Release-Check mit `NUR_RELEASE=true` grün bekommen;
3. `premium-design-finish` kontrolliert nach `main` übernehmen;
4. Pages-/Produktionsdeployment beobachten;
5. Smoke-Test durchführen;
6. bei Releasefehlern auf die letzte bekannte grüne Version zurückrollen statt neue Features einzubauen.
