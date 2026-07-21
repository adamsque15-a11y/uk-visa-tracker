import { View, StyleSheet } from 'react-native';
import { useShowSidebar } from '../hooks/useBreakpoint';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GuestModeBanner from './GuestModeBanner';
import { colors } from '../lib/theme';

interface AppShellProps {
  // When false, chrome is hidden entirely (pre-auth / auth screens) but the
  // wrapper stays structurally in place so the routed content underneath
  // never remounts as auth state changes.
  showChrome: boolean;
  children: React.ReactNode;
}

export default function AppShell({ showChrome, children }: AppShellProps) {
  const showSidebar = useShowSidebar();

  if (!showChrome) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.row}>
      {showSidebar && <Sidebar />}
      <View style={styles.column}>
        <TopBar />
        <GuestModeBanner />
        <View style={styles.fill}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  column: { flex: 1 },
  fill: { flex: 1 },
});
