import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import {
  TIMELINE_STAGES,
  getProgressSummary,
  calculateProgressPercent,
  calculateTargetProgressPercent,
  parseISODate,
  formatISODate,
  addWorkingDays,
  hasDateOccurred,
} from '../../lib/workingDays';
import { loadBankHolidays } from '../../lib/bankHolidays';
import { ApplicationLocation, ServiceSpeed, VisaType, getTargetProcessingDays, REFUSAL_GUIDANCE } from '../../lib/visaLogic';
import { isLocalModeActive } from '../../lib/localMode';
import { getOrCreateShareToken } from '../../lib/checklistShare';
import { SITE_URL } from '../../lib/legalConfig';
import {
  mockListApplications,
  mockGetApplication,
  mockGetChecklistItems,
  mockGetTimelineEvents,
  mockUpdateApplication,
  mockUpdateChecklistItem,
  mockUpdateTimelineEvent,
} from '../../lib/mockDb';
import DatePicker from '../../components/DatePicker';
import Calendar from '../../components/Calendar';
import CountryPicker from '../../components/CountryPicker';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import SolicitorReferralCard from '../../components/SolicitorReferralCard';
import ShareButtons from '../../components/ShareButtons';
import AdviceBoundaryNotice from '../../components/AdviceBoundaryNotice';
import { colors } from '../../lib/theme';

interface ChecklistItem {
  id: string;
  item_key: string;
  label: string;
  explanation: string;
  requirements: string[];
  examples: string[];
  common_mistakes: string[];
  is_complete: boolean;
}

interface TimelineEvent {
  id: string;
  stage: string;
  completed: boolean;
  completed_date: string | null;
}

const STAGE_QUESTIONS: Record<string, string> = {
  submitted: 'Have you submitted your application?',
  biometrics: 'Have you completed biometrics?',
  received: 'Has the Home Office received your application?',
  processing: 'Is your application being processed?',
  decision_made: 'Have you received a decision?',
};

function formatStageDate(date: string | null): string {
  if (!date) return 'Not yet';
  const parsed = parseISODate(date);
  return parsed ? parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not yet';
}

const VISA_TYPE_LABELS: Record<VisaType, string> = {
  spouse: 'Spouse / Family Visa',
  skilled_worker: 'Skilled Worker Visa',
  student: 'Student Visa',
  visitor: 'Visitor Visa',
};

function formatVisaTypeLabel(type: VisaType): string {
  return VISA_TYPE_LABELS[type];
}

interface ApplicationSummary {
  id: string;
  applicant_name: string;
  visa_type: string;
}

