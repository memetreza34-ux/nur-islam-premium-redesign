# 00 – Ist-Analyse A–Z

## 1. Audit-Basis

Analysiert wurde der tatsächliche Stand von:

- Repository: `memetreza34-ux/nur-islam-premium-redesign`
- Branch: `premium-home-redesign`
- HEAD beim Audit: `25e744a460b2c482b31d7b8c083a4998f6523e10`
- offener Draft-PR im App-Repo: `#1`

Wichtig: `main` des Redesign-Repositories enthält nicht die eigentliche aktuelle App. Der relevante Code liegt im Branch `premium-home-redesign`.

## 2. Gesamturteil

Der Branch ist **kein leerer Entwurf**, sondern bereits ein großer mobiler Frontend-/PWA-Prototyp mit vielen implementierten Screens und Datenchecks. Gleichzeitig ist er **noch keine releasefertige produktive App**.

### Stark

- klare Premium-Designrichtung;
- sehr breite Funktionsabdeckung;
- React/TypeScript statt reinem Mockup;
- PWA-Grundlage;
- lokale Speicherung vieler Fortschritte;
- echte externe Datenwege für Quran, Gebetszeiten und Moscheen;
- Fehler-, Offline- und Cachekonzepte vorhanden;
- ungewöhnlich viele projektspezifische statische Prüfskripte;
- religiöse Demo-/Unsicherheitsgrenzen werden an mehreren Stellen sichtbar gemacht;
- Original-Repo bleibt von der Redesign-Arbeit getrennt.

### Kritische Lücken vor v1

1. Kein produktives Account-/Backend-/Cloud-Sync-System.
2. Religiöse Inhalte sind nicht vollständig fachlich freigegeben.
3. Der KI-Assistent ist nur UI/Prototyp.
4. Die vollständige Quran-/Hadith-/Lerninhaltsbasis braucht einen dokumentierten Freigabestand.
5. Kein extern bestätigter vollständiger `npm run check`-/Build-Nachweis.
6. Reale Geräte- und visuelle Abnahme fehlt als belegter Abschluss.
7. Datenschutz, Anbieterregister, Impressum/Betreiberinformationen und Store-Daten sind nicht final.
8. Kein produktives Payment-/Entitlement-System für eine echte Premium-Version.
9. Monitoring/Incident/Recovery für öffentlichen Betrieb ist nicht vollständig nachgewiesen.

## 3. Architektur heute

### Client

- React 19
- TypeScript
- Vite 6
- `motion/react`
- Lucide Icons
- Fontsource: Amiri, Cormorant Garamond, Inter
- CSS-basierte eigene Designschicht

### Persistenz

Große Teile des Zustands liegen derzeit in `localStorage` bzw. Browser-Caches:

- Onboarding;
- Gebets-Tracker und Erinnerungen;
- Dhikr-Fortschritt;
- Quran-Lesezeichen/Reader-Zustand;
- Dua-/Namen-Favoriten;
- Kalenderdaten;
- Lernfortschritt;
- Sprache/Darstellung;
- Prayer-/Mosque-Caches.

Vorteil: geringe Infrastruktur und gute Offline-Basis.  
Nachteil: kein geräteübergreifender Sync, keine serverseitige Integrität, kein Account-Recovery für Nutzerdaten, begrenzte Mehrgeräte-/Premium-Entitlements.

## 4. Externe Live-Datenwege

### Gebetszeiten

`src/prayerTimesService.ts` nutzt aktuell:

- `api.aladhan.com`
- Gerätestandort oder Berlin als Default
- auswählbare Methode
- Standard-/Hanafi-Asr
- Tagescache
- Offline-Fallback

Positiv:

- Timeout;
- Validierung der Zeiten;
- Cache;
- sichtbarer Fallback;
- Hinweis auf mögliche lokale Abweichungen.

Vor Release zu klären:

- Anbieter-/API-Nutzungsbedingungen und Stabilität;
- Datenschutz für Standortweitergabe;
- Berechnungsmethoden fachlich dokumentieren;
- regionale Korrektur/örtliche Moschee;
- Testmatrix über Länder, Zeitzonen, Sommerzeit und Polregionen.

