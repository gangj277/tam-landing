"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consultation = {
  id: string;
  parentName: string;
  phone: string;
  childAge: number;
  childGrade: string;
  message: string | null;
  status: string;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/consultations")
      .then(async (res) => {
        if (!res.ok) throw new Error("데이터를 불러올 수 없습니다.");
        const json = await res.json();
        setRows(json.data ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const statusLabel: Record<string, { text: string; bg: string; fg: string }> =
    {
      pending: { text: "대기", bg: "#FFF7ED", fg: "#D4A843" },
      contacted: { text: "연락완료", bg: "#EEF2FF", fg: "#4A5FC1" },
      completed: { text: "완료", bg: "#ECFDF5", fg: "#16A34A" },
    };

  function formatDate(iso: string) {
    const d = new Date(iso);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${h}:${m}`;
  }

  return (
    <div
      className="min-h-dvh"
      style={{ background: "#FAFAF8", color: "#1A1A2E" }}
    >
      {/* Header */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "#E8E6E1", background: "#FFFFFF" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[13px] font-medium"
            style={{ color: "#8A8A9A" }}
          >
            ← 홈
          </Link>
          <div
            className="w-px h-4"
            style={{ background: "#E8E6E1" }}
          />
          <h1 className="text-[18px] font-bold tracking-[-0.02em]">
            사전신청 관리
          </h1>
        </div>
        <div
          className="text-[13px] font-medium px-3 py-1 rounded-full"
          style={{ background: "#E8614D0A", color: "#E8614D" }}
        >
          {loading ? "—" : `${rows.length}건`}
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div
              className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{
                borderColor: "#E8E6E1",
                borderTopColor: "#E8614D",
              }}
            />
          </div>
        ) : error ? (
          <div
            className="rounded-xl px-5 py-4 text-[14px]"
            style={{
              background: "#FFF3F0",
              color: "#B24432",
              border: "1px solid #FADBD5",
            }}
          >
            {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-32">
            <p
              className="text-[15px]"
              style={{ color: "#8A8A9A" }}
            >
              아직 사전신청이 없습니다.
            </p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "전체",
                  value: rows.length,
                  color: "#1A1A2E",
                },
                {
                  label: "대기",
                  value: rows.filter((r) => r.status === "pending").length,
                  color: "#D4A843",
                },
                {
                  label: "연락완료",
                  value: rows.filter((r) => r.status === "contacted").length,
                  color: "#4A5FC1",
                },
                {
                  label: "완료",
                  value: rows.filter((r) => r.status === "completed").length,
                  color: "#16A34A",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-5 py-4"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E6E1",
                  }}
                >
                  <p
                    className="text-[12px] font-medium mb-1"
                    style={{ color: "#8A8A9A" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="text-[28px] font-bold tracking-[-0.03em]"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E6E1",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #E8E6E1",
                        background: "#FAFAF8",
                      }}
                    >
                      {[
                        "신청일",
                        "이름",
                        "연락처",
                        "자녀 나이",
                        "학년",
                        "상태",
                        "메시지",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 font-semibold whitespace-nowrap"
                          style={{ color: "#8A8A9A" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const badge = statusLabel[row.status] ??
                        statusLabel.pending;
                      return (
                        <tr
                          key={row.id}
                          className="transition-colors hover:bg-[#FAFAF8]"
                          style={{
                            borderBottom: "1px solid #F0EFEC",
                          }}
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap text-[13px]" style={{ color: "#8A8A9A" }}>
                            {formatDate(row.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            {row.parentName}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "#4A4A5A" }}>
                            {row.phone}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "#4A4A5A" }}>
                            {row.childAge}세
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "#4A4A5A" }}>
                            {row.childGrade}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className="inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold"
                              style={{
                                background: badge.bg,
                                color: badge.fg,
                              }}
                            >
                              {badge.text}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3.5 max-w-[280px] truncate"
                            style={{ color: "#6B6B7B" }}
                            title={row.message ?? ""}
                          >
                            {row.message || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
