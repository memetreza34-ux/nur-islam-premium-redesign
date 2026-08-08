# 08 – Testing, QA und Release

## 1. Ziel

Die vorhandenen statischen Prüfskripte sind eine gute Basis. Für einen echten Release braucht Nur Islam Premium zusätzlich eine vollständige Teststrategie mit **Logiktests, Integration, E2E, echten Geräten, Accessibility, API-Ausfällen und visueller Abnahme**.

## 2. Bestehender Check-Pfad

Der aktuelle `npm run check` umfasst bereits viele projektspezifische Prüfungen:

- Assets/Deploymentpfade;
- visuelle Konsistenz;
- Onboarding;
- Overlays;
- Micro-UI;
- Filter/Touch Targets/Layout;
- Quran/Dua/Namen/Dhikr;
- Navigation/Qibla;
- Prayer Learning/Prayer Times/Home Sync;
- Lernkurse/Prayer Reminders/Moscheen;
- TypeScript;
- Vite Build.

Diese Checks bleiben bestehen und werden **nicht abgeschwächt, nur um grün zu werden**.

## 3. Fehlende Testebenen

### Unit

Priorität:

- Gebetszeitnormalisierung;
- Tageswechsel/Tracker;
- Qibla-Winkel;
- Entfernungsberechnung Moschee;
- Hijri-/Kalenderlogik;
- localStorage Parser/Migrationen;
- Favoriten-IDs;
- Quiz-Scoring;
- Sync-Konfliktlogik später;
- Entitlement-Status später.

### Component/Integration

- Quran Reader mit Offline/Online/Cache/Error;
- Prayer Screen mit Standort denied/live/cache/fallback;
- Mosque Screen mit live/cache/error;
- Onboarding Permissionflows;
- Sammlungen/Migrationen;
- Profileinstellungen;
- Lernfortschritt.

### E2E

Mindestens:

1. Erststart → Onboarding → Home.
2. Standort erlauben → Gebetszeiten laden.
3. Standort verweigern → App bleibt nutzbar.
4. Quran → Sure → Reader → Lesezeichen → Neustart.
5. Dhikr → Fortschritt → Neustart/Tageswechsel.
6. Qibla → Permission → Sensor/Fallback.
7. Dua/Namen favorisieren → Sammlung.
8. Lernen → Lektion → Fortschritt.
9. Offline starten → gecachte Kernbereiche.
10. PWA-Update → neue Version ohne kaputten Cache.
11. später: Login → Sync → zweites Gerät.
12. später: Premium-Kauf → Entitlement → Restore/Kündigung.

## 4. API-Testmatrix

Für AlAdhan, Quran API und Overpass:

- 200 gültig;
- leere/inkonsistente Antwort;
- 400/404;
- 429 Rate Limit;
- 500;
- Timeout;
- Offline;
- langsames Netz;
- Cache vorhanden;
- Cache veraltet;
- falsche Zeitzone/Datum;
- Standortwechsel.

## 5. Gebetszeiten-Testmatrix

Mindestens:

- Berlin Winter/Sommer;
- Zeitzonenwechsel;
- Sommerzeitumstellung;
- verschiedene Berechnungsmethoden;
- Standard/Hanafi Asr;
- vor/nach Mitternacht;
- nächstes Gebet über Tagesgrenze;
- Standortwechsel;
- Uhrzeit des Geräts fehlerhaft – Verhalten dokumentieren;
- lokale Abweichungshinweise sichtbar.

## 6. Qibla-Testmatrix

- Permission granted/denied;
- Gerät ohne Orientation API;
- iOS Permission-Sonderweg;
- Portrait/Landscape;
- Kalibrierungshinweis;
- bekannte Testkoordinaten mit erwarteter Richtung;
- Sensor springt/rauscht;
- Fallback ohne Sensor.

## 7. Quran-Testmatrix

- alle 114 Metadaten;
- 4 Offline-Suren;
- Online-Sure;
- gecachte Online-Sure;
- API-Ausfall;
- falsche Ayah-Anzahl abweisen;
- Arabisch rendern;
- Bedeutung toggeln;
- Schriftgröße;
- Lesezeichen;
- Teilen/Kopieren;
- lange Sure/Performance;
- Offline-Update von Contentdaten.

## 8. Accessibility

Automatisiert plus manuell:

- axe oder gleichwertig;
- Tastatur;
- Fokus;
- Screenreader auf iOS/Android/Web;
- Textskalierung;
- Kontrast;
- Reduced Motion;
- arabischer Text;
- Modals;
- Bottom Navigation;
- Permissiondialoge;
- Fehlermeldungen.

## 9. Visuelle QA

Kein „sieht im Code richtig aus“.

Pro Release Screenshotmatrix:

```text
Screen × Viewport × Theme × Datenzustand
```

Mindestens Hauptscreens bei:

- 360×800
- 390×844
- 430×932

Zustände:

- normal;
- loading;
- error;
- offline;
- lange Texte;
- Permission denied.

## 10. Performance

Budgets definieren:

- initiales JS/CSS;
- Time-to-Interactive;
- Screenwechsel;
- Quran-Reader;
- Bildgrößen;
- Cachegröße;
- Speicher;
- API p95;
- KI-Latenz später.

Viele CSS-/Asset-Layer nicht unkontrolliert weiter wachsen lassen.

## 11. PWA

Testen:

- Installierbarkeit;
- Manifest;
- Icons;
- Service Worker;
- Erstinstallation;
- Update;
- Cache-Migration;
- Offline-Start;
- alter Cache;
- beschädigter Cache;
- Deinstallation/Neuinstallation;
- iOS „Zum Home-Bildschirm“;
- Android Installprompt.

## 12. CI-Gates

Zielworkflow:

```text
install
→ typecheck
→ unit
→ integration
→ project checks
→ build
→ E2E smoke
→ artifact
```

Separat/zeitgesteuert:

- externe Live-API-Smokes;
- Dependency-/Security-Scans;
- Link-/Quellen-Freshness.

Der aktuelle GitHub-Runnerblocker muss behoben sein, bevor CI als Nachweis zählt.

## 13. Release Candidate

RC wird aus festem Commit erzeugt.

Dokumentieren:

- SHA;
- Version;
- Build;
- bekannte Restrisiken;
- Content-Revision;
- Quellenrevision;
- Datenmigrationen;
- Store-/Web-Metadaten;
- Rollback;
- Supportkontakt.

## 14. Go-/No-Go

No-Go bei:

- kritischem religiösem Inhaltsfehler;
- kaputtem Quran-/Gebets-/Qibla-Kernflow;
- fremdem Datenzugriff;
- Datenverlust ohne Recovery;
- nicht reproduzierbarem Build;
- falschen Store-/Privacy-Angaben;
- manipuliertem Premiumstatus;
- kritischem Crash;
- nicht getesteter Migration;
- KI-Assistent ohne Safety-Gate.
