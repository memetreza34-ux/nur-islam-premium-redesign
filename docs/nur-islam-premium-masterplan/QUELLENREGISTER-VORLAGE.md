# Religiöses Quellenregister – Vorlage für Nur Islam Premium

**Zweck:** Jede religiöse Aussage und jeder größere Datensatz erhält eine nachvollziehbare Quelle, Edition, Nutzungs-/Lizenzinformation und einen Reviewstatus.

## Status

- `R0` importiert/unreviewt
- `R1` strukturell geprüft
- `R2` Quelle/Edition/Nutzung geprüft
- `R3` fachlich geprüft
- `R4` releasefreigegeben
- `BLOCKED` nicht veröffentlichen

## Quellen

| Source ID | Bereich | Werk/API/Edition | Sprache | Lizenz/Nutzung | Referenz/URL | Reviewstatus | Reviewer/Prozess | Letztes Review | Notizen |
|---|---|---|---|---|---|---|---|---|---|
| QURAN-AR-001 | Quran Arabisch | `quran-uthmani` / konkrete Edition dokumentieren | ar | offen zu verifizieren |  | R1 |  |  | aktuelle Online-Edition im Code |
| QURAN-DE-001 | Quran Deutsch | `de.bubenheim` / konkrete Nutzung prüfen | de | offen zu verifizieren |  | R1 |  |  | aktuelle Online-Edition im Code |
| DHIKR-001 | Dhikr | Sahih Muslim 597a | ar/de | prüfen |  | R1 |  |  | nach Gebet |
| DHIKR-002 | Dhikr | Sahih Muslim 2726a | ar/de | prüfen |  | R1 |  |  | Morgenroutine |
| DHIKR-003 | Dhikr | Sahih al-Bukhari 6318 | ar/de | prüfen |  | R1 |  |  | vor dem Schlafen |

Die Startzeilen sind **keine finale fachliche oder rechtliche Freigabe**. Sie spiegeln nur bereits im Projekt dokumentierte Referenzen wider und müssen bis R4 vervollständigt werden.

## Content-Item-Register

| Content ID | Typ | Titel/Thema | Source ID | Original/Übersetzung/Zusammenfassung | Varianten/Fiqh | Status | Letzter Diff/Version | Freigegeben für UI? |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | R0 |  | nein |

## Quran – Pflichtmatrix je Sure/Edition

| Sure | Arabisch Quelle | Deutsch Quelle | Ayah-Anzahl geprüft | Textdiff geprüft | Rechte/Nutzung | Fachreview | Offline/Online | Release |
|---:|---|---|---:|---:|---:|---:|---|---:|
| 1 |  |  | [ ] | [ ] | [ ] | [ ] | offline | [ ] |
| 2 |  |  | [ ] | [ ] | [ ] | [ ] | online/geplant | [ ] |
| … |  |  |  |  |  |  |  |  |
| 114 |  |  | [ ] | [ ] | [ ] | [ ] | offline | [ ] |

## Hadith – Pflichtfelder

Für jeden Eintrag:

```text
content_id
collection
book_or_chapter
hadith_reference
arabic_original_source
used_translation
translation_rights
classification_if_reliably_supported
context_note
review_status
reviewer
last_reviewed
```

## Dua/Dhikr – Pflichtfelder

```text
content_id
arabic_text
transliteration_optional
german_meaning
source_reference
claimed_count_or_time
variants
review_status
```

**Regel:** Wiederholungszahl oder besonderer Zeitpunkt nur anzeigen, wenn die Quelle genau diese Aussage trägt.

## Fiqh-/Lerninhalte

| Content ID | Thema | Grunddarstellung | Rechtsschul-/Variantenhinweis | Quellen | Fachreview | Status |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  | R0 |

## Änderungsprotokoll

| Datum | Content/Quelle | Änderung | Grund | Reviewer | vorheriger Status | neuer Status | Releaseversion |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## Fehler-/Korrekturregister

| Ticket | Schwere | Inhalt | gemeldeter Fehler | Quelle geprüft | Maßnahme | Status | Release |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

Priorität:

- **P0:** falscher Quran-/Hadithtext, erfundene Quelle, gefährliche religiöse Aussage;
- **P1:** falsche Übersetzung/Referenz, problematische Fiqh-Eindeutigkeit;
- **P2:** Schreibweise, UI-Kontext, redaktionelle Klarheit.

## Release-Gate

Kerncontent darf nur veröffentlicht werden, wenn:

- Source ID vorhanden;
- Edition/Referenz nachvollziehbar;
- Nutzungs-/Lizenzstatus geklärt;
- notwendiger Fachreview erfolgt;
- UI die Art des Textes korrekt kennzeichnet;
- `R4` dokumentiert ist.
