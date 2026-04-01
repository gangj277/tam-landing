"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFamilyMe,
  getTodayMission as fetchTodayMission,
  getTodayActivity,
  getTomorrowMission as fetchTomorrowMission,
  chooseTodayMission,
  listSessions,
  getProfile,
  ApiError,
} from "@/lib/api-client";
import type {
  FamilyMe,
  MissionData,
  MissionPreviewData,
  PastSessionItem,
  ProfileData,
  TodayMissionResponse,
  TodayActivityResponse,
  DeepDiveData,
} from "@/lib/api-client";
import { CATEGORY_META } from "@/lib/types";
import type { MissionCategory } from "@/lib/types";

/* ─── SVG Illustrations ─── */

function WavingHandSVG() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className="inline-block animate-float"
      style={{ animationDuration: "2s" }}
    >
      <defs>
        <radialGradient id="handGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD6A0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFD6A0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="handSkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFCBA4" />
          <stop offset="100%" stopColor="#E8A87C" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16" fill="url(#handGlow)" />
      {/* Palm */}
      <path
        d="M18 30c-3.5 0-6.5-1.2-8-3.5-1.2-1.8-1.5-4-.8-6.5l2-7c.3-1 1.2-1.6 2.2-1.3.9.3 1.4 1.2 1.1 2.2l-1.2 4.2"
        fill="url(#handSkin)"
        stroke="#D4956B"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Fingers */}
      <path
        d="M13.3 18.1l1.5-8.5c.2-1 1.1-1.7 2.1-1.5 1 .2 1.6 1.1 1.4 2.1l-1 5.5"
        fill="url(#handSkin)"
        stroke="#D4956B"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M17.3 15.7l.8-8c.1-1 1-1.8 2-1.7 1 .1 1.7 1 1.6 2l-.5 7.3"
        fill="url(#handSkin)"
        stroke="#D4956B"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M21.2 15.3l.3-7c.05-1 .9-1.7 1.9-1.65.95.05 1.65.9 1.6 1.85l-.1 6.8"
        fill="url(#handSkin)"
        stroke="#D4956B"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M25 15.3l-.1-4.8c0-.85.65-1.55 1.5-1.6.85-.05 1.55.6 1.6 1.45l.1 4.9c0 3.5-1.5 6.5-4 8.5"
        fill="url(#handSkin)"
        stroke="#D4956B"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      {/* Wrist cuff */}
      <path
        d="M10 26.5c1.5 2.3 4.5 3.5 8 3.5 3 0 5.5-1 7.2-2.8"
        fill="none"
        stroke="#D4956B"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Sparkle lines */}
      <line x1="6" y1="8" x2="8" y2="10" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <line x1="5" y1="12" x2="7.5" y2="12.5" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <circle cx="30" cy="8" r="1.2" fill="#D4A853" opacity="0.6" />
      <circle cx="7" cy="5" r="0.8" fill="#E8614D" opacity="0.4" />
    </svg>
  );
}

function FlameStreakSVG() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
      <defs>
        <linearGradient id="flameOuter" x1="11" y1="26" x2="11" y2="0">
          <stop offset="0%" stopColor="#E8614D" />
          <stop offset="50%" stopColor="#F09030" />
          <stop offset="100%" stopColor="#FFD166" />
        </linearGradient>
        <linearGradient id="flameInner" x1="11" y1="26" x2="11" y2="8">
          <stop offset="0%" stopColor="#FFD166" />
          <stop offset="100%" stopColor="#FFF5D6" />
        </linearGradient>
      </defs>
      {/* Outer flame */}
      <path
        d="M11 1C11 1 3 9 3 16c0 4.4 3.6 8 8 8s8-3.6 8-8C19 9 11 1 11 1z"
        fill="url(#flameOuter)"
      />
      {/* Inner flame */}
      <path
        d="M11 10c0 0-4 4-4 8 0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-4-8-4-8z"
        fill="url(#flameInner)"
        opacity="0.85"
      />
      {/* Glow */}
      <ellipse cx="11" cy="20" rx="3" ry="2" fill="#FFF5D6" opacity="0.4" />
    </svg>
  );
}

