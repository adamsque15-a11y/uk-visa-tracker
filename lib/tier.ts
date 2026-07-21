// Free vs. Premium tier — scaffolding only, no payment processor wired up.
// For a real signed-in Supabase account, premium status lives on
// `profiles.premium` (see schema.sql) and is read directly from there. But
// local/mock/guest sessions (see localMode.ts) have no profiles row to read,
// so this local flag lets premium be simulated for testing the gated UI —
// toggled from the "Simulate Premium (testing only)" switch in Settings.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'LOCAL_PREMIUM_ACTIVE';

let localPremiumActive = false;
let loaded = false;

type Listener = (active: boolean) => void;
const listeners = new Set<Listener>();

export async function loadLocalPremium(): Promise<boolean> {
  if (!loaded) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    localPremiumActive = stored === 'true';
    loaded = true;
  }
  return localPremiumActive;
}

export function isLocalPremiumActive(): boolean {
  return localPremiumActive;
}

export async function setLocalPremium(active: boolean): Promise<void> {
  localPremiumActive = active;
  listeners.forEach((listener) => listener(active));
  await AsyncStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');
}

export function subscribeLocalPremium(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
