"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { listSessions, getSession, ApiError } from "@/lib/api-client";
import type { GeneratedMirror } from "@/lib/api-client";

// ─── Mirror SVG Illustration ───
function MirrorIllustration() {
  return (
    <svg
      width="180"
      height="220"
      viewBox="0 0 180 220"
      fill="none"
      className="animate-float"
    >
      <defs>
        {/* Mirror glass gradient */}
        <radialGradient id="mirrorGlass" cx="0.5" cy="0.4" r="0.55">
          <stop offset="0%" stopColor="#F5F3EE" stopOpacity="1" />
          <stop offset="35%" stopColor="#EEF0F9" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#E8E6E1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0.15" />
        </radialGradient>
        {/* Warm glow */}
        <radialGradient id="warmGlow" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0%" stopColor="#E8614D" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#D4A853" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#4A5FC1" stopOpacity="0" />
        </radialGradient>
        {/* Frame gradient */}
        <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A853" />
          <stop offset="50%" stopColor="#C49A48" />
          <stop offset="100%" stopColor="#B8903E" />
        </linearGradient>
        {/* Handle gradient */}
        <linearGradient id="handleGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#C49A48" />
          <stop offset="100%" stopColor="#A07830" />
        </linearGradient>
        {/* Light reflection */}
        <linearGradient id="lightReflect" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* Soft figure gradient */}
        <radialGradient id="figureGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4A5FC1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4A5FC1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle ambient glow behind mirror */}
      <ellipse cx="90" cy="85" rx="75" ry="72" fill="url(#warmGlow)" />

      {/* Mirror frame - elegant oval */}
      <ellipse
        cx="90"
        cy="82"
        rx="62"
        ry="70"
        fill="url(#frameGrad)"
        stroke="#B8903E"
        strokeWidth="1"
      />

      {/* Inner mirror glass */}
      <ellipse
        cx="90"
        cy="82"
        rx="55"
        ry="63"
        fill="url(#mirrorGlass)"
      />

      {/* Gentle figure silhouette in the mirror -- abstract child shape */}
      <ellipse cx="90" cy="65" rx="28" ry="30" fill="url(#figureGlow)" />
      {/* Head - soft circle */}
      <circle cx="90" cy="52" r="14" fill="#4A5FC1" opacity="0.07" />
      {/* Shoulders - gentle curves */}
      <path
        d="M68 72 Q78 62 90 62 Q102 62 112 72 Q114 78 112 85 Q102 80 90 80 Q78 80 68 85 Q66 78 68 72Z"
        fill="#4A5FC1"
        opacity="0.05"
      />
      {/* Soft inner light lines - representing thoughts/reflections */}
      <path
        d="M70 90 Q80 85 90 87 Q100 85 110 90"
        stroke="#D4A853"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M74 98 Q82 94 90 95 Q98 94 106 98"
        stroke="#D4A853"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.2"
      />

      {/* Sparkle dots scattered */}
      <circle cx="55" cy="50" r="1.5" fill="#D4A853" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="60" r="1.2" fill="#E8614D" opacity="0.4">
        <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="105" r="1" fill="#4A5FC1" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.8s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="108" cy="42" r="1.3" fill="#D4A853" opacity="0.35">
        <animate attributeName="opacity" values="0.15;0.55;0.15" dur="3.2s" begin="1.2s" repeatCount="indefinite" />
      </circle>

      {/* Light reflection arc */}
      <path
        d="M56 52 Q62 35 78 30"
        stroke="url(#lightReflect)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M60 58 Q64 48 72 44"
        stroke="url(#lightReflect)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />

      {/* Frame decorative details - tiny gold dots on frame edge */}
      <circle cx="90" cy="12" r="2.5" fill="#D4A853" opacity="0.7" />
      <circle cx="38" cy="48" r="2" fill="#D4A853" opacity="0.5" />
      <circle cx="142" cy="48" r="2" fill="#D4A853" opacity="0.5" />
      <circle cx="38" cy="116" r="2" fill="#D4A853" opacity="0.5" />
      <circle cx="142" cy="116" r="2" fill="#D4A853" opacity="0.5" />

      {/* Handle */}
      <rect
        x="83"
        y="150"
        width="14"
        height="48"
        rx="7"
        fill="url(#handleGrad)"
        stroke="#A07830"
        strokeWidth="0.8"
      />
      {/* Handle joint decoration */}
      <ellipse
        cx="90"
        cy="153"
        rx="16"
        ry="5"
        fill="url(#frameGrad)"
        stroke="#B8903E"
        strokeWidth="0.6"
      />
      {/* Handle grip lines */}
      <line x1="86" y1="166" x2="94" y2="166" stroke="#B8903E" strokeWidth="0.6" opacity="0.5" />
      <line x1="86" y1="172" x2="94" y2="172" stroke="#B8903E" strokeWidth="0.6" opacity="0.5" />
      <line x1="86" y1="178" x2="94" y2="178" stroke="#B8903E" strokeWidth="0.6" opacity="0.5" />

      {/* Handle end cap */}
      <ellipse cx="90" cy="198" rx="9" ry="4" fill="#B8903E" opacity="0.8" />
    </svg>
  );
}

