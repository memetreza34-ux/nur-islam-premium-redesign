# V1 Source Audit — Quran Offline Bundle

> **Gilt nicht mehr für diesen Branch.**
>
> Dieser Audit beschreibt einen Stand, in dem die App die deutsche Übersetzung
> von Abu Rida vollständig mitgeliefert hat. Dieser Branch liefert **keine**
> deutsche Übersetzung mit — sie wird beim Öffnen einer Sure abgerufen. Damit
> entfällt die hier offene Rechtefrage, weil die App den geschützten Text gar
> nicht verbreitet. Der aktuelle Stand steht in `docs/QURAN-PROVENANCE.md`.
>
> Aufgehoben als Nachweis der damals durchgeführten Textprüfung des arabischen
> Bestands, die weiterhin gilt.


Status: **source-audited für Textidentität / RELEASE UNRESOLVED für Rechte**

> Diese Trennung ist zwingend: Ein vollständig verifizierter Wortlaut beweist kein Nutzungs- oder Weitergaberecht und ist keine erfundene Gelehrtenfreigabe.

## Textidentität — GRÜN

Der Offlinebestand wurde vollständig gegen konkrete veröffentlichte Editionen verglichen:

- Arabisch: **6236/6236 Ayat** identisch zu Al Quran Cloud `quran-uthmani`;
- Deutsch: **6236/6236 Ayat** identisch zu Al Quran Cloud `de.aburida` (Abu Rida Muhammad ibn Ahmad ibn Rassoul);
- 114/114 Suren vorhanden;
- kufische Ayah-Zählung, Summe 6236;
- keine leeren/verschobenen Quran-Ayat im strukturellen Integrity-Check;
- SHA-256-Manifest schützt 229 Offline-Dateien vor stiller Veränderung.

Details und Prüfmethode stehen in `docs/QURAN-PROVENANCE.md`.

## Was dieser Audit ausdrücklich NICHT beweist

### Ursprüngliche Dateiquelle — UNKNOWN

Die Textidentität zeigt, **welcher Ausgabe** der Bestand entspricht. Sie beweist nicht, über welchen ursprünglichen Verteilweg die Dateien in das Repository gelangten.

### Lizenz / Weitergaberecht — ROT / RELEASE-BLOCKER

Noch ungeklärt:

- Rechte-/Lizenzlage der verwendeten digitalen arabischen `quran-uthmani`-Edition;
- Recht, diese konkrete arabische Datei-Edition offline mit der App weiterzugeben;
- Rechte-/Lizenzlage der vollständigen deutschen Abu-Rida-Übersetzung;
- Recht, die vollständige deutsche Übersetzung offline in einer öffentlichen App mitzuliefern;
- ggf. erforderliche Namensnennung/Verlags-/Editionsangabe;
- Auswirkungen einer späteren Monetarisierung.

Bis diese Punkte belegt sind, darf der Block nicht als öffentlich release-freigegeben behandelt werden.

## Fachliche Grenze

Die technische Prüfung beweist die genaue Textidentität. Sie ersetzt keine menschliche theologische/linguistische Freigabe der gewählten Edition oder Übersetzung.

## Ergebnis

`quran-offline-bundle` ist **auf Source-/Textintegritätsebene geprüft**. Der öffentliche Release bleibt unabhängig davon wegen der ungeklärten Rechte/Lizenzen blockiert.
