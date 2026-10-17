"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceInterest: "AI-Driven Meta & Google Ad Management",
    estimatedBudget: "$3,000 - $7,500 / mo",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccessMsg(
        "Message transmitted successfully! A senior PulseAI Growth Strategist will respond within 2 business hours."
      );
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        serviceInterest: "AI-Driven Meta & Google Ad Management",
        estimatedBudget: "$3,000 - $7,500 / mo",
        message: "",
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative overflow-hidden bg-radial-glow">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Strategy Desk</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Connect with <span className="text-[#ff5b37] italic font-serif">PulseAI Strategists</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Have questions about your advertising pipeline or want an enterprise technical audit? 
              Reach our growth directors directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff5b37]" />
                  <span>Global Operations</span>
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#ff5b37]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                        Direct Inquiries
                      </span>
                      <a href="mailto:growth@pulseai.digital" className="text-slate-900 hover:text-[#ff5b37] transition-colors font-bold">
                        growth@pulseai.digital
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#ff5b37]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                        Phone & Priority Desk
                      </span>
                      <span className="text-slate-900 font-bold">+234 (0) 803 900 1200 / +1 (415) 890-2341</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#ff5b37]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                        Response SLA
                      </span>
                      <span className="text-slate-900 font-bold">Under 2 hours (Mon - Sat, 24/7 Bot Support)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#ff5b37]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                        Headquarters & Hubs
                      </span>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        • Lagos: Victoria Island Tech Hub, Lagos, Nigeria<br />
                        • London: 1 Canada Square, Canary Wharf, London<br />
                        • San Francisco: 548 Market St, San Francisco, CA
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-xs text-slate-700 flex items-center gap-2.5 font-medium">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-[#ff5b37]" />
                    <span>Non-Disclosure & Enterprise Data Privacy guaranteed.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Send a Direct Message</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in your project requirements and we will reply with an initial AI audit.
                </p>

                {successMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Elena Rostova"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (415) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Nova Brands Ltd"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Primary Service Interest
                      </label>
                      <select
                        value={formData.serviceInterest}
                        onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
                      >
                        <option value="AI-Driven Meta & Google Ad Management">
                          AI-Driven Meta & Google Ad Management
                        </option>
                        <option value="AI Content & Social Media Automation">
                          AI Content & Social Media Automation
                        </option>
                        <option value="Local SEO & Google Business Profile Optimization">
                          Local SEO & Google Business Profile Optimization
                        </option>
                        <option value="Conversational AI Lead Capture Chatbots">
                          Conversational AI Lead Capture Chatbots
                        </option>
                        <option value="Full Omnichannel Scale Retainer">
                          Full Omnichannel Scale Retainer
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Estimated Monthly Budget
                      </label>
                      <select
                        value={formData.estimatedBudget}
                        onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
                      >
                        <option value="$1,000 - $3,000 / mo">$1,000 - $3,000 (₦1.25M - ₦3.7M)</option>
                        <option value="$3,000 - $7,500 / mo">$3,000 - $7,500 (₦3.7M - ₦9.3M)</option>
                        <option value="$7,500 - $20,000 / mo">$7,500 - $20,000 (₦9.3M - ₦25M)</option>
                        <option value="$20,000+ / mo (Enterprise)">$20,000+ / mo (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message & Business Challenge *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you are aiming to accomplish (e.g. improve Meta ROAS, expand to new geos, build an AI booking bot)..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Strategy Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