// ─── Heart Icon ───
function HeartIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#EEF0F9" />
      <path
        d="M16 25S8 20.5 8 14.5C8 12.0147 10.0147 10 12.5 10C13.9 10 15.15 10.65 16 11.67C16.85 10.65 18.1 10 19.5 10C21.9853 10 24 12.0147 24 14.5C24 20.5 16 25 16 25Z"
        fill="#E8614D"
        opacity="0.8"
      />
    </svg>
  );
}

// ─── Compass/Target Icon ───
function CompassIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#EEF0F9" />
      <circle cx="16" cy="16" r="8" stroke="#4A5FC1" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="16" cy="16" r="4" stroke="#4A5FC1" strokeWidth="1.5" fill="none" opacity="0.8" />
      <circle cx="16" cy="16" r="1.5" fill="#4A5FC1" />
      {/* Cardinal lines */}
      <line x1="16" y1="4" x2="16" y2="8" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="16" y1="24" x2="16" y2="28" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="4" y1="16" x2="8" y2="16" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="24" y1="16" x2="28" y2="16" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ─── Decorative Divider ───
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-border-light" />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 0L7.4 4.6L12 6L7.4 7.4L6 12L4.6 7.4L0 6L4.6 4.6L6 0Z"
          fill="#D4A853"
          opacity="0.5"
        />
      </svg>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-border-light" />
    </div>
  );
}

// ─── Value tag pill ───
const VALUE_TAG_LABELS: Record<string, string> = {
  fairness: "공정성",
  efficiency: "효율",
  safety: "안전",
  adventure: "모험",
  empathy: "공감",
  creativity: "창의성",
  independence: "독립성",
  community: "공동체",
  logic: "논리",
  emotion: "감정",
};

// ─── Mirror data shape extracted from session detail ───
interface MirrorViewData {
  observations: { text: string; valueTags: string[]; tone: string }[];
  patternNote: string | null;
  nextSuggestion: { reason: string; categoryHint: string } | null;
  choiceQuote: string;
}

