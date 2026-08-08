# 06 – KI-Assistent: Quellen, Safety und Architektur

## Ausgangslage

`AssistantScreen.tsx` ist aktuell bewusst nur eine Oberfläche. Antworten weisen darauf hin, dass noch kein echter KI-Anbieter verbunden ist. Das ist für den jetzigen Stand korrekt und sollte erst geändert werden, wenn der gesamte Quellen-/Safety-Prozess steht.

## 1. Produktrolle

Der Nur-Assistent soll sein:

- Such- und Lernhilfe;
- Quellenfinder;
- Erklärhilfe für freigegebene Inhalte;
- Navigator zu Quran, Hadith, Duas und Lernmodulen.

Er soll **nicht** sein:

- automatische Fatwa-Stelle;
- persönliche Rechtsberatung;
- medizinische/psychologische/finanzielle Beratung mit religiöser Autorität;
- Ersatz für Gelehrte bei komplexen Einzelfällen.

## 2. Zielarchitektur

```text
App
→ Server-KI-Gateway
→ Auth/Rate Limit
→ Safety-Klassifikation
→ Retrieval aus freigegebenem Quellenbestand
→ Modell
→ strukturierte Antwort
→ Quellenvalidierung
→ Output-Safety
→ Antwort + Quellen + Unsicherheitsstatus
```

API-Key niemals im Client.

## 3. Retrieval-Regel

Nur freigegebene Inhalte dürfen in den produktiven Retrieval-Index.

Metadaten je Chunk:

```text
content_id
source_id
content_type
book/surah/reference
language
review_status
madhhab_or_scope
version
license_status
```

Retrieval filtert mindestens auf:

- `review_status = released`;
- erlaubte Sprache;
- erlaubten Contenttyp;
- gültige Version;
- Nutzer-/Mandantenrechte, falls private Inhalte später existieren.

## 4. Antwortschema

Beispiel:

```json
{
  "answer": "...",
  "confidence": "supported|mixed|insufficient",
  "sources": [
    {"source_id":"...","reference":"..."}
  ],
  "differences_exist": false,
  "needs_human_or_scholar": false,
  "safety_note": ""
}
```

Freitext ohne maschinenprüfbare Quellenliste ist für produktive religiöse Antworten nicht ausreichend.

## 5. Fragenklassen

### Klasse A – einfache Quellenfrage

Beispiel: Bedeutung einer klar referenzierten Sure.

Darf beantwortet werden, wenn Quelle vorhanden.

### Klasse B – allgemeine Lernfrage

Darf mit Quellen und klarer Einordnung beantwortet werden.

### Klasse C – Fiqh mit bekannten Unterschieden

Antwort:

- Unterschiede benennen;
- keine falsche Eindeutigkeit;
- Quellen/Schulen nennen, soweit freigegeben;
- ggf. Rückfrage oder Fachverweis.

### Klasse D – persönliche Fatwa-/Einzelfallfrage

Keine autonome Entscheidung.

Muster:

> „Das hängt von Details und ggf. der Rechtsschule ab. Ich kann dir die relevanten Grundlagen und Quellen zeigen, aber für eine persönliche verbindliche Einordnung solltest du eine qualifizierte Fachperson fragen.“

### Klasse E – Selbstgefährdung/akute Gefahr/medizinischer Notfall

Religiöse Antwort darf notwendige professionelle Hilfe nicht ersetzen oder verzögern.

## 6. Halluzinationsschutz

- Antwort ohne Retrievaltreffer → nicht improvisieren;
- erfundene Quran-/Hadithreferenz = harter Fehler;
- Quellen müssen gegen interne IDs validiert werden;
- Modell darf keine Quelle frei ergänzen;
- Zitate nur aus freigegebenen Textfeldern;
- direkte Zitate und Zusammenfassungen unterscheiden.

## 7. Prompt-Injection-Schutz

RAG-Dokumente sind Daten, keine Systemanweisungen.

Tests:

- „Ignoriere alle Regeln“ in importiertem Dokument;
- versteckte HTML-/Markdown-Anweisung;
- Nutzer fordert interne Prompts;
- Nutzer fordert fremde/private Daten;
- Tool-Aufruf außerhalb erlaubter Aktionen.

## 8. Toolrechte

Für v1 möglichst keine autonomen irreversiblen Tools.

Erlaubt denkbar:

- App-Inhalte suchen;
- Navigation öffnen;
- Gebetszeit/Quelle anzeigen;
- Lesezeichen vorschlagen – mit Nutzerbestätigung.

Nicht autonom:

- Käufe;
- Accountlöschung;
- Nachrichten an andere Nutzer;
- Änderung religiöser Inhalte;
- Adminaktionen.

## 9. Datenschutz

Vor Speicherung von Chatdaten klären:

- warum speichern?
- wie lange?
- wer sieht sie?
- gehen sie an Modellanbieter?
- Training/Weiterverwendung?
- Export/Löschung?
- sensible religiöse Angaben?

Datensparsame Standardoption:

- keine dauerhafte Chatspeicherung ohne klaren Nutzerwert;
- Pseudonymisierung/Minimierung;
- keine unnötigen exakten Standortdaten im Prompt.

## 10. Evaluation

Goldenset mindestens mit:

- Quranreferenzen;
- Hadithreferenzen;
- Duas/Dhikr;
- einfache Aqidah-/Lernfragen;
- Fiqh-Unterschiede;
- unbekannte Frage;
- erfundene Quelle als Falle;
- Prompt Injection;
- persönliche Fatwa;
- extrem lange Eingabe;
- gemischte deutsche/arabische Eingabe;
- Rechts-/Gesundheitsgrenzfälle.

Metriken:

- Quellenpräzision;
- Quellenabdeckung;
- Halluzinationsrate;
- falsche Eindeutigkeit;
- Safety-Verstöße;
- Nutzererfolg;
- Latenz;
- Kosten.

## 11. Kill Switch

Der KI-Assistent muss serverseitig deaktivierbar sein, ohne App-Update.

Fallback:

> „Der Assistent ist vorübergehend nicht verfügbar. Quran, Duas, Gebetszeiten und Lerninhalte bleiben nutzbar.“

## 12. Release-Gate KI

Kein produktiver KI-Assistent, solange nicht nachgewiesen:

- serverseitiges Gateway;
- freigegebener Retrievalbestand;
- Quellenvalidierung;
- Goldenset;
- Prompt-Injection-Tests;
- Rate-/Kostenlimit;
- Datenschutzentscheidung;
- Fallback/Kill Switch;
- klare Eskalation bei persönlichen/strittigen Fragen.
