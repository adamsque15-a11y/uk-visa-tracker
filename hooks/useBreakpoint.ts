import { useWindowDimensions } from 'react-native';

// Matches common web breakpoints (roughly Bootstrap/Tailwind's md/lg) rather
// than device-specific sizes, since this app runs as a resizable browser
// window on web as much as a fixed-size phone/tablet screen.
export const BREAKPOINTS = {
  tablet: 700,
  desktop: 1000,
  // The persistent top nav needs more room than the general "desktop"
  // threshold to fit every item without clipping — below this it falls
  // back to the hamburger menu even though the rest of the layout has
  // already switched to its desktop treatment.
  wideNav: 1180,
  // Below this the app shell switches from a left sidebar + top bar to a
  // bottom tab bar — independent of the breakpoints above, which are used
  // for in-page content layout rather than the app chrome.
  sidebar: 768,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function useIsDesktop(): boolean {
  return useBreakpoint() === 'desktop';
}

export function useShowDesktopNav(): boolean {
  const { width } = useWindowDimensions();
  return width >= BREAKPOINTS.wideNav;
}

export function useShowSidebar(): boolean {
  const { width } = useWindowDimensions();
  return width >= BREAKPOINTS.sidebar;
}
