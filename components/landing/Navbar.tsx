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
            tone={scrolled ? "light" : "dark"}
            size="md"
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Nav links + buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/guide"
            className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors hidden sm:block ${
              scrolled ? "text-text-secondary hover:text-navy" : "text-white/50 hover:text-white/80"
            }`}
          >
            학부모 가이드
          </Link>
          <Link
            href="/blog"
            className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors hidden sm:block ${
              scrolled ? "text-text-secondary hover:text-navy" : "text-white/50 hover:text-white/80"
            }`}
          >
            블로그
          </Link>
          <Link
            href="/quiz"
            className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors hidden sm:block ${
              scrolled ? "text-coral hover:text-coral-hover" : "text-coral hover:text-coral-hover"
            }`}
          >
            무료 진단
          </Link>

          {isLoggedIn ? (
            <Link
              href="/home"
              className={`text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                scrolled
                  ? "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_8px_rgba(232,97,77,0.25)]"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              오늘의 탐험
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`hidden sm:block text-[13px] font-medium px-4 py-2 rounded-full transition-colors ${
                  scrolled ? "text-text-secondary hover:text-navy" : "text-white/50 hover:text-white/80"
                }`}
              >
                로그인
              </Link>
              <Link
                href="/consultation"
                className={`text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_8px_rgba(232,97,77,0.25)]"
                    : "bg-coral text-white hover:bg-coral-hover shadow-[0_2px_12px_rgba(232,97,77,0.3)]"
                }`}
              >
                사전신청
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
