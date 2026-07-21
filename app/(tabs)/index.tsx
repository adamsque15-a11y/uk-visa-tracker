import { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet, RefreshControl, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Screen from '../../components/Screen';
import Icon, { IconName } from '../../components/Icon';
import { supabase } from '../../lib/supabase';
import {
  getProgressSummary,
  parseISODate,
  calculateTargetProgressPercent,
  calculateProgressPercent,
  addWorkingDays,
  estimateTotalWeeks,
  TIMELINE_STAGES,
} from '../../lib/workingDays';
import { loadBankHolidays } from '../../lib/bankHolidays';
import { ApplicationLocation, ServiceSpeed, VisaType, getTargetProcessingDays } from '../../lib/visaLogic';
import { isLocalModeActive } from '../../lib/localMode';
import {
  mockListApplications,
  mockDeleteApplication,
  mockGetChecklistItems,
  mockGetTimelineEvents,
} from '../../lib/mockDb';
import { COUNTRIES } from '../../lib/countries';
import { colors, radius, spacing, typography, card as cardToken } from '../../lib/theme';
import { VISA_TYPE_ICON, formatVisaType, getCurrentStatus } from '../../lib/applicationStatus';

interface Application {
  id: string;
  applicant_name: string;
  visa_type: string;
  country_applying_from: string | null;
  biometrics_date: string | null;
  application_location: ApplicationLocation | null;
  service_speed: ServiceSpeed | null;
  skip_checklist: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  is_complete: boolean;
}

interface TimelineEvent {
  id: string;
  stage: string;
  completed: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Muted by default since this deletes the user's actual visa-application
// data — only reads as a destructive red once you're actually hovering it.
function DeleteIconButton({
  onPress,
  accessibilityLabel,
  style,
}: {
  onPress: (e: any) => void;
  accessibilityLabel: string;
  style?: any;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      style={style}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name="trash-2" size={16} color={hovered ? colors.danger : colors.textTertiary} />
    </Pressable>
  );
}

export default function DashboardScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const router = useRouter();

  // Bank holidays load async (see lib/bankHolidays.ts); this just forces a
  // re-render once they're cached so the working-day figures below — which
  // read the cache synchronously — pick up the exclusions instead of
  // silently under-counting until some unrelated state change re-renders.
  const [, setBankHolidaysLoaded] = useState(false);
  useEffect(() => {
    loadBankHolidays().then(() => setBankHolidaysLoaded(true));
  }, []);

  const loadApplications = useCallback(async () => {
    let data: Application[];

    if (isLocalModeActive()) {
      data = await mockListApplications();
    } else {
      const { data: rows, error } = await supabase
        .from('applications')
        .select('id, applicant_name, visa_type, country_applying_from, biometrics_date, application_location, service_speed, skip_checklist')
        .order('created_at', { ascending: false });
      data = !error && rows ? rows : [];
    }

    setApplications(data);

    if (data.length === 1) {
      const applicationId = data[0].id;
      if (isLocalModeActive()) {
        setChecklist(await mockGetChecklistItems(applicationId));
        setEvents(await mockGetTimelineEvents(applicationId));
      } else {
        const [{ data: checklistData }, { data: eventData }] = await Promise.all([
          supabase.from('checklist_items').select('id, label, is_complete').eq('application_id', applicationId),
          supabase.from('timeline_events').select('id, stage, completed').eq('application_id', applicationId),
        ]);
        setChecklist(checklistData ?? []);
        setEvents(eventData ?? []);
      }
    } else {
      setChecklist([]);
      setEvents([]);
    }

    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications])
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    if (isLocalModeActive()) {
      await mockDeleteApplication(deleteTarget.id);
    } else {
      await supabase.from('applications').delete().eq('id', deleteTarget.id);
    }
    setDeleteTarget(null);
    loadApplications();
  }

  function renderItem({ item }: { item: Application }) {
    const parsedBiometricsDate = item.biometrics_date ? parseISODate(item.biometrics_date) : null;
    const summary = parsedBiometricsDate ? getProgressSummary(parsedBiometricsDate) : null;
    const targetWorkingDays =
      item.application_location && item.service_speed
        ? getTargetProcessingDays(item.visa_type as VisaType, item.application_location, item.service_speed, item.country_applying_from)
        : null;
    const targetPercent =
      summary && targetWorkingDays ? calculateTargetProgressPercent(summary.workingDaysPassed, targetWorkingDays) : null;
    const estimatedDecisionDate =
      parsedBiometricsDate && targetWorkingDays ? addWorkingDays(parsedBiometricsDate, targetWorkingDays) : null;
    const totalWeeksEstimate =
      parsedBiometricsDate && estimatedDecisionDate ? estimateTotalWeeks(parsedBiometricsDate, estimatedDecisionDate) : null;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/timeline', params: { applicationId: item.id } })}>
          <Text style={styles.cardName}>{item.applicant_name}</Text>
          <Text style={styles.cardVisaType}>{formatVisaType(item.visa_type)}</Text>
          {summary ? (
            <>
              <Text style={styles.cardProgress}>
                Week {summary.currentWeek}
                {totalWeeksEstimate ? ` of ~${totalWeeksEstimate}` : ''} · {summary.workingDaysPassed} working days since biometrics
              </Text>
              {targetPercent !== null && (
                <>
                  <View style={styles.cardProgressBarTrack}>
                    <View style={[styles.cardProgressBarFill, { width: `${targetPercent}%` }]} />
                  </View>
                  <Text style={styles.cardProgressBarLabel}>
                    {targetPercent}% of {targetWorkingDays}-working-day target
                    {item.service_speed === 'priority' ? ' (priority service)' : ''}
                  </Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.cardProgress}>Biometrics date not set yet</Text>
          )}
        </TouchableOpacity>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cardActionButton}
            accessibilityLabel="Edit application"
            onPress={(e) => {
              e.stopPropagation();
              router.push({ pathname: '/(tabs)/questionnaire', params: { applicationId: item.id } });
            }}
          >
            <Icon name="edit-2" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <DeleteIconButton
            style={styles.cardActionButton}
            accessibilityLabel="Delete application"
            onPress={(e) => {
              e.stopPropagation();
              setDeleteTarget(item);
            }}
          />
        </View>
      </View>
    );
  }

  function renderSingleApplication(application: Application) {
    const visaIcon = VISA_TYPE_ICON[application.visa_type] ?? 'file-text';
    const visaLabel = formatVisaType(application.visa_type);
    const allChecklistComplete = checklist.length > 0 && checklist.every((c) => c.is_complete);
    const trackingUnlocked = application.skip_checklist || allChecklistComplete;
    const completedCount = checklist.filter((c) => c.is_complete).length;

    const editApplication = () =>
      router.push({ pathname: '/(tabs)/questionnaire', params: { applicationId: application.id } });
    const openTimeline = () =>
      router.push({ pathname: '/(tabs)/timeline', params: { applicationId: application.id } });
    const deleteApplication = () => setDeleteTarget(application);

    if (!trackingUnlocked) {
      const checklistProgress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
      const nextItem = checklist.find((c) => !c.is_complete);

      return (
        <Screen contentContainerStyle={styles.singleAppContent} maxWidth={720}>
          <Text style={styles.greeting}>
            {getGreeting()}, {application.applicant_name}
          </Text>

          <View style={styles.journeyCard}>
            <View style={styles.journeyCardHeader}>
              <Text style={styles.journeyCardTitle}>Your Visa Journey</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={editApplication} accessibilityLabel="Edit application">
                  <Icon name="edit-2" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <DeleteIconButton onPress={deleteApplication} accessibilityLabel="Delete application" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Visa Type</Text>
            <View style={styles.fieldValueRow}>
              <Icon name={visaIcon} size={15} color={colors.textPrimary} />
              <Text style={styles.fieldValue}>{visaLabel}</Text>
            </View>

            <Text style={styles.fieldLabel}>Progress</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${checklistProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentText}>{checklistProgress}%</Text>

            {nextItem && (
              <>
                <Text style={styles.fieldLabel}>Next Step</Text>
                <Text style={styles.fieldValue}>Complete your {nextItem.label}</Text>
              </>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={openTimeline}>
              <Text style={styles.primaryButtonText}>Continue Application</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionCardTitle}>Checklist</Text>
            {checklist.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.checklistPreviewRow}>
                <Icon name={item.is_complete ? 'check-circle' : 'circle'} size={14} color={item.is_complete ? colors.success : colors.textTertiary} />
                <Text style={styles.checklistPreviewText}>{item.label}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={openTimeline} style={styles.viewLinkRow}>
              <Text style={styles.viewLinkText}>View Checklist</Text>
              <Icon name="arrow-right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Screen>
      );
    }

    const parsedBiometricsDate = application.biometrics_date ? parseISODate(application.biometrics_date) : null;
    const summary = parsedBiometricsDate ? getProgressSummary(parsedBiometricsDate) : null;
    const targetWorkingDays =
      application.application_location && application.service_speed
        ? getTargetProcessingDays(application.visa_type as VisaType, application.application_location, application.service_speed, application.country_applying_from)
        : null;
    const targetPercent =
      summary && targetWorkingDays ? calculateTargetProgressPercent(summary.workingDaysPassed, targetWorkingDays) : null;
    const estimatedDecisionDate =
      parsedBiometricsDate && targetWorkingDays ? addWorkingDays(parsedBiometricsDate, targetWorkingDays) : null;
    const totalWeeksEstimate =
      parsedBiometricsDate && estimatedDecisionDate ? estimateTotalWeeks(parsedBiometricsDate, estimatedDecisionDate) : null;
    const status = getCurrentStatus(events);
    const appliedFromFlag = application.country_applying_from
      ? COUNTRIES.find((c) => c.name === application.country_applying_from)?.flag
      : null;
    const nextStageIndex = TIMELINE_STAGES.findIndex(
      (s) => !events.find((e) => e.stage === s.key)?.completed
    );

    return (
      <Screen contentContainerStyle={styles.singleAppContent} maxWidth={720}>
        <Text style={styles.greeting}>
          {getGreeting()}, {application.applicant_name}
        </Text>

        <View style={styles.journeyCard}>
          <View style={styles.journeyCardHeader}>
            <Text style={styles.journeyCardTitle}>Application Status</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={editApplication} accessibilityLabel="Edit application">
                <Icon name="edit-2" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <DeleteIconButton onPress={deleteApplication} accessibilityLabel="Delete application" />
            </View>
          </View>

          <View style={styles.fieldValueRow}>
            <Icon name={visaIcon} size={15} color={colors.textPrimary} />
            <Text style={styles.fieldValue}>{visaLabel}</Text>
          </View>

          {!!application.country_applying_from && (
            <>
              <Text style={styles.fieldLabel}>Applied from</Text>
              <Text style={styles.fieldValue}>
                {application.country_applying_from} {appliedFromFlag ?? ''}
              </Text>
            </>
          )}

          <Text style={styles.fieldLabel}>Biometrics</Text>
          <Text style={styles.fieldValue}>
            {parsedBiometricsDate
              ? parsedBiometricsDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Not set yet'}
          </Text>

          <Text style={styles.fieldLabel}>Current Status</Text>
          <View style={styles.fieldValueRow}>
            <Icon name={status.icon} size={15} color={colors.textPrimary} />
            <Text style={styles.fieldValue}>{status.label}</Text>
          </View>

          {summary && targetPercent !== null && (
            <>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${targetPercent}%` }]} />
              </View>
              <Text style={styles.progressPercentText}>
                Week {summary.currentWeek}
                {totalWeeksEstimate ? ` of ~${totalWeeksEstimate}` : ''}
              </Text>
              <Text style={styles.progressDaysText}>
                {summary.workingDaysPassed} working days / {summary.calendarDaysPassed} calendar days since biometrics
              </Text>
              <Text style={styles.progressNoteText}>Excludes weekends and UK bank holidays</Text>
            </>
          )}

          {estimatedDecisionDate && (
            <>
              <Text style={styles.fieldLabel}>Estimated Decision By</Text>
              <Text style={styles.fieldValue}>
                {estimatedDecisionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <Text style={styles.progressNoteText}>Based on the published target for this route — not a guarantee</Text>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>Timeline</Text>
          {TIMELINE_STAGES.map((stage, i) => {
            const event = events.find((e) => e.stage === stage.key);
            const stageIcon: IconName = event?.completed ? 'check-circle' : i === nextStageIndex ? 'clock' : 'circle';
            const stageColor = event?.completed ? colors.success : i === nextStageIndex ? colors.primary : colors.textTertiary;
            return (
              <View key={stage.key} style={styles.checklistPreviewRow}>
                <Icon name={stageIcon} size={14} color={stageColor} />
                <Text style={styles.checklistPreviewText}>{stage.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>Quick Actions</Text>
          <TouchableOpacity onPress={openTimeline} style={styles.quickActionRow}>
            <Icon name="calendar" size={15} color={colors.primary} />
            <Text style={styles.viewLinkText}>Update Status</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openTimeline} style={[styles.quickActionRow, { marginTop: spacing.sm }]}>
            <Icon name="file-text" size={15} color={colors.primary} />
            <Text style={styles.viewLinkText}>Checklist</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      {applications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBadge}>
            <Icon name="file-plus" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No applications yet</Text>
          <Text style={styles.emptySubtitle}>Start a new application to get your personalised checklist and timeline.</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/(tabs)/questionnaire')}>
            <Text style={styles.ctaButtonText}>Start New Application</Text>
          </TouchableOpacity>
        </View>
      ) : applications.length === 1 ? (
        renderSingleApplication(applications[0])
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadApplications(); }} />}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/questionnaire')} accessibilityLabel="Start new application">
        <Icon name="plus" size={24} color={colors.textOnPrimary} />
      </TouchableOpacity>

      <Modal visible={!!deleteTarget} transparent animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete application?</Text>
            <Text style={styles.modalMessage}>
              This will permanently delete {deleteTarget?.applicant_name}'s application, checklist, and timeline.
              This can't be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteButton} onPress={confirmDelete}>
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle },
  listContent: { padding: spacing.md, maxWidth: 720, width: '100%', alignSelf: 'center' },
  card: { ...cardToken, marginBottom: spacing.sm, padding: spacing.md },
  cardName: { ...typography.sectionTitle, fontSize: 17 },
  cardVisaType: { ...typography.bodySecondary, marginTop: 2 },
  cardProgress: { fontSize: 13, color: colors.primary, marginTop: spacing.sm, fontWeight: '500' },
  cardProgressBarTrack: { height: 6, backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden', marginTop: spacing.sm },
  cardProgressBarFill: { height: 6, backgroundColor: colors.primary },
  cardProgressBarLabel: { ...typography.caption, marginTop: spacing.xs },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardActionButton: { marginLeft: spacing.md, padding: spacing.xs },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyIconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { ...typography.sectionTitle, fontSize: 19, marginBottom: spacing.xs },
  emptySubtitle: { ...typography.bodySecondary, textAlign: 'center', marginBottom: spacing.lg, maxWidth: 320 },
  ctaButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: spacing.lg },
  ctaButtonText: { color: colors.textOnPrimary, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101828',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(16,24,40,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modalCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 420 },
  modalTitle: { ...typography.sectionTitle, marginBottom: spacing.xs },
  modalMessage: { ...typography.bodySecondary, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.lg },
  modalCancelButton: { paddingVertical: 10, paddingHorizontal: spacing.md },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  modalDeleteButton: { backgroundColor: colors.danger, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: spacing.md, marginLeft: spacing.xs },
  modalDeleteButtonText: { fontSize: 15, fontWeight: '600', color: colors.textOnPrimary },

  singleAppContent: { padding: spacing.lg, paddingBottom: 100 },
  greeting: { ...typography.pageTitle, fontSize: 22, marginBottom: spacing.md },
  journeyCard: { ...cardToken, marginBottom: spacing.md },
  journeyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  headerActions: { flexDirection: 'row', gap: spacing.md },
  journeyCardTitle: { ...typography.sectionTitle },
  fieldLabel: { ...typography.label, marginTop: spacing.md, textTransform: 'uppercase' },
  fieldValue: { fontSize: 16, color: colors.textPrimary, marginTop: spacing.xs },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  progressBarTrack: { height: 8, backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden', marginTop: spacing.sm },
  progressBarFill: { height: 8, backgroundColor: colors.primary },
  progressPercentText: { ...typography.caption, marginTop: spacing.xs },
  progressDaysText: { ...typography.caption, marginTop: 2 },
  progressNoteText: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, padding: 14, alignItems: 'center', marginTop: spacing.lg },
  primaryButtonText: { color: colors.textOnPrimary, fontWeight: '600', fontSize: 15 },
  sectionCard: { ...cardToken, marginBottom: spacing.md },
  sectionCardTitle: { ...typography.sectionTitle, fontSize: 16, marginBottom: spacing.sm },
  checklistPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  checklistPreviewText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  viewLinkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  viewLinkText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  quickActionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
