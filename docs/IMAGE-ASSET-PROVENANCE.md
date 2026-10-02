# Nur Islam – Herkunftsnachweis der Laufzeitbilder

**Stand:** 29.09.2026
**Zweck:** Technischer Herkunfts- und Bearbeitungsnachweis für die in der App verwendeten Bildobjekte. Das Dokument ist keine Rechtsberatung und keine pauschale Rechtefreigabe.

## Herkunft

Die ursprüngliche Serie mit sechzehn unten aufgeführten Bildern wurde am 26.08.2026 mit der in Codex eingebauten OpenAI-Bildgenerierung aus ausschließlich neu formulierten Textprompts erzeugt. Es wurden **keine fremden Bilder, Referenzfotos, Markenlogos oder hochgeladenen Werke** als Eingabe verwendet.

Am 27.08.2026 kamen fünf zusammengehörige Gebetslandschaften hinzu: Fajr, Dhuhr, Asr, Maghrib und Isha. Fajr entstand aus Text; die vier Lichtvarianten verwenden ausschließlich dieses eigene Generationsergebnis als Bildreferenz. Alle fünf wurden mit `cwebp -q 85 -m 6 -resize 1200 800` optimiert. Dateipfade, vollständige Prompts, Eingabereferenz und Prüfsummen stehen im Manifest; die Gestaltung und Umschaltlogik in [PRAYER-LANDSCAPES.md](./PRAYER-LANDSCAPES.md).

Die PNG-Ausgaben wurden lokal mit `cwebp -q 88 -m 6` und bei freigestellten Motiven zusätzlich mit `-alpha_q 100` in WebP-Dateien umgewandelt und direkt in `public/premium-assets/high-res-objects/` integriert. Der vollständige maschinenlesbare Datensatz mit Prompt, Einsatzort, Abmessungen und SHA-256-Prüfsumme liegt in [`docs/image-asset-provenance.json`](./image-asset-provenance.json).

## Bildserie

Am 29.09.2026 wurden die zwölf Widget-Motive auf die illustrierte Startseiten-Serie vereinheitlicht. Gebet, Quran, Dhikr und Qibla nutzen bereits vorhandene neue Startseitenbilder. Für Datum, Inspiration, Tagesroutine, Quran-Plan, Gebetswoche, Favoriten, Erinnerungen und Freitag entstanden acht eigene freigestellte 3D-Objekte; die frühere Mischung aus alten Objekt- und Landschaftsmotiven wird in den Widgets nicht mehr verwendet. Die Bilder sind dekorativ, enthalten keine verbindlichen religiösen Texte und ersetzen keine dynamischen Widget-Daten. Eingabereferenzen, Prompts, Originale und SHA-256-Werte stehen im JSON-Manifest.

Am 28.08.2026 folgten acht ausdrücklich stilisierte 3D-Cartoonbilder für die Wudu-Schritte (`wudu-step-*-v1.webp`): runde Figuren statt realistischer Körperdarstellungen. Aus Text mit der integrierten Codex-Bildgenerierung erzeugt; keine Eingabebilder. Je 512 × 512 Pixel, zusammen 295.940 Bytes, Transparenz erhalten, Offline-Cache v25. Prompts und Prüfsummen stehen im Manifest; Darstellung, Aussprachehilfe und offene fachliche Prüfung in [WUDU-VISUAL-GUIDE.md](WUDU-VISUAL-GUIDE.md).

Am 28.08.2026 wurde `wudu-washing-v1.webp` mit der integrierten Codex-Bildgenerierung ohne Referenzbilder erstellt: Waschbecken, Wasser und smaragdgrünes Handtuch als dekoratives 3D-Stillleben. Es ersetzt das Moschee-Motiv ausschließlich im Wudu-Einstieg und stellt keine religiöse Handlungsanweisung dar. Die freigestellte WebP-Datei ist 640 × 640 Pixel groß (80.576 Bytes), Alpha bleibt erhalten. Vollständiger Prompt, Originaldatei und SHA-256 stehen im Manifest; Offline-Cache ab Version 24.

