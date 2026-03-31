"use client";

import { useInView } from "@/lib/useInView";
import { FAQBlock } from "@/components/blog/FAQBlock";

const faqs = [
  {
    question: "우리 아이는 아직 꿈이 없는데 괜찮은 건가요?",
    answer:
      "완전히 괜찮습니다. 초등학생의 20.4%가 희망직업이 없고, 이 비율은 중학생이 되면 40%까지 올라갑니다. 이 시기에 꿈이 정해진 아이가 오히려 드뭅니다. 중요한 건 '꿈을 정하는 것'이 아니라 '다양한 경험을 통해 자기를 알아가는 것'입니다.",
  },
  {
    question: "관심사가 자주 바뀌는데 문제가 아닌가요?",
    answer:
      "정상이자 건강한 신호입니다. 발달심리학에서 이 시기는 '흥미 탐색기'로, 다양한 분야를 시도하며 자기에게 맞는 것을 찾아가는 과정입니다. 어른도 여러 음식을 먹어봐야 좋아하는 걸 알듯, 아이도 다양한 경험을 해봐야 합니다.",
  },
  {
    question: "학원을 줄이고 경험을 늘리라는데, 현실적으로 가능한가요?",
    answer:
      "전부 줄일 필요는 없습니다. 학원 한 개를 줄이고 그 시간에 새로운 경험을 해보는 것만으로도 효과가 있습니다. 일상적인 경험(요리, 정원 가꾸기, 동물 돌봄)도 훌륭한 진로탐색입니다. 탐(TAM)처럼 매일 10분 AI 경험을 활용하면 학원 시간을 건드리지 않고도 탐색 기회를 넓힐 수 있습니다.",
  },
  {
    question: "진로검사 결과를 어떻게 활용해야 하나요?",
    answer:
      "참고 자료로만 활용하세요. 10-14세는 흥미와 적성이 빠르게 변하는 시기라 검사 결과가 6개월 후 달라질 수 있습니다. 검사 결과를 \"확정\"이 아닌 \"대화의 출발점\"으로 사용하세요. \"이 결과가 맞는 것 같아?\" 하고 아이와 이야기하는 것이 결과 자체보다 중요합니다.",
  },
  {
    question: "영재원/특목고 준비와 진로탐색을 병행할 수 있나요?",
    answer:
      "물론 가능합니다. 다만 영재원 준비가 '폭넓은 탐색'을 가로막지 않는지 점검해보세요. 수학 영재원만 준비하면 수학 외 분야를 경험할 기회가 줄어듭니다. 진로탐색은 한 분야의 심화가 아닌 '넓은 노출' → '자기이해' → '선택'의 순서입니다.",
  },
  {
    question: "아이가 게임/유튜브만 하려고 하는데 어떻게 하나요?",
    answer:
      "게임과 유튜브 자체가 문제가 아닙니다. \"왜 이 게임이 좋아?\", \"이 유튜버의 어떤 점이 끌려?\"라고 물어보세요. 게임 좋아하는 아이가 게임 기획, 스토리텔링, 프로그래밍에 관심을 가질 수 있고, 유튜브를 좋아하는 아이가 영상 편집, 기획, 커뮤니케이션에 강점이 있을 수 있습니다. 소비를 창작으로 전환하는 대화가 핵심입니다.",
  },
  {
    question: "초등 때 AI 경험이 왜 중요한가요?",
    answer:
      "10-14세는 자아개념이 급격히 분화하는 시기입니다. 이때 다양한 세계를 만나면 \"나는 이런 걸 좋아하는구나\", \"이런 상황에서 이렇게 반응하는구나\"를 발견합니다. 탐(TAM)은 매일 10분, AI가 만든 다양한 시나리오에서 아이가 선택하고 반응하며, 이 패턴을 부모와 함께 돌아보는 경험 플랫폼입니다.",
  },
];

export function ElemFAQ() {
  const { ref, isInView } = useInView(0.1);

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
          <FAQBlock faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
