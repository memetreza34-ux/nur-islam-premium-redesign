# Nur Islam Premium – aktueller Release-Status

**Stand:** 25. August 2026  
**Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**Aktiver Release-Candidate-Branch:** `premium-design-finish`  
**Aktuell integrierter RC-Stand:** `1e139f883f5a89be89410d788485bbb6f96bdcbd`  
**Produktumfang:** für V1 eingefroren – keine neuen großen Module vor Abschluss der P0-Gates

> Dieses Dokument ist die **Single Source of Truth für den aktuellen Implementierungs- und Release-Status**. Ältere Masterpläne, Branch-Namen oder Checklisten dürfen nicht als Aussage über den heutigen Ist-Stand gelesen werden.

## 1. Kurzstatus

Nur Islam Premium ist ein weit fortgeschrittener Release Candidate, aber **noch kein freigegebener Produktionsrelease**.

Die zentralen Frontend-, PWA-, Unit-, E2E- und Visual-QA-Gates sind belastbar. Das zuvor inaktive gemeinsame Supabase-Projekt wurde am 25. August 2026 reaktiviert und live als `ACTIVE_HEALTHY` geprüft. Für einen öffentlichen Release bleiben trotzdem reale Freigaben und Betriebsentscheidungen offen:

1. echte Betreiber-/Rechtsangaben;
2. qualifizierter religiöser Fachreview;
3. reales iPhone-/Android-QA einschließlich Sensoren, Offline und Berechtigungen;
4. reale Prüfung von Gebetszeiten, Zeitzone/DST und Qibla;
5. explizite Produktionsvariablen und finale Entscheidung, ob das derzeitige Shared-Backend für Web/PWA verwendet oder ein dediziertes Nur-Islam-Backend eingesetzt wird;
6. finale Rechteprüfung der tatsächlich ausgelieferten Audioquellen;
7. bei nativer Store-Veröffentlichung: dediziertes Backend, Deployment und reale Verifikation der bereits vorbereiteten vollständigen Account-Löschung;
8. verpflichtende GitHub-Merge-/Statusregeln für `main`;
9. erst danach Payment/Entitlement, falls es Bestandteil von V1 werden soll.

## 2. Was technisch bereits steht

### Produkt und UI

- Mobile-first React-/TypeScript-/Vite-PWA mit Dark- und Light-Theme.
- Fünf Hauptbereiche plus zahlreiche Sekundärscreens.
- Premium-Designsystem in Emerald/Gold/Cream mit konsistentem Lucide-Iconsystem.
- aktueller Home-Einstieg mit Begrüßungs-/Moschee-Hero, Gebetsinformationen und den freigegebenen Dashboard-Inhalten;
- Navigations-, Touch-, Overlay-, Modal-, Layout- und Persistenzpfade besitzen automatisierte Guards.

### Quran

- alle 114 Suren mit arabischem Uthmani-Text lokal/offline gebündelt;
- deutsche Quran-Wiedergabe wird surenweise online geladen und lokal gecacht;
- Lesefortschritt, exakte Ayah-Navigation, Favoriten und Lesezeichen sind implementiert;
- Quran-Daten- und Zitationschecks sind Teil der zentralen Prüfkette.

### Gebetszeiten und Qibla

- Live-Gebetszeiten, Browser-Cache und gekennzeichneter Offline-Fallback;
- Berechnungsmethoden und Asr-Einstellung;
- gemeinsamer Prayer-State für Home, Tracker und Reminder;
- Qibla-Berechnung sowie Browser-/iOS-Orientation-Pfade einschließlich Berechtigungsweg und Fallback.

**Noch offen:** reale Prüfung auf physischen Geräten, lokale Methodenabgleiche, Zeitzone/DST sowie Kompass-/Kalibrierungsverhalten.

### Accounts und Cloud

- optionaler Supabase-Accountpfad mit Registrierung, Login, Logout und Session-Refresh;
- Profil, explizites Cloud-Backup, Restore und Cloud-Notizen;
- Datenexport und Löschung der Nur-Islam-spezifischen Cloud-Daten;
- `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` verwenden live aktiviertes RLS und nutzergebundene Policies;
- Frontend verwendet öffentliche/publishable Client-Konfiguration;
- App bleibt ohne Konto lokal nutzbar;
- Cloud-Inhalte werden nicht als Ende-zu-Ende verschlüsselt beworben.

