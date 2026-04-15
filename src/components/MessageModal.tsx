'use client';

import { useState } from 'react';
import { Message } from '@/lib/types';
import { getToppingById } from '@/data/toppings';

interface MessageModalProps {
  message: Message | null;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  if (!message) return null;

  const topping = getToppingById(message.toppingId);
  const needsPassword = message.isSecret && !unlocked;

  const handleUnlock = () => {
    if (passwordInput === message.password) {
      setUnlocked(true);
      setError('');
    } else {
      setError('비밀번호가 틀렸어요!');
      setPasswordInput('');
    }
  };

  const handleClose = () => {
    setPasswordInput('');
    setUnlocked(false);
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topping emoji */}
        <div className="text-center mb-4">
          <span className="text-5xl inline-block animate-bounce">
            {topping?.emoji || '🎂'}
          </span>
        </div>

        {needsPassword ? (
          /* Password prompt */
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">비밀글이에요!</h3>
            <p className="text-sm text-gray-500 mb-4">
              비밀번호를 입력해야 볼 수 있어요
            </p>
            <div className="flex flex-col items-center gap-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPasswordInput(v);
                  setError('');
                }}
                placeholder="0000"
                maxLength={4}
                inputMode="numeric"
                className="w-32 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-center tracking-[0.5em] text-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && passwordInput.length === 4) handleUnlock();
                }}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleUnlock}
                disabled={passwordInput.length !== 4}
                className="px-6 py-2 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          /* Message content */
          <div>
            <div className="text-center mb-3">
              <p className="text-sm text-gray-400">
                {message.isAnonymous ? '익명' : message.author}님의 축하
                {message.isSecret && (
                  <span className="ml-1 text-xs bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full">
                    비밀글
                  </span>
                )}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
            <p className="text-xs text-gray-300 text-center">
              {new Date(message.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-full mt-4 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
