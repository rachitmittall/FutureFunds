export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { metal } = req.query;
  const metalType = metal || 'gold';

  try {
    const response = await fetch(
      'https://api.metals.dev/v1/latest?api_key=2DJKOUUHUSKPV7DK9RNX428DK9RNX&currency=INR&unit=g'
    );
    
    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    
    // metals.dev returns prices per gram in INR directly
    const prices = {
      gold: data.metals?.gold,
      silver: data.metals?.silver
    };
    
    const price = prices[metalType];
    if (!price) throw new Error('No price found');
    
    return res.status(200).json({
      metal: metalType,
      pricePerGramINR: parseFloat(price.toFixed(2)),
      live: true
    });

  } catch (error) {
    // Accurate March 2026 fallbacks
    const fallbacks = { 
      gold: 14842,
      silver: 105
    };
    return res.status(200).json({
      metal: metalType,
      pricePerGramINR: fallbacks[metalType] || 14842,
      live: false,
      error: error.message
    });
  }
}
