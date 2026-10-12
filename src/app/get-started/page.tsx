import React, { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Started & Marketing Brief Generator | PulseAI Digital",
  description:
    "Launch your custom AI growth roadmap. Step-by-step brief generator for business owners scaling ad campaigns, SEO, and conversational bots.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative overflow-hidden bg-radial-glow">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Growth Onboarding</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Synthesize Your <span className="text-[#ff5b37] italic font-serif">Growth Brief</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Complete the 4-step wizard below. Our algorithms immediately draft your target audiences, 
              creative angles, and budget distribution.
            </p>
          </div>

          {/* Suspense wrapped Wizard */}
          <Suspense
            fallback={
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl max-w-xl mx-auto border border-slate-200 shadow-lg">
                <div className="w-8 h-8 rounded-full border-2 border-[#ff5b37] border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium">Initializing Interactive Brief Generator...</p>
              </div>
            }
          >
            <OnboardingWizard />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
