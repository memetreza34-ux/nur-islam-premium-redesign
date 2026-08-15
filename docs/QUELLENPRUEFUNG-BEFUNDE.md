# Quellenprüfung — Befunde

Stand: 15. August 2026 · Branch `premium-design-finish`

Diese Prüfung beantwortet **eine** Frage: stimmt die angegebene Belegstelle mit
dem überein, was dort tatsächlich steht? Sie ersetzt nicht die fachliche
Freigabe aus [INHALTE-PRUEFUNG.md](INHALTE-PRUEFUNG.md) — normative Aussagen
(was Pflicht ist, was gilt, wie eine Rechtsschule urteilt) entscheidet ein
qualifizierter Mensch, nicht diese Liste.

## Wie geprüft wurde

| Sammlung | Weg |
|---|---|
| Sahih al-Bukhari, at-Tirmidhi, Abu Dawud, Ibn Majah | offene `eng-*`-Ausgaben, Nummerierung stimmt mit sunnah.com überein (an bekannten Ankern geprüft) |
| Sahih Muslim | sunnah.com direkt — die offene Ausgabe zählt anders (dort ist 2319 eine andere Überlieferung als die zitierte) |
| Quran | gegen den **eigenen Offline-Bestand** der App, `public/data/quran` |

Jede Nummer wurde aufgeschlagen und die Überlieferung gegen die deutsche
Inhaltsangabe gelesen. Keine Nummer stammt aus dem Gedächtnis.

---

## Erledigt

### Hadith-Sammlung — 25 → 20 Einträge, alle mit Nummer

**Alle 13 vorhandenen Belegstellen waren richtig.** Kein einziger falscher
Verweis.

**Fünf Einträge waren Dubletten.** Der Altbestand trug dieselbe Überlieferung
zweimal: einmal mit Nummer, einmal ohne. Die Tagesrotation zeigte sie damit
zweimal je Zyklus, in unterschiedlichem Wortlaut und mit unterschiedlich
genauer Quelle. Zusammengeführt, jeweils mit der geprüften Nummer und der
ausführlicheren Erklärung des Paares:

| zusammengeführt | Beleg |
|---|---|
| Absichten + Absicht der Taten | Sahih al-Bukhari 1; Sahih Muslim 1907 |
| Für den anderen + Für den Bruder wünschen | Sahih al-Bukhari 13; Sahih Muslim 45 |
| Erleichtern + Erleichtern statt erschweren | Sahih al-Bukhari 69; Sahih Muslim 1734 |
| Reinheit + Reinheit | Sahih Muslim 223 |
| Freundlichkeit + Das Lächeln als Sadaqa | Jami at-Tirmidhi 1956 |

Ein Lesezeichen auf der entfernten Hälfte geht nicht verloren — `MERGED_HADITH_IDS`
führt es auf den verbliebenen Eintrag.

**Die zwölf fehlenden Nummern sind nachgetragen**, jede aufgeschlagen und
gegengelesen:

| Eintrag | vorher | jetzt |
|---|---|---|
| Quran lernen und lehren | Sahih al-Bukhari | Sahih al-Bukhari 5027 |
| Zunge und Hand | Sahih al-Bukhari | Sahih al-Bukhari 10 |
| Gutes sprechen oder schweigen | Bukhari & Muslim | Sahih al-Bukhari 6018; Sahih Muslim 47 |
| Barmherzigkeit auf der Erde | Sunan at-Tirmidhi | Jami at-Tirmidhi 1924 |
| Die fünf Säulen | Bukhari & Muslim | Sahih al-Bukhari 8; Sahih Muslim 16 |
| Aufrichtiger Rat | Sahih Muslim | Sahih Muslim 55 |
| Was einen nichts angeht | Sunan at-Tirmidhi | Jami at-Tirmidhi 2317 |
| Der starke Gläubige | Sahih Muslim | Sahih Muslim 2664 |
| Gottesfurcht im Alltag | Sunan at-Tirmidhi | Jami at-Tirmidhi 1987 |
| Beständigkeit | Bukhari & Muslim | Sahih al-Bukhari 6464; Sahih Muslim 783 |
| Wissen suchen | Sahih Muslim | Sahih Muslim 2699 |
| Umgang mit der Familie | Sunan at-Tirmidhi | Jami at-Tirmidhi 3895 |

`check-hadith-data.mjs` lässt jetzt keinen Eintrag ohne Nummer mehr durch
(Budget 0) und weist zwei Einträge mit derselben Belegstelle als Dublette ab.

### Duas — 31 von 34 Belegstellen verifiziert

Alle geprüften Verweise stimmen. Ein Verdachtsfall löste sich beim Nachlesen
auf: **Sahih al-Bukhari 2893** wirkt zunächst falsch (die Überlieferung handelt
von Abu Talha und Khaibar), enthält das Bittgebet gegen Sorge und Trauer aber
weiter hinten im selben Text.

Drei Belege sind Band/Seite-Angaben außerhalb der sechs Sammlungen und mit
diesen Mitteln nicht prüfbar. Sie sind in der App bereits als Einordnung des
Altbestands gekennzeichnet und bleiben für die fachliche Prüfung offen:

- Ahmad 1/391 (Bei Kummer und Trauer)
- Ibn Hibban 974 (Wenn etwas zu schwer fällt)
- Al-Hakim 1/545 (Bitte um Barmherzigkeit)

