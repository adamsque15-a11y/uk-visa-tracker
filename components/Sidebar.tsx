import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { NAV_ITEMS, toPathname } from '../lib/navConfig';
import Icon from './Icon';
import Footer from './Footer';
import { colors, radius, spacing } from '../lib/theme';

export const SIDEBAR_WIDTH = 240;

interface SidebarProps {
  // Called right before navigating — lets the mobile drawer (see NavDrawer)
  // close itself on any nav interaction, without this component knowing
  // whether it's rendered as the persistent desktop sidebar or inside a
  // drawer overlay.
  onItemPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function Sidebar({ onItemPress, style }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function go(path: Parameters<typeof router.push>[0]) {
    onItemPress?.();
    router.push(path);
  }

  return (
    <View style={[styles.sidebar, style]}>
      <View style={styles.navList}>
        {NAV_ITEMS.map((item) => {
          // Items with subItems (currently just IELTS Life Skills) also
          // count as active on their own sub-pages (e.g. /ielts-life-skills/a1),
          // so the sub-nav stays expanded while browsing any level.
          const active =
            pathname === toPathname(item.path) ||
            (!!item.subItems && pathname.startsWith(`${toPathname(item.path)}/`));
          return (
            <View key={item.key}>
              <TouchableOpacity
                style={[styles.item, active && styles.itemActive]}
                onPress={() => go(item.path as never)}
                accessibilityLabel={item.label}
              >
                <Icon name={item.icon} size={18} color={active ? colors.primary : colors.textSecondary} />
                <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
              </TouchableOpacity>

              {active && item.subItems && (
                <View style={styles.subList}>
                  {item.subItems.map((sub) => {
                    const subActive = pathname === toPathname(sub.path);
                    return (
                      <TouchableOpacity
                        key={sub.key}
                        style={[styles.subItem, subActive && styles.subItemActive]}
                        onPress={() => go(sub.path as never)}
                        accessibilityLabel={sub.label}
                      >
                        <Icon name={sub.icon} size={15} color={subActive ? colors.primary : colors.textTertiary} />
                        <Text style={[styles.subLabel, subActive && styles.subLabelActive]}>{sub.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <Footer layout="column" onLinkPress={onItemPress} style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
  },
  navList: { flex: 1 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    marginBottom: 2,
  },
  itemActive: {
    backgroundColor: colors.primarySurface,
    borderLeftColor: colors.primary,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  labelActive: { color: colors.primary },
  subList: { marginLeft: spacing.lg, marginBottom: 4 },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  subItemActive: { backgroundColor: colors.surfaceSubtle },
  subLabel: { fontSize: 13, fontWeight: '500', color: colors.textTertiary },
  subLabelActive: { color: colors.primary, fontWeight: '600' },
});
