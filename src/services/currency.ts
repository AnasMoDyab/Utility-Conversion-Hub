import axios from 'axios';

export interface RatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

export async function fetchLatestRates(): Promise<RatesResponse> {
  const key = process.env.REACT_APP_OXR_KEY;
  if (!key) throw new Error('Mangler API-nøkkel (REACT_APP_OXR_KEY).');
  const url = `https://openexchangerates.org/api/latest.json?app_id=${key}`;
  const { data } = await axios.get<RatesResponse>(url);
  return data;
}

export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (!rates[from] || !rates[to]) return NaN;
  // Alle kurser er relativ til USD (gratis plan). Fra -> USD -> Til.
  const amountInUSD = amount / rates[from];
  const converted = amountInUSD * rates[to];
  return +converted.toFixed(4);
}
