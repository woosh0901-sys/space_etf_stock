import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space ETF Dashboard | UFO & ARKX 보유 종목",
  description: "UFO ETF와 ARKX ETF의 보유 종목을 한눈에 볼 수 있는 대시보드. 중복 종목 확인, 검색 및 필터 기능 제공.",
  keywords: ["UFO ETF", "ARKX ETF", "우주 ETF", "Space ETF", "보유 종목", "holdings"],
  openGraph: {
    title: "Space ETF Dashboard",
    description: "UFO & ARKX 보유 종목을 한눈에",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
