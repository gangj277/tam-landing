"use client";

import { useInView } from "@/lib/useInView";
import { FAQBlock } from "@/components/blog/FAQBlock";

interface JayuFAQProps {
  faqs: { q: string; a: string }[];
}

export function JayuFAQ({ faqs }: JayuFAQProps) {
  const { ref, isInView } = useInView(0.1);

  const formatted = faqs.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  return (
    <section id="faq" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[720px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            자주 묻는 질문
          </span>
        </div>

        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <FAQBlock faqs={formatted} />
        </div>
      </div>
    </section>
  );
}
