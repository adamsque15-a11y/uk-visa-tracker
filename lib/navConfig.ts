import { IconName } from '../components/Icon';

export interface NavSubItem {
  key: string;
  label: string;
  icon: IconName;
  // A full route path — active state is matched against usePathname(),
  // same as a top-level NavItem.
  path: string;
}

export interface NavItem {
  key: string;
  label: string;
  icon: IconName;
  path: string;
  subItems?: NavSubItem[];
}

// Shared by the desktop sidebar and the mobile slide-out drawer (see
// NavDrawer), so both surfaces always list the same sections in the same
// order. Profile is deliberately excluded — it only lives in the top bar's
// avatar menu.
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: 'home', path: '/home' },
  { key: 'dashboard', label: 'Dashboard', icon: 'grid', path: '/(tabs)' },
  { key: 'checklist', label: 'Checklist', icon: 'check-square', path: '/(tabs)/timeline' },
  { key: 'costs', label: 'Costs', icon: 'credit-card', path: '/(tabs)/costs' },
  { key: 'visa-info', label: 'Visa Info', icon: 'book-open', path: '/(tabs)/visa-info' },
  { key: 'guides', label: 'Guides', icon: 'file-text', path: '/(tabs)/guides' },
  { key: 'locations', label: 'Locations', icon: 'map-pin', path: '/(tabs)/test-locations' },
  { key: 'community', label: 'Insights', icon: 'bar-chart-2', path: '/(tabs)/community' },
  {
    key: 'ielts-life-skills',
    label: 'IELTS Life Skills',
    icon: 'award',
    path: '/(tabs)/ielts-life-skills',
    subItems: [
      { key: 'a1', label: 'A1 IELTS Life Skills', icon: 'award', path: '/(tabs)/ielts-life-skills/a1' },
      { key: 'a2', label: 'A2 IELTS Life Skills', icon: 'award', path: '/(tabs)/ielts-life-skills/a2' },
      { key: 'b1', label: 'B1 IELTS Life Skills', icon: 'award', path: '/(tabs)/ielts-life-skills/b1' },
    ],
  },
];

export interface ProfileMenuItem {
  key: string;
  label: string;
  icon: IconName;
  path: string;
}

// Settings currently lives inside the Profile screen (it already has its own
// "Settings" section), so both menu entries point there rather than to a
// separate route that doesn't exist yet.
export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { key: 'profile', label: 'Profile', icon: 'user', path: '/(tabs)/profile' },
  { key: 'settings', label: 'Settings', icon: 'settings', path: '/(tabs)/profile' },
  { key: 'privacy-data', label: 'Privacy & Data', icon: 'shield', path: '/privacy-data' },
];

// Route groups like "(tabs)" don't appear in the resolved URL pathname, so
// strip them before comparing against usePathname().
export function toPathname(routerPath: string): string {
  const stripped = routerPath.replace('/(tabs)', '');
  return stripped === '' ? '/' : stripped;
}
