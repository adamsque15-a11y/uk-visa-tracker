import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import { supabase } from '../lib/supabase';
import { VisaType, QuestionnaireAnswers, generateChecklist } from '../lib/visaLogic';
import { isLocalModeActive } from '../lib/localMode';
import { isGuestModeActive } from '../lib/guestMode';
import { MOCK_OWNER_ID, mockCreateApplication, mockInsertChecklistItems, mockInsertTimelineEvents } from '../lib/mockDb';
import AdviceBoundaryNotice from '../components/AdviceBoundaryNotice';

const VISA_TYPES: { key: VisaType; label: string }[] = [
  { key: 'spouse', label: 'Spouse / Family Visa' },
  { key: 'skilled_worker', label: 'Skilled Worker Visa' },
  { key: 'student', label: 'Student Visa' },
  { key: 'visitor', label: 'Visitor Visa' },
];

const STAGES = ['submitted', 'biometrics', 'received', 'processing', 'decision_made'];

export default function QuickTrackScreen() {
  const router = useRouter();
  const [applicantName, setApplicantName] = useState('');
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingApplicationId, setPendingApplicationId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const nameMissing = !applicantName.trim();
  const visaTypeMissing = !visaType;

  async function handleSubmit() {
    if (nameMissing || visaTypeMissing) {
      setShowErrors(true);
      Alert.alert('Missing info', 'Please fill in all required fields (marked with *).');
      return;
    }
    if (!visaType) return; // unreachable — narrows visaType below

    setSaving(true);

    const fields = {
      applicant_name: applicantName,
      nationality: '',
      country_applying_from: '',
      visa_type: visaType,
      children_count: 0,
      income: null,
      skip_checklist: true,
    };

    let newApplicationId: string;

    if (isLocalModeActive()) {
      const application = await mockCreateApplication({ owner_id: MOCK_OWNER_ID, ...fields });
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
        .insert({ owner_id: ownerId, ...fields })
        .select()
        .single();

      if (error || !application) {
        Alert.alert('Error saving application', error?.message ?? 'Unknown error');
        setSaving(false);
        return;
      }
      newApplicationId = application.id;
    }

    const answers: QuestionnaireAnswers = {
      nationality: '',
      countryApplyingFrom: '',
      visaType,
      childrenCount: 0,
      hasSponsor: visaType === 'spouse' || visaType === 'skilled_worker',
    };
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
    const timelineRows = STAGES.map((stage) => ({ application_id: newApplicationId, stage, completed: false }));

    if (isLocalModeActive()) {
      await mockInsertChecklistItems(checklistRows);
      await mockInsertTimelineEvents(timelineRows);
    } else {
      await supabase.from('checklist_items').insert(checklistRows);
      await supabase.from('timeline_events').insert(timelineRows);
    }

    setSaving(false);

    if (isGuestModeActive()) {
      setPendingApplicationId(newApplicationId);
      setShowSavePrompt(true);
      return;
    }

    router.replace({ pathname: '/(tabs)/timeline', params: { applicationId: newApplicationId, skipChecklist: '1' } });
  }

  function dismissSavePrompt() {
    setShowSavePrompt(false);
    if (pendingApplicationId) {
      router.replace({ pathname: '/(tabs)/timeline', params: { applicationId: pendingApplicationId, skipChecklist: '1' } });
    }
  }

  function handleCreateAccountFromPrompt() {
    setShowSavePrompt(false);
    router.push({ pathname: '/auth/login', params: { mode: 'signup' } });
  }

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Track My Visa</Text>
      <Text style={styles.subheading}>
        Just the essentials — we'll take you straight to tracking your progress.
      </Text>

      <View style={styles.adviceNoticeWrap}>
        <AdviceBoundaryNotice />
      </View>

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={saving}>
        <Text style={styles.submitButtonText}>{saving ? 'Setting up...' : 'Start Tracking'}</Text>
      </TouchableOpacity>

      <Modal visible={showSavePrompt} transparent animationType="fade" onRequestClose={dismissSavePrompt}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Save your progress?</Text>
            <Text style={styles.modalMessage}>
              You're using UK Visa Tracker as a guest, so this application is only saved on this device — it'll be
              lost if you clear your browser or switch devices. Creating a free account now keeps future tracking
              safe in the cloud, but won't move this guest application over automatically — you'd need to re-enter
              it once signed in.
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
  adviceNoticeWrap: { marginTop: 16 },
  backButton: { alignSelf: 'flex-start', marginBottom: 12, padding: 8, marginLeft: -8 },
  backButtonText: { fontSize: 15, color: '#1a3c6e', fontWeight: '600' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
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
  submitButton: { backgroundColor: '#1a3c6e', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 28 },
  submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
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
