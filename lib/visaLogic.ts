/**
 * Route detection + checklist generation.
 *
 * Document guidance below is written to reflect current Home Office
 * requirements (Appendix FM / Appendix FM-SE for family routes, and the
 * Skilled Worker / Student / Standard Visitor guidance on gov.uk) as of
 * this file's last review. Immigration rules change often — re-check the
 * relevant gov.uk page before relying on this for a real application.
 *
 * IMPORTANT (regulatory note): keep this framed in the UI as general
 * informational guidance, not a legal determination of eligibility.
 * Suggested copy: "Documents commonly required for your situation —
 * always confirm against current GOV.UK guidance or a qualified adviser."
 */

export type VisaType = 'spouse' | 'skilled_worker' | 'student' | 'visitor';

export interface QuestionnaireAnswers {
  nationality: string;
  countryApplyingFrom: string;
  visaType: VisaType;
  relationshipStatus?: 'married' | 'engaged' | 'partner' | 'single';
  childrenCount: number;
  income?: number;
  incomeCountry?: 'uk' | 'overseas';
  hasSponsor: boolean;
  currentVisaStatus?: string;
}

// Minimum combined income requirement for spouse/partner visas. This is a
// flat threshold that does NOT increase per child — that per-child add-on
// was removed when the threshold rose to £29,000 on 11 April 2024. Verify
// against current GOV.UK guidance before relying on this for a real case.
export const SPOUSE_VISA_MINIMUM_INCOME_GBP = 29000;

// Student visa monthly maintenance figures for applications from 2 January
// 2025 onward, held for a consecutive 28-day period ending within 31 days
// of the application date. Source: gov.uk "Student visa: Money you need".
export const STUDENT_MAINTENANCE_LONDON_PER_MONTH_GBP = 1483;
export const STUDENT_MAINTENANCE_OUTSIDE_LONDON_PER_MONTH_GBP = 1136;

// Skilled Worker personal savings requirement when the sponsor does not
// certify maintenance on the Certificate of Sponsorship. Must be held
// continuously for 28 days, ending within 31 days of the application date.
export const SKILLED_WORKER_SAVINGS_REQUIREMENT_GBP = 1270;

export type ApplicationLocation = 'outside_uk' | 'inside_uk';
export type ServiceSpeed = 'standard' | 'priority';

// Home Office published service standard and priority-service processing
// targets, in working days, measured from the biometrics appointment date.
// Sources: gov.uk "Visa processing times: applications outside/inside the
// UK" (standard) and "Get a faster decision on your visa or settlement
// application" (priority). Note the asymmetry for spouse/family: priority
// from outside the UK targets 30 working days, but inside the UK the
// 5-working-day priority tier isn't offered for family applications — only
// next-working-day (modelled here as 1 working day). These are targets,
// not guarantees — re-check before relying on them for a real application.
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

// Country-specific processing time overrides (working days), keyed by the
// exact country name stored in applications.country_applying_from. Empty
// for now — fill in as UKVI publishes per-post processing time data. No
// schema change needed to add entries: this is a plain code table, same as
// PROCESSING_TIME_WORKING_DAYS above, just looked up first when present.
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

// Countries where 6+ months of residence in the last 6 months (if coming to
// the UK for 6+ months) triggers a mandatory TB test at a Home
// Office-approved clinic. Source: gov.uk "Tuberculosis tests for visa
// applicants" — this list changes periodically, re-check before relying on
// it for a real application.
export const TB_TEST_COUNTRIES = [
  'Afghanistan', 'Algeria', 'Angola', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Bhutan',
  'Bolivia', 'Botswana', 'Brunei', 'Burundi', 'Cambodia', 'Cameroon', 'Chad', "Côte d'Ivoire",
  'Democratic Republic of the Congo', 'Dominican Republic', 'Ecuador', 'Ethiopia', 'Gambia',
  'Georgia', 'Ghana', 'Guatemala', 'Guyana', 'Haiti', 'Hong Kong', 'India', 'Indonesia', 'Iraq',
  'Kazakhstan', 'Kenya', 'Laos', 'Madagascar', 'Malawi', 'Malaysia', 'Moldova', 'Mongolia',
  'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nepal', 'Nigeria', 'North Korea',
  'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Russia', 'Rwanda',
  'Senegal', 'Sierra Leone', 'Solomon Islands', 'South Africa', 'South Korea', 'Sri Lanka', 'Sudan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Turkmenistan', 'Uganda', 'Ukraine', 'Uzbekistan', 'Vanuatu',
  'Vietnam', 'Zambia', 'Zimbabwe',
];

