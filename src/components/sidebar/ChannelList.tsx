import { Hash, Lock, ChevronDown, Plus, Users, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChannelStore, useUIStore } from '../../stores';
import { Avatar } from '../ui';
import type { Channel, ChannelType } from '../../types';

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

function ChannelIcon({ type }: { type: ChannelType }) {
  switch (type) {
    case 'public':
      return <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    case 'private':
      return <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    case 'direct':
      return <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    case 'group':
      return <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    default:
      return <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />;
  }
}

function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  const isDirect = channel.type === 'direct' || channel.type === 'group';

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-2 py-1.5 rounded-md
        transition-colors duration-100
        ${isActive
          ? 'bg-slate-700 text-white'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }
        ${channel.isMuted ? 'opacity-50' : ''}
      `}
    >
      {isDirect ? (
        <Avatar name={channel.name} size="xs" className="flex-shrink-0" />
      ) : (
        <ChannelIcon type={channel.type} />
      )}
      <span className="flex-1 text-left text-sm truncate font-medium">
        {channel.name}
      </span>
      {channel.unreadCount > 0 && !channel.isMuted && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
        </span>
      )}
    </button>
  );
}

interface ChannelCategoryProps {
  title: string;
  channels: Channel[];
  activeChannelId?: string;
  onChannelSelect: (channel: Channel) => void;
  onAddChannel?: () => void;
}

function ChannelCategory({ title, channels, activeChannelId, onChannelSelect, onAddChannel }: ChannelCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide hover:text-slate-200"
      >
        <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${isExpanded ? '' : '-rotate-90'}`} />
        <span className="flex-1 text-left">{title}</span>
        {onAddChannel && (
          <Plus
            className="w-4 h-4 hover:text-white flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onAddChannel();
            }}
          />
        )}
      </button>
      {isExpanded && (
        <div className="mt-1 space-y-0.5">
          {channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={activeChannelId === channel.id}
              onClick={() => onChannelSelect(channel)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ChannelList() {
  const { channels, activeChannel, setActiveChannel, activeWorkspace } = useChannelStore();
  const { closeSidebarOnMobile } = useUIStore();

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    closeSidebarOnMobile();
  };

  const publicChannels = channels.filter((ch) => ch.type === 'public' && ch.workspaceId === activeWorkspace?.id);
  const privateChannels = channels.filter((ch) => ch.type === 'private' && ch.workspaceId === activeWorkspace?.id);
  const directMessages = channels.filter((ch) => ch.type === 'direct' || ch.type === 'group');

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4">
      {activeWorkspace && (
        <>
          <ChannelCategory
            title="Channels"
            channels={publicChannels}
            activeChannelId={activeChannel?.id}
            onChannelSelect={handleChannelSelect}
            onAddChannel={() => console.log('Add channel')}
          />
          {privateChannels.length > 0 && (
            <ChannelCategory
              title="Private Channels"
              channels={privateChannels}
              activeChannelId={activeChannel?.id}
              onChannelSelect={handleChannelSelect}
            />
          )}
        </>
      )}
      <ChannelCategory
        title="Direct Messages"
        channels={directMessages}
        activeChannelId={activeChannel?.id}
        onChannelSelect={handleChannelSelect}
        onAddChannel={() => console.log('Add DM')}
      />
    </div>
  );
}
