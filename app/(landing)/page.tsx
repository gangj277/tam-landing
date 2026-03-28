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
import TamGuide from "@/components/landing/TamGuide";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
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
        <TamGuide />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