export default function MirrorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mirrorData, setMirrorData] = useState<MirrorViewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showTitle, setShowTitle] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // Fetch session + mirror data for this mission
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Find the most recent completed session for this mission
        const { sessions } = await listSessions(50);
        const matched = sessions.find((s) => s.missionId === id);
        if (!matched) {
          if (!cancelled) setMirrorData(null);
          return;
        }

        // Get full session detail including mirror
        const detail = await getSession(matched.sessionId);
        if (cancelled) return;

        const mirror = detail.mirror as GeneratedMirror | null;
        if (!mirror) {
          setMirrorData(null);
          return;
        }

        // Extract child's quote from session data
        const session = detail.session as Record<string, unknown>;
        const closingResponse = (session.closingResponse as string) || "";
        const reflectionNote = (session.reflectionNote as string) || "";

        setMirrorData({
          observations: mirror.observations,
          patternNote: mirror.patternNote,
          nextSuggestion: mirror.nextSuggestion,
          choiceQuote:
            closingResponse ||
            reflectionNote ||
            "오늘의 선택을 돌아보는 시간이에요.",
        });
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 401) {
            setError("로그인이 필요해요. 다시 로그인해주세요.");
          } else {
            setError("결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  // Staggered reveal — only start after data is loaded
  useEffect(() => {
    if (loading || !mirrorData) return;
    const timers = [
      setTimeout(() => setShowTitle(true), 300),
      setTimeout(() => setShowQuote(true), 900),
      setTimeout(() => setShowCards(true), 1500),
      setTimeout(() => setShowPattern(true), 2200),
      setTimeout(() => setShowNext(true), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loading, mirrorData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-center space-y-4 animate-fade-in-up">
          <MirrorIllustration />
          <p className="text-sm text-text-muted">거울을 비추는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-center space-y-4 animate-fade-in-up">
          <p className="text-lg font-semibold text-navy">{error}</p>
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

  if (!mirrorData) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-text-muted">결과를 찾을 수 없어요</p>
      </div>
    );
  }

  const observations = mirrorData.observations;
  const choiceQuote = mirrorData.choiceQuote;

  const patternNote =
    mirrorData.patternNote ||
    "아직 패턴을 분석하기엔 이른 것 같아. 미션을 더 해보면 알 수 있을 거야!";

  const nextReason =
    mirrorData.nextSuggestion?.reason ||
    "내일은 또 다른 세계가 기다리고 있어";

  const OBSERVATION_ICONS = [HeartIcon, CompassIcon];

  return (
    <div
      className="min-h-dvh flex flex-col page-enter"
      style={{
        background:
          "linear-gradient(180deg, #FAFAF8 0%, #F8F5F0 30%, #F5F3EE 60%, #FEF0EE08 100%)",
      }}
    >
      {/* Top spacing */}
      <div className="pt-[max(2rem,env(safe-area-inset-top))]" />

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center px-6">
        {/* Mirror illustration */}
        <div className="mb-2">
          <MirrorIllustration />
        </div>

        {/* Title */}
        {showTitle && (
          <div className="text-center animate-fade-in-up">
            <h1
              className="text-2xl font-bold text-navy tracking-tight"
              style={{ fontFeatureSettings: "'palt' 1" }}
            >
              오늘의 거울
            </h1>
          </div>
        )}

        <Divider />

        {/* Quote */}
        {showQuote && (
          <div className="max-w-sm text-center mb-8 animate-fade-in-up">
            <p
              className="text-[15px] leading-relaxed text-text-secondary italic"
              style={{ fontFeatureSettings: "'palt' 1" }}
            >
              <span className="text-gold text-xl font-serif">&ldquo;</span>
              {choiceQuote}
              <span className="text-gold text-xl font-serif">&rdquo;</span>
            </p>
          </div>
        )}

        {/* "오늘 너는" label */}
        {showCards && (
          <div className="w-full max-w-sm animate-fade-in-up">
            <p className="text-sm font-semibold text-text-muted mb-3 tracking-tight">
              오늘 너는
            </p>

            {/* Observation cards */}
            <div className="space-y-3">
              {observations.map((obs, i) => {
                const IconComp = OBSERVATION_ICONS[i] || OBSERVATION_ICONS[0];
                return (
                  <div
                    key={i}
                    className="
                      bg-card-bg rounded-2xl p-4
                      border-l-[3px] border-indigo
                      shadow-sm
                      animate-fade-in-up
                    "
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <IconComp />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-navy leading-relaxed">
                          {obs.text}
                        </p>
                        {/* Value tag pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {obs.valueTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-light text-indigo"
                            >
                              {VALUE_TAG_LABELS[tag] || tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pattern note */}
        {showPattern && (
          <div className="w-full max-w-sm mt-6 animate-fade-in-up">
            <div className="rounded-2xl bg-bg-warm p-4">
              <p className="text-xs font-semibold text-gold mb-1.5">
                지난주와 비교하면
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {patternNote}
              </p>
            </div>
          </div>
        )}

        {/* Next suggestion */}
        {showNext && (
          <div className="w-full max-w-sm mt-5 animate-fade-in-up">
            <div className="flex items-start gap-2 px-1">
              <span className="text-lg mt-0.5">🌍</span>
              <p className="text-[13px] text-text-muted leading-relaxed">
                내일의 세계가 기다리고 있어!
                <br />
                <span className="text-text-secondary">{nextReason}</span>
              </p>
            </div>
          </div>
        )}

        {/* Spacer before button */}
        <div className="flex-1 min-h-8" />

        {/* Home button */}
        {showNext && (
          <div className="pb-[max(2rem,env(safe-area-inset-bottom))] animate-fade-in-up">
            <Link
              href="/home"
              className="
                inline-flex items-center gap-2 px-8 py-3.5
                rounded-full border-2 border-border-light
                text-navy font-semibold text-[15px]
                bg-card-bg hover:bg-bg-warm
                transition-all duration-300 tap-highlight
                shadow-sm
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
