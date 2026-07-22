import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { openSupportEmail } from '../lib/legalConfig';
import { colors, spacing } from '../lib/theme';

interface FooterProps {
  // 'row' is the full-width footer (icon+copyright left, links right, one
  // line) used on standalone pages — 'column' stacks the same content for
  // the persistent sidebar, which is always ~240px wide regardless of the
  // viewport, never full width.
  layout?: 'row' | 'column';
  // Lets the mobile nav drawer close itself on any link tap, same pattern
  // Sidebar's own onItemPress already uses.
  onLinkPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// Single source of truth for the "logo + copyright + legal links" footer so
// every place it appears (Sidebar, standalone pages) can't drift out of
// sync with each other.
export default function Footer({ layout = 'row', onLinkPress, style }: FooterProps) {
  const router = useRouter();
  const year = new Date().getFullYear();

  function go(path: '/privacy' | '/terms') {
    onLinkPress?.();
    router.push(path);
  }

  function contact() {
    onLinkPress?.();
    openSupportEmail();
  }

  const isRow = layout === 'row';

  return (
    <View style={[isRow ? styles.rowContainer : styles.columnContainer, style]}>
      <View style={styles.brand}>
        <Image source={require('../assets/images/icon.png')} style={styles.brandIcon} resizeMode="contain" />
        <Text style={styles.copyright}>
          © {year} UK Visa Tracker. Not affiliated with UKVI or the Home Office.
        </Text>
      </View>
      <View style={isRow ? styles.linksRow : styles.linksColumn}>
        <TouchableOpacity onPress={() => go('/privacy')} accessibilityLabel="Privacy Policy">
          <Text style={styles.link}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go('/terms')} accessibilityLabel="Terms of Service">
          <Text style={styles.link}>Terms</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={contact} accessibilityLabel="Contact us">
          <Text style={styles.link}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
    paddingVertical: spacing.md,
  },
  columnContainer: { gap: spacing.sm },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  brandIcon: { width: 20, height: 20, borderRadius: 5 },
  copyright: { fontSize: 12.5, color: colors.textTertiary, flexShrink: 1 },
  linksRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  linksColumn: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  link: { fontSize: 12.5, fontWeight: '600', color: colors.textSecondary },
});
