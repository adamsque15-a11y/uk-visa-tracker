/**
 * UK Visa Application Centre (VAC) location data, keyed by country name
 * (matching lib/countries.ts names).
 *
 * This is a hand-verified allowlist, NOT a comprehensive directory — VFS
 * Global's own site blocks automated fetching, so district-level detail can
 * only be included where it's been specifically checked. Every other
 * country falls back to an honest "not yet verified" state that still
 * points to the official GOV.UK finder, rather than guessing.
 *
 * Opening hours are deliberately omitted: without a verified live source,
 * a fixed "9am–5pm" would go stale and could be wrong. "Get Directions"
 * links are generated as a live Google Maps search instead of hardcoded
 * coordinates, so they can't go stale either.
 */

export interface VacCentre {
  city: string;
  district: string;
}

export interface CountryVacInfo {
  /** true once this country's data below has actually been checked against a source. */
  verified: boolean;
  /** Known open centres. Empty + verified:true means "confirmed no centre". */
  centres: VacCentre[];
}

// Countries below with an empty centres array are confirmed to have no VAC,
// per a list supplied 2026-07-11. Names must match lib/countries.ts (the
// country-list package's official English short names) exactly, or the
// lookup in getVacInfo() silently misses.
const NO_CENTRE_COUNTRIES = [
  'Afghanistan',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua and Barbuda',
  'Aruba',
  'Belize',
  'Benin',
  'Burkina Faso',
  'Burundi',
  'Chad',
  'Comoros (the)',
  'Cuba',
  'Djibouti',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Gabon',
  'Gambia (the)',
  'Grenada',
  'Guinea',
  'Guinea-Bissau',
  'Haiti',
  'Kiribati',
  'Lesotho',
  'Liberia',
  'Liechtenstein',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Monaco',
  'Niger (the)',
  "Korea (the Democratic People's Republic of)", // North Korea
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Seychelles',
  'Solomon Islands',
  'Somalia',
  'South Sudan',
  'Syrian Arab Republic (the)',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Tuvalu',
  'Vanuatu',
  'Holy See (the)', // Vatican City
  'Western Sahara*',
  'Yemen',
];

