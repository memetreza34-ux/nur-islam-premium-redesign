# Prüfung der Hadith-Nummern

<!-- Erzeugt von scripts/verify-hadith-references.mjs · npm run hadith:verify
     Nicht von Hand bearbeiten. -->

**Dies ist keine Freigabe.** Geprüft wird eine einzige Sache: ob die zitierte
Nummer in der Sammlung existiert und welcher Text dort steht.

## Was hier geprüft werden kann und was nicht

Die Sammlungen liegen nicht im Repo. Geprüft wird gegen eine öffentlich
abrufbare Ausgabe (`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json`), deren Herkunft im Datensatz selbst nicht
dokumentiert ist — das ist ausdrücklich kein Ersatz für den Druck.

**Sahih al-Bukhari:** Die Nummerierung dieser Ausgabe stimmt mit der von
sunnah.com überein, auf die sich die App bezieht. Drei Proben laufen bei
jedem Durchlauf mit und brechen ab, wenn das nicht mehr gilt.

**Sahih Muslim, Tirmidhi, Ibn Majah:** Nicht nach Nummer prüfbar. Die
verfügbare Muslim-Ausgabe zählt durchlaufend bis 7563, die App zitiert die
Zählung mit Buchstabenzusätzen (2677a). Dieselbe Überlieferung steht dort
unter 6809, hier unter 2677a. Eine Prüfung Nummer gegen Nummer würde lauter
Fehler melden, die keine sind, und ist deshalb unterlassen.

## Ergebnis

- **25** verschiedene Bukhari-Nummern in `src/data` zitiert.
- **25** davon existieren in der Ausgabe.
- **Keine zitierte Nummer fehlt.**
- Keine Muslim-, Tirmidhi- oder Ibn-Majah-Nummer liegt jenseits des Umfangs ihrer Sammlung.

---

## Zitierte Bukhari-Stellen im Wortlaut

Zum Abgleich mit der deutschen Inhaltsangabe in der App. Der Text ist eine
englische Übersetzung, gekürzt.

## Woher die verbreitete 99er-Liste stammt

Beim Prüfen aufgefallen und hier festgehalten, weil es die Beleglage der
Namensliste direkt betrifft:

- **Sahih al-Bukhari 7392** und **Sahih Muslim 2677a** überliefern, dass es neunundneunzig Namen gibt — ohne sie aufzuzählen.
- **Jami at-Tirmidhi 3507** enthält die Aufzählung. In dieser Ausgabe stufen sie Ahmad Muhammad Shakir (Daif), Al-Albani (Daif), Zubair Ali Zai (Daif) ein.

Das ist kein Urteil über einen einzelnen Namen. Es heißt: die *konkrete
Zusammenstellung*, die fast überall als „die 99 Namen" erscheint, hängt an
einer Überlieferung, deren Aufzählung schwach eingestuft wird — und genau
deshalb zeigt die App die Liste als Lernliste und nicht als feststehende
Offenbarung.

---

## Zitierte Tirmidhi-Stellen mit Einstufungen

Einstufungen sind Urteile von Gelehrten, keine Tatsachen. Sie stehen deshalb
alle nebeneinander, mit Namen.

| Nummer | Einstufungen | Zitiert in |
| --- | --- | --- |
| 1924 | Ahmad Muhammad Shakir: Sahih · Al-Albani: Sahih · Bashar Awad Maarouf: Hasan Sahih · Zubair Ali Zai: Isnaad Hasan | hadithData.ts |
| 1956 | Ahmad Muhammad Shakir: Sahih · Al-Albani: Sahih · Zubair Ali Zai: Isnaad Hasan | hadithData.ts |
| 1987 | Ahmad Muhammad Shakir: Hasan · Al-Albani: Hasan · Bashar Awad Maarouf: Hasan Sahih · Zubair Ali Zai: Hasan | hadithData.ts |
| 2317 | Ahmad Muhammad Shakir: Sahih · Al-Albani: Sahih · Bashar Awad Maarouf: Hasan · Zubair Ali Zai: Daif | hadithData.ts |
| 3895 | Ahmad Muhammad Shakir: Sahih · Al-Albani: Sahih · Bashar Awad Maarouf: Hasan Sahih · Zubair Ali Zai: Hasan | hadithData.ts |

