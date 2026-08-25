# Nur Islam Premium — V1 Source Audit

> Interner quellenbasierter Audit der für Release 1 sichtbaren religiösen Inhalte.
>
> **Wichtig:** `source-audited` bedeutet nicht „von einem Gelehrten freigegeben“. Es bedeutet: Die konkrete Nutzerbehauptung wurde gegen nachvollziehbare Primärquellen geprüft, bekannte Unterschiede wurden berücksichtigt und es wurde kein offensichtlicher Widerspruch gefunden.

## Statuslogik

| Status | Bedeutung |
| --- | --- |
| `source-audited-green` | Direkte/starke Quellenlage; Aussage passt zur Quelle. |
| `source-audited-variant` | Inhalt grundsätzlich belegt, aber anerkannte Unterschiede müssen sichtbar bleiben. |
| `unresolved` | Quelle/Grad/Bedeutung reicht noch nicht für eine sichere Nutzerbehauptung. |
| `pedagogical` | Redaktionelle Lern-/UX-Aussage, keine religiöse Normbehauptung. |

Keine dieser Stufen setzt `approved` in den bestehenden Review-Gates.

---

# 01 · beginner-islam — „Was ist Islam?“

**Datei:** `src/data/beginnerLearningContent.ts`  
**V1:** ja  
**Auditstand:** `source-audited-green` mit Quellen-Ergänzung empfohlen  
**Geprüft:** 2026-08-23

## Aktueller Inhalt

### Summary

> Ein erster Überblick darüber, worum es im Islam geht und wie Glaube, Anbetung und gutes Handeln zusammengehören.

### Absatz 1

> Islam beschreibt die bewusste Hinwendung zu Allah und das Leben nach Seiner Rechtleitung. Für Anfänger ist wichtig: Du musst nicht alles auf einmal wissen. Die Grundlagen werden Schritt für Schritt gelernt.

### Absatz 2

> Glaube zeigt sich nicht nur in Wissen. Gebet, Charakter, Barmherzigkeit, Verantwortung und ehrliches Handeln gehören zum religiösen Alltag zusammen.

### Absatz 3

> Diese App beginnt deshalb mit gemeinsamen Grundlagen und trennt sie von Detailfragen, bei denen unterschiedliche anerkannte Auffassungen existieren können.

## Primärquellenprüfung

### Quran 3:19

Arabischer Kern:
`إِنَّ الدِّينَ عِندَ اللَّهِ الإِسْلَامُ`

Belegt direkt, dass Islam als Religion bei Allah genannt wird. Die vorhandene Quellenangabe ist passend.

**Trägt:**
- Islam als grundlegende Religionsbezeichnung.

**Trägt nicht allein:**
- den gesamten Absatz über gutes Handeln, Barmherzigkeit und Verantwortung.

### Sahih Muslim 8a — Hadith Jibril

Der Hadith gliedert Religion in Islam, Iman und Ihsan und nennt für Islam u. a. Shahada, Gebet, Zakat, Ramadanfasten und Hajj; für Iman die bekannten Glaubensgrundlagen und für Ihsan die Anbetung Allahs mit Bewusstsein Seiner Gegenwart.

**Trägt:**
- dass Religion nicht auf bloßes abstraktes Wissen reduziert wird;
- die Verbindung von Bekenntnis, Glauben und Anbetung;
- die didaktische Trennung von Islam, Iman und Ihsan als Grundlagen.

### Quran 2:112 — Ergänzung empfohlen

Arabischer Kern:
`مَنْ أَسْلَمَ وَجْهَهُ لِلَّهِ وَهُوَ مُحْسِنٌ`

Sinngemäß: Wer sich Allah hingibt und Gutes tut.

**Trägt direkt:**
- die Formulierung „Hinwendung/Hingabe an Allah“;
- Verbindung von Hingabe und gutem Handeln.

### Quran 2:177 — Ergänzung empfohlen

Die Ayah verbindet ausdrücklich:
- Glauben an Allah, Jüngsten Tag, Engel, Schrift und Propheten;
- Geben/soziale Verantwortung;
- Gebet;
- Zakat;
- Vertragstreue;
- Geduld.

**Trägt direkt:**
- die Summary „Glaube, Anbetung und gutes Handeln gehören zusammen“;
- die Aussage, dass religiöse Rechtschaffenheit nicht nur aus Wissen oder einer einzelnen äußeren Handlung besteht;
- Verantwortung und ehrliches/verlässliches Handeln.