### Quran

`src/quranService.ts` nutzt:

- lokale Metadaten für 114 Suren;
- 4 Suren vollständig offline;
- `api.alquran.cloud` für weitere Suren;
- arabische Edition `quran-uthmani`;
- deutsche Edition `de.bubenheim`;
- Browser-Cache;
- Validierung von Surennummer, Ayah-Anzahl und Edition.

Vor Release:

- Lizenz-/Nutzungsrechte und Quellenregister je Edition verbindlich dokumentieren;
- vollständige fachliche Text-/Übersetzungsprüfung;
- Offline-Strategie für alle 114 Suren entscheiden;
- Audio erst mit geprüfter Rezitationsquelle.

### Moschee-Finder

`src/mosqueService.ts` nutzt:

- OpenStreetMap-Daten über öffentliche Overpass-Endpunkte;
- Standortabfrage;
- 10-km-Radius;
- lokale 24h-Caches;
- Entfernungssortierung;
- keine erfundenen Fallback-Moscheen.

Vor Release:

- OSM/Overpass Attribution/Nutzungsanforderungen korrekt anzeigen;
- öffentliche Endpunkte nicht als garantiertes Produkt-SLA behandeln;
- Rate Limits/Abuse und möglicher eigener Proxy/Cache prüfen;
- Standortdatenschutz transparent machen;
- unvollständige/veraltete OSM-Daten klar kennzeichnen.

## 5. Screens und Funktionsbreite

Aktuell vorhanden bzw. erreichbar:

- Home
- Gebete
- Kalender
- Lernen
- Mehr/Profil
- Quran-Übersicht
- Quran-Reader
- Ayah-Detail
- Hadith-Detail
- Dhikr
- Qibla
- Duas
- 99 Namen Allahs
- Moscheen
- Sammlungen
- Assistent
- Wudu/Salah
- Legacy-Bereiche wie Quiz, Propheten, Hajj/Umrah, Sunnah, Fasten, Jumuah, Zakat und weitere.

Das Problem ist deshalb nicht primär „zu wenig Funktionen“, sondern **Release-Härtung, Quellenqualität, Datenarchitektur, echte Tests und Priorisierung**.

## 6. Navigation und Produktstruktur

Die Hauptnavigation ist bereits auf fünf Primärbereiche reduziert:

- Home
- Gebete
- Kalender
- Lernen
- Mehr

Das ist sinnvoll. Detail- und Spezialbereiche werden aus den Primärscreens geöffnet.

Risiko: Die Funktionsmenge ist sehr groß. Für v1 muss verhindert werden, dass 30 sichtbare Features mit unterschiedlicher Datenqualität gleichzeitig als gleich fertig erscheinen.

Empfehlung:

- Kernmodule klar markieren;
- Beta-/experimentelle Funktionen kennzeichnen;
- unfertige Bereiche notfalls hinter Feature Flags verbergen;
- keine Demo-Buttons/Toasts als echte Funktion darstellen.

## 7. Design und Assets

Stärken:

- Smaragd/Gold/Creme;
- echte WebP-Premiumobjekte;
- wiederkehrende Karten-/Headerlogik;
- Safe-Area- und Mobile-Regeln;
- Touch-Target-Checks;
- Overlay-Checks;
- Reduced-Motion-Unterstützung;
- arabische Schriftfamilie vorhanden.

Risiken:

- sehr viele CSS-Layer und `reference-*`-Dateien erhöhen Wartungskomplexität;
- visuelle Prüfskripte ersetzen keine echte gerenderte Screenshot-Abnahme;
- 320–390px, große Displays, Textskalierung, RTL/Arabisch und lange deutsche Texte müssen real geprüft werden.

## 8. Testing heute

`package.json` besitzt einen sehr breiten `npm run check`-Pfad mit:

