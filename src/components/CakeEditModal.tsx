'use client';

import { useState } from 'react';
import { Cake, CakeType } from '@/lib/types';
import { CAKE_TYPES } from '@/data/cakes';
import { updateCake } from '@/lib/store';

interface CakeEditModalProps {
  cake: Cake;
  onClose: () => void;
  onSaved: (cake: Cake) => void;
}

export default function CakeEditModal({ cake, onClose, onSaved }: CakeEditModalProps) {
  const [ownerName, setOwnerName] = useState(cake.ownerName);
  const [birthday, setBirthday] = useState(cake.birthday);
  const [cakeType, setCakeType] = useState<CakeType>(cake.cakeType);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !birthday) return;

    setIsLoading(true);
    try {
      const updated: Cake = {
        ...cake,
        ownerName: ownerName.trim(),
        birthday,
        cakeType,
      };
      await updateCake(updated);
      onSaved(updated);
      onClose();
    } catch (error) {
      console.error('Failed to update cake:', error);
      alert('수정에 실패했어요. 다시 시도해주세요!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-modal-pop max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          케이크 수정하기
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              required
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              생일 날짜
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              케이크 종류
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAKE_TYPES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCakeType(c.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    cakeType === c.id
                      ? 'border-pink-500 ring-2 ring-pink-200 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-full h-10 rounded-lg mb-1 border"
                    style={{
                      background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})`,
                      borderColor: c.borderColor,
                    }}
                  />
                  <span className="text-xs font-medium text-gray-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !ownerName.trim() || !birthday}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
