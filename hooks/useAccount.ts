import { TEST_ACCOUNT } from '../lib/devAuth';
import { useAuth } from './useAuth';

export type Account = { kind: 'guest' } | { kind: 'dev' } | { kind: 'real'; email: string };

// Derives the account "identity" shown in chrome (top bar, sidebar) from the
// single shared auth source of truth (see useAuth) — no independent session
// check of its own, so it can never disagree with the rest of the app about
// whether — or as whom — the user is signed in.
export function useAccount(): Account | null {
  const { loading, session, mockSession, guestMode } = useAuth();

  if (loading) return null;
  if (mockSession) return { kind: 'dev' };
  if (guestMode) return { kind: 'guest' };
  return session?.user.email ? { kind: 'real', email: session.user.email } : { kind: 'guest' };
}

export function accountInitial(account: Account | null): string {
  if (!account) return '·';
  if (account.kind === 'real') return account.email.charAt(0).toUpperCase();
  if (account.kind === 'dev') return 'D';
  return 'G';
}

export function accountName(account: Account | null): string {
  if (!account) return 'Loading…';
  if (account.kind === 'real') return account.email;
  if (account.kind === 'dev') return TEST_ACCOUNT.email;
  return 'Guest User';
}

export function accountSubtext(account: Account | null): string {
  if (!account) return '';
  if (account.kind === 'real') return 'Signed in';
  if (account.kind === 'dev') return 'Dev test account';
  return 'Your data is stored on this device only.';
}
