'use client';

import { useState, useRef, useCallback } from 'react';
import { CakeTypeInfo, Message } from '@/lib/types';
import { getToppingById } from '@/data/toppings';

interface CakeViewProps {
  cakeType: CakeTypeInfo;
  messages: Message[];
  onToppingClick: (message: Message) => void;
  onToppingMove?: (messageId: string, positionX: number, positionY: number) => void;
  ownerName: string;
  birthday: string;
}

export default function CakeView({
  cakeType,
  messages,
  onToppingClick,
  onToppingMove,
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

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cakeTopRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  const getPositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!cakeTopRef.current) return null;
    const rect = cakeTopRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent, msg: Message) => {
    if (!onToppingMove) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(msg.id);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;

    const pos = getPositionFromEvent(e.clientX, e.clientY);
    if (pos) {
      setDragOffset({ x: msg.positionX - pos.x, y: msg.positionY - pos.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !onToppingMove) return;
    e.preventDefault();

    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) {
        hasMoved.current = true;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingId) return;

    if (hasMoved.current && onToppingMove) {
      const pos = getPositionFromEvent(e.clientX, e.clientY);
      if (pos) {
        const finalX = Math.max(10, Math.min(90, pos.x + dragOffset.x));
        const finalY = Math.max(10, Math.min(90, pos.y + dragOffset.y));
        onToppingMove(draggingId, finalX, finalY);
      }
    } else {
      const msg = messages.find((m) => m.id === draggingId);
      if (msg) onToppingClick(msg);
    }

    setDraggingId(null);
    dragStartPos.current = null;
    hasMoved.current = false;
  };

  // Cream drip heights - computed once and stored
  const [dripHeights] = useState(() =>
    Array.from({ length: 8 }, () => 20 + Math.random() * 30)
  );

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
          {onToppingMove
            ? '토핑을 드래그하여 위치를 변경하거나, 클릭하면 메시지를 볼 수 있어요'
            : '토핑을 클릭하면 축하 메시지를 볼 수 있어요'}
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
            ref={cakeTopRef}
            className="w-[300px] h-[60px] rounded-[50%] relative z-10 border-2 shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${cakeType.gradientFrom}, ${cakeType.gradientTo})`,
              borderColor: cakeType.borderColor,
              touchAction: 'none',
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Toppings on top of cake */}
            {messages.map((msg) => {
              const topping = getToppingById(msg.toppingId);
              const isDragging = draggingId === msg.id;
              return (
                <button
                  key={msg.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl transition-transform z-20 drop-shadow-md ${
                    isDragging
                      ? 'scale-150 drop-shadow-lg cursor-grabbing z-30'
                      : onToppingMove
                        ? 'hover:scale-125 cursor-grab hover:drop-shadow-lg'
                        : 'hover:scale-125 cursor-pointer hover:drop-shadow-lg'
                  }`}
                  style={{
                    left: `${msg.positionX}%`,
                    top: `${msg.positionY}%`,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, msg)}
                  onClick={(e) => {
                    if (!onToppingMove) {
                      e.stopPropagation();
                      onToppingClick(msg);
                    }
                  }}
                  title={msg.isAnonymous ? '익명의 축하' : `${msg.author}의 축하`}
                >
                  <span className={isDragging ? '' : 'animate-wiggle inline-block hover:animate-bounce'}>
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
              {dripHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-6 rounded-b-full"
                  style={{
                    height: `${h}px`,
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
