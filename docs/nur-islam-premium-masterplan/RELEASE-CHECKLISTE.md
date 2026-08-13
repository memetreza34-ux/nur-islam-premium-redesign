# Nur Islam Premium – Finale Release-Checkliste

Ein Haken zählt nur mit **echtem Nachweis**. Dokumentation allein ersetzt keinen Build, keine Fachfreigabe, keinen Gerätetest, keine Store-Prüfung und keine wirtschaftliche Validierung.

## A. Repository und Build

- [ ] Release-Commit festgelegt
- [ ] `npm install` reproduzierbar
- [ ] `npm run check` grün
- [ ] TypeScript grün
- [ ] Produktionsbuild grün
- [ ] CI-Run tatsächlich ausgeführt und grün
- [ ] keine kritischen Browserkonsolenfehler
- [ ] Changelog vorhanden
- [ ] Rollbackweg dokumentiert

## B. Produkt und Navigation

- [ ] alle sichtbaren Hauptaktionen funktionieren
- [ ] keine Demo-/Toast-only-Funktion wird als produktiv verkauft
- [ ] v1-Scope eingefroren
- [ ] Home stabil
- [ ] Gebete stabil
- [ ] Kalender stabil
- [ ] Lernen stabil
- [ ] Mehr/Profil stabil
- [ ] Sekundärscreens erreichbar
- [ ] Back-/Deep-Link-Verhalten korrekt

## C. Religiöse Inhalte

- [ ] Quranquelle/-edition dokumentiert
- [ ] deutsche Übersetzung/Bedeutung dokumentiert
- [ ] Lizenz-/Nutzungsstatus geklärt
- [ ] Hadith-Kernbestand geprüft
- [ ] Duas geprüft
- [ ] Dhikr geprüft
- [ ] 99 Namen geprüft
- [ ] Wudu/Salah geprüft
- [ ] Lernkurse geprüft
- [ ] Fiqh-/Madhhab-Hinweise konsistent
- [ ] „Original“, „Übersetzung“, „sinngemäß“, „Zusammenfassung“ sauber getrennt
- [ ] keine erfundenen religiösen Quellen
- [ ] kritische Contentblocker = 0
- [ ] produktiver Kerncontent auf R4/releasefreigegeben

## D. Gebetszeiten und Qibla

- [ ] Standort granted getestet
- [ ] Standort denied getestet
- [ ] Standortwechsel getestet
- [ ] Berlin Winter/Sommer getestet
- [ ] Zeitzone/DST getestet
- [ ] Berechnungsmethoden geprüft
- [ ] Standard-/Hanafi-Asr geprüft
- [ ] Cache/Fallback sichtbar korrekt
- [ ] lokale Abweichungshinweise vorhanden
- [ ] Qibla auf echten Geräten getestet
- [ ] Sensor-Fallback vorhanden
- [ ] Tageswechsel/Tracker getestet
- [ ] Reminderverhalten ehrlich dokumentiert

## E. Quran

- [ ] 114-Suren-Katalog vollständig
- [ ] gewählte v1-Datenstrategie für alle 114 Suren funktioniert
- [ ] Offline-Suren geprüft
- [ ] Online-/Cache-Suren geprüft
- [ ] API-Ausfall geprüft
- [ ] lange Sure Performance geprüft
- [ ] Arabisch nicht abgeschnitten
- [ ] Reader-Settings gespeichert
- [ ] Lesezeichen stabil
- [ ] Copy/Share korrekt
- [ ] Audio nur sichtbar, wenn echt verfügbar

## F. Moschee-Finder

- [ ] Standortpermission getestet
- [ ] Overpass live getestet
- [ ] Cache getestet
- [ ] stale cache gekennzeichnet
- [ ] leere Ergebnisse verständlich
- [ ] OSM-Attribution korrekt
- [ ] Daten als nicht offiziell bestätigt gekennzeichnet, soweit nötig
- [ ] Rate-Limit-/Ausfallweg vorhanden

## G. Auth/Cloud – falls v1

- [ ] Auth produktiv
- [ ] Verifikation/Recovery
- [ ] Logout
- [ ] Sessionablauf
- [ ] RLS/Autorisierung
- [ ] Nutzer A/B Negativtest
- [ ] Multi-Device-Sync
- [ ] Offline-Konflikte
- [ ] Datenexport
- [ ] Kontolöschung
- [ ] Backup
- [ ] Restore-Test

## H. Premium/Payments – falls v1

- [ ] Free/Premium-Leistung klar
- [ ] Preise/Laufzeit klar
- [ ] Store-/Web-Produkte korrekt
- [ ] Entitlements serverseitig/vertraut
- [ ] Webhooks signiert/idempotent
- [ ] Kauf getestet
- [ ] Abbruch getestet
- [ ] Verlängerung getestet
- [ ] Kündigung getestet
- [ ] Restore getestet
- [ ] Refund getestet
- [ ] Grace Period getestet
- [ ] Geräte-/Accountwechsel getestet
- [ ] Kontolöschung bei aktivem Abo geklärt
- [ ] Paywall ohne religiösen Druck

