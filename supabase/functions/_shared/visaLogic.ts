// Deno port of the one piece of lib/visaLogic.ts the reminder sweep needs —
// see the note in workingDays.ts about why this is duplicated, not imported.
// Keep PROCESSING_TIME_WORKING_DAYS in sync by hand with the main app.

export type VisaType = 'spouse' | 'skilled_worker' | 'student' | 'visitor';
export type ApplicationLocation = 'outside_uk' | 'inside_uk';
export type ServiceSpeed = 'standard' | 'priority';

const PROCESSING_TIME_WORKING_DAYS: Record<ApplicationLocation, Record<ServiceSpeed, Record<VisaType, number>>> = {
  outside_uk: {
    standard: { spouse: 60, skilled_worker: 15, student: 15, visitor: 15 },
    priority: { spouse: 30, skilled_worker: 5, student: 5, visitor: 5 },
  },
  inside_uk: {
    standard: { spouse: 40, skilled_worker: 40, student: 40, visitor: 40 },
    priority: { spouse: 1, skilled_worker: 5, student: 5, visitor: 5 },
  },
};

// Keep in sync by hand with the same table in lib/visaLogic.ts — empty for
// now, fill in as UKVI publishes per-post processing time data.
const COUNTRY_PROCESSING_OVERRIDES: Partial<Record<string, Partial<Record<ServiceSpeed, Partial<Record<VisaType, number>>>>>> = {};

export function getTargetProcessingDays(
  visaType: VisaType,
  location: ApplicationLocation,
  speed: ServiceSpeed,
  countryApplyingFrom?: string | null
): number {
  if (location === 'outside_uk' && countryApplyingFrom) {
    const override = COUNTRY_PROCESSING_OVERRIDES[countryApplyingFrom]?.[speed]?.[visaType];
    if (override !== undefined) return override;
  }
  return PROCESSING_TIME_WORKING_DAYS[location][speed][visaType];
}
