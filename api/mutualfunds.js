export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { schemeCode } = req.query;
  if (!schemeCode) return res.status(400).json({ error: 'schemeCode required' });

  try {
    const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
    const data = await response.json();
    
    return res.status(200).json({
      schemeName: data.meta.scheme_name,
      nav: parseFloat(data.data[0].nav),
      date: data.data[0].date
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch NAV' });
  }
}
