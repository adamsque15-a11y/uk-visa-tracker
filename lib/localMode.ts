// Unifies the two ways the app runs without Supabase: the throwaway dev
// test account (devAuth.ts) and a real Continue-as-Guest session
// (guestMode.ts). Both read/write the local mock DB instead of Supabase.
import { isMockSessionActive } from './devAuth';
import { isGuestModeActive } from './guestMode';

export function isLocalModeActive(): boolean {
  return isMockSessionActive() || isGuestModeActive();
}
