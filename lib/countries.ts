import { getData } from 'country-list';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

function isoToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export const COUNTRIES: Country[] = getData()
  .map((c) => ({ code: c.code, name: c.name, flag: isoToFlagEmoji(c.code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const UK_COUNTRY_NAME = COUNTRIES.find((c) => c.code === 'GB')!.name;
