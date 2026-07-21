import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

type ScreenState = 'checking' | 'invalid' | 'form' | 'success';

// The recovery-link click lands here with the recovery tokens in the URL
// hash (#access_token=...&refresh_token=...&type=recovery). lib/supabase.ts
// sets detectSessionInUrl:false (to avoid crashing the static-export Node
// prerender pass, which has no `window`), so Supabase won't pick this up
// automatically — it has to be parsed and applied here instead.
function parseRecoveryHash(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const type = params.get('type');
  if (!accessToken || !refreshToken || type !== 'recovery') return null;
  return { accessToken, refreshToken };
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [state, setState] = useState<ScreenState>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const recovery = parseRecoveryHash();
    if (!recovery) {
      setState('invalid');
      return;
    }
    // Tokens shouldn't linger in browser history/referrer once read.
    window.history.replaceState(null, '', window.location.pathname);
    supabase.auth
      .setSession({ access_token: recovery.accessToken, refresh_token: recovery.refreshToken })
      .then(({ error: sessionError }) => setState(sessionError ? 'invalid' : 'form'))
      .catch(() => setState('invalid'));
  }, []);

  async function handleSubmit() {
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      // The recovery session shouldn't silently persist past this screen —
      // sign out so continuing requires signing in fresh with the new
      // password, which doubles as a real confirmation it was set correctly.
      await supabase.auth.signOut();
      setState('success');
    } catch {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset your password</Text>

        {state === 'checking' && <Text style={styles.subtitle}>Checking your reset link...</Text>}

        {state === 'invalid' && (
          <>
            <Text style={styles.subtitle}>
              This link is invalid or has expired. Request a new one to reset your password.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/auth/forgot-password')}>
              <Text style={styles.primaryButtonText}>Request a new link</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'form' && (
          <>
            <Text style={styles.subtitle}>Choose a new password for your account.</Text>

            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.primaryButtonText}>{submitting ? 'Saving...' : 'Set new password'}</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'success' && (
          <>
            <Text style={styles.subtitle}>Your password has been changed. Sign in with your new password.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/auth/login')}>
              <Text style={styles.primaryButtonText}>Continue to Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 400 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  errorText: { color: '#c81e3a', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  primaryButton: {
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
