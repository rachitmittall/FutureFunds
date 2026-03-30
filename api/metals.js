export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { metal } = req.query;
  const metalType = metal || 'gold';

  try {
    const response = await fetch(
      `https://api.metals.live/v1/spot/${metalType}`
    );
    const data = await response.json();
    const priceUSD = Array.isArray(data) ? data[0]?.price : data?.price;
    const usdToInr = 83.5;
    const troyOzToGram = 0.0321507;
    const priceINR = priceUSD * usdToInr * troyOzToGram;
    
    return res.status(200).json({
      metal: metalType,
      pricePerGramINR: parseFloat(priceINR.toFixed(2)),
      priceUSD
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch metal price' });
  }
}
