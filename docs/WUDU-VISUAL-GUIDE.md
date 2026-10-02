# Wudu: bebilderte Schrittansicht

Stand: 28.08.2026. Umgesetzt ausschließlich im Wudu-Guide.

## Darstellung

Eine große aktive Schrittkarte ersetzt die zehn gleichzeitig ausgebreiteten Karten.
Vorheriger/nächster Schritt und die aufklappbare Übersicht verwenden denselben
lokal gespeicherten Schrittindex wie bisher. Erst „Abschließen“ setzt den Abschluss.
Die Auswahl „Schritt auswählen“ steht immer oberhalb der Schrittkarte und ihrer
Abbildung. Sie zeigt eine rahmenlose Liste mit kleinen Nummern
und einer beschrifteten Markierung des aktuellen Schritts. Die Liste schließt nach
der Auswahl; Fokus und Ansicht wechseln direkt zur Anleitung. Native graue
Buttonflächen und erhabene Rahmen werden ausdrücklich zurückgesetzt. Vor-/Zurück-
Schaltflächen sind gleichmäßig ausgerichtet. Texte, Aussprache und Bilder bleiben gleich.
Arabisch, bisherige Umschrift, Reihenfolge und bestehende Beschreibung bleiben erhalten.
Neue Klassen sind im zentralen Designsystem definiert, ohne zusätzliche Override-Datei.

Acht statische 3D-Cartoonbilder zeigen Hände, Mund, Nase, Gesicht, Arme, Kopf,
Ohren und Füße. Sie stehen getrennt vom Text auf einer hellen Bildfläche.
Absicht und abschließender Wortlaut erhalten bewusst keine erfundene Körpergeste.
Die Figuren sind stark stilisiert, mit runden Formen und großen Augen; keine
fotorealistischen Körperdarstellungen. Das ist ein Animationsfilm-Look, kein Video.

## Bildherkunft

Alle acht Dateien wurden separat mit der integrierten OpenAI-Bildgenerierung in
Codex aus Text erzeugt, ohne externe Fotos oder Eingabebilder. Die zuvor erzeugten,
realistischeren Entwürfe werden nicht eingebunden. Ihre Originaldateien bleiben
außerhalb des Repos im Generierungsordner, falls sie noch gebraucht werden.

- Dateien: `public/premium-assets/high-res-objects/wudu-step-{hands,mouth,nose,face,arms,head,ears,feet}-v1.webp`
- Je 512 × 512 Pixel; zusammen 295.940 Bytes.
- Konvertierung: `cwebp -q 88 -m 6 -alpha_q 100 -resize 512 512`, Alpha erhalten.
- Vollständige Prompts, Originalpfade und SHA-256: [Manifest](image-asset-provenance.json).
- Offline-App-Shell ab v25. Keine neue KI- oder Chatfunktion in der App.

Der Herkunftsnachweis ist keine rechtliche oder religiöse Freigabe. Die Bilder
sind vereinfachte Hilfen, keine vollständige Bewegungsanleitung.

## Aussprache und fachlicher Prüfstatus

Arabische Handlungsnamen (Hände, Mund, Nase) sind ausdrücklich als Bezeichnungen
markiert, nicht als beim Waschen zu sprechende Formeln. Wo Wortlaut vorhanden ist,
steht zusätzlich eine ungefähre, für deutsche Lesegewohnheiten angepasste Umschrift.
Sie ersetzt kein Vorsprechen durch eine kundige Lehrperson. Sonderlaute und lange
Vokale werden unter „Wie lese ich die Aussprachehilfe?“ erklärt.

Für die Quellenkontrolle wurden diese Texte am 28.08.2026 eingesehen:

- [Sahih al-Bukhari 159](https://sunnah.com/bukhari:159): Ablauf der Waschung.
- [Sunan Abi Dawud 135](https://sunnah.com/abudawud:135): unter anderem das Reinigen der Ohren.
- [Sahih Muslim 234a](https://sunnah.com/muslim:234a) und [234b](https://sunnah.com/muslim:234b): Glaubensbekenntnis nach dem Wudu; 234b enthält den in der App verwendeten Grundwortlaut. Das Kapitel ordnet ihn als empfohlen ein, nicht als Pflicht.
- [Jamiʿ at-Tirmidhi 55](https://sunnah.com/tirmidhi:55): erweiterte Fassung einschließlich der Bitte um Reinigung. Darussalam bewertet diese Überlieferung als Daʿif. Das bedeutet nicht, dass auch der Grundwortlaut in Muslim schwach überliefert wäre.
- [Islam Question & Answer, Antwort 45730](https://islamqa.info/en/answers/45730): nennt die abweichenden Bewertungen des Zusatzes durch Ibn Hajar (schwach) und al-Albani (authentisch). Sekundärquelle zur Einordnung der unterschiedlichen Bewertungen, keine von der App erteilte Freigabe.

Auf Rückfrage des Nutzers am 28.08.2026 wurden Grundwortlaut und Zusatz getrennt
nachgeprüft. Nichts wurde als erfunden oder pauschal falsch entfernt: Für den
Grundwortlaut gibt es eine belastbare Quelle, beim Zusatz bestehen unterschiedliche
Bewertungen. Schritt 10 ist nun ausdrücklich freiwillig; beide Quellen und die
Möglichkeit, beim Grundwortlaut zu bleiben, stehen in der App. Der frühere pauschale
Hinweis auf die schwache Tirmidhi-Fassung wurde durch diese differenzierte Einordnung ersetzt.

Die Quellen sind keine pauschale Freigabe aller bestehenden Texte, Bilder oder
Aussprachehilfen. Prüfung durch eine fachkundige Person und Unterschiede zwischen
Rechtsschulen bleiben offen. Kein Reviewstatus wurde auf „approved“ geändert.

## Prüfungen

Automatisierte Tests schützen die Zuordnung der acht Bilder, alle vorhandenen
arabischen Texte samt Aussprache, Bild/Text-Trennung bei 320/390/768 Pixeln,
Vor-/Zurücknavigation, Speicherung, Abschluss und nutzbaren Text bei Bildausfall.

Ergebnis am 28.08.2026: vollständiges `npm run check` bestanden, außerdem alle
14 Browser-Tests aus `wudu-lesson`, `wudu-intro-art` und `learning-intro-art`.
