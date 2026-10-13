import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
import { AGORA_CONFIG } from '../../constants/app.constants';

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channel: string;
  uid: number;
}

export class AgoraRtcService {
  private static instance: AgoraRtcService;
  private engine: IRtcEngine | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AgoraRtcService {
    if (!AgoraRtcService.instance) {
      AgoraRtcService.instance = new AgoraRtcService();
    }
    return AgoraRtcService.instance;
  }

  public getEngine(): IRtcEngine | null {
    return this.engine;
  }

  /**
   * Initializes the Agora RTC engine singleton.
   */
  public async initializeEngine(): Promise<IRtcEngine> {
    if (this.engine && this.isInitialized) {
      return this.engine;
    }

    const engine = createAgoraRtcEngine();
    engine.initialize({
      appId: AGORA_CONFIG.APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    engine.enableVideo();
    engine.enableAudio();
    engine.startPreview();

    this.engine = engine;
    this.isInitialized = true;
    return engine;
  }

  /**
   * Fetches an RTC token from the local development token generator.
   * If the token generator is unavailable, returns empty string for App-ID-only mode fallback.
   */
  public async fetchToken(
    channelName: string,
    uid: number,
    customServerUrl?: string
  ): Promise<string> {
    const baseUrl = customServerUrl || AGORA_CONFIG.DEFAULT_TOKEN_SERVER_URL;
    const url = `${baseUrl}?channel=${encodeURIComponent(channelName)}&uid=${uid}`;

    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const data = (await response.json()) as AgoraTokenResponse;
        return data.token || '';
      }
      console.warn(`Token server responded with status: ${response.status}`);
      return '';
    } catch (error) {
      console.warn('Could not contact token server, attempting without token or mock fallback:', error);
      return '';
    }
  }

  /**
   * Joins the specified channel.
   */
  public async joinChannel(
    channelName: string,
    uid: number,
    token: string = ''
  ): Promise<void> {
    if (!this.engine) {
      await this.initializeEngine();
    }

    if (!this.engine) {
      throw new Error('Failed to create Agora RTC Engine');
    }

    this.engine.joinChannel(token, channelName, uid, {
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      publishMicrophoneTrack: true,
      publishCameraTrack: true,
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });
  }

  /**
   * Mutes or unmutes local microphone.
   */
  public muteLocalAudio(mute: boolean): void {
    if (this.engine) {
      this.engine.muteLocalAudioStream(mute);
    }
  }

  /**
   * Enables or disables local camera video stream.
   */
  public muteLocalVideo(mute: boolean): void {
    if (this.engine) {
      this.engine.muteLocalVideoStream(mute);
    }
  }

  /**
   * Leaves the channel and releases the engine resources.
   */
  public async leaveChannel(): Promise<void> {
    if (this.engine) {
      try {
        this.engine.stopPreview();
        this.engine.leaveChannel();
        this.engine.removeAllListeners();
        this.engine.release();
      } catch (err) {
        console.warn('Error releasing Agora RTC engine:', err);
      } finally {
        this.engine = null;
        this.isInitialized = false;
      }
    }
  }
}

export const agoraRtcService = AgoraRtcService.getInstance();
