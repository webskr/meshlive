export interface ChannelSession {
  channelId: string;
  displayName: string;
  joinedAt: Date;
}

export interface JoinChannelRequest {
  channelId: string;
  displayName: string;
}

export interface JoinChannelValidationResult {
  isValid: boolean;
  error?: string;
  normalizedChannelId?: string;
  normalizedDisplayName?: string;
}