## I. KI-Assistent – falls produktiv

- [ ] kein API-Key im Client
- [ ] Server-Gateway
- [ ] nur freigegebene RAG-Quellen
- [ ] Quellenvalidierung
- [ ] Goldenset
- [ ] Halluzinationstest
- [ ] Prompt-Injection-Test
- [ ] persönliche Fatwa eskaliert
- [ ] strittige Fragen nicht falsch eindeutig
- [ ] Datenschutz/Retention klar
- [ ] Rate-/Kostenlimits
- [ ] Kill Switch
- [ ] Fallback

Wenn nicht erfüllt: KI bleibt klarer Prototyp/Preview oder wird für Release ausgeblendet.

## J. Security

- [ ] keine Secrets im Client/Repo/Logs
- [ ] Dependency Scan
- [ ] Secret Scan
- [ ] Input Validation
- [ ] Rate Limits bei Backend
- [ ] Admin-MFA
- [ ] sichere externe Links
- [ ] Service Worker Update getestet
- [ ] Logs enthalten keine unnötigen sensiblen Inhalte
- [ ] Incidentkontakte
- [ ] Security-Runbooks

## K. Datenschutz/Recht

- [ ] Dateninventar
- [ ] Anbieterregister
- [ ] Standortdatenfluss
- [ ] KI-Datenfluss
- [ ] Analyticsentscheidung
- [ ] Datenschutzerklärung
- [ ] Impressum/Betreiberangaben
- [ ] Consent nur wo nötig und technisch korrekt
- [ ] Accountlöschseite falls nötig
- [ ] Apple Privacy Angaben
- [ ] Google Data Safety Angaben
- [ ] Content-/Asset-/Font-/Icon-/Audio-Lizenzen
- [ ] OSM-Attribution
- [ ] aktuelle Store-Regeln geprüft

## L. UX/Accessibility

- [ ] 320×568
- [ ] 360×800
- [ ] 390×844
- [ ] 430×932
- [ ] iOS Safari/PWA
- [ ] Android Chrome/PWA
- [ ] Textskalierung
- [ ] Screenreader
- [ ] Tastatur/Fokus bei Web
- [ ] Reduced Motion
- [ ] Kontrast
- [ ] Touch Targets
- [ ] Modals vollständig erreichbar
- [ ] Bottom Nav überdeckt nichts
- [ ] arabische Diakritika sauber

## M. PWA/Mobile

- [ ] Manifest
- [ ] Icons
- [ ] Install
- [ ] Service Worker
- [ ] Offline-Start
- [ ] Cache Update
- [ ] alter Cache Migration
- [ ] Hard Reload/Recovery
- [ ] Permissionflows
- [ ] reale Geräte

## N. Monitoring/Betrieb

- [ ] Error Monitoring
- [ ] Uptime
- [ ] API Monitoring
- [ ] Backend/DB Monitoring falls vorhanden
- [ ] Payment Monitoring falls vorhanden
- [ ] KI-Kosten/Fehler falls vorhanden
- [ ] Kostenalarme
- [ ] Supportkontakt
- [ ] Contentfehler-Eskalation
- [ ] Runbooks
- [ ] Rollback

## O. Launch

- [ ] Landingpage
- [ ] Supportseite
- [ ] Datenschutzerklärung
- [ ] Transparenz-/Quellenseite
- [ ] Screenshots
- [ ] Storebeschreibung
- [ ] Altersfreigabe
- [ ] Reviewkonto falls nötig
- [ ] Beta abgeschlossen
- [ ] kritische Bugs = 0
- [ ] gestaffelter Rollout
- [ ] Beobachtungsplan erste 72 Stunden

## P. Markt, Wettbewerb und Produktvalidierung

- [ ] Wettbewerbs-Matrix aktuell
- [ ] direkte und indirekte Alternativen geprüft
- [ ] relevante Store-/Nutzerreviews ausgewertet
- [ ] Zielgruppeninterviews durchgeführt
- [ ] Kernproblem mit Belegen bestätigt
- [ ] mindestens drei belastbare Differenzierungsargumente
- [ ] Positionierung getestet
- [ ] Zahlungsbereitschaft/Pricing getestet
- [ ] Go/Pivot/Stop-Kriterien dokumentiert
- [ ] keine Markt-/Preisbehauptung ohne Quelle/Prüfdatum

## Q. Native iOS/Android und Stores – falls native Veröffentlichung

