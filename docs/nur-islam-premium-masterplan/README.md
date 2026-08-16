# Nur Islam Premium – Masterplan und vollständige App-Anleitung

**Ursprung der übertragenen Anleitung:** 8. August 2026  
**Quellprojekt:** `memetreza34-ux/von-idee-bis-fertig`  
**App-Repository:** `memetreza34-ux/nur-islam-premium-redesign`

## Vor jeder Arbeit zuerst lesen

Der aktuelle Implementierungs- und Release-Status steht **nicht** in den historischen Planungsannahmen dieses Ordners, sondern zentral in:

[`../../CURRENT-STATUS.md`](../../CURRENT-STATUS.md)

Diese Datei ist die **Single Source of Truth** für:

- was heute tatsächlich implementiert ist;
- welcher Branch der Release Candidate ist;
- welche QA bereits belegt ist;
- welche Punkte noch echte Release-Blocker sind;
- welche Themen bewusst nicht zum aktuellen V1-Finish gehören.

> **WICHTIG FÜR CLAUDE CODE UND ANDERE CODING-AGENTS:** Diese Dokumentation ist eine Planungs-, Prüf- und Arbeitsanleitung. Sie ist **keine automatische Ausführungsanweisung**. Prüfe jede Aussage zuerst gegen `CURRENT-STATUS.md` und den aktuellen Repository-Code. Implementiere, installiere, migriere, lösche oder refaktoriere nichts nur deshalb, weil es hier als mögliche Zielarchitektur oder spätere Phase beschrieben wird.

## Aktueller Owner-Entscheid für V1

Für den laufenden Finish-Pass gilt:

**Keine neuen Features.**

Priorität ist ausschließlich:

1. vorhandene App stabilisieren;
2. konkrete Design-/Bild-/Icon-/Lesbarkeitsfehler beseitigen;
3. automatisierte QA grün halten;
4. reale Geräte-/Sensorprüfung abschließen;
5. religiösen Fachreview abschließen;
6. Rechte, Datenschutz und Betreiberangaben abschließen;
7. kontrolliert releasen.

Native Store-Pakete, Payments, frei generierende KI und zusätzliche große Module gehören nicht in diesen Finish-Pass, sofern der Owner diese Scope-Entscheidung nicht später ausdrücklich ändert.

## So soll ein Coding-Agent mit der Anleitung arbeiten

1. Zuerst [`../../CURRENT-STATUS.md`](../../CURRENT-STATUS.md) lesen.
2. Danach [`CLAUDE-CODE-BRIEFING.md`](./CLAUDE-CODE-BRIEFING.md) lesen.
3. Anschließend die relevante Anleitung gegen den **aktuellen** Code vergleichen.
4. Jede Empfehlung einordnen als:
   - `bereits umgesetzt`;
   - `noch relevant`;
   - `veraltet`;
   - `bewusstes Nicht-Ziel für V1`;
   - `Owner-/Fachentscheidung nötig`.
5. Widersprüche zwischen Dokumentation und Code offen nennen.
6. Keine Annahme als Tatsache ausgeben.
7. Vor größeren Architektur-, Backend-, Payment-, Store-, KI- oder Content-Entscheidungen erst prüfen, ob das Thema überhaupt zum aktuellen Scope gehört.
8. Keine neuen Features in den Release Candidate einschleusen.
9. Ein Punkt gilt erst als fertig, wenn es echte Evidenz gibt.

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

Nicht jeder Bereich ist Bestandteil der aktuellen V1-Umsetzung. Einige Kapitel dokumentieren bewusst spätere Entscheidungsräume.

## Empfohlene Lesereihenfolge

1. [`STATUS.md`](./STATUS.md) – verweist auf den aktuellen zentralen Status.
2. [`00-IST-ANALYSE-A-Z.md`](./00-IST-ANALYSE-A-Z.md)
3. [`01-PRODUKT-ZIELBILD.md`](./01-PRODUKT-ZIELBILD.md)
4. [`11-MARKT-WETTBEWERB-VALIDIERUNG.md`](./11-MARKT-WETTBEWERB-VALIDIERUNG.md)
5. [`02-FUNKTIONS-UND-CONTENT-MATRIX.md`](./02-FUNKTIONS-UND-CONTENT-MATRIX.md)
6. [`03-RELIGIOESE-INHALTE-QUELLEN-REVIEW.md`](./03-RELIGIOESE-INHALTE-QUELLEN-REVIEW.md)
7. [`04-UX-UI-PREMIUM-SYSTEM.md`](./04-UX-UI-PREMIUM-SYSTEM.md)
8. [`05-ARCHITEKTUR-STACK-DATEN.md`](./05-ARCHITEKTUR-STACK-DATEN.md)
9. [`06-KI-ASSISTENT-SICHERHEIT.md`](./06-KI-ASSISTENT-SICHERHEIT.md)
10. [`07-SECURITY-DATENSCHUTZ-RECHT.md`](./07-SECURITY-DATENSCHUTZ-RECHT.md)
11. [`08-TESTING-QA-RELEASE.md`](./08-TESTING-QA-RELEASE.md)
12. [`12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md`](./12-NATIVE-IOS-ANDROID-STORE-STRATEGIE.md)
13. [`09-MONETARISIERUNG-LAUNCH-BETRIEB.md`](./09-MONETARISIERUNG-LAUNCH-BETRIEB.md)
14. [`14-KOSTEN-PROFITABILITAET.md`](./14-KOSTEN-PROFITABILITAET.md)
15. [`15-ACCOUNT-UND-TOOLS-SETUP.md`](./15-ACCOUNT-UND-TOOLS-SETUP.md)
16. [`13-MARKETING-ASO-GROWTH.md`](./13-MARKETING-ASO-GROWTH.md)
17. [`16-CONTENT-BETRIEBSHANDBUCH.md`](./16-CONTENT-BETRIEBSHANDBUCH.md)
18. [`17-INTERNATIONALISIERUNG-LOKALISIERUNG.md`](./17-INTERNATIONALISIERUNG-LOKALISIERUNG.md)
19. [`19-QURAN-AUDIO-REZITATION.md`](./19-QURAN-AUDIO-REZITATION.md)
20. [`10-ROADMAP-BIS-FERTIG.md`](./10-ROADMAP-BIS-FERTIG.md)
21. [`18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md`](./18-VOLLSTAENDIGKEIT-GEGEN-MASTER.md)
22. [`RELEASE-CHECKLISTE.md`](./RELEASE-CHECKLISTE.md)

## Arbeitsregister

- [`ANBIETER-UND-DATENFLUSS-REGISTER.md`](./ANBIETER-UND-DATENFLUSS-REGISTER.md)
- [`QUELLENREGISTER-VORLAGE.md`](./QUELLENREGISTER-VORLAGE.md)
- [`STACK-PROFIL.json`](./STACK-PROFIL.json)
- [`STATUS.md`](./STATUS.md)

## Grundregel

**Vollständige Anleitung ≠ fertige App.**

Ein Haken zählt erst mit echtem Nachweis. Religiöse Fachfreigaben, Rechtsprüfung, Rechteklärung, Builds, reale Gerätetests, Store-Freigaben und wirtschaftliche Tragfähigkeit dürfen nicht durch Dokumentation ersetzt oder erfunden werden.

Für den jeweils aktuellen Ist-Stand gilt immer [`../../CURRENT-STATUS.md`](../../CURRENT-STATUS.md).
