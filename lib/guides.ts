/**
 * Guides — long-form, evergreen articles (as opposed to the Q&A format of
 * Visa Info). Same "typed content array" approach as lib/visaInfo.ts and
 * lib/englishPrep/lessons.ts: no Markdown/CMS dependency, just a plain TS
 * array that's type-checked and reviewed like any other code change. Adding
 * a new guide means appending one GuideArticle object to GUIDES below.
 *
 * IMPORTANT (regulatory note, same as visaInfo.ts): general informational
 * guidance, not personalised legal advice.
 */

import { IconName } from '../components/Icon';
import { VisaInfoTypeKey } from './visaInfo';

export type GuideCategory = VisaInfoTypeKey | 'general';

export type GuideBlock =
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: 'info' | 'warning'; text: string }
  | { type: 'link'; label: string; url: string }
  // In-app navigation (Cost Calculator, Visa Info, English Test Prep, etc.)
  // — distinct from `link` above, which is always an external gov.uk URL
  // opened via Linking.openURL. `path` is an Expo Router path, e.g.
  // '/(tabs)/costs' or '/(tabs)/ielts-life-skills/a1'.
  | { type: 'internalLink'; label: string; path: string };

export interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: GuideCategory;
  icon: IconName;
  datePublished: string; // ISO 8601 — set once, never changes
  dateModified: string; // ISO 8601 — bump by hand whenever body[] changes
  readingTimeMinutes?: number; // hand-estimated; omit to hide rather than compute at runtime
  body: GuideBlock[];
}

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  spouse: 'Spouse / Family',
  student: 'Student',
  skilled_worker: 'Skilled Worker',
  visitor: 'Visitor',
  child: 'Child',
  settlement: 'Settlement',
  citizenship: 'Citizenship',
  general: 'General',
};

