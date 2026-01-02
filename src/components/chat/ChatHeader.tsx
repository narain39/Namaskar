import { Phone, Video, Search, Users, Pin, MoreVertical, Hash, Lock } from 'lucide-react';
import { Avatar } from '../ui';
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
  const isDirectMessage = channel.type === 'direct' || channel.type === 'group';

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-3">
        {isDirectMessage ? (
          <Avatar name={channel.name} size="sm" />
        ) : (
          <div className="p-2 rounded-lg bg-slate-800">
            {channel.type === 'private' ? (
              <Lock className="w-4 h-4 text-slate-400" />
            ) : (
              <Hash className="w-4 h-4 text-slate-400" />
            )}
          </div>
        )}
        <div>
          <h2 className="font-semibold text-white">{channel.name}</h2>
          {channel.description && (
            <p className="text-xs text-slate-400 truncate max-w-xs">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onStartCall?.('voice')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Start voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => onStartCall?.('video')}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Start video call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={onShowPinned}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Pinned messages"
        >
          <Pin className="w-5 h-5" />
        </button>
        <button
          onClick={onShowMembers}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
