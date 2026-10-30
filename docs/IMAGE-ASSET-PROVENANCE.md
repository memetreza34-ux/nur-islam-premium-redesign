# Nur Islam – Herkunftsnachweis der Laufzeitbilder

## Designvereinheitlichung · 18.10.2026

Der Zakat-Rechner verwendet ein eigenes freigestelltes Rechner-/Münzmotiv statt des Herzbildes. Erzeugt mit der eingebauten Bildgenerierung; die eigenen Fasten- und Quran-Illustrationen dienen ausschließlich als Stilreferenzen. Keine Schrift, Zahlen oder religiösen Aussagen im Motiv. Original und vollständiger Prompt: [Generierungsnachweis](../output/imagegen/design-unification-20261018/prompts.json). Die WebP-Ausgabe ist 512 × 512 Pixel groß, Alpha bleibt erhalten. Das Manifest enthält nun 95 generierte Laufzeitbilder einschließlich dieses Motivs. Die Ummah-Übersicht nutzt das bereits vorhandene Globusmotiv unverändert.

## Aktuelles App-Logo · 16.10.2026

Arman wählte die 3D-Moschee und beauftragte den Einbau. Die ursprüngliche eigene Icon-Generation wurde mit der eingebauten Codex-Bildgenerierung vereinfacht: weniger Fenster, Bänder und Zierlinien. Original und vollständiger Bearbeitungsprompt: `output/imagegen/brand-mosque-20261016/`. Die aktive WebP-Datei ist 512 × 512 Pixel groß; PNGs in 180/192/512 Pixel und eine gepolsterte maskierbare Version dienen der Installation. Das SVG-App-Icon bettet dieselbe WebP-Grafik ein; es ist keine neue Vektorzeichnung. SHA-256-Werte stehen im Bildmanifest. Die früheren Vektorlogo-Einträge sind historische Bestände, keine aktive Markenverwendung. App-Shell ab v115. Die drei Favoriten sind in `docs/BRAND-DIRECTION-2026-10-16.md` festgehalten.

**Stand:** 15.10.2026
**Zweck:** Technischer Herkunfts- und Bearbeitungsnachweis für die in der App verwendeten Bildobjekte. Das Dokument ist keine Rechtsberatung und keine pauschale Rechtefreigabe.

## Herkunft

Am 15.10.2026 wurde anschließend auch das Hintergrundbild der Ayah-Karten aus den App-Dateien entfernt und mit Hash-Nachweis archiviert. Karten und Ayah-Detail verwenden eine einfarbige Cremefläche (`#f6eddc`) ohne Bild oder Muster; Shell-Cache v99 enthält die alte Hintergrunddatei nicht mehr.

Am 15.10.2026 wurde die neue Objektserie appweit eingebaut: Einstieg, Widgets, Sammlungen, Dhikr, Moscheesuche, Anleitungen und Detailseiten verwenden passende vorhandene neue Motive. Alte dekorative Objekte werden nicht mehr gerendert oder im App-Shell-Cache vorgehalten; 104 historische Objektdateien sind außerhalb der ausgelieferten App unter `output/image-archive/pre-unified-20261015/` archiviert; Herkunftsbelege und Hash-Prüfung bleiben erhalten. Die [vollständige Zuordnung](ILLUSTRATION-REPLACEMENTS-2026-10-15.json) dokumentiert jede Ersetzung. Gebetslandschaften, Anfangsszenen, konkrete Ortsbilder und lehrende Wudu-/Gebetshaltungen bleiben erhalten. Keine neue Bildgenerierung. Cache v97.

Dasselbe neue Buchmotiv wird am 15.10.2026 auch im Quran-Verzeichnis und im Kopf der Leseansicht unverändert verwendet. Der Landschaftshintergrund bleibt erhalten. Keine neue Bilddatei oder Generierung; App-Shell-Cache v96.

Das schlichte neue Buch auf dem Lesepult (`learn-hub-book-v1.webp`) wird zusätzlich unverändert auf der Quran-Fortsetzungskarte der Startseite verwendet. Es ersetzt dort das ältere verzierte Motiv. Keine neue Generierung oder Änderung der Bilddatei; der vorhandene Herkunftsnachweis gilt weiter. App-Shell-Cache v95.

