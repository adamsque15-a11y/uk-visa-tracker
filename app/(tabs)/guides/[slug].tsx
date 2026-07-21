import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { GUIDES, GuideBlock, getGuide } from '../../../lib/guides';
import Screen from '../../../components/Screen';
import Icon from '../../../components/Icon';
import JsonLd from '../../../components/JsonLd';
import { BackLink, PageHeading, visaInfoStyles as styles } from '../../../components/VisaInfoUI';
import { colors } from '../../../lib/theme';
import { buildArticleSchema } from '../../../lib/structuredData';
import { SITE_URL } from '../../../lib/legalConfig';

// Pre-renders one static HTML page per guide at build time (output:
// "static"), same as visa-info/[type].tsx, so each guide is its own
// crawlable, indexable URL.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

function GuideBlockView({ block }: { block: GuideBlock }) {
  const router = useRouter();
  switch (block.type) {
    case 'heading':
      return (
        <Text style={block.level === 3 ? styles.detailSectionTitle : styles.sectionLabel}>{block.text}</Text>
      );
    case 'paragraph':
      return <Text style={styles.detailBody}>{block.text}</Text>;
    case 'list':
      return (
        <View>
          {block.items.map((item, i) => (
            <Text key={i} style={styles.detailBody}>
              {block.ordered ? `${i + 1}. ` : '• '}
              {item}
            </Text>
          ))}
        </View>
      );
    case 'callout':
      return (
        <View
          style={{
            backgroundColor: block.variant === 'warning' ? colors.warningSurface : colors.primarySurface,
            borderRadius: 12,
            padding: 14,
            marginVertical: 8,
          }}
        >
          <Text style={styles.detailBody}>{block.text}</Text>
        </View>
      );
    case 'link':
      return (
        <TouchableOpacity style={styles.officialLinkRow} onPress={() => Linking.openURL(block.url)}>
          <Icon name="external-link" size={14} color={colors.primary} />
          <Text style={styles.officialLink}>{block.label}</Text>
        </TouchableOpacity>
      );
    case 'internalLink':
      return (
        <TouchableOpacity style={styles.officialLinkRow} onPress={() => router.push(block.path as never)}>
          <Icon name="arrow-right" size={14} color={colors.primary} />
          <Text style={styles.officialLink}>{block.label}</Text>
        </TouchableOpacity>
      );
  }
}

export default function GuideArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const guide = getGuide(slug ?? '');

  if (!guide) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
        <BackLink label="Guides" onPress={() => router.replace('/(tabs)/guides')} />
        <PageHeading>Guide not found</PageHeading>
        <Text style={styles.emptyText}>We don't have a guide at that address.</Text>
      </Screen>
    );
  }

  const url = `${SITE_URL}/guides/${guide.slug}`;

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
      <Head>
        <title>{guide.title} | UK Visa Tracker</title>
        <meta name="description" content={guide.excerpt} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <JsonLd
        data={buildArticleSchema({
          headline: guide.title,
          description: guide.excerpt,
          url,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
        })}
      />

      <BackLink label="Guides" onPress={() => router.push('/(tabs)/guides')} />
      <PageHeading icon={guide.icon}>{guide.title}</PageHeading>

      {guide.body.map((block, i) => (
        <GuideBlockView key={i} block={block} />
      ))}

      <Text style={styles.disclaimer}>
        This is general guidance, not personalised legal advice — always confirm current detail on GOV.UK.
      </Text>
    </Screen>
  );
}
