# Nur Islam Premium – Beispiel-Masterplan für die Besprechung mit Claude Code

**Stand der übertragenen Anleitung:** 8. August 2026  
**Quellprojekt:** `memetreza34-ux/von-idee-bis-fertig`  
**App-Repository:** `memetreza34-ux/nur-islam-premium-redesign`  
**ursprüngliche Auditbasis der Anleitung:** Branch `premium-home-redesign`, HEAD `25e744a460b2c482b31d7b8c083a4998f6523e10`  
**Dokumentationsbranch wurde erstellt von:** App-HEAD `d41bd1b46b2d9c224bef2ea0c1920f4e4d7cc5c4`

> **WICHTIG FÜR CLAUDE CODE:** Diese Dokumentation ist eine **Beispiel-, Diskussions- und Planungsanleitung**. Sie ist **keine automatische Ausführungsanweisung**. Prüfe jede Aussage zuerst gegen den aktuellen Repository-Stand. Implementiere, installiere, migriere, lösche oder refaktoriere nichts nur deshalb, weil es hier empfohlen wird.

## So soll Claude Code damit arbeiten

1. Zuerst [`CLAUDE-CODE-BRIEFING.md`](./CLAUDE-CODE-BRIEFING.md) lesen.
2. Danach die Anleitung und den **aktuellen** Code von A bis Z vergleichen.
3. Empfehlungen jeweils markieren als:
   - `bereits umgesetzt`;
   - `noch relevant`;
   - `veraltet`;
   - `bewusstes Nicht-Ziel`;
   - `Entscheidung des Owners nötig`.
4. Widersprüche zwischen Dokumentation und aktuellem Code offen nennen.
5. Keine Annahme als Tatsache ausgeben.
6. Vor größeren Architektur-, Backend-, Payment-, Store-, KI- oder Content-Entscheidungen erst Varianten und Folgen besprechen.
7. Erst Code ändern, wenn der Owner die nächste Umsetzungsphase ausdrücklich freigibt.

## Was diese Anleitung abdeckt

```text
Ist-Analyse
→ Produkt/Zielgruppe
→ Markt/Wettbewerb
→ Funktionen/Content
→ religiöse Quellen/Fachreview
→ Premium UX/UI
→ Architektur/Daten/Backend
→ KI/Safety
→ Security/Datenschutz/Recht
→ Testing/QA
→ Native iOS/Android/Stores
→ Monetarisierung/Payments
→ Marketing/ASO/Growth
→ Kosten/Profitabilität
→ Accounts/Tools/Secrets
→ Content-Betrieb/Rollback
→ Internationalisierung/RTL
→ Quran-Audio/Rezitation
→ Roadmap
→ Release-Gates
```

## Empfohlene Lesereihenfolge

1. [`00-IST-ANALYSE-A-Z.md`](./00-IST-ANALYSE-A-Z.md)
2. [`01-PRODUKT-ZIELBILD.md`](./01-PRODUKT-ZIELBILD.md)
3. [`11-MARKT-WETTBEWERB-VALIDIERUNG.md`](./11-MARKT-WETTBEWERB-VALIDIERUNG.md)
4. [`02-FUNKTIONS-UND-CONTENT-MATRIX.md`](./02-FUNKTIONS-UND-CONTENT-MATRIX.md)
5. [`03-RELIGIOESE-INHALTE-QUELLEN-REVIEW.md`](./03-RELIGIOESE-INHALTE-QUELLEN-REVIEW.md)
6. [`04-UX-UI-PREMIUM-SYSTEM.md`](./04-UX-UI-PREMIUM-SYSTEM.md)
7. [`05-ARCHITEKTUR-STACK-DATEN.md`](./05-ARCHITEKTUR-STACK-DATEN.md)
8. [`06-KI-ASSISTENT-SICHERHEIT.md`](./06-KI-ASSISTENT-SICHERHEIT.md)
9. [`07-SECURITY-DATENSCHUTZ-RECHT.md`](./07-SECURITY-DATENSCHUTZ-RECHT.md)
10. [`12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md`](./12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md)
11. [`08-TESTING-QA-RELEASE.md`](./08-TESTING-QA-RELEASE.md)
12. [`09-MONETARISIERUNG-LAUNCH-BETRIEB.md`](./09-MONETARISIERUNG-LAUNCH-BETRIEB.md)
13. [`14-KOSTEN-PROFITABILITAET.md`](./14-KOSTEN-PROFITABILITAET.md)
14. [`15-ACCOUNT-UND-TOOLS-SETUP.md`](./15-ACCOUNT-UND-TOOLS-SETUP.md)
15. [`13-MARKETING-ASO-GROWTH.md`](./13-MARKETING-ASO-GROWTH.md)
16. [`16-CONTENT-BETRIEBSHANDBUCH.md`](./16-CONTENT-BETRIEBSHANDBUCH.md)
17. [`17-INTERNATIONALISIERUNG-LOKALISIERUNG.md`](./17-INTERNATIONALISIERUNG-LOKALISIERUNG.md)
18. [`19-QURAN-AUDIO-REZITATION.md`](./19-QURAN-AUDIO-REZITATION.md)
19. [`10-ROADMAP-BIS-FERTIG.md`](./10-ROADMAP-BIS-FERTIG.md)
20. [`18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md`](./18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md)
21. [`RELEASE-CHECKLISTE.md`](./RELEASE-CHECKLISTE.md)

## Arbeitsregister

- [`ANBIETER-UND-DATENFLUSS-REGISTER.md`](./ANBIETER-UND-DATENFLUSS-REGISTER.md)
- [`QUELLENREGISTER-VORLAGE.md`](./QUELLENREGISTER-VORLAGE.md)
- [`STACK-PROFIL.json`](./STACK-PROFIL.json)
- [`STATUS.md`](./STATUS.md)

## Grundregel

**Vollständige Anleitung ≠ fertige App.** Ein Haken zählt erst mit echtem Nachweis. Religiöse Fachfreigaben, Rechtsprüfung, Marktbelege, Builds, reale Gerätetests, Store-Freigaben und wirtschaftliche Tragfähigkeit dürfen nicht durch Dokumentation ersetzt oder erfunden werden.
