# 10 – Roadmap vom heutigen Stand bis fertig

Diese Roadmap startet **nicht bei null**, sondern beim realen Branch `premium-home-redesign`.

## Phase 0 – Stand einfrieren und beweisen

**Ziel:** wissen, was wirklich läuft.

- [ ] aktuellen Branch-HEAD dokumentieren
- [ ] `npm install`
- [ ] `npm run check` lokal/echte Buildumgebung ausführen
- [ ] alle TypeScript-/Buildfehler beheben
- [ ] Dev-Preview starten
- [ ] Screenshotmatrix der Hauptscreens erzeugen
- [ ] Browserkonsole auf Fehler prüfen
- [ ] PWA Cache/Update testen
- [ ] bekannte Bugs aus Handoff verifizieren statt blind übernehmen

**Gate:** reproduzierbarer Build + reale Vorschau vorhanden.

## Phase 1 – Markt validieren und v1-Scope einfrieren

- [ ] Wettbewerbs-Matrix aus `11-MARKT-WETTBEWERB-VALIDIERUNG.md` erstellen
- [ ] Nutzerinterviews und Review Mining durchführen
- [ ] Positionierung testen
- [ ] Zahlungsbereitschaft grob validieren
- [ ] Kernmodule P0 festlegen
- [ ] P1/P2-Features hinter Flags oder aus Hauptflow nehmen
- [ ] keine neuen großen Featurebereiche beginnen
- [ ] Produktziele/Nicht-Ziele bestätigen
- [ ] Screen-Inventar finalisieren
- [ ] Demo-/Toast-only-Aktionen erfassen
- [ ] Go/Iterate/Stop-Entscheidung dokumentieren

**Gate:** jeder sichtbare v1-Screen hat Owner/Status/Priorität und das Produkt besitzt eine belegte Zielgruppe/Differenzierung.

## Phase 2 – aktuelle Codefehler und Datenmigrationen

- [ ] bekannte Bugs erneut am aktuellen Code prüfen
- [ ] stabile IDs für persistierte Inhalte sicherstellen
- [ ] Dua-/Collection-Migration robust machen
- [ ] localStorage-Parser gegen beschädigte Werte härten
- [ ] doppelte/alte Assetpfade bereinigen
- [ ] unnötige CSS-Überschreibungen dokumentieren/gezielt reduzieren
- [ ] alle sichtbaren Buttons auf echte Funktion prüfen

**Gate:** keine bekannten P0/P1-Codefehler.

## Phase 3 – religiöse Content-Freigabe und Content-Betrieb

- [ ] Quellenregister erstellen
- [ ] Quran-Editionen und Rechte dokumentieren
- [ ] Quran-Bestand auf vollständige v1-Strategie bringen
- [ ] Hadith-Datenbestand prüfen
- [ ] Dua-Datensatz einzeln reviewen
- [ ] Dhikr-Routinen reviewen
- [ ] 99 Namen reviewen
- [ ] Wudu/Salah reviewen
- [ ] sechs Lernkurse reviewen
- [ ] Fiqh-/Madhhab-Hinweise konsistent machen
- [ ] „sinngemäß“/Original/Übersetzung UI-weit vereinheitlichen
- [ ] stabile Content-IDs und R0–R4-Status anwenden
- [ ] C0-Content-Rollback/Kill-Switch aus `16-CONTENT-BETRIEBSHANDBUCH.md` vorbereiten

**Gate:** Kerncontent R4/releasefreigegeben und Content-Betriebsprozess vorhanden.

## Phase 4 – Gebete/Qibla/Kalender produktionsfest

- [ ] AlAdhan-Nutzungs-/Datenschutzweg prüfen
- [ ] Berechnungsmethoden fachlich dokumentieren
- [ ] Zeitzonen/DST testen
- [ ] Tageswechsel testen
- [ ] Standort denied/changed testen
- [ ] Qibla mit echten Geräten testen
- [ ] Sensor-Fallback/Kalibrierung verbessern
- [ ] Hijri-Abweichungshinweise/regionale Strategie
- [ ] Reminderstrategie für Web/PWA vs. native festlegen

**Gate:** Prayer/Qibla/Kalender auf echten Geräten freigegeben.

## Phase 5 – Quran, Audio und Moscheen produktionsfest

### Quran

- [ ] alle 114 Suren lesbar nach gewählter Strategie
- [ ] Offline-/Online-/Cache-Zustände testen
- [ ] lange Suren Performance testen
- [ ] Editions-/Quellenanzeige final

### Quran-Audio – nur falls v1

Nach `19-QURAN-AUDIO-REZITATION.md`:

