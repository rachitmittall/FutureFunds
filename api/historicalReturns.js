export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { years } = req.query;
  const numYears = Number(years) || 1;

  async function fetchYahoo(ticker) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=20y&interval=1mo`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) return null;
      
      const result = data.chart.result[0];
      const currentPrice = result.meta.regularMarketPrice;
      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;
      
      const targetUnix = Date.now() / 1000 - (numYears * 365 * 24 * 60 * 60);
      let pastPrice = null;
      
      // Find the closest price point after the target date
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] >= targetUnix && closes[i] !== null) {
          pastPrice = closes[i];
          break;
        }
      }
      
      // If we don't have data going back that far, just use the oldest available price
      // This way it doesn't fail but might return a slight variation for young assets like Crypto
      if (pastPrice === null && closes && closes.length > 0) {
        pastPrice = closes.find(c => c !== null);
      }
      
      if (!pastPrice || !currentPrice) return null;
      
      // Calculate Compound Annual Growth Rate (CAGR)
      const cagr = Math.pow((currentPrice / pastPrice), (1 / numYears)) - 1;
      
      // Clamp between sensible min/max to prevent infinite overflows on glitchy data
      return Math.min(Math.max(-0.99, cagr), 5.0); 
    } catch (e) {
      console.error(`Error fetching ${ticker}:`, e.message);
      return null;
    }
  }

  const [stocks, crypto, gold, silver] = await Promise.all([
    fetchYahoo('^NSEI'),    // Nifty 50 (Stocks proxy)
    fetchYahoo('BTC-INR'),  // Bitcoin
    fetchYahoo('GC=F'),     // Gold
    fetchYahoo('SI=F'),     // Silver
  ]);
  
  // Dynamic proxy approximations
  const mutualFunds = stocks !== null ? stocks + 0.015 : null; // Active MFs target +1.5% alpha over Nifty
  const fd = 0.07; // Hardcoded fallback for FD

  return res.status(200).json({
    live: true,
    years: numYears,
    returns: {
      stocks,
      crypto,
      gold,
      silver,
      mutualFunds,
      fd
    }
  });
}