### Quran 90:17 — Ergänzung empfohlen

Arabischer Kern:
`وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ`

Verbindet Glauben mit gegenseitiger Ermahnung zu Geduld und Barmherzigkeit.

**Trägt direkt:**
- „Barmherzigkeit“ als Bestandteil guten religiösen Handelns.

## Satz-für-Satz-Bewertung

| Aussage | Status | Begründung |
| --- | --- | --- |
| Islam beschreibt die Hinwendung/Hingabe an Allah. | `source-audited-green` | Quran 2:112 trägt die Hingabe an Allah direkt. |
| Leben nach Allahs Rechtleitung gehört zum Islam. | `source-audited-green` | Quran 3:19 + 2:112 und der Hadith Jibril tragen die religiöse Grundausrichtung. |
| Anfänger müssen nicht alles auf einmal wissen. | `pedagogical` | Lernhinweis der App, keine Fiqh-/Aqidah-Normbehauptung. |
| Grundlagen werden Schritt für Schritt gelernt. | `pedagogical` | Didaktische Aussage, keine religiöse Pflichtbehauptung. |
| Glaube zeigt sich nicht nur in Wissen. | `source-audited-green` | Quran 2:177 verbindet Glauben mit Gebet, Geben, Vertragstreue und Geduld. |
| Gebet und Verantwortung gehören zum religiösen Alltag. | `source-audited-green` | Quran 2:177. |
| Barmherzigkeit gehört zum religiösen Handeln. | `source-audited-green` | Quran 90:17. |
| Anerkannte Detailunterschiede sollen von gemeinsamen Grundlagen getrennt werden. | `pedagogical` | Sichere redaktionelle Produktregel; behauptet keine konkrete Madhhab-Position. |

## Gefundene Fehler

**Kein eindeutiger religiöser Inhaltsfehler gefunden.**

Der bisherige Schwachpunkt ist **Quellenabdeckung**, nicht der Kerninhalt.

## Sichere Änderungsempfehlung

Die vorhandenen Quellen behalten und ergänzen:

1. `Sure Al-Baqara 2:112` — Hingabe an Allah und gutes Handeln.
2. `Sure Al-Baqara 2:177` — Glauben, Gebet, soziale Verantwortung, Vertragstreue und Geduld.
3. `Sure Al-Balad 90:17` — Glaube, Geduld und Barmherzigkeit.

Optional die erste Formulierung quellenäher machen:

> `Islam beschreibt die bewusste Hingabe an Allah und die Orientierung an Seiner Rechtleitung.`

Das ist enger an Quran 2:112 als die bisherige Formulierung „bewusste Hinwendung“.

## Gesamturteil

**GRÜN auf Quellenebene.**

- Keine erkennbare falsche Aqidah-/Fiqh-Aussage.
- Keine rechtsschulspezifische Position als universell dargestellt.
- Quellenlage lässt sich mit 2:112, 2:177 und 90:17 deutlich vollständiger abbilden.
- Bestehender `needs-expert-review`-/Release-Gate-Status bleibt unverändert, bis der Gate-Ansatz später ausdrücklich entschieden wird.

---

# 02 · beginner-allah — „Wer ist Allah?“

**Datei:** `src/data/beginnerLearningContent.ts`  
**V1:** ja  
**Auditstand:** `source-audited-green` mit Quellen-Ergänzung empfohlen  
**Geprüft:** 2026-08-23

## Geprüfte Kernbehauptungen

1. Allah ist einzig und hat keinen Teilhaber.
2. Anbetung wird allein an Allah gerichtet.
3. Allah besitzt vollkommene/schöne Namen und Eigenschaften, die aus Offenbarung gelernt werden.
4. Allah ist der Schöpfer.
5. Allah kennt Seine Schöpfung.
6. Allah ist nicht mit der Schöpfung gleichzusetzen.

## Primärquellenprüfung

### Quran 112:1–4 — vorhanden und passend

Belegt direkt:
- Allah ist Einer;
- Er ist nicht gezeugt und zeugt nicht;
- niemand ist Ihm gleich/ebenbürtig.

Damit sind Einzigkeit und Unvergleichbarkeit in der Lektion stark getragen.

### Quran 2:255 — vorhanden und passend

Belegt direkt:
- `لا إله إلا هو` — keine Gottheit ist anbetungswürdig außer Ihm;
- Allah ist der Lebendige und Erhalter;
- Ihm gehört, was in den Himmeln und auf der Erde ist;
- Sein Wissen umfasst, was vor und hinter den Menschen liegt;
- niemand umfasst von Seinem Wissen außer, was Er will.

