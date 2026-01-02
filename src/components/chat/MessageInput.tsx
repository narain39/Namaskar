import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, Paperclip, Smile, Mic, X, Image, File } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  replyTo?: { id: string; content: string; senderName: string } | null;
  onCancelReply?: () => void;
}

export function MessageInput({
  onSend,
  onTyping,
  onStopTyping,
  placeholder = 'Type a message...',
  disabled = false,
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Handle typing indicator
    onTyping?.();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      onStopTyping?.();
    }, 2000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && attachments.length === 0) return;

    onSend(trimmedMessage, attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    onStopTyping?.();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="px-4 py-3 bg-slate-900 border-t border-slate-800">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-slate-800 rounded-lg">
          <div className="w-1 h-8 bg-indigo-500 rounded-full" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-400 font-medium">
              Replying to {replyTo.senderName}
            </p>
            <p className="text-sm text-slate-400 truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg"
            >
              {getFileIcon(file)}
              <span className="text-sm text-slate-300 max-w-[150px] truncate">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-2.5 pr-10
              bg-slate-800 border border-slate-700 rounded-xl
              text-white placeholder-slate-500
              resize-none
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          <button
            className="absolute right-2 bottom-2 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {message.trim() || attachments.length > 0 ? (
          <button
            onClick={handleSend}
            disabled={disabled}
            className="
              p-2.5 rounded-lg
              bg-indigo-600 hover:bg-indigo-700
              text-white
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={disabled}
            className={`
              p-2.5 rounded-lg
              transition-colors
              ${isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
