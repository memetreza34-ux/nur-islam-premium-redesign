import { beforeEach, describe, expect, it } from 'vitest';
import { collectLocalState } from './nurBackend';
import { createPremiumFolder, createPremiumReminder, createPremiumRoutine, readPremiumSettings, savePremiumJournalNote, writePremiumSettings, writeQuranPlan } from './premiumLocalService';

describe('local Premium privacy boundary', () => {
  beforeEach(() => localStorage.clear());

  it('filters the removed assistant out of old saved Home settings', () => {
    localStorage.setItem('local_nur_premium_settings_v1', JSON.stringify({
      accent: 'sapphire',
      widgets: ['quran'],
      homeOrder: ['assistant', 'inspiration', 'journey'],
      hiddenHomeSections: ['assistant', 'recommendations'],
    }));
    const settings = readPremiumSettings();
    expect(settings.homeOrder).toEqual(['inspiration', 'journey', 'continue', 'discover', 'recommendations']);
    expect(settings.hiddenHomeSections).toEqual(['recommendations']);
    expect(settings.widgets).toEqual(['quran']);
    expect(settings.accent).toBe('sapphire');
  });

  it('never includes local Premium state in the generic cloud backup payload', () => {
    writePremiumSettings({
      accent: 'sapphire',
      widgets: ['prayer', 'quran'],
      homeOrder: ['journey', 'discover', 'continue', 'inspiration', 'recommendations'],
      hiddenHomeSections: ['recommendations'],
    });
    writeQuranPlan({ enabled: true, targetDays: 60, startedAt: '2026-08-17T12:00:00.000Z' });
    createPremiumRoutine('Morgenroutine', ['Morgen-Adhkar', '5 Minuten Quran'], '06:30');
    createPremiumReminder('Abend-Adhkar', '20:30');
    createPremiumFolder('Ramadan');
    savePremiumJournalNote({ title: 'Privat', body: 'Diese Notiz bleibt auf diesem Gerät.' });

    const premiumKeys = Object.keys(localStorage).filter((key) => key.startsWith('local_nur_premium_'));
    expect(premiumKeys.length).toBeGreaterThan(0);
    expect(collectLocalState()).toEqual({});
  });
});
