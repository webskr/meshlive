import { JoinChannelRequest, JoinChannelValidationResult } from '../types/channel.types';

/**
 * Validates and normalizes channel credentials.
 * Channel IDs are lowercased and stripped of whitespace and invalid characters.
 */
export function validateAndNormalizeJoinInputs(input: JoinChannelRequest): JoinChannelValidationResult {
  const trimmedName = input.displayName ? input.displayName.trim() : '';
  const trimmedChannel = input.channelId ? input.channelId.trim() : '';

  if (!trimmedName) {
    return {
      isValid: false,
      error: 'Please enter a display name.',
    };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'Display name must be at least 2 characters long.',
    };
  }

  if (!trimmedChannel) {
    return {
      isValid: false,
      error: 'Please enter a channel ID.',
    };
  }

  // Normalize channel: alphanumeric, hyphens, and underscores only, converted to lower-case
  const normalizedChannel = trimmedChannel.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  if (!normalizedChannel || normalizedChannel.length < 2) {
    return {
      isValid: false,
      error: 'Channel ID must contain at least 2 valid alphanumeric characters.',
    };
  }

  return {
    isValid: true,
    normalizedDisplayName: trimmedName,
    normalizedChannelId: normalizedChannel,
  };
}

/**
 * Validates chat message text.
 */
export function validateChatMessage(text: string): { isValid: boolean; normalizedText: string } {
  const trimmed = text.trim();
  return {
    isValid: trimmed.length > 0,
    normalizedText: trimmed,
  };
}