export interface ChecklistItem {
  key: string;
  label: string;
  /** Short overview: what this document is and why it's required. */
  explanation: string;
  /** Specific rules — validity periods, amounts, formats, translation rules. */
  requirements: string[];
  /** Concrete examples of documents that satisfy this item. */
  examples: string[];
  commonMistakes: string[];
}

const CERTIFIED_TRANSLATION_RULE =
  'If the document isn’t in English or Welsh, include a full certified translation: the translator or translation company must confirm in writing that it’s accurate, and give their name, signature, contact details, and the date. UKVI does not require notarisation, but self-translation is not accepted.';

/**
 * Confirms which detailed sub-route applies based on answers.
 * This is intentionally simple rule-based logic for Phase 1 — no AI/LLM
 * call needed, which keeps this fast, free, and easy to reason about.
 */
export function detectRoute(answers: QuestionnaireAnswers): string {
  switch (answers.visaType) {
    case 'spouse':
      return answers.relationshipStatus === 'married'
        ? 'Spouse Visa (Married)'
        : answers.relationshipStatus === 'partner'
        ? 'Unmarried Partner Visa'
        : answers.relationshipStatus === 'engaged'
        ? 'Fiancé(e) Visa'
        : 'Family Visa (general)';
    case 'skilled_worker':
      return 'Skilled Worker Visa';
    case 'student':
      return 'Student Visa';
    case 'visitor':
      return 'Standard Visitor Visa';
    default:
      return 'Unknown route — please review answers';
  }
}

