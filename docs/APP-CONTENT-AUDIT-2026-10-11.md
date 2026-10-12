# Appweite Inhaltsprüfung · 11. Oktober 2026

## Status und Maßstab

**In Bearbeitung, keine Gesamtfreigabe.** Eine KI kann Aussagen und Quellen vergleichen, aber keine menschliche Fachfreigabe, eigene Fatwa oder physische Geräteprüfung ersetzen. „Quelle zugeordnet“ bedeutet nicht „Aussage abgeglichen“. Ältere Berichte geben Prüfhinweise, beweisen aber keine unveränderten heutigen Inhalte.

Dieser Bericht verbindet Bestandsaufnahme und Einzelbefunde. Code- und Strukturtests erklären ungeprüfte religiöse Inhalte nicht für richtig.

## Bestandsaufnahme

Die generierte [Prüfmappe](INHALTE-PRUEFUNG.md) erfasst **1.146 Positionen**, davon **91 ohne Einzelfundstelle im erfassten Bestand** und **862 hier verfasste Positionen**. Das sind weder 1.146 unabhängige Aussagen noch 91 erwiesene Fehler. Gemeinsame Lektionenbelege bestätigen nicht automatisch jeden Satz. Der Gebetskurs erfasst jetzt auch geerbte Varianten und vorhandene Quellenfelder; bloße Sammlungsnamen sind keine präzisen Inhaltsbelege.

Die vorige Mappe mit 478 Positionen war unvollständig: Wissensabschnitte, Glossar, Personen, vollständige Namenliste, Dhikr-Einzelschritte und große Teile der Lernlektionen fehlten. Die Erweiterung extrahiert statische Arrays mit dem TypeScript-Parser; unbekannte Ausdrücke führen zum Fehler statt zur stillen Auslassung. Weitere UI- und Dialogtexte fehlen noch.

| Datenbereich | Positionen | Aktueller Prüfstand |
|---|---:|---|
| Hadith-Sammlung | 20 | Alle Kurzfassungen, Einordnungen und vorhandenen Bewertungen im [aktuellen Einzelbericht](HADITH-SOURCE-AUDIT-2026-10-11.md) abgeglichen. Nummernvarianten und abweichende Bewertungsbezüge sichtbar; keine eigene Isnad-Prüfung. |
| Duas | 34 | Alle Einträge im [aktuellen Einzelbericht](DUA-SOURCE-AUDIT-2026-10-11.md) abgeglichen; Auszüge, Varianten und Bewertungen gekennzeichnet. Keine unabhängige vollständige Druckausgaben-/Vokalisationszertifizierung. |
| Sunnah und Reue | 17 | Quellenzugeordnet; erneuter Abgleich einschließlich UI-Ergänzungen offen. |
| Grundlagen-Ergänzungen | 13 | Metadaten erfasst; eingebettete Bildschirmtexte noch nicht vollständig extrahiert. |
| Hajj, Umrah, heilige Stätten | 18 | Quellenzugeordnet bzw. konkret fehlend; Ablauf-/Schulvergleich offen. |
| Islam-Quiz | 60 | Frage, Antwort und Erklärung im [Einzelbericht](AI-SOURCE-AUDIT-2026-10-11.md) abgeglichen; keine Fachfreigabe. |
| Wissensbibliothek | 58 | Elf Einleitungen, 41 Abschnitte, sechs Glossarbegriffe im [Quellenbericht](KNOWLEDGE-SOURCE-AUDIT-2026-10-11.md) abgeglichen und korrigiert. |
| Gefährten / Frauen | 25 | Alle 15 [Gefährten-Kurztexte](COMPANION-SOURCE-AUDIT-2026-10-11.md) und zehn [Frauen-Kurztexte](WOMEN-SOURCE-AUDIT-2026-10-11.md) abgeglichen. Nicht mit vollständiger Biografie- oder historischer Primärquellenprüfung gleichzusetzen. |
| 99 Namen | 99 | Alle erhalten und im [aktuellen Einzelbericht](NAMES-SOURCE-AUDIT-2026-10-11.md) untersucht. 75 direkte Belegzuordnungen, 24 Formen ohne direkten Einzelbeleg; keine pauschale Bestätigung der Auswahl oder aller Nuancen. 20 verwandte Kontexte und ein Ausschlusskontext (98: 11:87 spricht Shuayb an) ausdrücklich getrennt; 64/65/77 ohne zugeordneten verwandten Beleg. Auslegungs-/Ableitungsgrenzen im Dialog. |
| Dhikr | 25 | Alle sieben Routinen und 18 Formeln im [Einzelbericht](DHIKR-SOURCE-AUDIT-2026-10-11.md) abgeglichen; vollständige Lesehilfen, Bedeutungen, persönliche Ziele und Beleggrenzen. Zähler-/Speicherwahrheit separat getestet; keine bestätigte Aussprache. |
| Lernkurse | 465 | Sieben Glaubenslektionen (77 Positionen) im [Glaubensbericht](FAITH-LEARNING-SOURCE-AUDIT-2026-10-12.md), sechs Säulenlektionen (74) im [Säulenbericht](PILLARS-LEARNING-SOURCE-AUDIT-2026-10-12.md), vier Begriffslektionen zu Niyyah/Dua/Dhikr/Tawba (44) im [Einzelbericht](DEVOTION-LEARNING-SOURCE-AUDIT-2026-10-12.md), acht übrige Begriffslektionen (88) im [Begriffsbericht](TERMINOLOGY-LEARNING-SOURCE-AUDIT-2026-10-12.md), fünf Praxislektionen (46) im [Praxisbericht](PRACTICE-LEARNING-SOURCE-AUDIT-2026-10-12.md), vier Charakterlektionen (35) im [Charakterbericht](CHARACTER-LEARNING-SOURCE-AUDIT-2026-10-12.md) und sechs Gemeinschaftslektionen (66) im [Gemeinschaftsbericht](COMMUNITY-LEARNING-SOURCE-AUDIT-2026-10-12.md) abgeglichen: 40/44 Lektionen, 430 Positionen nach Inventarmaßstab. Vier Seerah-Lektionen (35 Positionen) offen. Keine vollständige theologische oder menschliche Fachfreigabe. |
| Tages-Ayah im Einstieg | 5 | Arabisch und kurze sinngemäße Bedeutung im [Einzelbericht](DAILY-AYAH-SOURCE-AUDIT-2026-10-11.md) abgeglichen; Rotation und lokale Textgleichheit getestet. |
| Prophetenkurse | 147 | Katalog, Übersichten und Kapitel erfasst; Erzählungen, Schlüsse und Quellenreichweite offen. |
| Ummah | 17 | Unbelegte Statistik und Rangbehauptungen entfernt; geografische Auswahl, keine Demografie. |
| Rakʿah-Daten | 17 | Wortlautbezüge und Quellenreichweite aller 17 Varianten im [Teilbericht](PRAYER-LEARNING-SOURCE-AUDIT-2026-10-11.md) untersucht; vier Quran-Schritte gegen tatsächlich gelesene Verse und normalisierte lokale Buchstabenfolge abgeglichen. Amin vom Quran getrennt, Samad-Bedeutung präzisiert, Ta’awwudh und Rezitation hinter dem Imam nicht universell vorgeschrieben. Zusammensetzung, Bewegungsdetails und vollständige Schulregeln bleiben offen. |
| Wudu / Salah | 102 | Schritte erfasst; Wortlaut, Reihenfolge, Bedingungen und Schulvergleich offen. Gemeinsame Speichermechanik elf Praxisleitfäden und Wudu-Zähler im Lernhub separat im [Funktionsbericht](WORSHIP-GUIDE-STORAGE-AUDIT-2026-10-12.md) korrigiert und getestet; keine religiöse Inhaltsfreigabe daraus. |
| Praxisunterschiede | 8 | Schulhinweise vorhanden; konkrete Positionen und Reichweite noch abzugleichen. |
| Rechtsschulkatalog | 4 | Quellenliste erfasst; historische und methodische Details separat offen. |
| Kalenderanlässe | 12 | Qadr-/Anlasskorrekturen belegt; übrige Empfehlungen und Kalendergrenzen offen. |