- [ ] Rezitator/Quelle/Rechte dokumentieren
- [ ] Surah-/Ayah-Mapping validieren
- [ ] Streaming-/Offline-Strategie festlegen
- [ ] Player auf Zielgeräten testen
- [ ] CDN-/Storage-Kostenmodell
- [ ] Audio-Rollbackweg

Wenn nicht erfüllt: Audio aus v1 entfernen statt halbfertig veröffentlichen.

### Moscheen

- [ ] OSM-Attribution final
- [ ] Overpass Rate Limits/Ausfall testen
- [ ] Standortdatenschutz final
- [ ] stale cache klar kennzeichnen
- [ ] keine leeren/erfundenen Daten
- [ ] Karten-/Routingstrategie prüfen

**Gate:** Datenanbieterpfade releasefähig; Audio nur bei vollständigem Audio-Gate.

## Phase 6 – Backend/Auth/Cloud-Sync

Nur wenn Premium/Accounts in v1 vorgesehen.

- [ ] Account-/Tool-Register nach `15-ACCOUNT-UND-TOOLS-SETUP.md`
- [ ] Backendprojekt Development
- [ ] Staging
- [ ] Production
- [ ] Migrationen
- [ ] Auth
- [ ] Profile/Settings
- [ ] Bookmarks/Progress/Calendar Sync
- [ ] RLS/Autorisierung
- [ ] Nutzer-A/B-Negativtests
- [ ] Accountlöschung
- [ ] Datenexport
- [ ] Backup/Restore
- [ ] Multi-Device-Sync
- [ ] Offline-Konfliktstrategie
- [ ] Transactional E-Mail/Domainauthentifizierung

**Gate:** Account-/Sync-Daten sicher und recoverbar.

## Phase 7 – Premium/Payments und Finanz-Gate

- [ ] Free/Premium-Paket definieren
- [ ] Preis testen
- [ ] Web-/Storekanäle festlegen
- [ ] Produkte in Store/PSP anlegen
- [ ] zentrale Entitlements
- [ ] serverseitige Verifikation
- [ ] Webhooks
- [ ] Kauf/Restore/Kündigung/Refund testen
- [ ] Paywall UX prüfen
- [ ] keine religiös manipulative Verkaufslogik
- [ ] 100/1k/10k/100k-Nutzer-Kostenmodell aus `14-KOSTEN-PROFITABILITAET.md`
- [ ] KI-/Audio-/Infra-Kostenlimits
- [ ] Break-even/Unit Economics/Sensitivität
- [ ] Budgetalarme

**Gate:** kein Premiumstatus allein clientseitig manipulierbar und Monetarisierung ist wirtschaftlich plausibel.

## Phase 8 – KI-Assistent oder bewusst verschieben

Entscheidung A: KI nicht v1 → UI klar deaktivieren/Preview.  
Entscheidung B: KI v1 → vollständigen Safety-Plan umsetzen.

Bei B:

- [ ] freigegebener Retrievalbestand
- [ ] KI-Gateway
- [ ] strukturierte Quellenantwort
- [ ] Goldenset
- [ ] Halluzinationstest
- [ ] Fiqh-/Fatwa-Eskalation
- [ ] Prompt-Injection
- [ ] Datenschutz
- [ ] Kostenlimits
- [ ] Kill Switch
- [ ] Content-Rollback synchronisiert KI-Korpus/Index

**Gate:** Safety- und Quellen-Evaluation bestanden.

## Phase 9 – Security/Privacy/Legal

- [ ] Dateninventar
- [ ] Anbieterregister
- [ ] Privacy Policy
- [ ] Impressum/Betreiberangaben
- [ ] Consent/Trackingentscheidung
- [ ] Store Privacy/Data Safety
- [ ] Standortflüsse
- [ ] AI-Datenfluss
- [ ] Paymentdatenfluss
- [ ] Open-Source-/Content-/Asset-/Audio-Lizenzen
- [ ] Security Review
- [ ] Secret Scan
- [ ] Dependency Scan
- [ ] Rollen/Least Privilege
- [ ] Provider Exit/Offboarding

**Gate:** keine falschen oder fehlenden Pflichtangaben.

## Phase 10 – Testautomation ausbauen

- [ ] Unit-Testframework
- [ ] Komponenten-/Integrationstests
- [ ] E2E
- [ ] Accessibility Automation
- [ ] API Failure Matrix
- [ ] PWA Update Tests
- [ ] echte Geräte
- [ ] Performancebudgets
- [ ] visuelle Regression/Screenshotnachweise
- [ ] Locale-/RTL-Testpfad vorbereiten

**Gate:** Kernflows automatisiert + manuell belegt.