Am 28.08.2026 wurden sechs weitere freigestellte 3D-Miniaturen für die
Gebetszeitenliste erstellt: `prayer-mini-{fajr,sunrise,dhuhr,asr,maghrib,isha}-v1.webp`.
Jedes Motiv entstand separat mit der eingebauten OpenAI-Bildgenerierung aus einem
eigenen Textprompt, ohne Eingabebilder oder fremde Referenzen. Die sechs Prompts,
Originalpfade und vollständigen SHA-256-Werte stehen im JSON-Manifest.
Die Originale bleiben im Generierungsordner erhalten. Optimierung:
`cwebp -q 88 -m 6 -alpha_q 100 -resize 192 192`, echte Transparenz erhalten.
Die Dateien belegen zusammen 54.744 Bytes und werden mit App-Shell-Cache v22
offline vorgehalten. Keine neue KI-Funktion in der App.

Die Reihe bleibt statisch, steht in eigenen 32–44 Pixel breiten Bildspalten und
ersetzt nur die sechs Listensymbole der Gebetsseite. Text, Uhrzeiten und Bedienung
bleiben unabhängig vom Bild. Bei einem Ladefehler erscheint das bisherige Symbol.
Die Motive sind stilisierte Tagesphasen, keine Wetter-, Sonnenstands- oder
Mondphasenberechnung. Sonnenaufgang bleibt ein separater Zeiteintrag, kein
zusätzliches Pflichtgebet. Der große Landschaftsbogen und Start bleiben unverändert.

Am 05.09.2026 kamen zwölf eigens für den Grundlagenpfad erzeugte Motive hinzu.
Sie ersetzen dort mehrfach verwendete, thematisch unscharfe Bestandsbilder. Glaube,
fünf Säulen, Begriffe, Reinheit, Charakter, Gemeinschaft, Seerah und die 25 Propheten
haben damit jeweils ein eigenes, sofort unterscheidbares Motiv. Alle Bilder wurden
ohne Eingabebilder erzeugt, auf 512 × 512 Pixel verkleinert und als transparente
WebP-Dateien eingebunden. Die Prophetenmotive zeigen ausdrücklich keine Personen.

