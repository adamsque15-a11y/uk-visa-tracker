/**
 * Visa Knowledge Hub content — a browsable, searchable library of common
 * questions across every route, independent of the applicant's own
 * checklist/timeline data. Written to reflect current Home Office guidance
 * as of this file's last review; immigration rules change often, so each
 * question links to the relevant GOV.UK page to confirm current detail.
 *
 * IMPORTANT (regulatory note): this is general informational guidance, not
 * personalised legal advice — keep that framing in any UI built on top of
 * this file.
 */

import { IconName } from '../components/Icon';

export type VisaInfoTypeKey = 'spouse' | 'student' | 'skilled_worker' | 'visitor' | 'child' | 'settlement' | 'citizenship';

export interface OfficialLink {
  label: string;
  url: string;
}

export interface VisaInfoQuestion {
  id: string;
  question: string;
  plainEnglish: string;
  officialRule: string;
  example: string;
  officialGuidance: OfficialLink;
}

export interface VisaInfoCategory {
  key: string;
  label: string;
  questions: VisaInfoQuestion[];
}

export interface VisaInfoSection {
  type: VisaInfoTypeKey;
  icon: IconName;
  label: string;
  categories: VisaInfoCategory[];
}

const LINKS = {
  spouseVisa: { label: 'Spouse visa: overview', url: 'https://www.gov.uk/spouse-visa' },
  appendixFMSE: {
    label: 'Immigration Rules Appendix FM-SE',
    url: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-fm-se-family-members-specified-evidence',
  },
  appendixFM: {
    label: 'Immigration Rules Appendix FM',
    url: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-fm-family-members',
  },
  studentVisa: { label: 'Student visa: overview', url: 'https://www.gov.uk/student-visa' },
  studentMoney: { label: 'Student visa: money you need', url: 'https://www.gov.uk/student-visa/money' },
  skilledWorkerVisa: { label: 'Skilled Worker visa: overview', url: 'https://www.gov.uk/skilled-worker-visa' },
  skilledWorkerFinance: { label: 'Skilled Worker visa: your finances', url: 'https://www.gov.uk/skilled-worker-visa/your-finances' },
  visitorVisa: { label: 'Standard Visitor visa: overview', url: 'https://www.gov.uk/standard-visitor-visa' },
  childVisa: { label: 'Child visa: overview', url: 'https://www.gov.uk/child-visa' },
  settle: { label: 'Settle in the UK: overview', url: 'https://www.gov.uk/settle-in-the-uk' },
  citizenship: { label: 'Becoming a British citizen', url: 'https://www.gov.uk/becoming-a-british-citizen' },
  naturalisation: {
    label: 'Apply to become a British citizen',
    url: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
  },
  lifeInUK: { label: 'Life in the UK test', url: 'https://www.gov.uk/life-in-the-uk-test' },
  approvedEnglishTests: {
    label: 'Approved English language tests',
    url: 'https://www.gov.uk/guidance/approved-english-language-tests',
  },
  tbTest: { label: 'TB tests for visa applicants', url: 'https://www.gov.uk/tb-test-visa' },
  brp: { label: 'Biometric information and appointments', url: 'https://www.gov.uk/biometric-residence-permits' },
  processingTimesOutside: { label: 'Visa processing times: outside the UK', url: 'https://www.gov.uk/visa-processing-times' },
  processingTimesInside: {
    label: 'Visa processing times: applications inside the UK',
    url: 'https://www.gov.uk/guidance/visa-processing-times-applications-inside-the-uk',
  },
  priorityService: { label: 'Get a faster decision on your visa', url: 'https://www.gov.uk/faster-decision-visa-settlement' },
  evisa: { label: 'Get access to your eVisa', url: 'https://www.gov.uk/evisa' },
  viewProve: { label: 'View and prove your immigration status', url: 'https://www.gov.uk/view-prove-immigration-status' },
  adminReview: { label: 'Ask for an administrative review', url: 'https://www.gov.uk/ask-for-an-administrative-review' },
  appeal: { label: 'Appeal a visa or immigration decision', url: 'https://www.gov.uk/appeal-visa-immigration-decision' },
  findAdviser: { label: 'Find an immigration adviser', url: 'https://www.gov.uk/find-an-immigration-adviser' },
};