---

## Zitierte Bukhari-Stellen im Wortlaut (Fortsetzung)

### Sahih al-Bukhari 1

Zitiert in: hadithData.ts, islamicLearningContent.ts

> Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 3

Zitiert in: islamicLearningContent.ts

> Narrated 'Aisha (the mother of the faithful believers):The commencement of the Divine Inspiration to Allah's Messenger (ﷺ) was in the form of good dreams which came true like bright daylight, and then the love of seclusion was bestowed upon him. He used to go in seclusion in the cave of Hira where he used to worship (Allah alone) continuously for many days before his desire to see his family. He u

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 8

Zitiert in: hadithData.ts

> Narrated Ibn 'Umar: Allah's Messenger (ﷺ) said: Islam is based on (the following) five (principles): 1. To testify that none has the right to be worshipped but Allah and Muhammad is Allah's Messenger (ﷺ). 2. To offer the (compulsory congregational) prayers dutifully and perfectly. 3. To pay Zakat (i.e. obligatory charity) . 4. To perform Hajj. (i.e. Pilgrimage to Mecca) 5. To observe fast during t

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 10

Zitiert in: hadithData.ts

> Narrated 'Abdullah bin 'Amr: The Prophet (ﷺ) said, "A Muslim is the one who avoids harming Muslims with his tongue and hands. And a Muhajir (emigrant) is the one who gives up (abandons) all what Allah has forbidden

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 13

Zitiert in: hadithData.ts

> Narrated Anas: The Prophet (ﷺ) said, "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 69

Zitiert in: hadithData.ts

> Narrated Anas bin Malik:The Prophet (ﷺ) said, "Facilitate things to people (concerning religious matters), and do not make it hard for them and give them good tidings and do not make them run away (from Islam)

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 142

Zitiert in: duaData.ts

> Narrated Anas:Whenever the Prophet (ﷺ) went to answer the call of nature, he used to say, "Allah-umma inni a`udhu bika minal khubuthi wal khaba'ith i.e. O Allah, I seek Refuge with You from all offensive and wicked things (evil deeds and evil spirits)

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 2893

Zitiert in: duaData.ts

> Narrated Anas bin Malik:The Prophet (ﷺ) said to Abu Talha, "Choose one of your boy servants to serve me in my expedition to Khaibar." So, Abu Talha took me letting me ride behind him while I was a boy nearing the age of puberty. I used to serve Allah's Messenger (ﷺ) when he stopped to rest. I heard him saying repeatedly, "O Allah! I seek refuge with You from distress and sorrow, from helplessness 

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 2989

Zitiert in: hadithData.ts

> Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "There is a (compulsory) Sadaqa (charity) to be given for every joint of the human body (as a sign of gratitude to Allah) everyday the sun rises. To judge justly between two persons is regarded as Sadaqa, and to help a man concerning his riding animal by helping him to ride it or by lifting his luggage on to it, is also regarded as Sadaqa, and (sayi

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 3371

Zitiert in: duaData.ts

> Narrated Ibn `Abbas:The Prophet (ﷺ) used to seek Refuge with Allah for Al-Hasan and Al-Husain and say: "Your forefather (i.e. Abraham) used to seek Refuge with Allah for Ishmael and Isaac by reciting the following: 'O Allah! I seek Refuge with Your Perfect Words from every devil and from poisonous pests and from every evil, harmful, envious eye

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 4522

Zitiert in: duaData.ts

> Narrated Anas:The Prophet (ﷺ) used to say, "O Allah! Our Lord! Give us in this world that, which is good and in the Hereafter that, which is good and save us from the torment of the Fire

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 5027

Zitiert in: hadithData.ts

> Narrated `Uthman:The Prophet (ﷺ) said, "The best among you (Muslims) are those who learn the Qur'an and teach it

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 5743

Zitiert in: duaData.ts

