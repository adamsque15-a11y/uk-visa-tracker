import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Icon from './Icon';
import { colors, spacing, TOP_BAR_HEIGHT } from '../lib/theme';

interface NavDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const ANIM_DURATION = 220;

// Mobile-only slide-out version of the sidebar — an overlay on top of the
// page (not a layout push), reusing <Sidebar> as-is so the drawer can never
// drift out of sync with the desktop nav's items, order, icons, or footer.
export default function NavDrawer({ visible, onClose }: NavDrawerProps) {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  // Keeps the Modal mounted for the duration of the close animation instead
  // of unmounting the instant `visible` flips false, which would cut the
  // slide-out short.
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -SIDEBAR_WIDTH, duration: ANIM_DURATION, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
            accessibilityLabel="Close menu"
          />
        </Animated.View>

        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close menu" hitSlop={10}>
              <Icon name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Sidebar onItemPress={onClose} style={styles.sidebarFill} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,24,40,0.4)' },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.surface,
    shadowColor: '#101828',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 4, height: 0 },
    elevation: 16,
  },
  drawerHeader: {
    height: TOP_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: { fontSize: 13, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.3 },
  sidebarFill: { flex: 1, width: SIDEBAR_WIDTH, borderRightWidth: 0 },
});
