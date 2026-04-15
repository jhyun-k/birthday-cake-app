'use client';

import { CakeTypeInfo, Message } from '@/lib/types';
import { getToppingById } from '@/data/toppings';

interface CakeViewProps {
  cakeType: CakeTypeInfo;
  messages: Message[];
  onToppingClick: (message: Message) => void;
  ownerName: string;
  birthday: string;
}

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
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[340px] h-[40px] bg-gray-200 rounded-[50%] shadow-lg" />

        {/* Cake body (side view) */}
        <div className="relative">
          {/* Cake top (ellipse) */}
          <div
            className="w-[300px] h-[60px] rounded-[50%] relative z-10 border-2 shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${cakeType.gradientFrom}, ${cakeType.gradientTo})`,
              borderColor: cakeType.borderColor,
            }}
          >
            {/* Toppings on top of cake */}
            {messages.map((msg, index) => {
              const topping = getToppingById(msg.toppingId);
              return (
                <button
                  key={msg.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl hover:scale-125 transition-transform cursor-pointer z-20 drop-shadow-md hover:drop-shadow-lg"
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

          {/* Cake side */}
          <div
            className="w-[300px] h-[140px] -mt-[30px] rounded-b-[20px] border-x-2 border-b-2 relative overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${cakeType.sideColor}, ${cakeType.gradientTo})`,
              borderColor: cakeType.borderColor,
            }}
          >
            {/* Cream drips */}
            <div className="absolute top-0 left-0 w-full flex justify-around">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 rounded-b-full"
                  style={{
                    height: `${20 + Math.random() * 30}px`,
                    background: cakeType.gradientFrom,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>

            {/* Cake layers */}
            <div
              className="absolute bottom-0 w-full h-[3px]"
              style={{ background: cakeType.borderColor, bottom: '45px' }}
            />
            <div
              className="absolute bottom-0 w-full h-[3px]"
              style={{ background: cakeType.borderColor, bottom: '90px' }}
            />
          </div>

          {/* Cake bottom ellipse */}
          <div
            className="w-[300px] h-[40px] rounded-[50%] -mt-[20px] border-2"
            style={{
              background: cakeType.gradientTo,
              borderColor: cakeType.borderColor,
            }}
          />
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