| Datei | Motiv | Einsatz | SHA-256 (gekürzt) |
|---|---|---|---|
| `dome-v2.webp` | Moscheekuppel und Minarette | Start-/Gebetskarten | `3ea1f14f8078…` |
| `quran-closed-v2.webp` | geschlossener Quran auf Rehal | Quran-Karten, Sammlungen, Onboarding | `df6350294104…` |
| `tasbih-v2.webp` | Tasbih | Dhikr und Onboarding | `fc1fd0a41e5d…` |
| `qibla-compass-v2.webp` | Qibla-Kompass | Start-Kurzweg und Onboarding; nicht als Gebetsanzeige | `4b34e66158f7…` |
| `quran-open-v2.webp` | offener Quran auf Rehal | Archivvorgänger; durch artefaktfreies v3 ersetzt | `ccfe37f2036a…` |
| `lantern-v2.webp` | Laterne | Archivvorgänger; durch artefaktfreies v3 ersetzt | `0bcdda4c69f0…` |
| `kaaba-v2.webp` | Kaaba-Miniatur | Hajj; am 28.08.2026 aus dem Qibla-Kompass entfernt, Datei für andere Ansichten erhalten | `7f8ccb76b1f2…` |
| `dua-hands-v2.webp` | Hände in Dua | Duas und Lernflächen | `6ee9fe772007…` |
| `mini-quran-v1.webp` | offener Quran auf Rehal | Schnellkarte „Quran lesen“ und Quran-Verzeichnis | `4477e3fd2bc6…` |
| `mini-prayer-learning-v1.webp` | Gebetsteppich im Mihrab | Schnellkarte „Beten lernen“ und seit 28.08.2026 Einstieg der Lernseite; unverändert wiederverwendet | `93cc17b725ae…` |
| `mini-names-v1.webp` | geometrisches Medaillon | Archivvorgänger der Schnellkarte „99 Namen Allahs“ | `95bdd74c0ffa…` |
| `mini-quiz-v1.webp` | Lernbuch und Antwortkarten | ältere Schnellkarte „Islam Quiz“; weiterhin in der Quiz-Übersicht | `cecdff8c8d40…` |
| `mini-dua-v1.webp` | stilisierte Hände in Dua | Archivvorgänger der Schnellkarte „Duas“ | `dc21677cdf70…` |
| `ayah-focus-bg-v1.webp` | ruhiges Elfenbeinrelief mit Mihrab | Hintergrund „Ayah im Fokus“ auf Start und „Ayah des Tages“ im Quran | `8598b7afb1fb…` |
| `splash-mosque-v1.webp` | symmetrische Moschee mit zwei Minaretten | neue Startanimation | `55ebe82049d…` |
| `home-prayer-sky-v1.webp` | smaragdgrüne Himmelslandschaft mit Randlicht | seit 28.08. Quran-Lesebogen, ab App-Shell-Cache v23; nicht mehr in der Gebetskarte | `fcec44be72d2…` |
| `learning-faith-v2.webp` | Quran auf Rehal und Lichterbogen | Allah und der Glaube | `4e1dfa1d6552…` |
| `learning-pillars-v2.webp` | fünf verbundene Säulen | Die fünf Säulen | `62a2da1b2054…` |
| `learning-terms-v2.webp` | Lernkarten, Lesezeichen und Stift | Wichtige Begriffe | `40f51b368dd0…` |
| `learning-practice-v2.webp` | Wasserkanne, Schale und Tuch | Reinheit und Alltag | `9a8371652f75…` |
| `learning-character-v2.webp` | Olivenbaum mit drei Zweigen | Charakter und Rechte | `8ba080d9ff35…` |
| `learning-community-v2.webp` | verbundener Innenhof mit Brunnen | Miteinander und Verantwortung | `e21e6326a023…` |
| `learning-seerah-v2.webp` | Reisekarte, Höhle und Laterne | Der Prophet ﷺ und Seerah | `1db93adaabd4…` |
| `learning-prophets-v2.webp` | Schriftrolle, Laterne und Geschichtsweg | Die 25 Propheten | `577fa4e21599…` |
| `learning-madhhabs-v2.webp` | vier Bücher unter vier Bögen | Die vier Rechtsschulen | `8d397611903b…` |
| `learning-hadith-v2.webp` | Archivfolien, Tintenfass und Lupe | Hadith-Sammlung | `527d5172b32d…` |
| `learning-sunnah-v2.webp` | Datteln, Wasser, Miswak und Tuch | Sunnah im Alltag | `e39409d3540d…` |
| `learning-repentance-v2.webp` | Rückweg durch offenen Bogen zum Morgenlicht | Fehler und Reue | `8ef7ac770447…` |

Die Quran-Anpassung vom 28.08.2026 verwendet ausschließlich diese zwei vorhandenen
Dateien unverändert. Kein neuer Generierungsauftrag, keine veränderten Hashes.
Der offene Lesebogen behält den tatsächlichen Lesestand; die ruhige Himmelsgrafik
ist dekorativ und zeigt keine aktuelle Tagesphase an. Die 3D-Buchminiatur steht
neben dem Verzeichnishinweis, nicht hinter Text und nicht als Ersatz für Surennummern.

## Bildabgleich vom 24.09.2026

Nach einer Prüfung der Start-, Gebets-, Quran-, Lern-, Widget- und Service-Motive
wurden sieben freigestellte Motive neu erzeugt oder aus eigenen Bestandsbildern
bereinigt. Die früheren Dateien bleiben als Herkunftsbeleg erhalten, sind aber
an den betroffenen Stellen nicht mehr die aktive Bildfassung.

