# Nur Islam – Fachreview-Handoff für religiöse Inhalte

**Zweck:** Diese Datei bereitet die qualifizierte islamische Endprüfung vor. Sie ersetzt den Fachreview nicht und erklärt nicht selbst, welche Fiqh-Position „richtig“ ist.

Automatisch erzeugte Detailbasis: [`INHALTE-PRUEFUNG.md`](./INHALTE-PRUEFUNG.md)  
Quellenbefunde: [`QUELLENPRUEFUNG-BEFUNDE.md`](./QUELLENPRUEFUNG-BEFUNDE.md)

## 1. Aktueller Umfang

Die automatisch erzeugte Prüfliste weist aktuell aus:

- **322 religiöse Einträge insgesamt**
- **166 ohne Einzelnachweis**
- **70 für diese App verfasst**

Ein vorhandener Quellenverweis bedeutet nur, dass eine Quelle angegeben ist. Er bestätigt nicht automatisch, dass die Quelle die konkrete Aussage trägt, die Übersetzung korrekt ist oder die praktische Regel richtig wiedergegeben wird.

## 2. Priorität P0 – zuerst prüfen

### A. Praktische Gebetsregeln

Diese Inhalte sind besonders kritisch, weil Nutzer ihr Handeln unmittelbar danach ausrichten können:

- Salah / Gebetspraxis
- Sujud as-Sahw
- Qasr auf Reisen
- Jamʿ / Zusammenlegen von Gebeten
- verpasste Gebete / Nachholen
- frauenspezifische Gebetsfragen
- Janazah-Gebet
- Eid-Gebet

Pro Aussage prüfen:

1. Ist sie deskriptiv oder normativ?
2. Wenn normativ: ist die Rechtsposition eindeutig benannt?
3. Gibt es relevante Madhhab-Unterschiede?
4. Ist eine Ausnahme/Bedigung unterschlagen, durch die die Aussage irreführend wird?
5. Trägt die angegebene Quelle wirklich genau diese Aussage?
6. Ist die deutsche Formulierung präzise genug, dass ein Laie sie nicht falsch versteht?

### B. Madhhab-Unterschiede

Jede Vergleichsdarstellung separat prüfen:

- Ist die Frage tatsächlich zwischen den Rechtsschulen so trennscharf?
- Wird keine Schule übervereinfacht?
- Werden Minderheits-/Mehrheitspositionen nicht ohne Kennzeichnung vermischt?
- Wird eine konkrete Position nicht fälschlich als universeller Islam dargestellt?

### C. Hajj, Umrah und heilige Stätten

Dieser Bereich ist besonders priorisiert, weil ein Teil der Texte speziell für die App geschrieben wurde und mehrere Einträge aktuell keinen Einzelnachweis tragen.

Mindestens prüfen:

- Ihram
- Tawaf
- Saʿi
- Haarkürzung
- Mina
- Arafat
- Muzdalifah
- Steinigung / Opfer / Haarkürzung
- Tawaf al-Ifada
- Tage von Tashriq
- Tawaf al-Wada
- Aussagen zu Makkah, Madinah und Jerusalem

Wichtig: Ablaufbeschreibung, Pflichtgrad, Bedingungen, Ausnahmen und Folgen eines Versäumnisses nicht vermischen.

## 3. Priorität P1 – danach

### Duas und Adhkar

Prüfen:

- arabischer Wortlaut
- Transliteration, falls vorhanden
- deutsche Bedeutung
- Belegstelle
- Authentizitätsangabe, falls die App eine solche nennt
- Anzahl/Wiederholung nur dann als verbindlich darstellen, wenn belegt

### Hadith-Inhaltsangaben

Die App kennzeichnet diese als sinngemäße Inhaltsangaben, nicht als wörtliche Zitate. Prüfen:

- Hadith-Nummer passt
- Inhaltsangabe verfälscht die Aussage nicht
- keine zusätzliche normative Schlussfolgerung wird in den Hadith hineingelesen

### Quiz-/Lerninhalte

Frage, richtige Antwort und Erklärung gemeinsam prüfen. Besonders beachten:

- Aqida-Begriffe
- Engel/Glaubenssäulen
- Qadr
- Barzakh
- historische Titel/Personen
- Aussagen mit nur einer möglichen Antwort trotz legitimer Differenzierung

## 4. Prüfform für jede Beanstandung

Für eine Korrektur bitte möglichst dieses Format verwenden:

```text
ID / Bereich:
Aktueller Text:
Bewertung: PASS / ÄNDERN / ENTFERNEN / DIFFERENZIEREN
Problem:
Empfohlene Formulierung:
Quelle(n):
Madhhab-/Meinungsunterschied relevant: JA / NEIN
Hinweis für Entwickler:
```

Dadurch kann die Entwicklung eine fachliche Korrektur exakt umsetzen, ohne selbst eine religiöse Rechtsposition zu erfinden.

## 5. Freigaberegeln

Ein Eintrag darf für den P0-Fachreview nur als geprüft gelten, wenn:

- der konkrete Inhalt gelesen wurde;
- die Quelle bei normativen Aussagen tatsächlich geprüft wurde;
- relevante Meinungsunterschiede berücksichtigt wurden;
- die deutsche Nutzerformulierung geprüft wurde;
- Beanstandungen entweder umgesetzt oder bewusst dokumentiert entschieden wurden.

„Quelle vorhanden“ allein ist kein PASS.

## 6. Was die Entwicklung bis zur Freigabe nicht tun soll

- keine Fiqh-Lücke durch KI oder Vermutung füllen;
- keine unsichere Position als Konsens formulieren;
- keine Madhhab-Unterschiede eigenmächtig glätten;
- keine fehlende Quelle erfinden;
- keine normative Aussage nur deshalb freigeben, weil die UI technisch funktioniert.

## 7. Abschlussprotokoll

```text
Reviewer:
Qualifikation / fachlicher Hintergrund:
Datum:
Geprüfter Commit:

P0 praktische Gebetsregeln: PASS / OPEN
Madhhab-Unterschiede: PASS / OPEN
Hajj/Umrah: PASS / OPEN
Duas/Adhkar: PASS / OPEN
Hadith-Inhaltsangaben: PASS / OPEN
Quiz/Lernen: PASS / OPEN

Offene Beanstandungen:

Freigabe für Release: JA / NEIN / MIT AUFLAGEN
```

**Wichtig:** Die Freigabe gehört immer zu einem konkreten Commit. Religiöse Inhaltsänderungen nach diesem Commit benötigen erneut eine passende Prüfung.
