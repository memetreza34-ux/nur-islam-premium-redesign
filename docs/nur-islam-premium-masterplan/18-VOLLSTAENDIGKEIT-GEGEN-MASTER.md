# 18 – Vollständigkeitsabgleich gegen die App-Master-Anleitung

**Stand:** 8. August 2026  
**Referenz:** ursprünglicher App-Master-Vollständigkeitsstandard aus `memetreza34-ux/von-idee-bis-fertig`

## 1. Zweck

Diese Datei beantwortet eine einzige Frage:

> Deckt die projektspezifische Anleitung für Nur Islam Premium dieselben Pflichtbereiche ab wie die allgemeine App-Master-Anleitung?

Wichtig: **Vollständige Anleitung ≠ fertige App.**

Ein Bereich ist hier „abgedeckt“, wenn die Anleitung:

- konkrete Nur-Islam-Entscheidungen/Fragen enthält;
- notwendige Artefakte definiert;
- Risiken/Grenzen dokumentiert;
- einen Prüf-/Freigabepunkt besitzt;
- auf die reale App und ihre Datenflüsse angewendet ist.

## 2. Abgleich

| Master-Pflichtbereich | Nur-Islam-Dokumente | Abdeckung |
|---|---|---|
| 1. Orientierung/Voraussetzungen | README, 00, 12, 15, STACK-PROFIL | vollständig |
| 2. Idee/Nutzer/Markt/Geschäft | 01, 11, 13, 14 | vollständig |
| 3. Recht/Rechte/Regeln/Normen | 03, 07, 12, 19, ANBIETER-REGISTER, RELEASE | vollständig als Prüfpfad |
| 4. Produkt/Funktionsstruktur | 01, 02, 10 | vollständig |
| 5. UX/UI/Inhalte/Marke | 03, 04, 16, 17, 19 | vollständig |
| 6. System/Architektur | 05, 06, 12, 15, 19 | vollständig |
| 7. Daten-Lifecycle | 05, 07, 15, 16, 19, ANBIETER-REGISTER | vollständig |
| 8. Entwicklung mit KI | 05, 06, STACK-PROFIL | vollständig projektspezifisch |
| 9. Qualität/Tests | 08, 10, 12, 19, RELEASE | vollständig |
| 10. Veröffentlichung | 08, 09, 12, 19, RELEASE | vollständig |
| 11. Marketing/Nutzergewinnung | 11, 13, 14 | vollständig |
| 12. Betrieb über Jahre | 09, 14, 15, 16, 17, 19, 10 | vollständig |
| 13. Langfristige Nutzbarkeit/Exit | 05, 09, 14, 15, 16, 19, ANBIETER-REGISTER | vollständig |
| 14. Fertig-Kriterium/Nachweise | RELEASE, STATUS, 10, diese Datei | vollständig |

## 3. Orientierung und Voraussetzungen

Abgedeckt durch:

- realer Repository-/Branch-Kontext;
- Web/PWA-Ausgangspunkt;
- native Strategie;
- Account-/Tool-Setup;
- Umgebungen;
- Rollen;
- Geräte-/Store-Konten;
- Stackprofil für Agenten.

**Nachweisartefakte:**

- `STACK-PROFIL.json`;
- Accountregister;
- Environmentmatrix;
- Device-Testmatrix;
- Releasekanalentscheidung.

## 4. Idee, Nutzer, Markt und Geschäft

Abgedeckt durch:

- Produktvision;
- primäre Zielgruppe;
- Kernprobleme;
- v1-Scope;
- Nicht-Ziele;
- Wettbewerbsgruppen;
- Nutzerinterviews;
- Review Mining;
- Positionierung;
- Zahlungsbereitschaft;
- Free/Premium-Modell;
- Unit Economics;
- Break-even/Profitabilität.

**Keine Behauptung:** Der Markt ist bereits validiert. Die Anleitung definiert, wie er validiert werden muss.

## 5. Recht, Rechte, Regeln und Normen

Abgedeckt durch:

- Datenschutz;
- Standort;
- Analytics/Consent;
- Betreiberangaben;
- Store Privacy/Data Safety;
- Payments/Subscriptions;
- Content-/Asset-/Font-/Audio-Lizenzen;
- Quran-/Hadith-/Übersetzungsrechte;
- Drittanbieterregister;
- Accountlöschung;
- KI-Grenzen;
- Accessibility-Prüfpfad;
- internationale Veröffentlichung.

