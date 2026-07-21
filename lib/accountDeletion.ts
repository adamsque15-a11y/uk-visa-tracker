import { supabase } from './supabase';
import { isLocalModeActive } from './localMode';
import { isMockSessionActive, setMockSession } from './devAuth';
import { isGuestModeActive, setGuestMode } from './guestMode';
import { mockClearAll } from './mockDb';
import { clearBookmarks } from './bookmarks';
import { resetNotificationPrefs } from './notificationPrefs';
import { clearEnglishPrepProgress } from './englishPrep/progress';

export interface DeleteAccountResult {
  ok: boolean;
  error?: string;
}

// Local storage is cleared regardless of account type — a real account's
// English Test Prep progress, bookmarks, and notification prefs are 100%
// on-device (see lib/englishPrep/progress.ts, lib/bookmarks.ts,
// lib/notificationPrefs.ts), so deleting the server-side row alone would
// leave them behind.
async function clearAllLocalData() {
  await Promise.all([clearBookmarks(), resetNotificationPrefs(), clearEnglishPrepProgress()]);
}

/**
 * Deletes the current account and all associated data. For a real Supabase
 * account this calls the delete-account Edge Function (which alone can
 * reach the Admin API to remove the auth.users row — everything else
 * cascades from there). For guest/dev-mode sessions there is no real
 * account to delete server-side, so this just clears every local store.
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  await clearAllLocalData();

  if (isLocalModeActive()) {
    await mockClearAll();
    if (isMockSessionActive()) setMockSession(false);
    if (isGuestModeActive()) await setGuestMode(false);
    return { ok: true };
  }

  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) {
    return { ok: false, error: error.message };
  }
  await supabase.auth.signOut();
  return { ok: true };
}
