import { useEffect } from 'react';
import { MainLayout } from './layouts';
import { ChatView } from './components/chat';
import { useWebSocket, useNotifications } from './hooks';
import { useAuthStore, useChannelStore } from './stores';
import type { User, Channel, Workspace } from './types';

// Demo data for initial state
const demoUser: User = {
  id: 'user-1',
  username: 'john',
  displayName: 'John Doe',
  email: 'john@example.com',
  status: 'online',
  createdAt: new Date(),
};

const demoWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Namaskar Team',
  ownerId: 'user-1',
  members: [],
  channels: [],
  createdAt: new Date(),
};

const demoChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'general',
    description: 'General discussion for the team',
    type: 'public',
    workspaceId: 'workspace-1',
    members: [],
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'channel-2',
    name: 'random',
    type: 'public',
    workspaceId: 'workspace-1',
    members: [],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'channel-3',
    name: 'engineering',
    type: 'private',
    workspaceId: 'workspace-1',
    members: [],
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'dm-1',
    name: 'Jane Smith',
    type: 'direct',
    members: [],
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'dm-2',
    name: 'Team Chat',
    type: 'group',
    members: [],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const { login } = useAuthStore();
  const { setWorkspaces, setActiveWorkspace, setChannels, setActiveChannel } = useChannelStore();

  // Initialize WebSocket and notifications
  useWebSocket();
  useNotifications();

  // Initialize demo data on mount
  useEffect(() => {
    // Simulate login
    login(demoUser, 'demo-token');

    // Set up demo workspace and channels
    setWorkspaces([demoWorkspace]);
    setActiveWorkspace(demoWorkspace);
    setChannels(demoChannels);
    setActiveChannel(demoChannels[0]);
  }, [login, setWorkspaces, setActiveWorkspace, setChannels, setActiveChannel]);

  return (
    <MainLayout>
      <ChatView />
    </MainLayout>
  );
}

export default App;
