// Live UK bank holiday dates from the government's own feed, so this never
// goes stale the way a bundled/hardcoded holiday list would — see
// https://www.gov.uk/bank-holidays.json (the human-readable version is at
// https://www.gov.uk/bank-holidays). The feed is republished a few times a
// year, covers roughly the next 2-3 years, and is split by nation.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BankHolidayDivision = 'england-and-wales' | 'scotland' | 'northern-ireland';

const FEED_URL = 'https://www.gov.uk/bank-holidays.json';
const STORAGE_KEY_PREFIX = 'UK_BANK_HOLIDAYS_V1_';
// The feed changes rarely — cache aggressively rather than refetching on
// every app load.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CachedHolidays {
  fetchedAt: number;
  dates: string[]; // ISO yyyy-mm-dd, as published by the feed
}

const memoryCache = new Map<BankHolidayDivision, Set<string>>();
const inFlight = new Map<BankHolidayDivision, Promise<Set<string>>>();

async function fetchDivision(division: BankHolidayDivision): Promise<Set<string>> {
  const storageKey = STORAGE_KEY_PREFIX + division;
  const cachedRaw = await AsyncStorage.getItem(storageKey);

  if (cachedRaw) {
    try {
      const parsed: CachedHolidays = JSON.parse(cachedRaw);
      if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
        return new Set(parsed.dates);
      }
    } catch {
      // Corrupt cache entry — fall through to a fresh fetch.
    }
  }

  try {
    const response = await fetch(FEED_URL);
    const data = await response.json();
    const dates: string[] = data[division].events.map((event: { date: string }) => event.date);
    const toCache: CachedHolidays = { fetchedAt: Date.now(), dates };
    await AsyncStorage.setItem(storageKey, JSON.stringify(toCache));
    return new Set(dates);
  } catch {
    // Offline, or gov.uk is unreachable — prefer a stale cache over nothing.
    // With no cache at all, working-day math falls back to excluding
    // weekends only until a fetch eventually succeeds.
    if (cachedRaw) {
      try {
        return new Set((JSON.parse(cachedRaw) as CachedHolidays).dates);
      } catch {
        // ignore, fall through to empty
      }
    }
    return new Set();
  }
}

/**
 * Loads (and caches) UK bank holiday dates for a division. Safe to call
 * repeatedly — concurrent calls share one in-flight fetch, and once loaded
 * the result is served from memory. Call this once per screen (e.g. in a
 * useEffect) before relying on isKnownBankHoliday's synchronous result.
 */
export function loadBankHolidays(division: BankHolidayDivision = 'england-and-wales'): Promise<Set<string>> {
  const cached = memoryCache.get(division);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(division);
  if (pending) return pending;

  const promise = fetchDivision(division).then((dates) => {
    memoryCache.set(division, dates);
    inFlight.delete(division);
    return dates;
  });
  inFlight.set(division, promise);
  return promise;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Synchronous check against whatever's currently cached for `division` —
 * call and await loadBankHolidays() first so the cache is actually
 * populated. Before that (or if the fetch failed with no cache to fall
 * back on), this returns false for every date.
 */
export function isKnownBankHoliday(date: Date, division: BankHolidayDivision = 'england-and-wales'): boolean {
  return memoryCache.get(division)?.has(toISODate(date)) ?? false;
}
