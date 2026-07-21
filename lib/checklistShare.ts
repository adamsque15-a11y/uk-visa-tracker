// Thin wrappers around the two Postgres RPC functions defined in
// lib/schema.sql (set_application_share_token / get_shared_checklist).
// Only meaningful against a real Supabase-backed application — see
// isLocalModeActive() gating at call sites, since guest/local-mode data
// never leaves the device and can't be resolved by anyone else's request.
import { supabase } from './supabase';

export interface SharedChecklistData {
  visa_type: string;
  application_location: string | null;
  service_speed: string | null;
  biometrics_date: string | null;
  checklist_items: { label: string; is_complete: boolean }[];
  timeline_events: { stage: string; completed: boolean; completed_date: string | null }[];
}

export async function getOrCreateShareToken(applicationId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('set_application_share_token', { p_application_id: applicationId });
  if (error) return null;
  return data as string;
}

export async function fetchSharedChecklist(token: string): Promise<SharedChecklistData | null> {
  const { data, error } = await supabase.rpc('get_shared_checklist', { p_token: token });
  if (error || !data) return null;
  return data as SharedChecklistData;
}