function MarsCitySVG() {
  return (
    <svg
      width="100%"
      height="180"
      viewBox="0 0 360 180"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className="rounded-xl"
    >
      <defs>
        <linearGradient id="marssky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="40%" stopColor="#2D1B3D" />
          <stop offset="100%" stopColor="#8B3A3A" />
        </linearGradient>
        <linearGradient id="marsground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4553A" />
          <stop offset="100%" stopColor="#8B3020" />
        </linearGradient>
        <radialGradient id="domeGlow" cx="0.5" cy="0.7" r="0.5">
          <stop offset="0%" stopColor="#A8E6CF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#A8E6CF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFD166" />
          <stop offset="60%" stopColor="#F09030" />
          <stop offset="100%" stopColor="#F09030" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="domeShell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8E6CF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#69C9A0" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="360" height="180" fill="url(#marssky)" />

      {/* Stars */}
      <circle cx="30" cy="20" r="1" fill="#FFF" opacity="0.8" />
      <circle cx="80" cy="35" r="0.7" fill="#FFF" opacity="0.5" />
      <circle cx="140" cy="15" r="1.2" fill="#FFF" opacity="0.9" />
      <circle cx="200" cy="28" r="0.8" fill="#FFF" opacity="0.6" />
      <circle cx="250" cy="12" r="1" fill="#FFF" opacity="0.7" />
      <circle cx="310" cy="30" r="0.6" fill="#FFF" opacity="0.5" />
      <circle cx="340" cy="18" r="1.3" fill="#FFD166" opacity="0.8" />
      <circle cx="55" cy="50" r="0.5" fill="#FFF" opacity="0.4" />
      <circle cx="170" cy="45" r="0.9" fill="#FFF" opacity="0.6" />
      <circle cx="290" cy="42" r="0.7" fill="#FFF" opacity="0.5" />
      <circle cx="120" cy="8" r="0.6" fill="#FFF" opacity="0.7" />
      <circle cx="330" cy="50" r="0.8" fill="#FFF" opacity="0.4" />

      {/* Mars moon (Phobos) */}
      <circle cx="300" cy="25" r="6" fill="#BBB0A0" opacity="0.4" />
      <circle cx="298" cy="23" r="1.5" fill="#A09080" opacity="0.3" />
      <circle cx="303" cy="26" r="1" fill="#A09080" opacity="0.25" />

      {/* Distant mountains */}
      <path d="M0 120 L40 85 L80 100 L130 70 L180 95 L220 75 L270 90 L320 65 L360 85 L360 120 Z" fill="#7A3020" opacity="0.5" />
      <path d="M0 120 L60 95 L110 105 L160 88 L210 100 L260 85 L310 98 L360 90 L360 120 Z" fill="#8B3A2A" opacity="0.6" />

      {/* Ground */}
      <rect x="0" y="115" width="360" height="65" fill="url(#marsground)" />

      {/* Ground texture - rocks */}
      <ellipse cx="50" cy="155" rx="12" ry="4" fill="#7A3020" opacity="0.4" />
      <ellipse cx="150" cy="165" rx="8" ry="3" fill="#6A2818" opacity="0.3" />
      <ellipse cx="300" cy="158" rx="10" ry="3.5" fill="#7A3020" opacity="0.35" />
      <circle cx="20" cy="145" r="3" fill="#6A2818" opacity="0.3" />
      <circle cx="340" cy="150" r="4" fill="#6A2818" opacity="0.25" />

      {/* Main dome - the city */}
      <ellipse cx="180" cy="118" rx="90" ry="60" fill="url(#domeShell)" stroke="#A8E6CF" strokeWidth="1.5" strokeOpacity="0.4" />
      <ellipse cx="180" cy="118" rx="90" ry="60" fill="url(#domeGlow)" />

      {/* Dome grid lines */}
      <path d="M95 118 Q180 58 265 118" fill="none" stroke="#A8E6CF" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M105 118 Q180 70 255 118" fill="none" stroke="#A8E6CF" strokeWidth="0.4" strokeOpacity="0.25" />
      <path d="M120 118 Q180 78 240 118" fill="none" stroke="#A8E6CF" strokeWidth="0.4" strokeOpacity="0.2" />
      <line x1="180" y1="58" x2="180" y2="118" stroke="#A8E6CF" strokeWidth="0.4" strokeOpacity="0.2" />
      <line x1="140" y1="62" x2="150" y2="118" stroke="#A8E6CF" strokeWidth="0.3" strokeOpacity="0.15" />
      <line x1="220" y1="62" x2="210" y2="118" stroke="#A8E6CF" strokeWidth="0.3" strokeOpacity="0.15" />

      {/* Buildings inside dome */}
      <rect x="145" y="90" width="14" height="28" rx="2" fill="#3A6B5A" opacity="0.7" />
      <rect x="147" y="93" width="4" height="4" rx="0.5" fill="#FFD166" opacity="0.8" />
      <rect x="153" y="93" width="4" height="4" rx="0.5" fill="#FFD166" opacity="0.6" />
      <rect x="147" y="100" width="4" height="4" rx="0.5" fill="#FFD166" opacity="0.7" />
      <rect x="153" y="100" width="4" height="4" rx="0.5" fill="#FFD166" opacity="0.5" />
      <rect x="147" y="107" width="4" height="4" rx="0.5" fill="#A8E6CF" opacity="0.6" />

      <rect x="165" y="82" width="18" height="36" rx="3" fill="#2D5B4A" opacity="0.7" />
      <rect x="168" y="86" width="5" height="5" rx="1" fill="#FFD166" opacity="0.7" />
      <rect x="175" y="86" width="5" height="5" rx="1" fill="#FFD166" opacity="0.5" />
      <rect x="168" y="94" width="5" height="5" rx="1" fill="#A8E6CF" opacity="0.5" />
      <rect x="175" y="94" width="5" height="5" rx="1" fill="#FFD166" opacity="0.6" />
      <rect x="168" y="102" width="5" height="5" rx="1" fill="#FFD166" opacity="0.4" />
      <rect x="175" y="102" width="5" height="5" rx="1" fill="#A8E6CF" opacity="0.6" />

      <rect x="190" y="95" width="12" height="23" rx="2" fill="#3A6B5A" opacity="0.6" />
      <rect x="192" y="98" width="3.5" height="3.5" rx="0.5" fill="#FFD166" opacity="0.7" />
      <rect x="197" y="98" width="3.5" height="3.5" rx="0.5" fill="#FFD166" opacity="0.5" />
      <rect x="192" y="104" width="3.5" height="3.5" rx="0.5" fill="#A8E6CF" opacity="0.5" />

      <rect x="208" y="88" width="16" height="30" rx="2" fill="#2D5B4A" opacity="0.65" />
      <rect x="210" y="91" width="5" height="5" rx="1" fill="#FFD166" opacity="0.6" />
      <rect x="217" y="91" width="5" height="5" rx="1" fill="#FFD166" opacity="0.7" />
      <rect x="210" y="99" width="5" height="5" rx="1" fill="#A8E6CF" opacity="0.5" />
      <rect x="217" y="99" width="5" height="5" rx="1" fill="#FFD166" opacity="0.5" />
      <rect x="210" y="107" width="5" height="5" rx="1" fill="#FFD166" opacity="0.4" />

      {/* Greenery in dome */}
      <circle cx="140" cy="115" r="5" fill="#5BBF8A" opacity="0.4" />
      <circle cx="155" cy="116" r="3.5" fill="#4AAF7A" opacity="0.35" />
      <circle cx="228" cy="114" r="4" fill="#5BBF8A" opacity="0.4" />
      <circle cx="240" cy="116" r="3" fill="#4AAF7A" opacity="0.3" />

      {/* Smaller secondary dome */}
      <ellipse cx="70" cy="120" rx="30" ry="20" fill="url(#domeShell)" stroke="#A8E6CF" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="58" y="108" width="8" height="12" rx="1" fill="#3A6B5A" opacity="0.5" />
      <rect x="60" y="110" width="2.5" height="2.5" rx="0.3" fill="#FFD166" opacity="0.6" />
      <rect x="72" y="105" width="10" height="15" rx="1.5" fill="#2D5B4A" opacity="0.5" />
      <rect x="74" y="107" width="3" height="3" rx="0.5" fill="#FFD166" opacity="0.5" />
      <rect x="74" y="112" width="3" height="3" rx="0.5" fill="#A8E6CF" opacity="0.4" />

      {/* Connection tube between domes */}
      <rect x="98" y="113" width="48" height="6" rx="3" fill="#69C9A0" opacity="0.15" stroke="#A8E6CF" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Antenna / tower */}
      <line x1="180" y1="58" x2="180" y2="42" stroke="#A8E6CF" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="180" cy="40" r="2.5" fill="#E8614D" opacity="0.7" />
      <circle cx="180" cy="40" r="4" fill="#E8614D" opacity="0.15" className="animate-breathe" />

      {/* Dust particles on ground */}
      <circle cx="30" cy="135" r="1" fill="#D4956B" opacity="0.2" />
      <circle cx="100" cy="140" r="1.5" fill="#D4956B" opacity="0.15" />
      <circle cx="260" cy="138" r="1" fill="#D4956B" opacity="0.2" />
      <circle cx="330" cy="142" r="1.2" fill="#D4956B" opacity="0.18" />

      {/* Rover on ground */}
      <rect x="285" y="130" width="18" height="8" rx="2" fill="#666" opacity="0.5" />
      <circle cx="289" cy="140" r="3" fill="#555" opacity="0.5" />
      <circle cx="299" cy="140" r="3" fill="#555" opacity="0.5" />
      <rect x="291" y="126" width="6" height="5" rx="1" fill="#888" opacity="0.4" />
    </svg>
  );
}

function BookDeepDiveSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="bookCover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" />
          <stop offset="100%" stopColor="#7B8FE0" />
        </linearGradient>
      </defs>
      <rect x="6" y="4" width="28" height="32" rx="3" fill="url(#bookCover)" opacity="0.15" stroke="#4A5FC1" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="10" y="4" width="24" height="32" rx="2.5" fill="url(#bookCover)" opacity="0.08" />
      <line x1="10" y1="4" x2="10" y2="36" stroke="#4A5FC1" strokeWidth="1" strokeOpacity="0.3" />
      {/* Page lines */}
      <line x1="15" y1="12" x2="28" y2="12" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="15" y1="16" x2="26" y2="16" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.25" strokeLinecap="round" />
      <line x1="15" y1="20" x2="28" y2="20" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
      <line x1="15" y1="24" x2="24" y2="24" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.2" strokeLinecap="round" />
      {/* Magnifying glass */}
      <circle cx="28" cy="28" r="5" fill="none" stroke="#E8614D" strokeWidth="1.3" strokeOpacity="0.6" />
      <line x1="31.5" y1="31.5" x2="35" y2="35" stroke="#E8614D" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="2" fill="#E8614D" opacity="0.1" />
    </svg>
  );
}

function LockSVG() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="9" width="14" height="9" rx="2.5" fill="#E8E6E1" stroke="#D4D0C8" strokeWidth="1" />
      <path
        d="M6 9V6.5C6 4.01 8.01 2 10.5 2V2C12.99 2 15 4.01 15 6.5V9"
        fill="none"
        stroke="#D4D0C8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.5" r="1.5" fill="#8A8A9A" />
      <line x1="10" y1="14.5" x2="10" y2="16" stroke="#8A8A9A" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckSVG({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill={color} opacity="0.15" />
      <circle cx="9" cy="9" r="8" stroke={color} strokeWidth="1.2" opacity="0.4" />
      <path d="M5.5 9.5L7.8 11.8L12.5 6.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Loading Skeleton ─── */

function HomeSkeleton() {
  return (
    <div className="px-5 pt-14 pb-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-bg-warm" />
          <div>
            <div className="h-5 w-24 bg-bg-warm rounded mb-1" />
            <div className="h-3 w-40 bg-bg-warm rounded" />
          </div>
        </div>
        <div className="w-20 h-10 bg-bg-warm rounded-2xl" />
      </div>
      <div className="h-4 w-20 bg-bg-warm rounded mb-3" />
      <div className="bg-card-bg rounded-2xl border border-border-light overflow-hidden">
        <div className="h-1.5 bg-bg-warm" />
        <div className="h-[180px] bg-bg-warm mx-4 mt-3 rounded-xl" />
        <div className="px-5 pb-5 pt-4">
          <div className="h-4 w-16 bg-bg-warm rounded mb-3" />
          <div className="h-6 w-48 bg-bg-warm rounded mb-2" />
          <div className="h-4 w-32 bg-bg-warm rounded mb-3" />
          <div className="h-4 w-full bg-bg-warm rounded mb-5" />
          <div className="h-12 w-full bg-bg-warm rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Component ─── */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [childName, setChildName] = useState("");
  const [streak, setStreak] = useState(0);
  const [todayResponse, setTodayResponse] = useState<TodayMissionResponse | null>(null);
  const [activityType, setActivityType] = useState<"mission" | "deepdive" | "deepdive_pending">("mission");
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveData | null>(null);
  const [linkedMission, setLinkedMission] = useState<MissionData | null>(null);
  const [tomorrowMission, setTomorrowMission] = useState<MissionData | null>(null);
  const [pastSessions, setPastSessions] = useState<PastSessionItem[]>([]);
  const [choosingIndex, setChoosingIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      try {
        const family = await getFamilyMe();
        setChildName(family.activeChild.name);

        // Try getTodayActivity first; fall back to getTodayMission on failure
        let activityRes: TodayActivityResponse | null = null;
        try {
          activityRes = await getTodayActivity();
        } catch {
          // fallback — wrap legacy response
          activityRes = null;
        }

        const [sessionsRes, profileRes, tomorrowRes] = await Promise.all([
          listSessions(6),
          getProfile(family.activeChildId),
          fetchTomorrowMission().catch(() => null),
        ]);

        setPastSessions(sessionsRes.sessions);
        setStreak(profileRes.profile.stats.currentStreak);
        if (tomorrowRes) {
          setTomorrowMission(tomorrowRes.mission);
        }

        if (activityRes) {
          if (activityRes.type === "deepdive") {
            setActivityType("deepdive");
            setDeepDiveData(activityRes.deepDive);
            setLinkedMission(activityRes.linkedMission);
          } else if (activityRes.type === "deepdive_pending") {
            setActivityType("deepdive_pending");
            setLinkedMission(activityRes.linkedMission);
          } else {
            // type === "mission" — convert to legacy TodayMissionResponse shape
            setActivityType("mission");
            if ("status" in activityRes) {
              setTodayResponse(activityRes as TodayMissionResponse);
            } else {
              // Simple mission shape without status field
              setTodayResponse({ status: "sequence", mission: activityRes.mission, reason: activityRes.reason ?? "" });
            }
          }
        } else {
          // Fallback: use legacy endpoint directly
          setActivityType("mission");
          const todayRes = await fetchTodayMission();
          setTodayResponse(todayRes);
        }
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

  async function handleChoosePreview(index: number) {
    if (choosingIndex !== null) return;
    setChoosingIndex(index);
    try {
      const result = await chooseTodayMission(index);
      setTodayResponse({ status: "chosen", mission: result.mission, reason: result.reason });
    } catch {
      setChoosingIndex(null);
    }
  }

  if (loading) {
    return <HomeSkeleton />;
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
            ? "탐험을 시작하려면 먼저 로그인해주세요."
            : "네트워크 연결을 확인하고 다시 시도해주세요."}
        </p>
      </div>
    );
  }

  if (activityType === "mission" && !todayResponse) {
    return (
      <div className="px-5 pt-14 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-[16px] font-bold text-navy mb-2">오늘의 미션을 준비 중이에요</p>
        <p className="text-[13px] text-text-muted">잠시만 기다려주세요.</p>
      </div>
    );
  }

  // Extract mission for "sequence" and "chosen" statuses
  const todayMission = todayResponse && todayResponse.status !== "choosing" ? todayResponse.mission : null;
  const categoryMeta = todayMission ? CATEGORY_META[todayMission.category as MissionCategory] : null;
  const tomorrowCategoryMeta = tomorrowMission
    ? CATEGORY_META[tomorrowMission.category as MissionCategory]
    : null;
  const isTodayCompleted = todayMission
    ? pastSessions.some((s) => s.missionId === todayMission.id)
    : false;

  return (
    <div className="page-enter px-5 pt-14 pb-6">
      {/* ── Greeting Header ── */}
      <div
        className={`flex items-center justify-between mb-6 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="flex items-center gap-2">
          <WavingHandSVG />
          <div>
            <h1 className="text-[22px] font-bold text-navy tracking-tight">
              안녕, {childName}
            </h1>
            <p className="text-[13px] text-text-muted -mt-0.5">
              오늘도 새로운 세계가 기다리고 있어
            </p>
          </div>
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-1.5 bg-card-bg rounded-2xl px-3.5 py-2 shadow-sm border border-border-light">
          <FlameStreakSVG />
          <div className="text-right">
            <p className="text-[15px] font-bold text-navy leading-tight">
              {streak}일째
            </p>
            <p className="text-[10px] text-text-muted">탐험 중!</p>
          </div>
        </div>
      </div>

      {/* ── Today's Activity Section ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up delay-200" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        {/* ── Deep-Dive Card ── */}
        {activityType === "deepdive" && deepDiveData && linkedMission && (
          <>
            <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-2.5">
              오늘의 활동
            </p>

            <div className="bg-card-bg rounded-2xl shadow-lg shadow-black/[0.06] border border-border-light overflow-hidden">
              <div
                className="h-1.5"
                style={{
                  background: "linear-gradient(90deg, #4A5FC1, #7B8FE0aa, #4A5FC144)",
                }}
              />

              <div className="px-5 pt-5 pb-5">
                <div className="mb-4">
                  <BookDeepDiveSVG />
                </div>

                <h2 className="text-[20px] font-bold text-navy leading-snug mb-3">
                  오늘의 딥다이브
                </h2>

                <p className="text-[12px] text-text-muted mb-2">
                  어제의 미션: {linkedMission.title}
                </p>

                <div className="h-px bg-border-light mb-3" />

                <h3 className="text-[17px] font-bold text-navy leading-snug mb-1.5">
                  {deepDiveData.title}
                </h3>
                <p className="text-[14px] font-medium text-text-secondary mb-1">
                  {deepDiveData.realWorldCase.headline}
                </p>
                <p className="text-[13px] text-text-muted leading-relaxed line-clamp-2 italic mb-4">
                  &ldquo;{deepDiveData.realWorldCase.context}&rdquo;
                </p>

                <div className="flex items-center gap-2 text-[12px] text-text-muted mb-5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#8A8A9A" strokeWidth="1" />
                    <path d="M6 3.5V6.5L8 7.5" stroke="#8A8A9A" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <span>약 5분</span>
                  <span className="text-border-light">|</span>
                  <span>4단계 탐구</span>
                </div>

                <Link
                  href={`/deepdive/${deepDiveData.id}`}
                  className="block w-full bg-coral text-white font-bold text-[15px] py-3.5 rounded-xl text-center active:bg-coral-hover transition-colors"
                >
                  탐구 시작하기
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── Deep-Dive Pending Card ── */}
        {activityType === "deepdive_pending" && linkedMission && (
          <>
            <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-2.5">
              오늘의 활동
            </p>

            <div className="bg-card-bg rounded-2xl shadow-lg shadow-black/[0.06] border border-border-light overflow-hidden">
              <div
                className="h-1.5"
                style={{
                  background: "linear-gradient(90deg, #4A5FC1, #7B8FE0aa, #4A5FC144)",
                }}
              />

              <div className="px-5 pt-5 pb-5">
                <div className="mb-4">
                  <BookDeepDiveSVG />
                </div>

                <h2 className="text-[20px] font-bold text-navy leading-snug mb-3">
                  오늘의 딥다이브
                </h2>

                <p className="text-[14px] text-text-secondary leading-relaxed mb-1">
                  어제의 미션을 먼저 완료하면
                </p>
                <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
                  현실 사례 탐구를 할 수 있어!
                </p>

                <p className="text-[15px] font-bold text-navy mb-5">
                  {linkedMission.title}
                </p>

                <Link
                  href={`/mission/${linkedMission.id}`}
                  className="block w-full text-center font-bold text-[15px] py-3.5 rounded-xl border-2 border-border-light text-text-secondary active:bg-bg-warm transition-colors"
                >
                  어제의 미션 하러 가기
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block ml-1.5 -mt-0.5">
                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── Mission Cards (existing logic) ── */}
        {activityType === "mission" && todayResponse && (
          <>
            {todayResponse.status === "choosing" ? (
              <>
                {/* ── 3 Preview Cards (Day 8+) ── */}
                <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-1">
                  오늘의 미션
                </p>
                <h2 className="text-[18px] font-bold text-navy mb-4">
                  어떤 세계에 들어갈까?
                </h2>

                <div className="flex flex-col gap-3">
                  {todayResponse.previews.map((preview, idx) => {
                    const previewMeta = CATEGORY_META[preview.category as MissionCategory];
                    const isSelecting = choosingIndex === idx;
                    const isDisabled = choosingIndex !== null && choosingIndex !== idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoosePreview(idx)}
                        disabled={choosingIndex !== null}
                        className={`text-left bg-card-bg rounded-2xl border overflow-hidden shadow-sm transition-all ${
                          isSelecting
                            ? "border-coral shadow-md scale-[1.01]"
                            : isDisabled
                              ? "border-border-light opacity-50"
                              : "border-border-light active:scale-[0.98] active:shadow-md"
                        }`}
                        style={{
                          borderLeftWidth: "3px",
                          borderLeftColor: previewMeta.color,
                        }}
                      >
                        <div className="px-4 py-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                              style={{
                                background: previewMeta.lightBg,
                                color: previewMeta.color,
                              }}
                            >
                              {previewMeta.label}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              {preview.era} &middot; {preview.worldLocation}
                            </span>
                          </div>

                          <h3 className="text-[16px] font-bold text-navy leading-snug mb-0.5">
                            {preview.title}
                          </h3>
                          <p className="text-[13px] text-text-secondary mb-1.5">
                            역할: {preview.role}
                          </p>
                          <p className="text-[12px] text-text-muted italic">
                            {preview.pitch}
                          </p>

                          {isSelecting && (
                            <div className="mt-3 flex items-center gap-2 text-coral">
                              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                                <path d="M7 1a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              <span className="text-[12px] font-semibold">세계를 만들고 있어...</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : todayMission && categoryMeta ? (
              <>
                {/* ── Single Mission Card (Day 1-7 or already chosen) ── */}
                <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-2.5">
                  오늘의 미션
                </p>

                <Link href={isTodayCompleted ? `/mission/${todayMission.id}/mirror` : `/mission/${todayMission.id}`} className="block tap-highlight">
                  <div className={`bg-card-bg rounded-2xl shadow-lg shadow-black/[0.06] border overflow-hidden ${isTodayCompleted ? "border-[#A5D6A7]" : "border-border-light"}`}>
                    <div
                      className="h-1.5"
                      style={{
                        background: isTodayCompleted
                          ? "linear-gradient(90deg, #66BB6A, #66BB6Aaa, #66BB6A44)"
                          : `linear-gradient(90deg, ${categoryMeta.color}, ${categoryMeta.color}88, ${categoryMeta.color}44)`,
                      }}
                    />

                    <div className="px-4 pt-3">
                      <MarsCitySVG />
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          style={{
                            background: categoryMeta.lightBg,
                            color: categoryMeta.color,
                          }}
                        >
                          {categoryMeta.label}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {todayMission.worldSetting.era} &middot; {todayMission.worldSetting.location}
                        </span>
                      </div>

                      <h2 className="text-[20px] font-bold text-navy leading-snug mb-1">
                        {todayMission.title}
                      </h2>
                      <p className="text-[14px] text-text-secondary font-medium mb-3">
                        역할: {todayMission.role}
                      </p>

                      <p className="text-[13px] text-text-muted leading-relaxed mb-5 line-clamp-2">
                        {todayMission.situation}
                      </p>

                      {isTodayCompleted ? (
                        <div className="w-full flex items-center justify-center gap-2 bg-[#E8F5E9] text-[#2E7D32] font-bold text-[15px] py-3.5 rounded-xl">
                          <CheckSVG color="#2E7D32" />
                          탐험 돌아보기
                        </div>
                      ) : (
                        <button className="w-full bg-coral text-white font-bold text-[15px] py-3.5 rounded-xl active:bg-coral-hover transition-colors">
                          세계에 들어가기
                        </button>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {todayMission.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] text-text-muted bg-bg-warm px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="#8A8A9A" strokeWidth="1" />
                            <path d="M6 3.5V6.5L8 7.5" stroke="#8A8A9A" strokeWidth="1" strokeLinecap="round" />
                          </svg>
                          약 {todayMission.estimatedMinutes}분
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            ) : null}
          </>
        )}
      </div>

      {/* ── Past Missions ── */}
      {pastSessions.length > 0 && (
        <div
          className={`mb-7 ${mounted ? "animate-fade-in-up delay-400" : "opacity-0"}`}
          style={{ animationFillMode: "both" }}
        >
          <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-3">
            완료한 탐험
          </p>

          <div className="flex flex-col gap-2.5">
            {pastSessions.map((session, idx) => {
              const sessCategoryMeta =
                CATEGORY_META[session.category as MissionCategory];
              return (
                <div
                  key={session.sessionId}
                  className={`flex items-center gap-3.5 bg-card-bg rounded-2xl px-4 py-3.5 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                  style={{
                    animationDelay: `${500 + idx * 80}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <CheckSVG color={sessCategoryMeta.color} />

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-navy truncate">
                      {session.missionTitle}
                    </p>
                    <p className="text-[12px] text-text-muted truncate">
                      {session.choiceSummary}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className="w-2 h-2 rounded-full mb-1"
                      style={{ background: sessCategoryMeta.color }}
                    />
                    <span className="text-[10px] text-text-muted">
                      {session.completedAt.slice(5).replace("-", "/")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tomorrow Teaser (Locked) ── */}
      <div
        className={`${mounted ? "animate-fade-in-up delay-700" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <div className="relative bg-bg-warm rounded-2xl px-5 py-4 border border-border-light overflow-hidden">
          <div className="absolute inset-0 bg-bg-warm/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-card-bg/80 rounded-xl px-4 py-2.5 shadow-sm border border-border-light">
              <LockSVG />
              <span className="text-[13px] font-semibold text-text-muted">
                내일도 새로운 세계가 기다리고 있어
              </span>
            </div>
          </div>

          {tomorrowMission && tomorrowCategoryMeta ? (
            <div className="opacity-40 blur-[2px]">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: tomorrowCategoryMeta.color }}
                />
                <span className="text-[12px] font-medium text-text-secondary">
                  {tomorrowCategoryMeta.label}
                </span>
              </div>
              <p className="text-[16px] font-bold text-navy">
                {tomorrowMission.title}
              </p>
              <p className="text-[12px] text-text-muted mt-1">
                역할: {tomorrowMission.role}
              </p>
            </div>
          ) : (
            <div className="opacity-0 h-16" />
          )}
        </div>
      </div>
    </div>
  );
}
