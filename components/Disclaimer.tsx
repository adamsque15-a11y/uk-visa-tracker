import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing, typography } from '../lib/theme';

interface DisclaimerProps {
  // Override for context-specific wording (e.g. a shared page viewed by
  // someone with no account) — defaults to the same copy used on Home.
  text?: string;
}

const DEFAULT_TEXT =
  'Independent & unaffiliated with UKVI or the Home Office — your visa data stays private to your account.';

export default function Disclaimer({ text = DEFAULT_TEXT }: DisclaimerProps) {
  return (
    <View style={styles.row}>
      <Icon name="shield" size={13} color={colors.textTertiary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md },
  text: { ...typography.caption, textAlign: 'center', maxWidth: 480 },
});
