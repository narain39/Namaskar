import { Phone, Video, Search, Users, Pin, MoreVertical, Hash, Lock, Menu } from 'lucide-react';
import { Avatar } from '../ui';
import { useUIStore } from '../../stores';
import type { Channel } from '../../types';

interface ChatHeaderProps {
  channel: Channel;
  onStartCall?: (type: 'voice' | 'video') => void;
  onSearch?: () => void;
  onShowMembers?: () => void;
  onShowPinned?: () => void;
}

export function ChatHeader({
  channel,
  onStartCall,
  onSearch,
  onShowMembers,
  onShowPinned,
}: ChatHeaderProps) {
  const { toggleSidebar } = useUIStore();
  const isDirectMessage = channel.type === 'direct' || channel.type === 'group';

  return (
    <div className="flex items-center justify-between px-3 py-3 bg-slate-900 border-b border-slate-800 gap-2">
      {/* Left side - Menu button and channel info */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors md:hidden flex-shrink-0"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isDirectMessage ? (
          <Avatar name={channel.name} size="sm" className="flex-shrink-0" />
        ) : (
          <div className="p-2 rounded-lg bg-slate-800 flex-shrink-0">
            {channel.type === 'private' ? (
              <Lock className="w-4 h-4 text-slate-400" />
            ) : (
              <Hash className="w-4 h-4 text-slate-400" />
            )}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-semibold text-white truncate">{channel.name}</h2>
          {channel.description && (
            <p className="text-xs text-slate-400 truncate">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={() => onStartCall?.('voice')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden sm:block"
          title="Start voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => onStartCall?.('video')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden sm:block"
          title="Start video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={onShowPinned}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden sm:block"
          title="Pinned messages"
        >
          <Pin className="w-5 h-5" />
        </button>
        <button
          onClick={onShowMembers}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden sm:block"
          title="Members"
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          onClick={onSearch}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Search in channel"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
