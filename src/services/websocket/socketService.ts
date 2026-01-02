import { io, Socket } from 'socket.io-client';
import type { Message, TypingIndicator } from '../../types';

type MessageHandler = (message: Message) => void;
type TypingHandler = (indicator: TypingIndicator) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Error) => void;

interface SocketEvents {
  onMessage: MessageHandler[];
  onTyping: TypingHandler[];
  onStopTyping: TypingHandler[];
  onConnect: ConnectionHandler[];
  onDisconnect: ConnectionHandler[];
  onError: ErrorHandler[];
}

class SocketService {
  private socket: Socket | null = null;
  private events: SocketEvents = {
    onMessage: [],
    onTyping: [],
    onStopTyping: [],
    onConnect: [],
    onDisconnect: [],
    onError: [],
  };
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string, token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.events.onConnect.forEach((handler) => handler());
    });

    this.socket.on('disconnect', () => {
      this.events.onDisconnect.forEach((handler) => handler());
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      this.events.onError.forEach((handler) => handler(error));
    });

    this.socket.on('message:new', (message: Message) => {
      this.events.onMessage.forEach((handler) => handler(message));
    });

    this.socket.on('message:updated', (message: Message) => {
      this.events.onMessage.forEach((handler) => handler(message));
    });

    this.socket.on('typing:start', (indicator: TypingIndicator) => {
      this.events.onTyping.forEach((handler) => handler(indicator));
    });

    this.socket.on('typing:stop', (indicator: TypingIndicator) => {
      this.events.onStopTyping.forEach((handler) => handler(indicator));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a channel room
  joinChannel(channelId: string): void {
    this.socket?.emit('channel:join', { channelId });
  }

  // Leave a channel room
  leaveChannel(channelId: string): void {
    this.socket?.emit('channel:leave', { channelId });
  }

  // Send a message
  sendMessage(channelId: string, content: string, attachments?: string[]): void {
    this.socket?.emit('message:send', { channelId, content, attachments });
  }

  // Edit a message
  editMessage(messageId: string, content: string): void {
    this.socket?.emit('message:edit', { messageId, content });
  }

  // Delete a message
  deleteMessage(messageId: string): void {
    this.socket?.emit('message:delete', { messageId });
  }

  // Send typing indicator
  startTyping(channelId: string): void {
    this.socket?.emit('typing:start', { channelId });
  }

  // Stop typing indicator
  stopTyping(channelId: string): void {
    this.socket?.emit('typing:stop', { channelId });
  }

  // Add reaction to message
  addReaction(messageId: string, emoji: string): void {
    this.socket?.emit('reaction:add', { messageId, emoji });
  }

  // Remove reaction from message
  removeReaction(messageId: string, emoji: string): void {
    this.socket?.emit('reaction:remove', { messageId, emoji });
  }

  // Event subscription methods
  onMessage(handler: MessageHandler): () => void {
    this.events.onMessage.push(handler);
    return () => {
      this.events.onMessage = this.events.onMessage.filter((h) => h !== handler);
    };
  }

  onTyping(handler: TypingHandler): () => void {
    this.events.onTyping.push(handler);
    return () => {
      this.events.onTyping = this.events.onTyping.filter((h) => h !== handler);
    };
  }

  onStopTyping(handler: TypingHandler): () => void {
    this.events.onStopTyping.push(handler);
    return () => {
      this.events.onStopTyping = this.events.onStopTyping.filter((h) => h !== handler);
    };
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.events.onConnect.push(handler);
    return () => {
      this.events.onConnect = this.events.onConnect.filter((h) => h !== handler);
    };
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.events.onDisconnect.push(handler);
    return () => {
      this.events.onDisconnect = this.events.onDisconnect.filter((h) => h !== handler);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.events.onError.push(handler);
    return () => {
      this.events.onError = this.events.onError.filter((h) => h !== handler);
    };
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton instance
export const socketService = new SocketService();
