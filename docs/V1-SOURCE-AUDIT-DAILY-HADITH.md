# V1 Source Audit — Daily Hadith Rotation

Status: **source-audited / GRÜN**

> Dieser Status ist eine Quellenprüfung und **keine** erfundene Gelehrten- oder Human-Freigabe. Der bestehende religiöse Release-Gate bleibt unverändert, bis seine Strategie ausdrücklich entschieden wird.

## Öffentlicher Daily-Pool

Nur die folgenden sieben IDs rotieren automatisch auf Home:

| ID | Aussage der App | Primärbelege | Audit |
| --- | --- | --- | --- |
| `intentions` | Der Wert einer Handlung hängt von der Absicht ab. | Sahih al-Bukhari 1; Sahih Muslim 1907 | GRÜN |
| `mercy` | Wer anderen keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt. | Sahih al-Bukhari 6013; Sahih Muslim 2319a | GRÜN |
| `good-word` | Ein gutes Wort gilt als Wohltätigkeit. | Sahih al-Bukhari 2989; Sahih Muslim 1009 | GRÜN |
| `anger` | Wirkliche Stärke zeigt sich darin, sich im Zorn zu beherrschen. | Sahih al-Bukhari 6114; Sahih Muslim 2609 | GRÜN |
| `brother` | Vollständiger Glaube schließt ein, für andere das Gute zu wünschen, das man für sich selbst wünscht. | Sahih al-Bukhari 13; Sahih Muslim 45 | GRÜN |
| `ease` | Erleichtert und erschwert nicht; gebt frohe Botschaft und schreckt nicht ab. | Sahih al-Bukhari 69; Sahih Muslim 1734 | GRÜN |
| `cleanliness` | Reinheit besitzt im Glauben einen hohen Stellenwert. | Sahih Muslim 223 | GRÜN |

## Ergebnis

- **7/7** rotierende Hadithe besitzen konkrete starke Referenzen.
- Die deutschen Texte sind ausdrücklich als **sinngemäße Inhaltsangaben** gekennzeichnet.
- Keine der sieben Kurzfassungen wurde im Audit stärker formuliert als der zugrunde liegende Text.
- Kein schwach eingestufter Hadith befindet sich im automatischen Daily-Pool.
- Der größere Legacy-Hadithbestand bleibt getrennt und wird nicht automatisch in die Rotation aufgenommen.

## Regression-Schutz

`src/data/hadithData.test.ts` hält jetzt fest:

- exakt diese sieben IDs bilden den Daily-Pool;
- jede dieser IDs behält ihre konkrete Bukhari-/Muslim-Referenz;
- kein Daily-Eintrag darf eine `Da’if`-Kennzeichnung tragen;
- die Rotation bleibt auf den kuratierten Pool begrenzt.

## Noch nicht behauptet

Dieser Audit bedeutet **nicht**, dass der gesamte Legacy-Hadithbestand fachlich freigegeben ist. Er betrifft ausschließlich den sieben Einträge umfassenden automatischen Daily-Pool von Release 1.
