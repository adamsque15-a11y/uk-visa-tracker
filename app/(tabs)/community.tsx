import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking } from 'react-native';
import Head from 'expo-router/head';
import { VisaType, getTargetProcessingDays } from '../../lib/visaLogic';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import JsonLd from '../../components/JsonLd';
import ShareButtons from '../../components/ShareButtons';
import { colors } from '../../lib/theme';
import { buildArticleSchema } from '../../lib/structuredData';
import { SITE_URL } from '../../lib/legalConfig';

// Date the real-world processing-time research (see buildInsight below) was
// last gathered/verified — reused as both the Article's datePublished and
// dateModified since there's no separate "first written" date to draw on.
const INSIGHTS_RESEARCH_DATE = '2026-07-09';

interface RealWorldSource {
  label: string;
  url: string;
}

interface Insight {
  avgWaitWorkingDays: number;
  avgWaitLabel: string;
  fastestWorkingDays: number;
  fastestLabel: string;
  realWorldNote: string;
  realWorldSource: RealWorldSource;
}

const VISA_TYPES: { key: VisaType; label: string }[] = [
  { key: 'spouse', label: 'Spouse / Family' },
  { key: 'skilled_worker', label: 'Skilled Worker' },
  { key: 'student', label: 'Student' },
  { key: 'visitor', label: 'Visitor' },
];

// "Average Wait" / "Fastest" are the real Home Office service-standard and
// priority targets already used elsewhere in this app (lib/visaLogic.ts),
// measured in working days from biometrics.
//
// "realWorldNote" is NOT crowdsourced/live data — this app has no backend to
// collect that, and Reddit isn't reliably accessible to scrape from here.
// Instead these are real, dated findings from public immigration-advice
// publications describing what applicants actually experience, gathered via
// web research on 2026-07-09. Each links back to its source so it can be
// checked and refreshed — it's a manually-researched snapshot, not a live
// feed.
function buildInsight(visaType: VisaType): Insight {
  const avgWaitWorkingDays = getTargetProcessingDays(visaType, 'outside_uk', 'standard');
  const fastestWorkingDays = getTargetProcessingDays(visaType, 'outside_uk', 'priority');

  const REAL_WORLD: Record<VisaType, { note: string; source: RealWorldSource }> = {
    spouse: {
      note:
        "In practice, applicants often report 4–6 months total from starting the application to receiving a decision, once time spent waiting for a biometrics appointment is included — longer than the 12-week (60 working day) service standard, which is only measured from the biometrics appointment itself.",
      source: { label: 'DavidsonMorris — UK Visa Processing Time', url: 'https://www.davidsonmorris.com/uk-visa-processing-time/' },
    },
    skilled_worker: {
      note:
        "Reported timelines commonly range from 3 to 8 weeks depending on location and how complete the application is. If your employer needs to apply for a sponsor licence first (rather than already holding one), that alone can add 8+ weeks before the visa clock even starts.",
      source: { label: 'Rowan — Skilled Worker Visa Processing Time', url: 'https://withrowan.co.uk/guides/skilled-worker-processing-time' },
    },
    student: {
      note:
        'Most real reports land close to the 3-week standard, but processing can stretch to 4–5 weeks during the busy August intake rush, just before term starts.',
      source: { label: 'UK Student Visa Processing Time 2026 guide', url: 'https://www.avanse.com/blog/uk-student-visa-processing-time-complete-guide-2026' },
    },
    visitor: {
      note:
        'Many applicants report decisions in 17–21 working days rather than the full 3-week target, but this can stretch to 4–6 weeks during busy periods like summer, Christmas, or Diwali.',
      source: { label: 'Atlys — UK Tourist Visa Processing Time', url: 'https://www.atlys.com/blog/united-kingdom-visitor-visa-processing-time' },
    },
  };

  return {
    avgWaitWorkingDays,
    avgWaitLabel: 'Standard Service',
    fastestWorkingDays,
    fastestLabel: 'Priority Service',
    realWorldNote: REAL_WORLD[visaType].note,
    realWorldSource: REAL_WORLD[visaType].source,
  };
}

const INSIGHTS: Record<VisaType, Insight> = {
  skilled_worker: buildInsight('skilled_worker'),
  spouse: buildInsight('spouse'),
  student: buildInsight('student'),
  visitor: buildInsight('visitor'),
};

function FilterIcon() {
  return (
    <View style={styles.filterIcon}>
      <View style={[styles.filterBar, { width: 18 }]} />
      <View style={[styles.filterBar, { width: 12 }]} />
      <View style={[styles.filterBar, { width: 6 }]} />
    </View>
  );
}

