import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon, { IconName } from './Icon';
import { colors, radius, spacing, typography, card } from '../lib/theme';

// Shared between the Visa Info hub and each visa-type page so both read as
// one consistent surface.
export function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={visaInfoStyles.backLink} onPress={onPress}>
      <Icon name="chevron-left" size={16} color={colors.primary} />
      <Text style={visaInfoStyles.backLinkText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PageHeading({ icon, children }: { icon?: IconName; children: React.ReactNode }) {
  return (
    <View style={visaInfoStyles.pageHeadingRow}>
      {icon && (
        <View style={visaInfoStyles.pageHeadingIconWrap}>
          <Icon name={icon} size={20} color={colors.primary} />
        </View>
      )}
      <Text style={visaInfoStyles.pageHeading}>{children}</Text>
    </View>
  );
}

export const visaInfoStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },

  kicker: { ...typography.label, marginBottom: spacing.xs },
  title: { ...typography.pageTitle, marginBottom: spacing.xs },
  subheading: { ...typography.bodySecondary, marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, marginTop: spacing.lg, marginBottom: spacing.sm },

  pageHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  pageHeadingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeading: { ...typography.pageTitle, fontSize: 22 },

  searchInputWrap: { position: 'relative', justifyContent: 'center', marginBottom: spacing.md },
  searchInputIcon: { position: 'absolute', left: spacing.md, zIndex: 1 },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingLeft: 40,
    fontSize: 15,
    color: colors.textPrimary,
  },

  savedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  savedLinkText: { fontSize: 15, fontWeight: '600', color: colors.primary },

  typeList: { ...card, padding: 0, overflow: 'hidden' },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: { ...typography.cardTitle, flex: 1 },

  backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backLinkText: { fontSize: 15, color: colors.primary, fontWeight: '600' },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryLabel: { ...typography.cardTitle },
  categoryCountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryCount: { fontSize: 13, color: colors.textTertiary },

  resultsHeading: { ...typography.label, marginTop: spacing.lg, marginBottom: spacing.sm },
  resultRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultQuestion: { ...typography.cardTitle },
  resultMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  resultMeta: { fontSize: 12, color: colors.textTertiary },
  savedTagRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  savedTag: { fontSize: 11, color: '#8a6d00' },
  emptyText: { ...typography.bodySecondary, marginTop: spacing.md },

  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.sm },
  breadcrumb: { fontSize: 12, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md },
  detailQuestion: { ...typography.pageTitle, fontSize: 21, flex: 1, marginRight: spacing.sm },
  starButton: { padding: 2 },

  answerCard: { ...card, marginBottom: spacing.md },
  detailSection: {
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailSectionHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs },
  detailSectionTitle: { ...typography.label, marginBottom: spacing.xs },
  detailBody: { ...typography.body },
  officialLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  officialLink: { fontSize: 15, color: colors.primary, fontWeight: '600', textDecorationLine: 'underline' },
  disclaimer: { ...typography.caption, marginTop: spacing.xl, marginBottom: spacing.xl, lineHeight: 16 },
});