Damit sind alleinige Anbetungswürdigkeit und Wissen stark getragen.

### Quran 39:62 — Ergänzung erforderlich/empfohlen

Arabischer Kern:
`اللَّهُ خَالِقُ كُلِّ شَيْءٍ`

Belegt ausdrücklich:
- Allah ist der Schöpfer aller Dinge.

Die bisher sichtbare Lektion behauptet „Allah ist der Schöpfer“, aber die zwei bisher angezeigten Quellen 112:1–4 und 2:255 sagen dies nicht so direkt. 39:62 schließt diese Quellenlücke sauber.

### Quran 42:11 — Ergänzung empfohlen

Arabischer Kern:
`لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ`

Belegt ausdrücklich:
- nichts ist Ihm gleich;
- zugleich werden Seine Eigenschaften des Hörens und Sehens bestätigt.

Diese Stelle ist besonders gut, weil sie Unvergleichbarkeit und bestätigte Eigenschaften im selben Vers verbindet.

### Quran 7:180 — Ergänzung empfohlen

Arabischer Kern:
`وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا`

Belegt ausdrücklich:
- Allah gehören die schönsten Namen;
- Er wird mit ihnen angerufen.

Damit wird der Lektionsteil über Allahs Namen direkt getragen.

## Satz-für-Satz-Bewertung

| Aussage | Status | Begründung |
| --- | --- | --- |
| Allah ist einzig und hat keinen Teilhaber. | `source-audited-green` | 112:1–4; 2:255. |
| Anbetung wird allein an Allah gerichtet. | `source-audited-green` | 2:255 (`la ilaha illa Huwa`) trägt die Exklusivität der Anbetungswürdigkeit. |
| Allah besitzt vollkommene/schöne Namen. | `source-audited-green` | 7:180. |
| Diese Namen/Eigenschaften sollen nicht frei erfunden werden. | `source-audited-green` | 7:180 belegt, dass die Namen Allah gehören und warnt vor Abweichung bezüglich Seiner Namen; die App-Regel, bei Offenbarungsbelegen zu bleiben, ist konservativ und quellenorientiert. |
| Allah ist der Schöpfer. | `source-audited-green` | 39:62 direkt. |
| Allah kennt Seine Schöpfung. | `source-audited-green` | 2:255; zusätzlich 42:12 spricht von vollkommenem Wissen über alle Dinge. |
| Allah ist nicht mit der Schöpfung gleichzusetzen. | `source-audited-green` | 112:4 und besonders direkt 42:11. |

## Gefundene Fehler

**Kein eindeutiger theologischer Inhaltsfehler gefunden.**

Der konkrete Mangel ist erneut die **sichtbare Quellenabdeckung**:

- „Allah ist der Schöpfer“ braucht einen direkten Schöpfer-Beleg.
- „vollkommene Namen“ ist mit 7:180 direkter belegbar.
- „nicht mit der Schöpfung gleichzusetzen“ ist mit 42:11 besonders klar.

## Sichere Änderungsempfehlung

Zu den bestehenden Quellen ergänzen:

1. `Sure Az-Zumar 39:62` — Allah ist Schöpfer aller Dinge.
2. `Sure Ash-Shura 42:11` — nichts ist Ihm gleich; Er ist der Allhörende, Allsehende.
3. `Sure Al-A'raf 7:180` — Allah gehören die schönsten Namen.

Die sichtbaren Kernaussagen können inhaltlich bestehen bleiben.

## Gesamturteil

**GRÜN auf Quellenebene.**

- Keine erkennbare falsche Aqidah-Aussage.
- Keine spekulative Beschreibung Allahs.
- Bestehende Aussagen lassen sich direkt aus Quranstellen tragen.
- Quellenliste sollte vor Release um die drei direkten Stellen ergänzt werden.
- `needs-expert-review` bleibt technisch unverändert.

---

## Nächster Block

`beginner-shahada` — „Die Shahada verstehen“

Besonders zu prüfen:
- ob 47:19 und 48:29 die komplette Shahada-Erklärung tragen;
- Aussage „Bedeutung wichtiger als perfekte Aussprache“ als pädagogische vs. religiöse Behauptung;
- Hinweis zu formellem Übertritt/Zeugen;
- ob ein direkter Hadith zur Shahada sinnvoll ergänzt werden sollte.
