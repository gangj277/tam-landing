"use client";

import { useState } from "react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://tam.kr/blog/${slug}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleKakaoShare() {
    // Kakao SDK share — opens web share URL as fallback
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
    window.open(kakaoUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  return (
    <div className="flex items-center gap-2">
      {/* Kakao */}
      <button
        onClick={handleKakaoShare}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FEE500]/20 hover:bg-[#FEE500]/40 transition-colors"
        aria-label="카카오톡 공유"
        title="카카오톡 공유"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C6.477 3 2 6.463 2 10.691c0 2.706 1.753 5.087 4.4 6.46-.148.525-.954 3.388-.988 3.61 0 0-.02.166.088.229.108.063.234.029.234.029.308-.043 3.572-2.33 4.133-2.723A12.04 12.04 0 0012 18.382c5.523 0 10-3.463 10-7.69C22 6.462 17.523 3 12 3z"
            fill="#3C1E1E"
          />
        </svg>
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-navy/[0.04] hover:bg-navy/[0.08] transition-colors relative"
        aria-label="링크 복사"
        title="링크 복사"
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-coral"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-text-muted"
          >
            <path
              d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.333 3.333 0 009.02 2.354l-1.147 1.14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.333 3.333 0 004.673 4.673l1.14-1.14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {copied && (
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-coral font-medium whitespace-nowrap animate-fade-in">
            복사됨
          </span>
        )}
      </button>
    </div>
  );
}
