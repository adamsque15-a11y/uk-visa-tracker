import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { parseISODate } from '../lib/workingDays';
import Calendar from './Calendar';
import { colors, radius, spacing } from '../lib/theme';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Select a date' }: DatePickerProps) {
  const parsedValue = value ? parseISODate(value) : null;
  const [visible, setVisible] = useState(false);

  function handleChange(date: string) {
    onChange(date);
    setVisible(false);
  }

  const displayText = parsedValue
    ? parsedValue.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : placeholder;

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={() => setVisible(true)}>
        <Text style={parsedValue ? styles.valueText : styles.placeholderText}>{displayText}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Calendar value={value} onChange={handleChange} />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 12, justifyContent: 'center' },
  valueText: { fontSize: 15, color: colors.textPrimary },
  placeholderText: { fontSize: 15, color: colors.textTertiary },
  overlay: { flex: 1, backgroundColor: 'rgba(16,24,40,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, width: '100%', maxWidth: 360 },
  cancelButton: { marginTop: spacing.md, alignItems: 'center', paddingVertical: 10 },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
});
