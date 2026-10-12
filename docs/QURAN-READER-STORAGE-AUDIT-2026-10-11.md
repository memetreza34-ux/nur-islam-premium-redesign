# Quran-Reader: Speicherangaben · 11. Oktober 2026

## Umfang und Maßstab

Geprüft: Lesezeichen, Lesestellen auf Buchseiten, Seitenposition, Lesefortschritt,
zuletzt geöffnete Suren, Schrift-/Moduspräferenzen und Fehlermeldungen in
`src/screens/QuranReaderScreen.tsx`. Keine religiöse Fachfreigabe und keine
Zusicherung unbegrenzt haltbarer Browserdaten.

## Tatsächlich gelesene technische Quellen

- [MDN: Storage.setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem),
  Abschnitt Exceptions, Abruf 11.10.2026: Schreiben kann bei Speichermangel
  fehlschlagen; der Rückgabewert ist keine Erfolgsbestätigung.
- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
  Abschnitte Exceptions und Description, Abruf 11.10.2026: Browserrichtlinien
  können Zugriff verweigern, Daten gehören zu einer Origin. Private Sitzungen
  bieten keine dauerhafte Aufbewahrung nach ihrem Ende.

Diese Quellen belegen die Speichergrenzen, nicht automatisch die Fehlerfreiheit
der konkreten Implementierung. Dafür dienen die getrennten Laufzeittests.

## Befunde und Korrekturen

| Konkrete Angabe / Verhalten | Befund und Änderung |
|---|---|
| Lesezeichen als gespeichert markiert | Bisher wurde zuerst die Anzeige geändert; Fehler im anschließenden Schreib-Effekt blieben verborgen. Jetzt vor dem Schreiben den vorhandenen Rohwert lesen, auf unveränderten Bestand prüfen, schreiben und zurücklesen. Erst nach Bestätigung die Auswahl ändern. |
| Fehlerhaftes Entfernen eines Lesezeichens | Vorhandene Markierung bleibt erhalten, wenn Entfernen scheitert. Ein erfolgreiches Entfernen wird weiterhin ausdrücklich unterstützt. |
| Öffnen einer Sure | Automatischer Lesezeichen-Schreibeffekt entfernte beschädigte oder unbekannte Daten. Jetzt rein lesen; unlesbare/ungültige Bestände bleiben unangetastet. |
| Wechsel zwischen Suren | Lesezeichen werden pro Sure neu gelesen und anhand der tatsächlich geladenen Versanzahl validiert. Kein automatisches Umschreiben mit dem Bestand der vorigen Sure. |
| Geänderter Bestand in einem anderen Tab | Die Schreiboperation vergleicht den aktuellen Rohwert mit dem beim Lesen gesehenen. Bei Abweichung keine überschreibende Aktion; Bestand neu lesen und fehlende Bestätigung melden. Dies ist keine atomare Mehrtab-Transaktion. |
| „Lesestelle auf Seite … gespeichert“ | Bisher auch nach geworfenem Schreibfehler. Jetzt nur nach erfolgreichem Rücklesen; sonst kein neues „Gemerkt“ und kein Erfolgshaken. |
| Ungültige gespeicherte Markierung | Ein Vers außerhalb der Sure erschien wegen Seiten-Fallback als Markierung auf Seite 1. Jetzt nicht als gespeicherte Seite darstellen; Rohwert beim Öffnen nicht löschen. |
| Letzte Buchseite und Lesefortschritt | Wiederhergestellte Seite setzt nun auch den aktiven Vers auf ihren wirklichen ersten Vers. Schreiben beim Weiterblättern wird überprüft; Fehlschlag sichtbar. |
| Frühere Fortschritts-/Recent-Daten | Vor automatischem Schreiben auf lesbare Struktur und gültige IDs prüfen. Fortschritt anhand des tatsächlichen Surenkatalogs prüfen. Beschädigte Daten nicht durch leere Ersatzwerte überschreiben. |
| Schrift und Leseart | Kein automatisches Schreiben von Ersatzpräferenzen beim Öffnen. Explizite Änderungen bleiben während der Sitzung nutzbar; Speicherung für spätere Sitzungen wird bei fehlender Bestätigung nicht behauptet. Fehlende Schriftgröße war zuvor durch `Number(null)` fälschlich 26 statt des vorgesehenen Defaults 34. |
| Unbedingte Zusage „merkt … automatisch“ | Ersetzt durch lokale Speicherung beim Weiterblättern, abhängig von Browsererlaubnis; Verlust nach Löschen von Browserdaten ausdrücklich benannt. |
| Dieselbe Zusage im Surenkatalog | Dort auch pauschal „nach dem ersten Laden gespeichert“. Jetzt arabischer mitgelieferter Bestand, separat geladene Lesetexte und vom Browser abhängige lokale Speicherung getrennt. Katalog-Favoriten werden damit noch nicht als vollständig geprüft ausgewiesen. |
| Fehler-Toast mit Erfolgshaken / Anschnitt | Fehler erhalten X statt Haken und `role="status"`. Zentrierung jetzt auch im Motion-Transform enthalten; Browserprüfung separat erforderlich. |

