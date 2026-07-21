import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius } from '../lib/theme';

// Distinct from the generic <Disclaimer /> ("independent & unaffiliated with
// UKVI") — this one exists specifically to keep the app on the general-
// information side of the regulated-immigration-advice boundary (Immigration
// Advice Authority / OISC). Deliberately its own visible banner rather than
// folded into the Terms of Service, and not dismissible — it needs to stay
// readable every time someone lands on a screen that touches individual
// requirements or case status.
export default function AdviceBoundaryNotice() {
  return (
    <View style={styles.banner}>
      <Icon name="info" size={14} color={colors.primary} />
      <Text style={styles.text}>
        This app provides general information and organisational tools only — it isn't a substitute for regulated
        immigration advice, and it doesn't assess or predict the outcome of any individual case.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { flex: 1, fontSize: 12.5, color: colors.textSecondary, lineHeight: 17 },
});
