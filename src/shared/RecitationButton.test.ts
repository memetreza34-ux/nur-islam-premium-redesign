import { describe, expect, it } from 'vitest';
import { isRecitationUrlAllowed } from './RecitationButton';

describe('Recitation release policy', () => {
  it('allows the documented Quran recitation CDN', () => {
    expect(isRecitationUrlAllowed('https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3')).toBe(true);
  });

  it('blocks Hisn al-Muslim audio until reuse rights are cleared', () => {
    expect(isRecitationUrlAllowed('https://www.hisnmuslim.com/audio/ar/28.mp3')).toBe(false);
    expect(isRecitationUrlAllowed('https://hisnmuslim.com/audio/ar/28.mp3')).toBe(false);
  });

  it('rejects insecure and malformed audio URLs', () => {
    expect(isRecitationUrlAllowed('http://cdn.islamic.network/quran/audio/2.mp3')).toBe(false);
    expect(isRecitationUrlAllowed('not-a-url')).toBe(false);
  });
});
