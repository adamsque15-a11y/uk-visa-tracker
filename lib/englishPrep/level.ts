// CEFR English level covered by this app's test prep — maps to real UK
// immigration stages: A1 for an initial family/spouse visa, A2 for a family
// visa extension, B1 for settlement (ILR) and — combined with the separate
// Life in the UK Test — the "Knowledge of Life and Language" requirement
// for citizenship naturalisation.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadBookmarks } from '../bookmarks';
import { VISA_INFO } from '../visaInfo';

export type CEFRLevel = 'a1' | 'a2' | 'b1';

export const CEFR_LEVELS: CEFRLevel[] = ['a1', 'a2', 'b1'];

export const LEVEL_LABELS: Record<CEFRLevel, string> = {
  a1: 'A1',
  a2: 'A2',
  b1: 'B1',
};

// Full exam-branded name, used only where a level is being presented as a
// standalone choice (homepage buttons, sidebar entries, a level's own page
// title) — everywhere else (inline sub-headings, stat labels) keeps the
// short LEVEL_LABELS form so prose doesn't get overloaded.
export const LEVEL_FULL_LABELS: Record<CEFRLevel, string> = {
  a1: 'A1 IELTS Life Skills',
  a2: 'A2 IELTS Life Skills',
  b1: 'B1 IELTS Life Skills',
};

// Shown under each pill in the level selector — the real-world "why" for
// that level, so switching levels reads as switching visa stage, not just
// switching difficulty.
export const LEVEL_STAGE_LABELS: Record<CEFRLevel, string> = {
  a1: 'Family visa',
  a2: 'Visa extension',
  b1: 'Settlement & citizenship',
};

const STORAGE_KEY = 'ENGLISH_PREP_LEVEL_PREFERENCE';

let levelPreference: CEFRLevel | null = null;
let loaded = false;

type Listener = (level: CEFRLevel) => void;
const listeners = new Set<Listener>();

function isCEFRLevel(value: string | null): value is CEFRLevel {
  return value === 'a1' || value === 'a2' || value === 'b1';
}

export async function loadLevelPreference(): Promise<CEFRLevel | null> {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    levelPreference = isCEFRLevel(raw) ? raw : null;
    loaded = true;
  }
  return levelPreference;
}

export function getLevelPreference(): CEFRLevel | null {
  return levelPreference;
}

export async function setLevelPreference(level: CEFRLevel): Promise<void> {
  levelPreference = level;
  listeners.forEach((listener) => listener(level));
  await AsyncStorage.setItem(STORAGE_KEY, level);
}

export function subscribeLevelPreference(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Best-effort default when the user hasn't picked a level before. The app
// doesn't currently capture "is this application an extension?" anywhere,
// so A2 can't be inferred — this only ever resolves to 'a1' or 'b1'. B1 is
// inferred from a real (if indirect) signal: bookmarking Settlement or
// Citizenship guidance in Visa Info suggests that's the stage the user is
// actually preparing for.
export async function inferDefaultLevel(): Promise<CEFRLevel> {
  const bookmarkedIds = await loadBookmarks();
  const hasSettlementOrCitizenshipBookmark = VISA_INFO.some(
    (section) =>
      (section.type === 'settlement' || section.type === 'citizenship') &&
      section.categories.some((category) => category.questions.some((q) => bookmarkedIds.has(q.id)))
  );
  return hasSettlementOrCitizenshipBookmark ? 'b1' : 'a1';
}
