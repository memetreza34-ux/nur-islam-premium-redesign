# Nur Islam – Release-, Beta- und Rollback-Runbook

**Ziel:** Öffentliche Releases kontrolliert durchführen, ohne für Fehler hektisch neue Features oder ungetestete Hotfixes einzubauen.

## 1. Grundregeln

- `premium-design-finish` ist der Release-Candidate-Branch.
- `main` ist der kontrollierte Veröffentlichungszweig.
- Kein öffentlicher Release mit rotem `npm run check`.
- Kein P0 wird durch Dokumentation „geschlossen“, wenn die reale Prüfung fehlt.
- Keine großen Dependency-Upgrades im unmittelbaren Releasefenster.
- Keine Analytics oder Verhaltensmessung nur für den Release einbauen.
- Bei einem Produktionsfehler zuerst Stabilität wiederherstellen, danach Ursache analysieren.

## 2. Release-Evidenz

Vor einer Freigabe muss der konkrete RC-Commit feststehen. Für genau diesen Commit dokumentieren:

- Commit-SHA
- `npm run check`: PASS
- Playwright-E2E: PASS
- Reference-Render/Visual-QA: PASS
- reale iPhone-Abnahme: PASS
- reale Android-Abnahme: PASS
- religiöser P0-Fachreview: freigegeben
- Betreiber/Legal: freigegeben
- Audio: freigegeben oder deaktiviert
- falls Payment aktiv: Kauf-/Restore-/Entitlement-Test PASS

Die GitHub-Actions-Läufe sind die technische Primärquelle; keine alte Run-ID darf als Nachweis für einen neueren Commit verwendet werden.

## 3. Staged Rollout

### Phase 0 – interner RC

- nur `premium-design-finish`
- keine Behauptung „Produktion fertig“
- technische Gates und menschliche P0-Prüfungen schließen

### Phase 1 – geschlossene Beta

- kleiner, bewusst ausgewählter Testerkreis
- Fokus: Installation, Offline, Gebetszeiten, Qibla, Benachrichtigungen, Persistenz, Konto/Cloud
- Fehlermeldungen manuell sammeln; keine neue invasive Telemetrie
- keine großen Features während der Beta

### Phase 2 – begrenzter öffentlicher Start

- erst nach P0-Freigabe
- `main` als eindeutige Produktionsquelle
- direkt nach Deployment Smoke-Test auf mindestens einem realen Gerät
- Support-/Korrekturweg sichtbar machen, sobald die echte Betreiberkontaktadresse vorliegt

### Phase 3 – breiter Rollout

- nur wenn Phase 2 keine releasekritischen Fehler zeigt
- Dependency-/Architekturarbeiten erst nach stabiler Beobachtungsphase wieder aufnehmen

## 4. Smoke-Test nach Deployment

Nach jedem Produktionsdeployment mindestens:

1. Home lädt.
2. Quran öffnet und zeigt arabischen Text.
3. eine deutsche Übersetzung lässt sich online laden.
4. Gebetszeiten laden oder zeigen verständlichen Fallback.
5. Qibla-Screen öffnet ohne Crash.
6. Dhikr/Duas öffnen.
7. Premium-Oberfläche öffnet; bei aktivem Payment muss die Zugangsprüfung korrekt greifen.
8. Impressum/Datenschutz/Lizenzen sind erreichbar.
9. Offline-Start nach vorherigem Online-Laden funktioniert.
10. keine offensichtliche Console-/Netzwerk-Fehlerschleife.

## 5. Rollback

Vor dem Produktionsmerge die **letzte bekannte grüne Produktions-SHA** notieren.

### Rollback auslösen bei

- Start-/Blank-Screen-Fehler;
- Datenverlust oder fehlerhaftem Restore;
- falscher Premium-Freischaltung/Zahlungszugang;
- massiv falschen Gebetszeiten durch Release-Regressionsfehler;
- Qibla-/Sensor-Crash;
- sicherheits- oder datenschutzrelevantem Fehler;
- gebrochenem Login/Cloud-Pfad;
- nicht behebbarer Service-Worker-/Cache-Schleife.

### Vorgehen

1. weitere Feature-Arbeit stoppen;
2. betroffenen Release-Commit identifizieren;
3. auf die letzte bekannte grüne Produktionsversion zurückgehen bzw. den problematischen Merge sauber revertieren;
4. Deployment der wiederhergestellten Version beobachten;
5. Smoke-Test wiederholen;
6. Fehler danach auf separatem Branch reproduzieren und beheben;
7. vollständige Gates erneut ausführen, bevor erneut veröffentlicht wird.

Ein Rollback ist kein Scheitern, sondern der vorgesehene Sicherheitsmechanismus.

## 6. Service-/Provider-Ausfall

### AlAdhan / Gebetszeiten

- vorhandenen Cache/Fallback nutzen;
- Ausfall nicht mit erfundenen Live-Daten kaschieren;
- bei längerem Ausfall Providerstatus/Integration getrennt prüfen.

### Al Quran Cloud / Übersetzung

- arabischer Offline-Quran bleibt verfügbar;
- gecachte Übersetzungen bleiben nutzbar;
- nicht gecachte Übersetzungen dürfen verständlich als online nicht verfügbar erscheinen.

### Supabase

- App muss lokal weiter nutzbar bleiben;
- kein automatisches Überschreiben lokaler Daten bei unsicherem Restore;
- Cloud-Funktionen dürfen verständlich fehlschlagen, ohne Kernfunktionen zu blockieren.

### Audio

- Audioausfall darf Gebets-/Quran-Inhalte nicht blockieren;
- bei Rechteproblem Audio deaktivieren statt gesamten Kerninhalt zu entfernen.

## 7. Payment später

Wenn das 0,99-€-Abo aktiviert wird, erweitert sich dieses Runbook um:

- Testkauf;
- fehlgeschlagene Zahlung;
- Wiederherstellung eines bestehenden Kaufs;
- Kündigung/Ablauf;
- serverseitige Entitlement-Aktualisierung;
- Gerätewechsel;
- Offline-Zustand mit zuletzt bestätigtem Entitlement nach klar definierter Grace-Period;
- keine Freischaltung ausschließlich aufgrund manipulierbarer lokaler Daten.

Der konkrete Zahlungsanbieter und dessen aktuelle Plattformregeln werden erst bei der tatsächlichen Integration festgelegt und geprüft.

## 8. Release-Protokoll-Vorlage

```text
Release:
Datum:
RC-SHA:
Vorherige Produktions-SHA:

npm run check: PASS/FAIL
E2E: PASS/FAIL
Visual QA: PASS/FAIL
iPhone real: PASS/FAIL
Android real: PASS/FAIL
Religiöser Review: PASS/OPEN
Legal/Betreiber: PASS/OPEN
Audio: PASS/DISABLED/OPEN
Payment (falls aktiv): PASS/N/A

Deployment:
Smoke-Test: PASS/FAIL
Rollback nötig: JA/NEIN
Notizen:
```