## Phase 11 – CI/CD, Native-Strategie und Observability

- [ ] GitHub-Runnerblocker lösen
- [ ] CI auf PR/push
- [ ] Buildartefakt
- [ ] Stagingdeploy
- [ ] Productiongate
- [ ] Sentry/Fehlertracking
- [ ] Uptime
- [ ] Backend-/DB-Monitoring
- [ ] API-Alarme
- [ ] Kostenalarme
- [ ] Runbooks
- [ ] PWA vs. Capacitor vs. Rewrite nach `12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md` final entscheiden
- [ ] kritischer Native-PoC für Qibla, Push, Deep Links, IAP, Offline
- [ ] Apple-/Google-Konten und IDs vorbereiten, falls native v1

**Gate:** grüner reproduzierbarer Releasepfad und belastbarer Plattformweg.

## Phase 12 – Beta

- [ ] interne Alpha
- [ ] geschlossene Beta
- [ ] verschiedene Geräte
- [ ] verschiedene Prayer-Methoden
- [ ] Contentfeedback
- [ ] religiöse Fehlermeldungen getrennt triagieren
- [ ] kritische Bugs schließen
- [ ] Retention/Activation beobachten
- [ ] Positionierung/Pricing erneut mit echten Nutzern prüfen
- [ ] Content-Incidentweg testen
- [ ] TestFlight/Play Test Track falls relevant

**Gate:** keine P0-Blocker; P1-Risiken akzeptiert/dokumentiert.

## Phase 13 – Marketing-/ASO- und Store/Web-Release

- [ ] Release Candidate einfrieren
- [ ] Version/Buildnummer
- [ ] Landingpage
- [ ] ASO Keywords nach `13-MARKETING-ASO-GROWTH.md`
- [ ] echte Screenshots/Creatives
- [ ] Beschreibung
- [ ] Supportseite
- [ ] Datenschutz
- [ ] Löschseite
- [ ] Quellen-/Transparenzseite
- [ ] Reviewkonto falls nötig
- [ ] Creator-/Partnerbriefing
- [ ] Launchkalender
- [ ] Analytics-Funnel
- [ ] Beta → gestaffelter Rollout
- [ ] Monitoring aktiv
- [ ] Rollback bereit

**Gate:** signierte Go-/No-Go-Entscheidung einschließlich Markt-, Store-, Growth- und Finanz-Gate.

## Phase 14 – erste 30 Tage

- [ ] Fehler täglich triagieren
- [ ] Contentmeldungen priorisieren
- [ ] API-Stabilität prüfen
- [ ] Kosten prüfen
- [ ] Bewertungen/Support auswerten
- [ ] Conversion/Retention messen
- [ ] CAC nur bei Paid Traffic
- [ ] Hotfixprozess verwenden
- [ ] keine Featureexplosion vor Stabilität

## Phase 15 – langfristig

- [ ] monatliche Dependency-/Securitypflege
- [ ] quartalsweise Anbieter-/Store-/Rechtsprüfung
- [ ] regelmäßige Contentreviews
- [ ] Restoreübungen
- [ ] Markt-/Wettbewerbsreview regelmäßig aktualisieren
- [ ] Kosten-/Profitabilitätsmodell aktualisieren
- [ ] neue Sprachen nur nach `17-INTERNATIONALISIERUNG-LOKALISIERUNG.md`
- [ ] Audioquellen/Rechte/Versionen regelmäßig prüfen, falls aktiv
- [ ] Spezialfunktionen datenbasiert priorisieren
- [ ] Provider Exit/Lock-in prüfen
- [ ] Produkt-End-of-Life-Pfad aktuell halten

# Verbindliche Querschnitts-Gates

Diese Bereiche dürfen nicht erst kurz vor Release ergänzt werden:

- **Markt-Gate:** `11-MARKT-WETTBEWERB-VALIDIERUNG.md`
- **Native-/Store-Gate:** `12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md`
- **Growth-Gate:** `13-MARKETING-ASO-GROWTH.md`
- **Finanz-Gate:** `14-KOSTEN-PROFITABILITAET.md`
- **Tool-/Account-Gate:** `15-ACCOUNT-UND-TOOLS-SETUP.md`
- **Content-Ops-Gate:** `16-CONTENT-BETRIEBSHANDBUCH.md`
- **Locale-Gate:** `17-INTERNATIONALISIERUNG-LOKALISIERUNG.md`
- **Audio-Gate:** `19-QURAN-AUDIO-REZITATION.md`

Nicht anwendbare Gates werden mit Begründung als `N/A` dokumentiert, nicht still übersprungen.
