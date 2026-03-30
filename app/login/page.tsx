"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatPhoneNumber(digits: string): string {
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
    setPhoneDisplay(formatPhoneNumber(digits));
  }

  function isValidPhone(digits: string): boolean {
    return /^01\d{8,9}$/.test(digits);
  }

  const canSubmit = isValidPhone(phone) && password.length >= 6;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      await login(phone, password);
      router.push("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("전화번호 또는 비밀번호가 일치하지 않아요.");
        } else {
          setError(err.message);
        }
      } else {
        setError("로그인 중 문제가 발생했어요. 다시 시도해주세요.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-[430px] mx-auto">
          <a href="/" className="text-[#8A8A9A] text-[14px] tap-highlight">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="inline mr-1"
            >
              <path
                d="M13 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            돌아가기
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-[430px]">
          <div className="page-enter space-y-6">
            {/* Logo + Title */}
            <div className="text-center mb-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 34 34"
                fill="none"
                className="mx-auto mb-4"
              >
                <path
                  d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
                  fill="#1A1A2E"
                />
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
              </svg>
              <h1 className="text-[24px] font-bold text-[#1A1A2E] tracking-[-0.03em] mb-2">
                다시 오셨군요
              </h1>
              <p className="text-[14px] text-[#4A4A5A] leading-[1.6]">
                전화번호와 비밀번호로 로그인하세요.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#8A8A9A] tracking-[0.04em] uppercase mb-1.5 block">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  value={phoneDisplay}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="010-1234-5678"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#E8E6E1] text-[15px] text-[#1A1A2E] placeholder:text-[#8A8A9A]/60 focus:outline-none focus:border-[#E8614D]/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#8A8A9A] tracking-[0.04em] uppercase mb-1.5 block">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#E8E6E1] text-[15px] text-[#1A1A2E] placeholder:text-[#8A8A9A]/60 focus:outline-none focus:border-[#E8614D]/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                />
              </div>

              {error && (
                <p className="text-[13px] text-[#E8614D] text-center animate-fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#E8614D" }}
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {/* Signup link */}
            <p className="text-center text-[13px] text-[#8A8A9A]">
              아직 계정이 없으신가요?{" "}
              <a
                href="/signup"
                className="font-semibold text-[#4A5FC1] hover:underline"
              >
                회원가입
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
