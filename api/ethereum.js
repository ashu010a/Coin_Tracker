export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Accept both ?address= and ?wallet=
  const wallet = (req.query?.address || req.query?.wallet || '').toString();

  if (!wallet) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(400).json({ error: 'Wallet address is required' });
    return;
  }

  try {
    // Your existing API logic here
    // This is just an example - replace with your actual implementation
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=YOUR_API_KEY`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from Etherscan');
    }

    const data = await response.json();

    // Process the data as needed
    const transactions = data.result.slice(0, 10).map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: parseInt(tx.value) / 1e18, // Convert from wei to ETH
      time: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      // Add other fields as needed
    }));

    const balance = transactions.reduce((acc, tx) => {
      if (tx.to.toLowerCase() === wallet.toLowerCase()) {
        return acc + tx.value;
      } else if (tx.from.toLowerCase() === wallet.toLowerCase()) {
        return acc - tx.value;
      }
      return acc;
    }, 0);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json({
      balance: Math.max(0, balance), // Ensure balance is not negative
      transactions: transactions
    });

  } catch (error) {
    console.error('Error fetching Ethereum data:', error);

    // Set CORS headers even for errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(500).json({ error: 'Failed to fetch Ethereum data' });
  }
}
