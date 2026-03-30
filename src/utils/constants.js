export const CITY_MINIMUMS = {
  Delhi: { rent: 3000, food: 2500, transport: 800, entertainment: 300, misc: 200 },
  Mumbai: { rent: 4000, food: 3000, transport: 1000, entertainment: 300, misc: 200 },
  Bangalore: { rent: 4000, food: 2500, transport: 800, entertainment: 300, misc: 200 },
  Chennai: { rent: 3000, food: 2500, transport: 700, entertainment: 200, misc: 200 },
  Kolkata: { rent: 2500, food: 2000, transport: 600, entertainment: 200, misc: 200 },
  Other: { rent: 2000, food: 2000, transport: 500, entertainment: 200, misc: 200 },
}

export const ASSET_RETURNS = {
  stocks: 0.12,
  mutualFunds: 0.11,
  gold: 0.08,
  silver: 0.06,
  fd: 0.07,
  crypto: 0.20
}

export const HISTORICAL_RETURNS = {
  stocks: 0.13,
  mutualFunds: 0.12,
  gold: 0.08,
  silver: 0.06,
  fd: 0.07,
  crypto: 0.45
}

export const FALLBACK_STOCK_PRICES = {
  'RELIANCE.NS': { price: 2847.50, changePct: 0.82 },
  'TCS.NS': { price: 3924.15, changePct: 0.45 },
  'INFY.NS': { price: 1456.30, changePct: -0.23 },
  'HDFCBANK.NS': { price: 1678.90, changePct: 1.12 },
  'ICICIBANK.NS': { price: 1089.45, changePct: 0.67 },
  'WIPRO.NS': { price: 456.20, changePct: -0.34 },
  'BAJFINANCE.NS': { price: 6734.80, changePct: 1.45 },
  'HINDUNILVR.NS': { price: 2234.60, changePct: 0.28 },
  'ASIANPAINT.NS': { price: 2456.75, changePct: -0.56 },
  'MARUTI.NS': { price: 11234.50, changePct: 0.93 },
  'TITAN.NS': { price: 3456.80, changePct: 0.71 },
  'TATAMOTORS.NS': { price: 789.45, changePct: 1.23 },
  'SBIN.NS': { price: 823.60, changePct: 0.89 },
  'KOTAKBANK.NS': { price: 1923.40, changePct: -0.12 },
  'SUNPHARMA.NS': { price: 1567.30, changePct: 0.45 },
  'ITC.NS': { price: 456.80, changePct: 0.34 },
  'LT.NS': { price: 3456.90, changePct: 0.67 },
  'NESTLEIND.NS': { price: 2345.60, changePct: -0.23 },
  'ADANIPORTS.NS': { price: 1234.50, changePct: 1.34 },
  'POWERGRID.NS': { price: 312.45, changePct: 0.56 },
  'NTPC.NS': { price: 356.78, changePct: 0.78 },
  'AXISBANK.NS': { price: 1123.45, changePct: 0.45 },
  'DRREDDY.NS': { price: 6789.30, changePct: -0.34 },
  'ZOMATO.NS': { price: 234.56, changePct: 2.34 },
  '^NSEI': { price: 22456.80, changePct: 0.45 },
}

export const FALLBACK_METAL_PRICES = {
  gold: 7234,
  silver: 89.50,
}

export const FALLBACK_CRYPTO_PRICES = {
  bitcoin: { inr: 6333915, change24h: 0 },
  ethereum: { inr: 191362, change24h: 0 },
}

export const FALLBACK_MF_PRICES = {
  '118989': 284.65, // HDFC Top 100
  '118778': 169.88, // Mirae Asset
}

export const ASSET_LABELS = {
  stocks: 'Stocks',
  mutualFunds: 'Mutual Funds',
  gold: 'Gold',
  silver: 'Silver',
  fd: 'FD',
  crypto: 'Crypto',
}

export const COLORS = {
  stocks: '#00FF94',
  mutualFunds: '#3B82F6',
  gold: '#F59E0B',
  silver: '#94A3B8',
  fd: '#8B5CF6',
  crypto: '#FF4B4B',
}
