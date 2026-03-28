"use client";

import { use } from "react";
import Link from "next/link";
import { getMissionById } from "@/lib/dummy-data";
import { CATEGORY_META, DIFFICULTY_LABELS } from "@/lib/types";

// ─── Mars Dome Illustration ───

function MarsDomeIllustration() {
  return (
    <svg
      viewBox="0 0 400 360"
      width="400"
      height="360"
      className="w-full max-w-[340px] mx-auto drop-shadow-2xl"
      aria-hidden="true"
    >
      <defs>
        {/* Sky gradient */}
        <radialGradient id="mars-sky" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2B1A2E" />
          <stop offset="40%" stopColor="#4A1A28" />
          <stop offset="70%" stopColor="#7A2E30" />
          <stop offset="100%" stopColor="#1A0E14" />
        </radialGradient>

        {/* Planet surface gradient */}
        <linearGradient id="mars-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B3A2A" />
          <stop offset="40%" stopColor="#6B2A1E" />
          <stop offset="100%" stopColor="#4A1A12" />
        </linearGradient>

        {/* Dome glass gradient */}
        <radialGradient id="dome-glass" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(180,220,255,0.25)" />
          <stop offset="50%" stopColor="rgba(120,180,240,0.12)" />
          <stop offset="100%" stopColor="rgba(80,140,200,0.05)" />
        </radialGradient>

        {/* Dome inner glow */}
        <radialGradient id="dome-inner-glow" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="rgba(120,255,180,0.35)" />
          <stop offset="50%" stopColor="rgba(80,200,140,0.15)" />
          <stop offset="100%" stopColor="rgba(40,120,80,0.0)" />
        </radialGradient>

        {/* Atmospheric haze */}
        <radialGradient id="atmo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232,97,77,0.3)" />
          <stop offset="60%" stopColor="rgba(232,97,77,0.08)" />
          <stop offset="100%" stopColor="rgba(232,97,77,0)" />
        </radialGradient>

        {/* Dome structural highlight */}
        <linearGradient id="dome-highlight" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="rgba(200,230,255,0.3)" />
          <stop offset="100%" stopColor="rgba(200,230,255,0)" />
        </linearGradient>

        {/* Building window glow */}
        <linearGradient id="window-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFEB8A" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>

        {/* Dust particle */}
        <radialGradient id="dust-particle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(210,140,100,0.6)" />
          <stop offset="100%" stopColor="rgba(210,140,100,0)" />
        </radialGradient>

        {/* Star glow filter */}
        <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dome glow filter */}
        <filter id="dome-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Building shadow */}
        <filter id="building-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      {/* Background sky */}
      <rect width="400" height="360" fill="url(#mars-sky)" rx="20" />

      {/* Stars - scattered across the sky */}
      <g filter="url(#star-glow)">
        {/* Twinkling stars with different animation delays */}
        <circle cx="45" cy="35" r="1.2" fill="#fff" opacity="0.9" className="animate-breathe" style={{ animationDelay: "0s" }} />
        <circle cx="120" cy="22" r="0.8" fill="#fff" opacity="0.7" className="animate-breathe" style={{ animationDelay: "0.5s" }} />
        <circle cx="190" cy="50" r="1" fill="#FFF5CC" opacity="0.85" className="animate-breathe" style={{ animationDelay: "1.2s" }} />
        <circle cx="260" cy="18" r="1.3" fill="#fff" opacity="0.95" className="animate-breathe" style={{ animationDelay: "0.3s" }} />
        <circle cx="340" cy="42" r="0.9" fill="#fff" opacity="0.6" className="animate-breathe" style={{ animationDelay: "1.8s" }} />
        <circle cx="78" cy="68" r="0.7" fill="#CCE0FF" opacity="0.75" className="animate-breathe" style={{ animationDelay: "2.1s" }} />
        <circle cx="310" cy="65" r="1.1" fill="#fff" opacity="0.8" className="animate-breathe" style={{ animationDelay: "0.8s" }} />
        <circle cx="365" cy="15" r="0.6" fill="#FFF5CC" opacity="0.65" className="animate-breathe" style={{ animationDelay: "1.5s" }} />
        <circle cx="155" cy="15" r="0.9" fill="#fff" opacity="0.7" className="animate-breathe" style={{ animationDelay: "2.5s" }} />
        <circle cx="30" cy="90" r="0.5" fill="#CCE0FF" opacity="0.5" className="animate-breathe" style={{ animationDelay: "1s" }} />
        <circle cx="380" cy="88" r="0.8" fill="#fff" opacity="0.6" className="animate-breathe" style={{ animationDelay: "0.7s" }} />
        <circle cx="225" cy="30" r="1.5" fill="#FFF8DC" opacity="0.9" className="animate-breathe" style={{ animationDelay: "1.9s" }} />
      </g>

      {/* Distant Phobos moon */}
      <circle cx="320" cy="55" r="8" fill="#9A7A6A" opacity="0.6" />
      <circle cx="318" cy="53" r="2" fill="#7A5A4A" opacity="0.4" />
      <circle cx="323" cy="57" r="1.5" fill="#7A5A4A" opacity="0.3" />

      {/* Atmospheric glow around the horizon */}
      <ellipse cx="200" cy="230" rx="220" ry="80" fill="url(#atmo-glow)" />

      {/* Mars terrain - rolling hills */}
      <path
        d="M0 240 Q40 220 80 228 Q120 236 160 225 Q200 214 240 222 Q280 230 320 218 Q360 206 400 215 L400 360 L0 360 Z"
        fill="url(#mars-ground)"
      />

      {/* Terrain texture lines */}
      <path d="M0 255 Q100 248 200 252 Q300 256 400 250" stroke="#5A2218" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M0 275 Q80 270 180 273 Q280 276 400 268" stroke="#5A2218" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M0 295 Q120 288 200 292 Q320 296 400 290" stroke="#5A2218" strokeWidth="0.5" fill="none" opacity="0.2" />

      {/* Distant mountains */}
      <path
        d="M-10 240 L30 195 L55 215 L85 188 L110 210 L140 180 L175 215 L200 192 L230 218 L260 185 L290 208 L325 175 L355 205 L380 190 L410 240 Z"
        fill="#5A2218"
        opacity="0.5"
      />

      {/* Dome base platform */}
      <ellipse cx="200" cy="248" rx="130" ry="18" fill="#3A1610" opacity="0.6" />

      {/* The great dome - outer shell */}
      <ellipse
        cx="200"
        cy="248"
        rx="120"
        ry="105"
        fill="url(#dome-glass)"
        stroke="rgba(140,190,240,0.25)"
        strokeWidth="1.5"
        clipPath="inset(0 0 50% 0)"
      />
      <path
        d="M80 248 Q80 143 200 143 Q320 143 320 248"
        fill="url(#dome-glass)"
        stroke="rgba(140,190,240,0.3)"
        strokeWidth="2"
      />

      {/* Dome structural ribs */}
      <path d="M200 143 L200 248" stroke="rgba(140,190,240,0.15)" strokeWidth="1" />
      <path d="M140 160 Q200 143 260 160" stroke="rgba(140,190,240,0.12)" strokeWidth="0.8" fill="none" />
      <path d="M110 185 Q200 155 290 185" stroke="rgba(140,190,240,0.12)" strokeWidth="0.8" fill="none" />
      <path d="M92 210 Q200 172 308 210" stroke="rgba(140,190,240,0.1)" strokeWidth="0.8" fill="none" />
      <path d="M84 235 Q200 195 316 235" stroke="rgba(140,190,240,0.08)" strokeWidth="0.8" fill="none" />

      {/* Dome meridian ribs */}
      <path d="M140 248 Q145 170 200 143" stroke="rgba(140,190,240,0.1)" strokeWidth="0.8" fill="none" />
      <path d="M260 248 Q255 170 200 143" stroke="rgba(140,190,240,0.1)" strokeWidth="0.8" fill="none" />
      <path d="M110 248 Q120 185 200 143" stroke="rgba(140,190,240,0.08)" strokeWidth="0.6" fill="none" />
      <path d="M290 248 Q280 185 200 143" stroke="rgba(140,190,240,0.08)" strokeWidth="0.6" fill="none" />

      {/* Dome highlight reflection */}
      <path
        d="M150 175 Q200 153 230 168"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Inner dome glow (greenery light) */}
      <ellipse
        cx="200"
        cy="230"
        rx="95"
        ry="50"
        fill="url(#dome-inner-glow)"
        className="animate-breathe"
        filter="url(#dome-glow-filter)"
      />

      {/* ─── City inside the dome ─── */}
      <g filter="url(#building-shadow)">
        {/* Central tower / HQ */}
        <rect x="188" y="195" width="24" height="53" rx="2" fill="#3A4A6A" />
        <rect x="190" y="197" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="196" y="197" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="202" y="197" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="190" y="203" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.6" />
        <rect x="196" y="203" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="202" y="203" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.75" />
        <rect x="190" y="209" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.8" />
        <rect x="196" y="209" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.65" />
        <rect x="202" y="209" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="190" y="215" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="196" y="215" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="202" y="215" width="4" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.6" />
        {/* Antenna on central tower */}
        <line x1="200" y1="195" x2="200" y2="184" stroke="#5A6A8A" strokeWidth="1.5" />
        <circle cx="200" cy="182" r="2" fill="#FF6A5A" opacity="0.9" className="animate-breathe" />

        {/* Left building cluster */}
        <rect x="138" y="218" width="20" height="30" rx="2" fill="#4A5A7A" />
        <rect x="140" y="220" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.8" />
        <rect x="145" y="220" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.6" />
        <rect x="150" y="220" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="140" y="226" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="145" y="226" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="150" y="226" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.55" />
        <rect x="140" y="232" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="145" y="232" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.65" />
        <rect x="150" y="232" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.8" />

        {/* Left short building */}
        <rect x="118" y="228" width="16" height="20" rx="2" fill="#3A4A68" />
        <rect x="120" y="230" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="125" y="230" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="120" y="235" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.6" />
        <rect x="125" y="235" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.9" />

        {/* Right building cluster */}
        <rect x="240" y="215" width="22" height="33" rx="2" fill="#4A5878" />
        <rect x="242" y="217" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.75" />
        <rect x="248" y="217" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="254" y="217" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.6" />
        <rect x="242" y="223" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="248" y="223" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="254" y="223" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="242" y="229" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.65" />
        <rect x="248" y="229" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.8" />
        <rect x="254" y="229" width="3.5" height="3" rx="0.5" fill="url(#window-glow)" opacity="0.55" />

        {/* Right short building */}
        <rect x="266" y="225" width="18" height="23" rx="2" fill="#3A486A" />
        <rect x="268" y="227" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.8" />
        <rect x="273" y="227" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.65" />
        <rect x="278" y="227" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.9" />
        <rect x="268" y="232" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.7" />
        <rect x="273" y="232" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.85" />
        <rect x="278" y="232" width="3" height="2.5" rx="0.5" fill="url(#window-glow)" opacity="0.55" />

        {/* Small dome greenhouse - left */}
        <path d="M160 248 Q160 235 175 235 Q190 235 190 248" fill="rgba(100,200,140,0.2)" stroke="rgba(140,220,170,0.3)" strokeWidth="0.8" />
        <ellipse cx="175" cy="244" rx="10" ry="4" fill="rgba(80,180,120,0.25)" />

        {/* Small dome greenhouse - right */}
        <path d="M215 248 Q215 237 228 237 Q241 237 241 248" fill="rgba(100,200,140,0.2)" stroke="rgba(140,220,170,0.3)" strokeWidth="0.8" />
        <ellipse cx="228" cy="244" rx="8" ry="3" fill="rgba(80,180,120,0.25)" />
      </g>

      {/* Greenery patches inside dome */}
      <ellipse cx="165" cy="246" rx="15" ry="3" fill="rgba(60,160,90,0.3)" />
      <ellipse cx="235" cy="246" rx="12" ry="3" fill="rgba(60,160,90,0.25)" />

      {/* Connection tubes between buildings */}
      <path d="M158 240 L188 240" stroke="rgba(120,140,180,0.3)" strokeWidth="2" strokeLinecap="round" />
      <path d="M212 238 L240 238" stroke="rgba(120,140,180,0.3)" strokeWidth="2" strokeLinecap="round" />

      {/* ─── Dust particles floating outside the dome ─── */}
      <g className="animate-float" style={{ animationDelay: "0s" }}>
        <circle cx="50" cy="200" r="3" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "0.8s" }}>
        <circle cx="350" cy="180" r="2.5" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "1.5s" }}>
        <circle cx="65" cy="170" r="2" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "0.4s" }}>
        <circle cx="340" cy="210" r="3.5" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "2s" }}>
        <circle cx="30" cy="230" r="2" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "1.2s" }}>
        <circle cx="370" cy="150" r="2.8" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "0.6s" }}>
        <circle cx="55" cy="140" r="1.8" fill="url(#dust-particle)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "1.8s" }}>
        <circle cx="360" cy="240" r="2.2" fill="url(#dust-particle)" />
      </g>

      {/* Ground-level rocks and debris */}
      <ellipse cx="60" cy="270" rx="8" ry="4" fill="#5A2A18" opacity="0.6" />
      <ellipse cx="340" cy="265" rx="6" ry="3" fill="#5A2A18" opacity="0.5" />
      <ellipse cx="95" cy="280" rx="5" ry="2.5" fill="#5A2A18" opacity="0.4" />
      <ellipse cx="310" cy="278" rx="7" ry="3.5" fill="#5A2A18" opacity="0.45" />
      <ellipse cx="150" cy="290" rx="4" ry="2" fill="#5A2A18" opacity="0.3" />
      <ellipse cx="250" cy="285" rx="5" ry="2" fill="#5A2A18" opacity="0.35" />

      {/* Subtle dust storm wisp on the horizon */}
      <path
        d="M0 230 Q60 218 120 225 Q180 232 240 220 Q300 208 360 218 Q390 223 400 220"
        stroke="rgba(200,130,90,0.15)"
        strokeWidth="3"
        fill="none"
        className="animate-breathe"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Landing pad */}
      <g>
        <ellipse cx="60" cy="252" rx="18" ry="6" fill="rgba(80,80,100,0.3)" stroke="rgba(120,120,140,0.3)" strokeWidth="0.8" />
        <line x1="55" y1="252" x2="65" y2="252" stroke="rgba(200,200,220,0.3)" strokeWidth="0.5" />
        <line x1="60" y1="249" x2="60" y2="255" stroke="rgba(200,200,220,0.3)" strokeWidth="0.5" />
      </g>

      {/* Subtle vignette overlay */}
      <rect
        width="400"
        height="360"
        rx="20"
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="40"
        opacity="0.4"
        style={{ mixBlendMode: "multiply" } as React.CSSProperties}
      />
    </svg>
  );
}

