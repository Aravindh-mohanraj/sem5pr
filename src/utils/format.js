const FX = {
  USDINR: 83.5,
  USDEUR: 0.92,
};

export function convertPrice(value, fromCountry, currency) {
  const from = fromCountry === 'US' ? 'USD' : 'INR';
  if (from === currency) return value;
  const usd = from === 'USD' ? value : value / FX.USDINR;
  if (currency === 'USD') return usd;
  if (currency === 'EUR') return usd * FX.USDEUR;
  return usd * FX.USDINR;
}

export function currencySymbol(currency, fallbackCountry) {
  if (currency === 'USD') return '$';
  if (currency === 'EUR') return '€';
  if (currency === 'INR') return '₹';
  return fallbackCountry === 'US' ? '$' : '₹';
}

export function formatMoney(value, country, currency = 'native', options = {}) {
  const { digits = 2 } = options;
  if (currency === 'native' || !currency) {
    const symbol = country === 'US' ? '$' : '₹';
    const locale = country === 'US' ? 'en-US' : 'en-IN';
    return `${symbol}${Number(value).toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
  }
  const converted = convertPrice(value, country, currency);
  const symbol = currencySymbol(currency, country);
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return `${symbol}${Number(converted).toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
