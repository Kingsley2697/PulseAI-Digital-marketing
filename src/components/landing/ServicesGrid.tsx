"use client";

import React from "react";
import Link from "next/link";
import {
  Share2,
  MapPin,
  Target,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
} from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      id: "content-automation",
      title: "AI Content & Social Media Automation",
      subtitle: "Omnichannel Viral Scaling",
      description:
        "Autonomous multi-format content engines that synthesize high-engagement copy, carousel scripts, short-form video hooks, and infographics aligned to brand voice.",
      icon: Share2,
      accentColor: "from-[#ff5b37] to-[#f97316]",
      bgSoft: "bg-[#fff2ef]",
      borderColor: "border-orange-100",
      features: [
        "Dynamic multi-platform posting (LinkedIn, Instagram, X, TikTok)",
        "AI trend-surfer: injects real-time viral narrative into daily posts",
        "Visual & thumbnail generation with brand asset consistency",
        "Automated hashtag clustering and comment engagement booster",
      ],
      metrics: "300% increase in organic reach with 85% time saved",
    },
    {
      id: "local-seo",
      title: "Local SEO & Google Business Optimization",
      subtitle: "Map Pack & Search Dominance",
      description:
        "Dominate local 'near me' search queries. Our AI monitors local ranking signals, synchronizes 150+ citation networks, and crafts authentic, sentiment-matched review replies.",
      icon: MapPin,
      accentColor: "from-amber-500 to-orange-500",
      bgSoft: "bg-amber-50",
      borderColor: "border-amber-100",
      features: [
        "Google Business Profile 24/7 AI geo-grid rank tracker",
        "Automated sentiment-aware customer review response generator",
        "Local schema markup and structured data injection",
        "Citations syndication across 150+ directories and Maps APIs",
      ],
      metrics: "#1 - #3 Local 3-Pack rankings in 45-60 days average",
    },
    {
      id: "ad-management",
      title: "AI-Driven Meta & Google Ad Management",
      subtitle: "Predictive ROAS & Autonomous Bidding",
      description:
        "Stop guessing on ads. Machine learning algorithms reallocate daily budgets in milliseconds, test hundreds of micro-audiences, and scale winning creatives autonomously.",
      icon: Target,
      accentColor: "from-[#ff5b37] to-[#e04a28]",
      bgSoft: "bg-[#fff2ef]",
      borderColor: "border-orange-200",
      features: [
        "Sub-second algorithmic budget shifting to winning ad sets",
        "Predictive creative synthesis: 50+ headline/hook combinations",
        "First-party server-side Conversions API (CAPI) pixel tracking",
        "Automated fatigue detection & instant creative refreshes",
      ],
      metrics: "Average 4.2x to 5.8x blended ROAS across $14M+ spend",
    },
    {
      id: "chatbots",
      title: "Conversational AI Lead Capture Chatbots",
      subtitle: "24/7 AI Web Conversion Agents",
      description:
        "Human-grade conversational agents trained on your proprietary sales methodology. They qualify leads in under 30 seconds, handle objections, and book meetings directly into your calendar.",
      icon: Bot,
      accentColor: "from-emerald-500 to-teal-600",
      bgSoft: "bg-emerald-50",
      borderColor: "border-emerald-100",
      features: [
        "Native Instagram DM and Website widget integrations",
        "Automated CRM sync with HubSpot, Salesforce, and Google Sheets",
        "Intelligent calendar booking (Calendly, Cal.com, Google Calendar)",
        "Zero latency responses with objection-handling guardrails",
      ],
      metrics: "94% lead qualification rate with zero human bottleneck",
    },
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Service Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Four Core <span className="text-[#ff5b37] italic font-serif">Growth Modules</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Deploy full-stack automated marketing operations designed to lower customer acquisition costs 
            and compound revenue predictably.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl relative group flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${svc.accentColor} p-[1.5px] shadow-md shadow-orange-500/20`}
                      >
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#ff5b37]" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5b37] block">
                          Module 0{idx + 1} • {svc.subtitle}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#ff5b37] transition-colors">
                          {svc.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {svc.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2.5 mb-6">
                    {svc.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#ff5b37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Highlight Bar */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ff5b37]" />
                    <span className="text-xs font-bold text-slate-800">{svc.metrics}</span>
                  </div>
                  <Link
                    href={`/get-started?service=${encodeURIComponent(svc.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5b37] hover:text-[#e04a28] transition-colors group/link"
                  >
                    <span>Configure in Brief</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl p-6 sm:p-8 border border-orange-200/80 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#fff3f0] via-[#fef6f3] to-[#fff8f5] shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5b37] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Need a Unified Multi-Module Growth Stack?</h4>
              <p className="text-xs text-slate-600">
                Our Scale and Enterprise tiers interconnect all four modules into a unified autonomous pipeline.
              </p>
            </div>
          </div>
          <Link
            href="/get-started"
            className="px-6 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-lg shadow-orange-500/20"
          >
            Build Custom AI Stack
          </Link>
        </div>
      </div>
    </section>
  );
}