// Addresses below were researched via web search on 2026-07-11, since VFS
// Global's own site (visa.vfsglobal.com) returns 403 to automated fetches.
// Most are corroborated by an official source (a VFS Global press release,
// its own X/Twitter announcement, or a GOV.UK news post); a few rely on
// consistent third-party aggregator listings where no official source
// surfaced. Addresses can change without notice (VACs do relocate), so this
// is necessarily a snapshot, not a live feed — the official finder link is
// always shown alongside it for that reason.
export const VAC_LOCATIONS: Record<string, CountryVacInfo> = {
  China: {
    verified: true,
    centres: [
      { city: 'Guangzhou', district: '7/F, GAL Tower, No. 78 Pazhou Avenue, Haizhu District, Guangzhou 510308' },
      { city: 'Shanghai', district: '2/F, Jiushi Commercial Building, 213 Middle Sichuan Road, Huangpu District, Shanghai 200002' },
      { city: 'Beijing', district: 'West Gate, Floor B1, Guanghua Lu SOHO II, No. 9 Guanghua Lu, Chaoyang District, Beijing 100020' },
    ],
  },
  India: {
    verified: true,
    centres: [
      { city: 'Mumbai', district: "Trade Centre, 'G' Block, First Floor, Bandra Kurla Complex, Bandra (East), Mumbai 400051" },
      { city: 'Chennai', district: 'Ramee Mall, 2nd Floor, No. 365, Anna Salai, Teynampet, Chennai 600018' },
      { city: 'Pune', district: '93 Avenue Mall, 4th Floor, Kalubai Chowk, Wanowarie, Pune 411022' },
    ],
  },
  Pakistan: {
    verified: true,
    centres: [{ city: 'Islamabad', district: 'Park Road, Chattha Bakhtawar, Chak Shahzad, Islamabad' }],
  },
  Nigeria: {
    verified: true,
    centres: [
      { city: 'Abuja', district: 'Sterling Bank Plaza, 3rd Floor, Plot 1083, Muhammadu Buhari Way, Central Business District, Abuja' },
      { city: 'Lagos (Ikeja)', district: 'Ile Oja Opebi, No. 2 Opebi Road, Ikeja, Lagos' },
      { city: 'Lagos (Victoria Island)', district: '2nd Floor, Churchgate Tower 2, Plot PC 31, Churchgate Street, Victoria Island, Lagos' },
    ],
  },
  'United States of America (the)': {
    verified: true,
    centres: [
      { city: 'New York', district: '128 East 32nd Street, 4th Floor, New York, NY 10016' },
      { city: 'Los Angeles', district: '5757 Wilshire Blvd, 5th Floor, Suite 504, Los Angeles, CA 90036' },
      { city: 'Washington, D.C.', district: '1025 Vermont Avenue NW, Floor 2, Washington, DC 20005' },
    ],
  },
  'Philippines (the)': {
    verified: true,
    centres: [{ city: 'Manila', district: '6th Floor, Makati Circuit Corporate Tower Two, AP Reyes Street, Brgy. Carmona, Circuit, Makati City 1207' }],
  },
  Ghana: {
    verified: true,
    centres: [{ city: 'Accra', district: 'Mezzanine Floor, Grand Oyeeman, South Liberation Road, Airport Area, Accra' }],
  },
  Bangladesh: {
    verified: true,
    centres: [{ city: 'Dhaka', district: 'Delta Life Tower, 4th Floor, Plot 37, Road 45, Gulshan 2, Dhaka 1212' }],
  },
  'Sri Lanka': {
    verified: true,
    centres: [{ city: 'Colombo', district: '75, Arnold Ratnayake Mawatha, Colombo 10' }],
  },
  Kenya: {
    verified: true,
    centres: [{ city: 'Nairobi', district: 'Mezzanine, 1st Floor, Principal Place, Westlands, Nairobi' }],
  },
  'South Africa': {
    verified: true,
    centres: [{ city: 'Johannesburg', district: 'Rivonia Village, 3rd Floor, Cnr Rivonia Boulevard and Mutual Road, Sandton, Johannesburg 2196' }],
  },
  Türkiye: {
    verified: true,
    centres: [
      { city: 'Istanbul', district: 'Esentepe Mahallesi, Büyükdere Caddesi, Astoria AVM, Floor B1, 34394 Şişli' },
      { city: 'Ankara', district: 'İşçi Blokları Mahallesi, Muhsin Yazıcıoğlu Caddesi No: 57/A, Regnum Sky Tower, Çankaya' },
    ],
  },
  'United Arab Emirates (the)': {
    verified: true,
    centres: [
      { city: 'Dubai', district: 'Wafi Mall, 3rd Floor, Falcon, Phase 2, Umm Hurair 2, Dubai' },
      { city: 'Abu Dhabi', district: 'Level B2 (Lower Ground), The Mall, World Trade Centre, Khalifa Bin Zayed The 1st Street, Abu Dhabi' },
    ],
  },
  'Saudi Arabia': {
    verified: true,
    centres: [
      { city: 'Riyadh', district: 'Al Hada District, Makkah Road (near Ritz Carlton), Riyadh' },
      { city: 'Jeddah', district: 'Tasheel Commercial Plaza, Ground Floor, Al Mohammadiya District, Jeddah' },
    ],
  },
  Thailand: {
    verified: true,
    centres: [{ city: 'Bangkok', district: 'The Shoppes at Belle Grand Rama 9, Unit BS003, 1st Floor, 131/1 Rama 9 Rd, Huay Kwang' }],
  },
  'Viet Nam': {
    verified: true,
    centres: [
      { city: 'Hanoi', district: '3rd Floor, Gelex Building, 52 Le Dai Hanh, Hai Ba Trung District' },
      { city: 'Ho Chi Minh City', district: '5th Floor, Resco Building, No. 94-96 Nguyen Du Street, District 1' },
    ],
  },
  Indonesia: {
    verified: true,
    centres: [{ city: 'Jakarta', district: 'Kuningan City Mall, 1st Floor, No L1-30-32, Jl. Prof. Dr. Satrio Kav. 18, Setiabudi, Kuningan, Jakarta 12940' }],
  },
  Nepal: {
    verified: true,
    centres: [{ city: 'Kathmandu', district: '4th Floor, LS Building, Thapathali 11, Kathmandu' }],
  },
  ...Object.fromEntries(NO_CENTRE_COUNTRIES.map((name) => [name, { verified: true, centres: [] }])),
};

export function getVacInfo(countryName: string): CountryVacInfo | undefined {
  return VAC_LOCATIONS[countryName];
}

export function directionsUrl(centre: VacCentre, countryName: string): string {
  const query = `UK Visa Application Centre, ${centre.district}, ${centre.city}, ${countryName}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