### Quran-Stellen — 18 von 18 richtig

Jede Stelle zeigt den Vers, den der Eintrag behauptet. Neu: `quran-citations:check`
in der Prüfkette schlägt fehl, sobald eine Stelle auf einen Vers zeigt, den es
nicht gibt — der Fehler, der jedes Korrekturlesen überlebt, weil die Zahl
plausibel aussieht und niemand Verse zählt. `npm run quran-citations:report`
druckt jede Stelle mit ihrem Vers für die fachliche Prüfung.

### Falsch angegebene Quran-Übersetzung — behoben

**Die App liefert nicht die Übersetzung, die sie nennt.** Die Lizenzangabe
führte „Bubenheim & Elyas", der Offline-Bestand ist zeichengenau die Wiedergabe
von **Abu Rida Muhammad ibn Ahmad ibn Rassoul** (`de.aburida`). An zwei Stellen
gegen beide Ausgaben geprüft (2:201 und 18:10).

Drei Stellen waren betroffen und sind angeglichen:

1. `legalContent.ts` nennt jetzt den tatsächlich ausgelieferten Übersetzer.
2. `quranService.ts` holte im Online-Fallback `de.bubenheim` — eine Sure über
   diesen Weg wäre in einer **anderen** deutschen Wiedergabe erschienen als
   dieselbe Sure offline, ohne Hinweis auf dem Bildschirm. Jetzt `de.aburida`.
3. `check-quran-data.mjs` hielt die falsche Ausgabe fest. Jetzt prüft es
   Bestand, Fallback und Lizenzangabe gegeneinander, mit einem Fingerabdruck
   auf 2:201.

Der arabische Text ist wie angegeben Uthmani.

> **Für Arman:** ob die App Abu Rida oder Bubenheim & Elyas ausliefern *soll*,
> ist eine Lizenz- und Inhaltsfrage, keine technische. Beide sind
> urheberrechtlich geschützte Werke, die hier vollständig offline mitgeliefert
> werden. Die Lizenzangabe stimmt jetzt mit dem überein, was ausgeliefert wird —
> ob die Weitergabe erlaubt ist, ist damit **nicht** geklärt.

---

## Offen — Entscheidung nötig

### Ummah-Zahlen (17 Einträge) ⚠️

Die Zahlen sind undatiert und ohne Quelle. Gegen die Erhebung des Pew Research
Center (Stand 2020, veröffentlicht Juni 2025) weichen schon die vier größten
deutlich ab:

| Land | App | Pew, Stand 2020 |
|---|---:|---:|
| Indonesien | 231 Mio. | ~240 Mio. |
| Pakistan | 212 Mio. | 227 Mio. |
| Indien | 200 Mio. | 213 Mio. |
| Bangladesch | 153 Mio. | 151 Mio. |

Für alle 17 Länder braucht es **eine** datierte Tabelle. Ein Flickenteppich aus
Einzelquellen mit unterschiedlichen Stichjahren wäre schlechter als der jetzige
Hinweis, dass die Zahlen undatiert sind. Zwei Wege:

- Pews Tabelle „Religious Composition by Country, 2010–2020" beziehen und alle
  17 Werte daraus ersetzen, mit Stichjahr in der Anzeige, oder
- die absoluten Zahlen entfernen und nur Länder, Anteile und Einordnung zeigen.

Das ist eine Produktentscheidung und wird deshalb nicht im Vorbeigehen getroffen.

---

## Noch nicht geprüft

Die Quellenprüfung deckt Hadith, Duas und Quran-Stellen ab — die Blöcke, die
eine nachschlagbare Belegstelle tragen. Offen bleiben:

| Block | Einträge | warum offen |
|---|---:|---|
| Anleitungen zur Praxis | 102 | überwiegend normativ (Qasr, Nachholen, Sujud as-Sahw) — Fiqh |
| Islam-Quiz | 60 | Frage, richtige Antwort und Erklärung gemeinsam zu prüfen |
| Gebetsablauf (Rakʿah) | 16 | Wortlaut, Umschrift und Zusammensetzung, schulabhängig |
| Kalendertermine | 15 | Hijri-Datum und Bewertung der Begehung |
| Hajj, Umrah, heilige Stätten | 15 | hier verfasst, ohne Vorlage |
| Wissensbibliothek | 12 | Fließtext ohne Einzelnachweise |
| Sunnah im Alltag · Fehler und Reue | 12 | Belegwortlaut mitzuprüfen |
| Propheten | 11 | Einordnung, Kernpunkte, Lehren |
| Unterschiede der Rechtsschulen | 8 | vier Positionen je Punkt — der heikelste Block |

## Ein Hinweis zum Wortlaut

Bei **Umgang mit der Familie** (Jami at-Tirmidhi 3895) sagt der arabische
Wortlaut `لأَهْلِهِ` (*li-ahlihi*, Haushalt/Familie), die englische Übersetzung
auf sunnah.com gibt „wives". Die deutsche Wiedergabe „Familie" folgt dem
Arabischen und ist damit vertretbar; das Kapitel steht allerdings unter den
Vorzügen der Ehefrauen des Propheten ﷺ. Bewusst nicht geändert — das entscheidet
die fachliche Prüfung.
