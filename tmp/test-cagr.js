const https = require('https');

async function fetchJsonWithUA(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const data = await fetchJsonWithUA('https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?range=10y&interval=1mo');
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    
    // get price today
    const currentPrice = result.meta.regularMarketPrice;
    
    console.log('Current Nifty:', currentPrice);
    console.log('Data points:', timestamps.length);
    
    // Find point 5 years ago
    const fiveYearsAgoUnix = Date.now() / 1000 - (5 * 365 * 24 * 60 * 60);
    const idx = timestamps.findIndex(t => t >= fiveYearsAgoUnix);
    console.log('Price 5 years ago:', closes[idx]);
    
    const cagr = Math.pow((currentPrice / closes[idx]), (1/5)) - 1;
    console.log('5 year CAGR:', cagr * 100, '%');
  } catch(e) {
    console.error(e);
  }
}
run();
