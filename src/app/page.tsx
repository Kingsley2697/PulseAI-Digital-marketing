import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ValueComparison from "@/components/landing/ValueComparison";
import RoiCalculator from "@/components/landing/RoiCalculator";
import ServicesGrid from "@/components/landing/ServicesGrid";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";

export const metadata: Metadata = {
  title: "PulseAI Digital | Autonomous AI Growth Engine & Marketing Agency",
  description:
    "Supercharge your business growth with AI-powered marketing. High-converting Meta & Google ad management, viral content engines, and 24/7 conversational lead bots.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-slate-900 selection:bg-[#ff5b37] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ValueComparison />
        <RoiCalculator />
        <ServicesGrid />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
