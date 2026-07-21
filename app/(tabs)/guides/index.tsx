import { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { GUIDES, GUIDE_CATEGORY_LABELS } from '../../../lib/guides';
import Screen from '../../../components/Screen';
import Icon from '../../../components/Icon';
import { visaInfoStyles as styles } from '../../../components/VisaInfoUI';
import { colors, radius, spacing, typography, card } from '../../../lib/theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function GuidesHubScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES;
    return GUIDES.filter(
      (g) => g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
      <Head>
        <title>Guides — UK Visa Application Tips &amp; Explainers | UK Visa Tracker</title>
        <meta
          name="description"
          content="Free, plain-English guides to UK visa applications — biometrics appointments, financial requirements, and more. Independent of UKVI and the Home Office."
        />
        <meta property="og:title" content="Guides | UK Visa Tracker" />
        <meta
          property="og:description"
          content="Free, plain-English guides to UK visa applications — independent of UKVI and the Home Office."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Text style={styles.kicker}>GUIDES</Text>
      <Text style={styles.title}>Guides</Text>
      <Text style={styles.subheading}>Practical, plain-English guides to UK visa applications.</Text>

      <View style={styles.searchInputWrap}>
        <Icon name="search" size={16} color={colors.textTertiary} style={styles.searchInputIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search guides"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {filtered.map((guide) => (
        <TouchableOpacity
          key={guide.slug}
          style={localStyles.guideCard}
          onPress={() => router.push({ pathname: '/(tabs)/guides/[slug]', params: { slug: guide.slug } })}
        >
          <View style={localStyles.guideCardIconWrap}>
            <Icon name={guide.icon} size={18} color={colors.primary} />
          </View>
          <View style={localStyles.guideCardBody}>
            <Text style={localStyles.guideCardTitle}>{guide.title}</Text>
            <Text style={localStyles.guideCardExcerpt}>{guide.excerpt}</Text>
            <Text style={localStyles.guideCardMeta}>
              {GUIDE_CATEGORY_LABELS[guide.category]} · Updated {formatDate(guide.dateModified)}
              {guide.readingTimeMinutes ? ` · ${guide.readingTimeMinutes} min read` : ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {filtered.length === 0 && <Text style={styles.emptyText}>No guides matched "{query}".</Text>}
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  guideCard: { ...card, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  guideCardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCardBody: { flex: 1 },
  guideCardTitle: { ...typography.cardTitle, marginBottom: 2 },
  guideCardExcerpt: { ...typography.bodySecondary, marginBottom: spacing.xs },
  guideCardMeta: { ...typography.caption },
});