- Asset-Prüfung
- Deployment-Pfade
- Visual-Konsistenz
- Onboarding
- Overlays
- Micro-UI
- Filter
- Touch Targets
- Layout
- Namen
- Duas
- Quran
- Dhikr
- Navigation
- Qibla
- Gebetslernen
- Live-Gebetszeiten
- Home-Sync
- Lernkurse
- Prayer Reminders
- Moschee-Finder
- TypeScript
- Produktionsbuild

Das ist positiv, aber überwiegend projektspezifisch/statisch. Zusätzlich erforderlich:

- echte Unit-Tests für Berechnungslogik;
- Component-/Integrationstests;
- E2E-Tests;
- Browser-/Device-Tests;
- Accessibility-Automation plus manuelle Prüfung;
- echte API-Fehler-/Timeout-/Rate-Limit-Fälle;
- PWA-Update-/Cache-Migrationstests.

## 9. CI

Ein Workflow existiert, aber ein grüner vollständiger Lauf ist nicht als Nachweis bestätigt. Der bekannte Runner-/Billing-/Account-Blocker muss getrennt von Codefehlern behandelt werden.

Kein Release-Gate darf auf „wahrscheinlich grün“ beruhen.

## 10. Religiöse Inhaltsqualität

Positiv:

- „sinngemäß“ wird an mehreren Stellen verwendet;
- Hadith-/Dhikr-Quellen sind teilweise sichtbar;
- schwierige Fragen werden nicht automatisch als Fatwa dargestellt;
- KI-Assistent behauptet aktuell nicht, produktiv zu antworten.

Vor Release zwingend:

- einheitliches Quellenregister;
- Authentizitäts-/Editionsangabe;
- Übersetzungsrechte;
- Reviewstatus je Datensatz;
- Umgang mit Madhhab-/Fiqh-Unterschieden;
- definierter Fachreview;
- Änderungsprozess bei Korrekturen.

## 11. Security heute

Die App hat wenig serverseitige Angriffsfläche, weil aktuell kaum eigenes Backend existiert. Das ändert sich sofort mit Accounts, Sync, KI und Payments.

Schon heute relevant:

- externe API-Daten validieren;
- Geolocation minimieren;
- keine Secrets in Clientcode;
- URL-/Link-Sicherheit;
- Service-Worker-Cache sicher aktualisieren;
- lokale Daten robust gegen korrupte Werte lesen;
- Dependency-Updates.

Mit Backend zusätzlich:

- Auth;
- serverseitige Autorisierung/RLS;
- Rate Limits;
- Abuse-Schutz;
- sichere Webhooks;
- Audit;
- Datenexport/-löschung;
- Backup/Restore.

## 12. Release-Reife – aktuelle Einschätzung

| Bereich | Reife |
|---|---:|
| Premium-UI | hoch, aber visuelle Endabnahme offen |
| Feature-Breite | sehr hoch |
| PWA/Offline-Basis | mittel bis hoch |
| religiöse Quellenfreigabe | mittel/unvollständig |
| Backend/Auth/Sync | niedrig/nicht produktiv |
| KI-Assistent | UI-Prototyp |
| Payments/Premium-Entitlements | nicht produktiv |
| Security für heutige PWA | mittel |
| Security für Zielprodukt | noch aufzubauen |
| Datenschutz/Recht/Stores | offen bis teilweise |
| automatisierte Prüfungen | breit vorhanden |
| echter Build-/CI-Nachweis | offen |
| reale Geräte-/E2E-Abnahme | offen |
| Monitoring/Betrieb | offen |

## 13. Wichtigste Entscheidung

**Keine weitere breite Feature-Offensive vor Stabilisierung.**

Die App hat bereits genug Funktionen für ein starkes Produkt. Der höchste Qualitätsgewinn kommt jetzt aus:

1. Kernumfang festlegen;
2. religiöse Quellen und Datenqualität abschließen;
3. Zielarchitektur/Auth/Sync/Entitlements entscheiden;
4. echte Tests/Build/Preview durchführen;
5. Datenschutz/Stores/Launch vorbereiten;
6. erst danach weitere Spezialfunktionen ausbauen.
