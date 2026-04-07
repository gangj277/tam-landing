"use client";

import { useId } from "react";

type Tone = "light" | "dark";
type Size = "sm" | "md" | "lg";

type TamLogoProps = {
  tone?: Tone;
  size?: Size;
  markOnly?: boolean;
  className?: string;
};

const SIZE_MAP = {
  sm: {
    icon: 34,
    gap: "gap-2.5",
    hangul: "text-[16px]",
    latin: "text-[8px]",
  },
  md: {
    icon: 40,
    gap: "gap-3",
    hangul: "text-[18px]",
    latin: "text-[9px]",
  },
  lg: {
    icon: 48,
    gap: "gap-3.5",
    hangul: "text-[22px]",
    latin: "text-[10px]",
  },
} satisfies Record<
  Size,
  {
    icon: number;
    gap: string;
    hangul: string;
    latin: string;
  }
>;

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function TamLogoMark({
  tone = "light",
  size = 40,
  className,
}: {
  tone?: Tone;
  size?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");

  const palette =
    tone === "dark"
      ? {
          shellStart: "#FBF7F1",
          shellEnd: "#F2EBE1",
          shellStroke: "rgba(26,26,46,0.10)",
          innerStart: "#1F2136",
          innerEnd: "#141521",
          frameStroke: "rgba(26,26,46,0.14)",
          stemStart: "#5F74DB",
          stemEnd: "#3D4EA5",
          barStart: "#F06E58",
          barEnd: "#D85642",
          spark: "#D4A853",
          highlight: "rgba(255,255,255,0.72)",
          shadow: "rgba(13, 14, 25, 0.18)",
        }
      : {
          shellStart: "#1F2136",
          shellEnd: "#141521",
          shellStroke: "rgba(255,255,255,0.12)",
          innerStart: "#F8F4EE",
          innerEnd: "#EFE8DE",
          frameStroke: "rgba(255,255,255,0.10)",
          stemStart: "#5F74DB",
          stemEnd: "#3D4EA5",
          barStart: "#F06E58",
          barEnd: "#D85642",
          spark: "#D4A853",
          highlight: "rgba(255,255,255,0.60)",
          shadow: "rgba(10, 11, 20, 0.18)",
        };

  const shadowId = `${id}-shadow`;
  const shellGradientId = `${id}-shell`;
  const innerGradientId = `${id}-inner`;
  const stemGradientId = `${id}-stem`;
  const barGradientId = `${id}-bar`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter id={shadowId} x="0" y="0" width="72" height="72" filterUnits="userSpaceOnUse">
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0.08 0"
          />
        </filter>
        <linearGradient id={shellGradientId} x1="12" y1="10" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.shellStart} />
          <stop offset="1" stopColor={palette.shellEnd} />
        </linearGradient>
        <linearGradient id={innerGradientId} x1="20" y1="18" x2="49" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.innerStart} />
          <stop offset="1" stopColor={palette.innerEnd} />
        </linearGradient>
        <linearGradient id={stemGradientId} x1="31" y1="18" x2="41" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.stemStart} />
          <stop offset="1" stopColor={palette.stemEnd} />
        </linearGradient>
        <linearGradient id={barGradientId} x1="18" y1="28" x2="53" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.barStart} />
          <stop offset="1" stopColor={palette.barEnd} />
        </linearGradient>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <path
          d="M21 8H40.5C53 8 62 17 62 29.5V41.5C62 53.4 52.4 63 40.5 63H30C17.8 63 8 53.2 8 41V21C8 13.8 13.8 8 21 8Z"
          fill={`url(#${shellGradientId})`}
        />
      </g>

      <path
        d="M21 8H40.5C53 8 62 17 62 29.5V41.5C62 53.4 52.4 63 40.5 63H30C17.8 63 8 53.2 8 41V21C8 13.8 13.8 8 21 8Z"
        stroke={palette.shellStroke}
      />

      <path
        d="M35.5 16C26.8 16 20 22.9 20 31.7V46C20 47.7 21.3 49 23 49H48C49.7 49 51 47.7 51 46V31.7C51 22.9 44.2 16 35.5 16Z"
        fill={`url(#${innerGradientId})`}
      />
      <path
        d="M35.5 16C26.8 16 20 22.9 20 31.7V46C20 47.7 21.3 49 23 49H48C49.7 49 51 47.7 51 46V31.7C51 22.9 44.2 16 35.5 16Z"
        stroke={palette.frameStroke}
      />

      <rect x="31" y="20" width="10" height="29" rx="5" fill={`url(#${stemGradientId})`} />
      <rect x="18" y="28" width="36" height="9.5" rx="4.75" fill={`url(#${barGradientId})`} />

      <path
        d="M54.5 14.5L56.1 18.9L60.5 20.5L56.1 22.1L54.5 26.5L52.9 22.1L48.5 20.5L52.9 18.9L54.5 14.5Z"
        fill={palette.spark}
      />

      <path
        d="M16 15.5C19.2 12.7 23.3 11.1 27.8 11.1"
        stroke={palette.highlight}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M15.5 53.5C20.7 58.3 28 61 35.7 61"
        stroke={palette.highlight}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.2"
      />
      <path
        d="M35.5 16C26.8 16 20 22.9 20 31.7V46C20 47.7 21.3 49 23 49H48"
        stroke={palette.shadow}
        strokeWidth="1"
        opacity="0.16"
      />
    </svg>
  );
}

export default function TamLogo({
  tone = "light",
  size = "md",
  markOnly = false,
  className,
}: TamLogoProps) {
  const sizing = SIZE_MAP[size];
  const colors =
    tone === "dark"
      ? {
          primary: "text-white/95",
          secondary: "text-white/48",
        }
      : {
          primary: "text-navy",
          secondary: "text-text-muted/75",
        };

  if (markOnly) {
    return (
      <TamLogoMark
        tone={tone}
        size={sizing.icon}
        className={joinClasses("shrink-0", className)}
      />
    );
  }

  return (
    <div className={joinClasses("inline-flex items-center", sizing.gap, className)}>
      <TamLogoMark tone={tone} size={sizing.icon} className="shrink-0" />
      <div className="flex flex-col leading-none">
        <span
          className={joinClasses(
            sizing.hangul,
            "font-black tracking-[-0.08em]",
            colors.primary,
          )}
        >
          탐
        </span>
        <span
          className={joinClasses(
            sizing.latin,
            "mt-1 font-semibold tracking-[0.22em] uppercase",
            colors.secondary,
          )}
        >
          TAM
        </span>
      </div>
    </div>
  );
}