| Neue Datei | Einsatz | Änderung |
|---|---|---|
| `lantern-v3.webp` | Fastenplan, Erinnerungen, Hadith | Blockartefakte der eigenen v2-Laterne entfernt |
| `quran-open-v3.webp` | Reader, Lernen, Widget | Blockartefakte des eigenen v2-Buchs entfernt; keine generierten lesbaren Verse |
| `mini-names-v2.webp` | Lernkarte „99 Namen“ | symbolische Sammlung statt generischem Medaillon; Tafeln bewusst ohne erfundene Namen |
| `calendar-object-v1.webp` | Kalenderkarten und Widget | zeitloses Objekt ohne fest eingedrucktes Datum; das echte Datum bleibt App-Text |
| `bookmark-v3.webp` | Sammlung und Favoriten-Widget | klareres, eigenständiges Lesezeichen |
| `prayer-standby-v1.webp` | Standby-Gebetsanzeige | gebetsbezogenes Display statt Qibla-Kompass |
| `zakat-scale-v1.webp` | Zakat-Rechner | Waage statt sachfremdem Lesezeichen; keine Berechnungsbehauptung im Bild |

Die fünf neuen Objekte entstanden aus Text, die zwei Bereinigungen ausschließlich
aus den oben genannten eigenen v2-Dateien. Die PNG-Originale bleiben im
Generierungsordner. Das Manifest enthält Eingaben, SHA-256, Abmessungen,
Verarbeitung und **archivarische Prompt-Zusammenfassungen** dieser sieben Bilder;
die ursprünglichen Tool-Aufrufe wurden nicht als wörtliches Promptprotokoll
gespeichert. Die WebP-Dateien wurden mit `cwebp -q 88 -m 6 -alpha_q 100`
und proportionaler Verkleinerung erzeugt. Der [Bildabgleich](./IMAGE-CONSISTENCY-REVIEW-2026-09-24.md)
erklärt die bewusste Trennung der vier Bildfamilien.

## Nachprüfung vom 25.09.2026

Bei der erneuten Sichtprüfung fiel auf, dass das archivierte
`mosque-gold-v2.webp` trotz Laufzeit-Alias weiterhin direkt im Onboarding, in
der Moschee-Suche und in CSS stand. Ein neues, **symbolisches** Moscheemotiv
`mosque-heritage-v1.webp` ersetzt diese Verweise sowie die flache Ersatzgrafik
im Einstieg zu den islamischen Orten. Es ist keine Abbildung einer bestimmten
Moschee und kein Nachweis für einen Ort. Die Altfassungen wurden nicht gelöscht.

Das neue Motiv entstand per eingebauter Bildgenerierung aus Text. Ein zweiter
Bildgenerierungsdurchgang verwendete den eigenen Erstentwurf zur Kantenkorrektur;
die beiden Original-PNGs, das finale WebP, die Größen und die Prüfsumme stehen
im Manifest. Feinste Farbsäume an transparenten Kanten können in starker
Vergrößerung weiterhin sichtbar sein.

Die direkte Sichtprüfung im Moschee-Finder zeigte, dass die Freistellung dort
wie ein angeschnittener Aufkleber wirkte. Nur diese Kartenfläche nutzt daher
`mosque-finder-arch-v1.webp`: eine neue, breit angelegte, fotorealistische
Architektur-Illustration ohne konkreten Ortsbezug. Das Bild entstand mit dem
eingebauten Bildgenerator ohne Fremdbild als Eingabe und wurde zu WebP
verkleinert. Der sichtbare Hinweis „Illustrative Ansicht“ trennt das Motiv von
den tatsächlichen OpenStreetMap-Suchergebnissen.

## Sechs Startkarten vom 26.09.2026

Nach einer ersten Angleichung wirkte die Startseite weiterhin uneinheitlich.
`mini-prayer-learning-v1.webp` bleibt deshalb die konkrete Stilvorlage:
illustrierte Miniatur, erhöhter Dreiviertelblick, Smaragdstoff, satinierter
Messingrand, cremefarbener Stein und warmes Licht. Sechs weitere Startmotive
wurden mit diesem Bild als **reiner Stilreferenz** neu erstellt: Quran,
Dhikr, Qibla, 99 Namen, Quiz und Duas. Die vorherigen Dateien bleiben
erhalten und können außerhalb der Startseite weiter verwendet werden.

Die neuen Startmotive sind `quran-closed-v3.webp`, `tasbih-v3.webp`,
`qibla-compass-v3.webp`, `mini-names-v5.webp`, `mini-quiz-v3.webp` und
`mini-dua-v3.webp`. Der Kompass behauptet keine berechnete Richtung;
religiöse Namen und Verse stehen nur als geprüfter App-Text, nicht im Bild.
Exakte Generierungs-Prompts, Eingabereferenz, SHA-256-Werte, Abmessungen und
Verarbeitung stehen im Manifest. Die fünf Gebetslandschaften wurden nicht
verändert.

