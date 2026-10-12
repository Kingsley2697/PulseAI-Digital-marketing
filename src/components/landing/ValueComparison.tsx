"use client";

import React from "react";
import { Check, X, Sparkles, TrendingUp, Clock, DollarSign, Target, ShieldCheck } from "lucide-react";

export default function ValueComparison() {
  const comparisonData = [
    {
      metric: "Monthly Retainer Cost",
      icon: DollarSign,
      traditional: "$5,000 - $15,000/mo (bloated overhead)",
      pulseAi: "Flexible tiers from $990/mo or ₦1.25M/mo (Up to 70% savings)",
      winner: "PulseAI",
      advantage: "Zero agency fluff, 100% focused on capital efficiency and measurable growth.",
    },
    {
      metric: "Campaign Speed & Turnaround",
      icon: Clock,
      traditional: "3 to 4 weeks for initial launch & approvals",
      pulseAi: "Autonomous deployment in 48 to 72 hours",
      winner: "PulseAI",
      advantage: "AI rapid iteration generates and tests copy, angles, and ad sets in days.",
    },
    {
      metric: "Optimization Frequency",
      icon: TrendingUp,
      traditional: "Weekly or bi-weekly manual account audits",
      pulseAi: "Continuous 24/7 algorithmic & sub-second budget reallocation",
      winner: "PulseAI",
      advantage: "Shifts ad spend immediately toward winning creatives while cutting losers.",
    },
    {
      metric: "Creative Asset Volume",
      icon: Target,
      traditional: "4 to 8 static creative assets per month",
      pulseAi: "100+ multi-variant predictive copy and video angles",
      winner: "PulseAI",
      advantage: "Prevents creative ad fatigue and guarantees higher conversion hit rate.",
    },
    {
      metric: "Lead Capture & Response Time",
      icon: ShieldCheck,
      traditional: "Manual email follow-up in 12 - 48 hours (leads go cold)",
      pulseAi: "Sub-minute conversational AI qualification on WhatsApp & Web",
      winner: "PulseAI",
      advantage: "Captures and books qualified buyers while their intent is at peak.",
    },
    {
      metric: "Reporting & Transparency",
      icon: Sparkles,
      traditional: "Delayed 30-day PDF reports with vanity metrics",
      pulseAi: "Real-time client portal with live ROAS & verified lead tracking",
      winner: "PulseAI",
      advantage: "Full visibility into bottom-line pipeline impact, anytime, anywhere.",
    },
  ];

  return (
    <section id="comparison" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Algorithmic Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Traditional Agency vs. <span className="text-[#ff5b37] italic font-serif">PulseAI</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Traditional marketing agencies rely on bloated staff, endless meetings, and slow turnarounds. 
            We replace manual friction with high-velocity AI intelligence.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider py-5 px-6">
            <div className="col-span-12 sm:col-span-4 text-slate-900 flex items-center gap-2">
              Performance Factor
            </div>
            <div className="hidden sm:block sm:col-span-4 text-rose-500 font-bold">
              Traditional Marketing Agency
            </div>
            <div className="hidden sm:block sm:col-span-4 text-[#ff5b37] font-bold flex items-center gap-1.5">
              <span>PulseAI Digital Engine</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {comparisonData.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-6 hover:bg-orange-50/30 transition-colors items-center gap-4 sm:gap-0"
                >
                  {/* Metric Title */}
                  <div className="col-span-12 sm:col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#ff5b37]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{row.metric}</h4>
                        <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{row.advantage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Traditional Agency Column */}
                  <div className="col-span-12 sm:col-span-4 flex items-start gap-2.5 sm:px-4">
                    <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 text-rose-500">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="sm:hidden text-[11px] uppercase font-bold text-rose-500 block mb-0.5">
                        Traditional:
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 line-through decoration-rose-300">
                        {row.traditional}
                      </span>
                    </div>
                  </div>

                  {/* PulseAI Column */}
                  <div className="col-span-12 sm:col-span-4 flex items-start gap-2.5 sm:px-4 bg-[#fff6f4] sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-[#ff5b37] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="sm:hidden text-[11px] uppercase font-bold text-[#ff5b37] block mb-0.5">
                        PulseAI:
                      </span>
                      <span className="text-xs sm:text-sm text-slate-900 font-bold">
                        {row.pulseAi}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Callout */}
          <div className="p-6 bg-gradient-to-r from-orange-50/80 via-[#fff2ef] to-amber-50/80 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-[#ff5b37]" />
              </div>
              <div>
                <h5 className="text-sm font-extrabold text-slate-900">Net Efficiency Gain: 300% to 500%</h5>
                <p className="text-xs text-slate-600">
                  Stop burning cash on traditional agency retainers. Invest in autonomous performance.
                </p>
              </div>
            </div>
            <a
              href="/get-started"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20"
            >
              Switch to PulseAI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
