# Nur Islam Premium – aktueller Release-Status

**Stand:** 23. August 2026  
**Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**Aktiver Release-Candidate-Branch:** `premium-design-finish`  
**Aktuell integrierter RC-Stand:** `62de244d67b88c481d0a393ce6def2e8c3219f24`  
**Release-Härtung in Arbeit:** `release-candidate-hardening`

> Dieses Dokument ist die **Single Source of Truth für den aktuellen Implementierungs- und Release-Status**. Langfristige Ideen und ältere Masterpläne dürfen nicht als Aussage über den heutigen Ist-Stand gelesen werden.

## 1. Aktuelles Ziel

Der Produktumfang ist eingefroren. Bis zur V1-Freigabe werden keine neuen großen Produktmodule ergänzt.

Die verbleibende Arbeit konzentriert sich auf:

1. technische Release-Härtung und beweisbare CI-Evidenz;
2. echte Geräte-/Sensorprüfung;
3. priorisierten religiösen Fachreview;
4. Audio-/Nutzungsrechte;
5. echte Betreiberangaben und rechtliche Endprüfung;
6. kontrollierten Beta-/Release-Pfad;
7. erst danach echte Abo-Abrechnung und serverseitiges Premium-Entitlement.

Arbeitsunterlagen:

- [`docs/RELEASE-CHECKLIST.md`](./docs/RELEASE-CHECKLIST.md) – operative Gesamtcheckliste.
- [`docs/AUDIO-RIGHTS-AUDIT.md`](./docs/AUDIO-RIGHTS-AUDIT.md) – Rechte-/Quellennachweis für Audio.
- [`docs/REAL-DEVICE-QA.md`](./docs/REAL-DEVICE-QA.md) – reale iPhone-/Android-Abnahmematrix.
- [`docs/RELIGIOUS-REVIEW-HANDOFF.md`](./docs/RELIGIOUS-REVIEW-HANDOFF.md) – priorisierter religiöser Fachreview.
- [`docs/RELEASE-OPERATIONS.md`](./docs/RELEASE-OPERATIONS.md) – Beta-, Smoke-Test- und Rollback-Runbook.

## 2. Was technisch bereits steht

### Produkt und UI

- Mobile-first React-/TypeScript-/Vite-PWA mit Dark- und Light-Theme.
- Fünf Hauptbereiche plus zahlreiche Sekundärscreens.
- Premium-Designsystem in Emerald/Gold/Cream mit konsistentem Lucide-Iconsystem.
- Home wurde nach den Hero-only-Experimenten wieder als kompakter, nutzbarer Dashboard-Einstieg aufgebaut.
- bekannte kompakte Home-/Moschee-/Viewport-Probleme sind durch statische und E2E-Guards abgesichert.

### Quran

- Alle 114 Suren mit arabischem Uthmani-Text sind lokal/offline gebündelt.
- Die deutsche Quran-Wiedergabe wird surenweise geladen und gecacht.
- Lesefortschritt, exakte Ayah-Navigation, Favoriten und Lesezeichen sind implementiert.
- sichtbare Reader-Aktionen sind funktional; Fake-Audio-Aktionen sind nicht Teil des Reader-Kerns.

### Gebetszeiten und Qibla

- Gebetszeiten nutzen Live-Daten, Browser-Cache und gekennzeichneten Offline-Fallback.
- Berechnungsmethoden und Asr-Einstellung sind vorhanden.
- gemeinsamer Prayer-State versorgt Home, Tracker und Reminder.
- Qibla besitzt Berechnung sowie Browser-/iOS-Orientation-Pfade einschließlich Berechtigungsweg und Fallback.
- **Noch offen:** physische Geräteprüfung für Standort, Kompass/Kalibrierung, Zeitzone/DST und lokale Methodenabgleiche.

### Accounts und Cloud

- optionaler Supabase-Accountpfad mit Registrierung, Login, Logout und Session-Refresh.
- Profil, explizites Cloud-Backup, Restore und Cloud-Notizen.
- Export und Löschung der Nur-Islam-Cloud-Daten sind implementiert.
- `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` verwenden RLS und nutzergebundene Policies.
- Frontend verwendet nur öffentliche/publishable Client-Konfiguration; kein Service-Role-Key gehört in den Browser.
- App bleibt ohne Account lokal nutzbar.
- Cloud-Inhalte sind nicht Ende-zu-Ende verschlüsselt; dies wird nicht anders behauptet.

