'use client';

import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  emoji?: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ messages, onRemove }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 max-w-[320px]">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ message, onRemove }: { message: ToastMessage; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(message.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-pink-100 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <span className="text-2xl flex-shrink-0">{message.emoji || '🔔'}</span>
      <p className="text-sm text-gray-700 flex-1">{message.text}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(message.id), 300);
        }}
        className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
