'use client';

import { useMemo } from 'react';
import { CakeTypeInfo, Message } from '@/lib/types';
import { getToppingById } from '@/data/toppings';

interface CakeViewProps {
  cakeType: CakeTypeInfo;
  messages: Message[];
  onToppingClick: (message: Message) => void;
  ownerName: string;
  birthday: string;
}

const SPRINKLE_COLORS = ['#FF6B8A', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8B94', '#C084FC', '#FB923C'];

export default function CakeView({
  cakeType,
  messages,
  onToppingClick,
  ownerName,
  birthday,
}: CakeViewProps) {
  const today = new Date();
  const bday = new Date(birthday + 'T00:00:00');
  const isBirthday =
    today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();

  const daysUntilBirthday = (() => {
    const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (thisYear < today) {
      thisYear.setFullYear(thisYear.getFullYear() + 1);
    }
    const diff = thisYear.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  // Deterministic sprinkles
  const sprinkles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      left: 8 + ((i * 41 + 7) % 84),
      top: 12 + ((i * 29 + 13) % 65),
      rotation: (i * 47) % 180,
      color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
    })), []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Birthday status */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {ownerName}님의 생일케이크
        </h2>
        {isBirthday ? (
          <p className="text-lg font-semibold text-pink-500 animate-bounce">
            🎉 오늘이 생일이에요! Happy Birthday! 🎉
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            생일까지 <span className="font-bold text-pink-500">{daysUntilBirthday}</span>일 남았어요!
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          토핑을 클릭하면 축하 메시지를 볼 수 있어요
        </p>
      </div>

      {/* Cake display */}
      <div className="relative">
        {/* Cake plate */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[320px] h-[24px] rounded-[50%]"
          style={{
            background: 'linear-gradient(180deg, #e5e7eb, #d1d5db)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />

        {/* Cake wrapper - toppings positioned within this */}
        <div className="relative w-[300px]">
          {/* Cake top surface */}
          <div
            className="w-full h-[50px] rounded-[50%] relative z-[5]"
            style={{
              background: `radial-gradient(ellipse at 35% 35%, ${cakeType.gradientFrom}, ${cakeType.gradientTo})`,
              boxShadow: `inset 0 -3px 10px rgba(0,0,0,0.06), 0 0 0 1px ${cakeType.borderColor}50`,
            }}
          >
            {/* Decorative swirl on top */}
            <div
              className="absolute inset-[10px] rounded-[50%]"
              style={{
                border: `1.5px dashed ${cakeType.borderColor}35`,
              }}
            />
          </div>

          {/* Cake body */}
          <div
            className="w-full h-[150px] -mt-[25px] rounded-b-[18px] relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${cakeType.sideColor} 0%, ${cakeType.gradientTo} 100%)`,
              boxShadow: `inset 2px 0 6px rgba(0,0,0,0.03), inset -2px 0 6px rgba(0,0,0,0.03), 0 0 0 1px ${cakeType.borderColor}20`,
            }}
          >
            {/* Frosting edge glow at top */}
            <div
              className="absolute top-0 left-0 w-full h-[10px]"
              style={{
                background: `linear-gradient(180deg, ${cakeType.gradientFrom}bb, transparent)`,
              }}
            />

            {/* Cream filling layer */}
            <div
              className="absolute w-full h-[10px]"
              style={{
                top: '47%',
                background: `linear-gradient(180deg, transparent 0%, ${cakeType.gradientFrom}50 30%, ${cakeType.gradientFrom}70 50%, ${cakeType.gradientFrom}50 70%, transparent 100%)`,
              }}
            />

            {/* Sprinkles */}
            {sprinkles.map((s, i) => (
              <div
                key={i}
                className="absolute w-[3px] h-[8px] rounded-full"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  background: s.color,
                  transform: `rotate(${s.rotation}deg)`,
                  opacity: 0.55,
                }}
              />
            ))}

            {/* Subtle highlight for dimension */}
            <div
              className="absolute top-0 left-[15%] w-[20%] h-full opacity-[0.06] rounded-full"
              style={{ background: 'white' }}
            />
          </div>

          {/* Cake base */}
          <div
            className="w-full h-[28px] rounded-[50%] -mt-[14px]"
            style={{
              background: cakeType.gradientTo,
              boxShadow: `0 0 0 1px ${cakeType.borderColor}40, 0 4px 10px rgba(0,0,0,0.08)`,
            }}
          />

          {/* Toppings - positioned across entire cake */}
          {messages.map((msg) => {
            const topping = getToppingById(msg.toppingId);
            return (
              <button
                key={msg.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl transition-transform z-10 drop-shadow-md hover:scale-125 cursor-pointer hover:drop-shadow-lg active:scale-110"
                style={{
                  left: `${msg.positionX}%`,
                  top: `${msg.positionY}%`,
                }}
                onClick={() => onToppingClick(msg)}
                title={msg.isAnonymous ? '익명의 축하' : `${msg.author}의 축하`}
              >
                <span className="animate-wiggle inline-block hover:animate-bounce">
                  {topping?.emoji || '🎂'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message count */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          현재 <span className="font-bold text-pink-500">{messages.length}</span>개의
          축하 메시지가 있어요
        </p>
      </div>
    </div>
  );
}