export const VISA_INFO: VisaInfoSection[] = [
  // ───────────────────────────── SPOUSE VISA ─────────────────────────────
  {
    type: 'spouse',
    icon: 'heart',
    label: 'Spouse Visa',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'spouse-before-eligible',
            question: 'Who counts as a "partner" for this visa?',
            plainEnglish:
              'You can apply as a spouse, civil partner, fiancé(e)/proposed civil partner, or unmarried partner, as long as you can show the relationship is genuine and meets the required living-together or relationship-length rules.',
            officialRule:
              'Unmarried and same-sex partners must show they have lived together in a relationship akin to marriage for at least 2 years, unless already married or in a civil partnership.',
            example:
              'Maria and John have been in a relationship for 3 years and have lived together for 2 of those years — they can apply as unmarried partners with evidence of that cohabitation.',
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-before-outside-or-inside',
            question: 'Can I apply from inside the UK?',
            plainEnglish:
              'Yes, if you already have permission to be in the UK on a route that allows switching (e.g. another visa, not as a visitor) — otherwise you apply from outside the UK before travelling.',
            officialRule:
              'Switching into the spouse route from inside the UK is not permitted from Visitor visa status; most other visa categories can switch, subject to meeting the full eligibility requirements.',
            example:
              "Priya is in the UK on a Skilled Worker visa and marries a British citizen — she can apply to switch into the spouse route without leaving the UK.",
            officialGuidance: LINKS.spouseVisa,
          },
          {
            id: 'spouse-before-length',
            question: 'How long does the visa last, and can it lead to settlement?',
            plainEnglish:
              'The initial spouse visa is granted for 2 years and 9 months (or 33 months if applying from outside the UK), after which you extend for a further 2 years and 6 months, before being eligible to apply for settlement (ILR) — a 5-year route in total.',
            officialRule:
              'Applicants on the 5-year partner route become eligible for settlement after completing 5 years of continuous lawful residence on that route, subject to ongoing eligibility.',
            example:
              'Ahmed gets his first spouse visa in 2024, extends in 2027, and becomes eligible to apply for settlement in 2029.',
            officialGuidance: LINKS.settle,
          },
          {
            id: 'spouse-before-fees',
            question: 'What does the application cost?',
            plainEnglish:
              'Costs include the visa application fee, the Immigration Health Surcharge (IHS) for the full length of the visa, and often a priority service fee if you want a faster decision — these change periodically so always check the current figures.',
            officialRule: 'Fees and the IHS rate are set by the Home Office and reviewed periodically — check gov.uk for the current amounts before applying.',
            example:
              'Before applying, Fatima checks the current visa fee and IHS calculator on gov.uk to budget the total cost for a 2 year 9 month visa.',
            officialGuidance: LINKS.spouseVisa,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'spouse-financial-overseas-income',
            question: 'Can overseas income be used?',
            plainEnglish:
              "Yes, in many spouse visa applications, overseas employment income can be used if the sponsor is returning to the UK and has a qualifying UK job offer that starts within the required timeframe, or under the specific overseas-income rules in Appendix FM-SE.",
            officialRule:
              'Overseas income must meet the same £29,000 threshold and is subject to the stricter specified evidence rules under Appendix FM-SE, since the Home Office needs confidence the income will continue and can transfer to a UK account.',
            example:
              'Ahmed works in China earning £40,000.\nHe has accepted a UK job starting within three months of returning.\nHis overseas salary and UK job offer may satisfy the financial requirement if the Immigration Rules are met.',
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-savings',
            question: 'Can I use savings?',
            plainEnglish:
              'Yes — cash savings above £16,000 can count, either alone or combined with income, using a set formula that converts the excess savings into an annual income-equivalent figure.',
            officialRule:
              'Savings above £16,000 are divided by 2.5 to give the income-equivalent amount; the savings must have been held for at least 6 months before the application.',
            example:
              'A couple has £29,000 in savings above the £16,000 threshold (£45,000 total).\n£29,000 ÷ 2.5 = £11,600 — this can be combined with other income to help meet the £29,000 requirement.',
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-bonuses',
            question: 'Do bonuses count?',
            plainEnglish:
              'Yes, guaranteed or regularly paid bonuses can usually be counted as part of salaried or non-salaried income, as long as they are evidenced across the required payslip period.',
            officialRule:
              'Bonus income is assessed under the same category as the income it was paid alongside (salaried or non-salaried) and must appear on payslips and the corresponding bank statements.',
            example:
              'Priya receives an annual bonus shown on her payslips and bank statements — it can be added to her base salary when calculating whether the £29,000 threshold is met.',
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-allowances',
            question: 'Do allowances count?',
            plainEnglish:
              'Some allowances count (e.g. regular employer allowances shown on payslips), but one-off or discretionary allowances that aren\'t guaranteed usually don\'t count towards the threshold.',
            officialRule:
              'Only income specified in Appendix FM-SE counts; non-contractual or one-off payments not evidenced on payslips are generally excluded.',
            example:
              "John's employer pays a fixed monthly travel allowance shown on every payslip — this can usually be included, unlike a one-off gift bonus.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-payslips',
            question: 'How many payslips?',
            plainEnglish:
              'For salaried employment, you typically need 6 months of payslips (for the same employer, at the same salary or higher) plus a corresponding personal bank statement for each month. For non-salaried or self-employed income, the period is often 12 months.',
            officialRule:
              'Salaried employment (Category A/B): 6 payslips. Non-salaried employment, self-employment, or company director income (Category C/D/F/G): the last full financial year, or sometimes 12 months of bank statements.',
            example:
              'Maria has been salaried at the same company for 8 months — she provides her last 6 payslips and matching bank statements for those months.',
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-salary-changes',
            question: 'What if my salary changes?',
            plainEnglish:
              'If your salary changed partway through the 6-month payslip period (e.g. a raise or new job), the rules for which category applies can get complicated — a recent pay rise with fewer than 6 months at the new salary may need to be assessed under different evidence rules (Category B) rather than Category A.',
            officialRule:
              'Category A applies where the same salary has been paid for at least 6 months; Category B applies where you have less than 6 months at the current salary but the income can still be annualised and evidenced with additional documents.',
            example:
              "Ahmed got a raise 3 months ago. Because he hasn't held the new salary for 6 full months, his application is assessed under Category B, using both old and new payslips plus his annualised salary.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-spouse-income',
            question: "Can my spouse's income count?",
            plainEnglish:
              "Yes — the financial requirement can be met by the sponsor's income, the applicant's own income (if already lawfully in the UK with permission to work), or a combination of both.",
            officialRule:
              "Where the applicant is in the UK with permission to work, their own UK income can be combined with the sponsor's income to meet the threshold.",
            example:
              "Fatima (the sponsor) earns £20,000 and her partner, already in the UK on a different visa with work rights, earns £12,000 — combined, they meet the £29,000 threshold.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-combine',
            question: 'Can I combine income?',
            plainEnglish:
              'Yes — different permitted income sources (salaried income, non-salaried income, savings, pension, and certain other income) can usually be combined, but each source must meet its own specific evidence requirements.',
            officialRule:
              'Combining sources is allowed under Appendix FM-SE, but non-employment income (e.g. property rental) has its own separate evidence rules that must be satisfied alongside employment evidence.',
            example:
              "John combines his £22,000 salary with £2,500/year from a buy-to-let property (evidenced by tenancy agreement and bank statements) to reach the £29,000 threshold.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-financial-bank-translation',
            question: 'Do bank statements need translating?',
            plainEnglish:
              "Yes, if they aren't in English or Welsh, you need a full certified translation for every non-English document, including bank statements.",
            officialRule:
              'A certified translation must confirm accuracy in writing, with the translator/company\'s name, signature, contact details and date. Self-translation is not accepted.',
            example:
              "Ahmed's overseas bank statements are in Mandarin — he has them professionally translated with a signed certification before submitting his application.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'relationship_evidence',
        label: 'Relationship Evidence',
        questions: [
          {
            id: 'spouse-relationship-genuine',
            question: 'How do I prove the relationship is genuine?',
            plainEnglish:
              'Through a mix of evidence showing an ongoing relationship over time — for married couples this is usually lighter, but caseworkers still look for evidence the relationship is subsisting, not just that a marriage certificate exists.',
            officialRule:
              'The relationship must be shown to be genuine and subsisting, with the couple intending to live together permanently in the UK.',
            example:
              'Maria and John submit their marriage certificate, plus photos together over 3 years, joint bills, and message logs showing regular contact during a period they lived apart for work.',
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-relationship-unmarried',
            question: 'What extra evidence do unmarried partners need?',
            plainEnglish:
              'Unmarried and same-sex partners need to show 2 years of cohabitation in a relationship akin to marriage, using documents that place both partners at the same address over that period.',
            officialRule:
              'Evidence should span the full 2-year period and typically includes joint tenancy/mortgage documents, joint bank accounts, and correspondence addressed to both partners at the same address.',
            example:
              "Priya and her partner provide a joint tenancy agreement from 2022, and utility bills in both names from 2022 through to the application date in 2024.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-relationship-marriage-certificate',
            question: 'What if I got married abroad?',
            plainEnglish:
              'A marriage certificate issued abroad is generally accepted, as long as the marriage was legally valid in the country where it took place and is recognised under UK law.',
            officialRule:
              'The marriage or civil partnership must be valid under the law of the country where it was formed, and recognised as valid in the UK.',
            example:
              "Ahmed and his wife married in Pakistan — they submit their Nikah Nama (marriage certificate) along with a certified English translation.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-relationship-previous-relationships',
            question: 'Do I need to explain previous relationships or divorces?',
            plainEnglish:
              'Yes — if either partner was previously married, you typically need to show that marriage has legally ended (e.g. a decree absolute/final divorce order) before the new marriage is valid.',
            officialRule:
              'Any previous marriage or civil partnership must have been legally dissolved before the relevant relationship for this application began, evidenced by an official decree or death certificate.',
            example:
              "Fatima was previously married — she includes her final divorce certificate to show the marriage legally ended before she married her current partner.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-relationship-time-apart',
            question: 'What if we\'ve spent time living apart (e.g. for work)?',
            plainEnglish:
              'Periods apart don\'t automatically disqualify you, but you should be ready to explain the reason and show continued contact and intention to live together during that time.',
            officialRule:
              'The relationship must still be shown to be genuine and subsisting throughout — caseworkers may ask for an explanation and supporting evidence for any significant period spent apart.',
            example:
              'John worked overseas for 8 months — the couple includes flight records of visits, regular video call logs, and a short letter explaining the temporary work arrangement.',
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'accommodation',
        label: 'Accommodation',
        questions: [
          {
            id: 'spouse-accommodation-adequate',
            question: 'What counts as "adequate" accommodation?',
            plainEnglish:
              'The property must be big enough and suitable for everyone living there (including the applicant), without breaching statutory overcrowding standards, and must be accommodation you\'re legally entitled to live in.',
            officialRule:
              'Adequacy is assessed against the overcrowding standard in the Housing Act 1985, considering the number of rooms and household members.',
            example:
              'Maria and John live in a 2-bedroom flat with no other occupants — a local authority housing report or a suitably qualified surveyor can confirm the property isn\'t overcrowded once Maria moves in.',
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-accommodation-owned-or-rented',
            question: 'Does it matter if we own, rent, or live with family?',
            plainEnglish:
              'No — owned, privately rented, or living with family/friends can all work, as long as you can prove you\'re entitled to live there and it\'s big enough for everyone.',
            officialRule:
              'Evidence should show lawful occupation (e.g. mortgage statement, tenancy agreement, or a letter of consent from the property owner if living with family).',
            example:
              "Ahmed will live with his parents after his wife arrives — they include a letter from his parents confirming permission, plus proof of the property's size.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-accommodation-inspection',
            question: 'Will someone inspect the property?',
            plainEnglish:
              'Not usually before the visa is granted — most applications are assessed on paper evidence, though a local authority housing report can be requested to support borderline cases.',
            officialRule:
              'A local authority environmental health report is optional supporting evidence, not a mandatory requirement for every application.',
            example:
              "Fatima's flat is on the smaller side, so she proactively gets a local authority report confirming it's adequate for two people, to strengthen the application.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-accommodation-future-property',
            question: 'Can I use a property we haven\'t moved into yet?',
            plainEnglish:
              'You need to show the accommodation will be available to you when the applicant arrives — a future tenancy or purchase can work if you provide firm evidence (e.g. signed tenancy starting before or on arrival).',
            officialRule:
              'The property must be available for your occupation; a tenancy agreement or purchase confirmed to start at or before the applicant\'s planned arrival date is acceptable evidence.',
            example:
              'John signs a tenancy agreement starting one month before his wife\'s expected arrival date, and includes it with the application as proof the property will be ready.',
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'children',
        label: 'Children',
        questions: [
          {
            id: 'spouse-children-included',
            question: 'Can I include my children in the same application?',
            plainEnglish:
              'Yes — dependent children under 18 can apply alongside the main applicant, as long as they meet the eligibility requirements (usually living with, or having contact with, the applicant parent).',
            officialRule:
              'Children must generally be under 18 (or turning 18 during processing, in some cases), unmarried, and not leading an independent life.',
            example:
              "Maria's two children, aged 6 and 10, apply together with her in the same visa application, each with their own application fee.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-children-income-threshold',
            question: 'Does the financial requirement go up per child?',
            plainEnglish:
              'No — since 11 April 2024, the £29,000 threshold is a flat figure that doesn\'t increase for each additional child included in the application.',
            officialRule:
              'The per-child income addition (previously an extra amount for each child after the first) was removed when the minimum income requirement changed on 11 April 2024.',
            example:
              'Ahmed applies with his wife and 2 children — the same £29,000 threshold applies, regardless of the number of children on the application.',
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-children-birth-certificate',
            question: 'What documents do I need for each child?',
            plainEnglish:
              'A full birth certificate showing both parents\' names (not a short-form certificate), and, if one parent isn\'t named or there\'s a different surname, extra proof of the legal relationship such as an adoption or custody order.',
            officialRule:
              'Short-form birth certificates that omit parental details are not accepted as sufficient proof of the parent-child relationship.',
            example:
              "Priya's daughter has a different surname from her — Priya includes the full birth certificate plus a short letter explaining the family history.",
            officialGuidance: LINKS.appendixFM,
          },
          {
            id: 'spouse-children-other-parent-consent',
            question: 'Do I need the other parent\'s consent?',
            plainEnglish:
              'If the child\'s other parent has parental responsibility and isn\'t travelling with the child, you usually need their written consent, or evidence of sole responsibility / a court order allowing the move.',
            officialRule:
              'Where sole responsibility isn\'t already established, written consent from anyone else with parental responsibility is generally required.',
            example:
              "John's ex-partner has shared custody of their son — John obtains a signed consent letter from her confirming she agrees to their son relocating to the UK.",
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'translations',
        label: 'Translations',
        questions: [
          {
            id: 'spouse-translations-certified',
            question: 'What makes a translation "certified"?',
            plainEnglish:
              'A certified translation includes a signed statement from the translator or translation company confirming it\'s an accurate translation, along with their name, signature, contact details, and the date.',
            officialRule:
              'UKVI does not require notarisation of translations, but self-translation by the applicant or a relative is not accepted.',
            example:
              "Fatima's Arabic marriage certificate is translated by a professional translation company, who provide a signed certification letter alongside the translation.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-translations-apostille',
            question: 'Do documents need to be apostilled?',
            plainEnglish:
              'Sometimes — some countries\' civil documents need to be legalised (apostilled) before UKVI will accept them, but this depends on the issuing country\'s own rules, not a blanket UK requirement.',
            officialRule:
              'Legalisation requirements vary by issuing country; check the specific process for the country where the document was issued.',
            example:
              "Ahmed's Chinese marriage certificate needs an apostille from the Chinese Ministry of Foreign Affairs before it's accepted alongside the certified translation.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-translations-which-documents',
            question: 'Which documents typically need translating?',
            plainEnglish:
              'Any document not in English or Welsh — commonly marriage certificates, birth certificates, bank statements, and payslips issued in another language.',
            officialRule: 'Every non-English/Welsh document submitted as evidence must have a full certified translation attached.',
            example:
              "Maria's Portuguese bank statements and Brazilian marriage certificate both need certified English translations before submission.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'tb_tests',
        label: 'TB Tests',
        questions: [
          {
            id: 'spouse-tb-who-needs',
            question: 'Do I need a TB test?',
            plainEnglish:
              'You need a TB test if you\'re applying to stay in the UK for more than 6 months and you\'ve been living in one of the listed countries (around 70 countries) for more than 6 months.',
            officialRule: 'The requirement applies based on recent residence in a listed country, not nationality — check the current country list before applying.',
            example:
              'Priya has lived in India (a listed country) for the past year and is applying for a visa longer than 6 months — she needs a TB test before applying.',
            officialGuidance: LINKS.tbTest,
          },
          {
            id: 'spouse-tb-where',
            question: 'Where can I get tested?',
            plainEnglish:
              'Only at a Home Office-approved clinic in your country — tests from other clinics or GPs are not accepted.',
            officialRule: 'The approved clinic list is published on gov.uk and varies by country; using a non-approved clinic will result in your certificate being rejected.',
            example:
              "Ahmed checks the approved clinic list for his country on gov.uk before booking his TB test appointment.",
            officialGuidance: LINKS.tbTest,
          },
          {
            id: 'spouse-tb-validity',
            question: 'How long is the certificate valid?',
            plainEnglish: 'A TB certificate is generally valid for 6 months from the date of the test.',
            officialRule: 'You must apply for your visa within 6 months of the date on your TB certificate.',
            example:
              'Fatima gets tested in January and makes sure to submit her visa application before it expires in July.',
            officialGuidance: LINKS.tbTest,
          },
        ],
      },
      {
        key: 'english_test',
        label: 'English Test',
        questions: [
          {
            id: 'spouse-english-level',
            question: 'What English level do I need?',
            plainEnglish:
              'For the initial spouse visa, you need at least CEFR level A1 in speaking and listening; this requirement steps up at the extension stage (A2) and settlement stage (B1).',
            officialRule: 'A1 (initial), A2 (extension), and B1 (settlement) are assessed using an approved Secure English Language Test (SELT).',
            example:
              "John takes an approved A1-level SELT test before his first spouse visa application, and will need to pass an A2 test at extension stage.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'spouse-english-exempt',
            question: 'Am I exempt from the English requirement?',
            plainEnglish:
              'You may be exempt if you\'re a national of a majority English-speaking country, hold a degree taught in English, or have a long-term physical or mental condition that prevents you from meeting the requirement.',
            officialRule: 'Exemption categories are defined in the Immigration Rules and require supporting evidence (e.g. degree certificate with an official UK ENIC statement, or medical evidence).',
            example:
              "Maria holds a degree taught in English, verified by UK ENIC, so she's exempt from taking a separate SELT test.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'spouse-english-approved-test',
            question: 'Which test providers are accepted?',
            plainEnglish: 'Only tests from providers on the Home Office\'s approved SELT list count — general IELTS/TOEFL certificates not taken through an approved UKVI-specific test don\'t automatically qualify.',
            officialRule: 'The approved provider and test list is published and updated on gov.uk — check it before booking.',
            example:
              "Ahmed books an IELTS for UKVI test (the UKVI-specific version) rather than a standard academic IELTS test, to make sure it's accepted.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'spouse-english-validity',
            question: 'How long is my English test valid?',
            plainEnglish: 'SELT results are generally valid for 2 years from the test date for immigration purposes.',
            officialRule: 'Check the specific validity period stated by the test provider and gov.uk, as it can vary by test type.',
            example:
              'Priya took her test 18 months ago — it\'s still valid for her upcoming application, but she\'ll need to retest before her extension in 3 years.',
            officialGuidance: LINKS.approvedEnglishTests,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'spouse-biometrics-what',
            question: 'What happens at my biometrics appointment?',
            plainEnglish: 'You provide a digital photo and fingerprint scan at a visa application centre (outside the UK) or via the UK Immigration: ID Check app or a service point (inside the UK).',
            officialRule: 'Biometric enrolment is a mandatory part of the application process before a decision can be made.',
            example:
              'Fatima books her biometrics appointment at her local visa application centre shortly after submitting her online application.',
            officialGuidance: LINKS.brp,
          },
          {
            id: 'spouse-biometrics-when',
            question: 'When should I book my biometrics appointment?',
            plainEnglish: 'As soon as possible after submitting your online application — processing time is usually counted from this appointment, not the online submission date.',
            officialRule: 'Processing time targets are measured from the date biometrics are enrolled, not the online form submission date.',
            example:
              "John submits his form on 1 March but doesn't attend biometrics until 10 March — his processing clock starts from 10 March.",
            officialGuidance: LINKS.processingTimesOutside,
          },
          {
            id: 'spouse-biometrics-inside-uk',
            question: 'What if I\'m applying from inside the UK?',
            plainEnglish: 'You can usually use the UK Immigration: ID Check smartphone app to scan your passport and take a photo, without needing to visit a service point in person, if you have a biometric passport.',
            officialRule: 'Availability of the app-only route depends on your passport type and application category — some applicants still need an in-person appointment.',
            example:
              'Ahmed, applying to switch into the spouse route from inside the UK, uses the ID Check app to complete his biometrics from home.',
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'spouse-processing-outside-standard',
            question: 'How long does a standard application take from outside the UK?',
            plainEnglish: 'The service standard is 12 weeks (60 working days) from your biometrics appointment, though many cases are decided faster.',
            officialRule: '12-week service standard for settlement-route entry clearance applications from outside the UK.',
            example:
              "Maria's biometrics are on 1 May — under the standard service, her decision is targeted for around late July.",
            officialGuidance: LINKS.processingTimesOutside,
          },
          {
            id: 'spouse-processing-outside-priority',
            question: 'What does priority service get me?',
            plainEnglish: 'Priority service targets a decision within 30 working days from outside the UK, for an extra fee.',
            officialRule: '30 working day target for priority service on spouse/family applications from outside the UK — this is a target, not a guarantee.',
            example:
              "John pays for priority service and gets his decision in about 6 weeks, instead of the standard 12.",
            officialGuidance: LINKS.priorityService,
          },
          {
            id: 'spouse-processing-inside-uk',
            question: 'What about applying from inside the UK?',
            plainEnglish: 'The standard service target inside the UK is 8 weeks (40 working days); the family priority service inside the UK targets a decision by the next working day.',
            officialRule: '8-week standard service inside the UK; next-working-day priority service for eligible family applications (a much faster tier than the 5-working-day priority used for other routes).',
            example:
              'Priya switches into the spouse route from inside the UK using priority service and gets a decision the next working day after her appointment.',
            officialGuidance: LINKS.processingTimesInside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'spouse-decision-how-notified',
            question: 'How will I find out the decision?',
            plainEnglish: 'You\'ll get an email or letter notifying you of the outcome, and your immigration status will be available digitally as an eVisa if approved.',
            officialRule: 'Decisions are communicated via the online account used to apply, plus email notification.',
            example:
              "Fatima receives an email telling her to check her UKVI account, where she finds her application has been approved.",
            officialGuidance: LINKS.evisa,
          },
          {
            id: 'spouse-decision-conditions',
            question: 'What conditions come with the visa?',
            plainEnglish: 'You\'ll usually be granted with permission to work, and typically no recourse to public funds (you can\'t claim most benefits) unless a fee waiver was granted.',
            officialRule: 'Standard spouse visa conditions include a "no recourse to public funds" condition unless specifically lifted.',
            example:
              'Ahmed checks his eVisa conditions online and confirms he has permission to work but no access to public funds.',
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'spouse-after-evisa',
            question: 'What do I do once I\'m approved?',
            plainEnglish: 'Create or sign in to your UKVI account and link your eVisa using the passport you applied with, then check your details are correct.',
            officialRule: 'Your immigration status is stored digitally as an eVisa — there is no physical vignette or BRP for most new grants.',
            example:
              "Maria signs in to gov.uk/evisa using GOV.UK One Login and links her new spouse visa to her account within a few days of approval.",
            officialGuidance: LINKS.evisa,
          },
          {
            id: 'spouse-after-travel',
            question: 'When can I travel to the UK?',
            plainEnglish: 'You can usually travel any time within the validity of your entry clearance vignette or eVisa, but check the specific start date on your decision.',
            officialRule: 'Entry clearance is valid from the date stated in your decision — travelling outside that window can cause issues at the border.',
            example:
              "John's visa is valid from 1 June — he books his flight for 3 June to be safely within the validity window.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'spouse-refusal-financial',
            question: 'Why do financial requirement refusals happen?',
            plainEnglish: 'Usually because the evidence didn\'t clearly show the £29,000 threshold, or covered the wrong period (e.g. fewer than 6 payslips, or a gap in bank statements).',
            officialRule: 'Evidence must strictly follow the Appendix FM-SE format and period requirements — near misses are still refused.',
            example:
              "Fatima's application is refused because 2 months of bank statements were missing — she reapplies with the complete, correctly dated set.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'spouse-refusal-relationship',
            question: 'Why do relationship-based refusals happen?',
            plainEnglish: 'When the caseworker isn\'t satisfied the relationship is genuine and subsisting — often due to thin evidence, inconsistencies, or gaps in contact history.',
            officialRule: 'The burden is on the applicant to demonstrate, on the balance of probabilities, that the relationship is genuine.',
            example:
              "Ahmed's first application is refused for limited evidence of contact during a year apart — he reapplies with message logs, call records, and visit evidence.",
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'spouse-appeals-right',
            question: 'Do I have a right of appeal?',
            plainEnglish: 'Many spouse visa refusals do carry a right of appeal, since family life (Article 8) human rights grounds are usually engaged — check your decision letter to confirm.',
            officialRule: 'Refusal letters state whether a right of appeal applies and the deadline to lodge it.',
            example:
              'Maria\'s refusal letter confirms she has a right of appeal to the First-tier Tribunal, with a deadline to lodge it.',
            officialGuidance: LINKS.appeal,
          },
          {
            id: 'spouse-appeals-vs-review',
            question: 'Appeal or Administrative Review — which applies?',
            plainEnglish: 'Spouse visa refusals are more likely to carry appeal rights than Administrative Review rights (which are mainly for points-based work/study routes) — always check your specific letter.',
            officialRule: 'Only one route usually applies to a given decision — your refusal letter will specify which.',
            example:
              "John's letter confirms an appeal right rather than an Administrative Review, so he prepares his appeal bundle within the stated deadline.",
            officialGuidance: LINKS.appeal,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── STUDENT VISA ─────────────────────────────
  {
    type: 'student',
    icon: 'award',
    label: 'Student Visa',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'student-before-cas',
            question: 'What is a CAS and do I need one?',
            plainEnglish: 'A Confirmation of Acceptance for Studies (CAS) is a unique reference number your university/college issues once they\'ve offered you an unconditional place — you need it to apply.',
            officialRule: 'The CAS must be assigned by a licensed Student sponsor and used within the validity period stated on it.',
            example:
              'Priya receives her CAS from her university 3 months before her course starts and applies for her visa shortly after.',
            officialGuidance: LINKS.studentVisa,
          },
          {
            id: 'student-before-when-to-apply',
            question: 'When can I apply?',
            plainEnglish: 'Up to 6 months before your course starts if applying from outside the UK, or up to 9 months before if you\'re inside the UK extending/switching.',
            officialRule: 'Applications submitted before the earliest permitted window will be rejected as premature.',
            example:
              "Ahmed's course starts in September — he applies in April, within the 6-month window for applicants outside the UK.",
            officialGuidance: LINKS.studentVisa,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'student-financial-amount',
            question: 'How much money do I need to show?',
            plainEnglish: "£1,483 per month for courses in London, or £1,136 per month for courses outside London, to cover living costs — on top of your tuition/accommodation fees already paid to the CAS sponsor.",
            officialRule: 'Figures apply for applications from 2 January 2025 onward — the exact number of months depends on how much of the course length is covered (up to a maximum of 9 months).',
            example:
              'Maria is studying a 1-year course in Manchester (outside London) — she shows at least £1,136 × 9 = £10,224 in maintenance funds.',
            officialGuidance: LINKS.studentMoney,
          },
          {
            id: 'student-financial-28-days',
            question: 'What is the "28-day rule"?',
            plainEnglish: 'Your funds need to be held continuously for at least 28 days, and the closing balance date on your bank statement must be within 31 days of your application date.',
            officialRule: 'If the balance dips below the required amount at any point during the 28-day period, the application will be refused on financial grounds.',
            example:
              "John's balance briefly dropped below the threshold on day 15 of his 28-day period — his application is refused, and he waits until a fresh, unbroken 28-day period passes before reapplying.",
            officialGuidance: LINKS.studentMoney,
          },
          {
            id: 'student-financial-sponsor-covers',
            question: 'What if my sponsor/university already confirmed they cover my costs?',
            plainEnglish: 'If your CAS states your sponsor is covering fees and/or living costs (an "official financial sponsor" like a government or your institution), you may not need to separately prove maintenance funds.',
            officialRule: 'Only sponsorship from an accepted official financial sponsor (not a private individual) qualifies for this exemption.',
            example:
              "Fatima's government scholarship is named on her CAS as covering all her costs, so she doesn't need to submit personal bank statements.",
            officialGuidance: LINKS.studentMoney,
          },
          {
            id: 'student-financial-account-type',
            question: 'What type of account can I use?',
            plainEnglish: 'A personal bank or building society account (or savings account) in your own name, or your parent\'s/legal guardian\'s name with a signed consent letter, generally works — some account/currency types are excluded.',
            officialRule: 'Certain account types (e.g. some overseas informal savings schemes) are not accepted — check the acceptable financial institutions and account rules.',
            example:
              "Ahmed's savings are in his mother's account — he includes a signed letter of consent from her plus proof of their relationship.",
            officialGuidance: LINKS.studentMoney,
          },
          {
            id: 'student-financial-translation',
            question: 'Do my bank statements need translating?',
            plainEnglish: 'Yes, if they\'re not in English, they need a certified translation, following the same certified-translation rules used across UK visa applications.',
            officialRule: 'Self-translation is not accepted; a signed certification from the translator/company is required.',
            example:
              "Priya's bank statements are in Hindi — she has them professionally translated with a certification letter before applying.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'translations',
        label: 'Translations',
        questions: [
          {
            id: 'student-translations-academic',
            question: 'Do my academic documents need translating?',
            plainEnglish: 'Yes, any academic transcripts or certificates not in English need a certified translation to be considered as evidence.',
            officialRule: 'The same certified-translation standard applies to academic evidence as to financial and personal documents.',
            example:
              "John's diploma is in French — he submits a certified English translation alongside the original.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'tb_tests',
        label: 'TB Tests',
        questions: [
          {
            id: 'student-tb-who-needs',
            question: 'Do students need a TB test?',
            plainEnglish: 'If you\'re coming for more than 6 months and have been living in one of the listed countries for more than 6 months, yes.',
            officialRule: 'The requirement is based on recent residence in a listed country, not nationality.',
            example:
              'Maria has lived in Nigeria (a listed country) for the past 2 years and is applying for a 3-year course — she needs a TB test.',
            officialGuidance: LINKS.tbTest,
          },
        ],
      },
      {
        key: 'english_test',
        label: 'English Test',
        questions: [
          {
            id: 'student-english-level',
            question: 'What English level do I need?',
            plainEnglish: 'Typically CEFR B2 for degree-level study, or B1 for below-degree-level courses, though many students meet this through their course offer itself rather than a separate SELT.',
            officialRule: 'If your course provider is a Higher Education Provider with a track record, they can usually assess your English themselves instead of requiring a separate SELT.',
            example:
              "Ahmed's university confirms it has assessed his English as meeting the required level, so he doesn't need to book a separate SELT test.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'student-english-exempt',
            question: 'Am I exempt from proving English ability?',
            plainEnglish: 'You may be exempt if you\'re a national of a majority English-speaking country, or previously studied a UK degree-level (or higher) qualification taught in English.',
            officialRule: 'Exemptions require specific supporting evidence, such as a UK ENIC statement for a prior qualification.',
            example:
              "Fatima previously completed a bachelor's degree in the UK, so she's exempt from a new SELT test for her master's application.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'student-biometrics-when',
            question: 'When do I do biometrics?',
            plainEnglish: 'Shortly after your online application, at a visa application centre (outside the UK) or via the ID Check app/service point (inside the UK).',
            officialRule: 'Processing time targets are measured from your biometric enrolment date.',
            example:
              'Priya submits her form on 1 June and attends her biometrics appointment on 5 June — her processing clock starts on 5 June.',
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'student-processing-outside',
            question: 'How long from outside the UK?',
            plainEnglish: 'The standard service target is 3 weeks (15 working days); priority service targets 5 working days for an extra fee.',
            officialRule: '15 working day standard target, 5 working day priority target, from outside the UK.',
            example:
              "John's biometrics are on 1 August — under standard service, his decision is targeted for around 22 August.",
            officialGuidance: LINKS.processingTimesOutside,
          },
          {
            id: 'student-processing-inside',
            question: 'How long from inside the UK?',
            plainEnglish: 'The standard service target inside the UK is 8 weeks (40 working days); priority service targets 5 working days.',
            officialRule: '40 working day standard target inside the UK for extensions/switching.',
            example:
              'Ahmed switches from a graduate visa to a new student visa inside the UK and gets his decision in about 3 weeks using priority service.',
            officialGuidance: LINKS.processingTimesInside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'student-decision-conditions',
            question: 'What conditions come with a student visa?',
            plainEnglish: 'You\'ll usually be permitted limited part-time work (commonly up to 20 hours/week in term time, unlimited in vacations) depending on your course level, and no access to public funds.',
            officialRule: 'Exact work hour limits depend on your specific course level and sponsor category — check your eVisa conditions.',
            example:
              "Fatima checks her eVisa and confirms she's permitted to work up to 20 hours per week during term time.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'student-after-evisa',
            question: 'What do I do once approved?',
            plainEnglish: 'Link your eVisa via your UKVI account using the passport you applied with, and check your course sponsor and conditions are correctly recorded.',
            officialRule: 'Your immigration status and conditions (including work hour limits) are recorded digitally on your eVisa.',
            example:
              'Maria links her eVisa as soon as she receives her decision, and double-checks her sponsor details match her university.',
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'student-refusal-maintenance',
            question: 'Why do maintenance fund refusals happen?',
            plainEnglish: 'Usually because the balance dropped below the required amount at some point in the 28-day period, or the closing balance date was outside the 31-day window before application.',
            officialRule: 'Even a brief dip below the threshold during the 28-day period results in refusal — there\'s no partial credit.',
            example:
              "John's balance dropped for 2 days mid-period due to a large payment — his application is refused, and he waits for a fresh unbroken 28-day period before reapplying.",
            officialGuidance: LINKS.studentMoney,
          },
          {
            id: 'student-refusal-genuine-student',
            question: 'What is a "genuine student" refusal?',
            plainEnglish: 'When the caseworker isn\'t convinced you genuinely intend to study and then leave the UK afterwards — often linked to unclear study plans, a poor academic progression history, or previous immigration issues.',
            officialRule: 'Caseworkers assess credibility factors including your study history, ties to your home country, and consistency of your explanations.',
            example:
              "Ahmed's application is refused over genuine student concerns due to a large gap in his study history — he reapplies with a clear personal statement explaining the gap and his study plans.",
            officialGuidance: LINKS.studentVisa,
          },
          {
            id: 'student-refusal-cas-issues',
            question: 'What CAS problems cause refusals?',
            plainEnglish: 'An expired CAS, or course/institution details on the CAS not matching the application, are common technical refusal reasons.',
            officialRule: 'The CAS details must exactly match your application and be used within its validity window.',
            example:
              "Priya's CAS expired before she applied — her sponsor issues a new CAS, and she reapplies promptly.",
            officialGuidance: LINKS.studentVisa,
          },
          {
            id: 'student-refusal-english',
            question: 'Why would English test evidence cause a refusal?',
            plainEnglish: 'If the SELT wasn\'t from an approved provider, or was below the required CEFR level for your course, this can lead to refusal.',
            officialRule: 'Only approved SELT providers and correct CEFR levels are accepted as evidence.',
            example:
              "Fatima's test was from a non-approved provider — she retakes an approved test before reapplying.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'student-appeals-admin-review',
            question: 'Can I get an Administrative Review?',
            plainEnglish: 'Yes — most student visa refusals are eligible for Administrative Review rather than a full appeal, which checks for case-working errors only.',
            officialRule: 'Request within 14 days if in the UK, or 28 days if overseas; only reviews whether the original decision applied the rules correctly, not new evidence.',
            example:
              "Ahmed believes the caseworker miscounted his bank statement period — he requests an Administrative Review within 14 days.",
            officialGuidance: LINKS.adminReview,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── SKILLED WORKER ─────────────────────────────
  {
    type: 'skilled_worker',
    icon: 'briefcase',
    label: 'Skilled Worker',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'sw-before-cos',
            question: 'What is a Certificate of Sponsorship (CoS)?',
            plainEnglish: 'A unique reference number your employer (a licensed sponsor) assigns you, confirming the job details — job title, SOC code, and salary — that your visa application is based on.',
            officialRule: 'The CoS must be assigned by an employer holding a valid sponsor licence for the relevant route.',
            example:
              "John's employer assigns his CoS with the job title, SOC code, and salary matching his signed employment contract.",
            officialGuidance: LINKS.skilledWorkerVisa,
          },
          {
            id: 'sw-before-eligible-job',
            question: 'How do I know if my job qualifies?',
            plainEnglish: 'The role needs to be on the list of eligible occupations at the required skill level, and pay at least the general salary threshold or the specific "going rate" for that occupation code, whichever is higher.',
            officialRule: 'Eligible occupations and going rates are published and updated periodically on gov.uk.',
            example:
              "Maria's employer checks her job's SOC code against the published going rate table before assigning her CoS.",
            officialGuidance: LINKS.skilledWorkerVisa,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'sw-financial-savings',
            question: 'Do I need to show savings?',
            plainEnglish: 'Only if your sponsor hasn\'t certified maintenance for you on your CoS — in that case, you need £1,270 held for 28 days.',
            officialRule: 'If your CoS confirms your sponsor is certifying maintenance (common for most licensed sponsors), you don\'t need to separately show personal savings.',
            example:
              "Ahmed's employer certifies maintenance on his CoS, so he doesn't need to submit his own bank statements.",
            officialGuidance: LINKS.skilledWorkerFinance,
          },
          {
            id: 'sw-financial-28-days',
            question: 'How long do savings need to be held?',
            plainEnglish: 'Continuously for at least 28 days, with the closing balance date within 31 days of your application.',
            officialRule: 'The £1,270 balance must not dip below the threshold at any point during the 28-day period.',
            example:
              "Priya keeps £1,270 untouched in her account for a full 28-day period before applying, to avoid any risk of dipping below the threshold.",
            officialGuidance: LINKS.skilledWorkerFinance,
          },
        ],
      },
      {
        key: 'translations',
        label: 'Translations',
        questions: [
          {
            id: 'sw-translations-documents',
            question: 'What documents commonly need translating?',
            plainEnglish: 'Bank statements, degree certificates, or professional registration documents not in English.',
            officialRule: 'Certified translations are required for all non-English/Welsh supporting documents.',
            example:
              "Fatima's professional qualification certificate is in Spanish — she includes a certified English translation.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'tb_tests',
        label: 'TB Tests',
        questions: [
          {
            id: 'sw-tb-who-needs',
            question: 'Do I need a TB test?',
            plainEnglish: 'If you\'re coming for more than 6 months and have lived in a listed country for more than 6 months recently, yes.',
            officialRule: 'Requirement is based on recent country of residence, not nationality.',
            example:
              'John has lived in Ghana for 3 years and is applying for a 3-year Skilled Worker visa — he needs a TB test.',
            officialGuidance: LINKS.tbTest,
          },
        ],
      },
      {
        key: 'english_test',
        label: 'English Test',
        questions: [
          {
            id: 'sw-english-level',
            question: 'What English level is required?',
            plainEnglish: 'CEFR B1 in all four components (reading, writing, speaking, listening), unless you\'re exempt.',
            officialRule: 'B1 level via an approved SELT, a degree taught in English, or nationality of a majority English-speaking country.',
            example:
              "Maria is a national of a majority English-speaking country, so she's automatically exempt from a SELT test.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'sw-biometrics-when',
            question: 'When do I complete biometrics?',
            plainEnglish: 'Soon after your online application — this date starts your processing clock.',
            officialRule: 'Processing time targets run from the biometric enrolment date, not the online submission date.',
            example:
              "Ahmed applies online on 1 April and completes biometrics on 4 April — his processing target starts from 4 April.",
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'sw-processing-outside',
            question: 'How long from outside the UK?',
            plainEnglish: 'Standard service targets 3 weeks (15 working days); priority service targets 5 working days.',
            officialRule: '15 working day standard, 5 working day priority, from outside the UK.',
            example:
              'Priya applies from outside the UK with priority service and gets her decision within a week.',
            officialGuidance: LINKS.processingTimesOutside,
          },
          {
            id: 'sw-processing-inside',
            question: 'How long from inside the UK?',
            plainEnglish: 'Standard service targets 8 weeks (40 working days); priority service targets 5 working days.',
            officialRule: '40 working day standard target inside the UK.',
            example:
              "John switches employer sponsorship from inside the UK and receives his decision in about 5 working days using priority service.",
            officialGuidance: LINKS.processingTimesInside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'sw-decision-tied-to-employer',
            question: 'Is my visa tied to my employer?',
            plainEnglish: 'Yes — your permission is linked to the specific sponsor and job on your CoS; changing employer or role usually requires a new CoS and application.',
            officialRule: 'A significant change in employer, job, or salary generally requires a new Skilled Worker application.',
            example:
              "Fatima changes employer and her new company issues a fresh CoS — she submits a new application rather than just notifying the old one.",
            officialGuidance: LINKS.skilledWorkerVisa,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'sw-after-evisa',
            question: 'What do I do once approved?',
            plainEnglish: 'Link your eVisa to your UKVI account, and generate a right-to-work share code to give your employer before you start.',
            officialRule: 'Employers are required to check right-to-work status, typically via a share code generated from your eVisa account.',
            example:
              'Ahmed generates a right-to-work share code and emails it to his new employer\'s HR team before his start date.',
            officialGuidance: LINKS.viewProve,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'sw-refusal-cos',
            question: 'Why do CoS-related refusals happen?',
            plainEnglish: 'Expired CoS, or a mismatch between the CoS details (job title, SOC code, salary) and what\'s stated elsewhere in the application.',
            officialRule: 'CoS details must exactly match the application and remain within their validity period.',
            example:
              "Maria's CoS listed a slightly different job title than her contract — her employer issues a corrected CoS before she reapplies.",
            officialGuidance: LINKS.skilledWorkerVisa,
          },
          {
            id: 'sw-refusal-salary',
            question: 'Why do salary threshold refusals happen?',
            plainEnglish: 'If the salary on the CoS falls below the general threshold or the specific going rate for the role\'s SOC code.',
            officialRule: 'The higher of the general threshold or the going rate for the specific occupation applies.',
            example:
              "John's employer checks the going rate table and confirms his salary meets the higher of the two thresholds before reapplying.",
            officialGuidance: LINKS.skilledWorkerFinance,
          },
          {
            id: 'sw-refusal-genuine-vacancy',
            question: 'What is a "genuine vacancy" refusal?',
            plainEnglish: 'When the caseworker doubts the role is a genuine vacancy needing your specific skills, sometimes linked to sponsor compliance concerns.',
            officialRule: 'Caseworkers can refuse where they aren\'t satisfied the role and organisational need are genuine.',
            example:
              "Priya's sponsor provides additional evidence of the business need for the role after an initial genuine vacancy concern was raised.",
            officialGuidance: LINKS.skilledWorkerVisa,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'sw-appeals-admin-review',
            question: 'Can I request an Administrative Review?',
            plainEnglish: 'Yes — Skilled Worker refusals are generally eligible for Administrative Review, which checks for case-working errors only.',
            officialRule: 'Request within 14 days (in the UK) or 28 days (overseas) of the decision.',
            example:
              "Ahmed's employer confirms the caseworker misread the going rate table — he requests an Administrative Review within the deadline.",
            officialGuidance: LINKS.adminReview,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── VISITOR VISA ─────────────────────────────
  {
    type: 'visitor',
    icon: 'send',
    label: 'Visitor Visa',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'visitor-before-purpose',
            question: 'What can I do on a Standard Visitor visa?',
            plainEnglish: 'Tourism, visiting family/friends, some business activities, short courses of study, and certain medical treatment — but not paid or unpaid work for a UK business, and not living in the UK long-term.',
            officialRule: 'Permitted activities are defined in the Immigration Rules Appendix Visitor — activities outside this list are not allowed.',
            example:
              'Maria visits her sister in London for 3 weeks and attends a short business meeting while there — both are permitted visitor activities.',
            officialGuidance: LINKS.visitorVisa,
          },
          {
            id: 'visitor-before-length',
            question: 'How long can I stay?',
            plainEnglish: 'Typically up to 6 months per visit; longer-validity visas (2, 5, or 10 years) allow multiple visits, but each individual stay is still capped at 6 months.',
            officialRule: 'The 6-month limit applies per visit, regardless of the overall visa validity period.',
            example:
              "Ahmed has a 5-year multiple-entry visa but stays no longer than 6 months on each individual trip.",
            officialGuidance: LINKS.visitorVisa,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'visitor-financial-funds',
            question: 'How much money do I need to show?',
            plainEnglish: 'Enough to cover your trip (travel, accommodation, and living costs) without working or relying on public funds — there\'s no fixed published amount, so evidence should be proportionate to your planned stay.',
            officialRule: 'You must show you can maintain and accommodate yourself and any dependants without recourse to public funds or unauthorised work.',
            example:
              "John shows 3 months of bank statements with a stable balance well above his estimated trip costs for a 2-week visit.",
            officialGuidance: LINKS.visitorVisa,
          },
          {
            id: 'visitor-financial-sponsor',
            question: 'Can someone else pay for my trip?',
            plainEnglish: 'Yes — a friend or family member in the UK can sponsor your visit, but you should include a letter of invitation and their evidence of ability to support you.',
            officialRule: 'Third-party sponsorship evidence should show the sponsor\'s relationship to you and their financial ability to support the visit.',
            example:
              "Fatima's UK-based brother sends a letter of invitation along with his bank statements confirming he'll cover her accommodation and costs.",
            officialGuidance: LINKS.visitorVisa,
          },
        ],
      },
      {
        key: 'accommodation',
        label: 'Accommodation',
        questions: [
          {
            id: 'visitor-accommodation-proof',
            question: 'Do I need to prove where I\'ll stay?',
            plainEnglish: 'It helps to show a hotel booking, or an invitation letter from whoever you\'re staying with, even though it\'s not always a strict mandatory document.',
            officialRule: 'Caseworkers consider your accommodation plans as part of assessing whether your visit is genuine and adequately funded.',
            example:
              "Priya includes her hotel booking confirmation for the first week and her friend's invitation letter for the remainder of her stay.",
            officialGuidance: LINKS.visitorVisa,
          },
        ],
      },
      {
        key: 'translations',
        label: 'Translations',
        questions: [
          {
            id: 'visitor-translations',
            question: 'Do my documents need translating?',
            plainEnglish: 'Yes, any supporting document not in English or Welsh needs a certified translation.',
            officialRule: 'Certified translation standard applies the same way as other visa categories.',
            example:
              "Ahmed's employer letter is in Arabic — he includes a certified English translation with his application.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'visitor-biometrics',
            question: 'Do I need to give biometrics?',
            plainEnglish: 'Yes, most visitor visa applicants need to attend a visa application centre to provide fingerprints and a photo.',
            officialRule: 'Biometric enrolment is mandatory before a decision is made, except for certain nationalities eligible for eVisitor arrangements.',
            example:
              'Maria books her biometrics appointment at her nearest visa application centre shortly after applying online.',
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'visitor-processing',
            question: 'How long does a Standard Visitor visa take?',
            plainEnglish: 'Standard service targets 3 weeks (15 working days) from outside the UK; priority service targets 5 working days for an extra fee.',
            officialRule: '15 working day standard target, 5 working day priority target.',
            example:
              "John applies 6 weeks before his trip using standard service, comfortably within the processing window.",
            officialGuidance: LINKS.processingTimesOutside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'visitor-decision-conditions',
            question: 'What conditions apply if approved?',
            plainEnglish: 'No work, no access to public funds, and you must not intend to live in the UK for extended periods through frequent or lengthy visits.',
            officialRule: 'Repeated long visits can raise concerns you\'re using visitor status to live in the UK, which can affect future applications.',
            example:
              "Fatima checks her eVisa conditions and confirms she's permitted to visit for tourism only, with no work rights.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'visitor-after-evisa',
            question: 'What do I do once approved?',
            plainEnglish: 'Link your eVisa to a UKVI account before you travel, so border staff and airlines can check your status if asked.',
            officialRule: 'Most new visitor visas are issued as eVisas rather than physical vignettes.',
            example:
              'Ahmed links his eVisa a few days before his flight and keeps his UKVI account details handy for the airport.',
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'visitor-refusal-ties',
            question: 'Why do "ties to home country" refusals happen?',
            plainEnglish: 'When the caseworker isn\'t convinced you\'ll leave the UK at the end of your visit, often due to limited evidence of job, property, or family ties back home.',
            officialRule: 'Caseworkers assess your personal circumstances holistically to judge the credibility of a genuine, temporary visit.',
            example:
              "Priya's reapplication includes her employment contract, property deed, and her children's school enrolment to show strong ties to her home country.",
            officialGuidance: LINKS.visitorVisa,
          },
          {
            id: 'visitor-refusal-history',
            question: 'Does previous immigration history affect refusals?',
            plainEnglish: 'Yes — a past overstay, visa refusal, or breach of conditions (in the UK or elsewhere) can count against a new application if not properly addressed.',
            officialRule: 'Immigration history is a relevant factor caseworkers weigh when assessing credibility.',
            example:
              "John previously overstayed briefly on an old visa — he includes a clear explanation and evidence of full compliance since then.",
            officialGuidance: LINKS.visitorVisa,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'visitor-appeals-limited',
            question: 'Can I appeal a Visitor visa refusal?',
            plainEnglish: 'Most Standard Visitor refusals don\'t carry a right of appeal or Administrative Review — reapplying with stronger evidence is usually the main option.',
            officialRule: 'Statutory appeal rights for visitor refusals are limited to specific circumstances (e.g. human rights grounds) — check your decision letter.',
            example:
              "Fatima's refusal letter confirms no appeal right applies, so she prepares a stronger reapplication addressing the reasons given.",
            officialGuidance: LINKS.appeal,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── CHILD VISA ─────────────────────────────
  {
    type: 'child',
    icon: 'user-plus',
    label: 'Child Visa',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'child-before-who',
            question: 'Who can apply as a dependent child?',
            plainEnglish: 'A child under 18 (unmarried, not living an independent life) whose parent is applying for, or already has, permission to be in the UK on a route that allows dependants.',
            officialRule: 'The child must generally apply at the same time as, or after, their parent — not as a standalone applicant unless joining a parent already in the UK.',
            example:
              "Maria's 8-year-old son applies as a dependant alongside her Skilled Worker visa application.",
            officialGuidance: LINKS.childVisa,
          },
          {
            id: 'child-before-both-parents',
            question: 'Do both parents need to be involved?',
            plainEnglish: 'If only one parent is relocating with the child, you usually need consent from anyone else with parental responsibility, or evidence of sole responsibility.',
            officialRule: 'Where sole responsibility isn\'t already established, written consent from the other parent (or anyone else with parental responsibility) is required.',
            example:
              "Ahmed has sole custody of his daughter under a court order, so he includes that order instead of seeking consent from her other parent.",
            officialGuidance: LINKS.childVisa,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'child-financial-threshold',
            question: 'Does a child add to the financial requirement?',
            plainEnglish: 'For the family (spouse) route, no extra amount is added per child since the 2024 rule change — the flat £29,000 threshold covers the whole family application.',
            officialRule: 'The per-child income addition was removed when the minimum income requirement changed on 11 April 2024.',
            example:
              "Priya applies with her husband and their 2 children under the same £29,000 threshold, with no extra amount required per child.",
            officialGuidance: LINKS.appendixFMSE,
          },
          {
            id: 'child-financial-worker-student',
            question: 'What about children of Skilled Worker or Student visa holders?',
            plainEnglish: 'An extra maintenance amount per child is generally required for dependants on work and study routes, in addition to the main applicant\'s own funds.',
            officialRule: 'Additional maintenance funds are required per dependant, held for the same 28-day period as the main applicant.',
            example:
              "John's Skilled Worker application includes his son as a dependant, so he shows the extra required maintenance amount per child on top of his own.",
            officialGuidance: LINKS.skilledWorkerFinance,
          },
        ],
      },
      {
        key: 'relationship_evidence',
        label: 'Relationship Evidence',
        questions: [
          {
            id: 'child-relationship-birth-certificate',
            question: 'What proves my relationship to the child?',
            plainEnglish: 'A full birth certificate naming both parents (not a short-form certificate), or an adoption/court order if the family situation is different.',
            officialRule: 'Short-form certificates without parental details are not accepted as sufficient standalone proof.',
            example:
              "Fatima's daughter's birth certificate names both parents — she includes the full-form version rather than the short-form copy she initially had.",
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'accommodation',
        label: 'Accommodation',
        questions: [
          {
            id: 'child-accommodation',
            question: 'Does the accommodation need to fit the child too?',
            plainEnglish: 'Yes — the property must be adequate for everyone who will live there, including any children joining the application.',
            officialRule: 'Overcrowding standards under the Housing Act 1985 apply to the whole household, including dependent children.',
            example:
              "Ahmed's 2-bedroom flat comfortably fits him, his wife, and their child without breaching overcrowding standards.",
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'translations',
        label: 'Translations',
        questions: [
          {
            id: 'child-translations',
            question: 'Do my child\'s documents need translating?',
            plainEnglish: 'Yes, if the birth certificate or any other document is not in English or Welsh, it needs a certified translation.',
            officialRule: 'The same certified-translation rule applies to children\'s documents as to adult applicants\'.',
            example:
              "Maria's son's birth certificate is in Portuguese — she includes a certified English translation.",
            officialGuidance: LINKS.appendixFMSE,
          },
        ],
      },
      {
        key: 'tb_tests',
        label: 'TB Tests',
        questions: [
          {
            id: 'child-tb-age',
            question: 'Do young children need a TB test?',
            plainEnglish: 'Children under 11 are generally exempt from the TB test requirement, even if from a listed country; children 11 and over follow the standard rule.',
            officialRule: 'The under-11 exemption applies regardless of country of residence, but always check current guidance as age rules can be updated.',
            example:
              "Priya's 6-year-old son doesn't need a TB test, but her 13-year-old daughter does, since they're both moving from a listed country.",
            officialGuidance: LINKS.tbTest,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'child-biometrics',
            question: 'Do children need to give biometrics?',
            plainEnglish: 'Yes, children of most ages need to attend a biometrics appointment, usually accompanied by a parent or guardian.',
            officialRule: 'A parent or legal guardian must consent to and usually accompany a child\'s biometric enrolment.',
            example:
              "Ahmed accompanies his daughter to her biometrics appointment and signs the parental consent form.",
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'child-processing',
            question: 'Do children\'s applications process at the same speed?',
            plainEnglish: 'Generally yes — a dependent child\'s application follows the same processing target as the main applicant\'s route (e.g. spouse, Skilled Worker, Student targets).',
            officialRule: 'Dependant applications are typically processed alongside the main applicant\'s case on the same route\'s service standard.',
            example:
              "John's son's application is processed on the same 12-week standard timeline as John's own spouse-route application.",
            officialGuidance: LINKS.processingTimesOutside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'child-decision-conditions',
            question: 'What conditions come with a child\'s visa?',
            plainEnglish: 'Usually matches the main applicant\'s permission length and conditions, with no independent right to work for young children, though older teenagers on some routes may have limited work rights.',
            officialRule: 'Conditions are linked to the parent\'s route and the child\'s specific visa category.',
            example:
              "Fatima's son is granted permission matching her own visa length, with education access included.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'child-after-evisa',
            question: 'Who manages the child\'s eVisa?',
            plainEnglish: 'A parent or guardian typically creates and manages the UKVI account and eVisa link on the child\'s behalf until they\'re old enough to manage it themselves.',
            officialRule: 'Parental or guardian management of a minor\'s digital status is expected until the child reaches an appropriate age.',
            example:
              "Maria links her son's eVisa to a UKVI account she manages for him, checking his school enrolment matches his visa conditions.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'child-refusal-consent',
            question: 'Why do consent-related refusals happen?',
            plainEnglish: 'Missing or unclear consent from a parent who isn\'t travelling but has parental responsibility is a common reason for refusal.',
            officialRule: 'Without valid consent or evidence of sole responsibility, the application can be refused regardless of other evidence.',
            example:
              "Ahmed's first application is refused because his ex-partner's consent letter wasn't included — he reapplies with a properly signed consent letter.",
            officialGuidance: LINKS.childVisa,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'child-appeals',
            question: 'Do children\'s refusals have the same appeal rights as the parent\'s?',
            plainEnglish: 'Often yes, since a child\'s application is usually linked to the parent\'s route — check both decision letters, as rights can sometimes differ.',
            officialRule: 'Appeal or Administrative Review eligibility depends on the specific route and reasons given in each decision letter.',
            example:
              "Priya's and her son's refusal letters both confirm the same right of appeal, since both were assessed under the family route.",
            officialGuidance: LINKS.appeal,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── SETTLEMENT (ILR) ─────────────────────────────
  {
    type: 'settlement',
    icon: 'home',
    label: 'Settlement',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'settle-before-eligible',
            question: 'When am I eligible to apply for settlement?',
            plainEnglish: 'After completing a set period of continuous lawful residence on a qualifying route — commonly 5 years for spouse/work routes, but this varies by category (e.g. some Global Talent routes allow 3 years).',
            officialRule: 'The qualifying period and permitted absences (generally no more than 180 days out of the UK in any 12-month period) depend on your specific route.',
            example:
              "John completes 5 years on the Skilled Worker route without exceeding his permitted absences, and becomes eligible to apply for settlement.",
            officialGuidance: LINKS.settle,
          },
          {
            id: 'settle-before-good-character',
            question: 'What is the "good character" / continuous residence check?',
            plainEnglish: 'The Home Office checks your immigration history, criminal record, and time spent outside the UK to confirm you meet the continuous residence and conduct requirements.',
            officialRule: 'Excess absences or certain criminal convictions can affect eligibility for settlement.',
            example:
              "Maria keeps a personal log of every trip abroad during her 5 years to make sure she stays within the permitted absence limit before applying.",
            officialGuidance: LINKS.settle,
          },
        ],
      },
      {
        key: 'financial_requirements',
        label: 'Financial Requirements',
        questions: [
          {
            id: 'settle-financial-reproof',
            question: 'Do I need to re-prove my finances for settlement?',
            plainEnglish: 'For many routes (e.g. spouse), yes — you generally need to show you still meet the financial requirement (or an exception applies) at the settlement stage, not just at the earlier visa stages.',
            officialRule: 'The financial requirement must usually be met at each stage of the route, including the final settlement application.',
            example:
              "Fatima updates her financial evidence with current payslips and bank statements before her settlement application, even though she met the requirement 5 years earlier.",
            officialGuidance: LINKS.appendixFM,
          },
        ],
      },
      {
        key: 'english_test',
        label: 'English Test',
        questions: [
          {
            id: 'settle-english-b1',
            question: 'What English level do I need for settlement?',
            plainEnglish: 'CEFR B1 level, usually evidenced by an approved SELT, a qualifying degree, or being a national of a majority English-speaking country.',
            officialRule: 'B1 is the standard settlement-stage requirement across most routes, unless an exemption applies.',
            example:
              "Ahmed passes a B1-level SELT test a few months before submitting his settlement application.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'settle-life-in-uk',
            question: 'Do I need to pass the Life in the UK test?',
            plainEnglish: 'Yes, for most settlement applications you need to pass the Life in the UK test, which covers British history, traditions, and everyday life.',
            officialRule: 'The test result letter must be included as evidence with your settlement application.',
            example:
              "Priya books and passes her Life in the UK test a month before applying for settlement.",
            officialGuidance: LINKS.lifeInUK,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'settle-biometrics',
            question: 'Do I need new biometrics for settlement?',
            plainEnglish: "Yes, you'll usually need to re-enrol your biometrics as part of the settlement application process, even if you've done so before for earlier visas.",
            officialRule: 'Biometric enrolment is a standard part of each new application, including settlement.',
            example:
              "John books a new biometrics appointment specifically for his settlement application.",
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'settle-processing',
            question: 'How long does a settlement decision take?',
            plainEnglish: 'Standard service inside the UK targets 6 months for most settlement applications, though a same-day/priority service is often available for an extra fee where offered.',
            officialRule: 'Settlement processing targets differ from the standard temporary-visa targets — check the specific target for your route on gov.uk.',
            example:
              "Fatima applies for settlement using the priority service and receives her decision within a few weeks rather than waiting the full standard target.",
            officialGuidance: LINKS.processingTimesInside,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'settle-decision-what-it-means',
            question: 'What does Indefinite Leave to Remain actually give me?',
            plainEnglish: 'No time limit on your stay, no work restrictions, and full access to public funds — a major step up from time-limited visas, and normally a precursor to citizenship.',
            officialRule: 'ILR removes immigration time restrictions but can still lapse if you spend too long outside the UK afterward (generally more than 2 years continuously).',
            example:
              "Ahmed is granted ILR and immediately notices he no longer has a visa expiry date or work restriction on his eVisa.",
            officialGuidance: LINKS.settle,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'settle-after-evisa',
            question: 'What do I do once I have ILR?',
            plainEnglish: 'Link your eVisa (or update your existing one) to reflect your new ILR status, and consider your eligibility timeline for British citizenship.',
            officialRule: 'ILR is recorded on your eVisa; most people become eligible to apply for citizenship 12 months after receiving ILR (immediately, if married to a British citizen).',
            example:
              "Maria checks her eVisa reflects her new ILR status, and notes she'll be eligible for citizenship in 12 months' time.",
            officialGuidance: LINKS.evisa,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'settle-refusal-absences',
            question: 'Why do continuous residence refusals happen?',
            plainEnglish: 'Exceeding the permitted number of days spent outside the UK (commonly 180 days in any 12-month period) is a common reason for refusal.',
            officialRule: 'Excess absences can reset or break the continuous residence period required for settlement, depending on the circumstances and any discretion applied.',
            example:
              "John spent 200 days abroad in one year for a family emergency — he includes supporting evidence of the exceptional circumstances with his application.",
            officialGuidance: LINKS.settle,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'settle-appeals',
            question: 'Can I appeal a settlement refusal?',
            plainEnglish: 'Depends on the route and reasons — some settlement refusals carry a right of appeal (especially where human rights grounds apply), others are eligible for Administrative Review instead.',
            officialRule: 'Your refusal letter states which route (if any) applies to your specific decision.',
            example:
              "Priya's settlement refusal letter confirms she has a right of appeal on human rights grounds, so she lodges her appeal within the deadline.",
            officialGuidance: LINKS.appeal,
          },
        ],
      },
    ],
  },

  // ───────────────────────────── CITIZENSHIP ─────────────────────────────
  {
    type: 'citizenship',
    icon: 'flag',
    label: 'Citizenship',
    categories: [
      {
        key: 'before_applying',
        label: 'Before Applying',
        questions: [
          {
            id: 'citizen-before-eligible',
            question: 'When can I apply for British citizenship?',
            plainEnglish: 'Generally 12 months after getting Indefinite Leave to Remain (ILR) — or immediately after getting ILR if you\'re married to, or in a civil partnership with, a British citizen.',
            officialRule: 'Naturalisation requires holding ILR (or equivalent settled status) and meeting residence, absence, and good character requirements.',
            example:
              "Ahmed got ILR 12 months ago and isn't married to a British citizen, so he's now eligible to apply for naturalisation.",
            officialGuidance: LINKS.citizenship,
          },
          {
            id: 'citizen-before-residence',
            question: 'What residence requirements apply?',
            plainEnglish: 'You typically need 5 years of residence in the UK (3 years if married to a British citizen) with no more than 450 days spent outside the UK in that period (270 days if the 3-year route), and no more than 90 days in the final 12 months.',
            officialRule: 'Absence limits are strict and calculated precisely — even a small excess can require a waiver request or delay eligibility.',
            example:
              "Maria carefully tracks her days abroad over the past 5 years to confirm she's within the 450-day limit before applying.",
            officialGuidance: LINKS.naturalisation,
          },
        ],
      },
      {
        key: 'english_test',
        label: 'English Test',
        questions: [
          {
            id: 'citizen-english-b1',
            question: 'What English level do I need?',
            plainEnglish: 'The same B1 level required at the settlement stage — if you already met this for ILR, you generally don\'t need to retake it for citizenship, unless a lot of time has passed.',
            officialRule: 'Evidence of B1 English used for a previous application can often be reused if still within its validity period.',
            example:
              "John reuses the same SELT certificate he used for his ILR application, since it's still within its validity window.",
            officialGuidance: LINKS.approvedEnglishTests,
          },
          {
            id: 'citizen-life-in-uk',
            question: 'Do I need to retake the Life in the UK test?',
            plainEnglish: 'If you already passed it for your settlement application, you don\'t usually need to retake it — the same pass result can be reused.',
            officialRule: 'Life in the UK Test results don\'t expire and can be reused for a later citizenship application.',
            example:
              "Fatima passed her Life in the UK test 2 years ago for her ILR application and reuses the same result for citizenship.",
            officialGuidance: LINKS.lifeInUK,
          },
        ],
      },
      {
        key: 'biometrics',
        label: 'Biometrics',
        questions: [
          {
            id: 'citizen-biometrics',
            question: 'Do I need new biometrics for citizenship?',
            plainEnglish: 'Yes, biometric enrolment is a standard part of the naturalisation application process.',
            officialRule: 'Biometrics are required as part of the online naturalisation application.',
            example:
              "Priya completes a fresh biometrics enrolment as part of her citizenship application, even though she's given biometrics before for earlier visas.",
            officialGuidance: LINKS.brp,
          },
        ],
      },
      {
        key: 'processing_times',
        label: 'Processing Times',
        questions: [
          {
            id: 'citizen-processing',
            question: 'How long does a citizenship application take?',
            plainEnglish: 'The standard target is around 6 months for most naturalisation applications, though many are decided sooner.',
            officialRule: 'Processing time targets for citizenship applications are published separately from visa processing targets — check the current figure on gov.uk.',
            example:
              "Ahmed applies for citizenship and receives his decision in about 4 months, within the published target.",
            officialGuidance: LINKS.naturalisation,
          },
        ],
      },
      {
        key: 'decision',
        label: 'Decision',
        questions: [
          {
            id: 'citizen-decision-ceremony',
            question: 'What happens after I\'m approved?',
            plainEnglish: 'You\'ll be invited to attend a citizenship ceremony, where you take an oath (or affirmation) of allegiance and receive your certificate of naturalisation.',
            officialRule: 'Attending a citizenship ceremony within the required timeframe is a mandatory final step to become a British citizen.',
            example:
              "Maria books her citizenship ceremony at her local council within the 3-month window given after approval.",
            officialGuidance: LINKS.naturalisation,
          },
        ],
      },
      {
        key: 'after_approval',
        label: 'After Approval',
        questions: [
          {
            id: 'citizen-after-passport',
            question: 'How do I get a British passport?',
            plainEnglish: 'After your citizenship ceremony, you can apply separately for a British passport through HM Passport Office — citizenship itself doesn\'t automatically issue a passport.',
            officialRule: 'A British passport application is a distinct process, requiring your certificate of naturalisation as supporting evidence.',
            example:
              "John applies for his first British passport online the week after his citizenship ceremony, attaching his certificate of naturalisation.",
            officialGuidance: LINKS.citizenship,
          },
        ],
      },
      {
        key: 'refusals',
        label: 'Refusals',
        questions: [
          {
            id: 'citizen-refusal-absences',
            question: 'Why do absence-related refusals happen?',
            plainEnglish: 'Exceeding the permitted days outside the UK during the qualifying period, or in the final 12 months, is one of the most common reasons for refusal.',
            officialRule: 'Excess absences can be considered under discretion in limited circumstances, but there\'s no guarantee — always check the precise limits before applying.',
            example:
              "Fatima exceeded her final-year absence limit due to a family emergency abroad — she includes a detailed explanation and supporting evidence with her application.",
            officialGuidance: LINKS.naturalisation,
          },
          {
            id: 'citizen-refusal-good-character',
            question: 'What is a "good character" refusal?',
            plainEnglish: 'Refusals can happen due to undisclosed criminal convictions, immigration breaches, or financial issues like undischarged bankruptcy or unpaid tax.',
            officialRule: 'The good character requirement is assessed against your full personal history, not just UK-based conduct.',
            example:
              "Ahmed discloses a minor conviction from years ago on his application, along with an explanation, rather than risk a refusal for non-disclosure.",
            officialGuidance: LINKS.naturalisation,
          },
        ],
      },
      {
        key: 'appeals',
        label: 'Appeals',
        questions: [
          {
            id: 'citizen-appeals-no-right',
            question: 'Can I appeal a citizenship refusal?',
            plainEnglish: 'No — naturalisation decisions do not carry a statutory right of appeal, but you can ask the Home Office to reconsider, or apply again once circumstances change.',
            officialRule: 'There is no appeal route for naturalisation refusals; reconsideration requests are handled at the Home Office\'s discretion and aren\'t guaranteed.',
            example:
              "Priya's citizenship application is refused for a minor absence miscalculation — she writes a reconsideration request with corrected evidence rather than pursuing an appeal.",
            officialGuidance: LINKS.naturalisation,
          },
        ],
      },
    ],
  },
];
