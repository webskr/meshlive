export const APP_CONFIG = {
  APP_NAME: 'MeshLive',
  PROTOTYPE_NOTICE: 'Agora RTC Live Video Calling enabled. Real-time audio and video across shared channels.',
  TAGLINE: 'Connect through a shared channel.',
};

export const AGORA_CONFIG = {
  APP_ID: '84bfc3f70aac4657a1c427fd5257bcb5',
  // Using localhost:8080 with 'adb reverse tcp:8080 tcp:8080' works on physical USB devices & emulators
  DEFAULT_TOKEN_SERVER_URL: 'https://meshlive-server.vercel.app/api/token',
  TOKEN_EXPIRY_SECONDS: 3600,
};

export const CALL_STATUS = {
  IDLE: 'Idle',
  CALLING: 'Calling',
  CONNECTING: 'Connecting',
  CONNECTED: 'Connected',
  ENDED: 'Ended',
  ERROR: 'Error',
} as const;

