"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQBlock({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="my-10">
      <h2 className="text-[20px] md:text-[24px] font-bold text-navy mb-5 tracking-[-0.02em]">
        자주 묻는 질문
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-border-light rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-warm/50 transition-colors"
            >
              <span className="text-[15px] font-medium text-navy leading-[1.5] pr-4">
                {faq.question}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`shrink-0 text-text-muted transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-[15px] leading-[1.7] text-text-secondary">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
