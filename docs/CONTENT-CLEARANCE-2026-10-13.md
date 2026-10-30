# Quellenprüfung und Bereinigung der religiösen Inhalte

Stand: 13.10.2026, Web-App/PWA, Arbeitsbranch `design/claude-design-system`.

**Inhaltsentscheidung abgeschlossen:** [Betreiberfreigabe vom 13.10.2026](CONTENT-RELEASE-DECISION-2026-10-13.md). Der Betreiber nimmt den hier dokumentierten Inhaltsstand für den Release an. Eine externe religiöse Prüfung ist keine Release-Voraussetzung.

Auf Wunsch des Betreibers wird kein weiterer Mensch zur App-Prüfung hinzugezogen. Die App und ihre privaten Daten wurden keinem Prüfer geschickt. Dieser Durchgang vergleicht Texte mit veröffentlichten Quellen, korrigiert nachgewiesene Fehler und begrenzt Aussagen, deren Quelle weniger trägt. Er ist keine erfundene Gelehrtenfreigabe, eigene Fatwa oder Bestätigung völliger Fehlerfreiheit. Kein `approved`-Status wurde gesetzt; Veröffentlichung und Nutzungsrechte sind getrennt zu behandeln.

Die aktuelle [Prüfmappe](INHALTE-PRUEFUNG.md) erfasst 1.171 Positionen, davon 24 ohne direkte Einzelfundstelle und 959 redaktionell verfasste Positionen. Der Anstieg gegenüber 1.146 stammt aus den 25 bisher fehlenden Propheten-Kurseinführungen. Leitfäden, Rechtsschulen, Praxis, Propheten und Kalender enthalten jetzt ihre ganzen Texte, nicht nur Titel. Die 24 fehlenden direkten Einzelbelege gehören zur traditionellen Namenliste: Sie werden weiterhin als solche eingeordnet, nicht als bewiesene kanonische Aufzählung. Die Mappe bleibt ein Inventar dieser Bestände; sie behauptet keine vollständige automatische Extraktion jeder dynamischen UI-Aussage.

## Abgeschlossener Korrekturdurchgang

| Bereich | Bearbeitung und Beweisgrenze |
|---|---|
| Grundlagenkurse | Seerah-Nachtrag zu den bereits dokumentierten 40 Lektionen: jetzt 44/44 bestehende Lektionen, 465 Inventarpositionen quellenbezogen bearbeitet. Didaktische Lehren ausdrücklich von Quellenwortlaut getrennt. |
| Propheten | 25 Katalogeinträge, 25 Übersichten, 25 Einführungen und 97 Kapitel im aktuellen Inventar. Zitierte Quran-Passagen gelesen; keine spätere Biografie automatisch als Quran-Tatsache übernommen. Die Korrekturen unten schließen konkrete Überdehnungen. |
| Praxisleitfäden | 11 Leitfäden, 91 Schritte, 102 Inventarpositionen einschließlich Einleitungen und Tipps. Quellen am Schritt; keine pauschale Zusage, dass jede Abweichung das Gebet ungültig mache oder durch Sahw behoben werde. |
| Rechtsschulen | Acht Vergleiche mit jeweils vier Positionen: Fundstellen sichtbar; Geschlecht, Varianten und Fajr-Qunut präzisiert. Vier Katalogtexte auf einschlägige TDV-Fachartikel begrenzt. |
| Alltag und Reue | Alle 17 Einträge samt Beispielen betrachtet. Beispiele bleiben redaktionell; schwere Verfehlungen nicht zu individuellen Schuldurteilen oder Verzweiflungszusagen verkürzt. |
| Hajj/Umrah/Orte | Zwölf Stationen mit konkreten Fundstellen ergänzt; sechs Ortsbeschreibungen gegen Quran, Hadith oder historische Ortsartikel eingeordnet. Kein individuelles Urteil über Vollständigkeit einer Pilgerfahrt. |
| Kalender/Fastenplan | Zwölf Anlässe und regelmäßige Fastenhinweise belegt. Ramadan-Fasten nicht als freiwillig bezeichnet. Beide Eid-Tage und Tashriq auch im separaten Vorschlags-/Erinnerungsdienst ausgeschlossen. Pilgerausnahme ausdrücklich begrenzt. |
| Quran-Reader | Bestätigte abgeschnittene deutsche Anbieterfassung von 26:63 aus Netz und Cache abgewiesen. Arabischer Text und unabhängige Lesehilfe bleiben verwendbar. Keine selbst erfundene Ergänzung des Übersetzertextes. Dies ist keine vollständige Zeile-für-Zeile-Prüfung aller 6.236 deutschen Übersetzungsverse. |
| Gebetserinnerungen | Ungültige Uhrzeiten, Fallback und veraltetes Datum lösen nichts aus. Vergleich und täglicher Schlüssel verwenden die Zeitzone des Zeitplans. |

