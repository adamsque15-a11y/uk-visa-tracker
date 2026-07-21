import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Screen from './Screen';
import { colors, spacing, radius } from '../lib/theme';
import { APP_NAME, LEGAL_LAST_UPDATED } from '../lib/legalConfig';

interface LegalPageProps {
  title: string;
  intro?: string;
  // Used for the <meta name="description"> tag — the visible intro copy
  // usually doubles as a good summary, but this lets a page override it.
  metaDescription?: string;
  children: React.ReactNode;
}

// Shared shell for /privacy and /terms so both read as one consistent
// document style rather than two independently-styled pages.
export function LegalPage({ title, intro, metaDescription, children }: LegalPageProps) {
  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={760}>
      <Head>
        <title>{title} | {APP_NAME}</title>
        {(metaDescription || intro) && <meta name="description" content={metaDescription ?? intro} />}
        <meta property="og:title" content={`${title} | ${APP_NAME}`} />
        {(metaDescription || intro) && <meta property="og:description" content={metaDescription ?? intro} />}
        <meta property="og:type" content="article" />
      </Head>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.lastUpdated}>Last updated: {LEGAL_LAST_UPDATED}</Text>
      {intro && <Text style={styles.intro}>{intro}</Text>}
      {children}
    </Screen>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {children}
    </View>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item, i) => (
        <View key={i} style={styles.listRow}>
          <View style={styles.bullet} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function EmailLink({ email }: { email: string }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
      <Text style={styles.link}>{email}</Text>
    </TouchableOpacity>
  );
}

export function LegalCrossLink({ label, path }: { label: string; path: '/privacy' | '/terms' }) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(path)}>
      <Text style={styles.link}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  lastUpdated: { fontSize: 13, color: colors.textTertiary, marginTop: spacing.xs, marginBottom: spacing.md },
  intro: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  section: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionHeading: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  paragraph: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.sm },
  list: { marginBottom: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, paddingLeft: spacing.xs },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.textTertiary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  listText: { flex: 1, fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  link: { fontSize: 15, color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' },
});