Rechts-/Storetexte bleiben zeitabhängig und müssen vor Release anhand aktueller Primärquellen geprüft werden.

## 6. Produkt-/Funktionsstruktur

Abgedeckt durch:

- P0/P1/P2;
- Kernflows;
- Screen-/Modulbreite;
- Fehler-/Offlinezustände;
- Onboarding;
- Sammlungen;
- Settings;
- Auth/Sync;
- Premium;
- KI;
- Quran-Audio als bedingtes Modul;
- Feature Flags;
- Release Gates.

## 7. UX/UI/Inhalte/Marke

Abgedeckt durch:

- Premium-Designsystem;
- responsive Größen;
- Touch Targets;
- Arabic Rendering;
- Accessibility;
- Reduced Motion;
- Screen States;
- Contentkennzeichnung;
- RTL/i18n;
- Quran-Audio-Playerzustände;
- Designabnahme.

## 8. Architektur

Abgedeckt durch:

- Client;
- Backend;
- Auth;
- Cloud Sync;
- DB;
- Storage;
- externe APIs;
- KI Gateway/RAG;
- Payments/Entitlements;
- Push/Notifications;
- Monitoring;
- Native Container;
- Dev/Staging/Prod;
- Backup/Restore;
- Quran-Audio-Manifest/CDN/Offlinepakete;
- Exit.

## 9. Daten-Lifecycle

Abgedeckt durch:

- lokale Speicherung;
- Cloud-Sync-Zielmodell;
- externe Datenquellen;
- Standortdaten;
- Accountdaten;
- Contentdaten;
- Audio-Metadaten/Downloads;
- KI-Daten;
- Paymentdaten;
- Analytics;
- Export/Löschung;
- Backup/Restore;
- Datenminimierung;
- Anbieterwechsel.

## 10. Entwicklung mit KI

Projektspezifisch abgedeckt durch:

- maschinenlesbares Stackprofil;
- klare Quellen-/Contentgrenzen;
- KI-Assistent als eigener Safety-Bereich;
- Server-Gateway;
- RAG;
- Prompt-Injection/Halluzinationstests;
- Goldenset;
- Kill Switch;
- keine ungeprüfte religiöse Gewissheit.

Für Coding-Agenten gilt weiterhin der allgemeine Master-Entwicklungsprozess als Orientierung.

## 11. Qualität und Tests

Abgedeckt durch:

- bestehende statische Checks;
- Unit;
- Integration;
- E2E;
- Accessibility;
- Browser/Devices;
- API Failure Matrix;
- Qibla/Prayer Tests;
- Payments;
- Auth/RLS;
- PWA Cache/Update;
- Backup/Restore;
- KI Evaluation;
- Quran-Audio-Mapping/Streaming/Offline/Device Tests;
- visuelle Abnahme;
- Release Candidate.

## 12. Veröffentlichung

Abgedeckt für:

- Web/PWA;
- iOS;
- Android;
- Capacitor-Prüfpfad;
- Signierung;
- TestFlight;
- Play Test Tracks;
- Store-Metadaten;
- Screenshots;
- IAP/Subscriptions;
- Privacy/Data Safety;
- Review Notes;
- Audio-Rechte/Attribution soweit aktiv;
- staged rollout;
- Monitoring/Rollback.

## 13. Marketing und Nutzergewinnung

Abgedeckt durch:

- Positionierung;
- Landingpage;
- Waitlist/Beta;
- Social Content;
- ASO;
- SEO;
- Creator/Partner;
- Referral;
- Reviews;
- Lifecycle;
- Analytics Funnel;
- Growth Experimente;
- Launch;
- Acquisition/Activation/Retention/Revenue/Trust KPIs.

## 14. Betrieb über Jahre

Abgedeckt durch:

- Monitoring;
- Support;
- Contentfehler;
- Providerkosten;
- Incident/Rollback;
- Securitypflege;
- Contentversionen;
- Providerreviews;
- Restoreübungen;
- Internationalisierung;
- Audioquellen-/Rechte-/Manifestpflege;
- Account-/Access-Reviews;
- Produktende.