// ─── Generic world illustration placeholder ───

function GenericWorldIllustration({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 400 360"
      width="400"
      height="360"
      className="w-full max-w-[340px] mx-auto drop-shadow-2xl"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gen-sky" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="gen-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="360" fill="url(#gen-sky)" rx="20" />
      <circle cx="200" cy="160" r="60" fill="url(#gen-glow)" className="animate-breathe" />
      <text x="200" y="170" textAnchor="middle" fontSize="48" fill={color} opacity="0.6">
        ?
      </text>
    </svg>
  );
}

// ─── Main Page Component ───

export default function MissionIntroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mission = getMissionById(id);

  if (!mission) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-cream">
        <div className="text-center space-y-4 animate-fade-in-up">
          <p className="text-5xl">🪐</p>
          <p className="text-lg font-semibold text-navy">
            미션을 찾을 수 없어요
          </p>
          <Link
            href="/home"
            className="inline-block text-sm text-coral underline underline-offset-4"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const categoryMeta = CATEGORY_META[mission.category];
  const difficultyLabel = DIFFICULTY_LABELS[mission.difficulty];
  const isMars = mission.id === "mission-mars-mayor";

  return (
    <div
      className="relative min-h-dvh overflow-hidden page-enter"
      style={{
        background: `linear-gradient(
          180deg,
          ${categoryMeta.color}08 0%,
          ${categoryMeta.color}04 30%,
          var(--bg-cream) 60%
        )`,
      }}
    >
      {/* ─── Top Bar ─── */}
      <header
        className="relative z-20 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2 opacity-0 animate-fade-in"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        <Link
          href="/home"
          className="flex items-center gap-1 text-text-secondary tap-highlight rounded-full p-2 -ml-2 hover:bg-black/5 transition-colors"
          aria-label="뒤로 가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Category badge */}
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            color: categoryMeta.color,
            backgroundColor: categoryMeta.lightBg,
          }}
        >
          {categoryMeta.icon} {categoryMeta.label}
        </span>
      </header>

      {/* ─── Illustration ─── */}
      <section
        className="relative z-10 px-4 pt-2 pb-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <div className="animate-float" style={{ animationDuration: "5s" }}>
          {isMars ? (
            <MarsDomeIllustration />
          ) : (
            <GenericWorldIllustration color={categoryMeta.color} />
          )}
        </div>
      </section>

      {/* ─── Narrative Content ─── */}
      <section className="relative z-10 px-6 pb-8">
        {/* Era + Location */}
        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, ${categoryMeta.color}40, transparent)` }}
            />
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: categoryMeta.color }}
            >
              {mission.worldSetting.era}, {mission.worldSetting.location}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, ${categoryMeta.color}40, transparent)` }}
            />
          </div>
        </div>

        {/* Backdrop description */}
        <p
          className="text-center text-sm text-text-muted leading-relaxed mt-3 mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "700ms", animationFillMode: "forwards" }}
        >
          {mission.worldSetting.backdrop}
        </p>

        {/* Decorative divider */}
        <div
          className="flex justify-center mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "900ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: categoryMeta.color, opacity: 0.3 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryMeta.color, opacity: 0.5 }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryMeta.color, opacity: 0.7 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryMeta.color, opacity: 0.5 }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: categoryMeta.color, opacity: 0.3 }} />
          </div>
        </div>

        {/* Role reveal — the dramatic moment */}
        <h1
          className="text-center text-2xl font-bold text-navy leading-snug mb-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1100ms", animationFillMode: "forwards" }}
        >
          너는 이 도시의{" "}
          <span style={{ color: categoryMeta.color }}>{mission.role}</span>
          이야.
        </h1>
        <p
          className="text-center text-lg font-semibold text-navy/80 mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1300ms", animationFillMode: "forwards" }}
        >
          {mission.title}
        </p>

        {/* Situation text — paragraph that fades in */}
        <div
          className="bg-card-bg/80 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-border-light opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1600ms", animationFillMode: "forwards" }}
        >
          <p className="text-[15px] text-text-secondary leading-[1.75] whitespace-pre-line">
            {mission.situation}
          </p>
        </div>

        {/* Core question — the hook */}
        <div
          className="rounded-2xl p-5 mb-8 opacity-0 animate-fade-in-up"
          style={{
            animationDelay: "1900ms",
            animationFillMode: "forwards",
            backgroundColor: `${categoryMeta.color}0A`,
            border: `1px solid ${categoryMeta.color}20`,
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: categoryMeta.color }}>
            첫 번째 질문
          </p>
          <p className="text-[15px] font-medium text-navy leading-[1.7]">
            {mission.coreQuestion}
          </p>
        </div>

        {/* ─── CTA Button ─── */}
        <div
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "2200ms", animationFillMode: "forwards" }}
        >
          <Link
            href={`/mission/${id}/play`}
            className="block w-full text-center text-white font-semibold text-lg py-4 rounded-xl tap-highlight transition-all duration-200 active:scale-[0.97]"
            style={{
              backgroundColor: "var(--coral)",
              boxShadow: `0 4px 24px rgba(232, 97, 77, 0.3), 0 0 0 0 rgba(232, 97, 77, 0)`,
              animation: "ctaGlow 2.5s ease-in-out infinite",
            }}
          >
            미션 시작하기
          </Link>
        </div>

        {/* ─── Meta tags ─── */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mt-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "2500ms", animationFillMode: "forwards" }}
        >
          <span className="text-xs text-text-muted bg-bg-warm px-3 py-1 rounded-full">
            {difficultyLabel}
          </span>
          {mission.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-muted bg-bg-warm px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
          <span className="text-xs text-text-muted bg-bg-warm px-3 py-1 rounded-full">
            ~{mission.estimatedMinutes}분
          </span>
        </div>

        {/* Age range note */}
        <p
          className="text-center text-[11px] text-text-muted mt-3 opacity-0 animate-fade-in"
          style={{ animationDelay: "2600ms", animationFillMode: "forwards" }}
        >
          {mission.ageRange[0]}~{mission.ageRange[1]}세 추천
        </p>

        {/* Bottom safe area spacer */}
        <div className="h-8" />
      </section>

      {/* ─── CTA Glow Keyframes ─── */}
      <style>{`
        @keyframes ctaGlow {
          0%, 100% {
            box-shadow: 0 4px 24px rgba(232, 97, 77, 0.25), 0 0 0 0 rgba(232, 97, 77, 0);
          }
          50% {
            box-shadow: 0 4px 32px rgba(232, 97, 77, 0.4), 0 0 40px 4px rgba(232, 97, 77, 0.12);
          }
        }
      `}</style>
    </div>
  );
}
