// Free-tier daily cap on Speaking Practice attempts (Part 1 questions and
// Part 2 clips each count as one attempt) — Premium gets unlimited. Persisted
// locally since speaking practice itself has no server-side record.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatISODate } from '../workingDays';

const STORAGE_KEY = 'SPEAKING_PRACTICE_DAILY_COUNT_V1';

export const FREE_DAILY_SPEAKING_ATTEMPTS = 5;

interface DailyCount {
  date: string;
  count: number;
}

let state: DailyCount = { date: '', count: 0 };
let loaded = false;

type Listener = (count: number) => void;
const listeners = new Set<Listener>();

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetIfNewDay() {
  const today = formatISODate(new Date());
  if (state.date !== today) state = { date: today, count: 0 };
}

export async function loadSpeakingAttemptsToday(): Promise<number> {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
    loaded = true;
  }
  resetIfNewDay();
  return state.count;
}

export function getSpeakingAttemptsToday(): number {
  resetIfNewDay();
  return state.count;
}

export async function recordSpeakingAttempt(): Promise<number> {
  resetIfNewDay();
  state.count += 1;
  listeners.forEach((listener) => listener(state.count));
  await persist();
  return state.count;
}

export function subscribeSpeakingAttempts(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