### Lokales Premium-Komfortpaket

Implementiert sind:

- persönlicher Quran-/Khatm-Plan;
- eigene Routinen;
- konfigurierbare In-App-Widgets;
- Home-Personalisierung;
- 7-/30-Tage-Statistiken;
- Favoriten-Ordner;
- privates lokales Journal;
- eigene Erinnerungen;
- Premium-Design-Akzente.

Private Premium-Daten verwenden einen getrennten lokalen Namensraum und werden nicht automatisch durch das generische Cloud-Backup übertragen.

**Noch nicht aktiv:** echte Zahlung, Abo-Verlängerung und serverseitig bestätigtes Premium-Entitlement. Eine lokale Storage-Flag darf später niemals als Zahlungsnachweis dienen.

### Nur Assistent

- kein frei generierendes religiöses LLM.
- lokaler, quellengebundener Such-/Antwortmodus.
- Fragen nach persönlicher Fatwa, Erlaubtheit, Pflicht oder Gültigkeit werden bewusst nicht beantwortet.
- bei fehlendem Quellen-Treffer wird keine religiöse Antwort erfunden.

### PWA und Persistenz

- Manifest, Service Worker, Offline-Shell und lokale Persistenz vorhanden.
- Install-, Navigations-, Reminder- und Persistenzpfade sind automatisiert abgesichert.
- **Noch offen:** reale Install-/Update-/Offline-/Recovery-Abnahme auf physischen iOS- und Android-Geräten.

## 3. Automatisierte Qualitätssicherung – aktueller Nachweis

`npm run check` bleibt das zentrale technische Gate. Es umfasst unter anderem:

- Daten-/Content-Checks;
- Navigation und funktionale Guardrails;
- Asset-/Bild-/Icon-Prüfungen;
- Security-/Legal-/Release-Prüfungen;
- Unit-/Integrationstests;
- TypeScript;
- Production Build;
- Bundle-Budget;
- Stylesheet-Debt-Grenzen.

Am 23. August wurde der noch offene E2E-Pipeline-Fix aus PR #34 in `premium-design-finish` übernommen. Der PR-Head hatte vor dem Merge folgende GitHub-Actions-Nachweise:

- `Premium redesign check` – **success**;
- `End-to-end smoke` – **success**.

Der E2E-Workflow verwendet nun das zur gelockten Playwright-Version passende offizielle Browser-Image und lädt Testartefakte auch bei erfolgreichen Läufen hoch.

Auf `release-candidate-hardening` wird zusätzlich die Release-CI vereinheitlicht:

- zentrale Checks sollen auch auf Pushes nach `main` laufen;
- E2E soll auch den tatsächlich gemergten `main`-Stand prüfen;
- Home-Audit soll PRs nach `premium-design-finish` und `main` erfassen;
- Reference-Render-QA verwendet denselben stabilen Playwright-Container statt Browser bei jedem Lauf neu zu installieren;
- Reference-Render-QA soll PRs und Release-Pushes auf den relevanten Branches erfassen.

**Wichtig:** Diese Hardening-Änderungen gelten erst dann als belegt, wenn der zugehörige Pull Request selbst grün gelaufen ist. Ein vorhandener Workflow ist kein Nachweis für einen erfolgreichen Lauf.

## 4. Was einen öffentlichen Release noch blockiert

### P0 – Betreiber / Recht

`src/data/legalContent.ts` enthält bei Betreibername, Straße, Ort und E-Mail weiterhin `<<BITTE AUSFÜLLEN>>`.

Diese Angaben dürfen nicht erfunden werden. `NUR_RELEASE=true npm run check` muss solange fehlschlagen.

Vor öffentlichem Release erforderlich:

- echte Betreiberangaben;
- finale Prüfung von Impressum und Datenschutzerklärung;
- Prüfung der tatsächlich aktivierten externen Anbieter und Datenflüsse;
- erneute Anpassung der Rechtstexte, sobald Payment/Entitlement aktiviert wird.

### P0 – religiöser Fachreview

Automatisierte Quellen-/Content-Prüfungen ersetzen keinen qualifizierten islamischen Fachreview.

Priorisiert:

- Salah / Gebetspraxis;
- Sujud as-Sahw;
- Reisegebet / Qasr / Jamʿ;
- verpasste Gebete;
- frauenspezifische Gebetsfragen;
- Janazah und Eid;
- Madhhab-Unterschiede;
- Hajj und Umrah.

