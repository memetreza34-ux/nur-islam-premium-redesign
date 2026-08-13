# 16 – Content-Betrieb, Korrekturen und religiöse Governance

**Stand:** 8. August 2026  
**Ziel:** religiöse Inhalte nach dem Launch genauso kontrolliert betreiben wie Code. Falsche, unklare oder falsch zugeordnete Inhalte müssen nachvollziehbar gemeldet, geprüft, korrigiert, versioniert und notfalls sofort zurückgezogen werden können.

## 1. Grundsatz

Religiöser Content ist kein statischer Dekotext.

Für jede veröffentlichte Aussage muss nachvollziehbar sein:

- was der Originaltext ist;
- was Übersetzung/Bedeutung ist;
- was redaktionelle Zusammenfassung ist;
- aus welcher Quelle sie stammt;
- welche Edition/Referenz gilt;
- wer sie geprüft hat;
- welcher Reviewstatus gilt;
- wann sie zuletzt geändert wurde.

## 2. Rollen

### Content Owner

- verantwortet Prozess und Veröffentlichungsstatus;
- entscheidet nicht allein über strittige religiöse Fachfragen.

### Fachreview

- prüft religiösen Inhalt, Kontext, Quelle und Formulierung;
- dokumentiert Abweichungen/Meinungsunterschiede.

### Redaktion

- Sprache, Verständlichkeit, Konsistenz;
- darf Fachinhalt nicht stillschweigend verändern.

### Engineering

- Datenmodell, Versionierung, Rollback, Anzeige;
- darf keine ungeprüften Content-Hotfixes ausdenken.

### Support/Triage

- nimmt Meldungen an;
- klassifiziert technisch vs. religiöser Inhalt;
- eskaliert.

## 3. Content-IDs

Jeder Datensatz braucht stabile ID.

Beispiele:

```text
quran:112:1:ar
quran:112:1:de-bubenheim
hadith:bukhari:1
hadith:muslim:1907
dua:before-sleep:01
dhikr:after-prayer:tasbih
name-of-allah:48
lesson:wudu:step-03
lesson:aqidah:01
```

IDs bleiben stabil, auch wenn UI-Titel geändert werden.

## 4. Reviewstatus R0–R4

### R0 – Rohbestand

- importiert/übernommen;
- nicht für Public Release.

### R1 – technische Validierung

- Schema;
- Pflichtfelder;
- IDs;
- Referenzformat;
- Encoding;
- arabische Zeichen.

### R2 – redaktionell geprüft

- Rechtschreibung;
- Darstellung;
- Kennzeichnung Original/Übersetzung/Zusammenfassung.

### R3 – fachlich geprüft

- Quelle;
- Kontext;
- Authentizitäts-/Editionsangabe soweit relevant;
- Fiqh-/Madhhab-Hinweis;
- Übersetzungsstatus.

### R4 – Releasefreigabe

- darf in Production erscheinen;
- Version und Reviewer dokumentiert.

Produktiver Kerncontent muss R4 sein.

## 5. Content-Record

```text
content_id:
type:
title:
language:
original_source:
source_reference:
edition:
translator:
license_status:
content_kind: original | translation | meaning | summary | editorial
review_status:
reviewer:
reviewed_at:
version:
change_reason:
replaces_version:
published_at:
withdrawn_at:
notes:
```

## 6. Meldungswege

In der App oder Supportseite klare Kategorie:

**„Religiösen Inhaltsfehler melden“**

Formular:

- Screen/Content-ID automatisch;
- Art des Problems;
- Beschreibung;
- optionale Quelle/Referenz;
- Screenshot optional;
- Kontakt optional.

Nicht verlangen:

- vollständige persönliche Glaubensbiografie;
- unnötige private Daten.

## 7. Severity

### C0 – kritisch

Beispiele:

- Quran-Arabisch falsch/fehlt/vertauscht;
- falsche Sure/Ayah-Zuordnung;
- erfundene Quelle;
- Hadith falsch als sahih/eindeutig ausgegeben;
- gefährliche persönliche KI-Fatwa als Gewissheit;
- wesentliche religiöse Handlungsanweisung falsch.

Aktion:

- sofort ausblenden/Kill Switch, wenn verlässlich möglich;
- Fachreview eskalieren;
- Nutzerkommunikation prüfen;
- Root Cause.

### C1 – hoch

- Übersetzungs-/Bedeutungsfehler;
- Kontext fehlt und Aussage wird dadurch irreführend;
- Madhhab-Unterschied falsch verallgemeinert;
- falsche Wiederholungszahl/Referenz.

### C2 – mittel

- Transliteration;
- redaktionelle Unklarheit;
- uneinheitliche Schreibweise;
- fehlender Quellenlink trotz korrekter Referenz.

### C3 – niedrig

- Typografie;
- Darstellungsfehler ohne Inhaltsverfälschung;
- Verbesserungsvorschlag.

## 8. Triage-Ablauf

```text
Meldung
→ Content-ID bestimmen
→ technische vs. fachliche Ursache
→ Severity
→ Reproduktion/Quelle
→ Fachreview
→ Entscheidung
→ Patch/Content Release
→ Verifikation
→ Dokumentation
→ Nutzer/Reporter informieren, soweit sinnvoll
```

Keine Meldung als „gelöst“ markieren, nur weil UI geändert wurde, wenn der fachliche Inhalt ungeklärt bleibt.

