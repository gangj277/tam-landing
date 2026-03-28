"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/home",
    label: "홈",
    icon: (active: boolean) => {
      const c = active ? "#E8614D" : "#8A8A9A";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Compass / explore icon — represents daily mission */}
          <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8" />
          <circle cx="12" cy="12" r="1.5" fill={c} />
          <path d="M14.5 9.5l-1.2 3.8-3.8 1.2 1.2-3.8z" fill={active ? "#E8614D" : "none"} stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
          {active && <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="2 2" />}
        </svg>
      );
    },
  },
  {
    href: "/profile",
    label: "내 기록",
    icon: (active: boolean) => {
      const c = active ? "#E8614D" : "#8A8A9A";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Constellation / pattern icon — represents discovered patterns */}
          <circle cx="7" cy="6" r="2" stroke={c} strokeWidth="1.6" fill={active ? `${c}20` : "none"} />
          <circle cx="17" cy="8" r="2" stroke={c} strokeWidth="1.6" fill={active ? `${c}20` : "none"} />
          <circle cx="10" cy="16" r="2" stroke={c} strokeWidth="1.6" fill={active ? `${c}20` : "none"} />
          <circle cx="18" cy="17" r="1.5" stroke={c} strokeWidth="1.4" fill={active ? `${c}20` : "none"} />
          <path d="M7 6l10 2M17 8l-7 8M10 16l8 1" stroke={c} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 2" />
        </svg>
      );
    },
  },
  {
    href: "/parent",
    label: "부모님",
    icon: (active: boolean) => {
      const c = active ? "#E8614D" : "#8A8A9A";
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Report / insight icon — represents parent dashboard */}
          <rect x="4" y="3" width="16" height="18" rx="2.5" stroke={c} strokeWidth="1.8" fill={active ? `${c}08` : "none"} />
          <path d="M8 8h8M8 12h5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15.5" cy="16" r="2.5" stroke={c} strokeWidth="1.4" fill={active ? `${c}15` : "none"} />
          <path d="M14.5 16l1 1 2-2" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    },
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMissionFlow =
    pathname.includes("/mission/") &&
    (pathname.includes("/play") || pathname.includes("/mirror"));

  return (
    <div className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-bg-cream flex flex-col">
      <main className={`flex-1 ${isMissionFlow ? "" : "pb-20"}`}>
        {children}
      </main>

      {!isMissionFlow && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-xl border-t border-border-light z-50">
          <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/home" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 px-4 py-1 tap-highlight"
                >
                  {item.icon(isActive)}
                  <span
                    className={`text-[10px] font-medium tracking-tight ${
                      isActive ? "text-coral" : "text-text-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
