import { LegalPage, Section, Paragraph, BulletList, EmailLink, LegalCrossLink } from '../components/LegalPage';
import { APP_NAME, COMPANY_NAME, GOVERNING_LAW, SUPPORT_CONTACT_EMAIL } from '../lib/legalConfig';

export default function TermsOfServiceScreen() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These terms govern your use of ${APP_NAME}, operated by ${COMPANY_NAME}. By using the app you agree to them.`}
    >
      <Section heading="1. Not affiliated with UKVI or the Home Office">
        <Paragraph>
          {APP_NAME} is an independent, unofficial tool. It is not affiliated with, endorsed by, or connected in
          any way to UK Visas and Immigration (UKVI), the Home Office, or any other UK government body. We have
          no special access to Home Office systems, and nothing in the app reflects an official position or
          decision of UKVI.
        </Paragraph>
      </Section>

      <Section heading="2. This is not immigration advice">
        <Paragraph>
          {APP_NAME} provides organisational and tracking tools only — checklists, timelines, cost estimates, and
          English test preparation practice — based on publicly available information. It does not constitute
          immigration advice, and using it is not a substitute for advice from a qualified, OISC-regulated
          immigration adviser or immigration solicitor.
        </Paragraph>
        <Paragraph>
          We make no guarantee, express or implied, about the outcome of any visa application. Processing times,
          fees, and requirements shown in the app are estimates based on published Home Office guidance and may
          change or differ from your individual circumstances.
        </Paragraph>
      </Section>

      <Section heading="3. Acceptable use">
        <Paragraph>You agree to use {APP_NAME} only for its intended purpose, and not to:</Paragraph>
        <BulletList
          items={[
            'Use the app for any unlawful purpose, or in a way that infringes anyone else’s rights.',
            'Attempt to gain unauthorised access to other users’ accounts or data.',
            'Reverse engineer, scrape, or interfere with the app or its underlying infrastructure.',
            'Submit information you know to be false in a way intended to mislead another person relying on the app.',
          ]}
        />
        <Paragraph>You're responsible for the accuracy of the information you enter into the app.</Paragraph>
      </Section>

      <Section heading="4. Account termination">
        <Paragraph>
          You may stop using the app and delete your account at any time from the Profile screen. We may
          suspend or terminate accounts that breach these terms, misuse the service, or attempt to compromise
          its security, with or without notice where reasonably necessary.
        </Paragraph>
      </Section>

      <Section heading="5. Limitation of liability">
        <Paragraph>
          {APP_NAME} is provided "as is" and "as available", without warranties of any kind. To the maximum
          extent permitted by law, {COMPANY_NAME} is not liable for any loss or damage arising from your use of
          the app, including decisions made in reliance on information it displays, or from delays, errors, or
          outcomes in your visa application process that are outside our control.
        </Paragraph>
      </Section>

      <Section heading="6. Intellectual property">
        <Paragraph>
          The {APP_NAME} name, design, and underlying code are owned by {COMPANY_NAME} or its licensors. You
          retain ownership of the application data you enter into the app. You may not copy, reproduce, or
          redistribute the app or its content without permission.
        </Paragraph>
      </Section>

      <Section heading="7. Changes to these terms">
        <Paragraph>
          We may update these terms from time to time. If we make material changes, we'll update the "Last
          updated" date above. Continuing to use the app after changes take effect means you accept the
          updated terms.
        </Paragraph>
      </Section>

      <Section heading="8. Governing law">
        <Paragraph>These terms are governed by the laws of {GOVERNING_LAW}.</Paragraph>
      </Section>

      <Section heading="9. Contact us">
        <Paragraph>
          Questions about these terms can be sent to <EmailLink email={SUPPORT_CONTACT_EMAIL} />.
        </Paragraph>
        <Paragraph>
          See also our <LegalCrossLink label="Privacy Policy" path="/privacy" />.
        </Paragraph>
      </Section>
    </LegalPage>
  );
}