## 15. Langfristige Nutzbarkeit

Das Handbuch trennt bewusst:

```text
zeitlose Fähigkeit
→ aktuelle Anbieteroption
→ Prüfdatum
→ Exit/Alternative
```

Beispiele:

- Supabase ist nicht „für immer Pflicht“;
- RevenueCat ist eine Option, nicht die Definition von Entitlements;
- Capacitor ist der bevorzugte Prüfpfad, nicht ein unumkehrbares Architekturgesetz;
- externe Prayer/Quran/Moschee-Anbieter benötigen Exit/Fallback;
- ein Quran-Audio-Provider darf nicht die einzige Wissensquelle für Rechte, Mapping oder Metadaten sein.

## 16. Projektartefakte – vollständige Sollmenge

Vor einem echten v1-GO sollen mindestens entstehen:

### Produkt

- v1-Scope;
- Kernflow-/Screenliste;
- Markt-/Wettbewerbsmatrix;
- Interview-/Validierungsbelege;
- Positionierung.

### Content

- Quellenregister;
- R4-Freigabeliste;
- Content-Version;
- Korrektur-/Rollbackweg;
- Lizenznachweise;
- Audioquellen-/Rezitatorregister falls Audio aktiv.

### Technik

- Zielarchitektur;
- Datenmodell;
- Environmentmatrix;
- Anbieterregister;
- Secret-/Accessregister;
- native Strategie;
- CI/CD;
- Testmatrix;
- Audio-Manifest/Mapping/Offlineplan falls Audio aktiv.

### Business

- Free/Premium-Matrix;
- Preis-/Zahlungsbereitschaftsbeleg;
- Kostenmodell 100/1k/10k/100k;
- Audio-/CDN-Kostenmodell falls aktiv;
- Entitlement-/Paymentarchitektur;
- Launch-/Growthplan.

### Release

- RC-Commit;
- grüne Checks;
- Gerätebelege;
- Privacy/Legal/Store-Angaben;
- Monitoring;
- Support;
- Rollback;
- Go-/No-Go-Protokoll.

## 17. Was bewusst außerhalb bleibt

Eine projektspezifische Anleitung kann nicht vorab garantieren:

- islamwissenschaftliche Richtigkeit jedes später eingefügten Inhalts;
- rechtliche Zulässigkeit in jedem zukünftigen Land;
- zukünftige Store-Regeln;
- zukünftige Anbieterpreise;
- zukünftige Framework-/SDK-Kompatibilität;
- Audio-Nutzungsrechte ohne konkrete Lizenzprüfung;
- echten Testerfolg ohne ausgeführte Tests.

Deshalb sind Quellen, Prüfdaten, Reviews und Gates Teil der Anleitung.

## 18. Schlusskriterium für die Anleitung

Die **Nur-Islam-Premium-Anleitung selbst** gilt strukturell als vollständig, wenn:

- alle Dateien dieses Projektordners vorhanden sind;
- interne Links gültig sind;
- `STACK-PROFIL.json` valide ist;
- jede der 14 Master-Kategorien oben mindestens einem konkreten Projektartefakt und Gate zugeordnet ist;
- Markt, Marketing, Native Stores, Kosten, Contentbetrieb, Internationalisierung und Quran-Audio nicht nur als Randnotizen behandelt werden.

Die **App** gilt dadurch ausdrücklich noch nicht automatisch als fertig. Für sie gilt ausschließlich die [Finale Release-Checkliste](./RELEASE-CHECKLISTE.md).

## 19. Quran-Audio als Spezialbereich

Quran-Audio ist im allgemeinen Master über Medien, Rechte, Storage, Offline, Kosten, Accessibility und Veröffentlichung verteilt. Für Nur Islam ist es fachlich und technisch wichtig genug für einen eigenen Spezialpfad:

- [19 – Quran-Audio und Rezitationssystem](./19-QURAN-AUDIO-REZITATION.md)

Damit sind Rezitator/Quelle, Rechte, Ayah-Mapping, Streaming, Offlinepakete, Player, native Background-Wiedergabe, Integrität, CDN-Kosten und Rollback ausdrücklich abgedeckt.
