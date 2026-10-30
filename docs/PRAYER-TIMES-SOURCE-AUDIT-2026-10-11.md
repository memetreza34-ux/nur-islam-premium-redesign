# Gebetszeiten: Quellen- und Antwortprüfung · 11.10.2026

Technischer KI-Abgleich, keine religiöse Fachfreigabe und keine physische Geräteprüfung. Die Zahlen unten sind eine dokumentierte API-Stichprobe, kein veröffentlichter Referenz-Gebetsplan. Gesamtstatus: [zentraler Bericht](APP-CONTENT-AUDIT-2026-10-11.md).

## Tatsächlich gelesene Primärquellen

- [AlAdhan-Methodenkatalog](https://api.aladhan.com/v1/methods): Methode 13 Diyanet, Methode 3 MWL; Diyanet 13 und Dubai 16 sind in den Namen als experimentell gekennzeichnet.
- [AlAdhan-Methodenerklärung](https://aladhan.com/calculation-methods): Methoden bestehen aus Winkeln/Zeitabständen; örtliche Anpassungen können abweichende Zeiten ergeben. Das ist keine Gelehrtenfreigabe des API-Betreibers.
- [Offizielle API-Parameter](https://aladhan.com/prayer-times-api): dokumentierte Standard-/Hanafi-Asr-Auswahl (`school=0` bzw. `1`). Die Suchindex-Fassung enthielt die Parameter; der direkte textuelle Seitenabruf lieferte nur die Seitenschale. Deshalb zusätzlich tatsächliche API-Metadaten gelesen.
- [Tagesantwort Berlin, Diyanet/Standard, 11.10.2026](https://api.aladhan.com/v1/timings/11-10-2026?latitude=52.52&longitude=13.41&method=13&school=0): Datum `11-10-2026`, `Europe/Berlin`, Standort `52.52/13.41`, Methode 13, Schule `STANDARD`. Sechs verwendete Zeiten als `HH:mm`. Der Name enthält `(experimental)`.
- [Monatsantwort Berlin, Oktober 2026](https://api.aladhan.com/v1/calendar/2026/10?latitude=52.52&longitude=13.41&method=13&school=0): 31 Tage, erster Tag `01-10-2026`, letzter `31-10-2026`; Zeiten mit `CEST` bzw. `CET` in Klammern. Gelesen wurden Anzahl sowie vollständiger erster und letzter Eintrag, nicht jede reale Berechnung des Monats.
- [Tagesantwort MWL/Hanafi](https://api.aladhan.com/v1/timings/11-10-2026?latitude=52.52&longitude=13.41&method=3&school=1): gleiche angefragte Koordinaten und Datum, Methode 3 und Schule `HANAFI` tatsächlich zurückgegeben.

API-Aufrufe senden hier ausschließlich öffentliche Berliner Stadtkoordinaten, keine privaten Gerätedaten. Die JSON-Antworten wurden unmittelbar gelesen; dies ist kein Magnetometer-, GPS- oder lokaler Moscheevergleich.

## Konkrete Befunde und Korrekturen

| Aussage / Verhalten | Befund | Änderung / Grenze |
|---|---|---|
| Alter Bericht: Diyanet nicht experimentell | Aktuelle Methoden- und Tages-API widersprechen dem Bericht. | Kennzeichnung bleibt; doppelte englische/deutsche Klammer wird vermieden. Historischen Bericht korrigiert. |
| Tageszeiten gehören zum angegebenen Tag | Fehlendes Datum wurde akzeptiert; ungültige Anfragedaten nicht vor Abruf abgewiesen. | Echter ISO-Anfragetag und vollständig gültiges Gregorianisches Antwortdatum erforderlich; Antwort muss zum Tag passen. Kein Cache bei Fehler. |
| Monatstage entsprechen den angezeigten Daten | Bisher wurden Arraypositionen unabhängig vom Antwortdatum als angefragte Tage beschriftet; zusätzliche Tage abgeschnitten. | Exakte Monatslänge, jeder Antworttag und Reihenfolge geprüft; keine Duplikate, fremden Monate oder fehlenden Datumsangaben. Schalttag berücksichtigt. |
| Standort, Methode und Asr entsprechen der Auswahl | Metadaten wurden zuvor nur als Beschriftung verwendet. | Zurückgegebene Standortkoordinaten, Methoden-ID und Asr-Schule müssen mit der Anfrage übereinstimmen. Das gilt für jeden Monatstag. |
| Gemeinsame Zeitzone im Monatsplan | Nur erster Tag wurde geprüft. | Jeder Tag benötigt eine gültige Zeitzone; widersprüchliche Monatszeitzonen werden abgewiesen. Sommerzeitabkürzungen dürfen sich ändern. |
| Uhrzeiten sind gültig | `05:00123`, zusätzliche Sekunden oder Text wurden auf `05:00` gekürzt. | Ganze Zeichenfolge geprüft; gültige Stunden/Minuten und optionaler Klammer-Zeitzonenzusatz, wie tatsächlich geliefert. |
| Gespeicherte Zeiten stammen aus validierten Antworten | Alte Snapshots können vor der strengeren Prüfung entstanden sein. | `validationVersion=1` erforderlich. Tagesdatum und Meta-Datum müssen übereinstimmen. Alte Daten werden ignoriert, nicht gelöscht. |
| Ohne bestätigte Zeiten kein erfundener Plan | Fallback enthält ausschließlich `—:—`; aber Rückmeldungen behaupteten dennoch „gespeicherter Zeitplan“. | Rückmeldungen unterscheiden frisch geladen, gespeichert, nicht verfügbar, Standort verweigert und überholte Anfrage. Kein Erfolg für fehlende Daten. |
| Standard-Berlin sei Nutzerstandort | Standarddaten waren intern markiert, auf der Gebets-Ortskarte aber nicht ausdrücklich benannt. | Ortskarte nennt „Standardstandort“. Das ist eine Stadtabfrage, keine persönliche Ortung. |
| Gerundete Koordinaten garantieren richtigen Plan und Anonymität | Ein Codekommentar enthielt eine zu weitgehende Garantie. | Kommentar entfernt; Rundung allein garantiert weder Genauigkeit noch Anonymität. Gerätekoordinaten werden im API-Aufruf auf zwei Nachkommastellen gerundet. |

## Absicherung

Neue Negativtests wurden **vor** der Reparatur ausgeführt: 18 scheiterten, weil der Dienst die problematischen Antworten akzeptierte. Nach der Reparatur bestanden die gezielten Dienst-/Datums-/Cachetests. Browserfixtures tragen nun echte Formate, ausdrücklich synthetische Inhalte und jeweils passende Anfrage-Metadaten.

Die aktuellen vollständigen Testzahlen und tatsächlich abgeschlossenen Browserläufe werden im zentralen Bericht festgehalten, nicht aus früheren Ergebnissen übernommen. Im Monatsdialog wird ein fehlerhafter Plan nicht als Reihe von Uhrzeiten dargestellt; Wiederholung mit korrekten Daten wird geprüft.

## Nicht bewiesen / weitere Prüfung

- API-Berechnung ersetzt keine Bestätigung durch die örtliche Moschee. Methodenspezifische Zeitkorrekturen und hohe Breiten sind nicht in jeder Stadt bzw. Jahreszeit feldgeprüft.
- Ein gespeicherter Gerätestandort kann veraltet sein; erneute Standortfreigabe ist keine kontinuierliche Ortung. Aktualitätsbeschriftung gespeicherter Orte ist gesondert zu prüfen.
- Keine physische GPS-Kalibrierung, kein echter Sensor-/Berechtigungstest auf iOS/Android. Die automatisierten Browsertests simulieren Antwortdaten.
- Tageswechsel während laufender Abrufe, automatische Hintergrund-Erinnerungen und deren Plattformgrenzen sind Teil der noch offenen übergreifenden Funktionsprüfung.
- Gregorianisches API-Datum ist hier geprüft. Hijri-Sichtungsunterschiede und islamische Anlässe werden separat behandelt.