Auf dem heutigen gemeinsamen Backend bleibt die sichtbare Funktion bewusst **„Cloud-Daten löschen“**. Sie entfernt Nur-Islam-Profil, Backup und Cloud-Notizen und meldet danach ab; die gemeinsame Auth-Identität bleibt bestehen, damit keine Daten anderer Apps zerstört werden.

Für eine spätere native Store-Version existiert seit PR #39 zusätzlich eine vollständige Löscharchitektur:

- serverseitige Supabase Edge Function `delete-account`;
- Zielnutzer wird ausschließlich aus dem signierten Benutzer-Token ermittelt;
- kein privilegierter Admin-Schlüssel wird in den Browser gegeben;
- Client-Aktivierung nur mit `VITE_FULL_ACCOUNT_DELETION=true`;
- unabhängiger serverseitiger Kill-Switch `NUR_ALLOW_FULL_ACCOUNT_DELETE=true`;
- `NUR_STORE_RELEASE=true` blockiert den Store-Release, solange die vollständige In-App-Löschung nicht aktiviert ist;
- alle drei Nur-Islam-Tabellen hängen live per `ON DELETE CASCADE` an `auth.users`.

Diese vollständige Auth-Löschung ist **nicht auf dem derzeitigen Shared-Backend aktiviert** und darf dort nicht aktiviert werden. Dafür ist zuerst ein Nur-Islam-dediziertes Backend vorgesehen.

### Nur Assistent

- kein frei generierendes religiöses LLM;
- lokaler, quellengebundener Such-/Antwortmodus;
- persönliche Fatwa-/Halal-/Haram-/Pflicht-/Gültigkeitsfragen werden bewusst nicht beantwortet;
- bei fehlendem Quellen-Treffer wird keine religiöse Antwort erfunden.

### PWA, Preview und Persistenz

- Manifest, Service Worker, Offline-Shell und lokale Persistenz vorhanden;
- Install-, Navigations-, Reminder-, Restore- und Persistenzpfade sind automatisiert abgesichert;
- `npm run preview` erstellt seit PR #38 immer zuerst einen frischen lokalen Root-Build;
- lokales Production-Preview verwendet strikt Port `4173` und weicht bei einem alten Server nicht mehr still auf `4174`/`4175` aus;
- CI startet nach ihrem kontrollierten Build direkt den Preview-Server und erzeugt keinen zweiten Build mit falschem Base-Pfad;
- reale Install-/Update-/Recovery-Abnahme auf physischen iOS-/Android-Geräten bleibt offen.

## 3. Abgeschlossene Release-Härtung vom 23.–25. August 2026

### PR #35 – Release-CI, Render-QA, Audio-Grenzen und religiöser Review-Gate

In `premium-design-finish` integriert nach vollständigen grünen Nachweisen:

- zentrale `npm run check`-CI für den Release-Pfad;
- E2E und stabile Playwright-Container;
- Reference-Render-Matrix für Core, Legacy, Light Theme, iPhone WebKit und Compact iPhone WebKit;
- strenger `NUR_RELEASE=true`-Job für PRs nach `main`;
- Hisn-al-Muslim-Audio mit ungeklärter Wiederverwendungsfreigabe technisch blockiert;
- Audio-Wiedergabe über feste Host-Allowlist und passende CSP-/Legal-Guards;
- `docs/religious-release-review.json` plus `religious-review:check` eingeführt.

Der religiöse Gate bleibt absichtlich streng:

- Entwicklung darf mit `pending` weiterlaufen;
- `NUR_RELEASE=true` blockiert, solange ein Pflichtbereich ungeprüft ist;
- Freigaben benötigen Reviewer, Qualifikationskontext, Datum und exakten Inhalts-Hash;
- Inhaltsänderungen machen eine alte Freigabe automatisch ungültig;
- aktuell wird kein Bereich künstlich als fachlich freigegeben markiert.

### PR #36 – explizite Produktions-Backend-Konfiguration

