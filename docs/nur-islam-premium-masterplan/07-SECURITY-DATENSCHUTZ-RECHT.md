# 07 – Security, Datenschutz und Recht

## 1. Warum dieses Projekt besonders sorgfältig prüfen muss

Nur Islam Premium verarbeitet bzw. kann künftig verarbeiten:

- Standortdaten;
- religiöse Nutzungs-/Fortschrittsdaten;
- Accountdaten;
- Kalender-/Favoritendaten;
- Chat-/KI-Fragen;
- Zahlungs-/Premiumstatus;
- Supportdaten.

Religiöse Überzeugungen können datenschutzrechtlich besonders sensibel sein. Deshalb gilt: **so wenig personenbezogene Daten wie möglich, so lokal wie sinnvoll, so transparent wie nötig.**

## 2. Dateninventar

Für jeden Datenpunkt dokumentieren:

| Datenart | Zweck | Lokal/Cloud | Anbieter | Aufbewahrung | Export | Löschung | Risiko |
|---|---|---|---|---|---|---|---|
| Standort | Gebetszeiten/Qibla/Moscheen | primär lokal + API-Request | AlAdhan/Overpass | minimal | n/a/ggf. Profileinstellung | ja | erhöht |
| Favoriten | Nutzerkomfort | lokal, später optional Cloud | eigener Backendanbieter | bis Löschung | ja | ja | normal |
| Gebetstracker | persönlicher Fortschritt | lokal, Cloud nur optional | eigener Backendanbieter | definieren | ja | ja | sensibel im Kontext |
| KI-Fragen | Antwortgenerierung | server/provider | KI-Anbieter | minimal/definieren | abhängig | ja | potenziell sensibel |
| Paymentstatus | Premiumzugang | server | Store/PSP | nach Rechts-/Supportbedarf | eingeschränkt | nach Regeln | finanziell |

## 3. Standort

Heute werden Koordinaten für Gebetszeiten und Moscheesuche an externe Dienste übertragen.

Pflicht vor Release:

- Standort erst nach erklärtem Nutzerwunsch;
- keine dauerhafte exakte Standort-Historie ohne echten Zweck;
- Datenfluss in Datenschutzerklärung;
- Anbieter/Region/Transfer prüfen;
- Denied-State ohne kaputte App;
- grobe Standortalternative ermöglichen, wo sinnvoll;
- Qibla-Berechnung möglichst lokal durchführen.

## 4. Externe Anbieterregister

Mindestens dokumentieren:

- AlAdhan;
- Al Quran Cloud;
- OpenStreetMap/Overpass;
- Hosting/CDN;
- spätere Auth/DB/Storage-Anbieter;
- Monitoring;
- Analytics;
- KI-Modellanbieter;
- E-Mail/Push;
- Payments/Stores.

Je Anbieter:

```text
Zweck
Daten
Region/Transfer
Vertrag/DPA falls relevant
Retention
Subprozessoren
Security
Kosten
Ausfallplan
Exit
Prüfdatum
```

## 5. Auth und Autorisierung

Sobald Accounts eingeführt werden:

- serverseitige Sessionprüfung;
- RLS oder gleichwertige Autorisierung;
- Nutzer-A/B-Negativtests;
- Admin-MFA;
- minimale Rechte;
- sichere Recovery;
- Session-Widerruf;
- Accountlöschung Ende-zu-Ende.

## 6. Secrets

Nie im Client:

- Service Role;
- KI-API-Key;
- Payment Secret;
- Admin Token;
- private Webhook Secrets.

Nur öffentliche Client-Konfiguration darf im Frontend liegen.

## 7. API- und Abuse-Schutz

Mit eigenem Backend:

- Input Validation;
- Rate Limits;
- Idempotenz;
- Bot-/Abuse-Schutz;
- sichere Fehlerantworten;
- Timeout/Retry;
- Requestgrößenlimits;
- sichere Uploads, falls später vorhanden;
- Logging ohne sensible Inhalte.

## 8. Service Worker/PWA

Prüfen:

- Cache-Versionierung;
- keine veralteten kritischen religiösen Inhalte dauerhaft ohne Updatepfad;
- keine Secrets cachen;
- Navigation-Fallback nur für Navigation;
- Update-Hinweis bei kritischen Daten-/Content-Releases;
- Offline-Kennzeichnung, wenn Daten veraltet sein können;
- Cache-Löschung/Migration getestet.

## 9. Datenschutzrechte

Wenn Cloud-Accounts existieren:

- Datenexport;
- Berichtigung;
- Accountlöschung;
- Löschung aus DB/Storage/Search/Analytics/Support soweit anwendbar;
- dokumentierte Backup-Löschregel;
- aktive Abos getrennt behandeln;
- Identitätsprüfung angemessen.

## 10. Analytics

Keine Vollprotokollierung religiöser Detailnutzung nur „weil man es kann“.

Gute Events:

- `onboarding_completed`
- `quran_reader_opened`
- `prayer_times_loaded`
- `course_started`
- `premium_checkout_started`

Vorsicht bei:

- konkrete Dua-/Fiqh-Themen;
- Chattexte;
- genaue Standortdaten;
- detaillierte Gebetstrackerhistorie.

## 11. Rechtliche/Store-Prüfbereiche

Vor Veröffentlichung aktuell anhand offizieller Quellen prüfen:

- Betreiber-/Impressumsanforderungen;
- Datenschutzerklärung;
- Verbraucherinformationen;
- Abo-/Kündigungs-/Widerrufsregeln je Kanal;
- Apple App Review Guidelines;
- Google Play Policies/Data Safety;
- Cookie-/Tracking-/Consent bei Web;
- Lizenzrechte an Quranübersetzung, Hadith-/Dua-Texten, Fonts, Icons, Bildern und Audios;
- Open-Source-Lizenzen;
- OSM-Attribution;
- KI-Transparenz und anwendbare KI-Regeln;
- Alters-/Minderjährigenfragen, wenn die App gezielt Kinder anspricht.

Dieses Handbuch behauptet keine individuelle Rechtsfreigabe.

## 12. Security-Tests

Mindestens:

- Dependency Scan;
- Secret Scan;
- XSS/URL-Injection bei externen Inhalten;
- API-Inputtests;
- Auth-Negativtests;
- RLS-Negativtests;
- Rate-Limit-Test;
- Payment-Webhook-Signatur;
- KI-Prompt-Injection;
- Accountlöschung;
- Export;
- Backup/Restore;
- Service-Worker-Update.

## 13. Incident-Plan

Runbooks für:

- falsche religiöse Inhalte;
- kompromittierten API-Key;
- Datenleck;
- Login-Ausfall;
- Paymentfehler;
- Gebetszeitenanbieter-Ausfall;
- Quran-Datenfehler;
- Moschee-Datenquelle-Ausfall;
- KI-Halluzinations-/Safety-Vorfall;
- defekten Release.

## 14. Go-/No-Go Security Gate

Kein Release bei:

- fremdem Datenzugriff;
- Secrets im Client/Repo;
- fehlender Accountlöschung bei Cloud-Account;
- unklarem Standortdatenfluss;
- manipulierbaren Premium-Entitlements;
- ungeprüfter kritischer KI-Ausgabe;
- fehlendem Restore bei persistenten Cloud-Daten;
- falschen Datenschutz-/Store-Angaben.
