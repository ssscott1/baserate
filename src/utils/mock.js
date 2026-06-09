// Simulate an async external call with a delay
export function mockCall(minMs = 1200, maxMs = 2500) {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Calculate indicative base rate from inputs
export function calcBaseRate(amount, term, income, expenses) {
  const dsr = (expenses / income) * 100;
  let base = 5.99;
  if (dsr > 40) base += 0.5;
  if (amount > 50000) base -= 0.2;
  if (term > 60) base += 0.3;
  return Math.round(base * 100) / 100;
}

// Calculate monthly repayment
export function calcMonthly(principal, annualRate, termMonths, balloon = 0) {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round((principal - balloon) / termMonths);
  const pv = principal - balloon / Math.pow(1 + r, termMonths);
  return Math.round(pv * r / (1 - Math.pow(1 + r, -termMonths)));
}

// Total interest cost over life
export function calcTotalInterest(monthly, term, principal) {
  return Math.round(monthly * term - principal);
}

// Typical dealer effective rate (markup)
export function dealerEffectiveRate(baseRate) {
  return Math.round((baseRate + 1.75) * 100) / 100;
}

// The dollar "gap" — extra interest the dealer rate costs
export function calcRateGap(amount, term, baseRate) {
  const baseMonthly = calcMonthly(amount, baseRate, term);
  const dealerMonthly = calcMonthly(amount, dealerEffectiveRate(baseRate), term);
  return Math.round((dealerMonthly - baseMonthly) * term);
}

export const MOCK_LENDERS = [
  {
    id: 1,
    name: 'Plenti Auto',
    rate: 6.49,
    comparisonRate: 6.82,
    establishmentFee: 395,
    monthlyFee: 0,
    earlyPayout: 'No fee',
    rationale: 'Lowest total cost of credit for this loan amount and term. No monthly fees.',
    rank: 1,
  },
  {
    id: 2,
    name: 'Pepper Money',
    rate: 6.89,
    comparisonRate: 7.23,
    establishmentFee: 495,
    monthlyFee: 0,
    earlyPayout: '$150 flat',
    rationale: 'Strong on self-employed applicants, slightly higher rate.',
    rank: 2,
  },
  {
    id: 3,
    name: 'Latitude Financial',
    rate: 7.19,
    comparisonRate: 7.55,
    establishmentFee: 250,
    monthlyFee: 9.95,
    earlyPayout: 'No fee',
    rationale: 'Lower establishment fee but monthly account fee increases total cost.',
    rank: 3,
  },
];

export const MOCK_DEALERS = [
  { id: 1, name: 'Sydney City Toyota', abn: '61 004 073 150', licence: 'MD12345' },
  { id: 2, name: 'Drive Automotive Group', abn: '73 108 417 252', licence: 'MD23456' },
  { id: 3, name: 'AutoNation Parramatta', abn: '88 144 252 314', licence: 'MD34567' },
  { id: 4, name: 'Erina Hyundai', abn: '51 092 417 812', licence: 'MD45678' },
  { id: 5, name: 'Melbourne Motor Group', abn: '22 103 556 278', licence: 'MD56789' },
];

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function formatRate(r) {
  return `${r.toFixed(2)}% p.a.`;
}
