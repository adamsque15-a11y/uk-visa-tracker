import { ScrollView, ScrollViewProps, View, StyleSheet } from 'react-native';

interface ScreenProps extends ScrollViewProps {
  /** Caps content width on wide (tablet/desktop) screens so text doesn't stretch full-bleed. */
  maxWidth?: number;
  children: React.ReactNode;
}

// Wraps ScrollView with a centered, width-capped inner column — the same
// component works unchanged from a 375px phone up to a 1920px desktop
// browser window, since the cap only kicks in once the viewport is wider
// than maxWidth.
export default function Screen({ maxWidth = 720, contentContainerStyle, children, ...rest }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={[styles.center, contentContainerStyle]} {...rest}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  inner: { width: '100%' },
});
