export type DuaSourceAuditStatus = 'primary-checked' | 'secondary-authentication-checked';

export type DuaSourceAuditRecord = {
  duaId: string;
  status: DuaSourceAuditStatus;
  evidence: string;
  note: string;
};

/**
 * Editorial/source audit performed against the cited Quran/Hadith references.
 * This is NOT a scholarly release approval. It only records that the source
 * reference and the displayed Arabic/sinngemäße meaning were checked against
 * the cited evidence. The global `duas` release review remains pending until a
 * qualified human reviewer signs it off.
 */
export const DUA_SOURCE_AUDIT: readonly DuaSourceAuditRecord[] = [
  { duaId: 'dua_sorrow_1', status: 'secondary-authentication-checked', evidence: 'Ahmad 1/391; Hisn al-Muslim 120', note: 'Text/source matched via Hisn al-Muslim; authentication there attributed to Al-Albani.' },
  { duaId: 'dua_distress_2', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6346; Sahih Muslim 2730a', note: 'Supplication wording matched.' },
  { duaId: 'dua_anxiety_3', status: 'primary-checked', evidence: 'Sahih al-Bukhari 2893', note: 'Supplication wording matched.' },
  { duaId: 'dua_hardship_4', status: 'secondary-authentication-checked', evidence: 'Sahih Ibn Hibban 2427; Hisn al-Muslim 139', note: 'Reference corrected from legacy 974; authentication recorded by Hisn al-Muslim.' },
  { duaId: 'dua_mercy_5', status: 'secondary-authentication-checked', evidence: 'Al-Hakim 1/545; Hisn al-Muslim 88', note: 'Text/source matched; Hisn records a sound chain.' },
  { duaId: 'dua_morning_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6306', note: 'Sayyid al-Istighfar wording matched; German meaning still treated as sinngemäß.' },
  { duaId: 'dua_morning_2', status: 'primary-checked', evidence: 'Sunan Abi Dawud 5088; Jami at-Tirmidhi 3388', note: 'Wording and three-times morning/evening instruction matched.' },
  { duaId: 'dua_morning_3', status: 'primary-checked', evidence: 'Sunan Abi Dawud 5074', note: 'Displayed wording is explicitly labelled as an excerpt from a longer supplication.' },
  { duaId: 'dua_healing_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 5743; Sahih Muslim 2191', note: 'Healing supplication wording matched.' },
  { duaId: 'dua_pain_1', status: 'primary-checked', evidence: 'Sahih Muslim 2202', note: 'Three-times Bismillah and seven-times refuge wording matched.' },
  { duaId: 'dua_forgiveness_1', status: 'primary-checked', evidence: 'Quran 21:87; Jami at-Tirmidhi 3505', note: 'Quran wording matched; Tirmidhi report checked.' },
  { duaId: 'dua_forgiveness_2', status: 'primary-checked', evidence: 'Sahih Muslim 483', note: 'Supplication wording matched.' },
  { duaId: 'dua_forgiveness_3', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6307', note: 'Istighfar wording matched.' },
  { duaId: 'dua_success_1', status: 'primary-checked', evidence: 'Quran 2:201; Sahih al-Bukhari 4522', note: 'Quran wording matched.' },
  { duaId: 'dua_guidance_1', status: 'primary-checked', evidence: 'Sahih Muslim 2721a', note: 'Supplication wording matched.' },
  { duaId: 'dua_knowledge_1', status: 'primary-checked', evidence: 'Sunan Ibn Majah 925', note: 'Wording matched; Darussalam grading recorded as sahih.' },
  { duaId: 'dua_debt_1', status: 'primary-checked', evidence: 'Jami at-Tirmidhi 3563', note: 'Wording matched; Darussalam grading recorded as hasan.' },
  { duaId: 'dua_provision_1', status: 'primary-checked', evidence: 'Sahih Muslim 2697b', note: '2697b selected because it includes wa afini and matches the displayed wording.' },
  { duaId: 'dua_protection_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 3371', note: 'Arabic A’udhu bi-kalimatillah wording matched; hadith context is protection for al-Hasan and al-Husain.' },
  { duaId: 'dua_protection_2', status: 'primary-checked', evidence: 'Sunan Abi Dawud 5095', note: 'Leaving-home wording matched; Al-Albani grading recorded as sahih.' },
  { duaId: 'dua_parents_1', status: 'primary-checked', evidence: 'Quran 17:24', note: 'Extracted supplication wording matched the verse.' },
  { duaId: 'dua_family_1', status: 'primary-checked', evidence: 'Quran 25:74', note: 'Supplication wording matched the verse.' },
  { duaId: 'dua_sleep_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6312', note: 'Before-sleep wording matched.' },
  { duaId: 'dua_wake_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6312', note: 'Waking wording matched.' },
  { duaId: 'dua_anger_1', status: 'primary-checked', evidence: 'Sahih al-Bukhari 6115', note: 'Refuge wording and anger context matched.' },
  { duaId: 'dua_eating_before', status: 'primary-checked', evidence: 'Sunan Abi Dawud 3767', note: 'Bismillah and the forgotten-at-start variant are in the cited report; Al-Albani grading recorded as sahih.' },
  { duaId: 'dua_eating_after', status: 'primary-checked', evidence: 'Jami at-Tirmidhi 3458', note: 'After-food wording matched; Darussalam grading recorded as hasan.' },
  { duaId: 'dua_bathroom_enter', status: 'primary-checked', evidence: 'Sahih al-Bukhari 142', note: 'Bukhari supports Allahumma inni a’udhu...; unsupported leading Bismillah was removed from this entry.' },
  { duaId: 'dua_bathroom_leave', status: 'primary-checked', evidence: 'Sunan Abi Dawud 30', note: 'Ghufranaka wording matched; Al-Albani grading recorded as sahih.' },
  { duaId: 'dua_mosque_enter', status: 'primary-checked', evidence: 'Sahih Muslim 713a', note: 'Entering-mosque wording matched.' },
  { duaId: 'dua_mosque_leave', status: 'primary-checked', evidence: 'Sahih Muslim 713a', note: 'Leaving-mosque wording matched.' },
  { duaId: 'dua_travel', status: 'primary-checked', evidence: 'Quran 43:13–14', note: 'Displayed Quranic travel wording matched both verses.' },
  { duaId: 'dua_hardship_1', status: 'primary-checked', evidence: 'Sahih Muslim 918b', note: 'Calamity supplication wording matched.' },
  { duaId: 'dua_patience_1', status: 'primary-checked', evidence: 'Quran 7:126', note: 'Extracted supplication wording matched the verse.' },
];
