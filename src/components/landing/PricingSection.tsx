"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly");
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  const plans = [
    {
      id: "starter",
      name: "Starter AI",
      tagline: "Essential autonomous growth for local businesses & emerging brands.",
      priceUsd: billingCycle === "monthly" ? 990 : 790,
      priceNgn: billingCycle === "monthly" ? 1250000 : 1000000,
      popular: false,
      features: [
        "Up to $5,000/mo Ad Spend Managed",
        "Meta Ads OR Google Ads AI Management",
        "Weekly AI Generative Creative Pack (25 assets)",
        "Local SEO & GBP 24/7 Citation Sync",
        "WhatsApp / Web AI Chatbot (up to 500 chats/mo)",
        "Bi-weekly live strategy sprint",
        "Standard Slack / Telegram support",
      ],
      ctaText: "Select Starter Plan",
      cardBg: "bg-white",
      border: "border-slate-200",
    },
    {
      id: "scale",
      name: "Scale Omnichannel",
      tagline: "Full-stack AI marketing engine for high-growth e-com & B2B scaleups.",
      priceUsd: billingCycle === "monthly" ? 2490 : 1990,
      priceNgn: billingCycle === "monthly" ? 3150000 : 2520000,
      popular: true,
      features: [
        "Up to $25,000/mo Ad Spend Managed",
        "Full Meta, Google & TikTok Ads Management",
        "Continuous AI Creative Synthesis (100+ variations/mo)",
        "24/7 Sub-second Algorithmic Budget Reallocation",
        "Omnichannel AI Conversational Agent (Unlimited)",
        "Full CRM Integration (HubSpot, Salesforce, Zapier)",
        "Dedicated Senior AI Strategist & Real-Time Dashboard",
        "14-Day Milestone ROAS Guarantee",
      ],
      ctaText: "Launch Scale Engine",
      cardBg: "bg-gradient-to-b from-[#fff6f4] via-white to-[#fff8f5]",
      border: "border-2 border-[#ff5b37] shadow-2xl shadow-orange-500/15",
    },
    {
      id: "enterprise",
      name: "Enterprise Neural",
      tagline: "Bespoke autonomous infrastructure for corporations & high-volume brands.",
      priceUsd: billingCycle === "monthly" ? 5990 : 4790,
      priceNgn: billingCycle === "monthly" ? 7500000 : 6000000,
      popular: false,
      features: [
        "Unlimited Ad Spend Budget Scaling",
        "Custom Fine-Tuned Proprietary LLM on Your Sales Data",
        "Multi-Brand & Multi-Regional Local SEO Grid",
        "Dedicated Machine Learning Engineer & Ad Ops Lead",
        "Custom Webhook & API Infrastructure Integration",
        "Custom SLA with 1-hour urgent response guarantee",
        "Quarterly On-Site Growth Workshops (Lagos / London / Remote)",
      ],
      ctaText: "Contact Enterprise Desk",
      cardBg: "bg-white",
      border: "border-slate-200",
    },
  ];

  const formatPrice = (usd: number, ngn: number) => {
    if (currency === "USD") {
      return `$${usd.toLocaleString()}`;
    }
    return `₦${ngn.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="py-24 bg-[#fbfaf8] relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Transparent Predictable Retainers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Simple, High-ROI <span className="text-[#ff5b37] italic font-serif">Pricing Tiers</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mb-8">
            No hidden markups. No traditional agency bloat. Pay for autonomous intelligence that scales 
            with your revenue.
          </p>

          {/* Toggle Controls: Billing Cycle & Currency */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Monthly / Quarterly Toggle */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#ff5b37] text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Retainer
              </button>
              <button
                onClick={() => setBillingCycle("quarterly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "quarterly"
                    ? "bg-[#ff5b37] text-white shadow-md shadow-orange-500/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Quarterly Retainer</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  currency === "USD" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("NGN")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  currency === "NGN" ? "bg-slate-100 text-[#ff5b37] font-bold" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                NGN (₦ / Flutterwave)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 border ${plan.border} ${plan.cardBg} flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.01]`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#ff5b37] text-white text-xs font-extrabold shadow-lg shadow-orange-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RECOMMENDED BY FOUNDERS</span>
                  </div>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-500 min-h-[36px]">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900 font-mono">
                      {formatPrice(plan.priceUsd, plan.priceNgn)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <span className="text-[11px] text-[#ff5b37] font-bold mt-1 block">
                    {billingCycle === "quarterly" ? "Billed quarterly (20% discount applied)" : "Billed monthly, cancel anytime"}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-[#ff5b37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href={`/get-started?plan=${encodeURIComponent(plan.name)}&currency=${currency}&billing=${billingCycle}&price=${encodeURIComponent(
                    formatPrice(plan.priceUsd, plan.priceNgn)
                  )}`}
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? "bg-[#ff5b37] hover:bg-[#e84a26] text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02]"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Flutterwave NGN • Crypto USD • Stripe Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
