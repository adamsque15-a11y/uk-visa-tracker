import { TextStyle } from 'react-native';

// Single source of truth for the app's visual language — a restrained,
// trustworthy "gov-services/fintech" look (closer to GOV.UK or Stripe than
// a consumer app): white/neutral surfaces, one accent color for calls to
// action, no gradients, minimal shadow.

export const colors = {
  // Brand
  primary: '#1a3c6e',
  primaryHover: '#15315a',
  primarySurface: '#eef2f8',

  // Neutrals (gray scale, warm-neutral to match the near-white background)
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceSubtle: '#f7f8fa',
  border: '#e4e7ec',
  borderStrong: '#d0d5dd',

  textPrimary: '#101828',
  textSecondary: '#475467',
  textTertiary: '#98a2b3',
  textOnPrimary: '#ffffff',

  // Semantic
  success: '#0a7d3c',
  successSurface: '#e7f6ec',
  danger: '#c81e3a',
  dangerSurface: '#fdecee',
  warning: '#8a6d00',
  warningSurface: '#fff8e1',
} as const;

// Shared layout constants — kept separate from any one component so
// TopBar and NavDrawer (which need to align their header heights) can both
// import this without creating a circular dependency between each other.
export const TOP_BAR_HEIGHT = 56;

// 8px grid.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography: Record<string, TextStyle> = {
  pageTitle: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400', color: colors.textPrimary, lineHeight: 22 },
  bodySecondary: { fontSize: 14, fontWeight: '400', color: colors.textSecondary, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.2 },
};

// A single, restrained shadow used for cards — subtle enough not to read as
// "app chrome," just enough to lift content off the page.
export const cardShadow = {
  shadowColor: '#101828',
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

export const card = {
  backgroundColor: colors.surface,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.lg,
  ...cardShadow,
} as const;
