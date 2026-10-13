# Nur Islam Premium – Release-Checkliste

**Aktueller Inhaltsstand 13.10.2026:** [Quellenprüfung und Bereinigung](CONTENT-CLEARANCE-2026-10-13.md). Die [Betreiberfreigabe vom 13.10.2026](CONTENT-RELEASE-DECISION-2026-10-13.md) ist dokumentiert. Kein externer religiöser Prüfer erforderlich.

**Ziel:** Diese Liste trennt automatisch prüfbare Punkte von Punkten, die reale Betreiberangaben, physische Geräte oder geklärte Nutzungsrechte benötigen.

Ergänzende Arbeitsunterlagen:

- [`AUDIO-RIGHTS-AUDIT.md`](./AUDIO-RIGHTS-AUDIT.md) – aktueller Nachweis zur Islamic-Network-/Al-Quran-Cloud-Nutzung und offener Hisn-al-Muslim-Audiolizenz.
- [`RELIGIOUS-REVIEW-HANDOFF.md`](./RELIGIOUS-REVIEW-HANDOFF.md) – abgeschlossene Inhaltsentscheidung; kein externer Review-Auftrag.
- [`REAL-DEVICE-QA.md`](./REAL-DEVICE-QA.md) – konkrete physische iPhone-/Android-Abnahmematrix.
- [`RELEASE-OPERATIONS.md`](./RELEASE-OPERATIONS.md) – Beta-, Smoke-Test- und Rollback-Runbook.

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

Aktueller technischer Befund und Rechtsquellen: [`LEGAL-COMPLIANCE-AUDIT-2026-09-11.md`](./LEGAL-COMPLIANCE-AUDIT-2026-09-11.md).

- [x] Betreibername eingetragen: Mohammad Reza Rahimi (vorhandener Eintrag; Identität nicht separat bestätigt)
- [ ] ladungsfähige Anschrift eingetragen
- [ ] Kontakt-E-Mail eingetragen
- [ ] Impressum und Datenschutzangaben für den tatsächlichen Betrieb vervollständigt und bestätigt

Solange `<<BITTE AUSFÜLLEN>>` in den Betreiberfeldern steht, muss `NUR_RELEASE=true npm run check` fehlschlagen.

### Religiöse Inhalte: Quellenkorrekturen und Betreiberentscheidung

Die [Betreiberfreigabe vom 13.10.2026](CONTENT-RELEASE-DECISION-2026-10-13.md) schließt die Inhaltsentscheidung ab. Eine externe religiöse Abnahme ist keine Voraussetzung. Die vollständige automatisch erzeugte Liste steht in [`INHALTE-PRUEFUNG.md`](./INHALTE-PRUEFUNG.md).

- [x] Salah / Gebetspraxis: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] Sujud as-Sahw: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] Reisegebet / Qasr / Jamʿ: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] verpasste Gebete: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] frauenspezifische Gebetsfragen: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] Janazah / Eid: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] Madhhab-Unterschiede: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)
- [x] Hajj / Umrah: Quellenkorrekturen dokumentiert (keine Fachzertifizierung)

Die oben genannten Bereiche wurden quellenbezogen bearbeitet; Details und Grenzen im Abschlussbericht.

- [x] Betreiber hat den dokumentierten Inhaltsstand für den Release angenommen (13.10.2026).
- [x] Pflicht zur externen religiösen Prüfung entfernt.

Diese Betreiberentscheidung bescheinigt keine Gelehrtenprüfung und klärt keine Nutzungsrechte.

### Audio-/Nutzungsrechte

Aktueller Stand aus dem dokumentierten Rechte-Audit:

- Islamic Network / Al Quran Cloud veröffentlicht aktuelle Terms, die App-Integration und auch Einbindung in kommerzielle Produkte beschreiben; zugleich verbleiben Copyrights bei den Rezitatoren und ein Entfernungsverlangen bleibt möglich. Das ist eine dokumentierte Nutzungsgrundlage, aber keine unbeschränkte eigene Rechtefreigabe.
- Für Hisn-al-Muslim-Audio wurde bei der aktuellen öffentlichen Prüfung keine eindeutige Audio-Nutzungslizenz gefunden.

Daher offen:

- [ ] Islamic-Network-/Alafasy-Nutzung im konkreten Release rechtlich final bestätigen **oder** betroffene Audiofunktion deaktivieren
- [x] Hisn-al-Muslim-Audio entfernt; keine solche Quelle im aktiven Releasebestand

Technische Abrufbarkeit gilt nicht als Rechtefreigabe. Details: [`AUDIO-RIGHTS-AUDIT.md`](./AUDIO-RIGHTS-AUDIT.md).

### Physische Geräte

Mindestens ein reales iPhone und ein reales Android-Gerät dokumentiert prüfen. Die vollständige Schrittfolge steht in [`REAL-DEVICE-QA.md`](./REAL-DEVICE-QA.md).

P0-Mindestumfang:

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

Das technische Vorgehen für Beta, Smoke-Test und Rollback ist in [`RELEASE-OPERATIONS.md`](./RELEASE-OPERATIONS.md) vorbereitet.

Noch releasebezogen auszufüllen/zu bestätigen:

- [ ] echte Support-/Kontaktadresse sichtbar machen, sobald Betreiberangaben vorliegen
- [ ] konkrete letzte bekannte grüne Produktions-SHA unmittelbar vor Release dokumentieren
- [ ] kleiner Beta-/Staged-Rollout tatsächlich durchführen
- [ ] finaler Smoke-Test nach Deployment durchführen

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
3. `design/claude-design-system` kontrolliert nach `main` übernehmen;
4. Pages-/Produktionsdeployment beobachten;
5. Smoke-Test durchführen;
6. bei Releasefehlern auf die letzte bekannte grüne Version zurückrollen statt neue Features einzubauen.