Der Quran-Bestand gehört nicht zum obigen Zähler: 114 Suren mit 6.236 arabischen
Versen sowie die separat geladenen deutschen/Umschrift-Texte. Dienstvalidierung,
Quellenstatus und Fehleranzeigen im [aktuellen Teilbericht](QURAN-SERVICE-AUDIT-2026-10-11.md)
geprüft. Alle 6.236 arabischen Rohtextfelder und 1.368 Metadatenwerte stimmen
exakt mit der tatsächlich abgerufenen Anbieter-Ausgabe `quran-uthmani` überein;
[Nachweis und korrigierter unnummerierter Surenbeginn](QURAN-TEXT-AUDIT-2026-10-11.md).
Unabhängige Editionsprüfung, Herkunft/Rechte und vollständiger deutscher/
Umschrift-Abgleich bleiben offen.

Speicherangaben des Readers im [separaten aktuellen Teilbericht](QURAN-READER-STORAGE-AUDIT-2026-10-11.md):
falsche Erfolgsanzeigen, Überschreiben beschädigter Lesezeichen und falsche
Seite-1-Markierung korrigiert. 28 gezielte Regressionen; aktueller Gesamtcheck
Exit 0 mit 823 Tests/52 Dateien, Typprüfung, Build und Budgets. Erster
Produktions-Browserlauf mit 20 Tests bestanden. Wiederholung nach präzisierten
Fehlermeldungen: zehn Speicherfälle bestanden, fünf bisherige Fälle bestanden
und fünf Zeitüberschreitungen. Unveränderte Wiederholung und erneuter Lauf nach
Katalogtext-Korrektur jeweils Exit 0 mit 20 bestandenen Fällen; Ursache des
Zeitüberschreitungs-Zwischenlaufs bleibt unbewiesen. Keine
Gesamtfreigabe der App.

## Oberflächen und dynamische Inhalte

Ausgangspunkt: Routing in `src/app/App.tsx`, Legacy-Metadaten und Bildschirmdateien. Die Matrix ist eine Arbeitsliste, kein vollständiges Satzinventar.

| Oberfläche / Inhalt | Konkreter weiterer Prüfauftrag |
|---|---|
| Einstieg, Onboarding, Start | Tages-Ayah, nächstes Gebet, Standort, Begrüßung, Ladezustand, Marketingaussagen. |
| Zwölf Widgets und Vorschauen | Beschreibungen, Fortschrittszahlen, Abohinweise, Vorschau-/Live-Unterscheidung, Verknüpfungen. |
| Quran-Verzeichnis, Reader, Ayah-Detail | Offline-Arabisch gegen Referenz, Basmala, Verszahlen, Übersetzungsherkunft, Umschrift, Abruffehler, Cache und Teilen. |
| Hadith-Detail, Sammlung, Tagesrotation | Paraphrase versus Original, Nummern, Bewertung mit Urheber, Speichern und Teilen. |
| Duas, Dhikr, Namen, Sammlungen | Listen, Lesedialoge, Arabisch, Bedeutung, Umschrift, Anzahl, Quellen, Teiltexte. |
| Lernen, Kategorien, Kurse, Gebetskurs | Jede Lektion, Haltung, Rezitation, Frage, Erklärung und fachliche Einordnung. |
| Propheten, Grundlagen, Hajj, Sunnah, Reue, Rechtsschulen | Auch eingebettete Bildschirmtexte, Beispiele, Kapitel- und Quellenhinweise. |
| Wissensbibliothek, Gefährten, Frauen | Vorhandene ältere Screens ohne aktuelle Hub-Routen. Keine neuen Menüpunkte im Audit. Falsche Fallback-Zuordnung korrigiert; kurze Personenangaben abgeglichen. Isolierte Browserprüfung ist kein Nachweis aktueller Hub-Erreichbarkeit. |
| Gebetszeiten, Kalender, Fasten, Jumuah, Standby | Abruf/Berechnung, Standort, Zeitzone, Methode, Sommerzeit, Tageswechsel, Hijri-Abweichungen und Erinnerungsvoraussetzungen. |
| Qibla, Moscheensuche | Großkreisrichtung, Entfernung, Koordinaten, Rotation, Verfügbarkeit, Genauigkeit, Berechtigungen und Fundorte. |
| Zakat-Rechner | Nur Planung für bereits bestimmte Bemessungsgrundlage; Nisab, Besitzdauer, Vermögensart und Schulbedingungen. |
| Mehr, Konto, Cloud, Notizen, Einstellungen, Premium | Tatsächliche Konto-, Offline-, Backup-, Datenschutz-, Gebühren- und Erinnerungsfunktionen. |
| Rechtsseiten, Quellen-/Über-App-Dialoge | Technische Tatsachen und Herkunft belegen; keine simulierte rechtliche Freigabe. |
| Systemmeldungen, Fehler, Offline, Teilen | Keine falschen Erfolgs-, Live-, Sicherungs- oder Genauigkeitsmeldungen; Quellenhinweise auch außerhalb der Hauptansicht. |

