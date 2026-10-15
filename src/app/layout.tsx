import type { Metadata } from "next";
import "./globals.css";
import { PwaRegistration } from "@/components/pwa/PwaRegistration";

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
  applicationName: "PulseAI Digital",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PulseAI" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#fbfaf8] text-slate-900 selection:bg-[#ff5b37] selection:text-white">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
