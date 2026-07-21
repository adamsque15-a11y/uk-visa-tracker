import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';
import { TEST_ACCOUNT, setMockSession } from '../../lib/devAuth';

// Lets the in-app browser sheet used on native (WebBrowser.openAuthSessionAsync
// below) close itself once Google redirects back — a no-op on web, where this
// screen instead does a full-page redirect rather than opening a popup.
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { mode: initialMode } = useLocalSearchParams<{ mode?: 'signin' | 'signup' }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode === 'signup' ? 'signup' : 'signin');
  // React Native's Alert.alert has no web implementation in this app's setup
  // (it silently no-ops on web) — shown inline instead, matching the pattern
  // already used by forgot-password.tsx/reset-password.tsx.
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth() {
    // DEV ONLY: bypass Supabase for the local test account. Remove before shipping.
    if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
      setMockSession(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: authError } =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (authError) setError(authError.message);
    } catch {
      setError('Something went wrong. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Supabase's Google provider is a two-hop OAuth flow (app -> Google ->
  // Supabase's own /auth/v1/callback, which exchanges the code server-side
  // using the client secret -> back to us) — that server-side hop is why
  // this calls supabase.auth.signInWithOAuth() rather than building a
  // Google-direct AuthRequest with expo-auth-session's useAuthRequest/
  // promptAsync, which only handles a single-hop redirect straight back to
  // this app and has no way to receive Supabase's own exchanged session.
  // expo-auth-session's makeRedirectUri() still does real work below: it's
  // what computes the correct redirect target for each platform.
  async function handleGoogleAuth() {
    setError(null);
    setLoading(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri({ path: '/auth/login' });

      if (Platform.OS === 'web') {
        // supabase-js handles the redirect itself on web (window.location.href
        // to Google, then Google -> Supabase -> back to redirectTo) — nothing
        // left to do here once the request is sent; the page navigates away.
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });
        if (oauthError) {
          setError(oauthError.message);
          setLoading(false);
        }
        return;
      }

      // Native: skip the auto-redirect and open the URL in an in-app browser
      // sheet instead, so the OAuth flow doesn't leave the app. Supabase
      // still does its own Google <-> Supabase exchange server-side; what
      // comes back to `redirectTo` is Supabase's own session tokens.
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (oauthError || !data?.url) {
        setError(oauthError?.message ?? 'Could not start Google sign-in.');
        setLoading(false);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success' || !('url' in result)) {
        setLoading(false);
        return; // user cancelled/dismissed — not an error worth surfacing
      }

      const fragment = result.url.split('#')[1] ?? '';
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (!accessToken || !refreshToken) {
        setError(params.get('error_description') ?? 'Google sign-in did not return a session.');
        setLoading(false);
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) setError(sessionError.message);
      setLoading(false);
    } catch {
      setError('Something went wrong signing in with Google. Check your connection and try again.');
      setLoading(false);
    }
  }

  function handleAppleAuth() {
    setError('Apple sign-in is not set up yet — wire up expo-apple-authentication + Supabase Apple OAuth here.');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>UK Visa Tracker</Text>
        <Text style={styles.subtitle}>Everything you need for your UK visa application in one place.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleEmailAuth} disabled={loading}>
          <Text style={styles.primaryButtonText}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {mode === 'signin' && (
          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text style={styles.switchModeText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          <Text style={styles.switchModeText}>
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.oauthButton} onPress={handleGoogleAuth} disabled={loading}>
          <Text style={styles.oauthButtonText}>{loading ? 'Please wait...' : 'Continue with Google'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oauthButton} onPress={handleAppleAuth} disabled={loading}>
          <Text style={styles.oauthButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {__DEV__ && (
          <Text style={styles.devHint}>
            Dev test login: {TEST_ACCOUNT.email} / {TEST_ACCOUNT.password}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  card: { width: '100%', maxWidth: 400 },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 8 },
  backButtonText: { fontSize: 15, color: '#1a3c6e', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  errorText: { color: '#c81e3a', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  switchModeText: { textAlign: 'center', color: '#1a3c6e', marginTop: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 24 },
  oauthButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  oauthButtonText: { fontSize: 15, fontWeight: '500' },
  devHint: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 20 },
});
