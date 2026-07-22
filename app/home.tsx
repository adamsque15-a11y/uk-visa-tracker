import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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
import { TIMELINE_STAGES } from '../lib/workingDays';
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

// Desktop-only richer version of the same pitch, shown as a 4-card grid
// rather than WHY_CHOOSE_POINTS' single inline trust line (which stays
// exactly as-is for mobile — kept as a separate list rather than just
// showing more of WHY_CHOOSE_POINTS so mobile's rendering can't shift if
// this one grows or changes). Every claim here is something already built
// and shipped elsewhere in this app, not aspirational copy.
const DESKTOP_FEATURE_HIGHLIGHTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'layers',
    title: 'Everything in one place',
    text: 'Checklist, cost calculator, timeline and English test prep — instead of juggling GOV.UK pages and forum threads.',
  },
  {
    icon: 'shield',
    title: 'Independent & unbiased',
    text: "Not affiliated with UKVI or the Home Office — just tools to help you track and prepare for your own application.",
  },
  {
    icon: 'bell',
    title: 'Proactive reminders',
    text: 'Email reminders as your biometrics appointment and estimated decision date approach, so nothing catches you off guard.',
  },
  {
    icon: 'award',
    title: 'IELTS Life Skills prep included',
    text: 'Lessons, mock tests and listening practice for A1, A2 and B1 — whichever level your visa route needs.',
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

// Scrolls a section into view on web — the app only ships as a web static
// export (see AGENTS.md), and react-native-web forwards View's ref to the
// underlying DOM node, so a plain scrollIntoView is simpler and more
// reliable here than computing offsets for ScrollView.scrollTo.
function scrollIntoView(ref: React.RefObject<View | null>) {
  (ref.current as unknown as HTMLElement | null)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
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

  // Desktop-only scroll targets: the nav's "Features" link and the hero's
  // "See how it works" CTA each jump to a different existing section rather
  // than sharing one target, since they're literally different things.
  const featuresRef = useRef<View>(null);
  const howItWorksRef = useRef<View>(null);

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
    <View style={styles.page}>
      {isDesktop && (
        <DesktopNav
          authenticated={authLoading ? null : authenticated}
          onLogoPress={() => router.push('/home')}
          onFeaturesPress={() => scrollIntoView(featuresRef)}
          onSignIn={handleSignIn}
          onTrack={handleTrack}
          onDashboard={handleGoToDashboard}
        />
      )}

      <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={1200}>
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

        {isDesktop ? (
          <DesktopHero onApply={handleApply} onSeeHowItWorks={() => scrollIntoView(howItWorksRef)} />
        ) : (
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
        )}

        {hasApplication && (
          <StatusCard applications={applications} events={events} onPress={handleGoToDashboard} />
        )}

        <View style={isDesktop ? styles.grid : undefined}>
          {applyCard}
          {trackCard}
          {englishPrepCard}
        </View>

        {isDesktop && (
          <View ref={featuresRef} style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>Why UK Visa Tracker</Text>
            <View style={styles.featuresGrid}>
              {DESKTOP_FEATURE_HIGHLIGHTS.map((point) => (
                <View key={point.title} style={styles.featureCard}>
                  <View style={styles.secondaryIconBadge}>
                    <Icon name={point.icon} size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.featureCardTitle}>{point.title}</Text>
                  <Text style={styles.featureCardText}>{point.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View ref={howItWorksRef} style={styles.howItWorks}>
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

        {isDesktop && <DesktopCtaBanner onTrack={handleTrack} />}

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
    </View>
  );
}

// Full-bleed top nav shown only at desktop widths — home.tsx is the one
// screen an unauthenticated visitor sees with no AppShell chrome at all
// (see _layout.tsx's showChrome), so unlike every other page this builds
// its own minimal nav rather than reusing TopBar, which assumes a signed-in
// account (avatar menu, hamburger drawer) that doesn't apply here.
// `authenticated: null` means useAuth() is still resolving — the buttons
// stay hidden rather than guessing, same principle as applyCard's loading
// branch above, so a visitor never sees the wrong pair of actions flash.
function DesktopNav({
  authenticated,
  onLogoPress,
  onFeaturesPress,
  onSignIn,
  onTrack,
  onDashboard,
}: {
  authenticated: boolean | null;
  onLogoPress: () => void;
  onFeaturesPress: () => void;
  onSignIn: () => void;
  onTrack: () => void;
  onDashboard: () => void;
}) {
  return (
    <View style={styles.nav}>
      <View style={styles.navInner}>
        <TouchableOpacity onPress={onLogoPress} accessibilityLabel="UK Visa Tracker home" style={styles.navLogo}>
          <Image source={require('../assets/images/logo-wordmark.png')} style={styles.navLogoImage} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.navLinks}>
          <TouchableOpacity onPress={onFeaturesPress}>
            <Text style={styles.navLinkText}>Features</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navActions}>
          {authenticated === null ? null : authenticated ? (
            <Pressable
              onPress={onDashboard}
              style={({ hovered }: any) => [styles.navPrimaryButton, hovered && styles.primaryButtonHover]}
            >
              <Text style={styles.navPrimaryButtonText}>Go to Dashboard</Text>
            </Pressable>
          ) : (
            <>
              <TouchableOpacity onPress={onSignIn}>
                <Text style={styles.navLinkText}>Sign in</Text>
              </TouchableOpacity>
              <Pressable
                onPress={onTrack}
                style={({ hovered }: any) => [styles.navPrimaryButton, hovered && styles.primaryButtonHover]}
              >
                <Text style={styles.navPrimaryButtonText}>Track my visa</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// Desktop-only two-column hero — mobile keeps its existing compact
// centered hero untouched (see the isDesktop ternary in HomeScreen). The
// right column is a static, non-interactive illustration of the app's own
// timeline UI (see TimelinePreviewCard) — not a claim about any real
// application, just a preview of what tracking looks like once you're in.
function DesktopHero({ onApply, onSeeHowItWorks }: { onApply: () => void; onSeeHowItWorks: () => void }) {
  return (
    <View style={styles.desktopHero}>
      <View style={styles.desktopHeroLeft}>
        <Disclaimer text="Independent & unaffiliated with UKVI or the Home Office" />
        <Text style={styles.desktopHeadline}>Know exactly where your UK visa application stands</Text>
        <Text style={styles.desktopSubcopy}>
          Get a personalised document checklist, track every stage from biometrics to decision, and see target
          processing times for your route — all in one place, kept up to date by you.
        </Text>
        <View style={styles.desktopHeroCtas}>
          <Pressable
            onPress={onApply}
            style={({ hovered, pressed }: any) => [
              styles.primaryButton,
              styles.desktopHeroPrimaryButton,
              hovered && styles.primaryButtonHover,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Get started free</Text>
          </Pressable>
          <TouchableOpacity onPress={onSeeHowItWorks} style={styles.desktopHeroSecondaryCta}>
            <Text style={styles.desktopHeroSecondaryCtaText}>See how it works</Text>
            <Icon name="arrow-right" size={15} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.desktopHeroFinePrint}>No account fees · Takes about 2 minutes</Text>
      </View>

      <View style={styles.desktopHeroRight}>
        <TimelinePreviewCard />
      </View>
    </View>
  );
}

// Static preview of the real Timeline screen's stage list (see
// TIMELINE_STAGES in lib/workingDays.ts, the same source of truth
// app/(tabs)/timeline.tsx and app/(tabs)/index.tsx use) — deliberately has
// no specific dates or applicant details, since it's illustrating the
// product's UI, not standing in for a real or fabricated user's data.
function TimelinePreviewCard() {
  const currentIndex = 2;
  return (
    <View style={[card, styles.previewCard]}>
      <View style={styles.previewCardHeader}>
        <Text style={styles.previewCardTitle}>Skilled Worker Visa</Text>
        <View style={styles.previewCardBadge}>
          <Text style={styles.previewCardBadgeText}>In progress</Text>
        </View>
      </View>
      {TIMELINE_STAGES.map((stage, i) => {
        const completed = i < currentIndex;
        const current = i === currentIndex;
        const icon: IconName = completed ? 'check-circle' : current ? 'clock' : 'circle';
        const color = completed ? colors.success : current ? colors.primary : colors.textTertiary;
        return (
          <View key={stage.key} style={styles.previewCardRow}>
            <Icon name={icon} size={16} color={color} />
            <Text style={[styles.previewCardRowText, current && styles.previewCardRowTextCurrent]}>{stage.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

// Bold closing CTA, desktop-only — copy is deliberately limited to claims
// this app can actually back up (no user counts, no "trusted by" logos).
function DesktopCtaBanner({ onTrack }: { onTrack: () => void }) {
  return (
    <View style={styles.ctaBanner}>
      <Text style={styles.ctaBannerTitle}>Stop guessing. Start tracking.</Text>
      <Text style={styles.ctaBannerSubtitle}>Free to use, no account fees, set up in about 2 minutes.</Text>
      <Pressable
        onPress={onTrack}
        style={({ hovered, pressed }: any) => [
          styles.ctaBannerButton,
          hovered && styles.ctaBannerButtonHover,
          pressed && styles.primaryButtonPressed,
        ]}
      >
        <Text style={styles.ctaBannerButtonText}>Track my visa free</Text>
      </Pressable>
    </View>
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
  page: { flex: 1, backgroundColor: colors.surfaceSubtle },
  container: { flex: 1 },
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

  // Desktop nav
  nav: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    height: 68,
  },
  navLogo: { flexDirection: 'row', alignItems: 'center' },
  navLogoImage: { width: 150, height: 32 },
  navLinks: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  navLinkText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  navPrimaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: spacing.md },
  navPrimaryButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 14 },

  // Desktop hero
  desktopHero: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxl, paddingVertical: spacing.xxl },
  desktopHeroLeft: { flex: 1 },
  desktopHeadline: { fontSize: 44, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.6, lineHeight: 50, marginTop: spacing.md, marginBottom: spacing.md },
  desktopSubcopy: { ...typography.body, fontSize: 16, color: colors.textSecondary, lineHeight: 24, maxWidth: 480, marginBottom: spacing.lg },
  desktopHeroCtas: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.sm },
  desktopHeroPrimaryButton: { paddingVertical: 14, paddingHorizontal: spacing.lg },
  desktopHeroSecondaryCta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  desktopHeroSecondaryCtaText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  desktopHeroFinePrint: { ...typography.caption, marginTop: spacing.xs },
  desktopHeroRight: { flex: 1, alignItems: 'center' },

  previewCard: { width: '100%', maxWidth: 380, padding: spacing.lg },
  previewCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  previewCardTitle: { ...typography.sectionTitle, fontSize: 16 },
  previewCardBadge: { backgroundColor: colors.successSurface, borderRadius: radius.pill, paddingVertical: 4, paddingHorizontal: spacing.sm },
  previewCardBadgeText: { fontSize: 12, fontWeight: '700', color: colors.success },
  previewCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  previewCardRowText: { fontSize: 14, color: colors.textSecondary },
  previewCardRowTextCurrent: { color: colors.textPrimary, fontWeight: '700' },

  // Desktop feature highlights
  featuresSection: { marginTop: spacing.xl, marginBottom: spacing.sm },
  featuresSectionTitle: { ...typography.pageTitle, fontSize: 28, textAlign: 'center', marginBottom: spacing.xl },
  featuresGrid: { flexDirection: 'row', gap: spacing.md },
  featureCard: { flex: 1, ...card, padding: spacing.md },
  featureCardTitle: { ...typography.sectionTitle, fontSize: 15, marginBottom: spacing.xs },
  featureCardText: { ...typography.bodySecondary, fontSize: 13 },

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

  // Desktop closing CTA banner
  ctaBanner: {
    marginTop: spacing.xxl,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  ctaBannerTitle: { fontSize: 30, fontWeight: '800', color: colors.textOnPrimary, textAlign: 'center', letterSpacing: -0.4 },
  ctaBannerSubtitle: { fontSize: 15, color: colors.textOnPrimary, opacity: 0.85, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  ctaBannerButton: { backgroundColor: colors.surface, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: spacing.lg },
  ctaBannerButtonHover: { backgroundColor: colors.surfaceSubtle },
  ctaBannerButtonText: { color: colors.primary, fontWeight: '700', fontSize: 15 },

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