const BASE_ITEMS: Record<VisaType, ChecklistItem[]> = {
  spouse: [
    {
      key: 'passport',
      label: 'Passport',
      explanation:
        'Your current passport or other travel document proving your identity and nationality. This is how the Home Office confirms who you are and checks your travel history.',
      requirements: [
        'Must be valid — ideally not expiring soon, since a near-expiry passport can complicate the biometric residence process.',
        'Include any previous passports covering the last 10 years if you still have them, showing prior UK visits and visa history.',
        'The biographical data page and signature page must be clear and uncropped in any copies you submit.',
      ],
      examples: ['Current biometric passport photo page', 'Previous passport(s) with UK entry/exit stamps or visa vignettes'],
      commonMistakes: [
        'Passport expiring within 6 months',
        'Missing signature page',
        'Not including previous passports that show travel history',
      ],
    },
    {
      key: 'marriage_certificate',
      label: 'Marriage certificate',
      explanation:
        'Official proof the marriage or civil partnership is legally recognised in the country it took place. On its own this is not enough — the Home Office still expects separate relationship evidence showing the marriage is genuine (see below).',
      requirements: [
        'Submit the original certificate or an official certified copy — not a plain photocopy.',
        CERTIFIED_TRANSLATION_RULE,
        'Some countries’ certificates need to be apostilled or otherwise legalised before UKVI will accept them — check the process for the issuing country.',
      ],
      examples: [
        'UK marriage certificate (long form)',
        'Overseas civil marriage certificate plus certified English translation',
        'Civil partnership certificate',
      ],
      commonMistakes: [
        'Uncertified translation',
        'Certificate not apostilled/legalised where required',
        'Submitting only a photocopy with no original available for verification',
      ],
    },
    {
      key: 'financial_evidence',
      label: 'Financial evidence',
      explanation:
        `Proof the sponsor (or the couple together, under Appendix FM-SE’s specified evidence rules) meets the minimum income requirement — currently a flat £${SPOUSE_VISA_MINIMUM_INCOME_GBP.toLocaleString()}/year combined, regardless of how many children are included.`,
      requirements: [
        'Salaried employment: 6 months’ payslips + matching bank statements showing the salary being paid in, plus an employer letter on headed paper confirming role, salary, and length of employment.',
        'Self-employed: normally the latest full financial year’s tax return (SA302) or equivalent, an accountant’s letter, and business bank statements.',
        'Relying on savings: a specified minimum in cash savings held for at least 6 months, used to bridge any income shortfall.',
        'Overseas income is subject to stricter rules than UK income — see the separate overseas income item if this applies to you.',
      ],
      examples: [
        '6 months of payslips',
        'Matching personal bank statements',
        'Employer reference letter on headed paper',
        'SA302 tax calculation (self-employed)',
        'Savings account statements',
      ],
      commonMistakes: [
        'Bank statements with gaps',
        'Evidence covering the wrong 6-month window',
        'Payslip figures not matching the amounts paid into the bank account',
        'Missing employer letter',
      ],
    },
    {
      key: 'relationship_evidence',
      label: 'Relationship evidence',
      explanation:
        'Evidence the relationship is genuine and ongoing ("subsisting"), since caseworkers weigh the quality and volume of evidence — a certificate alone is not treated as sufficient proof.',
      requirements: [
        'Cover a substantial period of the relationship, not just a handful of recent items — ideally spanning multiple years where possible.',
        'Dated evidence is much stronger than undated screenshots.',
        'If you live together, include proof of cohabitation as well as proof of the relationship itself.',
      ],
      examples: [
        'Dated photos together at social events, with family and friends',
        'Message/call logs (e.g. WhatsApp or iMessage exports) covering months or years',
        'Travel itineraries and boarding passes showing visits to each other',
        'Joint tenancy agreement, joint bank account, or utility bills if cohabiting',
      ],
      commonMistakes: [
        'Too few dated examples',
        'No evidence of cohabitation if living together',
        'Screenshots with no visible dates',
      ],
    },
    {
      key: 'accommodation_letter',
      label: 'Accommodation evidence',
      explanation:
        'Confirms you’ll have adequate accommodation in the UK, owned or legally rented, without overcrowding — assessed against Housing Act 1985 room and space standards.',
      requirements: [
        'If renting: tenancy agreement in your name(s), or a signed letter from the landlord/family member giving permission if you’ll live with them.',
        'If owned: mortgage statement or property deeds.',
        'Be ready to show the property has enough rooms/space for the number of occupants, including any children.',
      ],
      examples: [
        'Tenancy agreement',
        'Mortgage statement',
        'Signed letter from a family member confirming you can live in their property, including the number of rooms',
      ],
      commonMistakes: [
        'Letter not signed',
        'No proof of the property owner’s right to offer it',
        'No indication of the property’s size relative to the number of occupants',
      ],
    },
    {
      key: 'english_certificate',
      label: 'English language certificate',
      explanation:
        'Required unless you’re a national of a majority English-speaking country or hold a degree taught in English. For a first spouse/partner visa, the required level is A1 (speaking and listening) on the CEFR scale.',
      requirements: [
        'Must be from a Home Office-approved SELT provider: IELTS Life Skills, LanguageCert, Trinity College London (ISE/GESE), PSI Skills for English UKVI, or Pearson PTE.',
        'Test result is valid for 2 years from the test date.',
        'If exempt via a degree, you’ll need an Ecctis (UK ENIC) statement confirming it’s equivalent to a UK degree and was taught in English.',
      ],
      examples: [
        'IELTS Life Skills A1 certificate',
        'Trinity ISE certificate',
        'Degree certificate + Ecctis equivalency statement',
      ],
      commonMistakes: [
        'Test taken from a non-approved provider',
        'Certificate older than 2 years',
        'Wrong CEFR level (A1 required for a first application, not a higher or lower one)',
      ],
    },
  ],
  skilled_worker: [
    {
      key: 'passport',
      label: 'Passport',
      explanation: 'Current passport or travel document proving your identity and nationality.',
      requirements: [
        'Must be valid for your intended stay.',
        'Include previous passports if available, to show travel history.',
      ],
      examples: ['Current biometric passport photo page', 'Previous passport(s) with visa history'],
      commonMistakes: ['Passport expiring within 6 months', 'Missing signature page'],
    },
    {
      key: 'cos',
      label: 'Certificate of Sponsorship (CoS)',
      explanation:
        'A unique reference number your licensed UK employer issues via the Sponsor Management System, confirming your job title, salary, occupation code, and sponsor licence number. It’s a virtual record, not a physical certificate.',
      requirements: [
        'Must be used within 3 months of being assigned, or it expires.',
        'Job title, salary, and occupation (SOC) code must match your actual role.',
        'The CoS states whether your employer certifies maintenance — if it does, you don’t need to show personal savings.',
      ],
      examples: ['CoS reference number/printout from your sponsor', 'Sponsor licence number'],
      commonMistakes: [
        'CoS used after its 3-month expiry window',
        'Job details not matching your actual role or salary',
        'Applying before the CoS has been assigned',
      ],
    },
    {
      key: 'financial_evidence',
      label: 'Bank statements (personal savings)',
      explanation:
        `Unless your Certificate of Sponsorship shows your employer certifies maintenance, you must show at least £${SKILLED_WORKER_SAVINGS_REQUIREMENT_GBP.toLocaleString()} in personal savings held continuously for 28 days.`,
      requirements: [
        'The 28-day period must end within 31 days of your application date.',
        'The balance must not drop below the required amount at any point during those 28 days.',
        'Statements must clearly show your name, account number, dates, and the bank’s official logo/stamp.',
      ],
      examples: ['Bank or building society statements (paper or electronic)', 'Building society passbook'],
      commonMistakes: [
        'Statements older than 31 days at time of application',
        'Balance dipping below the required amount during the 28-day window',
        'Statements missing the bank’s name or account holder details',
      ],
    },
    {
      key: 'english_certificate',
      label: 'English language certificate',
      explanation:
        'Required at CEFR level B2 (reading, writing, speaking, listening) for initial Skilled Worker applications, unless exempt — e.g. a degree taught in English, or a national of a majority English-speaking country.',
      requirements: [
        'Must be from a Home Office-approved SELT provider.',
        'Test result is valid for 2 years from the test date.',
        'If exempt via a degree, you’ll need an Ecctis (UK ENIC) equivalency statement.',
      ],
      examples: ['IELTS for UKVI B2+ certificate', 'Degree certificate + Ecctis equivalency statement'],
      commonMistakes: [
        'Test taken from a non-approved provider',
        'Test level below B2',
        'Certificate older than 2 years',
      ],
    },
    {
      key: 'tb_test',
      label: 'TB test certificate',
      explanation:
        'Required if you’ve lived for 6+ months in a listed country within the 6 months before applying, and you’re coming to the UK for 6+ months.',
      requirements: [
        'Must be from a Home Office-approved TB testing clinic in that country, not just any local clinic.',
        'Certificate is normally valid for 6 months from the test date.',
      ],
      examples: ['Chest X-ray certificate from an approved clinic'],
      commonMistakes: ['Test taken at a non-approved clinic', 'Certificate older than 6 months by the time you travel'],
    },
    {
      key: 'criminal_record_certificate',
      label: 'Criminal record certificate (if applicable)',
      explanation:
        'Required for jobs in education, healthcare, social care, or work with vulnerable groups, if you’ve lived in the UK or overseas for 12+ months (in the past 10 years) since turning 18.',
      requirements: [
        'Provide an official certificate from every relevant country you’ve lived in for 12+ months.',
        'Certificate is normally only valid for 6 months, so timing matters.',
        CERTIFIED_TRANSLATION_RULE,
        'Some countries require the certificate to be apostilled/legalised.',
      ],
      examples: ['ACRO Police Certificate (UK)', 'Equivalent overseas police clearance certificate'],
      commonMistakes: [
        'Missing a certificate from one of the relevant countries you lived in',
        'Certificate older than 6 months',
        'No certified translation for a non-English certificate',
      ],
    },
  ],
  student: [
    {
      key: 'passport',
      label: 'Passport',
      explanation: 'Current passport or travel document proving your identity and nationality.',
      requirements: ['Must be valid for your intended stay.', 'Include previous passports if available.'],
      examples: ['Current biometric passport photo page'],
      commonMistakes: ['Passport expiring within 6 months'],
    },
    {
      key: 'cas',
      label: 'Confirmation of Acceptance for Studies (CAS)',
      explanation:
        'A unique reference number from your licensed education provider, confirming your course, dates, and fees. It also usually confirms your English language assessment for degree-level courses.',
      requirements: [
        'Must apply within 6 months of the CAS being issued.',
        'Course start date on the CAS must match the dates in your application.',
        'Double-check the CAS reference number is entered correctly on your application.',
      ],
      examples: ['CAS reference number/printout from your university or college'],
      commonMistakes: [
        'Applying before the CAS is issued',
        'Course dates not matching visa dates',
        'CAS reference number entered incorrectly on the application',
      ],
    },
    {
      key: 'financial_evidence',
      label: 'Financial evidence',
      explanation:
        `Proof you can cover any unpaid tuition fees plus living costs — currently £${STUDENT_MAINTENANCE_LONDON_PER_MONTH_GBP.toLocaleString()}/month if studying in Inner/Outer London, or £${STUDENT_MAINTENANCE_OUTSIDE_LONDON_PER_MONTH_GBP.toLocaleString()}/month elsewhere, for each month of your course up to 9 months.`,
      requirements: [
        'Funds must be held for a consecutive 28-day period, ending within 31 days of your application date.',
        'You may be exempt if your CAS confirms a financial sponsor, or you’ve held a valid UK visa for the last 12+ months.',
      ],
      examples: [
        'Bank or building society statements',
        'Loan letter from a government/international sponsor confirming they’ll cover fees and living costs',
      ],
      commonMistakes: [
        'Funds not held for the full 28-day period required',
        'Using the wrong monthly amount for your study location (London vs outside London)',
        'Statement dated too far before the application date',
      ],
    },
    {
      key: 'english_certificate',
      label: 'English language certificate',
      explanation:
        'May be required depending on your course level and nationality. For degree-level courses your provider often assesses this directly and confirms it on the CAS; below-degree-level courses usually need standalone SELT evidence.',
      requirements: [
        'Check your CAS/offer letter to see whether your provider has already confirmed your English level.',
        'If a standalone test is needed, it must be from a Home Office-approved SELT provider.',
      ],
      examples: ['IELTS for UKVI academic certificate', 'CAS confirmation of an assessment already done by your provider'],
      commonMistakes: ['Wrong test type for your course level', 'Test result below the level your provider requires'],
    },
    {
      key: 'tb_test',
      label: 'TB test certificate',
      explanation:
        'Required if you’ve lived for 6+ months in a listed country within the 6 months before applying, and your course is 6+ months long.',
      requirements: [
        'Must be from a Home Office-approved TB testing clinic in that country.',
        'Certificate is normally valid for 6 months.',
      ],
      examples: ['Chest X-ray certificate from an approved clinic'],
      commonMistakes: ['Test taken at a non-approved clinic'],
    },
  ],
  visitor: [
    {
      key: 'passport',
      label: 'Passport',
      explanation: 'Current passport or travel document proving your identity and nationality.',
      requirements: ['Must be valid for your intended visit.', 'Include previous passports if available, to show travel history.'],
      examples: ['Current biometric passport photo page', 'Previous passport(s) with prior UK visits, if any'],
      commonMistakes: ['Passport expiring within 6 months'],
    },
    {
      key: 'financial_evidence',
      label: 'Bank statements',
      explanation:
        'Evidence you can fund the trip without working or needing public funds, and that the money is genuinely yours.',
      requirements: [
        'Show the source of the funds (salary deposits, gradual savings build-up) — statements older than about a year are of limited use.',
        'Large unexplained deposits shortly before applying are a common red flag for caseworkers.',
      ],
      examples: ['3-6 months of personal bank statements', 'Savings account statements'],
      commonMistakes: [
        'Statements showing large unexplained deposits',
        'Statements older than 6-12 months',
        'Funds that appear to belong to someone else with no explanation',
      ],
    },
    {
      key: 'accommodation_evidence',
      label: 'Accommodation evidence',
      explanation: 'Shows where you’ll stay during your visit.',
      requirements: [
        'Should cover the full length of your stated visit.',
        'An invitation letter from a UK host should include their name, address, and immigration status.',
      ],
      examples: ['Hotel booking confirmation', 'Invitation letter from a UK host', 'Short-term tenancy agreement'],
      commonMistakes: ['No contact details for the UK host', 'Booking that doesn’t cover the full length of stay'],
    },
    {
      key: 'travel_itinerary',
      label: 'Travel itinerary',
      explanation: 'Shows your visit is time-limited and that you intend to leave the UK at the end of it.',
      requirements: ['Return or onward travel booking.', 'For longer visits, a rough day-by-day plan can help.'],
      examples: ['Return/onward flight booking', 'Day-by-day visit plan for longer trips'],
      commonMistakes: [
        'One-way ticket with no return evidence',
        'Itinerary dates not matching the visa dates requested',
      ],
    },
    {
      key: 'ties_to_home',
      label: 'Ties to home country',
      explanation:
        'Evidence you have strong reasons to return home after your visit — one of the most common grounds for refusal when it’s missing.',
      requirements: [
        'Show ongoing employment, study, family, or property commitments at home.',
        'An employer letter should confirm your role, approved leave dates, and return-to-work date.',
      ],
      examples: [
        'Employer letter confirming your role, leave approval, and return-to-work date',
        'Enrolment letter if you’re a student',
        'Property ownership documents',
      ],
      commonMistakes: ['No evidence of employment or other ties', 'Employer letter without a confirmed return-to-work date'],
    },
  ],
};

