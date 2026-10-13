const http = require('http');
const url = require('url');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const PORT = process.env.PORT || 8080;

if (!APP_ID || !APP_CERTIFICATE) {
  console.error('ERROR: AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in server/.env');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Set CORS headers for local mobile dev access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', appIdConfigured: Boolean(APP_ID) }));
    return;
  }

  // Route: /token?channel=test-room&uid=12345
  if (parsedUrl.pathname === '/token') {
    const channelName = parsedUrl.query.channel;
    const uidStr = parsedUrl.query.uid;

    if (!channelName) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'channel query parameter is required' }));
      return;
    }

    const uid = uidStr ? parseInt(uidStr, 10) : 0;
    const role = RtcRole.PUBLISHER;
    // Token validity: 3600 seconds (1 hour)
    const expireTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

    try {
      const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        role,
        expireTimeInSeconds,
        privilegeExpiredTs
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          token,
          appId: APP_ID,
          channel: channelName,
          uid,
          expiresIn: expireTimeInSeconds,
        })
      );
    } catch (err) {
      console.error('Failed to generate RTC token:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to generate token' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MeshLive RTC Token Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/token?channel=<channelName>&uid=<uid>`);
});
