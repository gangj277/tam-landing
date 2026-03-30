import { ALL_QUIZZES } from "@/lib/quiz-data";

export const metadata = {
  title: "무료 진단 — 탐 TAM",
  description: "우리 아이, 얼마나 알고 계신가요? AI 시대에 맞는 아이 이해 진단.",
};

export default function QuizHubPage() {
  const available = ALL_QUIZZES.filter((q) => q.available);
  const upcoming = ALL_QUIZZES.filter((q) => !q.available);

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      {/* Header */}
      <header className="px-6 pt-6 pb-4">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
              <path
                d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
                fill="#1A1A2E"
              />
              <path d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z" fill="#E8614D" fillOpacity="0.85" />
              <path d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z" fill="#4A5FC1" fillOpacity="0.75" />
              <path d="M13 19c1-1.5 3-1.5 4.2-.3 1.2 1.2 1.5 3 .3 4.3-1.2 1.3-3 1.5-4 .5S12 20.5 13 19z" fill="#D4A853" fillOpacity="0.7" />
            </svg>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">탐</span>
              <span className="text-[9px] font-bold tracking-[0.06em] text-[#8A8A9A] uppercase">TAM</span>
            </div>
          </a>
          <a href="/signup" className="text-[13px] font-medium text-[#4A5FC1]">
            시작하기
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-10 pb-12 text-center">
        <div className="max-w-[520px] mx-auto">
          <h1 className="text-[28px] md:text-[36px] font-bold text-[#1A1A2E] tracking-[-0.03em] mb-4 leading-[1.3]">
            우리 아이,
            <br />
            얼마나 알고 계신가요?
          </h1>
          <p className="text-[15px] text-[#4A4A5A] leading-[1.7]">
            1~3분이면 끝나는 무료 진단으로
            <br />
            아이의 숨겨진 패턴을 발견해보세요.
          </p>
        </div>
      </section>

      {/* Available quizzes */}
      <section className="px-6 pb-10">
        <div className="max-w-[720px] mx-auto">
          <div className="space-y-4">
            {available.map((quiz) => (
              <a
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="block bg-white rounded-2xl border border-[#E8E6E1] p-6 hover:shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:border-[#E8E6E1]/80 transition-all duration-300 active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[36px] flex-shrink-0">{quiz.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-bold text-[#1A1A2E] tracking-[-0.01em] mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-[13px] text-[#4A4A5A] leading-[1.6] mb-3">
                      {quiz.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-[12px] text-[#8A8A9A]">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="0.9"/>
                          <path d="M6 3.5v3l1.5 1" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
                        </svg>
                        {quiz.duration}
                      </span>
                      <span>{quiz.questionCount}문항</span>
                      <span className="text-[#E8614D] font-medium">무료</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-9 h-9 rounded-full bg-[#E8614D]/[0.08] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l5 4-5 4" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming quizzes */}
      {upcoming.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-[720px] mx-auto">
            <h2 className="text-[14px] font-semibold text-[#8A8A9A] tracking-[0.02em] mb-4">
              곧 공개
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcoming.map((quiz) => (
                <div
                  key={quiz.slug}
                  className="bg-white/60 rounded-xl border border-[#E8E6E1]/60 p-5 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[24px]">{quiz.emoji}</span>
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#1A1A2E] mb-0.5">
                        {quiz.title}
                      </h3>
                      <p className="text-[12px] text-[#8A8A9A]">
                        {quiz.duration} · {quiz.questionCount}문항
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer link */}
      <footer className="px-6 pb-10 text-center">
        <p className="text-[13px] text-[#8A8A9A]">
          <a href="/" className="text-[#4A5FC1] font-medium hover:underline">
            탐 TAM
          </a>
          {" "}— 아이의 경험을 넓히는 AI 플랫폼
        </p>
      </footer>
    </div>
  );
}
