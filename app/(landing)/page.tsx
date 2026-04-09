import { cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustMarquee from "@/components/landing/TrustMarquee";
import ExplorationSection from "@/components/landing/ExplorationSection";
import ParentMentoringSection from "@/components/landing/ParentMentoringSection";
import ReportSection from "@/components/landing/ReportSection";
import PricingSection from "@/components/landing/PricingSection";
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
        {/* 1. Hero — 다크 bg + 비주얼 카드 */}
        <HeroSection />

        {/* 2. Trust Marquee — 무한 스크롤 신뢰 배너 */}
        <TrustMarquee />

        {/* 3. 아이 탐험 — 미션 비주얼 + 짧은 카피 */}
        <ExplorationSection />

        {/* 4. 부모 멘토링 — 대화 미션 비주얼 + 짧은 카피 */}
        <ParentMentoringSection />

        {/* 5. 리포트 — 관심영역 맵 + 발견된 패턴 */}
        <ReportSection />

        {/* 6. 가격 — 2티어 */}
        <PricingSection />

        {/* 7. 신뢰 — 3항목 간결 */}
        <TrustSection />

        {/* 8. CTA — 다크 bg 전환 유도 */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