## 9. Quran-Sonderregeln

Quran-Daten benötigen besonders strengen Pfad.

### Arabisch

- definierte Edition;
- kein manueller Freitext-Hotfix ohne Quellenabgleich;
- Ayah-Anzahl/Nummerierung automatisiert prüfen;
- Prüfsumme/Version des Datenpakets;
- Rendering/Diakritika visuell testen.

### Übersetzung/Bedeutung

- Übersetzer/Edition sichtbar;
- Nutzungsrechte dokumentiert;
- keine stille Mischung zweier Übersetzungen;
- Änderungen versioniert.

### Rollback

Quran-Content muss unabhängig vom App-Code zurückrollbar sein, wenn Content remote ausgeliefert wird.

## 10. Hadith-Sonderregeln

Pflichtfelder soweit möglich:

- Sammlung;
- Nummer/Referenz;
- arabischer/originaler Text nur bei sauberer Quelle;
- Übersetzung/Bedeutung;
- Authentizitäts-/Gradangabe, falls Teil der verwendeten Referenz;
- Kontext/Varianten, wenn relevant;
- Reviewstatus.

Keine erfundene Vereinfachung aus einer KI-Ausgabe als Hadithtext speichern.

## 11. Dua/Dhikr

Prüfen:

- arabischer Wortlaut;
- Transliteration;
- Bedeutung;
- Quelle;
- Anlass;
- Zahl/Wiederholung;
- Varianten;
- ob Zahl wirklich religiös behauptet oder nur App-Ziel ist.

UI muss unterscheiden:

```text
überlieferte Anzahl
vs.
persönliches App-Ziel
```

## 12. Wudu/Salah/Fiqh

Nicht als eine einzige „universelle“ Darstellung ausgeben, wenn relevante Unterschiede bestehen.

Pro Aussage:

- gemeinsamer Kern;
- Rechtsschulunterschied, falls relevant;
- keine unnötige Streitvertiefung im Anfängerflow;
- „bei persönlicher Situation qualifizierte Stelle fragen“ bei Bedarf.

## 13. Lernkurse

Jede Lektion:

```text
Lernziel
Kerntext
Quelle(n)
Zusammenfassung
Begriffe
Frage/Antwort
Reviewstatus
Version
```

Quizfragen müssen aus freigegebenem Inhalt ableitbar sein.

## 14. KI-Korpus

Nur R4-Content darf standardmäßig in produktives Retrieval gelangen.

Indexierung:

```text
content_id
chunk_id
source
review_version
language
madhhab/context tags
retrieval text
citation payload
```

Wenn Content zurückgezogen wird:

1. aus Primärspeicher deaktivieren;
2. Embeddings/Vektorindex aktualisieren;
3. Cache invalidieren;
4. AI Evaluation erneut laufen lassen.

## 15. Content-Release

Content bekommt eigene Version:

```text
content-2026.08.1
```

Release Notes:

- neue Inhalte;
- korrigierte Inhalte;
- zurückgezogene Inhalte;
- betroffene IDs;
- Reviewer;
- Migration/Cachewirkung.

## 16. Content-Rollback

Muss ohne kompletten App-Store-Release möglich sein, wenn Content remote kommt.

Mechanismen:

- active flag;
- version pointer;
- remote config/feature flag;
- vorherige freigegebene Version;
- Cache-Invaliderung.

Offline-App-Pakete benötigen Updatehinweis, wenn kritischer Content korrigiert wurde.

## 17. Transparenz nach außen

Öffentliche Seite „Quellen & Korrekturen“ kann enthalten:

- verwendete Quran-Edition/Übersetzung;
- Hadith-Sammlungen;
- Prinzipien für sinngemäße Bedeutungen;
- Umgang mit Rechtsschulunterschieden;
- Korrekturkontakt;
- wichtige veröffentlichte Korrekturen.

Keine Reviewer-Namen veröffentlichen, wenn dafür keine Zustimmung/Notwendigkeit besteht.

## 18. Content-Audit

Regelmäßig prüfen:

- R4-Anteil;
- veraltete Quellenlinks;
- fehlende Lizenzen;
- doppelte/uneinheitliche IDs;
- offene C0/C1;
- ungeprüfte Übersetzungen;
- AI-Korpus entspricht aktuellem Releasebestand;
- UI-Kennzeichnungen korrekt.

## 19. Metriken

- Contentfehler pro 1.000 aktive Nutzer;
- C0/C1 Anzahl;
- Zeit von Meldung bis Freigabe;
- Rückfallrate;
- Anteil R4;
- Anzahl Content-Rollbacks;
- häufigste Fehlerklasse.

Nicht als Mitarbeiter-/Reviewer-Bestrafungsmetrik verwenden; Ziel ist Systemqualität.

## 20. Gate

Contentbetrieb gilt als releasefähig, wenn:

- stabile Content-IDs existieren;
- R0–R4 technisch abbildbar ist;
- P0-Kerncontent R4 erreicht;
- Korrekturmeldung existiert;
- C0/C1-Eskalationsweg steht;
- Quran/Hadith/Dua/Dhikr-Sonderregeln dokumentiert sind;
- Contentversionen und Rollback möglich sind;
- KI nur freigegebenen Korpus nutzt;
- öffentliche Quellen-/Transparenzseite vorbereitet ist;
- fachliche und technische Verantwortlichkeiten getrennt sind.
