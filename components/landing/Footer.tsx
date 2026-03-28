export default function Footer() {
  return (
    <footer className="bg-navy py-12 px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start mb-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 34 34"
                fill="none"
              >
                <path
                  d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
                  fill="#2D2D44"
                />
                <path
                  d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z"
                  fill="#E8614D"
                  fillOpacity="0.7"
                />
                <path
                  d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z"
                  fill="#4A5FC1"
                  fillOpacity="0.6"
                />
                <path
                  d="M13 19c1-1.5 3-1.5 4.2-.3 1.2 1.2 1.5 3 .3 4.3-1.2 1.3-3 1.5-4 .5S12 20.5 13 19z"
                  fill="#D4A853"
                  fillOpacity="0.55"
                />
              </svg>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-extrabold text-white/90">
                  탐
                </span>
                <span className="text-[10px] font-bold tracking-[0.06em] text-white/35 uppercase">
                  TAM
                </span>
              </div>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">
              아이의 경험을 넓히는 AI 플랫폼
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[13px] text-white/40">
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
