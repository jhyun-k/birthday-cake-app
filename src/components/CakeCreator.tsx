'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { CAKE_TYPES } from '@/data/cakes';
import { CakeType } from '@/lib/types';
import { createCake } from '@/lib/store';

export default function CakeCreator() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [cakeType, setCakeType] = useState<CakeType>('cream');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !birthday) return;

    setIsLoading(true);
    try {
      const id = nanoid(10);
      await createCake({
        id,
        ownerName: ownerName.trim(),
        birthday,
        cakeType,
        createdAt: Date.now(),
      });
      router.push(`/cake/${id}`);
    } catch (error) {
      console.error('Failed to create cake:', error);
      alert('케이크 생성에 실패했어요. 다시 시도해주세요!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="w-full max-w-md space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          생일인 사람의 이름
        </label>
        <input
          type="text"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="홍길동"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-lg"
          required
          maxLength={20}
        />
      </div>

      {/* Birthday */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          생일 날짜
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-lg"
          required
        />
      </div>

      {/* Cake type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          케이크 종류
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CAKE_TYPES.map((cake) => (
            <button
              key={cake.id}
              type="button"
              onClick={() => setCakeType(cake.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                cakeType === cake.id
                  ? 'border-pink-500 ring-2 ring-pink-200 shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div
                className="w-full h-16 rounded-lg mb-2 border"
                style={{
                  background: `linear-gradient(135deg, ${cake.gradientFrom}, ${cake.gradientTo})`,
                  borderColor: cake.borderColor,
                }}
              />
              <span className="text-sm font-medium text-gray-700">{cake.name}</span>
              {cakeType === cake.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !ownerName.trim() || !birthday}
        className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            만드는 중...
          </span>
        ) : (
          '🎂 케이크 만들기!'
        )}
      </button>
    </form>
  );
}
