// Ekstra konverterings- og beregningsfunksjoner (Norsk)

// Data storage (1024-basert)
export function bytesToKB(b: number) { return b / 1024; }
export function kbToBytes(kb: number) { return kb * 1024; }
export function bytesToMB(b: number) { return b / 1024 / 1024; }
export function mbToBytes(mb: number) { return mb * 1024 * 1024; }
export function bytesToGB(b: number) { return b / 1024 / 1024 / 1024; }
export function gbToBytes(gb: number) { return gb * 1024 * 1024 * 1024; }
export function bytesToTB(b: number) { return b / 1024 / 1024 / 1024 / 1024; }
export function tbToBytes(tb: number) { return tb * 1024 * 1024 * 1024 * 1024; }

// Energy
// 1 kcal = 4184 J, 1 kWh = 3.6e6 J
export function jouleToKcal(j: number) { return j / 4184; }
export function kcalToJoule(kcal: number) { return kcal * 4184; }
export function jouleToKWh(j: number) { return j / 3_600_000; }
export function kwhToJoule(kwh: number) { return kwh * 3_600_000; }

// Fuel efficiency
// mpg (US) = 235.214583 / (L/100km)
export function lPer100kmToMpg(l: number) { return 235.214583 / l; }
export function mpgToLPer100km(mpg: number) { return 235.214583 / mpg; }

// Pressure (basis Pascal)
// 1 bar = 100000 Pa, 1 psi = 6894.76 Pa
export function paToBar(pa: number) { return pa / 100000; }
export function barToPa(bar: number) { return bar * 100000; }
export function paToPsi(pa: number) { return pa / 6894.76; }
export function psiToPa(psi: number) { return psi * 6894.76; }

// Loan / Mortgage
export interface LoanBreakdown { monthly: number; totalInterest: number; totalPaid: number; schedule: Array<{month:number; interest:number; principal:number; balance:number}>; }
export function loanMonthlyPayment(principal: number, annualRatePct: number, years: number): LoanBreakdown {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) {
    const mNoRate = principal / n;
    return { monthly: +mNoRate.toFixed(2), totalInterest: 0, totalPaid: principal, schedule: [] };
  }
  const monthly = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  let balance = principal;
  const schedule: LoanBreakdown['schedule'] = [];
  let totalInterest = 0;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = monthly - interest;
    balance -= principalPaid;
    totalInterest += interest;
    schedule.push({ month: i, interest: +interest.toFixed(2), principal: +principalPaid.toFixed(2), balance: +Math.max(balance,0).toFixed(2) });
    if (balance <= 0) break;
  }
  return { monthly: +monthly.toFixed(2), totalInterest: +totalInterest.toFixed(2), totalPaid: +(principal + totalInterest).toFixed(2), schedule };
}

// Cooking converter (forenklet densitet i g per cup)
const ingredientDensity: Record<string, number> = {
  'mel': 120, // g per cup
  'sukker': 200,
  'smør': 227,
  'ris': 195,
};
export function cupsToGrams(cups: number, ingredient: string) { const d = ingredientDensity[ingredient]; return d ? cups * d : NaN; }
export function gramsToCups(grams: number, ingredient: string) { const d = ingredientDensity[ingredient]; return d ? grams / d : NaN; }
export function gramsToOunces(g: number) { return g / 28.3495; }
export function ouncesToGrams(oz: number) { return oz * 28.3495; }

// Scientific calculator helpers
export function trigSin(x: number) { return Math.sin(x); }
export function trigCos(x: number) { return Math.cos(x); }
export function trigTan(x: number) { return Math.tan(x); }
export function log10(x: number) { return Math.log10(x); }
export function ln(x: number) { return Math.log(x); }

// Physics helpers
export function force(massKg: number, accelMs2: number) { return massKg * accelMs2; }
export function kineticEnergy(massKg: number, velocityMs: number) { return 0.5 * massKg * velocityMs * velocityMs; }
export function velocity(distanceM: number, timeS: number) { return timeS === 0 ? NaN : distanceM / timeS; }

// Number base conversions
export function decToHex(d: number) { return d.toString(16).toUpperCase(); }
export function decToBin(d: number) { return d.toString(2); }
export function hexToDec(h: string) { return parseInt(h, 16); }
export function binToDec(b: string) { return parseInt(b, 2); }

// Color conversions
export function hexToRgb(hex: string) {
  const clean = hex.replace('#','');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0,2),16);
  const g = parseInt(clean.substring(2,4),16);
  const b = parseInt(clean.substring(4,6),16);
  return { r, g, b };
}
export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}
export function rgbToHsl(r: number, g: number, b: number) {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: +(h*360).toFixed(1), s: +(s*100).toFixed(1), l: +(l*100).toFixed(1) };
}
export function hslToRgb(h: number, s: number, l: number) {
  s/=100; l/=100; h/=360;
  if (s === 0) { const v = Math.round(l*255); return { r:v,g:v,b:v }; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t<0) t+=1; if (t>1) t-=1;
    if (t<1/6) return p + (q-p)*6*t;
    if (t<1/2) return q;
    if (t<2/3) return p + (q-p)*(2/3 - t)*6;
    return p;
  };
  const q = l < 0.5 ? l*(1+s) : l + s - l*s;
  const p = 2*l - q;
  const r = hue2rgb(p,q,h + 1/3);
  const g = hue2rgb(p,q,h);
  const b = hue2rgb(p,q,h - 1/3);
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
}
