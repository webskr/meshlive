export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
}

export interface ChatSession {
  channelId: string;
  displayName: string;
  messages: ChatMessage[];
}
