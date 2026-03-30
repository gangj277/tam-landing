"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getFamilyMe,
  verifyPin,
  getWeeklyReport,
  getProfile,
  ApiError,
} from "@/lib/api-client";
import type {
  FamilyMe,
  WeeklyReportData,
  ProfileData,
} from "@/lib/api-client";

/* ─── SVG Illustrations ─── */

function ReportHeaderSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="reportBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4A5FC1" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="14" fill="url(#reportBg)" />
      {/* Open book */}
      <path d="M11 14 Q22 10 22 10 Q22 10 33 14 L33 32 Q22 28 22 28 Q22 28 11 32 Z" fill="none" stroke="#4A5FC1" strokeWidth="1.5" opacity="0.5" />
      <line x1="22" y1="10" x2="22" y2="28" stroke="#4A5FC1" strokeWidth="1" opacity="0.3" />
      {/* Text lines */}
      <line x1="14" y1="18" x2="19" y2="17" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="14" y1="21" x2="18" y2="20" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <line x1="14" y1="24" x2="19" y2="23.5" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
      <line x1="25" y1="17" x2="30" y2="18" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="25" y1="20" x2="29" y2="21" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      {/* Star / insight marker */}
      <path d="M22 6 L23 8.5 L25.5 8.5 L23.5 10 L24.3 12.5 L22 11 L19.7 12.5 L20.5 10 L18.5 8.5 L21 8.5 Z" fill="#D4A853" opacity="0.5" />
    </svg>
  );
}

function PatternBadgeSVG({ number }: { number: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#4A5FC1" fillOpacity="0.08" stroke="#4A5FC1" strokeWidth="1.2" strokeOpacity="0.3" />
      <text x="14" y="18" textAnchor="middle" fill="#4A5FC1" fontSize="12" fontWeight="700" opacity="0.7">
        {number}
      </text>
    </svg>
  );
}

function QuoteSVG() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <path
        d="M4 14C4 10.5 6 7.5 10 6L11 8C8.5 9 7.5 10.5 7.5 12H11V18H4V14Z"
        fill="#4A5FC1"
        opacity="0.15"
      />
      <path
        d="M17 14C17 10.5 19 7.5 23 6L24 8C21.5 9 20.5 10.5 20.5 12H24V18H17V14Z"
        fill="#4A5FC1"
        opacity="0.15"
      />
    </svg>
  );
}

function DownloadSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14V15C3 15.5523 3.44772 16 4 16H14C14.5523 16 15 15.5523 15 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendArrowSVG({ trend }: { trend: string }) {
  if (trend === "up") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 10 L7 4 L11 10" fill="none" stroke="#4AAF7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === "stable") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <line x1="2" y1="7" x2="12" y2="7" stroke="#D4A853" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 9 Q5 3 7 7 Q9 11 12 5" fill="none" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" fill="#4A5FC1" opacity="0.5" />
    </svg>
  );
}

function WorldTagSVG() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="6" cy="6" rx="2.5" ry="5" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

const BAR_COLORS = ["#E8614D", "#4A5FC1", "#D4A853", "#6B8F71", "#7C6FAF", "#E09145", "#5B9EA6"];

/* ─── PIN Entry Screen ─── */

