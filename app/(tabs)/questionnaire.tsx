import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import { colors } from '../../lib/theme';
import {
  VisaType,
  QuestionnaireAnswers,
  detectRoute,
  generateChecklist,
  SPOUSE_VISA_MINIMUM_INCOME_GBP,
} from '../../lib/visaLogic';
import CountryPicker from '../../components/CountryPicker';
import SolicitorReferralCard from '../../components/SolicitorReferralCard';
import { getCurrencyForCountry, convertToGBP, formatThousands } from '../../lib/currency';
import { isLocalModeActive } from '../../lib/localMode';
import { isGuestModeActive } from '../../lib/guestMode';
import {
  MOCK_OWNER_ID,
  mockCreateApplication,
  mockGetApplication,
  mockInsertChecklistItems,
  mockInsertTimelineEvents,
  mockUpdateApplication,
} from '../../lib/mockDb';

const VISA_TYPES: { key: VisaType; label: string }[] = [
  { key: 'spouse', label: 'Spouse / Family Visa' },
  { key: 'skilled_worker', label: 'Skilled Worker Visa' },
  { key: 'student', label: 'Student Visa' },
  { key: 'visitor', label: 'Visitor Visa' },
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const isEditing = !!applicationId;
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditing);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingApplicationId, setPendingApplicationId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const [applicantName, setApplicantName] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryApplyingFrom, setCountryApplyingFrom] = useState('');
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState<'married' | 'engaged' | 'partner' | 'single'>('married');
  const [childrenCount, setChildrenCount] = useState('0');
  const [income, setIncome] = useState('');
  const [incomeCountry, setIncomeCountry] = useState<'uk' | 'overseas' | null>(null);

  const nameMissing = !applicantName.trim();
  const nationalityMissing = !nationality;
  const countryApplyingFromMissing = !countryApplyingFrom;
  const visaTypeMissing = !visaType;
  const incomeCountryMissing = visaType === 'spouse' && !incomeCountry;

  const childrenCountNumber = Math.max(0, Number(childrenCount) || 0);

  // Annual income is entered in the currency of "Country applying from" —
  // converted to an approximate GBP figure so it can be checked against the
  // spouse visa's £29,000 threshold.
  const incomeCurrency = countryApplyingFrom ? getCurrencyForCountry(countryApplyingFrom) ?? 'GBP' : 'GBP';
  const incomeNumber = income ? Number(income) : null;
  const incomeGBP = incomeNumber !== null ? convertToGBP(incomeNumber, incomeCurrency) : null;
  const incomeMeetsSpouseThreshold = incomeGBP !== null ? incomeGBP >= SPOUSE_VISA_MINIMUM_INCOME_GBP : null;

  useEffect(() => {
    if (!applicationId) return;

    (async () => {
      const application = isLocalModeActive()
        ? await mockGetApplication(applicationId)
        : (await supabase.from('applications').select('*').eq('id', applicationId).single()).data;

      if (application) {
        setApplicantName(application.applicant_name);
        setNationality(application.nationality ?? '');
        setCountryApplyingFrom(application.country_applying_from ?? '');
        setVisaType(application.visa_type);
        setRelationshipStatus(application.relationship_status ?? 'married');
        setChildrenCount(String(application.children_count ?? 0));
        setIncome(application.income != null ? String(application.income) : '');
        setIncomeCountry(application.income_country ?? null);
      }
      setLoadingExisting(false);
    })();
  }, [applicationId]);

  async function handleSubmit() {
    if (nameMissing || nationalityMissing || countryApplyingFromMissing || visaTypeMissing || incomeCountryMissing) {
      setShowErrors(true);
      Alert.alert('Missing info', 'Please fill in all required fields (marked with *).');
      return;
    }
    if (!visaType) return; // unreachable — narrows visaType below

    const answers: QuestionnaireAnswers = {
      nationality,
      countryApplyingFrom,
      visaType,
      relationshipStatus: visaType === 'spouse' ? relationshipStatus : undefined,
      childrenCount: childrenCountNumber,
      income: income ? Number(income) : undefined,
      incomeCountry: visaType === 'spouse' ? incomeCountry ?? undefined : undefined,
      hasSponsor: visaType === 'spouse' || visaType === 'skilled_worker',
    };

    setSaving(true);

    const fields = {
      applicant_name: applicantName,
      nationality,
      country_applying_from: countryApplyingFrom,
      visa_type: visaType,
      relationship_status: relationshipStatus,
      children_count: childrenCountNumber,
      income: income ? Number(income) : null,
      income_country: incomeCountry ?? undefined,
    };

    // Editing only updates the application's own fields — it intentionally
    // leaves the existing checklist and timeline progress untouched, even if
    // the visa type changed, so ticked-off items aren't wiped out.
    if (isEditing) {
      if (isLocalModeActive()) {
        await mockUpdateApplication(applicationId!, fields);
      } else {
        await supabase.from('applications').update(fields).eq('id', applicationId!);
      }
      setSaving(false);
      router.push({ pathname: '/(tabs)/timeline', params: { applicationId: applicationId! } });
      return;
    }

    let newApplicationId: string;

    if (isLocalModeActive()) {
      const application = await mockCreateApplication({ owner_id: MOCK_OWNER_ID, skip_checklist: false, ...fields });
      newApplicationId = application.id;
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const ownerId = userData.user?.id;
      if (!ownerId) {
        Alert.alert('Error', 'You must be signed in.');
        setSaving(false);
        return;
      }

      const { data: application, error } = await supabase
        .from('applications')
        .insert({ owner_id: ownerId, skip_checklist: false, ...fields })
        .select()
        .single();

      if (error || !application) {
        Alert.alert('Error saving application', error?.message ?? 'Unknown error');
        setSaving(false);
        return;
      }
      newApplicationId = application.id;
    }

    const checklist = generateChecklist(answers);
    const checklistRows = checklist.map((item) => ({
      application_id: newApplicationId,
      item_key: item.key,
      label: item.label,
      explanation: item.explanation,
      requirements: item.requirements,
      examples: item.examples,
      common_mistakes: item.commonMistakes,
    }));

    // Seed timeline stages, all incomplete initially
    const stages = ['submitted', 'biometrics', 'received', 'processing', 'decision_made'];
    const timelineRows = stages.map((stage) => ({ application_id: newApplicationId, stage, completed: false }));

    if (isLocalModeActive()) {
      await mockInsertChecklistItems(checklistRows);
      await mockInsertTimelineEvents(timelineRows);
    } else {
      await supabase.from('checklist_items').insert(checklistRows);
      await supabase.from('timeline_events').insert(timelineRows);
    }

    setSaving(false);
    // Alert.alert is a no-op on web, so navigate unconditionally rather than
    // gating it behind the alert's button — this still shows nicely on
    // native (iOS/Android) via Expo Go.
    Alert.alert('Route detected', detectRoute(answers));

    // Guests only have their checklist saved to this device's local storage,
    // so this is the first natural moment to nudge them toward an account
    // before they navigate away and risk losing it.
    if (isGuestModeActive()) {
      setPendingApplicationId(newApplicationId);
      setShowSavePrompt(true);
      return;
    }

    router.push({ pathname: '/(tabs)/timeline', params: { applicationId: newApplicationId } });
  }

  function dismissSavePrompt() {
    setShowSavePrompt(false);
    if (pendingApplicationId) {
      router.push({ pathname: '/(tabs)/timeline', params: { applicationId: pendingApplicationId } });
    }
  }

  function handleCreateAccountFromPrompt() {
    setShowSavePrompt(false);
    router.push({ pathname: '/auth/login', params: { mode: 'signup' } });
  }

  if (loadingExisting) {
    return (
      <View style={styles.centered}>
        <Text>Loading application…</Text>
      </View>
    );
  }

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.heading}>{isEditing ? 'Edit Application' : 'New Application'}</Text>

      <Text style={styles.label}>
        Applicant name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, showErrors && nameMissing && styles.inputError]}
        value={applicantName}
        onChangeText={setApplicantName}
        placeholder="e.g. Maria Santos"
      />

      <Text style={styles.label}>
        Nationality <Text style={styles.required}>*</Text>
      </Text>
      <CountryPicker
        value={nationality}
        onChange={setNationality}
        placeholder="Select your nationality"
        error={showErrors && nationalityMissing}
      />

      <Text style={styles.label}>
        Country applying from <Text style={styles.required}>*</Text>
      </Text>
      <CountryPicker
        value={countryApplyingFrom}
        onChange={setCountryApplyingFrom}
        placeholder="Select the country you're applying from"
        error={showErrors && countryApplyingFromMissing}
      />

      <Text style={styles.label}>
        Visa type <Text style={styles.required}>*</Text>
      </Text>
      <View style={[styles.optionRow, showErrors && visaTypeMissing && styles.optionRowError]}>
        {VISA_TYPES.map((v) => (
          <TouchableOpacity
            key={v.key}
            style={[styles.optionChip, visaType === v.key && styles.optionChipSelected]}
            onPress={() => setVisaType(v.key)}
          >
            <Text style={[styles.optionChipText, visaType === v.key && styles.optionChipTextSelected]}>{v.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {visaType === 'spouse' && (
        <>
          <Text style={styles.label}>Relationship status</Text>
          <View style={styles.optionRow}>
            {(['married', 'engaged', 'partner', 'single'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.optionChip, relationshipStatus === status && styles.optionChipSelected]}
                onPress={() => setRelationshipStatus(status)}
              >
                <Text style={[styles.optionChipText, relationshipStatus === status && styles.optionChipTextSelected]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>
            Sponsor's income location <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.optionRow, showErrors && incomeCountryMissing && styles.optionRowError]}>
            {(['uk', 'overseas'] as const).map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.optionChip, incomeCountry === c && styles.optionChipSelected]}
                onPress={() => setIncomeCountry(c)}
              >
                <Text style={[styles.optionChipText, incomeCountry === c && styles.optionChipTextSelected]}>
                  {c === 'uk' ? 'UK income' : 'Overseas income'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Annual income ({incomeCurrency}, optional)</Text>
      <TextInput
        style={styles.input}
        value={formatThousands(income)}
        onChangeText={(text) => setIncome(text.replace(/[^\d]/g, ''))}
        keyboardType="numeric"
        placeholder="e.g. 25,000"
      />
      {incomeCurrency !== 'GBP' && (
        <Text style={styles.helperText}>
          Entered in {incomeCurrency} (based on the country you're applying from) — converted to GBP below using an
          approximate exchange rate. Always check a current rate before relying on this for a real application.
        </Text>
      )}

      {visaType === 'spouse' && incomeGBP !== null && (
        <View style={styles.incomeCheckBox}>
          <Icon name="info" size={15} color={colors.textSecondary} />
          <Text style={styles.incomeCheckText}>
            ≈ £{Math.round(incomeGBP).toLocaleString()} GBP entered, against the published £
            {SPOUSE_VISA_MINIMUM_INCOME_GBP.toLocaleString()} threshold for this route. Income can often be combined
            with savings or other sources — see the Financial evidence item in your checklist for what counts.
          </Text>
        </View>
      )}
      {visaType === 'spouse' && !!income && incomeGBP === null && (
        <Text style={styles.helperText}>
          Couldn't recognise {incomeCurrency} to convert this automatically — enter the amount in GBP to check it
          against the threshold.
        </Text>
      )}

      {visaType === 'spouse' && incomeMeetsSpouseThreshold === false && (
        <SolicitorReferralCard context="questionnaire_income_shortfall" />
      )}

      {visaType === 'spouse' && (
        <Text style={styles.helperText}>
          Minimum income requirement: £{SPOUSE_VISA_MINIMUM_INCOME_GBP.toLocaleString()}/year combined. This flat
          threshold applies no matter how many children are included (per-child add-ons were removed when the
          threshold rose on 11 April 2024) — always confirm the current figure on GOV.UK.
        </Text>
      )}

      <Text style={styles.label}>How many children are included in this application?</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setChildrenCount(String(Math.max(0, childrenCountNumber - 1)))}
        >
          <Text style={styles.stepperButtonText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.stepperInput}
          value={childrenCount}
          onChangeText={setChildrenCount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.stepperButton} onPress={() => setChildrenCount(String(childrenCountNumber + 1))}>
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.submitButtonText}>
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Get My Checklist'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        This checklist is general guidance based on common requirements, not personalised legal advice.
        Always confirm document requirements against current GOV.UK guidance.
      </Text>

      <Modal visible={showSavePrompt} transparent animationType="fade" onRequestClose={dismissSavePrompt}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Save your progress?</Text>
            <Text style={styles.modalMessage}>
              You're using UK Visa Tracker as a guest, so your checklist is only saved on this device. Create a free
              account to keep it safe and access it anywhere.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={dismissSavePrompt}>
                <Text style={styles.modalCancelText}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreateAccountButton} onPress={handleCreateAccountFromPrompt}>
                <Text style={styles.modalCreateAccountText}>Create Free Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 6, color: '#333' },
  required: { color: '#c0392b' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  inputError: { borderColor: '#c0392b' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionRowError: { borderWidth: 1, borderColor: '#c0392b', borderRadius: 12, padding: 8 },
  optionChip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, marginBottom: 8 },
  optionChipSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e' },
  optionChipText: { fontSize: 13, color: '#333' },
  optionChipTextSelected: { color: '#fff', fontWeight: '600' },
  helperText: { fontSize: 12, color: '#666', marginTop: 8, lineHeight: 17 },
  incomeCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#f2f4f7',
    borderWidth: 1,
    borderColor: '#dde1e6',
  },
  incomeCheckText: { fontSize: 13, fontWeight: '500', color: '#333', flex: 1 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: { fontSize: 20, fontWeight: '600', color: '#1a3c6e' },
  stepperInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginHorizontal: 10,
    width: 60,
    textAlign: 'center',
  },
  submitButton: { backgroundColor: '#1a3c6e', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 28 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  disclaimer: { fontSize: 11, color: '#999', marginTop: 16, marginBottom: 40, lineHeight: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 420 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#444', lineHeight: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, flexWrap: 'wrap' },
  modalCancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#333' },
  modalCreateAccountButton: { backgroundColor: '#1a3c6e', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginLeft: 8 },
  modalCreateAccountText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
