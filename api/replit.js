module.exports = async (req, res) => {
  const apiUrl = process.env.REPLIT_API_URL;
  const apiKey = process.env.REPLIT_API_KEY;

  if (!apiUrl) {
    res.status(500).json({ error: 'Missing REPLIT_API_URL environment variable' });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed, use GET or POST' });
    return;
  }

  const headers = {};
  if (req.method === 'POST' && req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const fetchOptions = {
    method: req.method,
    headers
  };

  if (req.method === 'POST') {
    fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  }

  try {
    const response = await fetch(apiUrl, fetchOptions);
    const responseText = await response.text();
    const contentType = response.headers.get('content-type');

    res.status(response.status);
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.send(responseText);
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
};
