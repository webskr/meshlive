const { RtcTokenBuilder, Role } = require('./lib/RtcTokenBuilder');

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const APP_ID = process.env.AGORA_APP_ID;
  const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(500).json({ error: 'Agora credentials not set in environment variables' });
  }

  const { channel, uid } = req.query;

  // Root health check
  if (!channel) {
    return res.status(200).json({
      status: 'ok',
      service: 'MeshLive Agora Token Server',
      message: 'Provide ?channel=<channelName>&uid=<numericUid> to generate a token',
    });
  }

  const numericUid = uid ? parseInt(uid, 10) : 0;
  const expireTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      numericUid,
      Role.PUBLISHER,
      privilegeExpiredTs
    );

    return res.status(200).json({
      token,
      appId: APP_ID,
      channel,
      uid: numericUid,
      expiresIn: expireTimeInSeconds,
    });
  } catch (error) {
    console.error('Failed to generate RTC token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
};
