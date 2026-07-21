// "Download my data" — exports everything the app stores about the current
// user as a single JSON file. Deliberately includes the AsyncStorage-only
// stores (bookmarks, notification prefs, English Prep progress) alongside
// the Supabase-backed application data, since all of it is genuinely "their
// data" regardless of which store it lives in.
import { supabase } from './supabase';
import { isLocalModeActive } from './localMode';
import { mockListApplications, mockGetChecklistItems, mockGetTimelineEvents } from './mockDb';
import { loadBookmarks } from './bookmarks';
import { loadNotificationPrefs } from './notificationPrefs';
import { loadEnglishPrepProgress } from './englishPrep/progress';

async function collectApplicationsData() {
  if (isLocalModeActive()) {
    const applications = await mockListApplications();
    const checklistItems = [];
    const timelineEvents = [];
    for (const application of applications) {
      checklistItems.push(...(await mockGetChecklistItems(application.id)));
      timelineEvents.push(...(await mockGetTimelineEvents(application.id)));
    }
    return { profile: null, applications, checklistItems, timelineEvents };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { profile: null, applications: [], checklistItems: [], timelineEvents: [] };
  }

  const [{ data: profile }, { data: applications }] = await Promise.all([
    supabase.from('profiles').select('full_name, email, premium, created_at').eq('id', user.id).maybeSingle(),
    supabase.from('applications').select('*').eq('owner_id', user.id),
  ]);

  const applicationIds = (applications ?? []).map((application) => application.id);
  const [{ data: checklistItems }, { data: timelineEvents }] =
    applicationIds.length > 0
      ? await Promise.all([
          supabase.from('checklist_items').select('*').in('application_id', applicationIds),
          supabase.from('timeline_events').select('*').in('application_id', applicationIds),
        ])
      : [{ data: [] }, { data: [] }];

  return {
    profile: profile ?? null,
    applications: applications ?? [],
    checklistItems: checklistItems ?? [],
    timelineEvents: timelineEvents ?? [],
  };
}

/** Triggers a browser download of a JSON file containing all of the current user's data. Web only. */
export async function exportUserData(): Promise<void> {
  const [applicationsData, bookmarkIds, notificationPreferences, englishTestPrepProgress] = await Promise.all([
    collectApplicationsData(),
    loadBookmarks(),
    loadNotificationPrefs(),
    loadEnglishPrepProgress(),
  ]);

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    account: applicationsData.profile,
    applications: applicationsData.applications,
    checklistItems: applicationsData.checklistItems,
    timelineEvents: applicationsData.timelineEvents,
    savedVisaInfoBookmarks: Array.from(bookmarkIds),
    notificationPreferences,
    englishTestPrepProgress,
  };

  const json = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `uk-visa-tracker-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
