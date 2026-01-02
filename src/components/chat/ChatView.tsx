import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { useMessageStore, useChannelStore, useAuthStore, useUIStore } from '../../stores';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { socketService } from '../../services/websocket/socketService';
import type { Message, User } from '../../types';

// Mock user data - in real app this would come from a users store
const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    username: 'john',
    displayName: 'John Doe',
    email: 'john@example.com',
    status: 'online',
    createdAt: new Date(),
  },
  'user-2': {
    id: 'user-2',
    username: 'jane',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    status: 'away',
    createdAt: new Date(),
  },
};

export function ChatView() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<{ id: string; content: string; senderName: string } | null>(null);

  const { user } = useAuthStore();
  const { activeChannel } = useChannelStore();
  const {
    messagesByChannel,
    typingIndicators,
    addMessage,
    addReaction,
    removeReaction,
  } = useMessageStore();

  const messages = activeChannel ? messagesByChannel[activeChannel.id] || [] : [];
  const typing = activeChannel ? typingIndicators[activeChannel.id] || [] : [];

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Handle sending messages
  const handleSend = useCallback((content: string, _attachments?: File[]) => {
    if (!activeChannel || !user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: user.id,
      channelId: activeChannel.id,
      type: 'text',
      isEdited: false,
      isPinned: false,
      createdAt: new Date(),
    };

    addMessage(activeChannel.id, newMessage);
    socketService.sendMessage(activeChannel.id, content);
    setReplyTo(null);
  }, [activeChannel, user, addMessage]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (activeChannel) {
      socketService.startTyping(activeChannel.id);
    }
  }, [activeChannel]);

  const handleStopTyping = useCallback(() => {
    if (activeChannel) {
      socketService.stopTyping(activeChannel.id);
    }
  }, [activeChannel]);

  // Handle reactions
  const handleReaction = useCallback((messageId: string, emoji: string) => {
    if (!activeChannel || !user) return;

    const message = messages.find((m) => m.id === messageId);
    const existingReaction = message?.reactions?.find((r) => r.emoji === emoji);
    const hasReacted = existingReaction?.userIds.includes(user.id);

    if (hasReacted) {
      removeReaction(activeChannel.id, messageId, emoji, user.id);
      socketService.removeReaction(messageId, emoji);
    } else {
      addReaction(activeChannel.id, messageId, emoji, user.id);
      socketService.addReaction(messageId, emoji);
    }
  }, [activeChannel, user, messages, addReaction, removeReaction]);

  // Handle reply
  const handleReply = useCallback((message: Message) => {
    const sender = mockUsers[message.senderId];
    setReplyTo({
      id: message.id,
      content: message.content,
      senderName: sender?.displayName || 'Unknown',
    });
  }, []);

  const { toggleSidebar } = useUIStore();

  if (!activeChannel) {
    return (
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Mobile header with menu */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-2 font-semibold text-white">Namaskar</h1>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to Namaskar</h2>
            <p className="text-slate-400 mb-4">Select a channel to start messaging</p>
            <button
              onClick={toggleSidebar}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors md:hidden"
            >
              Open Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <ChatHeader channel={activeChannel} />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-400">No messages yet</p>
              <p className="text-sm text-slate-500">Be the first to send a message!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const sender = mockUsers[message.senderId] || {
                id: message.senderId,
                username: 'unknown',
                displayName: 'Unknown User',
                email: '',
                status: 'offline' as const,
                createdAt: new Date(),
              };
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage ||
                prevMessage.senderId !== message.senderId ||
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  sender={sender}
                  isOwn={message.senderId === user?.id}
                  showAvatar={showAvatar}
                  onReply={handleReply}
                  onReaction={handleReaction}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing indicator */}
      {typing.length > 0 && (
        <div className="px-4 py-2 text-sm text-slate-400">
          {typing.length === 1
            ? `${mockUsers[typing[0].userId]?.displayName || 'Someone'} is typing...`
            : `${typing.length} people are typing...`
          }
        </div>
      )}

      {/* Message input */}
      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
