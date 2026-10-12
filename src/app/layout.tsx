import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseAI Digital | Autonomous AI Growth Engine & Marketing Agency",
  description:
    "Supercharge your business growth with AI-powered marketing. High-converting Meta & Google ad management, viral content engines, and 24/7 conversational lead bots.",
  keywords: [
    "AI Marketing Agency",
    "PulseAI Digital",
    "Autonomous Ad Management",
    "Meta Ads AI",
    "Google Ads Optimization",
    "WhatsApp Lead Bot",
    "Local SEO Automation",
  ],
  authors: [{ name: "PulseAI Digital Team" }],
  openGraph: {
    title: "PulseAI Digital | Autonomous AI Growth Engine",
    description:
      "Supercharge your business growth with AI-powered marketing. Higher ROAS, lower customer acquisition costs, and 24/7 lead bots.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfaf8] text-slate-900 selection:bg-[#ff5b37] selection:text-white">
        {children}
      </body>
    </html>
  );
}
