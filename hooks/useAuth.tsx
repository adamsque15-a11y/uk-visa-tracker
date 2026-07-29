import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isMockSessionActive, subscribeMockSession } from '../lib/devAuth';
import { loadGuestMode, isGuestModeActive, setGuestMode, subscribeGuestMode } from '../lib/guestMode';

export interface AuthState {
  loading: boolean;
  session: Session | null;
  mockSession: boolean;
  guestMode: boolean;
  // True once a real session, the dev test account, or Guest Mode is
  // confirmed active. Stays false (not just "unknown") while loading, so
  // consumers never have to guess whether an absence of session means
  // "logged out" or "still checking".
  authenticated: boolean;
}

const AuthContext = createContext<AuthState | null>(null);

// Single source of truth for auth state — every screen and piece of chrome
// (root layout's redirect logic, the top bar's account menu, the home
// page's Sign In vs. "Your application" branching) reads from this same
// provider instead of independently re-deriving whether the visitor is
// signed in, so there's no risk of two places disagreeing or racing.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [mockSession, setMockSession] = useState(isMockSessionActive());
  const [guestMode, setGuestModeState] = useState(isGuestModeActive());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([supabase.auth.getSession(), loadGuestMode()]).then(([{ data }, guest]) => {
      setSession(data.session);
      // Don't blindly reapply the guest flag this just read from storage —
      // on a fresh page load where a session is *also* already present
      // (e.g. mid a Google OAuth redirect, where the whole app reloads and
      // this and the onAuthStateChange listener below both race from
      // scratch), a real session means the visitor isn't actually a guest
      // anymore, even though the persisted flag hasn't caught up yet.
      // Supabase's own _initialize() defers its SIGNED_IN notification via
      // setTimeout(0) while getSession() unblocks on the earlier microtask
      // that resolves it, so this can genuinely settle before that listener
      // fires — do the same clear here rather than trust which of the two
      // happens to run last. setGuestMode() (not the raw state setter)
      // keeps this in sync with the persisted flag and every other
      // subscriber, so whichever of the two paths runs second just finds it
      // already correct and no-ops.
      if (data.session && guest) {
        setGuestMode(false);
      } else {
        setGuestModeState(guest);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // A real session appearing means the visitor is genuinely signed in —
      // clear any lingering Guest Mode flag from before they signed in, so
      // guest-only UI (the persistent banner, quick-track's "save your
      // progress?" prompt) doesn't keep treating them as a guest. Covers
      // every path a session can appear from (password sign-in, Google
      // OAuth, a confirmed signup's emailed link) since they all funnel
      // through this one listener, unlike the dev test account bypass in
      // login.tsx which never touches supabase.auth and clears it directly.
      // Mirrors the same clear in the Promise.all().then() above — see its
      // comment for why both paths need to do this independently rather
      // than relying on whichever one happens to run last.
      if (newSession && isGuestModeActive()) {
        setGuestMode(false);
      }
    });

    const unsubscribeMock = subscribeMockSession(setMockSession);
    const unsubscribeGuest = subscribeGuestMode(setGuestModeState);

    return () => {
      listener.subscription.unsubscribe();
      unsubscribeMock();
      unsubscribeGuest();
    };
  }, []);

  const authenticated = !loading && (!!session || mockSession || guestMode);

  return (
    <AuthContext.Provider value={{ loading, session, mockSession, guestMode, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used within an AuthProvider');
  return ctx;
}
