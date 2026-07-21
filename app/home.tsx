import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Head from 'expo-router/head';
import Screen from '../components/Screen';
import Icon, { IconName } from '../components/Icon';
import JsonLd from '../components/JsonLd';
import Disclaimer from '../components/Disclaimer';
import { supabase } from '../lib/supabase';
import { buildHowToSchema, buildOrganizationSchema } from '../lib/structuredData';
import { setPendingIntent } from '../lib/navigationIntent';
import { setGuestMode } from '../lib/guestMode';
import { isLocalModeActive } from '../lib/localMode';
import { mockListApplications, mockGetTimelineEvents } from '../lib/mockDb';
import { useIsDesktop } from '../hooks/useBreakpoint';
import { useAuth } from '../hooks/useAuth';
import { VISA_TYPE_ICON, formatVisaType, getCurrentStatus, TimelineEventLike } from '../lib/applicationStatus';
import { CEFRLevel, CEFR_LEVELS, LEVEL_FULL_LABELS, inferDefaultLevel } from '../lib/englishPrep/level';
import { colors, radius, spacing, typography, card } from '../lib/theme';

// The app's own three-step flow — reused for both the visible "How It
// Works" section below and its matching HowTo structured data, so the two
// never drift apart.
const HOW_TO_STEPS = [
  {
    name: 'Answer a few questions',
    text: 'Tell us your nationality, the visa route you\'re applying for, and a few details like income or dependants — it takes a couple of minutes.',
  },
  {
    name: 'Get your personalised checklist',
    text: 'We generate a document checklist tailored to your specific visa route, with plain-English explanations for each item.',
  },
  {
    name: 'Track your progress',
    text: 'Follow your application through biometrics, submission, processing, and decision — with target processing times and reminders along the way.',
  },
];

// Short, scannable reasons to use this over Googling it or the official
// UKVI tracker — kept to icon + one line each, styled like the trust line
// above rather than a wall of marketing copy.
const WHY_CHOOSE_POINTS: { icon: IconName; text: string }[] = [
  {
    icon: 'layers',
    text: 'Everything in one place — checklist, costs, tracking and English test prep, instead of scattered forum threads and GOV.UK pages.',
  },
];

interface HomeApplication {
  id: string;
  visa_type: string;
}

interface ApplicationStatusState {
  loading: boolean;
  applications: HomeApplication[];
  events: TimelineEventLike[];
}

