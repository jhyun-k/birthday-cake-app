'use client';

import { useState } from 'react';
import { Message } from '@/lib/types';
import { getToppingById } from '@/data/toppings';

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
  onMessageDelete?: (messageId: string) => void;
}

export default function MessageList({ messages, onMessageClick, onMessageDelete }: MessageListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-4xl mb-3">🎂</p>
        <p className="text-sm">아직 축하 메시지가 없어요</p>
        <p className="text-sm">첫 번째 토핑을 올려보세요!</p>
      </div>
    );
  }

  const handleDelete = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    if (deletingId === messageId) {
      onMessageDelete?.(messageId);
      setDeletingId(null);
    } else {
      setDeletingId(messageId);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        축하 메시지 목록 ({messages.length}개)
      </h3>
      {messages.map((msg) => {
        const topping = getToppingById(msg.toppingId);
        return (
          <div key={msg.id} className="relative group">
            <button
              onClick={() => onMessageClick(msg)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all text-left active:scale-[0.98]"
            >
              <span className="text-2xl flex-shrink-0">{topping?.emoji || '🎂'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">
                  {msg.isAnonymous ? '익명' : msg.author}
                </p>
                {msg.isSecret ? (
                  <p className="text-xs text-pink-400 flex items-center gap-1">
                    🔒 비밀글입니다
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 truncate">{msg.content}</p>
                )}
              </div>
              <span className="text-xs text-gray-300 flex-shrink-0">
                {new Date(msg.createdAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </button>
            {onMessageDelete && (
              <button
                onClick={(e) => handleDelete(e, msg.id)}
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs transition-all ${
                  deletingId === msg.id
                    ? 'bg-red-500 text-white scale-110'
                    : 'bg-gray-200 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500'
                }`}
                title={deletingId === msg.id ? '한번 더 클릭하면 삭제됩니다' : '메시지 삭제'}
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
