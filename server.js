const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const app = express();

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { host, port, username, password, url } = req.body;
  if (!host || !port || !username || !password || !url) {
    return res.status(400).send('Missing parameters');
  }

  // Construct proxy URL with auth
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;

  try {
    // Fetch the URL using the proxy
    // Using 'fetch' with http proxy requires additional setup or libraries.
    // We'll use 'https-proxy-agent' to set proxy agent in fetch:

    const HttpsProxyAgent = require('https-proxy-agent');
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    const response = await fetch(url, { agent: proxyAgent });
    const contentType = response.headers.get('content-type') || 'text/html';

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch page');
    }

    const body = await response.text();

    res.set('Content-Type', contentType);
    res.send(body);
  } catch (error) {
    res.status(500).send('Error fetching page: ' + error.message);
  }
});

app.listen(3000, () => console.log('Proxy fetch server running on http://localhost:3000'));
