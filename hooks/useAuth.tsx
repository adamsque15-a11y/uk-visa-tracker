import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isMockSessionActive, subscribeMockSession } from '../lib/devAuth';
import { loadGuestMode, isGuestModeActive, subscribeGuestMode } from '../lib/guestMode';

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
      setGuestModeState(guest);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
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
