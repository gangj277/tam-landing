"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

const categories = [
  { id: "world", label: "세계 탐험", color: "#4A5FC1", lightBg: "#EEF0F9" },
  { id: "value", label: "가치 선택", color: "#E8614D", lightBg: "#FEF0EE" },
  { id: "perspective", label: "관점 전환", color: "#D4A853", lightBg: "#FBF5E8" },
  { id: "real", label: "현실 연결", color: "#4A5FC1", lightBg: "#EEF0F9" },
  { id: "synthesis", label: "표현", color: "#E8614D", lightBg: "#FEF0EE" },
];

interface Mission {
  icon: React.ReactNode;
  title: string;
  role: string;
  situation: string;
  question: string;
  tags: string[];
  difficulty: string;
}

const missions: Record<string, Mission[]> = {
  world: [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill="#4A5FC1" fillOpacity="0.08" stroke="#4A5FC1" strokeWidth="1"/>
          <path d="M20 6v6M14 10l2 4M26 10l-2 4" stroke="#4A5FC1" strokeWidth="1" strokeLinecap="round"/>
          <ellipse cx="20" cy="28" rx="10" ry="4" stroke="#4A5FC1" strokeWidth="1" strokeDasharray="2 2"/>
          <rect x="16" y="20" width="8" height="8" rx="1.5" fill="#4A5FC1" fillOpacity="0.15" stroke="#4A5FC1" strokeWidth="0.8"/>
        </svg>
      ),
      title: "화성 첫 도시의 시장",
      role: "도시 리더",
      situation: "인류 최초의 화성 도시 아레스. 인구 2,400명이 돔 안에서 생활 중이야. 그런데 지하수가 예상보다 빠르게 줄어들고 있어. 주민들의 불안이 커지고 있어.",
      question: "농장과 병원 중 어디에 먼저 물을 보낼까? 시장으로서 첫 번째 결정을 내려야 해.",
      tags: ["우주", "리더십", "자원관리", "위기대응"],
      difficulty: "가치 충돌형",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="10" width="32" height="22" rx="3" fill="#4A5FC1" fillOpacity="0.06" stroke="#4A5FC1" strokeWidth="1"/>
          <circle cx="15" cy="21" r="5" stroke="#4A5FC1" strokeWidth="1" fill="#E8614D" fillOpacity="0.1"/>
          <path d="M24 17h8M24 21h6M24 25h7" stroke="#4A5FC1" strokeWidth="1" strokeLinecap="round"/>
          <path d="M12 24c0-1.5 1.3-3 3-3s3 1.5 3 3" stroke="#4A5FC1" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      ),
      title: "동물구조센터 브랜딩 디자이너",
      role: "크리에이티브 디렉터",
      situation: "이 센터는 매달 50마리 이상의 동물을 구조하지만, 사람들은 이 센터의 존재조차 몰라. 올해 후원금이 작년의 절반으로 줄었어.",
      question: "사람들이 발길을 멈추고 관심을 갖게 만들 포스터를 만들어야 해. 귀엽게 갈까, 진지하게 갈까, 아니면 전혀 다른 접근을 해볼까?",
      tags: ["디자인", "브랜딩", "소통", "가치전달"],
      difficulty: "창작 판단형",
    },
  ],
  value: [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 8L8 20l12 12 12-12L20 8z" stroke="#E8614D" strokeWidth="1.2" fill="#E8614D" fillOpacity="0.06"/>
          <line x1="14" y1="20" x2="26" y2="20" stroke="#E8614D" strokeWidth="1"/>
          <circle cx="14" cy="20" r="2.5" fill="#E8614D" fillOpacity="0.15" stroke="#E8614D" strokeWidth="0.8"/>
          <circle cx="26" cy="20" r="2.5" fill="#E8614D" fillOpacity="0.15" stroke="#E8614D" strokeWidth="0.8"/>
        </svg>
      ),
      title: "공정한 나눔 vs 효율적 분배",
      role: "급식 운영 책임자",
      situation: "네가 운영하는 학교 급식에서 가장 인기 있는 메뉴가 딱 절반밖에 안 남았어. 줄은 아직 길고, 뒤에 서 있는 아이들이 불안해하고 있어.",
      question: "줄 선 순서대로 줄까? 아니면 모두에게 조금씩 나눌까? 어느 쪽이 더 '공정한' 걸까?",
      tags: ["공정성", "효율", "공동체", "윤리"],
      difficulty: "딜레마형",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" stroke="#E8614D" strokeWidth="1" fill="#E8614D" fillOpacity="0.04"/>
          <path d="M14 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#E8614D" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M14 16v8l6 6 6-6v-8" stroke="#E8614D" strokeWidth="1" strokeLinejoin="round" fill="#E8614D" fillOpacity="0.06"/>
          <path d="M20 20v6" stroke="#E8614D" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      ),
      title: "재미 vs 안전",
      role: "놀이공원 설계자",
      situation: "네가 만든 놀이공원에서 가장 인기 있는 놀이기구에 작은 문제가 발견됐어. 위험하진 않지만, 더 안전하게 바꾸면 스릴이 확 줄어들어.",
      question: "고객 리뷰 점수가 떨어질 수도 있어. 안전을 택할까, 재미를 유지할까?",
      tags: ["안전", "재미", "책임", "트레이드오프"],
      difficulty: "딜레마형",
    },
  ],
  perspective: [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="12" cy="16" r="4" stroke="#D4A853" strokeWidth="1" fill="#D4A853" fillOpacity="0.1"/>
          <circle cx="28" cy="16" r="4" stroke="#D4A853" strokeWidth="1" fill="#D4A853" fillOpacity="0.1"/>
          <circle cx="20" cy="28" r="4" stroke="#D4A853" strokeWidth="1" fill="#D4A853" fillOpacity="0.15"/>
          <path d="M15 18l3 7M25 18l-3 7" stroke="#D4A853" strokeWidth="0.8" strokeDasharray="2 2"/>
        </svg>
      ),
      title: "같은 교실, 세 개의 시선",
      role: "관찰자 & 공감자",
      situation: "수업 중에 한 친구가 엎드려 자고 있어. 선생님은 한숨을 쉬고, 옆자리 친구는 걱정스럽게 쳐다보고, 자고 있는 본인은 어젯밤 부모님 싸움 때문에 잠을 못 잤어.",
      question: "세 사람의 입장에 각각 들어가봐. 같은 장면이 얼마나 다르게 보이는지 느껴봐.",
      tags: ["공감", "다중관점", "이해", "감정"],
      difficulty: "관점 전환형",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M8 30 Q20 10 32 30" stroke="#D4A853" strokeWidth="1.2" fill="#D4A853" fillOpacity="0.04"/>
          <circle cx="20" cy="18" r="6" stroke="#D4A853" strokeWidth="1"/>
          <path d="M17 17.5c.8-1 2.5-1 3.3 0M21.7 17.5c.8-1 2.5-1 3.3 0" stroke="#D4A853" strokeWidth="0.8" strokeLinecap="round"/>
          <path d="M18 22c1 1 3 1 4 0" stroke="#D4A853" strokeWidth="0.8" strokeLinecap="round"/>
        </svg>
      ),
      title: "바다에서 온 편지",
      role: "100년 뒤의 바다거북",
      situation: "2126년, 바다의 온도는 4도 올랐고 산호초의 80%가 사라졌어. 넌 120살 된 바다거북이야. 조상들이 말해준 옛날 바다의 모습이 기억나.",
      question: "지금의 인간에게 편지를 쓴다면 뭐라고 할까? 화가 날까, 슬플까, 아니면 부탁을 할까?",
      tags: ["환경", "미래", "상상력", "편지"],
      difficulty: "감정 몰입형",
    },
  ],
  real: [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="12" width="24" height="18" rx="2" stroke="#4A5FC1" strokeWidth="1" fill="#4A5FC1" fillOpacity="0.04"/>
          <path d="M8 18h24" stroke="#4A5FC1" strokeWidth="0.8"/>
          <circle cx="20" cy="24" r="3" stroke="#4A5FC1" strokeWidth="1" fill="#D4A853" fillOpacity="0.15"/>
          <path d="M14 10l6-4 6 4" stroke="#4A5FC1" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      ),
      title: "우리 집의 숨은 디자인",
      role: "디자인 탐정",
      situation: "우리가 매일 쓰는 물건들 중에는 누군가 오래 고민해서 만든 것들이 있어. 손잡이의 각도, 버튼의 위치, 색깔의 조합까지.",
      question: "집에서 가장 잘 디자인된 물건 하나를 골라봐. 왜 그렇게 생각해? 만약 네가 더 좋게 바꾼다면?",
      tags: ["관찰력", "디자인사고", "일상", "분석"],
      difficulty: "관찰 분석형",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M10 32h20" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round"/>
          <rect x="14" y="18" width="12" height="14" rx="1" stroke="#4A5FC1" strokeWidth="1" fill="#4A5FC1" fillOpacity="0.04"/>
          <path d="M18 18v-6a2 2 0 014 0v6" stroke="#4A5FC1" strokeWidth="1"/>
          <circle cx="20" cy="12" r="5" stroke="#E8614D" strokeWidth="0.8" strokeDasharray="2 2" fill="none"/>
          <path d="M8 32l4-8M32 32l-4-8" stroke="#4A5FC1" strokeWidth="0.8" strokeLinecap="round"/>
        </svg>
      ),
      title: "통학길 재설계",
      role: "도시 설계자",
      situation: "매일 다니는 길인데, 자세히 보면 불편한 점이 꽤 있어. 좁은 인도, 신호가 없는 횡단보도, 쉴 곳이 없는 버스 정류장...",
      question: "불편한 점 하나를 찾고, 네가 이 동네의 도시 설계자라면 어떻게 바꿀지 제안해봐.",
      tags: ["관찰", "문제해결", "도시설계", "제안"],
      difficulty: "문제 발견형",
    },
  ],
  synthesis: [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="8" width="24" height="24" rx="3" stroke="#E8614D" strokeWidth="1" fill="#E8614D" fillOpacity="0.04"/>
          <line x1="12" y1="16" x2="28" y2="16" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="22" y2="21" stroke="#E8614D" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
          <line x1="12" y1="25" x2="18" y2="25" stroke="#E8614D" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
        </svg>
      ),
      title: "한 줄로 설득하기",
      role: "카피라이터",
      situation: "세상에서 가장 짧은 광고는 단 한 문장이야. 하지만 그 한 문장이 사람의 마음을 움직여. 좋은 카피는 정보가 아니라 감정을 전달해.",
      question: "네가 가장 좋아하는 장소를 한 번도 가본 적 없는 사람에게 딱 한 문장으로 설명해봐. 가고 싶게 만들어야 해!",
      tags: ["표현력", "설득", "카피라이팅", "언어"],
      difficulty: "표현 도전형",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="10" y="6" width="20" height="28" rx="3" stroke="#E8614D" strokeWidth="1" fill="#E8614D" fillOpacity="0.04"/>
          <circle cx="20" cy="16" r="5" stroke="#E8614D" strokeWidth="1" fill="#D4A853" fillOpacity="0.1"/>
          <line x1="14" y1="24" x2="26" y2="24" stroke="#E8614D" strokeWidth="1" strokeLinecap="round"/>
          <line x1="16" y1="28" x2="24" y2="28" stroke="#E8614D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
          <path d="M18 14l1 2 3-3" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "캐릭터 카드 만들기",
      role: "캐릭터 디자이너",
      situation: "이번 주에 네가 만난 여러 세계 속 인물들 — 화성 시장, 바다거북, 급식 운영자 — 그 중 가장 기억에 남는 한 명이 있을 거야.",
      question: "그 인물의 캐릭터 카드를 만들어봐. 이름, 특기, 그리고 아무도 모르는 비밀 하나.",
      tags: ["창작", "정리", "캐릭터", "상상력"],
      difficulty: "종합 창작형",
    },
  ],
};

