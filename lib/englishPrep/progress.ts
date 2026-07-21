import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatISODate, parseISODate } from '../workingDays';
import { CEFRLevel, CEFR_LEVELS } from './level';

// V2: progress now nests per level (A1/A2/B1 content is genuinely
// different, so an A1 100% and a B1 40% shouldn't average together) — the
// daily streak is the one exception, kept combined across all levels since
// it's a practice-habit signal, not a mastery signal, and practicing any
// level should keep it alive. This is a clean-break version bump rather
// than a migration: it's practice/gamification data, not anything
// application-critical, so resetting it once is an acceptable trade-off for
// not writing a one-off migration for the old flat shape.
const STORAGE_KEY = 'ENGLISH_PREP_PROGRESS_V2';

export interface LevelProgress {
  completedLessons: string[];
  mockTestsTaken: number;
  mockTestScores: number[];
  listeningSessionsTaken: number;
  listeningScores: number[];
  topicWrongCounts: Record<string, number>;
}

export interface EnglishPrepProgress {
  streakCount: number;
  lastPracticeDate: string | null;
  levels: Record<CEFRLevel, LevelProgress>;
}

function defaultLevelProgress(): LevelProgress {
  return {
    completedLessons: [],
    mockTestsTaken: 0,
    mockTestScores: [],
    listeningSessionsTaken: 0,
    listeningScores: [],
    topicWrongCounts: {},
  };
}

function defaultProgress(): EnglishPrepProgress {
  return {
    streakCount: 0,
    lastPracticeDate: null,
    levels: {
      a1: defaultLevelProgress(),
      a2: defaultLevelProgress(),
      b1: defaultLevelProgress(),
    },
  };
}

let progress: EnglishPrepProgress = defaultProgress();
let loaded = false;

type Listener = (progress: EnglishPrepProgress) => void;
const listeners = new Set<Listener>();

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function notify() {
  listeners.forEach((listener) => listener({ ...progress }));
}

// Merges stored data over the defaults level-by-level, so a raw payload
// missing a level (or missing a field within one) still ends up with every
// field present rather than undefined.
function mergeWithDefaults(stored: Partial<EnglishPrepProgress>): EnglishPrepProgress {
  const merged = defaultProgress();
  if (typeof stored.streakCount === 'number') merged.streakCount = stored.streakCount;
  if (typeof stored.lastPracticeDate === 'string' || stored.lastPracticeDate === null) {
    merged.lastPracticeDate = stored.lastPracticeDate ?? null;
  }
  for (const level of CEFR_LEVELS) {
    merged.levels[level] = { ...defaultLevelProgress(), ...stored.levels?.[level] };
  }
  return merged;
}

export async function loadEnglishPrepProgress(): Promise<EnglishPrepProgress> {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) progress = mergeWithDefaults(JSON.parse(raw));
    loaded = true;
  }
  return { ...progress };
}

export function getEnglishPrepProgress(): EnglishPrepProgress {
  return { ...progress };
}

export function subscribeEnglishPrepProgress(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Wipes all English Test Prep progress — used by "Delete my account"/"Clear my data". */
export async function clearEnglishPrepProgress(): Promise<void> {
  progress = defaultProgress();
  notify();
  await persist();
}

/** Updates the combined daily streak. Call once per practice session, on any level. */
function markDailyActivity() {
  const today = formatISODate(new Date());
  if (progress.lastPracticeDate === today) return;

  if (progress.lastPracticeDate) {
    const last = parseISODate(progress.lastPracticeDate);
    if (last) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = formatISODate(last) === formatISODate(yesterday);
      progress.streakCount = isConsecutive ? progress.streakCount + 1 : 1;
    } else {
      progress.streakCount = 1;
    }
  } else {
    progress.streakCount = 1;
  }
  progress.lastPracticeDate = today;
}

function addWrongTopics(level: CEFRLevel, topicKey: string, wrongCount: number) {
  if (wrongCount <= 0) return;
  const levelProgress = progress.levels[level];
  levelProgress.topicWrongCounts[topicKey] = (levelProgress.topicWrongCounts[topicKey] ?? 0) + wrongCount;
}

export async function recordLessonQuiz(level: CEFRLevel, lessonKey: string, correctCount: number, totalCount: number) {
  await loadEnglishPrepProgress();
  markDailyActivity();
  addWrongTopics(level, lessonKey, totalCount - correctCount);
  const levelProgress = progress.levels[level];
  if (totalCount > 0 && correctCount === totalCount && !levelProgress.completedLessons.includes(lessonKey)) {
    levelProgress.completedLessons.push(lessonKey);
  }
  notify();
  await persist();
}

export async function recordMockTest(level: CEFRLevel, correctCount: number, totalCount: number) {
  await loadEnglishPrepProgress();
  markDailyActivity();
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const levelProgress = progress.levels[level];
  levelProgress.mockTestsTaken += 1;
  levelProgress.mockTestScores.push(scorePercent);
  addWrongTopics(level, 'Mock Test', totalCount - correctCount);
  notify();
  await persist();
}

export async function recordListeningSession(level: CEFRLevel, correctCount: number, totalCount: number) {
  await loadEnglishPrepProgress();
  markDailyActivity();
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const levelProgress = progress.levels[level];
  levelProgress.listeningSessionsTaken += 1;
  levelProgress.listeningScores.push(scorePercent);
  addWrongTopics(level, 'Listening', totalCount - correctCount);
  notify();
  await persist();
}

export function getAverageScore(p: EnglishPrepProgress, level: CEFRLevel): number | null {
  const levelProgress = p.levels[level];
  const all = [...levelProgress.mockTestScores, ...levelProgress.listeningScores];
  if (all.length === 0) return null;
  return Math.round(all.reduce((sum, s) => sum + s, 0) / all.length);
}

export function getWeakTopics(p: EnglishPrepProgress, level: CEFRLevel, limit = 3): string[] {
  return Object.entries(p.levels[level].topicWrongCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic);
}