`backend-config:check` erzwingt:

- `NUR_RELEASE=true` braucht eine explizite `VITE_SUPABASE_URL`;
- `NUR_RELEASE=true` braucht einen modernen `VITE_SUPABASE_PUBLISHABLE_KEY` im Format `sb_publishable_...`;
- Release-URL muss HTTPS und eine reine Supabase-Projekt-URL sein;
- Main-PR-Release-Readiness und Pages-Deployment reichen dieselben GitHub-Variablen weiter;
- der Meta-Guard hält `backend-config:check` fest in `npm run check`.

### PR #38 – stale lokale Preview-Builds verhindert

Die Ursache des lokal sichtbaren alten Home-Designs wurde beseitigt:

- `npm run preview` baut lokal automatisch frisch mit Root-Base;
- Port `4173` ist strikt;
- ein alter Prozess führt zu einem sichtbaren Fehler statt zu stillem Wechsel auf `4174`;
- E2E und Render-CI verwenden kontrollierte Einzel-Builds;
- die veralteten Hero-only-PRs #29 und #30 wurden geschlossen.

PR #38 und der anschließend gemergte RC wurden jeweils mit Vollcheck, E2E sowie Core/Legacy/Light/iPhone/Compact-iPhone-Render grün bestätigt.

### PR #39 – vollständige Account-Löschung sicher vorbereitet

PR #39 wurde am 25. August 2026 nach komplett grüner CI integriert.

Umgesetzt wurden:

- serverseitige vollständige Auth-Löschung für ein späteres dediziertes Backend;
- Benutzeridentität ausschließlich aus dem gültigen Session-Token;
- unabhängiger serverseitiger Kill-Switch;
- Client-Feature-Flag;
- Store-Release-Gate;
- statischer Check auf die benötigten `ON DELETE CASCADE`-Beziehungen;
- Unit-Tests für deaktiviert, serverseitig blockiert und erfolgreichen Löschpfad.

Der finale PR-Head und danach der gemergte RC `1e139f8` wurden jeweils durch Vollcheck, E2E und die vollständige Render-Matrix bestätigt.

## 4. Live-Backend-Nachweis vom 25. August 2026

Projekt-Ref: `jmswsgwnvmvsfayeodcd`  
Region: `eu-north-1`  
Status nach Reaktivierung: **`ACTIVE_HEALTHY`**

Live geprüft wurden:

- moderner `sb_publishable_...`-Key ist aktiv und entspricht dem dokumentierten Fallback;
- `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` existieren;
- RLS ist auf allen drei Tabellen aktiv;
- jede Tabelle besitzt SELECT-/INSERT-/UPDATE-/DELETE-Policies für `authenticated`;
- `delete_nur_islam_data()` existiert und arbeitet mit `auth.uid()`;
- die scoped Lösch-RPC ist nicht für `anon`/`public` ausführbar;
- alle drei Foreign Keys auf `auth.users` verwenden live `ON DELETE CASCADE`;
- Supabase Security Advisor meldete bei der Prüfung keine Security-Lints;
- aktuelle API-Logs enthielten nach dem Wiederhochfahren keine API-Fehler;
- Auth startete erfolgreich; beobachtet wurden nur Supabase-interne Deprecation-Warnungen, keine Nutzer-/Login-Fehler.

Das ist ein belastbarer technischer Live-Nachweis, ersetzt aber **nicht** die finale Produktionsentscheidung. Das Projekt ist ein gemeinsames Auth-Projekt. Vor einem nativen Store-Release darf die vollständige Auth-Löschung dort nicht aktiviert werden.

## 5. Aktueller automatisierter Nachweis

Auf dem exakt integrierten RC `1e139f883f5a89be89410d788485bbb6f96bdcbd` wurden nach dem Merge erfolgreich ausgeführt:

- `Premium redesign check` / kompletter `npm run check` – **success**;
- `End-to-end smoke` – **success**;
- Reference Render Core – **success**;
- Reference Render Legacy – **success**;
- Reference Render Light Theme – **success**;
- Reference Render iPhone WebKit – **success**;
- Reference Render Compact iPhone WebKit – **success**.

