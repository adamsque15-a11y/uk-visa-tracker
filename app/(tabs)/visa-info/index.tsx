import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { VISA_INFO, VisaInfoQuestion, VisaInfoTypeKey } from '../../../lib/visaInfo';
import { loadBookmarks, subscribeBookmarks } from '../../../lib/bookmarks';
import Screen from '../../../components/Screen';
import Icon, { IconName } from '../../../components/Icon';
import { BackLink, PageHeading, visaInfoStyles as styles } from '../../../components/VisaInfoUI';
import { colors } from '../../../lib/theme';

interface FlatQuestion {
  typeKey: VisaInfoTypeKey;
  typeIcon: IconName;
  typeLabel: string;
  categoryLabel: string;
  question: VisaInfoQuestion;
}

const ALL_QUESTIONS: FlatQuestion[] = VISA_INFO.flatMap((section) =>
  section.categories.flatMap((category) =>
    category.questions.map((question) => ({
      typeKey: section.type,
      typeIcon: section.icon,
      typeLabel: section.label,
      categoryLabel: category.label,
      question,
    }))
  )
);

export default function VisaInfoHubScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBookmarks().then(setBookmarkedIds);
    const unsubscribe = subscribeBookmarks(setBookmarkedIds);
    return () => {
      unsubscribe();
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_QUESTIONS.filter(
      (item) =>
        item.question.question.toLowerCase().includes(q) ||
        item.question.plainEnglish.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.typeLabel.toLowerCase().includes(q)
    );
  }, [query]);

  const bookmarkedQuestions = useMemo(
    () => ALL_QUESTIONS.filter((item) => bookmarkedIds.has(item.question.id)),
    [bookmarkedIds]
  );

  function goToQuestion(item: FlatQuestion) {
    router.push({ pathname: '/(tabs)/visa-info/[type]', params: { type: item.typeKey, question: item.question.id } });
  }

  function goHome() {
    setShowBookmarksOnly(false);
    setQuery('');
  }

  // ─────────────────────────── Search results ───────────────────────────
  if (query.trim()) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <PageHeading icon="search">Search</PageHeading>
        <View style={styles.searchInputWrap}>
          <Icon name="search" size={16} color={colors.textTertiary} style={styles.searchInputIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. financial requirement"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
        </View>
        <BackLink label="Back to Visa Info" onPress={goHome} />

        <Text style={styles.resultsHeading}>Results ({searchResults.length})</Text>
        {searchResults.map((item) => (
          <TouchableOpacity key={item.question.id} style={styles.resultRow} onPress={() => goToQuestion(item)}>
            <Text style={styles.resultQuestion}>{item.question.question}</Text>
            <View style={styles.resultMetaRow}>
              <Icon name={item.typeIcon} size={12} color={colors.textTertiary} />
              <Text style={styles.resultMeta}>
                {item.typeLabel} · {item.categoryLabel}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {searchResults.length === 0 && <Text style={styles.emptyText}>No questions matched "{query}".</Text>}
      </Screen>
    );
  }

  // ─────────────────────────── Bookmarks view ───────────────────────────
  if (showBookmarksOnly) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <BackLink label="Back to Visa Info" onPress={goHome} />
        <PageHeading icon="star">Saved Articles</PageHeading>
        {bookmarkedQuestions.length === 0 ? (
          <Text style={styles.emptyText}>You haven't saved anything yet. Tap the star on any question to save it here.</Text>
        ) : (
          bookmarkedQuestions.map((item) => (
            <TouchableOpacity key={item.question.id} style={styles.resultRow} onPress={() => goToQuestion(item)}>
              <Text style={styles.resultQuestion}>{item.question.question}</Text>
              <View style={styles.resultMetaRow}>
                <Icon name={item.typeIcon} size={12} color={colors.textTertiary} />
                <Text style={styles.resultMeta}>
                  {item.typeLabel} · {item.categoryLabel}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Home ───────────────────────────
  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
      <Head>
        <title>UK Visa Requirements Hub — Spouse, Student, Skilled Worker &amp; More | UK Visa Tracker</title>
        <meta
          name="description"
          content="Free, plain-English guide to UK visa requirements — Spouse, Student, Skilled Worker, Visitor, Child, Settlement and Citizenship. Financial requirements, documents, and timelines, all linked to official GOV.UK guidance."
        />
        <meta property="og:title" content="UK Visa Requirements Hub | UK Visa Tracker" />
        <meta
          property="og:description"
          content="Free, plain-English guide to UK visa requirements — organised by visa type, with documents, timelines, and links to official guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Text style={styles.kicker}>VISA INFO</Text>
      <Text style={styles.title}>Visa Knowledge Hub</Text>
      <Text style={styles.subheading}>Every question, answered — organised by visa type.</Text>

      <View style={styles.searchInputWrap}>
        <Icon name="search" size={16} color={colors.textTertiary} style={styles.searchInputIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search e.g. financial requirement"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <TouchableOpacity style={styles.savedLink} onPress={() => setShowBookmarksOnly(true)}>
        <Icon name="star" size={16} color={colors.primary} />
        <Text style={styles.savedLinkText}>Saved Articles ({bookmarkedIds.size})</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Browse by visa type</Text>
      <View style={styles.typeList}>
        {VISA_INFO.map((section) => (
          <TouchableOpacity
            key={section.type}
            style={styles.typeRow}
            onPress={() => router.push({ pathname: '/(tabs)/visa-info/[type]', params: { type: section.type } })}
          >
            <View style={styles.typeIconWrap}>
              <Icon name={section.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.typeLabel}>{section.label}</Text>
            <Icon name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
