"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, ApiError } from "@/lib/api-client";

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Parent info
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState(""); // raw digits only
  const [ownerPhoneDisplay, setOwnerPhoneDisplay] = useState(""); // formatted with dashes
  const [password, setPassword] = useState("");

  // Step 2: Child info
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  // Step 3: PIN
  const [pin, setPin] = useState(["", "", "", ""]);

  const pinValue = pin.join("");

  async function handleComplete() {
    if (pinValue.length !== 4) return;
    setLoading(true);
    setError(null);

    try {
      await signup({
        ownerPhone,
        ownerName,
        password,
        parentPIN: pinValue,
        firstChild: { name: childName, age: parseInt(childAge) },
      });
      router.push("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("가입 중 문제가 발생했어요. 다시 시도해주세요.");
      }
      setLoading(false);
    }
  }

  function formatPhoneNumber(digits: string): string {
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    setOwnerPhone(digits);
    setOwnerPhoneDisplay(formatPhoneNumber(digits));
  }

  function isValidPhone(digits: string): boolean {
    return /^01\d{8,9}$/.test(digits);
  }

  function handlePinInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...pin];
    next[index] = value;
    setPin(next);
    if (value && index < 3) {
      const el = document.getElementById(`pin-${index + 1}`);
      el?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const el = document.getElementById(`pin-${index - 1}`);
      el?.focus();
    }
  }

  const canProceedStep1 = ownerName.trim() && isValidPhone(ownerPhone) && password.length >= 6;
  const canProceedStep2 = childName.trim() && childAge && parseInt(childAge) >= 6 && parseInt(childAge) <= 18;

  return (
    <div className="min-h-dvh bg-bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <a href="/" className="text-text-muted text-[14px] tap-highlight">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline mr-1">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            돌아가기
          </a>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: s === step ? 24 : 8,
                  backgroundColor: s <= step ? "#E8614D" : "#E8E6E1",
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-[430px]">

          {/* ─── Step 1: Parent Info ─── */}
          {step === 1 && (
            <div className="page-enter space-y-6">
              <div>
                <h1 className="text-[24px] font-bold text-navy tracking-[-0.03em] mb-2">
                  보호자 정보
                </h1>
                <p className="text-[14px] text-text-secondary leading-[1.6]">
                  아이의 탐험을 지켜볼 계정을 만들어주세요.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1.5 block">이름</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border-light text-[15px] text-navy placeholder:text-text-muted focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1.5 block">휴대폰 번호</label>
                  <input
                    type="tel"
                    value={ownerPhoneDisplay}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border-light text-[15px] text-navy placeholder:text-text-muted focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1.5 block">비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border-light text-[15px] text-navy placeholder:text-text-muted focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => canProceedStep1 && setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#E8614D" }}
              >
                다음
              </button>

              <p className="text-center text-[13px] text-text-muted">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="font-semibold text-indigo hover:underline">
                  로그인
                </a>
              </p>
            </div>
          )}

          {/* ─── Step 2: Child Profile ─── */}
          {step === 2 && (
            <div className="page-enter space-y-6">
              <div>
                <h1 className="text-[24px] font-bold text-navy tracking-[-0.03em] mb-2">
                  아이 프로필
                </h1>
                <p className="text-[14px] text-text-secondary leading-[1.6]">
                  탐험을 시작할 아이의 정보를 입력해주세요.
                  <br />
                  나중에 더 추가할 수 있어요.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1.5 block">아이 이름</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="서연"
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border-light text-[15px] text-navy placeholder:text-text-muted focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-text-muted tracking-[0.04em] uppercase mb-1.5 block">나이</label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="12"
                    min={6}
                    max={18}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-border-light text-[15px] text-navy placeholder:text-text-muted focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-4 rounded-xl border border-border-light text-text-muted font-medium text-[14px] transition-colors tap-highlight hover:bg-bg-warm"
                >
                  이전
                </button>
                <button
                  onClick={() => canProceedStep2 && setStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#E8614D" }}
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: PIN ─── */}
          {step === 3 && (
            <div className="page-enter space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-coral/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="6" y="12" width="16" height="12" rx="2.5" stroke="#E8614D" strokeWidth="2" />
                    <path d="M10 12V9C10 6.79 11.79 5 14 5C16.21 5 18 6.79 18 9V12" stroke="#E8614D" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="14" cy="18" r="1.5" fill="#E8614D" />
                  </svg>
                </div>
                <h1 className="text-[24px] font-bold text-navy tracking-[-0.03em] mb-2">
                  부모님 비밀번호
                </h1>
                <p className="text-[14px] text-text-secondary leading-[1.6]">
                  아이가 부모 화면을 보지 않도록
                  <br />
                  4자리 숫자를 설정해주세요.
                </p>
              </div>

              {/* PIN Input */}
              <div className="flex justify-center gap-4">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinInput(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    className="w-14 h-14 rounded-xl bg-white border-2 border-border-light text-center text-[24px] font-bold text-navy focus:outline-none focus:border-coral transition-all"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <p className="text-[13px] text-coral text-center animate-fade-in">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-4 rounded-xl border border-border-light text-text-muted font-medium text-[14px] transition-colors tap-highlight hover:bg-bg-warm"
                >
                  이전
                </button>
                <button
                  onClick={handleComplete}
                  disabled={pinValue.length !== 4 || loading}
                  className="flex-1 py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#E8614D" }}
                >
                  {loading ? "가입 중..." : "시작하기"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
