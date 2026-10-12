import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LegacyFeatureScreen } from './LegacyFeatureScreens';
import { SAHABAH, WOMEN_IN_ISLAM } from '../data/companionData';
import { GLOSSARY_TERMS, KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { HADITH_LIBRARY } from '../data/hadithData';
import { DailyHadithScreen } from './DailyHadithScreen';

describe('Retained content screens', () => {
  it('does not replace the requested companion list with the women list', () => {
    const html = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'sahabah', onBack() {} }));
    expect(html).toContain('Gefährten des Propheten');
    expect(html).not.toContain('Hadith-Sammlung');
    expect(html).toContain(SAHABAH[0].name);
    expect(html).not.toContain(WOMEN_IN_ISLAM[0].name);
  });

  it('labels the women list with its own title', () => {
    const html = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'women', onBack() {} }));
    expect(html).toContain('Frauen im Islam');
    expect(html).not.toContain('Hadith-Sammlung');
    expect(html).toContain(WOMEN_IN_ISLAM[0].name);
    expect(html).not.toContain(SAHABAH[0].name);
  });

  it('renders every women reference and its historical or grading boundary', () => {
    const html = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'women', onBack() {} }));
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.querySelectorAll('.reference-person-list article')];
    expect(cards).toHaveLength(10);
    for (const [index, entry] of WOMEN_IN_ISLAM.entries()) {
      const card = cards[index];
      expect(card.textContent).toContain(entry.note);
      if (entry.sourceNote) expect(card.textContent).toContain(entry.sourceNote);
      expect([...card.querySelectorAll('a')].map(link => link.getAttribute('href'))).toEqual(entry.sources.map(source => source.url));
    }
  });

  it('renders all companion references and qualifications beside the unchanged person ids', () => {
    const html = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'sahabah', onBack() {} }));
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.querySelectorAll('.reference-person-list article')];
    expect(cards).toHaveLength(15);
    for (const [index, entry] of SAHABAH.entries()) {
      const card = cards[index];
      expect(card.textContent).toContain(entry.honorific);
      expect(card.textContent).toContain(entry.role);
      if (entry.sourceNote) expect(card.textContent).toContain(entry.sourceNote);
      expect([...card.querySelectorAll('a')].map(link => link.getAttribute('href'))).toEqual(entry.sources.map(source => source.url));
    }
  });

  it('renders the knowledge catalogue and openable glossary evidence', () => {
    const html = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'knowledge', onBack() {} }));
    expect(html).toContain('Wissensbibliothek');
    expect(html).not.toContain('Hadith-Sammlung');
    const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
    for (const topic of KNOWLEDGE_TOPICS) expect(text).toContain(topic.title);
    for (const entry of GLOSSARY_TERMS) expect(html).toContain(`href="${entry.sourceUrl}"`);
  });

  it('keeps the attributed Tirmidhi grading sources visible in the library and saved detail', () => {
    const library = renderToStaticMarkup(createElement(LegacyFeatureScreen, { featureId: 'hadith-library', onBack() {} }));
    for (const entry of HADITH_LIBRARY.filter(item => item.grading)) {
      const detail = renderToStaticMarkup(createElement(DailyHadithScreen, { hadithId: entry.id, onBack() {} }));
      for (const html of [library, detail]) {
        expect(html).toContain(`href="${entry.grading!.sourceUrl}"`);
        expect(html).toContain(entry.grading!.text);
        if (entry.grading!.comparisonUrl) expect(html).toContain(`href="${entry.grading!.comparisonUrl}"`);
      }
    }
  });
});
