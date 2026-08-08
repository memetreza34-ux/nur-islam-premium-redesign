# 12 – Native iOS-/Android- und Store-Strategie

**Stand:** 8. August 2026  
**Ziel:** aus der bestehenden React-/Vite-/PWA-App kontrolliert eine Store-fähige Mobile-Strategie ableiten, ohne unnötig alles neu zu bauen.

## 1. Ausgangspunkt

Nur Islam Premium ist heute web-first:

- React;
- TypeScript;
- Vite;
- PWA;
- Browser-Geolocation;
- DeviceOrientation für Qibla;
- Service Worker;
- lokale Persistenz.

Das ist eine gute Basis, aber noch kein vollständiger nativer iOS-/Android-Releasepfad.

## 2. Vier mögliche Wege

| Weg | Vorteil | Nachteil | Nur-Islam-Eignung |
|---|---|---|---|
| PWA only | wenig Zusatzaufwand | Store-/Background-/Native-Grenzen | gut als Webkanal, nicht alleinige Langfriststrategie |
| Capacitor | bestehende Web-App weiterverwenden + native APIs | Bridge-/Pluginpflege | **bevorzugter Prüfpfad** |
| React Native/Expo | stärker native UI/Ökosystem | großer Rewrite | nur wenn Web-Architektur langfristig nicht reicht |
| Swift/Kotlin nativ | maximale Plattformkontrolle | höchste Kosten/Doppelpflege | nur bei klaren Anforderungen |

Capacitor ist ausdrücklich dafür ausgelegt, in bestehende moderne JavaScript-Projekte integriert zu werden und native iOS-/Android-Funktionen über Plugins/SDKs bereitzustellen. Quelle: https://capacitorjs.com/docs – geprüft am 8. August 2026.

## 3. Empfehlung für Nur Islam

**Zielarchitektur prüfen:**

```text
React/Vite Core
├─ Web/PWA
├─ Capacitor iOS
└─ Capacitor Android
```

Gemeinsam bleiben soweit sinnvoll:

- Screenlogik;
- Quran Reader;
- Dhikr/Duas;
- Lernen;
- Designsystem;
- Datenmodelle;
- API-/Backendclients;
- Quellen-/Contentlogik.

Plattformspezifisch kapseln:

- Push Notifications;
- Background Tasks;
- lokale Notifications;
- Kompass/Sensor;
- Geolocation;
- sichere Secrets/Keychain/Keystore;
- In-App-Purchases;
- Deep Links;
- App Lifecycle;
- Share Sheet;
- Haptics;
- Dateispeicher/Downloads.

## 4. Entscheidungs-Gate vor Capacitor

Vor Implementierung einen Spike auf echter Hardware bauen und prüfen:

1. Home rendert korrekt.
2. Quran-Reader scrollt flüssig.
3. arabische Fonts/Diakritika korrekt.
4. Qibla-Sensor funktioniert.
5. Standort funktioniert.
6. Deep Link zu Prayer funktioniert.
7. Offline-Cache funktioniert oder wird sinnvoll ersetzt.
8. Push/Local Notification Konzept ist realisierbar.
9. Safe Areas stimmen.
10. App Store/Play Build lässt sich signieren.

Wenn zwei oder mehr Kernanforderungen nur mit fragilen Workarounds funktionieren, React-Native-/Native-Alternative erneut bewerten.

## 5. Repository-Struktur für Multi-Platform

Zielbeispiel:

```text
src/
  features/
  services/
  platform/
    web/
    ios/
    android/
  design-system/
  content/
ios/
android/
capacitor.config.ts
```

Keine Plattformabfrage quer durch 50 Komponenten. Stattdessen Adapter:

```text
NotificationService
LocationService
CompassService
PurchaseService
SecureStorageService
ShareService
```

## 6. App-Identität

Vor erstem Store-Build verbindlich festlegen:

- App-Name;
- Bundle Identifier iOS;
- Application ID Android;
- URL Scheme;
- Universal Links/App Links;
- Team/Organisation;
- Versionsschema;
- Buildnummernschema;
- Releasekanäle;
- Signierungsverantwortung.

Beispiel nur als Platzhalter, nicht ungeprüft übernehmen:

