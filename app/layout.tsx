import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar, Footer, SiteBackground } from "@/components/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// Source Han Serif (Noto Serif SC), subset to the hero headline glyphs only —
// a 4KB self-hosted face, no runtime CDN. Exposed as a CSS var for the headline.
const notoSerifSC = localFont({
  src: "./fonts/NotoSerifSC-headline.woff2",
  variable: "--font-noto-serif-sc",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "喜马拉雅儿童 SDK · AI 玩具接入方案",
  description:
    "面向第三方 AI 毛绒玩具厂商的喜马拉雅儿童版权音频内容标准化接入方案。设备点播版权内容，家长端管理会员，权益随设备发放。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} antialiased`}
      >
        {/* Fixed sky backdrop underlays every route (fixed + -z-10). NavBar/Footer
            live here too — direct children of <body>, never inside a page's
            overflow-hidden — so the sticky nav is never clipped. */}
        <SiteBackground />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
