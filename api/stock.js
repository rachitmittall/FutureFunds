export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Ticker required' });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });
    const data = await response.json();
    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;
    const prevClose = result.meta.chartPreviousClose;
    const change = ((price - prevClose) / prevClose * 100).toFixed(2);
    const quotes = result.indicators.quote[0];
    const closes = quotes.close.filter(Boolean).slice(-7);
    
    return res.status(200).json({
      ticker,
      price,
      change: parseFloat(change),
      sparkline: closes,
      currency: 'INR'
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch',
      message: error.message 
    });
  }
}
