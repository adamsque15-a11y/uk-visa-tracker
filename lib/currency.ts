import countryToCurrency from 'country-to-currency';
import { COUNTRIES } from './countries';
import { GBP_EXCHANGE_RATES } from './currencyRates';

/** Looks up the ISO 4217 currency code typically used in the given country name. */
export function getCurrencyForCountry(countryName: string): string | null {
  const country = COUNTRIES.find((c) => c.name === countryName);
  if (!country) return null;
  return (countryToCurrency as Record<string, string>)[country.code] ?? null;
}

/** Converts an amount in the given currency to an approximate GBP figure. Returns null for unrecognised currencies. */
export function convertToGBP(amount: number, currencyCode: string): number | null {
  if (currencyCode === 'GBP') return amount;
  const rate = GBP_EXCHANGE_RATES[currencyCode];
  if (!rate) return null;
  return amount / rate;
}

/** Adds thousands separators to a plain digit string, e.g. "25000" -> "25,000". Used to live-format currency-amount inputs as the user types. */
export function formatThousands(digits: string): string {
  if (!digits) return '';
  return Number(digits).toLocaleString('en-GB');
}
