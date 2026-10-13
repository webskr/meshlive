export type CallStatus =
  | 'Idle'
  | 'Calling'
  | 'Connecting'
  | 'Incoming Call'
  | 'Connected'
  | 'Ended'
  | 'Error';

export interface CallMediaState {
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface CallSessionState {
  status: CallStatus;
  channelId: string;
  displayName: string;
  localUid: number;
  remoteUid: number | null;
  remoteParticipantName: string;
  media: CallMediaState;
  isAgoraActive: boolean;
  errorMessage?: string;
}

export interface CallActions {
  startCall: () => void;
  simulateIncomingCall?: () => void;
  acceptCall?: () => void;
  rejectCall?: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  resetCall: () => void;
}