## Drei alternative Startmotive vom 26.09.2026

Die vier Entdecken-Karten auf der Startseite verwenden jetzt ebenfalls die
Quran-Illustration als Material- und Lichtvorlage, aber eigenständige,
gegenständliche Motive: `home-learn-prayer-v2.webp` (Gebetsteppich),
`home-names-v1.webp` (Lernkarten), `home-quiz-v1.webp` (Frage- und
Antwortkarten) und `home-duas-v1.webp` (Notizbuch und Laterne). Auf den zwei
beschrifteten Motiven stehen nur die geprüften Kategoriebezeichnungen
„99 NAMEN“ und „DUA“; religiöse Inhalte bleiben App-Text. Die älteren
Miniaturen bleiben für andere Ansichten erhalten. Prompts, Quellen, Zuschnitt
und Prüfsummen stehen im Manifest.

Am 27.09.2026 wurden nur zwei Motive der vier Entdecken-Karten nachgeschärft:
`home-quiz-v2.webp` ergänzt das Wort „QUIZ“ unter dem Fragezeichen;
`home-duas-v2.webp` vergrößert „DUA“ auf der Buchseite. Beide behalten
transparenten Hintergrund und dieselbe Materialwelt. Die v1-Dateien bleiben
unverändert erhalten; Prompt und Prüfsummen der v2-Bilder stehen im Manifest.

Die drei erprobten 3D-Motive heißen `home-quran-illustrated-v1.webp`,
`home-qibla-illustrated-v1.webp` und `home-dhikr-illustrated-v1.webp`.
Die Quran-Weiterlesenkarte ist kompakter und zeigt das Buch klein rechts vom
Lesestand statt groß über dem Text. Qibla und Dhikr verwenden ihre Motive
weiterhin nur auf Start. Andere App-Bereiche bleiben unverändert. Der
Kompass ist dekorativ und zeigt keine berechnete Qibla-Richtung. Bildaufträge,
Prüfsummen und Maße stehen im Manifest.

## Lernseite vom 28.09.2026

Die Lernseite übernimmt vier vorhandene Motive direkt aus Start und Gebet:
Quran, Gebetsteppich, Qibla-Kompass und die Karten der 99 Namen. Hinzu kommen
das vorhandene Wudu-Becken und die Kaaba. Für Inhalte ohne passende Vorlage
gibt es 13 neue, freigestellte 3D-Illustrationen: den Gebetsablauf und zwölf
thematisch getrennte Kapitelmotive. Die Serie teilt Smaragd,
Elfenbein, Walnuss, zurückhaltendes Messing, warmes Licht und einen erhöhten
Dreiviertelblick. Sie ersetzt dort die früheren, unterschiedlich stark
ornamentierten Miniaturen; andere App-Bereiche behalten ihre Bilder.

Die bereits vorhandenen Bilder `home-quran-illustrated-v1.webp` und
`home-learn-prayer-v2.webp` dienten zugleich als Stilreferenzen. Das vorhandene
`kaaba-v2.webp` wird direkt für Hajj genutzt. Die fünf Gebetslandschaften bleiben bewusst erhalten, weil sie
Tagesphasen und keine Lernobjekte darstellen.

Religiöse Namen, Verse und Lernanweisungen stehen weiterhin als App-Text. Die
neuen Bilder enthalten keine generierte arabische Schrift und keine
Prophetenabbildungen. Alle 13 finalen neuen Pfade, PNG-Quellen, Referenzbilder,
archivarischen Prompt-Zusammenfassungen, Abmessungen und SHA-256-Werte stehen
im JSON-Manifest. Das ist ein Herkunftsnachweis, keine fachliche oder
rechtliche Freigabe.

## Code-native Vektormarke