function PinEntryScreen({
  onVerified,
  authError,
}: {
  onVerified: () => void;
  authError: string | null;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newPin = pin.split("");
      newPin[index] = value.slice(-1);
      const joined = newPin.join("").slice(0, 4);
      setPin(joined);
      setError(null);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when 4 digits entered
      if (joined.length === 4) {
        submitPin(joined);
      }
    },
    [pin],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [pin],
  );

  async function submitPin(pinValue: string) {
    setVerifying(true);
    setError(null);
    try {
      const res = await verifyPin(pinValue);
      if (res.verified) {
        onVerified();
      } else {
        setError("비밀번호가 맞지 않아요");
        setPin("");
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("로그인이 필요해요");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("비밀번호가 맞지 않아요");
      } else {
        setError("확인 중 문제가 발생했어요");
      }
      setPin("");
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-bg-cream flex flex-col items-center justify-center px-6">
        <div className="text-[48px] mb-4">🔒</div>
        <p className="text-[16px] font-bold text-navy mb-2">{authError}</p>
        <p className="text-[13px] text-text-muted text-center">
          탐험 리포트를 보려면 먼저 로그인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs">
        {/* Lock icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-card-bg border border-border-light shadow-sm flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="12" width="20" height="13" rx="3.5" fill="#1A1A2E" opacity="0.08" stroke="#1A1A2E" strokeWidth="1.2" strokeOpacity="0.25" />
              <path
                d="M8 12V9C8 5.69 10.69 3 14 3C17.31 3 20 5.69 20 9V12"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />
              <circle cx="14" cy="18.5" r="2" fill="#1A1A2E" opacity="0.2" />
              <line x1="14" y1="20" x2="14" y2="22" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
            </svg>
          </div>
        </div>

        <h1 className="text-[20px] font-bold text-navy text-center mb-1">
          부모님 비밀번호를 입력해주세요
        </h1>
        <p className="text-[13px] text-text-muted text-center mb-8">
          4자리 숫자를 입력해주세요
        </p>

        {/* PIN inputs */}
        <div className="flex justify-center gap-3 mb-5">
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={pin[i] || ""}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={verifying}
              className="w-14 h-14 text-center text-[24px] font-bold text-navy bg-card-bg border-2 border-border-light rounded-xl focus:border-coral focus:outline-none transition-colors disabled:opacity-50"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-[13px] text-coral text-center mb-4 animate-fade-in-up">
            {error}
          </p>
        )}

        {/* Loading state */}
        {verifying && (
          <p className="text-[13px] text-text-muted text-center animate-pulse">
            확인 중...
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */

function ReportSkeleton() {
  return (
    <div className="px-5 pt-14 pb-6 animate-pulse">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 bg-bg-warm rounded-[14px]" />
        <div>
          <div className="h-5 w-40 bg-bg-warm rounded mb-1" />
          <div className="h-3 w-28 bg-bg-warm rounded" />
        </div>
      </div>
      <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light mb-6">
        <div className="h-4 w-20 bg-bg-warm rounded mb-4" />
        <div className="flex gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-7 w-12 bg-bg-warm rounded mx-auto mb-1" />
              <div className="h-3 w-14 bg-bg-warm rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card-bg rounded-2xl px-4 py-4 border border-border-light mb-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-bg-warm rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-48 bg-bg-warm rounded mb-2" />
              <div className="h-3 w-full bg-bg-warm rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Dashboard Component ─── */

function ParentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const barSectionRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [childName, setChildName] = useState("");
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileData["stats"] | null>(null);

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      try {
        const family = await getFamilyMe();
        setChildName(family.activeChild.name);

        const [reportRes, profileRes] = await Promise.all([
          getWeeklyReport(family.activeChildId),
          getProfile(family.activeChildId),
        ]);

        setReport(reportRes.report);
        setProfileStats(profileRes.profile.stats);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError("로그인이 필요해요");
        } else {
          setError("리포트를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!barSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = barSectionRef.current;
    observer.observe(currentRef);
    return () => {
      observer.unobserve(currentRef);
    };
  }, [loading]);

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-[48px] mb-4">😢</div>
        <p className="text-[16px] font-bold text-navy mb-2">{error}</p>
        <p className="text-[13px] text-text-muted text-center">
          네트워크 연결을 확인하고 다시 시도해주세요.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[16px] font-bold text-navy mb-2">리포트를 준비 중이에요</p>
        <p className="text-[13px] text-text-muted">아직 이번 주 리포트가 생성되지 않았어요.</p>
      </div>
    );
  }

  // Format week range for display
  const weekLabel = report.weekStart
    ? `${report.weekStart.slice(0, 4)}년 ${report.weekStart.slice(5, 7)}월 ${report.weekStart.slice(8)}일 주차`
    : "";

  const deltaLabels: Record<string, string> = {
    up: report.interestChanges?.[0]?.delta !== undefined ? `+${Math.abs(report.interestChanges[0].delta)}` : "+7",
    stable: "유지",
    exploring: "탐색 중",
  };

  return (
    <div className="page-enter px-5 pt-14 pb-6">
      {/* ── Header ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <ReportHeaderSVG />
          <div>
            <h1 className="text-[20px] font-bold text-navy tracking-tight">
              {childName}의 탐험 리포트
            </h1>
            <p className="text-[12px] text-text-muted">
              {weekLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Weekly Summary Card ── */}
      <div
        className={`mb-6 ${mounted ? "animate-fade-in-up delay-100" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light shadow-sm">
          <h2 className="text-[14px] font-bold text-navy mb-4">
            이번 주 요약
          </h2>

          {/* Stats row */}
          <div className="flex gap-4 mb-4">
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-indigo">{report.summary.missionsCompleted}</p>
              <p className="text-[11px] text-text-muted">미션 완료</p>
            </div>
            <div className="w-[1px] bg-border-light" />
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-coral">{report.summary.totalMinutes}분</p>
              <p className="text-[11px] text-text-muted">총 탐험 시간</p>
            </div>
            <div className="w-[1px] bg-border-light" />
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-gold">{report.summary.streak}일</p>
              <p className="text-[11px] text-text-muted">연속 참여</p>
            </div>
          </div>

          {/* Explored worlds tags */}
          {report.summary.worldsExplored.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-text-muted mb-2">탐험한 세계</p>
              <div className="flex flex-wrap gap-1.5">
                {report.summary.worldsExplored.map((world) => (
                  <span
                    key={world}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo bg-indigo-light px-2.5 py-1 rounded-lg"
                  >
                    <WorldTagSVG />
                    {world}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Discovered Patterns ── */}
      {report.patterns.length > 0 && (
        <div
          className={`mb-6 ${mounted ? "animate-fade-in-up delay-200" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            발견된 패턴
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            {childName}의 선택과 대화에서 관찰된 특성입니다
          </p>

          <div className="flex flex-col gap-3">
            {report.patterns.map((pattern, idx) => {
              const patternColor = BAR_COLORS[idx % BAR_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`bg-card-bg rounded-2xl px-4 py-4 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                  style={{
                    animationDelay: `${300 + idx * 120}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <PatternBadgeSVG number={idx + 1} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-navy leading-snug mb-1.5">
                        {pattern.title}
                      </p>
                      <p className="text-[12px] text-text-secondary leading-relaxed mb-2">
                        {pattern.detail}
                      </p>
                      {pattern.stat && (
                        <span
                          className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          style={{
                            background: `${patternColor}12`,
                            color: patternColor,
                          }}
                        >
                          {pattern.stat}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Interest Area Changes ── */}
      {report.interestChanges.length > 0 && (
        <div
          ref={barSectionRef}
          className={`mb-6 ${mounted ? "animate-fade-in-up delay-500" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            관심 영역 변화
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            지난주 대비 {childName}의 관심 영역 변화입니다
          </p>

          <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light shadow-sm">
            <div className="flex flex-col gap-5">
              {report.interestChanges.map((area, idx) => {
                const trendDeltaLabel =
                  area.trend === "up"
                    ? `+${Math.abs(area.delta)}`
                    : area.trend === "stable"
                      ? "유지"
                      : "탐색 중";

                return (
                  <div key={area.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-navy">
                        {area.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: area.trend === "up"
                              ? "#E8F5E9"
                              : area.trend === "stable"
                                ? "#FFF8E1"
                                : "#EEF0F9",
                            color: area.trend === "up"
                              ? "#4AAF7A"
                              : area.trend === "stable"
                                ? "#D4A853"
                                : "#4A5FC1",
                          }}
                        >
                          {trendDeltaLabel}
                        </span>
                        <TrendArrowSVG trend={area.trend} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-bg-warm rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: barsVisible ? `${area.currentScore}%` : "0%",
                            background: BAR_COLORS[idx % BAR_COLORS.length],
                            transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 150}ms`,
                            opacity: 0.75,
                          }}
                        />
                      </div>
                      <span
                        className="text-[13px] font-bold w-10 text-right"
                        style={{ color: BAR_COLORS[idx % BAR_COLORS.length] }}
                      >
                        {area.currentScore}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Guide Comment ── */}
      {report.guideComment && (
        <div
          className={`mb-7 ${mounted ? "animate-fade-in-up delay-600" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-3">
            가이드의 관찰
          </h2>

          <div className="relative bg-indigo-light rounded-2xl px-5 py-5 border border-border-light shadow-sm overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="80" cy="0" r="60" fill="#4A5FC1" />
              </svg>
            </div>

            <div className="mb-3">
              <QuoteSVG />
            </div>

            <p className="text-[13px] text-navy leading-[1.8] relative z-10">
              {report.guideComment}
            </p>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-light">
              <div className="w-7 h-7 rounded-full bg-indigo flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1 L8.5 5 L13 5.5 L9.5 8.5 L10.5 13 L7 10.5 L3.5 13 L4.5 8.5 L1 5.5 L5.5 5 Z" fill="#FFF" opacity="0.9" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-indigo">TAM 가이드</p>
                <p className="text-[10px] text-text-muted">{childName}의 AI 탐험 동반자</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Actions ── */}
      <div
        className={`flex gap-3 ${mounted ? "animate-fade-in-up delay-700" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <button className="flex-1 flex items-center justify-center gap-2 bg-card-bg text-text-secondary font-semibold text-[13px] py-3.5 rounded-xl border border-border-light shadow-sm active:bg-bg-warm transition-colors tap-highlight">
          <ChevronLeftSVG />
          이전 주 보기
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-card-bg text-text-secondary font-semibold text-[13px] py-3.5 rounded-xl border border-border-light shadow-sm active:bg-bg-warm transition-colors tap-highlight">
          <DownloadSVG />
          PDF 다운로드
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page Component ─── */

export default function ParentPage() {
  const [pinVerified, setPinVerified] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check auth on mount - if not logged in, show that error on the PIN screen
  useEffect(() => {
    async function checkAuth() {
      try {
        await getFamilyMe();
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setAuthError("로그인이 필요해요");
        }
      }
    }
    checkAuth();
  }, []);

  if (!pinVerified) {
    return (
      <PinEntryScreen
        onVerified={() => setPinVerified(true)}
        authError={authError}
      />
    );
  }

  return <ParentDashboard />;
}
