# V1 Source Audit — Prayer Time Methodology

Status: **source-audited / GRÜN mit variant-aware Berechnungshinweis**

> Technische/Quellenprüfung, keine Gelehrtenfreigabe.

## Verwendete AlAdhan-Parameter

Gegen die aktuelle offizielle AlAdhan Prayer Times API geprüft:

- `method=13` = **Diyanet İşleri Başkanlığı, Turkey**
- `method=3` = **Muslim World League**
- `school=0` = **Shafi / Standard**
- `school=1` = **Hanafi**

Die API weist selbst darauf hin, dass berechnete Zeiten von lokaler Moschee oder staatlicher/örtlicher Autorität abweichen können, weil lokale Zeiten angepasst sein können.

## Korrigierter Fehler

Die App bezeichnete Diyanet/Methode 13 bisher als `experimentell`. Das entspricht der aktuellen offiziellen AlAdhan-Dokumentation nicht. Dort ist **Dubai / Methode 16** als experimental markiert, nicht Diyanet 13.

Daher wurde ausschließlich die falsche Kennzeichnung entfernt:

- `Diyanet İşleri Başkanlığı · API experimentell` → `Diyanet İşleri Başkanlığı`
- `Diyanet (experimentell)` → `Diyanet`

Die Methodennummer 13 selbst war korrekt und wurde nicht geändert.

## Sicherheitslogik

Der aktuelle Dienst hält folgende Grenzen ein:

- keine persönlichen Live-Gebetszeiten ohne echten Gerätestandort;
- der interne Berlin-Platzhalter darf nicht als Nutzerstandort live berechnet werden;
- alte/default-basierte Caches werden nicht als persönliche Tageszeiten wiederverwendet;
- Offline-Fallback enthält keine festen Uhrzeiten, sondern `—:—`;
- ohne gültige Uhrzeiten gibt `getNextPrayer()` keinen scheinbaren Fajr-Fallback zurück;
- Reminder werden nicht auf dem clockless Fallback ausgelöst;
- sichtbarer Hinweis: berechnete Zeiten können je nach örtlicher Moschee, Methode und lokalen Korrekturen abweichen.

## Variant-aware

Die App bietet bewusst Standard-/Hanafi-Asr als Auswahl. Sie behauptet nicht, eine Rechenmethode oder Asr-Schule sei für alle Nutzer alternativlos.

## Ergebnis

`prayer-time-methodology` ist auf Source-Audit-Ebene abgeschlossen. Ein realer Feldvergleich mit örtlichen Referenzen bleibt Geräte-/Release-QA, nicht Teil dieser Quellenprüfung.