export default function TimelineScreen() {
  const { applicationId, skipChecklist } = useLocalSearchParams<{ applicationId?: string; skipChecklist?: string }>();
  const router = useRouter();
  // Resolves which application to show when the route wasn't given one
  // (e.g. the sidebar's plain "Checklist" link) — auto-selects the user's
  // one application, or offers a picker when there's more than one.
  const [picker, setPicker] = useState<{ loading: boolean; applications: ApplicationSummary[] }>({
    loading: true,
    applications: [],
  });
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [applicationLocation, setApplicationLocation] = useState<ApplicationLocation | null>(null);
  const [countryApplyingFrom, setCountryApplyingFrom] = useState('');
  const [serviceSpeed, setServiceSpeed] = useState<ServiceSpeed | null>(null);
  const [biometricsDate, setBiometricsDate] = useState('');
  const [biometricsSaved, setBiometricsSaved] = useState(false);
  const [skipChecklistStored, setSkipChecklistStored] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [detailItem, setDetailItem] = useState<ChecklistItem | null>(null);
  const [stageModalEvent, setStageModalEvent] = useState<TimelineEvent | null>(null);
  const [stageYesNo, setStageYesNo] = useState<'yes' | 'no' | null>(null);
  const [stageShowCalendar, setStageShowCalendar] = useState(false);
  const [decisionOutcome, setDecisionOutcome] = useState<'approved' | 'refused' | null>(null);
  const [evisaExpanded, setEvisaExpanded] = useState(false);
  const [refusedExpanded, setRefusedExpanded] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Bank holidays load async (see lib/bankHolidays.ts); this just forces a
  // re-render once they're cached so the working-day figures below — which
  // read the cache synchronously — pick up the exclusions.
  const [, setBankHolidaysLoaded] = useState(false);
  useEffect(() => {
    loadBankHolidays().then(() => setBankHolidaysLoaded(true));
  }, []);

  // Mints (or fetches the existing) share token once per application, up
  // front — cheap enough not to bother deferring to the Share button's first
  // tap. Guest/local-mode applications never have a real Supabase row to
  // attach a token to, so this is skipped there (ShareButtons renders
  // disabled instead — see isLocalModeActive() below).
  useEffect(() => {
    if (!applicationId || isLocalModeActive()) return;
    getOrCreateShareToken(applicationId).then((token) => {
      if (token) setShareUrl(`${SITE_URL}/shared/checklist/${token}`);
    });
  }, [applicationId]);

  const load = useCallback(async () => {
    if (!applicationId) return;

    if (isLocalModeActive()) {
      const app = await mockGetApplication(applicationId);
      if (app?.biometrics_date) setBiometricsDate(app.biometrics_date);
      if (app?.visa_type) setVisaType(app.visa_type as VisaType);
      setApplicationLocation(app?.application_location ?? null);
      setCountryApplyingFrom(app?.country_applying_from ?? '');
      setServiceSpeed(app?.service_speed ?? null);
      setSkipChecklistStored(!!app?.skip_checklist);

      const checklistData = await mockGetChecklistItems(applicationId);
      setChecklist(checklistData);

      const eventData = await mockGetTimelineEvents(applicationId);
      const order = TIMELINE_STAGES.map((s) => s.key);
      eventData.sort((a, b) => order.indexOf(a.stage as any) - order.indexOf(b.stage as any));
      setEvents(eventData);
      return;
    }

    const { data: app } = await supabase
      .from('applications')
      .select('biometrics_date, visa_type, application_location, country_applying_from, service_speed, skip_checklist')
      .eq('id', applicationId)
      .single();
    if (app?.biometrics_date) setBiometricsDate(app.biometrics_date);
    if (app?.visa_type) setVisaType(app.visa_type as VisaType);
    setApplicationLocation(app?.application_location ?? null);
    setCountryApplyingFrom(app?.country_applying_from ?? '');
    setServiceSpeed(app?.service_speed ?? null);
    setSkipChecklistStored(!!app?.skip_checklist);

    const { data: checklistData } = await supabase
      .from('checklist_items')
      .select('id, item_key, label, explanation, requirements, examples, common_mistakes, is_complete')
      .eq('application_id', applicationId);
    if (checklistData) setChecklist(checklistData);

    const { data: eventData } = await supabase
      .from('timeline_events')
      .select('id, stage, completed, completed_date')
      .eq('application_id', applicationId);
    if (eventData) {
      const order = TIMELINE_STAGES.map((s) => s.key);
      eventData.sort((a, b) => order.indexOf(a.stage as any) - order.indexOf(b.stage as any));
      setEvents(eventData);
    }
  }, [applicationId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (applicationId) return;
    let cancelled = false;

    async function resolveApplication() {
      let applications: ApplicationSummary[];
      if (isLocalModeActive()) {
        applications = await mockListApplications();
      } else {
        const { data, error } = await supabase
          .from('applications')
          .select('id, applicant_name, visa_type')
          .order('created_at', { ascending: false });
        applications = !error && data ? data : [];
      }
      if (cancelled) return;

      if (applications.length === 1) {
        router.replace({ pathname: '/(tabs)/timeline', params: { applicationId: applications[0].id } });
        return;
      }
      setPicker({ loading: false, applications });
    }

    resolveApplication();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  async function toggleChecklistItem(item: ChecklistItem) {
    const updated = !item.is_complete;
    setChecklist((prev) => prev.map((c) => (c.id === item.id ? { ...c, is_complete: updated } : c)));
    if (isLocalModeActive()) {
      await mockUpdateChecklistItem(item.id, { is_complete: updated });
      return;
    }
    await supabase.from('checklist_items').update({ is_complete: updated }).eq('id', item.id);
  }

  async function setStageDate(event: TimelineEvent, date: string | null) {
    const completed = !!date;
    setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, completed, completed_date: date } : e)));
    if (isLocalModeActive()) {
      await mockUpdateTimelineEvent(event.id, { completed, completed_date: date });
      return;
    }
    await supabase.from('timeline_events').update({ completed, completed_date: date }).eq('id', event.id);
  }

  function openStageModal(event: TimelineEvent) {
    setStageModalEvent(event);
    setStageYesNo(event.completed ? 'yes' : null);
    setStageShowCalendar(false);
  }

  function closeStageModal() {
    setStageModalEvent(null);
    setStageYesNo(null);
    setStageShowCalendar(false);
  }

  function applyStageDate(date: string) {
    if (stageModalEvent) setStageDate(stageModalEvent, date);
    closeStageModal();
  }

  function applyStageNo() {
    if (stageModalEvent) setStageDate(stageModalEvent, null);
    closeStageModal();
  }

  // Keeps the "Progress" timeline (events, independently confirmed per
  // stage) consistent with the biometrics date entered above it — without
  // this, the summary card could show weeks of elapsed time while Progress
  // below still read "Not yet" for both Submitted and Biometrics.
  //
  // 'biometrics' is a direct 1:1 mirror of this field: it's marked complete
  // (with this date) whenever the date has passed, and reverted if the date
  // is edited to be in the future. 'submitted' only gets auto-filled (using
  // this date as a best-available proxy, since this flow doesn't collect a
  // separate submission date) the first time — if the user already
  // confirmed a real submission date via its own stage row, that's left
  // alone rather than overwritten.
  async function syncEventsWithBiometricsDate(dateStr: string) {
    const parsed = parseISODate(dateStr);
    if (!parsed) return;
    const occurred = hasDateOccurred(parsed);

    const biometricsEvent = events.find((e) => e.stage === 'biometrics');
    if (biometricsEvent) {
      await setStageDate(biometricsEvent, occurred ? dateStr : null);
    }

    const submittedEvent = events.find((e) => e.stage === 'submitted');
    if (occurred && submittedEvent && !submittedEvent.completed) {
      await setStageDate(submittedEvent, dateStr);
    }
  }

  async function saveBiometricsDate(date: string) {
    if (!applicationId) return;

    setBiometricsDate(date);
    setBiometricsSaved(false);

    if (isLocalModeActive()) {
      await mockUpdateApplication(applicationId, { biometrics_date: date });
    } else {
      await supabase.from('applications').update({ biometrics_date: date }).eq('id', applicationId);
    }
    await syncEventsWithBiometricsDate(date);
    setBiometricsSaved(true);
  }

  async function saveApplicationLocation(location: ApplicationLocation) {
    if (!applicationId) return;
    setApplicationLocation(location);
    if (isLocalModeActive()) {
      await mockUpdateApplication(applicationId, { application_location: location });
    } else {
      await supabase.from('applications').update({ application_location: location }).eq('id', applicationId);
    }
  }

  async function saveApplicationCountry(country: string) {
    if (!applicationId) return;
    setCountryApplyingFrom(country);
    if (isLocalModeActive()) {
      await mockUpdateApplication(applicationId, { country_applying_from: country });
    } else {
      await supabase.from('applications').update({ country_applying_from: country }).eq('id', applicationId);
    }
  }

  async function saveServiceSpeed(speed: ServiceSpeed) {
    if (!applicationId) return;
    setServiceSpeed(speed);
    if (isLocalModeActive()) {
      await mockUpdateApplication(applicationId, { service_speed: speed });
    } else {
      await supabase.from('applications').update({ service_speed: speed }).eq('id', applicationId);
    }
  }

  if (!applicationId) {
    if (picker.loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (picker.applications.length === 0) {
      return (
        <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
          <View style={styles.pickerEmptyState}>
            <Icon name="file-plus" size={28} color={colors.primary} />
            <Text style={styles.pickerEmptyTitle}>No applications yet</Text>
            <Text style={styles.pickerEmptyText}>Start an application to see its checklist and timeline here.</Text>
            <TouchableOpacity style={styles.pickerEmptyButton} onPress={() => router.push('/(tabs)/questionnaire')}>
              <Text style={styles.pickerEmptyButtonText}>Start New Application</Text>
            </TouchableOpacity>
          </View>
        </Screen>
      );
    }

    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.pickerHeading}>Choose an application</Text>
        <Text style={styles.pickerSubheading}>
          You have {picker.applications.length} applications — pick one to view its checklist and timeline.
        </Text>
        {picker.applications.map((app) => (
          <TouchableOpacity
            key={app.id}
            style={styles.pickerRow}
            onPress={() => router.replace({ pathname: '/(tabs)/timeline', params: { applicationId: app.id } })}
          >
            <Text style={styles.pickerRowName}>{app.applicant_name}</Text>
            <Text style={styles.pickerRowMeta}>{formatVisaTypeLabel(app.visa_type as VisaType)}</Text>
          </TouchableOpacity>
        ))}
      </Screen>
    );
  }

  const progressPercent = calculateProgressPercent(events.filter((e) => e.completed).map((e) => e.stage));
  const parsedBiometricsDate = biometricsDate ? parseISODate(biometricsDate) : null;
  const summary = parsedBiometricsDate ? getProgressSummary(parsedBiometricsDate) : null;
  const biometricsOccurred = parsedBiometricsDate ? hasDateOccurred(parsedBiometricsDate) : false;
  const allChecklistComplete = checklist.length > 0 && checklist.every((c) => c.is_complete);
  const hideChecklistSection = skipChecklistStored || skipChecklist === '1';
  const showTrackingSection = allChecklistComplete || hideChecklistSection;
  const completedCount = checklist.filter((c) => c.is_complete).length;

  const targetWorkingDays =
    visaType && applicationLocation && serviceSpeed
      ? getTargetProcessingDays(visaType, applicationLocation, serviceSpeed, countryApplyingFrom)
      : null;
  const estimatedDecisionDate =
    parsedBiometricsDate && targetWorkingDays ? addWorkingDays(parsedBiometricsDate, targetWorkingDays) : null;
  const targetPercent =
    summary && targetWorkingDays ? calculateTargetProgressPercent(summary.workingDaysPassed, targetWorkingDays) : null;

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.adviceNoticeWrap}>
        <AdviceBoundaryNotice />
      </View>

      {!hideChecklistSection && (
        <>
          <Text style={styles.sectionTitle}>Personal documents</Text>
          <Text style={styles.checklistCount}>
            {completedCount} of {checklist.length} collected — tap a document to see what you need
          </Text>
          {checklist.map((item) => (
            <TouchableOpacity key={item.id} style={styles.stageRow} onPress={() => setDetailItem(item)}>
              {item.is_complete && <Icon name="check-circle" size={18} color={colors.success} style={styles.statusIcon} />}
              <Text style={[styles.stageLabel, item.is_complete && styles.stageLabelDone]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {showTrackingSection ? (
        <>
          <Text style={styles.sectionTitle}>Where did you apply from?</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionChip, applicationLocation === 'outside_uk' && styles.optionChipSelected]}
              onPress={() => saveApplicationLocation('outside_uk')}
            >
              <Text style={[styles.optionChipText, applicationLocation === 'outside_uk' && styles.optionChipTextSelected]}>
                Outside the UK
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionChip, applicationLocation === 'inside_uk' && styles.optionChipSelected]}
              onPress={() => saveApplicationLocation('inside_uk')}
            >
              <Text style={[styles.optionChipText, applicationLocation === 'inside_uk' && styles.optionChipTextSelected]}>
                Inside the UK
              </Text>
            </TouchableOpacity>
          </View>

          {applicationLocation === 'outside_uk' && (
            <>
              <Text style={styles.sectionTitle}>Which country are you applying from?</Text>
              <CountryPicker
                value={countryApplyingFrom}
                onChange={saveApplicationCountry}
                placeholder="Which country are you applying from?"
                error={!countryApplyingFrom}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Which service are you using?</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionChip, serviceSpeed === 'standard' && styles.optionChipSelected]}
              onPress={() => saveServiceSpeed('standard')}
            >
              <Text style={[styles.optionChipText, serviceSpeed === 'standard' && styles.optionChipTextSelected]}>
                Standard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionChip, serviceSpeed === 'priority' && styles.optionChipSelected]}
              onPress={() => saveServiceSpeed('priority')}
            >
              <Text style={[styles.optionChipText, serviceSpeed === 'priority' && styles.optionChipTextSelected]}>
                Priority
              </Text>
            </TouchableOpacity>
          </View>

          {applicationLocation && serviceSpeed && (
            <>
              <Text style={styles.sectionTitle}>Biometrics date</Text>
              <DatePicker value={biometricsDate} onChange={saveBiometricsDate} placeholder="Select your biometrics date" />
              {biometricsSaved && <Text style={styles.dateSavedText}>Saved</Text>}

              {summary && (
                <View style={styles.summaryCard}>
                  {biometricsOccurred ? (
                    <>
                      <Text style={styles.summaryLine}>Week {summary.currentWeek}</Text>
                      <Text style={styles.summarySubline}>
                        {summary.workingDaysPassed} working days / {summary.calendarDaysPassed} calendar days since biometrics
                      </Text>
                      {estimatedDecisionDate && (
                        <Text style={styles.summarySubline}>
                          Expected decision around {estimatedDecisionDate.toDateString()}
                          {serviceSpeed === 'priority' ? ' (priority service)' : ''}
                        </Text>
                      )}
                      {targetPercent !== null && (
                        <>
                          <View style={styles.targetBarTrack}>
                            <View style={[styles.targetBarFill, { width: `${targetPercent}%` }]} />
                          </View>
                          <Text style={styles.targetBarLabel}>{targetPercent}% of target processing time used</Text>
                          <Text style={styles.targetBarNote}>Excludes weekends and UK bank holidays</Text>
                        </>
                      )}
                    </>
                  ) : (
                    // Biometrics hasn't happened yet — no elapsed-time stats to
                    // show, so this deliberately doesn't render Week/working-day
                    // figures that Progress below would contradict.
                    <Text style={styles.summaryLine}>
                      Biometrics scheduled for {parsedBiometricsDate?.toDateString()}
                    </Text>
                  )}
                </View>
              )}

              {summary && (
                <TouchableOpacity style={styles.dashboardCtaButton} onPress={() => router.push('/(tabs)')}>
                  <Text style={styles.dashboardCtaButtonText}>View My Dashboard</Text>
                  <Icon name="arrow-right" size={16} color={colors.textOnPrimary} />
                </TouchableOpacity>
              )}

              {summary && (isLocalModeActive() || shareUrl) && (
                <ShareButtons
                  url={shareUrl ?? ''}
                  title="My UK visa checklist progress"
                  context="checklist"
                  disabled={isLocalModeActive()}
                  disabledReason="Sign in with an account to get a shareable link (guest checklists can't be shared)."
                />
              )}
            </>
          )}

          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progressPercent}% complete</Text>

          <View style={{ marginTop: 12 }}>
            {events
              .filter((event) => TIMELINE_STAGES.some((s) => s.key === event.stage))
              .map((event) => {
                const stageInfo = TIMELINE_STAGES.find((s) => s.key === event.stage);
                return (
                  <TouchableOpacity key={event.id} style={styles.stageDateRow} onPress={() => openStageModal(event)}>
                    <Text style={styles.stageDateLabel}>{stageInfo?.label ?? event.stage}</Text>
                    <View style={styles.stageDateValueRow}>
                      <Icon name="calendar" size={13} color={event.completed_date ? colors.primary : colors.textTertiary} />
                      <Text style={[styles.stageDateValue, event.completed_date && styles.stageDateValueSet]}>
                        {formatStageDate(event.completed_date)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>

        </>
      ) : (
        <View style={styles.lockedNotice}>
          <Text style={styles.lockedNoticeText}>
            Collect every document above to unlock your biometrics date and application progress tracker.
          </Text>
        </View>
      )}

      <View style={styles.evisaSection}>
        <Text style={styles.whatNextTitle}>What to do next</Text>
        <Text style={styles.whatNextSubtitle}>Was your application approved?</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.optionChip, styles.optionChipRow, decisionOutcome === 'approved' && styles.optionChipSelected]}
            onPress={() => setDecisionOutcome('approved')}
          >
            <Icon name="check-circle" size={14} color={decisionOutcome === 'approved' ? colors.textOnPrimary : colors.success} />
            <Text style={[styles.optionChipText, decisionOutcome === 'approved' && styles.optionChipTextSelected]}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionChip, styles.optionChipRow, decisionOutcome === 'refused' && styles.optionChipSelected]}
            onPress={() => setDecisionOutcome('refused')}
          >
            <Icon name="x-circle" size={14} color={decisionOutcome === 'refused' ? colors.textOnPrimary : colors.danger} />
            <Text style={[styles.optionChipText, decisionOutcome === 'refused' && styles.optionChipTextSelected]}>Refused</Text>
          </TouchableOpacity>
        </View>

        {decisionOutcome === 'refused' && <SolicitorReferralCard context="timeline_refused" />}
      </View>

      {decisionOutcome === 'approved' && (
        <View style={styles.evisaSection}>
          <TouchableOpacity style={styles.evisaHeader} onPress={() => setEvisaExpanded((prev) => !prev)}>
            <Text style={styles.evisaHeaderTitle}>What to do next: Your eVisa</Text>
            <Text style={styles.evisaHeaderChevron}>{evisaExpanded ? '▾' : '▸'}</Text>
          </TouchableOpacity>

          {evisaExpanded && (
            <>
              <Text style={styles.evisaIntro}>
                Your UK immigration status is now stored digitally as an eVisa — there's no physical stamp or
                vignette sticker in your passport. Here's how to access it.
              </Text>

              <Text style={styles.evisaStepTitle}>1. Create or sign in to your UKVI account</Text>
              <Text style={styles.evisaStepText}>
                Use GOV.UK One Login to create a UKVI account, or sign in if you already made one during your
                application. You'll need the email address you applied with and the access code from your decision
                email or letter.
              </Text>

              <Text style={styles.evisaStepTitle}>2. Link your eVisa to your account</Text>
              <Text style={styles.evisaStepText}>
                Enter the passport number you used in your application to connect your eVisa to your account.
              </Text>

              <Text style={styles.evisaStepTitle}>3. Check your details are correct</Text>
              <Text style={styles.evisaStepText}>
                Review your name, date of birth, and visa conditions (e.g. work or study permissions, visa end
                date). Report any mistakes to UKVI straight away — errors can cause problems at border control or
                right-to-work checks.
              </Text>

              <Text style={styles.evisaStepTitle}>4. Generate a share code when you need to prove your status</Text>
              <Text style={styles.evisaStepText}>
                Example: starting a new job — generate a right-to-work share code and give it to your employer
                along with your date of birth.{'\n\n'}
                Example: renting a home — generate a right-to-rent share code for your landlord or letting agent.
                {'\n\n'}
                Example: travelling — airlines and border staff may ask for a share code to confirm your visa
                before you fly. Share codes usually expire after 30 days, so generate a fresh one each time.
              </Text>

              <Text style={styles.evisaStepTitle}>5. Keep your passport linked</Text>
              <Text style={styles.evisaStepText}>
                If you get a new passport, update it on your eVisa as soon as possible — an unlinked passport can
                cause delays when travelling to the UK.
              </Text>

              <Text style={styles.evisaLinksTitle}>Helpful GOV.UK links</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.uk/evisa')}>
                <Text style={styles.evisaLink}>gov.uk/evisa — get access to your eVisa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.uk/view-prove-immigration-status')}>
                <Text style={styles.evisaLink}>
                  gov.uk/view-prove-immigration-status — view and share your status
                </Text>
              </TouchableOpacity>

              <Text style={styles.evisaDisclaimer}>
                This is general guidance, not official advice. Always confirm current details on GOV.UK.
              </Text>
            </>
          )}
        </View>
      )}

      {decisionOutcome === 'refused' && visaType && (
        <View style={styles.evisaSection}>
          <TouchableOpacity style={styles.evisaHeader} onPress={() => setRefusedExpanded((prev) => !prev)}>
            <Text style={styles.evisaHeaderTitle}>What to do next: Refused</Text>
            <Text style={styles.evisaHeaderChevron}>{refusedExpanded ? '▾' : '▸'}</Text>
          </TouchableOpacity>

          {refusedExpanded && (
            <>
              <Text style={styles.evisaIntro}>
                A refusal isn't necessarily the end of the road — your decision letter will state the specific
                reasons the Home Office relied on, and those reasons determine what you can do next.
              </Text>

              <Text style={styles.evisaStepTitle}>Common reasons for refusal — {formatVisaTypeLabel(visaType)}</Text>
              {REFUSAL_GUIDANCE[visaType].commonReasons.map((reason, i) => (
                <Text key={i} style={styles.evisaStepText}>
                  • {reason}
                </Text>
              ))}

              <Text style={styles.evisaStepTitle}>What you can do next</Text>
              <Text style={styles.evisaStepText}>
                1. Read your decision letter carefully — it sets out the exact grounds for refusal, which decides
                which of the options below apply to you.{'\n\n'}
                2. Administrative Review — for eligible categories (mainly work and study routes), this checks for
                case-working errors only, not new evidence. Request it within 14 days if you're in the UK, or 28
                days if you're overseas. There's a fee, refunded if the review succeeds.{'\n\n'}
                3. Appeal — most points-based and family visa refusals don't carry a statutory right of appeal;
                this route is mainly available for human rights or protection (asylum) claims. Check your decision
                letter to see if you have appeal rights.{'\n\n'}
                4. Reapply — often the most practical option. Address every reason in the refusal letter directly
                and add the missing or stronger evidence before resubmitting.{'\n\n'}
                5. Get professional advice — for repeated refusals or complex cases, an OISC-regulated adviser or
                immigration solicitor can review your case. Serious errors of law can potentially be challenged by
                Judicial Review, but this is time-limited (usually within 3 months) and needs a solicitor.
              </Text>

              <Text style={styles.evisaStepTitle}>Example</Text>
              <Text style={styles.evisaStepText}>{REFUSAL_GUIDANCE[visaType].example}</Text>

              <Text style={styles.evisaLinksTitle}>Helpful GOV.UK links</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.uk/ask-for-an-administrative-review')}>
                <Text style={styles.evisaLink}>gov.uk/ask-for-an-administrative-review</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.uk/appeal-visa-immigration-decision')}>
                <Text style={styles.evisaLink}>gov.uk/appeal-visa-immigration-decision</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.uk/find-an-immigration-adviser')}>
                <Text style={styles.evisaLink}>gov.uk/find-an-immigration-adviser — find a regulated adviser</Text>
              </TouchableOpacity>

              <Text style={styles.evisaDisclaimer}>
                This is general guidance, not legal advice. Always read your own decision letter closely and check
                current details on GOV.UK — the options available depend on your specific visa route and the
                reasons given.
              </Text>
            </>
          )}
        </View>
      )}

      <Modal visible={!!detailItem} transparent animationType="fade" onRequestClose={() => setDetailItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{detailItem?.label}</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalExplanation}>{detailItem?.explanation}</Text>

              {!!detailItem?.requirements?.length && (
                <>
                  <Text style={styles.modalSectionTitle}>What's required</Text>
                  {detailItem.requirements.map((req, i) => (
                    <Text key={i} style={styles.modalListItem}>
                      • {req}
                    </Text>
                  ))}
                </>
              )}

              {!!detailItem?.examples?.length && (
                <>
                  <Text style={styles.modalSectionTitle}>Acceptable examples</Text>
                  {detailItem.examples.map((example, i) => (
                    <Text key={i} style={styles.modalListItem}>
                      • {example}
                    </Text>
                  ))}
                </>
              )}

              {!!detailItem?.common_mistakes?.length && (
                <>
                  <Text style={styles.modalSectionTitle}>Common mistakes to avoid</Text>
                  {detailItem.common_mistakes.map((mistake, i) => (
                    <Text key={i} style={styles.modalListItem}>
                      • {mistake}
                    </Text>
                  ))}
                </>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setDetailItem(null)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCompleteButton}
                onPress={() => {
                  if (detailItem) toggleChecklistItem(detailItem);
                  setDetailItem(null);
                }}
              >
                <Text style={styles.modalCompleteButtonText}>
                  {detailItem?.is_complete ? 'Mark as not collected' : 'Mark as collected'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!stageModalEvent} transparent animationType="fade" onRequestClose={closeStageModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {TIMELINE_STAGES.find((s) => s.key === stageModalEvent?.stage)?.label ?? stageModalEvent?.stage}
            </Text>
            <Text style={styles.modalExplanation}>
              {stageModalEvent ? STAGE_QUESTIONS[stageModalEvent.stage] ?? 'Has this stage been completed?' : ''}
            </Text>

            <View style={styles.radioRow}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setStageYesNo('yes')}>
                <View style={[styles.radioCircle, stageYesNo === 'yes' && styles.radioCircleSelected]} />
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={applyStageNo}>
                <View style={[styles.radioCircle, stageYesNo === 'no' && styles.radioCircleSelected]} />
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>

            {stageYesNo === 'yes' &&
              (stageShowCalendar ? (
                <Calendar value={stageModalEvent?.completed_date ?? ''} onChange={applyStageDate} />
              ) : (
                <View>
                  <TouchableOpacity style={styles.quickDateOption} onPress={() => applyStageDate(formatISODate(new Date()))}>
                    <Icon name="calendar" size={14} color={colors.primary} />
                    <Text style={styles.quickDateOptionText}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickDateOption}
                    onPress={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      applyStageDate(formatISODate(yesterday));
                    }}
                  >
                    <Icon name="calendar" size={14} color={colors.primary} />
                    <Text style={styles.quickDateOptionText}>Yesterday</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickDateOption} onPress={() => setStageShowCalendar(true)}>
                    <Icon name="calendar" size={14} color={colors.primary} />
                    <Text style={styles.quickDateOptionText}>Choose Date...</Text>
                  </TouchableOpacity>
                </View>
              ))}

            <TouchableOpacity style={styles.modalCloseButton} onPress={closeStageModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  adviceNoticeWrap: { marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },

  pickerEmptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  pickerEmptyTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 14, marginBottom: 6 },
  pickerEmptyText: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 20, marginBottom: 20, maxWidth: 300 },
  pickerEmptyButton: { backgroundColor: '#1a3c6e', borderRadius: 10, paddingVertical: 13, paddingHorizontal: 24 },
  pickerEmptyButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  pickerHeading: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 4 },
  pickerSubheading: { fontSize: 14, color: '#666', marginBottom: 20 },
  pickerRow: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  pickerRowName: { fontSize: 16, fontWeight: '700', color: '#222' },
  pickerRowMeta: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  dateSavedText: { color: '#2e7d32', fontSize: 13, marginTop: 8 },
  summaryCard: { backgroundColor: '#eef2f8', borderRadius: 12, padding: 16, marginTop: 16 },
  summaryLine: { fontSize: 18, fontWeight: '700', color: '#1a3c6e' },
  summarySubline: { fontSize: 13, color: '#444', marginTop: 4 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  optionChipRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  optionChipSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e' },
  optionChipText: { fontSize: 13, color: '#333' },
  optionChipTextSelected: { color: '#fff', fontWeight: '600' },
  targetBarTrack: { height: 6, backgroundColor: '#dde4ef', borderRadius: 4, overflow: 'hidden', marginTop: 12 },
  targetBarFill: { height: 6, backgroundColor: '#1a3c6e' },
  targetBarLabel: { fontSize: 12, color: '#444', marginTop: 4 },
  targetBarNote: { fontSize: 11, color: '#888', marginTop: 2 },
  dashboardCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 12,
  },
  dashboardCtaButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  progressBarTrack: { height: 10, backgroundColor: '#eee', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: 10, backgroundColor: '#1a3c6e' },
  progressLabel: { fontSize: 12, color: '#666', marginTop: 6 },
  stageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  statusIcon: { fontSize: 18, marginRight: 12 },
  stageLabel: { fontSize: 15 },
  stageLabelDone: { color: '#999', textDecorationLine: 'line-through' },
  stageDateRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  stageDateLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  stageDateValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  stageDateValue: { fontSize: 14, color: '#999' },
  stageDateValueSet: { color: '#1a3c6e', fontWeight: '500' },
  evisaSection: { backgroundColor: '#eef2f8', borderRadius: 14, padding: 18, marginTop: 20, marginBottom: 8 },
  whatNextTitle: { fontSize: 16, fontWeight: '700', color: '#1a3c6e' },
  whatNextSubtitle: { fontSize: 13, color: '#444', marginTop: 8, marginBottom: 8 },
  evisaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  evisaHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#1a3c6e' },
  evisaHeaderChevron: { fontSize: 16, color: '#1a3c6e', fontWeight: '700' },
  evisaIntro: { fontSize: 14, color: '#333', lineHeight: 20, marginTop: 14, marginBottom: 4 },
  evisaStepTitle: { fontSize: 14, fontWeight: '700', color: '#1a3c6e', marginTop: 16 },
  evisaStepText: { fontSize: 13, color: '#444', lineHeight: 19, marginTop: 4 },
  evisaLinksTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 6 },
  evisaLink: { fontSize: 13, color: '#1a3c6e', fontWeight: '600', textDecorationLine: 'underline', marginBottom: 8 },
  evisaDisclaimer: { fontSize: 11, color: '#777', lineHeight: 16, marginTop: 16 },
  radioRow: { flexDirection: 'row', marginTop: 16 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 28 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#1a3c6e', marginRight: 8 },
  radioCircleSelected: { backgroundColor: '#1a3c6e' },
  radioLabel: { fontSize: 15, color: '#333' },
  quickDateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  quickDateOptionText: { fontSize: 15, color: '#1a3c6e', fontWeight: '500' },
  checklistCount: { fontSize: 13, color: '#666', marginBottom: 6 },
  lockedNotice: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, marginTop: 24 },
  lockedNoticeText: { fontSize: 14, color: '#555', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, maxHeight: '80%', width: '100%', maxWidth: 420 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  modalScroll: { flexGrow: 0 },
  modalExplanation: { fontSize: 14, color: '#333', lineHeight: 20 },
  modalSectionTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 6 },
  modalListItem: { fontSize: 13, color: '#666', lineHeight: 19, marginBottom: 4 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  modalCloseButton: { paddingVertical: 10, paddingHorizontal: 16 },
  modalCloseButtonText: { fontSize: 15, fontWeight: '600', color: '#333' },
  modalCompleteButton: { backgroundColor: '#1a3c6e', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginLeft: 8 },
  modalCompleteButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
