import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { VISA_INFO, VisaInfoQuestion, VisaInfoTypeKey } from '../../../lib/visaInfo';
import { loadBookmarks, toggleBookmark, subscribeBookmarks } from '../../../lib/bookmarks';
import Screen from '../../../components/Screen';
import Icon from '../../../components/Icon';
import JsonLd from '../../../components/JsonLd';
import { BackLink, PageHeading, visaInfoStyles as styles } from '../../../components/VisaInfoUI';
import ShareButtons from '../../../components/ShareButtons';
import { colors } from '../../../lib/theme';
import { buildFAQPageSchema } from '../../../lib/structuredData';
import { SITE_URL } from '../../../lib/legalConfig';

// Pre-renders one static HTML page per visa type at build time (output:
// "static"), so each is its own crawlable, indexable URL rather than all
// living behind client-side state on a single page.
export async function generateStaticParams(): Promise<{ type: string }[]> {
  return VISA_INFO.map((section) => ({ type: section.type }));
}

// Unique, keyword-relevant <title>/description per visa type — this is what
// should actually rank for searches like "UK spouse visa requirements".
const SEO_META: Record<VisaInfoTypeKey, { title: string; description: string }> = {
  spouse: {
    title: 'UK Spouse Visa Requirements 2026 — Financial Requirement, Documents & Timeline | UK Visa Tracker',
    description:
      'Everything you need to know about the UK Spouse Visa: the financial requirement, relationship evidence, required documents, and processing times — free, plain-English guidance linked to GOV.UK.',
  },
  student: {
    title: 'UK Student Visa Requirements 2026 — Financial Requirement, CAS & Documents | UK Visa Tracker',
    description:
      'A plain-English guide to UK Student Visa requirements: the financial requirement, your CAS, required documents, and processing times — linked to official GOV.UK guidance.',
  },
  skilled_worker: {
    title: 'UK Skilled Worker Visa Requirements 2026 — Sponsorship, Salary & Documents | UK Visa Tracker',
    description:
      'A plain-English guide to the UK Skilled Worker Visa: sponsorship, salary thresholds, required documents, and processing times — linked to official GOV.UK guidance.',
  },
  visitor: {
    title: 'UK Visitor Visa Requirements 2026 — Financial Requirement, Accommodation & Documents | UK Visa Tracker',
    description:
      'A plain-English guide to the UK Standard Visitor Visa: financial requirement, accommodation evidence, required documents, and processing times — linked to official GOV.UK guidance.',
  },
  child: {
    title: 'UK Child Visa Requirements 2026 — Relationship Evidence, Documents & Timeline | UK Visa Tracker',
    description:
      'A plain-English guide to the UK Child Visa: relationship evidence, required documents, and processing times — free guidance linked to official GOV.UK sources.',
  },
  settlement: {
    title: 'UK Settlement (ILR) Requirements 2026 — English Test, Biometrics & Timeline | UK Visa Tracker',
    description:
      'A plain-English guide to Indefinite Leave to Remain (ILR): the English test, biometrics, required documents, and processing times — linked to official GOV.UK guidance.',
  },
  citizenship: {
    title: 'UK Citizenship Requirements 2026 — English Test, Life in the UK & Processing Times | UK Visa Tracker',
    description:
      'A plain-English guide to becoming a British citizen: the Life in the UK test, English requirement, biometrics, and processing times — linked to official GOV.UK guidance.',
  },
};

