'use client';

import { useState, useRef } from 'react';
import { domToPng } from 'modern-screenshot';

interface CakeCaptureProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  ownerName: string;
}

export default function CakeCapture({ targetRef, ownerName }: CakeCaptureProps) {
  const [capturing, setCapturing] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const capture = async () => {
    if (!targetRef.current) return;
    setCapturing(true);

    try {
      const dataUrl = await domToPng(targetRef.current, {
        backgroundColor: '#FFF5F7',
        scale: 2,
      });

      // Try share on mobile, download on desktop
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `${ownerName}_birthday_cake.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${ownerName}님의 생일케이크`,
            });
            return;
          }
        } catch {
          // Fall through to download
        }
      }

      // Download fallback
      if (linkRef.current) {
        linkRef.current.href = dataUrl;
        linkRef.current.download = `${ownerName}_birthday_cake.png`;
        linkRef.current.click();
      }
    } catch (error) {
      console.error('Failed to capture cake:', error);
      alert('이미지 저장에 실패했어요. 다시 시도해주세요!');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <>
      <button
        onClick={capture}
        disabled={capturing}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-pink-300 text-pink-500 font-bold rounded-full hover:bg-pink-50 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
      >
        {capturing ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            캡처 중...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            이미지 저장
          </>
        )}
      </button>
      <a ref={linkRef} className="hidden" />
    </>
  );
}