export const GUIDES: GuideArticle[] = [
  {
    slug: 'preparing-for-your-biometrics-appointment',
    title: 'Preparing for Your UK Visa Biometrics Appointment',
    excerpt:
      'What actually happens at a UK visa biometrics appointment, what to bring, and how the date affects your processing timeline.',
    category: 'general',
    icon: 'camera',
    datePublished: '2026-07-01',
    dateModified: '2026-07-01',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: "Almost every UK visa route requires you to attend a biometrics appointment — where a visa application centre records your fingerprints and photograph — before your application can be processed. Here's what to expect and how to prepare.",
      },
      { type: 'heading', text: 'What to bring' },
      {
        type: 'list',
        items: [
          'Your appointment confirmation (printed or on your phone)',
          'Your current passport and any previous passports',
          'The documents listed in your application checklist, if asked to bring them',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Arrive on time — most centres have limited slots and can\'t always accommodate late arrivals or walk-ins.',
      },
      { type: 'heading', text: 'How your biometrics date affects your timeline' },
      {
        type: 'paragraph',
        text: 'Once your biometrics are recorded, the Home Office\'s target processing time typically starts counting from that date, not your submission date. This is why UK Visa Tracker asks for your biometrics date specifically — it\'s what "Week 8 of ~13" and similar progress figures are based on.',
      },
      {
        type: 'link',
        label: 'Find a visa application centre',
        url: 'https://www.gov.uk/get-a-visa-decision-quickly/visa-application-centres',
      },
    ],
  },
  {
    slug: 'spouse-visa-financial-requirement-explained',
    title: 'The UK Spouse Visa Financial Requirement, Explained',
    excerpt:
      'A plain-English walkthrough of the £29,000 minimum income requirement for UK spouse/partner visas — what counts as income, and common ways to meet it.',
    category: 'spouse',
    icon: 'credit-card',
    datePublished: '2026-07-01',
    dateModified: '2026-07-01',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: 'To sponsor a spouse or partner for a UK visa, you (or your combined household) generally need to show a minimum annual income — the "financial requirement." This guide covers the basics; always confirm the current threshold on GOV.UK, since it changes periodically.',
      },
      { type: 'heading', text: 'What counts as income' },
      {
        type: 'list',
        items: [
          'Salaried or self-employed income from the sponsor (and sometimes the applicant, if already in the UK with permission to work)',
          'Non-employment income such as pensions or property rental',
          'Cash savings above a threshold, held for at least 6 months',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Savings must be held continuously for the required period and clearly evidenced with statements — a sudden large deposit shortly before applying is a common reason for refusal.',
      },
      { type: 'heading', text: 'If you don\'t meet the requirement alone' },
      {
        type: 'paragraph',
        text: 'Income sources can often be combined — for example, salary plus savings, or both partners\' income if the applicant already has UK permission to work. Use UK Visa Tracker\'s Cost Calculator and Checklist to see exactly which financial evidence documents apply to your situation.',
      },
      {
        type: 'link',
        label: 'Spouse visa: money you need',
        url: 'https://www.gov.uk/spouse-visa/money',
      },
    ],
  },
  {
    slug: 'uk-visa-fees-2026-full-cost-breakdown',
    title: 'UK Visa Fees 2026: Full Cost Breakdown',
    excerpt:
      'Every fee you\'ll actually pay for a UK visa in 2026 — application fee, Immigration Health Surcharge, biometrics, and the optional extras — broken down by visa type.',
    category: 'general',
    icon: 'dollar-sign',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: 'A UK visa costs more than the headline application fee. Here\'s every component, using GOV.UK rates effective 8 April 2026.',
      },
      { type: 'heading', text: 'The application fee, by visa type' },
      {
        type: 'list',
        items: [
          'Spouse / Family visa: £2,064',
          'Skilled Worker visa: £819 (standard rate, certificate of sponsorship up to 3 years)',
          'Student visa: £558',
          'Standard Visitor visa: £135',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Each applicant pays the fee individually — a dependent child or partner pays the same route fee as the main applicant, not a discounted add-on.',
      },
      { type: 'heading', text: 'Immigration Health Surcharge (IHS)' },
      {
        type: 'paragraph',
        text: 'The IHS is paid upfront for the whole length of your visa, not annually, and gives access to the NHS on broadly the same basis as a UK resident.',
      },
      {
        type: 'list',
        items: [
          'Spouse / Family and Skilled Worker: £1,035 per year of your visa',
          'Student: £776 per year (a discounted rate)',
          'Standard Visitor: exempt — visits are too short to qualify',
        ],
      },
      { type: 'heading', text: 'Other costs to budget for' },
      {
        type: 'list',
        items: [
          'Biometrics enrolment: £19.20',
          'Courier / keeping your passport during processing: around £40',
          'Priority service, where available for your route: £500',
          'TB test, only if required for your nationality and stay length: around £65',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Certified translations (roughly £80 per document) and solicitor fees (roughly £1,500+) vary a lot by provider and case — these are rough planning estimates, not official GOV.UK fees.',
      },
      {
        type: 'internalLink',
        label: 'Get your own total with the Cost Calculator',
        path: '/(tabs)/costs',
      },
    ],
  },
  {
    slug: 'what-happens-after-biometrics-uk-visa-processing-explained',
    title: 'What Happens After Biometrics: UK Visa Processing Explained',
    excerpt:
      'What actually happens between your biometrics appointment and a decision, and how UKVI\'s target processing times are measured.',
    category: 'general',
    icon: 'clock',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: "Biometrics day isn't the end of the process — it's when the processing clock actually starts.",
      },
      { type: 'heading', text: 'Your application moves to a caseworker' },
      {
        type: 'paragraph',
        text: "After biometrics, your documents and biometric data go to a caseworker, who checks your application against the immigration rules for your specific route.",
      },
      { type: 'heading', text: 'How the target processing time is measured' },
      {
        type: 'paragraph',
        text: 'UKVI publishes target times in working days, counted from your biometrics enrolment date — not your submission date. Working days exclude weekends and UK bank holidays.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'This is why UK Visa Tracker asks for your biometrics date specifically — "Week 6" and "40 working days" progress figures are measured from that date, using a live feed of UK bank holidays rather than a plain weekday count.',
      },
      { type: 'heading', text: 'What the wait actually looks like' },
      {
        type: 'list',
        items: [
          "No routine updates in most cases — UKVI doesn't provide a public case-tracking portal for standard processing",
          'You may occasionally be asked for further documents, or a biometric re-enrolment',
          'A decision usually arrives with no advance warning, by email or letter',
        ],
      },
      { type: 'heading', text: 'Priority and Super Priority services' },
      {
        type: 'paragraph',
        text: "Paying for priority processing, where available for your route, targets a much faster decision — but it doesn't change the eligibility bar, only the speed of the decision.",
      },
      {
        type: 'internalLink',
        label: 'Track your own processing timeline',
        path: '/(tabs)/timeline',
      },
      {
        type: 'link',
        label: 'Visa processing times: outside the UK',
        url: 'https://www.gov.uk/visa-processing-times',
      },
      {
        type: 'link',
        label: 'Visa processing times: applications inside the UK',
        url: 'https://www.gov.uk/guidance/visa-processing-times-applications-inside-the-uk',
      },
    ],
  },
  {
    slug: 'uk-visa-processing-times-inside-vs-outside-uk',
    title: 'UK Visa Processing Times, Explained: Inside vs Outside the UK',
    excerpt:
      "How long a UK visa decision actually takes, broken down by visa type, where you're applying from, and standard vs priority service.",
    category: 'general',
    icon: 'map',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: "UKVI's published processing targets depend on your visa type, whether you're applying from inside or outside the UK, and standard vs priority service — not on general assumptions about how backed up a particular office is.",
      },
      { type: 'heading', text: 'Applying from outside the UK' },
      {
        type: 'list',
        items: [
          'Standard — Spouse / Family: 60 working days (12 weeks)',
          'Standard — Skilled Worker, Student, Standard Visitor: 15 working days',
          'Priority — Spouse / Family: 30 working days',
          'Priority — Skilled Worker, Student, Standard Visitor: 5 working days',
        ],
      },
      { type: 'heading', text: 'Applying from inside the UK' },
      {
        type: 'list',
        items: [
          'Standard — all routes: 40 working days (8 weeks)',
          'Priority — Spouse / Family: next working day',
          'Priority — Skilled Worker, Student: 5 working days',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "These are UKVI's published targets, not guarantees — a case needing extra checks, like a further document request, can take longer.",
      },
      { type: 'heading', text: 'What about processing times by country?' },
      {
        type: 'callout',
        variant: 'info',
        text: "UKVI doesn't currently publish a granular, per-country breakdown of processing times — the figures above apply regardless of which country you're applying from. If you've seen a specific per-country figure quoted elsewhere, verify it directly on GOV.UK before relying on it [VERIFY]. UK Visa Tracker's data model already supports adding country-specific figures once UKVI publishes them.",
      },
      {
        type: 'internalLink',
        label: 'Track your own timeline and target decision date',
        path: '/(tabs)/timeline',
      },
    ],
  },
  {
    slug: 'ielts-life-skills-a1-vs-a2-vs-b1-which-do-you-need',
    title: 'IELTS Life Skills A1 vs A2 vs B1: Which Do You Need?',
    excerpt:
      'Which IELTS Life Skills level your UK visa actually requires — A1, A2, or B1 — and what the real exam involves at each level.',
    category: 'general',
    icon: 'award',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: 'IELTS Life Skills is pass/fail — Speaking and Listening only, no band score — and which level you need depends on your visa stage, not your general English ability.',
      },
      { type: 'heading', text: 'A1 — initial family or spouse visa' },
      {
        type: 'paragraph',
        text: "Required for an initial family or spouse visa application — usually the first English test most applicants need to pass. About 16–20 minutes in total.",
      },
      { type: 'heading', text: 'A2 — extending a family visa' },
      {
        type: 'paragraph',
        text: 'Required when extending a family visa. The level steps up from A1, so questions expect fuller answers — more detail, reasoning, and past-tense description. Also about 16–20 minutes in total.',
      },
      { type: 'heading', text: 'B1 — settlement and citizenship' },
      {
        type: 'paragraph',
        text: 'Required for settlement (Indefinite Leave to Remain) and, alongside the separate Life in the UK Test, for citizenship naturalisation. About 22 minutes in total — slightly longer than A1/A2, with more extended, well-reasoned answers expected.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: "If you're working towards citizenship: passing English at B1 or above is only one part of the \"Knowledge of Life and Language\" requirement — you'll also need to pass the separate Life in the UK Test, covering British history, traditions, and how government works.",
      },
      { type: 'heading', text: 'What the test actually involves, at every level' },
      {
        type: 'list',
        items: [
          'Speaking and Listening only — no reading, no writing, and no multiple choice in the real exam',
          "Face-to-face, with an examiner and one other test candidate — you're never tested alone",
          'Two parts: everyday questions, then listening to a short recording together and discussing it',
        ],
      },
      {
        type: 'internalLink',
        label: 'Practice free for your level',
        path: '/(tabs)/ielts-life-skills',
      },
    ],
  },
  {
    slug: 'skilled-worker-visa-requirements-explained',
    title: 'UK Skilled Worker Visa Requirements Explained',
    excerpt:
      'What you actually need for a UK Skilled Worker visa: sponsorship, salary and English requirements, savings, and the real cost and timeline.',
    category: 'skilled_worker',
    icon: 'briefcase',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: 'The Skilled Worker visa is sponsor-led — you can\'t apply speculatively; a licensed UK employer has to want to hire you first.',
      },
      { type: 'heading', text: 'You need a Certificate of Sponsorship (CoS)' },
      {
        type: 'paragraph',
        text: 'A UK employer with a sponsor licence assigns you a CoS confirming your job, SOC (occupation) code, and salary — this has to be in place before you apply.',
      },
      { type: 'heading', text: 'Salary and English requirements' },
      {
        type: 'paragraph',
        text: "Your salary has to meet the required threshold for the role's SOC code, and your English needs to be at least B1 across all four components (speaking, listening, reading, writing) unless you're exempt — for example, if your degree was taught in English.",
      },
      { type: 'heading', text: 'Maintenance funds' },
      {
        type: 'paragraph',
        text: "If your sponsor hasn't certified your maintenance on the CoS, you generally need at least £1,270 in savings, held continuously for 28 days before you apply.",
      },
      { type: 'heading', text: 'Costs' },
      {
        type: 'list',
        items: [
          'Visa fee: £819 (standard rate, CoS up to 3 years)',
          'Immigration Health Surcharge: £1,035 per year of your visa',
          'Processing: 15 working days standard / 5 working days priority, outside the UK',
          'Processing: 40 working days standard / 5 working days priority, inside the UK',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "CoS mismatches — job title, SOC code, or salary not matching your actual contract — are one of the most common reasons Skilled Worker applications get refused. Check every detail on your CoS against your employment terms before applying.",
      },
      {
        type: 'internalLink',
        label: 'See Skilled Worker requirements in full',
        path: '/(tabs)/visa-info/skilled_worker',
      },
      {
        type: 'internalLink',
        label: 'Estimate your total cost',
        path: '/(tabs)/costs',
      },
      {
        type: 'link',
        label: 'Skilled Worker visa: overview',
        url: 'https://www.gov.uk/skilled-worker-visa',
      },
      {
        type: 'link',
        label: 'Skilled Worker visa: your finances',
        url: 'https://www.gov.uk/skilled-worker-visa/your-finances',
      },
    ],
  },
  {
    slug: 'common-reasons-uk-visa-applications-get-refused',
    title: 'Common Reasons UK Visa Applications Get Refused',
    excerpt:
      'The most common reasons Spouse, Skilled Worker, Student, and Standard Visitor visa applications get refused — and what a stronger reapplication looks like.',
    category: 'general',
    icon: 'alert-triangle',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 6,
    body: [
      {
        type: 'paragraph',
        text: "These are general patterns across refused applications, not a review of any individual case — always check the specific reasons given in your own decision letter.",
      },
      { type: 'heading', text: 'Spouse / Family visa' },
      {
        type: 'list',
        items: [
          "Financial requirement not met — evidence didn't clearly show the £29,000 combined income threshold, or didn't cover the exact required period",
          "Relationship evidence questioned — the caseworker wasn't satisfied the relationship is genuine and subsisting",
          'Accommodation evidence missing or inadequate',
          'English language evidence invalid — wrong test centre, CEFR level, or expired certificate',
          'TB test certificate missing or from a non-approved clinic',
          'Missing certified translations for documents not in English or Welsh',
        ],
      },
      {
        type: 'paragraph',
        text: 'Applicants who successfully reapply after a financial-requirement refusal typically submit six consecutive months of bank statements clearly showing the correct average income, plus an employer letter confirming salary and start date.',
      },
      { type: 'heading', text: 'Skilled Worker visa' },
      {
        type: 'list',
        items: [
          "Certificate of Sponsorship (CoS) problems — expired CoS, or job title, SOC code, or salary not matching what was assigned",
          "Salary below the required threshold for the role's SOC code",
          "Genuine vacancy doubts — the caseworker wasn't satisfied the role is genuine or that you're suitably qualified",
          'Missing qualification or professional registration evidence',
          "Sponsor licence issues between CoS assignment and your decision",
        ],
      },
      {
        type: 'paragraph',
        text: 'Applicants who successfully reapply after a CoS-discrepancy refusal typically have their employer issue a corrected CoS matching their actual contract exactly.',
      },
      { type: 'heading', text: 'Student visa' },
      {
        type: 'list',
        items: [
          "Maintenance (funds) requirement not met — balance didn't cover the full 28-day period or dropped below the threshold",
          "CAS (Confirmation of Acceptance for Studies) problems",
          "'Genuine student' concerns about study plans or intention to leave afterwards",
          'Missing academic qualification evidence',
          'English language (SELT) evidence invalid or below the required level',
        ],
      },
      {
        type: 'paragraph',
        text: "Applicants who successfully reapply after a 'genuine student' refusal typically include a clear personal statement explaining their study plans and career goals, plus transcripts showing consistent academic progression.",
      },
      { type: 'heading', text: 'Standard Visitor visa' },
      {
        type: 'list',
        items: [
          'Insufficient evidence of ties to your home country to show you intend to leave the UK afterwards',
          'Unclear or inconsistent purpose of visit',
          'Insufficient funds shown to cover the trip',
          'Previous UK immigration history not properly addressed',
        ],
      },
      {
        type: 'paragraph',
        text: 'Applicants who successfully reapply after a weak-ties refusal typically include stronger evidence — proof of ongoing employment, property, or family responsibilities — showing why they intend to return.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'You may have a right to an administrative review or appeal, depending on your route and the reason given — check your decision letter carefully for what applies to you.',
      },
      {
        type: 'link',
        label: 'Ask for an administrative review',
        url: 'https://www.gov.uk/ask-for-an-administrative-review',
      },
      {
        type: 'link',
        label: 'Appeal a visa or immigration decision',
        url: 'https://www.gov.uk/appeal-visa-immigration-decision',
      },
    ],
  },
  {
    slug: 'student-visa-to-skilled-worker-visa-switching-explained',
    title: 'Student Visa to Skilled Worker Visa: Switching Explained',
    excerpt:
      "The basics of switching from a UK Student visa to a Skilled Worker visa without leaving the country — and what to double-check before you rely on this.",
    category: 'general',
    icon: 'repeat',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: "Many Student visa holders switch to a Skilled Worker visa after finishing their course, without leaving the UK. The eligibility rules for switching aren't identical to applying fresh from overseas, so treat this as a starting point, not the full picture.",
      },
      { type: 'heading', text: 'The basics' },
      {
        type: 'paragraph',
        text: 'You generally need a confirmed job offer and a Certificate of Sponsorship from a licensed sponsor before switching, and you normally apply from inside the UK on the Skilled Worker route while your Student visa is still valid.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: "Exact switching eligibility — including any course-completion requirements, timing restrictions, or route-specific exceptions — isn't part of UK Visa Tracker's currently verified data. Confirm the current switching rules directly on GOV.UK before relying on any of this for your own application [VERIFY].",
      },
      { type: 'heading', text: "What carries over, and what doesn't" },
      {
        type: 'paragraph',
        text: "Your immigration history may be considered, but you'll still need fresh Certificate of Sponsorship, salary, and English-language evidence meeting Skilled Worker requirements — check current GOV.UK guidance for exactly what's required in your situation [VERIFY].",
      },
      {
        type: 'internalLink',
        label: 'See Skilled Worker visa requirements',
        path: '/(tabs)/visa-info/skilled_worker',
      },
      {
        type: 'internalLink',
        label: 'See Student visa requirements',
        path: '/(tabs)/visa-info/student',
      },
      {
        type: 'link',
        label: 'Skilled Worker visa: overview',
        url: 'https://www.gov.uk/skilled-worker-visa',
      },
      {
        type: 'link',
        label: 'Student visa: overview',
        url: 'https://www.gov.uk/student-visa',
      },
    ],
  },
  {
    slug: 'what-is-the-immigration-health-surcharge-ihs',
    title: 'What Is the Immigration Health Surcharge (IHS)?',
    excerpt:
      "What the Immigration Health Surcharge actually is, how much it costs by visa type, and what it gives you access to.",
    category: 'general',
    icon: 'heart',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 3,
    body: [
      {
        type: 'paragraph',
        text: "The Immigration Health Surcharge (IHS) is a separate charge from your visa application fee, paid so you can use the NHS while you're in the UK on most visa routes.",
      },
      { type: 'heading', text: 'How much you pay' },
      {
        type: 'list',
        items: [
          'Spouse / Family visa: £1,035 per year of your visa',
          'Skilled Worker visa: £1,035 per year of your visa',
          'Student visa: £776 per year (a discounted rate)',
          'Standard Visitor visa: exempt — visits are too short to qualify',
        ],
      },
      { type: 'heading', text: 'When and how you pay it' },
      {
        type: 'paragraph',
        text: 'The IHS is paid upfront, online, as part of your application — covering the entire length of your visa in one payment, not billed annually.',
      },
      { type: 'heading', text: 'What it covers' },
      {
        type: 'paragraph',
        text: 'Once paid, you can use the NHS in broadly the same way as a UK resident, though some services — like NHS dental charges — still have separate costs for everyone, residents included.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'The IHS is separate from your visa application fee — see our full fee breakdown guide for the total cost of your visa.',
      },
      {
        type: 'internalLink',
        label: 'Estimate your visa costs, including IHS',
        path: '/(tabs)/costs',
      },
    ],
  },
  {
    slug: 'uk-visitor-visa-requirements-explained',
    title: 'UK Standard Visitor Visa Requirements Explained',
    excerpt:
      'What a UK Standard Visitor visa actually requires: funds, ties to home, how long you can stay, and the real cost and timeline.',
    category: 'visitor',
    icon: 'globe',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: "The Standard Visitor visa covers tourism, visiting family, business trips, and short-term study — but it's temporary by design, and the application has to show that clearly.",
      },
      { type: 'heading', text: 'What you need to show' },
      {
        type: 'list',
        items: [
          'A genuine reason for your visit',
          "Enough funds to cover your trip, proportionate to your planned stay — there's no single fixed minimum amount published",
          'Intention to leave the UK at the end of your visit',
          'Accommodation for your stay',
        ],
      },
      { type: 'heading', text: 'How long you can stay' },
      {
        type: 'paragraph',
        text: 'A Standard Visitor visa can be valid for 6 months, or 2, 5, or 10 years — but each individual visit is capped at 6 months, regardless of how long the visa itself is valid for.',
      },
      { type: 'heading', text: 'Costs and processing' },
      {
        type: 'list',
        items: [
          'Visa fee: £135',
          'No Immigration Health Surcharge — visitor visas are exempt',
          'Processing: 15 working days standard, 5 working days priority (outside the UK only — there is no inside-UK visitor route)',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Weak evidence of ties to your home country — job, property, family — is one of the most common reasons visitor visa applications are refused.',
      },
      {
        type: 'internalLink',
        label: 'See Visitor visa requirements in full',
        path: '/(tabs)/visa-info/visitor',
      },
      {
        type: 'internalLink',
        label: 'Estimate your visa costs',
        path: '/(tabs)/costs',
      },
      {
        type: 'link',
        label: 'Standard Visitor visa: overview',
        url: 'https://www.gov.uk/standard-visitor-visa',
      },
    ],
  },
  {
    slug: 'indefinite-leave-to-remain-ilr-eligibility-explained',
    title: 'Indefinite Leave to Remain (ILR): Eligibility Explained',
    excerpt:
      'What you need for UK settlement (Indefinite Leave to Remain): residence, English, the Life in the UK Test, and typical processing time.',
    category: 'settlement',
    icon: 'check-circle',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: 'Indefinite Leave to Remain (ILR) — often called "settlement" — removes the time limit on your UK immigration status.',
      },
      { type: 'heading', text: 'Residence requirement' },
      {
        type: 'paragraph',
        text: "Most routes require 5 years of continuous lawful residence in the UK (3 years on some routes, such as if you're married to a British citizen), with no more than 180 days' absence in any rolling 12-month period.",
      },
      { type: 'heading', text: 'English and Life in the UK' },
      {
        type: 'paragraph',
        text: 'You need English at B1 or above — IELTS Life Skills B1 qualifies — and a pass in the separate Life in the UK Test.',
      },
      { type: 'heading', text: 'Costs and processing' },
      {
        type: 'paragraph',
        text: "Standard processing for an ILR application made from inside the UK is typically around 6 months.",
      },
      {
        type: 'callout',
        variant: 'info',
        text: "ILR doesn't follow the same fee structure as a new visa application in UK Visa Tracker's Cost Calculator — check the current ILR fee directly on GOV.UK.",
      },
      {
        type: 'internalLink',
        label: 'See Settlement requirements in full',
        path: '/(tabs)/visa-info/settlement',
      },
      {
        type: 'link',
        label: 'Settle in the UK: overview',
        url: 'https://www.gov.uk/settle-in-the-uk',
      },
    ],
  },
  {
    slug: 'path-to-british-citizenship-after-ilr',
    title: 'The Path to British Citizenship After ILR',
    excerpt:
      'What comes after settlement: when you can apply for British citizenship, the residence and English requirements, and typical processing time.',
    category: 'citizenship',
    icon: 'flag',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 5,
    body: [
      {
        type: 'paragraph',
        text: 'Naturalisation as a British citizen is the step after Indefinite Leave to Remain (ILR) — it has its own separate residence and evidence requirements.',
      },
      { type: 'heading', text: 'When you can apply' },
      {
        type: 'paragraph',
        text: "If you're married to a British citizen, you can apply as soon as you have ILR. Otherwise, you generally need to hold ILR for 12 months first.",
      },
      { type: 'heading', text: 'Residence requirement' },
      {
        type: 'paragraph',
        text: "5 years' UK residence generally (3 years if married to a British citizen), with no more than 450 days' absence across that period (270 days on the 3-year route), and no more than 90 days' absence in the final 12 months.",
      },
      { type: 'heading', text: 'English and Life in the UK' },
      {
        type: 'paragraph',
        text: "You can reuse your B1 English and Life in the UK Test results from your ILR application if they're still valid — you don't need to resit either.",
      },
      { type: 'heading', text: 'Costs and processing' },
      {
        type: 'paragraph',
        text: 'Processing is typically around 6 months.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'There is no right of appeal against a naturalisation refusal — get your application right the first time.',
      },
      {
        type: 'internalLink',
        label: 'See Citizenship requirements in full',
        path: '/(tabs)/visa-info/citizenship',
      },
      {
        type: 'link',
        label: 'Becoming a British citizen',
        url: 'https://www.gov.uk/becoming-a-british-citizen',
      },
      {
        type: 'link',
        label: 'Life in the UK test',
        url: 'https://www.gov.uk/life-in-the-uk-test',
      },
    ],
  },
  {
    slug: 'uk-child-visa-requirements-explained',
    title: 'UK Child Visa Requirements Explained',
    excerpt:
      "What a UK child visa requires: relationship evidence, the financial requirement, and the TB test exemption for younger children.",
    category: 'child',
    icon: 'users',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    readingTimeMinutes: 4,
    body: [
      {
        type: 'paragraph',
        text: "A child visa is usually applied for alongside a parent's own application, rather than as a completely separate process.",
      },
      { type: 'heading', text: 'Relationship evidence' },
      {
        type: 'paragraph',
        text: "You need to show the child's relationship to their parent(s) or guardian in the UK, and that suitable arrangements are in place for their care.",
      },
      { type: 'heading', text: 'Financial requirement' },
      {
        type: 'paragraph',
        text: "Since 11 April 2024, there's no extra income add-on for children on the spouse/family route — the same £29,000 threshold covers the whole family. On work and study routes, extra maintenance funds per dependent child are still required.",
      },
      { type: 'heading', text: 'TB test' },
      {
        type: 'paragraph',
        text: 'Children under 11 are exempt from the TB test requirement that otherwise applies to applicants from listed countries.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: "Use UK Visa Tracker's Checklist to see the exact combined document list once you've entered your family's details.",
      },
      {
        type: 'internalLink',
        label: 'See Child visa requirements in full',
        path: '/(tabs)/visa-info/child',
      },
      {
        type: 'internalLink',
        label: 'Start your application checklist',
        path: '/(tabs)/questionnaire',
      },
      {
        type: 'link',
        label: 'Child visa: overview',
        url: 'https://www.gov.uk/child-visa',
      },
    ],
  },
];

export function getGuide(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
