'use client';

import Link from "next/link";
import { type FormEvent, useState, useEffect } from "react";

type FormState = {
  parentName: string;
  phone: string;
  childAge: string;
  childGrade: string;
  message: string;
};

const gradeOptions = ["초3", "초4", "초5", "초6", "중1", "중2", "중3"];

const initialFormState: FormState = {
  parentName: "",
  phone: "",
  childAge: "",
  childGrade: "",
  message: "",
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/* ─── Decorative SVG ─── */

function BrandMark() {
  return (
    <div className="relative">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#E8614D" opacity="0.08" />
        <circle cx="24" cy="24" r="16" fill="#E8614D" opacity="0.06" />
        <path d="M18 30 Q24 14 30 30" stroke="#E8614D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <circle cx="24" cy="18" r="3" fill="#E8614D" opacity="0.5" />
        <circle cx="18" cy="28" r="2" fill="#4A5FC1" opacity="0.4" />
        <circle cx="30" cy="28" r="2" fill="#D4A853" opacity="0.4" />
      </svg>
    </div>
  );
}

export default function ConsultationPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const childAge = Number(form.childAge);
    if (!Number.isInteger(childAge) || childAge < 8 || childAge > 16) {
      setError("자녀 나이는 8세부터 16세 사이로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          parentName: form.parentName.trim(),
          phone: form.phone.trim(),
          childAge,
          childGrade: form.childGrade,
          message: form.message.trim() || null,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      if (!response.ok) {
        throw new Error(data?.error?.message ?? "상담 신청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      setIsSubmitted(true);
      setForm(initialFormState);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "상담 신청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh relative overflow-hidden" style={{ background: "#FAFAF8" }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #E8614D, transparent)", top: "-10%", right: "-10%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #4A5FC1, transparent)", bottom: "-5%", left: "-8%" }} />
      </div>

      {/* Top nav */}
      <div className="relative z-10 px-6 pt-5 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ color: "#8A8A9A" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          홈으로
        </Link>
      </div>

      {/* Form card */}
      <div className="relative z-10 px-5 pb-12 flex items-start justify-center" style={{ minHeight: "calc(100dvh - 52px)" }}>
        <div
          className={`w-full max-w-[480px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ paddingTop: "clamp(16px, 4vh, 48px)" }}
        >
          {/* Accent line */}
          <div className="mb-8" style={{ width: 56, height: 3, borderRadius: 2, background: "linear-gradient(90deg, #E8614D, #D4A853)" }} />

          {/* Header */}
          <div className={`mb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}>
            <div className="flex items-center gap-3.5 mb-5">
              <BrandMark />
              <div>
                <p className="text-[12px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#E8614D" }}>
                  TAM 상담 신청
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "#8A8A9A" }}>소요시간 약 1분</p>
              </div>
            </div>
            <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] leading-[1.3]" style={{ color: "#1A1A2E" }}>
              아이의 탐험 여정,
              <br />
              여기서 시작됩니다
            </h1>
            <p className="mt-3.5 text-[15px] leading-[1.75]" style={{ color: "#6B6B7B" }}>
              간단한 정보를 남겨주시면, 아이에게 맞는 탐색 루틴을
              <br className="hidden sm:block" />
              함께 설계하는 상담을 진행해드립니다.
            </p>
          </div>

          {isSubmitted ? (
            /* ─── Success State ─── */
            <div
              className={`rounded-2xl px-6 py-10 text-center transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{
                background: "white",
                border: "1px solid #E8E6E1",
                boxShadow: "0 12px 40px rgba(26,26,46,0.04)",
              }}
            >
              {/* Celebration icon */}
              <div className="mx-auto mb-5 relative" style={{ width: 72, height: 72 }}>
                <div className="absolute inset-0 rounded-full" style={{ background: "#E8614D", opacity: 0.06, animation: "successPulse 2s ease-in-out infinite" }} />
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative">
                  <circle cx="36" cy="36" r="28" fill="#E8614D" opacity="0.08" />
                  <path d="M24 36l8 8 16-16" stroke="#E8614D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Tiny celebration dots */}
                <div className="absolute top-1 left-2 w-2 h-2 rounded-full" style={{ background: "#D4A853", opacity: 0.5, animation: "dotFloat 2.5s ease-in-out infinite" }} />
                <div className="absolute top-3 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "#4A5FC1", opacity: 0.4, animation: "dotFloat 2.5s ease-in-out infinite 0.5s" }} />
                <div className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full" style={{ background: "#E8614D", opacity: 0.3, animation: "dotFloat 2.5s ease-in-out infinite 1s" }} />
              </div>

              <h2 className="text-[20px] font-bold mb-2" style={{ color: "#1A1A2E" }}>
                상담 신청이 완료되었습니다!
              </h2>
              <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "#6B6B7B" }}>
                영업일 기준 1-2일 이내에 연락드리겠습니다.
              </p>

              {/* What to expect */}
              <div className="rounded-xl px-5 py-4 text-left mb-6" style={{ background: "#FAFAF8", border: "1px solid #E8E6E1" }}>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase mb-3" style={{ color: "#D4A853" }}>
                  앞으로의 과정
                </p>
                <div className="space-y-3">
                  {[
                    { num: "1", text: "전화로 아이와 가정의 상황을 함께 이야기합니다" },
                    { num: "2", text: "아이에게 맞는 탐색 루틴을 설계합니다" },
                    { num: "3", text: "체험 계정이 발급되고 탐험이 시작됩니다" },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ background: "#4A5FC108", color: "#4A5FC1", border: "1px solid #4A5FC115" }}>
                        {step.num}
                      </span>
                      <p className="text-[14px] leading-[1.6] pt-0.5" style={{ color: "#4A4A5A" }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors"
                style={{ color: "#E8614D" }}>
                홈으로 돌아가기
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ) : (
            /* ─── Form ─── */
            <form className="space-y-0" onSubmit={handleSubmit}>
              <div
                className={`rounded-2xl overflow-hidden transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{
                  background: "white",
                  border: "1px solid #E8E6E1",
                  boxShadow: "0 12px 40px rgba(26,26,46,0.04)",
                  transitionDelay: "200ms",
                }}
              >
                {/* Top accent */}
                <div style={{ height: 3, background: "linear-gradient(90deg, #E8614D, #D4A853, #4A5FC1)" }} />

                <div className="p-6 sm:p-8">
                  {/* Group 1: Parent info */}
                  <div className="mb-7">
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#8A8A9A" }}>
                      학부모 정보
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="parentName" className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A1A2E" }}>
                          이름
                        </label>
                        <input
                          id="parentName"
                          type="text"
                          required
                          value={form.parentName}
                          onChange={(event) => updateField("parentName", event.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-300"
                          style={{
                            color: "#1A1A2E",
                            background: "#FAFAF8",
                            border: "1.5px solid #E8E6E1",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#E8614D";
                            e.target.style.boxShadow = "0 0 0 3px rgba(232,97,77,0.06)";
                            e.target.style.background = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#E8E6E1";
                            e.target.style.boxShadow = "none";
                            e.target.style.background = "#FAFAF8";
                          }}
                          placeholder="이름을 입력해주세요"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A1A2E" }}>
                          연락처
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(event) => updateField("phone", formatPhone(event.target.value))}
                          className="w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-300"
                          style={{
                            color: "#1A1A2E",
                            background: "#FAFAF8",
                            border: "1.5px solid #E8E6E1",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#E8614D";
                            e.target.style.boxShadow = "0 0 0 3px rgba(232,97,77,0.06)";
                            e.target.style.background = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#E8E6E1";
                            e.target.style.boxShadow = "none";
                            e.target.style.background = "#FAFAF8";
                          }}
                          placeholder="010-0000-0000"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-7" style={{ height: 1, background: "linear-gradient(90deg, transparent, #E8E6E1, transparent)" }} />

                  {/* Group 2: Child info */}
                  <div className="mb-7">
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "#8A8A9A" }}>
                      자녀 정보
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="childAge" className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A1A2E" }}>
                          나이
                        </label>
                        <input
                          id="childAge"
                          type="number"
                          required
                          min={8}
                          max={16}
                          value={form.childAge}
                          onChange={(event) => updateField("childAge", event.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-300"
                          style={{
                            color: "#1A1A2E",
                            background: "#FAFAF8",
                            border: "1.5px solid #E8E6E1",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#E8614D";
                            e.target.style.boxShadow = "0 0 0 3px rgba(232,97,77,0.06)";
                            e.target.style.background = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#E8E6E1";
                            e.target.style.boxShadow = "none";
                            e.target.style.background = "#FAFAF8";
                          }}
                          placeholder="예: 11"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <label htmlFor="childGrade" className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A1A2E" }}>
                          학년
                        </label>
                        <div className="relative">
                          <select
                            id="childGrade"
                            required
                            value={form.childGrade}
                            onChange={(event) => updateField("childGrade", event.target.value)}
                            className="w-full appearance-none rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-300 cursor-pointer"
                            style={{
                              color: form.childGrade ? "#1A1A2E" : "#A3A1A0",
                              background: "#FAFAF8",
                              border: "1.5px solid #E8E6E1",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#E8614D";
                              e.target.style.boxShadow = "0 0 0 3px rgba(232,97,77,0.06)";
                              e.target.style.background = "#FFFFFF";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#E8E6E1";
                              e.target.style.boxShadow = "none";
                              e.target.style.background = "#FAFAF8";
                            }}
                          >
                            <option value="">선택</option>
                            {gradeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {/* Custom dropdown arrow */}
                          <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="#8A8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-7" style={{ height: 1, background: "linear-gradient(90deg, transparent, #E8E6E1, transparent)" }} />

                  {/* Message */}
                  <div className="mb-2">
                    <label htmlFor="message" className="mb-1.5 block text-[13px] font-semibold" style={{ color: "#1A1A2E" }}>
                      하고 싶은 말 <span style={{ color: "#A3A1A0", fontWeight: 400 }}>(선택)</span>
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      className="min-h-[110px] w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-300 resize-none"
                      style={{
                        color: "#1A1A2E",
                        background: "#FAFAF8",
                        border: "1.5px solid #E8E6E1",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#E8614D";
                        e.target.style.boxShadow = "0 0 0 3px rgba(232,97,77,0.06)";
                        e.target.style.background = "#FFFFFF";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E8E6E1";
                        e.target.style.boxShadow = "none";
                        e.target.style.background = "#FAFAF8";
                      }}
                      placeholder="아이의 현재 고민이나 궁금한 점을 자유롭게 남겨주세요."
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error ? (
                <div className="mt-4 rounded-xl px-4 py-3 text-[14px] leading-[1.6]"
                  style={{ background: "#FFF3F0", color: "#B24432", border: "1px solid #FADBD5" }}
                  aria-live="polite">
                  {error}
                </div>
              ) : null}

              {/* Submit area */}
              <div
                className={`mt-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "350ms" }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full text-[16px] font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #E8614D, #D45040)",
                    boxShadow: "0 4px 20px rgba(232,97,77,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.boxShadow = "0 6px 28px rgba(232,97,77,0.35)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,97,77,0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isSubmitting ? "신청 중..." : "상담 신청하기"}
                </button>

                {/* Trust note */}
                <p className="text-center mt-4 text-[12px]" style={{ color: "#A3A1A0" }}>
                  상담 후 체험 계정이 발급됩니다 · 강제 결제 없음
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes successPulse {
          0%, 100% { transform: scale(1); opacity: 0.06; }
          50% { transform: scale(1.15); opacity: 0.03; }
        }
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </main>
  );
}
