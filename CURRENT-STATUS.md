# Nur Islam Premium – aktueller Release-Status

**Stand:** 23. August 2026  
**Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**Aktiver Release-Candidate-Branch:** `premium-design-finish`  
**Aktuell integrierter RC-Stand:** `27bccd15663bf005d78fb11111f7aaec1ada0f14`  
**Produktumfang:** für V1 eingefroren – keine neuen großen Module vor Abschluss der P0-Gates

> Dieses Dokument ist die **Single Source of Truth für den aktuellen Implementierungs- und Release-Status**. Ältere Masterpläne, Branch-Namen oder Checklisten dürfen nicht als Aussage über den heutigen Ist-Stand gelesen werden.

## 1. Kurzstatus

Nur Islam Premium ist ein weit fortgeschrittener Release Candidate, aber **noch kein freigegebener Produktionsrelease**.

Technisch sind die zentralen Frontend-, PWA-, E2E- und Visual-QA-Gates inzwischen belastbar. Die verbleibenden P0-Punkte sind überwiegend reale Freigaben oder externe Betriebsnachweise:

1. echte Betreiber-/Rechtsangaben;
2. qualifizierter religiöser Fachreview;
3. reales iPhone-/Android-QA einschließlich Sensoren, Offline und Berechtigungen;
4. Live-Prüfung von Gebetszeiten und Qibla;
5. aktives und explizit konfiguriertes Produktions-Backend;
6. finale Rechteprüfung der tatsächlich ausgelieferten Audioquellen;
7. bei nativer Store-Veröffentlichung: vollständige Account-Löscharchitektur;
8. verpflichtende GitHub-Merge-/Statusregeln für `main`;
9. erst danach Payment/Entitlement und kontrollierter Release.

## 2. Was technisch bereits steht

### Produkt und UI

- Mobile-first React-/TypeScript-/Vite-PWA mit Dark- und Light-Theme.
- Fünf Hauptbereiche plus zahlreiche Sekundärscreens.
- Premium-Designsystem in Emerald/Gold/Cream mit konsistentem Lucide-Iconsystem.
- kompakter Dashboard-Home-Einstieg mit Gebet, Quran, Lernen, Tools und Empfehlungen.
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
- `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` verwenden RLS und nutzergebundene Policies;
- Frontend verwendet öffentliche/publishable Client-Konfiguration;
- App bleibt ohne Konto lokal nutzbar;
- Cloud-Inhalte werden nicht als Ende-zu-Ende verschlüsselt beworben.

Die Löschfunktion ist bewusst als **„Cloud-Daten löschen“** beschrieben. Sie entfernt Nur-Islam-Profil, Cloud-Backup und Cloud-Notizen, aber nicht die gemeinsame Supabase-Auth-Identität, weil das derzeitige Auth-Projekt auch andere Apps bedienen kann. Diese UI-/Backend-Grenze ist transparent, reicht für eine spätere native Store-Einreichung mit vollständiger Account-Löschpflicht aber noch nicht als Endarchitektur.

### Nur Assistent

- kein frei generierendes religiöses LLM;
- lokaler, quellengebundener Such-/Antwortmodus;
- persönliche Fatwa-/Halal-/Haram-/Pflicht-/Gültigkeitsfragen werden bewusst nicht beantwortet;
- bei fehlendem Quellen-Treffer wird keine religiöse Antwort erfunden.

### PWA und Persistenz

- Manifest, Service Worker, Offline-Shell und lokale Persistenz vorhanden;
- Install-, Navigations-, Reminder-, Restore- und Persistenzpfade sind automatisiert abgesichert;
- reale Install-/Update-/Recovery-Abnahme auf physischen iOS-/Android-Geräten bleibt offen.

## 3. Abgeschlossene Release-Härtung am 23. August 2026

### PR #35 – Release-CI, Render-QA, Audio-Grenzen und religiöser Review-Gate

PR #35 wurde nach vollständigen grünen Nachweisen in `premium-design-finish` integriert.

Dabei wurden unter anderem umgesetzt:

- zentrale `npm run check`-CI auch für den tatsächlichen Release-Pfad;
- E2E auf dem gemergten Release-Stand;
- stabile Playwright-Container statt dynamischer Browserinstallation;
- korrigierte Production-Preview-Warte- und Capture-Pfade;
- aktuelle Kalender-Navigation in Core- und Light-Theme-Render-QA;
- vollständige Reference-Render-Matrix für Core, Legacy, Light Theme, iPhone WebKit und Compact iPhone WebKit;
- strenger `NUR_RELEASE=true`-Job für PRs nach `main`;
- Hisn-al-Muslim-Audio mit ungeklärter Wiederverwendungsfreigabe wird nicht mehr ausgeliefert;
- Audio-Wiedergabe verwendet eine feste Host-Allowlist; derzeit ist nur der freigegebene Islamic-Network-Pfad technisch zugelassen;
- CSP und Legal-Guard bilden dieselbe Audio-Grenze ab;
- `docs/religious-release-review.json` plus `religious-review:check` eingeführt.

