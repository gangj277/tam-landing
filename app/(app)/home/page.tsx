"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getTodayMission,
  PAST_SESSIONS,
  SEOYEON_PROFILE,
  MISSIONS,
} from "@/lib/dummy-data";
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

/* ─── Component ─── */

export default function HomePage() {
  const todayMission = getTodayMission();
  const profile = SEOYEON_PROFILE;
  const categoryMeta = CATEGORY_META[todayMission.category as MissionCategory];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tomorrow's mission (locked teaser)
  const tomorrowMission = MISSIONS[1];
  const tomorrowCategoryMeta = CATEGORY_META[tomorrowMission.category as MissionCategory];

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
              안녕, 서연
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
              {profile.stats.currentStreak}일째
            </p>
            <p className="text-[10px] text-text-muted">탐험 중!</p>
          </div>
        </div>
      </div>

      {/* ── Today's Mission Card (Hero) ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up delay-200" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-2.5">
          오늘의 미션
        </p>

        <Link href={`/mission/${todayMission.id}`} className="block tap-highlight">
          <div className="bg-card-bg rounded-2xl shadow-lg shadow-black/[0.06] border border-border-light overflow-hidden">
            {/* Category color band */}
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(90deg, ${categoryMeta.color}, ${categoryMeta.color}88, ${categoryMeta.color}44)`,
              }}
            />

            {/* Mars Illustration */}
            <div className="px-4 pt-3">
              <MarsCitySVG />
            </div>

            {/* Mission Content */}
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

              {/* CTA Button */}
              <button className="w-full bg-coral text-white font-bold text-[15px] py-3.5 rounded-xl active:bg-coral-hover transition-colors">
                세계에 들어가기
              </button>

              {/* Tags + Time */}
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
      </div>

      {/* ── Past Missions ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up delay-400" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <p className="text-[12px] font-semibold text-text-muted uppercase tracking-widest mb-3">
          완료한 탐험
        </p>

        <div className="flex flex-col gap-2.5">
          {PAST_SESSIONS.map((session, idx) => {
            const sessCategoryMeta =
              CATEGORY_META[session.category as MissionCategory];
            return (
              <div
                key={session.missionId}
                className={`flex items-center gap-3.5 bg-card-bg rounded-2xl px-4 py-3.5 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
                style={{
                  animationDelay: `${500 + idx * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <CheckSVG color={sessCategoryMeta.color} />

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-navy truncate">
                    {session.title}
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

      {/* ── Tomorrow Teaser (Locked) ── */}
      <div
        className={`${mounted ? "animate-fade-in-up delay-700" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <div className="relative bg-bg-warm rounded-2xl px-5 py-4 border border-border-light overflow-hidden">
          {/* Frosted overlay */}
          <div className="absolute inset-0 bg-bg-warm/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-card-bg/80 rounded-xl px-4 py-2.5 shadow-sm border border-border-light">
              <LockSVG />
              <span className="text-[13px] font-semibold text-text-muted">
                내일 열리는 미션
              </span>
            </div>
          </div>

          {/* Blurred content behind */}
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
        </div>
      </div>
    </div>
  );
}