export default function CommunityInsightsScreen() {
  const [visaType, setVisaType] = useState<VisaType>('skilled_worker');
  const [filterOpen, setFilterOpen] = useState(false);
  const insight = INSIGHTS[visaType];
  const visaLabel = VISA_TYPES.find((v) => v.key === visaType)?.label ?? '';

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <Head>
        <title>UK Visa Approval Trends & Real-World Processing Times | UK Visa Tracker</title>
        <meta
          name="description"
          content="Real-world UK visa processing times compared to official Home Office targets, for Spouse, Skilled Worker, Student, and Visitor visas — sourced and dated."
        />
      </Head>
      <JsonLd
        data={buildArticleSchema({
          headline: 'UK Visa Approval Trends & Real-World Processing Times',
          description:
            'Real-world UK visa processing times compared to official Home Office targets, for Spouse, Skilled Worker, Student, and Visitor visas — sourced and dated.',
          url: `${SITE_URL}/community`,
          datePublished: INSIGHTS_RESEARCH_DATE,
          dateModified: INSIGHTS_RESEARCH_DATE,
        })}
      />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>INSIGHTS</Text>
          <Text style={styles.title}>Approval Trends</Text>
        </View>
        <TouchableOpacity onPress={() => setFilterOpen(true)} accessibilityLabel="Filter by visa type" style={styles.filterButton}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>{visaLabel} · working days from biometrics</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>OFFICIAL TARGET</Text>
          <Text style={styles.statValue}>{insight.avgWaitWorkingDays} Working Days</Text>
          <Text style={styles.statSubtext}>{insight.avgWaitLabel}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>FASTEST</Text>
          <Text style={styles.statValue}>{insight.fastestWorkingDays} Working Days</Text>
          <Text style={styles.statSubtext}>{insight.fastestLabel}</Text>
        </View>
      </View>
      <Text style={styles.statsSourceText}>Source: Home Office published service-standard and priority targets.</Text>

      <View style={styles.realCard}>
        <View style={styles.realCardTitleRow}>
          <Icon name="message-circle" size={16} color={colors.textPrimary} />
          <Text style={styles.realCardTitle}>What real applicants report</Text>
        </View>
        <Text style={styles.realCardBody}>{insight.realWorldNote}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(insight.realWorldSource.url)}>
          <Text style={styles.realCardSource}>Source: {insight.realWorldSource.label} ↗</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        This isn't a live or crowdsourced feed. The "what real applicants report" notes above are a
        manually-researched snapshot of public immigration-advice sources, gathered on 9 July 2026 and linked so you
        can check them yourself. A future version could replace this with real, opted-in submissions from people
        using the app.
      </Text>

      <ShareButtons
        url={`${SITE_URL}/community`}
        title="UK Visa Approval Trends & Real-World Processing Times"
        context="insights"
      />

      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter by visa type</Text>
            <View style={styles.optionRow}>
              {VISA_TYPES.map((v) => (
                <TouchableOpacity
                  key={v.key}
                  style={[styles.optionChip, visaType === v.key && styles.optionChipSelected]}
                  onPress={() => {
                    setVisaType(v.key);
                    setFilterOpen(false);
                  }}
                >
                  <Text style={[styles.optionChipText, visaType === v.key && styles.optionChipTextSelected]}>
                    {v.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setFilterOpen(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8f3' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { fontSize: 12, fontWeight: '700', color: '#8a8471', letterSpacing: 0.6, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a1a1a' },
  filterButton: { padding: 10, marginTop: 6 },
  filterIcon: { alignItems: 'flex-end', gap: 5 },
  filterBar: { height: 2, borderRadius: 1, backgroundColor: '#1a3c6e' },
  subtitle: { fontSize: 14, color: '#6b6555', marginTop: 14, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e0d5',
    borderRadius: 14,
    padding: 16,
  },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#8a8471', letterSpacing: 0.5, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  statSubtext: { fontSize: 13, color: '#2e7d32', fontWeight: '600', marginTop: 4 },
  statsSourceText: { fontSize: 11, color: '#9a947f', marginTop: 8 },
  realCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e0d5',
    borderRadius: 14,
    padding: 18,
    marginTop: 22,
  },
  realCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  realCardTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
  realCardBody: { fontSize: 14, color: '#444', lineHeight: 21 },
  realCardSource: { fontSize: 12, color: '#1a3c6e', fontWeight: '600', marginTop: 12, textDecorationLine: 'underline' },
  disclaimer: { fontSize: 11, color: '#9a947f', marginTop: 24, lineHeight: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 420 },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  optionChipSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e' },
  optionChipText: { fontSize: 13, color: '#333' },
  optionChipTextSelected: { color: '#fff', fontWeight: '600' },
  modalCloseButton: { marginTop: 18, alignItems: 'center', paddingVertical: 10 },
  modalCloseButtonText: { fontSize: 15, fontWeight: '600', color: '#1a3c6e' },
});
