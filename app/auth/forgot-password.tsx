import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

// Always resolves to a web URL — this app's only supported target is the
// static web export (see AGENTS.md / app.json's web.output: "static").
function getRedirectTo(): string | undefined {
  return typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // Shown after submit regardless of whether the email exists — never let
  // the UI reveal that, even though resetPasswordForEmail itself already
  // behaves this way.
  const [submitted, setSubmitted] = useState(false);
  // A network-level failure (not "no such account" — Supabase never reports
  // that) is the only thing that should stop the generic confirmation from
  // showing, so it gets its own distinct state rather than being silently
  // swallowed or leaving the button stuck on "Sending...".
  const [networkError, setNetworkError] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    setNetworkError(false);
    try {
      // Like signIn/signUp, this resolves to { error } rather than throwing
      // for auth-level failures — it never distinguishes "no such account"
      // (by design, to avoid leaking existence), but a real failure (bad
      // request, network, rate limit) still comes back as `error`, not a
      // thrown exception, so it has to be checked explicitly here.
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: getRedirectTo() });
      if (error) {
        setNetworkError(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/auth/login')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Reset your password</Text>

        {submitted ? (
          <>
            <Text style={styles.subtitle}>
              If an account exists for that email, we've sent a link to reset your password. Check your inbox
              (and spam folder) — the link expires after a while, so use it soon.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/auth/login')}>
              <Text style={styles.primaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset your password.</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {networkError && (
              <Text style={styles.errorText}>Something went wrong. Check your connection and try again.</Text>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.primaryButtonText}>{loading ? 'Sending...' : 'Send reset link'}</Text>
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
  backButton: { position: 'absolute', top: 50, left: 20, padding: 8 },
  backButtonText: { fontSize: 15, color: '#1a3c6e', fontWeight: '600' },
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
