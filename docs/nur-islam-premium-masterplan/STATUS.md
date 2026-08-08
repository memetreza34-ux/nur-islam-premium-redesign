# Status – Nur Islam Premium

**Stand:** 8. August 2026  
**Analysebasis:** `memetreza34-ux/nur-islam-premium-redesign` / Branch `premium-home-redesign` / HEAD `25e744a460b2c482b31d7b8c083a4998f6523e10`

## Handbuchstatus

**Die projektspezifische Nur-Islam-Premium-Anleitung ist strukturell gegen den vollständigen App-Master-Standard ausgebaut.**

Sie besitzt jetzt eigene Bereiche für:

- Ist-Analyse;
- Produkt/Zielgruppe;
- Markt/Wettbewerb/Nutzerforschung;
- Funktionen und Content;
- religiöse Quellen/Fachreview;
- Premium UX/UI;
- Architektur/Daten/Backend;
- KI-Assistent/Safety;
- Security/Datenschutz/Recht;
- Testing/QA;
- Native iOS/Android und Storestrategie;
- Monetarisierung/Payments;
- Marketing/ASO/Growth;
- Kosten/Profitabilität;
- Accounts/Tools/Secrets/Environments;
- Content-Betrieb/Korrekturen/Rollback;
- Internationalisierung/RTL;
- Launch/Betrieb;
- Roadmap und finale Release-Gates.

Der formale Abgleich steht in [`18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md`](./18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md).

**Wichtig:** Das bedeutet, dass der *Arbeits- und Prüfpfad* vollständig strukturiert ist. Es bedeutet nicht, dass die App selbst bereits releasefertig ist oder externe Prüfungen erledigt wurden.

## Gesamtstatus der App

**Produktphase:** umfangreicher Frontend-/PWA-Prototyp vor Produktionsreife.

Die App besitzt bereits eine sehr breite sichtbare Funktionsbasis. Der Schwerpunkt muss jetzt von „mehr Features“ auf **Belege, Quellenfreigabe, echte Tests, Backend-/Premium-Entscheidungen, Datenschutz und Release-Härtung** wechseln.

## Reife nach Bereich

| Bereich | Status | Einordnung |
|---|---|---|
| Premium UI/Design | 🟢/🟡 | stark aufgebaut; reale vollständige Screenshot-/Geräteabnahme noch offen |
| Navigation/Kernscreen-Breite | 🟢 | fünf Haupttabs + viele Sekundärscreens vorhanden |
| PWA/Offline-Basis | 🟢/🟡 | Manifest, SW, Cache und lokale Persistenz vorhanden; Update-/Recovery-Endtest offen |
| Gebetszeiten | 🟡 | AlAdhan live + Cache/Fallback; Datenschutz, Methodenreview und reale Matrix offen |
| Qibla | 🟡 | Berechnung/Sensorpfad vorhanden; echte Geräte-/Kalibrierungsabnahme offen |
| Quran | 🟡 | 114 Metadaten, 4 offline, übrige online/cache; Editions-/Lizenz-/Freigabestrategie offen |
| Dhikr | 🟢/🟡 | technisch weit; fachlicher Endreview erforderlich |
| Duas | 🟢/🟡 | technisch weit; Quellen-/Fachreview erforderlich |
| 99 Namen Allahs | 🟢/🟡 | vollständig sichtbar; stabile IDs und Fachreview prüfen |
| Kalender | 🟢/🟡 | funktional; regionale Hijri-/Ereignisfragen offen |
| Lernen/Wudu/Salah | 🟢/🟡 | viel Content vorhanden; Quellen-/Fiqh-Review erforderlich |
| Moschee-Finder | 🟡 | OSM/Overpass live; Attribution, SLA, Datenschutz, Ausfallfälle offen |
| Auth/Accounts | 🔴 | nicht produktiv vorhanden |
| Cloud Sync | 🔴 | nicht produktiv vorhanden |
| Premium/Payments | 🔴 | kein produktives Entitlement-/Payment-System |
| KI-Assistent | 🔴 produktiv | UI-Demo; kein produktiver Quellen-/RAG-/Safety-Backendweg |
| Security Zielprodukt | 🟡/🔴 | heutige PWA hat begrenzte Angriffsfläche; Backend-/Account-Security fehlt |
| Datenschutz/Recht/Stores | 🟡/🔴 | konzeptionell zu bearbeiten; finales Paket fehlt |
| CI-Nachweis | 🔴 | Workflow vorhanden, erfolgreicher Runner-Lauf nicht belegt |
| reale Geräte/E2E | 🔴 | als Abschlussnachweis offen |
| Monitoring/Betrieb | 🔴/🟡 | produktive Observability/Runbooks noch aufzubauen |

## P0 – vor allem anderen

1. echten Build/Preview beweisen;
2. v1-Scope einfrieren;
3. bekannte P0/P1-Codefehler verifizieren und beheben;
4. religiöses Quellenregister aufbauen und Kerncontent freigeben;
5. Prayer/Qibla/Quran auf echten Geräten und API-Fehlerfällen testen;
6. entscheiden, ob Accounts/Cloud/Premium bereits in v1 gehören;
7. Datenschutz-/Anbieter-/Lizenzregister abschließen;
8. Testautomation um Unit/Integration/E2E erweitern;
9. CI-Runnerproblem lösen;
10. geschlossene Beta vor öffentlichem Release.

## Bewusste Nicht-Behauptungen

Der aktuelle Stand beweist **nicht**:

- dass alle religiösen Inhalte fachlich endgültig korrekt/freigegeben sind;
- dass der komplette Build heute erfolgreich läuft;
- dass alle Screens auf echten Geräten visuell fehlerfrei sind;
- dass die App bereits DSGVO-/Store-/zahlungstechnisch releasefertig ist;
- dass der KI-Assistent produktiv sicher ist;
- dass Markt-/Zahlungsbereitschaft bereits abschließend validiert ist.

## Nächster Meilenstein der App

**Milestone M1 – „Release Candidate technisch und inhaltlich beweisbar“**

Erreicht, wenn:

- `npm run check` real grün;
- Hauptscreen-Screenshotmatrix abgeschlossen;
- P0-Kerncontent freigegeben;
- Prayer/Qibla/Quran reale Tests bestanden;
- v1-Scope fest;
- Account/Premium/KI-Entscheidung für v1 getroffen;
- keine offenen P0-Blocker.
