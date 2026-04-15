'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: { mobileWebUrl: string; webUrl: string };
  };
  buttons: Array<{
    title: string;
    link: { mobileWebUrl: string; webUrl: string };
  }>;
}

interface ShareButtonProps {
  cakeId: string;
  ownerName: string;
}

export default function ShareButton({ cakeId, ownerName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cake/${cakeId}`
    : '';

  const shareText = `${ownerName}님의 생일케이크를 꾸며주세요! 🎂`;

  useEffect(() => {
    const initKakao = () => {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (window.Kakao && kakaoKey && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
        setKakaoReady(true);
      } else if (window.Kakao?.isInitialized()) {
        setKakaoReady(true);
      }
    };

    if (window.Kakao) {
      initKakao();
    } else {
      const timer = setInterval(() => {
        if (window.Kakao) {
          initKakao();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareKakaoTalk = () => {
    if (kakaoReady && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '생일케이크를 꾸며줘! 🎂',
          description: shareText,
          imageUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/og-image.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '케이크 꾸미러 가기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      // Fallback: KakaoStory share if SDK not ready
      const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
      window.open(kakaoUrl, '_blank', 'width=600,height=400');
    }
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '생일케이크를 꾸며줘!',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      setShowShare(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={shareNative}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-pink-300 text-pink-500 font-bold rounded-full hover:bg-pink-50 transition-all shadow-sm hover:shadow-md active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        링크 공유하기
      </button>

      {showShare && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[200px] z-50 animate-modal-pop">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { copyLink(); setShowShare(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="text-lg">📋</span>
              {copied ? '복사됨!' : '링크 복사'}
            </button>
            <button
              onClick={() => { shareKakaoTalk(); setShowShare(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="text-lg">💬</span>
              카카오톡 공유
            </button>
            <button
              onClick={() => { shareTwitter(); setShowShare(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="text-lg">🐦</span>
              트위터 공유
            </button>
          </div>
          <button
            onClick={() => setShowShare(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full text-gray-500 text-xs hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
      )}

      {copied && !showShare && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap animate-modal-pop">
          링크가 복사되었어요!
        </div>
      )}
    </div>
  );
}