Aktueller Unit-/Integrationsteststand im Vollcheck: **22 Testdateien / 205 Tests erfolgreich**.

`npm run check` umfasst unter anderem:

- Secret- und Migration-Checks;
- Backend-/Store-Release-Konfiguration;
- Assets, Bilder, Icons und visuelle Referenzen;
- Content-/Quellenchecks;
- religiösen Release-Freigabe-Gate;
- Legal-/Privacy-Guardrails;
- Navigation, Reminder, Qibla, Prayer, Quran, Lernen und Persistenz;
- Unit-/Integrationstests;
- TypeScript;
- Production Build;
- Bundle-Budget und Stylesheet-Debt-Grenzen.

Ein grüner Browser-/CI-Nachweis ersetzt weiterhin keine reale Geräte-, Fach- oder Rechtsprüfung.

## 6. P0 – aktuell offene Release-Blocker

### 6.1 Betreiber / Recht

`src/data/legalContent.ts` enthält bei Betreibername, Straße, Ort und E-Mail weiterhin echte Ausfüll-Platzhalter.

Diese Angaben dürfen nicht erfunden werden. Der strenge Release-Modus soll solange fehlschlagen.

Vor öffentlichem Release erforderlich:

- echte Betreiberangaben;
- finale Prüfung von Impressum und Datenschutzerklärung;
- Abgleich aller tatsächlich aktiven externen Anbieter und Datenflüsse;
- spätere erneute Anpassung, sobald Payment/Entitlement aktiviert wird.

### 6.2 Religiöser Fachreview

Automatisierte Quellenchecks sind keine islamische Fachfreigabe.

Die acht verpflichtenden Bereiche in `docs/religious-release-review.json` stehen weiterhin auf `pending`. Priorität haben insbesondere Salah/Gebetspraxis, Wudu, Reise-/Sonderfälle, Duas/Dhikr, Hajj/Umrah, Hadith/Sunnah, Glaubensgrundlagen/99 Namen, Propheten/Gefährten sowie Quiz/Kalender/Ummah-Angaben.

Bis zur echten qualifizierten Freigabe dürfen diese Inhalte nicht als fachlich zertifiziert dargestellt werden.

### 6.3 Produktions-Backend / Betrieb

Das bisherige Shared-Projekt ist wieder aktiv und technisch überprüft. Offen bleibt:

- festlegen, ob dieses Projekt für den Web/PWA-Produktionsbetrieb akzeptiert wird oder ein dediziertes Nur-Islam-Projekt verwendet wird;
- `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` explizit für den Release setzen;
- Auth, Backup, Restore, Notes, Export und Löschung mit realen Testkonten gegen genau den gewählten Produktionsstand erneut prüfen;
- Projektstatus unmittelbar vor Release erneut live prüfen;
- für native Stores ein dediziertes Backend verwenden, bevor vollständige Account-Löschung aktiviert wird.

Ein neues kostenpflichtiges Supabase-Projekt wird nicht ohne bewusste Kosten-/Organisationsentscheidung erstellt.

### 6.4 Account-Löschung / native Stores

Die Architektur ist jetzt vorbereitet, aber die Store-Abnahme ist noch nicht abgeschlossen.

Vor einer nativen Store-Einreichung erforderlich:

- dediziertes Nur-Islam-Auth-/Supabase-Projekt;
- `delete-account` Edge Function dort deployen;
- serverseitig `NUR_ALLOW_FULL_ACCOUNT_DELETE=true` nur dort setzen;
- Client dort mit `VITE_FULL_ACCOUNT_DELETION=true` bauen;
- vollständige Löschung mit einem echten Testkonto nachweisen;
- nachweisen, dass Auth-Identität, Profil, State und Notizen entfernt werden;
- `NUR_STORE_RELEASE=true` auf dem finalen Store-Build erfolgreich durch den Gate führen.

### 6.5 Audio-/Nutzungsrechte

- ungeklärtes Hisn-al-Muslim-Audio ist technisch blockiert;
- verbleibende tatsächlich ausgelieferte Rezitations-/Audioquellen müssen final rechtlich dokumentiert werden;
- technische Abrufbarkeit ist keine Rechtefreigabe.

