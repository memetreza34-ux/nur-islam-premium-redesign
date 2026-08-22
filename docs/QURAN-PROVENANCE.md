# Quran-Provenienz

Woher der Quran-Text in Nur Islam stammt, was davon **überprüft** ist und was
noch **offen** ist. Der Offline-Bestand ist der Text, den praktisch alle
Nutzerinnen und Nutzer tatsächlich lesen – der Online-Weg ist nur ein Notfall,
falls eine lokale Datei fehlt oder beschädigt ist.

Diese Datei ist die Quelle für den Release-Block `quran-offline-bundle` in
`src/data/v1ReligiousReleaseScope.ts`.

**Kurzfassung:** Wortlaut vollständig verifiziert. Lizenz/Nutzungsrecht offen.
Damit bleibt der Quran-Block ein Release-Blocker – aber nur noch aus einem
Grund, nicht mehr aus vieren.

---

## Status auf einen Blick

| Frage | Status | Grundlage |
| --- | --- | --- |
| Welche arabische Edition? | **VERIFIED** | Textvergleich, 6236/6236 Ayat identisch |
| Welche deutsche Übersetzung? | **VERIFIED** | Textvergleich, 6236/6236 Ayat identisch |
| Stimmt der Wortlaut vollständig? | **VERIFIED** | siehe Prüflauf unten |
| Ist die Struktur korrekt? | **VERIFIED** | 114 Suren, kufische Ayah-Zählung, Summe 6236 |
| Ist der Bestand gegen spätere Änderung gesichert? | **VERIFIED** | sha256-Manifest, in `npm run check` |
| Woher kamen die Dateien ursprünglich in dieses Repo? | **UNKNOWN** | keine Herkunftsangabe in der Git-Historie |
| Lizenz / Nutzungsrecht arabischer Text | **WAITING FOR LICENSE** | – |
| Lizenz / Nutzungsrecht deutsche Übersetzung | **WAITING FOR LICENSE** | – |
| Darf die App die Übersetzung öffentlich ausliefern? | **NOT VERIFIED** | juristisch zu klären |

---

## Was überprüft wurde

### Prüflauf

```bash
npm run quran:verify
```

Das Skript (`scripts/verify-quran-provenance.mjs`) vergleicht **jede einzelne
Ayah** des Offline-Bestands mit der veröffentlichten Ausgabe bei Al Quran Cloud.
Verglichen wird nach Unicode-Normalisierung (NFC) und Whitespace-Normalisierung.
Diakritika werden **nicht** entfernt – im arabischen Quran-Text sind sie Teil des
Textes, nicht Formatierung.

**Ergebnis vom 22.08.2026:**

| Bestand | Verglichen mit | Ergebnis |
| --- | --- | --- |
| `public/data/quran/ar/*.json` | `quran-uthmani` | **6236 / 6236 Ayat identisch (100,000 %)** |
| `public/data/quran/de/*.json` | `de.aburida` | **6236 / 6236 Ayat identisch (100,000 %)** |

### Die deutsche Übersetzung ist Abu Rida – nicht Bubenheim & Elyas

Das ist das wichtigste Ergebnis dieser Prüfung, weil die Annahme vorher anders
lautete: Der Online-Fallback benutzt `de.bubenheim`, und daraus wurde
naheliegenderweise geschlossen, der Offline-Bestand sei dieselbe Übersetzung.

Er ist es nicht. Gegenprobe über acht Suren (604 Ayat) gegen alle vier deutschen
Ausgaben, die Al Quran Cloud führt:

| Ausgabe | Übereinstimmung |
| --- | --- |
| `de.aburida` – Abu Rida Muhammad ibn Ahmad ibn Rassoul | **604 / 604 (100 %)** |
| `de.bubenheim` – A. S. F. Bubenheim und N. Elyas | 4 / 604 (0,7 %) |
| `de.khoury` – Adel Theodor Khoury | 2 / 604 (0,3 %) |
| `de.zaidan` – Amir Zaidan | 0 / 604 (0 %) |

Die anschließende Vollprüfung über alle 114 Suren bestätigt `de.aburida` mit
6236/6236. Die wenigen Zufallstreffer bei den anderen Ausgaben sind kurze Verse,
die in mehreren Übersetzungen gleich lauten.

Sichtbare Konsequenz: Der Reader nennt jetzt den tatsächlichen Übersetzer, und
der Online-Fallback wurde auf dieselbe Übersetzung umgestellt. Vorher konnte
dieselbe Ayah je nach Verfügbarkeit einer lokalen Datei in zwei verschiedenen
deutschen Übersetzungen erscheinen.