```text
de.<organisation>.nurislam
```

## 7. Apple-Pipeline

### Konten/Setup

- Apple Developer Program;
- App Store Connect;
- App Record;
- Bundle ID;
- Certificates/Signing;
- Provisioning automatisch oder kontrolliert;
- TestFlight;
- Store-Metadaten.

### Releasepfad

```text
main/release tag
→ reproduzierbarer Build
→ Xcode Archive
→ signierter Upload
→ TestFlight intern
→ TestFlight extern
→ Release Candidate
→ App Review
→ gestaffelter Release
```

### Review-Voraussetzungen

Apple verlangt für Einreichungen vollständige, funktionsfähige Versionen; Login-Apps brauchen geeignete Review-Zugänge/Erklärungen. Digitale Funktionen/Premiuminhalte müssen die jeweils aktuellen In-App-Purchase-Regeln beachten. Quelle: https://developer.apple.com/app-store/review/guidelines/ – geprüft am 8. August 2026.

Bei Accounts zusätzlich aktuellen Account-Deletion-Pfad prüfen.

## 8. Google-Play-Pipeline

### Konten/Setup

- Google Play Console;
- App Record;
- Application ID;
- Play App Signing;
- Internal testing;
- Closed testing;
- Production;
- Data Safety;
- Store Listing;
- Billing-Produkte, falls Premium.

### Releasepfad

```text
release build
→ AAB
→ Internal testing
→ Closed testing
→ Production candidate
→ staged rollout
→ monitoring
```

Google Play Billing behandelt Abos als zeitbasierte Entitlements und besitzt Lifecycle-Ereignisse wie Verlängerung und Ablauf. Diese Zustände müssen im Nur-Islam-Entitlement-System verarbeitet werden. Quelle: https://developer.android.com/google/play/billing/subscriptions – geprüft am 8. August 2026.

## 9. Premium/IAP auf Mobile

### Grundregel

Premiumstatus darf nicht aus einem manipulierbaren Clientflag kommen.

```text
Apple/Google Purchase
→ Store Receipt / Purchase Token
→ Server/Entitlement Layer
→ vertrauenswürdiger Status
→ App
```

Optional kann RevenueCat die plattformübergreifende Subscription-/Entitlement-Schicht vereinfachen. Entscheidung erst nach Prüfung von:

- Kosten;
- Datenschutz;
- Webhooks;
- Export;
- Store-Abdeckung;
- Vendor Lock-in;
- benötigten Features.

Apple verlangt bei digitalen Freischaltungen grundsätzlich die jeweils geltenden In-App-Purchase-Regeln; konkrete regionale Ausnahmen/Entitlements müssen vor Release aktuell geprüft werden. Quelle: https://developer.apple.com/app-store/review/guidelines/.

## 10. Push und Prayer Reminder

Web/PWA-Erinnerungen sind nicht mit garantiertem nativen Background-Push gleichzusetzen.

Zieloptionen:

### A – lokale native Notifications

Prayer-Zeiten lokal berechnen/laden und Notifications für den Tag planen.

Vorteile:

- weniger Serverabhängigkeit;
- privacy-freundlich;
- Prayer Reminder kann offline funktionieren.

Prüfen:

- Zeitzonenwechsel;
- Sommerzeit;
- Standortwechsel;
- Methode ändert sich;
- Gerät rebootet;
- iOS Pending-Notification-Limits;
- Android Battery Optimization.

### B – serverbasierter Push

Nützlich für:

- Contentupdates;
- Account-/Security-Meldungen;
- Marketing nur mit korrekter Einwilligung;
- besondere Events.

Prayer selbst möglichst nicht unnötig serverzentrieren, wenn lokale Planung robust funktioniert.

## 11. Qibla nativ

Testmatrix:

- iPhone mehrere Generationen;
- iOS Permissionflow;
- Android Pixel/Samsung;
- magnetischer Sensor vorhanden/nicht vorhanden;
- Orientation;
- Kalibrierung;
- Metallhülle/Magnet;
- Standort denied;
- Sensordrift.

Fallback:

- berechneter Qibla-Winkel sichtbar;
- keine falsche Genauigkeitsbehauptung;
- Hinweis auf Kalibrierung und Störquellen.

