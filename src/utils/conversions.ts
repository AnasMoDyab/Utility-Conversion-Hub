// Centralized conversion & utility functions

// Weight conversions base unit kg
export function kgToLb(kg: number) { return kg * 2.2046226218; }
export function lbToKg(lb: number) { return lb / 2.2046226218; }
export function kgToOz(kg: number) { return kgToLb(kg) * 16; }
export function ozToKg(oz: number) { return lbToKg(oz / 16); }
export function kgToStone(kg: number) { return kg * 0.157473044; }
export function stoneToKg(st: number) { return st / 0.157473044; }

// Length conversions base unit meter
export function mToKm(m: number) { return m / 1000; }
export function kmToM(km: number) { return km * 1000; }
export function mToFt(m: number) { return m * 3.280839895; }
export function ftToM(ft: number) { return ft / 3.280839895; }
export function mToIn(m: number) { return m * 39.37007874; }
export function inToM(i: number) { return i / 39.37007874; }
export function mToMiles(m: number) { return m / 1609.344; }
export function milesToM(mi: number) { return mi * 1609.344; }

// Temperature
export function cToF(c: number) { return c * 9/5 + 32; }
export function fToC(f: number) { return (f - 32) * 5/9; }
export function cToK(c: number) { return c + 273.15; }
export function kToC(k: number) { return k - 273.15; }
export function fToK(f: number) { return cToK(fToC(f)); }
export function kToF(k: number) { return cToF(kToC(k)); }

// Volume base liter
export function lToMl(l: number) { return l * 1000; }
export function mlToL(ml: number) { return ml / 1000; }
export function lToGallonUS(l: number) { return l * 0.264172052; }
export function gallonUSToL(g: number) { return g / 0.264172052; }
export function lToCupUS(l: number) { return l * 4.2267528377; }
export function cupUSToL(c: number) { return c / 4.2267528377; }

// Speed
export function kmhToMph(kmh: number) { return kmh * 0.621371192; }
export function mphToKmh(mph: number) { return mph / 0.621371192; }
export function kmhToMs(kmh: number) { return kmh / 3.6; }
export function msToKmh(ms: number) { return ms * 3.6; }

// BMI
export function bmi(weightKg: number, heightCm: number) {
  const hM = heightCm / 100;
  const val = weightKg / (hM * hM);
  let category: string;
  if (val < 18.5) category = 'Underweight';
  else if (val < 25) category = 'Normal';
  else if (val < 30) category = 'Overweight';
  else category = 'Obese';
  return { value: +val.toFixed(2), category };
}

// Tip & Tax
export function tipAndTax(amount: number, tipPct: number, taxPct: number) {
  const tip = amount * (tipPct/100);
  const tax = amount * (taxPct/100);
  const total = amount + tip + tax;
  return { tip: +tip.toFixed(2), tax: +tax.toFixed(2), total: +total.toFixed(2) };
}

// Percentage utilities
export function discount(original: number, discountPct: number) {
  const saved = original * (discountPct/100);
  return { saved: +saved.toFixed(2), final: +(original - saved).toFixed(2) };
}
export function increase(value: number, pct: number) { return +(value * (1 + pct/100)).toFixed(2); }
export function decrease(value: number, pct: number) { return +(value * (1 - pct/100)).toFixed(2); }

// Basic math
export function factorial(n: number): number { if (n < 0) return NaN; let r=1; for(let i=2;i<=Math.floor(n);i++) r*=i; return r; }
export function power(base: number, exp: number) { return Math.pow(base, exp); }
export function sqrt(x: number) { return Math.sqrt(x); }

// Unit price
export function unitPrice(totalPrice: number, quantity: number) { return quantity === 0 ? NaN : +(totalPrice/quantity).toFixed(4); }

// Age calculator
export function ageFromDOB(dob: Date) {
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const mDiff = now.getMonth() - dob.getMonth();
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < dob.getDate())) years--;
  return years;
}

// Timezone conversion placeholder (real impl would use Intl APIs)
export function convertTimezone(date: Date, targetOffsetMinutes: number) {
  const utc = date.getTime() + date.getTimezoneOffset()*60000;
  return new Date(utc + targetOffsetMinutes*60000);
}

// Currency conversion placeholder (requires real rates)
export function convertCurrency(amount: number, rate: number) { return +(amount * rate).toFixed(2); }
