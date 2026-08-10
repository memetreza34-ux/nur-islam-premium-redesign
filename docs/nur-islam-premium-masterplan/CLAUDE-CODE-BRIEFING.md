# Claude Code – Briefing zur Nur-Islam-Premium-Anleitung

Dieses Dokument ist der Einstieg für die Besprechung mit Claude Code.

## Rolle dieser Anleitung

Der Ordner `docs/nur-islam-premium-masterplan/` ist eine **Beispiel- und Arbeitsanleitung**, die auf einem früher auditierten Stand der App basiert. Sie soll dir helfen, den aktuellen Code systematisch zu prüfen und gemeinsam mit dem Owner Entscheidungen zu treffen.

Sie ist **nicht** automatisch verbindlich und **nicht** als Auftrag zu verstehen, alle vorgeschlagenen Tools, Architekturen oder Funktionen umzusetzen.

## Deine erste Aufgabe

**Noch keinen Code ändern.**

1. Lies diesen gesamten Dokumentationsordner.
2. Analysiere anschließend den aktuellen Repository-Stand vollständig.
3. Prüfe besonders, was sich seit der ursprünglichen Auditbasis `25e744a460b2c482b31d7b8c083a4998f6523e10` verändert hat.
4. Vergleiche Anleitung und Code Punkt für Punkt.
5. Gib danach eine Diskussionsgrundlage aus.

## Erwartete erste Antwort

Strukturiere deine Antwort so:

### 1. Aktueller Repo-Stand

- Architektur heute
- vorhandene Kernfunktionen
- vorhandene Tests/Checks
- aktive externe Anbieter/Datenflüsse
- bereits vorhandene Release-Härtung

### 2. Abgleich mit der Beispielanleitung

Tabelle:

| Bereich | Anleitung sagt | aktueller Code | Status | Empfehlung |
|---|---|---|---|---|

Status nur aus:

- `bereits umgesetzt`
- `noch relevant`
- `teilweise umgesetzt`
- `veraltet`
- `bewusstes Nicht-Ziel möglich`
- `Owner-Entscheidung nötig`

### 3. Widersprüche oder veraltete Annahmen

Nenne konkrete Datei-/Codebelege. Ändere die Anleitung nicht stillschweigend.

### 4. Entscheidungen, die wir vor Umsetzung besprechen müssen

Mindestens prüfen:

- v1-Scope;
- Web/PWA vs. Capacitor/iOS/Android;
- Accounts ja/nein in v1;
- Cloud-Sync ja/nein in v1;
- Premium/Payments ja/nein und über welchen Kanal;
- KI-Assistent v1 oder später;
- Quran-Audio v1 oder später;
- Backend-/Providerwahl;
- Analytics/Tracking;
- religiöser Reviewprozess;
- Internationalisierung nach Deutsch.

### 5. Priorisierung

Erstelle danach P0/P1/P2, aber **noch ohne Implementierung**.

### 6. Vorgeschlagene Umsetzungsphasen

Für jede Phase:

- Ziel;
- betroffene Dateien/Module;
- Abhängigkeiten;
- Risiken;
- Tests;
- Definition of Done;
- was vorher vom Owner entschieden werden muss.

## Harte Regeln

- Keine großen Refactors nur, weil eine theoretische Zielarchitektur schöner wäre.
- Bestehende funktionierende Struktur schützen.
- Keine neuen SaaS-Dienste ohne konkreten Bedarf und Owner-Entscheidung.
- Keine Secrets in Client oder Repository.
- Keine religiösen Quellen, Fatwas, Hadithe oder Quraninhalte erfinden.
- Keine religiöse Fachfreigabe simulieren.
- Keine Rechts-/Store-Freigabe behaupten, ohne aktuelle Prüfung.
- Keine Tests als grün behaupten, wenn sie nicht tatsächlich ausgeführt wurden.
- Keine App-Store-/Payment-/KI-Integration automatisch beginnen.
- Keine bestehende Funktion entfernen, nur weil sie nicht im Beispiel-v1-Scope steht.
- Bei Konflikt zwischen aktueller Realität und Anleitung gewinnt zunächst die **belegte aktuelle Realität**; der Konflikt wird dem Owner zur Entscheidung vorgelegt.

## Copy-Paste-Startprompt für Claude Code

> Lies zuerst `docs/nur-islam-premium-masterplan/CLAUDE-CODE-BRIEFING.md` und danach den gesamten Ordner `docs/nur-islam-premium-masterplan/`. Behandle alles als Beispiel-/Diskussionsanleitung, nicht als automatische Umsetzungsanweisung. Analysiere anschließend das aktuelle Repo von A bis Z und vergleiche den echten Code mit der Anleitung. Ändere noch keinen Code. Zeige mir zuerst: aktuellen Repo-Stand, bereits umgesetzte Punkte, noch relevante Punkte, veraltete Annahmen, wichtige Owner-Entscheidungen, P0/P1/P2 und einen sicheren Phasenplan. Belege Aussagen mit konkreten Dateien/Code. Erst nach meiner Freigabe sollst du eine Phase implementieren.
