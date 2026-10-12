# Quran-Bestand: Herkunft, Nutzung und Verfügbarkeit

## Technischer Stand · 11.10.2026

Die App liefert den arabischen Uthmani-Bestand mit 114 Suren mit. Deutsche
Wiedergabe (`de.bubenheim`, Bubenheim & Elyas) und Umschrift
(`en.transliteration`) werden pro Sure von Al Quran Cloud abgerufen, nicht als
vollständiger Bestand mitgeliefert. Maßgeblicher Code:
`src/services/quranService.ts`.

Die unterstützenden Texte werden nach erfolgreichem Abruf im Browser-Cache
abgelegt, soweit der Browser das zulässt. Fehlgeschlagene Cache-Schreibvorgänge
werden toleriert. Deshalb garantiert einmaliges Öffnen **keine** spätere
Offline-Verfügbarkeit. Ohne erreichbaren Anbieter und nutzbaren Cache kann der
arabische Text angezeigt werden, während Bedeutung oder Umschrift fehlen.

## Tatsächlich gelesene Anbieterbedingungen

Abrufdatum: 11.10.2026. Das ist ein Quellenabgleich, keine juristische Freigabe.

- [Al Quran Cloud: Nutzungsbedingungen](https://alquran.cloud/terms-and-conditions),
  Stand 14.06.2026, Abschnitte II–V: mehrere Herkunftsquellen des arabischen
  Bestands; Erhalt von Schriftzeichen; freie API mit Begrenzungen. Übersetzungen
  behalten Rechteinhaber und Editionskennung; bei Wiederveröffentlichung wird
  Übersetzerattribution verlangt. Der Anbieter gibt keine Rechts-, Genauigkeits-
  oder Verfügbarkeitsgarantie. Daraus folgt keine produktbezogene Freigabe für
  sämtliche Ausgaben, lokale Kopien oder kommerzielle Nutzung dieser App.
- [Tanzil: Textlizenz](https://tanzil.net/docs/Text_License): CC BY 3.0,
  unveränderte Kopien, erkennbare Tanzil-Quellenangabe mit Link und Übernahme des
  Copyright-/Lizenzhinweises. Diese Bedingungen sind relevant, **falls** der
  konkrete lokale Bestand von Tanzil stammt. Seine Herkunft ist damit noch
  nicht nachgewiesen.

Die früheren Aussagen „arabischer Text unkritisch“, „Lizenzfrage entfällt“ und
„die App verbreitet nichts“ werden zurückgenommen. Ein API-Abruf statt einer
mitgelieferten Übersetzung beantwortet die Nutzungsrechte nicht vollständig.
Die abstrakte religiöse Schrift und eine konkrete redigierte digitale Ausgabe
sind dabei nicht gleichzusetzen.

## Bestätigter Anbieterabgleich

Der vollständige arabische Rohbestand wurde am 11.10.2026 gegen die tatsächlich
abgerufene Ausgabe `quran-uthmani` abgeglichen: alle 6.236 Textfelder exakt
identisch. [Vergleich und Verszuordnung](QURAN-TEXT-AUDIT-2026-10-11.md).
Dieser Nachweis belegt Anbieteridentität, nicht den ursprünglichen Übernahmeweg,
Nutzungsrechte oder unabhängige Fehlerfreiheit der Referenzausgabe.

## Konkret offen

- Herkunft, Editionsstand und unveränderter Übernahmeweg der lokalen Dateien
  belegen; daraus die zutreffenden Attributionen und Lizenzhinweise ableiten.
- Für deutsche Ausgabe und Umschrift die konkreten Herkunfts-/Rechteangaben
  einschließlich Abruf, Anzeige, Cache, Teilen und Produktnutzung festhalten.
- Tatsächlichen Offline-/Fehlerzustand im Reader prüfen, statt aus vorhandenem
  Cache-Code eine Erfolgsgarantie abzuleiten.
- Vollständigen unabhängigen Editionsabgleich von der oben belegten Identität
  mit einer Anbieterantwort unterscheiden; offene Abweichungen nicht durch
  Normalisierung unsichtbar machen.

Der Bestand wird durch diese Dokumentationskorrektur nicht verändert; es wird
weder Rechtswidrigkeit noch eine abschließende rechtliche oder religiöse
Freigabe behauptet.
