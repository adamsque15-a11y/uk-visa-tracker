// Notification preference toggles shown on the Profile page. These are
// stored locally and control what the app itself surfaces (e.g. banners,
// dashboard callouts) — they do not schedule OS-level push or local
// notifications, which would need expo-notifications and native permission
// flows that aren't wired up yet.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'NOTIFICATION_PREFS_V1';

export interface NotificationPrefs {
  deadlineReminders: boolean;
  processingUpdates: boolean;
  englishPrepReminders: boolean;
  communityInsights: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  deadlineReminders: true,
  processingUpdates: true,
  englishPrepReminders: true,
  communityInsights: false,
};

let prefs: NotificationPrefs = { ...DEFAULT_PREFS };
let loaded = false;

type Listener = (prefs: NotificationPrefs) => void;
const listeners = new Set<Listener>();

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function notify() {
  listeners.forEach((listener) => listener({ ...prefs }));
}

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  if (!loaded) {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) prefs = { ...DEFAULT_PREFS, ...JSON.parse(raw) };
    loaded = true;
  }
  return { ...prefs };
}

export function getNotificationPrefs(): NotificationPrefs {
  return { ...prefs };
}

export async function setNotificationPref(key: keyof NotificationPrefs, value: boolean) {
  prefs = { ...prefs, [key]: value };
  notify();
  await persist();
}

export function subscribeNotificationPrefs(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Resets notification prefs to defaults — used by "Delete my account"/"Clear my data". */
export async function resetNotificationPrefs(): Promise<void> {
  prefs = { ...DEFAULT_PREFS };
  notify();
  await persist();
}
