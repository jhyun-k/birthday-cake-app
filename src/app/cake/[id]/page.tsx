'use client';

import { useEffect, useState, useCallback, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cake, Message } from '@/lib/types';
import { getCake, getMessages, deleteCake, deleteMessage, subscribeToMessages } from '@/lib/store';
import { getCakeTypeInfo } from '@/data/cakes';
import { getToppingById } from '@/data/toppings';
import CakeView from '@/components/CakeView';
import MessageModal from '@/components/MessageModal';
import ShareButton from '@/components/ShareButton';
import MessageList from '@/components/MessageList';
import CakeEditModal from '@/components/CakeEditModal';
import Toast, { ToastMessage } from '@/components/Toast';
import CakeCapture from '@/components/CakeCapture';

function sendBrowserNotification(title: string, body: string) {
  if (typeof window === 'undefined') return;
  if (Notification.permission === 'granted' && document.hidden) {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

export default function CakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [cake, setCake] = useState<Cake | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const prevMessageCount = useRef<number>(0);
  const initialLoad = useRef(true);
  const cakeViewRef = useRef<HTMLDivElement>(null);

  // Admin auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const addToast = useCallback((text: string, emoji?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, emoji }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

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
        prevMessageCount.current = msgs.length;
      } catch (error) {
        console.error('Failed to load cake:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
        setTimeout(() => { initialLoad.current = false; }, 1000);
      }
    };
    loadData();

    // Subscribe to real-time updates (Firebase only)
    const unsub = subscribeToMessages(id, (newMessages) => {
      if (initialLoad.current) return;

      if (newMessages.length > prevMessageCount.current) {
        const newOnes = newMessages.slice(prevMessageCount.current);
        for (const msg of newOnes) {
          const topping = getToppingById(msg.toppingId);
          const author = msg.isAnonymous ? '익명' : msg.author;
          addToast(`${author}님이 토핑을 올렸어요!`, topping?.emoji);
          sendBrowserNotification(
            '새 축하 메시지!',
            `${author}님이 케이크에 토핑을 올렸어요!`
          );
        }
      }
      prevMessageCount.current = newMessages.length;
      setMessages(newMessages);
    });

    return () => { unsub?.(); };
  }, [id, addToast]);

  const handlePasswordSubmit = () => {
    if (!cake) return;
    if (passwordInput === cake.adminPassword) {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleDeleteCake = async () => {
    try {
      await deleteCake(id);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete cake:', error);
      alert('삭제에 실패했어요. 다시 시도해주세요!');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(id, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      prevMessageCount.current -= 1;
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('메시지 삭제에 실패했어요.');
    }
  };

  const handleCakeSaved = (updated: Cake) => {
    setCake(updated);
  };

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
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full relative">
      {/* Toast notifications */}
      <Toast messages={toasts} onRemove={removeToast} />

      {/* Settings gear - top right */}
      <button
        onClick={() => {
          if (isAdmin) {
            setIsAdmin(false);
          } else {
            setShowPasswordModal(true);
          }
        }}
        className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
          isAdmin
            ? 'bg-pink-500 text-white shadow-md'
            : 'bg-white/80 text-gray-400 hover:text-gray-600 hover:bg-white shadow-sm border border-gray-100'
        }`}
        title={isAdmin ? '관리 모드 끄기' : '관리자 인증'}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Cake display */}
      <div ref={cakeViewRef}>
        <CakeView
          cakeType={cakeTypeInfo}
          messages={messages}
          onToppingClick={setSelectedMessage}
          ownerName={cake.ownerName}
          birthday={cake.birthday}
        />
      </div>

      {/* Notification permission banner */}
      {notifPermission === 'default' && (
        <button
          onClick={requestNotifPermission}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 text-sm rounded-full border border-pink-200 hover:bg-pink-100 transition-colors"
        >
          <span>🔔</span>
          새 메시지 알림 받기
        </button>
      )}

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
        <CakeCapture targetRef={cakeViewRef} ownerName={cake.ownerName} />
      </div>

      {/* Admin actions - only visible when authenticated */}
      {isAdmin && (
        <div className="flex items-center gap-3 mt-4 animate-modal-pop">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-200 text-pink-500 font-medium rounded-full hover:bg-pink-50 transition-all shadow-sm active:scale-95 text-sm"
          >
            <span>✏️</span>
            케이크 수정
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-200 text-red-500 font-medium rounded-full hover:bg-red-50 transition-all shadow-sm active:scale-95 text-sm"
          >
            <span>🗑️</span>
            케이크 삭제
          </button>
        </div>
      )}

      {/* Message list */}
      <div className="w-full mt-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
        <MessageList
          messages={messages}
          onMessageClick={setSelectedMessage}
          onMessageDelete={isAdmin ? handleDeleteMessage : undefined}
        />
      </div>

      {/* Message modal */}
      <MessageModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Edit modal */}
      {showEditModal && (
        <CakeEditModal
          cake={cake}
          onClose={() => setShowEditModal(false)}
          onSaved={handleCakeSaved}
        />
      )}

      {/* Password verification modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">관리자 인증</h3>
              <p className="text-sm text-gray-500 mb-5">
                케이크 생성 시 설정한 비밀번호를 입력해주세요
              </p>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={passwordInput}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPasswordInput(v);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && passwordInput.length === 4) handlePasswordSubmit();
                }}
                placeholder="0000"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-2xl tracking-[0.5em] text-center font-bold ${
                  passwordError
                    ? 'border-red-400 bg-red-50 animate-shake'
                    : 'border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                }`}
                maxLength={4}
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-2">비밀번호가 틀렸어요</p>
              )}
              <button
                onClick={handlePasswordSubmit}
                disabled={passwordInput.length !== 4}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">정말 삭제할까요?</h3>
              <p className="text-sm text-gray-500 mb-6">
                케이크와 모든 메시지가 삭제되며<br />되돌릴 수 없어요.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteCake}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
