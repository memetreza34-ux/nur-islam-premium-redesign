# Nur Islam Premium – aktueller Release-Status

**Stand:** 16. August 2026  
**Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**Release-Candidate-Branch:** `premium-design-finish`  
**geprüfte Code-Basis vor diesem Dokumentations-Pass:** `9194deca692fea95204a04ceda624d0198b720b8`

> Dieses Dokument ist die **Single Source of Truth für den aktuellen Projektstatus**. Langfristige Ideen, Zielbilder und Checklisten im Masterplan sind Planungsunterlagen und dürfen nicht als Aussage über den heutigen Implementierungsstand gelesen werden.

## 1. Aktuelles Ziel

Die Feature-Entwicklung ist für den jetzigen Release-Pass **eingefroren**.

Es werden keine neuen Produktfunktionen ergänzt. Die Arbeit bis V1 konzentriert sich auf:

1. vorhandene Funktionen stabilisieren;
2. Design-, Bild-, Icon- und Lesbarkeitsfehler beseitigen;
3. echte Geräte-/Sensorpfade prüfen;
4. religiöse Inhalte fachlich freigeben;
5. Rechte, Datenschutz und Betreiberangaben abschließen;
6. erst danach kontrolliert veröffentlichen.

## 2. Was technisch bereits steht

### Produkt und UI

- Mobile-first PWA mit Dark- und Light-Theme.
- Fünf Hauptbereiche plus zahlreiche Sekundärscreens.
- Premium-Designsystem in Emerald/Gold/Cream.
- UI-Funktionsicons sind auf ein konsistentes `lucide-react`-Vektorsystem vereinheitlicht.
- Große thematische Illustrationen bleiben bewusst Illustrationen; sie werden nicht als kleine Bedienicons missbraucht.
- Bekannte beschädigte Moschee-WebP-Dateien werden nicht mehr durch ein anderes Motiv ersetzt, sondern auf das intakte gleichartige Moschee-SVG aufgelöst.
- Der zu kleine Kalender-Chip wird nicht mehr als vergrößertes Fasten-Hero-Artwork verwendet.
- Light-Mode-Kontrast der Legacy-/Wissensscreens wurde für bessere Lesbarkeit korrigiert.

### Quran

- Alle 114 Suren mit arabischem Uthmani-Text sind lokal/offline gebündelt.
- Die deutsche Übersetzung Bubenheim & Elyas wird nicht als vollständiger Übersetzungsbestand mit der App ausgeliefert, sondern surenweise online geladen und lokal gecacht.
- Lesefortschritt, exakte Ayah-Navigation und Favoriten/Lesezeichen sind implementiert.
- Die frühere falsche Zuordnung einer deutschen Übersetzung wurde im Quellen-Audit korrigiert.

### Gebetszeiten und Qibla

- Gebetszeiten nutzen Live-Daten, Browser-Cache und einen ausdrücklich gekennzeichneten Offline-Fallback.
- Standortkoordinaten werden vor der externen Gebetszeitenabfrage gröber gerundet.
- Berechnungsmethoden und Asr-Einstellung sind vorhanden.
- Qibla besitzt Browser-/iOS-Orientierungspfade einschließlich des iOS-Berechtigungswegs.
- **Noch offen:** reale physische Geräteprüfung für Standort, Kompassgenauigkeit, Kalibrierung, Zeitzonen/DST und lokale Methodenabgleiche.

### Accounts und Cloud

- Ein optionaler Supabase-Accountpfad ist implementiert.
- Registrierung, Login und Logout sind vorhanden.
- Profil, explizites Cloud-Backup, Wiederherstellung und Cloud-Notizen sind implementiert.
- Nutzer können ihre Nur-Islam-Cloud-Daten löschen.
- Die Tabellen `nur_islam_profiles`, `nur_islam_user_state` und `nur_islam_notes` verwenden RLS.
- Frontend-Zugriff ist auf authentifizierte CRUD-Rechte begrenzt; ein Service-Role-Key gehört nicht ins Frontend.
- Die App bleibt ohne Account lokal nutzbar.
- Cloud-Inhalte sind **nicht Ende-zu-Ende verschlüsselt**; das wird in der App transparent beschrieben.

