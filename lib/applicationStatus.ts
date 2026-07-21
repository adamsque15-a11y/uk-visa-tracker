import { IconName } from '../components/Icon';

// Shared by the Dashboard and the Home page so both describe an
// application's visa type and timeline progress identically.
export const VISA_TYPE_ICON: Record<string, IconName> = {
  spouse: 'heart',
  skilled_worker: 'briefcase',
  student: 'award',
  visitor: 'send',
};

export function formatVisaType(type: string): string {
  const map: Record<string, string> = {
    spouse: 'Spouse / Family Visa',
    skilled_worker: 'Skilled Worker Visa',
    student: 'Student Visa',
    visitor: 'Visitor Visa',
  };
  return map[type] ?? type;
}

export interface TimelineEventLike {
  stage: string;
  completed: boolean;
}

export function getCurrentStatus(events: TimelineEventLike[]): { icon: IconName; label: string } {
  const completed = new Set(events.filter((e) => e.completed).map((e) => e.stage));
  if (completed.has('decision_made')) return { icon: 'check-circle', label: 'Decision Made' };
  if (completed.has('processing')) return { icon: 'clock', label: 'Waiting for Decision' };
  if (completed.has('received')) return { icon: 'clock', label: 'Application Received' };
  if (completed.has('biometrics')) return { icon: 'clock', label: 'Waiting for Decision' };
  if (completed.has('submitted')) return { icon: 'clock', label: 'Application Submitted' };
  return { icon: 'circle', label: 'Not Started' };
}