Auf anschließenden Betreiberwunsch füllen die fünf unveränderten v1-Gebetslandschaften die gesamte jeweilige Zeile unter „Einzeln üben“. Der vorherige kleine Vorschaubereich entfällt. Nur CSS-Framing und Textkontrast wurden angepasst: helle Beschriftung bei Fajr, Maghrib und Isha; dunkle Beschriftung mit heller lokaler Kontrastfläche bei Dhuhr und Asr. Keine neue Bildgenerierung, keine Änderung der Landschaftsdateien oder Gebetsdaten. App-Shell-Cache v94.

Die Lernübersicht wurde danach vollständig auf breite Zeilen umgestellt: drei Vorbereitungsaktionen, fünf einzelne Gebete, Kapitelwahl und alle 14 Grundlagen-/Vertiefungseinträge. Elf neue freigestellte, bewusst schlichte 3D-Lernmotive verwenden ausschließlich die eigene Kaaba und den eigenen Gebetsteppich als Stilreferenzen. Vorhandene neue Motive für Gebet, Qibla, Namen, Duas und Moschee werden unverändert wiederverwendet. Die bisherigen fünf Gebetslandschaften bleiben als kleine Vorschaubilder erhalten. Keine Darstellung von Allah oder Propheten, keine generierte arabische Schrift; „25“ ist allein die Kursanzahl. [Originale und vollständige Prompts](../output/imagegen/learning-rows-20261014/prompts.json), Alpha und SHA-256 sind dokumentiert; Offline-Cache v93. Ältere Lernmotive bleiben im Archiv, werden aber nicht mehr unnötig im App-Shell-Cache vorgehalten. Kursinhalte und Lernfortschritt wurden nicht geändert.

Die sechs Kurzwege „Direkt weiter“ auf der Gebetsseite wurden anschließend ebenfalls als breite Zeilen umgesetzt. Beten lernen, Qibla, Duas und Dhikr verwenden die neuen Startmotive unverändert. Für Moscheen und Fastenplan wurden zwei neue ruhige 3D-Illustrationen erzeugt: eine vereinfachte Moschee sowie Datteln und Wasser als dekoratives Fastensymbol. Die eigene Kaaba und der eigene Gebetsteppich dienen als Stilreferenzen. [Originale und vollständige Prompts](../output/imagegen/prayer-companion-rows-20261014/prompts.json), Alpha und Prüfsummen sind dokumentiert; alle sechs Pfade nutzen die gemeinsame Asset-Version und Offline-Cache v92.

Am 14.10.2026 wurden auf Betreiberwunsch ausschließlich die sechs Startmotive als vereinfachte 3D-Cartoon-/Emoji-Serie neu erzeugt: Dhikr, Qibla, Beten lernen, 99 Namen, Quiz und Duas. Die vom Betreiber hochgeladene Bildschirmaufnahme war diesmal ausdrücklich Bild-Eingabe und dient der allgemeinen Illustrationsrichtung; die Oberfläche und Beschriftungen wurden nicht kopiert. Die neuen stilisierten Dua-Hände bilden die eigene gemeinsame Stilreferenz der übrigen fünf Motive. Glatte Oberflächen und große klare Formen ersetzen die vorherigen realistischen Texturen. [Originale, Eingaberollen und vollständige Prompts](../output/imagegen/cartoon-home-icons-20261014/prompts.json) sind gespeichert. Die breiten Zeilen bleiben erhalten; andere App-Bereiche werden nicht geändert. Transparente WebP-Dateien mit 512 × 512 Pixeln und SHA-256 stehen im Manifest und Offline-Cache v91. Die vorherigen Versuche bleiben als Archiv erhalten.

