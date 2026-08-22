# Performance

Was gemessen ist, was noch nicht, und wo die tatsächlichen Kosten liegen.

**Keine Fantasiewerte.** Felder ohne Messung bleiben leer.

---

## Gemessen: Auslieferungsgröße

Aus dem Produktionsbuild, gzip-Größen, Stand 22.08.2026:

| Datei | gzip | roh | Wann geladen |
| --- | ---: | ---: | --- |
| `index-*.css` | **94,7 KB** | 605 KB | beim Start, render-blockierend |
| `index-*.js` (Entry) | 77,7 KB | 279 KB | beim Start |
| `react-vendor` | 59,1 KB | 194 KB | beim Start |
| `motion-vendor` | 41,4 KB | 129 KB | beim Start |
| `icons-vendor` | 9,8 KB | 45 KB | beim Start |
| `prayer-rakats` | 4,4 KB | 12 KB | beim Start |
| **Startlast gesamt** | **287 KB** | | |
| 17 Chunks auf Abruf | 76 KB | | beim Öffnen des jeweiligen Screens |

Geprüft bei jedem `npm run check` durch `scripts/check-bundle-budget.mjs`.
Budgets: Startlast 300 KB, Entry-Chunk 100 KB, alle Chunks zusammen 285 KB.

### Was daran auffällt

**Das Stylesheet ist der größte Einzelposten** — größer als der gesamte
Anwendungscode, und es blockiert das Rendering. 97 Dateien, 728 KB Quelltext,
2293 `!important`. `scripts/check-stylesheet-debt.mjs` deckelt das, damit es
nicht weiter wächst, räumt aber nichts auf. Wenn irgendwo Zeit in Performance
fließt, dann hier.

**`motion` kostet 41 KB gzip.** Die Bibliothek wird in 32 Dateien mit über 200
Verwendungen benutzt; ein Austausch wäre kein Aufräumen, sondern ein neues
Animationssystem. Nicht ohne Grund anfassen.

**`prayer-rakats` wird beim Start geladen**, obwohl es nur der Gebetskurs
braucht. Der Lernbildschirm importiert den Kurs statisch, deshalb hängt er im
Startgraphen. 4,4 KB — klein, aber unnötig.

---

## Gemessen: mitgelieferte Daten

| Bestand | Größe |
| --- | --- |
| Offline-Quran (229 Dateien) | 3,1 MB |
| Bildmaterial | 304 KB |

Der Quran wird **nicht** beim ersten Start geladen. Der Service Worker legt
Al-Fatiha, Al-Ikhlas, Al-Falaq und An-Nas sofort ab; die übrigen 110 Suren
werden erst geholt, wenn die App im Leerlauf ist, einzeln und ohne bereits
Vorhandenes erneut zu laden.

---

## Nicht gemessen

Braucht echte Geräte und einen Lighthouse-Lauf:

| Messwert | Ziel | Ergebnis |
| --- | --- | --- |
| LCP (Mobil, langsames 4G) | < 2,5 s | |
| CLS | < 0,1 | |
| INP | < 200 ms | |
| Kaltstart bis interaktiv | | |
| Kaltstart offline | | |
| Lighthouse Performance | | |
| Lighthouse Accessibility | | |
| Lighthouse Best Practices | | |
| Lighthouse PWA | | |

### Testfälle

| Fall | Warum |
| --- | --- |
| Erster Besuch, langsames 4G | die 287 KB Startlast plus Schriften |
| Zweiter Besuch | alles aus dem Service-Worker-Cache |
| Kaltstart offline | prüft die Vollständigkeit des Precache |
| Low-End-Android | CPU-Kosten des Renderings, nicht nur die Downloadgröße |
| Quran-Reader, Sure 2 (286 Ayat) | längste Liste der App |
| Quran-Reader, schnell scrollen | Ruckeln? |
| Kalender, mehrere Monate durchblättern | Hijri-Umrechnung je Zelle |
| Speicherverbrauch nach 10 Minuten Nutzung | Lecks in Sensor- und Timer-Logik |
| Reduced Motion aktiv | Animationen wirklich aus |

Die Zeile zu Sure 2 und der Kalender sind die beiden Stellen, an denen die App
pro Element rechnet statt einmal — dort ist ein Problem am wahrscheinlichsten.

---

## Regeln

1. **Erst messen, dann optimieren.** Die Zahlen oben sind die Auslieferung, nicht
   die gefühlte Geschwindigkeit.
2. **Budgets nicht anheben, um einen Check grün zu bekommen.** Eine Anhebung ist
   eine Entscheidung und gehört mit Begründung in die Commit-Nachricht.
3. **Nicht ins Blaue CSS umschreiben.** 97 Stylesheets sind ein reales Problem,
   aber ein Umbau ohne Messung tauscht nur ein Risiko gegen ein anderes.

---

## Ergebnisse

*Lighthouse und Gerätemessungen noch nicht durchgeführt.*
