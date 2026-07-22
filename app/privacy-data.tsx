import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LegalPage, Section, Paragraph, LegalCrossLink, EmailLink } from '../components/LegalPage';
import Icon, { IconName } from '../components/Icon';
import DeleteAccountModal from '../components/DeleteAccountModal';
import { colors, radius, spacing } from '../lib/theme';
import { APP_NAME, PRIVACY_CONTACT_EMAIL } from '../lib/legalConfig';
import { isLocalModeActive } from '../lib/localMode';
import { exportUserData } from '../lib/dataExport';

interface DataCategory {
  icon: IconName;
  title: string;
  description: string;
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    icon: 'user',
    title: 'Account info',
    description: 'Your email address and how you sign in — or nothing at all, if you use Guest Mode.',
  },
  {
    icon: 'file-text',
    title: 'Visa application details',
    description: 'The information you enter about your application — visa type, dates, income, sponsor details, and so on.',
  },
  {
    icon: 'clipboard',
    title: 'Documents',
    description:
      "The notes and checklist status you record for the documents you're gathering. We don't yet support uploading the actual document files.",
  },
  {
    icon: 'clock',
    title: 'Application status & timeline',
    description: 'Where your application is up to, and the dates you log for each stage (biometrics, submitted, decision, and so on).',
  },
  {
    icon: 'award',
    title: 'IELTS test progress',
    description: 'Lessons you have completed, quiz and mock-test scores, and your daily practice streak.',
  },
];

export default function PrivacyDataScreen() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const localMode = isLocalModeActive();

  async function handleDownload() {
    setExporting(true);
    try {
      await exportUserData();
    } finally {
      setExporting(false);
    }
  }

  function handleDeleted() {
    setShowDeleteModal(false);
    router.replace('/home');
  }

  return (
    <LegalPage
      title="Privacy & Data"
      intro={`A plain-language rundown of what ${APP_NAME} stores for your account and why — for the full legal detail, see our Privacy Policy below.`}
    >
      <Section heading="What we store for you">
        <View style={styles.categoryList}>
          {DATA_CATEGORIES.map((category) => (
            <View key={category.title} style={styles.categoryRow}>
              <View style={styles.categoryIconWrap}>
                <Icon name={category.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.categoryTextGroup}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section heading="How we use it">
        <Paragraph>
          Only to run the features you're actually using — generating your document checklist, tracking your
          timeline, estimating costs, and tracking your IELTS practice. We don't use it for advertising, and we
          don't sell it to anyone.
        </Paragraph>
      </Section>

      <Section heading="Who can see it">
        <Paragraph>
          Just you. Your account data is locked to your account — no other user of the app, including someone
          using a different Guest Mode session on the same device, can see it.
        </Paragraph>
      </Section>

      <Section heading="Analytics & error tracking">
        <Paragraph>
          We use two outside tools to help us run the app well:
        </Paragraph>
        <View style={styles.categoryList}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryIconWrap}>
              <Icon name="bar-chart-2" size={18} color={colors.primary} />
            </View>
            <View style={styles.categoryTextGroup}>
              <Text style={styles.categoryTitle}>Vercel Analytics & Speed Insights</Text>
              <Text style={styles.categoryDescription}>
                First-party tools that tell us which pages people visit and how fast they load, so we can see how
                the app is used and keep it running quickly. They don't use cookies and don't know your name, email,
                or anything about your visa application.
              </Text>
            </View>
          </View>
          <View style={styles.categoryRow}>
            <View style={styles.categoryIconWrap}>
              <Icon name="alert-triangle" size={18} color={colors.primary} />
            </View>
            <View style={styles.categoryTextGroup}>
              <Text style={styles.categoryTitle}>Sentry</Text>
              <Text style={styles.categoryDescription}>
                Catches errors when something breaks in the app — like a crash or a failed request — so we can find
                and fix the bug. It's set up to not collect your IP address or the contents of what you were doing.
              </Text>
            </View>
          </View>
        </View>
        <Paragraph>
          Neither tool is used for advertising, and neither can see your account, application, or document details.
          If you'd rather not be included, email <EmailLink email={PRIVACY_CONTACT_EMAIL} /> and we'll opt you out.
        </Paragraph>
      </Section>

      <Section heading="Your data">
        <Paragraph>
          Download everything stored for your account, or permanently delete it. Both apply immediately — no need
          to wait on a support request.
        </Paragraph>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} disabled={exporting}>
            <Icon name="download" size={16} color={colors.primary} style={styles.actionIcon} />
            <Text style={styles.downloadButtonText}>{exporting ? 'Preparing...' : 'Download my data'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
            <Icon name="trash-2" size={16} color={colors.danger} style={styles.actionIcon} />
            <Text style={styles.deleteButtonText}>{localMode ? 'Clear my data' : 'Delete my account'}</Text>
          </TouchableOpacity>
        </View>
      </Section>

      <Section heading="Want the legal detail?">
        <Paragraph>
          This page is a friendly summary. For the full legal terms — retention periods, your UK GDPR rights, and
          how to request a copy or deletion of your data — read our <LegalCrossLink label="Privacy Policy" path="/privacy" />.
        </Paragraph>
      </Section>

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDeleted={handleDeleted}
      />
    </LegalPage>
  );
}

const styles = StyleSheet.create({
  categoryList: { gap: spacing.md },
  categoryRow: { flexDirection: 'row', gap: spacing.sm },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTextGroup: { flex: 1 },
  categoryTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  categoryDescription: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  actionIcon: { marginRight: 6 },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  downloadButtonText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dangerSurface,
    backgroundColor: colors.dangerSurface,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  deleteButtonText: { fontSize: 14, fontWeight: '600', color: colors.danger },
});
