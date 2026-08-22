# Rechtliche Punkte, die nur der Betreiber erledigen kann

Nichts davon lässt sich aus dem Code ableiten oder von einem Tool erzeugen. Der
Code verweigert den Release-Build, solange die Pflichtangaben fehlen:

```bash
NUR_RELEASE=true npm run check
```

Diese Datei sagt genau, was einzutragen ist und wo.

---

## 1. Impressum — **blockiert den Release**

`src/data/legalContent.ts`, Objekt `operator`. Alle Felder mit
`<<BITTE AUSFÜLLEN>>` müssen durch echte Angaben ersetzt werden.

| Feld | Was hineingehört |
| --- | --- |
| `name` | Vollständiger Name der verantwortlichen natürlichen oder juristischen Person |
| `street` | Ladungsfähige Anschrift, Straße und Hausnummer — kein Postfach |
| `city` | Postleitzahl und Ort |
| `country` | Vorbelegt mit `Deutschland`; anpassen, falls abweichend |
| `email` | E-Mail-Adresse, unter der eine schnelle elektronische Kontaktaufnahme möglich ist |

Zusätzlich zu prüfen, weil es von der Rechtsform abhängt und nicht im Code
steht:

- [ ] Wird eine **Telefonnummer** benötigt? (§ 5 DDG verlangt Angaben, die eine
      schnelle elektronische Kontaktaufnahme *und* unmittelbare Kommunikation
      ermöglichen.)
- [ ] Bei juristischen Personen: **Registergericht und Registernummer**,
      Vertretungsberechtigte.
- [ ] **Umsatzsteuer-Identifikationsnummer**, falls vorhanden.
- [ ] Falls die App später journalistisch-redaktionelle Inhalte enthält:
      inhaltlich Verantwortlicher nach § 18 Abs. 2 MStV.

**Nicht erfinden.** Ein Impressum mit falschen Angaben ist schlechter als ein
fehlendes.

---

## 2. Datenschutzerklärung — **juristische Prüfung erforderlich**

Der Text in `src/data/legalContent.ts` wurde aus dem tatsächlichen Verhalten des
Codes abgeleitet, nicht aus einer Vorlage. `npm run legal:check` prüft, dass
jeder Host aus der Content-Security-Policy auch in der Erklärung genannt ist —
ein Dienst kann also nicht unbemerkt verschwiegen werden.

Das ersetzt keine rechtliche Prüfung. Vorzulegen sind mindestens:

| Verarbeitung | Wobei | Was übermittelt wird |
| --- | --- | --- |
| AlAdhan (`api.aladhan.com`) | Gebetszeiten | Koordinaten, Datum, Methode |
| Al Quran Cloud (`api.alquran.cloud`) | Quran-Fallback | Surennummer, Ausgabe |
| Overpass / OpenStreetMap (`overpass-api.de`, `nominatim.openstreetmap.org`) | Moscheesuche | Koordinaten, Suchradius |
| Supabase | Konto, Cloud-Sicherung, Notizen | E-Mail, Passwort-Hash, gesicherte App-Daten |
| GitHub Pages | Auslieferung der App | IP-Adresse durch den Hoster |
| Geolocation-API | Standort | verbleibt auf dem Gerät |
| Device-Orientation-API | Qibla-Kompass | verbleibt auf dem Gerät |
| Notifications-API | Erinnerungen | verbleibt auf dem Gerät |
| `localStorage` | Fortschritt, Einstellungen | verbleibt auf dem Gerät |

Zu klären:

- [ ] **Auftragsverarbeitungsvertrag mit Supabase** — es werden dort
      personenbezogene Daten gespeichert.
- [ ] **Drittlandtransfer**: In welcher Region liegt das Supabase-Projekt? Bei
      Verarbeitung außerhalb der EU ist die Rechtsgrundlage zu dokumentieren.
- [ ] **Rechtsgrundlagen** je Verarbeitung benennen (Art. 6 DSGVO).
- [ ] Die genannten API-Anbieter aufnehmen — ein Aufruf überträgt die
      IP-Adresse an den jeweiligen Betreiber.
- [ ] **Löschkonzept** und Aufbewahrungsfristen für Cloud-Daten.
- [ ] Ob eine **Datenschutz-Folgenabschätzung** nötig ist. Religionszugehörigkeit
      ist eine besondere Kategorie personenbezogener Daten nach Art. 9 DSGVO,
      und die Nutzung dieser App lässt darauf schließen.

Der letzte Punkt ist der, den man am ehesten übersieht, und der mit dem
größten Gewicht.

---

## 3. Kontolöschung

`deleteCloudData()` löscht die Nur-Islam-Daten, lässt den Auth-Account aber
bestehen.

- [ ] **Für die reine PWA**: bewerten, ob das genügt, und in der
      Datenschutzerklärung genau so beschreiben, wie es ist.
- [ ] **Für App Store / Google Play**: beide Stores verlangen bei Apps mit
      Kontoerstellung einen Weg, das Konto **und** die zugehörigen Daten aus der
      App heraus zu löschen. Das ist dann ein Store-Release-Blocker und braucht
      einen serverseitigen privilegierten Pfad — kein Löschen von `auth.users`
      aus dem Frontend.

---

## 4. Geschäftsmodell

Die Rechtstexte sagen aktuell zu:

> Nur Islam ist ein nichtkommerzielles Angebot. Es werden keine Zahlungen
> entgegengenommen und keine Werbung ausgeliefert.

Solange das gilt, ist nichts zu tun. Sobald Zahlungen oder Werbung dazukommen,
ändert sich neben der Technik auch: Impressumspflichten, Widerrufsbelehrung,
AGB, Datenschutzerklärung und die Store-Angaben.

- [ ] Entscheiden: v1 kostenlos, oder v1 monetarisiert?

Ohne Entscheidung bleibt v1 kostenlos, und die Rechtstexte stimmen.

---

## 5. Inhaltliche Haftung

- [ ] Prüfen, ob der Hinweis zu religiösen Inhalten in seiner jetzigen Form
      genügt: Die App gibt religiöses Wissen wieder und ersetzt keine
      Rechtsauskunft einer qualifizierten Lehrperson.
- [ ] Prüfen, ob der Hinweis auf berechnete Gebetszeiten, Qibla-Richtung und
      Hijri-Datum als Haftungsabgrenzung ausreicht.

---

## 6. Quran-Lizenz

Eigenes Dokument, weil es der einzelne größte inhaltliche Blocker ist:
[QURAN-PROVENANCE.md](QURAN-PROVENANCE.md). Der Wortlaut ist vollständig
verifiziert; das Nutzungsrecht für die arabische Edition und für die deutsche
Übersetzung ist offen.

---

## Reihenfolge

1. Impressumsdaten eintragen — ohne sie läuft kein Release-Build.
2. Quran-Lizenz klären — längste Vorlaufzeit, weil Dritte beteiligt sind.
3. Datenschutzerklärung juristisch prüfen lassen.
4. Geschäftsmodell entscheiden.
5. Kontolöschung nur dann angehen, wenn eine Store-Veröffentlichung geplant ist.
