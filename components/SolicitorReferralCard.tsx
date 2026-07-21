import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius } from '../lib/theme';
import { trackEvent } from '../lib/analytics';
import {
  ENABLE_SOLICITOR_REFERRAL,
  SOLICITOR_PARTNER_URL,
  SOLICITOR_REFERRAL_DISCLAIMER,
  SolicitorReferralContext,
} from '../lib/solicitorReferral';

interface SolicitorReferralCardProps {
  // Identifies which trigger point showed this card, so click-through
  // interest can be measured per-context before formalizing any partnership.
  context: SolicitorReferralContext;
  // Optional context-flavoured headline (e.g. naming the screen it appeared
  // on) — never used to comment on why a specific user's situation is
  // complex, or to suggest a remedy. This is a plain handoff to a regulated
  // adviser, not advice about the case itself; the default below is
  // deliberately generic and is the right choice unless there's a genuine
  // need for different wording.
  message?: string;
}

// Calm, optional, dismissible — deliberately styled as secondary content
// (muted surface, outlined CTA) rather than an urgent warning, so it reads
// as a helpful suggestion rather than an upsell blocking the main flow.
export default function SolicitorReferralCard({ context, message }: SolicitorReferralCardProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!ENABLE_SOLICITOR_REFERRAL) return;
    trackEvent('solicitor_referral_shown', { context });
  }, [context]);

  // Feature-flagged off for now (see lib/solicitorReferral.ts) — renders
  // nothing, so every call site collapses cleanly with no reserved space.
  if (!ENABLE_SOLICITOR_REFERRAL) return null;
  if (dismissed) return null;

  function handlePress() {
    trackEvent('solicitor_referral_clicked', { context });
    Linking.openURL(SOLICITOR_PARTNER_URL);
  }

  function handleDismiss() {
    trackEvent('solicitor_referral_dismissed', { context });
    setDismissed(true);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss} accessibilityLabel="Dismiss">
        <Icon name="x" size={14} color={colors.textTertiary} />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Icon name="user-check" size={16} color={colors.textSecondary} />
        <Text style={styles.title}>
          {message ?? 'Want help from a professional? Regulated immigration advisers can advise on your specific case'}
        </Text>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
        <Text style={styles.ctaButtonText}>Find a regulated adviser</Text>
        <Icon name="external-link" size={13} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.disclaimer}>{SOLICITOR_REFERRAL_DISCLAIMER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  dismissButton: { position: 'absolute', top: 10, right: 10, padding: 4, zIndex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingRight: spacing.lg },
  title: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.textSecondary, lineHeight: 19 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  ctaButtonText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  disclaimer: { fontSize: 11, color: colors.textTertiary, marginTop: spacing.sm, lineHeight: 15 },
});
