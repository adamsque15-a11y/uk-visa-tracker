import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Static export pre-renders every route in a Node process with no `window`
// — the GoTrueClient's session-recovery on construction reaches into
// storage immediately, which crashes there. There's no real user session to
// recover during a build anyway, so persistence/auto-refresh only need to
// be live in an actual browser.
const isBrowser = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? AsyncStorage : undefined,
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
    // Needed so the client picks up the access/refresh tokens Supabase
    // appends to the URL after a Google OAuth redirect lands back on this
    // app (see app/auth/login.tsx). Same isBrowser gate as the options
    // above — there's no URL to read during the static-export build.
    detectSessionInUrl: isBrowser,
  },
});
