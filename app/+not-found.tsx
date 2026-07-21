import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Icon from '../components/Icon';
import { colors, spacing, typography, radius } from '../lib/theme';
import { APP_NAME } from '../lib/legalConfig';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Head>
        <title>Page not found | {APP_NAME}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <View style={styles.iconWrap}>
        <Icon name="map-pin" size={26} color={colors.primary} />
      </View>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.message}>
        The page you're looking for doesn't exist, or the link may be out of date.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.pageTitle, marginBottom: spacing.xs, textAlign: 'center' },
  message: {
    ...typography.bodySecondary,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 15 },
});