## Konkrete Änderungen und Belege

1. **Wissensbibliothek:** 58 Quellenzuordnungen und Aussageabgleich. Fasten ab wirklicher Morgendämmerung bis Sonnenuntergang, präziser Begriff „Geschlechtsverkehr“, keine pauschale Wissenspflicht oder garantierten Wirkungen; historische Schulbeschreibungen statt Wertungen. Jede Fundstelle und Grenze: [Quellenbericht](KNOWLEDGE-SOURCE-AUDIT-2026-10-11.md).
2. **Frühere konkrete Korrekturen:** Demografie, Qadr, Dhikr, Praxisregeln, Quiz und Duas: [redaktioneller Befund](CONTENT-INTEGRITY-AUDIT-2026-10-11.md) und [Quiz-/Dua-Abgleich](AI-SOURCE-AUDIT-2026-10-11.md). Damalige Testergebnisse sind historische Ergebnisse, nicht automatisch Ergebnisse des heutigen Arbeitsstands.
3. **Falsche Bereichszuordnung:** `LegacyFeatureScreen` verwendete für `knowledge`, `sahabah` und `women` mangels Metadaten die Hadith-Sammlung. Die Gefährtenansicht wählte dadurch den Frauenbestand. Eigene korrekte Metadaten ohne neue Navigation; Render-Tests prüfen Titel und richtigen Bestand.
4. **Unbelegte Qualitätsbehauptung:** Rechtsschul-Kachel von „geprüften Fachlinks“ zu „Fachlinks“. Vorhandene Links belegen keine fachliche Gesamtprüfung.
5. **Prüfmappe:** Falschen Vollständigkeitsanspruch und Aussage entfernt, nur Pilgertexte seien hier verfasst. Abdeckung und Prioritätsgrenzen ausdrücklich genannt. Quellenabdeckungsbericht zählt die Wissensbelege jetzt tatsächlich statt fest verdrahteter null.
6. **Tages-Ayah:** Alle fünf Verse tatsächlich nachgelesen; Bedeutungen von 112:1, 94:5 und 1:5 präzisiert. Quellen und Grenzen im [Einzelbericht](DAILY-AYAH-SOURCE-AUDIT-2026-10-11.md). Arabisch lokal exakt verglichen statt nur Suffixprüfung; komplette Fünferrotation über den Schalttag abgesichert.
7. **Hadith und Duas:** Präzise Fundstellen und benannte Ausgabe-/Gelehrtenbewertungen; unterschiedliche Bezugsebenen nicht gleichgesetzt. Kontext, Auszüge und Quellenhinweise bleiben in Details und Teiltexten erhalten. Vorhandene Favoriten-IDs bewahrt. Fehlerhafte Speicher-/Lesefortschrittszusagen korrigiert; Einzelbefunde in den verlinkten Berichten.
8. **Personen:** Unbelegte Rang- und Erstheitsbehauptungen begrenzt oder durch belegte Rollen ersetzt. Ehrennamen nicht als ungeprüfte wörtliche Prophetenzitate ausgegeben; traditionsbezogene Unterschiede benannt. Quellen direkt am Eintrag; seitlichen Überlauf durch dekorative Pseudoelemente behoben.
9. **Dhikr:** Vollständige Umschrift längerer Formeln, fehlende Bedeutungsbestandteile und genaue Links ergänzt. Überlieferte Anzahl versus persönliche Merkhilfe getrennt; alte Schlaf-Variantenauswahl nicht fälschlich zum heutigen Maßstab erklärt. Manuelle Schrittauswahl, verifizierte Speicherung und Netto-Zählerstände statt behaupteter vollständiger Tagessumme korrigiert.
10. **Namen:** Einträge 1–99 untersucht. Glossen unter anderem zu Qayyum, Samad, Muqtadir, Ra’uf, Malik al-Mulk, Ghaniyy und Badi präzisiert. 21 verwandte/ausschließende Kontexte nicht als Direktbelege gezählt. Artikel, Genitivverbindungen, Plural-/Vergleichs-/Verbformen und Shuayb-Anrede in 11:87 erklärt. Erläuterungen mit genauen Quellen, ohne erfundene theologische Gesamtfreigabe. [Alle Fundstellen und Grenzen](NAMES-SOURCE-AUDIT-2026-10-11.md).
11. **Namensmarkierungen:** Automatisches Überschreiben beim Öffnen entfernt. Schreibfehler lassen gelesene Favoriten/Lernstände nicht mehr verschwinden. Unlesbare Bestände bleiben geschützt, mehrdeutige Altdaten erhalten; unbekannter Lernstand nicht als bestätigte Null dargestellt. Nur ausdrückliche Änderungen speichern mit Rohbestandvergleich und Rücklesekontrolle. Keine atomare Mehr-Tab-Garantie behauptet.
12. **Gebetskurs:** Ältere grüne Berichtsaussagen nicht mit aktuellem Code gleichgesetzt. Konkrete Wortlautreferenzen ergänzt, Sana-Ausgabeurteil und Überliefererkritik getrennt. Ruku-/Sujud-Dreierfolge nicht als universelle Pflicht-/Mindestzahl; Zufluchtsgebet nicht pauschal optional. Quran-Schritte, Amin-Grenze und Samad-Bedeutung abgeglichen; widersprüchliche pauschale Rezitationsregeln und Gültigkeitsgarantie im Schul-Disclaimer entfernt. Schulabhängigkeit bleibt ausdrücklich sichtbar. Inventar mit TypeScript statt titelabhängiger Regex: alle 17 Varianten einschließlich geerbter Felder, Texte und Quellen. [Belege und offene Grenzen](PRAYER-LEARNING-SOURCE-AUDIT-2026-10-11.md).
13. **Quran-Herkunft und Rechte:** Pauschale Zusagen „keine offene Lizenzfrage“ und garantierte deutsche Offline-Verfügbarkeit nach einmaligem Öffnen im Herkunftsdokument korrigiert. Tatsächlich gelesene Anbieterbedingungen und Tanzil-Lizenz sowie Cache-Fehlerpfad voneinander getrennt. Konkrete lokale Herkunft und Editionsrechte bleiben offen; vollständige Rohtextidentität mit der heutigen Anbieterantwort ist separat belegt. Auch entsprechende ältere Repository-Aussagen werden nicht ungeprüft als Freigabe übernommen. [Quellen und Grenzen](QURAN-PROVENANCE.md). Kein Textbestand verändert und keine eigene rechtliche Freigabe.
14. **Quran-Dienst und Reader:** Falsche lokale Surennummern, fehlende/leere/verschobene Verse und Indexfehler werden jetzt vor Anzeige und Speichercache abgewiesen. Retry kann eine korrigierte Datei neu laden. Online-Editionen zusätzlich auf deklarierte Versanzahl geprüft; fehlgeschlagene HTTP-Cacheantworten nicht als gültige gespeicherte Texte akzeptiert. Lade-/Offline-Hinweise behaupten weder arabischen Online-Fallback noch dauerhafte Speicherung. IP-Verarbeitung von nicht übertragenen Konto-/Standortdaten getrennt; lokale Herkunft nicht als bestätigt ausgegeben. [Konkrete Tests und Grenzen](QURAN-SERVICE-AUDIT-2026-10-11.md).
15. **Glaubenskurs:** Alle sieben bestehenden Lektionen mit Zusammenfassungen, Absätzen, Details, Merksätzen und Kontrollfragen anhand konkret gelesener Quran-/Muslim-Stellen abgeglichen. Die Kursankündigung versprach eine nicht vorhandene Tawhid-Lektion; korrigiert, ohne neue Lektion hinzuzufügen. Aufgaben der Engel, genannte Bücher, Auferweckung, unbekannter Zeitpunkt und verantwortliches Handeln bei Qadar mit eigenen Fundstellen. Quellenlinks erscheinen im bestehenden Quellenbereich und Teiltext. Bewahrungszusage nicht als App-Dateizertifikat, frühere Einzelregeln nicht pauschal als heute verbindlich, theologische Gliederung nicht als vollständiger Traditionsvergleich ausgegeben. [Belege und Grenzen](FAITH-LEARNING-SOURCE-AUDIT-2026-10-12.md).

