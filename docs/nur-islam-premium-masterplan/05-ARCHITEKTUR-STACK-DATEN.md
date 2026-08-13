# 05 – Architektur, Stack und Daten

## 1. Zielarchitektur

Die aktuelle PWA kann als starke UI-/Offline-Basis bleiben. Für eine echte Premium-App braucht sie jedoch eine serverseitige Vertrauensschicht für Accounts, Sync, Premium-Entitlements, sichere KI und zentrale Inhaltsverwaltung.

Empfohlenes Zielbild:

```text
React/Vite PWA oder später Mobile Shell
        │
        ├── lokale Offline-Daten
        ├── UI/Reader/Tracker
        │
        ▼
Server/API-Vertrauensschicht
        │
        ├── Auth/Session
        ├── Cloud Sync
        ├── Premium Entitlements
        ├── Content API
        ├── KI Gateway
        ├── Rate Limits
        └── Audit/Monitoring
        │
        ▼
PostgreSQL / Storage / Jobs
        │
        ├── User Data
        ├── Content Metadata
        ├── Reviews/Sources
        └── Operations
```

## 2. Stack-Vorschlag

Das ist eine **Arbeitsentscheidung**, keine bereits implementierte Tatsache.

### Repository/CI

- GitHub
- GitHub Actions, sobald Runnerproblem gelöst
- Dependabot

### Frontend

Kurzfristig behalten:

- React 19
- TypeScript
- Vite
- bestehende PWA

Kein Framework-Wechsel nur aus Modegründen.

### Backend

Für Solo-/kleines Team naheliegend:

- Supabase/PostgreSQL;
- Auth;
- RLS;
- Storage;
- Edge Functions/Serverlogik;
- Migrations.

Alternative: eigenes Backend, wenn spezifische Anforderungen es rechtfertigen.

### Hosting

- statischer/Web-App-Host für PWA;
- Domain/DNS/CDN über etablierten Anbieter;
- getrennte Preview/Staging/Production-Deployments.

### Monitoring

- Sentry oder gleichwertig für Fehler;
- Uptime-/API-Monitoring;
- Kosten-/Quota-Alarme;
- Backend-/DB-Monitoring.

### Analytics

- privacy-bewusstes Product Analytics nur für echte Produktfragen;
- kein unnötiges Tracking religiöser Detailinhalte.

## 3. Umgebungen

Zwingend trennen:

```text
local
→ development
→ staging
→ production
```

Je Umgebung getrennt:

- Datenbank;
- Auth-Nutzer;
- API-Keys;
- KI-Anbieterkeys;
- Webhooks;
- Payments;
- Analytics-Projekt;
- Monitoring;
- Storage;
- Redirect-URLs.

## 4. Datenklassen

### Öffentliche religiöse Inhalte

- Quran-Metadaten;
- freigegebene Texteditionen;
- Hadith/Dua/Dhikr;
- Lerninhalte;
- Quellenmetadaten.

### Persönliche Nutzerdaten

- Account;
- Einstellungen;
- Sprache;
- Favoriten;
- Lesezeichen;
- Lernfortschritt;
- Gebetstracker, falls synchronisiert;
- Kalendertermine;
- Premiumstatus.

### Sensiblere Kontextdaten

- genauer Standort;
- KI-Fragen;
- Supportanfragen;
- ggf. religiöse Gewohnheits-/Fortschrittsdaten.

Datenminimierung ist besonders wichtig: Nicht alles, was lokal bequem gespeichert werden kann, muss in die Cloud.

## 5. Empfohlenes Cloud-Datenmodell

### `profiles`

```text
id
language
theme
timezone
created_at
updated_at
```

### `user_settings`

```text
user_id
prayer_method
asr_school
notification_preferences
content_preferences
```

### `bookmarks`

```text
id
user_id
type
content_id
created_at
```

### `learning_progress`

```text
user_id
course_id
lesson_id
status
score
updated_at
```

### `calendar_entries`

