import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { VisaType } from '../../lib/visaLogic';
import CountryPicker from '../../components/CountryPicker';
import Screen from '../../components/Screen';
import Icon from '../../components/Icon';
import { colors } from '../../lib/theme';
import { getVacInfo, directionsUrl } from '../../lib/vacLocations';

const OFFICIAL_LOCATION_LINKS = {
  englishTest: { label: 'Find an approved English test centre', url: 'https://www.gov.uk/guidance/approved-english-language-tests' },
  tbTest: {
    label: 'Find an approved TB test clinic',
    url: 'https://www.gov.uk/government/collections/tuberculosis-testing-home-office-approved-clinics',
  },
  biometricsOutsideUk: { label: 'Find a visa application centre', url: 'https://www.gov.uk/find-a-visa-application-centre' },
  biometricsInsideUk: { label: 'Applying from inside the UK? Use UKVCAS instead', url: 'https://www.gov.uk/ukvcas' },
};

const LOCATION_VISA_TYPES: { key: VisaType; label: string }[] = [
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

function ExternalLink({ label, url, secondary }: { label: string; url: string; secondary?: boolean }) {
  return (
    <TouchableOpacity style={styles.externalLinkRow} onPress={() => Linking.openURL(url)}>
      <Text style={secondary ? styles.locationRowLinkSecondary : styles.locationRowLink}>{label}</Text>
      <Icon name="external-link" size={12} color={secondary ? '#666' : colors.primary} />
    </TouchableOpacity>
  );
}

export default function TestLocationsScreen() {
  const router = useRouter();
  const [visaType, setVisaType] = useState<VisaType>('spouse');
  const [country, setCountry] = useState('');

  const requiresEnglishAndTb = ENGLISH_AND_TB_APPLICABLE[visaType];

  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/(tabs)/visa-info')}>
        <Icon name="chevron-left" size={16} color={colors.primary} />
        <Text style={styles.backLinkText}>Back to Visa Info</Text>
      </TouchableOpacity>
      <View style={styles.headingRow}>
        <Icon name="map-pin" size={20} color={colors.primary} />
        <Text style={styles.heading}>Test & Biometrics Locations</Text>
      </View>
      <Text style={styles.subheading}>Find the official, Home Office–recognised place to take your test or give biometrics.</Text>

      <Text style={styles.label}>Visa type</Text>
      <View style={styles.optionRow}>
        {LOCATION_VISA_TYPES.map((v) => (
          <Text
            key={v.key}
            onPress={() => setVisaType(v.key)}
            style={[styles.chip, visaType === v.key && styles.chipSelected]}
          >
            {v.label}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Where are you applying from?</Text>
      <CountryPicker value={country} onChange={setCountry} placeholder="Select the country you're applying from" />

      {!country && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBadge}>
            <Icon name="map-pin" size={22} color={colors.primary} />
          </View>
          <Text style={styles.emptyStateText}>Select a country above to find your nearest test and biometrics location.</Text>
        </View>
      )}

      {!!country && (
        <View style={styles.locationsCard}>
          <View style={styles.locationsTitleRow}>
            <Icon name="check-circle" size={15} color={colors.primary} />
            <Text style={styles.locationsTitle}>Official, Home Office–recognised locations</Text>
          </View>
          <Text style={styles.locationsSubtitle}>
            For applicants in {country} — these link straight to GOV.UK's own finder tools, so they're always
            current.
          </Text>

          {requiresEnglishAndTb && (
            <View style={styles.locationRow}>
              <View style={styles.locationRowTitleRow}>
                <Icon name="mic" size={14} color={colors.textSecondary} />
                <Text style={styles.locationRowTitle}>English test</Text>
              </View>
              <Text style={styles.locationRowText}>
                Only Secure English Language Tests (SELT) from an approved provider count — search by country on
                each provider's own site (IELTS Life Skills, LanguageCert, PSI, Pearson).
              </Text>
              <ExternalLink label={OFFICIAL_LOCATION_LINKS.englishTest.label} url={OFFICIAL_LOCATION_LINKS.englishTest.url} />
            </View>
          )}

          {requiresEnglishAndTb && (
            <View style={styles.locationRow}>
              <View style={styles.locationRowTitleRow}>
                <Icon name="activity" size={14} color={colors.textSecondary} />
                <Text style={styles.locationRowTitle}>TB test</Text>
              </View>
              <Text style={styles.locationRowText}>
                You must test at a Home Office-approved clinic — some countries don't have one, in which case you'll
                need to test in a nearby country that does.
              </Text>
              <ExternalLink label={OFFICIAL_LOCATION_LINKS.tbTest.label} url={OFFICIAL_LOCATION_LINKS.tbTest.url} />
            </View>
          )}

          <BiometricsSection country={country} />
        </View>
      )}
    </Screen>
  );
}

function BiometricsSection({ country }: { country: string }) {
  const vacInfo = getVacInfo(country);

  return (
    <View style={styles.locationRow}>
      <View style={styles.locationRowTitleRow}>
        <Icon name="user-check" size={14} color={colors.textSecondary} />
        <Text style={styles.locationRowTitle}>Biometrics & Visa Application Centre</Text>
      </View>
      <Text style={styles.locationRowText}>
        Biometric enrolment (fingerprints + photo) happens at a visa application centre run by an official Home
        Office partner (VFS Global, TLScontact, or similar).
      </Text>

      {vacInfo?.verified && vacInfo.centres.length > 0 && (
        <View style={styles.vacCentreList}>
          {vacInfo.centres.map((centre) => (
            <View key={centre.city} style={styles.vacCentreRow}>
              <View style={styles.vacCentreCityRow}>
                <Icon name="check" size={13} color="#2e7d32" />
                <Text style={styles.vacCentreCity}>{centre.city}</Text>
              </View>
              <View style={styles.vacCentreDistrictRow}>
                <Icon name="map-pin" size={11} color={colors.textSecondary} />
                <Text style={styles.vacCentreDistrict}>{centre.district}</Text>
              </View>
              <TouchableOpacity style={styles.directionsRow} onPress={() => Linking.openURL(directionsUrl(centre, country))}>
                <Icon name="navigation" size={12} color={colors.primary} />
                <Text style={styles.locationRowLink}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {vacInfo?.verified && vacInfo.centres.length === 0 && (
        <View style={styles.vacNoneBox}>
          <View style={styles.vacNoneTitleRow}>
            <Icon name="x-circle" size={14} color="#c0392b" />
            <Text style={styles.vacNoneTitle}>There is currently no UK Visa Application Centre in {country}.</Text>
          </View>
          <Text style={styles.locationRowText}>
            Use the official finder below — it will show you which centre to use instead (subject to your right to
            apply from that country).
          </Text>
        </View>
      )}

      {!vacInfo?.verified && (
        <Text style={styles.locationRowText}>
          We haven't individually verified centre-by-centre details for {country} yet — use the official finder
          below for current locations.
        </Text>
      )}

      <ExternalLink label={OFFICIAL_LOCATION_LINKS.biometricsOutsideUk.label} url={OFFICIAL_LOCATION_LINKS.biometricsOutsideUk.url} />
      <ExternalLink
        label={OFFICIAL_LOCATION_LINKS.biometricsInsideUk.label}
        url={OFFICIAL_LOCATION_LINKS.biometricsInsideUk.url}
        secondary
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  heading: { fontSize: 22, fontWeight: '700' },
  subheading: { fontSize: 14, color: '#666', marginBottom: 20 },
  backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backLinkText: { fontSize: 15, color: '#1a3c6e', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 6, color: '#333' },
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
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, marginTop: 8 },
  emptyIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyStateText: { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  locationsCard: { backgroundColor: '#eef2f8', borderRadius: 14, padding: 18, marginTop: 24 },
  locationsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationsTitle: { fontSize: 15, fontWeight: '700', color: '#1a3c6e' },
  locationsSubtitle: { fontSize: 12, color: '#555', marginTop: 6, lineHeight: 17, marginBottom: 14 },
  locationRow: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#dde4ef' },
  locationRowTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationRowTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  locationRowText: { fontSize: 12, color: '#555', marginTop: 4, lineHeight: 17 },
  externalLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, alignSelf: 'flex-start' },
  locationRowLink: { fontSize: 13, color: '#1a3c6e', fontWeight: '600', textDecorationLine: 'underline' },
  locationRowLinkSecondary: { fontSize: 12, color: '#666', fontWeight: '600', textDecorationLine: 'underline' },
  vacCentreList: { marginTop: 10 },
  vacCentreRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginTop: 8 },
  vacCentreCityRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  vacCentreCity: { fontSize: 14, fontWeight: '700', color: '#2e7d32' },
  vacCentreDistrictRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  vacCentreDistrict: { fontSize: 12, color: '#555' },
  directionsRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, alignSelf: 'flex-start' },
  vacNoneBox: { backgroundColor: '#fdecea', borderRadius: 10, padding: 12, marginTop: 10 },
  vacNoneTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vacNoneTitle: { fontSize: 13, fontWeight: '700', color: '#c0392b', flex: 1 },
});