## Technische Absicherung

- Charakter-Lernkurs 12.10.2026: vier Lektionen, 35 Positionen und 23
  Quellenfelder gegen 15 tatsächlich gelesene Fundstellen abgeglichen.
  Pauschale Verdachtswarnung präzisiert, Spendenkontext und späteres Lob
  voneinander getrennt; Alltagstipps als redaktionell markiert und notwendige
  Schutzmeldungen nicht verboten. Kursaufbau und Zwischenüberschriften mit
  tatsächlich vorhandenem Inhalt abgestimmt, Lesedauer als Schätzung.
  [Einzelabgleich und Grenzen](CHARACTER-LEARNING-SOURCE-AUDIT-2026-10-12.md).
  **14 neue Datentests**, vollständiger Check **1008 Tests/57 Dateien**, zehn
  zusätzliche Node-Auditorregressionen, Typprüfung/Build/Budgets, Exit 0.
  **Sechs Browserfälle bestanden, 33,3 Sekunden**, alle vier Lektionen bei
  320/768/1280 px einschließlich Quellen, Quiz und kopiertem Quellenüberblick.
  Recherche nicht durch Linkattributtests ersetzt; externe API/Clipboard
  simuliert, kein Echtgeräte-/Sensor-/Offline-Vollnachweis. Lesebilder und
  Quellenansichten tatsächlich betrachtet, kein horizontaler Überlauf im Test.
  Mehrbedarf gemessen: JS **383**, CSS **123**, gesamt **506 KB gzip**, Entry
  **92/95**, größter Chunk **320/500 KB raw**. JS +1/Gesamt +2, CSS/Entry/Raw
  unverändert, keine Abhängigkeit. Shell/Registrierung **v77**. Generierte
  Prüfmappe aktualisiert. Aktuell **34/44 Lernlektionen, 364/465 Positionen**;
  **zehn/101 zu Gemeinschaft und Seerah offen**. Gesamtprüfung bleibt aktiv.
- Praxisleitfäden-Speicherung 12.10.2026: neun zuvor fehlschlagende
  Reproduktionen (vier Guide-, fünf Hubfehler), korrigiert. Kein Schreiben beim
  Öffnen, unlesbare Werte erhalten, Rücklesebestätigung vor Erfolg,
  expliziter Wudu-Abschluss statt Cursor; unbekannte Gebets-IDs nicht gezählt,
  beschädigte Struktur sichtbar statt erfundenem Nullfortschritt.
  Übersprungene Schritte nicht als erledigt markiert. **67 neue Regressionen**
  (44 Service-/23 Komponentenfälle), alle bestanden; Gesamtcheck nach
  Bildkorrektur Exit 0, **994 Tests/56 Dateien**, Typprüfung/Build/Budgets.
  [Konkrete Belege und Grenzen](WORSHIP-GUIDE-STORAGE-AUDIT-2026-10-12.md).
  Gemeinsamer Toast verlor die CSS-Zentrierung durch Motion-Transformation;
  Browserreproduktion maß auf 320 px die rechte Kante bei 450 px. X-Position
  in allen Animationszuständen korrigiert, keine zusätzliche CSS-Schicht.
  Erster Browserlauf 31 Fälle bestanden, zeigte das Abschneiden trotzdem;
  nach reproduziertem Geometriefehler abschließende **31 Browserfälle
  bestanden (1,6 Minuten), Exit 0**, jetzt mit Erfolg-/Fehlertoast-Breite.
  Bilder Erfolg 320, Schreibfehler 768, stiller Verlust 1280 tatsächlich
  angesehen: Meldungen innerhalb des Viewports, Warnhinweis lesbar.
  Keine pauschale UI-/Gerätefreigabe aus diesen Scrollansichten.
  JS 382/CSS 123/Gesamt 504 KB gzip, Entry 92/95, größter Chunk 320/500 raw;
  JS-/Gesamtbudget um gemessenen Bedarf +1, übrige Grenzen unverändert.
  Shell v76. Religiöse Lernabdeckung unverändert **30/44, 329/465**, **14/136 offen**.