## 12. Offline Quran/Audio auf Native

### Text

Optionen:

- vollständiger Quran im App-Bundle;
- Downloadpaket nach Installation;
- Mischmodell.

Kriterien:

- Dateigröße;
- Rechte;
- Updatebarkeit;
- Prüfsummen;
- Offline-Sicherheit;
- Content-Rollback.

### Audio

Nicht einfach remote URLs hardcoden.

Benötigt:

- Rezitator-/Aufnahmerechte;
- CDN/Storage;
- Downloadmanager;
- Speicherlimits;
- Resume/Retry;
- Offline-Löschung;
- Ayah-Mapping;
- Hintergrund-Audio;
- Lock-Screen Controls, falls gewünscht.

## 13. Permissions

Nur bei echtem Nutzen anfragen.

| Permission | Grund |
|---|---|
| Standort | Prayer/Qibla/Moschee |
| Notifications | Prayer-/App-Erinnerungen |
| Motion/Sensor | Qibla |
| Mikrofon | nur falls Spracheingabe wirklich produktiv |
| Fotos/Dateien | nur bei realer Export-/Uploadfunktion |

Vor Permissiondialog immer In-App-Erklärung: warum, was passiert bei Ablehnung, wohin Daten gehen.

## 14. Deep Links

Pflichtfälle:

- Prayer Reminder → Prayer Screen;
- Quran Share → Surah/Ayah;
- Supportlink;
- Account Verification/Recovery;
- Payment-/Subscription-Return;
- Marketingkampagne nur ohne sensible religiöse Profilierung.

Jeder Deep Link braucht:

- Auth-Zustand;
- Onboarding-Zustand;
- nicht gefundene Ressource;
- alte App-Version;
- Webfallback.

## 15. Store-Metadaten

Pro Store pflegen:

- Name;
- Subtitle/Short Description;
- Long Description;
- Screenshots je Deviceklasse;
- Previewvideo optional;
- Icon;
- Support URL;
- Privacy URL;
- Account Deletion URL falls nötig;
- Alters-/Contentangaben;
- Permission-/Data-Safety-Angaben;
- Premium-/Subscription-Texte;
- Review Notes;
- Quellen-/Transparenzseite.

Keine Funktion in Screenshot/Copy bewerben, die im eingereichten Build nicht funktioniert.

## 16. Versions- und Releasekonzept

```text
SemVer intern: 1.2.3
Store Version: 1.2.3
Build iOS: monoton steigend
VersionCode Android: monoton steigend
Git Tag: nur-islam-v1.2.3
```

Hotfix:

```text
Fehler erkannt
→ Severity
→ Fix Branch
→ Tests
→ Content/Security Review falls betroffen
→ Build
→ Store/Web rollout
→ Monitoring
```

## 17. Plattform-Testmatrix

Mindestens:

### iOS

- unterstützte älteste iOS-Version;
- aktuelle iOS-Version;
- kleines Display;
- aktuelles Standard-iPhone;
- großes Display;
- Safari/PWA;
- native Container-App.

### Android

- unterstützte älteste Android-Version;
- aktuelle Android-Version;
- Pixel;
- Samsung;
- kleine/mittlere/große Displays;
- Chrome/PWA;
- native Container-App.

Testen:

- Install/Update;
- Login;
- Prayer;
- Qibla;
- Quran;
- Downloads;
- Notifications;
- Purchase/Restore;
- Offline;
- Background/Resume;
- Rotation;
- Font Scaling;
- Screenreader.

## 18. Gate

Native Store-Strategie gilt als freigegeben, wenn:

- PWA/Capacitor/Rewrite-Entscheidung dokumentiert ist;
- echter Hardware-Spike erfolgreich war;
- Bundle IDs/Signing/Owner feststehen;
- Push-/Prayer-Reminder-Strategie belegt ist;
- IAP-/Entitlement-Architektur feststeht;
- Permissions minimiert sind;
- Store-Testkanäle funktionieren;
- Accountlöschung/Privacy/Data-Safety vorbereitet sind;
- reale iOS-/Android-Geräte die P0-Flows bestehen;
- Rollback/Hotfixweg dokumentiert ist.
