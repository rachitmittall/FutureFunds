export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true'
    );
    const data = await response.json();
    
    return res.status(200).json({
      bitcoin: {
        inr: data.bitcoin.inr,
        change24h: parseFloat(data.bitcoin.inr_24h_change?.toFixed(2))
      },
      ethereum: {
        inr: data.ethereum.inr,
        change24h: parseFloat(data.ethereum.inr_24h_change?.toFixed(2))
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch crypto' });
  }
}
