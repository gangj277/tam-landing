"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import TamLogo from "@/components/brand/TamLogo";

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
        <Link href="/" className="group">
          <TamLogo
            size="md"
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Nav links + buttons */}
        <div className="flex items-center gap-2">
          {/* Always visible nav links */}
          <Link
            href="/guide"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors hidden sm:block"
          >
            학부모 가이드
          </Link>
          <Link
            href="/blog"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors hidden sm:block"
          >
            블로그
          </Link>
          <Link
            href="/quiz"
            className="text-[13px] font-medium px-4 py-2 rounded-full text-coral hover:text-coral-hover transition-colors hidden sm:block"
          >
            무료 진단
          </Link>

          {/* Auth-dependent CTA */}
          {isLoggedIn ? (
            <Link
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
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium px-4 py-2 rounded-full text-text-secondary hover:text-navy transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className={`text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_8px_rgba(232,97,77,0.25)]"
                    : "bg-navy/[0.06] text-navy hover:bg-navy/[0.1]"
                }`}
              >
                시작하기
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
