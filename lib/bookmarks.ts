// Saved/bookmarked Visa Info questions, persisted locally so they survive
// app reloads. Stored as an array of question ids.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'VISA_INFO_BOOKMARKS_V1';

let bookmarkedIds: Set<string> = new Set();
let loaded = false;

type Listener = (ids: Set<string>) => void;
const listeners = new Set<Listener>();

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(bookmarkedIds)));
}

export async function loadBookmarks(): Promise<Set<string>> {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) bookmarkedIds = new Set(JSON.parse(raw));
    loaded = true;
  }
  return bookmarkedIds;
}

export function isBookmarked(id: string): boolean {
  return bookmarkedIds.has(id);
}

export function getBookmarkedIds(): Set<string> {
  return bookmarkedIds;
}

export async function toggleBookmark(id: string): Promise<void> {
  if (bookmarkedIds.has(id)) {
    bookmarkedIds.delete(id);
  } else {
    bookmarkedIds.add(id);
  }
  listeners.forEach((listener) => listener(new Set(bookmarkedIds)));
  await persist();
}

export function subscribeBookmarks(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Wipes all saved bookmarks — used by "Delete my account"/"Clear my data". */
export async function clearBookmarks(): Promise<void> {
  bookmarkedIds = new Set();
  listeners.forEach((listener) => listener(new Set(bookmarkedIds)));
  await persist();
}