### Nur Assistent

- Der aktuelle Assistent ist **kein frei generierendes religiöses LLM**.
- Er arbeitet als lokaler, quellengebundener Antwortmodus.
- Unterstützte Inhalte zeigen Quellenbezug; nicht unterstützte religiöse Fragen werden abgelehnt statt erfunden beantwortet.

### PWA und Persistenz

- Manifest, Service Worker, Offline-Shell und lokale Persistenz sind vorhanden.
- Install- und Navigationspfade besitzen automatisierte Prüfungen.
- **Noch offen:** abschließende reale Install-/Update-/Offline-/Recovery-Prüfung auf physischen iOS- und Android-Geräten.

## 3. Design-Finalpass – Stand

Der aktuelle Design-Pass verfolgt ausdrücklich **keinen Redesign-Neustart** und keine neuen Features.

Bereits korrigiert:

- selbstgezeichnete Sonderglyphen in Funktionskacheln durch echte Lucide-Vektoricons ersetzt;
- Home-Empfehlungen auf dieselbe Icon-Sprache vereinheitlicht;
- beschädigte/falsch ersetzte Moschee-Grafik korrigiert;
- ungeeignete kleinformatige Hero-Grafik beim Fasten-Assistenten ersetzt;
- Light-Mode-Lesbarkeit der Legacy-Screens verbessert;
- Bild-/Icon-Guardrails aktualisiert, damit die korrigierten Zuordnungen nicht zurückregressieren.

Automatisierte visuelle QA wurde unter anderem für folgende Zielgrößen ausgeführt:

- 390 × 844;
- 340 × 740;
- iPhone/WebKit 390 × 844;
- Compact WebKit 375 × 667;
- Dark Theme;
- Light Theme;
- Kern- und Legacy-Screens.

Das ersetzt **nicht** die physische Geräteabnahme für Sensoren, PWA-Installation und Betriebssystembesonderheiten.

## 4. Automatisierte Qualitätssicherung

GitHub Actions ist aktiv und funktionsfähig.

`npm run check` ist der zentrale technische Gate und umfasst unter anderem:

- Daten-/Content-Checks;
- Navigation und funktionale Guardrails;
- Asset-/Bild-/Icon-Prüfungen;
- Security-/Legal-/Release-Prüfungen;
- Unit-/Integrationstests;
- TypeScript;
- Production Build;
- Bundle-Budget;
- Stylesheet-Debt-Grenzen.

Der Release-Candidate-Stand wurde in diesem Finish-Pass wiederholt mit grünem `npm run check`, Playwright-E2E und Browser-Render-QA geprüft. Für den jeweils neuesten Lauf sind **GitHub Actions selbst** die maßgebliche Evidenz; dieses Statusdokument soll keine schnell veraltenden Run-IDs duplizieren.

Aktueller CSS-Debt-Guard nach dem Lesbarkeits-Fix:

- 97 Stylesheets;
- 33 `lock`/`parallel-pass`-Override-Dateien;
- 2.285 `!important`-Deklarationen;
- 733.678 Gesamtbytes Stylesheet-Budget.

Diese Altlast wird vor V1 **nicht in einem riskanten Großumbau** refaktoriert. Neue Override-Schichten dürfen aber nicht weiter wachsen; konkrete Releasefehler werden möglichst in der besitzenden Regel behoben.

## 5. Was einen öffentlichen Release noch blockiert

### P0 – Betreiber / Recht

Die Betreiberangaben in `src/data/legalContent.ts` enthalten noch `<<BITTE AUSFÜLLEN>>`.

Vor öffentlicher Bereitstellung müssen echte, rechtlich geprüfte Betreiber-/Kontaktangaben eingetragen werden. Diese Daten dürfen nicht erfunden werden.

### P0 – religiöser Fachreview

