// Feature flag: the solicitor referral CTA is built and wired up (see
// components/SolicitorReferralCard.tsx and its 3 trigger points in
// questionnaire.tsx, timeline.tsx, costs.tsx) but turned off for now.
// Flip back to true to re-enable — no other code changes needed, the card
// component itself reads this flag and renders nothing while it's false.
export const ENABLE_SOLICITOR_REFERRAL = false;

// Placeholder partner identity for the regulated-immigration-solicitor
// referral — swap SOLICITOR_PARTNER_URL for the real partner link once a
// partnership is formalized. Everything else derives from this file so
// there's a single place to update.
export const SOLICITOR_PARTNER_URL = 'https://example.com/solicitor-partner-placeholder';

export const SOLICITOR_REFERRAL_DISCLAIMER =
  'We may earn a referral fee if you use this service. This is not immigration advice.';

// Each trigger point passes its own `context` id into <SolicitorReferralCard>
// (see components/SolicitorReferralCard.tsx) so click events can be broken
// down by where the prompt was shown.
export type SolicitorReferralContext = 'questionnaire_income_shortfall' | 'timeline_refused' | 'costs_needs_solicitor';
