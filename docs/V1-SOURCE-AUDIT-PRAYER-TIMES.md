# V1 Source Audit — Prayer Time Methodology

Status: **alter Prüfbericht korrigiert am 11.10.2026; technische Teilprüfung, keine Gesamtfreigabe**

> Technische/Quellenprüfung, keine Gelehrtenfreigabe.

## Verwendete AlAdhan-Parameter

Gegen die aktuelle offizielle AlAdhan Prayer Times API geprüft:

- `method=13` = **Diyanet İşleri Başkanlığı, Turkey**
- `method=3` = **Muslim World League**
- `school=0` = **Shafi / Standard**
- `school=1` = **Hanafi**

Die API weist selbst darauf hin, dass berechnete Zeiten von lokaler Moschee oder staatlicher/örtlicher Autorität abweichen können, weil lokale Zeiten angepasst sein können.

## Korrigierter Fehler

Die frühere Behauptung dieses Berichts, Diyanet 13 werde nicht als experimentell bezeichnet, war falsch. Die am 11.10.2026 gelesene [Methoden-API](https://api.aladhan.com/v1/methods) nennt **Diyanet 13 und Dubai 16** jeweils experimentell. Die allgemeine [Methodenseite](https://aladhan.com/calculation-methods) lässt das Wort bei Diyanet weg. Die konkret zurückgegebenen API-Metadaten tragen die Kennzeichnung jedoch ebenfalls. Die App behält sie deshalb; die doppelte englische/deutsche Wiederholung im Methodentitel wurde beseitigt.

Der aktuelle Datums-, Parameter- und Quellenabgleich steht im [neuen Einzelbericht](PRAYER-TIMES-SOURCE-AUDIT-2026-10-11.md). Alte Aussagen über eine bereits vorgenommene Entfernung waren kein Beleg des heutigen Codes.

## Sicherheitslogik

Der aktuelle Dienst hält folgende Grenzen ein:

- Berlin ist ein ausdrücklich gekennzeichneter Standardstandort; für diese Stadt können API-Zeiten berechnet werden, auch ohne Gerätestandort;
- eine solche Stadtabfrage ist keine Standortmessung und keine Aussage über den Aufenthaltsort des Nutzers;
- bestätigte Tagesdaten dürfen für denselben Standort, Tag und dieselben Einstellungen als gespeichert wiederverwendet werden;
- frühere Caches ohne die neue Antwortvalidierung werden nicht angezeigt; die gespeicherten Daten werden dabei nicht gelöscht;
- Offline-Fallback enthält keine festen Uhrzeiten, sondern `—:—`;
- ohne gültige Uhrzeiten gibt `getNextPrayer()` keinen scheinbaren Fajr-Fallback zurück;
- Reminder werden nicht auf dem clockless Fallback ausgelöst;
- sichtbarer Hinweis: berechnete Zeiten können je nach örtlicher Moschee, Methode und lokalen Korrekturen abweichen.

## Variant-aware

Die App bietet bewusst Standard-/Hanafi-Asr als Auswahl. Sie behauptet nicht, eine Rechenmethode oder Asr-Schule sei für alle Nutzer alternativlos.

## Ergebnis

Dieser historische Bericht belegt keine abgeschlossene Gesamtprüfung. Datums-/Metadatenprüfung und konkrete Fehler wurden bearbeitet; lokale Moscheevergleiche, reale Standortmessung, Geräteprüfungen und die übrigen im zentralen Bericht genannten Bereiche bleiben getrennt offen.
