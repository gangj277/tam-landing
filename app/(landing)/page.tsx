import { cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import ReframingSection from "@/components/landing/ReframingSection";
import FounderLetter from "@/components/landing/FounderLetter";
import ProductIntro from "@/components/landing/ProductIntro";
import HowItWorks from "@/components/landing/HowItWorks";
import ExperienceShowcase from "@/components/landing/ExperienceShowcase";
import SelfDiscovery from "@/components/landing/SelfDiscovery";
import AILiteracy from "@/components/landing/AILiteracy";
import FirstSevenDays from "@/components/landing/FirstSevenDays";
import TamPortfolio from "@/components/landing/TamPortfolio";
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
        <HeroSection />
        <StatsSection />
        <ReframingSection />
        <FounderLetter />
        <ProductIntro />
        <HowItWorks />
        <ExperienceShowcase />
        <SelfDiscovery />
        <AILiteracy />
        <FirstSevenDays />
        <TamPortfolio />
        <TamGuide />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
