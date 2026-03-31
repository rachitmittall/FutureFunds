export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { metal } = req.query;
  const metalType = metal || 'gold';

  try {
    // Use GoldAPI.io free tier
    const symbols = { gold: 'XAU', silver: 'XAG' };
    const symbol = symbols[metalType] || 'XAU';
    
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${symbol}&to=INR`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    const pricePerOzINR = data.rates?.INR;
    
    if (!pricePerOzINR) throw new Error('No price');
    
    // Convert troy oz to gram
    const pricePerGramINR = pricePerOzINR * 0.0321507;
    
    return res.status(200).json({
      metal: metalType,
      pricePerGramINR: parseFloat(pricePerGramINR.toFixed(2)),
      live: true
    });

  } catch (error) {
    // Reliable fallback
    const fallbacks = { 
      gold: 7234, 
      silver: 90 
    };
    return res.status(200).json({
      metal: metalType,
      pricePerGramINR: fallbacks[metalType] || 7234,
      live: false
    });
  }
}
