# Quran-Text und Verszuordnung · 11.10.2026

## Tatsächlicher vollständiger Anbieterabgleich

Referenz: [Al Quran Cloud, Ausgabe `quran-uthmani`](https://api.alquran.cloud/v1/quran/quran-uthmani).
Tatsächlich abgerufen am 11.10.2026 um 17:31:07 UTC, HTTP 200, 2.109.200 Bytes.
Die Antwort identifiziert ihre Ausgabe als Uthmani, arabisch, Quran-Text.
Das vollständige Ergebnis steht in
[`quran-reference-audit-2026-10-11.json`](quran-reference-audit-2026-10-11.json).

| Vergleich | Ergebnis | Aussagegrenze |
|---|---|---|
| Alle 114 lokalen Suren, 6.236 Versfelder | 6.236 exakte Textübereinstimmungen, keine Unterschiede | Zeichenketten einschließlich Vokalisation, nicht nur normalisierte Buchstaben. Bestätigt Identität mit dieser Anbieterantwort, nicht unabhängige Richtigkeit jeder Editionsentscheidung. |
| Metadaten im Index und in Surendateien | 1.368 gleiche Werte | Surennummer, arabischer/englischer Name, Namensbedeutung, Offenbarungskategorie und unabhängig aus dem Referenzarray gezählte Versanzahl; keine eigenständige historische Prüfung der Kategorien. |
| Lokale Referenzbindung | 115 Dateifingerabdrücke und Manifesthash gespeichert | Spätere Byteänderungen werden bei `quran:check` erkannt. Kein Live-Abgleich durch diesen Offline-Check und keine externe Beglaubigung des Berichts. |

SHA-256 der tatsächlichen HTTP-Antwort:
`0df03e1d6da4fc8138208fec1688f2b416f0dd4ebbd514179f3e5e0fbaf4195f`.
Der Bericht speichert Abrufzeit, HTTP-Metadaten, Editionsdaten, Prüfumfang und
lokale Fingerabdrücke. Die vollständige Referenzantwort wird nicht archiviert;
der Hash ist deshalb ein reproduzierbarer Vergleichsnachweis bei identischer
Antwort, kein eigenständiges nachträgliches Lesen der damaligen Referenz.

`npm run quran:reference:audit` führt den Netzabgleich erneut aus, meldet
Unterschiede und verändert keine Quran-Dateien. Die Ganz-Quran-Antwort hat kein
`numberOfAyahs`-Feld pro Sure; Referenzanzahlen werden aus ihren tatsächlichen
Versarrays gezählt, nicht aus lokalen Werten übernommen.

## Nachweisbarer Fehler trotz gleicher Rohdaten

Bei 112 Suren enthält das erste Anbieter-Textfeld zusätzlich den unnummerierten
Surenbeginn. Die bisherige Oberfläche führte diesen zusammen mit Vers 1 auf,
auch beim Kopieren und Teilen. Ein Hashvergleich allein entdeckt diesen
Darstellungs-/Zuordnungsfehler nicht.

Tatsächlich gelesene unabhängige Versanzeigen am 11.10.2026:

- [Al-Baqarah 2:1](https://quran.com/2/1): erster Vers ohne eröffnende Basmalah.
- [Al-Ikhlas 112:1](https://quran.com/112/1): ebenso.
- [Al-Fatihah 1:1](https://quran.com/1/1): Basmalah als Vers 1 in der hier
  verwendeten Nummerierung; diese Zuordnung bleibt erhalten.
- [At-Tawbah 9:1](https://quran.com/9/1): ohne eröffnende Basmalah.

Korrektur: `quranReadingText.ts` trennt ausschließlich erkannte genaue Präfixe
des ersten Versfelds außerhalb der Suren 1 und 9. Der Surenbeginn bleibt sichtbar,
aber ausdrücklich unnummeriert, ohne kopierbare falsche Versreferenz. Versweise,
arabische Buchseiten, Kopieren und Teilen benutzen dieselbe Trennung. Auf
späteren Buchseiten wird der Surenbeginn nicht erneut vorangestellt. Die
Basmalah innerhalb von An-Naml 27:30 wird nicht angefasst.

**Keine Originaldatei verändert, keine Zeichen normalisiert, keine neue
Versnummer eingeführt.** Zusammensetzen von getrenntem Präfix, ursprünglichem
Leerzeichen und Verskörper ergibt exakt das ursprüngliche Textfeld. Die
Anbieter-Schadda im Anfangspräfix der Suren 95 und 97 bleibt erhalten und wird
nicht als eigene bestätigte Vokalisationskorrektur ausgegeben. Unterschiedliche
religiöse Auffassungen über die Basmalah im Gebet werden hier nicht entschieden.

## Absicherung und verbleibende Grenzen

- 120 neue Unit-Regressionsfälle bestanden: alle 114 Suren, vollständiger
  Zeichenerhalt, unveränderte Daten/Versnummern, Sonderfälle 1/9/27 und unbekannte
  Präfixe. Typprüfung und 115 gespeicherte Dateifingerabdrücke bestanden.
- Zehn Node-Regressionsfälle sichern den Referenzprüfer ab, einschließlich
  abweichender Vokalisation, Metadaten, falscher Ausgabe und unvollständigem
  Snapshot. Erfolgreiche Tests sind keine religiöse Freigabe.
- Vollständiger Check Exit 0: 795 Vitest-Tests in 51 Dateien sowie zehn
  Node-Prüferregressionen, Typprüfung und Build bestanden.
  `/private/tmp/nur-quran-basmalah-check-final.log`. Der anschließende
  Budgetcheck bestätigt das wiederhergestellte unveränderte Gesamtlimit:
  gerundet JS 372 KB, CSS 123 KB, zusammen 494 KB; die Rundung der Teile ist
  nicht additiv. Nur JS-Limit für die Verszuordnung um 1 KB angepasst;
  Gesamtlimit 494 KB, Entry-Limit 95 KB und CSS-Limit 123 KB unverändert.
  Entry gemessen 91 KB. Kein neues Paket. Shell/Registrierung gemeinsam v65.
- Die Konsolenausgabe des Quran-Strukturchecks bezeichnet statische
  Integrationsprüfungen nicht mehr als Beweis für tatsächliche Speicherung,
  Übersetzungsrichtigkeit oder echte Geräteprüfung.
- Erneuter vollständiger Check nach dieser Präzisierung und Wiederherstellung
  des Gesamtlimits: Exit 0, 795 Tests/51 Dateien, zehn Node-Regressionsfälle,
  Typprüfung, Build und Budgets; Log
  `/private/tmp/nur-quran-basmalah-check-final-verified.log`. `git diff --check`
  ebenfalls Exit 0; die lokalen Quran-Dateien haben keine Git-Änderungen.
- Zehn Produktions-Browsertests bestanden (49,8 Sekunden),
  `/private/tmp/nur-quran-basmalah-e2e-verified.log`: die sieben bisherigen
  Verfügbarkeitsfälle plus je ein Testablauf bei 320/768/1280 px mit Suren
  2/9/95/97/112. Exaktes Vers-1-Kopieren und Teilen ohne Eröffnungspräfix,
  erhaltener unnummerierter Beginn, kein künstlicher Beginn für Sure 9,
  arabische Buchseiten und kein erneut vorangestellter Beginn auf Seite 2.
  Die Clipboard-/Share-Ziele sind Testaufzeichnungen, keine externen Sendungen.
- Die drei neuen `quran-basmalah-{width}.png`-Bilder in den entsprechenden
  `test-results/quran-source-integrity-ope-*`-Verzeichnissen wurden visuell
  angesehen: Basmalah getrennt und lesbar, Versnummern darunter. Der
  vorübergehende Teilen-Toast liegt noch über dem Buchtext und ist im schmalen
  Bild rechts angeschnitten. Das wird nicht als vollständig fehlerfreies
  Gesamtlayout ausgegeben; Toast-/Weitere-Schriftgrößenprüfung bleibt offen.
- Erstlauf des neuen Browserablaufs nachgewiesen ungültig: Wiederaufruf derselben
  URL stellte den Reader aus der Browserhistorie wieder her; der Test suchte
  die Hauptnavigation. Eigenen Lauf gezielt beendet, regulären Zurück-Weg zur
  Surenliste getestet und kompletten korrigierten Lauf erfolgreich wiederholt.
  Kein Test künstlich durch längeres Timeout oder gelöschte Assertion bestanden.
- Vollständiger Abgleich mit einer zweiten unabhängig überlieferten Ausgabe,
  Provenienz/Übernahmeweg, Rechte/Attribution, gesamter deutscher Wortlaut,
  Umschriftqualität, Audio, weitere Leserfunktionen und echtes Geräte-Offline
  bleiben gesondert offen. Anbieteridentität ersetzt keine Fachfreigabe.