Vor der Cartoon-Serie wurden die vier Startmotive auf Betreiberwunsch als einheitliche Serie überarbeitet: matte Materialien, Waldgrün/Teal, warmes Elfenbein und kleine Messingakzente. Jedes vorherige Motiv war Bearbeitungsziel; das bereits akzeptierte Dhikr-Bild war jeweils die gemeinsame Stilreferenz. Originale, Eingaberollen und [Prompts](../output/imagegen/unified-home-discovery-20261014/prompts.json) sind gespeichert. Die vorherige bunte Variante bleibt als Archiv erhalten; diese Versionen wurden nur auf den vier Startkarten verwendet und im damaligen Offline-Cache v89 vorgehalten.

Die vier Startkarten Beten lernen, 99 Namen Allahs, Islam Quiz und Duas wurden am 14.10.2026 im selben kompakten Objektstil ergänzt. Blau, Terrakotta, Koralle, Gelb und natürliche Hautfarben erweitern die bisherige Farbpalette auf Betreiberwunsch. Alle vier wurden aus eigenen Textprompts mit der eingebauten Codex-Bildgenerierung erstellt. [Originale und Prompts](../output/imagegen/home-discovery-20261014/prompts.json) sind gespeichert; die transparenten WebP-Laufzeitbilder und ihre SHA-256-Werte stehen im Manifest. Religiöse Beschriftungen werden nicht erfunden; „99“ und „?“ dienen als einfache Funktionssymbole. Die Änderung betrifft ausschließlich die vier Startkarten.

Am 14.10.2026 wurden zwei kompakte Objektillustrationen als Stilversuch ausschließlich auf den Startkarten Dhikr und Qibla eingebaut. Gebetskette auf gefaltetem Tuch und Kaaba mit kleinem symbolischem Kompass wurden mit der eingebauten Codex-Bildgenerierung aus eigenen Textprompts erzeugt. Die Referenz im Chat diente der gestalterischen Richtung und wurde nicht als Bild-Eingabe übertragen. Originale mit Transparenz und [vollständige Prompts](../output/imagegen/compact-shortcuts-20261014/prompts.json) liegen im Projekt. WebP-Dateien mit 512 × 512 Pixeln, Alpha erhalten; ältere Bilder bleiben in anderen App-Bereichen aktiv. Der kleine Kompass ist dekorativ und zeigt keine berechnete Richtung.

Am 13.10.2026 wurde eine zusammengehörige Moscheehof-Serie ausschließlich für die Anfangsanimation erstellt; die bisherigen Oasenbilder bleiben in den Gebetsansichten aktiv. Dhuhr wurde mit der eingebauten Codex-Bildgenerierung aus Text erzeugt und für den Textbereich einmal neu gerahmt. Vier Lichtvarianten verwenden ausschließlich diese eigene Vorlage. Alle Originale und vollständigen Prompts liegen in `output/imagegen/prayer-courtyard/`; die fünf ursprünglichen `prayer-*-v2.webp` und die anschließenden v3-Dateien in voller Originalauflösung sind im Manifest mit Hashes dokumentiert. v3 wird ohne Größenänderung mit `cwebp -q 95 -m 6 -sharp_yuv` kodiert; die globalen Abdunklungsflächen wurden für den Einstieg entfernt. Architektur ist fiktiv und dekorativ. Die v1-Oasenbilder bleiben aktiv; die verkleinerten v2-Dateien bleiben als Archiv erhalten. Details: [Moscheehof-Serie](PRAYER-COURTYARD-2026-10-13.md).

Der vollflächige Landschaftseinstieg verwendet `nur-logo-emblem-transparent-v1.svg`, eine transparente Ableitung des gewählten Logos C. Kontur und Farben bleiben erhalten; der smaragdgrüne Hintergrund und die Füllungen der Öffnungen werden transparent. App- und Installations-Icons bleiben unverändert. Kein neuer Bildgenerierungsauftrag; Ableitung und SHA-256 stehen im Manifest.

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
| `splash-mosque-v1.webp` | symmetrische Moschee mit zwei Minaretten | Gebetsbereich; seit 06.10. nicht mehr auf dem Startbildschirm | `55ebe82049d…` |
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