Der religiöse Release-Gate arbeitet absichtlich konservativ:

- normale Entwicklungschecks dürfen mit `pending` weiterlaufen;
- `NUR_RELEASE=true` blockiert, solange ein verpflichtender Review-Bereich nicht freigegeben ist;
- eine Freigabe benötigt Reviewer, Qualifikationskontext, Datum und den exakten SHA-256-Inhalts-Hash;
- ändert sich später eine geprüfte Inhaltsdatei, wird die alte Freigabe automatisch ungültig;
- aktuell wird **kein** Review-Bereich künstlich als freigegeben markiert.

### PR #36 – explizite Produktions-Backend-Konfiguration

PR #36 wurde ebenfalls nach grünem Vollcheck, grünem E2E und kompletter grüner Render-Matrix integriert.

Neu ist `backend-config:check`:

- Entwicklung darf weiterhin den dokumentierten Quellcode-Fallback verwenden;
- `NUR_RELEASE=true` verlangt eine explizite `VITE_SUPABASE_URL`;
- `NUR_RELEASE=true` verlangt einen modernen `VITE_SUPABASE_PUBLISHABLE_KEY` im Format `sb_publishable_...`;
- Release-URL muss HTTPS und eine reine Supabase-Projekt-URL sein;
- Main-PR-Release-Readiness und Pages-Deployment reichen dieselben GitHub-Variablen an den Check weiter;
- der Meta-Guard erzwingt, dass `backend-config:check` Bestandteil von `npm run check` bleibt;
- ein öffentlicher Release kann dadurch nicht mehr unbemerkt auf fehlende Produktionsvariablen zurückfallen.

Der Gate prüft absichtlich nur die Konfiguration. **Live-Erreichbarkeit und Projektzustand müssen zusätzlich extern geprüft werden.**

## 4. Aktueller automatisierter Nachweis

Auf den zuletzt integrierten Hardening-PRs wurden folgende GitHub-Actions-Pfade erfolgreich ausgeführt:

- `Premium redesign check` / kompletter `npm run check` – **success**;
- `End-to-end smoke` – **success**;
- Reference Render Core – **success**;
- Reference Render Legacy – **success**;
- Reference Render Light Theme – **success**;
- Reference Render iPhone WebKit – **success**;
- Reference Render Compact iPhone WebKit – **success**.

`npm run check` umfasst unter anderem:

- Secret- und Migration-Checks;
- explizite Backend-Release-Konfiguration;
- Assets, Bilder, Icons und visuelle Referenzen;
- Content-/Quellenchecks;
- qualifizierten religiösen Release-Freigabe-Gate;
- Legal-/Privacy-Guardrails;
- Navigation, Reminder, Qibla, Prayer, Quran, Lernen und Persistenz;
- Unit-/Integrationstests;
- TypeScript;
- Production Build;
- Bundle-Budget und Stylesheet-Debt-Grenzen.

Ein grüner Browser-/CI-Nachweis ersetzt weiterhin keine reale Geräte-, Fach- oder Rechtsprüfung.

## 5. P0 – aktuell offene Release-Blocker

### 5.1 Betreiber / Recht

`src/data/legalContent.ts` enthält bei Betreibername, Straße, Ort und E-Mail weiterhin echte Ausfüll-Platzhalter.

Diese Angaben dürfen nicht erfunden werden. Der strenge Release-Modus soll solange fehlschlagen.

Vor öffentlichem Release erforderlich:

- echte Betreiberangaben;
- finale Prüfung von Impressum und Datenschutzerklärung;
- Abgleich aller tatsächlich aktiven externen Anbieter und Datenflüsse;
- spätere erneute Anpassung, sobald Payment/Entitlement aktiviert wird.

### 5.2 Religiöser Fachreview

Automatisierte Quellenchecks sind keine islamische Fachfreigabe.

Die verpflichtenden Bereiche in `docs/religious-release-review.json` stehen weiterhin auf `pending`. Priorität haben insbesondere:

- Salah / Gebetspraxis;
- Wudu;
- Sujud as-Sahw;
- Reisegebet / Qasr / Jamʿ;
- verpasste Gebete;
- frauenspezifische Gebetsfragen;
- Janazah und Eid;
- Madhhab-Unterschiede;
- Duas / Dhikr;
- Hajj / Umrah;
- Hadith-/Sunnah-Inhalte;
- Glaubensgrundlagen und 99 Namen;
- Propheten / Gefährten;
- Quiz / Kalender / Ummah-Angaben.