### 6.6 Reale Geräte

Mindestens ein reales iPhone und ein reales Android-Gerät müssen dokumentiert geprüft werden:

- PWA-Installation;
- Start / Neustart / Update / Recovery;
- Standort erlauben / verweigern;
- Qibla / Kompass / Device Orientation;
- Benachrichtigungen;
- Tastatur / Modals / Scroll;
- Online → Offline → Online;
- Gebetszeiten, Zeitzone und DST.

Browser-Chromium und WebKit-Simulation ersetzen diese physische Abnahme nicht.

### 6.7 GitHub-Release-Governance

Vor `main`/Produktion müssen verpflichtende Status-Checks bzw. Branch-/Ruleset-Regeln aktiviert sein, sodass die Release-Gates nicht durch einen ungeschützten Merge umgangen werden können.

## 7. Payment / Premium-Abo

Das lokale Premium-Komfortpaket existiert, aber es gibt bewusst noch keine echte Zahlung, Verlängerung oder serverseitig bestätigte Berechtigung.

Payment/Entitlement kommt erst nach den übrigen P0-Gates. Dann erforderlich:

1. Distributions-/Zahlungsweg festlegen;
2. aktuelles Store-/Plattformregelwerk prüfen;
3. Produkt/Abo konfigurieren;
4. serverseitig bestätigtes Entitlement anbinden;
5. Premium-Funktionen an dieses Entitlement koppeln;
6. Kauf, Restore, Verlängerung und Kündigungsstatus testen;
7. Datenschutz-/Impressums-/Zahlungstexte aktualisieren.

Eine lokale Storage-Flag darf niemals als Zahlungsnachweis gelten.

## 8. Nächste Release-Reihenfolge

1. Produktions-Backend für Web/PWA final festlegen und explizite Release-Variablen setzen;
2. Auth/RLS/Cloud-Funktionen mit realen Testkonten gegen genau dieses Backend verifizieren;
3. echte Betreiberangaben eintragen und rechtlich prüfen;
4. religiösen P0-Fachreview abschließen und hashgebundene Freigaben dokumentieren;
5. verbleibende Audio-Rechte final bestätigen;
6. reale iPhone-/Android-Abnahme inklusive Prayer/Qibla abschließen;
7. GitHub-`main`-Schutzregeln aktivieren;
8. für native Stores: dediziertes Backend + vollständige Account-Löschung deployen und real testen;
9. Payment/Entitlement nur falls für V1 gewünscht als letzten Produkt-Schritt integrieren;
10. final `NUR_RELEASE=true npm run check`, E2E und Visual-QA auf dem exakten Release-Commit grün bestätigen;
11. kleinen Beta-/Staged-Rollout und finalen Smoke-Test durchführen;
12. erst danach kontrolliert nach `main` übernehmen und Produktion beobachten.

## 9. Definition „V1 fertig“

V1 ist erst fertig, wenn:

- keine bekannten P0-Produktfehler offen sind;
- automatisierte technische Gates auf dem finalen RC grün sind;
- das Produktions-Backend aktiv, explizit konfiguriert und real verifiziert ist;
- reale iPhone-/Android-Prüfung dokumentiert ist;
- Prayer/Qibla real geprüft sind;
- Betreiber-/Datenschutz-/Rechtspaket ausgefüllt und final geprüft ist;
- Audio-Nutzungsrechte final bestätigt oder die betreffende Funktion deaktiviert ist;
- der priorisierte religiöse Fachreview abgeschlossen und hashgebunden dokumentiert ist;
- native Account-Löschung vor einer nativen Store-Einreichung auf einem dedizierten Backend real nachgewiesen ist;
- falls Premium bezahlt startet: echtes serverseitig bestätigtes Entitlement statt lokaler Scheinfreischaltung existiert;
- kontrollierter Release-/Rollback-Pfad festgelegt ist;
- kein als „fertig“ markierter Punkt nur auf einer Annahme beruht.

Bis dahin ist `premium-design-finish` ein **fortgeschrittener, technisch stark abgesicherter Release Candidate**, aber kein freigegebener öffentlicher Produktionsrelease.
