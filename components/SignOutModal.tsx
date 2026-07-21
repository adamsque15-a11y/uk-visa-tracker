import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius } from '../lib/theme';

interface SignOutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// React Native's Alert.alert has no web implementation in this app's setup
// (it silently no-ops on web, which previously made Sign Out a dead button)
// — this custom Modal replaces it, following the same pattern already used
// by DeleteAccountModal/UpgradeModal.
export default function SignOutModal({ visible, onClose, onConfirm }: SignOutModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="log-out" size={22} color={colors.primary} />
          </View>
          <Text style={styles.title}>Sign out?</Text>
          <Text style={styles.message}>You can sign back in at any time.</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={onConfirm}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 360, alignItems: 'center' },
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
  message: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  signOutButton: {
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xs,
  },
  signOutButtonText: { color: colors.textOnPrimary, fontWeight: '700', fontSize: 15 },
  cancelButton: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  cancelButtonText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
