"use client";

import React from "react";
import { Star, Quote, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function CaseStudies() {
  const caseStudies = [
    {
      company: "Velox Luxury Eyewear",
      industry: "D2C E-commerce",
      headline: "+412% ROAS in 60 Days with Dynamic AI Creative Rotation",
      quote:
        "Before PulseAI, our ad fatigue was crippling us every two weeks. Their generative creative pipeline keeps fresh ad variations running 24/7 without our design team breaking a sweat.",
      author: "Marcus Vance",
      title: "Chief Marketing Officer",
      metrics: [
        { label: "Blended ROAS", value: "5.14x", change: "+412%" },
        { label: "Cost Per Acquisition", value: "$18.40", change: "-54%" },
        { label: "Monthly New Sales", value: "$284,000", change: "+190%" },
      ],
      tag: "Meta Ads + Dynamic Creative",
    },
    {
      company: "Apex Cloud Logistics",
      industry: "B2B Freight & Supply Chain (Lagos & London)",
      headline: "184 Qualified B2B Corporate Leads in First Month via WhatsApp AI",
      quote:
        "The conversational AI bot eliminated our response time delay from 14 hours down to 18 seconds. Decision-makers book strategy meetings while still looking at the pitch.",
      author: "Tunde Bakare",
      title: "Managing Director",
      metrics: [
        { label: "Pipeline Value", value: "$1.45M", change: "+320%" },
        { label: "Lead Qualification", value: "92.8%", change: "Zero Latency" },
        { label: "Cost Per Booked Call", value: "₦38,000", change: "-62%" },
      ],
      tag: "Conversational WhatsApp AI",
    },
    {
      company: "Radiance Aesthetic Medical",
      industry: "Local MedSpa & Healthcare",
      headline: "Ranked #1 on Google Local 3-Pack Across 14 High-Intent Search Terms",
      quote:
        "Our phone has not stopped ringing. PulseAI's local citation sync and automated review response engine completely transformed our local clinic bookings.",
      author: "Dr. Chloe Martin",
      title: "Clinic Founder",
      metrics: [
        { label: "Monthly Patient Inquiries", value: "246", change: "+270%" },
        { label: "Google Maps Views", value: "34,200", change: "+480%" },
        { label: "Organic Revenue", value: "$96,000/mo", change: "+180%" },
      ],
      tag: "Local SEO & Review Automation",
    },
  ];

  return (
    <section id="case-studies" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Proven Growth Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Client Success & <span className="text-[#ff5b37] italic font-serif">Verified Metrics</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            See how forward-thinking brands use PulseAI to outmaneuver competitors, slash acquisition 
            costs, and scale compound revenue.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 hover:border-orange-300 transition-all shadow-lg hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5b37] bg-[#fff2ef] px-2.5 py-1 rounded-full border border-[#fed7cc]">
                    {study.tag}
                  </span>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 block mb-1">
                  {study.company} • {study.industry}
                </span>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ff5b37] transition-colors mb-4 leading-snug">
                  {study.headline}
                </h3>

                {/* Metrics Highlight Box */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                  {study.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="text-center">
                      <span className="text-base sm:text-lg font-black text-slate-900 block font-mono">
                        {m.value}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">{m.label}</span>
                      <span className="text-[10px] font-bold text-emerald-600 block">{m.change}</span>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative pl-6 mb-6">
                  <Quote className="w-4 h-4 text-[#ff5b37] absolute left-0 top-0 opacity-40" />
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &ldquo;{study.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{study.author}</span>
                  <span className="text-[11px] text-slate-500 block">{study.title}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#ff5b37] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
