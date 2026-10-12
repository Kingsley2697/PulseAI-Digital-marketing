"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, Zap } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#fbfaf8]/90 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5b37] via-[#ff7b5a] to-[#f97316] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-md shadow-orange-500/20">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#ff5b37] fill-[#ff5b37]/20 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              PulseAI <span className="text-[#ff5b37]">Digital</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold -mt-1">
              Autonomous Growth Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/#services" className="hover:text-[#ff5b37] transition-colors">
            Services
          </Link>
          <Link href="/#comparison" className="hover:text-[#ff5b37] transition-colors">
            Why PulseAI
          </Link>
          <Link href="/#roi-calculator" className="hover:text-[#ff5b37] transition-colors flex items-center gap-1.5">
            ROI Calculator
            <span className="text-[10px] bg-[#fff2ef] text-[#ff5b37] px-2 py-0.5 rounded-full font-bold border border-[#fed7cc]">
              Live
            </span>
          </Link>
          <Link href="/#case-studies" className="hover:text-[#ff5b37] transition-colors">
            Results
          </Link>
          <Link href="/#pricing" className="hover:text-[#ff5b37] transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="hover:text-[#ff5b37] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all bg-white shadow-sm"
          >
            Leads Hub
          </Link>
          <Link
            href="/get-started"
            className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] active:bg-[#d03e1d] text-white text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Services Grid
            </Link>
            <Link
              href="/#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Traditional vs AI Agency
            </Link>
            <Link
              href="/#roi-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              ROI Calculator
            </Link>
            <Link
              href="/#case-studies"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Case Studies & Proof
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Pricing & Tiers
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Contact & Support
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#ff5b37] transition-colors"
            >
              Briefs Tracker Hub
            </Link>
          </nav>
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/get-started"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff5b37] text-white font-bold shadow-lg shadow-orange-500/25 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Marketing Brief</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
