import { create } from 'zustand';
import type { Message, TypingIndicator } from '../types';

interface MessageState {
  // Messages organized by channel ID
  messagesByChannel: Record<string, Message[]>;
  // Currently selected message for context menu, reply, etc.
  selectedMessage: Message | null;
  // Users currently typing in each channel
  typingIndicators: Record<string, TypingIndicator[]>;
  // Loading states per channel
  loadingStates: Record<string, boolean>;
  // Whether more messages can be loaded (pagination)
  hasMoreByChannel: Record<string, boolean>;
}

interface MessageActions {
  // Message CRUD
  addMessage: (channelId: string, message: Message) => void;
  addMessages: (channelId: string, messages: Message[], prepend?: boolean) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (channelId: string, messageId: string) => void;

  // Selection
  setSelectedMessage: (message: Message | null) => void;

  // Typing indicators
  setTypingIndicator: (channelId: string, indicator: TypingIndicator) => void;
  removeTypingIndicator: (channelId: string, userId: string) => void;

  // Loading states
  setLoading: (channelId: string, isLoading: boolean) => void;
  setHasMore: (channelId: string, hasMore: boolean) => void;

  // Reactions
  addReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;

  // Clear
  clearChannel: (channelId: string) => void;
  clearAll: () => void;
}

export const useMessageStore = create<MessageState & MessageActions>((set) => ({
  // State
  messagesByChannel: {},
  selectedMessage: null,
  typingIndicators: {},
  loadingStates: {},
  hasMoreByChannel: {},

  // Actions
  addMessage: (channelId, message) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...(state.messagesByChannel[channelId] || []), message],
      },
    })),

  addMessages: (channelId, messages, prepend = false) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: prepend
          ? [...messages, ...(state.messagesByChannel[channelId] || [])]
          : [...(state.messagesByChannel[channelId] || []), ...messages],
      },
    })),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      },
    })),

  deleteMessage: (channelId, messageId) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] || []).filter(
          (msg) => msg.id !== messageId
        ),
      },
    })),

  setSelectedMessage: (message) => set({ selectedMessage: message }),

  setTypingIndicator: (channelId, indicator) =>
    set((state) => {
      const existing = state.typingIndicators[channelId] || [];
      const filtered = existing.filter((t) => t.userId !== indicator.userId);
      return {
        typingIndicators: {
          ...state.typingIndicators,
          [channelId]: [...filtered, indicator],
        },
      };
    }),

  removeTypingIndicator: (channelId, userId) =>
    set((state) => ({
      typingIndicators: {
        ...state.typingIndicators,
        [channelId]: (state.typingIndicators[channelId] || []).filter(
          (t) => t.userId !== userId
        ),
      },
    })),

  setLoading: (channelId, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [channelId]: isLoading,
      },
    })),

  setHasMore: (channelId, hasMore) =>
    set((state) => ({
      hasMoreByChannel: {
        ...state.hasMoreByChannel,
        [channelId]: hasMore,
      },
    })),

  addReaction: (channelId, messageId, emoji, userId) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] || []).map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.userIds.includes(userId)) return msg;
            return {
              ...msg,
              reactions: reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, userIds: [...r.userIds, userId], count: r.count + 1 }
                  : r
              ),
            };
          }
          return {
            ...msg,
            reactions: [...reactions, { emoji, userIds: [userId], count: 1 }],
          };
        }),
      },
    })),

  removeReaction: (channelId, messageId, emoji, userId) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] || []).map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = (msg.reactions || [])
            .map((r) => {
              if (r.emoji !== emoji) return r;
              const newUserIds = r.userIds.filter((id) => id !== userId);
              if (newUserIds.length === 0) return null;
              return { ...r, userIds: newUserIds, count: newUserIds.length };
            })
            .filter(Boolean) as Message['reactions'];
          return { ...msg, reactions };
        }),
      },
    })),

  clearChannel: (channelId) =>
    set((state) => {
      const { [channelId]: _, ...rest } = state.messagesByChannel;
      return { messagesByChannel: rest };
    }),

  clearAll: () =>
    set({
      messagesByChannel: {},
      selectedMessage: null,
      typingIndicators: {},
      loadingStates: {},
      hasMoreByChannel: {},
    }),
}));
