# Quran-Dienst: Daten- und Verfügbarkeitsprüfung · 11.10.2026

## Umfang

Code: `src/services/quranService.ts`, Reader-Lade-/Fehlertexte und die betroffenen
Quellen-/Datenschutzhinweise. Das ist keine vollständige Prüfung aller 6.236
arabischen Verse, deutschen Übersetzungen, Umschriften, Tajwid-Regeln oder
Nutzungsrechte. Netzwerk-Fehlerprüfungen benutzen ausdrücklich Testantworten,
keine bestätigten realen Übersetzungstexte.

## Befunde und Änderungen

| Aussage / Datenpfad | Ergebnis und Korrektur | Nachweis und Grenze |
|---|---|---|
| Alle arabischen Suren lokal; „andere Suren online geladen“ | Veralteten Lade-/Fehlerhinweis korrigiert: lokal Arabisch, online nur unterstützende Texte. Kein behaupteter Online-Ersatz für fehlende lokale Dateien. | Implementierte getrennte URLs und `fetchSurahBundle`; Test prüft tatsächlich angefragte URLs. „Lokal“ allein garantiert keinen vollständig zwischengespeicherten App-Bestand auf jedem Gerät. |
| Lokaler Bestand mit richtiger Länge | Länge allein ließ falsche Surennummer, falsche/fehlende Versnummern und leeren Text zu. Jetzt Indexreihenfolge, Pflichtmetadaten, Nummer, deklarierte Anzahl, tatsächliche Länge und fortlaufende Verse validiert. | Veränderter Al-Fatihah-Testbestand wird abgelehnt; unverändertes lokales Al-Fatihah-Fixture bleibt exakt erhalten. Keine Aussage über die Richtigkeit sämtlicher Schriftzeichen daraus. |
| Wiederholen nach Dateifehler | Vorher wurden ungültige JSON-Daten bereits vor der Inhaltsvalidierung im Speicher gehalten. Nun nur validierte Daten im Speicher; erneuter Abruf kann eine korrigierte Datei laden. | Regression scheitert zuerst mit falscher Surennummer und besteht nach korrigierter Antwort. Keine Änderung an Nutzer-Notizen oder Leseständen. |
| Deutsche Ausgabe und Umschrift | Editionskennung, Surennummer und Reihenfolge geprüft; deklarierte Versanzahl zusätzlich validiert. Ungültiger Inhalt wird nicht unter Bubenheim-&-Elyas-Attribution angezeigt. | Eindeutige `de.bubenheim`-/`en.transliteration`-Anfragen; Fehlertests mit ausdrücklich künstlichen Inhalten. Keine Zertifizierung des vom Anbieter gelieferten Wortlauts. |
| Netzwerk und Cache | Gültiger Cache kann online ersetzen. Falsche Edition oder fehlgeschlagener HTTP-Status im Cache ist kein gültiger Lesetext. Cache-Zugriffs-/Schreibfehler lassen verfügbare Netzwerktexte nicht verschwinden. | Quellenstatus `cache` nur bei akzeptierter Cache-Antwort, sonst `network` oder `unavailable`; keine pauschale Speicherzusage. |
| Offline „nur beim ersten Öffnen“ | Hinweise nennen jetzt verfügbare Quelle oder nutzbaren Cache. Cache kann auch später fehlen; einmaliges Öffnen ist keine dauerhafte Offline-Garantie. Datenschutzhinweis korrigiert. | Fehlerpfade und Reader-Text. Die IP-Adresse ist nicht fälschlich als „keine personenbezogenen Daten“ ausgegeben; nur Konto-/Standortdaten werden nicht in diese Quran-Anfrage eingebaut. Keine juristische Gesamtprüfung. |
| Unabhängigkeit der Lesetexte | Ein fehlgeschlagener Text lässt den anderen und lokalen arabischen Text erhalten. Unterstützende Anfragen werden nach zwölf Sekunden abgebrochen. | Fake-Timer-/Netzwerkregression. Der Reader wartet derzeit auf die unterstützenden Anfragen: lokales Einlesen zuerst bedeutet nicht sofort sichtbares Arabisch. Kein Streaming-Versprechen. |
| Herkunft und Rechte | Pauschale frühere Freigaben zurückgenommen; Quellenanzeige behauptet keine abschließend dokumentierte lokale Herkunft. | [Herkunfts-/Rechtebefund](QURAN-PROVENANCE.md), tatsächlich gelesene [Al Quran Cloud-Bedingungen](https://alquran.cloud/terms-and-conditions), Abschnitte II–V, und [Tanzil-Lizenz](https://tanzil.net/docs/Text_License), Abruf 11.10.2026. Bedingte Relevanz von Tanzil, nicht bestätigte Herkunft sämtlicher Dateien. |

## Absicherung

- 26 neue Dienstregressionen bestanden: lokale Identität/Reihenfolge und Retry,
  getrennte URLs, Editions-/Antwortvalidierung, unabhängige Verfügbarkeit,
  Cache-Fehler und Timeout. Typprüfung bestanden.
- Erster vollständiger Lauf nach Dienst-/Readerkorrekturen Exit 0:
  **675 Tests in 50 Dateien**, Typprüfung, Build und unveränderte Budgets.
  `/private/tmp/nur-quran-integrity-check.log`. Gerundet JS 371 KB, CSS 123 KB,
  Gesamt 494 KB; Entry 91 KB unter 95 KB.
- Nach präzisierter Quellenanzeige vollständigen Check erneut abgeschlossen:
  Exit 0, **675 Tests in 50 Dateien**, Typprüfung, Build und unveränderte Budgets.
  `/private/tmp/nur-quran-integrity-check-verified.log`.
- **Sieben Produktions-Browserprüfungen bestanden (26,0 Sekunden)**:
  `/private/tmp/nur-quran-integrity-e2e-verified.log`. Ausfall der unterstützenden
  Texte bei 320/768/1280 px, deutscher Fehlzustand und arabische Buchseiten,
  abgefangene falsche Edition, korrigierte lokale Datei nach Retry,
  Cache-Schreibfehler ohne Speicherzusage und ausdrücklich geprüfter Ladehinweis.
- Drei neue Viewportbilder `quran-unavailable-{width}.png` in den jeweiligen
  `test-results/quran-source-integrity-*`-Verzeichnissen visuell angesehen:
  Al-Fatihah und Hinweise zu fehlenden Lesetexten sichtbar, kein horizontaler
  Textüberlauf im Test. Keine vollständige Layoutprüfung aller Verse/Schriftgrößen.
  Die feste Kopfzeile überlagert beim gescrollten 320-px-Bild einen Teil der
  Hero-Überschrift; das ist kein bestätigtes fehlerfreies Gesamtlayout.
- App-Shell-Cache und Registrierung gemeinsam v64. Browser-Szenarien blockieren
  Service Worker und externe Lesetext-Anfragen bzw. verwenden Testantworten;
  das ist kein Nachweis komplett offline installierter Apps auf echten Geräten.

## Weiter offen

Der vollständige Vergleich aller arabischen Textfelder und Anbieter-Metadaten
ist inzwischen im [Textbericht](QURAN-TEXT-AUDIT-2026-10-11.md) nachgewiesen;
eine falsche Zuordnung des unnummerierten Surenbeginns wurde in der Anzeige
korrigiert. Offen bleiben unabhängige Editionsprüfung und Herkunft;
aktuelle echte Anbieterantworten und deren
deutsche/Umschrift-Bedeutung; Nutzungsrechte einschließlich Teilen und Audio;
Reader-Lese-/Favoriten-/Teilfunktionen und tatsächliche Service-Worker-Offline-
Abdeckung. Ein fehlender Fehler in diesen Diensttests ist keine App-Freigabe.