- Praxislektionen 12.10.2026: alle fünf Lektionen/46 Inventarpositionen mit
  21 Quellenfeldern abgeglichen, davon zwei ausdrücklich interne Bedienhinweise.
  Falsches Beispiele-Versprechen entfernt, Ghusl/Dusche bedingt erklärt,
  Tayammum-Materialien schulbezogen, Wudu-Erneuerung und Grenzen des bestehenden
  Schulhinweises präzisiert; Asr-Auswahl von religiösen Regeln getrennt.
  [Aussagen, Belege und Grenzen](PRACTICE-LEARNING-SOURCE-AUDIT-2026-10-12.md).
  13 neue Datenregressionen, fokussiert 115 Tests; Gesamtcheck Exit 0:
  **927 Tests/54 Dateien**, zehn Node-Prüferregressionen, Typprüfung/Build/Budgets.
  **12 Browserfälle bestanden (44,2 Sekunden), Exit 0**, fünf Lektionen und
  interne Wudu-/Gebetszeiten-Verweise bei 320/768/1280 px. Erstlauf scheiterte
  an falschen Testnamen, diese anhand tatsächlicher Bediennamen korrigiert,
  keine inhaltlichen Assertions entfernt. Bilder Ghusl/Tayammum 320,
  Gebetszeiten 768, Nachfragen 1280 tatsächlich betrachtet; Quellen lesbar.
  Bestehender geringer Kontrast der goldenen Weiter-Schaltfläche auf 320 px
  als weiterer UI-Befund, keine pauschale Layoutfreigabe.
  JS 381/CSS 123/Gesamt 503 KB gzip; Entry 92/95 KB. Vorige Grenzen 379/502
  nach Messung nur für zusätzliche Belegtexte angepasst; übrige Grenzen erhalten.
  Shell v74. **30/44 Lektionen, 329 Positionen; 14/136 offen.**
  Damals neu nachgewiesener Wudu-Speicherfehler: Erfolg trotz Schreibfehler,
  Mount-Schreibvorgang und unbestätigte Einführungszeile. Im späteren separaten
  Funktionsbericht oben korrigiert; die Quellenprüfung selbst behob ihn nicht.
  Nicht mit Grundlagenkurs-Speicherung verwechselt. Zahlen unten sind Zwischenstände.
- Übrige acht Begriffslektionen 12.10.2026: alle Zusammenfassungen, Absätze,
  Details, Merksätze und Quizfelder mit 33 Quellenzuordnungen abgeglichen.
  Ihsan sinngemäß vollständig, Notlagen-Ausnahme begrenzt, Fiqh-Madhhab vom
  weiteren theologischen Begriff unterschieden und Kontext 16:43 sichtbar.
  [Aktueller Einzelbericht](TERMINOLOGY-LEARNING-SOURCE-AUDIT-2026-10-12.md).
  14 neue Datenregressionen, fokussiert 50 Tests bestanden. Gesamtcheck Exit 0,
  **914 Tests/54 Dateien**, zehn Node-Prüferregressionen, Typprüfung/Build/Budgets.
  Quellen-/Kontexttexte +1 KB gemessen: JS 379/CSS 123/Gesamt 502 KB gzip,
  Entry 92/95, keine neue CSS-Regel/Abhängigkeit. Erst alte JS-/Gesamtgrenzen
  überschritten, begründet an Messung angepasst; übrige Grenzen unverändert.
  **15 Browsertests bestanden (2,8 Minuten), Exit 0**: alle zwölf
  Begriffslektionen bei 320/768/1280 px mit Texten/Quiz/Quellen/Teiltext.
  Bilder Haram 320, Islam/Iman/Ihsan 320, Halal 768, Hadith/Fiqh/Madhhab 1280
  tatsächlich betrachtet; Quellen lesbar, kein horizontaler Überlauf. Logs,
  Standhashes und Grenzen im Einzelbericht; Shell v73.
  Damaliger Stand 25/44 Lektionen, 283 Positionen; 19/182 offen. Aktueller Stand
  nach Praxisabgleich siehe oben; folgende Zahlen sind historische Zwischenstände.
- Niyyah/Dua/Dhikr/Tawba 12.10.2026: vier komplette bestehende Lektionen/
  44 Inventarpositionen, 20 konkrete Quellenzuordnungen und Beleggrenzen im
  [Einzelbericht](DEVOTION-LEARNING-SOURCE-AUDIT-2026-10-12.md). Freie Dua nicht
  pauschal auf die Salah übertragen; Teilbitte/Bedeutungen als sinngemäß,
  Herzensruhe nicht als Heilungszusage, Rechte anderer und wirkliche Umkehr
  berücksichtigt. **894 Tests in 54 Dateien**, Gesamtcheck Exit 0, neun neue
  Datenregressionen. Namens-99er-Test nach reproduziertem Gesamtcheck-Timeout
  in drei Gruppen mit allen bisherigen Aussagen geteilt (Einzelfall vorher
  2,93 Sekunden bestanden); keine Namen/Assertions entfernt. JS 378 + CSS 123
  = 501 KB gzip, Entry 92/95, Shell v71. Gegenüber Teilbericht JS +1/Gesamt +2
  KB für präzise Beleg-/Grenztexte, keine CSS-Schicht/Abhängigkeit. Vorige Zahlen
  13/44 und 31 offene Lektionen beschreiben den damaligen Stand; aktuell 17/44,
  195 Positionen abgeglichen und 27/270 offen. Erster Browserlauf: sechs Fälle
  bei 320/768/1280 px bestanden; Bildkontrolle zeigte trotzdem verengte Quellen-
  einordnung auf schmalen Handys. Bestehende Quellenregel einspaltig korrigiert,
  Breitenregression ergänzt, kein erhöhtes Stylesheetbudget; Shell v72.
  Abschließender Gesamtcheck nach Layoutfix: **900 Tests/54 Dateien**, Exit 0,
  Typprüfung/Build/Budgets bestanden. Namensprüfung nun neun Gruppen zu je elf
  Namen, weiterhin sämtliche 99 mit denselben Assertions, kein erhöhtes Zeitlimit.
  Sechs zusätzliche Fälle gegenüber dem 894er-Lauf sind nur Testgruppierung.
  Browser-Nachlauf: **sechs Fälle bestanden**, Exit 0 (1,2 Minuten), alle
  20 Quellen/Notizen und Texte/Fragen/Teilreferenzen bei drei Breiten erhalten.
  Viewportbilder Niyyah 320/Dua 768/Tawba 1280 betrachtet: Quellen erklären
  sich jetzt unter der Kennzeichnung auf voller Textbreite, kein alter Toast.
  Einzelheiten, Logs und Grenzen im oben verlinkten Bericht; keine Gesamtabnahme.
- Begriffs-Teilprüfung 12.10.2026: alle zwölf Lektionen gelesen, konkret belegte
  Fehler bei Makruh und Hadith/Sunnah korrigiert, fehlende Fachbelege zu Fard/
  Wajib und Sunnah zugeordnet. Einführung beschreibt tatsächliche elf Themen
  statt erfundener Einzelwort-Lektionen. [Teilbericht und offene
  Einzelprüfungen](TERMINOLOGY-PARTIAL-SOURCE-AUDIT-2026-10-12.md).
  **883 Tests in 54 Dateien**, Gesamtcheck Exit 0; fünf neue Datenregressionen.
  JS 377, CSS 123, Gesamt 499 KB gzip, Entry 92/95. JS +1 KB, Gesamtgrenze
  unverändert; Shell v70. Keine Behauptung, alle zwölf Begriffslektionen seien
  vollständig belegt: Zählung 13/44 abgeglichen, 31 weiterhin nicht abgeschlossen.
  Drei Produktions-Browserfälle zur korrigierten Makruh-Lektion bestanden,
  16,5 Sekunden, 320/768/1280 px, alle vier Quellenlinks und deren Grenzen;
  drei Quellenbilder angesehen. Kein Gesamtnachweis der Begriffslektionen.
