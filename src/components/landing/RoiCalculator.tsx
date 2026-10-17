"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, Sparkles, TrendingUp, Users, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function RoiCalculator() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [monthlyBudget, setMonthlyBudget] = useState<number>(3500);
  const [currentRevenue, setCurrentRevenue] = useState<number>(25000);
  const [industry, setIndustry] = useState<"ecommerce" | "b2b" | "local" | "realestate">("b2b");

  // Multipliers by industry
  const industryProfiles = {
    b2b: {
      name: "B2B SaaS / High Ticket",
      cpl: currency === "USD" ? 42 : 45000,
      closeRate: 0.12,
      avgDealValue: currency === "USD" ? 2800 : 3500000,
      roasMultiplier: 4.8,
    },
    ecommerce: {
      name: "E-commerce & D2C Brands",
      cpl: currency === "USD" ? 18 : 19000,
      closeRate: 0.28,
      avgDealValue: currency === "USD" ? 120 : 150000,
      roasMultiplier: 5.2,
    },
    local: {
      name: "Local Services & Clinics / MedSpa",
      cpl: currency === "USD" ? 28 : 32000,
      closeRate: 0.22,
      avgDealValue: currency === "USD" ? 750 : 950000,
      roasMultiplier: 4.4,
    },
    realestate: {
      name: "Real Estate & Developers",
      cpl: currency === "USD" ? 65 : 75000,
      closeRate: 0.08,
      avgDealValue: currency === "USD" ? 8500 : 11000000,
      roasMultiplier: 5.9,
    },
  };

  const activeProfile = industryProfiles[industry];

  // Calculations
  const calculatedLeads = Math.round(monthlyBudget / activeProfile.cpl);
  const calculatedSales = Math.round(calculatedLeads * activeProfile.closeRate);
  const projectedRevenueLift = Math.round(monthlyBudget * activeProfile.roasMultiplier);
  const netProfitLift = Math.round(projectedRevenueLift - monthlyBudget);

  const formatCurrency = (val: number) => {
    if (currency === "USD") {
      return `$${val.toLocaleString()}`;
    }
    return `₦${val.toLocaleString()}`;
  };

  return (
    <section id="roi-calculator" className="py-24 bg-[#fbfaf8] relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Profit Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Calculate Your <span className="text-[#ff5b37] italic font-serif">Growth Multiplier</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Use your monthly budget and target industry to explore planning estimates for leads and revenue.
            Results are directional and are refined during the strategy review.
          </p>

          {/* Currency Toggle */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => {
                setCurrency("USD");
                setMonthlyBudget(3500);
                setCurrentRevenue(25000);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-[#ff5b37] text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              USD ($ International)
            </button>
            <button
              onClick={() => {
                setCurrency("NGN");
                setMonthlyBudget(4500000);
                setCurrentRevenue(35000000);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === "NGN"
                  ? "bg-[#ff5b37] text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              NGN (₦ Nigeria / Flutterwave)
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff5b37]" />
                <span>Campaign Parameters</span>
              </h3>

              {/* Industry Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Your Business Niche
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["b2b", "ecommerce", "local", "realestate"] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setIndustry(key)}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                        industry === key
                          ? "bg-[#fff2ef] border-[#ff5b37] text-[#ff5b37] shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      {industryProfiles[key].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Ad/Marketing Budget Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Monthly Marketing Budget
                  </label>
                  <span className="text-lg font-black text-[#ff5b37] font-mono">
                    {formatCurrency(monthlyBudget)}
                  </span>
                </div>
                <input
                  type="range"
                  min={currency === "USD" ? 1000 : 1000000}
                  max={currency === "USD" ? 30000 : 40000000}
                  step={currency === "USD" ? 500 : 500000}
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff5b37]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>{formatCurrency(currency === "USD" ? 1000 : 1000000)}</span>
                  <span>{formatCurrency(currency === "USD" ? 15000 : 20000000)}</span>
                  <span>{formatCurrency(currency === "USD" ? 30000 : 40000000)}+</span>
                </div>
              </div>

              {/* Current Monthly Revenue Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current Monthly Revenue
                  </label>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {formatCurrency(currentRevenue)}
                  </span>
                </div>
                <input
                  type="range"
                  min={currency === "USD" ? 5000 : 5000000}
                  max={currency === "USD" ? 150000 : 150000000}
                  step={currency === "USD" ? 5000 : 5000000}
                  value={currentRevenue}
                  onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>{formatCurrency(currency === "USD" ? 5000 : 5000000)}</span>
                  <span>{formatCurrency(currency === "USD" ? 75000 : 75000000)}</span>
                  <span>{formatCurrency(currency === "USD" ? 150000 : 150000000)}+</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#ff5b37] shrink-0" />
              <span>
                This is a planning tool, not a performance guarantee. Actual results depend on your offer,
                market, creative, tracking, and sales process.
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Projected Results Card */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#fff6f4] via-white to-[#fff8f5] p-6 sm:p-8 border-2 border-orange-200 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Top Accent Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-orange-100">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#ff5b37]">
                  Projected 90-Day Impact
                </span>
                <h4 className="text-xl font-extrabold text-slate-900">Estimated AI Performance Lift</h4>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#ff5b37] text-white text-xs font-bold shadow-md shadow-orange-500/20">
                {activeProfile.roasMultiplier}x Target ROAS
              </div>
            </div>

            {/* Big Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 py-8">
              {/* Metric 1: Projected Revenue Lift */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Est. Monthly Revenue Lift</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  +{formatCurrency(projectedRevenueLift)}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Net growth: {formatCurrency(netProfitLift)} / mo
                </span>
              </div>

              {/* Metric 2: Projected Leads */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
                  <Users className="w-4 h-4 text-[#ff5b37]" />
                  <span>Monthly Qualified Leads</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#ff5b37] font-mono">
                  ~{calculatedLeads}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Estimated {calculatedSales} closed deals
                </span>
              </div>

              {/* Metric 3: Target Cost Per Lead */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Projected CPL</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {formatCurrency(activeProfile.cpl)}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Planning assumption for this estimate
                </span>
              </div>

              {/* Metric 4: Lead Qualification Speed */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>AI Response Latency</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  &lt; 30 sec
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Instant AI qualification
                </span>
              </div>
            </div>

            {/* Direct Action linking to Brief generator */}
            <div className="pt-4 border-t border-orange-100">
              <Link
                href={`/get-started?budget=${encodeURIComponent(formatCurrency(monthlyBudget))}&industry=${industry}`}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>Use These Inputs in My Brief</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-slate-500 mt-2">
                Your final scope, pricing, and targets are confirmed before work begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
