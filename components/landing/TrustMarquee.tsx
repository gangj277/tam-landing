const items = [
  {
    text: "매일 10분",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 4.5v4l3 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "AI 맞춤 경험",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5l2 3.5h4l-3 2.5 1.2 4L8 9l-4.2 2.5L5 7.5 2 5h4L8 1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    text: "안전 필터 적용",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L3 4.5v4c0 3.5 2.2 6.2 5 7 2.8-.8 5-3.5 5-7v-4L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M5.5 8l2 2L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    text: "주간 리포트",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 5.5h5M5.5 8h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "부모 대화 가이드",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4h8a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5H6L3.5 13V11H2.5A1.5 1.5 0 011 9.5v-4A1.5 1.5 0 012.5 4z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    text: "평가 없는 탐색",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 8h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function TrustMarquee() {
  // Triple for seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div className="relative bg-navy/[0.03] border-y border-navy/[0.06] py-4 md:py-5 overflow-hidden">
      <div className="flex animate-marquee">
        {tripled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-7 md:px-10 shrink-0 text-navy/50"
          >
            {item.icon}
            <span className="text-[13px] md:text-[14px] font-semibold tracking-[0.04em] uppercase whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