Bis zur echten Freigabe dürfen diese Inhalte nicht als fachlich zertifiziert dargestellt werden.

### 5.3 Produktions-Backend

Live-Prüfung am **23. August 2026** über die verbundene Supabase-Umgebung:

- Projekt-Ref: `jmswsgwnvmvsfayeodcd`;
- Region: `eu-north-1`;
- Status zum Prüfzeitpunkt: **`INACTIVE`**.

Dieses Projekt entspricht dem derzeitigen Quellcode-Fallback. Daher gilt:

- Cloud/Login sind aktuell **nicht als produktionsbereit nachgewiesen**;
- vor Release muss ein aktives Produktionsprojekt festgelegt werden;
- `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` müssen explizit für den Release gesetzt sein;
- danach müssen Auth, RLS, Backup, Restore, Notes, Export und Löschung gegen genau dieses aktive Projekt erneut getestet werden;
- der Projektstatus muss unmittelbar vor Release erneut live geprüft werden.

Das Projekt wird nicht automatisch reaktiviert und es wird nicht automatisch ein neues kostenpflichtiges Projekt erstellt.

### 5.4 Account-Löschung / native Stores

Die aktuelle Web/PWA-Funktion löscht Nur-Islam-Cloud-Daten korrekt und beschreibt diese Grenze ehrlich. Sie löscht nicht die gemeinsame Auth-Identität.

Vor einer nativen Store-Einreichung muss entschieden und umgesetzt werden:

- dediziertes Nur-Islam-Auth-/Supabase-Projekt **oder**
- eine andere serverseitige Architektur, die eine vollständige Nur-Islam-Account-Löschung ermöglicht, ohne Daten anderer Apps zu zerstören.

### 5.5 Audio-/Nutzungsrechte

- ungeklärtes Hisn-al-Muslim-Audio ist technisch blockiert;
- verbleibende tatsächlich ausgelieferte Rezitations-/Audioquellen müssen final rechtlich dokumentiert werden;
- technische Abrufbarkeit ist keine Rechtefreigabe.

### 5.6 Reale Geräte

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

### 5.7 GitHub-Release-Governance

Vor `main`/Produktion müssen verpflichtende Status-Checks bzw. Branch-/Ruleset-Regeln aktiviert sein, sodass die Release-Gates nicht einfach durch einen ungeschützten Merge umgangen werden können.

## 6. Payment / Premium-Abo

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

## 7. Nächste Release-Reihenfolge

1. Produktions-Backend-Entscheidung treffen und aktiven Supabase-Zielstand herstellen;
2. Auth/RLS/Cloud-Funktionen gegen dieses aktive Backend real verifizieren;
3. echte Betreiberangaben eintragen und rechtlich prüfen;
4. religiösen P0-Fachreview abschließen und die Hash-gebundenen Freigaben dokumentieren;
5. verbleibende Audio-Rechte final bestätigen;
6. reale iPhone-/Android-Abnahme inklusive Prayer/Qibla abschließen;
7. GitHub-`main`-Schutzregeln aktivieren;
8. Payment/Entitlement nur falls für V1 gewünscht als letzten Produkt-Schritt integrieren;
9. final `NUR_RELEASE=true npm run check`, E2E und Visual-QA auf dem exakten Release-Commit grün bestätigen;
10. kleinen Beta-/Staged-Rollout und finalen Smoke-Test durchführen;
11. erst danach kontrolliert nach `main` übernehmen und Produktion beobachten.

## 8. Definition „V1 fertig“

V1 ist erst fertig, wenn:

- keine bekannten P0-Produktfehler offen sind;
- automatisierte technische Gates auf dem finalen RC grün sind;
- das Produktions-Backend aktiv und real verifiziert ist;
- reale iPhone-/Android-Prüfung dokumentiert ist;
- Prayer/Qibla real geprüft sind;
- Betreiber-/Datenschutz-/Rechtspaket ausgefüllt und final geprüft ist;
- Audio-Nutzungsrechte final bestätigt oder die betreffende Funktion deaktiviert ist;
- der priorisierte religiöse Fachreview abgeschlossen und hashgebunden dokumentiert ist;
- native Account-Löschung vor einer nativen Store-Einreichung regelkonform gelöst ist;
- falls Premium bezahlt startet: echtes serverseitig bestätigtes Entitlement statt lokaler Scheinfreischaltung existiert;
- kontrollierter Release-/Rollback-Pfad festgelegt ist;
- kein als „fertig“ markierter Punkt nur auf einer Annahme beruht.

Bis dahin ist `premium-design-finish` ein **fortgeschrittener, technisch stark abgesicherter Release Candidate**, aber kein freigegebener öffentlicher Produktionsrelease.
