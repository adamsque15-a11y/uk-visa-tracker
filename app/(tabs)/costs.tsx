import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { VisaType } from '../../lib/visaLogic';
import { calculateCost } from '../../lib/costCalculator';
import { buildCostShareUrl } from '../../lib/costShare';
import { SITE_URL } from '../../lib/legalConfig';
import Screen from '../../components/Screen';
import SolicitorReferralCard from '../../components/SolicitorReferralCard';
import ShareButtons from '../../components/ShareButtons';

const VISA_TYPES: { key: VisaType; label: string }[] = [
  { key: 'spouse', label: 'Spouse / Family' },
  { key: 'skilled_worker', label: 'Skilled Worker' },
  { key: 'student', label: 'Student' },
  { key: 'visitor', label: 'Visitor' },
];

// Standard Visitor visas (≤6 months) don't require proving English or a TB
// test — those only apply to the longer-stay routes. Biometrics apply to
// every route, so it's left out of this map.
const ENGLISH_AND_TB_APPLICABLE: Record<VisaType, boolean> = {
  spouse: true,
  skilled_worker: true,
  student: true,
  visitor: false,
};

function formatGBP(value: number): string {
  return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CostsScreen() {
  const [visaType, setVisaType] = useState<VisaType>('spouse');
  const [visaLengthYears, setVisaLengthYears] = useState('2.5');
  const [numberOfApplicants, setNumberOfApplicants] = useState('1');
  const [needsTbTest, setNeedsTbTest] = useState(false);
  const [needsEnglishTest, setNeedsEnglishTest] = useState(true);
  const [needsPriorityService, setNeedsPriorityService] = useState(false);
  const [needsTranslations, setNeedsTranslations] = useState(false);
  const [needsSolicitor, setNeedsSolicitor] = useState(false);

  const requiresEnglishAndTb = ENGLISH_AND_TB_APPLICABLE[visaType];

  function handleVisaTypeChange(type: VisaType) {
    setVisaType(type);
    if (!ENGLISH_AND_TB_APPLICABLE[type]) {
      setNeedsTbTest(false);
      setNeedsEnglishTest(false);
    }
  }

  const inputs = useMemo(
    () => ({
      visaType,
      visaLengthYears: Number(visaLengthYears) || 0,
      numberOfApplicants: Number(numberOfApplicants) || 1,
      needsTbTest: requiresEnglishAndTb && needsTbTest,
      needsEnglishTest: requiresEnglishAndTb && needsEnglishTest,
      needsPriorityService,
      needsTranslations,
      needsSolicitor,
    }),
    [
      visaType,
      requiresEnglishAndTb,
      visaLengthYears,
      numberOfApplicants,
      needsTbTest,
      needsEnglishTest,
      needsPriorityService,
      needsTranslations,
      needsSolicitor,
    ]
  );

  const breakdown = useMemo(() => calculateCost(inputs), [inputs]);
  const shareUrl = useMemo(() => buildCostShareUrl(inputs, SITE_URL), [inputs]);

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.heading}>Cost Calculator</Text>

      <View style={styles.runningTotalBar}>
        <Text style={styles.runningTotalLabel}>Estimated total</Text>
        <Text style={styles.runningTotalValue}>{formatGBP(breakdown.total)}</Text>
      </View>

      <Text style={styles.label}>Visa type</Text>
      <View style={styles.optionRow}>
        {VISA_TYPES.map((v) => (
          <Text
            key={v.key}
            onPress={() => handleVisaTypeChange(v.key)}
            style={[styles.chip, visaType === v.key && styles.chipSelected]}
          >
            {v.label}
          </Text>
        ))}
      </View>

      {visaType !== 'visitor' && (
        <>
          <Text style={styles.label}>Visa length (years, affects IHS)</Text>
          <TextInput style={styles.input} value={visaLengthYears} onChangeText={setVisaLengthYears} keyboardType="numeric" />
        </>
      )}

      <Text style={styles.label}>Number of applicants</Text>
      <TextInput style={styles.input} value={numberOfApplicants} onChangeText={setNumberOfApplicants} keyboardType="numeric" />

      {requiresEnglishAndTb && (
        <>
          <ToggleRow label="TB test needed" value={needsTbTest} onChange={setNeedsTbTest} />
          <ToggleRow label="English test needed" value={needsEnglishTest} onChange={setNeedsEnglishTest} />
        </>
      )}
      <ToggleRow label="Priority service" value={needsPriorityService} onChange={setNeedsPriorityService} />
      <ToggleRow label="Translations needed" value={needsTranslations} onChange={setNeedsTranslations} />
      <ToggleRow label="Using a solicitor" value={needsSolicitor} onChange={setNeedsSolicitor} />

      {needsSolicitor && <SolicitorReferralCard context="costs_needs_solicitor" />}

      <View style={styles.breakdownCard}>
        <CostLine label="Visa fee" value={breakdown.visaFee} />
        <CostLine label="Immigration Health Surcharge" value={breakdown.ihs} />
        <CostLine label="TB test" value={breakdown.tbTest} />
        <CostLine label="English test" value={breakdown.englishTest} />
        <CostLine label="Priority service" value={breakdown.priorityService} />
        <CostLine label="Translations" value={breakdown.translations} />
        <CostLine label="Solicitor" value={breakdown.solicitor} />
        <CostLine label="Biometrics" value={breakdown.biometrics} />
        <CostLine label="Courier" value={breakdown.courier} />
        <View style={styles.divider} />
        <CostLine label="Total" value={breakdown.total} bold />
      </View>

      <ShareButtons url={shareUrl} title="My UK visa cost estimate" context="cost_summary" />

      <Text style={styles.disclaimer}>
        Figures are estimates based on published fees at time of writing and may not reflect current rates.
        Always confirm exact fees on GOV.UK before paying.
      </Text>
    </Screen>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function CostLine({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <View style={styles.costLine}>
      <Text style={[styles.costLabel, bold && styles.costLabelBold]}>{label}</Text>
      <Text style={[styles.costValue, bold && styles.costLabelBold]}>{formatGBP(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  runningTotalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a3c6e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  runningTotalLabel: { fontSize: 13, fontWeight: '600', color: '#cfe0f5' },
  runningTotalValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    overflow: 'hidden',
  },
  chipSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e', color: '#fff', fontWeight: '600' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  toggleLabel: { fontSize: 14 },
  breakdownCard: { backgroundColor: '#f7f8fa', borderRadius: 12, padding: 16, marginTop: 28 },
  costLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  costLabel: { fontSize: 14, color: '#444' },
  costValue: { fontSize: 14, color: '#444' },
  costLabelBold: { fontWeight: '700', color: '#1a3c6e', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  disclaimer: { fontSize: 11, color: '#999', marginTop: 16, marginBottom: 40, lineHeight: 16 },
});
