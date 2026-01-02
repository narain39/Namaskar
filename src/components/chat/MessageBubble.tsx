import { useState } from 'react';
import { MoreHorizontal, Reply, Smile, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui';
import type { Message, User } from '../../types';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  isOwn: boolean;
  showAvatar?: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export function MessageBubble({
  message,
  sender,
  isOwn,
  showAvatar = true,
  onReply,
  onEdit,
  onReaction,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  return (
    <div
      className={`group flex gap-3 px-4 py-1 hover:bg-slate-800/30 ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {showAvatar ? (
        <Avatar
          src={sender.avatar}
          name={sender.displayName}
          size="sm"
          status={sender.status}
        />
      ) : (
        <div className="w-8" />
      )}

      <div className={`flex-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-semibold text-white">
              {sender.displayName}
            </span>
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
            {message.isEdited && (
              <span className="text-xs text-slate-500">(edited)</span>
            )}
          </div>
        )}

        <div className="relative">
          <div
            className={`
              inline-block px-4 py-2 rounded-2xl
              ${isOwn
                ? 'bg-indigo-600 text-white rounded-br-md'
                : 'bg-slate-700 text-white rounded-bl-md'
              }
            `}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => onReaction?.(message.id, reaction.emoji)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-slate-400">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Add reaction"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReply?.(message)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Reply"
          >
            <Reply className="w-4 h-4" />
          </button>
          {isOwn && (
            <button
              onClick={() => onEdit?.(message)}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
            title="More"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Quick emoji picker */}
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-slate-800 rounded-lg shadow-lg flex gap-1 z-10">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReaction?.(message.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1.5 rounded hover:bg-slate-700 text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