Die automatisierte Inhaltsprüfung ist umfangreich, ersetzt aber keinen qualifizierten islamischen Fachreview.

Besonders priorisiert werden müssen normative Inhalte, unter anderem:

- Salah / Gebetspraxis;
- Sujud as-Sahw;
- Reisegebet / Qasr / Zusammenlegen;
- verpasste Gebete;
- frauenspezifische Gebetsfragen;
- Janazah- und Eid-Gebet;
- Madhhab-Unterschiede;
- Hajj und Umrah.

### P0 – Audio-/Nutzungsrechte

Die App verwendet reale Quran-/Formel-Audioquellen. Die technische Quelle ist dokumentiert, aber die Nutzungsrechte für die öffentliche Bereitstellung müssen vor Release abschließend geklärt und dokumentiert werden.

Bis diese Prüfung abgeschlossen ist, darf der Status nicht „Audio-Rechte freigegeben“ behaupten.

### P0 – reale Geräte

Vor öffentlichem Release braucht es mindestens eine dokumentierte reale Prüfung auf iPhone und Android für:

- Installation als PWA;
- Start/Update/Offline/Recovery;
- Standortfreigabe;
- Qibla-Kompass und Device Orientation;
- Berechtigungsablehnung;
- Benachrichtigungen;
- Tastatur/Modals/Scroll;
- Wechsel online/offline;
- Prayer-Time-Zeitzonen-/DST-Pfade.

### P1 – Release-Betrieb

Vor breiter Veröffentlichung sollten außerdem Rollback, Fehlerbeobachtung, Support-/Korrekturweg und ein kontrollierter Beta-/Staged-Rollout festgelegt werden.

## 6. Nicht Teil dieses V1-Finish-Passes

Folgende Punkte werden **nicht** jetzt als neue Features eingebaut:

- native iOS-/Android-Neuentwicklung;
- App-Store-/Play-Store-Paketierung;
- In-App-Purchases oder Subscription-System;
- Stripe/RevenueCat/sonstige Bezahlarchitektur;
- frei generierender KI-/RAG-Assistent;
- zusätzliche große Produktmodule.

Der heutige Produktstand ist eine PWA. Ein späterer Native-/Payment-Pfad wird erst nach einem stabilen V1 separat entschieden.

## 7. Deployment-Wahrheit

`.github/workflows/deploy-pages.yml` veröffentlicht **nicht** automatisch `premium-design-finish`.

Der Pages-Workflow läuft bei:

- Push auf `main`;
- manueller `workflow_dispatch`-Ausführung.

Vor dem Upload läuft `npm run check` mit `NUR_RELEASE=true`. Damit sollen unter anderem Legal-Platzhalter einen echten Release blockieren.

Release-Reihenfolge:

1. `premium-design-finish` technisch und inhaltlich freigeben;
2. offene P0-Blocker schließen;
3. RC gegen die Release-Checkliste prüfen;
4. erst dann kontrolliert nach `main` übernehmen;
5. Pages-Release aus `main` beobachten und Smoke-Test durchführen;
6. bei Problemen Rollback statt hektischer Feature-Änderungen.

## 8. Definition „V1 fertig“

V1 ist erst fertig, wenn **alle** folgenden Aussagen belegt sind:

- keine bekannten P0-Produktfehler;
- `npm run check` grün;
- E2E grün;
- Browser-Visual-QA grün;
- reale iPhone-/Android-Prüfung dokumentiert;
- Prayer/Qibla reale Prüfung bestanden;
- Betreiber-/Datenschutz-/Rechtspaket ausgefüllt und geprüft;
- Audio-Nutzungsrechte geklärt oder betroffene Audiofunktion vor Release entfernt/deaktiviert;
- priorisierter religiöser Fachreview abgeschlossen;
- kein als „fertig“ markierter Punkt beruht nur auf einer Annahme;
- kontrollierter Release-/Rollback-Pfad festgelegt.

Bis dahin ist `premium-design-finish` ein **fortgeschrittener Release Candidate**, aber kein freigegebener öffentlicher Produktionsrelease.
