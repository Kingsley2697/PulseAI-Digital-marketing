"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Send, CheckCircle2, ShieldCheck, Globe, Cpu, Lock } from "lucide-react";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="w-full bg-[#f8f6f2] border-t border-slate-200 text-slate-600 text-sm">
      {/* Top Banner / Trust Bar */}
      <div className="border-b border-slate-200/80 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center p-3">
            <Cpu className="w-6 h-6 text-[#ff5b37] mb-2" />
            <span className="text-slate-900 font-bold">Autonomous ML Core</span>
            <span className="text-xs text-slate-500">Sub-second ad bid execution</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3">
            <ShieldCheck className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-slate-900 font-bold">Verified Enterprise ROI</span>
            <span className="text-xs text-slate-500">Average 3.8x - 5.4x client ROAS</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3">
            <Globe className="w-6 h-6 text-[#ff5b37] mb-2" />
            <span className="text-slate-900 font-bold">Global Billing Matrix</span>
            <span className="text-xs text-slate-500">Flutterwave NGN & Crypto USD</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3">
            <Lock className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-slate-900 font-bold">Bank-Grade Privacy</span>
            <span className="text-xs text-slate-500">SOC-2 & GDPR compliant data</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ff5b37] p-[1.5px] shadow-md shadow-orange-500/20">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#ff5b37]" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                PulseAI <span className="text-[#ff5b37]">Digital</span>
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm max-w-sm">
              We replace sluggish agency bureaucracy with autonomous AI growth engines. 
              Accelerate your revenue, dominate ad networks, and capture high-intent leads 24/7.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium shadow-sm">
                Lagos • London • San Francisco
              </span>
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-4 tracking-wider uppercase">AI Services</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/#services" className="hover:text-[#ff5b37] transition-colors">
                  AI Social & Content Engines
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-[#ff5b37] transition-colors">
                  Local SEO & Maps Dominance
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-[#ff5b37] transition-colors">
                  Predictive Ad Optimization
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-[#ff5b37] transition-colors">
                  Conversational AI Lead Bots
                </Link>
              </li>
              <li>
                <Link href="/#roi-calculator" className="hover:text-[#ff5b37] transition-colors">
                  Interactive ROI Predictor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/get-started" className="hover:text-[#ff5b37] transition-colors">
                  Interactive Onboarding Brief
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#ff5b37] transition-colors">
                  Transparent Pricing & Tiers
                </Link>
              </li>
              <li>
                <Link href="/#comparison" className="hover:text-[#ff5b37] transition-colors">
                  Traditional Agency vs PulseAI
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#ff5b37] transition-colors">
                  Contact & Strategy Call
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter & Real-Time Intelligence */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-4 tracking-wider uppercase">AI Growth Dispatch</h4>
            <p className="text-xs text-slate-500 mb-3">
              Weekly teardowns of real prompt chains, algorithmic ad hacks, and AI conversion playbooks.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Subscribed! Check your inbox for the AI Growth Checklist.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-xs outline-none transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#ff5b37] hover:bg-[#e84a26] rounded-lg text-white text-xs flex items-center justify-center transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">No spam. One-click unsubscribe anytime.</span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PulseAI Digital Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">SLA & Guarantee</span>
            <span className="text-[#ff5b37] font-bold">Production-Grade Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
