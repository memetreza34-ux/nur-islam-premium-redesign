# 03 – Religiöse Inhalte, Quellen und Review

## Ziel

Nur Islam Premium benötigt für religiöse Inhalte einen **strengeren Content-Prozess als eine normale Lifestyle-App**. Nutzer müssen erkennen können, was Qurantext, Übersetzung, Hadith, redaktionelle Zusammenfassung, Fiqh-Hinweis oder KI-generierte Erklärung ist.

## 1. Content-Klassen

Jeder Inhalt wird einer Klasse zugeordnet:

1. **Quran – arabischer Originaltext**
2. **Quran – Übersetzung/Bedeutung**
3. **Hadith – Original/Übersetzung**
4. **Dua/Dhikr – überlieferter Text**
5. **Fiqh-/Praxisanleitung**
6. **Aqidah/Tafsir/Seerah/Akhlaq-Lerninhalt**
7. **redaktionelle Zusammenfassung**
8. **Kalender-/Berechnungsinformation**
9. **KI-Ausgabe**
10. **Nutzerinhalt**, falls später eingeführt

Diese Klassen dürfen im Datenmodell und UI nicht vermischt werden.

## 2. Quellenregister

Für jede Quelle dokumentieren:

| Feld | Bedeutung |
|---|---|
| `source_id` | stabile interne ID |
| Titel | Werk/API/Edition |
| Typ | Quran/Hadith/Dua/Fiqh/etc. |
| Urheber/Editor | soweit relevant |
| Edition/Version | konkrete verwendete Ausgabe |
| Sprache | Arabisch/Deutsch/etc. |
| Lizenz/Nutzungsrecht | dokumentiert, Link/Nachweis |
| technische Quelle | lokale Datei/API/Backend |
| fachlicher Status | ungeprüft/in Review/freigegeben/gesperrt |
| letztes Review | Datum |
| nächstes Review | Datum/Trigger |
| Hinweise | Varianten/Limitierungen |

## 3. Freigabestufen

### R0 – importiert

Daten sind technisch vorhanden, aber nicht für öffentliche religiöse Behauptungen freigegeben.

### R1 – strukturell geprüft

- IDs;
- Referenzen;
- Vollständigkeit;
- Format;
- arabische Zeichen;
- Zuordnung.

### R2 – Quellenprüfung

- Quelle existiert;
- Referenz stimmt;
- verwendete Edition ist dokumentiert;
- Übersetzungs-/Nutzungsstatus geklärt.

### R3 – fachlicher Review

Inhalt wurde nach definiertem Fachprozess geprüft.

### R4 – releasefreigegeben

Zusätzlich UI-Kontext, Variantenhinweise und Produktdarstellung geprüft.

Nur R4 darf als endgültiger Kerninhalt des öffentlichen Releases gelten.

## 4. Quran-Prozess

Für jede Sure:

```text
Metadaten
→ arabischer Text
→ Ayah-Anzahl/Nummern prüfen
→ deutsche Edition/Bedeutung zuordnen
→ Lizenz/Nutzung dokumentieren
→ Textdiff gegen Referenz
→ fachlicher Stichproben-/Vollreview nach Prozess
→ UI-Reader prüfen
→ R4
```

Automatische Prüfungen:

- 114 Suren;
- korrekte Ayah-Anzahlen;
- keine leeren Texte;
- fortlaufende Ayah-Nummern;
- keine versehentliche Vermischung von Editionen;
- UTF-8/arabische Zeichen stabil;
- Offline-/Online-Version identisch oder Abweichung dokumentiert.

## 5. Hadith-Prozess

Kein Hadith nur als frei formulierter Satz ohne Referenz.

Pflicht:

- Werk/Sammlung;
- Referenz/Nummer;
- verwendete Übersetzung;
- Quellenlink oder bibliografischer Nachweis;
- Authentizitäts-/Bewertungsinformation nur, wenn sauber belegbar;
- Kontext bei stark verkürzten Fassungen;
- Kennzeichnung „sinngemäß“, wenn kein exakter freigegebener Übersetzungstext verwendet wird.

## 6. Dua- und Dhikr-Prozess

Bei Zahlen und Wiederholungen besonders strikt:

- Zahl nur anzeigen, wenn Quelle sie stützt;
- Varianten nicht als Fehler behandeln;
- Quelle direkt im Detail sichtbar;
- eigener freier Zähler klar von überlieferten Routinen trennen.

## 7. Fiqh und Rechtsschulen

Die App soll bei legitimen Unterschieden nicht fälschlich Einheitlichkeit behaupten.

Beispiele:

- Asr-Berechnung;
- Details von Wudu;
- Gebetsausführung;
- Fastenfragen;
- Zakat;
- Reise-/Krankheitsregeln.

Darstellungsmuster:

> „In dieser Lernansicht wird eine verbreitete Grunddarstellung gezeigt. Bei Detailfragen können Rechtsschulen und Gelehrte unterschiedlich urteilen.“

Komplexe persönliche Fragen werden nicht automatisch beantwortet.

## 8. Redaktionsregeln

Nicht erlaubt:

- erfundene Zitate;
- erfundene Quellen;
- KI-generierte arabische Offenbarungstexte;
- eine Zusammenfassung als Quran/Hadith ausgeben;
- „Allah sagt …“ ohne saubere Referenz;
- „Der Islam sagt eindeutig …“ bei echter Meinungsvielfalt;
- medizinische, psychologische oder finanzielle Empfehlungen religiös autorisieren, wenn das nicht fachlich geprüft wurde.

## 9. Korrekturprozess

Bei gemeldetem Inhaltsfehler:

```text
Meldung
→ Inhalt vorläufig markieren/ggf. ausblenden
→ Quelle prüfen
→ fachlichen Reviewer einbeziehen
→ Korrektur mit Diff
→ automatisierte Datenchecks
→ Release
→ Korrektur im Changelog
```

Kritische religiöse Fehler erhalten höhere Priorität als kosmetische UI-Fehler.

## 10. Reviewrollen

Mindestens unterscheiden:

- technischer Datenreview;
- redaktioneller Sprachreview;
- fachlicher religiöser Review;
- Lizenz-/Rechtereview;
- Produkt-/UI-Review.

Eine Person kann mehrere Rollen übernehmen, aber die Rollen müssen gedanklich getrennt dokumentiert werden.

## 11. KI und religiöse Inhalte

KI darf:

- Inhalte suchen;
- Quellen zusammenstellen;
- freigegebene Inhalte verständlich strukturieren;
- Hinweise auf relevante Stellen geben;
- Unterschiede zusammenfassen, wenn Quellen sie tragen.

KI darf nicht autonom:

- Fatwas erfinden;
- Quellen erfinden;
- ungeprüfte persönliche Rechtsurteile geben;
- strittige Fragen als eindeutig darstellen;
- fehlende Daten mit scheinbar religiös autoritativen Aussagen füllen.

Details stehen in [06-KI-ASSISTENT-SICHERHEIT.md](./06-KI-ASSISTENT-SICHERHEIT.md).

## 12. Release-Gate Content

Kein öffentlicher v1-Release, solange:

- Quran-/Hadith-/Dua-Kerninhalte keinen dokumentierten Reviewstatus haben;
- Übersetzungs-/Nutzungsrechte unklar sind;
- kritische Fiqh-Lerninhalte unreviewt als verbindlich erscheinen;
- KI ungeprüfte religiöse Antworten ausgeben kann;
- Demo-/sinngemäße Texte nicht klar gekennzeichnet sind.
