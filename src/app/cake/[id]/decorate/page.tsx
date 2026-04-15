'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { nanoid } from 'nanoid';
import { Cake, Topping, Message } from '@/lib/types';
import { getCake, addMessage, getMessages } from '@/lib/store';
import ToppingSelector from '@/components/ToppingSelector';
import MessageForm from '@/components/MessageForm';

export default function DecoratePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [cake, setCake] = useState<Cake | null>(null);
  const [selectedTopping, setSelectedTopping] = useState<Topping | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'topping' | 'message'>('topping');
  const [notFound, setNotFound] = useState(false);
  const [existingMessages, setExistingMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadCake = async () => {
      try {
        const cakeData = await getCake(id);
        if (!cakeData) {
          setNotFound(true);
          return;
        }
        setCake(cakeData);
        const msgs = await getMessages(id);
        setExistingMessages(msgs);
      } catch (error) {
        console.error('Failed to load cake:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadCake();
  }, [id]);

  const handleToppingSelect = (topping: Topping) => {
    setSelectedTopping(topping);
  };

  const handleNextStep = () => {
    if (selectedTopping) {
      setStep('message');
    }
  };

  const findNonOverlappingPosition = (existing: Message[]) => {
    const minDistance = 14;
    const maxAttempts = 50;

    for (let i = 0; i < maxAttempts; i++) {
      const x = 10 + Math.random() * 80; // 10% ~ 90%
      const y = 5 + Math.random() * 85;  // 5% ~ 90%

      const hasOverlap = existing.some((msg) => {
        const dx = msg.positionX - x;
        const dy = msg.positionY - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });

      if (!hasOverlap) return { x, y };
    }

    // Fallback if all attempts overlap
    return { x: 10 + Math.random() * 80, y: 5 + Math.random() * 85 };
  };

  const handleSubmit = async (data: {
    author: string;
    content: string;
    isAnonymous: boolean;
    isSecret: boolean;
    password: string;
  }) => {
    if (!selectedTopping || !cake) return;

    setSubmitting(true);
    try {
      // Find a position that doesn't overlap with existing toppings
      const { x: positionX, y: positionY } = findNonOverlappingPosition(existingMessages);

      await addMessage({
        id: nanoid(10),
        cakeId: id,
        author: data.author,
        content: data.content,
        isAnonymous: data.isAnonymous,
        isSecret: data.isSecret,
        ...(data.isSecret ? { password: data.password } : {}),
        toppingId: selectedTopping.id,
        positionX,
        positionY,
        createdAt: Date.now(),
      });

      router.push(`/cake/${id}`);
    } catch (error) {
      console.error('Failed to add message:', error);
      alert('메시지 저장에 실패했어요. 다시 시도해주세요!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">✨</div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (notFound || !cake) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">케이크를 찾을 수 없어요</h2>
          <p className="text-gray-500 mb-6">링크가 잘못되었거나 삭제된 케이크예요</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors"
          >
            새 케이크 만들기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {cake.ownerName}님의 케이크 꾸미기
        </h2>
        <p className="text-sm text-gray-500">
          {step === 'topping'
            ? '올릴 토핑을 선택해주세요!'
            : '축하 메시지를 작성해주세요!'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            step === 'topping'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-pink-100 text-pink-500'
          }`}
        >
          <span>1</span> 토핑 선택
        </div>
        <div className="w-8 h-[2px] bg-gray-200" />
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            step === 'message'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <span>2</span> 메시지 작성
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-pink-100">
        {step === 'topping' ? (
          <div className="space-y-6">
            <ToppingSelector
              selected={selectedTopping?.id || null}
              onSelect={handleToppingSelect}
            />

            {selectedTopping && (
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  선택한 토핑: <span className="text-3xl">{selectedTopping.emoji}</span>{' '}
                  <span className="font-medium">{selectedTopping.name}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleNextStep}
              disabled={!selectedTopping}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              다음 단계로
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected topping preview */}
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTopping?.emoji}</span>
                <span className="text-sm font-medium text-gray-600">
                  {selectedTopping?.name}
                </span>
              </div>
              <button
                onClick={() => setStep('topping')}
                className="text-sm text-pink-500 hover:text-pink-600 font-medium"
              >
                변경
              </button>
            </div>

            <MessageForm onSubmit={handleSubmit} isLoading={submitting} />
          </div>
        )}
      </div>

      {/* Back link */}
      <Link
        href={`/cake/${id}`}
        className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← 케이크로 돌아가기
      </Link>
    </div>
  );
}
