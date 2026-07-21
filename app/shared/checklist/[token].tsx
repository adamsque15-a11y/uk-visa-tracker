import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { fetchSharedChecklist, SharedChecklistData } from '../../../lib/checklistShare';
import {
  parseISODate,
  getProgressSummary,
  calculateTargetProgressPercent,
  addWorkingDays,
  TIMELINE_STAGES,
} from '../../../lib/workingDays';
import { getTargetProcessingDays, ApplicationLocation, ServiceSpeed, VisaType } from '../../../lib/visaLogic';
import { VISA_TYPE_ICON, formatVisaType } from '../../../lib/applicationStatus';
import Screen from '../../../components/Screen';
import Icon from '../../../components/Icon';
import Disclaimer from '../../../components/Disclaimer';
import { colors, radius, spacing, typography, card } from '../../../lib/theme';

const VALID_VISA_TYPES: VisaType[] = ['spouse', 'skilled_worker', 'student', 'visitor'];
const VALID_LOCATIONS: ApplicationLocation[] = ['outside_uk', 'inside_uk'];
const VALID_SPEEDS: ServiceSpeed[] = ['standard', 'priority'];

// Read-only, no-login-required summary of a Checklist's progress — reached
// via a token minted by set_application_share_token() (see
// lib/checklistShare.ts / lib/schema.sql). Fetched at runtime, not
// statically generated, since tokens are created on demand.
export default function SharedChecklistScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; data: SharedChecklistData | null }>({
    loading: true,
    data: null,
  });

  useEffect(() => {
    if (!token) return;
    fetchSharedChecklist(token).then((data) => setState({ loading: false, data }));
  }, [token]);

  if (state.loading) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.centeredContent}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!state.data) {
    return (
      <Screen style={styles.container} contentContainerStyle={styles.content}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Text style={styles.heading}>Link not available</Text>
        <Text style={styles.emptyText}>
          This shared checklist link may have been revoked, or the address is incomplete.
        </Text>
      </Screen>
    );
  }

  const { data } = state;
  const visaIcon = VISA_TYPE_ICON[data.visa_type] ?? 'file-text';
  const visaLabel = formatVisaType(data.visa_type);
  const parsedBiometricsDate = data.biometrics_date ? parseISODate(data.biometrics_date) : null;
  const summary = parsedBiometricsDate ? getProgressSummary(parsedBiometricsDate) : null;

  const isValidVisaType = VALID_VISA_TYPES.includes(data.visa_type as VisaType);
  const isValidLocation = VALID_LOCATIONS.includes(data.application_location as ApplicationLocation);
  const isValidSpeed = VALID_SPEEDS.includes(data.service_speed as ServiceSpeed);
  const targetWorkingDays =
    isValidVisaType && isValidLocation && isValidSpeed
      ? getTargetProcessingDays(data.visa_type as VisaType, data.application_location as ApplicationLocation, data.service_speed as ServiceSpeed)
      : null;
  const targetPercent =
    summary && targetWorkingDays ? calculateTargetProgressPercent(summary.workingDaysPassed, targetWorkingDays) : null;
  const estimatedDecisionDate =
    parsedBiometricsDate && targetWorkingDays ? addWorkingDays(parsedBiometricsDate, targetWorkingDays) : null;

  const completedCount = data.checklist_items.filter((i) => i.is_complete).length;

  return (
    <Screen style={styles.container} contentContainerStyle={styles.content} maxWidth={520}>
      <Head>
        <title>Shared Checklist | UK Visa Tracker</title>
        <meta name="robots" content="noindex" />
      </Head>

      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Icon name={visaIcon} size={20} color={colors.textOnPrimary} />
        </View>
        <View>
          <Text style={styles.kicker}>SHARED CHECKLIST</Text>
          <Text style={styles.heading}>{visaLabel}</Text>
        </View>
      </View>

      {summary && targetPercent !== null && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLine}>Week {summary.currentWeek}</Text>
          <Text style={styles.summarySubline}>
            {summary.workingDaysPassed} working days / {summary.calendarDaysPassed} calendar days since biometrics
          </Text>
          {estimatedDecisionDate && (
            <Text style={styles.summarySubline}>
              Expected decision around {estimatedDecisionDate.toDateString()}
            </Text>
          )}
          <View style={styles.targetBarTrack}>
            <View style={[styles.targetBarFill, { width: `${targetPercent}%` }]} />
          </View>
          <Text style={styles.targetBarLabel}>{targetPercent}% of target processing time used</Text>
          <Text style={styles.targetBarNote}>Excludes weekends and UK bank holidays</Text>
        </View>
      )}

      {data.checklist_items.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Checklist — {completedCount} of {data.checklist_items.length} collected
          </Text>
          {data.checklist_items.map((item, i) => (
            <View key={i} style={styles.checklistRow}>
              <Icon
                name={item.is_complete ? 'check-circle' : 'circle'}
                size={14}
                color={item.is_complete ? colors.success : colors.textTertiary}
              />
              <Text style={styles.checklistLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      )}

      {data.timeline_events.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {TIMELINE_STAGES.map((stage) => {
            const event = data.timeline_events.find((e) => e.stage === stage.key);
            return (
              <View key={stage.key} style={styles.checklistRow}>
                <Icon
                  name={event?.completed ? 'check-circle' : 'circle'}
                  size={14}
                  color={event?.completed ? colors.success : colors.textTertiary}
                />
                <Text style={styles.checklistLabel}>{stage.label}</Text>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/home')}>
        <Text style={styles.ctaButtonText}>Track your own visa application</Text>
        <Icon name="arrow-right" size={15} color={colors.textOnPrimary} />
      </TouchableOpacity>

      <View style={styles.disclaimerWrap}>
        <Disclaimer text="This is a shared summary from an independent tool — not affiliated with UKVI or the Home Office." />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { ...typography.label, color: colors.primary, marginBottom: 2 },
  heading: { ...typography.pageTitle, fontSize: 20 },
  emptyText: { ...typography.bodySecondary, marginTop: spacing.sm },

  summaryCard: { ...card, marginBottom: spacing.md },
  summaryLine: { ...typography.sectionTitle },
  summarySubline: { ...typography.bodySecondary, marginTop: 2 },
  targetBarTrack: { height: 8, backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden', marginTop: spacing.sm },
  targetBarFill: { height: 8, backgroundColor: colors.primary },
  targetBarLabel: { ...typography.caption, marginTop: spacing.xs },
  targetBarNote: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },

  sectionCard: { ...card, marginBottom: spacing.md },
  sectionTitle: { ...typography.sectionTitle, marginBottom: spacing.sm },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  checklistLabel: { ...typography.body },

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: spacing.lg,
  },
  ctaButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 15 },

  disclaimerWrap: { alignItems: 'center' },
});
