# V1 Source Audit — Runde 2

> Fortsetzung der V1-Quellenprüfung. `source-audited` ist keine erfundene menschliche Freigabe und verändert die bestehenden `approved`-Gates nicht.

---

# 11 · quran-beginner-guide — „Quran für Anfänger“

**Datei:** `src/screens/QuranBeginnerGuideScreen.tsx`  
**Status:** `source-audited-green` mit einer konkreten Quellenkorrektur  
**Geprüft:** 2026-08-23

## Geprüfte Aussagen

- Der Quran ist Offenbarung Allahs an Muhammad ﷺ.
- Er besteht aus 114 Suren; Suren bestehen aus Ayat; Juz sind Leseabschnitte.
- Deutsche Übersetzung/Bedeutungswiedergabe und Tafsir werden vom arabischen Qurantext getrennt.
- Al-Fatiha besitzt zentrale Bedeutung im Gebet.
- Al-Alaq 96:1–5 gehört zum Beginn der Offenbarung und verbindet Offenbarung mit Lesen/Wissen.
- Die vier Start-Suren sind eine App-Lernempfehlung, keine religiöse Rangliste.

## Primärquellen

### Quran 2:185

Trägt direkt, dass der Quran herabgesandt wurde und Rechtleitung für die Menschen ist.

### Quran 26:192–195 — Ergänzung empfohlen

Trägt besonders direkt:
- Offenbarung vom Herrn der Welten;
- herabgebracht durch den vertrauenswürdigen Geist;
- an den Propheten ﷺ;
- in klarer arabischer Sprache.

Damit ist diese Stelle ein sehr direkter Beleg für den Einführungssatz „Der Quran ist die Offenbarung Allahs an den Propheten Muhammad ﷺ“ und für die Trennung zwischen arabischem Offenbarungstext und deutscher Verständnishilfe.

### Al-Alaq 96:1–5

Die Verse selbst tragen Lesen, Lehren, Stift/Pen und Wissen.

**Wichtig:** Die Verse beweisen aus sich selbst nicht ihre chronologische Stellung als erste Offenbarung.

### Sahih al-Bukhari 3 — direkte Quellenkorrektur

Der Hadith über den Beginn der Offenbarung berichtet den Vorgang in Hira und die Rezitation der ersten Verse von Al-Alaq. Er ist der direkte Primärbeleg für die Aussage, dass Al-Alaq 96:1ff zum Beginn der Offenbarung gehört.

### Sahih al-Bukhari 756

Trägt die zentrale Stellung von Al-Fatiha im Gebet. Die App formuliert bewusst vorsichtig und weist darauf hin, dass Detailfragen zur Rezitation im Gemeinschaftsgebet fiqhlich unterschiedlich eingeordnet werden können.

## Bewertung

| Aussage | Status |
| --- | --- |
| Quran = Offenbarung Allahs | grün — 2:185; besonders direkt 26:192–195 |
| Quran als Rechtleitung | grün — 2:185 |
| 114 Suren / Ayat / 30 Juz | sachlich-strukturell |
| Übersetzung ist nicht identisch mit dem arabischen Offenbarungstext | grün/terminologisch |
| Tafsir ist Erklärung, nicht Originaltext | grün/terminologisch |
| Fatiha zentral im Gebet | grün — Bukhari 756 |
| 96:1–5 gehört zum Beginn der Offenbarung | grün, aber bisher falsch/zu indirekt belegt — Bukhari 3 ergänzen |
| Auswahl der vier Startsuren | pädagogisch; korrekt als App-Empfehlung markiert |

## Sichere Änderung

1. `Quran 26:192–195` als direkte Offenbarungsquelle ergänzen.
2. Bei der Chronologie von Al-Alaq **Sahih al-Bukhari 3** ergänzen.
3. Bestehenden Hinweis zu Fiqh-Unterschieden bei Al-Fatiha behalten.

**Kein inhaltlicher Religionsfehler gefunden; ein Quellenzuordnungsfehler wurde identifiziert.**

---

# 12 · beginner-reference — „Fragen & Begriffe / Islam A–Z“

**Datei:** `src/screens/BeginnerReferenceScreen.tsx`  
**Status:** `source-audited-green` mit einem Kontext-Hinweis  
**Geprüft:** 2026-08-23

## Geprüfte Kernbereiche

Glossar:
- Allah, Islam, Shahada, Tawhid;
- Salah/Rakʿah/Wudu/Ghusl/Tayammum/Qibla;
- Dua/Dhikr;
- Quran/Sure/Ayah/Tafsir/Sunnah/Hadith/Seerah;
- Aqidah/Fiqh/Akhlaq/Fard/Halal/Haram.

FAQ:
- Anfängerreihenfolge als App-Lernstruktur;
- kleine beständige Schritte;
- Qibla;
- Rakʿah;
- Unterschiede bei berechneten Gebetszeiten;
- Quran/Übersetzung/Tafsir;
- Sunnah/Hadith;
- Umgang mit Unsicherheit;
- Dua/Dhikr;
- anerkannte Detailunterschiede;
- keine persönliche Fatwa-Funktion.

## Primärquellen-Stichproben

