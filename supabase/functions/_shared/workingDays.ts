// Deno port of lib/workingDays.ts + lib/bankHolidays.ts from the main app —
// duplicated rather than imported, since Edge Functions bundle
// independently of the Expo/RN app and can't reach into /lib at deploy
// time. Keep this in sync by hand if the working-day math changes there.
//
// No AsyncStorage cache here (not available in Deno) — bank holidays are
// fetched fresh on every invocation. Fine at once-daily cron frequency,
// since the feed itself only changes a few times a year.

const BANK_HOLIDAYS_URL = 'https://www.gov.uk/bank-holidays.json';

export async function loadBankHolidayDates(division = 'england-and-wales'): Promise<Set<string>> {
  try {
    const response = await fetch(BANK_HOLIDAYS_URL);
    const data = await response.json();
    const dates: string[] = data[division].events.map((event: { date: string }) => event.date);
    return new Set(dates);
  } catch {
    // Feed unreachable — degrade to weekends-only rather than fail the run.
    return new Set();
  }
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function addWorkingDays(start: Date, workingDays: number, holidays: Set<string>): Date {
  const result = new Date(start);
  let added = 0;
  while (added < workingDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result) && !holidays.has(toISODate(result))) {
      added++;
    }
  }
  return result;
}

/** Parses a "YYYY-MM-DD" string into a local-time Date. Mirrors lib/workingDays.ts's parseISODate. */
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

export function formatISODate(date: Date): string {
  return toISODate(date);
}
