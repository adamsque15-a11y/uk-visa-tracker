import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import Icon from './Icon';
import { colors, spacing, radius, typography } from '../lib/theme';
import { trackEvent } from '../lib/analytics';

interface ShareButtonsProps {
  url: string;
  title: string;
  // Identifies which page/feature is sharing, for analytics — e.g.
  // 'checklist' | 'cost_summary' | 'visa_info' | 'insights'.
  context: string;
  // Guest/local-mode Checklist data never leaves the device, so a share
  // link there would be dead for anyone else — pass disabled+disabledReason
  // to show an explanation instead of non-functional buttons.
  disabled?: boolean;
  disabledReason?: string;
}

// Copy link / WhatsApp / email — deliberately no expo-clipboard dependency,
// since this is a web-output-first app: the Clipboard Web API covers the
// common case, and WhatsApp/email both work everywhere via Linking's
// universal wa.me / mailto: URLs.
export default function ShareButtons({ url, title, context, disabled, disabledReason }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent('share_buttons_shown', { context, disabled: !!disabled });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  if (disabled) {
    return (
      <View style={styles.disabledRow}>
        <Icon name="lock" size={13} color={colors.textTertiary} />
        <Text style={styles.disabledText}>{disabledReason ?? 'Sharing is unavailable right now.'}</Text>
      </View>
    );
  }

  async function handleCopy() {
    trackEvent('share_clicked', { context, method: 'copy' });
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWhatsApp() {
    trackEvent('share_clicked', { context, method: 'whatsapp' });
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`);
  }

  function handleEmail() {
    trackEvent('share_clicked', { context, method: 'email' });
    Linking.openURL(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
  }

  return (
    <View style={styles.row}>
      <Text style={styles.label}>SHARE</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={handleCopy} accessibilityLabel="Copy link">
          <Icon name={copied ? 'check' : 'link'} size={15} color={colors.primary} />
          <Text style={styles.buttonText}>{copied ? 'Copied' : 'Copy link'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleWhatsApp} accessibilityLabel="Share on WhatsApp">
          <Icon name="message-circle" size={15} color={colors.primary} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail} accessibilityLabel="Share by email">
          <Icon name="mail" size={15} color={colors.primary} />
          <Text style={styles.buttonText}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: spacing.md },
  label: { ...typography.label, marginBottom: spacing.sm },
  buttonsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  buttonText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  disabledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.sm,
  },
  disabledText: { ...typography.caption, flex: 1 },
});