- Lernspeicherung 12.10.2026: frühere offene Fehler durch zwei fehlschlagende
  Komponentenregressionen reproduziert, anschließend korrigiert. Kein
  Umschreiben beim Öffnen, geschützte unlesbare Daten, aktueller Bestand vor
  Einzelmutation, Schreib-/Rücklesebestätigung, ehrliche Dialog-/Reset-/Cursor-
  Meldungen und zentrierter Fehler-Toast. Unbekannter Fortschritt nicht als 0 %
  dargestellt. **878 Tests in 54 Dateien**, Gesamtcheck Exit 0; gezielt 43
  Speicher-/Renderprüfungen. JS 376 + CSS 123 = 499 KB gzip, Entry 92/95;
  +1 KB JS/Gesamt, keine CSS-Schicht/Abhängigkeit. Shell v69. [Beleg, Teststand
  und Grenzen](LEARNING-STORAGE-AUDIT-2026-10-12.md). Frühere Hinweise unten,
  dass dieser Fehler noch offen war, beschreiben den damaligen Zwischenstand.
  **24 Produktions-Browserfälle bestanden (2,2 Minuten)**, davon 18 neue
  Speicherfälle und sechs Quellenregressionen; drei zusätzliche Fälle mit
  unbekannter Lernübersicht bestanden (15,7 Sekunden). Toastposition direkt
  gemessen, drei Dialog-/Toastbilder angesehen. Keine physische Geräteprüfung,
  keine unbegrenzte Speicherdauer oder atomare Mehr-Tab-Synchronisation behauptet.
- Säulenkurs 12.10.2026: sechs vorhandene Lektionen/74 Inventarpositionen anhand
  konkret gelesener Texte abgeglichen; 37 einzelne Quellenlinks mit Kontext.
  Sadaqa-Begriff, Schuldenabzug, wahre Dämmerung, Hajj-Pflicht/Stellvertretung,
  Kind-Hajj und Shahada-Zuordnung präzisiert. [Einzelbericht mit Belegen und
  Grenzen](PILLARS-LEARNING-SOURCE-AUDIT-2026-10-12.md). Gesamtcheck Exit 0,
  **845 Tests in 53 Dateien**, zehn Node-Prüferregressionen, Typprüfung/Build;
  `/private/tmp/nur-pillars-learning-check-completed-20261012.log`.
  Zwölf zusätzliche Datenregressionen. **Sechs Browserfälle bestanden**,
  42,5 Sekunden, beide Kategorien mit vollständigen Text-/Quellen-/Teiltext-
  Assertionen bei 320/768/1280 px. Drei Quellenbilder tatsächlich angesehen;
  `/private/tmp/nur-pillars-faith-e2e-completed-20261012.log`.
  Arabische Shahada mit `lang=ar` und RTL; keine Aussprachezertifizierung.
  Erstlauf scheiterte am Bundlebudget, nicht an Unit-Tests: gemessen JS 375,
  CSS 123, Gesamt 498 KB gzip. Je +2 KB belegter Quellen-/Grenztextbedarf,
  Entry 92/95 KB, Raw-Grenze 500 KB und CSS-Grenze unverändert. Shell v68,
  keine neue Abhängigkeit/CSS-Schicht. Kein erfolgreicher Lernabschluss oder
  Fehlerfall der Lernspeicherung durch diese falschen Antworttests bestätigt.
  Der rechts abgeschnittene Kurstoast ist weiter sichtbar und offen.
- Glaubenskurs 12.10.2026: zehn neue Datenregressionen, Gesamtcheck Exit 0 mit
  **833 Tests in 53 Dateien** plus zehn Node-Prüferregressionen, Typprüfung,
  Build und Budgets (`/private/tmp/nur-faith-learning-check-completed-verified.log`).
  JS 373, CSS 123, Gesamt 496 KB gzip; 1 KB Mehrbedarf für konkret abgeglichene
  Kursquellen und Grenzen. Entry 92 unter unverändertem 95-KB-Limit; keine
  Abhängigkeit oder CSS-Schicht, Shell/Registrierung gemeinsam v67. Erster
  Browserlauf drei Fälle bestanden; abschließender 23-Fälle-Lauf mit Quran
  ebenfalls bestanden (1,8 Minuten,
  `/private/tmp/nur-faith-quran-e2e-completed-verified.log`). Zusätzliche
  explizite Browserassertionen für Lern-Details/Merksätze/Quiz-Erklärung separat
  bestanden: drei Fälle, 23,1 Sekunden
  (`/private/tmp/nur-faith-learning-fields-e2e-verified.log`). Der bekannte
  Speicherfehler beim erfolgreichen Abschluss ist damit nicht behoben.
  Keine Gesamtfreigabe oder fachliche Freigabe durch Tests.
- Quran-Rohtext: tatsächlich abgerufene Anbieterantwort und alle 6.236
  Textfelder exakt verglichen, 1.368 Metadatenwerte identisch; 115 lokale
  Fingerabdrücke binden den Vergleich an die geprüften Dateien. Keine
  unabhängige Editions-/Rechtefreigabe. Der bisher unter Vers 1 geführte
  unnummerierte Surenbeginn ist nun in Anzeige, Kopieren und Teilen getrennt;
  Originaldateien unverändert. [Nachweis und Grenzen](QURAN-TEXT-AUDIT-2026-10-11.md).
- Erneuter vollständiger Quran-Korrekturcheck mit endgültigem Gesamtlimit und
  präzisierter Strukturprüfungs-Ausgabe: Exit 0, 795 Tests/51 Dateien plus zehn
  Node-Regressionsfälle, Typprüfung/Build/Budgets. Maßgebliches letztes Log:
  `/private/tmp/nur-quran-basmalah-check-final-verified.log`.
