import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "탐 TAM — AI 시대, 아이의 경험을 넓히다",
  description:
    "매일 10분, AI와 함께 새로운 세계를 탐험하며 생각하는 힘과 자기만의 기준을 키워가는 경험 플랫폼",
  openGraph: {
    title: "탐 TAM — AI 시대, 아이의 경험을 넓히다",
    description:
      "매일 10분, AI와 함께 새로운 세계를 탐험하며 생각하는 힘과 자기만의 기준을 키워가는 경험 플랫폼",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
