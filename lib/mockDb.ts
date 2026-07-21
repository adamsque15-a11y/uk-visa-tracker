// DEV ONLY: fake local "database" used when signed in with the mock/dev
// test account (see devAuth.ts), so the full app flow — saving an
// application, listing it on the dashboard, checking off items — works
// without a real Supabase project. Persisted to AsyncStorage so it survives
// reloads. Remove this file and its usages before shipping.

import AsyncStorage from '@react-native-async-storage/async-storage';

export const MOCK_OWNER_ID = 'dev-test-user';

export interface MockApplication {
  id: string;
  owner_id: string;
  applicant_name: string;
  nationality: string;
  country_applying_from: string;
  visa_type: string;
  relationship_status?: string;
  children_count: number;
  income: number | null;
  income_country?: string;
  biometrics_date: string | null;
  application_location: 'outside_uk' | 'inside_uk' | null;
  service_speed: 'standard' | 'priority' | null;
  skip_checklist: boolean;
  created_at: string;
}

export interface MockChecklistItem {
  id: string;
  application_id: string;
  item_key: string;
  label: string;
  explanation: string;
  requirements: string[];
  examples: string[];
  common_mistakes: string[];
  is_complete: boolean;
}

export interface MockTimelineEvent {
  id: string;
  application_id: string;
  stage: string;
  completed: boolean;
  completed_date: string | null;
}

interface MockData {
  applications: MockApplication[];
  checklistItems: MockChecklistItem[];
  timelineEvents: MockTimelineEvent[];
}

const STORAGE_KEY = 'DEV_MOCK_DB_V1';

let data: MockData = { applications: [], checklistItems: [], timelineEvents: [] };
let loaded = false;

async function ensureLoaded() {
  if (loaded) return;
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) data = JSON.parse(raw);
  loaded = true;
}

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uuid() {
  return 'mock-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function mockListApplications(): Promise<MockApplication[]> {
  await ensureLoaded();
  return [...data.applications].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function mockCreateApplication(
  input: Omit<MockApplication, 'id' | 'created_at' | 'biometrics_date' | 'application_location' | 'service_speed'>
): Promise<MockApplication> {
  await ensureLoaded();
  const application: MockApplication = {
    ...input,
    id: uuid(),
    biometrics_date: null,
    application_location: null,
    service_speed: null,
    created_at: new Date().toISOString(),
  };
  data.applications.push(application);
  await persist();
  return application;
}

export async function mockGetApplication(id: string): Promise<MockApplication | undefined> {
  await ensureLoaded();
  return data.applications.find((a) => a.id === id);
}

export async function mockDeleteApplication(id: string) {
  await ensureLoaded();
  data.applications = data.applications.filter((a) => a.id !== id);
  data.checklistItems = data.checklistItems.filter((c) => c.application_id !== id);
  data.timelineEvents = data.timelineEvents.filter((e) => e.application_id !== id);
  await persist();
}

export async function mockUpdateApplication(id: string, updates: Partial<MockApplication>) {
  await ensureLoaded();
  data.applications = data.applications.map((a) => (a.id === id ? { ...a, ...updates } : a));
  await persist();
}

export async function mockInsertChecklistItems(
  items: {
    application_id: string;
    item_key: string;
    label: string;
    explanation: string;
    requirements: string[];
    examples: string[];
    common_mistakes: string[];
  }[]
) {
  await ensureLoaded();
  const rows: MockChecklistItem[] = items.map((item) => ({ ...item, id: uuid(), is_complete: false }));
  data.checklistItems.push(...rows);
  await persist();
  return rows;
}

export async function mockGetChecklistItems(applicationId: string): Promise<MockChecklistItem[]> {
  await ensureLoaded();
  return data.checklistItems.filter((c) => c.application_id === applicationId);
}

export async function mockUpdateChecklistItem(id: string, updates: Partial<MockChecklistItem>) {
  await ensureLoaded();
  data.checklistItems = data.checklistItems.map((c) => (c.id === id ? { ...c, ...updates } : c));
  await persist();
}

export async function mockInsertTimelineEvents(events: { application_id: string; stage: string; completed: boolean }[]) {
  await ensureLoaded();
  const rows: MockTimelineEvent[] = events.map((e) => ({ ...e, id: uuid(), completed_date: null }));
  data.timelineEvents.push(...rows);
  await persist();
  return rows;
}

export async function mockGetTimelineEvents(applicationId: string): Promise<MockTimelineEvent[]> {
  await ensureLoaded();
  return data.timelineEvents.filter((e) => e.application_id === applicationId);
}

export async function mockUpdateTimelineEvent(id: string, updates: Partial<MockTimelineEvent>) {
  await ensureLoaded();
  data.timelineEvents = data.timelineEvents.map((e) => (e.id === id ? { ...e, ...updates } : e));
  await persist();
}

/** Wipes all local mock data — used by "Delete my account"/"Clear my data" in guest/dev mode. */
export async function mockClearAll() {
  data = { applications: [], checklistItems: [], timelineEvents: [] };
  loaded = true;
  await persist();
}
