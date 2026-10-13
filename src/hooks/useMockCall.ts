import { useState, useCallback } from 'react';
import { CallActions, CallSessionState, CallStatus } from '../types/call.types';

export interface UseMockCallProps {
  channelId: string;
  displayName: string;
  remoteParticipantName?: string;
}

export function useMockCall({
  channelId,
  displayName,
  remoteParticipantName = 'Remote Participant',
}: UseMockCallProps): {
  state: CallSessionState;
  actions: CallActions;
} {
  const [status, setStatus] = useState<CallStatus>('Idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);

  // Transitions:
  // Idle -> Calling -> Connected -> Ended
  // Idle -> Incoming Call -> Connected
  // Incoming Call -> Ended (rejected)

  const startCall = useCallback(() => {
    if (status !== 'Idle' && status !== 'Ended') {
      return;
    }
    setStatus('Calling');

    // Simulate remote answering after brief delay
    const timer = setTimeout(() => {
      setStatus('Connected');
    }, 2500);

    return () => clearTimeout(timer);
  }, [status]);

  const simulateIncomingCall = useCallback(() => {
    if (status === 'Calling' || status === 'Connected') {
      return;
    }
    setStatus('Incoming Call');
  }, [status]);

  const acceptCall = useCallback(() => {
    if (status !== 'Incoming Call') {
      return;
    }
    setStatus('Connected');
  }, [status]);

  const rejectCall = useCallback(() => {
    if (status !== 'Incoming Call') {
      return;
    }
    setStatus('Ended');
  }, [status]);

  const endCall = useCallback(() => {
    if (status === 'Ended' || status === 'Idle') {
      return;
    }
    setStatus('Ended');
  }, [status]);

  const resetCall = useCallback(() => {
    setStatus('Idle');
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOff((prev) => !prev);
  }, []);

  return {
    state: {
      status,
      channelId,
      displayName,
      localUid: 0,
      remoteUid: null,
      remoteParticipantName,
      media: {
        isMuted,
        isCameraOff,
      },
      isAgoraActive: false,
    },
    actions: {
      startCall,
      simulateIncomingCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleCamera,
      resetCall,
    },
  };
}