> Narrated `Aisha:The Prophet (ﷺ) used to treat some of his wives by passing his right hand over the place of ailment and used to say, "O Allah, the Lord of the people! Remove the trouble and heal the patient, for You are the Healer. No healing is of any avail but Yours; healing that will leave behind no ailment

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6013

Zitiert in: hadithData.ts

> Narrated Jarir bin `Abdullah:The Prophet (ﷺ) said, "He who is not merciful to others, will not be treated mercifully

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6018

Zitiert in: hadithData.ts

> Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "Anybody who believes in Allah and the Last Day should not harm his neighbor, and anybody who believes in Allah and the Last Day should entertain his guest generously and anybody who believes in Allah and the Last Day should talk what is good or keep quiet. (i.e. abstain from all kinds of evil and dirty talk)

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6114

Zitiert in: hadithData.ts

> Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6115

Zitiert in: duaData.ts

> Narrated Sulaiman bin Sarad:Two men abused each other in front of the Prophet (ﷺ) while we were sitting with him. One of the two abused his companion furiously and his face became red. The Prophet (ﷺ) said, "I know a word (sentence) the saying of which will cause him to relax if this man says it. Only if he said, "I seek refuge with Allah from Satan, the outcast.' " So they said to that (furious) 

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6306

Zitiert in: duaData.ts

> Narrated Shaddad bin Aus:The Prophet (ﷺ) said "The most superior way of asking for forgiveness from Allah is: 'Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana `Abduka, wa ana `ala `ahdika wa wa`dika mastata`tu, A`udhu bika min Sharri ma sana`tu, abu'u Laka bini`matika `alaiya, wa abu'u laka bidhanbi faghfir lee fa innahu la yaghfiru adhdhunuba illa anta." The Prophet (ﷺ) added. "If some

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6307

Zitiert in: duaData.ts

> Narrated Abu Huraira:I heard Allah's Messenger (ﷺ) saying." By Allah! I ask for forgiveness from Allah and turn to Him in repentance more than seventy times a day

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6312

Zitiert in: duaData.ts

> Narrated Hudhaifa:When the Prophet (ﷺ) went to bed, he would say: "Bismika amutu wa ahya." and when he got up he would say:" Al-hamdu li l-lahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6318

Zitiert in: dhikrData.ts

> Narrated `Ali:Fatima complained about the blisters on her hand because of using a mill-stone. She went to ask the Prophet for servant, but she did not find him (at home) and had to inform `Aisha of her need. When he came, `Aisha informed him about it. `Ali added: The Prophet (ﷺ) came to us when we had gone to our beds. When I was going to get up, he said, "'Stay in your places," and sat between us

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6346

Zitiert in: duaData.ts

> Narrated Ibn `Abbas:Allah's Messenger (ﷺ) used to say at a time of distress, "La ilaha illal-lahu Rabbul-l-'arsh il-'azim, La ilaha illallahu Rabbu-s-samawati wa Rabbu-l-ard, Rabbu-l-'arsh-il-Karim

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6398

Zitiert in: additionalNamesOfAllahEvidence.ts

> Narrated Abu Musa:The Prophet (ﷺ) used to invoke Allah with the following invocation: 'Rabbi-ghfir-li Khati 'ati wa jahli wa israfi fi `Amri kullihi, wa ma anta a'lamu bihi minni. Allahumma ighfirli khatayaya wa 'amdi, wa jahli wa jiddi, wa kullu dhalika'indi. Allahumma ighrifli ma qaddamtu wa ma akhartu wa ma asrartu wa ma a'lantu. Anta-l-muqaddimu wa anta-l-mu'akh-khiru, wa anta 'ala kulli shai'

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 6464

Zitiert in: hadithData.ts

> Narrated `Aisha:Allah's Messenger (ﷺ) said, "Do good deeds properly, sincerely and moderately and know that your deeds will not make you enter Paradise, and that the most beloved deed to Allah is the most regular and constant even if it were little

Stimmt mit der Angabe in der App überein: ☐

### Sahih al-Bukhari 7392

Zitiert in: verifiedNamesOfAllahData.ts

> Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "Allah has ninety-nine Names, one-hundred less one; and he who memorized them all by heart will enter Paradise." To count something means to know it by heart

Stimmt mit der Angabe in der App überein: ☐
