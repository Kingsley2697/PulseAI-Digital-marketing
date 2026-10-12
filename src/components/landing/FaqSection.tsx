"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does PulseAI differ from traditional digital marketing agencies?",
      a: "Traditional agencies depend on manual labor, bloated meetings, and bi-weekly manual ad tweaks. PulseAI deploys autonomous machine learning models that monitor campaign data 24/7, reallocating ad spend across channels within milliseconds and continuously synthesizing high-converting creative variants.",
    },
    {
      q: "How quickly do we see measurable ROI after submitting our brief?",
      a: "Our onboarding is completed in under 72 hours. Once your creative models and pixel attribution are calibrated, initial algorithmic testing takes 7 to 10 days, with predictable compounding returns visible between days 14 and 30.",
    },
    {
      q: "Can I pay in Nigerian Naira (NGN) or Crypto (USDT/BTC)?",
      a: "Yes! We natively support Flutterwave for instant bank transfers and cards in Nigerian Naira (NGN) and across Africa. For international corporate and global clients, we support automated Crypto gateways (USDT TRC-20/ERC-20, BTC, ETH) as well as USD wire invoices.",
    },
    {
      q: "Does AI completely replace human strategy?",
      a: "No. Our methodology combines bleeding-edge AI models with senior human growth directors. AI handles high-frequency tasks—sub-second bid adjustments, multi-variant copywriting, 24/7 lead bot dialogues—while our veteran strategists guide high-level creative direction and business positioning.",
    },
    {
      q: "What happens after I complete the Onboarding Brief (/get-started)?",
      a: "Your submission immediately triggers an automated workspace setup in our system. You will receive an instant confirmation via email/WhatsApp, your dedicated AI campaign parameters will be drafted, and a Senior Strategist will schedule your 20-minute kickoff sprint.",
    },
  ];

  return (
    <section className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked <span className="text-[#ff5b37] italic font-serif">Questions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about our autonomous AI workflows, billing, and guarantee.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#ff5b37] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#fffdfc]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-3xl bg-[#fff2ef] border border-[#fed7cc] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff5b37] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Have a specific question about your niche?</h4>
              <p className="text-xs text-slate-600">Our senior team is available to review your goals.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold border border-slate-200 shadow-sm transition-all shrink-0"
          >
            Ask a Growth Strategist
          </Link>
        </div>
      </div>
    </section>
  );
}
