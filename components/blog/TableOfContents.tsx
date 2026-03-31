"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Extract h2 headings from the article
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const h2s = article.querySelectorAll("h2[id]");
    const items: TocItem[] = Array.from(h2s).map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
    }));
    setHeadings(items);
  }, []);

  // Track which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting heading
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="목차"
      className="hidden lg:block sticky top-28 self-start w-[220px] shrink-0"
    >
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-4">
        목차
      </p>
      <ul className="space-y-1 border-l border-border-light/60">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block pl-4 py-1.5 text-[13px] leading-[1.5] transition-all duration-200 border-l-2 -ml-[1px] ${
                activeId === id
                  ? "border-coral text-coral font-medium"
                  : "border-transparent text-text-muted hover:text-text-secondary hover:border-border-light"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