export default function ExperienceShowcase() {
  const { ref, isInView } = useInView(0.1);
  const [activeTab, setActiveTab] = useState("world");

  const activeCat = categories.find((c) => c.id === activeTab)!;

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-indigo" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
              경험 카테고리
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            아이가 만나게 될 세계들
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary max-w-[480px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            매일 하나씩, 전혀 다른 결의 경험이 열립니다.
            <br />
            여기 몇 가지 예시를 보여드릴게요.
          </p>
        </div>

        {/* Tabs */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                activeTab === cat.id
                  ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  : "bg-card-bg text-text-secondary border border-border-light hover:border-navy/10"
              }`}
              style={activeTab === cat.id ? { background: cat.color } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mission cards — richer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
          {missions[activeTab].map((m, i) => (
            <div
              key={`${activeTab}-${i}`}
              className="animate-fade-in bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden hover:shadow-[0_6px_24px_rgba(26,26,46,0.06)] transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Card header with icon */}
              <div
                className="px-6 pt-6 pb-4 flex items-start gap-4"
                style={{ background: activeCat.lightBg }}
              >
                <div className="flex-shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded"
                      style={{
                        color: activeCat.color,
                        background: activeCat.color + "15",
                      }}
                    >
                      {m.difficulty}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-navy tracking-[-0.01em] leading-tight">
                    {m.title}
                  </h3>
                  <p className="text-[12px] text-text-muted mt-1">
                    역할: <span className="font-medium text-text-secondary">{m.role}</span>
                  </p>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-5">
                <p className="text-[13px] leading-[1.75] text-text-secondary mb-4">
                  {m.situation}
                </p>

                {/* Question highlight */}
                <div
                  className="p-3.5 rounded-xl mb-4"
                  style={{ background: activeCat.color + "06", borderLeft: `3px solid ${activeCat.color}30` }}
                >
                  <p className="text-[13px] leading-[1.65] font-medium text-navy">
                    {m.question}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: activeCat.lightBg,
                        color: activeCat.color,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