- **Sahih Muslim 8a:** Islam/Iman-Grundstruktur.
- **Sahih al-Bukhari 6465:** kleine, beständige Taten.
- **Quran 2:144:** Qibla zum al-Masjid al-Haram.
- **Quran 4:103:** Gebet als zeitlich festgelegte Pflicht.
- **Quran 16:44:** prophetische Erläuterung der Offenbarung.
- **Quran 16:43:** im unmittelbaren Kontext Aufforderung, Wissende/Leute der Schrift zu fragen, wenn etwas über frühere Gesandte nicht gewusst wird.
- **Quran 17:36:** nichts verfolgen/behaupten, worüber man kein sicheres Wissen hat.
- **Quran 2:186:** Allah antwortet dem Bittenden, wenn er Ihn anruft.
- **Quran 13:28:** Herzen finden Ruhe im Gedenken Allahs.

## Wichtiger Kontext-Hinweis zu Quran 16:43

Die App nutzt 16:43 zusammen mit 17:36 als Unterstützung für den Sicherheitsgrundsatz: Bei Unsicherheit nicht raten, sondern qualifizierte Wissende fragen.

Das ist als redaktioneller Grundsatz vertretbar, aber **16:43 steht im unmittelbaren Quran-Kontext speziell bei der Frage nach früheren Gesandten**. Die App sollte daraus keine unbegrenzte, allein auf diesen Vers gestützte Fiqh-Regel ableiten.

Der aktuelle FAQ-Text tut das nicht: Er kombiniert die Quellen mit einem vorsichtigen Produktprinzip und verweist bei persönlichen/strittigen Fragen an qualifizierte Beratung.

## Rakʿah-FAQ

Die Aussage, dass die fünf Pflichtgebete unterschiedlich viele Pflicht-Rakʿah haben, ist Teil des separaten Gebetsablaufs. Die genaue Beleg-/Ablaufprüfung bleibt zusätzlich im späteren Block `prayer-rakat-sequence` bestehen. Dieser FAQ-Eintrag gibt deshalb bereits korrekt an, dass der fachliche Ablaufreview erforderlich ist.

## Gesamturteil

**GRÜN auf Quellenebene.**

- Keine persönliche Fatwa wird angeboten.
- App-eigene Lernreihenfolgen werden als redaktionell bezeichnet.
- Technische Gebetszeitunterschiede werden nicht als religiöse Gewissheit ausgegeben.
- Unsicherheit wird nicht versteckt.
- Anerkannte Fiqh-Unterschiede werden ausdrücklich offengehalten.

**Kein sicherer Textumbau erforderlich.**

---

# 13 · purity-basics — „Ghusl & Tayammum“

**Datei:** `src/screens/PurityBasicsScreen.tsx`  
**Status:** `source-audited-green` mit direkter Hadith-Ergänzung  
**Geprüft:** 2026-08-23

## Quran 5:6

Trägt direkt:
- Gesicht und Arme bis Ellenbogen beim Wudu;
- Streichen über den Kopf;
- Füße bis Knöchel;
- Janabah und vollständige Reinigung;
- Tayammum bei den im Vers genannten Umständen, wenn kein Wasser gefunden wird;
- sauberen Erdboden und Bestreichen von Gesicht/Händen.

## Sahih al-Bukhari 248 — Ergänzung empfohlen

Beschreibt den Ghusl des Propheten ﷺ nach Janabah und ausdrücklich, dass Wasser über den gesamten Körper gelangte.

Diese Quelle trägt die sichtbare Beschreibung „rituelle Ganzkörperreinigung“ direkter als Quran 5:6 allein.

## Varianten-/Fiqh-Prüfung

Die Seite macht drei wichtige Dinge korrekt:

1. Sie listet nicht pauschal alle Wudu-Brecher auf.
2. Sie entscheidet keine persönlichen Sonderfälle wie Krankheit, Menstruation oder Wochenbett.
3. Sie behauptet bei Tayammum nicht, dass jedes Material in allen Rechtsschulen gleich bewertet wird.

Die Formulierung zu Krankheit, Reise und fehlendem Wasser bleibt bewusst bei dem, was Quran 5:6 nennt, und verweist die genaue Wechselwirkung der Voraussetzungen in den Fachreview.

## Gesamturteil

**GRÜN auf Quellenebene.**

Sichere Änderung:
- Sahih al-Bukhari 248 in der sichtbaren Quellenbox ergänzen.

**Kein klarer Fiqh-Fehler gefunden.**

---

# Ergebnis Runde 2

| Block | Ergebnis | Sichere Reständerung |
| --- | --- | --- |
| quran-beginner-guide | GRÜN | Quran 26:192–195 + Bukhari 3 ergänzen |
| beginner-reference | GRÜN | kein zwingender Textumbau; Kontext von 16:43 dokumentiert |
| purity-basics | GRÜN | Bukhari 248 ergänzen |

Damit sind auf Source-Audit-Ebene **13 von 24 v1-Blöcken** geprüft.

## Nächster Block

`names-of-allah` — vollständige 99er-Lernliste. Alle 99 bleiben sichtbar. Ziel ist die individuelle Prüfung der noch offenen Namen, nicht eine Reduktion der Funktion.
