// Cost Calculator sharing needs no database — costs.tsx is 100% client-side
// (no Supabase reads, no application_id), so the whole breakdown can be
// reconstructed from a handful of primitive inputs encoded in the URL.
import { CostInputs } from './costCalculator';
import { VisaType } from './visaLogic';

export function buildCostShareUrl(inputs: CostInputs, siteUrl: string): string {
  const params = new URLSearchParams({
    visaType: inputs.visaType,
    visaLengthYears: String(inputs.visaLengthYears),
    numberOfApplicants: String(inputs.numberOfApplicants),
    tb: String(inputs.needsTbTest),
    english: String(inputs.needsEnglishTest),
    priority: String(inputs.needsPriorityService),
    translations: String(inputs.needsTranslations),
    solicitor: String(inputs.needsSolicitor),
  });
  return `${siteUrl}/shared/cost-summary?${params.toString()}`;
}

const VALID_VISA_TYPES: VisaType[] = ['spouse', 'skilled_worker', 'student', 'visitor'];

function isVisaType(value: string | undefined): value is VisaType {
  return !!value && (VALID_VISA_TYPES as string[]).includes(value);
}

/** Parses a shared cost-summary URL's query params back into CostInputs. Returns null if the params are missing/malformed. */
export function parseCostShareParams(params: Record<string, string | undefined>): CostInputs | null {
  if (!isVisaType(params.visaType)) return null;
  return {
    visaType: params.visaType,
    visaLengthYears: Number(params.visaLengthYears) || 0,
    numberOfApplicants: Number(params.numberOfApplicants) || 1,
    needsTbTest: params.tb === 'true',
    needsEnglishTest: params.english === 'true',
    needsPriorityService: params.priority === 'true',
    needsTranslations: params.translations === 'true',
    needsSolicitor: params.solicitor === 'true',
  };
}