## Nachweise und Grenzen

- 28 gezielte Unit-/Renderfälle bestanden:
  `/private/tmp/nur-reader-storage-expanded-2.log`.
  Enthält geworfene und verworfene Schreibvorgänge, gesperrtes Lesen,
  fehlgeschlagenes Rücklesen, Erhalt beschädigter Daten, andere Tab-Bestände,
  Surenwechsel, bestätigtes Speichern/Entfernen und wiederhergestellte Seiten.
- Ursprüngliche Testfassung nutzte `Storage.prototype` in Happy DOM und erfasste
  dort nicht zuverlässig die tatsächlich verwendete Instanz. Die endgültigen
  Tests ersetzen den tatsächlichen Speicherzugriff; der alte Zwischenlauf ist
  kein belastbarer Beleg sämtlicher simulierter Schreibfehler.
- Vollständige Prüfkette nach den präzisierten Speichermeldungen beendet, Exit 0:
  **823 Unit-/Render-/Datentests in 52 Dateien**, zehn Node-Prüferregressionen,
  Typprüfung, Produktionsbuild und vorhandene statische Prüfungen;
  `/private/tmp/nur-reader-check-final-verified.log`.
  Gemessen gerundet: JS 372, CSS 123, Gesamt 495 KB gzip; Entry 92 unter 95 KB,
  größter JS-Chunk 318 KB raw unter unverändertem 500-KB-Limit.
- Erster Produktions-Browserlauf: **20 Tests bestanden (1,5 Minuten)**,
  `/private/tmp/nur-reader-e2e-verified.log`. Danach wurden ausschließlich
  Fehlermeldungen präzisiert: „nicht bestätigt“ statt der nicht immer belegbaren
  Behauptung, ein Wert sei sicher unverändert. Abschließender Wiederholungslauf
  für diesen Wortlaut beendet mit Exit 1: 15 bestanden, fünf Zeitüberschreitungen
  (`/private/tmp/nur-reader-e2e-final-verified.log`, gemeldete Dauer 1,2 Stunden).
  Alle zehn neuen Speicherfälle bestanden; die fünf Fehler betreffen bisherige
  Quellen-/Navigationsfälle. Zwei Fehlerzustände zeigen noch den Einstieg,
  zwei den Surenkatalog statt des erwarteten Readers, einer einen zeitlich
  abgebrochenen Moduswechsel. Ursache damit nicht abschließend bewiesen;
  Wiederholung beendet mit Exit 0: **20 bestanden (1,5 Minuten)**,
  `/private/tmp/nur-reader-e2e-repeat-verified.log`.
  Die fünf Zeitüberschreitungen wurden im unveränderten Anwendungscode nicht
  reproduziert; ihre ursprüngliche Ursache ist dadurch nicht bewiesen.
  Keine Vermutung über Rechnerzustand als Nachweis verwendet.
  Drei Speicherfehler-Screenshots bei 320/768/1280 px visuell angesehen: Toast
  vollständig sichtbar und ohne Erfolgshaken, keine neu gespeicherte Markierung.
  Vorübergehende Überlagerungen beim Scrollen durch feste Header sind damit
  nicht allgemein ausgeschlossen.
  Nach der zusätzlichen Katalogtext-Korrektur am 12.10.2026: Gesamtcheck Exit 0
  mit 823 Tests/52 Dateien (`/private/tmp/nur-reader-catalog-check-verified.log`);
  Browsercheck Exit 0, **20 bestanden (1,5 Minuten)**
  (`/private/tmp/nur-reader-catalog-e2e-verified.log`). Der qualifizierte
  Kataloghinweis wird dabei zusätzlich ausdrücklich geprüft.
- Fehlgeschlagenes Rücklesen kann bedeuten, dass der Schreibvorgang bereits
  stattgefunden hat. Die Anzeige behauptet dann ausdrücklich keine Bestätigung;
  sie behauptet nicht, dass Daten mit Sicherheit unverändert blieben.
- Lesestellen-/Präferenzwerte werden bei ausdrücklicher Nutzeraktion ersetzt.
  Beim bloßen Öffnen werden ungültige Rohwerte nicht automatisch repariert.
- Kein Test echter Geräte, Browserbereinigung, Stromausfall oder Cloud-Sicherung.
  Kein Versprechen künftiger Haltbarkeit. Sämtliche Fehlerdaten in Tests sind
  künstliche Daten isolierter Tests, nicht echte Nutzerdaten.
- Keine neue Funktion oder Abhängigkeit. Kein zusätzliches CSS. Shell und
  Registrierung gemeinsam v66. Gesamtes gzip-Limit gezielt 495 statt 494 KB
  für überprüfte Speicherung; JS 372, CSS 123, Entry 95 KB bleiben unverändert.
