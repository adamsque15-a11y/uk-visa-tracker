import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { colors } from '../../lib/theme';

// Old URL, kept only as a redirect shim: this screen used to serve every
// level behind ?level= (bad for SEO — one URL, three languages of content).
// It's been replaced by /ielts-life-skills/{a1,a2,b1}, each a real,
// distinct, crawlable page — see app/(tabs)/ielts-life-skills/[level].tsx.
// Anyone hitting this old path (a stale bookmark or external link) gets
// bounced straight to the equivalent new URL, carrying the old ?level=
// value across if it was set.
export default function LegacyIELTSRedirect() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();

  useEffect(() => {
    const resolved = level === 'a1' || level === 'a2' || level === 'b1' ? level : 'a1';
    router.replace({ pathname: '/(tabs)/ielts-life-skills/[level]', params: { level: resolved } });
  }, [level, router]);

  return (
    <View style={styles.centered}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