export default function VisaTypeScreen() {
  const { type, question: questionParam } = useLocalSearchParams<{ type: string; question?: string }>();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<VisaInfoQuestion | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const section = VISA_INFO.find((s) => s.type === type);

  useEffect(() => {
    loadBookmarks().then(setBookmarkedIds);
    const unsubscribe = subscribeBookmarks(setBookmarkedIds);
    return () => {
      unsubscribe();
    };
  }, []);

  // Deep-link support: the hub's search/bookmarks pass ?question=<id> to
  // jump straight to a specific question instead of starting at the
  // category list.
  useEffect(() => {
    if (!questionParam || !section) return;
    for (const category of section.categories) {
      const found = category.questions.find((q) => q.id === questionParam);
      if (found) {
        setSelectedCategory(category.key);
        setSelectedQuestion(found);
        return;
      }
    }
  }, [questionParam, section]);

  if (!section) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <BackLink label="Visa Info" onPress={() => router.replace('/(tabs)/visa-info')} />
        <PageHeading>Visa type not found</PageHeading>
        <Text style={styles.emptyText}>We don't have information for that visa type.</Text>
      </Screen>
    );
  }

  const meta = SEO_META[section.type];
  const currentCategory = selectedCategory ? section.categories.find((c) => c.key === selectedCategory) : null;

  // ─────────────────────────── Question detail ───────────────────────────
  if (selectedQuestion && currentCategory) {
    const question = selectedQuestion;
    const bookmarked = bookmarkedIds.has(question.id);
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <Head>
          <title>{question.question} — {section.label} | UK Visa Tracker</title>
          <meta name="description" content={question.plainEnglish.slice(0, 155)} />
        </Head>
        <BackLink label="Back" onPress={() => setSelectedQuestion(null)} />
        <View style={styles.breadcrumbRow}>
          <Icon name={section.icon} size={13} color={colors.textTertiary} />
          <Text style={styles.breadcrumb}>
            {section.label} · {currentCategory.label}
          </Text>
        </View>

        <View style={styles.detailHeaderRow}>
          <Text style={styles.detailQuestion}>{question.question}</Text>
          <TouchableOpacity onPress={() => toggleBookmark(question.id)} accessibilityLabel="Bookmark this question" style={styles.starButton}>
            <Icon name="star" size={22} color={bookmarked ? '#c9720a' : colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.answerCard}>
          <Text style={styles.detailSectionTitle}>Answer</Text>
          <Text style={styles.detailBody}>{question.plainEnglish}</Text>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.detailSectionHeadingRow}>
            <Icon name="check-circle" size={15} color={colors.success} />
            <Text style={styles.detailSectionTitle}>Official rule</Text>
          </View>
          <Text style={styles.detailBody}>{question.officialRule}</Text>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.detailSectionHeadingRow}>
            <Icon name="check-circle" size={15} color={colors.success} />
            <Text style={styles.detailSectionTitle}>Example</Text>
          </View>
          <Text style={styles.detailBody}>{question.example}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Official Guidance</Text>
          <TouchableOpacity style={styles.officialLinkRow} onPress={() => Linking.openURL(question.officialGuidance.url)}>
            <Icon name="external-link" size={14} color={colors.primary} />
            <Text style={styles.officialLink}>View {question.officialGuidance.label}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          This is general guidance, not personalised legal advice — always confirm current detail on GOV.UK.
        </Text>
      </Screen>
    );
  }

  // ─────────────────────────── Questions in a category ───────────────────────────
  if (currentCategory) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <BackLink label={section.label} onPress={() => setSelectedCategory(null)} />
        <PageHeading>{currentCategory.label}</PageHeading>
        {currentCategory.questions.map((q) => (
          <TouchableOpacity key={q.id} style={styles.resultRow} onPress={() => setSelectedQuestion(q)}>
            <Text style={styles.resultQuestion}>{q.question}</Text>
            {bookmarkedIds.has(q.id) && (
              <View style={styles.savedTagRow}>
                <Icon name="star" size={11} color="#8a6d00" />
                <Text style={styles.savedTag}>Saved</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Categories in this visa type ───────────────────────────
  // FAQPage structured data must match content Google can actually see on
  // this page (see lib/structuredData.ts) — the "Full Q&A" section below
  // exists specifically to back this markup with real, crawlable text, not
  // just the category names shown in the cards above it.
  const allQuestions = section.categories.flatMap((c) => c.questions);
  const faqSchema = buildFAQPageSchema(allQuestions.map((q) => ({ question: q.question, answer: q.plainEnglish })));

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <JsonLd data={faqSchema} />
      <BackLink label="Visa Info" onPress={() => router.push('/(tabs)/visa-info')} />
      <PageHeading icon={section.icon}>{section.label}</PageHeading>
      {section.categories.map((category) => (
        <TouchableOpacity key={category.key} style={styles.categoryRow} onPress={() => setSelectedCategory(category.key)}>
          <Text style={styles.categoryLabel}>{category.label}</Text>
          <View style={styles.categoryCountRow}>
            <Text style={styles.categoryCount}>{category.questions.length}</Text>
            <Icon name="chevron-right" size={16} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Full Q&amp;A — {section.label}</Text>
      {section.categories.map((category) => (
        <View key={category.key} style={{ marginBottom: 20 }}>
          <Text style={[styles.categoryLabel, { marginBottom: 8 }]}>{category.label}</Text>
          {category.questions.map((q) => (
            <View key={q.id} style={{ marginBottom: 14 }}>
              <Text style={styles.resultQuestion}>{q.question}</Text>
              <Text style={styles.detailBody}>{q.plainEnglish}</Text>
            </View>
          ))}
        </View>
      ))}

      <ShareButtons
        url={`${SITE_URL}/visa-info/${section.type}`}
        title={section.label}
        context="visa_info"
      />
    </Screen>
  );
}
