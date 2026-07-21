import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { loadLevelPreference, inferDefaultLevel } from '../../../lib/englishPrep/level';
import { colors } from '../../../lib/theme';

// The bare /ielts-life-skills URL (no level segment) has no content of its
// own — it resolves a level (saved preference, then a best-effort inference
// from Visa Info bookmarks, then 'a1') and redirects to that level's own
// page. Kept out of the sitemap and marked noindex so this resolver, not a
// real content page, never gets crawled or ranked.
export default function IELTSLifeSkillsIndex() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const saved = await loadLevelPreference();
      const level = saved ?? (await inferDefaultLevel());
      router.replace({ pathname: '/(tabs)/ielts-life-skills/[level]', params: { level } });
    })();
  }, [router]);

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