- Quran-Verszuordnung: 120 neue Unit-Fälle; vollständiger Check Exit 0,
  **795 Tests in 51 Dateien** plus zehn Node-Prüferregressionen, Typprüfung
  und Build (`/private/tmp/nur-quran-basmalah-check-final.log`). Separater
  Budgetcheck ebenfalls Exit 0 mit unverändertem Gesamtlimit 494 KB; JS für
  die belegte Zuordnungskorrektur auf 372 KB begrenzt, CSS 123 und Entry 95 KB
  unverändert. Entry gemessen 91 KB. Shell/Registrierung gemeinsam v65.
  **Zehn Produktions-Browsertests bestanden (49,8 Sekunden)**,
  `/private/tmp/nur-quran-basmalah-e2e-verified.log`: Verfügbarkeit und neue
  Verszuordnung/Kopieren/Teilen über fünf Suren bei 320/768/1280 px. Drei neue
  Bilder visuell angesehen; vorübergehende Toast-Überlagerung/-Anschnitt bleibt
  als Layoutgrenze im [Textbericht](QURAN-TEXT-AUDIT-2026-10-11.md) benannt.

- Namen 81–99: vollständiger Check Exit 0, 643 Tests in 49 Dateien, Build und Budget; neun Browserprüfungen mit 297 Dialogöffnungen und Speicherfehlern bestanden. Drei neue Beleggrenzen-Bilder visuell geprüft. Details und Logs im Namensbericht. Keine vollständige App-Abdeckung behauptet.
- Gebetsquellen-Zwischenstand: vollständiger Check Exit 0, 646 Tests in 49 Dateien. Rund 1 KB zusätzliche Beleg-/Grenztexte, JS-Limit 371 und Gesamtlimit 494 KB; gemessen gerundete Gesamtsumme 493 KB, Entry 90 KB bei unverändertem 95-KB-Limit. Damaliger Cache-/Registrierungsstand v62.
- Nach Inventartestkorrektur: vollständiger Check Exit 0, 647 Tests (`/private/tmp/nur-prayer-inventory-check-verified.log`). Nach Quran-/Praxisgrenzen: **649 Tests in 49 Dateien**, Typprüfung, Build und Budgets bestanden (`/private/tmp/nur-prayer-quran-check.log`). Gemessen gerundet JS 371 KB, CSS 123 KB, Gesamt 494 KB; Entry 90 KB unter 95 KB. Cache/Registrierung gemeinsam v63. Keine weitere Budgeterhöhung.
- Gebetskurs: **neun Browserprüfungen bestanden (44,6 Sekunden)**, `/private/tmp/nur-prayer-quran-e2e.log`. Quran-/Quellen- und Schlussformelfälle bei 320/768/1280 px einschließlich 14 ausdrücklich gescrollter Quellen pro Breite oberhalb der festen Navigation. Drei neue Viewportbilder visuell angesehen; keine gesamte Praxis-, Aussprache- oder echte Geräteprüfung.
- Quran-Dienst: **26 zusätzliche Datentests bestanden**. Vollständiger Lauf einschließlich präzisierter Quellenanzeige erneut Exit 0, **675 Tests in 50 Dateien**, Typprüfung, Build und unveränderte Budgets (`/private/tmp/nur-quran-integrity-check-verified.log`): JS 371 KB, CSS 123 KB, Gesamt 494 KB, Entry 91 KB unter 95 KB. Cache/Registrierung gemeinsam v64.
- **Sieben Quran-Browserprüfungen bestanden (26,0 Sekunden)**, `/private/tmp/nur-quran-integrity-e2e-verified.log`: Lade-/Fehlerhinweise, unverändert lokales Arabisch bei fehlenden Lesetexten, falsche Edition, Retry nach lokaler Korrektur, Cache-Schreibfehler ohne Speicherzusage. Drei neue Bilder bei 320/768/1280 px visuell angesehen. Service Worker blockiert, externe Antwortfehler simuliert: keine vollständige Offline-/Anbieter-Wortlautprüfung. Beobachtete Hero-Überlagerung beim gescrollten Handybild im [Teilbericht](QURAN-SERVICE-AUDIT-2026-10-11.md) benannt.

