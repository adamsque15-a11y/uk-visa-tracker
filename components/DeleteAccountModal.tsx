import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius } from '../lib/theme';
import { isLocalModeActive } from '../lib/localMode';
import { deleteAccount } from '../lib/accountDeletion';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

const CONFIRM_WORD = 'delete';

export default function DeleteAccountModal({ visible, onClose, onDeleted }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localMode = isLocalModeActive();
  const canConfirm = confirmText.trim().toLowerCase() === CONFIRM_WORD;

  function handleClose() {
    if (deleting) return;
    setConfirmText('');
    setError(null);
    onClose();
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setDeleting(true);
    setError(null);
    const result = await deleteAccount();
    setDeleting(false);
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    onDeleted();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="alert-triangle" size={22} color={colors.danger} />
          </View>
          <Text style={styles.title}>{localMode ? 'Clear your data on this device?' : 'Delete your account?'}</Text>
          <Text style={styles.message}>
            {localMode
              ? "This permanently removes your application, checklist, and test prep progress stored on this device. It can't be undone."
              : "This permanently removes your account and all associated data — applications, checklist progress, and timeline. It can't be undone."}
          </Text>

          <Text style={styles.confirmLabel}>
            Type <Text style={styles.confirmWord}>{CONFIRM_WORD}</Text> to confirm
          </Text>
          <TextInput
            style={styles.input}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!deleting}
            placeholder={CONFIRM_WORD}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.deleteButton, !canConfirm && styles.deleteButtonDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm || deleting}
          >
            <Text style={styles.deleteButtonText}>
              {deleting ? 'Deleting...' : localMode ? 'Clear my data' : 'Delete my account'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose} disabled={deleting}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 380 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    alignSelf: 'center',
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, textAlign: 'center', marginBottom: spacing.md },
  confirmLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs, textAlign: 'center' },
  confirmWord: { fontWeight: '700', color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  errorText: { color: colors.danger, fontSize: 13, marginBottom: spacing.sm, textAlign: 'center' },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  deleteButtonDisabled: { opacity: 0.4 },
  deleteButtonText: { color: colors.textOnPrimary, fontWeight: '700', fontSize: 15 },
  cancelButton: { paddingVertical: 10, alignItems: 'center' },
  cancelButtonText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
