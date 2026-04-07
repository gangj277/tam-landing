export function BlogCTA() {
  return (
    <section className="my-10 rounded-2xl bg-gradient-to-br from-navy to-navy-light p-8 md:p-10 text-center">
      <p className="text-[13px] font-medium text-coral mb-3 tracking-[0.02em]">
        탐 TAM
      </p>
      <h3 className="text-[22px] md:text-[26px] font-bold text-white leading-[1.35] mb-3 tracking-[-0.02em]">
        아이의 자기이해, 탐에서 시작해보세요
      </h3>
      <p className="text-[15px] text-white/60 leading-[1.6] mb-6 max-w-md mx-auto">
        매일 10분, AI가 만든 새로운 세계에서 선택하고 반응하며 자기 자신을
        발견하는 경험 플랫폼
      </p>
      <a
        href="/consultation"
        className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-coral text-white text-[15px] font-medium hover:bg-coral-hover transition-colors shadow-[0_2px_12px_rgba(232,97,77,0.3)]"
      >
        사전신청하기
      </a>
    </section>
  );
}
