import { Settings, Bell, Search } from 'lucide-react';
import { useAuthStore, useChannelStore } from '../../stores';
import { Avatar } from '../ui';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ChannelList } from './ChannelList';

export function Sidebar() {
  const { user } = useAuthStore();
  const { activeWorkspace } = useChannelStore();

  return (
    <div className="flex h-full">
      <WorkspaceSwitcher />

      <div className="flex flex-col w-60 bg-slate-900 border-r border-slate-800">
        {/* Workspace Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h1 className="font-bold text-white truncate">
            {activeWorkspace?.name || 'Namaskar'}
          </h1>
          <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Channel List */}
        <ChannelList />

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-3 border-t border-slate-800 bg-slate-950/50">
          <Avatar
            src={user?.avatar}
            name={user?.displayName || 'User'}
            size="sm"
            status={user?.status}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || 'Guest'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.status || 'offline'}
            </p>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
