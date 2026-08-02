/**
 * Shared copy for the spouse/partner visa financial requirement (savings,
 * overseas income, and the UK job offer / Category B route). Used by both
 * the questionnaire's inline guidance (app/(tabs)/questionnaire.tsx) and
 * the "Financial evidence" / "Overseas income evidence" checklist items
 * (lib/visaLogic.ts), so the two stay in sync — edit the fact here once,
 * not in both places.
 *
 * General guidance based on Appendix FM-SE, not personalised legal advice
 * — always confirm current detail on GOV.UK or with a qualified adviser.
 */

export const SAVINGS_FORMULA =
  "The first £16,000 of savings is always disregarded. Above that, savings are converted using: (savings − £16,000) ÷ 2.5 = income equivalent. Savings must be held for at least 6 months before applying, in the applicant's, sponsor's, or their joint control.";

export const SAVINGS_EXAMPLE_ALONE =
  'Relying on savings alone, with no qualifying income: £16,000 + (£29,000 × 2.5) = £88,500 needed.';

export const SAVINGS_EXAMPLE_COMBINED =
  "Combining savings with some income — e.g. the sponsor earns £17,400/year (an £11,600 shortfall against £29,000) — savings needed to cover the gap: £16,000 + (£11,600 × 2.5) = £45,000.";

export const SAVINGS_HOLD_REINFORCEMENT =
  "Whatever total is calculated this way — for example, the £88,500 above — needs to have been held for the full 6 months before the application date, not just accumulated recently, and in the applicant's, sponsor's, or their joint control or name.";

export const SAVINGS_STOCKS_SHARES_NOTE =
  "Cash savings don't directly include stocks, bonds, or other investments. But if they're sold and held as cash for at least 6 months before applying, they can count — provided a portfolio report or other documentation from a regulated financial institution shows the prior value and confirms the liquidation. A stocks & shares ISA counts as a savings account for this purpose.";

export const SAVINGS_COMBINING_NOTE =
  "Savings can be combined between the sponsor and applicant, whether held separately or in a joint account — this applies regardless of whether the sponsor's income is from the UK or overseas.";

export const OVERSEAS_SALARY_EVIDENCE =
  "Standard evidence is still required — payslips and bank statements covering the 6 months before applying, plus an employer letter. But any document not already in English or Welsh needs a certified translation: a signed statement from the translator confirming it's accurate, dated, with their contact details. Machine translations (e.g. Google Translate) aren't accepted. The translation doesn't need to be notarised or done by a solicitor — it just needs to carry that certification statement.";

export const OVERSEAS_FOREIGN_BANK_NOTE =
  'If income or savings evidence comes from a foreign bank, the same 6-month statement requirement applies, and anything not already in English or Welsh needs the same certified translation treatment described above.';

export const CATEGORY_B_TITLE = 'UK job offer route (Category B)';

export const CATEGORY_B_EXPLANATION =
  "This applies when the sponsor has secured a confirmed job offer to start work in the UK — typically relevant when they're currently overseas and returning, or have been in a new UK job for less than 6 months. Evidence needed: a letter from the employer confirming gross annual salary and start date, or a signed employment contract — with the start date falling within 3 months of the applicant/sponsor's arrival or return to the UK.";

export const ENTRY_CLEARANCE_LIMITATION_NOTE =
  "Important: for entry clearance applications (applying from outside the UK), only the sponsor's employment income can be counted toward the requirement — the applicant's own overseas employment income can't be used. Savings, however, can still be combined from either the applicant, the sponsor, or both jointly, regardless of this limitation.";

export const FINANCIAL_REQUIREMENT_DISCLAIMER =
  'General guidance based on Appendix FM-SE, not personalised legal advice — always confirm current detail on GOV.UK or with a qualified adviser.';
