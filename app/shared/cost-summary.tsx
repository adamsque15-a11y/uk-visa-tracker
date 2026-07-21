import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { calculateCost } from '../../lib/costCalculator';
import { parseCostShareParams } from '../../lib/costShare';
import { VISA_TYPE_ICON, formatVisaType } from '../../lib/applicationStatus';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import Disclaimer from '../../components/Disclaimer';
import { colors, radius, spacing, typography, card } from '../../lib/theme';

function formatGBP(value: number): string {
  return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const COST_LINES: { key: keyof ReturnType<typeof calculateCost>; label: string }[] = [
  { key: 'visaFee', label: 'Visa fee' },
  { key: 'ihs', label: 'Immigration Health Surcharge' },
  { key: 'tbTest', label: 'TB test' },
  { key: 'englishTest', label: 'English test' },
  { key: 'priorityService', label: 'Priority service' },
  { key: 'translations', label: 'Translations' },
  { key: 'solicitor', label: 'Solicitor' },
  { key: 'biometrics', label: 'Biometrics' },
  { key: 'courier', label: 'Courier' },
];

// Read-only, non-interactive summary — this is what a Cost Calculator share
// link points to, distinct from the interactive /(tabs)/costs calculator
// itself (no toggles, nothing editable). Reconstructs the breakdown purely
// from URL params — no database involved, see lib/costShare.ts.
export default function SharedCostSummaryScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const router = useRouter();
  const inputs = parseCostShareParams(params);

  if (!inputs) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={520}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Text style={styles.heading}>Link not available</Text>
        <Text style={styles.emptyText}>This shared cost summary link looks incomplete or invalid.</Text>
      </Screen>
    );
  }

  const breakdown = calculateCost(inputs);

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={520}>
      <Head>
        <title>Shared Cost Estimate | UK Visa Tracker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Icon name={VISA_TYPE_ICON[inputs.visaType] ?? 'file-text'} size={20} color={colors.textOnPrimary} />
        </View>
        <View>
          <Text style={styles.kicker}>SHARED COST ESTIMATE</Text>
          <Text style={styles.heading}>{formatVisaType(inputs.visaType)}</Text>
        </View>
      </View>

      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Estimated total</Text>
        <Text style={styles.totalValue}>{formatGBP(breakdown.total)}</Text>
      </View>

      <View style={styles.breakdownCard}>
        {COST_LINES.map((line) => (
          <View key={line.key} style={styles.costLine}>
            <Text style={styles.costLabel}>{line.label}</Text>
            <Text style={styles.costValue}>{formatGBP(breakdown[line.key])}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Figures are estimates based on published fees at time of writing and may not reflect current rates. Always
        confirm exact fees on GOV.UK before paying.
      </Text>

      <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/home')}>
        <Text style={styles.ctaButtonText}>Calculate your own</Text>
        <Icon name="arrow-right" size={15} color={colors.textOnPrimary} />
      </TouchableOpacity>

      <View style={styles.disclaimerWrap}>
        <Disclaimer text="This is a shared summary from an independent tool — not affiliated with UKVI or the Home Office." />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { ...typography.label, color: colors.primary, marginBottom: 2 },
  heading: { ...typography.pageTitle, fontSize: 20 },
  emptyText: { ...typography.bodySecondary, marginTop: spacing.sm },

  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  totalLabel: { fontSize: 13, fontWeight: '600', color: colors.primarySurface },
  totalValue: { fontSize: 20, fontWeight: '700', color: colors.textOnPrimary },

  breakdownCard: { ...card, marginBottom: spacing.md },
  costLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  costLabel: { ...typography.bodySecondary },
  costValue: { ...typography.body },

  disclaimer: { ...typography.caption, marginBottom: spacing.lg, lineHeight: 16 },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: spacing.lg,
  },
  ctaButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 15 },

  disclaimerWrap: { alignItems: 'center' },
});
