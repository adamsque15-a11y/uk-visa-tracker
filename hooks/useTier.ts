import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { isLocalModeActive } from '../lib/localMode';
import { loadLocalPremium, isLocalPremiumActive, subscribeLocalPremium } from '../lib/tier';
import { useAuth } from './useAuth';

export interface TierState {
  loading: boolean;
  premium: boolean;
}

// Single source of truth for premium status, mirroring how useAuth() is the
// single source of truth for auth status. Local/mock/guest sessions read the
// simulated flag from lib/tier.ts; real accounts read `profiles.premium`.
export function useTier(): TierState {
  const { loading: authLoading, session } = useAuth();
  const [localPremium, setLocalPremiumState] = useState(isLocalPremiumActive());
  const [remotePremium, setRemotePremium] = useState(false);
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  useEffect(() => {
    loadLocalPremium().then(setLocalPremiumState);
    const unsubscribe = subscribeLocalPremium(setLocalPremiumState);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) {
      setRemoteLoaded(true);
      return;
    }
    setRemoteLoaded(false);
    supabase
      .from('profiles')
      .select('premium')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        setRemotePremium(!!data?.premium);
        setRemoteLoaded(true);
      });
  }, [session?.user.id]);

  if (authLoading) return { loading: true, premium: false };
  if (isLocalModeActive()) return { loading: false, premium: localPremium };
  if (session) return { loading: !remoteLoaded, premium: remotePremium };
  return { loading: false, premium: false };
}