`nur-logo-emblem-v3.svg` wurde lokal als eigenständige geometrische SVG aus Pfaden und Farbverläufen konstruiert. Sie verwendet weder ein fremdes Bild noch eine generierte Rastervorlage. Dadurch bleibt das Nur-Logo auf jeder Displaydichte exakt scharf. Die vollständige Prüfsumme `b004f63db84d234aa1acb3c04b16440f8fe4e1c76a4bc97745b7dc190bc3a333` und der Einsatzort sind ebenfalls im maschinenlesbaren Manifest hinterlegt.

## Gestaltungs- und Sicherheitsregeln der Prompts

- einheitliche originale Bildsprache: dunkles Smaragd, gealtertes Gold, Walnuss und warmes Elfenbein;
- keine fremden Logos, Marken, Wasserzeichen oder erkennbaren Personen;
- keine fremden Referenzbilder und keine Anweisung, einen lebenden Künstler oder eine konkrete fremde Arbeit zu kopieren; die Gebetsserie verwendet nur ihre eigene Fajr-Generation als Referenz;
- keine lesbare arabische Schrift in generierten Bildern, damit kein fehlerhafter religiöser Text entsteht;
- respektvolle, sachliche Darstellung religiöser Gegenstände;
- transparente Hintergründe für freigestellte Motive und textarme Flächen für Kartenhintergründe.

## Gebetshaltungen vom 29.08.2026

Sieben neue freigestellte 3D-Cartoonbilder zeigen Takbir, Qiyam, Ruku,
Aufrichten, Sujud, Sitzen und die erste Richtung des Taslim. Die Qiyam-Generation
ist die eigene Stil- und Figurenreferenz der Serie; es wurde kein fremdes Bild
verwendet. Die weiteren sechs Bilder wurden daraus als neue Posen erzeugt.

Die Bilder sind bewusst nur Lernhilfen. Schriftliche Anweisung, Aussprachehilfe,
Quellen und die Hinweise zu Rechtsschulunterschieden bleiben maßgeblich. Beim
Aufstehen zeigt das Bild die erreichte aufrechte Haltung. Beim Taslim zeigt es
die erste Kopfdrehung; die zweite Richtung steht weiterhin ausdrücklich im Text.
Alle Quelldateien, Prompts, Verarbeitungsschritte und SHA-256-Prüfsummen stehen
im maschinenlesbaren Manifest.

## Rechtliche Einordnung

Die am 26.08.2026 geprüften [OpenAI-Nutzungsbedingungen für Europa](https://openai.com/policies/eu-terms-of-use/) erklären im Verhältnis zwischen Nutzer und OpenAI, dass der Nutzer – soweit rechtlich zulässig – Output besitzt und OpenAI seine etwaigen Rechte daran überträgt. Dieselben Bedingungen weisen darauf hin, dass KI-Ausgaben nicht zwingend einzigartig sind und vor Verwendung geprüft werden müssen.

Das bedeutet **nicht automatisch**, dass jede KI-Grafik in Deutschland als urheberrechtlich geschütztes Werk gilt oder dass keinerlei Ähnlichkeit zu Drittrechten bestehen kann. Deshalb bleibt vor einem kommerziellen Release eine qualifizierte rechtliche Prüfung sinnvoll. Dieser Nachweis verbessert die Beweiskette: eigener Prompt, keine Fremdbilder als Input, dokumentierte Erzeugung, feste Prüfsumme und klarer Einsatzort.

Die [OpenAI Service Terms](https://openai.com/policies/service-terms/) enthalten je nach Vertrag zusätzliche Regeln und Ausnahmen. Welche Vertragsfassung konkret gilt, hängt vom verwendeten Konto bzw. Tarif ab.

## Release-Prüfung

`npm run image-provenance:check` vergleicht die dokumentierten SHA-256-Werte mit den Dateien im Repository. Jede spätere Änderung an einem Bild muss zusammen mit Prompt, Datum und neuem Hash im Manifest dokumentiert werden.

## Entfernt am 27.08.2026

Das Kachelbild `mini-assistant-v1.webp` wird nach Entfernung des Assistenten nicht mehr ausgeliefert. Sein früherer Prompt und seine Prüfsumme bleiben unter `retiredAssets` im Manifest nachvollziehbar. Alle übrigen Bildnachweise bleiben unverändert.
