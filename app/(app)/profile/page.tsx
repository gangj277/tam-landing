"use client";

import { useState, useEffect, useRef } from "react";
import {
  getFamilyMe,
  getProfile,
  getPortfolio,
  listSessions,
  ApiError,
} from "@/lib/api-client";
import type { ProfileData, PastSessionItem, PortfolioEntry } from "@/lib/api-client";
import type { MissionCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

/* ─── SVG Icons for Discovery Insights ─── */

function WorldPreferenceSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="globeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" />
          <stop offset="100%" stopColor="#7B8FE0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#globeGrad)" opacity="0.12" />
      <circle cx="16" cy="16" r="11" stroke="#4A5FC1" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="16" cy="16" rx="6" ry="11" stroke="#4A5FC1" strokeWidth="1" opacity="0.4" />
      <path d="M5 16 Q16 12 27 16" fill="none" stroke="#4A5FC1" strokeWidth="1" opacity="0.4" />
      <path d="M5.5 11 Q16 8 26.5 11" fill="none" stroke="#4A5FC1" strokeWidth="0.7" opacity="0.3" />
      <path d="M5.5 21 Q16 18 26.5 21" fill="none" stroke="#4A5FC1" strokeWidth="0.7" opacity="0.3" />
      {/* Small houses */}
      <rect x="12" y="11" width="3" height="3" rx="0.5" fill="#4A5FC1" opacity="0.5" />
      <path d="M12 11 L13.5 9 L15 11" fill="#4A5FC1" opacity="0.4" />
      <rect x="18" y="18" width="2.5" height="2.5" rx="0.4" fill="#4A5FC1" opacity="0.4" />
      <circle cx="10" cy="18" r="1.2" fill="#5BBF8A" opacity="0.5" />
      <circle cx="22" cy="13" r="1" fill="#5BBF8A" opacity="0.4" />
    </svg>
  );
}

function ValueOrientationSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="scaleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8614D" />
          <stop offset="100%" stopColor="#F09070" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#scaleGrad)" opacity="0.1" />
      {/* Balance beam */}
      <line x1="16" y1="6" x2="16" y2="26" stroke="#E8614D" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="7" y1="12" x2="25" y2="12" stroke="#E8614D" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      {/* Left pan */}
      <path d="M7 12 L5 18 Q8.5 20 12 18 L10 12" fill="#E8614D" fillOpacity="0.15" stroke="#E8614D" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Right pan - slightly higher (fairness wins) */}
      <path d="M22 12 L20 17 Q23.5 19 27 17 L25 12" fill="#E8614D" fillOpacity="0.1" stroke="#E8614D" strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Heart on left pan */}
      <path d="M8 15.5 C8 14.5 9 13.5 9.5 14.5 C10 13.5 11 14.5 11 15.5 C11 17 9.5 17.5 9.5 17.5 C9.5 17.5 8 17 8 15.5Z" fill="#E8614D" opacity="0.6" />
      {/* Base */}
      <path d="M12 26 L20 26" stroke="#E8614D" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <circle cx="16" cy="12" r="1.5" fill="#E8614D" opacity="0.5" />
    </svg>
  );
}

function RoleEnergySVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#D4A853" />
          <stop offset="100%" stopColor="#E8C97A" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#boltGrad)" opacity="0.1" />
      {/* Lightning bolt */}
      <path
        d="M18 4 L11 17 L15 17 L13 28 L22 14 L17.5 14 L20 4 Z"
        fill="url(#boltGrad)"
        opacity="0.7"
        stroke="#D4A853"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Glow */}
      <ellipse cx="16" cy="16" rx="6" ry="8" fill="#D4A853" opacity="0.06" />
      {/* Sparkles */}
      <circle cx="8" cy="10" r="1" fill="#D4A853" opacity="0.4" />
      <circle cx="24" cy="22" r="0.8" fill="#D4A853" opacity="0.3" />
      <line x1="6" y1="20" x2="8" y2="19" stroke="#D4A853" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="25" y1="10" x2="27" y2="9" stroke="#D4A853" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function DecisionStyleSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="targetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" />
          <stop offset="100%" stopColor="#6B7FD7" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#targetGrad)" opacity="0.08" />
      <circle cx="16" cy="16" r="11" stroke="#4A5FC1" strokeWidth="1" opacity="0.2" />
      <circle cx="16" cy="16" r="7.5" stroke="#4A5FC1" strokeWidth="1" opacity="0.3" />
      <circle cx="16" cy="16" r="4" stroke="#4A5FC1" strokeWidth="1.2" opacity="0.5" />
      <circle cx="16" cy="16" r="1.8" fill="#4A5FC1" opacity="0.7" />
      {/* Arrow hitting center */}
      <line x1="24" y1="8" x2="17" y2="15" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 8 L21.5 8.5 L23.5 10.5 Z" fill="#E8614D" opacity="0.8" />
      {/* Impact lines */}
      <line x1="14" y1="14" x2="12" y2="12" stroke="#4A5FC1" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
      <line x1="13.5" y1="16" x2="11" y2="16" stroke="#4A5FC1" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

function TonePreferenceSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="maskGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8614D" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#maskGrad)" opacity="0.08" />
      {/* Theater mask - serious side */}
      <path
        d="M8 10 C8 10 10 8 16 8 C22 8 24 10 24 10 L24 18 C24 22 20 26 16 26 C12 26 8 22 8 18 Z"
        fill="none"
        stroke="#E8614D"
        strokeWidth="1.3"
        opacity="0.5"
      />
      {/* Eyes - deep / thoughtful */}
      <ellipse cx="12.5" cy="15" rx="2" ry="1.3" fill="#E8614D" opacity="0.4" />
      <ellipse cx="19.5" cy="15" rx="2" ry="1.3" fill="#E8614D" opacity="0.4" />
      {/* Thoughtful straight mouth */}
      <path d="M12 21 Q16 20 20 21" fill="none" stroke="#E8614D" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      {/* Deep thought lines */}
      <line x1="10" y1="12" x2="14" y2="12.5" stroke="#E8614D" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
      <line x1="18" y1="12.5" x2="22" y2="12" stroke="#E8614D" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
      {/* Book/depth symbol */}
      <rect x="4" y="24" width="5" height="4" rx="0.5" fill="#D4A853" opacity="0.3" />
      <line x1="5" y1="25" x2="8" y2="25" stroke="#D4A853" strokeWidth="0.5" opacity="0.5" />
      <line x1="5" y1="26.2" x2="7.5" y2="26.2" stroke="#D4A853" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

const INSIGHT_ICONS: Record<string, () => React.ReactElement> = {
  "끌리는 세계": WorldPreferenceSVG,
  "중요하게 여기는 것": ValueOrientationSVG,
  "에너지가 생기는 역할": RoleEnergySVG,
  "결정하는 방식": DecisionStyleSVG,
  "선호하는 분위기": TonePreferenceSVG,
};

const INSIGHT_BORDER_COLORS: Record<string, string> = {
  "끌리는 세계": "#4A5FC1",
  "중요하게 여기는 것": "#E8614D",
  "에너지가 생기는 역할": "#D4A853",
  "결정하는 방식": "#4A5FC1",
  "선호하는 분위기": "#E8614D",
};

function ConfidenceBar({ confidence }: { confidence: string }) {
  const levels: Record<string, number> = { low: 1, medium: 2, high: 3 };
  const level = levels[confidence] ?? 1;
  const labels: Record<string, string> = { low: "탐색 중", medium: "윤곽이 보여요", high: "꽤 확실해요" };

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i <= level ? "16px" : "8px",
              background: i <= level ? "#4A5FC1" : "#E8E6E1",
              opacity: i <= level ? 0.7 : 0.4,
            }}
          />
        ))}
      </div>
      <span className="text-[10px] text-text-muted">{labels[confidence] ?? "탐색 중"}</span>
    </div>
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
  // exploring
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 9 Q5 3 7 7 Q9 11 12 5" fill="none" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" fill="#4A5FC1" opacity="0.5" />
    </svg>
  );
}

const TREND_LABELS: Record<string, string> = {
  up: "상승",
  stable: "유지",
  exploring: "탐색 중",
};

const BAR_COLORS = ["#E8614D", "#4A5FC1", "#D4A853", "#6B8F71", "#7C6FAF", "#E09145", "#5B9EA6"];

/* ─── Stats Icons ─── */

function MissionCountSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" rx="2.5" fill="#4A5FC1" fillOpacity="0.12" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M7 7L9 9L13 5" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <line x1="7" y1="12" x2="13" y2="12" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="7" y1="14.5" x2="11" y2="14.5" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

function ClockSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill="#D4A853" fillOpacity="0.1" stroke="#D4A853" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M10 5V10L13 12" stroke="#D4A853" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

/* ─── Loading Skeleton ─── */

function ProfileSkeleton() {
  return (
    <div className="px-5 pt-14 pb-6 animate-pulse">
      <div className="mb-7">
        <div className="h-6 w-40 bg-bg-warm rounded mb-2" />
        <div className="h-3 w-52 bg-bg-warm rounded mb-4" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 bg-card-bg rounded-2xl px-4 py-3 border border-border-light text-center">
              <div className="h-5 w-5 bg-bg-warm rounded mx-auto mb-1.5" />
              <div className="h-6 w-10 bg-bg-warm rounded mx-auto mb-1" />
              <div className="h-3 w-12 bg-bg-warm rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <div className="h-5 w-36 bg-bg-warm rounded mb-2" />
        <div className="h-3 w-52 bg-bg-warm rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card-bg rounded-2xl px-4 py-4 border border-border-light mb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-bg-warm rounded" />
              <div className="flex-1">
                <div className="h-4 w-28 bg-bg-warm rounded mb-2" />
                <div className="h-3 w-full bg-bg-warm rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Discovery Insight type (from API) ─── */

interface DiscoveryInsight {
  label: string;
  summary: string;
  dataPoints: number;
  confidence: string;
  icon: string;
}

/* ─── Portfolio SVG Icons ─── */

function PortfolioEntrySVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" />
          <stop offset="100%" stopColor="#7B8FE0" />
        </linearGradient>
      </defs>
      <rect x="5" y="3" width="22" height="26" rx="3" fill="url(#portfolioGrad)" opacity="0.12" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="8" y="3" width="19" height="26" rx="2.5" fill="url(#portfolioGrad)" opacity="0.06" />
      <line x1="8" y1="3" x2="8" y2="29" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.25" />
      {/* Page lines */}
      <line x1="12" y1="10" x2="23" y2="10" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="12" y1="14" x2="21" y2="14" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="12" y1="18" x2="23" y2="18" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="12" y1="22" x2="19" y2="22" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.2" strokeLinecap="round" />
      {/* Pen */}
      <path d="M22 20 L26 24 L24.5 25.5 L20.5 21.5 Z" fill="#E8614D" opacity="0.5" />
      <path d="M20.5 21.5 L19.5 25 L22 23.5 Z" fill="#E8614D" opacity="0.35" />
    </svg>
  );
}

function PortfolioEmptySVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="emptyBookGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" />
          <stop offset="100%" stopColor="#7B8FE0" />
        </linearGradient>
      </defs>
      <rect x="12" y="8" width="40" height="48" rx="5" fill="url(#emptyBookGrad)" opacity="0.08" stroke="#4A5FC1" strokeWidth="1.2" strokeOpacity="0.25" />
      <rect x="17" y="8" width="35" height="48" rx="4" fill="url(#emptyBookGrad)" opacity="0.04" />
      <line x1="17" y1="8" x2="17" y2="56" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.15" />
      {/* Dotted lines placeholder */}
      <line x1="24" y1="24" x2="40" y2="24" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3" strokeLinecap="round" />
      <line x1="24" y1="30" x2="37" y2="30" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="3 3" strokeLinecap="round" />
      <line x1="24" y1="36" x2="40" y2="36" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="3 3" strokeLinecap="round" />
      <line x1="24" y1="42" x2="34" y2="42" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="3 3" strokeLinecap="round" />
      {/* Plus icon */}
      <circle cx="48" cy="48" r="8" fill="#4A5FC1" opacity="0.1" />
      <line x1="44" y1="48" x2="52" y2="48" stroke="#4A5FC1" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="48" y1="44" x2="48" y2="52" stroke="#4A5FC1" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Component ─── */

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const barSectionRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [childName, setChildName] = useState("");
  const [sessions, setSessions] = useState<PastSessionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"discovery" | "portfolio">("discovery");
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioEntry[]>([]);

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      try {
        const family = await getFamilyMe();
        setChildName(family.activeChild.name);

        const [profileRes, sessionsRes, portfolioRes] = await Promise.all([
          getProfile(family.activeChildId),
          listSessions(10),
          getPortfolio(family.activeChildId).catch(() => ({ childId: family.activeChildId, entries: [] })),
        ]);

        setProfile(profileRes.profile);
        setSessions(sessionsRes.sessions);
        setPortfolioEntries(portfolioRes.entries);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError("로그인이 필요해요");
        } else {
          setError("데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
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
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-[48px] mb-4">
          {error === "로그인이 필요해요" ? "🔒" : "😢"}
        </div>
        <p className="text-[16px] font-bold text-navy mb-2">{error}</p>
        <p className="text-[13px] text-text-muted text-center">
          {error === "로그인이 필요해요"
            ? "탐험 기록을 보려면 먼저 로그인해주세요."
            : "네트워크 연결을 확인하고 다시 시도해주세요."}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[16px] font-bold text-navy mb-2">프로필을 준비 중이에요</p>
        <p className="text-[13px] text-text-muted">잠시만 기다려주세요.</p>
      </div>
    );
  }

  const discoveries = Object.values(profile.discoveries) as DiscoveryInsight[];
  const totalDays = profile.stats.totalMissions;

  return (
    <div className="page-enter px-5 pt-14 pb-6">
      {/* ── Header ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <h1 className="text-[22px] font-bold text-navy tracking-tight mb-1">
          {childName}의 탐험 기록
        </h1>
        <p className="text-[13px] text-text-muted">
          {totalDays}일간의 여정에서 발견한 것들
        </p>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-card-bg rounded-2xl px-4 py-3 border border-border-light shadow-sm text-center">
            <div className="flex justify-center mb-1.5">
              <MissionCountSVG />
            </div>
            <p className="text-[20px] font-bold text-navy">{profile.stats.totalMissions}</p>
            <p className="text-[10px] text-text-muted">완료 미션</p>
          </div>
          <div className="flex-1 bg-card-bg rounded-2xl px-4 py-3 border border-border-light shadow-sm text-center">
            <div className="flex justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2 C10 2 4 7 4 12c0 3.3 2.7 6 6 6s6-2.7 6-6C16 7 10 2 10 2z" fill="#E8614D" fillOpacity="0.12" stroke="#E8614D" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M10 8c0 0-2.5 2.5-2.5 5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-2.5-2.5-5-2.5-5z" fill="#E8614D" opacity="0.2" />
              </svg>
            </div>
            <p className="text-[20px] font-bold text-navy">{profile.stats.currentStreak}일</p>
            <p className="text-[10px] text-text-muted">연속 탐험</p>
          </div>
          <div className="flex-1 bg-card-bg rounded-2xl px-4 py-3 border border-border-light shadow-sm text-center">
            <div className="flex justify-center mb-1.5">
              <ClockSVG />
            </div>
            <p className="text-[20px] font-bold text-navy">{profile.stats.totalMinutes}분</p>
            <p className="text-[10px] text-text-muted">총 탐험 시간</p>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div
        className={`flex gap-0 mb-6 ${mounted ? "animate-fade-in-up delay-100" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <button
          onClick={() => setActiveTab("discovery")}
          className="flex-1 pb-2.5 text-[14px] font-semibold text-center transition-colors relative"
          style={{ color: activeTab === "discovery" ? "#E8614D" : "#8A8A9A" }}
        >
          발견 기록
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all"
            style={{
              width: activeTab === "discovery" ? "40px" : "0px",
              background: "#E8614D",
            }}
          />
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          className="flex-1 pb-2.5 text-[14px] font-semibold text-center transition-colors relative"
          style={{ color: activeTab === "portfolio" ? "#E8614D" : "#8A8A9A" }}
        >
          포트폴리오
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all"
            style={{
              width: activeTab === "portfolio" ? "40px" : "0px",
              background: "#E8614D",
            }}
          />
        </button>
      </div>

      {/* ── Discovery Tab Content ── */}
      {activeTab === "discovery" && (
      <>

      {/* ── Discovery Insights ── */}
      {discoveries.length > 0 && (
        <div
          className={`mb-8 ${mounted ? "animate-fade-in-up delay-200" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            나는 이런 사람인 것 같아
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            탐험하면서 조금씩 보이기 시작한 나의 모습
          </p>

          <div className="flex flex-col gap-3">
            {discoveries.map((insight, idx) => {
              const IconComponent = INSIGHT_ICONS[insight.label] || WorldPreferenceSVG;
              const borderColor = INSIGHT_BORDER_COLORS[insight.label] || "#4A5FC1";

              return (
                <div
                  key={insight.label}
                  className={`bg-card-bg rounded-2xl px-4 py-4 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                  style={{
                    borderLeft: `3px solid ${borderColor}`,
                    animationDelay: `${300 + idx * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <IconComponent />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-navy mb-0.5">
                        {insight.label}
                      </p>
                      <p className="text-[12px] text-text-secondary leading-relaxed">
                        {insight.summary}
                      </p>
                      <ConfidenceBar confidence={insight.confidence} />
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0 mt-1 bg-bg-warm px-1.5 py-0.5 rounded">
                      {insight.dataPoints}회
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Interest Map ── */}
      {profile.interestMap.length > 0 && (
        <div
          ref={barSectionRef}
          className={`mb-8 ${mounted ? "animate-fade-in-up delay-500" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            관심 영역 지도
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            어떤 분야에 끌리는지 점점 그림이 그려지고 있어
          </p>

          <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light shadow-sm">
            <div className="flex flex-col gap-5">
              {profile.interestMap.map((area, idx) => (
                <div key={area.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-navy">
                      {area.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <TrendArrowSVG trend={area.trend} />
                      <span className="text-[11px] text-text-muted">
                        {TREND_LABELS[area.trend] ?? area.trend}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-bg-warm rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: barsVisible ? `${area.score}%` : "0%",
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
                      {area.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Explorations Timeline ── */}
      {sessions.length > 0 && (
        <div
          className={`${mounted ? "animate-fade-in-up delay-600" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            최근 탐험 기록
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            지금까지의 발자취
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[1.5px] bg-border-light" />

            <div className="flex flex-col gap-0">
              {sessions.map((session, idx) => {
                const sessCategoryMeta = CATEGORY_META[session.category as MissionCategory];
                return (
                  <div
                    key={session.sessionId}
                    className={`relative flex items-start gap-4 py-3.5 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                    style={{
                      animationDelay: `${700 + idx * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="relative z-10 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center shrink-0 bg-card-bg"
                      style={{ borderColor: sessCategoryMeta.color }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: sessCategoryMeta.color, opacity: 0.7 }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 -mt-0.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-navy truncate">
                          {session.missionTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mb-1">
                        {session.choiceSummary}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                          style={{
                            background: sessCategoryMeta.lightBg,
                            color: sessCategoryMeta.color,
                          }}
                        >
                          {sessCategoryMeta.label}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {session.completedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      </>
      )}

      {/* ── Portfolio Tab Content ── */}
      {activeTab === "portfolio" && (
        <div
          className={`${mounted ? "animate-fade-in-up" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <h2 className="text-[15px] font-bold text-navy mb-1">
            나의 탐구 포트폴리오
          </h2>

          {portfolioEntries.length > 0 ? (
            <>
              <p className="text-[12px] text-text-muted mb-5">
                {portfolioEntries.length}개의 기록을 모았어
              </p>

              <div className="flex flex-col gap-3">
                {portfolioEntries.map((entry, idx) => (
                  <div
                    key={entry.deepDiveId}
                    className={`bg-card-bg rounded-2xl px-4 py-4 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                    style={{
                      borderLeft: "3px solid #4A5FC1",
                      animationDelay: `${100 + idx * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <PortfolioEntrySVG />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-text-muted mb-0.5">
                          미션: {entry.missionTitle}
                        </p>
                        <p className="text-[13px] font-bold text-navy mb-2">
                          {entry.title}
                        </p>

                        <div className="h-px bg-border-light mb-2" />

                        <p className="text-[13px] text-text-secondary leading-relaxed italic">
                          &ldquo;{entry.portfolioEntry}&rdquo;
                        </p>

                        <p className="text-[10px] text-text-muted mt-2">
                          {entry.completedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 flex flex-col items-center text-center">
              <div className="mb-4">
                <PortfolioEmptySVG />
              </div>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                아직 포트폴리오가 없어.
              </p>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                딥다이브를 완료하면 여기에 기록이 쌓여!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
