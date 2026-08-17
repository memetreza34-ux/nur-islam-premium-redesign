# Nur Islam Premium – aktueller Release-Status

**Stand:** 17. August 2026  
**Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**Release-Candidate-Branch:** `premium-design-finish`  
**Produktstand mit lokalem Premium-Paket:** Merge `2f258619ee46c95b11a15a3826b89c18d35c53b0`

> Dieses Dokument ist die **Single Source of Truth für den aktuellen Implementierungs- und Release-Status**. Langfristige Ideen und ältere Masterpläne dürfen nicht als Aussage über den heutigen Ist-Stand gelesen werden.

## 1. Aktuelles Ziel

Der Produktumfang ist nach dem bewusst ergänzten lokalen Premium-Komfortpaket wieder **eingefroren**. Bis zur Release-Freigabe werden keine weiteren großen Produktmodule ergänzt.

Die verbleibende Arbeit konzentriert sich auf:

1. Release- und Legal-Härtung;
2. echte Geräte-/Sensorprüfung;
3. religiösen Fachreview;
4. Audio-/Nutzungsrechte;
5. echte Betreiberangaben;
6. kontrollierten Beta-/Release-Pfad;
7. **erst danach** echte Abo-Abrechnung und Premium-Entitlement.

Arbeitsunterlagen:

- [`docs/RELEASE-CHECKLIST.md`](./docs/RELEASE-CHECKLIST.md) – operative Gesamtcheckliste.
- [`docs/AUDIO-RIGHTS-AUDIT.md`](./docs/AUDIO-RIGHTS-AUDIT.md) – aktueller Rechte-/Quellennachweis für Audio.
- [`docs/REAL-DEVICE-QA.md`](./docs/REAL-DEVICE-QA.md) – reale iPhone-/Android-Abnahmematrix.
- [`docs/RELEASE-OPERATIONS.md`](./docs/RELEASE-OPERATIONS.md) – Beta-, Smoke-Test- und Rollback-Runbook.

## 2. Was technisch bereits steht

### Produkt und UI

- Mobile-first PWA mit Dark- und Light-Theme.
- Fünf Hauptbereiche plus zahlreiche Sekundärscreens.
- Premium-Designsystem in Emerald/Gold/Cream.
- konsistentes `lucide-react`-Iconsystem für Bedien- und Kategorieicons.
- absichtliche größere Illustrationen bleiben Illustrationen; beschädigte oder falsche Bild-Fallbacks werden nicht als Ersatzmotiv kaschiert.
- bekannte Moschee-/Hero-/Light-Mode-Probleme des Design-Finalpasses sind korrigiert.

### Quran

- Alle 114 Suren mit arabischem Uthmani-Text sind lokal/offline gebündelt.
- Die deutsche Übersetzung Bubenheim & Elyas wird surenweise online geladen und lokal gecacht.
- Lesefortschritt, exakte Ayah-Navigation und Favoriten/Lesezeichen sind implementiert.

### Gebetszeiten und Qibla

- Gebetszeiten nutzen Live-Daten, Browser-Cache und gekennzeichneten Offline-Fallback.
- Standortkoordinaten werden vor der externen Gebetszeitenabfrage gröber gerundet.
- Berechnungsmethoden und Asr-Einstellung sind vorhanden.
- Qibla besitzt Browser-/iOS-Orientation-Pfade einschließlich iOS-Berechtigungsweg.
- **Noch offen:** physische Geräteprüfung für Standort, Kompass, Kalibrierung, Zeitzone/DST und lokale Methodenabgleiche.

### Accounts und Cloud

- optionaler Supabase-Accountpfad mit Registrierung, Login und Logout.
- Profil, explizites Cloud-Backup, Restore und Cloud-Notizen.
- Nutzer können ihre Nur-Islam-Cloud-Daten exportieren und löschen.
- `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` verwenden RLS.
- Frontend verwendet nur öffentliche/publishable Client-Konfiguration; kein Service-Role-Key gehört in den Browser.
- App bleibt ohne Account lokal nutzbar.
- Cloud-Inhalte sind nicht Ende-zu-Ende verschlüsselt; dies wird transparent beschrieben.

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

Die Premium-Logik ist bewusst lokal und verursacht in diesem Stand keine KI- oder nutzungsabhängigen API-Kosten.

