# Feldtest: Gebetszeiten

Was ein Rechner nicht beantworten kann. Die Berechnung ist getestet, die
Fehlerfälle sind getestet — offen ist, ob die Zeiten, die dabei herauskommen,
vor Ort vertretbar sind.

**Ziel ist nicht, die Zeiten einer bestimmten Moschee nachzubilden.** Ziel ist,
zu wissen, wie groß die Abweichung ist und woher sie kommt, damit die App
ehrlich darüber sprechen kann.

---

## Was die App bereits garantiert

Automatisch geprüft, muss im Feldtest nicht erneut bestätigt werden:

- Ohne freigegebenen Gerätestandort werden **keine** persönlichen Gebetszeiten
  angezeigt. Der Ersatzzeitplan enthält keine Uhrzeiten.
- Gebetserinnerungen feuern **nicht** auf dem Ersatzzeitplan.
- Der Tages-Cache gilt für den lokalen Kalendertag, auch über die
  Sommerzeitumstellung hinweg.
- Home, Gebetsscreen und Erinnerungen lesen denselben geteilten Zeitplan.

---

## Voreinstellung

| Einstellung | Vorbelegt mit |
| --- | --- |
| Methode | Diyanet İşleri Başkanlığı (bei AlAdhan als experimentell geführt) |
| Asr | Standard (Faktor 1) |
| Alternative Methode | Muslim World League |
| Alternatives Asr | Hanafi (Faktor 2) |

Die Bezeichnung „experimentell" stammt von AlAdhan, nicht von dieser App. Ob
diese Methode die richtige Voreinstellung für die Zielgruppe ist, gehört zur
fachlichen Prüfung des Blocks `prayer-time-methodology`.

---

## Testmatrix

Je Ort einmal durchführen. Vergleichsquelle ist eine örtliche Moschee, eine
zuständige Stelle oder ein etablierter Kalender — **welche, notieren.**

| Ort | Fajr | Sunrise | Dhuhr | Asr Std. | Asr Hanafi | Maghrib | Isha | Vergleichsquelle | Max. Abweichung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Berlin | | | | | | | | | |
| Hamburg | | | | | | | | | |
| München | | | | | | | | | |
| Köln | | | | | | | | | |
| Frankfurt am Main | | | | | | | | | |
| Stuttgart | | | | | | | | | |

Sinnvolle Ergänzungen, weil sie andere Fälle abdecken:

| Ort | Warum |
| --- | --- |
| Flensburg oder Kiel | nördlichster Punkt Deutschlands — Fajr und Isha im Sommer |
| Ein Ort außerhalb Mitteleuropas | andere Zeitzone, andere Sonnenstände |

### Wie zu bewerten

- **Bis ±2 Minuten**: unauffällig, Rundungs- und Methodenrauschen.
- **±3 bis ±10 Minuten**: normal bei unterschiedlichen Methoden. Notieren,
  welche Methode die Vergleichsquelle benutzt.
- **Über ±15 Minuten bei Dhuhr, Asr oder Maghrib**: verdächtig. Diese drei
  hängen fast nur vom Sonnenstand ab, nicht von einer Winkelkonvention.
  Erst Koordinaten und Zeitzone prüfen.
- **Fajr und Isha weichen stärker ab**: erwartbar. Sie hängen von einem
  Dämmerungswinkel ab, über den sich die Methoden gerade unterscheiden.

---

## Technische Fälle

Ohne echte Geräte nicht abschließend prüfbar:

| Fall | Erwartet |
| --- | --- |
| Standortfreigabe verweigert | keine persönlichen Zeiten, klarer Hinweis, kein Ersatzwert |
| Standortfreigabe entzogen, während die App läuft | fällt sichtbar zurück, keine alten Zeiten als aktuelle |
| Flugmodus, Cache von heute vorhanden | Zeiten aus dem Cache, als Cache gekennzeichnet |
| Flugmodus, Cache von gestern | keine Zeiten, Hinweis |
| API-Timeout | Hinweis, kein Ersatzwert |
| API antwortet fehlerhaft | Hinweis, kein Ersatzwert |
| Zeitzonenwechsel auf Reisen | neuer Tag, neue Zeiten |
| Sommerzeitumstellung 29.03. und 25.10. | ein Tageswechsel, kein doppelter, kein übersprungener |
| Mitternacht während laufender App | Zeiten wechseln auf den neuen Tag |
| Methode wechseln | Zeiten aktualisieren sich sofort |
| Asr Standard ↔ Hanafi | nur Asr ändert sich |
| Standortwechsel um mehrere hundert Kilometer | Zeiten und Ortsangabe folgen |

---

## Zu erfassen

Je Testlauf:

- Datum und Uhrzeit des Tests
- Ort und angezeigte Koordinaten
- Gerät, Betriebssystem, Browser
- Gewählte Methode und Asr-Schule
- Die sieben angezeigten Zeiten
- Vergleichsquelle mit Name und Adresse
- Abweichung je Zeit in Minuten

Ergebnisse hier eintragen. Ein Test, dessen Ergebnis nirgends steht, hat nicht
stattgefunden.

---

## Ergebnisse

*Noch keine durchgeführt.*
