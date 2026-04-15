'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Cake, Message } from '@/lib/types';
import { getCake, getMessages } from '@/lib/store';
import { getCakeTypeInfo } from '@/data/cakes';
import CakeView from '@/components/CakeView';
import MessageModal from '@/components/MessageModal';
import ShareButton from '@/components/ShareButton';
import MessageList from '@/components/MessageList';

export default function CakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cake, setCake] = useState<Cake | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cakeData = await getCake(id);
        if (!cakeData) {
          setNotFound(true);
          return;
        }
        setCake(cakeData);
        const msgs = await getMessages(id);
        setMessages(msgs);
      } catch (error) {
        console.error('Failed to load cake:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🎂</div>
          <p className="text-gray-400">케이크를 불러오는 중...</p>
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

  const cakeTypeInfo = getCakeTypeInfo(cake.cakeType);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
      {/* Cake display */}
      <CakeView
        cakeType={cakeTypeInfo}
        messages={messages}
        onToppingClick={setSelectedMessage}
        ownerName={cake.ownerName}
        birthday={cake.birthday}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          href={`/cake/${id}/decorate`}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-full hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <span>✨</span>
          토핑 올리기
        </Link>
        <ShareButton cakeId={id} ownerName={cake.ownerName} />
      </div>

      {/* Message list */}
      <div className="w-full mt-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
        <MessageList messages={messages} onMessageClick={setSelectedMessage} />
      </div>

      {/* Message modal */}
      <MessageModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
}