/**
 * Builds a personalised checklist by starting from the base set for the
 * visa type, then adding/removing items based on the specific answers.
 */
export function generateChecklist(answers: QuestionnaireAnswers): ChecklistItem[] {
  const items = [...BASE_ITEMS[answers.visaType]];

  if (answers.visaType === 'spouse' && answers.incomeCountry === 'overseas') {
    items.push({
      key: 'overseas_income_evidence',
      label: 'Overseas income evidence (specified evidence rules)',
      explanation:
        'Overseas income is subject to stricter specified evidence rules (Appendix FM-SE) than UK income, since the Home Office also needs confidence the income will continue and can reach a UK account.',
      requirements: [
        '6 months of payslips plus an employer letter on headed paper, same as UK income evidence.',
        CERTIFIED_TRANSLATION_RULE,
        'Evidence of how the income will convert to/transfer into a UK bank account (e.g. exchange rate records, transfer history).',
      ],
      examples: ['Overseas payslips + certified translation', 'Employer letter on headed paper', 'Currency conversion/bank transfer records'],
      commonMistakes: [
        'Missing certified translation',
        'Employer letter not on headed paper',
        'No evidence of how income will convert or transfer to a UK account',
      ],
    });
  }

  if (answers.childrenCount > 0) {
    items.push({
      key: 'children_documents',
      label:
        answers.childrenCount === 1
          ? 'Child’s birth/adoption certificate'
          : `Children’s birth/adoption certificates (${answers.childrenCount})`,
      explanation: 'Proof of the parent-child relationship for each child included in the application.',
      requirements: [
        'Use the full/long-form birth certificate, showing both parents’ names — not a short-form certificate.',
        CERTIFIED_TRANSLATION_RULE,
        'If a child has a different surname, or one parent isn’t named, include extra evidence of the legal relationship (e.g. adoption or custody order).',
      ],
      examples: ['Full birth certificate', 'Adoption certificate', 'Court custody order, if relevant'],
      commonMistakes: [
        'Missing certificate for one child',
        'No translation for non-English certificates',
        'Using a short-form birth certificate that doesn’t list both parents',
      ],
    });
  }

  if (answers.visaType === 'skilled_worker' || answers.visaType === 'student') {
    if (!TB_TEST_COUNTRIES.includes(answers.countryApplyingFrom)) {
      const idx = items.findIndex((i) => i.key === 'tb_test');
      if (idx !== -1) items.splice(idx, 1);
    }
  }

  return items;
}