Bis zur Freigabe dürfen ungeprüfte Inhalte nicht als fachlich zertifiziert dargestellt werden.

### P0 – Audio-/Nutzungsrechte

Die aktuelle Recherche ist in [`docs/AUDIO-RIGHTS-AUDIT.md`](./docs/AUDIO-RIGHTS-AUDIT.md) dokumentiert.

Vor Release muss für jede tatsächlich ausgelieferte Audioquelle die konkrete Nutzung belastbar geklärt sein. Wo das nicht gelingt, wird die unsichere Audiofunktion deaktiviert oder entfernt. Technische Abrufbarkeit ist keine Rechtefreigabe.

### P0 – reale Geräte

Mindestens ein reales iPhone und ein reales Android-Gerät müssen dokumentiert geprüft werden. Die vollständige Matrix steht in [`docs/REAL-DEVICE-QA.md`](./docs/REAL-DEVICE-QA.md).

P0-Mindestumfang:

- PWA-Installation;
- Start / Neustart / Update / Recovery;
- Standort erlauben und verweigern;
- Qibla / Kompass / Device Orientation;
- Benachrichtigungen;
- Tastatur / Modals / Scroll;
- Online → Offline → Online;
- Gebetszeiten, Zeitzone und DST-Pfade.

Browser- und WebKit-Simulation ersetzen diese physische Abnahme nicht.

### P1 – Release-Betrieb

Noch real durchzuführen bzw. zu vervollständigen:

- echte Support-/Kontaktadresse sichtbar machen;
- letzte bekannte grüne Produktions-SHA unmittelbar vor Release festhalten;
- kleinen Beta-/Staged-Rollout durchführen;
- finalen Smoke-Test nach Deployment durchführen;
- Rollback auf die letzte bekannte grüne Version praktisch verifizieren.

## 5. Payment / 0,99-€-Abo – bewusst letzter Produkt-Schritt

Das Premium-Produktpaket ist vorhanden, aber die Bezahlarchitektur wird bewusst nicht vor den übrigen Release-Härtungen eingebaut.

Später erforderlich:

1. konkreten Distributions-/Zahlungsweg festlegen;
2. aktuelles Plattform-/Store-Regelwerk für diesen Weg prüfen;
3. Produkt/Abo konfigurieren;
4. serverseitig bestätigtes Entitlement anbinden;
5. Premium-Funktionen hinter dieses Entitlement sperren;
6. Kauf, Wiederherstellung, Verlängerung und Kündigungsstatus testen;
7. Datenschutz-/Impressums-/Zahlungstexte an den tatsächlich eingesetzten Anbieter anpassen.

## 6. Release-Reihenfolge

1. aktuelle technische Hardening-PRs grün bekommen und integrieren;
2. Betreiberangaben eintragen und rechtlich prüfen lassen;
3. religiösen P0-Fachreview abschließen;
4. Audio-Rechte final bestätigen oder unsichere Audiofunktion deaktivieren;
5. reale iPhone-/Android-Abnahme abschließen;
6. Payment/Entitlement als letzten Produkt-Schritt integrieren und erneut rechtlich/technisch prüfen;
7. `NUR_RELEASE=true npm run check`, E2E und Visual-QA auf dem finalen RC grün bestätigen;
8. kleinen Beta-/Staged-Rollout durchführen;
9. erst danach kontrolliert nach `main` übernehmen und Produktion beobachten.

## 7. Definition „V1 fertig“

V1 ist erst fertig, wenn alle relevanten Aussagen belegt sind:

- keine bekannten P0-Produktfehler;
- automatisierte technische Gates auf dem finalen RC grün;
- reale iPhone-/Android-Prüfung dokumentiert;
- Prayer/Qibla real geprüft;
- Betreiber-/Datenschutz-/Rechtspaket ausgefüllt und final geprüft;
- Audio-Nutzungsrechte final bestätigt oder unsichere Audiofunktion deaktiviert;
- priorisierter religiöser Fachreview abgeschlossen;
- falls Premium bezahlt startet: echtes, serverseitig bestätigtes Entitlement statt lokaler Scheinfreischaltung;
- kontrollierter Release-/Rollback-Pfad festgelegt;
- kein als „fertig“ markierter Punkt beruht nur auf einer Annahme.

Bis dahin ist `premium-design-finish` ein **fortgeschrittener Release Candidate**, aber kein freigegebener öffentlicher Produktionsrelease.
