'use client';

import { useState } from 'react';
import { TOPPINGS } from '@/data/toppings';
import { Topping } from '@/lib/types';

interface ToppingSelectorProps {
  selected: string | null;
  onSelect: (topping: Topping) => void;
}

export default function ToppingSelector({ selected, onSelect }: ToppingSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'fruit' | 'sweet' | 'decoration'>('fruit');

  const categories = [
    { id: 'fruit' as const, name: '과일', emoji: '🍓' },
    { id: 'sweet' as const, name: '과자/사탕', emoji: '🍪' },
    { id: 'decoration' as const, name: '장식', emoji: '✨' },
  ];

  const filteredToppings = TOPPINGS.filter((t) => t.category === activeCategory);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        토핑을 선택해주세요
      </label>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Topping grid */}
      <div className="grid grid-cols-5 gap-3">
        {filteredToppings.map((topping) => (
          <button
            key={topping.id}
            onClick={() => onSelect(topping)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              selected === topping.id
                ? 'bg-pink-100 ring-2 ring-pink-500 scale-110 shadow-md'
                : 'bg-white hover:bg-gray-50 hover:scale-105 shadow-sm'
            }`}
          >
            <span className="text-3xl">{topping.emoji}</span>
            <span className="text-[10px] text-gray-500 font-medium">{topping.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
