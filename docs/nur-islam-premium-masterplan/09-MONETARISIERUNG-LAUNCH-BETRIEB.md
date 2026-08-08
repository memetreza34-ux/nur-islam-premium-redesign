# 09 – Monetarisierung, Launch und Betrieb

## 1. Premium-Grundsatz

Nur Islam Premium soll über **echten zusätzlichen Produktwert** monetarisiert werden, nicht über religiösen Druck oder absichtliche Verschlechterung elementarer Glaubensfunktionen.

## 2. Mögliches Modell

### Free

Geeignet als vertrauensbildender Kern:

- grundlegende Gebetszeiten;
- Qibla;
- Quran-Grundreader;
- grundlegende Dhikr/Duas;
- Kalender;
- ausgewählte Lerninhalte.

### Premium

Mögliche Mehrwerte:

- Cloud-Sync und Mehrgerätebetrieb;
- erweiterte Offline-Pakete;
- Audio/Rezitationen mit sauberer Lizenz;
- vertiefte Lernpfade;
- zusätzliche Themes/Widgets;
- personalisierte Lern-/Quran-Pläne;
- fortgeschrittene Statistiken;
- Premium-Sammlungen;
- quellenbasierter KI-Assistent, wenn sicher;
- Familien-/Haushaltsfunktionen später.

Keine endgültige Paywall-Verteilung ohne Nutzer- und Zahlungsbereitschaftstest.

## 3. Zahlungsarchitektur

### Web

Geeigneter PSP, z. B. Stripe, wenn Web-Abos angeboten werden.

### iOS/Android

Store-konforme In-App-Purchases. RevenueCat kann als Entitlement-/Abostruktur helfen, muss aber vor Einsatz aktuell geprüft werden.

### Zentrale Entitlements

Nie nur:

```text
localStorage.isPremium = true
```

Sondern:

```text
Store/PSP
→ serverseitige Verifikation/Webhook
→ zentrale Entitlement-Tabelle
→ App lädt vertrauenswürdigen Status
```

## 4. Zahlungszustände testen

- erster Kauf;
- Kaufabbruch;
- fehlgeschlagene Zahlung;
- Pending;
- Verlängerung;
- Kündigung;
- Ablauf;
- Grace Period;
- Upgrade/Downgrade;
- Restore;
- Gerätewechsel;
- Accountwechsel;
- Refund;
- Chargeback;
- doppelte Webhooks;
- verspätete Webhooks;
- Kontolöschung bei aktivem Abo.

## 5. Preisstrategie

Vor Preisfestlegung:

- vergleichbare islamische Apps prüfen;
- Zielgruppe befragen;
- Free/Premium-Nutzen testen;
- laufende Kosten modellieren;
- Storegebühren/Steuern/Support berücksichtigen;
- KI-/Audio-/Storage-Kosten berücksichtigen.

Szenarien:

```text
100 aktive Nutzer
1.000 aktive Nutzer
10.000 aktive Nutzer
100.000 aktive Nutzer
```

## 6. Pre-Launch

Vor öffentlichem Launch:

- Landingpage;
- klare Screenshots;
- Datenschutz;
- Support;
- Kontolöschseite bei Accounts;
- Quellen-/Transparenzseite;
- Beta-Gruppe;
- Store-Assets;
- Demo-Video;
- FAQ;
- Incident-/Supportweg.

## 7. Beta

### Interne Alpha

- Kernteam;
- keine echten sensiblen Nutzerdaten;
- Funktions-/Content-/Buildfehler.

### Geschlossene Beta

Zielgruppenmix:

- Anfänger;
- regelmäßige Quran-/Prayer-App-Nutzer;
- verschiedene Smartphones;
- verschiedene Berechnungsmethoden/Rechtsschulpräferenzen;
- deutschsprachige Nutzer mit unterschiedlicher Arabischkenntnis.

Feedback getrennt erfassen:

- religiöser Inhalt;
- technische Fehler;
- UX;
- Design;
- Zahlungsbereitschaft;
- Vertrauen.

## 8. Store-/Web-Launch

### Web/PWA

- Domain/TLS;
- Hosting;
- PWA-Install;
- Datenschutz/Impressum;
- Support;
- Monitoring;
- Rollback.

### Apple/Google

Vor Einreichung aktuelle offizielle Regeln prüfen:

- Accounts;
- Kontolöschung;
- Privacy/Data Safety;
- Standort;
- Notifications;
- In-App-Purchases;
- Subscription-Metadaten;
- Reviewkonto;
- Screenshots;
- Altersfreigabe;
- KI-/Contentdarstellung.

## 9. Analytics

Funnel:

```text
Install/Open
→ Onboarding
→ Kernfunktion
→ Wiederkehr
→ Premium-Ansicht
→ Trial/Kauf
→ Retention
```

Kernmetriken:

- DAU/WAU/MAU, falls sinnvoll;
- 1-/7-/30-Tage-Retention;
- Prayer/Quran/Learning Activation;
- Premium-Conversion;
- Churn;
- Crashfreiheit;
- API-Ausfälle;
- Supportquote;
- Content-Fehlermeldungen.

Religiöse Detailnutzung nicht unnötig profilieren.

## 10. Support

Kategorien:

- Account/Login;
- Premium/Kauf;
- Gebetszeiten;
- Quran/Übersetzung;
- religiöser Inhaltsfehler;
- Qibla;
- Moschee-Daten;
- App-/PWA-Technik;
- Datenschutz/Löschung;
- Feedback.

Religiöse Inhaltsmeldungen erhalten einen eigenen Eskalationsweg.

## 11. Monitoring

Überwachen:

- Frontendfehler;
- API-Erfolgsraten;
- AlAdhan;
- Quran-API;
- Mosque/Overpass;
- Backend/Auth;
- Payment-Webhooks;
- KI-Fehler/Kosten;
- Push-/E-Mail-Jobs;
- Datenbank;
- Kostenlimits.

## 12. Betriebsrhythmus

### Täglich/automatisch

- kritische Fehler;
- Uptime;
- Payment-/Auth-Alarm;
- kritische Contentmeldungen.

### Wöchentlich

- Topfehler;
- Support;
- Contentfehler;
- Conversion/Retention;
- Kosten.

### Monatlich

- Dependencies;
- Anbieterlimits;
- Security;
- Backupstatus;
- Contentreview-Backlog.

### Quartalsweise

- Preise;
- Store-Regeln;
- Datenschutz-/Anbieterregister;
- Restore-Übung;
- Roadmap.

### Jährlich

- vollständige Account-/Rechteprüfung;
- Rechts-/Store-/Quellenreview;
- Anbieterexit;
- unterstützte Geräte/OS-Versionen;
- Produkt-End-of-Life-Kriterien.

## 13. Kostenkontrolle

Budgets und Warnungen für:

- Hosting;
- DB/Storage;
- KI;
- E-Mail/Push;
- Monitoring;
- Maps/API;
- Storekonten;
- Support;
- rechtliche/fachliche Reviews.

Kill Switch für kostenintensive KI-/Mediafunktionen.

## 14. Rollback/Incident

Bei defektem Release:

- Feature Flag/Kill Switch;
- vorherige Webversion;
- kompatible DB-Migration;
- Store-Hotfix;
- Nutzerkommunikation;
- Content-Rollback getrennt vom Code-Rollback.

## 15. Produktende

Auch früh definieren:

- Export;
- Premium-Abos stoppen;
- Nutzer informieren;
- Daten löschen;
- Inhalte/Lizenzen beenden;
- Domains/Stores schließen;
- notwendige Archivierung;
- Anbieter kündigen.