// Mirrors the Dashboard's own load: local mock DB in guest/dev mode,
// Supabase otherwise, with per-stage timeline events only fetched when
// there's exactly one application to summarise.
//
// `authLoading` (useAuth()'s own loading flag) has to be threaded in and
// checked first, not just `authenticated` — useAuth() forces authenticated
// to false for the entire window before it resolves the real session, so
// without this guard this hook would immediately (and wrongly) resolve to
// "no applications" for an about-to-be-authenticated user, which is exactly
// what caused the empty-state flash before the personalised view took over.
function useApplicationStatus(authLoading: boolean, authenticated: boolean): ApplicationStatusState {
  const [state, setState] = useState<ApplicationStatusState>({ loading: true, applications: [], events: [] });

  const load = useCallback(async () => {
    if (authLoading) return; // don't resolve anything until the real auth state is known
    if (!authenticated) {
      setState({ loading: false, applications: [], events: [] });
      return;
    }

    let applications: HomeApplication[];
    if (isLocalModeActive()) {
      applications = await mockListApplications();
    } else {
      const { data, error } = await supabase
        .from('applications')
        .select('id, visa_type')
        .order('created_at', { ascending: false });
      applications = !error && data ? data : [];
    }

    let events: TimelineEventLike[] = [];
    if (applications.length === 1) {
      if (isLocalModeActive()) {
        events = await mockGetTimelineEvents(applications[0].id);
      } else {
        const { data } = await supabase.from('timeline_events').select('stage, completed').eq('application_id', applications[0].id);
        events = data ?? [];
      }
    }

    setState({ loading: false, applications, events });
  }, [authLoading, authenticated]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return state;
}

export default function HomeScreen() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { authenticated, loading: authLoading } = useAuth();
  const { loading, applications, events } = useApplicationStatus(authLoading, authenticated);
  const hasApplication = !loading && applications.length > 0;

  // Which CEFR level to visually recommend on the IELTS Life Skills card —
  // same best-effort signal the /ielts-life-skills index route uses to pick
  // a level (see level.ts), re-run on focus so it stays current if the user
  // bookmarks Settlement/Citizenship guidance and comes back here.
  const [recommendedLevel, setRecommendedLevel] = useState<CEFRLevel | null>(null);
  useFocusEffect(
    useCallback(() => {
      inferDefaultLevel().then(setRecommendedLevel);
    }, [])
  );

  function handleApply() {
    if (authenticated) {
      router.replace('/(tabs)/questionnaire');
      return;
    }
    setPendingIntent('apply');
    router.push('/auth/login');
  }

  async function handleTrack() {
    if (authenticated) {
      router.replace('/quick-track');
      return;
    }
    setPendingIntent('track');
    // Tracking shouldn't require signing up first — get them straight into
    // tracking as a guest, and only offer account creation once they've
    // actually started tracking progress (see quick-track.tsx's save prompt).
    await setGuestMode(true);
  }

  async function handleEnglishPrep(level: CEFRLevel) {
    if (authenticated) {
      router.replace({ pathname: '/(tabs)/ielts-life-skills/[level]', params: { level } });
      return;
    }
    setPendingIntent('ielts_a1_test', level);
    // Practising for the English test isn't personal or sensitive, so don't
    // put a sign-up wall in front of it — same reasoning as handleTrack.
    await setGuestMode(true);
  }

  function handleGoToDashboard() {
    router.replace('/(tabs)');
  }

  function handleSignIn() {
    router.push('/auth/login');
  }

  function handleCreateAccount() {
    router.push({ pathname: '/auth/login', params: { mode: 'signup' } });
  }

  async function handleGuest() {
    await setGuestMode(true);
  }

  const trackCard = (
    <ActionCard
      variant="secondary"
      icon="clock"
      title="I've already applied"
      description="Track your application timeline, processing progress and important dates."
      ctaLabel="Track My Visa"
      onPress={handleTrack}
      style={isDesktop ? styles.gridItem : undefined}
    />
  );

  const englishPrepCard = (
    <EnglishPrepCard
      recommendedLevel={recommendedLevel}
      onSelectLevel={handleEnglishPrep}
      style={isDesktop ? styles.gridItem : undefined}
    />
  );

  // Whether this card should say "I'm applying" or "Start another
  // application" depends on `hasApplication`, which isn't known for certain
  // until `loading` resolves — rendering either variant before then risks
  // briefly showing the wrong one, which is exactly the flash this guards
  // against. A neutral loading placeholder in between avoids that without
  // blocking the rest of the page (hero, "how it works", SEO content) on
  // it, none of which depend on this.
  const applyCard = loading ? (
    <LoadingActionCard style={isDesktop ? styles.gridItemPrimary : undefined} />
  ) : hasApplication ? (
    <ActionCard
      variant="secondary"
      icon="file-plus"
      title="Start another application"
      description="Tracking a second visa, for a family member or a new application? Start a fresh checklist."
      ctaLabel="Start New Application"
      onPress={handleApply}
      style={isDesktop ? styles.gridItem : undefined}
    />
  ) : (
    <ActionCard
      variant="primary"
      icon="file-text"
      kicker="New application"
      title="I'm applying for a UK Visa"
      description="Check requirements, answer questions, generate your checklist and get guidance."
      ctaLabel="Start My Application"
      onPress={handleApply}
      style={isDesktop ? styles.gridItemPrimary : undefined}
    />
  );

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={1040}>
      <Head>
        <title>UK Visa Tracker — Free Checklist, Timeline &amp; Cost Calculator for UK Visa Applications</title>
        <meta
          name="description"
          content="Track your UK visa application from start to decision. Free personalised checklist, timeline, cost calculator, and plain-English visa guidance — independent, not affiliated with UKVI or the Home Office."
        />
        <meta property="og:title" content="UK Visa Tracker — Free Checklist, Timeline &amp; Cost Calculator" />
        <meta
          property="og:description"
          content="Track your UK visa application from start to decision — free checklist, timeline, cost calculator, and plain-English guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildHowToSchema({
          name: 'How to track your UK visa application with UK Visa Tracker',
          description: 'Three steps to go from starting a UK visa application to tracking it through to a decision.',
          steps: HOW_TO_STEPS,
        })}
      />
      <View style={styles.hero}>
        <Text style={styles.title}>UK Visa Tracker</Text>
        <Text style={styles.headline}>Track every stage of your UK visa journey, from application to decision.</Text>
        <Disclaimer />

        <View style={styles.whyChoose}>
          {WHY_CHOOSE_POINTS.map((point) => (
            <View key={point.icon} style={styles.whyChoosePoint}>
              <Icon name={point.icon} size={13} color={colors.textTertiary} />
              <Text style={styles.trustLineText}>{point.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {hasApplication && (
        <StatusCard applications={applications} events={events} onPress={handleGoToDashboard} />
      )}

      <View style={isDesktop ? styles.grid : undefined}>
        {applyCard}
        {trackCard}
        {englishPrepCard}
      </View>

      <View style={styles.howItWorks}>
        <Text style={styles.howItWorksTitle}>How it works</Text>
        {HOW_TO_STEPS.map((step, i) => (
          <View key={step.name} style={styles.howItWorksStep}>
            <View style={styles.howItWorksStepNumber}>
              <Text style={styles.howItWorksStepNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.howItWorksStepTextGroup}>
              <Text style={styles.howItWorksStepName}>{step.name}</Text>
              <Text style={styles.howItWorksStepBody}>{step.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {!authenticated && (
        <View style={styles.authLinks}>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.authLinkText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.authLinkText}>Create Free Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGuest}>
            <Text style={styles.guestLinkText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This app provides general information and organisational tools only — it isn't a substitute for regulated
          immigration advice, and it doesn't assess or predict the outcome of any individual case.
        </Text>
      </View>
    </Screen>
  );
}

function StatusCard({
  applications,
  events,
  onPress,
}: {
  applications: HomeApplication[];
  events: TimelineEventLike[];
  onPress: () => void;
}) {
  const single = applications.length === 1 ? applications[0] : null;
  const status = single ? getCurrentStatus(events) : null;

  return (
    <View style={[card, styles.statusCard]}>
      <View style={styles.primaryIconBadge}>
        <Icon name={(single && VISA_TYPE_ICON[single.visa_type]) || 'grid'} size={22} color={colors.textOnPrimary} />
      </View>
      <Text style={styles.cardKicker}>{single ? 'Your application' : `${applications.length} applications in progress`}</Text>
      <Text style={styles.primaryCardTitle}>{single ? formatVisaType(single.visa_type) : 'Continue where you left off'}</Text>
      {status && (
        <View style={styles.statusRow}>
          <Icon name={status.icon} size={15} color={colors.primary} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      )}
      <Text style={styles.cardDescription}>
        {single
          ? 'Pick up your checklist and timeline where you left off.'
          : 'View all your tracked applications on your dashboard.'}
      </Text>
      <Pressable
        onPress={onPress}
        style={({ hovered, pressed }: any) => [
          styles.primaryButton,
          hovered && styles.primaryButtonHover,
          pressed && styles.primaryButtonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Go to My Dashboard</Text>
      </Pressable>
    </View>
  );
}

function ActionCard({
  variant,
  icon,
  kicker,
  title,
  description,
  ctaLabel,
  onPress,
  style,
}: {
  variant: 'primary' | 'secondary';
  icon: IconName;
  kicker?: string;
  title: string;
  description: string;
  ctaLabel: string;
  onPress: () => void;
  style?: any;
}) {
  const isPrimary = variant === 'primary';
  return (
    <View style={[card, isPrimary ? styles.primaryCard : styles.secondaryCard, style]}>
      <View style={isPrimary ? styles.primaryIconBadge : styles.secondaryIconBadge}>
        <Icon name={icon} size={isPrimary ? 22 : 18} color={isPrimary ? colors.textOnPrimary : colors.primary} />
      </View>
      {kicker ? <Text style={styles.cardKicker}>{kicker}</Text> : null}
      <Text style={isPrimary ? styles.primaryCardTitle : styles.secondaryCardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Pressable
        onPress={onPress}
        style={({ hovered, pressed }: any) => [
          isPrimary ? styles.primaryButton : styles.secondaryButton,
          hovered && (isPrimary ? styles.primaryButtonHover : styles.secondaryButtonHover),
          pressed && styles.primaryButtonPressed,
        ]}
      >
        <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
}

// Stands in for ActionCard's "New application" slot while we don't yet know
// whether to show it or the "Start another application" variant — see the
// `applyCard` loading branch in HomeScreen. Sized like the primary card so
// there's no layout jump once the real content resolves.
function LoadingActionCard({ style }: { style?: any }) {
  return (
    <View style={[card, styles.primaryCard, styles.loadingCard, style]}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}

// Like ActionCard, but offers three level-specific CTAs (A1/A2/B1) instead
// of one — the recommended level (see inferDefaultLevel in level.ts) is
// styled as the primary/filled button, the other two stay secondary/
// outlined so a user whose situation doesn't match the guess can still pick
// for themselves.
function EnglishPrepCard({
  recommendedLevel,
  onSelectLevel,
  style,
}: {
  recommendedLevel: CEFRLevel | null;
  onSelectLevel: (level: CEFRLevel) => void;
  style?: any;
}) {
  return (
    <View style={[card, styles.secondaryCard, style]}>
      <View style={styles.secondaryIconBadge}>
        <Icon name="award" size={18} color={colors.primary} />
      </View>
      <Text style={styles.secondaryCardTitle}>Preparing for your IELTS Life Skills test?</Text>
      <Text style={styles.cardDescription}>
        Lessons, mock tests, listening practice and a daily streak tracker for A1, A2, or B1 — whichever stage your
        visa needs.
      </Text>
      <View style={styles.levelButtonRow}>
        {CEFR_LEVELS.map((lvl) => {
          const recommended = lvl === recommendedLevel;
          return (
            <Pressable
              key={lvl}
              onPress={() => onSelectLevel(lvl)}
              accessibilityLabel={
                recommended ? `${LEVEL_FULL_LABELS[lvl]} (recommended for you)` : LEVEL_FULL_LABELS[lvl]
              }
              style={({ hovered, pressed }: any) => [
                styles.levelButton,
                recommended ? styles.primaryButton : styles.secondaryButton,
                hovered && (recommended ? styles.primaryButtonHover : styles.secondaryButtonHover),
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text
                style={[
                  recommended ? styles.primaryButtonText : styles.secondaryButtonText,
                  styles.levelButtonText,
                ]}
              >
                {LEVEL_FULL_LABELS[lvl]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  content: { padding: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  hero: { alignItems: 'center', marginBottom: spacing.sm },
  title: { ...typography.pageTitle, fontSize: 19, color: colors.textSecondary, marginBottom: 2 },
  headline: {
    ...typography.pageTitle,
    fontSize: 25,
    textAlign: 'center',
    maxWidth: 620,
  },
  trustLineText: { ...typography.caption, textAlign: 'center', maxWidth: 480 },

  whyChoose: { marginTop: spacing.sm, gap: 6, alignItems: 'center' },
  whyChoosePoint: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md },

  grid: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.md, marginBottom: spacing.sm },
  gridItemPrimary: { flex: 1.6 },
  gridItem: { flex: 1 },

  howItWorks: { marginTop: spacing.xl, maxWidth: 560, alignSelf: 'center', width: '100%' },
  howItWorksTitle: { ...typography.sectionTitle, textAlign: 'center', marginBottom: spacing.md },
  howItWorksStep: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  howItWorksStepNumber: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howItWorksStepNumberText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  howItWorksStepTextGroup: { flex: 1 },
  howItWorksStepName: { ...typography.cardTitle, marginBottom: 2 },
  howItWorksStepBody: { ...typography.bodySecondary, fontSize: 13 },

  statusCard: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  statusText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  primaryCard: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingCard: { minHeight: 168, alignItems: 'center', justifyContent: 'center' },
  secondaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowOpacity: 0.03,
  },
  primaryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  secondaryIconBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  primaryCardTitle: { ...typography.sectionTitle, fontSize: 19 },
  secondaryCardTitle: { ...typography.sectionTitle, fontSize: 16 },
  cardKicker: { ...typography.label, color: colors.primary, marginBottom: 2 },
  cardDescription: { ...typography.bodySecondary, fontSize: 13, marginTop: 2, marginBottom: spacing.sm },

  primaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 11, alignItems: 'center' },
  primaryButtonHover: { backgroundColor: colors.primaryHover },
  primaryButtonPressed: { opacity: 0.9 },
  primaryButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 14 },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  secondaryButtonHover: { backgroundColor: colors.primarySurface },
  secondaryButtonText: { color: colors.primary, fontWeight: '600', fontSize: 14 },

  levelButtonRow: { flexDirection: 'row', gap: spacing.xs },
  levelButton: { flex: 1, padding: 10 },
  levelButtonText: { fontSize: 12.5, textAlign: 'center' },

  authLinks: { alignItems: 'center', marginTop: 0 },
  authLinkText: { fontSize: 14, color: colors.primary, fontWeight: '600', paddingVertical: 6 },
  guestLinkText: { fontSize: 13, color: colors.textTertiary, paddingVertical: 6, marginTop: 0 },

  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerText: { ...typography.caption, textAlign: 'center', maxWidth: 560 },
});
