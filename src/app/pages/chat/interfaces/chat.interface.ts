export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  timestamp: Date;
  isRead: boolean;
  isOwnMessage: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  image?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface ChatConversation {
  id: string;
  participant: ChatParticipant;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: Date;
}