### Struktur

* 114 Suren, jeweils arabisch **und** deutsch – keine Lücke.
* Ayah-Zahlen folgen der **kufischen Zählung**; Summe **6236**.
* Keine leeren Ayat, keine doppelten aufeinanderfolgenden Ayat, keine
  Verschiebungen, keine arabischen Texte ohne arabische Schrift, keine deutschen
  Texte ohne lateinische Schrift.
* Geprüft in `scripts/check-quran-data.mjs` und
  `scripts/check-quran-integrity.mjs`, beide in `npm run check`.

### Sicherung gegen spätere Änderung

`public/data/quran/manifest.sha256.json` enthält einen **sha256**-Digest für
jede der 229 Dateien. `scripts/check-quran-integrity.mjs` prüft ihn bei jedem
`npm run check`. Eine einzelne veränderte Ayah lässt den Build fehlschlagen.

Beim bewussten Austausch des Bestands:

```bash
npm run quran:verify
node scripts/check-quran-integrity.mjs --write
```

Beides im selben Commit, und das Ergebnis hier eintragen.

---

## Was offen ist

### 1. Ursprüngliche Herkunft der Dateien — UNKNOWN

Der Wortlaut ist zweifelsfrei identisch mit den genannten Ausgaben. **Wie** die
Dateien ursprünglich in dieses Repository gelangt sind, ist nicht dokumentiert:
kein Import-Skript, kein Hinweis in der Git-Historie, keine ursprüngliche
Quellenangabe. Der Textvergleich zeigt, *was* der Bestand ist, nicht, *woher* er
kam.

Für die Lizenzfrage ist das relevant, weil die Bedingungen davon abhängen können,
über welchen Verteilweg der Text bezogen wurde.

### 2. Lizenz und Nutzungsrecht — WAITING FOR LICENSE

Vor einer öffentlichen Veröffentlichung zu klären, und zwar getrennt für beide
Bestandteile:

**Arabischer Text (`quran-uthmani`)**

- [ ] Rechteinhaber der digitalen Edition benennen
- [ ] Lizenzbedingungen beschaffen und ablegen
- [ ] Zulässigkeit der Weitergabe als Teil einer App klären
- [ ] Erforderliche Namensnennung im Reader umsetzen

**Deutsche Übersetzung (Abu Rida Muhammad ibn Ahmad ibn Rassoul)**

- [ ] Rechteinhaber benennen (Übersetzer bzw. Verlag/Nachlass)
- [ ] Lizenz oder ausdrückliche Genehmigung für die Weitergabe einholen
- [ ] Klären, ob die vollständige Übersetzung offline mitgeliefert werden darf
- [ ] Erforderliche Namensnennung und Editionsangabe umsetzen
- [ ] Prüfen, ob eine spätere Monetarisierung die Bedingungen ändert

Eine Übersetzung ist ein eigenständiges urheberrechtlich geschütztes Werk. Die
Gemeinfreiheit des arabischen Originals sagt nichts über die Übersetzung.

**Bis hier ein belegtes Ergebnis vorliegt, darf `quran-offline-bundle` nicht auf
`approved` gesetzt werden.** Das gilt unabhängig davon, dass der Wortlaut
vollständig verifiziert ist: Wortlaut und Nutzungsrecht sind zwei verschiedene
Fragen, und nur die erste ist beantwortet.

### 3. Inhaltliche Freigabe — offen

Die technische Prüfung sagt: Der Bestand ist exakt die genannte Ausgabe. Sie
sagt nicht, ob diese Ausgabe für die App die richtige Wahl ist. Diese
Entscheidung – und die Abnahme der Darstellung im Reader – gehört zur
fachlichen Prüfung des Blocks `quran-offline-bundle`.

---

## Wenn der Bestand ersetzt wird

1. Neue Dateien einspielen.
2. `npm run quran:verify --edition=<neue-edition>` – Vollvergleich.
3. `node scripts/check-quran-integrity.mjs --write` – Manifest neu erzeugen.
4. Labels in `src/services/quranService.ts` anpassen.
5. Dieses Dokument aktualisieren: Datum, Editionen, Zählwerte, Lizenzstand.
6. `quran-offline-bundle` in `src/data/coreContentReview.ts` auf `pending`
   zurücksetzen, falls es schon freigegeben war.

Ohne Schritt 2 und 3 ist der neue Bestand ungeprüft – auch dann, wenn
`npm run check` grün ist.
