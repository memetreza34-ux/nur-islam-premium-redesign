# Register: fremde Inhalte, Dienste und Abhängigkeiten

Alles, was nicht selbst erzeugt wurde und in der App landet oder von ihr
aufgerufen wird. Zweck: vor der Veröffentlichung soll niemand raten müssen,
welche Rechte gelten.

Status-Bedeutung:

| Status | Heißt |
| --- | --- |
| **KLAR** | Lizenz bekannt, Bedingungen erfüllbar, nichts weiter zu tun |
| **NAMENSNENNUNG** | Lizenz bekannt, Attribution erforderlich — prüfen, ob sie sichtbar ist |
| **OFFEN** | Herkunft oder Recht nicht belegt — vor Release zu klären |

---

## Laufzeit-Abhängigkeiten

| Paket | Version | Lizenz | Status |
| --- | --- | --- | --- |
| `react`, `react-dom` | 19.x | MIT | **KLAR** |
| `motion` | 12.x | MIT | **KLAR** |
| `lucide-react` | 0.546.x | ISC | **KLAR** |
| `@fontsource/inter` | 5.x | OFL-1.1 | **NAMENSNENNUNG** |
| `@fontsource/cormorant-garamond` | 5.x | OFL-1.1 | **NAMENSNENNUNG** |
| `@fontsource/amiri` | 5.x | OFL-1.1 | **NAMENSNENNUNG** |

Die drei Schriften und Lucide sind in der Datenschutzerklärung unter „Schriften
und Symbole" genannt. Die Schriften werden lokal aus dem Bundle geladen, nicht
von Google Fonts — es entsteht also keine Verbindung zu einem Dritten.

- [ ] Prüfen, ob die OFL-1.1 zusätzlich zur Nennung eine Kopie des Lizenztexts
      in der Auslieferung verlangt.

---

## Externe Dienste zur Laufzeit

Jeder dieser Hosts steht in der Content-Security-Policy in `index.html`, und
`npm run legal:check` prüft, dass er auch in der Datenschutzerklärung genannt
ist. Ein Dienst kann also nicht unbemerkt dazukommen.

| Dienst | Host | Wofür | Status |
| --- | --- | --- | --- |
| AlAdhan | `api.aladhan.com` | Gebetszeiten | **NAMENSNENNUNG** — Nutzungsbedingungen prüfen |
| Al Quran Cloud | `api.alquran.cloud` | Quran-Fallback | **NAMENSNENNUNG** — siehe QURAN-PROVENANCE.md |
| Overpass API | `overpass-api.de` | Moscheesuche | **NAMENSNENNUNG** — Nutzungsrichtlinien beachten |
| Nominatim / OpenStreetMap | `nominatim.openstreetmap.org` | Adressauflösung, Karten-Links | **NAMENSNENNUNG** — ODbL, „© OpenStreetMap-Mitwirkende" ist in der App vorhanden |
| Supabase | Projekt-Host | Konto, Cloud-Sicherung, Notizen | **KLAR** — Auftragsverarbeitung siehe LEGAL-MANUAL-ACTIONS.md |
| GitHub Pages | `*.github.io` | Auslieferung | **KLAR** |

- [ ] Overpass: Die öffentliche Instanz hat eine Fair-Use-Richtlinie. Prüfen,
      ob das erwartete Aufrufvolumen dazu passt, oder eine eigene Instanz bzw.
      einen kommerziellen Anbieter vorsehen.
- [ ] AlAdhan: Nutzungsbedingungen und Rate Limits schriftlich festhalten.

---

## Textbestände

| Bestand | Herkunft | Status |
| --- | --- | --- |
| Arabischer Quran (Uthmani) | verifiziert gegen `quran-uthmani` | **OFFEN** — Lizenz |
| Deutscher Quran (Abu Rida) | verifiziert gegen `de.aburida` | **OFFEN** — Lizenz |
| Hadith-Bibliothek | eigene Zusammenstellung mit Stellenangaben | **OFFEN** — fachliche Prüfung |
| Duas | eigene Zusammenstellung mit Quellen-Audit | **OFFEN** — fachliche Prüfung |
| 99 Namen | eigene Liste; 32 Einträge mit Einzelbeleg | **OFFEN** — fachliche Prüfung |
| Lern- und Anfängertexte | in diesem Repository verfasst | **KLAR** — Urheberrecht beim Betreiber |

Einzelheiten zum Quran: [QURAN-PROVENANCE.md](QURAN-PROVENANCE.md).
Einzelheiten zum fachlichen Review: [RELIGIOUS-HUMAN-REVIEW-PACK.md](RELIGIOUS-HUMAN-REVIEW-PACK.md).

Der Wortlaut der Hadithe und Duas erscheint in der App als **sinngemäße
Wiedergabe** mit Stellenangabe, nicht als Abdruck einer bestimmten Übersetzung.
Das ist bewusst so und sollte so bleiben, solange keine Übersetzungslizenz
vorliegt.

---

## Bildmaterial

30 Dateien in `public/premium-assets/high-res-objects/`: 24 WebP, 4 PNG, 1 SVG.
Moschee, Quran, Kaaba, Mihrab, Laterne, Qibla-Kompass, Tasbih, Rosette,
Lesezeichen, Kalender-Chip, Kuppel, Sonnenemblem, betende Hände, Nur-Logo.

**Status: OFFEN.** `public/premium-assets/README.md` beschreibt sie als „die
hochauflösenden Bildobjekte aus dem Chat" und nennt fünf „Master-Boards" als
verbindliche Referenz. Das sagt, wie sie verwendet werden, nicht, wer sie
erstellt hat oder unter welchen Bedingungen.

Vor Release je Datei zu beantworten:

- [ ] Selbst erstellt, KI-generiert, beauftragt oder aus einer Bibliothek?
- [ ] Bei KI-Generierung: Welcher Dienst, und was sagen dessen Bedingungen zur
      kommerziellen Nutzung und zur Weitergabe?
- [ ] Bei Beauftragung: Liegt eine Rechteübertragung schriftlich vor?
- [ ] Bei einer Bibliothek: Lizenz, Lizenznummer, Attributionspflicht.

Die Antwort ist für alle 30 vermutlich dieselbe. Sie ist trotzdem
aufzuschreiben — und zwar hier, nicht nur im Kopf.

**Nicht erfinden.** Wenn die Herkunft nicht belegbar ist, ist das ein Ergebnis
und muss so hier stehen.

### App-Symbole

`public/nur-app-icon.svg`, `nur-app-icon-192.png`, `nur-app-icon-512.png` —
im Repository erzeugt, Palette aus dem Design-System. **KLAR**, sofern die
Bildmaterial-Frage oben nicht auch das Logo betrifft.

---

## Rezitationen

Keine Audiodateien in der App. Falls Rezitationen dazukommen, ist das ein
eigener Lizenzvorgang: Aufnahmen von Rezitatoren sind eigenständig geschützt,
unabhängig vom Quran-Text.

---

## Zusammenfassung offener Punkte

1. **Bildmaterial** — 30 Dateien ohne dokumentierte Herkunft.
2. **Quran-Lizenz** — arabische Edition und deutsche Übersetzung.
3. **Overpass Fair Use** — passt das Aufrufvolumen zur öffentlichen Instanz?
4. **AlAdhan Nutzungsbedingungen** — schriftlich festhalten.
5. **OFL-Lizenztexte** — prüfen, ob sie mit ausgeliefert werden müssen.

1 und 2 sind Release-Blocker. 3 bis 5 sind vor Release zu erledigen, aber
klein.
