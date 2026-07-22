import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { PROFILE_MENU_ITEMS } from '../lib/navConfig';
import { useAccount, accountInitial } from '../hooks/useAccount';
import { useShowSidebar } from '../hooks/useBreakpoint';
import { performSignOut } from '../lib/authActions';
import Icon from './Icon';
import NavDrawer from './NavDrawer';
import SignOutModal from './SignOutModal';
import { colors, radius, spacing, TOP_BAR_HEIGHT } from '../lib/theme';

const LEGAL_LINKS: { label: string; path: '/privacy' | '/terms' }[] = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

interface TopBarProps {
  // Only meaningful at desktop/tablet widths (where the persistent sidebar
  // renders) — at mobile widths the hamburger keeps its existing job of
  // opening NavDrawer regardless of these.
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function TopBar({ sidebarCollapsed, onToggleSidebar }: TopBarProps) {
  const router = useRouter();
  const account = useAccount();
  const showSidebar = useShowSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  function go(path: string) {
    setMenuOpen(false);
    router.push(path as never);
  }

  return (
    <View style={styles.bar}>
      <View style={styles.leftGroup}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={showSidebar ? onToggleSidebar : () => setDrawerOpen(true)}
          accessibilityLabel={showSidebar ? (sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar') : 'Open menu'}
        >
          <Icon name="menu" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)' as never)} accessibilityLabel="UK Visa Tracker home">
          <Image source={require('../assets/images/logo-wordmark.png')} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.avatar} onPress={() => setMenuOpen(true)} accessibilityLabel="Open account menu">
        <Text style={styles.avatarText}>{accountInitial(account)}</Text>
      </TouchableOpacity>

      {!showSidebar && <NavDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />}

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuOpen(false)} />
        <View style={styles.dropdown}>
          {PROFILE_MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.key} style={styles.menuItem} onPress={() => go(item.path)}>
              <Icon name={item.icon} size={16} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.legalGroup}>
            {LEGAL_LINKS.map((link) => (
              <TouchableOpacity key={link.path} style={styles.legalItem} onPress={() => go(link.path)}>
                <Text style={styles.legalLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              setShowSignOutModal(true);
            }}
          >
            <Icon name="log-out" size={16} color={colors.danger} />
            <Text style={[styles.menuLabel, styles.menuLabelDanger]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <SignOutModal
        visible={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={() => {
          setShowSignOutModal(false);
          performSignOut(router);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  leftGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hamburger: { padding: 4, marginLeft: -4 },
  logo: { width: 130, height: 28 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textOnPrimary, fontSize: 13, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(16,24,40,0.25)' },
  dropdown: {
    position: 'absolute',
    top: TOP_BAR_HEIGHT + 4,
    right: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    minWidth: 200,
    shadowColor: '#101828',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, paddingHorizontal: spacing.md },
  menuLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  menuLabelDanger: { color: colors.danger },
  legalGroup: { paddingTop: 2, paddingBottom: 4 },
  legalItem: { paddingVertical: 5, paddingHorizontal: spacing.md },
  legalLabel: { fontSize: 12, fontWeight: '600', color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
});
