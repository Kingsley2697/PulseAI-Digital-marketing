"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Terminal, ArrowRight, RefreshCw } from "lucide-react";

export default function LiveAiAuditDemo() {
  const [domain, setDomain] = useState("");
  const [niche, setNiche] = useState("E-commerce");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<null | {
    hook: string;
    targetAngle: string;
    budgetSplit: string;
    botWorkflow: string;
    projectedCpl: string;
  }>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setIsGenerating(true);
    setGeneratedPlan(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPlan({
        hook: `Dynamic Problem-Solution Creative: Highlight 3 hidden bottlenecks facing ${niche} buyers with high-contrast motion thumbnail.`,
        targetAngle: `Algorithmic lookalike audiences built from 95% video completion cohorts + server-side CAPI pixel triggers.`,
        budgetSplit: "60% Top-of-Funnel AI Video Ads • 25% High-Intent Retargeting • 15% WhatsApp Bot Instant Re-engagement",
        botWorkflow: "Sub-30 second WhatsApp booking agent auto-qualifying budget & booking directly into Calendly.",
        projectedCpl: niche === "E-commerce" ? "$14 - $19 (or ₦18,000)" : "$38 - $46 (or ₦42,000)",
      });
    }, 1200);
  };

  return (
    <section className="py-20 bg-[#fbfaf8] relative border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive AI Sandbox</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Test the <span className="text-[#ff5b37] italic font-serif">Strategy Synthesizer</span>
          </h3>
          <p className="text-slate-600 text-sm">
            Enter your business domain or brand name to simulate how our neural engine drafts your 
            initial marketing playbook.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Website or Brand Name
              </label>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. acmeglobal.com or Aura Apparel"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Industry Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
              >
                <option value="E-commerce">E-commerce / D2C Brands</option>
                <option value="B2B SaaS">B2B SaaS / Tech Companies</option>
                <option value="Local Healthcare / MedSpa">Local Healthcare / MedSpa</option>
                <option value="Real Estate & Property">Real Estate & Property</option>
                <option value="Professional Services">Professional & Financial Services</option>
              </select>
            </div>

            <div className="md:col-span-3 pt-5">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Simulate Strategy</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Output Terminal / Card */}
          {generatedPlan ? (
            <div className="p-6 rounded-2xl bg-[#fff8f6] border border-orange-200 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5b37] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    AI Strategy Report for: <strong className="text-[#ff5b37]">{domain}</strong> ({niche})
                  </span>
                </div>
                <span className="text-[10px] bg-white text-[#ff5b37] font-bold px-2.5 py-1 rounded-full border border-orange-200 shadow-sm">
                  Model: Claude 3.5 + Custom Ad Weights
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[#ff5b37] font-bold block mb-1">🎯 High-Converting Ad Creative Angle</span>
                  <p className="text-slate-700">{generatedPlan.hook}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-amber-600 font-bold block mb-1">⚡ Algorithmic Audience Strategy</span>
                  <p className="text-slate-700">{generatedPlan.targetAngle}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-800 font-bold block mb-1">📊 Budget Split Recommendation</span>
                  <p className="text-slate-700">{generatedPlan.budgetSplit}</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-emerald-600 font-bold block mb-1">🤖 24/7 Conversational Lead Bot</span>
                  <p className="text-slate-700">{generatedPlan.botWorkflow}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-600">
                  Target Cost Per Lead: <strong className="text-slate-900 font-bold">{generatedPlan.projectedCpl}</strong>
                </span>
                <Link
                  href={`/get-started?domain=${encodeURIComponent(domain)}&niche=${encodeURIComponent(niche)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20"
                >
                  <span>Apply This Into Official Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Enter your brand name above to generate your customized AI growth preview in seconds.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
