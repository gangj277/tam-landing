import Link from "next/link";
import TamLogo from "@/components/brand/TamLogo";

export default function Footer() {
  return (
    <footer className="bg-navy py-12 px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-3">
              <TamLogo tone="dark" size="sm" />
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">
              아이의 경험을 넓히는 AI 플랫폼
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[13px] text-white/40">
            <Link href="/blog" className="hover:text-white/70 transition-colors">
              블로그
            </Link>
            <a href="#" className="hover:text-white/70 transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              문의하기
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/[0.06] my-8" />

        {/* Copyright */}
        <p className="text-[12px] text-white/25 text-center md:text-left">
          &copy; 2026 탐 TAM. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