- Älterer `review:write`-Zwischenstand: 1.145 Positionen; 92 ohne Einzelfundstelle, 862 hier verfasst. Aktuelles Inventar oben: 1.146/91/862. Keine Gleichsetzung dieses Inventars mit vollständiger Quellenbestätigung.
- Frühere Gesamtprüfungen mit 474, 598 bzw. 625 Tests sind historische Zwischenstände. Abgeschlossener Lauf nach der präzisierten Zählerstandsanzeige: **626 Tests in 47 Dateien**, Typprüfung, alle Strukturprüfungen und Produktionsbuild bestanden. Dieser Lauf liegt vor den anschließenden Änderungen an den Namensquellen.
- Namensquellenstand: **631 Tests in 49 Dateien**, Typprüfung, Strukturprüfungen, Produktionsbuild und Budgetprüfung bestanden. Fünf neue Regressionen sichern alle 99 Dialoge und den Unterschied zwischen dokumentierter Fundstelle und offenem Einzelbeleg ab; die technische Abdeckung ist keine Inhaltsbestätigung sämtlicher Namen.
- Erweiterung Namen 14–35: vollständige Prüfkette beendet mit Exit 0; separater erneuter Unit-Lauf **633 Tests in 49 Dateien**. Sieben Namens-Daten-/Render-Tests, darunter zwei zusätzliche Regressionen für Handlung gegenüber Namensform und genaue Fundstellen-/Bedeutungsgrenzen. Budget unverändert bestanden. Vorhandene React-Testwarnungen bleiben dokumentiert; kein warnungsfreier oder vollständiger App-Prüfnachweis behauptet.
- Erweiterung Namen 36–60: vollständiger Check nach dokumentiertem Mehrbedarf von rund 1 KB Quellenhinweisen beendet mit Exit 0; **634 Tests in 49 Dateien**, acht Namens-Daten-/Render-Regressionen. JS-Budget 368 KB, Gesamtbudget 491 KB; gemessen 368 + 123 = 491 KB gzip. Entry 88 KB unter unverändertem 95-KB-Limit; CSS-Limit unverändert. Keine neue Funktion/Abhängigkeit und keine religiöse Freigabe durch Tests.
- Neue Render-Tests bestätigen richtige Metadaten/Personenbestände und Glossarquellen der vorhandenen älteren Screens. Diese sind nicht über aktuelle Hub-/History-Routen erreichbar; keine Browser-Navigierbarkeit behauptet.
- Quellenabdeckungsbericht: 11 Einleitungen, 41 Abschnitte und sechs Glossarbegriffe mit Quellen. Die fehlenden Namensquellen in diesem einfachen Bericht beziehen sich nur auf das Lernlistenfeld, nicht auf die separate Evidenzzuordnung der Prüfmappe.
- Gemessen nach Namenbelegen: 367 KB JavaScript + 123 KB CSS = 490 KB gzip; Entry 87 KB. JS-Limit entsprechend +3 KB, Gesamtlimit 490 KB. CSS-Limit 123 KB und Entry-Limit 95 KB bleiben unverändert. Die vorhandenen 75 Fundstellen samt Kontext werden jetzt tatsächlich dargestellt; keine neue Abhängigkeit. Budgetprüfung im abgeschlossenen Gesamtcheck bestanden.
- Erweiterung Namen 61–80: **642 Tests in 49 Dateien**, 16 gezielte Namens-Daten-/Render-/Speicherregressionen, Typprüfung und Build bestanden. Erster Check scheiterte nur am JS-Budget (369 statt 368 KB). Mehrbedarf durch genauere Quellenhinweise und sichere Speicherung dokumentiert; JS-Grenze 369, Gesamtgrenze 492 KB. Vollständiger erneuter `npm run check` Exit 0; Entry 89 KB unter unverändertem 95-KB-Limit, CSS 123 KB unverändert. Vorhandene Testwarnungen sind damit nicht behoben.
- App-Shell-Cache und Registrierung gemeinsam auf v60 aktualisiert, damit die Namenstexte 61–80 und Verlust-/Speicherhinweise nicht hinter der alten Shell verbleiben. Das allein beweist keine vollständige Offline-Prüfung sämtlicher Inhalte.
- Personenlisten: sechs isolierte Browserprüfungen mit Produktionskomponenten und App-Styles bestanden (beide Bestände bei 320, 768, 1280 px; sämtliche Quellenlinks und Einordnungen, kein horizontaler Überlauf). Keine Produktionsroute hinzugefügt.
- Dhikr-/Inhaltsbrowserprüfung nach der präzisierten Netto-Zählerstandsanzeige: acht Tests im Produktionsbuild bestanden, einschließlich aller 18 Texte bei drei Breiten ohne internes Textabschneiden, Speicherung nach Neuladen und Speicherfehler. Der durch paralleles Überschreiben des Builds ungültige Zwischenlauf wurde nicht als App-Befund gewertet; der getrennte Wiederholungslauf bestand.
- Frühere zwölf Produktions-Browsertests für Dua, Hadith und Grundlagen-Ergänzungen siehe Einzelberichte; kein Beleg vollständiger App-Abdeckung.
- Vorheriger Namen-/Inhaltshinweisstand: sieben Produktions-Browsertests bestanden. Erste 13 Dialoge und vier Beleg-/Grenzfälle bei 320, 768 und 1280 px, plus vier vorhandene Hinweisregressionen. Erweiterung 14–35 separat: **drei Produktions-Browsertests bestanden**, je 38 Dialoge bei diesen Breiten (114 Öffnungs-/Schließvorgänge), exakte Links und Ableitungsgrenzen, alle 99 sichtbar und kein horizontaler Textüberlauf. Drei repräsentative Dialogbilder visuell angesehen. Startbeschränkungen und Verwendung des installierten Chrome im [Namensbericht](NAMES-SOURCE-AUDIT-2026-10-11.md) dokumentiert; keine pauschale Browserabdeckung aller App-Bereiche.
- Erweiterung 36–60: **drei Produktions-Browsertests bestanden (2,1 Minuten)**, je 63 Dialoge bei 320/768/1280 px, zusammen 189 Öffnungs-/Schließvorgänge. Exakte Beleglinks, zehn Ableitungsgrenzen, alle 99 sichtbar und kein horizontaler Textüberlauf. Neue Dialogbilder 40/320, 48/768 und 58/1280 visuell angesehen; kein echter Geräte-/Aussprachetest.
- Erweiterung 61–80: **neun Produktions-Browsertests bestanden**. Drei Quellen-/Dialogtests mit je 82 Dialogen (1–80, 85, 99), insgesamt 246 Öffnungs-/Schließvorgänge, plus sechs Speicherfehlertests bei 320/768/1280 px. Resultatdatei `test-results/.last-run.json`: `passed`, keine fehlgeschlagenen Tests; Terminal meldete neun gestartete Tests, der abgeschlossene Terminalhandle war anschließend nicht mehr abrufbar. Screenshots 63/320, 68/768 und 76/1280 visuell angesehen; Quellenlinks, lange Glossen und Schließen lesbar. Keine echten Geräte- oder physischen Sensorprüfungen.

Browser-/Rechentests prüfen kein echtes Magnetometer und bestätigen nicht die Richtigkeit sämtlicher Texte. Keine menschlichen Freigabestatus gesetzt; keine Veröffentlichung und kein GitHub-Push.

## Noch erforderlich

- Die übrigen vier Seerah-Lernlektionen (35 Positionen) sowie Gebets- und Prophetenkurse einzeln abgleichen. Die 99 Namenspositionen sind untersucht, aber 24 Formen bleiben ohne direkten Einzelbeleg: 20 verwandte Kontexte, ein Ausschlusskontext und drei ohne zugeordneten verwandten Beleg. Keine Authentifizierung der festen Auswahl, aller Auslegungen oder Aussprache daraus ableiten. Kurze Personenübersichten nicht als Bestätigung sämtlicher Erzählungen über diese Personen verwenden.
- Geringen Kontrast der bestehenden Weiter-Schaltfläche im schmalen Lernkurs prüfen; Lesbarkeit von Quellen ist keine Gesamt-UI-Freigabe. Die nachgewiesenen Guide-/Hub-Speicherfehler sind im separaten Funktionsbericht korrigiert, nicht stellvertretend für alle Speicherwege.
- Weitere Speicherwege der Gebets-/Prophetenkurse und mögliche gleichzeitige Tab-Änderungen weiter prüfen. Die reproduzierten Fehler des gemeinsamen Grundlagenkurses sind im [Speicherbericht](LEARNING-STORAGE-AUDIT-2026-10-12.md) korrigiert; daraus keine Speicherfreigabe aller App-Bereiche ableiten.
- Fehlende und nur lektionenweise zugeordnete Quellen gegen Aussagen prüfen.
- Eingebettete UI-, Dialog-, Hinweis- und Teiltexte vollständig inventarisieren.
- Quran-, Gebetszeiten-, Kalender-, Qibla- und Erinnerungsdienste samt Fehler-/Offline-Zuständen prüfen.
- Echte Geräte-, rechtliche und fachliche Grenzen sichtbar halten; KI-Abgleich nicht in menschliche Freigabe umbenennen.
