import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Icon from './Icon';
import { colors, spacing } from '../lib/theme';

// Persistent (not dismissible) reminder shown on every screen while in Guest
// Mode — data loss from clearing the device or switching browsers is
// irreversible, so this stays visible throughout guest use rather than only
// warning once, after the fact, when progress is saved.
export default function GuestModeBanner() {
  const { guestMode, mockSession } = useAuth();
  const router = useRouter();

  if (!guestMode || mockSession) return null;

  return (
    <View style={styles.banner}>
      <Icon name="alert-triangle" size={14} color={colors.warning} />
      <Text style={styles.text}>
        Guest Mode — your data is saved on this device only and will be lost if you clear your browser or switch
        devices.
      </Text>
      <TouchableOpacity onPress={() => router.push({ pathname: '/auth/login', params: { mode: 'signup' } })}>
        <Text style={styles.link}>Create free account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.warningSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  text: { flex: 1, fontSize: 12.5, color: colors.warning, lineHeight: 17 },
  link: { fontSize: 12.5, fontWeight: '700', color: colors.warning, textDecorationLine: 'underline' },
});
