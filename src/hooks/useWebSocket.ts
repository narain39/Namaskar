import { useEffect, useCallback } from 'react';
import { socketService } from '../services/websocket/socketService';
import { useAuthStore, useMessageStore, useChannelStore } from '../stores';

export function useWebSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const { addMessage, setTypingIndicator, removeTypingIndicator } = useMessageStore();
  const { incrementUnread, activeChannel } = useChannelStore();

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    socketService.connect(wsUrl, token);

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, token]);

  // Set up message handlers
  useEffect(() => {
    const unsubMessage = socketService.onMessage((message) => {
      addMessage(message.channelId, message);

      // Increment unread if not in active channel
      if (activeChannel?.id !== message.channelId) {
        incrementUnread(message.channelId);
      }
    });

    const unsubTyping = socketService.onTyping((indicator) => {
      setTypingIndicator(indicator.channelId, indicator);
    });

    const unsubStopTyping = socketService.onStopTyping((indicator) => {
      removeTypingIndicator(indicator.channelId, indicator.userId);
    });

    return () => {
      unsubMessage();
      unsubTyping();
      unsubStopTyping();
    };
  }, [addMessage, setTypingIndicator, removeTypingIndicator, incrementUnread, activeChannel]);

  // Join/leave channel rooms
  const joinChannel = useCallback((channelId: string) => {
    socketService.joinChannel(channelId);
  }, []);

  const leaveChannel = useCallback((channelId: string) => {
    socketService.leaveChannel(channelId);
  }, []);

  return {
    isConnected: socketService.isConnected,
    joinChannel,
    leaveChannel,
  };
}
