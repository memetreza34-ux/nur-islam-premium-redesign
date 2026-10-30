import { describe, expect, it } from 'vitest';
import { UMMAH_COUNTRIES, UMMAH_REGIONS } from './ummahData';
import { ISLAMIC_EVENTS, WHITE_DAYS_EVENT, findIslamicEvents } from './islamicEventsData';
import { DHIKR_ROUTINE_BY_ID } from './dhikrData';
import { GLOSSARY_TERMS, KNOWLEDGE_TOPICS } from './knowledgeData';
import { QUIZ_CATEGORIES, getQuizSourceUrl } from './quizData';
import { DUAS } from './duaData';
import { getCalendarEvent } from '../services/calendarViewModel';
import { getHijriDay, getHijriMonth } from '../services/hijriCalendar';

describe('Content integrity corrections', () => {
  it('keeps citations on every knowledge introduction, section and glossary definition', () => {
    expect(KNOWLEDGE_TOPICS).toHaveLength(11);
    expect(GLOSSARY_TERMS).toHaveLength(6);
    expect(KNOWLEDGE_TOPICS.flatMap(topic => topic.sections)).toHaveLength(41);
    for (const entry of [...KNOWLEDGE_TOPICS, ...KNOWLEDGE_TOPICS.flatMap(topic => topic.sections), ...GLOSSARY_TERMS]) {
      expect(entry.source.length).toBeGreaterThan(8);
      expect(entry.sourceUrl).toMatch(/^https:\/\/(?:quran\.com|sunnah\.com|islamansiklopedisi\.org\.tr)\//);
    }
  });

  it('does not turn educational knowledge summaries into universal duties or guarantees', () => {
    const text = JSON.stringify(KNOWLEDGE_TOPICS);
    expect(text).not.toMatch(/Ein Muslim ist stets wahrhaftig|Pflicht für jeden Muslim, Mann oder Frau|Millionen von Muslimen|auf Essen, Trinken und Intimität/);
    const fasting = KNOWLEDGE_TOPICS.find(topic => topic.id === 'sawm')!.sections[0];
    expect(fasting.text).toContain('Geschlechtsverkehr');
    expect(fasting.source).toContain('Quran 2:187');
    expect(fasting.source).toContain('1954');
    const schools = KNOWLEDGE_TOPICS.find(topic => topic.id === 'madhhabs')!;
    expect(schools.sections.slice(0, 4).every(section => section.sourceUrl.includes('islamansiklopedisi'))).toBe(true);
    expect(schools.sections[0].text).toContain('Analogieschluss');
    expect(schools.sections[1].text).toContain('nicht pauschal');
    expect(KNOWLEDGE_TOPICS.find(topic => topic.id === 'knowledge-islam')!.sections[1].source).toContain('nach al-Albani');
  });

  it('does not turn unsourced demographics into facts with a caveat', () => {
    expect(UMMAH_COUNTRIES).toHaveLength(17);
    for (const item of [...UMMAH_COUNTRIES, ...UMMAH_REGIONS]) {
      expect(item).not.toHaveProperty('share');
      expect(item).not.toHaveProperty('info');
      expect(JSON.stringify(item)).not.toMatch(/\d+(?:[.,]\d+)?%/);
    }
  });

  it('never fixes Qadr to the 27th and displays its reminder on all five search nights', () => {
    const qadr = ISLAMIC_EVENTS.find(event => event.id === 'laylat-al-qadr')!;
    expect(qadr.days).toEqual([21, 23, 25, 27, 29]);
    expect(qadr.meaning).toContain('Kein festes Datum');
    expect(qadr.meaning).toContain('Sahih al-Bukhari 2017');
    expect(qadr.practice).toContain('vorherigen Abend');
    const reached = new Set<number>();
    for (let day = 1; day <= 740; day += 1) {
      const date = new Date(2026, 0, day, 12);
      const hijriDay = getHijriDay(date);
      if (getHijriMonth(date) === 9 && qadr.days.includes(hijriDay)) {
        expect(getCalendarEvent(date)?.title).toBe('Laylat al-Qadr suchen');
        reached.add(hijriDay);
      }
    }
    expect([...reached].sort((a, b) => a - b)).toEqual([...qadr.days]);
    expect(findIslamicEvents(9, 27).map(event => event.id)).toContain('last-ten-ramadan');
  });

  it('does not recommend uncertain special occasions or predict three exact full-moon days', () => {
    expect(ISLAMIC_EVENTS.map(event => event.id)).not.toEqual(expect.arrayContaining(['mawlid']));
    for (const id of ['mawlid', 'isra-miraj', 'mid-shaban']) expect(ISLAMIC_EVENTS.some(event => event.id === id)).toBe(false);
    expect(WHITE_DAYS_EVENT.meaning).toContain('keine exakte Vollmondvorhersage');
  });

  it('pairs counted evening formulas with their complete wording and individual sources', () => {
    const evening = DHIKR_ROUTINE_BY_ID.get('evening')!;
    for (const item of evening.items) expect(item.itemSource).toMatch(/(?:Muslim|Abi Dawud) \d/);
    expect(evening.items.find(item => item.id === 'evening-protection')?.arabic).toContain('فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ');
    expect(evening.items.find(item => item.id === 'evening-tahlil')?.arabic).toContain('لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ');
    const repentance = DHIKR_ROUTINE_BY_ID.get('istighfar')!;
    expect(repentance.items.find(item => item.id === 'rabbighfir')?.arabic).toContain('إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ');
    expect(DHIKR_ROUTINE_BY_ID.get('salawat')?.note).toContain('frei gewählte Zählerwerte');
  });

  it('keeps practical qualifications and evidence visible instead of categorical shortcuts', () => {
    const section = (topic: string, subtitle: string) => KNOWLEDGE_TOPICS.find(item => item.id === topic)!.sections.find(item => item.subtitle === subtitle)!;
    expect(section('zakah', 'Berechnung').text).toContain('Nisab');
    expect(section('zakah', 'Berechnung').source).toContain('1573');
    expect(section('sawm', 'Ausnahmen').text).toContain('keine pauschale dauerhafte Befreiung');
    expect(section('salah', 'Voraussetzung').text).toContain('nicht vor jedem Gebet');
    expect(JSON.stringify(KNOWLEDGE_TOPICS)).not.toContain('100% gültig');
  });

  it('does not invent the recording angels’ position or authenticate a Qudsi narration by its label', () => {
    const questions = QUIZ_CATEGORIES.flatMap(category => category.questions);
    expect(questions.find(question => question.id === 'a6')?.explanation).toContain('Quran 82:10–12');
    expect(questions.find(question => question.id === 'had8')?.explanation).toContain('nicht authentisch');
  });

  it('keeps individual, openable citations on all 60 quiz explanations', () => {
    const questions = QUIZ_CATEGORIES.flatMap(category => category.questions);
    expect(questions).toHaveLength(60);
    for (const question of questions) {
      expect(question.source).toBeTruthy();
      expect(getQuizSourceUrl(question.source)).toMatch(/^https:\/\/(?:quran\.com|sunnah\.com)\//);
      expect(question.options).toHaveLength(4);
      expect(question.options[question.correctAnswer]).toBeTruthy();
    }
    expect(getQuizSourceUrl('Quran 112:1–4')).toBe('https://quran.com/112/1-4');
    expect(getQuizSourceUrl('Sahih Muslim 8a')).toBe('https://sunnah.com/muslim:8a');
    expect(getQuizSourceUrl('unbekannte Quelle')).toBeUndefined();
  });

  it('does not restore unsupported rankings, counts or a guaranteed Istikhara dream', () => {
    const questions = QUIZ_CATEGORIES.flatMap(category => category.questions);
    expect(JSON.stringify(questions)).not.toMatch(/über 5000|über 2200|bester Freund|extreme Schüchternheit|beste Handlung nach/);
    expect(questions.find(question => question.id === 'ak9')?.source).toBe('Quran 5:2');
    expect(questions.find(question => question.id === 'dua10')?.explanation).toContain('nicht verlangt');
  });

  it('keeps replacement questions paired with their new answers, not the old option text', () => {
    const questions = QUIZ_CATEGORIES.flatMap(category => category.questions);
    const answers: Record<string, string> = {
      w2: 'Maryam', w10: 'Umm Salama', ak1: 'Als großartig', ak2: 'Sanftmut',
      ak10: 'Einem Mitmenschen zulächeln', had3: 'Umar ibn al-Khattab', had4: 'Sahih Muslim', had9: 'Von den Absichten (Niyyah)',
      dua2: 'Als Anbetung', dua7: 'Ebenfalls „Amin“ sagen', dua8: 'Beim Verlassen des Hauses',
      dua9: 'Vor Ungeduld und vorschnellem Aufgeben',
    };
    for (const [id, answer] of Object.entries(answers)) {
      const question = questions.find(entry => entry.id === id)!;
      expect(question.options[question.correctAnswer]).toBe(answer);
    }
  });

  it('pairs the three compilation citations with their documented scope, not AI approval', () => {
    for (const id of ['dua_sorrow_1', 'dua_hardship_4', 'dua_mercy_5']) {
      const dua = DUAS.find(entry => entry.id === id)!;
      expect(dua.sourceUrl).toMatch(/^https:\/\/sunnah\.com\/hisn:\d+$/);
      expect(dua.sourceNote?.length).toBeGreaterThan(40);
    }
    expect(DUAS.find(entry => entry.id === 'dua_sorrow_1')?.translation).toContain('Wissen des Verborgenen');
    expect(DUAS.find(entry => entry.id === 'dua_morning_1')?.translation).toContain('Zuflucht');
    expect(DUAS.find(entry => entry.id === 'dua_bathroom_enter')?.arabic).toMatch(/^اللَّهُمَّ/);
    expect(DUAS.find(entry => entry.id === 'dua_eating_before')?.translation).toBe('Im Namen Allahs.');
  });
});
