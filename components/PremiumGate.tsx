import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon, { IconName } from './Icon';
import UpgradeModal from './UpgradeModal';
import { colors, spacing, radius } from '../lib/theme';

interface PremiumGateProps {
  icon: IconName;
  title: string;
  description: string;
}

// Shown in place of a premium-only feature for free-tier users — explains
// what upgrading would unlock rather than a disabled control or dead end.
export default function PremiumGate({ icon, title, description }: PremiumGateProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={() => setShowUpgradeModal(true)}>
        <Icon name="award" size={14} color={colors.textOnPrimary} />
        <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
      </TouchableOpacity>

      <UpgradeModal visible={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  description: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, textAlign: 'center', marginBottom: spacing.md },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  upgradeButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 13.5 },
});
