"use client";

import { useState, useEffect } from "react";

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAF8]/90 backdrop-blur-md shadow-[0_1px_0_rgba(26,26,46,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1120px] px-6 flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            className="transition-transform duration-300 group-hover:scale-105"
          >
            {/* Liquid blob base — organic, flowing shape */}
            <path
              d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
              fill="#1A1A2E"
            />
            {/* Inner liquid highlights — three flowing color accents */}
            <path
              d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z"
              fill="#E8614D"
              fillOpacity="0.85"
            />
            <path
              d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z"
              fill="#4A5FC1"
              fillOpacity="0.75"
            />
            <path
              d="M13 19c1-1.5 3-1.5 4.2-.3 1.2 1.2 1.5 3 .3 4.3-1.2 1.3-3 1.5-4 .5S12 20.5 13 19z"
              fill="#D4A853"
              fillOpacity="0.7"
            />
            {/* Specular highlight — glass-like reflection */}
            <ellipse
              cx="13"
              cy="9"
              rx="3"
              ry="1.5"
              fill="white"
              fillOpacity="0.12"
              transform="rotate(-20 13 9)"
            />
          </svg>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[18px] font-extrabold tracking-[-0.03em] text-navy">
              탐
            </span>
            <span className="text-[10px] font-bold tracking-[0.06em] text-text-muted/70 uppercase">
              TAM
            </span>
          </div>
        </a>

        {/* Nav links + buttons */}
        <div className="flex items-center gap-2">
          {/* Always visible nav links */}
          <a
            href="/guide"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors hidden sm:block"
          >
            학부모 가이드
          </a>
          <a
            href="/blog"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors hidden sm:block"
          >
            블로그
          </a>
          <a
            href="/quiz"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-coral hover:text-coral-hover transition-colors hidden sm:block"
          >
            무료 진단
          </a>

          {/* Auth-dependent CTA */}
          {isLoggedIn ? (
            <a
              href="/home"
              className={`text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                scrolled
                  ? "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_8px_rgba(232,97,77,0.25)]"
                  : "bg-navy/[0.06] text-navy hover:bg-navy/[0.1]"
              }`}
            >
              오늘의 탐험
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <>
              <a
                href="/login"
                className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors"
              >
                로그인
              </a>
              <a
                href="/signup"
                className={`text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_8px_rgba(232,97,77,0.25)]"
                    : "bg-navy/[0.06] text-navy hover:bg-navy/[0.1]"
                }`}
              >
                시작하기
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
