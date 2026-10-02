# Bildabgleich der App – 24.09.2026

## Gestaltungsregel

Die App braucht **eine erkennbare Farb- und Lichtwelt**, aber nicht überall
dieselbe Bildgattung: dunkles Smaragd, gedämpftes Antikgold, warmes Elfenbein,
ruhige Schatten, keine eingebrannten Daten oder religiösen Texte. Das Motiv muss
den Inhalt erklären oder atmosphärisch tragen; bloß dekorative Dopplungen bleiben
klein oder entfallen. Texte, Uhrzeiten, Richtung und Fortschritt entstehen immer
aus App-Daten und nie aus einem generierten Bild.

| Bildfamilie | Bereiche und geprüfte Motive | Ergebnis |
|---|---|---|
| Tagesphasen | Fajr, Dhuhr, Asr, Maghrib, Isha als fünf Landschaften und sechs kleine Gebetssymbole; Start, Gebet und Gebets-Widget | Behalten: zusammenhängende Lichtfolge, je Gebet unterscheidbar. Sonnenaufgang bleibt ein eigener Zeiteintrag. |
| Freigestellte Objekte | Start, Quran, Dhikr, Qibla, Lernen, Duas, Widgets, Fasten, Sammlung und Dienste | Gleiche Material- und Lichtfamilie. Sieben unpassende oder technisch beschädigte Motive ersetzt. |
| Ortsansichten | Al-Masjid al-Haram, Al-Masjid an-Nabawi, Al-Aqsa, Masjid Quba, Jabal an-Nur, Berg Uhud | Behalten: gemeinsame redaktionelle Ansichten statt generischer Moscheesymbole. Illustrationen sind keine Fotobelege oder exakten Lagepläne. |
| Lernschritte | Acht Wudu- und sieben Salah-Posen | Bewusst als eigene, gut lesbare Cartoon-Serie belassen. Eine pauschale Umgestaltung könnte die Handlung verfälschen; Text und fachliche Prüfung bleiben maßgeblich. |

## Behobene Brüche

- „99 Namen Allahs“ zeigte ein allgemeines Medaillon. Die neue Karte zeigt
  eine symbolische Sammlung; die wirklichen Namen und der Fortschritt bleiben
  ausschließlich im geprüften App-Inhalt.
- Der Kalender zeigte als Bild ein festes, irgendwann falsches Datum. Das neue
  Objekt ist absichtlich unbeschriftet; das aktuelle Datum wird daneben live
  gerendert.
- Quran-Buch und Laterne hatten sichtbare braune Block-/Alphaartefakte. Eigene
  Ausgangsmotive wurden bereinigt; keine fremde Vorlage verwendet.
- Das alte Sammlungs-Lesezeichen war unscharf. Das neue bleibt auch in kleinen
  Widget-Flächen als Lesezeichen erkennbar.
- Der Zakat-Rechner benutzte ein Lesezeichen, die Standby-Gebetsanzeige einen
  Qibla-Kompass. Waage und ruhiges Gebetsdisplay entsprechen nun den Funktionen.

Die früheren Dateien wurden nicht gelöscht. Aktive Verwendungen, neue
Dateipfade, Quelldateien, Konvertierung und SHA-256 stehen in
[IMAGE-ASSET-PROVENANCE.md](./IMAGE-ASSET-PROVENANCE.md) und im
[maschinenlesbaren Manifest](./image-asset-provenance.json).

## Bewusst nicht vereinheitlicht

- Ortsansichten werden nicht zu freigestellten Spielzeugobjekten umgezeichnet:
  Bei realen Orten hilft ein räumliches Bild mehr als eine Dekoration.
- Wudu-/Salah-Posen werden nicht gegen stimmige, aber möglicherweise falsche
  KI-Gesten ausgetauscht. Ein theologischer/fachlicher Bildreview bleibt vor
  einem öffentlichen Release sinnvoll.
- Die Qibla-Anzeige bleibt eine funktionale Kompassgrafik. Ein Bild darf nicht
  suggerieren, der Gerätesensor sei aktiv, wenn nur eine berechnete Richtung
  gezeigt wird.
- Der ältere beschädigte Moschee-Rasterexport bleibt archiviert; die aktive
  App-Zuordnung verwendet bereits die intakte skalierbare Moschee-Grafik.

## Sicht- und Technikcheck

Neue Namen-Kachel, Quran-Reader, Zakat-Rechner und Standby-Gebetsanzeige wurden
im laufenden lokalen Browser in schmaler App-Breite angesehen. Alle sieben
neuen WebP-Dateien haben dokumentierte Prüfsummen und sind Teil des
Offline-App-Shell-Caches v26. Bildzuordnung, Farbpalette, Asset-Integrität und
Produktions-Build werden automatisiert geprüft. Der alte Browser-Tab hatte
zunächst ausschließlich ein veraltetes Offline-Bundle geladen; nach dem
Cache-Wechsel zeigte er die neuen Dateinamen.

## Fortsetzung am 25.09.2026

Die zuvor nur durch einen Pfad-Alias abgefangene beschädigte Moschee-Rastergrafik
war in Onboarding, Moschee-Suche und CSS weiterhin direkt eingetragen. Dort
steht nun ein eigenes konzeptionelles Moscheemotiv, das Material und Licht der
freigestellten Objektfamilie aufgreift. Der Einstieg zu den islamischen Orten
verwendet ebenfalls dieses Motiv; die sechs konkreten Ortsansichten bleiben
gesonderte Illustrationen und werden nicht als Fotobelege bezeichnet. Eine alte
Quran-Dekoration mit beschädigter Moschee-PNG wurde auf das bereits aktive
Mihrab-Motiv vereinheitlicht. Offline-Cache v27 enthält den Ersatz. Die neue
Bilddatei und ihre Herkunft sind im [Manifest](./image-asset-provenance.json)
erfasst.
