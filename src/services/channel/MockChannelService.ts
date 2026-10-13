import { ChannelSession, JoinChannelRequest } from '../../types/channel.types';
import { validateAndNormalizeJoinInputs } from '../../utils/validation';

export class MockChannelService {
  private static instance: MockChannelService;
  private currentSession: ChannelSession | null = null;

  private constructor() {}

  public static getInstance(): MockChannelService {
    if (!MockChannelService.instance) {
      MockChannelService.instance = new MockChannelService();
    }
    return MockChannelService.instance;
  }

  public joinChannel(request: JoinChannelRequest): Promise<ChannelSession> {
    return new Promise((resolve, reject) => {
      const validation = validateAndNormalizeJoinInputs(request);
      if (!validation.isValid || !validation.normalizedChannelId || !validation.normalizedDisplayName) {
        return reject(new Error(validation.error || 'Invalid channel input'));
      }

      const session: ChannelSession = {
        channelId: validation.normalizedChannelId,
        displayName: validation.normalizedDisplayName,
        joinedAt: new Date(),
      };

      this.currentSession = session;
      resolve(session);
    });
  }

  public getCurrentSession(): ChannelSession | null {
    return this.currentSession;
  }

  public leaveChannel(): Promise<void> {
    return new Promise((resolve) => {
      this.currentSession = null;
      resolve();
    });
  }
}

export const mockChannelService = MockChannelService.getInstance();