Premium-Daten verwenden einen getrennten `local_nur_*`-Namensraum. Das generische Cloud-Backup akzeptiert nur `nur_*`/`premium_*`; dadurch werden insbesondere privates Journal, lokale Routinen, Quran-Plan, Premium-Erinnerungen, Premium-Ordner und Premium-Einstellungen nicht automatisch in die Cloud übertragen. Ein Regressionstest und der Legal-Guard sichern diese Grenze ab.

**Noch nicht implementiert/aktiv:** echte Zahlung, Abo-Verlängerung und serverseitig bestätigtes Premium-Entitlement. Die Premium-Oberfläche ist daher momentan eine technisch testbare Produktfunktion und noch kein bezahltes Zugangsmodell.

### Nur Assistent

- kein frei generierendes religiöses LLM.
- lokaler, quellengebundener Antwortmodus.
- nicht unterstützte religiöse Fragen werden abgelehnt statt erfunden beantwortet.

### PWA und Persistenz

- Manifest, Service Worker, Offline-Shell und lokale Persistenz vorhanden.
- Install- und Navigationspfade automatisiert geprüft.
- **Noch offen:** reale Install-/Update-/Offline-/Recovery-Abnahme auf physischen iOS- und Android-Geräten.

## 3. Automatisierte Qualitätssicherung

`npm run check` ist das zentrale technische Gate und umfasst unter anderem:

- Daten-/Content-Checks;
- Navigation und funktionale Guardrails;
- Asset-/Bild-/Icon-Prüfungen;
- Security-/Legal-/Release-Prüfungen;
- Unit-/Integrationstests;
- TypeScript;
- Production Build;
- Bundle-Budget;
- Stylesheet-Debt-Grenzen.

Für das lokale Premium-Paket wurden zusätzlich Browser-E2E-Flows für Öffnen, Statistik, Routinen und Persistenz nach Reload ergänzt. Nach dem Produkt-Merge liefen `npm run check`, Playwright-E2E und die Reference-Render-Matrix auf dem integrierten Stand grün.

Der jeweils neueste GitHub-Actions-Lauf ist die maßgebliche Evidenz. Dieses Dokument dupliziert bewusst keine schnell veraltenden Run-IDs oder CSS-Zähler.

## 4. Was einen öffentlichen Release noch blockiert

### P0 – Betreiber / Recht

`src/data/legalContent.ts` enthält bei Betreibername, Straße, Ort und E-Mail weiterhin `<<BITTE AUSFÜLLEN>>`.

Diese Angaben dürfen nicht erfunden werden. `NUR_RELEASE=true npm run check` muss solange fehlschlagen.

Die Legal-Copy wurde zusätzlich gehärtet:

- keine pauschale Behauptung zum deutschen Urheberrecht bei KI-generierten Bildern;
- technische Abrufbarkeit von Audio wird ausdrücklich nicht als Rechtefreigabe behandelt;
- lokale Premium-Daten und ihre Cloud-Backup-Grenze werden beschrieben;
- der aktuelle Stand sagt ausdrücklich, dass **noch keine Zahlung** entgegengenommen wird und die Texte vor Aktivierung eines Zahlungswegs erneut angepasst/geprüft werden müssen.

Eine qualifizierte rechtliche Endprüfung bleibt trotzdem erforderlich.

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

### P0 – Audio-/Nutzungsrechte

Die aktuelle Recherche ist in [`docs/AUDIO-RIGHTS-AUDIT.md`](./docs/AUDIO-RIGHTS-AUDIT.md) dokumentiert.

**Islamic Network / Al Quran Cloud:** Die aktuell veröffentlichten Terms beschreiben die Einbindung von Rezitationen und erlauben nach ihrem Wortlaut auch die Einbindung in kommerzielle Produkte. Gleichzeitig verbleiben Copyrights bei den Rezitatoren und die Terms weisen darauf hin, dass eine Entfernung verlangt werden kann. Das ist eine dokumentierte Nutzungsgrundlage, wird aber nicht als unbeschränkte eigene Rechtefreigabe behandelt.

**Hisn al-Muslim:** Für die verwendeten Audioaufnahmen wurde bei der aktuellen öffentlichen Prüfung keine eindeutige Weiterverwendungs-/Einbettungslizenz gefunden. Dieser Teil bleibt offen.

Vor Release muss die konkrete Audio-Nutzung final rechtlich bestätigt **oder** die jeweils unsichere Audiofunktion deaktiviert/entfernt werden.

### P0 – reale Geräte

Mindestens ein reales iPhone und ein reales Android-Gerät müssen dokumentiert geprüft werden. Die vollständige Matrix ist in [`docs/REAL-DEVICE-QA.md`](./docs/REAL-DEVICE-QA.md) vorbereitet.

