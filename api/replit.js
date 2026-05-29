module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed, use POST' });
    return;
  }

  const apiUrl = process.env.REPLIT_API_URL;
  const apiKey = process.env.REPLIT_API_KEY;

  if (!apiUrl) {
    res.status(500).json({ error: 'Missing REPLIT_API_URL environment variable' });
    return;
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body)
    });

    const data = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    res.status(response.status);

    if (isJson) {
      res.json(JSON.parse(data));
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
};
