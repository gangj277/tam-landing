"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-6 md:right-8 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-card-bg border border-border-light/80 shadow-[0_4px_20px_rgba(26,26,46,0.08)] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(26,26,46,0.14)] hover:border-coral/30 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="맨 위로"
      title="맨 위로"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="text-navy"
      >
        <path
          d="M9 14V4M9 4L4.5 8.5M9 4L13.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