```text
id
user_id
date
kind
title
notes
```

### `entitlements`

```text
user_id
product
status
source
period_start
period_end
original_transaction_reference
updated_at
```

### `content_sources`

```text
source_id
type
title
edition
license_status
review_status
last_reviewed
```

### `content_items`

```text
content_id
type
source_id
version
review_status
published_at
```

## 6. Was lokal bleiben kann

- UI-Präferenzen;
- kurzfristiger Readerzustand;
- Caches;
- Offline-Pakete;
- unkritische temporäre Zustände.

Cloud-Sync nur für echten Mehrwert.

## 7. Sync-Modell

Nicht einfach „localStorage zusätzlich in DB schreiben“.

Benötigt:

- stabile IDs;
- Versions-/Timestampstrategie;
- Konfliktregeln;
- offline queue;
- idempotente Upserts;
- Löschtombstones oder klare Löschregeln;
- Multi-Device-Test.

Einfacher v1-Ansatz:

- server wins für zentrale Contentdaten;
- last-write-wins nur für unkritische Nutzereinstellungen;
- append/merge für Favoriten;
- explizite Konfliktstrategie für Kalender/Tracker.

## 8. Auth

Vor Premium-Sync:

- E-Mail oder passwortloser Login;
- E-Mail-Verifikation;
- Recovery;
- Sessionablauf;
- Logout;
- Konto löschen;
- Datenexport;
- optional Apple/Google Sign-in entsprechend Plattformstrategie;
- Admin-MFA.

## 9. RLS/Autorisierung

Jeder Nutzerdatensatz muss serverseitig Eigentum/Organisation prüfen.

Negativtest:

```text
Nutzer A erstellt Daten
→ Nutzer B kennt ID
→ B darf weder lesen noch ändern noch löschen
```

Service-Role-Schlüssel niemals im Client.

## 10. Content-Backend

Langfristig sollte religiöser Content nicht nur in TS-Dateien gepflegt werden.

Empfohlen:

- versionierte Contentdaten;
- Source-ID;
- Reviewstatus;
- Veröffentlichungsstatus;
- Änderungsverlauf;
- Import-/Export;
- automatisierte Validierung;
- Rollback bei Inhaltsfehler.

Für v1 kann statischer, versionierter Content weiter funktionieren, wenn der Reviewprozess sauber ist.

## 11. Externe Anbieter heute

### AlAdhan

Daten: Standortkoordinaten + Datum/Methodenparameter.  
Risiko: Drittanbieterabhängigkeit, Berechnungsabweichungen, Standortdatenschutz.

### Al Quran Cloud

Daten: Surennummer/Edition; keine persönliche Identität nötig.  
Risiko: Verfügbarkeit, Edition/Lizenz, Datenkonsistenz.

### OpenStreetMap/Overpass

Daten: Koordinaten für Radiusabfrage.  
Risiko: öffentliche Endpoint-Stabilität, Attribution, Datenqualität.

Alle Anbieter gehören ins konkrete Anbieterregister mit Prüfdatum.

## 12. Background Jobs

Später nötig für:

- Push/Prayer Notifications;
- Content-Updates;
- KI-Aufgaben;
- Export/Löschung;
- E-Mails;
- Payment-Webhooks;
- Monitoring/Health Checks.

Jobs brauchen:

- Idempotenz;
- Retry;
- Dead-Letter/Fehlerstatus;
- Logs;
- Alarm;
- Reprocessing.

## 13. Mobile-Strategie

Die PWA ist für Entwicklung und Webstart sinnvoll. Für vollwertige Hintergrund-Erinnerungen, tiefere Sensorintegration und Stores kann später eine native/cross-platform Shell sinnvoll werden.

Entscheidung erst nach Anforderungen:

- Hintergrundnotifications;
- Widgets;
- Kompass/Sensor;
- Offline-Audio;
- Store-IAP;
- Deep Links.

Keine komplette Rewrite-Entscheidung, solange die bestehende PWA die Kernflows beweisen kann.
