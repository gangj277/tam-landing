"use client";

import { useInView } from "@/lib/useInView";

export default function FounderLetter() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-[720px]">
        {/* Section label */}
        <div
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            탐을 만든 이유
          </span>
          <div className="w-8 h-[1px] bg-coral" />
        </div>

        {/* Letter card */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="bg-card-bg rounded-2xl border border-border-light p-8 md:p-12 shadow-[0_4px_24px_rgba(26,26,46,0.04)]">
            <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.85] text-text-secondary">
              <p className="text-navy font-medium text-[16px] md:text-[17px] leading-[1.8]">
                좋은 대학, 좋은 자격증, 좋은 스펙 —
                <br />
                그것들의 가치가 사라진다고는 말하지 않겠습니다.
                <br />
                다만, 그것이 <span className="text-coral">정답이던 시대는 끝나가고 있다</span>고 생각합니다.
              </p>

              <p>
                저는 20살 때부터 AI로 사업을 해왔습니다.
                헤지펀드를 대상으로 B2B AI 소프트웨어를 만들고
                2년 넘게 운영하면서,
                AI가 산업을 바꾸는 속도를 가까이서 지켜봤습니다.
              </p>

              <p>
                그런데 대학교에 돌아오면,
                동기들은 여전히 같은 자격증을 따고
                같은 인턴을 준비하고 있었습니다.
                세상은 이미 달라졌는데,
                준비하는 방식은 10년 전과 크게 다르지 않았습니다.
              </p>

              <p className="text-navy font-medium text-[16px] md:text-[17px] leading-[1.8]">
                세상이 던지는 정답지가 바뀌고 있는데,
                <br />
                학생들은 여전히 예전 정답지를 풀고 있는 거였습니다.
              </p>

              <p>
                그 문제의식으로 연세대학교에서 AI 창업학회{" "}
                <span className="font-semibold text-navy">CREAI+IT</span>를 만들었습니다.
                2년 넘게 운영하면서, 대학생들이 AI 시대를 자기만의 방식으로
                준비할 수 있도록 함께 고민해왔습니다.
              </p>

              <p>
                그런데 계속하다 보니 느낀 게 있었습니다.
              </p>

              <p className="text-navy font-medium text-[16px] md:text-[17px] leading-[1.8]">
                대학생이 되어서 깨닫는 건, 조금 늦을 수 있겠다는 것.
              </p>

              <p>
                스스로 생각하는 힘, 다양한 세계를 접해본 경험의 폭,
                자기 기준으로 판단하는 감각 —
                이런 건 20살에 갑자기 만들어지지 않더라고요.
                더 어릴 때부터 다양한 경험을 만나고,
                그 안에서 자기 방식으로 반응해본 사람들이
                결국 자기 길을 찾아가는 것 같았습니다.
              </p>

              <p>
                코딩을 가르치거나, AI 사용법을 알려주는 것이 아니라 —
                <br />
                매일 새로운 세계에 들어가서 선택하고,
                그 선택 속에서 자기 자신을 알아가는 경험을 만들고 싶었습니다.
              </p>

              <p className="text-[17px] md:text-[19px] font-bold text-navy leading-[1.6]">
                그게 <span className="text-coral">탐</span>의 시작입니다.
              </p>
            </div>

            {/* Credentials — minimal */}
            <div className="mt-10 pt-6 border-t border-border-light/60">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-navy/[0.06] to-navy/[0.02] border border-border-light flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 34 34" fill="none">
                    <path
                      d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
                      fill="#1A1A2E"
                      fillOpacity="0.08"
                    />
                    <path d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z" fill="#E8614D" fillOpacity="0.4" />
                    <path d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z" fill="#4A5FC1" fillOpacity="0.35" />
                    <path d="M13 19c1-1.5 3-1.5 4.2-.3 1.2 1.2 1.5 3 .3 4.3-1.2 1.3-3 1.5-4 .5S12 20.5 13 19z" fill="#D4A853" fillOpacity="0.3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-navy mb-0.5">
                    탐의 메이커
                  </p>
                  <p className="text-[12px] text-text-muted">
                    연세대학교 · B2B AI 소프트웨어 창업 2년+ · CREAI+IT 창립
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
