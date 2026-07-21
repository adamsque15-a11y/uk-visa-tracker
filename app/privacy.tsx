import { LegalPage, Section, Paragraph, BulletList, EmailLink, LegalCrossLink } from '../components/LegalPage';
import { APP_NAME, COMPANY_NAME, PRIVACY_CONTACT_EMAIL } from '../lib/legalConfig';

export default function PrivacyPolicyScreen() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what information ${APP_NAME} collects, why, and how it's handled. ${APP_NAME} is built and operated by ${COMPANY_NAME}.`}
    >
      <Section heading="1. What data we collect">
        <Paragraph>Depending on how you use the app, we collect:</Paragraph>
        <BulletList
          items={[
            'Account information — your email address and authentication details, handled by our authentication provider (see "Third parties" below). If you use Guest Mode instead of creating an account, no email or account details are collected at all.',
            'Visa application details you enter — applicant name, nationality, country you’re applying from, visa type, relationship status, number of children, income, sponsor details, current visa status, biometrics date, and service speed.',
            'Checklist and document details — the checklist items generated for your application, whether you’ve marked them complete, and any notes you add. The app does not currently support uploading document files themselves; only the text notes and status you enter.',
            'Application status and progress — the timeline stages you record (e.g. submitted, biometrics, decision made) and their dates.',
            'English test prep progress — lessons completed, mock test and listening scores, and practice streaks.',
            'App preferences — bookmarked articles and notification settings.',
          ]}
        />
      </Section>

      <Section heading="2. Why we collect it">
        <Paragraph>
          We only collect what's needed to provide the tracking, checklist, and English test preparation features
          you use in the app — generating a personalised document checklist, showing your application timeline,
          calculating estimated costs, and tracking your English test practice progress. We do not use your data
          for advertising, and we do not sell it.
        </Paragraph>
      </Section>

      <Section heading="3. How it's stored and secured">
        <Paragraph>
          If you sign in with an account, your data is stored in our database (see "Third parties" below) with
          row-level security rules that restrict every record to the account that created it — no other user's
          account can read or modify your data through the app.
        </Paragraph>
        <Paragraph>
          If you use Guest Mode, your data is stored only in local storage on your device and is never
          transmitted to our servers. Uninstalling the app or clearing site data on the web version will
          permanently delete it, since we hold no copy.
        </Paragraph>
      </Section>

      <Section heading="4. Third parties we use">
        <BulletList
          items={[
            'Supabase — provides account authentication and hosts the database that stores your account, application, checklist, and timeline data. Supabase runs on cloud infrastructure and is bound by its own data processing terms.',
          ]}
        />
        <Paragraph>
          We do not currently use any analytics or error-tracking service, so no usage data is shared with a
          third party for those purposes. If that changes, we'll update this policy before doing so.
        </Paragraph>
      </Section>

      <Section heading="5. How long we keep it">
        <Paragraph>
          We keep your account data for as long as your account exists. If you delete your account, your
          applications, checklist items, and timeline data are permanently deleted along with it. Guest Mode
          data is kept only on your device for as long as you keep using it or until you clear local app data.
        </Paragraph>
      </Section>

      <Section heading="6. Your rights (UK GDPR)">
        <Paragraph>
          Because {APP_NAME} serves applicants going through the UK visa system, we handle personal data in
          line with UK GDPR. You have the right to:
        </Paragraph>
        <BulletList
          items={[
            'Access the personal data we hold about you.',
            'Correct inaccurate or incomplete data.',
            'Request deletion of your data (you can also delete most of it yourself, in-app, at any time).',
            'Restrict or object to certain processing.',
            'Receive your data in a portable format.',
          ]}
        />
        <Paragraph>
          To exercise any of these rights, contact us at <EmailLink email={PRIVACY_CONTACT_EMAIL} />. You also
          have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at
          ico.org.uk if you believe your data has been mishandled.
        </Paragraph>
      </Section>

      <Section heading="7. Cookies and local storage">
        <Paragraph>
          We don't use advertising or third-party tracking cookies. On the web version, we use browser local
          storage solely to keep you signed in between visits and to remember app preferences (such as Guest
          Mode data and notification settings) — nothing here is used to track you across other websites.
        </Paragraph>
      </Section>

      <Section heading="8. Contact us">
        <Paragraph>
          Questions about this policy or your data can be sent to <EmailLink email={PRIVACY_CONTACT_EMAIL} />.
        </Paragraph>
        <Paragraph>
          See also our <LegalCrossLink label="Terms of Service" path="/terms" />.
        </Paragraph>
      </Section>
    </LegalPage>
  );
}
