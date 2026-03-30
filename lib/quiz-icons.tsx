// Quiz icon map — custom SVGs replacing all emoji usage
// Each icon is 20x20 viewBox, renders at the size specified by className

import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  // ─── Q1: Activity grid (12) ───
  coding: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 9L5 10.5 7 12M13 9l2 1.5-2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 8l-2 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  drawing: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="12" r="5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="10" cy="12" r="2" fill="currentColor" fillOpacity="0.15"/>
      <path d="M10 3v4M6 5l2 3M14 5l-2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 5c2-1 4-1 7 1 3-2 5-2 7-1v11c-2-1-4-1-7 1-3-2-5-2-7-1V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M10 6v11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="4" y="10" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="7" y="5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="2" width="2" height="3" rx="0.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  debate: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M4 5h8a2 2 0 012 2v3a2 2 0 01-2 2H8l-3 2v-2H4a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 14h4a2 2 0 002-2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>
  ),
  organizing: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6 7h8M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  nature: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 17V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10 9C10 5 6 3 6 3s0 6 4 6zM10 11c0-3 4-5 4-5s0 5-4 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  documentary: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="2" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 8l5 3-5 3V8z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  ),
  story: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6 7h8M6 10h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.1"/>
    </svg>
  ),
  puzzle: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 8h3c0-1.5 1-2.5 2.5-2.5S11 6.5 11 8h3v3c1.5 0 2.5 1 2.5 2.5S15.5 16 14 16v1H6v-1c-1.5 0-2.5-1-2.5-2.5S4.5 11 6 11V8H3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  social: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="14" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M2 16c0-3 2.2-5 5-5s5 2 5 5M13 16c0-2.5 1.5-4 3.5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  perform: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="12" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4 17h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M7 3l3 2 3-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // ─── Q2: Behavior patterns ───
  quiet: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 12h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="7.5" cy="8.5" r="1" fill="currentColor"/>
      <circle cx="12.5" cy="8.5" r="1" fill="currentColor"/>
    </svg>
  ),
  talk: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M4 4h12a2 2 0 012 2v6a2 2 0 01-2 2h-4l-3 3v-3H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6 8h8M6 11h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  tryit: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M14 3l-1 5h4l-7 9 1-5H7l7-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08"/>
    </svg>
  ),
  people: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M10 11v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M6 14h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  question: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 8a2 2 0 113 2c0 1-1 1.5-1 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.8" fill="currentColor"/>
    </svg>
  ),

  // ─── Q3: Curiosity triggers ───
  thought: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="15" r="1.5" stroke="currentColor" strokeWidth="1"/>
      <circle cx="6" cy="17.5" r="1" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 17s-7-4.5-7-8.5C3 5.5 5.5 3 7.5 3c1.5 0 2.5 1 2.5 1s1-1 2.5-1c2 0 4.5 2.5 4.5 5.5S10 17 10 17z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.08"/>
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="10" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  person: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3L2 17h16L10 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.8" fill="currentColor"/>
    </svg>
  ),

  // ─── Q4: Difficulty responses ───
  dig: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
      <path d="M10 4v2M10 14v2M4 10h2M14 10h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  different: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M5 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M12 7l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7L5 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ask: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 7l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 15h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  express: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7 12c1 1.5 2.5 2 3 2s2-.5 3-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M7 7l2 1M13 7l-2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  analyze: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 10h14M10 3v14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="7" cy="7" r="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="13" cy="13" r="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),

  // ─── Q5: Energy triggers ───
  star: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3l2.2 4.5 5 .7-3.6 3.5.8 5L10 14.5 5.6 16.7l.8-5L2.8 8.2l5-.7L10 3z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.08"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 2v5M10 13v5M2 10h5M13 10h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M5 5l2 2M13 5l-2 2M5 15l2-2M13 15l-2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  clap: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M6 10l2-6M10 10l1-7M14 10l-1-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M4 12c0 3 2.5 5 6 5s6-2 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  hug: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 16c0-2 1.5-4 3.5-4h5c2 0 3.5 2 3.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 2a5 5 0 00-3 9v2h6v-2a5 5 0 00-3-9z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.06"/>
      <path d="M8 15h4M8.5 17h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),

  // ─── Q7: Free day ───
  map: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8 3v12M12 5v12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  theater: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="7" cy="8" r="4" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="13" cy="8" r="4" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5.5 9.5c.5.8 1 1 1.5 1s1-.2 1.5-1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M11.5 9.5c.3-.5.8-.8 1.5-.8s1.2.3 1.5.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  ),
  crane: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="5" y="10" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 3v7M7 3h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M7 10V7M13 10V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  party: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 17L8 3l9 9-14 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05"/>
      <path d="M12 4l2 2M15 7l2 1M14 12l1 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M12.5 3.5a4 4 0 00-5.3 5.3L4 12l4 4 3.2-3.2a4 4 0 005.3-5.3l-2.5 2.5-2-2 2.5-2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),

  // ─── Result type icons ───
  microscope: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 11v3M6 17h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="10" cy="7" r="1.5" fill="currentColor" fillOpacity="0.15"/>
      <path d="M10 14l-2 3M10 14l2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  masks: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="7" cy="9" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 10.5c.5 1 1 1.5 2 1.5s1.5-.5 2-1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="13" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
    </svg>
  ),
  construct: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="3" y="11" width="14" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="6" y="6" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8" y="3" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <ellipse cx="10" cy="10" rx="3" ry="7" stroke="currentColor" strokeWidth="1"/>
      <path d="M3 10h14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 3v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M4 7l6-2 6 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 7l-1 5h4L6 7M16 7l1 5h-4l1-5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  ),

  // ─── Hub page quiz icons ───
  dna: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M7 3c0 4 6 4 6 8s-6 4-6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M13 3c0 4-6 4-6 8s6 4 6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M5 7h10M5 13h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  crystal: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M10 2l7 6-7 10-7-10 7-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05"/>
      <path d="M3 8h14M7 2l-4 6M13 2l4 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1"/>
      <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
    </svg>
  ),
  hidden: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M4 4h12a2 2 0 012 2v6a2 2 0 01-2 2h-4l-3 3v-3H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="7" cy="9" r="1" fill="currentColor"/>
      <circle cx="10" cy="9" r="1" fill="currentColor"/>
      <circle cx="13" cy="9" r="1" fill="currentColor"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 17V7M7 17V5M11 17V9M15 17V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export function QuizIcon({ name, className }: { name: string; className?: string }) {
  const icon = icons[name];
  if (!icon) return null;
  return <span className={className}>{icon}</span>;
}

export default icons;