- [ ] PWA vs. Capacitor vs. Rewrite entschieden
- [ ] kritischer Native-PoC bestanden
- [ ] Apple Developer/Bundle ID eingerichtet
- [ ] Google Play/Package Name eingerichtet
- [ ] Signing/App Signing geklärt
- [ ] TestFlight bzw. interner Play Track getestet
- [ ] native Push auf beendeter App getestet
- [ ] Qibla-Sensor auf iPhone und mehreren Android-Geräten getestet
- [ ] Deep Links / Universal Links / App Links getestet
- [ ] Secure Storage für sensible Tokens
- [ ] Store Account-Deletion-Anforderungen erfüllt
- [ ] Store Subscription-/IAP-Regeln aktuell geprüft
- [ ] Review Notes/Testkonto vorhanden
- [ ] Version/Buildnummern konsistent

## R. Marketing, ASO und Growth

- [ ] Kernbotschaft final
- [ ] Landingpage-Funnel messbar
- [ ] ASO-Keywordbasis je Store/Land
- [ ] echte Store-Creatives
- [ ] Pre-Launch-/Launchkalender
- [ ] organischer Contentplan
- [ ] Creator-/Partnerregeln
- [ ] Lifecycle-Kommunikation getrennt von Prayer Notifications
- [ ] minimale Analytics-Taxonomie
- [ ] D1/D7/D30 Retention messbar
- [ ] Premium Funnel messbar
- [ ] Review-Prompt ohne Dark Pattern
- [ ] Paid Marketing nur mit CAC-/LTV-Stopregel

## S. Kosten, Profitabilität und Anbieterbudget

- [ ] 100/1k/10k/100k MAU Szenarien
- [ ] Fixkosten erfasst
- [ ] variable Kosten erfasst
- [ ] Infra-Kosten pro MAU modelliert
- [ ] AI-Kosten pro AI-Nutzer modelliert
- [ ] Audio/CDN-Kosten modelliert
- [ ] Payment-/Storegebühren berücksichtigt
- [ ] Support-/Fachreviewkosten berücksichtigt
- [ ] Premium Unit Economics
- [ ] Sensitivitätsanalyse
- [ ] Budgetalarme
- [ ] Cash-/Runway-Regel falls relevant
- [ ] Tax-/Rechnungspfad fachlich geklärt

## T. Accounts, Tools und Zugriffsgovernance

- [ ] jeder aktive Anbieter im Register
- [ ] Owner je Anbieter
- [ ] Dev/Staging/Prod sauber getrennt
- [ ] Least-Privilege-Rollen
- [ ] Secret-Register ohne Secretwerte
- [ ] Rotations-/Recoveryweg
- [ ] E-Mail SPF/DKIM/DMARC falls eigener Versand
- [ ] Provider-Export/Exit dokumentiert
- [ ] keine unnötige SaaS-Abhängigkeit

## U. Content-Betrieb nach Launch

- [ ] stabile Content-IDs
- [ ] R0–R4/RX real angewendet
- [ ] Vier-Augen-Prinzip für kritische Inhalte
- [ ] Reviewer-/Fachbeirat-Verantwortung dokumentiert
- [ ] Nutzerweg „Inhalt melden“
- [ ] Content-Severity C0–C3
- [ ] C0 Kill Switch/Rollback getestet
- [ ] Contentversionierung
- [ ] AI-Retrieval nur aus freigegebenem Bestand
- [ ] Content-Backup/Restore
- [ ] Korrektur-/Incidentprozess

## V. Internationalisierung – je veröffentlichter Sprache

- [ ] UI vollständig lokalisiert
- [ ] religiöser Content separat freigegeben
- [ ] Glossar/Terminologie gepflegt
- [ ] RTL vollständig getestet falls nötig
- [ ] Arabisch/Diakritika auf Zielgeräten
- [ ] Datum/Zahlen/Zeitzone korrekt
- [ ] Prayer-/Hijri-Regionhinweise geprüft
- [ ] Store Listing lokalisiert
- [ ] Supportweg in Sprache vorhanden
- [ ] keine stille unklare Übersetzungs-Fallbacklogik

## W. Quran-Audio – falls aktiv

- [ ] Rezitator/Quelle eindeutig
- [ ] Lizenz/Permission schriftlich geklärt
- [ ] Attribution korrekt
- [ ] Surah-/Ayah-Mapping validiert
- [ ] Audio-Manifest versioniert
- [ ] Streamingfehler behandelt
- [ ] Offline-Downloadintegrität getestet
- [ ] Speicherbedarf sichtbar
- [ ] Background/Lock-Screen Controls native getestet
- [ ] Audio/CDN-Kostenbudget
- [ ] falsche Datei gezielt deaktivierbar/rollbackbar

# Endgültiges GO

Öffentlicher Release nur, wenn **kein kritischer Blocker** offen ist und für Build, Kernflows, Content, Marktvalidierung, Security, Datenschutz, Geräte, Storekanal, wirtschaftliche Tragfähigkeit und Rollback echte Nachweise existieren.

Nicht anwendbare Bereiche werden ausdrücklich mit Begründung als `N/A` dokumentiert; sie werden nicht still ignoriert.
