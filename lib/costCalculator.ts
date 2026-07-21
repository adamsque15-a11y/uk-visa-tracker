/**
 * Cost calculator. Visa fee and IHS figures below match GOV.UK rates
 * effective 8 April 2026 (the Home Office's most recent immigration fee
 * update, an across-the-board ~6-7% rise) — verified directly against
 * gov.uk. Fees change periodically, so pull these from a config you can
 * update remotely (e.g. a Supabase table) rather than hardcoding for
 * production. Wire this into the "Immigration News" feature in Phase 2 to
 * auto-update. The remaining costs below (TB test, English test, translations,
 * solicitor) are rough estimates, not official fees — they vary by country,
 * provider, and case, so there's no single GOV.UK figure to pin them to.
 */

import { VisaType } from './visaLogic';

export interface CostInputs {
  visaType: VisaType;
  visaLengthYears: number; // affects IHS (Immigration Health Surcharge)
  needsTbTest: boolean;
  needsEnglishTest: boolean;
  needsPriorityService: boolean;
  needsTranslations: boolean;
  needsSolicitor: boolean;
  numberOfApplicants: number; // for family applications
}

// GOV.UK fees in GBP, effective 8 April 2026. Skilled Worker uses the
// standard (not Immigration Salary List) rate for a certificate of up to 3
// years — the calculator doesn't currently ask about salary-list status or
// sponsorship length, so this is the representative figure for that route.
const VISA_FEES: Record<VisaType, number> = {
  spouse: 2064,
  skilled_worker: 819,
  student: 558,
  visitor: 135,
};

// Students (and their dependants) pay a reduced IHS rate; visitors don't pay
// it at all (their visa is too short to qualify). Everyone else pays the
// standard rate.
const IHS_PER_YEAR: Record<VisaType, number> = {
  spouse: 1035,
  skilled_worker: 1035,
  student: 776,
  visitor: 0,
};

const TB_TEST_COST = 65;
const ENGLISH_TEST_COST = 150;
const PRIORITY_SERVICE_COST = 500;
const BIOMETRICS_COST = 19.2;
const COURIER_COST = 40;
const TRANSLATION_COST_ESTIMATE = 80; // per document, rough estimate
const SOLICITOR_COST_ESTIMATE = 1500; // rough estimate, varies widely

export interface CostBreakdown {
  visaFee: number;
  ihs: number;
  tbTest: number;
  englishTest: number;
  priorityService: number;
  translations: number;
  solicitor: number;
  biometrics: number;
  courier: number;
  total: number;
}

export function calculateCost(inputs: CostInputs): CostBreakdown {
  const multiplier = inputs.numberOfApplicants;

  const visaFee = VISA_FEES[inputs.visaType] * multiplier;
  const ihs = IHS_PER_YEAR[inputs.visaType] * inputs.visaLengthYears * multiplier;
  const tbTest = inputs.needsTbTest ? TB_TEST_COST * multiplier : 0;
  const englishTest = inputs.needsEnglishTest ? ENGLISH_TEST_COST * multiplier : 0;
  const priorityService = inputs.needsPriorityService ? PRIORITY_SERVICE_COST * multiplier : 0;
  const translations = inputs.needsTranslations ? TRANSLATION_COST_ESTIMATE * 2 * multiplier : 0; // assume ~2 docs
  const solicitor = inputs.needsSolicitor ? SOLICITOR_COST_ESTIMATE : 0; // typically flat, not per applicant
  const biometrics = BIOMETRICS_COST * multiplier;
  const courier = COURIER_COST * multiplier;

  const total =
    visaFee + ihs + tbTest + englishTest + priorityService + translations + solicitor + biometrics + courier;

  return { visaFee, ihs, tbTest, englishTest, priorityService, translations, solicitor, biometrics, courier, total };
}
