import { useState, useCallback, useEffect, useRef } from 'react';
import { CallActions, CallSessionState, CallStatus } from '../types/call.types';
import { agoraRtcService } from '../services/call/AgoraRtcService';
import { requestCameraAndAudioPermissions } from '../utils/permissions';
import { RtcConnection, UserOfflineReasonType } from 'react-native-agora';

export interface UseAgoraCallProps {
  channelId: string;
  displayName: string;
}

export function useAgoraCall({
  channelId,
  displayName,
}: UseAgoraCallProps): {
  state: CallSessionState;
  actions: CallActions;
} {
  const [status, setStatus] = useState<CallStatus>('Idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isAgoraActive, setIsAgoraActive] = useState<boolean>(false);

  // Generate a consistent numeric UID for this session (between 1000 and 99999)
  const localUidRef = useRef<number>(Math.floor(1000 + Math.random() * 90000));
  const localUid = localUidRef.current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      agoraRtcService.leaveChannel();
    };
  }, []);

  const startCall = useCallback(async () => {
    setErrorMessage(undefined);
    setStatus('Connecting');

    // 1. Check and request native hardware permissions
    const hasPermissions = await requestCameraAndAudioPermissions();
    if (!hasPermissions) {
      setStatus('Error');
      setErrorMessage('Camera and microphone permissions are required for video calling.');
      return;
    }

    try {
      // 2. Initialize Agora Engine
      const engine = await agoraRtcService.initializeEngine();

      // 3. Register engine event listeners
      engine.addListener('onJoinChannelSuccess', (connection: RtcConnection, elapsed: number) => {
        console.log(`Successfully joined channel ${connection.channelId} with UID ${connection.localUid}`);
        setStatus('Connected');
        setIsAgoraActive(true);
      });

      engine.addListener('onUserJoined', (connection: RtcConnection, uid: number, elapsed: number) => {
        console.log(`Remote participant joined: UID ${uid}`);
        setRemoteUid(uid);
      });

      engine.addListener('onUserOffline', (connection: RtcConnection, uid: number, reason: UserOfflineReasonType) => {
        console.log(`Remote participant left: UID ${uid}`);
        setRemoteUid((current) => (current === uid ? null : current));
      });

      engine.addListener('onError', (errCode: number, msg: string) => {
        console.warn(`Agora RTC Error ${errCode}: ${msg}`);
        if (errCode !== 0) {
          setErrorMessage(`Agora error: code ${errCode}`);
        }
      });

      // 4. Fetch dynamic token from local development server
      const token = await agoraRtcService.fetchToken(channelId, localUid);

      // 5. Join Channel
      await agoraRtcService.joinChannel(channelId, localUid, token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to Agora RTC channel';
      console.error('Call connection error:', err);
      setStatus('Error');
      setErrorMessage(msg);
      setIsAgoraActive(false);
    }
  }, [channelId, localUid]);

  const endCall = useCallback(async () => {
    try {
      await agoraRtcService.leaveChannel();
    } catch (e) {
      console.warn('Error during leaveChannel:', e);
    } finally {
      setStatus('Ended');
      setRemoteUid(null);
      setIsAgoraActive(false);
    }
  }, []);

  const resetCall = useCallback(() => {
    setStatus('Idle');
    setIsMuted(false);
    setIsCameraOff(false);
    setRemoteUid(null);
    setErrorMessage(undefined);
    setIsAgoraActive(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      agoraRtcService.muteLocalAudio(next);
      return next;
    });
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOff((prev) => {
      const next = !prev;
      agoraRtcService.muteLocalVideo(next);
      return next;
    });
  }, []);

  return {
    state: {
      status,
      channelId,
      displayName,
      localUid,
      remoteUid,
      remoteParticipantName: remoteUid ? `Participant #${remoteUid}` : 'Waiting for participant...',
      media: {
        isMuted,
        isCameraOff,
      },
      isAgoraActive,
      errorMessage,
    },
    actions: {
      startCall,
      endCall,
      toggleMute,
      toggleCamera,
      resetCall,
    },
  };
}
