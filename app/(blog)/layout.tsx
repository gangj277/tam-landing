import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-[72px] min-h-screen bg-bg-cream">
        {children}
      </main>
      <Footer />
    </>
  );
}