`nur-logo-emblem-v3.svg` wurde am 10.10.2026 nach der ausdrücklichen Auswahl von Variante C als Vektor nachgezeichnet. Die Vorlage `output/logo-concepts-20261010-v2/c-geometrisch.png` stammt aus der eingebauten Bildgenerierung. Die spitze Kuppel, zwei integrierte Minarette und das helle Tor bleiben erhalten; Rasterverläufe wurden durch exakte App-Farben ersetzt. Die Vektorform verwendet Smaragdgrün, Gold und Elfenbein. Der Startbildschirm zeigt nur das Zeichen auf demselben dunklen Grund, ohne Namen oder weiteres Motiv. Auf Wunsch des Nutzers wurde das Zeichen vergrößert, die Spitze verstärkt und die Minarett-Öffnungen verbreitert und vereinfacht. App-Icon, Installations-PNGs und Apple-Touch-Icon nutzen dieselbe Vektorgeometrie. Die PNGs werden mit `scripts/render-logo-icons.swift` aus dem SVG erzeugt; das separate maskierbare Icon hat zusätzlich 20 % Sicherheitsabstand für unterschiedliche Plattformmasken. Das ist ein Herkunftsnachweis, keine Prüfung auf Marken-Einzigartigkeit. Die SVG-Prüfsumme `d07ab621e1a362917eaea051a489447bcab5fb30fe55bd2a92c4c56dc600105d` steht auch im JSON-Manifest.

## Gestaltungs- und Sicherheitsregeln der Prompts

- einheitliche originale Bildsprache: dunkles Smaragd, gealtertes Gold, Walnuss und warmes Elfenbein;
- keine fremden Logos, Marken, Wasserzeichen oder erkennbaren Personen;
- die ursprünglichen Serien ohne fremde Referenzbilder; die Cartoon-Startmotive vom 14.10.2026 verwenden den vom Betreiber hochgeladenen Screenshot als Stil-Eingabe und sind oben gesondert dokumentiert; keine Anweisung zur Kopie eines lebenden Künstlers oder der fremden Oberfläche;
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

Das bedeutet **nicht automatisch**, dass jede KI-Grafik in Deutschland als urheberrechtlich geschütztes Werk gilt oder dass keinerlei Ähnlichkeit zu Drittrechten bestehen kann. Deshalb bleibt vor einem kommerziellen Release eine qualifizierte rechtliche Prüfung sinnvoll. Dieser Nachweis dokumentiert Prompts, verwendete Bild-Eingaben, Erzeugung, feste Prüfsummen und Einsatzorte; die Screenshot-Referenz der neuen Cartoon-Serie ist oben ausdrücklich aufgeführt.

Die [OpenAI Service Terms](https://openai.com/policies/service-terms/) enthalten je nach Vertrag zusätzliche Regeln und Ausnahmen. Welche Vertragsfassung konkret gilt, hängt vom verwendeten Konto bzw. Tarif ab.

## Release-Prüfung

`npm run image-provenance:check` vergleicht die dokumentierten SHA-256-Werte mit den Dateien im Repository. Jede spätere Änderung an einem Bild muss zusammen mit Prompt, Datum und neuem Hash im Manifest dokumentiert werden.

## Entfernt am 27.08.2026

Das Kachelbild `mini-assistant-v1.webp` wird nach Entfernung des Assistenten nicht mehr ausgeliefert. Sein früherer Prompt und seine Prüfsumme bleiben unter `retiredAssets` im Manifest nachvollziehbar. Alle übrigen Bildnachweise bleiben unverändert.

## Sonnenaufgang · 22.10.2026

`prayer-oasis-sunrise-v1.webp` ergänzt die sechs Tagesübersichtszeilen. Erzeugt mit Codex Built-in Imagegen als Beleuchtungsvariante von `prayer-oasis-dhuhr-v2.webp`; Motiv, Kamerawinkel und Bildwelt bleiben an der bestehenden Serie orientiert. Prompt und Original: `output/imagegen/prayer-sunrise-20261022/`. SHA-256 und Verarbeitung stehen im JSON-Manifest. Rein dekorativ, keine berechnete Sonnenposition. Das Motiv ist Teil des Offline-Caches v118.
