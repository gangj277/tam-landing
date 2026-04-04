"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFamilyMe, createSession, createDeepDive, ApiError } from "@/lib/api-client";
import { CATEGORY_META } from "@/lib/types";
import type { MissionCategory } from "@/lib/types";

const ADMIN_PHONES = ["010-8915-3814", "01089153814", "010-89153814", "01012345678", "010-1234-5678"];

interface MissionItem {
  id: string;
  title: string;
  role: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
}

interface DeepDiveItem {
  missionId: string;
  expertName: string;
  expertRole: string;
  expertOrg: string;
  title: string;
  caseHeadline: string;
}

export default function AdminTestPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [deepDives, setDeepDives] = useState<DeepDiveItem[]>([]);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const family = await getFamilyMe();
        // Check if admin phone
        const normalizedPhone = family.ownerPhone.replace(/-/g, "");
        if (!ADMIN_PHONES.some(p => p.replace(/-/g, "") === normalizedPhone)) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);

        // Fetch all missions
        const res = await fetch("/api/missions", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setMissions(data.missions ?? []);
        }

        // Fetch deep-dive list from hardcoded data (load from a special endpoint)
        const ddRes = await fetch("/api/admin/test-data", { credentials: "include" });
        if (ddRes.ok) {
          const ddData = await ddRes.json();
          setDeepDives(ddData.deepDives ?? []);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleStartMission = async (missionId: string) => {
    setCreating(missionId);
    try {
      const result = await createSession(missionId);
      window.location.href = `/mission/${missionId}/play`;
    } catch (err) {
      alert(err instanceof Error ? err.message : "세션 생성 실패");
    } finally {
      setCreating(null);
    }
  };

  const handleStartDeepDive = async (missionId: string) => {
    setCreating(`dd-${missionId}`);
    try {
      // Create a session first, then link the deep dive to it
      const session = await createSession(missionId);
      const result = await createDeepDive(missionId, session.sessionId);
      window.location.href = `/mission/${missionId}/deepdive?dd=${result.deepDiveId}`;
    } catch (err) {
      alert(err instanceof Error ? err.message : "딥다이브 생성 실패");
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-cream">
        <p className="text-text-muted text-[14px]">로딩 중...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-cream px-6">
        <div className="text-center">
          <p className="text-[16px] font-bold text-navy mb-2">접근 권한이 없습니다</p>
          <p className="text-[13px] text-text-muted">관리자 계정으로 로그인해주세요.</p>
          <Link href="/login" className="mt-4 inline-block text-[14px] text-coral font-semibold">로그인 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-cream pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-[22px] font-bold text-navy tracking-[-0.03em]">테스트 센터</h1>
        <p className="text-[13px] text-text-muted mt-1">모든 미션과 딥다이브를 바로 테스트할 수 있어요</p>
      </div>

      {/* Missions Section */}
      <div className="px-5 mb-8">
        <h2 className="text-[15px] font-bold text-navy mb-3 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#4A5FC1" strokeWidth="1.5" />
            <path d="M9 5v4l3 2" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          미션 ({missions.length})
        </h2>
        <div className="space-y-2.5">
          {missions.map((m) => {
            const meta = CATEGORY_META[m.category as MissionCategory];
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-border-light px-4 py-3.5 flex items-center gap-3"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
              >
                <div
                  className="w-2 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta?.color ?? "#4A5FC1" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-navy truncate">{m.title}</p>
                  <p className="text-[11px] text-text-muted">{m.role} · {meta?.label ?? m.category} · {m.estimatedMinutes}분</p>
                </div>
                <button
                  onClick={() => handleStartMission(m.id)}
                  disabled={creating === m.id}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-coral active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {creating === m.id ? "..." : "플레이"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dives Section */}
      <div className="px-5">
        <h2 className="text-[15px] font-bold text-navy mb-3 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3C6 1 3 2 2 4v10c1-2 4-3 7-1 3-2 6-1 7 1V4c-1-2-4-3-7-1z" stroke="#E8614D" strokeWidth="1.3" fill="none" />
          </svg>
          딥다이브 ({deepDives.length})
        </h2>
        <div className="space-y-2.5">
          {deepDives.map((dd) => (
            <div
              key={dd.missionId}
              className="bg-white rounded-xl border border-border-light px-4 py-3.5 flex items-center gap-3"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
            >
              <div className="w-2 h-8 rounded-full flex-shrink-0 bg-indigo" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-navy truncate">{dd.title}</p>
                <p className="text-[11px] text-text-muted">{dd.expertName} · {dd.expertRole} · {dd.expertOrg}</p>
                <p className="text-[11px] text-text-muted/70 truncate">{dd.caseHeadline}</p>
              </div>
              <button
                onClick={() => handleStartDeepDive(dd.missionId)}
                disabled={creating === `dd-${dd.missionId}`}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-indigo active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
              >
                {creating === `dd-${dd.missionId}` ? "..." : "플레이"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
