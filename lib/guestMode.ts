// Continue as Guest: lets a real user try the app without creating an
// account. Like the dev test account (see devAuth.ts), guest data is
// stored locally only via mockDb.ts — but unlike the dev flag, this is a
// real product feature, so it's persisted in AsyncStorage and survives
// app reloads instead of resetting every time.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'GUEST_MODE_ACTIVE';

let guestModeActive = false;
let loaded = false;

type Listener = (active: boolean) => void;
const listeners = new Set<Listener>();

export async function loadGuestMode(): Promise<boolean> {
  if (!loaded) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    guestModeActive = stored === 'true';
    loaded = true;
  }
  return guestModeActive;
}

export function isGuestModeActive(): boolean {
  return guestModeActive;
}

export async function setGuestMode(active: boolean): Promise<void> {
  guestModeActive = active;
  listeners.forEach((listener) => listener(active));
  await AsyncStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');
}

export function subscribeGuestMode(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
