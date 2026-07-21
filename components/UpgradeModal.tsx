import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius } from '../lib/theme';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

// Stub for the real upgrade/checkout flow — no payment provider is wired up
// yet, so this just confirms interest and closes rather than starting a
// transaction. Swap this out once pricing and a payment provider are chosen.
export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="award" size={22} color={colors.primary} />
          </View>
          <Text style={styles.title}>Premium is coming soon</Text>
          <Text style={styles.message}>
            We're still finalizing Premium pricing and plans. Once it's ready, upgrading will unlock this feature —
            check back soon.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 380, alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, textAlign: 'center', marginBottom: spacing.md },
  closeButton: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 24 },
  closeButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 14 },
});