Die bereits dokumentierten Abgleiche für Hadith, Duas, Namen, Dhikr, Wissen, Quiz und Personen bleiben im [appweiten Bericht](APP-CONTENT-AUDIT-2026-10-11.md) verlinkt. Sie werden hier nicht als frisch wiederholte unabhängige Prüfungen ausgegeben.

## Konkrete Quellen und Korrekturen

### Seerah

[Al-Bukhari 3](https://sunnah.com/bukhari:3) trägt Hira, Khadija und Waraqas Ankündigung von Widerstand. Sein zitierter Quran-Auszug reicht bis 96:3; die zusätzlich gelesenen [96:1–5](https://quran.com/96/1-5) tragen Erschaffung, Lesen und Lehren, nicht sämtliche Ursachen späterer Verfolgung.

[Al-Bukhari 3905](https://sunnah.com/bukhari:3905) beschreibt frühere Auswanderer, Vorräte, Nachrichten und Wegführer; [9:40](https://quran.com/9/40) nennt Höhle und Beistand. [59:8–9](https://quran.com/59/8-9) trägt Auswanderer und Unterstützer, keine vollständige politische Gemeindeordnung. Die Lehre über Planung ist als redaktionelle Betrachtung erkennbar. [33:21](https://quran.com/33/21) und [68:4](https://quran.com/68/4) tragen Vorbild und Charakter, keine unbelegte Liste sämtlicher Einzelregeln.

### Propheten

- Adam: [2:30–34](https://quran.com/2/30-34) nicht zur einzigen Übersetzung von Khalifa oder vollständigen Willensfreiheitslehre verkürzt.
- Idris: [19:56–57](https://quran.com/19/56-57) spricht von hoher Stätte; deren genaue Art wird nicht festgelegt.
- Opfergeschichte: [37:100–111](https://quran.com/37/100-111) nennt den Sohn dort nicht namentlich. Keine Namenszusage allein aus diesen Versen.
- Yusuf: [12:4–10](https://quran.com/12/4-10) berichtet nicht, die Brüder hätten den Traum gehört. Diese Ursache entfernt.
- Musa: unbelegte Häufigkeitsrangfolge entfernt; Rettung bei [26:63](https://quran.com/26/63) gegen vollständige Versbedeutung gelesen.
- Dhul-Kifl: [21:85–86](https://quran.com/21/85-86) und [38:48](https://quran.com/38/48) nennen ihn unter Geduldigen/Guten; kein unbelegter Mehrheitsbericht von Gelehrten ergänzt.
- Yunus: [37:139–148](https://quran.com/37/139-148) nicht zu einer unzweifelhaften Chronologie der erneuten Sendung gemacht.
- Yahya: [19:7](https://quran.com/19/7) nicht zu einer abschließenden historischen Aussage über jeden früher verwendeten Namen erweitert.
- Isa: In [3:52](https://quran.com/3/52) fragt Isa nach Helfern; falsche Zuordnung korrigiert.
- Dawud: [4:163](https://quran.com/4/163) als konkrete Fundstelle für den Zabur ergänzt.

Die Kapitel-Merksätze sind als Lernlehren ausgewiesen. Eine didaktische Schlussfolgerung wird nicht mehr mit „Sicher im Quran belegt“ überschrieben. Erzählungen bleiben bei ihren angegebenen Passagen, ohne eine vollständige Tafsir-, Chronologie- oder Aussprachezertifizierung zu behaupten.

### Wudu und Gebet

- [Al-Bukhari 164](https://sunnah.com/bukhari:164), [Muslim 235a](https://sunnah.com/muslim:235a), [Abu Dawud 135](https://sunnah.com/abudawud:135): unterschiedliche berichtete Waschungen/Wiederholungen. Dreimal ist keine allgemeine Mindestzahl aller Schritte. [TDV ABDEST](https://islamansiklopedisi.org.tr/abdest) ordnet Absicht, Reihenfolge und schulabhängige Details ein.
- Die Abschluss-Lernfassung endet beim Bekenntnis aus [Muslim 234b](https://sunnah.com/muslim:234b). Der Zusatz aus [Tirmidhi 55](https://sunnah.com/tirmidhi:55), online als Daif nach Darussalam bewertet, ist in Arabisch, Umschrift und Aussprachehilfe ausgelassen. Keine eigene Bewertung der Überlieferungskette.
- [TDV NAMAZ](https://islamansiklopedisi.org.tr/namaz) begründet die Einordnung der Gebetsbestandteile und schulabhängigen Abläufe. Aus der Übersicht folgen keine pauschalen Gültigkeitsurteile.
- [Al-Bukhari 722](https://sunnah.com/bukhari:722): Antwort hinter dem Imam nicht mit allen Rollen gleichgesetzt. [Tirmidhi 262](https://sunnah.com/tirmidhi:262): Ruku-/Sujud-Wortlaut, keine universelle Dreierpflicht. Tashahhud/Salawat: [Nasa’i 1170](https://sunnah.com/nasai:1170), [al-Bukhari 3370](https://sunnah.com/bukhari:3370); verkürzte deutsche Darstellung als Bedeutungszusammenfassung.
- [Al-Bukhari 1224](https://sunnah.com/bukhari:1224), [1229](https://sunnah.com/bukhari:1229), [Muslim 571a](https://sunnah.com/muslim:571a): verschiedene Fehlerfälle; fehlende Einheiten müssen ergänzt werden. Sahw ist keine pauschale Reparatur jedes Fehlers.
- [Muslim 335c](https://sunnah.com/muslim:335c): ausgefallene Gebete bei Menstruation nicht nachholen; keine automatische Diagnose anderer Blutungen. [Al-Bukhari 516](https://sunnah.com/bukhari:516) trägt Umama, nicht jede beliebige Bewegung. [900](https://sunnah.com/bukhari:900) trägt Moscheebesuch ohne pauschale individuelle Lohnrangfolge.
- [Al-Bukhari 1117](https://sunnah.com/bukhari:1117): körperliche Fähigkeit; [597](https://sunnah.com/bukhari:597): vergessenes Gebet; [580](https://sunnah.com/bukhari:580): Einheit innerhalb der Zeit, keine Erlaubnis absichtlicher Verspätung.
- [Al-Bukhari 1137](https://sunnah.com/bukhari:1137): Nachtgebet/Witr; [Tirmidhi 415](https://sunnah.com/tirmidhi:415): zwölf Rawatib. Witr und Jumuah nicht mehr pauschal freiwillig genannt. [Dar al-Ifta zum versäumten Freitagsgebet](https://www.dar-alifta.org/en/fatwa/details/22217/manner-of-making-up-the-missed-friday-prayer): eine versäumte Predigt nicht automatisch mit versäumtem Gebet gleichgesetzt.
- [Al-Bukhari 1166](https://sunnah.com/bukhari:1166): Istikhara, gedruckter Dua-Teil ausdrücklich Auszug; keine notwendige Traumantwort. [444](https://sunnah.com/bukhari:444), [Muslim 875a](https://sunnah.com/muslim:875a) und [Dar al-Ifta 7874](https://dar-alifta.org/en/fatwa/details/7874/is-it-permissible-to-perform-sunnah-prayer-upon-entrance-to-the-mosque-when-frid): Unterschiede während der Predigt.

Weitere tatsächlich benutzte Wortlautstellen stehen unmittelbar in den jeweiligen Schritten und in der generierten Mappe. Eine Fundstelle trägt nur den dort bezeichneten Sachverhalt, nicht automatisch alle allgemeinen Tipps.

### Schulen, Shahada und Reue

[TDV KIYAM](https://islamansiklopedisi.org.tr/kiyam), [KADE](https://islamansiklopedisi.org.tr/kade), [TEKBIR](https://islamansiklopedisi.org.tr/tekbir), [BESMELE](https://islamansiklopedisi.org.tr/besmele), [AMIN](https://islamansiklopedisi.org.tr/amin) tragen die beschreibenden Vergleiche. Geschlecht und Varianten ergänzt; beim hanbalitischen letzten Sitzen keine universelle Aussage für jede Gebetsart. [Dar al-Ifta 6532](https://www.dar-alifta.org/en/fatwa/details/6532/what-is-the-ruling-for-making-qun%C5%ABt-in-dawn-prayers) trägt Fajr-Qunut/Notlagen; [malikitische Einordnung](https://seekersguidance.org/answers/maliki-fiqh/what-should-i-do-if-i-forget-to-recite-the-qunut-in-the-subh-prayer-maliki-school/) unterscheidet vor Ruku und nach Vergessen. Kein „Hanafi kennt niemals Qunut im Fajr“.

Die vier einschlägigen Fachartikel ([Hanafi](https://islamansiklopedisi.org.tr/hanefi-mezhebi), [Maliki](https://islamansiklopedisi.org.tr/maliki-mezhebi), [Shafii](https://islamansiklopedisi.org.tr/safii-mezhebi), [Hanbali](https://islamansiklopedisi.org.tr/hanbeli-mezhebi)) sind die verbleibenden Katalogquellen. Thematisch unpassende Zusatzlinks und ungeprüfte Zahlenrangfolgen entfernt; Lebensdaten auf Todesjahre begrenzt.

[Dar al-Ifta, How to become a Muslim](https://www.dar-alifta.org/en/article/details/63/how-to-become-a-muslim): Bekenntnis, Überzeugung, Einstieg; eine öffentliche Zeremonie ist keine Voraussetzung. Die Belege zu Reue und verletzten Rechten werden nicht zu einer Pflicht, private Fehler öffentlich offenzulegen.

Bei schweren Verfehlungen stehen [4:48](https://quran.com/4/48) und [25:68–71](https://quran.com/25/68-71) zusammen: keine Verzweiflungszusage gegen aufrichtige Reue. [5:32](https://quran.com/5/32) mit Adressaten- und Ausnahmebezug. [Muslim 1598](https://sunnah.com/muslim:1598) zu Riba ist kein Urteil über jeden modernen Vertrag. [Al-Bukhari 2766](https://sunnah.com/bukhari:2766) trägt schwere Verfehlungen ohne erfundene Einzelfallentscheidung.

### Pilgerfahrt und Kalender

[Muslim 1218a](https://sunnah.com/muslim:1218a) liefert den berichteten Hajj-Ablauf, [al-Bukhari 1524](https://sunnah.com/bukhari:1524) Miqat, [1645/1646](https://sunnah.com/bukhari:1645) sieben Umläufe/Strecken, [1551](https://sunnah.com/bukhari:1551) Tarwiyah, [1755](https://sunnah.com/bukhari:1755) Abschiedstawaf samt Ausnahme, [Abu Dawud 1985](https://sunnah.com/abudawud:1985) Haarkürzung von Frauen (Al-Albanis Bewertung zugeordnet). [Dar al-Ifta](https://dar-alifta.org/en/fatwa/details/6382/the-meaning-of-hajj-ifrad-qiran-and-tamattu) unterscheidet die Pilgerformen; [2:203](https://quran.com/2/203) Abreise nach zwei/drei Tagen. Konkrete Versäumnisfolgen bleiben außerhalb der Ablaufübersicht.

Historische Ortsartikel: [Prophetenmoschee](https://saudipedia.com/en/the-prophet%22s-mosque), [Quba](https://saudipedia.com/%D9%85%D8%B3%D8%AC%D8%AF-%D9%82%D8%A8%D8%A7%D8%A1), [Uhud](https://saudipedia.com/en/mount-uhud), [Hira](https://saudipedia.com/en/ghar-hira). Quran-Bezüge der anderen Orte bleiben am Eintrag. Historische Beschreibungen begründen keine zusätzlichen Besuchsrituale.

Kalender: [Muslim 1134a](https://sunnah.com/muslim:1134a), [al-Bukhari 2004](https://sunnah.com/bukhari:2004), [969](https://sunnah.com/bukhari:969), [Muslim 1162a](https://sunnah.com/muslim:1162a), [al-Bukhari 2017](https://sunnah.com/bukhari:2017), [2024](https://sunnah.com/bukhari:2024), [1503](https://sunnah.com/bukhari:1503), [1991/1992](https://sunnah.com/bukhari:1991), [1988](https://sunnah.com/bukhari:1988), [Muslim 1141b](https://sunnah.com/muslim:1141b), [al-Bukhari 1997/1998](https://sunnah.com/bukhari:1997), [Tirmidhi 761](https://sunnah.com/tirmidhi:761), [747](https://sunnah.com/tirmidhi:747). Wiederholungs-/Fastenempfehlungen mit publizierter Bewertung, nicht eigener Authentifizierung. Berechnete Daten sind keine Mondsichtungsbestätigung.

## Technischer Nachweis und Veröffentlichung

Der letzte Code-/Browsernachweis wird in `docs/release-audit-evidence/content-clearance-verification-2026-10-13.json` festgehalten. Ungültige Browserstarts mit gleichzeitigem Build beziehungsweise altem Preview-Server zählen nicht als Produktbeweis. Der erste vollständige Lauf zeigte 273 bestandene und zehn fehlgeschlagene Fälle: vier veraltete Quran-Hinweise, drei veraltete Wudu-Einleitungstexte und drei mehrdeutige Quellenkartenprüfungen. Die Doppelkarte ist entfernt und die Textprüfungen sind aktualisiert; der abschließende Lauf verwendet einen frischen festen Build. PWA-Shell und Registrierung v79 liefern die Korrekturen nach Aktualisierung aus.

### Abschließende Prüfung

- `npm run check`: Exit 0, **1.041 Tests in 59 Dateien**, Typprüfung, Produktionsbuild und sämtliche enthaltenen Prüfungen bestanden. Neue Quellenpflicht im vorhandenen Leitfaden-Check: alle 91 Schritte brauchen Bezeichnung und HTTPS-Fundstelle; das ist ein Strukturtest, kein religiöses Urteil.
- Vollständiger Browserlauf: **283 bestanden, zwei übersprungen, zwei Fehler in der Testuhr vor dem Laden der App**, 6,4 Minuten. Sämtliche Inhalts-/Quellen-, Offline-, Wudu- und neuen Schrittquellenfälle bestanden.
- Danach ausschließlich Testvorbereitung korrigiert: Uhr eine Minute vor dem Pausenziel installieren, gemäß [Playwright-Dokumentation](https://playwright.dev/docs/clock#consistent-time-and-timers). **Alle neun Startseitentests anschließend bestanden**, 10,2 Sekunden, Exit 0. Kein App-Code nach dem vollständigen Browserlauf geändert. Zusammen sind alle **285 aktiven Browserfälle** bestätigt; dies ist ein kombinierter Nachweis, kein behaupteter einzelner Gesamtaufruf mit Exit 0.
- Vier aktuelle 320-Pixel-Bilder tatsächlich angesehen: Seerah-Leseansicht und Quellen, Wudu-Schritt und Sahw-Quelle. Quellen lesbar, zugeordnet und ohne seitliches Abschneiden in diesen Ansichten. Kopien in `release-audit-evidence/content-clearance-screenshots/`. Keine physische Geräteprüfung daraus ableiten.
- Größen gemessen: JS **389**, CSS **123**, zusammen **512 KB gzip**; Einstieg **93/95 KB**, größter JS-Chunk **323/500 KB raw**. Quellenarbeit +4 KB gegenüber dem vorherigen Budget; keine neue Abhängigkeit, keine erhöhten CSS-/Einstiegs-/Raw-Grenzen.
- Prüfmappe synchron: **1.171 Positionen**, 24 ohne direkten Einzelbeleg (traditionelle Namenliste), 959 redaktionell verfasste Positionen. Kein `approved`-Status, keine Veröffentlichung.

Wirklicher öffentlicher Release bleibt getrennt: echte Anschrift/Kontakt fehlen, konkrete Medien-/Editionsrechte sind nicht durch diesen religiösen Quellenvergleich geklärt, das voreingestellte Cloudprojekt war im Release-Audit inaktiv, Geräteabnahme ist nicht dokumentiert. Keine Veröffentlichung, kein Push und kein erfundenes Prüferzertifikat.
