import { BankHolidayDivision, isKnownBankHoliday } from './bankHolidays';

// Most UK visa processing centres and the Home Office generally follow
// England-and-Wales bank holidays for these purposes, so that's the default
// division throughout this module unless a caller has a specific reason to
// pass a different one.
const DEFAULT_DIVISION: BankHolidayDivision = 'england-and-wales';

// Known limitation: applicants who selected "Outside the UK" may be
// physically in a country with its own public holidays that affect local
// processing steps (e.g. a visa application centre closed for a local
// holiday) — those aren't factored in here, only UK bank holidays are.
// Modelling per-country holidays is a future enhancement, not required now;
// UK bank holidays are still excluded consistently regardless of where the
// applicant applied from.

/**
 * Parses a "YYYY-MM-DD" string into a local-time Date, rejecting malformed
 * or non-existent dates (e.g. "2026-02-30"). Deliberately avoids `new
 * Date(string)`, which parses as UTC midnight and can shift the date by a
 * day depending on the user's timezone — the bug behind biometrics dates
 * looking off by one.
 */
export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** Formats a local Date as "YYYY-MM-DD" — the inverse of parseISODate. */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isBankHoliday(date: Date, division: BankHolidayDivision): boolean {
  return isKnownBankHoliday(date, division);
}

/** Counts UK working days between two dates (exclusive of start, inclusive of end). */
export function countWorkingDays(start: Date, end: Date, division: BankHolidayDivision = DEFAULT_DIVISION): number {
  let count = 0;
  const current = new Date(start);
  current.setDate(current.getDate() + 1);

  while (current <= end) {
    if (!isWeekend(current) && !isBankHoliday(current, division)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/** Adds N UK working days to a date, skipping weekends and bank holidays. */
export function addWorkingDays(start: Date, workingDays: number, division: BankHolidayDivision = DEFAULT_DIVISION): Date {
  const result = new Date(start);
  let added = 0;
  while (added < workingDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result) && !isBankHoliday(result, division)) {
      added++;
    }
  }
  return result;
}

export interface ProgressSummary {
  workingDaysPassed: number;
  calendarDaysPassed: number;
  currentWeek: number;
}

// A biometrics date in the future (booked but not yet attended) would
// otherwise produce negative "days since" figures — clamp at 0 so the
// summary reads as "not started yet" rather than nonsensical negative days.
export function getProgressSummary(
  biometricsDate: Date,
  today: Date = new Date(),
  division: BankHolidayDivision = DEFAULT_DIVISION
): ProgressSummary {
  const workingDaysPassed = Math.max(0, countWorkingDays(biometricsDate, today, division));
  const calendarDaysPassed = Math.max(
    0,
    Math.floor((today.getTime() - biometricsDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const currentWeek = Math.floor(workingDaysPassed / 5) + 1;

  return { workingDaysPassed, calendarDaysPassed, currentWeek };
}

/** True when a biometrics (or any milestone) date has actually occurred by `today`. */
export function hasDateOccurred(date: Date, today: Date = new Date()): boolean {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return date.getTime() <= todayMidnight.getTime();
}

/** Rough total-weeks span between biometrics and the estimated decision date, for "Week 8 of ~14" style progress context. */
export function estimateTotalWeeks(biometricsDate: Date, estimatedDecisionDate: Date): number {
  return Math.max(1, Math.round((estimatedDecisionDate.getTime() - biometricsDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
}

export const TIMELINE_STAGES = [
  { key: 'submitted', label: 'Application Submitted' },
  { key: 'biometrics', label: 'Biometrics' },
  { key: 'received', label: 'Application Received' },
  { key: 'processing', label: 'Processing' },
  { key: 'decision_made', label: 'Decision Made' },
] as const;

export function calculateProgressPercent(completedStages: string[]): number {
  return Math.round((completedStages.length / TIMELINE_STAGES.length) * 100);
}

/** Percent of a target processing window (in working days) used up so far, capped at 100. */
export function calculateTargetProgressPercent(workingDaysPassed: number, targetWorkingDays: number): number {
  return Math.min(100, Math.round((workingDaysPassed / targetWorkingDays) * 100));
}
