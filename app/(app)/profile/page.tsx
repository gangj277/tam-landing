"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFamilyMe,
  getProfile,
  listSessions,
  ApiError,
} from "@/lib/api-client";
import type { ProfileData, PastSessionItem } from "@/lib/api-client";
import type { MissionCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { EXPERT_AVAILABLE_MISSION_IDS, HARDCODED_DEEP_DIVES } from "@/lib/dummy-data";

/* ─── Tiny SVG icons ─── */

const IconReview = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 5.5L3.5 8L9 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconExpert = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="3.5" r="2" stroke="#4A5FC1" strokeWidth="1.2" />
    <path d="M1.5 9C1.5 7 3 5.5 5 5.5S8.5 7 8.5 9" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const STAT_ICONS: Record<string, React.ReactNode> = {
  missions: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="#4A5FC1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  streak: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H14L11 9L12.5 14L8 11L3.5 14L5 9L2 6H6L8 1Z" fill="#E8614D" opacity="0.85" /></svg>,
  time: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#D4A853" strokeWidth="1.5" /><path d="M8 4.5V8L10.5 10" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" /></svg>,
};

/* ─── Path Node ─── */

function PathNode({ session, index, total, mounted }: {
  session: PastSessionItem; index: number; total: number; mounted: boolean;
}) {
  const meta = CATEGORY_META[session.category as MissionCategory];
  const color = meta?.color ?? "#4A5FC1";
  const isLeft = index % 2 === 0;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const hasExpert = EXPERT_AVAILABLE_MISSION_IDS.has(session.missionId);
  const expert = hasExpert
    ? HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === session.missionId)
    : null;
  const dateStr = session.completedAt
    ? `${session.completedAt.slice(5, 7)}/${session.completedAt.slice(8, 10)}`
    : "";
  const nodeDelay = 250 + index * 120;

  return (
    <div className="relative">
      {!isFirst && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-[2px] h-5"
          style={{ background: `linear-gradient(to bottom, ${color}40, ${color}18)` }} />
      )}
      <div className={`flex items-start gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {/* Card */}
        <div
          className={`flex-1 ${isLeft ? "pr-4" : "pl-4"} ${mounted ? (isLeft ? "path-node-left" : "path-node-right") : "opacity-0"}`}
          style={{ maxWidth: "calc(50% - 20px)", animationDelay: `${nodeDelay + 80}ms` }}
        >
          <div
            className="relative rounded-2xl px-3.5 py-3 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #FFFFFF 0%, ${meta?.lightBg ?? "#EEF0F9"}44 100%)`,
              boxShadow: `0 2px 12px ${color}10, 0 1px 3px rgba(0,0,0,0.04)`,
              borderLeft: isLeft ? "none" : `3px solid ${color}`,
              borderRight: isLeft ? `3px solid ${color}` : "none",
            }}
          >
            {/* Decorative corner dots */}
            <div className="absolute top-2 opacity-[0.08]" style={{ [isLeft ? "left" : "right"]: 6 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
                <circle cx="3" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" /><circle cx="3" cy="11" r="1.5" />
              </svg>
            </div>
            {/* Category + date */}
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-[10px] font-bold px-2.5 py-[3px] rounded-full tracking-wide uppercase"
                style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)`, color, border: `1px solid ${color}20` }}>
                {meta?.label ?? session.category}
              </span>
              <span className="text-[10px] font-medium tabular-nums" style={{ color: `${color}88` }}>{dateStr}</span>
            </div>
            <p className="text-[13px] font-bold text-navy leading-snug mb-1 relative z-10">{session.missionTitle}</p>
            <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 mb-2.5 relative z-10">{session.choiceSummary}</p>
            {/* Action links */}
            <div className="flex flex-wrap gap-1.5 relative z-10">
              <Link href={`/mission/${session.missionId}/mirror`}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg tap-highlight active:scale-[0.96] transition-all"
                style={{ background: `linear-gradient(135deg, ${color}14, ${color}08)`, color, border: `1px solid ${color}12` }}>
                <IconReview color={color} />돌아보기
              </Link>
              {expert && (
                <Link href={`/mission/${session.missionId}/deepdive?session=${session.sessionId}`}
                  className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg tap-highlight active:scale-[0.96] transition-all"
                  style={{ background: "linear-gradient(135deg, #4A5FC114, #4A5FC108)", color: "#4A5FC1", border: "1px solid #4A5FC112" }}>
                  <IconExpert />{expert.expert.name}
                </Link>
              )}
            </div>
            {/* Arrow pointer toward center */}
            <div className={`absolute top-5 ${isLeft ? "-right-[7px]" : "-left-[7px]"} w-3.5 h-3.5 rotate-45`}
              style={{
                background: isLeft ? "linear-gradient(135deg, transparent 50%, #FFFFFF 50%)" : "linear-gradient(315deg, transparent 50%, #FFFFFF 50%)",
                boxShadow: isLeft ? `2px 2px 4px ${color}08` : `-2px -2px 4px ${color}08`,
              }} />
          </div>
        </div>

        {/* Center node */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
          <div className="relative">
            {isFirst && <div className="absolute inset-0 rounded-full path-ring-pulse" style={{ background: `${color}20`, width: 44, height: 44 }} />}
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 ${mounted ? "path-node-pop" : "opacity-0"}`}
              style={{ animationDelay: `${nodeDelay}ms`, background: `linear-gradient(145deg, ${color}, ${color}CC)`, boxShadow: `0 3px 12px ${color}35, inset 0 1px 0 rgba(255,255,255,0.2)` }}>
              <span className="text-[13px] font-extrabold text-white drop-shadow-sm">{total - index}</span>
            </div>
          </div>
          {!isLast && (
            <div className="relative w-[3px] flex-1 min-h-[24px]">
              <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to bottom, ${color}30, ${color}08)` }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rotate-45" style={{ background: `${color}25` }} />
            </div>
          )}
        </div>
        <div className="flex-1" style={{ maxWidth: "calc(50% - 22px)" }} />
      </div>
    </div>
  );
}

/* ─── Empty State ─── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative mb-8">
        <div className="absolute rounded-full" style={{ background: "radial-gradient(circle, #4A5FC108, transparent 70%)", width: 160, height: 160, top: -40, left: -40 }} />
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="path-gentle-float">
          <circle cx="50" cy="50" r="42" fill="url(#emptyGrad)" opacity="0.5" />
          <path d="M35 82 Q38 65 50 55 Q62 45 58 30 Q55 20 62 12" stroke="url(#pathStroke)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="200" style={{ animation: "emptyPathDraw 2s ease-out forwards" }} />
          <circle cx="62" cy="14" r="4.5" fill="#D4A853" opacity="0.7"><animate attributeName="r" values="4;5.5;4" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx="50" cy="55" r="3.5" fill="#4A5FC1" opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
          <circle cx="35" cy="82" r="3" fill="#E8614D" opacity="0.4" />
          <circle cx="72" cy="28" r="1.5" fill="#D4A853" opacity="0.3"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" /></circle>
          <circle cx="28" cy="42" r="1" fill="#4A5FC1" opacity="0.25"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" /></circle>
          <defs>
            <radialGradient id="emptyGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4A5FC1" stopOpacity="0.07" /><stop offset="100%" stopColor="#FAFAF8" stopOpacity="0" /></radialGradient>
            <linearGradient id="pathStroke" x1="35" y1="82" x2="62" y2="12"><stop offset="0%" stopColor="#E8614D" stopOpacity="0.5" /><stop offset="50%" stopColor="#4A5FC1" stopOpacity="0.4" /><stop offset="100%" stopColor="#D4A853" stopOpacity="0.6" /></linearGradient>
          </defs>
        </svg>
      </div>
      <p className="text-[18px] font-extrabold text-navy mb-2 tracking-tight">아직 탐험 기록이 없어요</p>
      <p className="text-[13px] text-text-muted text-center leading-relaxed mb-8">
        첫 미션을 완료하면<br /><span className="font-semibold" style={{ color: "#4A5FC1" }}>나만의 탐색 길</span>이 열려요
      </p>
      <Link href="/home"
        className="relative px-7 py-3.5 rounded-2xl text-[14px] font-bold text-white tap-highlight active:scale-[0.97] overflow-hidden path-invite-pulse"
        style={{ background: "linear-gradient(135deg, #E8614D, #D4503E)", boxShadow: "0 6px 24px rgba(232, 97, 77, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
        <span className="relative z-10">첫 미션 시작하기</span>
      </Link>
    </div>
  );
}

/* ─── Loading Skeleton ─── */

function PathSkeleton() {
  return (
    <div className="px-5 pt-14 pb-6 animate-pulse">
      <div className="mb-6">
        <div className="h-6 w-40 bg-bg-warm rounded-lg mb-2" />
        <div className="h-3 w-28 bg-bg-warm rounded" />
      </div>
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-card-bg rounded-2xl px-3 py-3 border border-border-light text-center">
            <div className="h-5 w-8 bg-bg-warm rounded mx-auto mb-1" />
            <div className="h-3 w-12 bg-bg-warm rounded mx-auto" />
          </div>
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 mb-6">
          <div className="flex-1">
            <div className="bg-card-bg rounded-2xl px-4 py-4 border border-border-light">
              <div className="h-3 w-16 bg-bg-warm rounded mb-2" />
              <div className="h-4 w-32 bg-bg-warm rounded mb-1" />
              <div className="h-3 w-full bg-bg-warm rounded" />
            </div>
          </div>
          <div className="w-10 h-10 bg-bg-warm rounded-full flex-shrink-0" />
          <div className="flex-1" />
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Card ─── */

function StatCard({ icon, value, label, bg, shadow, border, textColor }: {
  icon: React.ReactNode; value: string; label: string;
  bg: string; shadow: string; border: string; textColor: string;
}) {
  return (
    <div className="flex-1 rounded-2xl px-3 py-3 text-center relative overflow-hidden" style={{ background: bg, boxShadow: shadow, border }}>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {icon}
        <p className="text-[19px] font-extrabold tabular-nums" style={{ color: textColor }}>{value}</p>
      </div>
      <p className="text-[10px] text-text-muted font-semibold tracking-wide">{label}</p>
    </div>
  );
}

/* ─── Main Page ─── */

export default function ExplorationMapPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childName, setChildName] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [sessions, setSessions] = useState<PastSessionItem[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const family = await getFamilyMe();
        setChildName(family.activeChild.name);
        const [profileRes, sessionsRes] = await Promise.all([
          getProfile(family.activeChildId),
          listSessions(50),
        ]);
        setProfile(profileRes.profile);
        setSessions(sessionsRes.sessions);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setError("로그인이 필요해요");
        } else {
          setError("데이터를 불러오지 못했어요.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <PathSkeleton />;

  if (error) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[16px] font-bold text-navy mb-2">{error}</p>
        <p className="text-[13px] text-text-muted text-center">
          {error === "로그인이 필요해요" ? "탐색 지도를 보려면 먼저 로그인해주세요." : "네트워크 연결을 확인해주세요."}
        </p>
      </div>
    );
  }

  const categoryCounts: Record<string, number> = {};
  for (const s of sessions) {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
  }

  return (
    <div className="page-enter px-5 pt-14 pb-6 relative overflow-hidden" style={{ minHeight: "100dvh" }}>
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 600px 400px at 20% 30%, #4A5FC105, transparent), radial-gradient(ellipse 500px 500px at 80% 60%, #E8614D04, transparent), radial-gradient(ellipse 400px 300px at 50% 90%, #D4A85304, transparent)",
        zIndex: 0,
      }} />

      <div className="relative z-10">
        {/* Header */}
        <div className={`mb-6 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
          <h1 className="text-[23px] font-extrabold text-navy tracking-tight mb-0.5">{childName}의 탐색 지도</h1>
          <p className="text-[13px] text-text-muted font-medium">
            {sessions.length > 0 ? "지금까지 걸어온 탐험의 길" : "탐험을 시작해볼까?"}
          </p>
        </div>

        {/* Stats Row */}
        {profile && sessions.length > 0 && (
          <div className={`flex gap-2.5 mb-8 ${mounted ? "animate-fade-in-up delay-100" : "opacity-0"}`} style={{ animationFillMode: "both" }}>
            <StatCard icon={STAT_ICONS.missions} value={String(profile.stats.totalMissions)} label="탐험 완료"
              bg="linear-gradient(145deg, #FFFFFF, #EEF0F9AA)" shadow="0 2px 12px rgba(74,95,193,0.06), 0 1px 2px rgba(0,0,0,0.03)"
              border="1px solid #4A5FC110" textColor="#1A1A2E" />
            <StatCard icon={STAT_ICONS.streak} value={`${profile.stats.currentStreak}일`} label="연속 탐험"
              bg="linear-gradient(145deg, #FFFFFF, #FEF0EEAA)" shadow="0 2px 12px rgba(232,97,77,0.06), 0 1px 2px rgba(0,0,0,0.03)"
              border="1px solid #E8614D10" textColor="#E8614D" />
            <StatCard icon={STAT_ICONS.time} value={`${profile.stats.totalMinutes}분`} label="총 탐험 시간"
              bg="linear-gradient(145deg, #FFFFFF, #FBF5E8AA)" shadow="0 2px 12px rgba(212,168,83,0.06), 0 1px 2px rgba(0,0,0,0.03)"
              border="1px solid #D4A85310" textColor="#B8903A" />
          </div>
        )}

        {/* Path */}
        {sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative">
            {/* Central vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-5 bottom-5" style={{ width: 3 }}>
              <div className="w-full h-full rounded-full" style={{
                background: "linear-gradient(to bottom, #4A5FC130 0%, #E8614D25 25%, #D4A85325 50%, #6B8F7120 75%, #7C6FAF15 100%)",
              }} />
              {sessions.length > 2 && <>
                <div className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full" style={{ top: "25%", background: "#E8614D15" }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full" style={{ top: "55%", background: "#D4A85315" }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full" style={{ top: "80%", background: "#7C6FAF12" }} />
              </>}
            </div>

            {/* Path nodes */}
            <div className="flex flex-col gap-5 relative z-10">
              {sessions.map((session, idx) => (
                <PathNode key={session.sessionId} session={session} index={idx} total={sessions.length} mounted={mounted} />
              ))}
            </div>

            {/* Path end marker */}
            <div className="flex justify-center mt-8">
              <div
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full path-gentle-float ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                style={{
                  background: "linear-gradient(135deg, #F5F3EE, #EEF0F9AA)", border: "1px solid #E8E6E1",
                  boxShadow: "0 2px 16px rgba(74,95,193,0.06)",
                  animationDelay: `${350 + sessions.length * 120}ms`, animationFillMode: "both",
                }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #4A5FC120, #E8614D15)" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 2v6M2 5h6" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold" style={{ color: "#6B6B7B" }}>다음 탐험이 기다리고 있어</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
