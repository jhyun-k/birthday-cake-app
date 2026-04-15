'use client';

import { useState } from 'react';

interface MessageFormProps {
  onSubmit: (data: {
    author: string;
    content: string;
    isAnonymous: boolean;
    isSecret: boolean;
    password: string;
  }) => void;
  isLoading: boolean;
}

export default function MessageForm({ onSubmit, isLoading }: MessageFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (isSecret && password.length !== 4) return;

    onSubmit({
      author: isAnonymous ? '익명' : author,
      content: content.trim(),
      isAnonymous,
      isSecret,
      password: isSecret ? password : '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Author */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          작성자
        </label>
        <input
          type="text"
          value={isAnonymous ? '' : author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={isAnonymous}
          placeholder={isAnonymous ? '익명으로 작성합니다' : '이름을 입력해주세요'}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
          required={!isAnonymous}
        />
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
          />
          <span className="text-sm text-gray-600">익명으로 작성하기</span>
        </label>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          축하 메시지
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="생일 축하 메시지를 작성해주세요! 🎂"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
          required
        />
        <p className="text-xs text-gray-400 text-right mt-1">{content.length}/500</p>
      </div>

      {/* Secret toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
          />
          <span className="text-sm text-gray-600">비밀글로 작성하기 🔒</span>
        </label>

        {isSecret && (
          <div className="mt-3 p-3 bg-pink-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 (숫자 4자리)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPassword(v);
              }}
              placeholder="0000"
              maxLength={4}
              inputMode="numeric"
              className="w-32 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-center tracking-[0.5em] text-lg"
              required={isSecret}
            />
            {password.length > 0 && password.length < 4 && (
              <p className="text-xs text-red-400 mt-1">4자리를 입력해주세요</p>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !content.trim() || (isSecret && password.length !== 4)}
        className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        {isLoading ? '올리는 중...' : '🎂 토핑 올리기!'}
      </button>
    </form>
  );
}
