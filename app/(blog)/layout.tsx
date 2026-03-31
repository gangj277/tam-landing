import { cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("tam_auth");

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="pt-16 md:pt-[72px] min-h-screen bg-bg-cream">
        {children}
      </main>
      <Footer />
    </>
  );
}
