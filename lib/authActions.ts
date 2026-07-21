import { supabase } from './supabase';
import { isMockSessionActive, setMockSession } from './devAuth';
import { isGuestModeActive, setGuestMode } from './guestMode';

// Only the subset of expo-router's Router type this needs, so callers don't
// have to import expo-router's (version-specific) Router type just to pass
// their router through.
interface MinimalRouter {
  replace: (path: never) => void;
}

// Confirmation is the caller's responsibility (see components/SignOutModal)
// — this used to be bundled together via Alert.alert(), but Alert has no web
// implementation in this app's setup, which made Sign Out a silent dead
// button. Kept as one function so both entry points (Profile page, TopBar
// dropdown) sign out identically.
export async function performSignOut(router: MinimalRouter) {
  if (isMockSessionActive()) setMockSession(false);
  if (isGuestModeActive()) await setGuestMode(false);
  await supabase.auth.signOut();
  router.replace('/home' as never);
}