P0-Mindestumfang:

- PWA-Installation;
- Start/Update/Offline/Recovery;
- Standortfreigabe und -ablehnung;
- Qibla-Kompass / Device Orientation;
- Benachrichtigungen;
- Tastatur/Modals/Scroll;
- Online-/Offline-Wechsel;
- Prayer-Time-Zeitzone/DST.

WebKit-/Browser-Simulation ersetzt diese physische Abnahme nicht.

### P1 – Release-Betrieb

Das Beta-/Smoke-/Rollback-Vorgehen ist in [`docs/RELEASE-OPERATIONS.md`](./docs/RELEASE-OPERATIONS.md) vorbereitet.

Noch real durchzuführen bzw. mit Betreiberangaben zu vervollständigen:

- echte Support-/Kontaktadresse sichtbar machen;
- letzte bekannte grüne Produktions-SHA unmittelbar vor Release festhalten;
- Beta-/Staged-Rollout tatsächlich durchführen;
- finalen Smoke-Test nach Deployment durchführen.

## 5. Payment / 0,99-€-Abo – bewusst letzter Schritt

Das Produktpaket für Premium ist vorhanden, aber die Bezahlarchitektur wird bewusst **nicht vor den übrigen Release-Härtungen** eingebaut.

Später erforderlich:

1. konkreten Distributions-/Zahlungsweg festlegen;
2. aktuelles Plattform-/Store-Regelwerk für diesen Weg prüfen;
3. 0,99-€-Produkt konfigurieren;
4. serverseitig bestätigtes Entitlement anbinden;
5. Premium-Funktionen hinter dieses Entitlement sperren;
6. Kauf, Wiederherstellung und Kündigungsstatus testen;
7. Datenschutz-/Impressums-/Zahlungstexte an den tatsächlich eingesetzten Anbieter anpassen.

Eine lokale `localStorage`-Flag darf niemals als vertrauenswürdiger Zahlungsnachweis dienen.

## 6. Dependency-Upgrades

Offene Dependabot-Vorschläge mit großen Versionssprüngen – darunter Vite 8, TypeScript 7, Motion 13 und Lucide 1.x – werden **nicht blind vor V1** übernommen. Sie sind kein aktueller Release-Blocker und würden unnötiges Regressionsrisiko in den stabilen RC bringen.

## 7. Deployment-Wahrheit

`.github/workflows/deploy-pages.yml` veröffentlicht nicht automatisch `premium-design-finish`.

Der Pages-Workflow läuft bei Push auf `main` oder manuell über `workflow_dispatch`. Vor dem Upload läuft `npm run check` mit `NUR_RELEASE=true`.

Damit bleibt der öffentliche Release absichtlich blockiert, solange insbesondere Betreiberangaben fehlen.

## 8. Release-Reihenfolge

1. technische/Legal-Härtung ohne neue Produktmodule abschließen;
2. Betreiberangaben eintragen und rechtlich prüfen lassen;
3. religiösen P0-Fachreview abschließen;
4. Audio-Rechte final bestätigen oder unsichere Audiofunktion deaktivieren;
5. reale iPhone-/Android-Abnahme abschließen;
6. Payment/Entitlement als letzten Produkt-Schritt integrieren und erneut rechtlich/technisch prüfen;
7. `NUR_RELEASE=true npm run check`, E2E und Visual-QA grün bestätigen;
8. kleinen Beta-/Staged-Rollout durchführen;
9. erst danach kontrolliert nach `main` übernehmen und Produktion beobachten.

## 9. Definition „V1 fertig“

V1 ist erst fertig, wenn alle relevanten Aussagen belegt sind:

- keine bekannten P0-Produktfehler;
- automatisierte technische Gates grün;
- reale iPhone-/Android-Prüfung dokumentiert;
- Prayer/Qibla real geprüft;
- Betreiber-/Datenschutz-/Rechtspaket ausgefüllt und final geprüft;
- Audio-Nutzungsrechte final bestätigt oder unsichere Audiofunktion deaktiviert;
- priorisierter religiöser Fachreview abgeschlossen;
- falls Premium bezahlt startet: echtes, serverseitig bestätigtes Entitlement statt lokaler Scheinfreischaltung;
- kontrollierter Release-/Rollback-Pfad festgelegt;
- kein als „fertig“ markierter Punkt beruht nur auf einer Annahme.

Bis dahin ist `premium-design-finish` ein **fortgeschrittener Release Candidate**, aber kein freigegebener öffentlicher Produktionsrelease.
