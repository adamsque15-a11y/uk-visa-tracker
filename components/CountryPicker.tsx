import { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { COUNTRIES, Country } from '../lib/countries';

interface CountryPickerProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  error?: boolean;
}

export default function CountryPicker({ value, onChange, placeholder = 'Select a country', error }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const selected = COUNTRIES.find((c) => c.name === value);

  const filtered = useMemo(() => {
    if (!query) return COUNTRIES;
    const q = query.toLowerCase();
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  function handleSelect(country: Country) {
    onChange(country.name);
    setQuery('');
    setVisible(false);
  }

  return (
    <>
      <TouchableOpacity style={[styles.input, error && styles.inputError]} onPress={() => setVisible(true)}>
        <Text style={selected ? styles.valueText : styles.placeholderText}>
          {selected ? `${selected.flag}  ${selected.name}` : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.rowText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, justifyContent: 'center' },
  inputError: { borderColor: '#c0392b' },
  valueText: { fontSize: 15, color: '#000' },
  placeholderText: { fontSize: 15, color: '#999' },
  modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  flag: { fontSize: 22, marginRight: 12 },
  rowText: { fontSize: 15 },
  closeButton: { padding: 16, alignItems: 'center' },
  closeButtonText: { fontSize: 15, color: '#1a3c6e', fontWeight: '600' },
});
