"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Star,
  Zap,
  BarChart3,
  CheckCircle2,
  Users,
  ShieldCheck,
  Bot,
  Layers,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-radial-glow">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Subtle Glow Spheres */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#ff5b37]/10 via-[#ff8a65]/8 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#ff5b37] animate-ping" />
              <span className="tracking-wide uppercase text-[11px]">Powerful AI Marketing Tools</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Smarter Marketing <br />
              Bigger <span className="text-[#ff5b37] italic font-serif">Impacts</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              PulseAI gives you tools to engage and convert without the chaos. 
              From automated multi-variant ad campaigns to real-time algorithmic insights, scale your 
              business with autonomous precision.
            </p>

            {/* CTA Button Group matching reference image */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] active:bg-[#d03e1d] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/#roi-calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm transition-all group"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 text-[#ff5b37] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof & Ratings Row */}
            <div className="pt-4 flex items-center gap-4">
              {/* Avatars */}
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm overflow-hidden">
                  <span className="bg-amber-100 text-amber-800 w-full h-full flex items-center justify-center">ER</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm overflow-hidden">
                  <span className="bg-orange-100 text-orange-800 w-full h-full flex items-center justify-center">TB</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm overflow-hidden">
                  <span className="bg-rose-100 text-rose-800 w-full h-full flex items-center justify-center">CM</span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#ff5b37] text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                  +250
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">4.9</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Over 250+ Growth Brands Scaled</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Mockup Layout directly inspired by user reference image */}
          <div className="lg:col-span-6 relative">
            {/* Main Stage Container with Soft Warm Arc Background */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#fff6f4] via-[#fef4f1] to-[#fcfaf8] border border-orange-100/80 p-6 sm:p-10 shadow-2xl shadow-orange-950/5">
              {/* Decorative Arc / Arch Background Graphic */}
              <div className="absolute inset-x-8 top-12 bottom-6 rounded-t-full bg-gradient-to-b from-[#ffeade]/60 to-transparent pointer-events-none -z-0" />

              {/* Floating Element 1: Top Floating Funnel / Brand Icon Badge */}
              <div className="absolute top-4 left-6 z-20">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#ff5b37]">
                  <Zap className="w-5 h-5 fill-[#ff5b37]" />
                </div>
              </div>

              {/* Floating Element 2: Right Control Vertical Bar */}
              <div className="absolute top-6 right-6 z-20 hidden sm:flex flex-col gap-2 p-2 rounded-2xl bg-white shadow-lg border border-slate-100 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-[#fff2ef] text-[#ff5b37] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              {/* Center Content: AI Marketing Console Card */}
              <div className="relative z-10 pt-8 pb-4">
                <div className="max-w-xs mx-auto bg-white rounded-2xl p-4 shadow-xl border border-slate-100 text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 mx-auto flex items-center justify-center mb-2.5 border border-orange-200">
                    <Bot className="w-7 h-7 text-[#ff5b37]" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Autonomous Ad Director</span>
                  <div className="mt-2 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate">Allocating budget: Meta & Google</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  </div>
                </div>

                {/* Sub-Card 1: Avg Traffic / Leads (exact match to reference image) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold">Avg Traffic</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                        +15%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      125,536
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">24 hrs past week</span>
                    {/* Mini SVG Sparkline */}
                    <div className="mt-2.5 h-6 w-full flex items-end gap-1">
                      <div className="bg-orange-200 w-1/6 h-[30%] rounded-t" />
                      <div className="bg-orange-200 w-1/6 h-[50%] rounded-t" />
                      <div className="bg-orange-300 w-1/6 h-[40%] rounded-t" />
                      <div className="bg-orange-300 w-1/6 h-[70%] rounded-t" />
                      <div className="bg-orange-400 w-1/6 h-[60%] rounded-t" />
                      <div className="bg-[#ff5b37] w-1/6 h-[100%] rounded-t" />
                    </div>
                  </div>

                  {/* Sub-Card 2: Arc Gauge Chart "82%" (exact match to reference image) */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold">ROAS Multiplier</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                        +38%
                      </span>
                    </div>
                    {/* Semi-circular gauge mock */}
                    <div className="relative flex flex-col items-center justify-center my-1">
                      <div className="w-24 h-12 overflow-hidden relative">
                        <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 border-t-[#ff5b37] border-r-[#ff5b37] rotate-[-45deg]" />
                      </div>
                      <span className="text-lg font-black text-slate-900 font-mono -mt-3">82%</span>
                    </div>
                    <span className="text-[10px] text-center text-slate-400">Target conversion score</span>
                  </div>
                </div>

                {/* Bottom Floating Pill: #1 AI Integrated Badge (exact match to reference image) */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5b37] text-white text-xs font-bold shadow-md shadow-orange-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>#1 AI Integrated</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#fff2ef] border border-[#fed7cc] flex items-center justify-center text-[#ff5b37]">
                    <Zap className="w-4 h-4 fill-[#ff5b37]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Brand Logos Bar matching reference image */}
        <div className="mt-16 pt-10 border-t border-slate-200/80">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by top fast-growing companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all text-slate-700 text-sm font-bold">
            <span className="flex items-center gap-1.5 tracking-tighter text-lg font-black">
              <span className="w-3 h-3 rounded-full bg-slate-900" /> loom
            </span>
            <span className="tracking-tight text-lg font-extrabold font-serif">
              cadence
            </span>
            <span className="tracking-widest text-sm font-bold uppercase border border-slate-300 px-2 py-0.5 rounded">
              Notion
            </span>
            <span className="text-lg font-black tracking-tighter">
              stripe
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              flutterwave
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
