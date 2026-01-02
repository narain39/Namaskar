import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Channel, Workspace } from '../types';

interface ChannelState {
  // All channels the user has access to
  channels: Channel[];
  // Currently active channel
  activeChannel: Channel | null;
  // All workspaces
  workspaces: Workspace[];
  // Currently active workspace
  activeWorkspace: Workspace | null;
  // Loading state
  isLoading: boolean;
  error: string | null;
}

interface ChannelActions {
  // Channel actions
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  setActiveChannel: (channel: Channel | null) => void;

  // Workspace actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (workspaceId: string) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;

  // Unread management
  incrementUnread: (channelId: string) => void;
  clearUnread: (channelId: string) => void;

  // Pinning and muting
  togglePinChannel: (channelId: string) => void;
  toggleMuteChannel: (channelId: string) => void;

  // Loading states
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChannelStore = create<ChannelState & ChannelActions>()(
  persist(
    (set) => ({
      // State
      channels: [],
      activeChannel: null,
      workspaces: [],
      activeWorkspace: null,
      isLoading: false,
      error: null,

      // Channel actions
      setChannels: (channels) => set({ channels }),

      addChannel: (channel) =>
        set((state) => ({
          channels: [...state.channels, channel],
        })),

      updateChannel: (channelId, updates) =>
        set((state) => ({
          channels: state.channels.map((ch) =>
            ch.id === channelId ? { ...ch, ...updates } : ch
          ),
          activeChannel:
            state.activeChannel?.id === channelId
              ? { ...state.activeChannel, ...updates }
              : state.activeChannel,
        })),

      removeChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.filter((ch) => ch.id !== channelId),
          activeChannel:
            state.activeChannel?.id === channelId ? null : state.activeChannel,
        })),

      setActiveChannel: (channel) => set({ activeChannel: channel }),

      // Workspace actions
      setWorkspaces: (workspaces) => set({ workspaces }),

      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        })),

      updateWorkspace: (workspaceId, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === workspaceId ? { ...ws, ...updates } : ws
          ),
          activeWorkspace:
            state.activeWorkspace?.id === workspaceId
              ? { ...state.activeWorkspace, ...updates }
              : state.activeWorkspace,
        })),

      removeWorkspace: (workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.filter((ws) => ws.id !== workspaceId),
          activeWorkspace:
            state.activeWorkspace?.id === workspaceId ? null : state.activeWorkspace,
        })),

      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

      // Unread management
      incrementUnread: (channelId) =>
        set((state) => ({
          channels: state.channels.map((ch) =>
            ch.id === channelId ? { ...ch, unreadCount: ch.unreadCount + 1 } : ch
          ),
        })),

      clearUnread: (channelId) =>
        set((state) => ({
          channels: state.channels.map((ch) =>
            ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
          ),
        })),

      // Pinning and muting
      togglePinChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.map((ch) =>
            ch.id === channelId ? { ...ch, isPinned: !ch.isPinned } : ch
          ),
        })),

      toggleMuteChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.map((ch) =>
            ch.id === channelId ? { ...ch, isMuted: !ch.isMuted } : ch
          ),
        })),

      // Loading states
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'channel-storage',
      partialize: (state) => ({
        activeChannel: state.activeChannel,
        activeWorkspace: state.activeWorkspace,
      }),
    }
  )
);
