// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: Date;
  createdAt: Date;
}

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

// Message types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  channelId: string;
  threadId?: string;
  type: MessageType;
  attachments?: Attachment[];
  reactions?: Reaction[];
  mentions?: string[];
  isEdited: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'system';

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

// Channel types
export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  workspaceId?: string;
  members: ChannelMember[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelType = 'direct' | 'group' | 'public' | 'private';

export interface ChannelMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

// Workspace types (like Slack workspaces or Discord servers)
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
  members: WorkspaceMember[];
  channels: Channel[];
  createdAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

// Call types (voice/video)
export interface Call {
  id: string;
  channelId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'ongoing' | 'ended';
  participants: CallParticipant[];
  startedAt: Date;
  endedAt?: Date;
}

export interface CallParticipant {
  userId: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  joinedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  channelId?: string;
  messageId?: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 'message' | 'mention' | 'call' | 'reaction' | 'system';

// Thread types
export interface Thread {
  id: string;
  parentMessageId: string;
  channelId: string;
  participantIds: string[];
  messageCount: number;
  lastMessageAt: Date;
}

// Typing indicator
export interface TypingIndicator {
  userId: string;
  channelId: string;
  timestamp: Date;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