export interface RefusalGuidance {
  commonReasons: string[];
  example: string;
}

// Common refusal reasons per route, drawn from published Home Office refusal
// grounds and Appendix FM-SE / points-based system requirements. Always
// check the specific reasons given in your own decision letter — this is
// general guidance, not a review of any individual case.
export const REFUSAL_GUIDANCE: Record<VisaType, RefusalGuidance> = {
  spouse: {
    commonReasons: [
      "Financial requirement not met — evidence didn't clearly show the £29,000 combined income threshold, or didn't cover the exact required period (e.g. 6 months of payslips for salaried income)",
      "Relationship evidence questioned — the caseworker wasn't satisfied the relationship is genuine and subsisting (e.g. limited proof of cohabitation, inconsistent contact history, thin photo/communication evidence)",
      'Accommodation evidence missing or inadequate — no proof the property is big enough and lawfully available for the family',
      'English language evidence invalid — SELT certificate from a non-approved test centre, wrong CEFR level, or expired',
      'TB test certificate missing or from a clinic not on the approved list (for applicants from listed countries)',
      'Missing certified translations for documents not in English or Welsh',
    ],
    example:
      'Applicants who successfully reapply after a financial-requirement refusal typically submit six consecutive months of bank statements clearly showing the correct average income, plus an employer letter confirming salary and start date.',
  },
  skilled_worker: {
    commonReasons: [
      "Certificate of Sponsorship (CoS) problems — expired CoS, or the job title, SOC code, or salary on the CoS didn't match what was assigned",
      "Salary below the required threshold for the role's SOC code (the general threshold or the specific 'going rate', whichever is higher)",
      "Genuine vacancy doubts — the caseworker wasn't satisfied the role is genuine or that you're suitably skilled or qualified for it",
      'Missing qualification or professional registration evidence required for the role (e.g. regulated professions like healthcare)',
      "Sponsor licence issues — the employer's sponsor licence was suspended or revoked between CoS assignment and your decision",
      'Criminal record certificate missing where required for the role',
    ],
    example:
      'Applicants who successfully reapply after a CoS-discrepancy refusal typically have their employer/sponsor issue a corrected CoS, with the exact job title, SOC code, and salary matching the employment contract.',
  },
  student: {
    commonReasons: [
      "Maintenance (funds) requirement not met — the bank balance didn't cover the full 28-day period, dropped below the threshold at any point, or the account type/currency wasn't accepted",
      "CAS (Confirmation of Acceptance for Studies) problems — expired CAS, or course/institution details on the CAS didn't match the application",
      "'Genuine student' concerns — the caseworker doubted your study plans, academic progression, or intention to study and leave afterwards",
      'Missing academic qualification evidence needed to progress to this level of study',
      'English language (SELT) evidence invalid or below the required CEFR level for the course',
      'Immigration history issues — a previous overstay, visa refusal, or breach of conditions not properly explained',
    ],
    example:
      "Applicants who successfully reapply after a 'genuine student' refusal typically include a clear personal statement explaining their study plans and career goals, plus academic transcripts showing consistent progression.",
  },
  visitor: {
    commonReasons: [
      'Insufficient evidence of ties to your home country (job, property, family) to show you intend to leave the UK after your visit',
      'Unclear or inconsistent purpose of visit across the application and supporting documents',
      'Insufficient funds shown to cover the trip without working or relying on public funds',
      'Previous UK immigration history — an earlier overstay, refusal, or breach of visa conditions not properly addressed',
      'Inconsistent information between the application form, supporting documents, and (if applicable) a credibility interview',
    ],
    example:
      'Applicants who successfully reapply after a weak-ties refusal typically include stronger evidence — such as proof of ongoing employment, property ownership, or family responsibilities — showing why they intend to return.',
  },
};
