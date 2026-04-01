import { cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import EducationReality from "@/components/landing/EducationReality";
import ReframingSection from "@/components/landing/ReframingSection";
import ResultShowcase from "@/components/landing/ResultShowcase";
import HowItWorksCompact from "@/components/landing/HowItWorksCompact";
import TamGuide from "@/components/landing/TamGuide";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("tam_auth");

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        {/* 1. Hero — 공감 질문 + 핵심 수치 */}
        <HeroSection />

        {/* 2. 교육 현실 — 고교학점제/사교육/중도탈락 긴급성 */}
        <EducationReality />

        {/* 3. 리프레이밍 — 기존 방식 vs 탐 방식 */}
        <ReframingSection />

        {/* 4. 결과물 — 주간 미러 한 방 (기존 5개 섹션 통합) */}
        <ResultShowcase />

        {/* 5. 작동 방식 — 3스텝 + 미션 예시 1개 */}
        <HowItWorksCompact />

        {/* 6. 사람+AI — 탐 가이드 + 가격 */}
        <TamGuide />

        {/* 7. 신뢰 — 3항목 + 파운더 1줄 */}
        <TrustSection />

        {/* 8. CTA — 전환 */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
